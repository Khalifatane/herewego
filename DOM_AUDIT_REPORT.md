# DOM Contract Audit Report

## Executive Summary

- HTML files scanned: **42**
- JS/TS files scanned: **133**
- DOM selector references found: **1732**
- Missing ID selectors: **22**
- Missing data-* selectors: **240**
- Missing other selectors: **798**
- Dead script candidates: **14**

> This audit is based on static HTML and JS/TS source matching. It flags selectors that appear in JavaScript but were not found in the scanned HTML corpus.

## Missing ID selectors (exact)

| File | Line | Type | Selector | Example code |
|---|---|---|---|---|
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-logout-handler-production.js | 23 | getElementById | `hs-pro-logout-btn` | `const logoutBtn = document.getElementById('hs-pro-logout-btn');` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-logout-handler-production.js | 47 | getElementById | `hs-pro-logout-btn` | `const logoutBtn = document.getElementById('hs-pro-logout-btn');` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-logout-handler-production.js | 131 | getElementById | `hs-pro-account-dropdown` | `const accountDropdown = document.getElementById('hs-pro-account-dropdown');` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-logout-handler-production.js | 178 | getElementById | `hs-pro-logout-btn` | `const btn = document.getElementById('hs-pro-logout-btn');` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-logout-handler-production.js | 188 | getElementById | `hs-pro-logout-btn` | `const btn = document.getElementById('hs-pro-logout-btn');` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-standardizer.js | 275 | getElementById | `codex-standardized-header-styles` | `if (document.getElementById("codex-standardized-header-styles")) return;` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-standardizer.js | 1114 | getElementById | `hs-pro-shchfad1` | `const address1 = document.getElementById("hs-pro-shchfad1");` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-standardizer.js | 1115 | getElementById | `hs-pro-shchfad2` | `const address2 = document.getElementById("hs-pro-shchfad2");` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-standardizer.js | 1117 | getElementById | `hs-pro-shchfst` | `const state = document.getElementById("hs-pro-shchfst");` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-standardizer.js | 1118 | getElementById | `hs-pro-shchfzc` | `const zipCode = document.getElementById("hs-pro-shchfzc");` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-standardizer.js | 1910 | getElementById | `hs-pro-shtofsz` | `const zipInput = document.getElementById("hs-pro-shtofsz");` |
| c:/Users/diopk/Downloads/therewego/apps/admin/src/page-scripts/products-page.js | 270 | getElementById | `products-resultats-count` | `document.getElementById("products-resultats-count") \|\|` |
| c:/Users/diopk/Downloads/therewego/apps/storefront/public/js/header-logout-handler-production.js | 23 | getElementById | `hs-pro-logout-btn` | `const logoutBtn = document.getElementById('hs-pro-logout-btn');` |
| c:/Users/diopk/Downloads/therewego/apps/storefront/public/js/header-logout-handler-production.js | 47 | getElementById | `hs-pro-logout-btn` | `const logoutBtn = document.getElementById('hs-pro-logout-btn');` |
| c:/Users/diopk/Downloads/therewego/apps/storefront/public/js/header-logout-handler-production.js | 131 | getElementById | `hs-pro-account-dropdown` | `const accountDropdown = document.getElementById('hs-pro-account-dropdown');` |
| c:/Users/diopk/Downloads/therewego/apps/storefront/public/js/header-logout-handler-production.js | 178 | getElementById | `hs-pro-logout-btn` | `const btn = document.getElementById('hs-pro-logout-btn');` |
| c:/Users/diopk/Downloads/therewego/apps/storefront/public/js/header-logout-handler-production.js | 188 | getElementById | `hs-pro-logout-btn` | `const btn = document.getElementById('hs-pro-logout-btn');` |
| c:/Users/diopk/Downloads/therewego/apps/storefront/public/js/header-standardizer.js | 507 | getElementById | `codex-standardized-header-styles` | `if (document.getElementById("codex-standardized-header-styles")) return;` |
| c:/Users/diopk/Downloads/therewego/apps/storefront/public/js/header-standardizer.js | 1652 | getElementById | `hs-pro-shchfad1` | `const address1 = document.getElementById("hs-pro-shchfad1");` |
| c:/Users/diopk/Downloads/therewego/apps/storefront/public/js/header-standardizer.js | 1653 | getElementById | `hs-pro-shchfad2` | `const address2 = document.getElementById("hs-pro-shchfad2");` |
| c:/Users/diopk/Downloads/therewego/apps/storefront/public/js/header-standardizer.js | 1655 | getElementById | `hs-pro-shchfst` | `const state = document.getElementById("hs-pro-shchfst");` |
| c:/Users/diopk/Downloads/therewego/apps/storefront/public/js/header-standardizer.js | 1656 | getElementById | `hs-pro-shchfzc` | `const zipCode = document.getElementById("hs-pro-shchfzc");` |

