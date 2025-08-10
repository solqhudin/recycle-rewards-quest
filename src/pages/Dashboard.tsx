import Navigation from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Coins } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <div className="min-h-screen bg-app-background p-6">
      <div className="max-w-6xl mx-auto">
        <Navigation />
        
        <div className="bg-app-container rounded-3xl p-8 shadow-lg animate-fade-in">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-app-text text-2xl mb-2">User</h2>
              <p className="text-app-text text-3xl font-bold">{user.studentId}</p>
            </div>
            
            {!user.isAdmin && (
              <div className="text-right">
                <h2 className="text-app-text text-2xl mb-3">Total Points</h2>
                <div className="inline-flex flex-col items-end bg-app-white rounded-2xl px-6 py-4 shadow-lg border border-app-border/50 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <Coins className="text-app-primary" size={36} aria-hidden />
                    <span className="leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-app-primary to-app-text text-7xl font-extrabold">
                      {user.totalPoints}
                    </span>
                  </div>
                  <span className="text-app-text-muted text-sm mt-2">คะแนนสะสมของคุณ</span>
                </div>
              </div>
            )}
          </div>

          {!user.isAdmin && (
            <div className="flex justify-end">
              <p className="text-app-text-muted">การแลกคะแนนทำโดยผู้ดูแลระบบเท่านั้น</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
