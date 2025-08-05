import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  studentId: string;
  name: string;
  email: string;
  password: string;
  totalPoints: number;
}

interface RecycleEntry {
  id: string;
  date: string;
  bottles: number;
  money: number;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  recycleHistory: RecycleEntry[];
  login: (studentId: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (studentId: string, name: string, email: string, password: string) => Promise<boolean>;
  redeemPoints: (points: number) => boolean;
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
    totalPoints: 45
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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [recycleHistory, setRecycleHistory] = useState<RecycleEntry[]>(initialRecycleHistory);

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
    const foundUser = users.find(u => u.studentId === studentId && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
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
      totalPoints: 0
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
    return true;
  };

  const addRecycleEntry = (bottles: number) => {
    const money = Math.floor(bottles / 9); // 9 bottles = 1 baht
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
      login,
      logout,
      signup,
      redeemPoints,
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