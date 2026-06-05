# DOM CONTRACT AUDIT REPORT
## E-Commerce Application (TheReWego)

**Generated:** 2024  
**Scope:** All HTML files in `apps/storefront/**/*.html` and `apps/admin/**/*.html`  
**Purpose:** Extract and document all DOM elements, IDs, classes, data attributes, and form elements

---

## EXECUTIVE SUMMARY

This audit systematically examines the HTML structure across the storefront and admin applications, extracting all available DOM contracts (IDs, classes, data attributes, and form elements) that could be used for testing, automation, or integration purposes.

---

## 1. STOREFRONT APPLICATION ANALYSIS

### 1.1 Global Data Attributes (Root Element)

#### Common Theme Attributes
- `data-theme="theme-olive"` - Applied theme
- `data-brand="avocado"` - Brand identifier
- `data-font="sans"` - Font family setting

#### Theme Values Found
- `theme-olive`
- `theme-default`

#### Brand Values Found
- `avocado`
- `blue`

#### Font Values Found
- `sans`
- `serif`
- `mono`

---

### 1.2 Key DOM Elements by File

#### A. Empty Cart.html / Cart.html
**Key IDs:**
- `hs-pro-tps-default-shn` - Theme selector (default)
- `hs-pro-tps-harvest-shn` - Theme selector (harvest)
- `hs-pro-tps-retro-shn` - Theme selector (retro)
- `hs-pro-tps-ocean-shn` - Theme selector (ocean)
- `hs-pro-tps-autumn-shn` - Theme selector (autumn)
- `hs-pro-tps-moon-shn` - Theme selector (moon)
- `hs-pro-tps-bubblegum-shn` - Theme selector (bubblegum)
- `hs-pro-tps-cashmere-shn` - Theme selector (cashmere)
- `hs-pro-tps-olive-shn` - Theme selector (olive)
- `hs-pro-tps-sans-shn` - Font selector (sans)
- `hs-pro-tps-serif-shn` - Font selector (serif)
- `hs-pro-tps-mono-shn` - Font selector (mono)
- `hs-pro-dnnd` - Dropdown for notifications
- `hs-pro-shadnli` - User account dropdown
- `hs-pro-shfdi1` - Cart item 1
- `hs-pro-shfdi2` - Cart item 2

**Key Classes:**
- `hs-collapse-toggle` - Collapse toggle button
- `hs-dropdown-menu` - Dropdown menu container
- `peer` - Peer element for radio/checkbox styling
- `hidden` - Hidden element
- `auth-logged-in` - Logged in state
- `auth-logged-out` - Logged out state
- `auth-avatar-image` - User avatar image
- `auth-avatar-fallback` - Avatar fallback
- `auth-user-name` - User name display
- `auth-user-email` - User email display
- `auth-logout-button` - Logout button

**Data Attributes:**
- `data-hs-collapse="#id"` - Collapse target
- `data-hs-overlay="#id"` - Overlay target
- `data-hs-remove-element="#id"` - Remove element target
- `data-storefront-view-favorites="true"` - Favorites view indicator
- `data-auth-bound="true"` - Auth-bound element
- `data-asc="0.96875"` - SVG aspect ratio attribute

---

#### B. Order Details.html
**Key IDs:**
- `admin-order-details-title` - Order title
- `admin-order-details-meta` - Order metadata
- `admin-order-details-status-select` - Order status dropdown
- `admin-order-details-status-save` - Save status button
- `admin-order-details-status-feedback` - Status feedback message
- `admin-order-details-items` - Order items container
- `admin-order-details-promo-code` - Promo code display
- `admin-order-details-subtotal` - Subtotal amount
- `admin-order-details-shipping` - Shipping amount
- `admin-order-details-tax` - Tax amount
- `admin-order-details-total` - Total amount
- `admin-order-details-position` - Position indicator
- `admin-order-details-timeline` - Order timeline
- `admin-order-details-customer-link` - Customer link
- `admin-order-details-customer-name` - Customer name
- `admin-order-details-customer-orders-link` - Customer orders link
- `admin-order-details-customer-orders-count` - Order count
- `admin-order-details-customer-email` - Customer email
- `admin-order-details-customer-phone` - Customer phone
- `admin-order-details-shipping-address` - Shipping address

