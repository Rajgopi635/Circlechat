import { Search, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Sidebar({
  friends,
  unreadCounts,
  activeFriend,
  setActiveFriend,
  searchTerm,
  setSearchTerm,
  currentUser,
  mobileSidebarOpen,
  setMobileSidebarOpen,
}) {
  const navigate = useNavigate();

  const filteredFriends = friends.filter((friend) =>
    friend.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const SidebarContent = () => {
    return (
      <>
        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-800 p-5">

          <h1 className="text-2xl font-bold">
            CircleChat
          </h1>

          <button
            className="md:hidden"
            onClick={() =>
              setMobileSidebarOpen(false)
            }
          >
            <X size={24} />
          </button>

        </div>

        {/* Search */}

        <div className="p-4">

          <div className="relative">

            <Search
              size={18}
              className="absolute left-3 top-3 text-slate-400"
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              placeholder="Search friends..."
              className="w-full rounded-lg bg-slate-800 py-2 pl-10 pr-3 outline-none"
            />

          </div>

        </div>

        {/* Friends */}

        <div className="flex-1 overflow-y-auto px-4">

          <h2 className="mb-3 text-sm text-slate-400">
            Friends
          </h2>

          <div className="space-y-2">

            {filteredFriends.map((friend) => (

              <div
                key={friend.id}
                onClick={() =>
                  setActiveFriend(friend)
                }
                className={`flex cursor-pointer items-center gap-3 rounded-lg p-3 transition ${
                  activeFriend?.id === friend.id
                    ? "bg-blue-600 shadow-lg shadow-blue-500/30"
                    : "bg-slate-800 hover:bg-slate-700"
                }`}
              >

                <div className="relative">

                  <img
                    src={
                      friend.avatar_url ||
                      "https://placehold.co/80x80"
                    }
                    alt={friend.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />

                  <div
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-900 ${
                      friend.online
                        ? "bg-green-500"
                        : "bg-slate-500"
                    }`}
                  />

                </div>

                <div className="flex-1">

                  <div className="flex items-center gap-2">

                    <span>
                      {friend.name}
                    </span>

                    {unreadCounts?.[
                      friend.id
                    ] > 0 && (

                      <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                        {
                          unreadCounts[
                            friend.id
                          ]
                        }
                      </span>

                    )}

                  </div>

                  <div className="text-xs text-slate-400">

                    {friend.online
                      ? "Online"
                      : friend.lastSeen
                      ? `Last seen ${new Date(
                          friend.lastSeen
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}`
                      : "Offline"}

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* Profile */}

        <div className="border-t border-slate-800 p-4">

          <button
            onClick={() =>
              navigate("/profile")
            }
            className="flex w-full items-center gap-3 rounded-lg bg-slate-800 p-3 transition hover:bg-slate-700"
          >

            <img
              src={
                currentUser?.avatar_url ||
                "https://placehold.co/100x100"
              }
              alt="Profile"
              className="h-12 w-12 rounded-full border-2 border-slate-600 object-cover"
            />

            <div className="text-left">

              <p className="font-medium">
                {currentUser?.username ||
                  currentUser?.email?.split("@")[0]}
              </p>

              <p className="text-xs text-green-400">
                View Profile
              </p>

            </div>

          </button>

        </div>

      </>
    );
  };
    return (
    <>
      {/* Mobile Top Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 p-4 md:hidden">

        <button
          onClick={() =>
            setMobileSidebarOpen(true)
          }
          className="rounded-lg p-2 hover:bg-slate-800"
        >
          <Menu size={24} />
        </button>

        <h1 className="text-xl font-bold">
          CircleChat
        </h1>

        <div className="w-10" />

      </div>

      {/* Mobile Overlay */}

      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() =>
            setMobileSidebarOpen(false)
          }
        />
      )}

      {/* Mobile Sidebar */}

      <div
        className={`fixed top-0 left-0 z-50 flex h-full w-72 flex-col bg-slate-900 transform transition-transform duration-300 md:hidden ${
          mobileSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </div>

      {/* Desktop Sidebar */}

      <div className="hidden h-full w-72 flex-col border-r border-slate-800 bg-slate-900 md:flex">

        <SidebarContent />

      </div>

    </>
  );
}

export default Sidebar;