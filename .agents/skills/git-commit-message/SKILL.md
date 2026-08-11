---
name: git-commit-message
description: Rules for generating concise git commit messages without extra formatting or markdown codeblocks when requested by the user.
---

# Git Commit Message Skill

When the user requests a git message (e.g., "git message", "only message"):
1. Output ONLY the raw commit title and optional bulleted body.
2. Do NOT add `git commit -m` commands.
3. Do NOT wrap in backticks or code blocks.
4. Do NOT add conversational intro or outro text.
