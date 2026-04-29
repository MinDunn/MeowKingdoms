import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import type { Role } from '../types';

interface Props {
  roles: Role[];
}

const RoleManager: React.FC<Props> = ({ roles }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const initialRoleState: Role = {
    name: '', icon: '⚔️', priorityStat: 'P-ATK', description: ''
  };
  const [formData, setFormData] = useState<Role>(initialRoleState);

  const handleOpenModal = (role?: Role) => {
    if (role) {
      setIsEditing(role.id!);
      setFormData({ ...role });
    } else {
      setIsEditing(null);
      setFormData(initialRoleState);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const roleData = { 
      name: formData.name,
      icon: formData.icon,
      priorityStat: formData.priorityStat,
      description: formData.description
    };

    if (isEditing) {
      await updateDoc(doc(db, 'roles', isEditing), roleData);
    } else {
      await addDoc(collection(db, 'roles'), roleData);
    }
    
    setIsModalOpen(false);
    setFormData(initialRoleState);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Xác nhận xóa Vai Trò này? 😿")) await deleteDoc(doc(db, 'roles', id));
  };

  return (
    <div className="view-roles animate-in">
      <header className="content-header">
        <div><h2>Vai Trò 🎭</h2><p>Chức nghiệp & Lớp nhân vật</p></div>
        <button className="btn-cute" onClick={() => handleOpenModal()}>➕ Thêm Vai Trò</button>
      </header>

      <section className="hero-grid">
        {roles.map(r => {
          const statClass = `stat-badge-${r.priorityStat.toLowerCase().replace('-', '')}`;
          return (
            <div key={r.id} className="manga-card hero-card">
              <div className="hero-avatar" style={{backgroundColor: '#f1f2f6'}}>{r.icon}</div>
              <div className="hero-info">
                <h3>{r.name}</h3>
                <div className={`stat-badge ${statClass}`}>
                  💎 {r.priorityStat}
                </div>
                <p className="hero-description">{r.description || 'Chưa có mô tả chi tiết cho vai trò này...'}</p>
              </div>
              <div className="card-actions">
                <button className="edit-btn-card" onClick={() => handleOpenModal(r)}>✏️</button>
                <button className="delete-btn-card" onClick={() => handleDelete(r.id!)}>X</button>
              </div>
            </div>
          );
        })}
      </section>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="manga-card modal-content-large animate-pop">
            <h2 className="modal-title">{isEditing ? '🎭 Chỉnh Sửa Vai Trò' : '🎭 Tạo Vai Trò Mới'}</h2>
            <form onSubmit={handleSave}>
              <div className="modal-scroll-area">
                <div className="form-group"><label>TÊN VAI TRÒ</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required /></div>
                <div className="form-row">
                  <div className="form-group"><label>BIỂU TƯỢNG</label><input type="text" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} /></div>
                  <div className="form-group"><label>CHỈ SỐ ƯU TIÊN</label>
                    <select value={formData.priorityStat} onChange={e => setFormData({...formData, priorityStat: e.target.value})}>
                      <option value="P-ATK">P-ATK</option><option value="M-ATK">M-ATK</option>
                      <option value="P-DEF">P-DEF</option><option value="M-DEF">M-DEF</option>
                      <option value="HP">HP</option><option value="SPD">SPD</option>
                    </select>
                  </div>
                </div>
                <div className="form-group"><label>MÔ TẢ VAI TRÒ</label><textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-cute">{isEditing ? 'Cập Nhật 🎭' : 'Lưu Vai Trò 🎭'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManager;
