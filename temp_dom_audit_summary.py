import json
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

path = Path('audit_output.json')
data = json.loads(path.read_text(encoding='utf-8'))

print('Summary:')
for k in ['html_files', 'js_files', 'selectors', 'missing_ids', 'missing_data', 'missing_others', 'dead_scripts']:
    print(f'{k}: {data.get(k)}')


def show_list(name, limit=20):
    items = data.get(name, [])
    if not isinstance(items, list):
        print(f'\n{name}: not a list, type={type(items).__name__}')
        return
    print(f'\n{name} count={len(items)}')
    for i, item in enumerate(items[:limit], 1):
        file = item.get('file', '<unknown>')
        line = item.get('line', '?')
        typ = item.get('type', '<type>')
        selector = item.get('selector', '<selector>')
        print(f'{i}. {file}:{line} [{typ}] {selector}')
        txt = item.get('line_text')
        if txt:
            safe_txt = txt.strip().encode('utf-8', errors='replace').decode('utf-8')
            print('   ', safe_txt)
    if len(items) > limit:
        print(f'   ... +{len(items) - limit} more')

show_list('missing_ids_list', 50)
show_list('missing_data_list', 50)
show_list('missing_others_list', 50)

# dead_scripts_list entries are [file, stats]
print('\ndead_scripts_list count=', len(data.get('dead_scripts_list', [])))
for i, item in enumerate(data.get('dead_scripts_list', [])[:50], 1):
    if isinstance(item, list) and len(item) == 2:
        file, stats = item
        print(f'{i}. {file} -> {stats}')
    else:
        print(f'{i}. {repr(item)[:200]}')
