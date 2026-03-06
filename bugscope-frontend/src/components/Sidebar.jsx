import { Link } from "react-router-dom";

function Sidebar() {

  return (

    <div className="w-64 h-screen bg-gray-900 text-white p-6">

      <h1 className="text-2xl font-bold mb-10">
        BugScope
      </h1>

      <nav className="flex flex-col gap-4">

        <Link to="/dashboard">Dashboard</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/errors">Errors</Link>

      </nav>

    </div>

  );

}

export default Sidebar;