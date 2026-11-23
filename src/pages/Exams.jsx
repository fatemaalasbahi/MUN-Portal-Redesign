import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { EmptyState, Loader, PageHeader, StatusPill } from '../components/ui.jsx';
import { EXAMS, TERM } from '../lib/data.js';
import { formatDate, formatTime, useStore, usePageLoad, useToast } from '../lib/store.jsx';

const stamp = (date, time) => `${date.replace(/-/g, '')}T${time.replace(':', '')}00`;

function toIcs(exams) {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Student Portal Concept//Demo//EN'];
  exams.forEach((e) => {
    lines.push(
      'BEGIN:VEVENT',
      `UID:${e.code.replace(' ', '')}-${e.date}@portal-concept.demo`,
      `DTSTART:${stamp(e.date, e.start)}`,
      `DTEND:${stamp(e.date, e.end)}`,
      `SUMMARY:Final exam: ${e.code}`,
      `LOCATION:${e.room}`,
      `DESCRIPTION:${e.title} (demo data)`,
      'END:VEVENT',
    );
  });
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

function saveIcs(name, exams) {
  const blob = new Blob([toIcs(exams)], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Exams() {
  const loading = usePageLoad(600);
  const { courses } = useStore();
  const toast = useToast();

  const exams = courses
    .filter((c) => EXAMS[c.code])
    .map((c) => ({ ...EXAMS[c.code], code: c.code, title: c.title }))
    .sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));

  // Flag two exams on the same day (helps students spot a heavy day early).
  const sameDay = new Set(
    exams.filter((e, i) => exams.some((o, j) => j !== i && o.date === e.date)).map((e) => e.date),
  );

  return (
    <>
      <PageHeader title="Exam Schedule" subtitle={`Final exams for ${TERM}`} crumbs={[{ label: 'Exam Schedule' }]}>
        {!loading && exams.length > 0 && (
          <button
            className="btn"
            onClick={() => {
              saveIcs('final-exams.ics', exams);
              toast('Calendar file downloaded. Open it to add all exams to your calendar.');
            }}
          >
            <Icon name="calendar" size={18} /> Add all to calendar
          </button>
        )}
      </PageHeader>

      {loading ? (
        <Loader label="Loading Exam Schedule…" />
      ) : exams.length === 0 ? (
        <EmptyState title="No exams to show.">
          <p>Exams appear here once you are registered in courses. <Link to="/registration" className="link">Go to Registration</Link></p>
        </EmptyState>
      ) : (
        <ul className="exam-list">
          {exams.map((e) => (
            <li key={e.code} className="card exam">
              <div className="exam-date" aria-hidden="true">
                <span>{formatDate(e.date, { month: 'short' })}</span>
                <b>{formatDate(e.date, { day: 'numeric' })}</b>
              </div>
              <div className="exam-main">
                <p className="course-title"><b>{e.code}</b> · {e.title}</p>
                <p className="muted">
                  {formatDate(e.date)} · {formatTime(e.start)}–{formatTime(e.end)} · Room {e.room}
                </p>
                {sameDay.has(e.date) && <StatusPill ok={false}>Two exams on this day</StatusPill>}
              </div>
              <button
                className="btn btn-small btn-outline"
                onClick={() => {
                  saveIcs(`${e.code.replace(' ', '-')}-exam.ics`, [e]);
                  toast(`${e.code} exam added to calendar file.`);
                }}
              >
                <Icon name="calendar" size={16} /> Add to calendar
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
