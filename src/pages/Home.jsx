import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">

      <div className="text-center">

        <h1 className="text-5xl font-bold text-white mb-4">
          CircleChat
        </h1>

        <p className="text-slate-400 mb-8">
          Real-Time Messaging Platform
        </p>

        <Link
          to="/chat"
          className="bg-blue-600 text-white px-8 py-4 rounded-xl"
        >
          Open Chat
        </Link>

      </div>

    </div>
  );
}

export default Home;