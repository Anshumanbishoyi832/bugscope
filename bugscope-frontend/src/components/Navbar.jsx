import ProjectSelector from "./ProjectSelector";

function Navbar() {

  return (

    <div className="flex justify-between items-center bg-white shadow p-4">

      <h2 className="text-xl font-semibold">
        BugScope Dashboard
      </h2>

      <ProjectSelector />

    </div>

  );

}

export default Navbar;