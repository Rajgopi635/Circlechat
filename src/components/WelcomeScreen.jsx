import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

function WelcomeScreen() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

useEffect(() => {
  const savedUser = localStorage.getItem("circlechat_user");

  if (savedUser) {
    setUser(JSON.parse(savedUser));
  }
}, []);

  const handleLogout = async () => {
  await supabase.auth.signOut();

  localStorage.removeItem("circlechat_user");

  navigate("/", { replace: true });
};

  return (
   <div className="relative flex-1 flex items-center justify-center">

    <div className="absolute top-6 right-6">
  <button
    onClick={handleLogout}
    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white"
  >
    <LogOut size={18} />
    Logout
  </button>
</div>

      <div className="text-center max-w-lg px-6">

        <div className="mb-6 flex justify-center">

  <img
    src={
      user?.avatar_url ||
      "https://placehold.co/120x120"
    }
    alt="Profile"
    className="w-28 h-28 rounded-full object-cover border-4 border-blue-500"
  />

</div>

        <h1 className="text-4xl font-bold text-white mb-2">
  Welcome to CircleChat
</h1>

<p className="text-blue-400 text-xl font-semibold mb-4">
  {user?.full_name || user?.username || "User"}
</p>

        <p className="text-slate-400 text-lg mb-8">
          Stay connected with your friends in real-time.
        </p>

        <div className="space-y-3 text-slate-300">

          <div>
            ✓ Instant Messaging
          </div>

          <div>
            ✓ Online Presence
          </div>

          <div>
            ✓ Typing Indicators
          </div>

          <div>
            ✓ Secure Conversations
          </div>

        </div>

        <div className="mt-10 text-slate-500">
          Select a conversation from the sidebar to start chatting.
        </div>

      </div>
    </div>
  );
}

export default WelcomeScreen;