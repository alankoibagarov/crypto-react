import { QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './widgets/layout/Layout';
import { MainPage } from './pages/MainPage';
import { TradePage } from './pages/TradePage';
import { queryClient } from './shared/api/queryClient';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/trade" element={<TradePage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
