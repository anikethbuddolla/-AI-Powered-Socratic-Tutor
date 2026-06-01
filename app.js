const { useState, useEffect, useRef, useCallback } = React;

const SUBJECTS = [
  { id: 'math',    label: 'Math',            icon: '∑'  },
  { id: 'science', label: 'Science',          icon: '⚗' },
  { id: 'history', label: 'History',          icon: '🏛' },
  { id: 'lit',     label: 'Literature',       icon: '📚' },
  { id: 'phil',    label: 'Philosophy',       icon: '💭' },
  { id: 'cs',      label: 'Computer Science', icon: '💻' },
];

// Maps raw trigger strings sent to the API to friendly chat bubble labels
const DISPLAY_LABELS = {
  HINT_REQUEST:   '💡 Give me a hint',
  REVEAL_REQUEST: '📖 Just tell me the answer',
};

function buildSystemPrompt(subject) {
  return `You are a Socratic tutor helping a student learn ${subject}.

Teaching rules:
- Guide students to discover answers through questioning — never state the answer outright unless explicitly requested
- Ask exactly ONE focused question per response
- Start by probing what the student already knows
- Warmly affirm correct reasoning: "Exactly — and that works because…"
- Gently redirect misconceptions: "Interesting — let's examine that. What if…?"
- Each question must build directly on the student's previous response

Reasoning quality feedback:
- After every student response, briefly acknowledge their reasoning before asking the next question. Affirm what is correct; gently correct what is wrong with encouragement.

Special commands — follow these precisely:
- Message is "HINT_REQUEST": give a helpful nudge (clue, analogy, or related fact) that steers toward the answer without stating it. Do not ask a question.
- Message is "REVEAL_REQUEST": switch to direct teaching mode and give a clear, complete explanation of the answer.

Mastery detection:
- When the student demonstrates genuine understanding through their own words and reasoning (not just agreement), append the exact token [[UNLOCKED]] at the very end of your message.
- Use [[UNLOCKED]] only once per conversation, only when you are truly confident they understand.`;
}

