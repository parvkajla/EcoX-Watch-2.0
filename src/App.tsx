import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';

// Eager-loaded pages (critical path)
import Dashboard from './pages/Dashboard';
import Monitoring from './pages/Monitoring';

// Lazy-loaded pages
const Incidents = lazy(() => import('./pages/Incidents'));
const IncidentDetail = lazy(() => import('./pages/IncidentDetail'));
const People = lazy(() => import('./pages/People'));
const PersonDetail = lazy(() => import('./pages/PersonDetail'));
const Vehicles = lazy(() => import('./pages/Vehicles'));
const Evidence = lazy(() => import('./pages/Evidence'));
const MapPage = lazy(() => import('./pages/MapPage'));
const Zones = lazy(() => import('./pages/Zones'));
const Cameras = lazy(() => import('./pages/Cameras'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Tasks = lazy(() => import('./pages/Tasks'));
const Organization = lazy(() => import('./pages/Organization'));
const Users = lazy(() => import('./pages/Users'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Settings = lazy(() => import('./pages/Settings'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-[#C8F169] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/incidents" element={
            <Suspense fallback={<PageLoader />}><Incidents /></Suspense>
          } />
          <Route path="/incidents/:id" element={
            <Suspense fallback={<PageLoader />}><IncidentDetail /></Suspense>
          } />
          <Route path="/people" element={
            <Suspense fallback={<PageLoader />}><People /></Suspense>
          } />
          <Route path="/people/:id" element={
            <Suspense fallback={<PageLoader />}><PersonDetail /></Suspense>
          } />
          <Route path="/vehicles" element={
            <Suspense fallback={<PageLoader />}><Vehicles /></Suspense>
          } />
          <Route path="/evidence" element={
            <Suspense fallback={<PageLoader />}><Evidence /></Suspense>
          } />
          <Route path="/map" element={
            <Suspense fallback={<PageLoader />}><MapPage /></Suspense>
          } />
          <Route path="/zones" element={
            <Suspense fallback={<PageLoader />}><Zones /></Suspense>
          } />
          <Route path="/cameras" element={
            <Suspense fallback={<PageLoader />}><Cameras /></Suspense>
          } />
          <Route path="/analytics" element={
            <Suspense fallback={<PageLoader />}><Analytics /></Suspense>
          } />
          <Route path="/tasks" element={
            <Suspense fallback={<PageLoader />}><Tasks /></Suspense>
          } />
          <Route path="/organization" element={
            <Suspense fallback={<PageLoader />}><Organization /></Suspense>
          } />
          <Route path="/users" element={
            <Suspense fallback={<PageLoader />}><Users /></Suspense>
          } />
          <Route path="/notifications" element={
            <Suspense fallback={<PageLoader />}><Notifications /></Suspense>
          } />
          <Route path="/settings" element={
            <Suspense fallback={<PageLoader />}><Settings /></Suspense>
          } />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
