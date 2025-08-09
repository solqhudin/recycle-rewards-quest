import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  studentId: string;
  name: string;
  email: string;
  password: string;
  totalPoints: number;
  isAdmin?: boolean;
}

interface RecycleEntry {
  id: string;
  date: string;
  bottles: number;
  money: number;
}

interface RedeemEntry {
  id: string;
  date: string;
  studentId: string;
  points: number;
  money: number;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  recycleHistory: RecycleEntry[];
  redeemHistory: RedeemEntry[];
  conversionRate: number;
  setConversionRate: (rate: number) => void;
  login: (studentId: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (studentId: string, name: string, email: string, password: string) => Promise<boolean>;
  redeemPoints: (points: number) => boolean;
  redeemPointsForUser: (studentId: string, points: number) => boolean;
  addRecycleEntry: (bottles: number) => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data
const initialUsers: User[] = [
  {
    studentId: '406559015',
    name: 'Solahudin Doloh',
    email: '406559015@yru.ac.th',
    password: '4065905837',
    totalPoints: 45,
    isAdmin: false
  },
  {
    studentId: 'admin',
    name: 'Administrator',
    email: 'admin@example.com',
    password: 'admin',
    totalPoints: 0,
    isAdmin: true
  }
];

const initialRecycleHistory: RecycleEntry[] = [
  {
    id: '1',
    date: '28/07/2025',
    bottles: 45,
    money: 5
  },
  {
    id: '2',
    date: '22/07/2025',
    bottles: 90,
    money: 10
  }
];

const initialRedeemHistory: RedeemEntry[] = [];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
const [user, setUser] = useState<User | null>(null);
const [users, setUsers] = useState<User[]>(initialUsers);
const [recycleHistory, setRecycleHistory] = useState<RecycleEntry[]>(initialRecycleHistory);
const [redeemHistory, setRedeemHistory] = useState<RedeemEntry[]>(initialRedeemHistory);
const [conversionRate, setConversionRate] = useState<number>(9);

  useEffect(() => {
    // Check for logged in user in localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      const foundUser = users.find(u => u.studentId === userData.studentId);
      if (foundUser) {
        setUser(foundUser);
      }
    }
  }, [users]);

  const login = async (studentId: string, password: string): Promise<boolean> => {
    const sid = studentId.trim();
    const pwd = password.trim();
    const foundUser = users.find(
      (u) => u.studentId.trim() === sid && u.password.trim() === pwd
    );
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    console.warn('Login failed for SID:', sid, 'Available SIDs:', users.map(u => u.studentId));
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const signup = async (studentId: string, name: string, email: string, password: string): Promise<boolean> => {
    // Check if user already exists
    if (users.find(u => u.studentId === studentId || u.email === email)) {
      return false;
    }

const newUser: User = {
  studentId,
  name,
  email,
  password,
  totalPoints: 0,
  isAdmin: false
};

    setUsers(prev => [...prev, newUser]);
    return true;
  };

const redeemPoints = (points: number): boolean => {
  if (!user || user.totalPoints < points) return false;

  const updatedUser = { ...user, totalPoints: user.totalPoints - points };
  setUser(updatedUser);
  setUsers(prev => prev.map(u => u.studentId === user.studentId ? updatedUser : u));
  localStorage.setItem('currentUser', JSON.stringify(updatedUser));

  const money = Math.floor(points / conversionRate);
  const entry: RedeemEntry = {
    id: Date.now().toString(),
    date: new Date().toLocaleDateString('th-TH'),
    studentId: user.studentId,
    points,
    money,
  };
  setRedeemHistory(prev => [entry, ...prev]);
  return true;
};

const addRecycleEntry = (bottles: number) => {
  const money = Math.floor(bottles / conversionRate); // conversionRate points = 1 baht
  const points = bottles; // 1 bottle = 1 point
  
  const newEntry: RecycleEntry = {
    id: Date.now().toString(),
    date: new Date().toLocaleDateString('th-TH'),
    bottles,
    money
  };

  setRecycleHistory(prev => [newEntry, ...prev]);

if (user) {
  const updatedUser = { ...user, totalPoints: user.totalPoints + points };
  setUser(updatedUser);
  setUsers(prev => prev.map(u => u.studentId === user.studentId ? updatedUser : u));
  localStorage.setItem('currentUser', JSON.stringify(updatedUser));
}
  };

const redeemPointsForUser = (studentId: string, points: number): boolean => {
  const target = users.find(u => u.studentId === studentId);
  if (!target || target.totalPoints < points) return false;

  const updatedTarget = { ...target, totalPoints: target.totalPoints - points };
  setUsers(prev => prev.map(u => u.studentId === studentId ? updatedTarget : u));

  if (user && user.studentId === studentId) {
    setUser(updatedTarget);
    localStorage.setItem('currentUser', JSON.stringify(updatedTarget));
  }

  const money = Math.floor(points / conversionRate);
  const entry: RedeemEntry = {
    id: Date.now().toString(),
    date: new Date().toLocaleDateString('th-TH'),
    studentId,
    points,
    money,
  };
  setRedeemHistory(prev => [entry, ...prev]);
  return true;
};

const updateProfile = (updates: Partial<User>) => {
  if (!user) return;

  const updatedUser = { ...user, ...updates };
  setUser(updatedUser);
  setUsers(prev => prev.map(u => u.studentId === user.studentId ? updatedUser : u));
  localStorage.setItem('currentUser', JSON.stringify(updatedUser));
};

return (
  <AuthContext.Provider value={{
    user,
    users,
    recycleHistory: user ? recycleHistory : [],
    redeemHistory,
    conversionRate,
    setConversionRate: (rate: number) => setConversionRate(rate),
    login,
    logout,
    signup,
    redeemPoints,
    redeemPointsForUser,
    addRecycleEntry,
    updateProfile
  }}>
    {children}
  </AuthContext.Provider>
);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};