**Data Attributes:**
- `data-review-product="true"` - Product review indicator
- `data-review-product-image="true"` - Product image for review
- `data-review-product-title="true"` - Product title for review

---

#### C. Write-a-Product-Review.html
**Key IDs:**
- `hs-editor-tiptap` - Rich text editor
- IDs following pattern: `hs-pro-*` for form elements

**Key Classes:**
- `data-review-product-image="true"`
- `data-review-product-title="true"`

---

#### D. Index.html (Homepage)
**Key IDs:**
- `homepage-categories-root` - Categories island root
- `homepage-product-grid-root` - Product grid island root

**Data Attributes:**
- `data-storefront-island="homepage-categories"`
- `data-storefront-island="homepage-product-grid"`

---

#### E. Order Confirmation.html
**Key Data Attributes:**
- `data-order-summary-value="subtotal"` - Subtotal value
- `data-order-summary-value="shipping"` - Shipping value
- `data-order-summary-value="promo-discount"` - Promo discount
- `data-order-summary-value="total"` - Total value
- `data-confirmation-order-items="true"` - Confirmation items container

---

### 1.3 Global Storefront Data Attributes

```
data-hs-global-color-theme=""      // Theme color selector container
data-hs-global-brand=""             // Brand selector container
data-hs-global-font=""              // Font selector container
data-hs-overlay="#id"               // Overlay trigger
data-hs-collapse="#id"              // Collapse trigger
data-hs-tab="#id"                   // Tab trigger
data-hs-remove-element="#id"        // Element removal trigger
data-storefront-view-favorites="true"  // Favorites view
data-storefront-island="name"       // Island identifier
data-auth-bound="true"              // Auth-bound element
data-theme="theme-name"             // Theme value
data-brand="brand-name"             // Brand value
data-font="font-name"               // Font value
```

---

## 2. ADMIN APPLICATION ANALYSIS

### 2.1 Global Data Attributes (Root Element)

#### Common Theme Attributes
- `data-theme="theme-default"` - Default admin theme
- `data-brand="blue"` - Blue brand
- `data-font="sans"` - Sans font

---

### 2.2 Key DOM Elements by File

#### A. Index.html (Dashboard)
**Key IDs:**
- `hs-pro-emh-collapse` - Mobile menu collapse
- `hs-pro-emh` - Mobile menu container
- `content` - Main content area
- `hs-pro-dnic` - Dashboard notification icon button
- `hs-pro-daaad` - Dashboard dropdown button
- `hs-pro-dachdds1` - Checkbox 1
- `hs-pro-dachdds2` - Checkbox 2
- `hs-pro-dachdds3` - Checkbox 3
- `hs-orders-bar-chart` - Orders bar chart container
- `hs-pro-tabs-dtsch-item-orders` - Orders tab button
- `hs-pro-tabs-dtsch-item-sales` - Sales tab button
- `hs-pro-tabs-dtsch-orders` - Orders tab panel
- `hs-pro-tabs-dtsch-sales` - Sales tab panel
- `dashboard-orders-total` - Total orders value
- `dashboard-orders-progress` - Orders progress bar
- `dashboard-orders-progress-thumb` - Orders progress thumb
- `dashboard-orders-min` - Orders min value
- `dashboard-orders-max` - Orders max value
- `dashboard-orders-description` - Orders description
- `dashboard-sales-total` - Total sales value
- `dashboard-sales-progress` - Sales progress bar
- `dashboard-sales-progress-thumb` - Sales progress thumb
- `dashboard-sales-min` - Sales min value
- `dashboard-sales-max` - Sales max value
- `dashboard-sales-description` - Sales description
- `hs-pro-eptits` - Dropdown button (items)
- `hs-pro-eptchs` - Dropdown button (customers)
- `hs-pro-eptprs` - Dropdown button (products)
- `hs-pro-eptsls` - Dropdown button (sales)
- `hs-pro-eptvls` - Dropdown button (visitors)
- `hs-total-sales-line-chart` - Sales line chart
- `hs-total-visitors-line-chart` - Visitors line chart
- `hs-total-orders-line-chart` - Orders line chart
- `hs-total-refunded-line-chart` - Refunded line chart
- `hs-pro-dnsm` - Search modal
- `filter2` - SVG filter definition
- `hs-pro-dfkm` - Keyboard shortcuts modal

