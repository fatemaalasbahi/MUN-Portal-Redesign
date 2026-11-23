import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Help, { HelpTopic } from './pages/Help.jsx';
import Registration from './pages/Registration.jsx';
import Personal from './pages/Personal.jsx';
import StudentHub from './pages/StudentHub.jsx';
import Payments from './pages/Payments.jsx';
import Exams from './pages/Exams.jsx';
import Degree from './pages/Degree.jsx';
import News from './pages/News.jsx';
import { Downloads, External, NotFound, SignedOut } from './pages/Misc.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/signed-out" element={<SignedOut />} />
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="help" element={<Help />} />
        <Route path="help/:slug" element={<HelpTopic />} />
        <Route path="registration" element={<Registration />} />
        <Route path="personal" element={<Personal />} />
        <Route path="student-hub" element={<StudentHub />} />
        <Route path="payments" element={<Payments />} />
        <Route path="exams" element={<Exams />} />
        <Route path="degree" element={<Degree />} />
        <Route path="news" element={<News />} />
        <Route path="downloads" element={<Downloads />} />
        <Route path="external/:service" element={<External />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
