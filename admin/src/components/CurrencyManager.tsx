import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import type { Currency } from '../types';

interface Props {
  currencies: Currency[];
}

const CurrencyManager: React.FC<Props> = ({ currencies }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCurr, setNewCurr] = useState<Currency>({
    name: '', icon: '💎', type: 'premium', color: '#ff7675', description: ''
  });

  const handleOpenModal = (curr?: Currency) => {
    if (curr) {
      setEditingId(curr.id!);
      setNewCurr({ ...curr });
    } else {
      setEditingId(null);
      setNewCurr({ name: '', icon: '💎', type: 'premium', color: '#ff7675', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateDoc(doc(db, 'currencies', editingId), newCurr as any);
    } else {
      await addDoc(collection(db, 'currencies'), newCurr);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="view-currencies animate-in">
      <header className="content-header">
        <div><h2>Hệ Thống Tiền Tệ 💰</h2><p>Quản lý các loại ngân sách trong game</p></div>
        <button className="btn-cute" onClick={() => handleOpenModal()}>➕ Thêm Loại Tiền</button>
      </header>

      <section className="hero-grid">
        {currencies.map(c => (
          <div key={c.id} className="manga-card" style={{
            padding: '20px', borderRadius: '20px', border: `4px solid var(--manga-border)`,
            boxShadow: `8px 8px 0px ${c.color}`, backgroundColor: 'white', position: 'relative',
            display: 'flex', alignItems: 'center', gap: '20px'
          }}>
            <div style={{
              fontSize: '2.5rem', width: '70px', height: '70px', backgroundColor: `${c.color}22`,
              border: `3px solid ${c.color}`, borderRadius: '15px', display: 'flex', 
              justifyContent: 'center', alignItems: 'center'
            }}>{c.icon}</div>
            <div>
              <h3 style={{color: c.color, margin: 0, fontSize: '1.4rem'}}>{c.name}</h3>
              <p style={{fontSize: '0.7rem', fontWeight: 800, color: '#95a5a6', textTransform: 'uppercase'}}>🏷️ {c.type}</p>
              <p style={{fontSize: '0.75rem', margin: '5px 0 0', color: '#636e72'}}>{c.description}</p>
            </div>
            <div style={{position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '8px'}}>
              <button className="edit-btn-small" onClick={() => handleOpenModal(c)}>✏️</button>
              <button className="delete-btn-small" onClick={() => {if(confirm("Xóa loại tiền này?")) deleteDoc(doc(db, 'currencies', c.id!))}}>X</button>
            </div>
          </div>
        ))}
      </section>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="manga-card modal-content-large animate-pop">
            <h2 className="modal-title">{editingId ? '✏️ Sửa Tiền Tệ' : '💰 Tạo Loại Tiền Mới'}</h2>
            <form onSubmit={handleSave}>
              <div className="modal-scroll-area">
                <div className="form-group"><label>TÊN LOẠI TIỀN</label><input type="text" value={newCurr.name} onChange={e => setNewCurr({...newCurr, name: e.target.value})} required /></div>
                <div className="form-row">
                  <div className="form-group"><label>BIỂU TƯỢNG</label><input type="text" value={newCurr.icon} onChange={e => setNewCurr({...newCurr, icon: e.target.value})} /></div>
                  <div className="form-group"><label>PHÂN LOẠI</label>
                    <select value={newCurr.type} onChange={e => setNewCurr({...newCurr, type: e.target.value as any})}>
                      <option value="basic">Tiền Cơ Bản (Vàng)</option>
                      <option value="premium">Tiền Cao Cấp (Kim Cương)</option>
                      <option value="summon">Vật Phẩm Chiêu Mộ (Vé)</option>
                      <option value="special">Tiền Sự Kiện/Đặc Biệt</option>
                    </select>
                  </div>
                </div>
                <div className="form-group"><label>MÀU ĐẠI DIỆN</label><input type="color" value={newCurr.color} onChange={e => setNewCurr({...newCurr, color: e.target.value})} style={{height: '50px', width:'100%'}} /></div>
                <div className="form-group"><label>MÔ TẢ</label><textarea rows={3} value={newCurr.description} onChange={e => setNewCurr({...newCurr, description: e.target.value})} /></div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-cute">{editingId ? 'Cập Nhật ✨' : 'Kích Hoạt 💰'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencyManager;