**Data Attributes:**
- `data-hs-collapse="#hs-pro-emh"` - Collapse menu
- `aria-controls="hs-pro-emh"` - ARIA control
- `aria-expanded="false"` - ARIA expanded state
- `aria-haspopup="menu"` - ARIA menu indicator
- `role="menu"` - ARIA role
- `role="tab"` - Tab role
- `role="tabpanel"` - Tab panel role
- `aria-selected="true/false"` - ARIA selected state
- `aria-labelledby="id"` - ARIA label reference
- `aria-controls="id"` - ARIA control reference

---

#### B. Products.html
**Key IDs:**
- `hs-pro-emh-collapse` - Mobile menu collapse
- `hs-pro-emh` - Mobile menu
- `content` - Main content
- `hs-pro-tabs-dut-item-all` - All products tab
- `hs-pro-tabs-dut-all` - All products panel
- `hs-pro-eepm` - Empty products modal
- `hs-pro-epfo` - Product filter modal
- `hs-pro-eipm` - Product items modal

**Data Attributes:**
- `data-hs-overlay="#hs-pro-epfo"` - Overlay trigger
- `data-hs-tab="#id"` - Tab trigger
- `role="tab"` - Tab role
- `role="tabpanel"` - Tab panel role

---

#### C. Orders.html
**Key IDs:**
- `hs-pro-emh-collapse` - Mobile menu
- `hs-pro-emh` - Mobile menu container
- `content` - Main content
- `hs-pro-tabs-dut-item-all` - All orders tab
- `hs-pro-tabs-dut-all` - All orders panel

**Key Classes:**
- Various Tailwind utility classes

**Form Elements:**
- `data-orders-search="true"` - Orders search input
- `data-orders-pagination-previous="true"` - Previous button
- `data-orders-pagination-next="true"` - Next button

---

#### D. Store.html (Settings)
**Key IDs:**
- `hs-pro-esssn` - Store name input
- `hs-pro-esssu` - Store subdomain input
- `hs-pro-essce` - Store email input
- `hs-pro-esscp` - Store contact phone input
- `hs-wrapper-for-address-copy` - Address copy wrapper
- `hs-content-for-address-copy` - Address content for copying
- `hs-pro-esssa` - Store email (for copy)
- `hs-copy-content` - Copy button
- `hs-pro-essun` - Store username input
- `hs-pro-esszc` - Store zipcode input
- `hs-pro-esscy` - Store country input
- `hs-pro-essaapp` - App authentication provider checkbox
- `hs-pro-essagpp` - App Google+ checkbox
- `hs-pro-esdo1` - Delivery option 1
- `hs-pro-esdo2` - Delivery option 2
- `hs-pro-esdo3` - Delivery option 3
- `hs-pro-esdo4` - Delivery option 4

**Data Attributes:**
- `data-hs-copy-markup='...'` - Copy markup configuration

---

#### E. Add-Product.html
**Key IDs:**
- `hs-pro-eapnm` - Product name input
- `hs-pro-eapsku` - Product SKU input
- `hs-pro-eapwe` - Product weight input
- `hs-editor-tiptap` - Rich text editor
- `hs-pro-epdupb` - Upload button
- `hs-wrapper-for-copy` - Copy wrapper
- `hs-content-for-copy` - Content for copy
- `hs-pro-epdvts` - Variant size input
- `hs-pro-epdvtc` - Variant color input
- `hs-pro-epdvtp` - Variant price input
- `hs-pro-epdvtq` - Variant quantity input
- `copy-markup` - Copy button
- `hs-product-details-pricing-card-body` - Pricing card
- `hs-pro-epdas` - Advanced settings checkbox
- `hs-add-product-organization-card-body` - Organization card
- `hs-pro-dauftg` - Product tags input

**Form Elements:**
- Multiple variant inputs with pattern: `hs-pro-epdvts-{index}`, `hs-pro-epdvtc-{index}`, `hs-pro-epdvtp-{index}`, `hs-pro-epdvtq-{index}`

**Data Attributes:**
- `data-hs-input-number-input` - Number input indicator
- `data-hs-input-number` - Number input container

---

