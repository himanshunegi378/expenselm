import { SignupForm } from "../components";

export function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-2">ExpenseLM</h1>
        <h2 className="text-xl text-center text-gray-600 mb-8">Sign up for your account</h2>
      </div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <SignupForm />
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
