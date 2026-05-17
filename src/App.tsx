import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { RequireAuth } from './components/auth/RequireAuth'
import { AppLayout } from './components/layout/AppLayout'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'

const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const DiagnosePage = lazy(() => import('./pages/DiagnosePage'))
const EventsPage = lazy(() => import('./pages/EventsPage'))
const MyPage = lazy(() => import('./pages/MyPage'))

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>로딩중...</div>}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/diagnose" element={<DiagnosePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route
              path="/me"
              element={
                <RequireAuth>
                  <MyPage />
                </RequireAuth>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
