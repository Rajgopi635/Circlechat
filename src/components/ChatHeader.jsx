import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";

function ChatHeader({ activeFriend }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  return (
    <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6">
      <div>
        <h2 className="font-semibold">
          {activeFriend.name}
        </h2>

        <p className="text-xs text-green-400">
          {activeFriend.online
            ? "Online"
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