import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import HomePage from '@/pages/HomePage/HomePage';
import AboutPage from '@/pages/AboutPage/AboutPage';
import BlogPage from '@/pages/BlogPage/BlogPage';
import ContactPage from '@/pages/ContactPage/ContactPage';
import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
