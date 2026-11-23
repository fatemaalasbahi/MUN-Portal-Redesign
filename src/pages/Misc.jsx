import { Link, useParams } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { EmptyState, PageHeader } from '../components/ui.jsx';

const SERVICES = {
  brightspace: { name: 'Brightspace', desc: 'the learning management system, where course sites, assignments and grades live' },
  email: { name: 'Email', desc: 'student email' },
};

export function External() {
  const { service } = useParams();
  const s = SERVICES[service];
  if (!s) return <NotFound />;
  return (
    <>
      <PageHeader title={s.name} crumbs={[{ label: s.name }]} />
      <section className="card">
        <p>In the real portal, this link would open <b>{s.name}</b>, {s.desc}, in a new tab.</p>
        <p className="muted">This concept doesn't connect to any real university services.</p>
        <Link to="/" className="btn">Back to Home</Link>
      </section>
    </>
  );
}

export function Downloads() {
  const items = [
    ['Office suite', 'Word processing, spreadsheets and slides for students'],
    ['VPN client', 'Secure access to campus resources from off campus'],
    ['Statistics software', 'Licensed for coursework in statistics and research methods'],
  ];
  return (
    <>
      <PageHeader title="Downloads" subtitle="Software available to students" crumbs={[{ label: 'Downloads' }]} />
      <section className="card">
        <ul className="doc-list">
          {items.map(([t, d]) => (
            <li key={t}>
              <div><p className="doc-title">{t}</p><p className="muted small">{d}</p></div>
              <span className="muted small">Demo only</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export function SignedOut() {
  return (
    <main className="signed-out">
      <div className="card center">
        <span className="brand-mark big" aria-hidden="true"><Icon name="degree" size={28} /></span>
        <h1>You've signed out</h1>
        <p className="muted">This is a demo, so there is no real account. Your demo data is still saved in this browser.</p>
        <Link to="/" className="btn">Return to the portal</Link>
      </div>
    </main>
  );
}

export function NotFound() {
  return (
    <EmptyState title="We couldn't find that page.">
      <p>Check the address, or go back to the home page.</p>
      <Link to="/" className="btn">Go to Home</Link>
    </EmptyState>
  );
}
