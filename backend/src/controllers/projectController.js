import Project from "../models/Project.js";
import generateApiKey from "../utils/generateApiKey.js";


// Create Project
export const createProject = async (req, res) => {
  try {

    const { name } = req.body;

    const apiKey = generateApiKey();

    const project = await Project.create({
      name,
      apiKey,
      userId: req.user._id
    });

    res.status(201).json(project);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Get All Projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      userId: req.user._id
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};