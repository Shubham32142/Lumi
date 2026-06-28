
# UI Standards

All projects must follow these visual and interaction standards. These apply to every page, component, and layout from day one.

---

## Core Principles

1. **Classic and professional** — No trendy, flashy, or experimental styling
2. **Flat design** — No shadows, no gradients, no glows, no blur effects
3. **Clean borders** — Use solid 1px borders for separation, not shadows
4. **High contrast** — Text must be clearly readable. Use dark text on light backgrounds
5. **Consistent spacing** — Follow a 4px/8px grid system
6. **Minimal animation** — Only use transitions for functional feedback (hover states, loading). No decorative animations

---

## Design Token System (Single Source of Truth)

All visual values — colors, spacing, radii, typography, sizing — must be defined **once** in a central file. Components never hardcode these values — they reference tokens only. Each product defines its own values following the token structure below.

### Central Definition

Choose one approach depending on your stack:

**CSS Custom Properties** — define in a single CSS file (e.g., `theme.css`, `variables.css`):
```css
:root {
  /* ── Colors ── */

  /* Primary — brand color with shades */
  --color-primary-light: /* ... */;
  --color-primary-base:  /* ... */;
  --color-primary-dark:  /* ... */;

  /* Neutral — grays for text, borders, backgrounds */
  --color-neutral-50:  /* lightest */;
  --color-neutral-100: /* ... */;
  --color-neutral-200: /* ... */;
  --color-neutral-300: /* ... */;
  --color-neutral-500: /* ... */;
  --color-neutral-700: /* ... */;
  --color-neutral-900: /* darkest */;

  /* Status */
  --color-success: /* ... */;
  --color-error:   /* ... */;
  --color-warning: /* ... */;
  --color-info:    /* ... */;

  /* Semantic (mapped from above) */
  --color-bg-page:        /* ... */;
  --color-bg-muted:       var(--color-neutral-50);
  --color-bg-hover:       var(--color-neutral-50);
  --color-border:         var(--color-neutral-200);
  --color-border-input:   var(--color-neutral-300);
  --color-text-primary:   var(--color-neutral-900);
  --color-text-secondary: var(--color-neutral-500);
  --color-text-label:     var(--color-neutral-700);
  --color-text-on-primary:/* ... */;

  /* ── Spacing ── */
  --space-1:  /* 4px  */;
  --space-2:  /* 8px  */;
  --space-3:  /* 12px */;
  --space-4:  /* 16px */;
  --space-6:  /* 24px */;
  --space-8:  /* 32px */;
  --space-12: /* 48px */;
  --space-16: /* 64px */;

  /* ── Border Radius ── */
  --radius-sm:   /* small, e.g. 2px  */;
  --radius-md:   /* default, e.g. 6px */;
  --radius-lg:   /* large, e.g. 8px  */;
  --radius-full: /* pill, e.g. 9999px */;

  /* ── Typography ── */
  --font-family-base: /* system font stack */;
  --font-family-mono: /* monospace stack  */;

  --font-size-xs:  /* ... */;
  --font-size-sm:  /* ... */;
  --font-size-base:/* ... */;
  --font-size-lg:  /* ... */;
  --font-size-xl:  /* ... */;
  --font-size-2xl: /* ... */;

  --font-weight-normal:  /* ... */;
  --font-weight-medium:  /* ... */;
  --font-weight-semibold:/* ... */;
  --font-weight-bold:    /* ... */;

  --line-height-tight:  /* headings */;
  --line-height-normal: /* body     */;
  --line-height-relaxed:/* loose    */;

  /* ── Sizing ── */
  --size-icon-sm:  /* inline icons     */;
  --size-icon-md:  /* button icons     */;
  --size-icon-lg:  /* navigation icons */;
  --size-input-h:  /* input height     */;
  --size-button-h: /* button height    */;
  --size-content-max: /* max page width */;

  /* ── Borders ── */
  --border-width: /* e.g. 1px */;

  /* ── Z-Index ── */
  --z-dropdown: /* ... */;
  --z-sticky:   /* ... */;
  --z-modal:    /* ... */;
  --z-toast:    /* ... */;

  /* ── Transitions ── */
  --duration-fast:   /* e.g. 100ms */;
  --duration-normal: /* e.g. 200ms */;
  --easing-default:  /* e.g. ease-in-out */;
}
```

**JS/TS Token File** — define in a single module (e.g., `theme.ts`, `tokens.ts`):
```ts
export const theme = {
  color: {
    primary:  { light: '...', base: '...', dark: '...' },
    neutral:  { 50: '...', 100: '...', 200: '...', 300: '...', 500: '...', 700: '...', 900: '...' },
    status:   { success: '...', error: '...', warning: '...', info: '...' },
    surface:  { page: '...', muted: '...', hover: '...' },
    border:   { default: '...', input: '...' },
    text:     { primary: '...', secondary: '...', label: '...', onPrimary: '...' },
  },
  space: { 1: '...', 2: '...', 3: '...', 4: '...', 6: '...', 8: '...', 12: '...', 16: '...' },
  radius: { sm: '...', md: '...', lg: '...', full: '...' },
  font: {
    family: { base: '...', mono: '...' },
    size:   { xs: '...', sm: '...', base: '...', lg: '...', xl: '...', '2xl': '...' },
    weight: { normal: '...', medium: '...', semibold: '...', bold: '...' },
    lineHeight: { tight: '...', normal: '...', relaxed: '...' },
  },
  size: {
    iconSm: '...', iconMd: '...', iconLg: '...',
    inputH: '...', buttonH: '...',
    contentMax: '...',
  },
  borderWidth: '...',
  z: { dropdown: '...', sticky: '...', modal: '...', toast: '...' },
  duration: { fast: '...', normal: '...' },
  easing: { default: '...' },
} as const;
```

