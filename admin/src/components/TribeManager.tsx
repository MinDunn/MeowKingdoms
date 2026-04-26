import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import type { Tribe } from '../types';

interface Props {
  tribes: Tribe[];
}

const TribeManager: React.FC<Props> = ({ tribes }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTribe, setNewTribe] = useState<Tribe>({
    name: '', icon: '🔥', trait: '', milestones: '2/4/6', description: '', color: '#ff9f43',
    counterId: '', rarity: 'common', buffTarget: 'self'
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, 'tribes'), { 
      name: newTribe.name,
      icon: newTribe.icon,
      trait: newTribe.trait,
      milestones: newTribe.milestones,
      description: newTribe.description,
      color: newTribe.color,
      counterId: newTribe.counterId,
      rarity: newTribe.rarity,
      buffTarget: newTribe.buffTarget
    });
    setIsModalOpen(false);
    setNewTribe({ name: '', icon: '🔥', trait: '', milestones: '2/4/6', description: '', color: '#ff9f43', counterId: '', rarity: 'common', buffTarget: 'self' });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Xác nhận xóa Hệ này? 😿")) await deleteDoc(doc(db, 'tribes', id));
  };

  return (
    <div className="view-tribes animate-in">
      <header className="content-header">
        <div><h2>Hệ Tộc 🧬</h2><p>Định nghĩa sức mạnh nguyên tố</p></div>
        <button className="btn-cute" onClick={() => setIsModalOpen(true)}>➕ Thêm Hệ Mới</button>
      </header>

      <section className="hero-grid">
        {tribes.map(t => (
          <div key={t.id} className="manga-card hero-card">
            <div className="hero-avatar" style={{ backgroundColor: t.color }}>{t.icon}</div>
            <div className="hero-info">
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <h3>{t.name}</h3>
                <span className={`tag-rarity ${t.rarity || 'common'}`}>{(t.rarity || 'common').toUpperCase()}</span>
              </div>
              <p style={{fontSize: '0.8rem', fontWeight: 800, color: 'var(--p-red)', margin: '5px 0'}}>⚔️ {t.trait}</p>
              <div className="tribe-meta">
                <span>🎯 {t.buffTarget === 'self' ? 'Nội bộ tộc' : 'Toàn đội'}</span>
                <span>🛡️ Khắc: {tribes.find(x => x.id === t.counterId)?.name || 'N/A'}</span>
              </div>
              <p style={{fontSize: '0.75rem', marginTop: '10px', color: '#636e72'}}>{t.description}</p>
            </div>
            <button className="delete-btn-card" onClick={() => handleDelete(t.id!)}>X</button>
          </div>
        ))}
      </section>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="manga-card modal-content-large animate-pop">
            <h2 className="modal-title">🧬 Cấu Hình Hệ Nguyên Tố</h2>
            <form onSubmit={handleSave}>
              <div className="modal-scroll-area">
                <div className="form-group"><label>TÊN HỆ</label><input type="text" value={newTribe.name} onChange={e => setNewTribe({...newTribe, name: e.target.value})} required /></div>
                <div className="form-row">
                  <div className="form-group"><label>BIỂU TƯỢNG</label><input type="text" value={newTribe.icon} onChange={e => setNewTribe({...newTribe, icon: e.target.value})} /></div>
                  <div className="form-group"><label>MỐC KÍCH HOẠT</label><input type="text" value={newTribe.milestones} onChange={e => setNewTribe({...newTribe, milestones: e.target.value})} /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>KHẮC CHẾ</label>
                    <select value={newTribe.counterId} onChange={e => setNewTribe({...newTribe, counterId: e.target.value})}>
                      <option value="">-- Chọn hệ bị khắc --</option>
                      {tribes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label>ĐỘ HIẾM</label>
                    <select value={newTribe.rarity} onChange={e => setNewTribe({...newTribe, rarity: e.target.value})}>
                      <option value="common">Common</option><option value="rare">Rare</option><option value="epic">Epic</option><option value="legendary">Legendary</option>
                    </select>
                  </div>
                </div>
                <div className="form-group"><label>MÀU & ĐỐI TƯỢNG BUFF</label>
                  <div style={{display:'grid', gridTemplateColumns: '80px 1fr', gap: '15px'}}>
                    <input type="color" value={newTribe.color} onChange={e => setNewTribe({...newTribe, color: e.target.value})} style={{height: '50px'}} />
                    <select value={newTribe.buffTarget} onChange={e => setNewTribe({...newTribe, buffTarget: e.target.value})}>
                      <option value="self">Nội bộ tộc</option><option value="team">Toàn đội hình</option>
                    </select>
                  </div>
                </div>
                <div className="form-group"><label>ĐẶC TÍNH CHIẾN ĐẤU</label><input type="text" value={newTribe.trait} onChange={e => setNewTribe({...newTribe, trait: e.target.value})} /></div>
                <div className="form-group"><label>MÔ TẢ CHI TIẾT</label><textarea rows={2} value={newTribe.description} onChange={e => setNewTribe({...newTribe, description: e.target.value})} /></div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-cute">Lưu Hệ 🧬</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TribeManager;
