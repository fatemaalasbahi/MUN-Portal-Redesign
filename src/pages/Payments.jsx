import { useState } from 'react';
import { Loader, Modal, PageHeader, StatusPill } from '../components/ui.jsx';
import { FEES, PAYMENT_DEADLINE, TERM, TUITION_PER_CREDIT } from '../lib/data.js';
import { formatDate, money, useStore, usePageLoad, useToast, wait } from '../lib/store.jsx';

const METHODS = ['Online banking (demo)', 'Bank transfer (demo)'];

export default function Payments() {
  const loading = usePageLoad(600);
  const { state, dispatch, credits, tuition, charges, paid, balance } = useStore();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState(METHODS[0]);
  const [error, setError] = useState('');
  const [review, setReview] = useState(false);
  const [processing, setProcessing] = useState(false);

  const startPay = () => {
    setAmount(balance.toFixed(2));
    setMethod(METHODS[0]);
    setError('');
    setReview(false);
    setOpen(true);
  };

  const check = () => {
    const n = Number(amount);
    if (!amount || Number.isNaN(n)) return 'Enter an amount.';
    if (n <= 0) return 'The amount must be more than $0.';
    if (n > balance + 0.001) return `The amount can't be more than your balance (${money(balance)}).`;
    return '';
  };

  const confirm = async () => {
    setProcessing(true);
    await wait(900);
    const n = Math.round(Number(amount) * 100) / 100;
    dispatch({
      type: 'pay',
      payment: {
        id: `p${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        amount: n,
        method,
        reference: `DEMO-${Math.floor(1000 + Math.random() * 9000)}`,
      },
    });
    setProcessing(false);
    setOpen(false);
    toast(`Payment of ${money(n)} recorded. A receipt was added to your history.`);
  };

  return (
    <>
      <PageHeader title="Payment Centre" subtitle={`Your account for ${TERM}`} crumbs={[{ label: 'Payment Centre' }]}>
        {!loading && balance > 0 && <button className="btn" onClick={startPay}>Make a payment</button>}
      </PageHeader>

      {loading ? (
        <Loader label="Loading your account…" />
      ) : (
        <>
          <div className="status-strip">
            <div>
              <span className="status-label">Balance owing</span>
              <span className="status-value big">{money(balance)}</span>
            </div>
            <div>
              <span className="status-label">Payment deadline</span>
              <span className="status-value">{formatDate(PAYMENT_DEADLINE)}</span>
            </div>
            <div>
              <span className="status-label">Status</span>
              <StatusPill ok={balance === 0}>{balance === 0 ? 'Paid in full' : 'Payment due'}</StatusPill>
            </div>
          </div>

          <div className="grid-2">
            <section className="card">
              <h2 className="h3">Charges</h2>
              <table className="plain">
                <tbody>
                  <tr><td>Tuition ({credits} credit hours × {money(TUITION_PER_CREDIT)})</td><td className="num">{money(tuition)}</td></tr>
                  {FEES.map((f) => <tr key={f.id}><td>{f.label}</td><td className="num">{money(f.amount)}</td></tr>)}
                  <tr className="total"><td>Total charges</td><td className="num">{money(charges)}</td></tr>
                  <tr><td>Payments received</td><td className="num">−{money(paid)}</td></tr>
                  <tr className="total"><td>Balance owing</td><td className="num">{money(balance)}</td></tr>
                </tbody>
              </table>
              <p className="muted small">Tuition updates automatically when you add or drop courses.</p>
            </section>

            <section className="card">
              <h2 className="h3">Payment history</h2>
              {state.payments.length ? (
                <ul className="doc-list">
                  {[...state.payments].reverse().map((p) => (
                    <li key={p.id}>
                      <div>
                        <p className="doc-title">{money(p.amount)}</p>
                        <p className="muted small">{formatDate(p.date)} · {p.method} · Ref {p.reference}</p>
                      </div>
                      <StatusPill ok>Received</StatusPill>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted">No payments yet.</p>
              )}
            </section>
          </div>
        </>
      )}

      <Modal
        open={open}
        title={review ? 'Review your payment' : 'Make a payment'}
        onClose={() => !processing && setOpen(false)}
        actions={
          review ? (
            <>
              <button className="btn btn-outline" onClick={() => setReview(false)} disabled={processing}>Back</button>
              <button className="btn" onClick={confirm} disabled={processing}>{processing ? 'Processing…' : 'Confirm payment'}</button>
            </>
          ) : (
            <>
              <button className="btn btn-outline" onClick={() => setOpen(false)}>Cancel</button>
              <button
                className="btn"
                onClick={() => {
                  const e = check();
                  setError(e);
                  if (!e) setReview(true);
                }}
              >
                Review
              </button>
            </>
          )
        }
      >
        <p className="demo-note">This is a demo. No money is moved and no bank details are collected.</p>
        {review ? (
          <dl className="kv">
            <div><dt>Amount</dt><dd>{money(Number(amount))}</dd></div>
            <div><dt>Method</dt><dd>{method}</dd></div>
            <div><dt>Balance after payment</dt><dd>{money(Math.max(0, balance - Number(amount)))}</dd></div>
          </dl>
        ) : (
          <>
            <div className={`field ${error ? 'has-error' : ''}`}>
              <label htmlFor="pay-amount">Amount (CAD)</label>
              <input id="pay-amount" inputMode="decimal" value={amount} aria-invalid={!!error} onChange={(e) => setAmount(e.target.value)} />
              <p className={error ? 'error-text' : 'hint'}>{error || `Your balance is ${money(balance)}.`}</p>
            </div>
            <fieldset className="field">
              <legend>Payment method</legend>
              {METHODS.map((m) => (
                <label key={m} className="radio">
                  <input type="radio" name="method" checked={method === m} onChange={() => setMethod(m)} /> {m}
                </label>
              ))}
            </fieldset>
          </>
        )}
      </Modal>
    </>
  );
}