### Required Token Categories

Every project must define at minimum:

| Category | Tokens | Purpose |
|----------|--------|---------|
| **Color — Primary** | light, base, dark | Brand / accent color with shades |
| **Color — Neutral** | 50 through 900 scale | Grays for backgrounds, borders, text |
| **Color — Status** | success, error, warning, info | Semantic feedback colors |
| **Color — Surface** | page, muted, hover | Background colors |
| **Color — Border** | default, input | Border colors |
| **Color — Text** | primary, secondary, label, onPrimary | Text colors |
| **Spacing** | 1 through 16 scale | Padding, margin, gaps |
| **Radius** | sm, md, lg, full | Border radius |
| **Typography** | family, size, weight, lineHeight | Fonts and text sizing |
| **Sizing** | icon sizes, input/button heights, content max | Component dimensions |
| **Border Width** | default | Consistent border thickness |
| **Z-Index** | dropdown, sticky, modal, toast | Layering |
| **Transitions** | duration, easing | Functional animation timing |

### Rules

- **One file owns all design values** — changing a token there changes it everywhere
- **Components only use tokens** — never raw hex/rgb/hsl, px, rem, or magic numbers in component files
- Use semantic status colors only for their intended purpose (success, error, warning, info)
- One primary accent color per page — no multiple competing brand colors
- No gradient backgrounds, colored shadows, opacity/transparency backgrounds, or glow effects

---

## Borders & Separation

Use `color.border` and `borderWidth` tokens for all borders. Never use shadows for visual separation.

### Cards
- Border: `color.border` + `borderWidth` tokens, radius: `radius.lg` token — no shadow
- Background: `color.surface.page` token
- Padding: `space.4` or `space.6` token

### Tables
- Row separation: `color.border` + `borderWidth` tokens
- Header background: `color.surface.muted` token, text: `color.text.label` token, weight: `font.weight.medium`
- No hover shadow effects (use `color.surface.hover` token for hover if needed)

### Sections
- Separate sections with bottom border using `color.border` token, or spacing using `space.*` tokens
- No shadow dividers

---

## Typography

- Font family: `font.family.base` token (configure with Japanese support)
- Heading hierarchy: `font.size.2xl` > `font.size.xl` > `font.size.lg` > `font.size.base` tokens
- Heading line height: `font.lineHeight.tight` token
- Body text: `font.size.sm` or `font.size.base`, color: `color.text.primary` token
- Secondary text: `font.size.sm`, color: `color.text.secondary` token
- No decorative fonts, no all-caps headings, no letter-spacing tricks

---

## Buttons

All buttons use: height `size.buttonH`, padding `space.2`/`space.4`, radius `radius.md`, size `font.size.sm`, weight `font.weight.medium`.

### Primary
- Background: `color.primary.base`, text: `color.text.onPrimary`
- Hover: `color.primary.dark`
- Border matches background color

### Secondary
- Background: `color.surface.page`, text: `color.text.label`
- Hover: `color.surface.hover`
- Border: `color.border.input`

### Danger
- Background: `color.status.error`, text: `color.text.onPrimary`
- Hover: error dark shade
- Border matches background color

### Rules
- No gradient buttons
- No shadow on buttons
- No `radius.full` on buttons (use `radius.md`)
- Hover = darker shade of the same color, nothing else

---

## Forms

- Input fields: border `color.border.input`, radius `radius.md`, height `size.inputH`, padding `space.2`/`space.3`, size `font.size.sm`
- Focus: border and ring using `color.primary.base` (only functional ring)
- Labels: `color.text.label`, weight `font.weight.medium`, size `font.size.sm`, above the field
- Error state: border `color.status.error`, message text `color.status.error`, size `font.size.sm`
- No floating labels, no animated placeholders

---

## Layout

- Max content width: `size.contentMax` token, centered
- Sidebar navigation: solid right border using `color.border` + `borderWidth` tokens, not shadow-separated
- Page padding: `space.4` scaling up to `space.6` / `space.8` at larger breakpoints
- Use CSS Grid or Flexbox — no absolute positioning for layout
- Mobile-first responsive design

---

## Icons

- Use Lucide React (`lucide-react`) as the icon library
- Size: `size.iconSm` inline, `size.iconMd` for buttons, `size.iconLg` for navigation
- Color: match the surrounding text color token
- No filled/solid icon variants — use stroke (outline) icons only

---

## What NOT to Use

| Pattern | Why |
|---------|-----|
| Shadows for separation | Creates depth hierarchy we don't want |
| Gradient backgrounds | Not classic/professional |
| Backdrop blur | Trendy glassmorphism effect |
| Ring/outline for decoration | Only use ring for focus states |
| Pill-shaped buttons | Look informal |
| Decorative animations | No bouncing, pulsing, spinning decorations |
| Transparent/opacity backgrounds | Use solid colors from tokens |
| Custom scrollbars | Use native browser scrollbars |
| Hardcoded values in components | All colors, spacing, radii, sizes must come from the central token file |

---

## Component Checklist

Before building any UI component, verify:

- [ ] **No hardcoded values** — all colors, spacing, radii, sizes, and typography reference the central token file
- [ ] No shadows anywhere
- [ ] No gradients anywhere
- [ ] Borders use `color.border` / `color.border.input` tokens
- [ ] Text uses `color.text.*`, `font.size.*`, `font.weight.*` tokens
- [ ] Spacing uses `space.*` tokens — no magic numbers
- [ ] Radii use `radius.*` tokens
- [ ] Buttons follow the primary/secondary/danger patterns above
- [ ] All text is internationalized (see [internationalization.md](./internationalization.md))
- [ ] Responsive across breakpoints
- [ ] Keyboard accessible (focusable, visible focus ring)