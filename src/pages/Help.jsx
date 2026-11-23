import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { Loader, PageHeader, EmptyState } from '../components/ui.jsx';
import { HELP_TOPICS } from '../lib/data.js';
import { usePageLoad } from '../lib/store.jsx';

export default function Help() {
  const [q, setQ] = useState('');
  const term = q.trim().toLowerCase();

  const matches = useMemo(() => {
    if (!term) return [];
    return HELP_TOPICS.flatMap((t) =>
      t.questions
        .filter((qq) => `${t.title} ${qq.q} ${qq.steps.join(' ')}`.toLowerCase().includes(term))
        .map((qq) => ({ topic: t, q: qq.q })),
    );
  }, [term]);

  return (
    <>
      <PageHeader title="How can we help?" subtitle="Choose a topic or search for an answer." />
      <div className="search">
        <Icon name="search" size={20} />
        <label htmlFor="help-search" className="sr-only">Search help</label>
        <input
          id="help-search"
          type="search"
          placeholder='Search help topics (e.g. "reset password", "drop a course")'
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {term ? (
        <section className="card">
          <h2 className="h3">Results for "{q}"</h2>
          {matches.length ? (
            <ul className="result-list">
              {matches.map((m, i) => (
                <li key={i}>
                  <Link to={`/help/${m.topic.slug}`}>{m.q}</Link>
                  <span className="muted small"> in {m.topic.title}</span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No answers found">
              <p>Try different words, or <Link to="/help/contact">contact IT Support</Link>.</p>
            </EmptyState>
          )}
        </section>
      ) : (
        <>
          <h2 className="section-label">Help topics</h2>
          <div className="tile-grid">
            {HELP_TOPICS.map((t) => (
              <Link key={t.slug} to={`/help/${t.slug}`} className="tile">
                <span className="tile-icon"><Icon name={t.icon} size={26} /></span>
                <span>
                  <span className="tile-title">{t.title}</span>
                  <span className="tile-desc">{t.summary}</span>
                </span>
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}

function Feedback() {
  const [answer, setAnswer] = useState(null);
  if (answer)
    return (
      <p className="feedback-thanks">
        {answer === 'yes' ? 'Thanks for your feedback!' : <>Sorry about that. <Link to="/help/contact">Contact IT Support</Link> for more help.</>}
      </p>
    );
  return (
    <div className="feedback">
      <span>Was this helpful?</span>
      <button className="btn btn-small btn-outline" onClick={() => setAnswer('yes')}>Yes</button>
      <button className="btn btn-small btn-outline" onClick={() => setAnswer('no')}>No</button>
    </div>
  );
}

export function HelpTopic() {
  const { slug } = useParams();
  const topic = HELP_TOPICS.find((t) => t.slug === slug);
  const loading = usePageLoad(350);

  if (!topic)
    return (
      <EmptyState title="Help topic not found">
        <Link to="/help" className="btn">Back to Help</Link>
      </EmptyState>
    );

  return (
    <>
      <PageHeader title={`${topic.title} Help`} crumbs={[{ label: 'Help', to: '/help' }, { label: topic.title }]} />
      <Link to="/help" className="back-link"><Icon name="back" size={16} /> Back to Help</Link>
      {loading ? (
        <Loader label="Loading help…" />
      ) : (
        <div className="help-topic">
          {topic.questions.map((qq, i) => (
            <section key={i} className="card">
              <h2 className="h3">{qq.q}</h2>
              <ol className="steps">
                {qq.steps.map((s, j) => (
                  <li key={j}><span className="step-num">{j + 1}</span><span>{s}</span></li>
                ))}
              </ol>
            </section>
          ))}
          {topic.cta && (
            <Link to={topic.cta.to} className="btn btn-lg">
              {topic.cta.label} <Icon name="arrow" size={18} />
            </Link>
          )}
          <Feedback />
          <p className="muted">Still need help? <Link to="/help/contact" className="link">Contact IT Support</Link></p>
        </div>
      )}
    </>
  );
}
