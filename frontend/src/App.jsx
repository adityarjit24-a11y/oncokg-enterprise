import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import { Spin } from 'antd';
import 'antd/dist/reset.css';

// Lazy Load Modules
const Dashboard = lazy(() => import('./pages/Dashboard'));
const GraphWorkspace = lazy(() => import('./pages/GraphWorkspace'));
const AIAssistant = lazy(() => import('./pages/AIAssistant'));
const SimulationLab = lazy(() => import('./pages/SimulationLab'));
const SystemWorkspace = lazy(() => import('./pages/SystemWorkspace'));
const Analytics = lazy(() => import('./pages/Analytics')); // <-- Analytics Lazy Import Added

// Named exports Lazy Loads
const DrugExplorer = lazy(() => import('./pages/Explorers').then(module => ({ default: module.DrugExplorer })));
const GeneExplorer = lazy(() => import('./pages/Explorers').then(module => ({ default: module.GeneExplorer })));
const MutationExplorer = lazy(() => import('./pages/Explorers').then(module => ({ default: module.MutationExplorer })));
const ClinicalTrials = lazy(() => import('./pages/Explorers').then(module => ({ default: module.ClinicalTrials })));
const Publications = lazy(() => import('./pages/Explorers').then(module => ({ default: module.Publications })));

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Global Loading Skeleton
const Loader = () => (
  <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <Spin size="large" tip="Loading Enterprise Module..." />
  </div>
);

const AppRoutes = () => {
  const { user } = useAuth();
  
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="graph" element={<GraphWorkspace />} /> 
          <Route path="ai" element={<AIAssistant />} /> 
          <Route path="simulation" element={<SimulationLab />} /> 
          <Route path="system" element={<SystemWorkspace />} /> 
          <Route path="analytics" element={<Analytics />} /> {/* <-- Analytics Route Added */}
          
          <Route path="drugs" element={<DrugExplorer />} />
          <Route path="genes" element={<GeneExplorer />} />
          <Route path="mutations" element={<MutationExplorer />} />
          <Route path="trials" element={<ClinicalTrials />} />
          <Route path="publications" element={<Publications />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;