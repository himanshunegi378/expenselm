import { store } from "../../../store";
import type { useSignin } from "../hooks/useSignin";
import type { useSignup } from "../hooks/useSignup";
import { loginUser, logoutUser } from "../store/auth.slice";
import type { LoginFormData, SignupFormData } from "../types/auth.types";
import type { NavigateFunction } from "react-router-dom";

export const signup = async (signupMutation: ReturnType<typeof useSignup>['signup'], data: SignupFormData, navigate: NavigateFunction) => {
    try {
        const response = await signupMutation(data);
        navigate('/login');
        store.dispatch(loginUser({ ...response.user, token: response.token }))
    } catch (error) {
        console.error(error);
    }
}

export const login = async (loginMutation: ReturnType<typeof useSignin>['signin'], data: LoginFormData, navigate: NavigateFunction) => {
    try {
        const response = await loginMutation(data);
        navigate('/expense');
        store.dispatch(loginUser({ ...response.user, token: response.token }))
    } catch (error) {
        console.error(error);
    }
}

export const signout = () => {
    store.dispatch(logoutUser())
}



