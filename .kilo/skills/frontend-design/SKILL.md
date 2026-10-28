---
name: frontend-design
description: Design and implement polished, maintainable frontend interfaces (HTML/CSS/JS). Use when building or refactoring UI components, pages, layouts, or styling. Covers component structure, design tokens, responsive layout, performance, and visual consistency.
---

# Frontend Design

Build interfaces that are consistent, accessible, performant, and easy to maintain.

## Principles

- Mobile-first: start from the smallest viewport, enhance upward.
- Semantic HTML first; add ARIA only when native semantics are insufficient.
- One source of truth for design tokens (colors, spacing, typography, radii, shadows).
- Prefer CSS over JS for layout, animation, and state-driven styling.
- Keep components small, composable, and free of business logic.

## Design Tokens

Define tokens as CSS custom properties on `:root` (and a dark variant via `[data-theme]` or `@media (prefers-color-scheme)`):

```css
:root {
  --color-bg: #ffffff;
  --color-text: #111827;
  --color-primary: #2563eb;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --font-sans: system-ui, -apple-system, sans-serif;
  --radius: 0.5rem;
  --shadow-sm: 0 1px 2px rgb(0 0 0 / 0.05);
}
```

Rules:
- Never hardcode a color/spacing value in a component; reference a token.
- Provide light and dark values; test both.
- Respect `prefers-reduced-motion` and `prefers-contrast`.

## Layout

- Use Flexbox for 1D, Grid for 2D.
- Avoid fixed widths; use `max-width`, `min()`, `clamp()`, and fluid typography (`clamp(1rem, 2.5vw, 1.25rem)`).
- Use a consistent container (`max-width` + horizontal padding) instead of per-element margins.
- Avoid deep nesting; flatten where possible.

## Components

- One file per component when the project uses modules; otherwise group by section with clear comments-free structure.
- Name classes with a predictable convention (BEM or utility classes); do not mix.
- Keep state classes explicit (`is-open`, `is-loading`) and toggle via JS, not inline styles.
- Provide hover/focus/active/disabled states for every interactive element.

## Typography

- Use a type scale (e.g. 1.25 ratio) and a limited set of weights.
- Set `line-height` per context (1.5 body, 1.2 headings).
- Limit line length to ~65-75 characters (`max-width: 65ch`).

## Images & Media

- Always set `width`/`height` (or `aspect-ratio`) to prevent CLS.
- Use `loading="lazy"` and `decoding="async"` for below-the-fold images.
- Prefer modern formats (WebP/AVIF) with fallbacks.
- Provide meaningful `alt`; use `alt=""` for decorative images.

## Performance

- Minimize render-blocking CSS/JS; defer non-critical scripts.
- Avoid layout thrashing; batch DOM reads/writes.
- Debounce/throttle scroll/resize handlers.
- Prefer `transform`/`opacity` for animations (compositor-only).
- Measure with Lighthouse and Web Vitals (LCP, CLS, INP).

## Checklist Before Shipping

- [ ] Semantic HTML and keyboard navigation verified.
- [ ] Focus styles visible and consistent.
- [ ] Responsive at 320px, 768px, 1024px, 1440px.
- [ ] No horizontal scroll on mobile.
- [ ] Dark mode renders correctly.
- [ ] Images optimized and sized.
- [ ] No console errors/warnings.
- [ ] Lighthouse accessibility score >= 90.
