import { Route, Routes } from 'react-router-dom';
import { lazy } from 'react';
import ProtectedRoute from '@/routing/ProtectedRoute';
import { MainLayout } from '@layouts/MainLayout/MainLayout';

const MainPage = lazy(() => import('@/pages/MainPage/MainPage'));
const TradePage = lazy(() => import('@/pages/TradePage/TradePage'));

export const RouteList = () => {
  return (
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
  );
};
