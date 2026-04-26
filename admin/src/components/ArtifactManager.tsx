import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import type { Artifact, StatConfig } from '../types';

interface Props {
  artifacts: Artifact[];
  stats: StatConfig[];
}

const ArtifactManager: React.FC<Props> = ({ artifacts, stats }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newArtifact, setNewArtifact] = useState<Artifact>({
    name: '', icon: '🗡️', bonusStat: '', bonusValue: 50, effect: '', rarity: 'common'
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArtifact.bonusStat && stats.length > 0) newArtifact.bonusStat = stats[0].code;

    await addDoc(collection(db, 'artifacts'), { 
      name: newArtifact.name,
      icon: newArtifact.icon,
      bonusStat: newArtifact.bonusStat || (stats[0]?.code || 'N/A'),
      bonusValue: newArtifact.bonusValue,
      effect: newArtifact.effect,
      rarity: newArtifact.rarity
    });
    setIsModalOpen(false);
    setNewArtifact({ name: '', icon: '🗡️', bonusStat: '', bonusValue: 50, effect: '', rarity: 'common' });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Xóa Thần Binh này? 😿")) await deleteDoc(doc(db, 'artifacts', id));
  };

  return (
    <div className="view-artifacts animate-in">
      <header className="content-header">
        <div><h2>Thần Binh 🗡️</h2><p>Trang bị truyền thuyết</p></div>
        <button className="btn-cute" onClick={() => stats.length === 0 ? alert("Vui lòng tạo Chỉ Số trước!") : setIsModalOpen(true)}>➕ Thêm Thần Binh</button>
      </header>

      <section className="hero-grid">
        {artifacts.map(a => (
          <div key={a.id} className="manga-card hero-card">
            <div className="hero-avatar" style={{backgroundColor: '#f1f2f6'}}>{a.icon}</div>
            <div className="hero-info">
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <h3>{a.name}</h3>
                <span className={`tag-rarity ${a.rarity || 'common'}`}>{(a.rarity || 'common').toUpperCase()}</span>
              </div>
              <p style={{fontSize: '0.8rem', fontWeight: 800, color: 'var(--p-blue)', margin: '5px 0'}}>
                ✨ +{a.bonusValue} {stats.find(s => s.code === a.bonusStat)?.name || a.bonusStat}
              </p>
              <p style={{fontSize: '0.75rem', color: '#636e72'}}>🔥 {a.effect}</p>
            </div>
            <button className="delete-btn-card" onClick={() => handleDelete(a.id!)}>X</button>
          </div>
        ))}
      </section>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="manga-card modal-content-large animate-pop">
            <h2 className="modal-title">🗡️ Rèn Thần Binh</h2>
            <form onSubmit={handleSave}>
              <div className="modal-scroll-area">
                <div className="form-group"><label>TÊN THẦN BINH</label><input type="text" value={newArtifact.name} onChange={e => setNewArtifact({...newArtifact, name: e.target.value})} required /></div>
                <div className="form-row">
                  <div className="form-group"><label>BIỂU TƯỢNG</label><input type="text" value={newArtifact.icon} onChange={e => setNewArtifact({...newArtifact, icon: e.target.value})} /></div>
                  <div className="form-group"><label>ĐỘ HIẾM</label>
                    <select value={newArtifact.rarity} onChange={e => setNewArtifact({...newArtifact, rarity: e.target.value})}>
                      <option value="common">Common</option><option value="rare">Rare</option><option value="epic">Epic</option><option value="legendary">Legendary</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>CHỈ SỐ TĂNG</label>
                    <select value={newArtifact.bonusStat} onChange={e => setNewArtifact({...newArtifact, bonusStat: e.target.value})} required>
                      {stats.map(s => <option key={s.id} value={s.code}>{s.icon} {s.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label>GIÁ TRỊ</label><input type="number" value={newArtifact.bonusValue} onChange={e => setNewArtifact({...newArtifact, bonusValue: parseInt(e.target.value)})} /></div>
                </div>
                <div className="form-group"><label>HIỆU ỨNG ĐẶC BIỆT</label><textarea rows={3} value={newArtifact.effect} onChange={e => setNewArtifact({...newArtifact, effect: e.target.value})} /></div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-cute">Kích Hoạt 🗡️</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtifactManager;
