import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Activity, AlertTriangle, Clock } from "lucide-react";
import api from "../services/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { ErrorTable } from "../components/errors/ErrorTable";
import { ErrorSidePanel } from "../components/errors/ErrorSidePanel";
import { Skeleton } from "../components/ui/Skeleton";

function Dashboard() {
  const { selectedProject, list: projects } = useSelector(state => state.projects);
  const [errors, setErrors] = useState([]);
  const [selectedError, setSelectedError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Stats calculation
  const totalErrors = errors.length;
  // Assuming uniqueness is based on message for demonstration, normally backend handles this
  const uniqueIssues = new Set(errors.map(e => e.message)).size;
  const recentErrors = errors.filter(e => {
    const d = new Date(e.createdAt);
    const now = new Date();
    return (now - d) < 24 * 60 * 60 * 1000;
  }).length;

  useEffect(() => {
    const fetchErrors = async () => {
      if (!selectedProject) return;
      setIsLoading(true);
      try {
        const res = await api.get(`/errors`, { params: { projectId: selectedProject } });
        // Ensure errors exist or default to empty array
        setErrors(res.data.errors || []);
      } catch (error) {
        console.error("Failed to fetch errors for dashboard", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchErrors();
  }, [selectedProject]);

  const currentProjectName = projects.find(p => p._id === selectedProject)?.name || "Select a project";

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Overview of your application's health.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Errors</CardTitle>
            <div className="h-8 w-8 rounded-md bg-blue-50 flex items-center justify-center">
              <Activity className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-10 w-20 mb-2" />
            ) : (
              <div className="text-3xl font-bold text-gray-900">{totalErrors}</div>
            )}
            <div className="text-xs text-gray-500 font-medium mt-2">
              {isLoading ? (
                <Skeleton className="h-4 w-32" />
              ) : (
                <>{recentErrors} <span className="font-normal">in the last 24 hours</span></>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">Unique Issues</CardTitle>
            <div className="h-8 w-8 rounded-md bg-blue-50 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-10 w-20 mb-2" />
            ) : (
              <div className="text-3xl font-bold text-gray-900">{uniqueIssues}</div>
            )}
            <div className="text-xs text-gray-500 font-medium mt-2">
              {isLoading ? (
                <Skeleton className="h-4 w-24" />
              ) : (
                "Across all time"
              )}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Recent Errors Table Preview */}
      <div className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold tracking-tight text-gray-900">Recent Errors</h2>
        </div>

        {isLoading ? (
          <div className="space-y-3 mt-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <ErrorTable
            errors={errors.slice(0, 5)} // Show only 5 max as preview
            onRowClick={(err) => setSelectedError(err)}
            emptyStateMessage="Your app is running smoothly! No errors detected yet."
          />
        )}
      </div>

      {/* Hidden Side Panel Component (triggered on row click) */}
      <ErrorSidePanel
        isOpen={selectedError !== null}
        onClose={() => setSelectedError(null)}
        error={selectedError}
      />

    </div>
  );
}

export default Dashboard;