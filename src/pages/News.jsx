import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PageHeader } from '../components/ui.jsx';
import { NEWS } from '../lib/data.js';
import { formatDate } from '../lib/store.jsx';

export default function News() {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'center' });
  }, [hash]);

  return (
    <>
      <PageHeader title="News & Announcements" crumbs={[{ label: 'News' }]} />
      <div className="news-page">
        {NEWS.map((n) => (
          <article key={n.id} id={n.id} className={`card ${hash === `#${n.id}` ? 'highlight' : ''}`}>
            <p className="muted small">{formatDate(n.date)}</p>
            <h2 className="h3">{n.title}</h2>
            <p>{n.body}</p>
          </article>
        ))}
      </div>
    </>
  );
}
