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



## AI Workflow

**Planning:** I used Claude Code to scope each task before touching code — gave it the feature brief and had it propose the component shape and state design. This kept tasks small and prevented scope creep.

**Executing:** Claude Code wrote every component (MessageBubble, ChatInput, HintRevealButtons, callClaude, buildSystemPrompt). I reviewed the diff and approved. All 12 tasks went as-proposed with no rollbacks.

**Polishing:** Claude Code again for Task 11 — accessibility, focus rings, Enter-to-send, bubble contrast. Having it run through a checklist was faster than remembering each detail myself.

**Reviewing:** I manually tested each feature in the browser before logging it done. Code review was eyes-on-diff, not a separate tool.

**One clear win:** Tasks 5 and 8 — using prompt engineering instead of branching UI logic for Socratic behavior and reasoning feedback. The model handled nuance that would have taken fragile conditionals.

**One mid-task switch:** For Task 9 I started thinking about a turn-count heuristic to detect mastery, then switched to embedding `[[UNLOCKED]]` in the model's own response. Letting the AI judge understanding was more reliable than any hardcoded rule.

## Reflection

**Where the agentic workflow let me ship things I couldn't have alone in 4 hours**

    Twelve features in a single session — API integration, a complete component hierarchy, Tailwind accessibility, error rollback, animated loading states — would have taken me a full day if I were writing each piece from scratch and looking things up as I went. The thing that surprised me most was the Anthropic API integration in Task 4. I knew roughly what a fetch call looked like, but I didn't know the exact header combination required for direct browser-side access, including `anthropic-dangerous-allow-direct-api-key-access`. Claude Code had that right immediately. Without it I would have lost an hour to docs and CORS debugging before writing a single line of real logic.

    **Where I had to step in**

    Task 1. Claude generated a solid CLAUDE.md but it didn't know what a Socratic tutor was actually supposed to feel like — it described the app as a chat interface, not as a teaching philosophy. I added the Socratic prompt strategy section myself because that was the core product decision. The AI can execute against a brief but it can't write the brief. That's still mine.

    **What this project revealed about my judgment and my knowledge gaps**

    This is the question I keep sitting with. The gap I noticed most wasn't technical — it was evaluative. Every task came back as-proposed. I approved all twelve without a single rollback. On one hand, the output was genuinely good. On the other hand, I have to ask myself: was I actually reviewing these diffs, or just reading them? There's a difference between understanding code and recognizing that code looks plausible. I can read a React component and follow what it does. What I'm less sure about is whether I would have caught a subtle bug — an off-by-one in state, a stale closure in a `useCallback`, a race condition between `setMessages` calls. I didn't encounter those here, but I don't know if that's because the code was clean or because my review wasn't deep enough to find them.

    The knowledge gap that became clearest: prompt engineering. I've read about it but I've never designed a prompt from scratch that had to be reliable under adversarial inputs. The `buildSystemPrompt` function worked, but I couldn't tell you with confidence why the `[[UNLOCKED]]` token approach is better than alternatives, or what breaks it. I accepted it because it made sense. That's not the same as knowing it.

    **How I'll bring this into my internship**

The workflow I'll actually use: read the codebase first, then use Claude Code to navigate and extend it, not to generate from nothing. On day one I'll spend the first hour reading existing code so I understand the conventions and constraints before I ask AI to touch anything. The mistake I want to avoid is treating Claude Code as a shortcut past understanding — using it to ship features I don't actually comprehend. The risk isn't that the AI writes bad code. The risk is that it writes plausible code I can't reason about when something breaks at 2am. The first thing I'll do is make sure I could explain every function it writes, not just approve it.
