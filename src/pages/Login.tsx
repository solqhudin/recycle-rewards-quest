import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(studentId, password);
      if (success) {
        navigate('/dashboard');
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
      } else {
        toast({
          title: "Login failed",
          description: "Invalid Student ID or Password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-app-white mb-8">Login</h1>
        
        <div className="bg-app-container rounded-3xl p-8 shadow-lg">
          <h2 className="text-app-text text-xl mb-8 text-center">
            Please enter student ID and password.
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="text"
                placeholder="Student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full h-14 px-4 text-lg rounded-2xl border-none bg-app-white placeholder:text-app-text-muted focus-visible:ring-2 focus-visible:ring-app-primary"
                required
              />
            </div>
            
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 px-4 text-lg rounded-2xl border-none bg-app-white placeholder:text-app-text-muted focus-visible:ring-2 focus-visible:ring-app-primary"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 text-lg font-medium rounded-2xl bg-app-primary hover:bg-app-primary-hover text-app-white border-none"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>

            <div className="flex items-center justify-center space-x-4 my-6">
              <div className="h-px bg-app-text-muted flex-1"></div>
              <span className="text-app-text-muted">or</span>
              <div className="h-px bg-app-text-muted flex-1"></div>
            </div>

            <Link to="/signup">
              <Button
                type="button"
                variant="outline"
                className="w-full h-14 text-lg font-medium rounded-2xl bg-app-primary hover:bg-app-primary-hover text-app-white border-none"
              >
                Sign Up
              </Button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;