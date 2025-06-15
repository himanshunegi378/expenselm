import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { DashboardPage, SignupPage, SigninPage } from './pages';
import { ProtectedRoute, PublicRoute } from './features/auth';
import { ExpensePage } from './features/expense';
import { AddExpensePage } from './features/expense/pages/AdddExpense.page';
import { UpdateExpensePage } from './features/expense/pages/updateExpense.page';
import { format } from 'date-fns';
import { ExpensePageWrapper } from './features/expense/pages/Expense.page';

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
            <Route path='expense'>
              <Route index element={<Navigate to={"/expense/" + format(new Date(), 'yyyy-MM-dd')} />} />
              <Route path=':date' element={<ExpensePageWrapper />}>
                <Route path="add" element={<AddExpensePage />} />
                <Route path="update/:id" element={<UpdateExpensePage />} />
              </Route>
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
