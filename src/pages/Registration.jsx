import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { Loader, Modal, PageHeader, StatusPill, EmptyState } from '../components/ui.jsx';
import { CATALOG, MAX_CREDITS, TERM } from '../lib/data.js';
import { formatTime, useStore, usePageLoad, useToast, wait } from '../lib/store.jsx';

const TABS = [
  { id: 'courses', label: 'My Courses' },
  { id: 'add', label: 'Search & Add' },
  { id: 'week', label: 'Weekly Schedule' },
];

function MyCourses({ onDrop, busy }) {
  const { courses } = useStore();
  if (!courses.length)
    return (
      <EmptyState title="You aren't registered in any courses yet.">
        <p>Use <b>Search &amp; Add</b> to find courses for {TERM}.</p>
      </EmptyState>
    );
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr><th>Course</th><th>Title</th><th>Section</th><th>Days &amp; time</th><th>Instructor</th><th>Credits</th><th><span className="sr-only">Actions</span></th></tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c.crn}>
              <td data-label="Course"><b>{c.code}</b><div className="muted small">CRN {c.crn}</div></td>
              <td data-label="Title">{c.title}</td>
              <td data-label="Section">{c.section}</td>
              <td data-label="Days & time">{c.days} {formatTime(c.start)}–{formatTime(c.end)}</td>
              <td data-label="Instructor">{c.instructor}</td>
              <td data-label="Credits">{c.credits}</td>
              <td>
                <button className="btn btn-small btn-outline danger" disabled={busy === c.crn} onClick={() => onDrop(c)}>
                  {busy === c.crn ? 'Dropping…' : 'Drop'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SearchAdd({ onAdd, busy }) {
  const { canAdd, state } = useStore();
  const [q, setQ] = useState('');
  const [openOnly, setOpenOnly] = useState(false);

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return CATALOG.filter(
      (c) =>
        (!term || `${c.code} ${c.title} ${c.crn} ${c.instructor}`.toLowerCase().includes(term)) &&
        (!openOnly || c.seats > 0),
    );
  }, [q, openOnly]);

  return (
    <>
      <div className="filters">
        <div className="search search-sm">
          <Icon name="search" size={18} />
          <label htmlFor="course-search" className="sr-only">Search courses</label>
          <input id="course-search" type="search" placeholder="Course code, title, CRN or instructor" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <label className="checkbox">
          <input type="checkbox" checked={openOnly} onChange={(e) => setOpenOnly(e.target.checked)} /> Open sections only
        </label>
      </div>
      <p className="muted small">{list.length} section{list.length === 1 ? '' : 's'} found</p>
      <ul className="course-list">
        {list.map((c) => {
          const registered = state.registered.includes(c.crn);
          const block = registered ? null : canAdd(c);
          return (
            <li key={c.crn} className="course-row">
              <div className="course-main">
                <p className="course-title"><b>{c.code}</b> · {c.title}</p>
                <p className="muted small">
                  Section {c.section} · CRN {c.crn} · {c.days} {formatTime(c.start)}–{formatTime(c.end)} · {c.instructor} · {c.credits} credits
                </p>
                {block && (
                  <p className="warn-text small">
                    <Icon name="alert" size={14} /> {block.reason}{' '}
                    {block.fix && <Link to={block.fix} className="link">Fix this</Link>}
                  </p>
                )}
              </div>
              <div className="course-side">
                <span className={`seats ${c.seats ? '' : 'seats-full'}`}>{c.seats ? `${c.seats} seats left` : 'Full'}</span>
                {registered ? (
                  <StatusPill ok>Registered</StatusPill>
                ) : (
                  <button className="btn btn-small" disabled={!!block || busy === c.crn} onClick={() => onAdd(c)}>
                    {busy === c.crn ? 'Adding…' : 'Add'}
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

const DAYS = [['M', 'Mon'], ['T', 'Tue'], ['W', 'Wed'], ['R', 'Thu'], ['F', 'Fri']];
const START_HOUR = 8;
const END_HOUR = 18;

function WeekView() {
  const { courses } = useStore();
  const toPos = (t) => {
    const [h, m] = t.split(':').map(Number);
    return ((h - START_HOUR) * 60 + m) / ((END_HOUR - START_HOUR) * 60) * 100;
  };
  return (
    <div className="week" aria-label="Weekly class schedule">
      <div className="week-hours" aria-hidden="true">
        {Array.from({ length: END_HOUR - START_HOUR }, (_, i) => (
          <span key={i} style={{ top: `${(i / (END_HOUR - START_HOUR)) * 100}%` }}>{formatTime(`${START_HOUR + i}:00`)}</span>
        ))}
      </div>
      {DAYS.map(([d, label]) => (
        <div key={d} className="week-day">
          <div className="week-day-name">{label}</div>
          <div className="week-col">
            {courses.filter((c) => c.days.includes(d)).map((c) => (
              <div key={c.crn} className="week-block" style={{ top: `${toPos(c.start)}%`, height: `${toPos(c.end) - toPos(c.start)}%` }}>
                <b>{c.code}</b>
                <span>{formatTime(c.start)}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Registration() {
  const loading = usePageLoad(800);
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') || 'courses';
  const { state, dispatch, credits } = useStore();
  const toast = useToast();
  const [busy, setBusy] = useState(null);
  const [confirmDrop, setConfirmDrop] = useState(null);

  const add = async (c) => {
    setBusy(c.crn);
    await wait(700);
    dispatch({ type: 'add', crn: c.crn });
    setBusy(null);
    toast(`Added ${c.code} (section ${c.section}).`, {
      action: { label: 'Undo', onClick: () => dispatch({ type: 'drop', crn: c.crn }) },
    });
  };

  const drop = async (c) => {
    setConfirmDrop(null);
    setBusy(c.crn);
    await wait(700);
    dispatch({ type: 'drop', crn: c.crn });
    setBusy(null);
    toast(`Dropped ${c.code}.`, {
      action: { label: 'Undo', onClick: () => dispatch({ type: 'add', crn: c.crn }) },
    });
  };

  if (loading)
    return (
      <>
        <PageHeader title={`Registration: ${TERM}`} crumbs={[{ label: 'Registration' }]} />
        <Loader label="Loading Registration…" />
      </>
    );

  const hasHolds = state.holds.length > 0;
  return (
    <>
      <PageHeader title={`Registration: ${TERM}`} crumbs={[{ label: 'Registration' }]} />

      <div className="status-strip">
        <div>
          <span className="status-label">Registration status</span>
          <StatusPill ok={state.registered.length > 0}>{state.registered.length ? 'Registered' : 'Not registered'}</StatusPill>
        </div>
        <div>
          <span className="status-label">Holds</span>
          <StatusPill ok={!hasHolds}>{hasHolds ? `${state.holds.length} hold(s)` : 'None'}</StatusPill>
        </div>
        <div>
          <span className="status-label">Credit hours</span>
          <span className="status-value">{credits} <span className="muted small">/ {MAX_CREDITS} max</span></span>
        </div>
      </div>

      <div className="tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={`tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setParams({ tab: t.id })}
          >
            {t.label}
          </button>
        ))}
      </div>

      <section className="card" role="tabpanel">
        {tab === 'courses' && <MyCourses onDrop={setConfirmDrop} busy={busy} />}
        {tab === 'add' && <SearchAdd onAdd={add} busy={busy} />}
        {tab === 'week' && <WeekView />}
      </section>

      <Modal
        open={!!confirmDrop}
        title={`Drop ${confirmDrop?.code}?`}
        onClose={() => setConfirmDrop(null)}
        actions={
          <>
            <button className="btn btn-outline" onClick={() => setConfirmDrop(null)}>Keep course</button>
            <button className="btn danger-solid" onClick={() => drop(confirmDrop)}>Drop course</button>
          </>
        }
      >
        <p>
          You will be removed from <b>{confirmDrop?.code} {confirmDrop?.title}</b> (section {confirmDrop?.section}).
          Your seat may be given to another student.
        </p>
      </Modal>
    </>
  );
}

