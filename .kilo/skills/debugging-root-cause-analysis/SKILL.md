---
name: debugging-root-cause-analysis
description: Systematically debug web applications and find root causes. Use when investigating bugs, errors, regressions, or unexpected behavior. Covers reproduction, isolation, hypothesis testing, logging, and fix verification.
---

# Debugging & Root Cause Analysis

Find the real cause, not just the symptom, and verify the fix.

## Workflow

1. **Reproduce** reliably with minimal steps and a minimal case.
2. **Observe** exact error message, stack trace, network/console output, and state.
3. **Isolate** the failing layer (UI, state, API, DB, build, env).
4. **Hypothesize** one cause at a time; write it down.
5. **Test** the hypothesis with the smallest possible change or probe.
6. **Fix** at the root cause; avoid patching symptoms.
7. **Verify** the fix resolves the issue and adds a regression guard.

## Reproduction

- Capture: URL/route, user role, input data, browser/device, env (dev/prod).
- Create a minimal reproduction (HTML/JS snippet or test) when possible.
- Check if it reproduces in incognito / fresh profile (extensions, cache).
- Confirm whether it is deterministic or intermittent (timing, race, flaky).

## Investigation Tools

- Browser DevTools: Console, Network, Sources, Performance, Memory.
- `debugger` statement and breakpoints (conditional breakpoints).
- `console.trace()`, `console.table()`, `console.time()`.
- Network tab: status, payload, headers, timing, CORS.
- React/Vue DevTools for component state and re-rend causes.
- `git bisect` to locate the introducing commit.

## Common Root Causes

- Stale closure / missing dependency in `useEffect`.
- Async race conditions and unhandled promise rejections.
- Mutating state instead of replacing it.
- Incorrect `key` in lists causing wrong diffing.
- CSS specificity or cascade surprises.
- Environment/config differences between dev and prod.
- Timezone/locale handling.
- Off-by-one in pagination or indexing.

## Logging & Probes

- Add temporary, clearly-marked logs; remove before commit.
- Log inputs and outputs at boundaries (API calls, reducers).
- Use feature flags to toggle suspect code paths.
- Avoid logging secrets or PII.

## Hypothesis Testing

- Change one variable at a time.
- If a fix "works" but you don't know why, keep investigating.
- Revert the fix and confirm the bug returns (proves causality).

## Fix & Verification

- Fix the cause, not the symptom; refactor if needed.
- Add a test that fails before the fix and passes after.
- Run lint, typecheck, and the relevant test suite.
- Test adjacent flows for regressions.
- Document non-obvious fixes in commit message or comment (code only when needed).

## When Stuck

- Rubber-duck: explain the problem aloud step by step.
- Reduce scope: comment out half the code (binary search).
- Check recent changes (`git log`, `git diff`).
- Ask: what changed last? env, dependency, data, config.
- Take a break; fresh eyes find bugs faster.

## Checklist Before Closing

- [ ] Root cause identified and explained.
- [ ] Fix is minimal and targeted.
- [ ] Regression test added or manual steps documented.
- [ ] No new console errors.
- [ ] Verified in original reproduction scenario.
