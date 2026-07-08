document.addEventListener("DOMContentLoaded", () => {
    
    const state = {
        studentName: "",
        currentTheme: "galaxy",
        isMusicPlaying: false,
        musicVolume: 0.5,
        visualEffectsEnabled: true
    };

    const screens = {
        loading: document.getElementById("loading-screen"),
        welcome: document.getElementById("welcome-screen"),
        theme: document.getElementById("theme-screen"),
        menu: document.getElementById("menu-screen"),
        mathSubmenu: document.getElementById("math-submenu-screen")
    };

    const bgMusic = document.getElementById("bg-music");
    const bgContainer = document.getElementById("bg-effects-container");
    let backgroundIntervals = [];

    // INISIALISASI
    initNavigation();
    initThemeSelector();
    renderUniversalAvatar(); // Avatar yang sama untuk semua tema

    // Loading Screen
    setTimeout(() => {
        switchScreen("welcome");
        if (bgMusic) bgMusic.volume = state.musicVolume;
    }, 3000);

    /* ==========================================================================
       NAVIGATION & MODALS
       ========================================================================== */
    function switchScreen(targetKey) {
        Object.values(screens).forEach(screen => {
            if (screen) screen.classList.remove("active");
        });
        if (screens[targetKey]) {
            screens[targetKey].classList.add("active");
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    function initNavigation() {
        document.getElementById("btn-start").addEventListener("click", () => {
            const nameValue = document.getElementById("student-name").value.trim();
            if (nameValue === "") return alert("Silakan isi namamu terlebih dahulu!");
            
            state.studentName = nameValue;
            document.getElementById("display-student-name").textContent = state.studentName;
            
            if (!state.isMusicPlaying && bgMusic) {
                bgMusic.play().then(() => state.isMusicPlaying = true).catch(()=>{});
            }
            switchScreen("theme");
            startNarration();
        });

        document.getElementById("btn-continue-narration").addEventListener("click", () => switchScreen("menu"));
        document.getElementById("subject-math").addEventListener("click", () => switchScreen("mathSubmenu"));
        
        document.getElementById("subject-indo").addEventListener("click", () => alert("Fitur Bahasa Indonesia sedang disiapkan!"));

        document.getElementById("btn-back-to-welcome").addEventListener("click", () => switchScreen("welcome"));
        document.getElementById("btn-back-to-narration").addEventListener("click", () => switchScreen("theme"));
        document.getElementById("btn-back-to-menu").addEventListener("click", () => switchScreen("menu"));
    }

    function startNarration() {
        const text = `Halo, ${state.studentName}! Selamat datang di dimensi petualangan Mugeb Primary School. Pilih tema belajarmu, dan mari kita mulai mengasah kemampuan TKA-mu bersama-sama!`;
        const box = document.getElementById("narration-text");
        box.textContent = "";
        let i = 0;
        
        if (window.typeTimer) clearInterval(window.typeTimer);
        window.typeTimer = setInterval(() => {
            if (i < text.length) {
                box.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(window.typeTimer);
            }
        }, 25);
    }

    /* ==========================================================================
       AVATAR & THEME ENGINE
       ========================================================================== */
    // Satu avatar universal, desain modern dan cerdas sesuai link referensimu.
    function renderUniversalAvatar() {
        const container = document.getElementById("dynamic-avatar");
        if (!container) return;
        container.innerHTML = `
            <svg viewBox="0 0 200 200" width="100%" height="100%">
                <circle cx="100" cy="100" r="90" fill="var(--accent-color)" opacity="0.15"/>
                <circle cx="100" cy="100" r="75" fill="#fde047" />
                <path d="M 60 90 Q 80 60 100 90 T 140 90" fill="none" stroke="#ca8a04" stroke-width="6" stroke-linecap="round"/>
                <circle cx="75" cy="100" r="9" fill="#422006" />
                <circle cx="125" cy="100" r="9" fill="#422006" />
                <path d="M 85 130 Q 100 150 115 130" fill="none" stroke="#422006" stroke-width="7" stroke-linecap="round" />
                <path d="M 50 180 C 50 140 150 140 150 180" fill="#0284c7" />
            </svg>
        `;
    }

    function initThemeSelector() {
        const buttons = document.querySelectorAll(".btn-theme-select");
        buttons.forEach(btn => {
            btn.addEventListener("click", (e) => {
                buttons.forEach(b => b.classList.remove("active"));
                e.target.classList.add("active");
                
                const theme = e.target.getAttribute("data-theme");
                state.currentTheme = theme;
                document.body.className = `theme-${theme}`;
                
                const desc = document.getElementById("theme-description");
                if (theme === "galaxy") desc.textContent = "Menjelajahi luasnya galaksi logika dan penalaran matematika Mugeb.";
                if (theme === "langit") desc.textContent = "Belajar dengan tenang di bawah langit sunrise berhias daun mapel yang gugur.";
                if (theme === "ocean") desc.textContent = "Menyelami samudra ilmu bersama kawanan ikan di kedalaman laut biru.";

                generateParticles(theme);
            });
        });
        generateParticles("galaxy");
    }

    function clearParticles() {
        backgroundIntervals.forEach(clearInterval);
        backgroundIntervals = [];
        bgContainer.innerHTML = "";
    }

    /* ==========================================================================
       PARTICLE ENGINE (BINTANG SMOOTH, MAPEL SUNRISE, IKAN GELOMBANG SINUS)
       ========================================================================== */
    function generateParticles(theme) {
        clearParticles();
        if (!state.visualEffectsEnabled) return;

        if (theme === "galaxy") {
            // Bintang smooth bergerak acak
            for (let i = 0; i < 60; i++) {
                const star = document.createElement("div");
                star.className = "star-smooth";
                star.style.width = star.style.height = `${Math.random() * 3 + 1}px`;
                star.style.left = `${Math.random() * 100}vw`;
                star.style.top = `${Math.random() * 100}vh`;
                star.style.setProperty('--dur', `${Math.random() * 3 + 2}s`);
                star.style.setProperty('--drift', `${Math.random() * 20 + 10}s`);
                star.style.setProperty('--mx', `${(Math.random() - 0.5) * 100}px`);
                star.style.setProperty('--my', `${(Math.random() - 0.5) * 100}px`);
                bgContainer.appendChild(star);
            }
        } 
        else if (theme === "langit") {
            // Daun Mapel Berguguran (Sunrise)
            const spawnMaple = () => {
                const leaf = document.createElement("div");
                leaf.className = "maple-leaf";
                leaf.innerText = "🍁";
                leaf.style.setProperty('--size', `${Math.random() * 15 + 15}px`);
                leaf.style.left = `${Math.random() * 100}vw`;
                leaf.style.setProperty('--speed', `${Math.random() * 5 + 7}s`);
                leaf.style.setProperty('--sway', `${(Math.random() - 0.5) * 200}px`);
                bgContainer.appendChild(leaf);
                setTimeout(() => leaf.remove(), 12000);
            };
            for (let i = 0; i < 15; i++) setTimeout(spawnMaple, Math.random() * 5000);
            backgroundIntervals.push(setInterval(spawnMaple, 800));
        } 
        else if (theme === "ocean") {
            // Gelembung banyak
            for (let i = 0; i < 40; i++) {
                const bubble = document.createElement("div");
                bubble.className = "ocean-bubble";
                const size = Math.random() * 10 + 4;
                bubble.style.width = bubble.style.height = `${size}px`;
                bubble.style.left = `${Math.random() * 100}vw`;
                bubble.style.setProperty('--speed', `${Math.random() * 6 + 4}s`);
                bubble.style.animationDelay = `-${Math.random() * 5}s`;
                bgContainer.appendChild(bubble);
            }

            // Ikan Biru Gelap Bergelombang Sinus (Kanan ke Kiri)
            const spawnFish = () => {
                const fish = document.createElement("div");
                fish.className = "dark-fish";
                const safeFishes = ["🐟", "🐠"]; // Hanya ikan normal
                fish.innerText = safeFishes[Math.floor(Math.random() * safeFishes.length)];
                fish.style.setProperty('--size', `${Math.random() * 15 + 20}px`);
                
                let startY = Math.random() * 80 + 10; 
                let posX = -10; // Start dari luar layar kanan (kita pakai koordinat right)
                let waveHeight = Math.random() * 30 + 10;
                let waveSpeed = Math.random() * 0.05 + 0.03;
                let speedX = Math.random() * 0.15 + 0.1; // Kecepatan maju
                let time = 0;

                fish.style.right = posX + "%";
                fish.style.top = startY + "vh";

                const swimInterval = setInterval(() => {
                    time += waveSpeed;
                    posX += speedX;
                    fish.style.right = posX + "%";
                    // Gerak ombak menggunakan fungsi Sinus Murni
                    fish.style.transform = `translateY(${Math.sin(time) * waveHeight}px)`;

                    if (posX > 110) {
                        clearInterval(swimInterval);
                        fish.remove();
                    }
                }, 16);
                bgContainer.appendChild(fish);
            };
            
            spawnFish(); spawnFish();
            backgroundIntervals.push(setInterval(spawnFish, 3000));
        }
    }
});
