import { Link } from "react-router-dom";

function ForgotPassword() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">

        <h1 className="text-3xl font-bold text-white text-center mb-3">
          Forgot Password
        </h1>

        <p className="text-slate-400 text-center mb-8">
          Enter your registered email to reset your password.
        </p>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
        />

        <button
          className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
        >
          Send Reset Link
        </button>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-blue-500 hover:text-blue-400"
          >
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
}

export default ForgotPassword;