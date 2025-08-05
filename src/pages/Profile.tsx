import { useState } from 'react';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  if (!user) return null;

  const handleUpdate = () => {
    const updates: any = {};
    if (editForm.name !== user.name) updates.name = editForm.name;
    if (editForm.email !== user.email) updates.email = editForm.email;
    if (editForm.password) updates.password = editForm.password;

    if (Object.keys(updates).length > 0) {
      updateProfile(updates);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
    }
    setIsEditOpen(false);
  };

  return (
    <div className="min-h-screen bg-app-background p-6">
      <div className="max-w-6xl mx-auto">
        <Navigation />
        
        <div className="bg-app-container rounded-3xl p-8 shadow-lg">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-app-white rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-app-primary" />
              </div>
            </div>
            
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button className="h-12 px-6 text-lg font-medium rounded-2xl bg-app-primary hover:bg-app-primary-hover text-app-white">
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-app-white rounded-3xl">
                <DialogHeader>
                  <DialogTitle className="text-app-primary text-2xl font-bold text-center">
                    Edit Profile
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 p-4">
                  <div>
                    <label className="text-app-text block mb-2">Name</label>
                    <Input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full h-12 px-4 rounded-xl border border-app-border focus-visible:ring-2 focus-visible:ring-app-primary"
                    />
                  </div>
                  <div>
                    <label className="text-app-text block mb-2">Email</label>
                    <Input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full h-12 px-4 rounded-xl border border-app-border focus-visible:ring-2 focus-visible:ring-app-primary"
                    />
                  </div>
                  <div>
                    <label className="text-app-text block mb-2">New Password (optional)</label>
                    <Input
                      type="password"
                      value={editForm.password}
                      onChange={(e) => setEditForm(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full h-12 px-4 rounded-xl border border-app-border focus-visible:ring-2 focus-visible:ring-app-primary"
                      placeholder="Leave empty to keep current password"
                    />
                  </div>
                  <Button
                    onClick={handleUpdate}
                    className="w-full h-12 text-lg font-medium rounded-xl bg-app-primary hover:bg-app-primary-hover text-app-white"
                  >
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-app-text text-xl font-medium mb-2">User</h3>
                <p className="text-app-text text-2xl">{user.name}</p>
              </div>
              
              <div>
                <h3 className="text-app-text text-xl font-medium mb-2">Student ID</h3>
                <p className="text-app-text text-2xl">{user.studentId}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-app-text text-xl font-medium mb-2">E-mail</h3>
                <p className="text-app-text text-2xl">{user.email}</p>
              </div>
              
              <div>
                <h3 className="text-app-text text-xl font-medium mb-2">Password</h3>
                <p className="text-app-text text-2xl">••••••••</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;