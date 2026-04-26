import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import type { Material, Hero } from '../types';

interface Props {
  materials: Material[];
  heroes: Hero[];
}

const MaterialManager: React.FC<Props> = ({ materials, heroes }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newMat, setNewMat] = useState<Material>({
    name: '', icon: '🧪', type: 'exp', rarity: 'common', description: '', targetHeroId: ''
  });

  const handleOpenModal = (mat?: Material) => {
    if (mat) {
      setEditingId(mat.id!);
      setNewMat({ ...mat });
    } else {
      setEditingId(null);
      setNewMat({ name: '', icon: '🧪', type: 'exp', rarity: 'common', description: '', targetHeroId: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const matData = { ...newMat };
    if (editingId) {
      await updateDoc(doc(db, 'materials', editingId), matData as any);
    } else {
      await addDoc(collection(db, 'materials'), matData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Xóa vật phẩm này?")) await deleteDoc(doc(db, 'materials', id));
  };

  return (
    <div className="view-materials animate-in">
      <header className="content-header">
        <div><h2>Vật Phẩm & Nguyên Liệu 🧪</h2><p>Tài nguyên nâng cấp thẻ tướng</p></div>
        <button className="btn-cute" onClick={() => handleOpenModal()}>➕ Thêm Vật Phẩm</button>
      </header>

      <section className="hero-grid">
        {materials.map(m => (
          <div key={m.id} className="manga-card hero-card">
            <div className="hero-avatar" style={{backgroundColor: '#f1f2f6'}}>{m.icon}</div>
            <div className="hero-info">
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <h3>{m.name}</h3>
                <span className={`tag-rarity ${m.rarity}`}>{m.rarity.toUpperCase()}</span>
              </div>
              <p style={{fontSize: '0.75rem', fontWeight: 800, color: 'var(--p-blue)', textTransform: 'uppercase', margin: '5px 0'}}>📦 Loại: {m.type}</p>
              {m.type === 'shard' && m.targetHeroId && (
                <p style={{fontSize: '0.7rem', color: 'var(--p-red)', fontWeight: 800}}>🎯 Dùng cho: {heroes.find(h => h.id === m.targetHeroId)?.name || 'N/A'}</p>
              )}
              <p style={{fontSize: '0.75rem', marginTop: '5px', color: '#636e72'}}>{m.description}</p>
            </div>
            <div style={{position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '8px'}}>
              <button className="edit-btn-small" onClick={() => handleOpenModal(m)}>✏️</button>
              <button className="delete-btn-small" onClick={() => handleDelete(m.id!)}>X</button>
            </div>
          </div>
        ))}
      </section>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="manga-card modal-content-large animate-pop">
            <h2 className="modal-title">{editingId ? '✏️ Sửa Vật Phẩm' : '🧪 Tạo Vật Phẩm Mới'}</h2>
            <form onSubmit={handleSave}>
              <div className="modal-scroll-area">
                <div className="form-group"><label>TÊN VẬT PHẨM</label><input type="text" value={newMat.name} onChange={e => setNewMat({...newMat, name: e.target.value})} required /></div>
                <div className="form-row">
                  <div className="form-group"><label>BIỂU TƯỢNG</label><input type="text" value={newMat.icon} onChange={e => setNewMat({...newMat, icon: e.target.value})} /></div>
                  <div className="form-group"><label>LOẠI VẬT PHẨM</label>
                    <select value={newMat.type} onChange={e => setNewMat({...newMat, type: e.target.value as any})}>
                      <option value="exp">Sách Kinh Nghiệm</option><option value="shard">Mảnh Tướng</option>
                      <option value="evolution">Đá Tiến Hóa</option><option value="other">Loại Khác</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                   <div className="form-group"><label>ĐỘ HIẾM</label>
                    <select value={newMat.rarity} onChange={e => setNewMat({...newMat, rarity: e.target.value})}>
                      <option value="common">Common</option><option value="rare">Rare</option>
                      <option value="epic">Epic</option><option value="legendary">Legendary</option>
                    </select>
                  </div>
                  {newMat.type === 'shard' && (
                    <div className="form-group"><label>MỤC TIÊU (HERO)</label>
                      <select value={newMat.targetHeroId} onChange={e => setNewMat({...newMat, targetHeroId: e.target.value})}>
                        <option value="">-- Chọn Hero --</option>
                        {heroes.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                      </select>
                    </div>
                  )}
                </div>
                <div className="form-group"><label>MÔ TẢ VẬT PHẨM</label><textarea rows={3} value={newMat.description} onChange={e => setNewMat({...newMat, description: e.target.value})} /></div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-cute">{editingId ? 'Cập Nhật ✨' : 'Lưu Kho 🧪'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialManager;
