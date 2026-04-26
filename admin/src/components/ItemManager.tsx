import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import type { Item, StatConfig } from '../types';

interface Props {
  items: Item[];
  stats: StatConfig[];
}

const ItemManager: React.FC<Props> = ({ items, stats }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState<Item>({
    name: '', icon: '⚔️', type: 'weapon', statType: '', statValue: 10, rarity: 'common', description: ''
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.statType && stats.length > 0) newItem.statType = stats[0].code;
    
    await addDoc(collection(db, 'items'), { 
      name: newItem.name,
      icon: newItem.icon,
      type: newItem.type,
      statType: newItem.statType || (stats[0]?.code || 'N/A'),
      statValue: newItem.statValue,
      rarity: newItem.rarity,
      description: newItem.description
    });
    setIsModalOpen(false);
    setNewItem({ name: '', icon: '⚔️', type: 'weapon', statType: '', statValue: 10, rarity: 'common', description: '' });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Hủy bỏ trang bị này? 😿")) await deleteDoc(doc(db, 'items', id));
  };

  return (
    <div className="view-items animate-in">
      <header className="content-header">
        <div><h2>Kho Trang Bị 🛡️</h2><p>Quản lý phục trang & vũ khí</p></div>
        <button className="btn-cute" onClick={() => stats.length === 0 ? alert("Vui lòng tạo Chỉ Số trước!") : setIsModalOpen(true)}>➕ Thêm Trang Bị</button>
      </header>

      <section className="hero-grid">
        {items.map(i => (
          <div key={i.id} className="manga-card hero-card">
            <div className="hero-avatar" style={{backgroundColor: '#f1f2f6'}}>{i.icon}</div>
            <div className="hero-info">
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <h3>{i.name}</h3>
                <span className={`tag-rarity ${i.rarity || 'common'}`}>{(i.rarity || 'common').toUpperCase()}</span>
              </div>
              <p style={{fontSize: '0.75rem', fontWeight: 800, color: 'var(--p-blue)', textTransform: 'capitalize'}}>📂 {i.type}</p>
              <p style={{fontSize: '0.8rem', fontWeight: 800, color: 'var(--p-red)', margin: '5px 0'}}>
                ⚡ +{i.statValue} {stats.find(s => s.code === i.statType)?.name || i.statType}
              </p>
            </div>
            <button className="delete-btn-card" onClick={() => handleDelete(i.id!)}>X</button>
          </div>
        ))}
      </section>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="manga-card modal-content-large animate-pop">
            <h2 className="modal-title">🛡️ Chế Tạo Trang Bị</h2>
            <form onSubmit={handleSave}>
              <div className="modal-scroll-area">
                <div className="form-group"><label>TÊN TRANG BỊ</label><input type="text" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} required /></div>
                <div className="form-row">
                  <div className="form-group"><label>BIỂU TƯỢNG</label><input type="text" value={newItem.icon} onChange={e => setNewItem({...newItem, icon: e.target.value})} /></div>
                  <div className="form-group"><label>LOẠI</label>
                    <select value={newItem.type} onChange={e => setNewItem({...newItem, type: e.target.value as any})}>
                      <option value="weapon">Vũ Khí</option><option value="armor">Giáp Trụ</option>
                      <option value="helmet">Mũ/Nón</option><option value="boots">Giày/Ủng</option>
                      <option value="accessory">Trang Sức</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>CHỈ SỐ TĂNG</label>
                    <select value={newItem.statType} onChange={e => setNewItem({...newItem, statType: e.target.value})} required>
                      {stats.map(s => <option key={s.id} value={s.code}>{s.icon} {s.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label>GIÁ TRỊ</label><input type="number" value={newItem.statValue} onChange={e => setNewItem({...newItem, statValue: parseInt(e.target.value)})} /></div>
                </div>
                <div className="form-row">
                   <div className="form-group"><label>ĐỘ HIẾM</label>
                    <select value={newItem.rarity} onChange={e => setNewItem({...newItem, rarity: e.target.value})}>
                      <option value="common">Common</option><option value="rare">Rare</option>
                      <option value="epic">Epic</option><option value="legendary">Legendary</option>
                    </select>
                  </div>
                </div>
                <div className="form-group"><label>MÔ TẢ</label><textarea rows={2} value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} /></div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-cute">Lưu Kho 🛡️</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemManager;
