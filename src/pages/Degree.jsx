import { Loader, PageHeader, StatusPill } from '../components/ui.jsx';
import { DEGREE_REQUIREMENTS, DEGREE_TOTAL_CREDITS, STUDENT, TRANSCRIPT } from '../lib/data.js';
import { useStore, usePageLoad } from '../lib/store.jsx';

function Bar({ done, progress, total }) {
  const pDone = Math.min(100, (done / total) * 100);
  const pProg = Math.min(100 - pDone, (progress / total) * 100);
  return (
    <div className="bar" role="img" aria-label={`${done} of ${total} credits complete, ${progress} in progress`}>
      <span className="bar-done" style={{ width: `${pDone}%` }} />
      <span className="bar-prog" style={{ width: `${pProg}%` }} />
    </div>
  );
}

export default function Degree() {
  const loading = usePageLoad(700);
  const { courses } = useStore();

  const completed = TRANSCRIPT.flatMap((t) => t.courses).filter((c) => c.grade >= 50);
  const prefix = (code) => code.split(' ')[0];

  const groups = DEGREE_REQUIREMENTS.map((r) => {
    const done = completed.filter((c) => r.matches.includes(prefix(c.code)));
    const prog = courses.filter((c) => r.matches.includes(prefix(c.code)));
    const doneCr = done.reduce((s, c) => s + c.credits, 0);
    const progCr = prog.reduce((s, c) => s + c.credits, 0);
    return { ...r, done, prog, doneCr, progCr };
  });

  const doneTotal = completed.reduce((s, c) => s + c.credits, 0);
  const progTotal = courses.reduce((s, c) => s + c.credits, 0);

  return (
    <>
      <PageHeader title="Degree Works" subtitle={STUDENT.program} crumbs={[{ label: 'Degree Works' }]} />
      {loading ? (
        <Loader label="Running your degree audit…" />
      ) : (
        <>
          <section className="card">
            <div className="card-head">
              <h2 className="h3">Overall progress</h2>
              <span className="muted">{doneTotal} of {DEGREE_TOTAL_CREDITS} credits complete · {progTotal} in progress</span>
            </div>
            <Bar done={doneTotal} progress={progTotal} total={DEGREE_TOTAL_CREDITS} />
            <div className="legend">
              <span><i className="sw sw-done" /> Complete</span>
              <span><i className="sw sw-prog" /> In progress</span>
              <span><i className="sw sw-left" /> Still needed</span>
            </div>
          </section>

          <h2 className="section-label">Requirements</h2>
          <div className="grid-2">
            {groups.map((g) => {
              const met = g.doneCr >= g.needed;
              const willMeet = !met && g.doneCr + g.progCr >= g.needed;
              return (
                <section key={g.group} className="card">
                  <div className="card-head">
                    <h3 className="h3">{g.group}</h3>
                    <StatusPill ok={met || willMeet}>{met ? 'Complete' : willMeet ? 'In progress' : 'Not complete'}</StatusPill>
                  </div>
                  <p className="muted small">{Math.min(g.doneCr, g.needed)} of {g.needed} credits complete</p>
                  <Bar done={g.doneCr} progress={g.progCr} total={g.needed} />
                  <ul className="req-list">
                    {g.done.map((c) => <li key={c.code}><span className="req-ok">✓</span> {c.code} · {c.title} <span className="muted">({c.grade}%)</span></li>)}
                    {g.prog.map((c) => <li key={c.crn}><span className="req-prog">◐</span> {c.code} · {c.title} <span className="muted">(in progress)</span></li>)}
                    {!g.done.length && !g.prog.length && <li className="muted">No courses yet.</li>}
                  </ul>
                </section>
              );
            })}
          </div>
          <p className="muted small">This audit is a planning tool. Requirements here are simplified demo data.</p>
        </>
      )}
    </>
  );
}
