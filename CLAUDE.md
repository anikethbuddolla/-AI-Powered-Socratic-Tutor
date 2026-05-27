# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

AI-Powered Socratic Tutor is a React single-page app that teaches students through guided questioning rather than direct answers. Users select a subject, ask a question, and Claude responds Socratically — probing the student's reasoning and understanding before ever revealing an answer outright.

## Tech Stack

- **React** (no framework) via CDN import
- **Tailwind CSS** via CDN
- **Anthropic API** called directly via `fetch` (no SDK)
- **No build tool** — runs as a Claude artifact or directly in the browser using CDN imports; there is no `npm`, `node_modules`, or bundler

## Coding Conventions

- Functional components only — no class components
- All state managed via React hooks; no global variables
- Functions kept small and focused (~30 lines max each)
- Descriptive variable names throughout; single-letter names only acceptable as loop indices
- Comment any non-obvious logic

## Do Not

- Add npm dependencies without explicitly asking first
- Modify the Socratic system prompt without explicit instruction to do so
- Combine multiple features into a single task — implement one thing at a time
- Use `localStorage`, `sessionStorage`, cookies, or any external APIs beyond the Anthropic API
