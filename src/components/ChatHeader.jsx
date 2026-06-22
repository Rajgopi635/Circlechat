import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import { supabase } from "../lib/supabase";

function ChatHeader({ activeFriend }) {
  const navigate = useNavigate();

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
    <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6">
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

      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition"
      >
        Logout
      </button>
    </div>
  );
}

export default ChatHeader;