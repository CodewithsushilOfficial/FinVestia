# UI Design Specification

This document details the layout, typography, components, and color system extracted from the approved portfolio dashboard design mockup.

---

## 1. Aesthetic Direction: Sleek FinTech System
The application adheres to a premium **Sleek FinTech** design aesthetic.
- **Tone**: Clean, trustworthy, functional, and minimal.
- **Visual Structure**: Left navigation sidebar (dark mode) paired with a clean, well-spaced main content workspace (light mode).
- **Core Elements**: Rounded cards, subtle borders, high-contrast typography, and intuitive color feedback for financial performance metrics.

---

## 2. Color Palette (CSS Variables)

We define a unified design token system using CSS custom properties:

```css
:root {
  /* Core Brand Colors */
  --color-primary: #2563eb;          /* Vibrant Blue (solid buttons, active states) */
  --color-primary-hover: #1d4ed8;    /* Darker Blue (button hover states) */
  
  /* Layout Backgrounds */
  --color-bg-sidebar: #0f172a;       /* Slate 900 (dark left navigation sidebar) */
  --color-bg-app: #f8fafc;           /* Slate 50 (light workspace background) */
  --color-bg-card: #ffffff;          /* White (cards, modals, forms) */
  --color-bg-sidebar-active: #1e293b;/* Slate 800 (active sidebar item background) */
  
  /* Typography & Elements */
  --color-text-primary: #0f172a;     /* Slate 900 (headings, main tables, core labels) */
  --color-text-secondary: #475569;   /* Slate 600 (subheadings, card descriptions, table headers) */
  --color-text-sidebar: #94a3b8;     /* Slate 400 (inactive navigation text) */
  --color-text-sidebar-active: #ffffff; /* White (active navigation text) */
  
  /* Financial Indicators */
  --color-profit-green: #10b981;     /* Emerald 500 (profitable metrics, positive updates) */
  --color-profit-green-bg: #ecfdf5;  /* Emerald 50 (light green tag backgrounds) */
  --color-loss-red: #ef4444;         /* Red 500 (unprofitable metrics, delete operations) */
  --color-loss-red-bg: #fef2f2;      /* Red 50 (light red tag backgrounds) */
  --color-wallet-orange: #f59e0b;    /* Amber 500 (neutral portfolio assets) */
  --color-wallet-orange-bg: #fffbeb; /* Amber 50 (wallet container tag backgrounds) */
  --color-percent-purple: #8b5cf6;   /* Violet 500 */
  --color-percent-purple-bg: #f5f3ff;/* Violet 50 */
  
  /* Borders and Inputs */
  --color-border: #e2e8f0;           /* Slate 200 (cards, layout dividers, table lines) */
  --color-input-border: #cbd5e1;     /* Slate 300 (form input field borders) */
  --color-input-focus: #3b82f6;      /* Blue 500 (focused field border) */
}
```

---

## 3. Typography
- **Fonts**: **Outfit** (Primary Sans-serif for titles, headings, and numerical values) and **Inter** (Restrained Sans-serif for tabular data, form inputs, and body text).
- **Scale**:
  - Main Heading: `24px` / `1.5rem` (semibold)
  - Card Value Text: `20px` / `1.25rem` (bold)
  - Subheadings / Card Labels: `14px` / `0.875rem` (medium)
  - Body Text / Table Data: `14px` / `0.875rem` (regular)
  - Table Headers: `12px` / `0.75rem` (semibold, uppercase)

---

## 4. UI Layout & Pages

### 4.1 Login & Registration Pages
- **Layout**: Centered minimal auth card (`max-w-md`) over a clean, neutral background (`--color-bg-app`).
- **Form Controls**:
  - Vertical stack spacing: `16px` (`1rem`).
  - Inputs: Height `42px`, rounded-md (`6px`), border `--color-input-border`, placeholder `#94a3b8`.
  - Buttons: Solid primary blue (`--color-primary`), bold text, elevation shadows on hover.
  - Links: Small navigation helper text leading users between Login and Registration.

### 4.2 Dashboard Layout (Main Workspace)
A two-column grid layout containing:
1. **Left Sidebar Panel** (Width: `260px`, Background: `--color-bg-sidebar`):
   - Vertical alignment containing logo header, navigation links, and user Profile block.
   - Profile Block (Bottom): Circular initials avatar, name, and email over slate-800.
2. **Main Content Container** (Flex-1, Background: `--color-bg-app`, Padding: `32px`):
   - Header with search, system notification indicator ("3"), and profile dropdown greeting.
   - Welcome banner + "Dashboard" heading.

### 4.3 Portfolio Summary Cards
Four rectangular cards aligned in a grid (`grid-cols-4`, Gap: `24px`):
- **Total Invested Card**: Blue Rupee symbol circle, "₹50,000.00", label "Total Invested", subtext "All time invested".
- **Current Value Card**: Green upward chart trend icon, "₹62,000.00", label "Current Value", subtext "Current portfolio value".
- **Profit / Loss Card**: Amber wallet icon, "₹12,000.00", label "Profit / Loss", subtext "Total profit" (dynamically turns red if negative).
- **Profit Percentage Card**: Purple percentage icon, "24.00%", label "Profit Percentage", subtext "Overall return" (dynamically turns red if negative).

### 4.4 My Investments Table
Main table card displaying investment records:
- **Columns**: Name, Type, Invested Amount, Current Value (colored green/red depending on profit/loss status), Purchase Date, Actions (Edit/Delete icons).
- **Action Buttons**:
  - **Edit**: Outline button or outline icon (`--color-primary`).
  - **Delete**: Outline button or outline icon (`--color-loss-red`).
- **Card Header**: "My Investments" title, and a "+ Add Investment" primary button.

### 4.5 Add / Edit Investment Side Panel
Sliding drawer (slide-over panel) appearing from the right edge of the screen:
- **Header**: "Add Investment" (or "Edit Investment") title with close button ("X").
- **Inputs**:
  - Investment Name (Text field)
  - Investment Type (Dropdown menu containing Stock, Mutual Fund, Crypto, Fixed Deposit, etc.)
  - Invested Amount (Numeric input with currency symbol adornment)
  - Current Value (Numeric input with currency symbol adornment)
  - Purchase Date (Date selector field)
- **Footer**: Action buttons ("Cancel" and "Add Investment" / "Save Changes").

---

## 5. Micro-interactions & Feedback States
- **Hover Transitions**: `all 0.2s cubic-bezier(0.4, 0, 0.2, 1)` transition speed on buttons, table rows, and sidebar links.
- **Loading State**: Shimmer animations (skeletons) for dashboard stats and table rows while fetching API data.
- **Empty State**: Centered illustration in the investments table displaying "No investments found. Click '+ Add Investment' to log your first holding."
