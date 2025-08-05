import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Signup = () => {
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await signup(studentId, name, email, password);
      if (success) {
        navigate('/login');
        toast({
          title: "Account created successfully",
          description: "Please login with your credentials",
        });
      } else {
        toast({
          title: "Signup failed",
          description: "Student ID or email already exists",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during signup",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-app-white mb-8">Sign Up</h1>
        
        <div className="bg-app-container rounded-3xl p-8 shadow-lg">
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
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-14 px-4 text-lg rounded-2xl border-none bg-app-white placeholder:text-app-text-muted focus-visible:ring-2 focus-visible:ring-app-primary"
                required
              />
            </div>

            <div>
              <Input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-app-text hover:text-app-primary transition-colors">
              Already have an account? Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;