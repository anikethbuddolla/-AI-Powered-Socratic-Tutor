## Summary

- Adds `index.html` — minimal CDN shell loading React 18, Tailwind CSS, and Babel standalone
- Adds `app.js` — full React SPA implementing all 12 tasks from TASK.md

## Task coverage

| Task | Feature | Implementation |
|------|---------|----------------|
| 2 | Static Chat UI | MessageBubble, ChatInput, auto-resizing textarea |
| 3 | Subject Selector | SubjectSelector grid (Math, Science, History, Literature, Philosophy, CS) |
| 4 | Claude API Integration | callClaude() via fetch to /v1/messages |
| 5 | Socratic System Prompt | buildSystemPrompt() — questions only, never answers first |
| 6 | Conversation Memory | Full messages array passed on every API call |
| 7 | Hint & Reveal System | HintRevealButtons sending HINT_REQUEST / REVEAL_REQUEST triggers |
| 8 | Reasoning Quality Feedback | System prompt instructs Claude to affirm/correct each response |
| 9 | Session Progress Indicator | Exchange counter + [[UNLOCKED]] token detection → ConceptUnlockedBanner |
| 10 | Loading & Error States | TypingIndicator (animated dots) + dismissable ErrorBanner |
| 11 | Visual Polish & Accessibility | Enter to send, focus rings on all controls, distinct tutor/student bubbles |
| 12 | New Session / Reset | Start Over button clears all state and returns to subject selector |

## Test plan

- [ ] Open index.html in a browser — API key screen appears
- [ ] Enter a valid Anthropic API key and click Begin
- [ ] Select a subject — chat screen loads with empty state placeholder
- [ ] Ask "What is the Pythagorean theorem?" — tutor responds with a question, not a definition
- [ ] Send a follow-up — tutor builds on the previous response
- [ ] Click "Give me a hint" — nudge appears without revealing the answer
- [ ] Click "Just tell me" — full direct explanation appears
- [ ] After demonstrating understanding — Concept Unlocked banner and Mastered badge appear
- [ ] Click Start Over — returns to subject selector, all state cleared
- [ ] Disconnect network and send a message — error banner appears and can be dismissed

🤖 Generated with [Claude Code](https://claude.com/claude-code)
