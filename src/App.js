import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navigation from './components/layout/Navigation/Navigation';
import Footer from './components/layout/Footer/Footer';
import ProtectedRoute from './components/common/ProtectedRoute/ProtectedRoute';

// Lazy-loaded public pages
const Home = React.lazy(() => import('./pages/home/Home'));
const Gallery = React.lazy(() => import('./pages/gallery/gallery'));
const Workshops = React.lazy(() => import('./pages/Workshops/Workshops'));
const WorkshopDetail = React.lazy(() => import('./pages/Workshops/WorkshopDetail'));
const About = React.lazy(() => import('./pages/About/About'));

// Lazy-loaded admin pages
const Login = React.lazy(() => import('./pages/admin/Login/Login'));
const AdminLayout = React.lazy(() => import('./components/layout/AdminLayout/AdminLayout'));
const GalleryManager = React.lazy(() => import('./pages/admin/GalleryManager/GalleryManager'));
const WorkshopManager = React.lazy(() => import('./pages/admin/WorkshopManager/WorkshopManager'));

function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <div className="loading-spinner" aria-label="Loading page">
        Loading...
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="App">
      <Navigation />
      <main style={{ paddingTop: '80px', flex: '1' }}>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/workshops" element={<Workshops />} />
            <Route path="/workshops/:id" element={<WorkshopDetail />} />
            <Route path="/about" element={<About />} />

            {/* Admin routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<GalleryManager />} />
              <Route path="gallery" element={<GalleryManager />} />
              <Route path="workshops" element={<WorkshopManager />} />
            </Route>
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
