import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';

export function Loader({ label = 'Loading…' }) {
  return (
    <div className="loader" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <p className="loader-label">{label}</p>
      <div className="progress" aria-hidden="true"><span /></div>
      <p className="muted small">This usually takes a few seconds</p>
    </div>
  );
}

export function Breadcrumbs({ items }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <Link to="/">Home</Link>
      {items.map((it, i) => (
        <span key={i}>
          <span className="crumb-sep" aria-hidden="true">›</span>
          {it.to ? <Link to={it.to}>{it.label}</Link> : <span aria-current="page">{it.label}</span>}
        </span>
      ))}
    </nav>
  );
}

export function PageHeader({ title, subtitle, crumbs, children }) {
  useEffect(() => {
    document.title = `${title} – Student Portal (Concept)`;
  }, [title]);
  return (
    <header className="page-header">
      {crumbs && <Breadcrumbs items={crumbs} />}
      <div className="page-header-row">
        <div>
          <h1>{title}</h1>
          {subtitle && <p className="lead">{subtitle}</p>}
        </div>
        {children && <div className="page-header-actions">{children}</div>}
      </div>
    </header>
  );
}

export function Modal({ open, title, children, onClose, actions }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement;
    ref.current?.querySelector('button, input, select')?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      prev?.focus?.();
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" ref={ref}>
        <div className="modal-head">
          <h2 id="modal-title">{title}</h2>
          <button className="icon-btn" aria-label="Close" onClick={onClose}><Icon name="close" size={20} /></button>
        </div>
        <div className="modal-body">{children}</div>
        {actions && <div className="modal-actions">{actions}</div>}
      </div>
    </div>
  );
}

export function StatusPill({ ok, children }) {
  return (
    <span className={`pill ${ok ? 'pill-ok' : 'pill-warn'}`}>
      <Icon name={ok ? 'check' : 'alert'} size={14} />
      {children}
    </span>
  );
}

export function EmptyState({ title, children }) {
  return (
    <div className="empty">
      <p className="empty-title">{title}</p>
      {children}
    </div>
  );
}