## Dead script candidates

These scripts had every scanned selector reference missing from the HTML corpus, making them strong candidates for dead or page-specific assets loaded on the wrong pages.

| File | Total selectors | Found | Missing |
|---|---|---|---|
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/app.js | 1 | 0 | 1 |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-logout-handler-production.js | 5 | 0 | 5 |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/hs-docs-scrollspy.js | 3 | 0 | 3 |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/hs-markup-helpers.js | 1 | 0 | 1 |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/l.js | 2 | 0 | 2 |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/layout-loader.js | 3 | 0 | 3 |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/prism.js | 2 | 0 | 2 |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/preline.co/pro/primary-assets/js/app.js | 1 | 0 | 1 |
| c:/Users/diopk/Downloads/therewego/apps/storefront/public/js/app.js | 1 | 0 | 1 |
| c:/Users/diopk/Downloads/therewego/apps/storefront/public/js/header-logout-handler-production.js | 5 | 0 | 5 |
| c:/Users/diopk/Downloads/therewego/apps/storefront/public/js/hs-docs-scrollspy.js | 3 | 0 | 3 |
| c:/Users/diopk/Downloads/therewego/apps/storefront/public/js/hs-markup-helpers.js | 1 | 0 | 1 |
| c:/Users/diopk/Downloads/therewego/apps/storefront/public/js/l.js | 2 | 0 | 2 |
| c:/Users/diopk/Downloads/therewego/apps/storefront/public/js/prism.js | 2 | 0 | 2 |

## Representative missing data-* selectors

