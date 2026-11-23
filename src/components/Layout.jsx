import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Icon from './Icon.jsx';
import { useStore, useToast } from '../lib/store.jsx';

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/external/brightspace', label: 'Brightspace' },
  { to: '/external/email', label: 'Email' },
  { to: '/downloads', label: 'Downloads' },
];

function AccountMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { state, dispatch } = useStore();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const onDoc = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const name = state.profile.preferredName || 'Student';
  return (
    <div className="account" ref={ref}>
      <button
        className="account-btn"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="avatar" aria-hidden="true">{name[0]?.toUpperCase()}</span>
        <span className="account-name">{name}</span>
        <Icon name="chevron" size={16} />
      </button>
      {open && (
        <div className="menu" role="menu">
          <p className="menu-label">Signed in as {name} (demo)</p>
          <Link role="menuitem" to="/personal" onClick={() => setOpen(false)}>My profile</Link>
          <button
            role="menuitem"
            onClick={() => {
              dispatch({ type: 'reset' });
              setOpen(false);
              toast('Demo data has been reset.');
            }}
          >
            Reset demo data
          </button>
          <button
            role="menuitem"
            onClick={() => {
              setOpen(false);
              navigate('/signed-out');
            }}
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <a href="#main" className="skip">Skip to main content</a>
      <div className="concept-banner">
        Unofficial student concept redesign for an HCI course. Not affiliated with Memorial University. All data is made up.
      </div>
      <header className="topbar">
        <div className="topbar-inner">
          <Link to="/" className="brand" aria-label="Student Portal home">
            <span className="brand-mark" aria-hidden="true"><Icon name="degree" size={20} /></span>
            <span className="brand-text">Student Portal</span>
            <span className="brand-tag">Concept</span>
          </Link>

          <nav className={`mainnav ${mobileOpen ? 'open' : ''}`} aria-label="Main">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end}>{n.label}</NavLink>
            ))}
          </nav>

          <div className="topbar-right">
            <NavLink to="/help" className="help-btn">
              <Icon name="help" size={18} />
              <span>Help</span>
            </NavLink>
            <AccountMenu />
            <button
              className="icon-btn hamburger"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((o) => !o)}
            >
              <Icon name={mobileOpen ? 'close' : 'menu'} />
            </button>
          </div>
        </div>
      </header>

      <main id="main" className="container">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <p>Concept redesign based on a heuristic evaluation of a university student portal (Nielsen's 10 usability heuristics).</p>
          <p className="muted">Not an official website. No real accounts, records or payments are used.</p>
        </div>
      </footer>
    </>
  );
}
