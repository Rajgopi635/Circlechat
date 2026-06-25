import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { supabase } from "../lib/supabase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  const { data, error } = await loginUser(email, password);

if (error) {
  alert(error.message);
  return;
}

if (data?.user) {
  await supabase
    .from("profiles")
    .update({
      is_online: true,
      last_seen: new Date().toISOString(),
    })
    .eq("id", data.user.id);
}

navigate("/");
};

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">

        <div className="text-center mb-8">
          <h1 className="text-white text-4xl font-bold">
            CircleChat
          </h1>

          <p className="text-slate-400 mt-2">
            Connect with your friends
          </p>
        </div>

        <form className="space-y-5">

          <div>
            <label className="text-slate-300 text-sm block mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-slate-300 text-sm block mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="button"
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Login
          </button>

        </form>

        <div className="text-center mt-6">
          <span className="text-slate-400">
            Don't have an account?
          </span>

          <Link
            to="/register"
            className="text-blue-500 ml-2 hover:text-blue-400"
          >
            Register
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Login;