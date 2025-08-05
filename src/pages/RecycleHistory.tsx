import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';

const RecycleHistory = () => {
  const { recycleHistory } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = recycleHistory.filter(entry =>
    entry.date.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-app-background p-6">
      <div className="max-w-6xl mx-auto">
        <Navigation />
        
        <div className="mb-6">
          <div className="relative max-w-md">
            <Input
              type="text"
              placeholder="กรอกข้อมูลตามวันที่"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-14 px-4 pr-12 text-lg rounded-2xl border-none bg-app-white placeholder:text-app-text-muted focus-visible:ring-2 focus-visible:ring-app-primary"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-app-primary w-6 h-6" />
          </div>
        </div>

        <div className="space-y-4">
          {filteredHistory.map((entry) => (
            <div key={entry.id} className="bg-app-white rounded-3xl p-6 shadow-lg">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <h3 className="text-app-primary text-lg font-medium mb-2">วันที่</h3>
                  <p className="text-app-primary text-xl font-bold">{entry.date}</p>
                </div>
                <div>
                  <h3 className="text-app-primary text-lg font-medium mb-2">จำนวนขวด</h3>
                  <p className="text-app-primary text-xl font-bold">{entry.bottles}</p>
                </div>
                <div>
                  <h3 className="text-app-primary text-lg font-medium mb-2">เงินที่จะได้รับ</h3>
                  <p className="text-app-primary text-xl font-bold">{entry.money}</p>
                </div>
              </div>
            </div>
          ))}

          {filteredHistory.length === 0 && (
            <div className="bg-app-white rounded-3xl p-8 text-center">
              <p className="text-app-text-muted text-lg">
                {searchTerm ? 'ไม่พบข้อมูลที่ค้นหา' : 'ยังไม่มีประวัติการรีไซเคิล'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecycleHistory;