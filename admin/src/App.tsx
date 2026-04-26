import React, { useState, useEffect } from 'react';
import './App.css';
import { db } from './firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

interface Hero {
  id: string;
  name: string;
  element: string;
  role: string;
  hp: number;
  atk: number;
  def: number;
  color: string;
}

const App: React.FC = () => {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newHero, setNewHero] = useState({
    name: '',
    element: 'fire',
    role: 'warrior',
    hp: 1000,
    atk: 150,
    def: 80
  });

  useEffect(() => {
    const heroesCol = collection(db, 'heroes');
    const unsubscribe = onSnapshot(heroesCol, (snapshot) => {
      const heroList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Hero[];
      setHeroes(heroList);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const colors: any = {
        fire: '#ff9aa2',
        water: '#b5ead7',
        wind: '#c7ceea',
        earth: '#ffdac1'
      };

      await addDoc(collection(db, 'heroes'), {
        ...newHero,
        color: colors[newHero.element] || '#ffb7b2'
      });
      setIsModalOpen(false);
      setNewHero({ name: '', element: 'fire', role: 'warrior', hp: 1000, atk: 150, def: 80 });
    } catch (e) {
      console.error("Lỗi: ", e);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Xóa chú mèo này? 😿")) {
      await deleteDoc(doc(db, 'heroes', id));
    }
  };

  return (
    <div className="admin-layout">
      <aside className="manga-card sidebar">
        <div className="brand">
          <h1>🐾 Meow Admin</h1>
          <span>V2.0 Cloud</span>
        </div>
        <nav>
          <button className="nav-btn active">🏰 Dashboard</button>
          <button className="nav-btn">🐱 Heroes</button>
          <button className="nav-btn">🗡️ Skills</button>
        </nav>
        <div className="status-tag">
          <p>DB: {loading ? '🟡 ...' : '🟢 Online'}</p>
        </div>
      </aside>

      <main className="main-content">
        <header className="content-header">
          <div>
            <h2>Vương Quốc Mèo ✨</h2>
            <p>Tổng số chiến binh: {heroes.length}</p>
          </div>
          <button className="btn-cute" onClick={() => setIsModalOpen(true)}>➕ Chiêu Mộ Hero</button>
        </header>

        <section className="hero-grid">
          {heroes.map(hero => (
            <div key={hero.id} className="manga-card hero-card">
              <div className="hero-avatar" style={{ backgroundColor: hero.color }}>🐱</div>
              <div className="hero-info">
                <h3>{hero.name}</h3>
                <p>{hero.role.toUpperCase()} | {hero.element.toUpperCase()}</p>
                <div className="stats-row">
                  <div className="stat-box hp"><span>HP</span><b>{hero.hp}</b></div>
                  <div className="stat-box atk"><span>ATK</span><b>{hero.atk}</b></div>
                  <div className="stat-box def"><span>DEF</span><b>{hero.def}</b></div>
                </div>
              </div>
              <div className="card-actions">
                <button className="btn-sm delete" onClick={() => handleDelete(hero.id)}>Xóa</button>
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* Modal Chibi Style */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="manga-card modal-content">
            <h2 className="heading">🐾 Chiêu Mộ Anh Hùng</h2>
            <form onSubmit={handleSaveHero}>
              <div className="form-group">
                <label>Tên Hero</label>
                <input type="text" value={newHero.name} onChange={e => setNewHero({...newHero, name: e.target.value})} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Hệ</label>
                  <select value={newHero.element} onChange={e => setNewHero({...newHero, element: e.target.value})}>
                    <option value="fire">🔥 Hỏa</option>
                    <option value="water">💧 Thủy</option>
                    <option value="wind">🍃 Phong</option>
                    <option value="earth">⛰️ Thổ</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Vai Trò</label>
                  <select value={newHero.role} onChange={e => setNewHero({...newHero, role: e.target.value})}>
                    <option value="warrior">⚔️ Chiến Sĩ</option>
                    <option value="mage">🔮 Pháp Sư</option>
                    <option value="tank">🛡️ Đỡ Đòn</option>
                    <option value="support">💖 Hỗ Trợ</option>
                  </select>
                </div>
              </div>
              <div className="stats-edit">
                <div className="stat-input">
                  <label>HP</label>
                  <input type="number" value={newHero.hp} onChange={e => setNewHero({...newHero, hp: parseInt(e.target.value)})} />
                </div>
                <div className="stat-input">
                  <label>ATK</label>
                  <input type="number" value={newHero.atk} onChange={e => setNewHero({...newHero, atk: parseInt(e.target.value)})} />
                </div>
                <div className="stat-input">
                  <label>DEF</label>
                  <input type="number" value={newHero.def} onChange={e => setNewHero({...newHero, def: parseInt(e.target.value)})} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-sm" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-cute">Lưu Vào DB</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
