import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Bug } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const login = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      toast.success("Signed in successfully!");
      navigate("/dashboard");
    } catch (error) {
      const msg = error.response?.data?.message;
      if (error.response?.status === 401) {
        toast.error("Invalid email or password. Please try again.");
      } else if (msg) {
        toast.error(msg);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">

      <div className="w-full max-w-md flex flex-col items-center">
        {/* Logo Header */}
        <div className="flex items-center gap-3 mb-6">
          <Bug className="h-8 w-8 text-blue-600" />
          <span className="text-3xl font-bold tracking-tight text-gray-900 font-sans">BugScope</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Sign in to your account
        </h1>

        <Card className="w-full bg-white border-gray-200 shadow-sm rounded-xl">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email address</label>
              <Input
                placeholder="developer@acme.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && login()}
              />
            </div>

            <Button
              className="w-full mt-2"
              onClick={login}
              isLoading={isLoading}
            >
              Sign in
            </Button>
          </CardContent>
        </Card>

        <p className="mt-8 text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-500 font-medium">
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;