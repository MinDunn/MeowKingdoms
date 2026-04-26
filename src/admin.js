// Admin Logic for Meow Kingdoms
console.log("Meow Admin v2.0 - Manga Edition Started");

const dashboardContent = document.getElementById('dashboardContent');
const heroModal = document.getElementById('heroModal');
const addHeroBtn = document.getElementById('addHeroBtn');
const closeModal = document.getElementById('closeModal');
const heroForm = document.getElementById('heroForm');

// Mock Data for initial view
const mockHeroes = [
    { name: 'Mèo Hiệp Sĩ', element: 'fire', role: 'tank', hp: 1200, atk: 150, def: 80, color: '#ff9aa2' },
    { name: 'Mèo Phù Thủy', element: 'water', role: 'mage', hp: 800, atk: 280, def: 40, color: '#b5ead7' },
    { name: 'Mèo Ninja', element: 'wind', role: 'dps', hp: 950, atk: 220, def: 60, color: '#c7ceea' }
];

const renderHeroes = (heroes) => {
    dashboardContent.innerHTML = '';
    heroes.forEach((hero, index) => {
        const card = document.createElement('div');
        card.className = 'manga-card';
        card.innerHTML = `
            <div style="display: flex; gap: 15px; align-items: center;">
                <div style="width: 80px; height: 80px; background: ${hero.color}; border: 3px solid var(--manga-border); border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 2rem;">
                    🐱
                </div>
                <div>
                    <h3 style="margin: 0;">${hero.name}</h3>
                    <p style="font-size: 0.8rem; color: var(--text-muted);">Role: ${hero.role.toUpperCase()} | Element: ${hero.element}</p>
                </div>
            </div>
            <div style="margin-top: 15px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; text-align: center;">
                <div style="background: var(--p-peach); padding: 5px; border-radius: 8px; border: 1px solid var(--manga-border);">
                    <small>HP</small><br><strong>${hero.hp}</strong>
                </div>
                <div style="background: var(--p-yellow); padding: 5px; border-radius: 8px; border: 1px solid var(--manga-border);">
                    <small>ATK</small><br><strong>${hero.atk}</strong>
                </div>
                <div style="background: var(--p-blue); padding: 5px; border-radius: 8px; border: 1px solid var(--manga-border);">
                    <small>DEF</small><br><strong>${hero.def}</strong>
                </div>
            </div>
            <div style="margin-top: 15px; display: flex; justify-content: flex-end; gap: 10px;">
                <button class="btn-cute secondary" style="padding: 5px 15px; font-size: 0.8rem;">Sửa</button>
                <button class="btn-cute" style="padding: 5px 15px; font-size: 0.8rem; background: #ff4757;">Xóa</button>
            </div>
        `;
        dashboardContent.appendChild(card);
    });
};

// Initial Render
renderHeroes(mockHeroes);

// Event Listeners
addHeroBtn.addEventListener('click', () => {
    heroModal.style.display = 'flex';
});

closeModal.addEventListener('click', () => {
    heroModal.style.display = 'none';
});

heroForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newHero = {
        name: document.getElementById('heroName').value,
        element: document.getElementById('heroElement').value,
        role: document.getElementById('heroRole').value,
        hp: 1000,
        atk: 100,
        def: 50,
        color: '#ffdac1'
    };
    mockHeroes.push(newHero);
    renderHeroes(mockHeroes);
    heroModal.style.display = 'none';
    heroForm.reset();
});