async function callClaude(apiKey, subject, messages) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-allow-direct-api-key-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: buildSystemPrompt(subject),
      messages,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Request failed (${res.status})`);
  }
  const data = await res.json();
  return data.content[0].text;
}

// ─── Setup screens ─────────────────────────────────────────────────────────────

function ApiKeySetup({ onSubmit }) {
  const [key, setKey] = useState('');
  const submit = (e) => {
    e.preventDefault();
    if (key.trim()) onSubmit(key.trim());
  };
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl">🎓</span>
          <div>
            <h1 className="text-2xl font-bold text-indigo-800">Socratic Tutor</h1>
            <p className="text-slate-500 text-sm">AI-powered guided learning</p>
          </div>
        </div>
        <p className="text-slate-600 text-sm mb-5">
          Enter your Anthropic API key to begin. It is stored in memory only and never persisted.
        </p>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="sk-ant-..."
            autoFocus
            className="border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            disabled={!key.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl py-2.5 font-semibold text-sm transition-colors"
          >
            Begin →
          </button>
        </form>
      </div>
    </div>
  );
}

function SubjectSelector({ onSelect }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-indigo-800 mb-1">What are we exploring?</h2>
        <p className="text-slate-500 text-sm mb-6">Pick a subject to begin your session.</p>
        <div className="grid grid-cols-2 gap-3">
          {SUBJECTS.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelect(s.label)}
              className="flex items-center gap-3 border border-slate-200 rounded-xl px-4 py-3.5 hover:border-indigo-400 hover:bg-indigo-50 transition-all text-left focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <span className="text-2xl w-8 text-center">{s.icon}</span>
              <span className="font-medium text-slate-700">{s.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Chat components ────────────────────────────────────────────────────────────

function MessageBubble({ msg }) {
  const isStudent = msg.role === 'user';
  const text = (DISPLAY_LABELS[msg.content] || msg.content)
    .replace(/\[\[UNLOCKED\]\]/g, '')
    .trim();

  if (isStudent) {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[78%] bg-indigo-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm shadow-sm leading-relaxed">
          {text}
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[78%]">
        <p className="text-xs font-semibold text-indigo-500 mb-1 ml-1 uppercase tracking-wide">Tutor</p>
        <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-slate-700 shadow-sm leading-relaxed whitespace-pre-wrap">
          {text}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[78%]">
        <p className="text-xs font-semibold text-indigo-500 mb-1 ml-1 uppercase tracking-wide">Tutor</p>
        <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3.5 shadow-sm">
          <div className="flex gap-1.5 items-center">
            {[0, 150, 300].map((delay) => (
              <span
                key={delay}
                className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ConceptUnlockedBanner() {
  return (
    <div className="mx-4 mb-2 bg-emerald-50 border border-emerald-300 rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm">
      <span className="text-2xl flex-shrink-0">🎉</span>
      <div>
        <p className="font-semibold text-emerald-800 text-sm">Concept Unlocked!</p>
        <p className="text-emerald-700 text-xs mt-0.5">You demonstrated genuine understanding. Well done!</p>
      </div>
    </div>
  );
}

function ErrorBanner({ message, onDismiss }) {
  return (
    <div className="mx-4 mt-3 bg-rose-50 border border-rose-300 rounded-xl px-4 py-3 flex items-start justify-between gap-2 shadow-sm">
      <p className="text-rose-700 text-sm flex-1">{message}</p>
      <button
        onClick={onDismiss}
        aria-label="Dismiss error"
        className="text-rose-400 hover:text-rose-600 text-xl leading-none flex-shrink-0 -mt-0.5"
      >
        ×
      </button>
    </div>
  );
}

function HintRevealButtons({ onHint, onReveal, disabled }) {
  return (
    <div className="flex gap-2">
      <button
        onClick={onHint}
        disabled={disabled}
        className="flex-1 border border-amber-300 bg-amber-50 hover:bg-amber-100 disabled:opacity-40 text-amber-800 rounded-xl px-3 py-2 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        💡 Give me a hint
      </button>
      <button
        onClick={onReveal}
        disabled={disabled}
        className="flex-1 border border-rose-300 bg-rose-50 hover:bg-rose-100 disabled:opacity-40 text-rose-700 rounded-xl px-3 py-2 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-rose-400"
      >
        📖 Just tell me
      </button>
    </div>
  );
}

function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('');
  const ref = useRef(null);

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.focus();
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
    // Auto-resize textarea up to 120px
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="flex gap-2 items-end">
      <textarea
        ref={ref}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={1}
        placeholder="Ask or share your thinking… (Enter to send, Shift+Enter for new line)"
        className="flex-1 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none disabled:opacity-50 leading-relaxed"
      />
      <button
        onClick={submit}
        disabled={disabled || !text.trim()}
        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl px-4 py-2.5 font-semibold text-sm transition-colors flex-shrink-0 h-[42px]"
      >
        Send
      </button>
    </div>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────────

function App() {
  const [apiKey, setApiKey]                   = useState('');
  const [subject, setSubject]                 = useState('');
  const [messages, setMessages]               = useState([]);
  const [isLoading, setIsLoading]             = useState(false);
  const [error, setError]                     = useState('');
  const [exchangeCount, setExchangeCount]     = useState(0);
  const [conceptUnlocked, setConceptUnlocked] = useState(false);
  const threadRef = useRef(null);

  // Scroll to newest message whenever the thread updates
  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendMessage = useCallback(async (userText) => {
    const updated = [...messages, { role: 'user', content: userText }];
    setMessages(updated);
    setIsLoading(true);
    setError('');
    try {
      const reply = await callClaude(apiKey, subject, updated);
      if (reply.includes('[[UNLOCKED]]')) setConceptUnlocked(true);
      setMessages([...updated, { role: 'assistant', content: reply }]);
      setExchangeCount((n) => n + 1);
    } catch (err) {
      setError(err.message);
      setMessages(messages); // revert the optimistic user-message add on failure
    } finally {
      setIsLoading(false);
    }
  }, [messages, apiKey, subject]);

  const handleReset = () => {
    setSubject('');
    setMessages([]);
    setExchangeCount(0);
    setConceptUnlocked(false);
    setError('');
  };

  if (!apiKey)  return <ApiKeySetup onSubmit={setApiKey} />;
  if (!subject) return <SubjectSelector onSelect={setSubject} />;

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <header className="bg-indigo-800 text-white px-5 py-3 flex items-center justify-between flex-shrink-0 shadow-lg">
        <div>
          <h1 className="font-bold text-base leading-tight">Socratic Tutor</h1>
          <p className="text-indigo-300 text-xs">{subject}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-indigo-300 text-xs">
            {exchangeCount} {exchangeCount === 1 ? 'exchange' : 'exchanges'}
          </span>
          {conceptUnlocked && (
            <span className="bg-emerald-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              ✓ Mastered
            </span>
          )}
          <button
            onClick={handleReset}
            className="border border-indigo-500 hover:border-indigo-300 text-indigo-300 hover:text-white rounded-lg px-3 py-1.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Start Over
          </button>
        </div>
      </header>

      {error && <ErrorBanner message={error} onDismiss={() => setError('')} />}

      {conceptUnlocked && (
        <div className="pt-3">
          <ConceptUnlockedBanner />
        </div>
      )}

      <div ref={threadRef} className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center pb-12">
            <span className="text-5xl mb-4">🎓</span>
            <p className="font-semibold text-slate-500">Ask anything about {subject}</p>
            <p className="text-xs text-slate-400 mt-2 max-w-xs">
              Your tutor will guide you to the answer through questions — not lectures.
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}
        {isLoading && <TypingIndicator />}
      </div>

      <div className="border-t border-slate-200 bg-white px-4 pt-3 pb-4 flex-shrink-0 flex flex-col gap-2 shadow-[0_-1px_8px_rgba(0,0,0,0.06)]">
        <HintRevealButtons
          onHint={() => sendMessage('HINT_REQUEST')}
          onReveal={() => sendMessage('REVEAL_REQUEST')}
          disabled={isLoading}
        />
        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
