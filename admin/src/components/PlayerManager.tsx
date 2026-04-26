import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import type { Player, Currency } from '../types';

interface Props {
  players: Player[];
  currencies: Currency[];
}

const PlayerManager: React.FC<Props> = ({ players, currencies }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const handleEdit = (player: Player) => {
    setSelectedPlayer({ ...player });
    setIsModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayer) return;

    await updateDoc(doc(db, 'players', selectedPlayer.id!), {
      displayName: selectedPlayer.displayName,
      level: selectedPlayer.level,
      status: selectedPlayer.status,
      'inventory.currencies': selectedPlayer.inventory.currencies
    });
    
    setIsModalOpen(false);
    setSelectedPlayer(null);
  };

  const toggleStatus = async (player: Player) => {
    const newStatus = player.status === 'active' ? 'banned' : 'active';
    await updateDoc(doc(db, 'players', player.id!), { status: newStatus });
  };

  return (
    <div className="view-players animate-in">
      <header className="content-header">
        <div><h2>Quản Lý Người Chơi 👥</h2><p>Danh sách thần dân trong vương quốc</p></div>
        <div className="status-tag" style={{background: 'var(--p-yellow)'}}>Tổng: {players.filter(p => p.role !== 'admin').length} Users</div>
      </header>

      <section className="manga-card" style={{padding: '0', overflow: 'hidden'}}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>NGƯỜI CHƠI</th>
              <th>CẤP ĐỘ</th>
              <th>TÀI CHÍNH</th>
              <th>TRẠNG THÁI</th>
              <th>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {players.filter(p => p.role !== 'admin').map(p => (
              <tr key={p.id} className={(p.status || 'active') === 'banned' ? 'row-banned' : ''}>
                <td>
                  <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                    <div className="player-mini-avatar">{p.avatar || '👤'}</div>
                    <div>
                      <div style={{fontWeight:800}}>{p.displayName}</div>
                      <div style={{fontSize: '0.7rem', color: '#95a5a6'}}>{p.email}</div>
                    </div>
                  </div>
                </td>
                <td><span className="tag-level">LV.{p.level}</span></td>
                <td>
                  <div style={{display:'flex', gap:'5px', flexWrap:'wrap'}}>
                    {currencies.map(c => (
                      <span key={c.id} style={{fontSize:'0.75rem', fontWeight:800, color: c.color}}>
                        {c.icon} {p.inventory?.currencies?.[c.name.toLowerCase()] || 0}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${p.status || 'active'}`}>{(p.status || 'active').toUpperCase()}</span>
                </td>
                <td>
                  <div style={{display:'flex', gap:'8px'}}>
                    <button className="edit-btn-small" onClick={() => handleEdit(p)}>✏️</button>
                    <button className={`status-toggle ${p.status}`} onClick={() => toggleStatus(p)}>
                      {p.status === 'active' ? '🚫 Ban' : '✅ Unban'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {isModalOpen && selectedPlayer && (
        <div className="modal-overlay">
          <div className="manga-card modal-content-large animate-pop">
            <h2 className="modal-title">🔧 Hiệu Chỉnh Người Chơi</h2>
            <form onSubmit={handleUpdate}>
              <div className="modal-scroll-area">
                <div className="form-group"><label>TÊN HIỂN THỊ</label><input type="text" value={selectedPlayer.displayName} onChange={e => setSelectedPlayer({...selectedPlayer, displayName: e.target.value})} /></div>
                <div className="form-row">
                  <div className="form-group"><label>CẤP ĐỘ</label><input type="number" value={selectedPlayer.level} onChange={e => setSelectedPlayer({...selectedPlayer, level: parseInt(e.target.value)})} /></div>
                  <div className="form-group"><label>TRẠNG THÁI</label>
                    <select value={selectedPlayer.status} onChange={e => setSelectedPlayer({...selectedPlayer, status: e.target.value as any})}>
                      <option value="active">Đang hoạt động</option><option value="banned">Đã khóa</option>
                    </select>
                  </div>
                </div>
                
                <h3 style={{fontFamily: 'var(--font-heading)', marginTop: '20px'}}>💰 Điều Chỉnh Tài Chính</h3>
                <div className="stats-grid-v3" style={{gridTemplateColumns: 'repeat(2, 1fr)'}}>
                  {currencies.map(c => (
                    <div key={c.id} className="s-input">
                      <label>{c.icon} {c.name.toUpperCase()}</label>
                      <input type="number" 
                        value={selectedPlayer.inventory?.currencies?.[c.name.toLowerCase()] || 0} 
                        onChange={e => {
                          const newCurrs = { ...(selectedPlayer.inventory?.currencies || {}), [c.name.toLowerCase()]: parseInt(e.target.value) };
                          setSelectedPlayer({ ...selectedPlayer, inventory: { ...(selectedPlayer.inventory || { materials: {}, heroes: [], items: [] }), currencies: newCurrs } });
                        }} 
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Đóng</button>
                <button type="submit" className="btn-cute">Lưu Thay Đổi ✨</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerManager;
