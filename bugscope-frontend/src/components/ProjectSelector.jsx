import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../services/api";
import { setProjects, selectProject } from "../store/projectSlice";

function ProjectSelector() {

  const dispatch = useDispatch();

  const { list } = useSelector((state) => state.projects);

  const fetchProjects = async () => {

    const res = await api.get("/projects");

    dispatch(setProjects(res.data));

  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (

    <select
      onChange={(e) => dispatch(selectProject(e.target.value))}
      className="border p-2 rounded"
    >

      <option>Select Project</option>

      {list.map((project) => (

        <option key={project._id} value={project._id}>
          {project.name}
        </option>

      ))}

    </select>

  );

}

export default ProjectSelector;