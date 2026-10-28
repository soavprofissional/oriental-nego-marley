---
name: git-safety-recovery
description: Work safely with Git and recover from mistakes. Use when committing, branching, rebasing, stashing, or recovering lost work. Covers safe workflows, undo operations, conflict resolution, and secret protection.
---

# Git Safety & Recovery

Protect history and recover gracefully from mistakes.

## Safety Rules

- Never force-push to shared/main branches.
- Never rewrite published history without team agreement.
- Never commit secrets, tokens, or `.env` files.
- Always check `git status` and `git diff` before committing.
- Use small, focused commits; one logical change per commit.
- Prefer new commits over amending published ones.

## Daily Workflow

```bash
git status
git diff
git add -p          # stage hunks selectively
git commit -m "..."
git push
```

- Review staged diff: `git diff --cached`.
- Keep `main`/`master` clean; work on feature branches.
- Pull with rebase for linear history only if team agrees: `git pull --rebase`.

## Branching

- Branch naming: `feat/...`, `fix/...`, `chore/...`.
- Delete merged branches locally and remotely.
- Avoid long-lived branches; integrate frequently.

## Undo & Recovery

- Unstage: `git restore --staged <file>` (or `git reset HEAD`).
- Discard working changes: `git restore <file>` (destructive; confirm first).
- Amend last commit (unpushed only): `git commit --amend`.
- Undo last commit keeping changes: `git reset --soft HEAD~1`.
- Undo last commit discarding changes: `git reset --hard HEAD~1` (destructive).
- Recover deleted commits: `git reflog` then `git checkout <sha>` / `git reset`.
- Recover dropped stash: `git fsck --lost-found` or reflog.
- Restore file from another branch: `git checkout <branch> -- <file>`.

## Stash

- `git stash push -m "description"`; list with `git stash list`.
- Apply without dropping: `git stash apply`; drop after: `git stash drop`.
- Stashes are shared across worktrees — avoid in multi-worktree setups.

## Rebase & Conflicts

- Rebase onto updated base: `git rebase main`.
- Resolve conflicts file by file; run tests after.
- Abort if needed: `git rebase --abort`.
- Use `git mergetool` only if configured.

## Secrets Protection

- Add `.env`, `*.pem`, `*.key` to `.gitignore` before first commit.
- Use pre-commit hooks to scan for secrets (gitleaks, trufflehog).
- If a secret is committed: rotate it immediately, then remove from history (`git filter-repo`), force-push only with team approval.
- Never rewrite history to hide a secret without rotating it first.

## History Inspection

- `git log --oneline --graph --all`.
- `git blame <file>` to find who changed a line.
- `git bisect start` to find regression-introducing commit.

## Checklist Before Pushing

- [ ] `git status` clean except intended changes.
- [ ] No secrets or large binaries staged.
- [ ] Commit messages follow convention.
- [ ] Tests pass locally.
- [ ] Branch is up to date with base.
