import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Contexts & Layouts
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './layouts/MainLayout';

// Components & Security
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Global UI
import { Spin } from 'antd';
import 'antd/dist/reset.css';

// Eagerly Loaded Pages
import Login from './pages/Login';

// Lazy Loaded Enterprise Modules (Performance Optimization)
const Dashboard = lazy(() => import('./pages/Dashboard'));
const GraphWorkspace = lazy(() => import('./pages/GraphWorkspace'));
const AIAssistant = lazy(() => import('./pages/AIAssistant'));
const SimulationLab = lazy(() => import('./pages/SimulationLab'));
const SystemWorkspace = lazy(() => import('./pages/SystemWorkspace'));
const Analytics = lazy(() => import('./pages/Analytics'));

// Lazy Loaded Data Explorers
const DrugExplorer = lazy(() => import('./pages/Explorers').then(module => ({ default: module.DrugExplorer })));
const GeneExplorer = lazy(() => import('./pages/Explorers').then(module => ({ default: module.GeneExplorer })));
const MutationExplorer = lazy(() => import('./pages/Explorers').then(module => ({ default: module.MutationExplorer })));
const ClinicalTrials = lazy(() => import('./pages/Explorers').then(module => ({ default: module.ClinicalTrials })));
const Publications = lazy(() => import('./pages/Explorers').then(module => ({ default: module.Publications })));

// Global Loading Skeleton for Suspense
const Loader = () => (
  <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0a0a0a' }}>
    <Spin size="large" tip="Loading Enterprise Module..." />
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* PUBLIC ROUTE */}
        <Route path="/login" element={<Login />} />

        {/* SECURE ROUTES - Requires Authentication */}
        <Route element={<ProtectedRoute />}>
          {/* WRAP IN MAIN LAYOUT (Sidebar, Navbar) */}
          <Route element={<MainLayout />}>
            
            {/* Level 1: Accessible by All Authenticated Users (Viewers, Researchers, Admins) */}
            <Route index element={<Dashboard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="drugs" element={<DrugExplorer />} />
            <Route path="genes" element={<GeneExplorer />} />
            <Route path="mutations" element={<MutationExplorer />} />
            <Route path="trials" element={<ClinicalTrials />} />
            <Route path="publications" element={<Publications />} />

            {/* Level 2: Advanced Tools (Only Researchers & Admins) */}
            <Route element={<ProtectedRoute allowedRoles={['Admin', 'Researcher']} />}>
              <Route path="graph" element={<GraphWorkspace />} />
              <Route path="ai" element={<AIAssistant />} />
              <Route path="simulation" element={<SimulationLab />} />
            </Route>

            {/* Level 3: System Operations (Strictly Admin Only) */}
            <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
              <Route path="system" element={<SystemWorkspace />} />
            </Route>
            
          </Route>
        </Route>

        {/* 404 CATCH-ALL REDIRECT */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;