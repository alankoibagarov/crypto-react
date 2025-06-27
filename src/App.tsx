import { QueryClientProvider } from '@tanstack/react-query';
import { MainLayout } from '@layouts/MainLayout/MainLayout';
import { queryClient } from '@/api/queryClient';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from '@/components/Toast/Toast';
import ProtectedRoute from '@/routing/ProtectedRoute';
import { lazy, Suspense } from 'react';
import { ErrorBoundary } from '@components/ErrorBoundary/ErrorBoundary';

const MainPage = lazy(() => import('@/pages/MainPage/MainPage'));
const TradePage = lazy(() => import('@/pages/TradePage/TradePage'));

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <ErrorBoundary fallback={<div>Oops! App crashed.</div>}>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<MainPage />} />
                <Route
                  path="/trade"
                  element={
                    <ProtectedRoute>
                      <TradePage />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Routes>
          </ErrorBoundary>
          <ToastContainer />
        </Suspense>
      </HashRouter>
    </QueryClientProvider>
  );
}

export default App;