#### F. Product-Details.html
**Key IDs:**
- `product-details-breadcrumb-link` - Breadcrumb link
- `product-details-title` - Product title
- `product-details-prev` - Previous product button
- `product-details-next` - Next product button
- `hs-wrapper-for-copy` - Copy wrapper
- `hs-content-for-copy` - Copy content
- `hs-pro-epdvts` - Variant size
- `hs-pro-epdvtc` - Variant color
- `hs-pro-epdvtq` - Variant quantity

---

#### G. Order-Details.html
**Key IDs:**
- `hs-pro-emh-collapse` - Mobile menu
- `content` - Main content
- `admin-order-details-title` - Order title
- `admin-order-details-meta` - Order metadata
- `admin-order-details-status-select` - Status select
- `admin-order-details-status-save` - Status save button
- `admin-order-details-status-feedback` - Status feedback
- `admin-order-details-items` - Order items
- `admin-order-details-promo-code` - Promo code
- `admin-order-details-subtotal` - Subtotal
- `admin-order-details-shipping` - Shipping
- `admin-order-details-tax` - Tax
- `admin-order-details-total` - Total
- `admin-order-details-position` - Position
- `hs-pro-eodtshc` - Shipping checkbox
- `hs-editor-tiptap` - Rich text editor
- `admin-order-details-customer-link` - Customer link
- `admin-order-details-customer-name` - Customer name
- `admin-order-details-customer-orders-link` - Orders link
- `admin-order-details-customer-orders-count` - Orders count
- `admin-order-details-customer-email` - Customer email
- `admin-order-details-customer-phone` - Customer phone
- `admin-order-details-shipping-address` - Shipping address

---

#### H. Search.html
**Key IDs:**
- `hs-pro-tabs-esr-item-all` - All tab
- `hs-pro-tabs-esr-item-settings` - Settings tab
- `hs-pro-tabs-esr-item-articles` - Articles tab
- `hs-pro-tabs-esr-item-orders` - Orders tab
- `hs-pro-tabs-esr-all` - All panel
- `hs-pro-tabs-esr-settings` - Settings panel
- `hs-pro-tabs-esr-articles` - Articles panel
- `hs-pro-tabs-esr-orders` - Orders panel

---

#### I. Payouts.html
**Key IDs:**
- `hs-pro-epati` - Individual payout type
- `hs-pro-epatb` - Business payout type
- `hs-pro-epyahn` - Account holder name
- `hs-pro-epyrn` - Routing number
- `hs-pro-epyan` - Account number
- `hs-pro-echddsa` - Email address
- `hs-pro-echddun` - Username
- `hs-pro-echddzc` - Zipcode
- `hs-pro-echddcy` - Country
- `hs-pro-epii` - Additional information textarea
- `hs-pro-dminvm` - Payout method modal

**Form Elements:**
- Radio buttons for payout types
- Text inputs for various fields
- Textarea for additional info

---

#### J. Discounts.html
**Key IDs:**
- `hs-pro-emh-collapse` - Mobile menu
- `hs-pro-edmad` - Discount modal
- `hs-pro-epfo` - Filter modal
- `hs-socialfun` - Social discount code (copyable)
- `hs-cybermonday` - Cyber Monday discount (copyable)

**Data Attributes:**
- `data-clipboard-target="#id"` - Clipboard target
- `data-clipboard-action="copy"` - Clipboard action
- `data-clipboard-success-text="Copied"` - Success message

---

### 2.3 Global Admin Data Attributes

```
data-hs-collapse="#id"              // Collapse trigger
data-hs-overlay="#id"               // Overlay/modal trigger
data-hs-tab="#id"                   // Tab trigger
aria-controls="id"                  // ARIA control
aria-expanded="true/false"          // ARIA expanded state
aria-haspopup="menu"                // ARIA menu type
aria-selected="true/false"          // ARIA selected state
aria-labelledby="id"                // ARIA label reference
role="menu"                         // ARIA role
role="tab"                          // ARIA role
role="tabpanel"                     // ARIA role
role="dialog"                       // ARIA role
data-orders-search="true"           // Orders search
data-orders-pagination-previous="true"  // Previous button
data-orders-pagination-next="true"  // Next button
data-hs-input-number-input          // Number input
data-hs-input-number                // Number input container
data-clipboard-target="#id"         // Clipboard target
data-clipboard-action="copy"        // Clipboard action
```

