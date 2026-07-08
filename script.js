/* ==========================================================================
   VANILLA JAVASCRIPT ARCHITECTURE - MUGEB PRIMARY SCHOOL UPDATE 2026
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // STATE MANAGEMENT
    const state = {
        studentName: "",
        currentTheme: "galaxy",
        isMusicPlaying: false,
        musicVolume: 0.5,
        visualEffectsEnabled: true
    };

    // DOM ELEMENTS - SCREENS
    const screens = {
        loading: document.getElementById("loading-screen"),
        welcome: document.getElementById("welcome-screen"),
        theme: document.getElementById("theme-screen"),
        menu: document.getElementById("menu-screen"),
        mathSubmenu: document.getElementById("math-submenu-screen")
    };

    // DOM ELEMENTS - CONTROLS
    const inputName = document.getElementById("student-name");
    const btnStart = document.getElementById("btn-start");
    const btnContinueNarration = document.getElementById("btn-continue-narration");
    const subjectMath = document.getElementById("subject-math");
    const displayStudentName = document.getElementById("display-student-name");
    const loadingText = document.getElementById("loading-text");
    
    // AUDIO & SETTINGS ELEMENTS
    const bgMusic = document.getElementById("bg-music");
    const btnSettings = document.getElementById("btn-settings");
    const settingsModal = document.getElementById("settings-modal");
    const btnCloseSettings = document.getElementById("btn-close-settings");
    const btnToggleMusic = document.getElementById("btn-toggle-music");
    const volumeSlider = document.getElementById("volume-slider");
    const btnToggleEffects = document.getElementById("btn-toggle-effects");

    // NAVIGATION BACK BUTTONS
    const btnBackToWelcome = document.getElementById("btn-back-to-welcome");
    const btnBackToNarration = document.getElementById("btn-back-to-narration");
    const btnBackToMenu = document.getElementById("btn-back-to-menu");

    // BRAND PHRASES (Mugeb Primary School Theme)
    const loadingPhrases = [
        "Menghubungkan ke server Mugeb Primary School...",
        "Menyiapkan petualangan berakhlak mulia...",
        "Membangun koordinat ruang tema...",
        "Memuat energi berprestasi...",
        "Mugeb Primary School siap!"
    ];

    // INITIALIZATION RUNNER
    initLoadingEngine();
    initThemeSelector();
    initMusicControls();
    initNavigation();
    renderAvatar();

    /* ==========================================================================
       0. ENGINE SCREEN LOADING REVISI
       ========================================================================== */
    function initLoadingEngine() {
        let phraseIndex = 0;
        const phraseInterval = setInterval(() => {
            if (phraseIndex < loadingPhrases.length - 1) {
                loadingText.style.opacity = 0;
                setTimeout(() => {
                    loadingText.textContent = loadingPhrases[phraseIndex];
                    loadingText.style.opacity = 1;
                    phraseIndex++;
                }, 300);
            } else {
                clearInterval(phraseInterval);
            }
        }, 600);

        // Auto transition dari loading screen setelah animasi bar selesai (~2.8s)
        setTimeout(() => {
            switchScreen("welcome");
            // Set volume awal audio sesuai default state
            if (bgMusic) bgMusic.volume = state.musicVolume;
        }, 3200);
    }

    /* ==========================================================================
       1. CONTROLLER NAVIGASI SCREEN AUTOMATION (SPA)
       ========================================================================== */
    function switchScreen(targetKey) {
        Object.keys(screens).forEach(key => {
            if (screens[key]) {
                screens[key].classList.remove("active");
            }
        });
        if (screens[targetKey]) {
            screens[targetKey].classList.add("active");
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    function initNavigation() {
        // Tombol Mulai Petualangan
        btnStart.addEventListener("click", () => {
            const nameValue = inputName.value.trim();
            if (nameValue === "") {
                triggerCustomPopup("🎒 Halo!", "Masukkan nama lengkap kamu terlebih dahulu sebelum memulai petualangan di Mugeb Primary School!");
                return;
            }
            state.studentName = nameValue;
            displayStudentName.textContent = state.studentName;
            
            // Jalankan audio musik secara otomatis saat masuk halaman narasi
            if (!state.isMusicPlaying && bgMusic) {
                playAudioSystem();
            }
            
            switchScreen("theme");
            startNarrationTypewriter();
        });

        // Halaman Narasi -> Menu Utama
        btnContinueNarration.addEventListener("click", () => switchScreen("menu"));

        // Menu Utama -> Submenu Matematika
        subjectMath.addEventListener("click", () => switchScreen("mathSubmenu"));

        // Event-Event Tombol Kembali (Back Navigation Mapping)
        btnBackToWelcome.addEventListener("click", () => switchScreen("welcome"));
        btnBackToNarration.addEventListener("click", () => switchScreen("theme"));
        btnBackToMenu.addEventListener("click", () => switchScreen("menu"));

        // Tombol Kategori Soal Matematika (Placeholder Event Latihan)
        document.getElementById("btn-math-easy").addEventListener("click", () => {
            triggerCustomPopup("📐 Latihan Mandiri", `Selamat berlatih, ${state.studentName}! Fitur bank soal TKA Matematika sedang disiapkan.`);
        });
        document.getElementById("btn-math-exam").addEventListener("click", () => {
            triggerCustomPopup("⏱️ Simulasi TKA", "Ujian Simulasi Matematika berwaktu ketat akan segera dibuka. Siapkan alat tulismu!");
        });
    }

    /* ==========================================================================
       2. IMPLEMENTASI ENGINE TYPEWRITER & AVATAR NARRATION
       ========================================================================== */
    function startNarrationTypewriter() {
        const narrationBox = document.getElementById("narration-text");
        const fullText = `Halo Pejuang Hebat, ${state.studentName}! Selamat datang di gerbang ujian kemampuan akademik Mugeb Primary School. Di sini, semangat belajar, kejujuran, dan kegigihanmu akan diuji di dalam dimensi ${state.currentTheme.toUpperCase()} yang luar biasa. Jadilah siswa yang berakhlak mulia dan ukir prestasi tertinggi hari ini!`;
        
        narrationBox.textContent = "";
        let charIndex = 0;
        
        // Bersihkan interval pengetikan sebelumnya jika ada
        if (window.typewriterInterval) clearInterval(window.typewriterInterval);

        window.typewriterInterval = setInterval(() => {
            if (charIndex < fullText.length) {
                narrationBox.textContent += fullText.charAt(charIndex);
                charIndex++;
            } else {
                clearInterval(window.typewriterInterval);
            }
        }, 25);
    }

    function renderAvatar() {
        const container = document.getElementById("avatar-graphic");
        if (!container) return;
        
        // Render Maskot Edukatif Robot Mugeb Menggunakan Struktur SVG Clean Inline
        container.innerHTML = `
            <svg viewBox="0 0 200 200" width="100%" height="100%">
                <defs>
                    <linearGradient id="grad-head" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#06b6d4;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#4338ca;stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="grad-eye" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#a5f3fc;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <line x1="100" y1="50" x2="100" y2="25" stroke="#06b6d4" stroke-width="4" stroke-linecap="round"/>
                <circle cx="100" cy="20" r="8" fill="#8b5cf6"/>
                <rect x="50" y="50" width="100" height="90" rx="20" fill="url(#grad-head)" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
                <rect x="65" y="70" width="70" height="30" rx="10" fill="#0f172a"/>
                <circle cx="85" cy="85" r="7" fill="url(#grad-eye)"/>
                <circle cx="115" cy="85" r="7" fill="url(#grad-eye)"/>
                <path d="M 80 115 Q 100 125 120 115" stroke="#06b6d4" stroke-width="3" fill="none" stroke-linecap="round"/>
                <rect x="42" y="80" width="8" height="30" rx="3" fill="#8b5cf6"/>
                <rect x="150" y="80" width="8" height="30" rx="3" fill="#8b5cf6"/>
            </svg>
        `;
    }

    /* ==========================================================================
       3. INTERACTIVE THEME SWITCHER ENGINE & BACKGROUND PARTICLE
       ========================================================================== */
    function initThemeSelector() {
        const themeButtons = document.querySelectorAll(".btn-theme-select");
        themeButtons.forEach(button => {
            button.addEventListener("click", (e) => {
                themeButtons.forEach(btn => btn.classList.remove("active"));
                e.target.classList.add("active");
                
                const selectedTheme = e.target.getAttribute("data-theme");
                state.currentTheme = selectedTheme;
                
                // Ubah class body untuk memicu transisi warna CSS variabel global
                document.body.className = `theme-${selectedTheme}`;
                
                // Perbarui deskripsi info petualangan di halaman narasi secara real-time
                updateThemeDescription(selectedTheme);
                
                // Re-render engine latar belakang efek partikel 3D bawaan jika aktif
                if (state.visualEffectsEnabled) {
                    generateBackgroundEnvironment(selectedTheme);
                }
            });
        });
        
        // Pemicu awal render partikel latar belakang bawaan
        generateBackgroundEnvironment(state.currentTheme);
    }

    function updateThemeDescription(theme) {
        const descBox = document.getElementById("theme-description");
        if (theme === "galaxy") {
            descBox.textContent = "Dimensi Ruang Antariksa: Selesaikan tantangan logika matematika di bawah naungan gugusan bintang galaksi dan orbit planet Mugeb.";
        } else if (theme === "autumn") {
            descBox.textContent = "Dimensi Langit Sakura: Suasana belajar yang bersih, teduh, damai, dan penuh konsentrasi tinggi ditemani guguran kelopak bunga sakura yang lembut.";
        } else if (theme === "ocean") {
            descBox.textContent = "Dimensi Lautan Samudra: Rasakan ketenangan air laut dalam yang berwibawa, membantumu tetap rileks menjawab butir soal tersulit.";
        }
    }

    function generateBackgroundEnvironment(theme) {
        const container = document.getElementById("bg-effects-container");
        if (!container) return;
        container.innerHTML = ""; // Bersihkan objek partikel lama
        
        let particleCount = 25;
        let className = "star";
        
        if (theme === "autumn") { className = "leaf"; particleCount = 15; }
        if (theme === "ocean") { className = "bubble"; particleCount = 35; }
        
        for (let i = 0; i < particleCount; i++) {
            const element = document.createElement("div");
            element.className = className;
            element.style.left = Math.random() * 100 + "vw";
            element.style.top = Math.random() * 100 + "vh";
            element.style.opacity = Math.random() * 0.6 + 0.2;
            
            // Skala ukuran acak proporsional
            const scale = Math.random() * 0.8 + 0.4;
            element.style.transform = `scale(${scale})`;
            
            // Set penanda visual dasar CSS shapes sesuai jenis partikel
            if (className === "star") {
                element.style.width = "3px";
                element.style.height = "3px";
                element.style.backgroundColor = "#ffffff";
                element.style.borderRadius = "50%";
                element.style.boxShadow = "0 0 8px #ffffff";
            } else if (className === "leaf") {
                element.style.width = "12px";
                element.style.height = "8px";
                element.style.backgroundColor = "#ffd166";
                element.style.borderRadius = "0 10px 0 10px";
            } else if (className === "bubble") {
                element.style.width = "8px";
                element.style.height = "8px";
                element.style.border = "1px solid rgba(255,255,255,0.4)";
                element.style.borderRadius = "50%;";
            }
            
            container.appendChild(element);
        }
    }

    /* ==========================================================================
       4. AUDIO CONTROLLER & MODAL MANAGEMENT ENGINE
       ========================================================================== */
    function initMusicControls() {
        // Toggle Buka/Tutup Modal Pengaturan
        btnSettings.addEventListener("click", () => settingsModal.classList.add("active"));
        btnCloseSettings.addEventListener("click", () => settingsModal.classList.remove("active"));
        
        // Klik di luar area konten modal untuk menutup otomatis
        settingsModal.addEventListener("click", (e) => {
            if (e.target === settingsModal) settingsModal.classList.remove("remove");
        });

        // Kontrol Tombol Saklar ON/OFF Musik Latar
        btnToggleMusic.addEventListener("click", () => {
            if (state.isMusicPlaying) {
                pauseAudioSystem();
            } else {
                playAudioSystem();
            }
        });

        // Kontrol Slider Intensitas Volume
        volumeSlider.addEventListener("input", (e) => {
            state.musicVolume = e.target.value;
            if (bgMusic) {
                bgMusic.volume = state.musicVolume;
            }
        });

        // Saklar ON/OFF Efek Visual Latar Belakang
        btnToggleEffects.addEventListener("click", () => {
            state.visualEffectsEnabled = !state.visualEffectsEnabled;
            btnToggleEffects.textContent = state.visualEffectsEnabled ? "ON" : "OFF";
            btnToggleEffects.classList.toggle("active", state.visualEffectsEnabled);
            
            const container = document.getElementById("bg-effects-container");
            if (container) {
                container.style.display = state.visualEffectsEnabled ? "block" : "none";
                if (state.visualEffectsEnabled) generateBackgroundEnvironment(state.currentTheme);
            }
        });
    }

    function playAudioSystem() {
        if (!bgMusic) return;
        bgMusic.play().then(() => {
            state.isMusicPlaying = true;
            btnToggleMusic.textContent = "ON";
            btnToggleMusic.classList.add("active");
        }).catch(err => console.log("Menunggu interaksi user klik pertama untuk memutar musik: ", err));
    }

    function pauseAudioSystem() {
        if (!bgMusic) return;
        bgMusic.pause();
        state.isMusicPlaying = false;
        btnToggleMusic.textContent = "OFF";
        btnToggleMusic.classList.remove("active");
    }

    /* ==========================================================================
       5. UTILITY POPUP ALERTS GENERATOR SYSTEM
       ========================================================================== */
    function triggerCustomPopup(title, message, icon = "🚀") {
        const alertModal = document.getElementById("popup-alert");
        const iconBox = document.getElementById("popup-icon");
        const messageBox = document.getElementById("popup-message");
        const closeBtn = document.getElementById("btn-close-popup");

        iconBox.textContent = icon;
        messageBox.innerHTML = `<strong>${title}</strong><br><br>${message}`;
        alertModal.classList.add("active");

        const closeAction = () => {
            alertModal.classList.remove("active");
            closeBtn.removeEventListener("click", closeAction);
        };
        closeBtn.addEventListener("click", closeAction);
    }
});
