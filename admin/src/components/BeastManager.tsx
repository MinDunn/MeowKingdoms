import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import type { Beast } from '../types';

interface Props {
  beasts: Beast[];
}

const BeastManager: React.FC<Props> = ({ beasts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBeast, setNewBeast] = useState<Beast>({
    name: '', icon: '🐲', buffType: 'HP', buffValue: 100, skill: '', rarity: 'common'
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, 'beasts'), { 
      name: newBeast.name,
      icon: newBeast.icon,
      buffType: newBeast.buffType,
      buffValue: newBeast.buffValue,
      skill: newBeast.skill,
      rarity: newBeast.rarity
    });
    setIsModalOpen(false);
    setNewBeast({ name: '', icon: '🐲', buffType: 'HP', buffValue: 100, skill: '', rarity: 'common' });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Xóa Thần Thú này? 😿")) await deleteDoc(doc(db, 'beasts', id));
  };

  return (
    <div className="view-beasts animate-in">
      <header className="content-header">
        <div><h2>Thần Thú 🐲</h2><p>Linh thú hộ mệnh</p></div>
        <button className="btn-cute" onClick={() => setIsModalOpen(true)}>➕ Thêm Thần Thú</button>
      </header>

      <section className="hero-grid">
        {beasts.map(b => (
          <div key={b.id} className="manga-card hero-card">
            <div className="hero-avatar" style={{backgroundColor: '#f1f2f6'}}>{b.icon}</div>
            <div className="hero-info">
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <h3>{b.name}</h3>
                <span className={`tag-rarity ${b.rarity || 'common'}`}>{(b.rarity || 'common').toUpperCase()}</span>
              </div>
              <p style={{fontSize: '0.8rem', fontWeight: 800, color: 'var(--p-red)', margin: '5px 0'}}>💖 Buff: +{b.buffValue} {b.buffType}</p>
              <p style={{fontSize: '0.75rem', color: '#636e72'}}>🌀 {b.skill}</p>
            </div>
            <button className="delete-btn-card" onClick={() => handleDelete(b.id!)}>X</button>
          </div>
        ))}
      </section>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="manga-card modal-content-large animate-pop">
            <h2 className="modal-title">🐲 Thức Tỉnh Thần Thú</h2>
            <form onSubmit={handleSave}>
              <div className="modal-scroll-area">
                <div className="form-group"><label>TÊN THẦN THÚ</label><input type="text" value={newBeast.name} onChange={e => setNewBeast({...newBeast, name: e.target.value})} required /></div>
                <div className="form-row">
                  <div className="form-group"><label>BIỂU TƯỢNG</label><input type="text" value={newBeast.icon} onChange={e => setNewBeast({...newBeast, icon: e.target.value})} /></div>
                  <div className="form-group"><label>ĐỘ HIẾM</label>
                    <select value={newBeast.rarity} onChange={e => setNewBeast({...newBeast, rarity: e.target.value})}>
                      <option value="common">Common</option><option value="rare">Rare</option><option value="epic">Epic</option><option value="legendary">Legendary</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>BUFF ĐỘI HÌNH</label>
                    <select value={newBeast.buffType} onChange={e => setNewBeast({...newBeast, buffType: e.target.value})}>
                      <option value="HP">Tăng HP</option><option value="ATK">Tăng ATK</option><option value="DEF">Tăng DEF</option>
                    </select>
                  </div>
                  <div className="form-group"><label>GIÁ TRỊ</label><input type="number" value={newBeast.buffValue} onChange={e => setNewBeast({...newBeast, buffValue: parseInt(e.target.value)})} /></div>
                </div>
                <div className="form-group"><label>KỸ NĂNG LINH THÚ</label><textarea rows={3} value={newBeast.skill} onChange={e => setNewBeast({...newBeast, skill: e.target.value})} /></div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-cute">Triệu Hồi 🐲</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeastManager;
