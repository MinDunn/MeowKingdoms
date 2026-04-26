import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import type { Role } from '../types';

interface Props {
  roles: Role[];
}

const RoleManager: React.FC<Props> = ({ roles }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRole, setNewRole] = useState<Role>({
    name: '', icon: '⚔️', priorityStat: 'P-ATK', description: ''
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, 'roles'), { 
      name: newRole.name,
      icon: newRole.icon,
      priorityStat: newRole.priorityStat,
      description: newRole.description
    });
    setIsModalOpen(false);
    setNewRole({ name: '', icon: '⚔️', priorityStat: 'P-ATK', description: '' });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Xác nhận xóa Vai Trò này? 😿")) await deleteDoc(doc(db, 'roles', id));
  };

  return (
    <div className="view-roles animate-in">
      <header className="content-header">
        <div><h2>Vai Trò 🎭</h2><p>Chức nghiệp & Lớp nhân vật</p></div>
        <button className="btn-cute" onClick={() => setIsModalOpen(true)}>➕ Thêm Vai Trò</button>
      </header>

      <section className="hero-grid">
        {roles.map(r => (
          <div key={r.id} className="manga-card hero-card">
            <div className="hero-avatar" style={{backgroundColor: '#f1f2f6'}}>{r.icon}</div>
            <div className="hero-info">
              <h3>{r.name}</h3>
              <p style={{fontSize: '0.8rem', fontWeight: 800, color: 'var(--p-blue)', margin: '5px 0'}}>💎 Ưu tiên: {r.priorityStat}</p>
              <p style={{fontSize: '0.75rem', color: '#636e72'}}>{r.description}</p>
            </div>
            <button className="delete-btn-card" onClick={() => handleDelete(r.id!)}>X</button>
          </div>
        ))}
      </section>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="manga-card modal-content-large animate-pop">
            <h2 className="modal-title">🎭 Tạo Vai Trò Mới</h2>
            <form onSubmit={handleSave}>
              <div className="modal-scroll-area">
                <div className="form-group"><label>TÊN VAI TRÒ</label><input type="text" value={newRole.name} onChange={e => setNewRole({...newRole, name: e.target.value})} required /></div>
                <div className="form-row">
                  <div className="form-group"><label>BIỂU TƯỢNG</label><input type="text" value={newRole.icon} onChange={e => setNewRole({...newRole, icon: e.target.value})} /></div>
                  <div className="form-group"><label>CHỈ SỐ ƯU TIÊN</label>
                    <select value={newRole.priorityStat} onChange={e => setNewRole({...newRole, priorityStat: e.target.value})}>
                      <option value="P-ATK">P-ATK</option><option value="M-ATK">M-ATK</option>
                      <option value="P-DEF">P-DEF</option><option value="M-DEF">M-DEF</option>
                      <option value="HP">HP</option><option value="SPD">SPD</option>
                    </select>
                  </div>
                </div>
                <div className="form-group"><label>MÔ TẢ VAI TRÒ</label><textarea rows={3} value={newRole.description} onChange={e => setNewRole({...newRole, description: e.target.value})} /></div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-cute">Lưu Vai Trò 🎭</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManager;
