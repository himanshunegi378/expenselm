import { SignupPage } from './pages/Signup.page';
import { SigninPage } from './pages/Signin.page';
import { PublicRoute } from './components';
import { ProtectedRoute } from './components';
import authReducer from './store/auth.slice';
import { signout } from './actions/auth.actions';
import { useProfile } from './hooks/useProfile';

// Public API for the auth feature
export type { User } from './types/auth.types';
export { SignupPage, SigninPage, PublicRoute, ProtectedRoute }

export { authReducer, signout as singoutAction }

export { useProfile }