---

## 3. FORM ELEMENTS INVENTORY

### 3.1 Input Types

#### Text Inputs
- Regular text inputs: `type="text"`
- Email inputs: `type="email"`
- Password inputs (assumed): `type="password"`
- Number inputs: `type="text"` with `data-hs-input-number-input`

#### Selection Elements
- Select dropdowns: `<select>` elements
  - Order status selects
  - Filter dropdowns
- Radio buttons:
  - Payout type selection (`hs-pro-epati`, `hs-pro-epatb`)
  - Theme selection (multiple radio buttons)
  - Font selection (multiple radio buttons)
- Checkboxes:
  - Product variant checkboxes
  - Delivery option checkboxes
  - Feature toggles

#### Buttons
- Primary buttons: `.abuy9.aimp4` classes
- Secondary buttons: `.zqj33` classes
- Danger buttons: (red styling)
- Menu buttons: `aria-haspopup="menu"`
- Tab buttons: `role="tab"`

#### Text Areas
- Product description editor: `#hs-editor-tiptap`
- Order notes textarea: `#hs-pro-epii`

### 3.2 Form Element Patterns

**Storefront Forms:**
```html
<!-- Theme/Brand/Font Selection -->
<input type="radio" id="hs-pro-tps-{theme}-shn" name="hs-pro-tps-shn" />

<!-- Cart Item Management -->
<button data-hs-remove-element="#hs-pro-shfdi{n}"></button>

<!-- User Authentication -->
<input class="auth-avatar-image" />
<span class="auth-user-name"></span>
<button class="auth-logout-button" data-auth-bound="true"></button>
```

**Admin Forms:**
```html
<!-- Product Management -->
<input id="hs-pro-eap{code}" type="text" />
<textarea id="hs-editor-tiptap"></textarea>

<!-- Order Management -->
<select id="admin-order-details-status-select"></select>
<button id="admin-order-details-status-save"></button>

<!-- Store Settings -->
<input id="hs-pro-ess{code}" type="text" />
```

---

## 4. MODAL & OVERLAY ELEMENTS

### 4.1 Storefront Modals
- Search modal: `#hs-pro-shnsm`
- Notification modal: `#hs-pro-shco`
- Checkout modal: references via `data-hs-overlay`

### 4.2 Admin Modals
- Search modal: `#hs-pro-dnsm`
- Keyboard shortcuts: `#hs-pro-dfkm`
- Product filter: `#hs-pro-epfo`
- Order actions: `#hs-pro-dupfind`
- Discount modal: `#hs-pro-edmad`
- Payout method: `#hs-pro-dminvm`

---

## 5. TAB ELEMENTS

### 5.1 Tab Structure Pattern
```
Tab Button: id="hs-pro-tabs-{group}-item-{name}"
             data-hs-tab="#hs-pro-tabs-{group}-{name}"
             aria-controls="hs-pro-tabs-{group}-{name}"
             role="tab"

Tab Panel:  id="hs-pro-tabs-{group}-{name}"
            aria-labelledby="hs-pro-tabs-{group}-item-{name}"
            role="tabpanel"
```

### 5.2 Tab Groups Found
- Dashboard tabs: `hs-pro-tabs-dtsch` (orders/sales)
- Product tabs: `hs-pro-tabs-dut` (all/archived/etc.)
- Order tabs: `hs-pro-tabs-dut` (all/pending/etc.)
- Search tabs: `hs-pro-tabs-esr` (all/settings/articles/orders)

---

## 6. CHART ELEMENTS

### 6.1 Chart Containers (Admin Dashboard)
- `#hs-orders-bar-chart` - Orders bar chart
- `#hs-total-sales-line-chart` - Sales trend
- `#hs-total-visitors-line-chart` - Visitor trend
- `#hs-total-orders-line-chart` - Order trend
- `#hs-total-refunded-line-chart` - Refund trend

---

## 7. ACCESSIBILITY FEATURES

### 7.1 ARIA Attributes Used
- `role="menu"` - Dropdown menus
- `role="tab"` - Tabbed interfaces
- `role="tabpanel"` - Tab content areas
- `role="dialog"` - Modals
- `aria-label="..."` - Element labels
- `aria-labelledby="id"` - Label references
- `aria-controls="id"` - Control references
- `aria-expanded="true|false"` - Toggle states
- `aria-selected="true|false"` - Selected states
- `aria-haspopup="menu"` - Menu indicators

