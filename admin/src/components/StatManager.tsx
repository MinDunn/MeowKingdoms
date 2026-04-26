import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import type { StatConfig } from '../types';

interface Props {
  stats: StatConfig[];
}

const StatManager: React.FC<Props> = ({ stats }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newStat, setNewStat] = useState<StatConfig>({
    name: '', code: '', icon: '📊', color: '#54a0ff', description: ''
  });

  const handleOpenModal = (stat?: StatConfig) => {
    if (stat) {
      setEditingId(stat.id!);
      setNewStat({ ...stat });
    } else {
      setEditingId(null);
      setNewStat({ name: '', code: '', icon: '📊', color: '#54a0ff', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const statData = {
      name: newStat.name,
      code: newStat.code.toLowerCase().replace(/\s+/g, '_'),
      icon: newStat.icon,
      color: newStat.color,
      description: newStat.description
    };

    if (editingId) {
      await updateDoc(doc(db, 'stats', editingId), statData);
    } else {
      await addDoc(collection(db, 'stats'), statData);
    }
    
    setIsModalOpen(false);
    setEditingId(null);
  };

  const initDefaults = async () => {
    if (confirm("Khởi tạo bộ chỉ số cơ bản (HP, P-ATK, M-ATK...)?")) {
      const defaults = [
        { name: 'HP', code: 'hp', icon: '❤️', color: '#ff6b6b', description: 'Điểm sinh mệnh của anh hùng' },
        { name: 'P-ATK', code: 'p_atk', icon: '⚔️', color: '#ff9f43', description: 'Sát thương vật lý cơ bản' },
        { name: 'M-ATK', code: 'm_atk', icon: '🔮', color: '#a29bfe', description: 'Sát thương phép thuật' },
        { name: 'P-DEF', code: 'p_def', icon: '🛡️', color: '#54a0ff', description: 'Khả năng giảm sát thương vật lý' },
        { name: 'M-DEF', code: 'm_def', icon: '✨', color: '#00d2d3', description: 'Khả năng kháng sát thương phép' },
        { name: 'SPD', code: 'spd', icon: '⚡', color: '#f1c40f', description: 'Tốc độ ra đòn trong lượt' },
      ];
      for (const s of defaults) {
        await addDoc(collection(db, 'stats'), s);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Xác nhận xóa chỉ số này?")) await deleteDoc(doc(db, 'stats', id));
  };

  return (
    <div className="view-stats animate-in">
      <header className="content-header">
        <div><h2>Hệ Thống Chỉ Số 📊</h2><p>Định nghĩa thuộc tính toàn game</p></div>
        <div style={{display:'flex', gap: '10px'}}>
          {stats.length === 0 && <button className="btn-secondary" onClick={initDefaults}>⚙️ Khởi tạo mặc định</button>}
          <button className="btn-cute" onClick={() => handleOpenModal()}>➕ Thêm Chỉ Số</button>
        </div>
      </header>

      <section className="hero-grid">
        {stats.map(s => (
          <div key={s.id} className="manga-card" style={{
            padding: '25px', 
            borderRadius: '25px', 
            border: `4px solid var(--manga-border)`,
            backgroundColor: 'white',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            transition: '0.2s',
            boxShadow: `8px 8px 0px ${s.color}`
          }}>
            <div style={{
              fontSize: '3.5rem',
              width: '90px',
              height: '90px',
              backgroundColor: `${s.color}15`,
              borderRadius: '25px',
              border: `4px solid ${s.color}`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '15px',
              boxShadow: `4px 4px 0px ${s.color}`
            }}>{s.icon}</div>
            
            <h3 style={{color: s.color, margin: '5px 0', fontSize: '1.6rem', fontFamily: 'var(--font-heading)'}}>{s.name}</h3>
            <p style={{fontSize: '0.9rem', marginTop: '10px', color: '#636e72', fontWeight: 600, lineHeight: '1.4'}}>{s.description || 'Chưa có mô tả'}</p>
            
            <div style={{position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '8px'}}>
              <button className="edit-btn-small" onClick={() => handleOpenModal(s)}>✏️</button>
              <button className="delete-btn-small" onClick={() => handleDelete(s.id!)}>X</button>
            </div>
          </div>
        ))}
      </section>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="manga-card modal-content-large animate-pop">
            <h2 className="modal-title">{editingId ? '✏️ Chỉnh Sửa Chỉ Số' : '📊 Tạo Chỉ Số Mới'}</h2>
            <form onSubmit={handleSave}>
              <div className="modal-scroll-area">
                <div className="form-group"><label>TÊN CHỈ SỐ</label><input type="text" value={newStat.name} onChange={e => setNewStat({...newStat, name: e.target.value})} required /></div>
                <div className="form-row">
                  <div className="form-group"><label>MÃ CODE</label><input type="text" value={newStat.code} onChange={e => setNewStat({...newStat, code: e.target.value})} disabled={!!editingId} placeholder="e.g. crit_rate" required /></div>
                  <div className="form-group"><label>BIỂU TƯỢNG</label><input type="text" value={newStat.icon} onChange={e => setNewStat({...newStat, icon: e.target.value})} /></div>
                </div>
                <div className="form-group"><label>MÀU ĐẠI DIỆN</label>
                  <input type="color" value={newStat.color} onChange={e => setNewStat({...newStat, color: e.target.value})} style={{height: '50px', width: '100%'}} />
                </div>
                <div className="form-group"><label>MÔ TẢ CHI TIẾT</label><textarea rows={3} value={newStat.description} onChange={e => setNewStat({...newStat, description: e.target.value})} /></div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-cute">{editingId ? 'Cập Nhật ✨' : 'Kích Hoạt 📊'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatManager;
