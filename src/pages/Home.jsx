import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { NEWS, HELP_TOPICS, TERM } from '../lib/data.js';
import { formatDate, useStore } from '../lib/store.jsx';

export const TOOLS = [
  { to: '/personal', icon: 'user', title: 'Personal Information', desc: 'Update your address, phone and emergency contact', keywords: 'address phone email profile contact' },
  { to: '/student-hub', icon: 'hub', title: 'Student Hub', desc: 'Your holds, academic record and documents', keywords: 'holds transcript grades gpa record documents' },
  { to: '/payments', icon: 'pay', title: 'Payment Centre', desc: 'View your account and pay fees', keywords: 'pay fees tuition balance money receipt' },
  { to: '/registration', icon: 'reg', title: 'Registration', desc: 'Check your status, add or drop courses', keywords: 'register add drop courses schedule classes crn' },
  { to: '/exams', icon: 'exam', title: 'Exam Schedule', desc: 'See your final exam dates and rooms', keywords: 'exam final schedule room calendar' },
  { to: '/degree', icon: 'degree', title: 'Degree Works', desc: 'Track your progress toward your degree', keywords: 'degree progress requirements audit graduate' },
];

function SearchBox() {
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    const tools = TOOLS.filter((t) => `${t.title} ${t.desc} ${t.keywords}`.toLowerCase().includes(term))
      .map((t) => ({ to: t.to, label: t.title, kind: 'Tool' }));
    const help = HELP_TOPICS.flatMap((h) =>
      h.questions
        .filter((qq) => `${h.title} ${qq.q}`.toLowerCase().includes(term))
        .map((qq) => ({ to: `/help/${h.slug}`, label: qq.q, kind: 'Help' })),
    );
    return [...tools, ...help].slice(0, 7);
  }, [q]);

  return (
    <form
      className="search-wrap"
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        if (results[0]) navigate(results[0].to);
      }}
    >
      <label htmlFor="home-search" className="sr-only">Search self-service and help</label>
      <div className="search">
        <Icon name="search" size={20} />
        <input
          id="home-search"
          type="search"
          autoComplete="off"
          placeholder='Search self-service (e.g. "exam schedule", "pay fees", "drop a course")'
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      {q.trim() && (
        <ul className="search-results" role="listbox">
          {results.length ? (
            results.map((r, i) => (
              <li key={i}>
                <Link to={r.to}>
                  <span className={`kind kind-${r.kind.toLowerCase()}`}>{r.kind}</span>
                  {r.label}
                </Link>
              </li>
            ))
          ) : (
            <li className="no-results">
              No matches for "{q}". Try <Link to="/help">browsing Help topics</Link>.
            </li>
          )}
        </ul>
      )}
    </form>
  );
}

export default function Home() {
  const { state, credits, balance } = useStore();
  const name = state.profile.preferredName || 'Student';
  return (
    <>
      <section className="welcome">
        <h1>Welcome, {name}</h1>
        <p className="lead">
          {TERM}: {credits} credit hours registered
          {balance > 0 ? ' · balance owing' : ' · account paid'}
        </p>
      </section>

      <SearchBox />

      <h2 className="section-label">Student Self-Service</h2>
      <div className="tile-grid">
        {TOOLS.map((t) => (
          <Link key={t.to} to={t.to} className="tile">
            <span className="tile-icon"><Icon name={t.icon} size={26} /></span>
            <span>
              <span className="tile-title">{t.title}</span>
              <span className="tile-desc">{t.desc}</span>
            </span>
          </Link>
        ))}
      </div>

      <section className="card news-card" aria-labelledby="news-h">
        <div className="card-head">
          <h2 id="news-h">News &amp; Announcements</h2>
          <Link to="/news" className="link">See all <Icon name="arrow" size={16} /></Link>
        </div>
        <ul className="news-list">
          {NEWS.slice(0, 2).map((n) => (
            <li key={n.id}>
              <span className="dot" aria-hidden="true" />
              <Link to={`/news#${n.id}`}>{n.title}</Link>
              <span className="news-date">{formatDate(n.date, { month: 'short', day: 'numeric' })}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
