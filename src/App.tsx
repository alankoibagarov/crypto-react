import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/api/queryClient';
import { HashRouter } from 'react-router-dom';
import { ToastContainer } from '@/components/Toast/Toast';
import { Suspense } from 'react';
import { ErrorBoundary } from '@components/ErrorBoundary/ErrorBoundary';
import { RouteList } from '@routing/RouteList';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <ErrorBoundary fallback={<div>Oops! App crashed.</div>}>
            <RouteList />
          </ErrorBoundary>
          <ToastContainer />
        </Suspense>
      </HashRouter>
    </QueryClientProvider>
  );
}

export default App;
