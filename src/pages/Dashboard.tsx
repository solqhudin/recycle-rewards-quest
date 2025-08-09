import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Coins } from 'lucide-react';

const Dashboard = () => {
  const { user, redeemPoints, conversionRate } = useAuth();
  const { toast } = useToast();
  const [redeemAmount, setRedeemAmount] = useState(user?.totalPoints?.toString() || '0');
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const handleRedeemChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue <= user.totalPoints) {
      setRedeemAmount(value);
    }
  };

const calculateMoney = (points: number) => {
  return Math.floor(points / conversionRate); // conversionRate points = 1 baht
};

  const handleRedeem = () => {
    const points = parseInt(redeemAmount) || 0;
    if (points > user.totalPoints) {
      toast({
        title: "ไม่สามารถแลกได้",
        description: "คะแนนไม่เพียงพอ",
        variant: "destructive",
      });
      return;
    }

    if (points <= 0) {
      toast({
        title: "ไม่สามารถแลกได้",
        description: "กรุณาระบุจำนวนคะแนนที่ถูกต้อง",
        variant: "destructive",
      });
      return;
    }

    const success = redeemPoints(points);
    if (success) {
      const money = calculateMoney(points);
      toast({
        title: "แลกคะแนนสำเร็จ",
        description: `ได้เงิน ${money} บาท`,
      });
      setIsOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-background p-6">
      <div className="max-w-6xl mx-auto">
        <Navigation />
        
        <div className="bg-app-container rounded-3xl p-8 shadow-lg">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-app-text text-2xl mb-2">User</h2>
              <p className="text-app-text text-3xl font-bold">{user.studentId}</p>
            </div>
            
              {!user.isAdmin && (
                <div className="text-right">
                  <h2 className="text-app-text text-2xl mb-3">Total Points</h2>
                  <div className="inline-flex flex-col items-end bg-app-white rounded-2xl px-6 py-4 shadow-lg border border-app-border/50">
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
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button className="h-14 px-8 text-lg font-medium rounded-2xl bg-app-primary hover:bg-app-primary-hover text-app-white">
                    แลกคะแนน
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-app-white rounded-3xl">
                  <DialogHeader>
                    <DialogTitle className="text-app-primary text-2xl font-bold text-center">
                      Redeem Points
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 p-4">
                    <div>
                      <label className="text-app-text block mb-2">
                        กรอกจำนวนคะแนนที่จะแลก
                      </label>
                      <Input
                        type="number"
                        value={redeemAmount}
                        onChange={(e) => handleRedeemChange(e.target.value)}
                        max={user.totalPoints}
                        className="h-12 px-4 text-lg rounded-xl bg-app-primary text-app-white placeholder:text-app-white/70 border-none"
                      />
                    </div>

                    <div className="text-center">
                      <p className="text-app-text text-lg mb-2">ได้เงิน</p>
                      <div className="flex items-center justify-center space-x-2">
                        <span className="bg-app-primary text-app-white px-6 py-3 rounded-xl text-2xl font-bold">
                          {calculateMoney(parseInt(redeemAmount) || 0)}
                        </span>
                        <span className="text-app-primary text-2xl font-bold">บาท</span>
                      </div>
                    </div>

                    <Button
                      onClick={handleRedeem}
                      className="w-full h-14 text-lg font-medium rounded-2xl bg-app-primary hover:bg-app-primary-hover text-app-white"
                    >
                      ยืนยันแลกคะแนน
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;