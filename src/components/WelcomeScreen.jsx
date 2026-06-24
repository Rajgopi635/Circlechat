import { LogOut } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

function WelcomeScreen() {
  const navigate = useNavigate();

  const handleLogout = async () => {
  await supabase.auth.signOut();
  navigate("/login");
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

        <div className="text-8xl mb-6">
          💬
        </div>

        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to CircleChat
        </h1>

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