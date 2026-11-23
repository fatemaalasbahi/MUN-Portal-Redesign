import { useState } from 'react';
import { Loader, PageHeader } from '../components/ui.jsx';
import { STUDENT } from '../lib/data.js';
import { useStore, usePageLoad, useToast, wait } from '../lib/store.jsx';

const FIELDS = [
  { section: 'Contact', items: [
    { name: 'preferredName', label: 'Preferred name', required: true },
    { name: 'email', label: 'Personal email', type: 'email', required: true },
    { name: 'phone', label: 'Phone', type: 'tel', hint: 'Format: 709-555-0123', required: true },
  ] },
  { section: 'Mailing address', items: [
    { name: 'street', label: 'Street address', required: true },
    { name: 'city', label: 'City', required: true },
    { name: 'province', label: 'Province', select: ['NL', 'NS', 'NB', 'PE', 'QC', 'ON', 'MB', 'SK', 'AB', 'BC', 'YT', 'NT', 'NU'] },
    { name: 'postal', label: 'Postal code', hint: 'Format: A1B 2C3', required: true },
  ] },
  { section: 'Emergency contact', items: [
    { name: 'emergencyName', label: 'Name', required: true },
    { name: 'emergencyPhone', label: 'Phone', type: 'tel', hint: 'Format: 709-555-0123', required: true },
  ] },
];

const PHONE = /^\d{3}-\d{3}-\d{4}$/;
const POSTAL = /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(v) {
  const e = {};
  FIELDS.flatMap((s) => s.items).forEach((f) => {
    if (f.required && !String(v[f.name] || '').trim()) e[f.name] = `${f.label} is required.`;
  });
  if (v.email && !EMAIL.test(v.email)) e.email = 'Enter an email like name@example.com.';
  if (v.phone && !PHONE.test(v.phone)) e.phone = 'Enter a phone number like 709-555-0123.';
  if (v.emergencyPhone && !PHONE.test(v.emergencyPhone)) e.emergencyPhone = 'Enter a phone number like 709-555-0123.';
  if (v.postal && !POSTAL.test(v.postal)) e.postal = 'Enter a postal code like A1B 2C3.';
  return e;
}

export default function Personal() {
  const loading = usePageLoad(500);
  const { state, dispatch } = useStore();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState(state.profile);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const start = () => {
    setValues(state.profile);
    setErrors({});
    setEditing(true);
  };

  const save = async (e) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.getElementById(`f-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    setSaving(true);
    await wait(600);
    dispatch({ type: 'profile', profile: { ...values, postal: values.postal.toUpperCase() } });
    setSaving(false);
    setEditing(false);
    toast('Your information has been saved.');
  };

  return (
    <>
      <PageHeader title="Personal Information" crumbs={[{ label: 'Personal Information' }]}>
        {!editing && !loading && <button className="btn" onClick={start}>Edit information</button>}
      </PageHeader>
      {loading ? (
        <Loader label="Loading your information…" />
      ) : (
        <>
          <section className="card">
            <dl className="kv kv-row">
              <div><dt>Student ID</dt><dd>{STUDENT.id}</dd></div>
              <div><dt>Program</dt><dd>{STUDENT.program}</dd></div>
              <div><dt>Year</dt><dd>{STUDENT.year}</dd></div>
            </dl>
          </section>

          <form onSubmit={save} noValidate>
            {FIELDS.map((s) => (
              <section key={s.section} className="card">
                <h2 className="h3">{s.section}</h2>
                <div className="form-grid">
                  {s.items.map((f) => (
                    <div key={f.name} className={`field ${errors[f.name] ? 'has-error' : ''}`}>
                      <label htmlFor={`f-${f.name}`}>{f.label}{editing && f.required && <span className="req" aria-hidden="true"> *</span>}</label>
                      {editing ? (
                        f.select ? (
                          <select id={`f-${f.name}`} value={values[f.name]} onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}>
                            {f.select.map((o) => <option key={o}>{o}</option>)}
                          </select>
                        ) : (
                          <input
                            id={`f-${f.name}`}
                            type={f.type || 'text'}
                            value={values[f.name]}
                            aria-invalid={!!errors[f.name]}
                            aria-describedby={`h-${f.name}`}
                            onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
                          />
                        )
                      ) : (
                        <p className="field-value" id={`f-${f.name}`}>{state.profile[f.name]}</p>
                      )}
                      {editing && (
                        <p id={`h-${f.name}`} className={errors[f.name] ? 'error-text' : 'hint'}>
                          {errors[f.name] || f.hint || ''}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
            {editing && (
              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => setEditing(false)} disabled={saving}>Cancel</button>
                <button type="submit" className="btn" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
              </div>
            )}
          </form>
        </>
      )}
    </>
  );
}
