---
name: Master Portal
colors:
  surface: '#fef7ff'
  surface-dim: '#dfd7e6'
  surface-bright: '#fef7ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f9f1ff'
  surface-container: '#f3ebfa'
  surface-container-high: '#ede5f4'
  surface-container-highest: '#e8dfee'
  on-surface: '#1d1a24'
  on-surface-variant: '#4a4455'
  inverse-surface: '#332f39'
  inverse-on-surface: '#f6eefc'
  outline: '#7b7487'
  outline-variant: '#ccc3d8'
  surface-tint: '#732ee4'
  primary: '#630ed4'
  on-primary: '#ffffff'
  primary-container: '#7c3aed'
  on-primary-container: '#ede0ff'
  inverse-primary: '#d2bbff'
  secondary: '#575e70'
  on-secondary: '#ffffff'
  secondary-container: '#d9dff5'
  on-secondary-container: '#5c6274'
  tertiary: '#7d3d00'
  on-tertiary: '#ffffff'
  tertiary-container: '#a15100'
  on-tertiary-container: '#ffe0cd'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#eaddff'
  primary-fixed-dim: '#d2bbff'
  on-primary-fixed: '#25005a'
  on-primary-fixed-variant: '#5a00c6'
  secondary-fixed: '#dce2f7'
  secondary-fixed-dim: '#c0c6db'
  on-secondary-fixed: '#141b2b'
  on-secondary-fixed-variant: '#404758'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#ffb784'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#713700'
  background: '#fef7ff'
  on-background: '#1d1a24'
  surface-variant: '#e8dfee'
typography:
  display:
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h1:
    fontSize: 30px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.02em
  h2:
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  h3:
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: -0.01em
  body-lg:
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.2'
  label-sm:
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  sidebar_width: 260px
  header_height: 64px
  container_max_width: 1280px
---

## Brand & Style

The design system is anchored in a **Minimalist / Corporate Modern** aesthetic, drawing heavy inspiration from high-utility tools like Linear and Stripe. The goal is to create a focused, low-friction environment that prioritizes content clarity and task efficiency. 

The personality is professional, precise, and dependable. It utilizes ample whitespace and a restrained color palette to reduce cognitive load, making complex SaaS workflows feel manageable. The emotional response should be one of "quiet confidence"—a tool that gets out of the way of the user's work while feeling premium and meticulously crafted.

## Colors

The color strategy for the design system relies on a high-contrast foundation for legibility paired with a single vibrant accent.

- **Primary Accent:** Purple (#7C3AED) is used sparingly for primary actions, active states, and progress indicators to draw attention without overwhelming the eye.
- **Neutrals:** The background uses a very light cool gray (#F8F9FA) to differentiate from the pure white (#FFFFFF) card surfaces, creating a subtle layered effect.
- **Typography:** Deep Charcoal (#111827) provides maximum contrast for body text, while Medium Gray (#6B7280) is reserved for metadata, labels, and secondary information.
- **Borders:** A consistent light gray (#E5E7EB) defines boundaries without creating visual noise.

## Typography

The design system utilizes **Inter** exclusively to maintain a utilitarian and systematic feel. The hierarchy is established through intentional weight shifts rather than excessive size variance.

- **Headlines:** Use SemiBold (600) or Bold (700) with slight negative letter-spacing to appear tighter and more professional.
- **Body Text:** Regular (400) weight is used for all long-form reading to ensure maximum legibility.
- **Labels/Data:** Medium (500) weight is used for small UI labels, table headers, and button text to differentiate functional elements from static content.

## Layout & Spacing

The layout follows a **Fixed-Fluid hybrid model** to ensure structural stability across the SaaS platform.

- **Sidebar:** A fixed 260px white sidebar on the left, separated by a subtle `1px` right border (#E5E7EB).
- **Header:** A fixed 64px white top bar that spans the remaining width, providing global search and user profile access.
- **Content Area:** A fluid area using the background color (#F8F9FA) with a maximum container width of 1280px for optimal line lengths.
- **Spacing Rhythm:** Based on a 4px baseline. Components typically use 16px (md) or 24px (lg) padding to maintain an airy, uncrowded feel.

## Elevation & Depth

Depth in the design system is achieved through **Tonal layering** and **Ambient shadows**. 

- **Level 0 (Background):** The canvas level (#F8F9FA).
- **Level 1 (Cards/Surfaces):** Pure white surfaces (#FFFFFF) that appear to float slightly above the background. These utilize a soft, diffused shadow: `0px 4px 12px rgba(0, 0, 0, 0.03)`.
- **Level 2 (Overlays/Dropdowns):** Use a more pronounced shadow to indicate temporary elevation: `0px 10px 25px rgba(0, 0, 0, 0.08)`.
- **Borders:** All surfaces use a subtle border (#E5E7EB) to maintain definition even in low-light environments or when printed.

## Shapes

The design system adopts a **Rounded** shape language to balance the "corporate" feel with a touch of modern approachability.

- **Standard Elements:** Input fields, checkboxes, and small cards use a `0.5rem` (8px) radius.
- **Large Containers:** Main content cards use a `1rem` (16px) radius to emphasize their modular nature.
- **Interactive Elements:** Buttons and status badges utilize a "Pill" shape (full rounding) to clearly distinguish them from structural layout elements.

## Components

### Buttons & Controls
- **Pill Buttons:** Primary buttons use the Purple accent with white text. Secondary buttons use a white background with a light gray border. All buttons have fully rounded ends (Pill-shaped).
- **Toggle Switches:** Small, pill-shaped tracks with a white circular handle. Use Purple for the "on" state and Gray (#E5E7EB) for "off".
- **Status Badges:** Small pill-shaped containers with a very light background tint (10% opacity) of the status color (e.g., light green for "Active") and dark-colored text.

### Data Display
- **Data Tables:** Headers are Medium (500) weight gray text. Rows feature alternating light gray stripes (#F9FAFB) for horizontal scanability. No vertical borders; only subtle horizontal separators.
- **White Cards:** Used as the primary grouping mechanism. Every card has a white background, a light border, and a soft shadow.

### Navigation & Icons
- **Sidebar Links:** Clean, vertical list with Lucide-style icons (2px stroke). Active states are indicated by a purple icon and a subtle background tint or left-side indicator.
- **Icons:** Use consistent 20px or 24px sizing with a "Thin" or "Light" stroke weight to match the Inter typeface.

### Inputs
- **Form Fields:** White background with a `1px` gray border. On focus, the border transitions to Purple with a soft glow (box-shadow). Labels are positioned above the field in Medium weight.