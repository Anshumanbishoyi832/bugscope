import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import { setProjects } from "../store/projectSlice";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { CodeBlock } from "../components/ui/CodeBlock";

function Projects() {
  const dispatch = useDispatch();
  const { list: projects } = useSelector(state => state.projects);
  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch projects (to refresh list after creation)
  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      dispatch(setProjects(res.data));
    } catch (error) {
      console.error("Failed to refresh projects", error);
    }
  };

  // Create Project
  const createProject = async () => {
    if (!projectName.trim()) {
      toast.error("Please enter a project name.");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post("/projects", { name: projectName });
      setProjectName("");
      setShowModal(false);
      await fetchProjects();
      toast.success("Project created successfully!");
    } catch (error) {
      const msg = error.response?.data?.message;
      toast.error(msg || "Failed to create project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Projects</h1>
          <p className="text-gray-500 mt-1">Manage your application projects and API keys.</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          Create Project
        </Button>
      </div>

      {projects.length === 0 ? (

        /* Empty State */
        <Card className="flex flex-col items-center justify-center py-16 text-center border-dashed border-2 border-gray-200">
          <div className="rounded-full bg-blue-50 p-4 mb-4">
            <Plus className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900">No projects yet</h3>
          <p className="text-gray-500 text-sm max-w-sm mb-6">
            Create your first project to generate an API key and start monitoring errors in your application.
          </p>
          <Button onClick={() => setShowModal(true)}>Create Project</Button>
        </Card>

      ) : (

        /* Projects List */
        <div className="grid gap-6">
          {projects.map((project) => (
            <Card key={project._id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 flex flex-row items-center justify-between border-b border-gray-200 pb-4">
                <div>
                  <CardTitle className="text-gray-900">{project.name}</CardTitle>
                  <CardDescription>
                    Created on {new Date(project.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="pt-6 space-y-6">

                {/* API Key Section */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Project API Key</label>
                  <div className="flex gap-3">
                    <Input
                      value={project.apiKey}
                      readOnly
                      className="font-mono text-gray-600 bg-gray-50"
                    />
                    <Button
                      variant="secondary"
                      onClick={() => {
                        navigator.clipboard.writeText(project.apiKey);
                        toast.success("API key copied to clipboard!");
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>

                {/* SDK Installation Section */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">SDK Installation</label>
                  <p className="text-xs text-gray-500 mb-3">Add this code to your HTML file</p>
                  <CodeBlock
                    language="html"
                    code={`<script src="${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/sdk/bugscope.js"></script>

<script>
BugScope.init({
  apiKey: "${project.apiKey}"
});
</script>`}
                  />
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-white border-gray-200 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <CardHeader>
              <CardTitle className="text-xl">Create New Project</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Project Name</label>
              <Input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name"
                className="mb-2"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && createProject()}
              />
              <p className="text-xs text-gray-500 mb-6">Choose a descriptive name for your project.</p>
              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setShowModal(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button onClick={createProject} isLoading={isSubmitting}>
                  Create Project
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

    </div>
  );
}

export default Projects;