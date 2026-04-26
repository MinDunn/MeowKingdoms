import React from 'react';
import type { Hero, Tribe, Role, Artifact, Beast, Item, StatConfig, Material, Currency, Player } from '../types';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

interface Props {
  heroes: Hero[];
  tribes: Tribe[];
  roles: Role[];
  artifacts: Artifact[];
  beasts: Beast[];
  items: Item[];
  stats: StatConfig[];
  materials: Material[];
  currencies: Currency[];
  players: Player[];
}

const Dashboard: React.FC<Props> = ({ heroes, tribes, roles, artifacts, beasts, items, stats, materials, currencies, players }) => {
  const handleSeedData = async () => {
    if (!confirm("Bạn có muốn khởi tạo dữ liệu mẫu cho tất cả các bảng không?")) return;
    
    try {
      // 1. Stats
      const statDefaults = [
        { name: 'HP', code: 'hp', icon: '❤️', color: '#ff6b6b', description: 'Điểm sinh mệnh' },
        { name: 'P-ATK', code: 'p_atk', icon: '⚔️', color: '#ff9f43', description: 'Sát thương vật lý' },
        { name: 'M-ATK', code: 'm_atk', icon: '🔮', color: '#a29bfe', description: 'Sát thương phép' },
        { name: 'P-DEF', code: 'p_def', icon: '🛡️', color: '#54a0ff', description: 'Giảm sát thương vật lý' },
        { name: 'M-DEF', code: 'm_def', icon: '✨', color: '#00d2d3', description: 'Kháng sát thương phép' },
        { name: 'SPD', code: 'spd', icon: '⚡', color: '#f1c40f', description: 'Tốc độ ra đòn' },
      ];
      for (const s of statDefaults) await addDoc(collection(db, 'stats'), s);

      // 2. Currencies
      await addDoc(collection(db, 'currencies'), { name: 'Vàng', icon: '💰', type: 'basic', color: '#f1c40f', description: 'Tiền tệ cơ bản' });
      await addDoc(collection(db, 'currencies'), { name: 'Kim Cương', icon: '💎', type: 'premium', color: '#3498db', description: 'Tiền tệ cao cấp' });
      
      // 3. Tribes & Roles
      const tDoc = await addDoc(collection(db, 'tribes'), { 
        name: 'Tộc Mèo Trắng', icon: '🐱', trait: 'Tăng 10% Né tránh', milestones: '2/4/6', 
        description: 'Nhanh nhẹn và thông minh', color: '#ff9f43', counterId: '', rarity: 'rare', buffTarget: 'self' 
      });
      const rDoc = await addDoc(collection(db, 'roles'), { 
        name: 'Kiếm Sĩ', icon: '⚔️', priorityStat: 'P-ATK', description: 'Cận chiến mạnh mẽ' 
      });
      
      // 4. Hero
      await addDoc(collection(db, 'heroes'), {
        name: 'Mèo Hiệp Sĩ',
        elementId: tDoc.id,
        roleId: rDoc.id,
        elementName: 'Tộc Mèo Trắng',
        roleName: 'Kiếm Sĩ',
        hp: 500, pAtk: 100, mAtk: 20, pDef: 50, mDef: 40, speed: 110,
        description: 'Kẻ Gác Cổng Vương Quốc',
        combo: 'Chém Ngang + Cào Loạn Xạ',
        color: '#ff9f43',
        skills: {
          basic: { name: 'Cào Thường', power: 100 },
          passive: { name: 'Bản Năng Mèo', description: 'Tăng 10% né tránh' },
          active: { name: 'Tuyệt Kỹ Mèo Béo', power: 350, cd: 3 }
        }
      });

      alert("🎉 Khởi tạo dữ liệu mẫu thành công!");
    } catch (err) {
      alert("Lỗi khi khởi tạo: " + err);
    }
  };

  return (
    <div className="view-dashboard animate-in">
      <header className="content-header">
        <div>
          <h2>Vương Quốc Thống Kê 🏰</h2>
          <p>Dữ liệu tổng hợp Card Battle Game</p>
        </div>
        <button onClick={handleSeedData} className="btn-cute" style={{background: 'var(--p-blue)'}}>
          🚀 Khởi Tạo Dữ Liệu Mẫu
        </button>
      </header>
      <div className="stats-grid-dashboard">
        <div className="manga-card stat-card-db" style={{background: 'var(--p-blue)', color: 'white'}}>
          <div className="stat-icon-db" style={{boxShadow: 'none'}}>👥</div>
          <div className="stat-info-db"><p style={{color: '#fff'}}>Người Chơi</p><h3 style={{color: '#fff'}}>{players.length}</h3></div>
        </div>
        <div className="manga-card stat-card-db">
          <div className="stat-icon-db">🐱</div>
          <div className="stat-info-db"><p>Anh Hùng</p><h3>{heroes.length}</h3></div>
        </div>
        <div className="manga-card stat-card-db">
          <div className="stat-icon-db">🧪</div>
          <div className="stat-info-db"><p>Vật Phẩm</p><h3>{materials.length}</h3></div>
        </div>
        <div className="manga-card stat-card-db">
          <div className="stat-icon-db">💰</div>
          <div className="stat-info-db"><p>Tiền Tệ</p><h3>{currencies.length}</h3></div>
        </div>
        <div className="manga-card stat-card-db">
          <div className="stat-icon-db">📊</div>
          <div className="stat-info-db"><p>Chỉ Số</p><h3>{stats.length}</h3></div>
        </div>
        <div className="manga-card stat-card-db">
          <div className="stat-icon-db">🛡️</div>
          <div className="stat-info-db"><p>Trang Bị</p><h3>{items.length}</h3></div>
        </div>
        <div className="manga-card stat-card-db">
          <div className="stat-icon-db">🗡️</div>
          <div className="stat-info-db"><p>Thần Binh</p><h3>{artifacts.length}</h3></div>
        </div>
        <div className="manga-card stat-card-db">
          <div className="stat-icon-db">🐲</div>
          <div className="stat-info-db"><p>Thần Thú</p><h3>{beasts.length}</h3></div>
        </div>
        <div className="manga-card stat-card-db">
          <div className="stat-icon-db">🧬</div>
          <div className="stat-info-db"><p>Hệ Tộc</p><h3>{tribes.length}</h3></div>
        </div>
        <div className="manga-card stat-card-db">
          <div className="stat-icon-db">🎭</div>
          <div className="stat-info-db"><p>Vai Trò</p><h3>{roles.length}</h3></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
