---
name: responsive-design-accessibility
description: Build responsive, accessible web interfaces. Use when adapting layouts to breakpoints, supporting keyboards/screen readers, or auditing WCAG compliance. Covers breakpoints, fluid design, ARIA, focus management, contrast, and testing.
---

# Responsive Design & Accessibility

Make interfaces work for every device and every user.

## Responsive Strategy

- Mobile-first CSS with `min-width` media queries.
- Prefer fluid sizing (`clamp`, `%`, `vw`, `fr`) over many breakpoints.
- Common breakpoints: 320, 480, 768, 1024, 1280, 1536 (adjust to content, not devices).
- Test real devices and throttled networks, not just resized browser.
- Avoid horizontal scroll; use `overflow-x: hidden` only as a safety net, not a fix.

## Layout Techniques

- CSS Grid with `auto-fit`/`auto-fill` and `minmax()` for intrinsic responsiveness.
- Flexbox with `flex-wrap` and `gap`.
- Container queries (`@container`) for component-level responsiveness.
- Use `aspect-ratio` for media to prevent CLS.

## Touch & Interaction

- Minimum tap target 44x44px (WCAG 2.5.5).
- Avoid hover-only affordances; provide tap/click equivalents.
- Respect safe areas (`env(safe-area-inset-*)`).
- Disable double-tap zoom issues via proper viewport meta.

```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

## Accessibility (WCAG 2.2 AA)

- Perceivable: text alternatives, captions, sufficient contrast (4.5:1 normal, 3:1 large).
- Operable: keyboard access, no keyboard traps, enough time, no seizure-inducing flashes.
- Understandable: readable, predictable, input assistance.
- Robust: valid HTML, ARIA used correctly.

## Semantic HTML

- Use landmarks: `header`, `nav`, `main`, `aside`, `footer`.
- One `h1` per page; logical heading order (no skips).
- Use `button` for actions, `a` for navigation.
- Prefer native form controls; label every input (`label` with `for` or wrapping).

## ARIA

- First rule of ARIA: don't use ARIA if native HTML works.
- Use `aria-label`/`aria-labelledby` for icon buttons.
- Use `aria-live` regions for dynamic updates (status, errors).
- Use `aria-expanded`, `aria-controls` for disclosure widgets.
- Keep ARIA state in sync with visual state.

## Focus Management

- Never remove focus outlines without a replacement (`:focus-visible`).
- Move focus into modals/dialogs and trap it; restore on close.
- Skip-to-content link as first focusable element.
- Test full flow with keyboard only (Tab, Shift+Tab, Enter, Space, Esc, arrows).

## Screen Readers

- Test with NVDA/VoiceOver/TalkBack.
- Hide decorative content with `aria-hidden="true"`.
- Announce route changes in SPAs.
- Use `sr-only` utility for visually hidden but accessible text.

## Motion & Sensory

- Honor `prefers-reduced-motion`.
- Don't use color alone to convey information; add icon/text.
- Provide captions/transcripts for media.

## Testing

- Automated: axe-core, Lighthouse, pa11y.
- Manual: keyboard-only walkthrough, screen reader smoke test.
- Color contrast checker (WebAIM).
- Zoom to 200% and 400%; ensure no content loss.

## Checklist Before Shipping

- [ ] Keyboard-only navigation works end-to-end.
- [ ] Focus visible on all interactive elements.
- [ ] Contrast ratios meet AA.
- [ ] Screen reader announces key content.
- [ ] Responsive at 320px without horizontal scroll.
- [ ] Tap targets >= 44px.
- [ ] Reduced motion respected.
- [ ] axe/Lighthouse accessibility >= 90.
