import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { DashboardPage, SignupPage, SigninPage } from './pages';
import { ProtectedRoute, PublicRoute } from './features/auth';
import { ExpensePage } from './features/expense';
import { Fragment } from 'react/jsx-runtime';
import AddExpenseForm from './features/expense/components/AddExpense/AddExpenseForm';
import { AddExpensePage } from './features/expense/pages/AdddExpense.page';
import { UpdateExpensePage } from './features/expense/pages/updateExpense.page';

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
            <Route path='expense' element={<ExpensePage />}>
            <Route path="add" element={<AddExpensePage />} />
            <Route path="update/:id" element={<UpdateExpensePage />} />

            </Route>
          </Route>

          {/* Default route redirects to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
