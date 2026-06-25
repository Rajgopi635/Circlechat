import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  ArrowLeft,
  LogOut,
} from "lucide-react";

import { logoutUser } from "../services/authService";
import { supabase } from "../lib/supabase";

function ChatHeader({ activeFriend }) {
  const navigate = useNavigate();
  const location = useLocation();

  const showBackButton =
    window.innerWidth < 768 &&
    location.pathname === "/chat";

  const handleLogout = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase
        .from("users")
        .update({
          is_online: false,
          last_seen: new Date(),
        })
        .eq("id", user.id);
    }

    await logoutUser();

    navigate("/");
  };

  return (
    <div className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 md:px-6">

      {/* Left Side */}

      <div className="flex items-center gap-3">

        {showBackButton && (
          <button
            onClick={() => navigate(-1)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-800"
          >
            <ArrowLeft size={22} />
          </button>
        )}

        <img
          src={
            activeFriend.avatar_url ||
            "https://placehold.co/100x100"
          }
          alt={activeFriend.name}
          className="w-10 h-10 rounded-full object-cover"
        />

        <div>

          <h2 className="font-semibold">
            {activeFriend.name}
          </h2>

          <p
            className={`text-xs ${
              activeFriend.online
                ? "text-green-400"
                : "text-slate-400"
            }`}
          >
            {activeFriend.online
              ? "Online"
              : activeFriend.lastSeen
              ? `Last seen ${new Date(
                  activeFriend.lastSeen
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : "Offline"}
          </p>

        </div>

      </div>

      {/* Logout Button */}

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
      >
        <LogOut size={18} />

        <span className="hidden sm:block">
          Logout
        </span>

      </button>

    </div>
  );
}

export default ChatHeader;