# Build Log — AI-Powered Socratic Tutor

## Task 1 — Scaffold & CLAUDE.md
- Brief: Set up project foundation and conventions document
- What Claude proposed: generated CLAUDE.md with project description and conventions
- What I changed before approving: added Socratic prompt strategy section manually
- Verification: file exists, committed to git
- One thing I learned: CLAUDE.md acts as persistent memory for Claude Code sessions

## Task 2 — Static Chat UI
- Brief: Build the chat interface with message bubbles, input box, and send button — no API, hardcoded messages only
- What Claude proposed: MessageBubble, ChatInput, and TypingIndicator components with Tailwind styling
- What I changed before approving: none — approved as proposed
- Verification: UI renders, input clears on submit, messages appear in the thread
- One thing I learned: keeping each UI piece as its own small component makes the layout easy to reason about

## Task 3 — Subject Selector
- Brief: Add a subject picker (Math, Science, History, etc.) that sets session context and resets the conversation
- What Claude proposed: a 2-column grid of subject buttons that sets state and gates the chat screen
- What I changed before approving: none — approved as proposed
- Verification: selecting a subject updates visible state and clears the message thread
- One thing I learned: using a simple string in state (the subject label) is enough — no need for an ID or object

## Task 4 — Claude API Integration
- Brief: Wire the send button to the Anthropic API with a basic system prompt to confirm end-to-end plumbing
- What Claude proposed: a callClaude() fetch function using x-api-key header and /v1/messages endpoint
- What I changed before approving: none — approved as proposed
- Verification: submitting a message returns a real Claude response in the chat
- One thing I learned: the anthropic-dangerous-allow-direct-api-key-access header is required for browser-side API calls

## Task 5 — Socratic System Prompt
- Brief: Replace the generic prompt with a Socratic prompt that guides through questions and never gives direct answers first
- What Claude proposed: buildSystemPrompt() with rules for one question per response, affirming/correcting reasoning, and special command handling
- What I changed before approving: none — approved as proposed
- Verification: asking "What is the Pythagorean theorem?" returns a guiding question, not a definition
- One thing I learned: the system prompt does most of the heavy lifting — the UI just needs to pass it correctly

## Task 6 — Conversation Memory
- Brief: Pass full message history on each API call so the tutor maintains context across turns
- What Claude proposed: accumulate messages in a useState array and pass the whole array to callClaude() each time
- What I changed before approving: none — approved as proposed
- Verification: a 4-turn conversation shows the tutor building on previous student responses
- One thing I learned: the Anthropic API is stateless — you have to send the full history every time

## Task 7 — Hint & Reveal System
- Brief: Add "Give me a hint" and "Just tell me" buttons that send special trigger messages handled by the prompt
- What Claude proposed: HintRevealButtons component sending HINT_REQUEST / REVEAL_REQUEST strings, displayed as friendly labels via DISPLAY_LABELS map
- What I changed before approving: none — approved as proposed
- Verification: "Just tell me" produces a direct answer; "Give me a hint" produces a nudge without revealing the answer
- One thing I learned: routing special actions through the normal message flow keeps the code simple

## Task 8 — Reasoning Quality Feedback
- Brief: After each student response, the tutor affirms correct reasoning or gently flags misconceptions before the next question
- What Claude proposed: added feedback rules directly into the system prompt
- What I changed before approving: none — approved as proposed
- Verification: a wrong answer gets corrected with encouragement rather than ignored
- One thing I learned: prompt engineering can handle behavior that would otherwise need extra UI or logic

## Task 9 — Session Progress Indicator
- Brief: Track exchanges and surface a "concept unlocked" message when the tutor judges the student has demonstrated understanding
- What Claude proposed: exchange counter in state, [[UNLOCKED]] token detection in the API reply, and a ConceptUnlockedBanner component
- What I changed before approving: none — approved as proposed
- Verification: after a successful explanation, a visible milestone appears in the UI
- One thing I learned: embedding a special token in the AI response is a clean way to trigger UI state changes

## Task 10 — Loading & Error States
- Brief: Add a typing indicator while awaiting the API and a graceful error message if the call fails
- What Claude proposed: TypingIndicator with animated bouncing dots and a dismissable ErrorBanner; optimistic message add with rollback on failure
- What I changed before approving: none — approved as proposed
- Verification: slow response shows spinner; failed request shows error banner
- One thing I learned: rolling back the optimistic user message on error keeps the chat state consistent

## Task 11 — Visual Polish & Accessibility
- Brief: Style tutor vs. student bubbles distinctly, add Enter-key submit, and ensure sufficient color contrast for accessibility
- What Claude proposed: indigo bubbles for student, white bordered bubbles for tutor, focus:ring on all interactive elements, Enter-to-send in textarea onKeyDown
- What I changed before approving: none — approved as proposed
- Verification: tab navigation works; Enter submits; tutor and student bubbles are visually distinct
- One thing I learned: Tailwind's focus:ring utility covers most accessibility needs without extra work

## Task 12 — New Session / Reset
- Brief: Add a "Start Over" button that clears history and returns the student to the subject selector
- What Claude proposed: handleReset() that zeros all state, triggered by a button in the header
- What I changed before approving: none — approved as proposed
- Verification: clicking reset clears all messages and returns to subject selection
- One thing I learned: resetting is just setting all state back to initial values — no special cleanup needed
