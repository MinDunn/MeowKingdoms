import { GameRenderer } from './renderer.js';

// --- FIREBASE PURE CODE SETUP ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBLnH9lRxiX1af-o8RK8Xt3pOiTlBlTcV0",
    authDomain: "meowkingdoms.firebaseapp.com",
    projectId: "meowkingdoms",
    storageBucket: "meowkingdoms.firebasestorage.app",
    messagingSenderId: "634429861674",
    appId: "1:634429861674:web:c020c94856694212d87853"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

class GameClient {
    constructor() {
        this.canvas = document.getElementById('bg-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.renderer = new GameRenderer(this.canvas, this.ctx);

        this.mouseX = 0;
        this.mouseY = 0;
        this.squad = [];

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        // LIVE SYNC WITH ADMIN DATABASE
        onSnapshot(collection(db, 'heroes'), (snapshot) => {
            this.squad = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                // Default styles if not provided by admin
                colors: doc.data().colors || { primary: '#ff9f43', secondary: '#2d3436' }
            }));
            console.log(`Updated squad: ${this.squad.length} heroes loaded.`);
        });

        // Start Game Loop
        this.render();
        console.log("Meow Kingdoms Lobby - System Online");
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    render() {
        this.renderer.clear();

        // Use live squad data (Limit to first 6 heroes for display)
        const displaySquad = this.squad.slice(0, 6);

        if (displaySquad.length > 0) {
            const spacing = Math.min(220, this.canvas.width / (displaySquad.length + 1));
            const startX = (this.canvas.width - (displaySquad.length - 1) * spacing) / 2;
            const centerY = this.canvas.height / 2 + 220;

            displaySquad.forEach((hero, index) => {
                const x = startX + index * spacing;
                this.renderer.drawHero(hero, x, centerY, this.mouseX, this.mouseY);
            });
        }

        requestAnimationFrame(() => this.render());
    }
}

// Start the client
new GameClient();
