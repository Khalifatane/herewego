import re
import pathlib
import json
import difflib
root = pathlib.Path(r'c:/Users/diopk/Downloads/therewego')
html_files = sorted([p for p in root.rglob('*.html') if ('apps/admin/' in str(p).replace('\\','/') or 'apps/storefront/' in str(p).replace('\\','/'))])
js_files = sorted([p for p in root.rglob('*.*') if p.suffix in {'.js','.ts'} and (('apps/admin/' in str(p).replace('\\','/') or 'apps/storefront/' in str(p).replace('\\','/') or 'packages/' in str(p).replace('\\','/')))])

id_set=set()
class_set=set()
data_set=set()
html_texts={}
for p in html_files:
    text = p.read_text(encoding='utf-8', errors='ignore')
    html_texts[p] = text
    for m in re.finditer(r'id\s*=\s*(["\'])(.*?)\1', text, re.I):
        id_set.add(m.group(2))
    for m in re.finditer(r'class\s*=\s*(["\'])(.*?)\1', text, re.I):
        for tok in re.split(r'\s+', m.group(2).strip()):
            if tok:
                class_set.add(tok)
    for m in re.finditer(r'\b(data-[a-zA-Z0-9:-]+)(?:\s*=|\s|>)', text):
        data_set.add(m.group(1))

regexes=[
    (r'document\.getElementById\(\s*(["\'])(.*?)\1\s*\)', 'getElementById'),
    (r'document\.querySelector(All)?\(\s*(["\'])(.*?)\2\s*\)', 'document.querySelector'),
    (r'\b([\w$]+)\.querySelector(All)?\(\s*(["\'])(.*?)\3\s*\)', 'element.querySelector'),
    (r'\b([\w$]+)\.closest\(\s*(["\'])(.*?)\2\s*\)', 'closest'),
]
risk_patterns=[
    r'document\.querySelector(All)?\([^)]*\)\s*\.\s*addEventListener',
    r'document\.getElementById\([^)]*\)\s*\.\s*addEventListener',
    r'\.querySelector(All)?\([^)]*\)\s*\.\s*addEventListener',
    r'\.closest\([^)]*\)\s*\.\s*addEventListener',
    r'document\.querySelector\([^)]*\)\s*\.\s*classList',
    r'document\.getElementById\([^)]*\)\s*\.\s*classList',
    r'\.querySelector(All)?\([^)]*\)\s*\.\s*classList',
]
selector_items=[]
for p in js_files:
    txt = p.read_text(encoding='utf-8', errors='ignore')
    for i,line in enumerate(txt.splitlines(),1):
        for pat,name in regexes:
            for m in re.finditer(pat, line):
                if name=='document.querySelector':
                    sel=m.group(3)
                elif name=='element.querySelector':
                    sel=m.group(4)
                elif name=='getElementById':
                    sel=m.group(2)
                elif name=='closest':
                    sel=m.group(3)
                else:
                    sel=None
                selector_items.append({'file':str(p),'line':i,'type':name,'selector':sel,'line_text':line.strip()})
        for m in re.finditer(r'dataset\.([A-Za-z0-9_]+)', line):
            selector_items.append({'file':str(p),'line':i,'type':'dataset','selector':m.group(1),'line_text':line.strip()})
        for rp in risk_patterns:
            if re.search(rp, line):
                selector_items.append({'file':str(p),'line':i,'type':'runtime-risk','selector':None,'line_text':line.strip()})
seen=set(); dedup=[]
for item in selector_items:
    key=(item['file'],item['line'],item['type'],item['selector'],item['line_text'])
    if key not in seen:
        seen.add(key); dedup.append(item)
selector_items=dedup
missing_ids=[]
missing_data=[]
missing_others=[]
file_stats={}
for item in selector_items:
    f=item['file']; file_stats.setdefault(f,{'total':0,'found':0,'missing':0})
    if item['type']=='getElementById':
        file_stats[f]['total']+=1
        if item['selector'] not in id_set:
            missing_ids.append(item); file_stats[f]['missing']+=1
        else:
            file_stats[f]['found']+=1
    elif item['type'] in ('document.querySelector','element.querySelector','closest'):
        file_stats[f]['total']+=1
        sel=item['selector']; found=False
        if sel is None:
            found=False
        elif sel.startswith('#'):
            found = sel[1:] in id_set
        elif sel.startswith('.'):
            found = sel[1:] in class_set
        elif sel.startswith('[data-'):
            attr = re.match(r'\[\s*(data-[a-zA-Z0-9:-]+)', sel)
            found = bool(attr and attr.group(1) in data_set)
        else:
            found = any(sel in html_text for html_text in html_texts.values())
        if not found:
            missing_others.append(item); file_stats[f]['missing']+=1
        else:
            file_stats[f]['found']+=1
    elif item['type']=='dataset':
        file_stats[f]['total']+=1
        attr='data-'+re.sub(r'([A-Z])', lambda m:'-'+m.group(1).lower(), item['selector'])
        if attr not in data_set:
            missing_data.append(item); file_stats[f]['missing']+=1
        else:
            file_stats[f]['found']+=1
dead_scripts=[(f,s) for f,s in file_stats.items() if s['total']>0 and s['found']==0]
print(json.dumps({
    'html_files':len(html_files),'js_files':len(js_files),'selectors':len(selector_items),
    'missing_ids':len(missing_ids),'missing_data':len(missing_data),'missing_others':len(missing_others),'dead_scripts':len(dead_scripts),
    'missing_ids_list':missing_ids[:40],'missing_others_list':missing_others[:40],'missing_data_list':missing_data[:40],'dead_scripts_list':dead_scripts[:40]
}, indent=2))
