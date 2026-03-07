import mongoose from "mongoose";

const errorSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },

    message: {
      type: String,
      required: true
    },

    stack: {
      type: String
    },

    url: {
      type: String
    },

    resource: {
      type: String
    },

    tag: {
      type: String
    },

    requestUrl: {
      type: String
    },

    httpStatus: {
      type: Number
    },

    userAgent: {
      type: String
    },

    timestamp: {
      type: Date
    },

    status: {
      type: String,
      enum: ["active", "resolved"],
      default: "active"
    }

  },
  { timestamps: true }
);

// Compound index: all dashboard queries filter by projectId + status, sorted by createdAt
errorSchema.index({ projectId: 1, status: 1, createdAt: -1 });

const ErrorLog = mongoose.model("ErrorLog", errorSchema);

export default ErrorLog;