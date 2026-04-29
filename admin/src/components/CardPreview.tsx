import React from 'react';
import './CardPreview.css';

const CardPreview: React.FC = () => {
  const tiers = [
    { level: 1, name: 'Thường', color: 'Trắng', stars: 1, class: 'cp-tier-1' },
    { level: 20, name: 'Cơ Bản', color: 'Lục', stars: 2, class: 'cp-tier-2' },
    { level: 60, name: 'Hiếm', color: 'Lam', stars: 3, class: 'cp-tier-3' },
    { level: 100, name: 'Sử Thi', color: 'Tím', stars: 4, class: 'cp-tier-4' },
    { level: 160, name: 'Huyền Thoại', color: 'Cam', stars: 5, class: 'cp-tier-5' },
    { level: 240, name: 'Thần Thoại', color: 'Đỏ', stars: 5, class: 'cp-tier-6' },
  ];

  return (
    <div className="card-preview-page">
      <div className="content-header">
        <h2 style={{margin: 0, fontFamily: 'var(--font-heading)', color: 'var(--p-orange)'}}>🖼️ Bộ khung hiện có</h2>
      </div>

      <div className="cp-grid-container">
        {tiers.map((tier, index) => (
          <div className="cp-hero-card-wrapper" key={index}>
            <div className={`cp-avatar-container ${tier.class}`}>
              <div className="cp-portrait-mask">
                {tier.name}<br/>({tier.color})
                <div className="cp-shadow-overlay"></div>
              </div>
              <div className="cp-faction-icon">☀️</div>
              <div className="cp-level-text">Lvl {tier.level}{tier.level === 240 ? '+' : ''}</div>
              <div className="cp-stars-container">
                {Array.from({ length: tier.stars }).map((_, i) => (
                  <span className="cp-star" key={i}>★</span>
                ))}
              </div>
            </div>
            
            <div className="cp-bars-container">
              <div className="cp-hp-bar"></div>
              <div className="cp-mana-bar">
                <div className="cp-mana-segment"></div><div className="cp-mana-segment"></div>
                <div className="cp-mana-segment"></div><div className="cp-mana-segment"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardPreview;
