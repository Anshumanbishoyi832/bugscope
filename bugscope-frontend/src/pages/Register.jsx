import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Bug } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const register = async () => {
    if (!name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post("/auth/register", { name, email, password });
      localStorage.setItem("token", res.data.token);
      toast.success("Account created! Welcome to BugScope.");
      navigate("/projects");
    } catch (error) {
      const msg = error.response?.data?.message;
      if (error.response?.status === 409) {
        toast.error("An account with this email already exists.");
      } else if (msg) {
        toast.error(msg);
      } else {
        toast.error("Registration failed. Please try again.");
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
          Create your account
        </h1>

        <Card className="w-full bg-white border-gray-200 shadow-sm rounded-xl">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <Input
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

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
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Confirm Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && register()}
              />
            </div>

            <Button
              className="w-full mt-2"
              onClick={register}
              isLoading={isLoading}
            >
              Register
            </Button>
          </CardContent>
        </Card>

        <p className="mt-8 text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/" className="text-blue-600 hover:text-blue-500 font-medium">
            Sign in here
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;