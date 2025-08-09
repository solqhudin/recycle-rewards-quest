import { useEffect, useMemo, useState } from 'react';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const { users, conversionRate, setConversionRate, redeemPointsForUser, redeemHistory } = useAuth();
  const { toast } = useToast();

  const studentUsers = useMemo(() => users.filter(u => !u.isAdmin), [users]);

  const [rateInput, setRateInput] = useState<string>(conversionRate.toString());
  const [selectedStudentId, setSelectedStudentId] = useState<string>(studentUsers[0]?.studentId || '');
  const [redeemPoints, setRedeemPoints] = useState<string>('0');

  const selectedUser = useMemo(() => studentUsers.find(u => u.studentId === selectedStudentId), [studentUsers, selectedStudentId]);

  useEffect(() => {
    document.title = 'Admin | Student Recycling';
  }, []);

  useEffect(() => {
    // ensure selection valid when users change
    if (studentUsers.length && !studentUsers.find(u => u.studentId === selectedStudentId)) {
      setSelectedStudentId(studentUsers[0].studentId);
    }
  }, [studentUsers, selectedStudentId]);

  const moneyFromPoints = (pts: number) => Math.floor(pts / Math.max(1, conversionRate));

  const handleUpdateRate = () => {
    const newRate = parseInt(rateInput);
    if (!newRate || newRate <= 0) {
      toast({ title: 'อัตราไม่ถูกต้อง', description: 'กรุณาระบุตัวเลขมากกว่า 0', variant: 'destructive' });
      return;
    }
    setConversionRate(newRate);
    toast({ title: 'อัปเดตอัตราสำเร็จ', description: `ใช้อัตรา ${newRate} คะแนน = 1 บาท` });
  };

  const handleRedeemForUser = () => {
    const pts = parseInt(redeemPoints) || 0;
    if (!selectedUser) return;
    if (pts <= 0) {
      toast({ title: 'จำนวนคะแนนไม่ถูกต้อง', description: 'กรุณาระบุคะแนนที่ต้องการแลก', variant: 'destructive' });
      return;
    }
    if (pts > selectedUser.totalPoints) {
      toast({ title: 'คะแนนไม่พอ', description: 'คะแนนของผู้ใช้น้อยกว่าที่ต้องการแลก', variant: 'destructive' });
      return;
    }
    const ok = redeemPointsForUser(selectedUser.studentId, pts);
    if (ok) {
      const money = moneyFromPoints(pts);
      toast({ title: 'แลกคะแนนสำเร็จ', description: `${selectedUser.name} ได้เงิน ${money} บาท` });
      setRedeemPoints('0');
    }
  };

  return (
    <div className="min-h-screen bg-app-background p-6">
      <div className="max-w-6xl mx-auto">
        <Navigation />

        <div className="bg-app-container rounded-3xl p-8 shadow-lg space-y-10">
          <h1 className="text-3xl font-bold text-app-text">Admin Panel</h1>

          <section aria-labelledby="rate" className="space-y-4">
            <h2 id="rate" className="text-2xl font-semibold text-app-text">ปรับอัตราแลกแต้ม</h2>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-app-text">ปัจจุบัน:</span>
                <span className="text-app-primary font-bold">{conversionRate}</span>
                <span className="text-app-text">คะแนน = 1 บาท</span>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Input
                  type="number"
                  value={rateInput}
                  onChange={(e) => setRateInput(e.target.value)}
                  className="h-12 w-full sm:w-40 rounded-xl bg-app-white"
                />
                <Button onClick={handleUpdateRate} className="h-12 rounded-xl bg-app-primary text-app-white">อัปเดตอัตรา</Button>
              </div>
            </div>
          </section>

          <section aria-labelledby="redeem" className="space-y-4">
            <h2 id="redeem" className="text-2xl font-semibold text-app-text">แลกแต้มให้ผู้ใช้</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <label className="text-app-text">เลือกผู้ใช้</label>
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
                <Button onClick={handleRedeemForUser} className="h-12 rounded-xl bg-app-primary text-app-white">ยืนยันแลกคะแนน</Button>
              </div>
            </div>
            {selectedUser && (
              <p className="text-app-text-muted">คงเหลือปัจจุบันของ {selectedUser.name}: {selectedUser.totalPoints} คะแนน</p>
            )}
          </section>

          <section aria-labelledby="history" className="space-y-4">
            <h2 id="history" className="text-2xl font-semibold text-app-text">ประวัติการแลกแต้มทั้งหมด</h2>
            <div className="bg-app-white rounded-3xl p-4">
              <Table>
                <TableCaption>ประวัติการแลกแต้มล่าสุด</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>วันที่</TableHead>
                    <TableHead>รหัสนักศึกษา</TableHead>
                    <TableHead>ชื่อ</TableHead>
                    <TableHead className="text-right">คะแนน</TableHead>
                    <TableHead className="text-right">เงิน (บาท)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {redeemHistory.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-app-text-muted">ยังไม่มีประวัติการแลกแต้ม</TableCell>
                    </TableRow>
                  )}
                  {redeemHistory.map((r) => {
                    const u = users.find(x => x.studentId === r.studentId);
                    return (
                      <TableRow key={r.id}>
                        <TableCell>{r.date}</TableCell>
                        <TableCell>{r.studentId}</TableCell>
                        <TableCell>{u?.name || '-'}</TableCell>
                        <TableCell className="text-right">{r.points}</TableCell>
                        <TableCell className="text-right">{r.money}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Admin;
