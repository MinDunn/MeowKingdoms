import React, { useState, useEffect } from 'react';
import './App.css';
import { db, auth } from './firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { Hero, Tribe, Role, Artifact, Beast, Item, StatConfig, Material, Currency, Player } from './types';

// Import Components
import Dashboard from './components/Dashboard';
import HeroManager from './components/HeroManager';
import TribeManager from './components/TribeManager';
import RoleManager from './components/RoleManager';
import ArtifactManager from './components/ArtifactManager';
import BeastManager from './components/BeastManager';
import ItemManager from './components/ItemManager';
import StatManager from './components/StatManager';
import MaterialManager from './components/MaterialManager';
import CurrencyManager from './components/CurrencyManager';
import PlayerManager from './components/PlayerManager';
import AuthManager from './components/AuthManager';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<Player | null>(null);

  // Global Data
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [tribes, setTribes] = useState<Tribe[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [beasts, setBeasts] = useState<Beast[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [stats, setStats] = useState<StatConfig[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) {
        setUserProfile(null);
        setLoading(false);
      }
    });

    const unsubP = onSnapshot(collection(db, 'players'), s => {
      const allPlayers = s.docs.map(d => ({ id: d.id, ...d.data() })) as Player[];
      setPlayers(allPlayers);
      
      if (auth.currentUser) {
        const profile = allPlayers.find(p => p.uid === auth.currentUser?.uid);
        if (profile) setUserProfile(profile);
      }
      setLoading(false);
    });

    const unsubH = onSnapshot(collection(db, 'heroes'), s => setHeroes(s.docs.map(d => ({ id: d.id, ...d.data() })) as Hero[]));
    const unsubT = onSnapshot(collection(db, 'tribes'), s => setTribes(s.docs.map(d => ({ id: d.id, ...d.data() })) as Tribe[]));
    const unsubR = onSnapshot(collection(db, 'roles'), s => setRoles(s.docs.map(d => ({ id: d.id, ...d.data() })) as Role[]));
    const unsubA = onSnapshot(collection(db, 'artifacts'), s => setArtifacts(s.docs.map(d => ({ id: d.id, ...d.data() })) as Artifact[]));
    const unsubB = onSnapshot(collection(db, 'beasts'), s => setBeasts(s.docs.map(d => ({ id: d.id, ...d.data() })) as Beast[]));
    const unsubI = onSnapshot(collection(db, 'items'), s => setItems(s.docs.map(d => ({ id: d.id, ...d.data() })) as Item[]));
    const unsubS = onSnapshot(collection(db, 'stats'), s => setStats(s.docs.map(d => ({ id: d.id, ...d.data() })) as StatConfig[]));
    const unsubM = onSnapshot(collection(db, 'materials'), s => setMaterials(s.docs.map(d => ({ id: d.id, ...d.data() })) as Material[]));
    const unsubC = onSnapshot(collection(db, 'currencies'), s => setCurrencies(s.docs.map(d => ({ id: d.id, ...d.data() })) as Currency[]));
    
    return () => { unsubAuth(); unsubH(); unsubT(); unsubR(); unsubA(); unsubB(); unsubI(); unsubS(); unsubM(); unsubC(); unsubP(); };
  }, []);

  // AUTO-REDIRECT FOR PLAYERS
  useEffect(() => {
    if (user && loading === false) {
      const isAdmin = userProfile?.role === 'admin' || 
                      user?.email === 'phamminhdung12321@gmail.com' ||
                      user?.email === 'admintest123@meow.kingdom';
      
      // If we are sure they are NOT an admin (either by role or by not being in admin email list)
      // Redirect immediately to game
      if (!isAdmin) {
        window.location.href = '/game/index.html';
      }
    }
  }, [user, userProfile, loading]);

  const handleLogout = () => {
    if(confirm("Xác nhận đăng xuất khỏi vương quốc?")) signOut(auth);
  };

  if (loading) return <div className="loading-screen"><h1>🐾 Loading Meow Kingdoms...</h1></div>;

  if (!user) return <AuthManager />;

  // ROLE CHECK: If not admin, we redirect in useEffect, but let's show a quick loading here
  const isAdmin = userProfile?.role === 'admin' || 
                  user?.email === 'phamminhdung12321@gmail.com' ||
                  user?.email === 'admintest123@meow.kingdom';

  if (!isAdmin) {
    return <div className="loading-screen"><h1>⚔️ Đang tiến vào vương quốc...</h1></div>;
  }



  return (
    <div className="admin-layout">
      <aside className="manga-card sidebar">
        <div className="brand"><h1>🐾 Meow Admin</h1><span>V4.5 Card Suite</span></div>
        
        <div className="user-profile-mini">
          <div className="up-avatar">🐱</div>
          <div className="up-info">
            <p>Admin: {userProfile?.displayName || 'Hero'}</p>
            <button onClick={handleLogout}>Đăng xuất</button>
          </div>
        </div>

        <nav className="nav-list" style={{overflowY: 'auto'}}>
          <button className={`nav-btn ${currentView === 'dashboard' ? 'active' : ''}`} onClick={() => setCurrentView('dashboard')}>🏰 Dashboard</button>
          <button className={`nav-btn ${currentView === 'players' ? 'active' : ''}`} onClick={() => setCurrentView('players')}>👥 Người Chơi</button>
          <button className={`nav-btn ${currentView === 'stats' ? 'active' : ''}`} onClick={() => setCurrentView('stats')}>📊 Chỉ Số</button>
          <button className={`nav-btn ${currentView === 'heroes' ? 'active' : ''}`} onClick={() => setCurrentView('heroes')}>🐱 Anh Hùng</button>
          <button className={`nav-btn ${currentView === 'materials' ? 'active' : ''}`} onClick={() => setCurrentView('materials')}>🧪 Vật Phẩm</button>
          <button className={`nav-btn ${currentView === 'currencies' ? 'active' : ''}`} onClick={() => setCurrentView('currencies')}>💰 Tiền Tệ</button>
          <button className={`nav-btn ${currentView === 'tribes' ? 'active' : ''}`} onClick={() => setCurrentView('tribes')}>🧬 Hệ Tộc</button>
          <button className={`nav-btn ${currentView === 'roles' ? 'active' : ''}`} onClick={() => setCurrentView('roles')}>🎭 Vai Trò</button>
          <button className={`nav-btn ${currentView === 'items' ? 'active' : ''}`} onClick={() => setCurrentView('items')}>🛡️ Trang Bị</button>
          <button className={`nav-btn ${currentView === 'artifacts' ? 'active' : ''}`} onClick={() => setCurrentView('artifacts')}>🗡️ Thần Binh</button>
          <button className={`nav-btn ${currentView === 'beasts' ? 'active' : ''}`} onClick={() => setCurrentView('beasts')}>🐲 Thần Thú</button>
        </nav>
      </aside>

      <main className="main-content">
        {currentView === 'dashboard' && <Dashboard heroes={heroes} tribes={tribes} roles={roles} artifacts={artifacts} beasts={beasts} items={items} stats={stats} materials={materials} currencies={currencies} players={players} />}
        {currentView === 'players' && <PlayerManager players={players} currencies={currencies} />}
        {currentView === 'stats' && <StatManager stats={stats} />}
        {currentView === 'heroes' && <HeroManager heroes={heroes} tribes={tribes} roles={roles} stats={stats} />}
        {currentView === 'materials' && <MaterialManager materials={materials} heroes={heroes} />}
        {currentView === 'currencies' && <CurrencyManager currencies={currencies} />}
        {currentView === 'tribes' && <TribeManager tribes={tribes} />}
        {currentView === 'roles' && <RoleManager roles={roles} />}
        {currentView === 'items' && <ItemManager items={items} stats={stats} />}
        {currentView === 'artifacts' && <ArtifactManager artifacts={artifacts} stats={stats} />}
        {currentView === 'beasts' && <BeastManager beasts={beasts} />}
      </main>
    </div>
  );
}

export default App;
