import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Ant Design & Premium Theme Engine
import { ConfigProvider, App as AntApp, Spin } from 'antd';
import { enterpriseTheme } from './theme/enterpriseTheme';
import 'antd/dist/reset.css';

// Contexts & Layouts
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
// 🛠️ CHANGED: Swapped MainLayout with our new premium EnterpriseLayout
import EnterpriseLayout from './layouts/EnterpriseLayout'; 

// Components & Security
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Eagerly Loaded Pages
import Login from './pages/Login';

// Lazy Loaded Enterprise Modules (Performance Optimization)
const Dashboard = lazy(() => import('./pages/Dashboard'));
const GraphWorkspace = lazy(() => import('./pages/GraphWorkspace')); // Note: Check if filename is GraphWorkspace or KnowledgeGraph
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

// Global Loading Skeleton for Suspense (Upgraded with dark theme colors)
const Loader = () => (
  <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0d1117' }}>
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
          
          {/* 💎 WRAP IN PREMIUM ENTERPRISE LAYOUT (Sidebar, Navbar, Cmd+K, Floating AI) */}
          <Route element={<EnterpriseLayout />}>
            
            {/* Level 1: Accessible by All Authenticated Users */}
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="drugs" element={<DrugExplorer />} />
            <Route path="genes" element={<GeneExplorer />} />
            <Route path="mutations" element={<MutationExplorer />} />
            <Route path="trials" element={<ClinicalTrials />} />
            <Route path="publications" element={<Publications />} />

            {/* ✅ FIX: Added Team Workspace Placeholder Route */}
            <Route path="workspace/team" element={
              <div style={{ color: '#c9d1d9', textAlign: 'center', marginTop: '100px' }}>
                <h2 style={{ color: '#fff' }}>Team Workspace Module</h2>
                <p>Real-time collaboration features are under development for Phase 2.</p>
              </div>
            } />

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
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      {/* 💎 INJECTED CONFIG PROVIDER FOR PREMIUM UI TOKENS */}
      <ConfigProvider theme={enterpriseTheme}>
        <AntApp>
          <AuthProvider>
            <ThemeProvider>
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </ThemeProvider>
          </AuthProvider>
        </AntApp>
      </ConfigProvider>
    </ErrorBoundary>
  );
};

export default App;