---
name: creative-coding-web-animation
description: Create engaging web animations and creative coding effects (Canvas, SVG, WebGL, CSS). Use when adding motion, micro-interactions, particle/visual effects, or generative visuals. Covers easing, performance, accessibility (reduced motion), and animation lifecycle.
---

# Creative Coding & Web Animation

Add motion that communicates, delights, and stays performant.

## Motion Principles

- Motion should have purpose: guide attention, show state change, or provide feedback.
- Prefer subtle, fast transitions (150-300ms) for UI; longer for storytelling.
- Use easing: `ease-out` for entrances, `ease-in` for exits, `ease-in-out` for moves.
- Never animate layout properties when a transform/opacity alternative exists.

## CSS Animations

- Use `@keyframes` + `animation` for declarative loops; `transition` for state changes.
- Animate only `transform` and `opacity` for 60fps.
- Respect `prefers-reduced-motion: reduce` — disable or simplify non-essential motion.
- Use `will-change` sparingly and only on elements about to animate.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## JavaScript Animation

- Use `requestAnimationFrame` for custom loops; cancel on unmount.
- Prefer Web Animations API for complex sequences over CSS when JS control is needed.
- Debounce/throttle input-driven animations (mouse move, scroll).
- Store animation handles and cancel them to avoid leaks and ghost frames.

## Canvas / SVG / WebGL

- Size canvas to device pixel ratio; redraw on resize with debouncing.
- Clear and redraw only changed regions when possible.
- Use `OffscreenCanvas` + worker for heavy generative work.
- For SVG, animate `transform` via CSS; avoid animating many attributes.
- Dispose WebGL resources (buffers, textures, programs) on teardown.

## Micro-interactions

- Provide immediate feedback (<100ms) on click/tap.
- Use spring-like easing for playful UI; linear only for progress bars.
- Keep hover effects reversible and non-blocking.
- Avoid motion that causes vestibular discomfort (parallax, large zooms).

## Performance Budget

- Target 60fps; profile with Chrome Performance tab.
- Limit concurrent animations; stagger instead of simultaneous.
- Pause animations when tab is hidden (`visibilitychange`).
- Reduce particle counts on low-end devices (detect via `navigator.hardwareConcurrency`).

## Accessibility

- Honor `prefers-reduced-motion`.
- Never rely on motion alone to convey information.
- Provide a static fallback for essential content.
- Avoid flashing content >3 times/sec (seizure risk).

## Checklist Before Shipping

- [ ] Reduced-motion mode tested and functional.
- [ ] No jank on mid-range mobile.
- [ ] Animations pause when tab hidden.
- [ ] No memory leaks after route changes.
- [ ] Focus not trapped by animated elements.
