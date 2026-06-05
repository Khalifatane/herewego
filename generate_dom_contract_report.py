import json
from pathlib import Path

path = Path('audit_output.json')
data = json.loads(path.read_text(encoding='utf-8'))

report = []
report.append('# DOM Contract Audit Report')
report.append('')
report.append('## Executive Summary')
report.append('')
report.append("- HTML files scanned: **{}**".format(data.get('html_files')))
report.append("- JS/TS files scanned: **{}**".format(data.get('js_files')))
report.append("- DOM selector references found: **{}**".format(data.get('selectors')))
report.append("- Missing ID selectors: **{}**".format(data.get('missing_ids')))
report.append("- Missing data-* selectors: **{}**".format(data.get('missing_data')))
report.append("- Missing other selectors: **{}**".format(data.get('missing_others')))
report.append("- Dead script candidates: **{}**".format(data.get('dead_scripts')))
report.append('')
report.append('> This audit is based on static HTML and JS/TS source matching. It flags selectors that appear in JavaScript but were not found in the scanned HTML corpus.')
report.append('')
report.append('## Missing ID selectors (exact)')
report.append('')
report.append('| File | Line | Type | Selector | Example code |')
report.append('|---|---|---|---|---|')
for item in data.get('missing_ids_list', []):
    file = item['file'].replace('\\', '/')
    line = item['line']
    typ = item['type']
    selector = item['selector']
    code = item.get('line_text', '').replace('|', '\\|')
    report.append(f'| {file} | {line} | {typ} | `{selector}` | `{code}` |')

report.append('')
report.append('## Dead script candidates')
report.append('')
report.append('These scripts had every scanned selector reference missing from the HTML corpus, making them strong candidates for dead or page-specific assets loaded on the wrong pages.')
report.append('')
report.append('| File | Total selectors | Found | Missing |')
report.append('|---|---|---|---|')
for i, item in enumerate(data.get('dead_scripts_list', []), 1):
    if isinstance(item, list) and len(item) == 2:
        file, stats = item
        file = file.replace('\\', '/')
        report.append("| {} | {} | {} | {} |".format(file, stats.get('total'), stats.get('found'), stats.get('missing')))
    else:
        report.append("| {} | | | |".format(item))

report.append('')
report.append('## Representative missing data-* selectors')
report.append('')
report.append('| File | Line | Selector | Code |')
report.append('|---|---|---|---|')
for item in data.get('missing_data_list', [])[:50]:
    file = item['file'].replace('\\', '/')
    line = item['line']
    selector = item['selector']
    code = item.get('line_text', '').replace('|', '\\|')
    report.append("| {} | {} | `data-{} ` | `{}` |".format(file, line, selector, code))
if len(data.get('missing_data_list', [])) > 50:
    report.append("| ... | | **+{} more entries** | |".format(len(data.get('missing_data_list')) - 50))

report.append('')
report.append('## Representative missing CSS/query selectors')
report.append('')
report.append('| File | Line | Type | Selector | Code |')
report.append('|---|---|---|---|---|')
for item in data.get('missing_others_list', [])[:50]:
    file = item['file'].replace('\\', '/')
    line = item['line']
    typ = item['type']
    selector = item['selector']
    code = item.get('line_text', '').replace('|', '\\|')
    report.append("| {} | {} | {} | `{}` | `{}` |".format(file, line, typ, selector, code))
if len(data.get('missing_others_list', [])) > 50:
    report.append("| ... | | | **+{} more entries** | |".format(len(data.get('missing_others_list')) - 50))

report.append('')
report.append('## Observations & runtime risk')
report.append('')
report.append('- `getElementById(...)` missing selectors are the highest-risk category, especially when the returned node is assigned and later dereferenced.')
report.append('- Some ID checks appear to be used defensively (`if (document.getElementById(...)`) and are lower immediate crash risk.')
report.append('- The two build artifacts `header-logout-handler-production.js` and `header-standardizer.js` appear in both `apps/admin` and `apps/storefront`, suggesting shared header/runtime code loaded across multiple pages.')
report.append('- `dead_scripts_list` entries indicate scripts whose selectors are entirely absent from the scanned HTML set. These are strong candidates for asset cleanup or page-specific script isolation.')
report.append('- Missing selectors in compiled bundles such as `client_default_72394f1.js` likely reflect vendor/runtime code that may only execute on pages not included in the static HTML scan or that depend on dynamically-rendered DOM.')
report.append('- Missing data attributes like `data-cart-quantity`, `data-newsletter-bound`, and `data-review-summary-bound` are common in `header-standardizer.js`; if these scripts run on pages without those elements, they may silently fail or skip functionality.')

report.append('## Page migration and cleanup recommendations')
report.append('')
report.append('- Verify whether the HTML corpus is complete for the app templates that actually load the flagged scripts, especially store and admin page shells.')
report.append('- If `apps/*/public/js/header-logout-handler-production.js` and `header-standardizer.js` are loaded globally, move them behind page-specific entry points or add guard conditions before DOM traversal.')
report.append('- Remove or defer `dead_scripts_list` assets that are never matched by any HTML page and/or replace them with explicit page-specific loading logic.')
report.append('- Audit `data-*` attribute usage in `apps/admin/public/js/header-standardizer.js` and the HS helper scripts; ensure data attribute presence checks are in place before access.')
report.append('- For CSS/query selector mismatches, focus first on `document.querySelector(".crisp-client")`, `meta[property=csp-nonce]`, `head meta[name="viewport"]`, and `.cc-*` selectors, because those are repeated in runtime bundles with no HTML hits.')

Path = Path('dom_audit_report.md')
Path.write_text('\n'.join(report), encoding='utf-8')
print(f'Wrote {Path.resolve()}')