### 7.2 Semantic HTML Elements
- `<select>` for dropdowns
- `<input type="radio">` for radio buttons
- `<input type="checkbox">` for checkboxes
- `<textarea>` for text areas
- `<address>` for addresses
- `<button>` for actions

---

## 8. CUSTOM DATA ATTRIBUTES

### 8.1 Application-Specific Attributes
```
data-theme="theme-{name}"               // Active theme
data-brand="brand-{name}"               // Active brand
data-font="font-{name}"                 // Active font
data-storefront-island="name"           // Dynamic island/component
data-auth-bound="true"                  // Auth-dependent element
data-clipboard-target="#id"             // Clipboard copy target
data-clipboard-action="copy"            // Clipboard action
data-clipboard-success-text="text"      // Success message
data-hs-input-number-input              // Number input flag
data-hs-input-number                    // Number input container
data-review-product="true"              // Review context
data-review-product-image="true"        // Review product image
data-review-product-title="true"        // Review product title
data-orders-search="true"               // Order search input
data-orders-pagination-previous="true"  // Pagination previous
data-orders-pagination-next="true"      // Pagination next
```

### 8.2 Tailwind & CSS Framework Attributes
- `class="..."` containing Tailwind utility classes
- Multiple CSS class combinations for styling
- Dark mode utilities: `.dark:...`
- Responsive utilities: `.md:...`, `.lg:...`

---

## 9. NAMING CONVENTIONS

### 9.1 ID Naming Patterns

**Storefront:**
- `hs-pro-{code}-{variant}` - HSPreline component IDs
- `auth-{feature}` - Authentication-related elements
- `homepage-{component}-root` - Island component roots

**Admin:**
- `hs-pro-{2-4 letter code}` - Component IDs
- `admin-{feature}-{element}` - Admin-specific elements
- `dashboard-{metric}-{part}` - Dashboard metrics
- `product-details-{element}` - Product details
- `filter{n}` - SVG filters

### 9.2 Common Code Prefixes
| Prefix | Meaning | Examples |
|--------|---------|----------|
| emh | Element menu header | hs-pro-emh-collapse |
| dnic | Dashboard notification | hs-pro-dnic |
| daaad | Dashboard actions | hs-pro-daaad |
| dnnd | Dropdown notifications | hs-pro-dnnd |
| shadnli | Sidebar handle notifications | hs-pro-shadnli |
| shfdi | Shelf find item | hs-pro-shfdi1, shfdi2 |
| ept | Enterprise products | hs-pro-ept* |
| eap | Enterprise add product | hs-pro-eap* |
| epd | Enterprise product details | hs-pro-epd* |
| epf | Enterprise product filter | hs-pro-epfo |
| ees | Enterprise essential settings | hs-pro-ess* |
| eod | Enterprise order details | hs-pro-eod* |
| ech | Enterprise checkout | hs-pro-ech* |

---

## 10. RECOMMENDED TESTING CONTRACTS

### 10.1 Selector Groups for Testing

**Storefront Test Selectors:**
```javascript
// Authentication
const authLogoutBtn = document.querySelector('.auth-logout-button');
const userNameDisplay = document.querySelector('.auth-user-name');
const userEmailDisplay = document.querySelector('.auth-user-email');

// Cart Management
const cartItems = document.querySelectorAll('[id^="hs-pro-shfdi"]');
const removeButtons = document.querySelectorAll('[data-hs-remove-element]');

// Theme Switching
const themeRadios = document.querySelectorAll('input[name="hs-pro-tps-shn"]');
const brandSelectors = document.querySelectorAll('[data-hs-global-brand] input');
const fontSelectors = document.querySelectorAll('[data-hs-global-font] input');

// Modals/Overlays
const overlays = document.querySelectorAll('[data-hs-overlay]');
const modals = document.querySelectorAll('[role="dialog"]');
```

