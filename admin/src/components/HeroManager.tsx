import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import type { Hero, Tribe, Role, StatConfig } from '../types';

interface Props {
  heroes: Hero[];
  tribes: Tribe[];
  roles: Role[];
  stats: StatConfig[];
}

const HeroManager: React.FC<Props> = ({ heroes, tribes, roles, stats }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [newHero, setNewHero] = useState<Hero>({
    name: '', elementId: '', roleId: '',
    hp: 1000, pAtk: 150, mAtk: 50, pDef: 80, mDef: 60, speed: 100,
    description: '', combo: '',
    elementName: '', roleName: '', color: '',
    skills: {
      basic: { name: 'Cào Thường', power: 100 },
      passive: { name: 'Bản Năng Mèo', description: 'Tăng 10% né tránh' },
      active: { name: 'Tuyệt Kỹ Mèo Béo', power: 350, cd: 3 }
    }
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tribes.length === 0 || roles.length === 0) return alert("Vui lòng tạo Hệ & Vai Trò trước!");
    
    const targetElementId = newHero.elementId || tribes[0]?.id || '';
    const targetRoleId = newHero.roleId || roles[0]?.id || '';
    
    const selectedTribe = tribes.find(t => t.id === targetElementId);
    const selectedRole = roles.find(r => r.id === targetRoleId);
    
    await addDoc(collection(db, 'heroes'), { 
      name: newHero.name,
      elementId: targetElementId,
      roleId: targetRoleId,
      elementName: selectedTribe?.name || 'Unknown',
      roleName: selectedRole?.name || 'Unknown',
      hp: newHero.hp,
      pAtk: newHero.pAtk,
      mAtk: newHero.mAtk,
      pDef: newHero.pDef,
      mDef: newHero.mDef,
      speed: newHero.speed,
      description: newHero.description,
      combo: newHero.combo,
      skills: newHero.skills,
      color: selectedTribe?.color || '#eee' 
    });
    setIsModalOpen(false);
    setNewHero({
      name: '', elementId: tribes[0]?.id || '', roleId: roles[0]?.id || '',
      hp: 1000, pAtk: 150, mAtk: 50, pDef: 80, mDef: 60, speed: 100,
      description: '', combo: '',
      elementName: '', roleName: '', color: '',
      skills: {
        basic: { name: 'Cào Thường', power: 100 },
        passive: { name: 'Bản Năng Mèo', description: 'Tăng 10% né tránh' },
        active: { name: 'Tuyệt Kỹ Mèo Béo', power: 350, cd: 3 }
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Xác nhận chiêu hồi Hero này? 😿")) await deleteDoc(doc(db, 'heroes', id));
  };

  // Helper to get stat icon and color
  const getStatInfo = (code: string) => {
    return stats.find(s => s.code === code) || { icon: '❓', color: '#636e72', name: code };
  };

  return (
    <div className="view-heroes animate-in">
      <header className="content-header">
        <div><h2>Đội Quân Mèo 🐱</h2><p>Quản lý chiến binh vương quốc</p></div>
        <button className="btn-cute" onClick={() => (tribes.length === 0 || roles.length === 0) ? alert('Hãy tạo Hệ & Vai Trò trước!') : setIsModalOpen(true)}>➕ Chiêu Mộ Tướng</button>
      </header>

      <section className="hero-grid">
        {heroes.map(hero => (
          <div key={hero.id} className="manga-card hero-card">
            <div className="hero-avatar" style={{ backgroundColor: hero.color }}>🐱</div>
            <div className="hero-info">
              <h3>{hero.name}</h3>
              <div className="hero-tags">
                <span className="tag" style={{backgroundColor: hero.color}}>{hero.elementName}</span>
                <span className="tag role">{hero.roleName}</span>
              </div>
              <div className="dual-stats-grid">
                <div className="ds-box"><span>{getStatInfo('hp').icon} HP</span><b>{hero.hp}</b></div>
                <div className="ds-box"><span>{getStatInfo('spd').icon} SPD</span><b>{hero.speed}</b></div>
                <div className="ds-box patk" style={{borderColor: getStatInfo('p_atk').color}}><span>{getStatInfo('p_atk').icon} P-ATK</span><b>{hero.pAtk}</b></div>
                <div className="ds-box matk" style={{borderColor: getStatInfo('m_atk').color}}><span>{getStatInfo('m_atk').icon} M-ATK</span><b>{hero.mAtk}</b></div>
                <div className="ds-box pdef" style={{borderColor: getStatInfo('p_def').color}}><span>{getStatInfo('p_def').icon} P-DEF</span><b>{hero.pDef}</b></div>
                <div className="ds-box mdef" style={{borderColor: getStatInfo('m_def').color}}><span>{getStatInfo('m_def').icon} M-DEF</span><b>{hero.mDef}</b></div>
              </div>
            </div>
            <button className="delete-btn-card" onClick={() => handleDelete(hero.id!)}>X</button>
          </div>
        ))}
      </section>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="manga-card modal-content-large animate-pop">
            <h2 className="modal-title">✨ Chiêu Mộ Anh Hùng</h2>
            <div className="modal-tabs">
              <button className={activeTab === 'basic' ? 'active' : ''} onClick={() => setActiveTab('basic')}>📜 Cơ Bản</button>
              <button className={activeTab === 'skills' ? 'active' : ''} onClick={() => setActiveTab('skills')}>⚔️ Kỹ Năng</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-scroll-area">
                {activeTab === 'basic' ? (
                  <>
                    <div className="form-group"><label>TÊN HERO</label><input type="text" value={newHero.name} onChange={e => setNewHero({...newHero, name: e.target.value})} required /></div>
                    <div className="form-row">
                      <div className="form-group"><label>HỆ</label>
                        <select value={newHero.elementId || (tribes[0]?.id)} onChange={e => setNewHero({...newHero, elementId: e.target.value})} required>
                          {tribes.map(t => <option key={t.id} value={t.id}>{t.icon} {t.name}</option>)}
                        </select>
                      </div>
                      <div className="form-group"><label>VAI TRÒ</label>
                        <select value={newHero.roleId || (roles[0]?.id)} onChange={e => setNewHero({...newHero, roleId: e.target.value})} required>
                          {roles.map(r => <option key={r.id} value={r.id}>{r.icon} {r.name}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="stats-grid-v3" style={{gridTemplateColumns: 'repeat(3, 1fr)'}}>
                      <div className="s-input"><label>HP</label><input type="number" value={newHero.hp} onChange={e => setNewHero({...newHero, hp: parseInt(e.target.value)})} /></div>
                      <div className="s-input"><label>P-ATK</label><input type="number" value={newHero.pAtk} onChange={e => setNewHero({...newHero, pAtk: parseInt(e.target.value)})} /></div>
                      <div className="s-input"><label>M-ATK</label><input type="number" value={newHero.mAtk} onChange={e => setNewHero({...newHero, mAtk: parseInt(e.target.value)})} /></div>
                      <div className="s-input"><label>SPD</label><input type="number" value={newHero.speed} onChange={e => setNewHero({...newHero, speed: parseInt(e.target.value)})} /></div>
                      <div className="s-input"><label>P-DEF</label><input type="number" value={newHero.pDef} onChange={e => setNewHero({...newHero, pDef: parseInt(e.target.value)})} /></div>
                      <div className="s-input"><label>M-DEF</label><input type="number" value={newHero.mDef} onChange={e => setNewHero({...newHero, mDef: parseInt(e.target.value)})} /></div>
                    </div>
                  </>
                ) : (
                  <div style={{display:'flex', flexDirection:'column', gap:'15px'}}>
                    <div className="skill-box"><p className="skill-label">🗡️ ĐÒN ĐÁNH CƠ BẢN</p><div className="skill-grid-input"><input type="text" value={newHero.skills.basic.name} onChange={e => setNewHero({...newHero, skills: {...newHero.skills, basic: {...newHero.skills.basic, name: e.target.value}}})} /><input type="number" value={newHero.skills.basic.power} onChange={e => setNewHero({...newHero, skills: {...newHero.skills, basic: {...newHero.skills.basic, power: parseInt(e.target.value)}}})} /></div></div>
                    <div className="skill-box"><p className="skill-label">🔥 TUYỆT KỸ</p><input type="text" value={newHero.skills.active.name} onChange={e => setNewHero({...newHero, skills: {...newHero.skills, active: {...newHero.skills.active, name: e.target.value}}})} /><div className="skill-grid-input"><input type="number" value={newHero.skills.active.power} onChange={e => setNewHero({...newHero, skills: {...newHero.skills, active: {...newHero.skills.active, power: parseInt(e.target.value)}}})} /><input type="number" value={newHero.skills.active.cd} onChange={e => setNewHero({...newHero, skills: {...newHero.skills, active: {...newHero.skills.active, cd: parseInt(e.target.value)}}})} /></div></div>
                  </div>
                )}
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-cute">Chiêu Mộ Ngay 🐾</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroManager;
