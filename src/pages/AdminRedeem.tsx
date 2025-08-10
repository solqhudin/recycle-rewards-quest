import { useEffect, useMemo, useState } from 'react';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdminRedeem = () => {
  const { users, conversionRate, redeemPointsForUser } = useAuth();

  const studentUsers = useMemo(() => users.filter(u => !u.isAdmin), [users]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(studentUsers[0]?.studentId || '');
  const [redeemPoints, setRedeemPoints] = useState<string>('0');

  useEffect(() => {
    document.title = 'แลกแต้มเป็นเงิน | Admin';
  }, []);

  useEffect(() => {
    if (studentUsers.length && !studentUsers.find(u => u.studentId === selectedStudentId)) {
      setSelectedStudentId(studentUsers[0].studentId);
    }
  }, [studentUsers, selectedStudentId]);

  const selectedUser = useMemo(() => studentUsers.find(u => u.studentId === selectedStudentId), [studentUsers, selectedStudentId]);
  const moneyFromPoints = (pts: number) => Math.floor(pts / Math.max(1, conversionRate));

  const handleConfirm = () => {
    const pts = parseInt(redeemPoints) || 0;
    if (!selectedUser || pts <= 0 || pts > selectedUser.totalPoints) return;
    redeemPointsForUser(selectedUser.studentId, pts);
    setRedeemPoints('0');
  };

  return (
    <div className="min-h-screen bg-app-background p-6">
      <div className="max-w-6xl mx-auto">
        <Navigation />

        <main className="bg-app-container rounded-3xl p-8 shadow-lg space-y-8 animate-fade-in">
          <header>
            <h1 className="text-3xl font-bold text-app-text">แลกแต้มเป็นเงินให้ผู้ใช้</h1>
            <p className="text-app-text-muted mt-1">เลือกผู้ใช้ ระบุคะแนนที่จะแลก แล้วกดยืนยัน</p>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-app-text">ผู้ใช้</label>
              <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                <SelectTrigger className="bg-app-white rounded-xl h-12">
                  <SelectValue placeholder="เลือกผู้ใช้" />
                </SelectTrigger>
                <SelectContent>
                  {studentUsers.map(u => (
                    <SelectItem key={u.studentId} value={u.studentId}>{u.name} ({u.studentId})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-app-text">คะแนนที่จะแลก</label>
              <Input type="number" value={redeemPoints} onChange={(e) => setRedeemPoints(e.target.value)} className="h-12 bg-app-white rounded-xl" />
            </div>

            <div className="space-y-2">
              <label className="text-app-text">จะได้เงิน</label>
              <div className="h-12 flex items-center px-4 bg-app-white rounded-xl text-app-primary font-bold">
                {moneyFromPoints(parseInt(redeemPoints) || 0)} บาท
              </div>
            </div>

            <div className="md:col-span-3">
              <Button onClick={handleConfirm} className="h-12 rounded-xl bg-app-primary text-app-white">ยืนยันแลกคะแนน</Button>
            </div>

            {selectedUser && (
              <p className="md:col-span-3 text-app-text-muted">คงเหลือปัจจุบันของ {selectedUser.name}: {selectedUser.totalPoints} คะแนน</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminRedeem;
