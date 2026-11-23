// All data in this file is made up for demo purposes.

export const TERM = 'Fall 2026';
export const TUITION_PER_CREDIT = 200; // CAD, demo value
export const MAX_CREDITS = 18;

export const STUDENT = {
  name: 'Student',
  id: '202600123',
  program: 'Bachelor of Science (Major undeclared)',
  year: 2,
};

// Course catalog for the current term. days: M T W R F
export const CATALOG = [
  { crn: '80101', code: 'BIOL 1001', title: 'Principles of Biology', section: '001', days: 'MWF', start: '09:00', end: '09:50', credits: 3, instructor: 'Dr. A. Rivera', seats: 12 },
  { crn: '80102', code: 'BIOL 1001', title: 'Principles of Biology', section: '002', days: 'TR', start: '14:00', end: '15:15', credits: 3, instructor: 'Dr. K. Osei', seats: 4 },
  { crn: '80201', code: 'MATH 1000', title: 'Calculus I', section: '001', days: 'TR', start: '11:00', end: '12:15', credits: 3, instructor: 'Dr. L. Chen', seats: 20 },
  { crn: '80202', code: 'MATH 1000', title: 'Calculus I', section: '002', days: 'MWF', start: '13:00', end: '13:50', credits: 3, instructor: 'Dr. P. Walsh', seats: 0 },
  { crn: '80301', code: 'ENGL 1090', title: 'Critical Reading and Writing', section: '003', days: 'MWF', start: '13:00', end: '13:50', credits: 3, instructor: 'Prof. M. Byrne', seats: 8 },
  { crn: '80401', code: 'COMP 1001', title: 'Introduction to Programming', section: '001', days: 'MWF', start: '10:00', end: '10:50', credits: 3, instructor: 'Dr. S. Patel', seats: 30 },
  { crn: '80402', code: 'COMP 2001', title: 'Object-Oriented Programming', section: '001', days: 'TR', start: '09:30', end: '10:45', credits: 3, instructor: 'Dr. J. Murphy', seats: 15 },
  { crn: '80501', code: 'CHEM 1050', title: 'General Chemistry I', section: '001', days: 'MWF', start: '11:00', end: '11:50', credits: 3, instructor: 'Dr. R. Noor', seats: 6 },
  { crn: '80601', code: 'PSYC 1000', title: 'Introduction to Psychology I', section: '001', days: 'TR', start: '15:30', end: '16:45', credits: 3, instructor: 'Dr. E. Haddad', seats: 40 },
  { crn: '80701', code: 'EASC 1000', title: 'Earth Systems', section: '001', days: 'MWF', start: '09:00', end: '09:50', credits: 3, instructor: 'Dr. T. Kelly', seats: 10 },
  { crn: '80801', code: 'STAT 1510', title: 'Statistics for Everyday Life', section: '001', days: 'TR', start: '12:30', end: '13:45', credits: 3, instructor: 'Dr. N. Gill', seats: 25 },
];

export const INITIAL_REGISTERED = ['80101', '80201', '80301'];

export const EXAMS = {
  'BIOL 1001': { date: '2026-12-09', start: '09:00', end: '11:00', room: 'SN-2018' },
  'MATH 1000': { date: '2026-12-11', start: '14:00', end: '16:00', room: 'EN-1051' },
  'ENGL 1090': { date: '2026-12-14', start: '09:00', end: '11:00', room: 'AA-1046' },
  'COMP 1001': { date: '2026-12-10', start: '14:00', end: '16:00', room: 'EN-2007' },
  'COMP 2001': { date: '2026-12-15', start: '09:00', end: '11:00', room: 'EN-2007' },
  'CHEM 1050': { date: '2026-12-12', start: '09:00', end: '11:00', room: 'C-2001' },
  'PSYC 1000': { date: '2026-12-16', start: '14:00', end: '16:00', room: 'SN-2109' },
  'EASC 1000': { date: '2026-12-09', start: '14:00', end: '16:00', room: 'ER-2020' },
  'STAT 1510': { date: '2026-12-17', start: '09:00', end: '11:00', room: 'HH-1011' },
};

export const TRANSCRIPT = [
  {
    term: 'Fall 2025',
    courses: [
      { code: 'ENGL 1080', title: 'Critical Reading and Writing I', credits: 3, grade: 82 },
      { code: 'MATH 1090', title: 'Algebra and Trigonometry', credits: 3, grade: 77 },
      { code: 'PSYC 1001', title: 'Learning About Psychology', credits: 3, grade: 88 },
      { code: 'SCI 1000', title: 'Science Foundations', credits: 3, grade: 74 },
    ],
  },
  {
    term: 'Winter 2026',
    courses: [
      { code: 'COMP 1000', title: 'Computer Science Foundations', credits: 3, grade: 85 },
      { code: 'STAT 1500', title: 'Data Literacy', credits: 3, grade: 79 },
      { code: 'HIST 1001', title: 'World History', credits: 3, grade: 81 },
      { code: 'PHIL 1200', title: 'Ethics and Society', credits: 3, grade: 90 },
    ],
  },
];

export const DEGREE_REQUIREMENTS = [
  { group: 'English', needed: 6, matches: ['ENGL'] },
  { group: 'Mathematics & Statistics', needed: 9, matches: ['MATH', 'STAT'] },
  { group: 'Science', needed: 12, matches: ['BIOL', 'CHEM', 'EASC', 'SCI', 'COMP'] },
  { group: 'Social Sciences & Humanities', needed: 9, matches: ['PSYC', 'HIST', 'PHIL'] },
];
export const DEGREE_TOTAL_CREDITS = 120;

