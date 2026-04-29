import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import type { Tribe, TribeMilestone } from '../types';

interface Props {
  tribes: Tribe[];
}

const TribeManager: React.FC<Props> = ({ tribes }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  
  const initialTribeState: Tribe = {
    name: '', icon: '🔥', trait: '', milestones: [{ count: 2, description: '' }], 
    description: '', color: '#ff9f43', counterIds: [], rarity: 'common', buffTarget: 'self'
  };

  const [formData, setFormData] = useState<Tribe>(initialTribeState);

  const handleAddMilestone = () => {
    setFormData({
      ...formData,
      milestones: [...formData.milestones, { count: (formData.milestones[formData.milestones.length-1]?.count || 0) + 2, description: '' }]
    });
  };

  const handleRemoveMilestone = (index: number) => {
    setFormData({
      ...formData,
      milestones: formData.milestones.filter((_, i) => i !== index)
    });
  };

  const handleMilestoneChange = (index: number, field: keyof TribeMilestone, value: any) => {
    const newMilestones = [...formData.milestones];
    newMilestones[index] = { ...newMilestones[index], [field]: value };
    setFormData({ ...formData, milestones: newMilestones });
  };

  const handleOpenModal = (tribe?: Tribe) => {
    if (tribe) {
      setIsEditing(tribe.id!);
      // Handle legacy counterId if it exists, and ensure counterIds is an array
      const tribeWithCounters = { 
        ...tribe, 
        counterIds: tribe.counterIds || ((tribe as any).counterId ? [(tribe as any).counterId] : []) 
      };
      setFormData(tribeWithCounters);
    } else {
      setIsEditing(null);
      setFormData(initialTribeState);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const tribeData = { 
      name: formData.name,
      icon: formData.icon,
      trait: formData.trait,
      milestones: formData.milestones,
      description: formData.description,
      color: formData.color,
      counterIds: formData.counterIds,
      rarity: formData.rarity,
      buffTarget: formData.buffTarget
    };

    if (isEditing) {
      await updateDoc(doc(db, 'tribes', isEditing), tribeData);
    } else {
      await addDoc(collection(db, 'tribes'), tribeData);
    }
    
    setIsModalOpen(false);
    setFormData(initialTribeState);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Xác nhận xóa Hệ này? 😿")) await deleteDoc(doc(db, 'tribes', id));
  };

  return (
    <div className="view-tribes animate-in">
      <header className="content-header">
        <div><h2>Hệ Tộc 🧬</h2><p>Định nghĩa sức mạnh nguyên tố</p></div>
        <button className="btn-cute" onClick={() => handleOpenModal()}>➕ Thêm Hệ Mới</button>
      </header>

      <section className="hero-grid">
        {tribes.map(t => (
          <div key={t.id} className="manga-card hero-card">
            <div className="hero-avatar" style={{ backgroundColor: t.color }}>{t.icon}</div>
            <div className="hero-info">
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                <h3>{t.name}</h3>
              </div>
              
              <p className="hero-description">{t.description || 'Chưa có mô tả chi tiết cho hệ này...'}</p>
              
              <p style={{fontSize: '0.85rem', fontWeight: 900, color: 'var(--p-orange)', margin: '10px 0'}}>⚔️ {t.trait}</p>
              
              <div className="milestones-display">
                {t.milestones?.map((m, i) => (
                  <div key={i} className="ms-row">
                    <span className="ms-badge">{m.count}</span>
                    <span className="ms-text">{m.description || 'Chưa có mô tả'}</span>
                  </div>
                ))}
              </div>

              <div className="tribe-meta">
                <span>🎯 {t.buffTarget === 'self' ? 'Nội bộ tộc' : 'Toàn đội'}</span>
                <span>🛡️ Khắc: {
                  t.counterIds && t.counterIds.length > 0 
                  ? t.counterIds.map(id => tribes.find(x => x.id === id)?.name).filter(Boolean).join(', ')
                  : ((t as any).counterId ? tribes.find(x => x.id === (t as any).counterId)?.name : 'N/A')
                }</span>
              </div>
            </div>
            <span className={`tag-rarity ${t.rarity || 'common'}`}>{(t.rarity || 'common').toUpperCase()}</span>
            <div className="card-actions">
              <button className="edit-btn-card" onClick={() => handleOpenModal(t)}>✏️</button>
              <button className="delete-btn-card" onClick={() => handleDelete(t.id!)}>X</button>
            </div>
          </div>
        ))}
      </section>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="manga-card modal-content-large animate-pop">
            <h2 className="modal-title">{isEditing ? '🧬 Chỉnh Sửa Hệ Nguyên Tố' : '🧬 Thêm Hệ Nguyên Tố'}</h2>
            <form onSubmit={handleSave}>
              <div className="modal-scroll-area">
                <div className="form-group"><label>TÊN HỆ</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required /></div>
                <div className="form-row">
                  <div className="form-group"><label>BIỂU TƯỢNG</label><input type="text" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} /></div>
                  <div className="form-group"><label>ĐẶC TÍNH CHIẾN ĐẤU</label><input type="text" value={formData.trait} onChange={e => setFormData({...formData, trait: e.target.value})} placeholder="VD: Tăng Tốc Độ Đánh" /></div>
                </div>
                
                <div className="form-group">
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
                    <label>MỐC KÍCH HOẠT & HIỆU ỨNG</label>
                    <button type="button" className="btn-small-add" onClick={handleAddMilestone}>+ Thêm mốc</button>
                  </div>
                  <div className="milestones-editor">
                    {formData.milestones.map((m, index) => (
                      <div key={index} className="ms-edit-row">
                        <input type="number" value={m.count} onChange={e => handleMilestoneChange(index, 'count', parseInt(e.target.value))} style={{width:'70px'}} />
                        <input type="text" value={m.description} onChange={e => handleMilestoneChange(index, 'description', e.target.value)} placeholder="Mô tả hiệu ứng tại mốc này..." />
                        <button type="button" className="btn-remove" onClick={() => handleRemoveMilestone(index)}>×</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-row">
                <div className="form-group"><label>HỆ BỊ KHẮC (Chọn nhiều)</label>
                  <div className="multi-select-grid">
                    {tribes.filter(t => t.id !== isEditing).map(t => (
                      <label key={t.id} className="checkbox-item">
                        <input 
                          type="checkbox" 
                          checked={formData.counterIds?.includes(t.id!)} 
                          onChange={e => {
                            const newIds = e.target.checked 
                              ? [...(formData.counterIds || []), t.id!]
                              : (formData.counterIds || []).filter(id => id !== t.id);
                            setFormData({...formData, counterIds: newIds});
                          }}
                        />
                        <span>{t.icon} {t.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                  <div className="form-group"><label>ĐỘ HIẾM</label>
                    <select value={formData.rarity} onChange={e => setFormData({...formData, rarity: e.target.value})}>
                      <option value="common">Common</option><option value="rare">Rare</option><option value="epic">Epic</option><option value="legendary">Legendary</option>
                    </select>
                  </div>
                </div>
                <div className="form-group"><label>MÀU & ĐỐI TƯỢNG BUFF</label>
                  <div style={{display:'grid', gridTemplateColumns: '80px 1fr', gap: '15px'}}>
                    <input type="color" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} style={{height: '50px', padding: '5px'}} />
                    <select value={formData.buffTarget} onChange={e => setFormData({...formData, buffTarget: e.target.value})}>
                      <option value="self">Nội bộ tộc</option><option value="team">Toàn đội hình</option>
                    </select>
                  </div>
                </div>
                <div className="form-group"><label>MÔ TẢ TỔNG QUAN</label><textarea rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-cute">{isEditing ? 'Cập Nhật 🧬' : 'Lưu Hệ 🧬'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TribeManager;