| File | Line | Selector | Code |
|---|---|---|---|
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/app.js | 42 | `data-download ` | `const name = el.dataset.download;` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-standardizer.js | 479 | `data-cartQuantityBound ` | `if (select.dataset.cartQuantityBound === "true") return;` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-standardizer.js | 480 | `data-cartQuantityBound ` | `select.dataset.cartQuantityBound = "true";` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-standardizer.js | 494 | `data-cartRemoveBound ` | `if (button.dataset.cartRemoveBound === "true") return;` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-standardizer.js | 495 | `data-cartRemoveBound ` | `button.dataset.cartRemoveBound = "true";` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-standardizer.js | 622 | `data-newsletterBound ` | `if (!input \|\| !button \|\| button.dataset.newsletterBound === "true") return;` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-standardizer.js | 624 | `data-newsletterBound ` | `button.dataset.newsletterBound = "true";` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-standardizer.js | 704 | `data-favoriteRemoveBound ` | `if (button.dataset.favoriteRemoveBound === "true") return;` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-standardizer.js | 705 | `data-favoriteRemoveBound ` | `button.dataset.favoriteRemoveBound = "true";` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-standardizer.js | 756 | `data-cartOverlayRemoveBound ` | `if (button.dataset.cartOverlayRemoveBound === "true") return;` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-standardizer.js | 757 | `data-cartOverlayRemoveBound ` | `button.dataset.cartOverlayRemoveBound = "true";` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-standardizer.js | 979 | `data-sanityRendered ` | `if (!carousel \|\| carousel.dataset.sanityRendered === "true") return;` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-standardizer.js | 999 | `data-sanityRendered ` | `carousel.dataset.sanityRendered = "true";` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-standardizer.js | 1035 | `data-browseBound ` | `if (browseProductsLink && browseProductsLink.dataset.browseBound !== "true") {` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-standardizer.js | 1036 | `data-browseBound ` | `browseProductsLink.dataset.browseBound = "true";` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-standardizer.js | 1394 | `data-reviewSummaryBound ` | `if (!field \|\| field.dataset.reviewSummaryBound === "true") return;` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-standardizer.js | 1395 | `data-reviewSummaryBound ` | `field.dataset.reviewSummaryBound = "true";` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-standardizer.js | 1419 | `data-checkoutSummaryBound ` | `if (!field \|\| field.dataset.checkoutSummaryBound === "true") return;` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-standardizer.js | 1420 | `data-checkoutSummaryBound ` | `field.dataset.checkoutSummaryBound = "true";` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-standardizer.js | 1433 | `data-reviewShippingBound ` | `if (editTrigger.dataset.reviewShippingBound === "true") return;` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-standardizer.js | 1434 | `data-reviewShippingBound ` | `editTrigger.dataset.reviewShippingBound = "true";` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-standardizer.js | 1440 | `data-reviewShippingSaveBound ` | `if (!saveButton \|\| saveButton.dataset.reviewShippingSaveBound === "true") return;` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-standardizer.js | 1442 | `data-reviewShippingSaveBound ` | `saveButton.dataset.reviewShippingSaveBound = "true";` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-standardizer.js | 1459 | `data-checkoutBound ` | `if (!continueLink \|\| continueLink.dataset.checkoutBound === "true") return;` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-standardizer.js | 1461 | `data-checkoutBound ` | `continueLink.dataset.checkoutBound = "true";` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-standardizer.js | 1769 | `data-reviewBound ` | `if (!continueLink \|\| continueLink.dataset.reviewBound === "true") return;` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-standardizer.js | 1878 | `data-reviewBound ` | `continueLink.dataset.reviewBound = "true";` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-standardizer.js | 1887 | `data-instantReviewBound ` | `if (!paymentInput \|\| paymentInput.dataset.instantReviewBound === "true") return;` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-standardizer.js | 1889 | `data-instantReviewBound ` | `paymentInput.dataset.instantReviewBound = "true";` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-standardizer.js | 1902 | `data-lookupBound ` | `if (!submitLink \|\| submitLink.dataset.lookupBound === "true") return;` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-standardizer.js | 1904 | `data-lookupBound ` | `submitLink.dataset.lookupBound = "true";` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-standardizer.js | 2056 | `data-orderDetailsAddressPopulateBound ` | `if (trigger.dataset.orderDetailsAddressPopulateBound === "true") return;` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-standardizer.js | 2057 | `data-orderDetailsAddressPopulateBound ` | `trigger.dataset.orderDetailsAddressPopulateBound = "true";` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-standardizer.js | 2061 | `data-orderDetailsAddressSaveBound ` | `if (saveButton.dataset.orderDetailsAddressSaveBound === "true") return;` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-standardizer.js | 2062 | `data-orderDetailsAddressSaveBound ` | `saveButton.dataset.orderDetailsAddressSaveBound = "true";` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-standardizer.js | 2120 | `data-supabaseAuthBound ` | `if (!button \|\| button.dataset.supabaseAuthBound) return;` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/header-standardizer.js | 2125 | `data-supabaseAuthBound ` | `freshButton.dataset.supabaseAuthBound = "true";` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/hs-copy-clipboard-helper.js | 11 | `data-clipboardText ` | `const clipboardText = trigger.dataset.clipboardText;` |
| c:/Users/diopk/Downloads/therewego/apps/admin/public/js/hs.clipboard.js | 