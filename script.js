/**
 * Mugeb TKA Learning Center
 * SPA Logic & Canvas Animation
 */

// State App
let appState = {
    studentName: "",
    theme: "theme-galaksi", // Default
    particlesEnabled: true,
    currentPage: "landing" // landing, dashboard, mat-sub
};

// DOM Elements
const body = document.body;
const inputName = document.getElementById("student-name");
const btnStart = document.getElementById("btn-start");
const btnBack = document.getElementById("btn-back");
const themeCards = document.querySelectorAll(".theme-card");

const pageLanding = document.getElementById("page-landing");
const pageDashboard = document.getElementById("page-dashboard");

const dynamicNarrative = document.getElementById("dynamic-narrative");
const mainSubjects = document.getElementById("main-subjects");
const subMatematika = document.getElementById("sub-matematika");

const cardMatematika = document.getElementById("card-matematika");
const actionComingSoon = document.querySelectorAll(".action-coming-soon, #card-bahasa");

// Modals
const alertModal = document.getElementById("alert-modal");
const alertTitle = document.getElementById("alert-title");
const alertMessage = document.getElementById("alert-message");
const btnCloseAlert = document.getElementById("btn-close-alert");

const settingsModal = document.getElementById("settings-modal");
const btnSettings = document.getElementById("btn-settings");
const btnSaveSettings = document.getElementById("btn-save-settings");
const toggleParticles = document.getElementById("toggle-particles");

// Narasi Data
const narratives = {
    "theme-galaksi": "Halo, {nama}. Selamat datang di pusat pelatihan TKA Mugeb. Aku akan menjadi teman perjalananmu menjelajahi galaksi ilmu. Kita akan berlatih sedikit demi sedikit hingga kamu semakin percaya diri menghadapi TKA. Siap memulai misi hari ini?",
    "theme-langit": "Halo, {nama}. Selamat datang. Seperti matahari yang perlahan terbit, kemampuanmu juga akan berkembang sedikit demi sedikit. Mari belajar bersama dengan semangat dan hati yang gembira.",
    "theme-samudra": "Halo, {nama}. Selamat datang di dunia bawah laut pengetahuan. Mari menyelam bersama untuk menemukan berbagai kemampuan baru dalam menghadapi TKA."
};

// --- INIT APP ---
function init() {
    setupEventListeners();
    setupRippleEffect();
    initCanvas();
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
    // Theme Selection
    themeCards.forEach(card => {
        card.addEventListener("click", () => {
            // Remove active from all
            themeCards.forEach(c => c.classList.remove("active"));
            // Add active to clicked
            card.classList.add("active");
            
            // Apply Theme
            const newTheme = card.getAttribute("data-theme");
            appState.theme = newTheme;
            body.className = newTheme;
            
            // Reset particles for new theme
            initParticles();
        });
    });

    // Start Button
    btnStart.addEventListener("click", () => {
        const nameVal = inputName.value.trim();
        if (nameVal === "") {
            showAlert("Perhatian", "Silakan masukkan nama terlebih dahulu.");
            return;
        }
        appState.studentName = nameVal;
        
        // Set narrative
        let text = narratives[appState.theme].replace("{nama}", `<strong>${appState.studentName}</strong>`);
        dynamicNarrative.innerHTML = text;
        
        // Navigate
        switchPage("dashboard");
    });

    // Back Button
    btnBack.addEventListener("click", () => {
        if (appState.currentPage === "mat-sub") {
            // Back to main dashboard subjects
            subMatematika.classList.add("hidden");
            mainSubjects.classList.remove("hidden");
            appState.currentPage = "dashboard";
        } else if (appState.currentPage === "dashboard") {
            // Back to landing
            switchPage("landing");
        }
    });

    // Matematika Click -> Show Submenu
    cardMatematika.addEventListener("click", () => {
        mainSubjects.classList.add("hidden");
        subMatematika.classList.remove("hidden");
        appState.currentPage = "mat-sub";
    });

    // Coming Soon Clicks
    actionComingSoon.forEach(card => {
        card.addEventListener("click", () => {
            showAlert("Segera Hadir", "Fitur ini sedang dikembangkan.<br>Nantikan pembaruan berikutnya dari Mugeb Primary School.");
        });
    });

    // Modals
    btnCloseAlert.addEventListener("click", () => alertModal.classList.add("hidden"));
    
    btnSettings.addEventListener("click", () => settingsModal.classList.remove("hidden"));
    btnSaveSettings.addEventListener("click", () => {
        appState.particlesEnabled = toggleParticles.checked;
        if (!appState.particlesEnabled) {
            particlesArray = []; // Clear particles
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        } else {
            initParticles();
        }
        settingsModal.classList.add("hidden");
    });
}

