import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { DashboardPage, SignupPage, SigninPage } from './pages';
import { ProtectedRoute, PublicRoute } from './features/auth';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route element={<PublicRoute />}>
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<SigninPage />} />
          </Route>

          {/* Protected routes */}
          <Route element={<ProtectedRoute redirectPath="/login" />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>

          {/* Default route redirects to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
