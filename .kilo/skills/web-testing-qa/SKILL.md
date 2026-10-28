---
name: web-testing-qa
description: Test and quality-assure web applications. Use when writing unit/integration/E2E tests, setting up test tooling, or running QA checklists. Covers test strategy, frameworks, mocking, accessibility testing, and CI integration.
---

# Web Testing & QA

Catch regressions before users do.

## Test Strategy (Testing Pyramid)

- Unit tests: pure logic, utilities, reducers (fast, many).
- Integration tests: components with real DOM, API mocking (moderate).
- E2E tests: critical user journeys (few, slow, high value).
- Don't chase 100% coverage; prioritize risk and critical paths.

## Frameworks

- Unit/integration: Vitest or Jest + Testing Library.
- E2E: Playwright (preferred) or Cypress.
- Component: Storybook + interaction tests.
- Visual regression: Playwright screenshots or Chromatic.

## Writing Good Tests

- Test behavior, not implementation details.
- Use semantic queries (`getByRole`, `getByLabelText`) over test IDs.
- Arrange-Act-Assert structure.
- One assertion concept per test; clear failure messages.
- Avoid flaky tests: no arbitrary `sleep`; wait for conditions.
- Reset state between tests; isolate side effects.

## Mocking

- Mock at boundaries (network, time, storage), not internal modules.
- Use MSW for API mocking in both tests and dev.
- Don't over-mock; prefer real implementations when cheap.

## Accessibility Testing

- Automated: axe-core in unit/integration tests.
- Manual: keyboard walkthrough and screen reader smoke tests.
- Include a11y assertions in E2E for critical flows.

## Performance & Quality Gates

- Run lint + typecheck + tests in CI on every PR.
- Fail CI on coverage drop below threshold (if configured).
- Lighthouse CI for performance/a11y budgets.
- Bundle size checks for regressions.

## E2E Best Practices

- Use stable selectors (`data-testid` as last resort; prefer roles).
- Reuse auth state via storage state to speed up.
- Run in parallel; shard across CI.
- Retry only genuinely flaky tests; fix root cause otherwise.
- Capture traces/screenshots on failure.

## Manual QA Checklist

- [ ] Happy path and error path for each feature.
- [ ] Empty states, loading states, error states.
- [ ] Form validation messages and focus.
- [ ] Responsive breakpoints.
- [ ] Cross-browser (Chrome, Firefox, Safari, Edge).
- [ ] Dark/light modes.
- [ ] Offline/slow network behavior.
- [ ] Console clean (no errors/warnings).

## Bug Report Template

- Title, environment, steps to reproduce, expected vs actual, screenshots/logs, severity.

## Checklist Before Shipping

- [ ] Unit/integration tests pass.
- [ ] E2E critical paths pass.
- [ ] a11y automated checks pass.
- [ ] No flaky tests introduced.
- [ ] CI green on the PR.