// --- NAVIGATION LOGIC ---
function switchPage(pageId) {
    if (pageId === "dashboard") {
        pageLanding.classList.add("hidden");
        setTimeout(() => {
            pageDashboard.classList.remove("hidden");
            btnBack.classList.remove("hidden");
            appState.currentPage = "dashboard";
            // Reset state
            mainSubjects.classList.remove("hidden");
            subMatematika.classList.add("hidden");
        }, 500); // Wait for fade out
    } else if (pageId === "landing") {
        pageDashboard.classList.add("hidden");
        btnBack.classList.add("hidden");
        setTimeout(() => {
            pageLanding.classList.remove("hidden");
            appState.currentPage = "landing";
        }, 500);
    }
}

function showAlert(title, message) {
    alertTitle.innerHTML = title;
    alertMessage.innerHTML = message;
    alertModal.classList.remove("hidden");
}

// --- RIPPLE EFFECT ---
function setupRippleEffect() {
    const buttons = document.querySelectorAll('.ripple');
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;
            
            const ripples = document.createElement('span');
            ripples.style.left = x + 'px';
            ripples.style.top = y + 'px';
            ripples.classList.add('ripple-span');
            this.appendChild(ripples);
            
            setTimeout(() => { ripples.remove(); }, 600);
        });
    });
}

// --- CANVAS PARTICLE SYSTEM ---
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");
let particlesArray = [];

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.theme = appState.theme;

        if (this.theme === "theme-galaksi") {
            this.size = Math.random() * 2 + 0.5; // Stars
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.8 + 0.2;
            this.isMeteor = Math.random() > 0.98; // 2% chance for meteor
            if (this.isMeteor) {
                this.size = Math.random() * 2 + 1;
                this.speedX = 5 + Math.random() * 5;
                this.speedY = 5 + Math.random() * 5;
                this.x = Math.random() * canvas.width - canvas.width/2;
                this.y = Math.random() * -100;
            }
        } 
        else if (this.theme === "theme-langit") {
            this.size = Math.random() * 4 + 2; // Leaves / Light dust
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 + 0.5; // Falling down
            this.opacity = Math.random() * 0.5 + 0.1;
        } 
        else if (this.theme === "theme-samudra") {
            this.size = Math.random() * 5 + 1; // Bubbles
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * -1.5 - 0.5; // Moving up
            this.opacity = Math.random() * 0.4 + 0.1;
        }
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Reset if out of bounds based on direction
        if (this.theme === "theme-galaksi" && this.isMeteor) {
            if (this.x > canvas.width || this.y > canvas.height) this.reset();
        } 
        else if (this.theme === "theme-langit") {
            if (this.y > canvas.height) { this.y = 0; this.x = Math.random() * canvas.width; }
        } 
        else if (this.theme === "theme-samudra") {
            if (this.y < 0) { this.y = canvas.height; this.x = Math.random() * canvas.width; }
        } 
        else {
            // Normal stars loop around subtly
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
    }

    draw() {
        ctx.beginPath();
        if (this.theme === "theme-galaksi") {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            if (this.isMeteor) {
                // Draw line for meteor
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x - this.speedX * 5, this.y - this.speedY * 5);
                ctx.strokeStyle = `rgba(102, 252, 241, ${this.opacity})`;
                ctx.lineWidth = this.size;
                ctx.stroke();
                return;
            }
        } else if (this.theme === "theme-langit") {
            // Warm tones for sunrise
            ctx.fillStyle = `rgba(255, 126, 95, ${this.opacity})`;
        } else if (this.theme === "theme-samudra") {
            // Bubble stroke
            ctx.strokeStyle = `rgba(0, 242, 254, ${this.opacity})`;
            ctx.lineWidth = 1;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.stroke();
            return; // Exit draw to not fill
        }
        
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particlesArray = [];
    if (!appState.particlesEnabled) return;
    
    let count = window.innerWidth < 768 ? 40 : 100; // Less particles on mobile
    for (let i = 0; i < count; i++) {
        particlesArray.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (appState.particlesEnabled) {
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
    }
    requestAnimationFrame(animateParticles);
}

// Start Program
init();
animateParticles();
