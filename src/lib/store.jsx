import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import {
  CATALOG, INITIAL_REGISTERED, INITIAL_PAYMENTS, FEES, TUITION_PER_CREDIT, MAX_CREDITS,
} from './data.js';

const STORAGE_KEY = 'portal-demo-state-v1';

const initialState = {
  registered: INITIAL_REGISTERED,
  payments: INITIAL_PAYMENTS,
  holds: [],
  profile: {
    preferredName: 'Student',
    email: 'student@example.edu',
    phone: '709-555-0142',
    street: '12 Elizabeth Ave',
    city: "St. John's",
    province: 'NL',
    postal: 'A1B 3X5',
    emergencyName: 'Alex Doe',
    emergencyPhone: '709-555-0199',
  },
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...initialState, ...JSON.parse(raw) } : initialState;
  } catch {
    return initialState;
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'add':
      return { ...state, registered: [...state.registered, action.crn] };
    case 'drop':
      return { ...state, registered: state.registered.filter((c) => c !== action.crn) };
    case 'pay':
      return { ...state, payments: [...state.payments, action.payment] };
    case 'profile':
      return { ...state, profile: { ...state.profile, ...action.profile } };
    case 'reset':
      return initialState;
    default:
      return state;
  }
}

// ---------- helpers ----------
export const byCrn = (crn) => CATALOG.find((c) => c.crn === crn);

const toMin = (t) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

export function overlaps(a, b) {
  const sharedDay = [...a.days].some((d) => b.days.includes(d));
  if (!sharedDay) return false;
  return toMin(a.start) < toMin(b.end) && toMin(b.start) < toMin(a.end);
}

export function formatTime(t) {
  const [h, m] = t.split(':').map(Number);
  const suffix = h >= 12 ? 'pm' : 'am';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
}

export function formatDate(iso, opts = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-CA', opts);
}

export const money = (n) =>
  n.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' });

// Simulated network delay so loading states are visible (Visibility of System Status).
export const wait = (ms = 700) => new Promise((r) => setTimeout(r, ms));

// ---------- context ----------
const StoreCtx = createContext(null);
const ToastCtx = createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable: state stays in memory */
    }
  }, [state]);

  const derived = useMemo(() => {
    const courses = state.registered.map(byCrn).filter(Boolean);
    const credits = courses.reduce((s, c) => s + c.credits, 0);
    const tuition = credits * TUITION_PER_CREDIT;
    const feeTotal = FEES.reduce((s, f) => s + f.amount, 0);
    const charges = tuition + feeTotal;
    const paid = state.payments.reduce((s, p) => s + p.amount, 0);
    return { courses, credits, tuition, feeTotal, charges, paid, balance: Math.max(0, charges - paid) };
  }, [state]);

  // Returns null if the course can be added, or a reason why not (Error Prevention).
  const canAdd = useCallback(
    (course) => {
      if (state.holds.length) return { reason: 'You have a hold on your account.', fix: '/student-hub' };
      if (state.registered.includes(course.crn)) return { reason: 'You are already registered in this section.' };
      const sameCourse = derived.courses.find((c) => c.code === course.code);
      if (sameCourse) return { reason: `You are already in ${course.code} (section ${sameCourse.section}).` };
      if (course.seats <= 0) return { reason: 'This section is full.' };
      if (derived.credits + course.credits > MAX_CREDITS)
        return { reason: `Adding this would put you over ${MAX_CREDITS} credit hours.` };
      const clash = derived.courses.find((c) => overlaps(c, course));
      if (clash) return { reason: `Time conflict with ${clash.code} (${clash.days} ${formatTime(clash.start)}).` };
      return null;
    },
    [state, derived],
  );

  const value = useMemo(() => ({ state, dispatch, ...derived, canAdd }), [state, derived, canAdd]);
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export const useStore = () => useContext(StoreCtx);

// ---------- toasts ----------
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const remove = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const show = useCallback(
    (message, { action, kind = 'success', duration = 5000 } = {}) => {
      const id = ++idRef.current;
      setToasts((t) => [...t, { id, message, action, kind }]);
      setTimeout(() => remove(id), duration);
    },
    [remove],
  );

  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.kind}`}>
            <span>{t.message}</span>
            {t.action && (
              <button
                className="toast-action"
                onClick={() => {
                  t.action.onClick();
                  remove(t.id);
                }}
              >
                {t.action.label}
              </button>
            )}
            <button className="toast-close" aria-label="Dismiss" onClick={() => remove(t.id)}>×</button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);

// Shows a loading screen briefly when a page opens, like a real network request.
export function usePageLoad(ms = 600) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), ms);
    return () => clearTimeout(t);
  }, [ms]);
  return loading;
}
