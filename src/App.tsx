import { QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './widgets/layout/Layout';
import { MainPage } from './pages/MainPage';
import { TradePage } from './pages/TradePage';
import { queryClient } from './shared/api/queryClient';
import { HashRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/trade" element={<TradePage />} />
          </Routes>
        </Layout>
      </HashRouter>
    </QueryClientProvider>
  );
}

export default App;