export const FEES = [
  { id: 'student-union', label: 'Student union fee', amount: 85 },
  { id: 'health', label: 'Health & dental plan', amount: 260 },
  { id: 'recreation', label: 'Recreation fee', amount: 60 },
];

export const INITIAL_PAYMENTS = [
  { id: 'p1', date: '2026-09-02', amount: 1000, method: 'Online banking', reference: 'DEMO-4821' },
];

export const PAYMENT_DEADLINE = '2026-12-01';

export const NEWS = [
  { id: 'n1', date: '2026-11-10', title: 'Parking Draw for the winter semester is now open', body: 'Apply for a daytime parking permit before November 28. Results are posted in early December.' },
  { id: 'n2', date: '2026-11-03', title: 'Complete the Cybersecurity Awareness Training', body: 'A short online course on keeping your accounts safe. It takes about 20 minutes.' },
  { id: 'n3', date: '2026-10-28', title: 'Final exam schedule is posted', body: 'Check the Exam Schedule tool for your dates and rooms. You can add them to your calendar.' },
  { id: 'n4', date: '2026-10-15', title: 'Graduate studies information session', body: 'Thinking about a master\'s degree? Join an online session to learn about programs and funding.' },
];

export const HELP_TOPICS = [
  {
    slug: 'login',
    title: 'Login & Password',
    summary: "Can't sign in or forgot your password",
    icon: 'key',
    questions: [
      {
        q: 'I forgot my password. How do I reset it?',
        steps: [
          'On the sign-in page, choose "Forgot password".',
          'Enter your student ID and the recovery email or phone on file.',
          'Follow the link sent to you and choose a new password.',
        ],
      },
      {
        q: 'My account is locked. What should I do?',
        steps: [
          'Wait 15 minutes. Accounts unlock automatically after too many tries.',
          'If it is still locked, contact IT Support.',
        ],
      },
    ],
    cta: { label: 'Contact IT Support', to: '/help/contact' },
  },
  {
    slug: 'registration',
    title: 'Registration',
    summary: 'Check your status and holds, add or drop courses',
    icon: 'reg',
    questions: [
      {
        q: 'How do I check my registration status?',
        steps: [
          'Go to Student Self-Service on the home page.',
          'Click Registration.',
          'Your status, holds and credit hours are shown at the top.',
        ],
      },
      {
        q: 'How do I add or drop a course?',
        steps: [
          'Open Registration and choose the Search & Add tab.',
          'Search by course code or title and click Add on a section.',
          'To drop, go to My Courses and click Drop. You will be asked to confirm.',
        ],
      },
      {
        q: 'Why can\'t I add a course?',
        steps: [
          'The section may be full, or it may overlap with another course you are taking.',
          'You may have a hold on your account. Check Student Hub.',
          'You may be over the maximum of 18 credit hours.',
        ],
      },
    ],
    cta: { label: 'Go to Registration', to: '/registration' },
  },
  {
    slug: 'payments',
    title: 'Payments & Fees',
    summary: 'Tuition, payment deadlines and receipts',
    icon: 'pay',
    questions: [
      {
        q: 'How much do I owe and when is it due?',
        steps: [
          'Open the Payment Centre.',
          'Your balance and the payment deadline are shown at the top.',
          'The breakdown lists tuition and each fee.',
        ],
      },
      {
        q: 'How do I make a payment?',
        steps: [
          'In the Payment Centre, click Make a payment.',
          'Enter the amount and choose a method.',
          'Review and confirm. A receipt is added to your history.',
        ],
      },
    ],
    cta: { label: 'Go to Payment Centre', to: '/payments' },
  },
  {
    slug: 'exams',
    title: 'Exams',
    summary: 'Final exam dates, rooms and conflicts',
    icon: 'exam',
    questions: [
      {
        q: 'Where can I see my final exams?',
        steps: [
          'Open Exam Schedule from the home page.',
          'Your exams are listed by date with time and room.',
          'Click "Add to calendar" to save them to your phone or computer.',
        ],
      },
    ],
    cta: { label: 'Go to Exam Schedule', to: '/exams' },
  },
  {
    slug: 'brightspace',
    title: 'Brightspace',
    summary: 'Course sites, assignments and grades',
    icon: 'book',
    questions: [
      {
        q: 'I can\'t see my course in Brightspace.',
        steps: [
          'Courses appear within 24 hours of registering.',
          'Instructors may not open a course site until the first day of classes.',
          'If it is still missing after that, contact IT Support.',
        ],
      },
    ],
    cta: { label: 'Contact IT Support', to: '/help/contact' },
  },
  {
    slug: 'contact',
    title: 'Contact IT Support',
    summary: 'Call, email or chat with the Help Centre',
    icon: 'phone',
    questions: [
      {
        q: 'How do I reach the Help Centre?',
        steps: [
          'Phone: 555-0100 (demo number), Monday to Friday, 8:30 am to 4:30 pm.',
          'Email: helpdesk@example.edu (demo address).',
          'In person: Help Centre, main campus library, ground floor.',
        ],
      },
    ],
    cta: null,
  },
];