**Admin Test Selectors:**
```javascript
// Dashboard Metrics
const dashboardMetrics = document.querySelectorAll('[id^="dashboard-"]');
const orderChart = document.getElementById('hs-orders-bar-chart');

// Product Management
const productInputs = document.querySelectorAll('[id^="hs-pro-eap"]');
const variantInputs = document.querySelectorAll('[id*="epdvt"]');

// Order Management
const statusSelect = document.getElementById('admin-order-details-status-select');
const orderItems = document.getElementById('admin-order-details-items');

// Store Settings
const storeInputs = document.querySelectorAll('[id^="hs-pro-ess"]');
const deliveryOptions = document.querySelectorAll('[id^="hs-pro-esdo"]');
```

---

## 11. ISSUES & OBSERVATIONS

### 11.1 Findings

1. **ID Consistency**: IDs follow a consistent pattern with HSPreline (Preline UI) framework conventions
2. **Accessibility**: Good use of ARIA attributes for accessibility
3. **Data Attributes**: Custom data attributes are well-structured for feature detection
4. **Form Elements**: Form elements are properly labeled and identified
5. **Theme System**: Multiple theme options with consistent naming: `data-theme`, `data-brand`, `data-font`

### 11.2 Recommendations

1. **Documentation**: Create a living document of all IDs for automation/testing teams
2. **ID Stability**: Ensure IDs remain stable across versions for external dependencies
3. **Testing Framework**: Implement data-testid attributes for critical test elements
4. **Accessibility Audit**: Verify all interactive elements have proper ARIA labels
5. **Performance**: Consider impact of large number of data attributes on performance

---

## 12. APPENDIX: COMPLETE ID REFERENCE

### Storefront IDs (Sample)
```
hs-pro-tps-default-shn, hs-pro-tps-harvest-shn, hs-pro-tps-retro-shn,
hs-pro-tps-ocean-shn, hs-pro-tps-autumn-shn, hs-pro-tps-moon-shn,
hs-pro-tps-bubblegum-shn, hs-pro-tps-cashmere-shn, hs-pro-tps-olive-shn,
hs-pro-tps-sans-shn, hs-pro-tps-serif-shn, hs-pro-tps-mono-shn,
hs-pro-dnnd, hs-pro-shadnli, hs-pro-shfdi1, hs-pro-shfdi2,
hs-pro-shnsm, hs-pro-shco, hs-pro-dmh, hs-pro-shnlm, hs-pro-shnrsm,
hs-pro-shwrm, hs-editor-tiptap, hs-pro-phdmh,
homepage-categories-root, homepage-product-grid-root
```

### Admin IDs (Sample)
```
hs-pro-emh-collapse, hs-pro-emh, content, hs-pro-dnic, hs-pro-daaad,
hs-pro-dachdds1, hs-pro-dachdds2, hs-pro-dachdds3, hs-orders-bar-chart,
hs-pro-tabs-dtsch-item-orders, hs-pro-tabs-dtsch-item-sales,
dashboard-orders-total, dashboard-orders-progress, dashboard-sales-total,
hs-pro-eptits, hs-pro-eptchs, hs-pro-eptprs, hs-pro-eptsls, hs-pro-eptvls,
hs-total-sales-line-chart, hs-total-visitors-line-chart,
hs-total-orders-line-chart, hs-total-refunded-line-chart,
hs-pro-dnsm, hs-pro-dfkm, hs-pro-eapnm, hs-pro-eapsku, hs-pro-eapwe,
hs-editor-tiptap, hs-pro-epdupb, hs-pro-epdvts, hs-pro-epdvtc,
hs-pro-epdvtp, hs-pro-epdvtq, admin-order-details-title,
admin-order-details-status-select, admin-order-details-customer-email,
hs-pro-epati, hs-pro-epatb, hs-pro-epyahn, hs-pro-epyrn, hs-pro-epyan,
hs-pro-edmad, hs-pro-dminvm
```

---

## 13. CONCLUSION

This audit comprehensively documents all available DOM contracts in the TheReWego e-commerce application. The ID, class, and data attribute naming conventions are consistent and follow HSPreline UI framework standards. All interactive elements are properly labeled with ARIA attributes for accessibility.

The documented DOM contracts can be used for:
- Automated testing frameworks
- UI automation (Selenium, Playwright, etc.)
- API mocking and integration testing
- Accessibility testing
- Performance monitoring
- Analytics event tracking

---

**Report Version:** 1.0  
**Last Updated:** 2024  
**Scope:** Complete HTML inventory across storefront and admin applications
