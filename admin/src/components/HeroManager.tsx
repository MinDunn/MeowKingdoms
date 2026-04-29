import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import type { Hero, Tribe, Role, StatConfig } from '../types';
import './CardPreview.css'; // Import CSS khung thẻ

interface Props {
  heroes: Hero[];
  tribes: Tribe[];
  roles: Role[];
  stats: StatConfig[];
}

const HeroManager: React.FC<Props> = ({ heroes, tribes, roles, stats }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  
  const initialHeroState: Hero = {
    name: '', elementId: '', roleId: '',
    hp: 1000, pAtk: 150, mAtk: 50, pDef: 80, mDef: 60, speed: 100,
    description: '', combo: '',
    elementName: '', roleName: '', color: '',
    skills: {
      basic: { name: 'Cào Thường', power: 100 },
      passive: { name: 'Bản Năng Mèo', description: 'Tăng 10% né tránh' },
      active: { name: 'Tuyệt Kỹ Mèo Béo', power: 350, cd: 3 }
    },
    rarity: 'common',
    tier: 1
  };

  const getTierInfo = (tierLevel: number) => {
    switch (tierLevel) {
      case 1: return { level: 1, name: 'Thường', color: 'Trắng', stars: 1, class: 'cp-tier-1' };
      case 2: return { level: 20, name: 'Cơ Bản', color: 'Lục', stars: 2, class: 'cp-tier-2' };
      case 3: return { level: 60, name: 'Hiếm', color: 'Lam', stars: 3, class: 'cp-tier-3' };
      case 4: return { level: 100, name: 'Sử Thi', color: 'Tím', stars: 4, class: 'cp-tier-4' };
      case 5: return { level: 160, name: 'H.Thoại', color: 'Cam', stars: 5, class: 'cp-tier-5' };
      case 6: return { level: 240, name: 'T.Thoại', color: 'Đỏ', stars: 5, class: 'cp-tier-6' };
      default: return { level: 1, name: 'Thường', color: 'Trắng', stars: 1, class: 'cp-tier-1' };
    }
  };

  const [formData, setFormData] = useState<Hero>(initialHeroState);

  const handleOpenModal = (hero?: Hero) => {
    if (hero) {
      setIsEditing(hero.id!);
      setFormData({ ...hero });
    } else {
      setIsEditing(null);
      setFormData({
        ...initialHeroState,
        elementId: tribes[0]?.id || '',
        roleId: roles[0]?.id || '',
        rarity: 'common',
        tier: 1
      });
    }
    setIsModalOpen(true);
    setActiveTab('basic');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tribes.length === 0 || roles.length === 0) return alert("Vui lòng tạo Hệ & Vai Trò trước!");
    
    const targetElementId = formData.elementId || tribes[0]?.id || '';
    const targetRoleId = formData.roleId || roles[0]?.id || '';
    
    const selectedTribe = tribes.find(t => t.id === targetElementId);
    const selectedRole = roles.find(r => r.id === targetRoleId);
    
    const heroData = { 
      name: formData.name,
      elementId: targetElementId,
      roleId: targetRoleId,
      elementName: selectedTribe?.name || 'Unknown',
      roleName: selectedRole?.name || 'Unknown',
      hp: formData.hp,
      pAtk: formData.pAtk,
      mAtk: formData.mAtk,
      pDef: formData.pDef,
      mDef: formData.mDef,
      speed: formData.speed,
      description: formData.description,
      combo: formData.combo,
      skills: formData.skills,
      rarity: formData.rarity || 'common',
      tier: Number(formData.tier) || 1,
      color: selectedTribe?.color || '#eee' 
    };

    if (isEditing) {
      await updateDoc(doc(db, 'heroes', isEditing), heroData);
    } else {
      await addDoc(collection(db, 'heroes'), heroData);
    }
    
    setIsModalOpen(false);
    setFormData(initialHeroState);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Xác nhận chiêu hồi Hero này? 😿")) await deleteDoc(doc(db, 'heroes', id));
  };

  const getStatInfo = (code: string) => {
    return stats.find(s => s.code === code) || { icon: '❓', color: '#636e72', name: code };
  };

  return (
    <div className="view-heroes animate-in">
      <header className="content-header">
        <div><h2>Đội Quân Mèo 🐱</h2><p>Quản lý chiến binh vương quốc</p></div>
        <button className="btn-cute" onClick={() => handleOpenModal()}>➕ Chiêu Mộ Tướng</button>
      </header>

      <section className="hero-grid">
        {heroes.map(hero => {
          const tInfo = getTierInfo(hero.tier || 1);
          const tribeIcon = tribes.find(t => t.id === hero.elementId)?.icon || '☀️';
          return (
            <div key={hero.id} className="manga-card hero-card" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', paddingTop: '35px'}}>
              
              <div className={`cp-avatar-container ${tInfo.class}`} style={{transform: 'scale(0.9)', transformOrigin: 'top center', marginBottom: '-10px', flexShrink: 0}}>
                <div className="cp-portrait-mask" style={{backgroundColor: hero.color}}>
                  <span style={{fontSize: '4rem'}}>🐱</span>
                  <div className="cp-shadow-overlay"></div>
                </div>
                <div className="cp-faction-icon">{tribeIcon}</div>
                <div className="cp-level-text">Lvl {tInfo.level}{tInfo.level === 240 ? '+' : ''}</div>
                <div className="cp-stars-container">
                  {Array.from({ length: tInfo.stars }).map((_, i) => (
                    <span className="cp-star" key={i}>★</span>
                  ))}
                </div>
              </div>

              <div className="hero-info" style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <h3 style={{margin: '5px 0', textAlign: 'center', fontSize: '1.4rem', color: 'var(--manga-border)'}}>{hero.name}</h3>
                <div className="hero-tags" style={{justifyContent: 'center', flexWrap: 'wrap', marginBottom: '15px'}}>
                  <span className="tag role">{hero.roleName || '❓ Lỗi Vai Trò'}</span>
                </div>
                <div className="dual-stats-grid" style={{width: '100%', gap: '10px', gridTemplateColumns: 'repeat(2, 1fr)'}}>
                  <div className="ds-box" style={{display: 'flex', alignItems: 'center', textAlign: 'left', padding: '8px 15px', gap: '12px'}}>
                    <div style={{fontSize: '1.4rem'}}>{getStatInfo('hp').icon}</div>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                      <span style={{fontSize: '0.65rem', color: '#636e72', fontWeight: 800, marginBottom: '2px'}}>HP</span>
                      <b style={{fontSize: '1.1rem', fontFamily: 'var(--font-heading)'}}>{hero.hp}</b>
                    </div>
                  </div>
                  
                  <div className="ds-box" style={{display: 'flex', alignItems: 'center', textAlign: 'left', padding: '8px 15px', gap: '12px'}}>
                    <div style={{fontSize: '1.4rem'}}>{getStatInfo('spd').icon}</div>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                      <span style={{fontSize: '0.65rem', color: '#636e72', fontWeight: 800, marginBottom: '2px'}}>SPD</span>
                      <b style={{fontSize: '1.1rem', fontFamily: 'var(--font-heading)'}}>{hero.speed}</b>
                    </div>
                  </div>

                  <div className="ds-box patk" style={{borderColor: getStatInfo('p_atk').color, display: 'flex', alignItems: 'center', textAlign: 'left', padding: '8px 15px', gap: '12px'}}>
                    <div style={{fontSize: '1.4rem'}}>{getStatInfo('p_atk').icon}</div>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                      <span style={{fontSize: '0.65rem', color: '#636e72', fontWeight: 800, marginBottom: '2px'}}>P-ATK</span>
                      <b style={{fontSize: '1.1rem', fontFamily: 'var(--font-heading)'}}>{hero.pAtk}</b>
                    </div>
                  </div>

                  <div className="ds-box matk" style={{borderColor: getStatInfo('m_atk').color, display: 'flex', alignItems: 'center', textAlign: 'left', padding: '8px 15px', gap: '12px'}}>
                    <div style={{fontSize: '1.4rem'}}>{getStatInfo('m_atk').icon}</div>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                      <span style={{fontSize: '0.65rem', color: '#636e72', fontWeight: 800, marginBottom: '2px'}}>M-ATK</span>
                      <b style={{fontSize: '1.1rem', fontFamily: 'var(--font-heading)'}}>{hero.mAtk}</b>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-actions">
                <button className="edit-btn-card" onClick={() => handleOpenModal(hero)}>✏️</button>
                <button className="delete-btn-card" onClick={() => handleDelete(hero.id!)}>X</button>
              </div>
            </div>
          );
        })}
      </section>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="manga-card modal-content-large animate-pop">
            <h2 className="modal-title">{isEditing ? '✨ Chỉnh Sửa Anh Hùng' : '✨ Chiêu Mộ Anh Hùng'}</h2>
            <div className="modal-tabs">
              <button className={activeTab === 'basic' ? 'active' : ''} onClick={() => setActiveTab('basic')}>📜 Cơ Bản</button>
              <button className={activeTab === 'skills' ? 'active' : ''} onClick={() => setActiveTab('skills')}>⚔️ Kỹ Năng</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-scroll-area">
                {activeTab === 'basic' ? (
                  <>
                    <div className="form-group"><label>TÊN HERO</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Nhập tên anh hùng..." required /></div>
                    
                    <div className="form-row">
                      <div className="form-group"><label>HỆ</label>
                        <select value={formData.elementId || (tribes[0]?.id)} onChange={e => setFormData({...formData, elementId: e.target.value})} required>
                          {tribes.map(t => <option key={t.id} value={t.id}>{t.icon} {t.name}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>VAI TRÒ</label>
                        <select value={formData.roleId || (roles[0]?.id)} onChange={e => setFormData({...formData, roleId: e.target.value})} required>
                          {roles.map(r => <option key={r.id} value={r.id}>{r.icon} {r.name}</option>)}
                        </select>
                        {formData.roleId && (
                          <span className="priority-stat-hint">
                            Ưu tiên: {roles.find(r => r.id === formData.roleId)?.priorityStat}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="form-group"><label>CHỌN KHUNG TƯỚNG (BẬC)</label>
                      <select value={formData.tier || 1} onChange={e => setFormData({...formData, tier: parseInt(e.target.value)})}>
                        <option value={1}>Bậc 1: Thường (Trắng) ⚪</option>
                        <option value={2}>Bậc 2: Cơ Bản (Lục) 🟢</option>
                        <option value={3}>Bậc 3: Hiếm (Lam) 🔵</option>
                        <option value={4}>Bậc 4: Sử Thi (Tím) 🟣</option>
                        <option value={5}>Bậc 5: Huyền Thoại (Cam) 🟠</option>
                        <option value={6}>Bậc 6: Thần Thoại (Đỏ) 🔴</option>
                      </select>
                      <p style={{fontSize: '0.8rem', color: '#666', marginTop: '5px', fontStyle: 'italic'}}>Dữ liệu Bậc (Tier) này sẽ được lưu vào Database và render UI trong Game.</p>
                    </div>

                    <div className="form-group"><label>CHỈ SỐ SỨC MẠNH</label>
                      <div className="stats-grid-v3" style={{gridTemplateColumns: 'repeat(3, 1fr)'}}>
                        {(() => {
                          const currentRole = roles.find(r => r.id === (formData.roleId || roles[0]?.id));
                          const priority = currentRole?.priorityStat;
                          
                          return (
                            <>
                              <div className={`s-input ${priority === 'HP' ? 'priority-input' : ''}`}><label>HP</label><input type="number" value={formData.hp} onChange={e => setFormData({...formData, hp: parseInt(e.target.value)})} /></div>
                              <div className={`s-input ${priority === 'P-ATK' ? 'priority-input' : ''}`}><label>P-ATK</label><input type="number" value={formData.pAtk} onChange={e => setFormData({...formData, pAtk: parseInt(e.target.value)})} /></div>
                              <div className={`s-input ${priority === 'M-ATK' ? 'priority-input' : ''}`}><label>M-ATK</label><input type="number" value={formData.mAtk} onChange={e => setFormData({...formData, mAtk: parseInt(e.target.value)})} /></div>
                              <div className={`s-input ${priority === 'SPD' ? 'priority-input' : ''}`}><label>SPD</label><input type="number" value={formData.speed} onChange={e => setFormData({...formData, speed: parseInt(e.target.value)})} /></div>
                              <div className={`s-input ${priority === 'P-DEF' ? 'priority-input' : ''}`}><label>P-DEF</label><input type="number" value={formData.pDef} onChange={e => setFormData({...formData, pDef: parseInt(e.target.value)})} /></div>
                              <div className={`s-input ${priority === 'M-DEF' ? 'priority-input' : ''}`}><label>M-DEF</label><input type="number" value={formData.mDef} onChange={e => setFormData({...formData, mDef: parseInt(e.target.value)})} /></div>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    <div className="form-group"><label>MÔ TẢ CHI TIẾT</label><textarea rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Giới thiệu về sức mạnh và nguồn gốc..." /></div>
                    <div className="form-group"><label>GỢI Ý ĐỘI HÌNH (COMBO)</label><input type="text" value={formData.combo} onChange={e => setFormData({...formData, combo: e.target.value})} placeholder="VD: Đi cùng Tanker để tối ưu sát thương..." /></div>
                  </>
                ) : (
                  <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
                    <div className="skill-box">
                      <p className="skill-label">🗡️ KỸ NĂNG NỘI TẠI (PASSIVE)</p>
                      <div className="form-group" style={{marginBottom:0}}>
                        <input type="text" value={formData.skills.passive.name} onChange={e => setFormData({...formData, skills: {...formData.skills, passive: {...formData.skills.passive, name: e.target.value}}})} placeholder="Tên nội tại..." style={{marginBottom:'10px'}} />
                        <textarea rows={2} value={formData.skills.passive.description} onChange={e => setFormData({...formData, skills: {...formData.skills, passive: {...formData.skills.passive, description: e.target.value}}})} placeholder="Mô tả hiệu ứng nội tại..." />
                      </div>
                    </div>

                    <div className="skill-box">
                      <p className="skill-label">⚔️ ĐÒN ĐÁNH CƠ BẢN</p>
                      <div className="skill-grid-input">
                        <input type="text" value={formData.skills.basic.name} onChange={e => setFormData({...formData, skills: {...formData.skills, basic: {...formData.skills.basic, name: e.target.value}}})} placeholder="Tên đòn đánh..." />
                        <div style={{position:'relative'}}><input type="number" value={formData.skills.basic.power} onChange={e => setFormData({...formData, skills: {...formData.skills, basic: {...formData.skills.basic, power: parseInt(e.target.value)}}})} /><span style={{position:'absolute', right:'15px', top:'50%', transform:'translateY(-50%)', fontSize:'0.7rem', fontWeight:900, color:'#999'}}>POWER</span></div>
                      </div>
                    </div>

                    <div className="skill-box">
                      <p className="skill-label">🌟 TUYỆT KỸ (ULTIMATE)</p>
                      <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                        <input type="text" value={formData.skills.active.name} onChange={e => setFormData({...formData, skills: {...formData.skills, active: {...formData.skills.active, name: e.target.value}}})} placeholder="Tên tuyệt kỹ..." />
                        <div className="skill-grid-input">
                          <div style={{position:'relative'}}><input type="number" value={formData.skills.active.power} onChange={e => setFormData({...formData, skills: {...formData.skills, active: {...formData.skills.active, power: parseInt(e.target.value)}}})} /><span style={{position:'absolute', right:'15px', top:'50%', transform:'translateY(-50%)', fontSize:'0.7rem', fontWeight:900, color:'#999'}}>POWER</span></div>
                          <div style={{position:'relative'}}><input type="number" value={formData.skills.active.cd} onChange={e => setFormData({...formData, skills: {...formData.skills, active: {...formData.skills.active, cd: parseInt(e.target.value)}}})} /><span style={{position:'absolute', right:'15px', top:'50%', transform:'translateY(-50%)', fontSize:'0.7rem', fontWeight:900, color:'#999'}}>CD(s)</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-cute">{isEditing ? 'Cập Nhật 🐾' : 'Chiêu Mộ Ngay 🐾'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroManager;
