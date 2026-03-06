import Project from "../models/Project.js";
import ErrorLog from "../models/Error.js";

export const ingestError = async (req, res) => {

  try {

    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
      return res.status(401).json({
        message: "API key missing"
      });
    }

    const project = await Project.findOne({ apiKey });

    if (!project) {
      return res.status(401).json({
        message: "Invalid API key"
      });
    }

    const { message, stack, url, userAgent, timestamp } = req.body;

    const error = await ErrorLog.create({
      projectId: project._id,
      message,
      stack,
      url,
      userAgent,
      timestamp
    });

    res.status(201).json({
      success: true
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

export const getProjectErrors = async (req, res) => {

  try {

    const { projectId, status } = req.query;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 25); // max 50 per page
    const skip = (page - 1) * limit;

    if (!projectId) {
      return res.status(400).json({ message: "projectId query parameter is required" });
    }

    const filter = { projectId };

    if (status && status !== "all") {
      filter.status = status;
    }

    const [errors, total] = await Promise.all([
      ErrorLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ErrorLog.countDocuments(filter)
    ]);

    res.json({
      errors,
      total,
      page,
      pages: Math.ceil(total / limit),
      limit
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

export const resolveError = async (req, res) => {

  try {

    const error = await ErrorLog.findByIdAndUpdate(
      req.params.id,
      { status: "resolved" },
      { new: true }
    );

    if (!error) {
      return res.status(404).json({ message: "Error not found" });
    }

    res.json({ error });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};