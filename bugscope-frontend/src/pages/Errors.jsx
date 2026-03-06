import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Search, Filter, RefreshCcw } from "lucide-react";
import toast from "react-hot-toast";
import { fetchErrors, resolveError } from "../store/errorSlice";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { ErrorTable } from "../components/errors/ErrorTable";
import { ErrorSidePanel } from "../components/errors/ErrorSidePanel";
import { Skeleton } from "../components/ui/Skeleton";

function Errors() {
  const dispatch = useDispatch();
  const { selectedProject } = useSelector(state => state.projects);
  const { list: errors, loading: isLoading } = useSelector(state => state.errors);
  const [selectedError, setSelectedError] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadErrors = () => {
    if (!selectedProject) return;
    dispatch(fetchErrors({ projectId: selectedProject, status: statusFilter }));
  };

  useEffect(() => {
    loadErrors();
  }, [selectedProject, statusFilter]);

  const handleResolve = async (id) => {
    try {
      await dispatch(resolveError(id)).unwrap();
      toast.success("Issue marked as resolved.");
      loadErrors();
    } catch (err) {
      toast.error("Failed to resolve issue. Please try again.");
    }
  };

  // Client-side search filter only (status filtering is done server-side)
  const filteredErrors = errors.filter((error) => {
    return (
      (error.message || "").toLowerCase().includes(search.toLowerCase()) ||
      (error.url || "").toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">

      {/* Header */}
      <div className="mb-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Errors</h1>
        <p className="text-gray-500 mt-1">
          Track and manage application errors.
        </p>
      </div>

      {/* Toolbar / Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50 p-4 border border-gray-200 rounded-lg shrink-0">

        <div className="flex w-full sm:w-auto flex-1 gap-4 items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search errors..."
              className="pl-9 bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="relative flex items-center gap-2">
            <Button variant="outline" className="gap-2 bg-white text-gray-700 border-gray-200 shadow-sm" onClick={() => { }}>
              <Filter className="h-4 w-4 text-gray-500" />
              Filter
            </Button>
            {/* Keeping the select element hidden behind standard button style, or using simple select */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="all">All Issues</option>
              <option value="active">Active</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={loadErrors}
          isLoading={isLoading}
          className="w-full sm:w-auto gap-2"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </Button>

      </div>

      {/* Main Error Table embedded in scrollable area */}
      <div className="flex-1 overflow-auto min-h-[400px]">
        {isLoading ? (
          <div className="space-y-3 mt-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <ErrorTable
            errors={filteredErrors}
            onRowClick={(err) => setSelectedError(err)}
            onResolve={handleResolve}
            emptyStateMessage={
              search || statusFilter !== 'all'
                ? "No errors match your current filters."
                : "Great job! No errors have been recorded yet."
            }
          />
        )}
      </div>

      {/* Slide-over details pane */}
      <ErrorSidePanel
        isOpen={selectedError !== null}
        onClose={() => setSelectedError(null)}
        error={selectedError}
      />

    </div>
  );
}

export default Errors;