import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { Loader, PageHeader, StatusPill } from '../components/ui.jsx';
import { STUDENT, TERM, TRANSCRIPT } from '../lib/data.js';
import { useStore, usePageLoad, useToast } from '../lib/store.jsx';

export function average(terms = TRANSCRIPT) {
  const all = terms.flatMap((t) => t.courses);
  const credits = all.reduce((s, c) => s + c.credits, 0);
  const weighted = all.reduce((s, c) => s + c.grade * c.credits, 0);
  return { credits, avg: credits ? weighted / credits : 0 };
}

function download(filename, text) {
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function StudentHub() {
  const loading = usePageLoad(600);
  const { state, courses, credits } = useStore();
  const toast = useToast();
  const { credits: earned, avg } = average();
  const name = state.profile.preferredName;

  const docs = [
    {
      title: 'Unofficial transcript',
      desc: 'All completed courses and grades',
      file: 'unofficial-transcript-DEMO.txt',
      build: () =>
        [
          'UNOFFICIAL TRANSCRIPT (DEMO – NOT A REAL RECORD)',
          `Name: ${name}   Student ID: ${STUDENT.id}`,
          `Program: ${STUDENT.program}`,
          '',
          ...TRANSCRIPT.flatMap((t) => [
            t.term,
            ...t.courses.map((c) => `  ${c.code.padEnd(10)} ${c.title.padEnd(36)} ${String(c.credits).padStart(2)} cr   ${c.grade}%`),
            '',
          ]),
          `Credits earned: ${earned}   Cumulative average: ${avg.toFixed(1)}%`,
        ].join('\n'),
    },
    {
      title: 'Proof of enrolment',
      desc: `Confirms you are registered for ${TERM}`,
      file: 'proof-of-enrolment-DEMO.txt',
      build: () =>
        [
          'PROOF OF ENROLMENT (DEMO – NOT A REAL DOCUMENT)',
          '',
          `This is to confirm that ${name} (ID ${STUDENT.id}) is registered for the ${TERM} term`,
          `in ${credits} credit hours (${credits >= 9 ? 'full-time' : 'part-time'}).`,
          '',
          'Courses:',
          ...courses.map((c) => `  ${c.code} – ${c.title}`),
        ].join('\n'),
    },
  ];

  return (
    <>
      <PageHeader title="Student Hub" subtitle="Your holds, academic record and documents" crumbs={[{ label: 'Student Hub' }]} />
      {loading ? (
        <Loader label="Loading Student Hub…" />
      ) : (
        <>
          <div className="grid-2">
            <section className="card">
              <h2 className="h3">Holds</h2>
              {state.holds.length ? (
                <ul>{state.holds.map((h) => <li key={h}>{h}</li>)}</ul>
              ) : (
                <>
                  <StatusPill ok>No holds on your account</StatusPill>
                  <p className="muted small spaced">You can register and request documents.</p>
                </>
              )}
            </section>
            <section className="card">
              <h2 className="h3">Academic summary</h2>
              <dl className="kv">
                <div><dt>Credits earned</dt><dd>{earned}</dd></div>
                <div><dt>In progress ({TERM})</dt><dd>{credits}</dd></div>
                <div><dt>Cumulative average</dt><dd>{avg.toFixed(1)}%</dd></div>
                <div><dt>Academic standing</dt><dd><StatusPill ok>Good standing</StatusPill></dd></div>
              </dl>
            </section>
          </div>

          <section className="card">
            <div className="card-head">
              <h2 className="h3">Academic record</h2>
              <Link to="/degree" className="link">See degree progress <Icon name="arrow" size={16} /></Link>
            </div>
            {TRANSCRIPT.map((t) => (
              <div key={t.term} className="term-block">
                <h3 className="term-name">{t.term}</h3>
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Course</th><th>Title</th><th>Credits</th><th>Grade</th></tr></thead>
                    <tbody>
                      {t.courses.map((c) => (
                        <tr key={c.code}>
                          <td data-label="Course"><b>{c.code}</b></td>
                          <td data-label="Title">{c.title}</td>
                          <td data-label="Credits">{c.credits}</td>
                          <td data-label="Grade">{c.grade}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="muted small">Term average: {average([t]).avg.toFixed(1)}%</p>
              </div>
            ))}
          </section>

          <section className="card">
            <h2 className="h3">Documents</h2>
            <ul className="doc-list">
              {docs.map((d) => (
                <li key={d.file}>
                  <div>
                    <p className="doc-title">{d.title}</p>
                    <p className="muted small">{d.desc}</p>
                  </div>
                  <button
                    className="btn btn-small btn-outline"
                    onClick={() => {
                      download(d.file, d.build());
                      toast(`${d.title} downloaded.`);
                    }}
                  >
                    <Icon name="download" size={16} /> Download
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </>
  );
}
