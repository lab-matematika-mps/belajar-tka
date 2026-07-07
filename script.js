/**
 * HW Les Private - Petualangan TKA Engine Prosedural
 * Tanpa Framework - Teroptimasi untuk Browser Modern & GitHub Pages
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================================================
    // STATE DATA & LOCALSTORAGE PREFERENCES
    // ==========================================================================
    let state = {
        name: localStorage.getItem("hw_student_name") || "",
        currentTheme: localStorage.getItem("hw_theme") || "neon",
        settings: JSON.parse(localStorage.getItem("hw_settings")) || {
            music: false,
            volume: 0.5,
            particles: true,
            animations: true
        },
        screenHistory: ["screen-welcome"],
        currentScreen: "screen-welcome",
        level: 1,
        xp: 10
    };

    // Dialogue Database Mapping per Theme
    const dialogueData = {
        neon: {
            character: "Navigator Galaksi",
            avatar: "🧑‍✈️",
            script: [
                "Halo [NAMA]...",
                "Aku adalah Navigator Galaksi.",
                "Kami telah menerima sinyal kosmismu bahwa kamu akan menghadapi Tes Kemampuan Akademik.",
                "Jangan khawatir sama sekali!",
                "Aku dan tim hebat dari HW Les Private akan menemanimu melintasi rintangan ini.",
                "Kita akan membedah soal sedikit demi sedikit bagaikan memetakan rasi bintang.",
                "Setiap modul latihan akan membuat kapasitas energimu semakin kuat.",
                "Siap menjelajah ruang tinggi bintang ilmu?"
            ]
        },
        anime: {
            character: "Sensei Sakura",
            avatar: "🧓",
            script: [
                "Konichiwa, [NAMA]-kun! ✨",
                "Selamat datang di Dojo Akademi Sakura HW.",
                "Ujian Akademik TKA di depan mata seperti badai angin, namun ketahuilah hatimu harus tetap tenang.",
                "Guguran bunga sakura ini saksi perjuangan belajarmu dimulai hari ini.",
                "Bersama bimbingan tim HW Les Private, tidak ada dinding penghalang yang tak bisa dihancurkan.",
                "Ayo tarik nafas dalam-dalam, asah fokus jiwamu.",
                "Mari kita mulai melatih jurus-jurus ilmu pengetahuan sekarang!"
            ]
        },
        ocean: {
            character: "Penjaga Laut Pengetahuan",
            avatar: "🧜‍♂️",
            script: [
                "Selamat datang penyelam tangguh, [NAMA]...",
                "Aku adalah Penjaga Lautan Terdalam Ilmu Pengetahuan.",
                "Di bawah samudra luas ini, tersimpan ribuan mutiara kebijaksanaan TKA.",
                "Tantangan akademis mungkin terasa bertekanan tinggi seperti palung laut dalam.",
                "Namun dengan jangkar dari HW Les Private, kamu akan menyelam dengan aman dan perkasa.",
                "Setiap gelombang soal yang kamu pecahkan akan mengantarkanmu pada mutiara impian.",
                "Mari pasang tabung oksigen semangatmu, dan mulailah menyelam!"
            ]
        }
    };

    let dialogueIndex = 0;
    let typingTimeout;

    // ==========================================================================
    // AUDIO ENGINE (Web Audio API Synthesizer - No external file needed)
    // ==========================================================================
    let audioCtx = null;
    let bgOscillator = null;
    let bgGainNode = null;

    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    function playClickSound() {
        if (!state.settings.animations) return; // Silent if animations disabled globally
        try {
            initAudio();
            let osc = audioCtx.createOscillator();
            let gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
            
            osc.start();
            osc.stop(audioCtx.currentTime + 0.1);
        } catch(e) { console.log("Audio not allowed yet"); }
    }

    function startThemeMusic() {
        if (!state.settings.music) { stopThemeMusic(); return; }
        try {
            initAudio();
            if (bgOscillator) stopThemeMusic();

            bgOscillator = audioCtx.createOscillator();
            bgGainNode = audioCtx.createGain();
            bgOscillator.connect(bgGainNode);
            bgGainNode.connect(audioCtx.destination);

            bgGainNode.gain.setValueAtTime(state.settings.volume * 0.15, audioCtx.currentTime);

            // Synthesize ambient vibes matching themes
            if (state.currentTheme === 'neon') {
                bgOscillator.type = 'sawtooth';
                bgOscillator.frequency.setValueAtTime(65.41, audioCtx.currentTime); // C2 Low Drone synthwave
            } else if (state.currentTheme === 'anime') {
                bgOscillator.type = 'triangle';
                bgOscillator.frequency.setValueAtTime(130.81, audioCtx.currentTime); // C3 Smooth
            } else {
                bgOscillator.type = 'sine';
                bgOscillator.frequency.setValueAtTime(55.00, audioCtx.currentTime); // A1 Deep ocean sub
            }
            bgOscillator.start();
        } catch (e) { console.log(e); }
    }

    function stopThemeMusic() {
        if (bgOscillator) {
            try {
                bgOscillator.stop();
                bgOscillator.disconnect();
            } catch(e){}
            bgOscillator = null;
        }
    }

    // ==========================================================================
    // DYNAMIC PARTICLE BACKGROUND ENGINE
    // ==========================================================================
    const bgContainer = document.getElementById("bg-effects-container");

    function renderBackgroundFX() {
        bgContainer.innerHTML = "";
        if (!state.settings.particles) return;

        if (state.currentTheme === 'neon') {
            // Stars + Grid line
            for (let i = 0; i < 60; i++) {
                let star = document.createElement("div");
                star.className = "star-node";
                star.style.width = star.style.height = Math.random() * 3 + "px";
                star.style.top = Math.random() * 100 + "vh";
                star.style.left = Math.random() * 100 + "vw";
                star.style.animation = `float ${3 + Math.random() * 4}s infinite ease-in-out`;
                bgContainer.appendChild(star);
            }
            let grid = document.createElement("div");
            grid.className = "retro-grid";
            bgContainer.appendChild(grid);

            // Random shooting star
            setInterval(() => {
                if(state.currentTheme !== 'neon' || !state.settings.particles) return;
                let met = document.createElement("div");
                met.className = "meteor";
                met.style.top = Math.random() * 40 + "vh";
                met.style.left = Math.random() * 40 + 60 + "vw";
                bgContainer.appendChild(met);
                setTimeout(() => met.remove(), 3000);
            }, 5000);

        } else if (state.currentTheme === 'anime') {
            // Sakura falling petals
            for (let i = 0; i < 20; i++) {
                let leaf = document.createElement("div");
                leaf.className = "sakura-leaf";
                leaf.style.left = Math.random() * 100 + "vw";
                leaf.style.top = "-20px";
                leaf.style.animationDelay = Math.random() * 5 + "s";
                leaf.style.animationDuration = 4 + Math.random() * 5 + "s";
                bgContainer.appendChild(leaf);
            }
        } else if (state.currentTheme === 'ocean') {
            // Ocean rising bubbles
            for (let i = 0; i < 25; i++) {
                let bub = document.createElement("div");
                bub.className = "ocean-bubble";
                bub.style.width = bub.style.height = Math.random() * 15 + 5 + "px";
                bub.style.left = Math.random() * 100 + "vw";
                bub.style.animationDelay = Math.random() * 4 + "s";
                bub.style.animationDuration = 3 + Math.random() * 5 + "s";
                bgContainer.appendChild(bub);
            }
        }
    }

    // ==========================================================================
    // CORE NAVIGATION & SCREEN FLUIDITY
    // ==========================================================================
    function navigateTo(screenId) {
        playClickSound();
        const activeScreen = document.querySelector(".screen.active");
        if (activeScreen) {
            activeScreen.classList.remove("active");
        }

        // Delay to make fade transitions slick
        setTimeout(() => {
            const nextScreen = document.getElementById(screenId);
            if(nextScreen) {
                nextScreen.classList.add("active");
                state.currentScreen = screenId;
                if (!state.screenHistory.includes(screenId) && screenId !== 'screen-welcome') {
                    state.screenHistory.push(screenId);
                }
            }
        }, 150);
    }

    function navigateBack() {
        if (state.screenHistory.length > 1) {
            state.screenHistory.pop(); // Remove current
            const prev = state.screenHistory[state.screenHistory.length - 1];
            navigateTo(prev);
        }
    }

    // ==========================================================================
    // INTERACTIVES: MODALS & TYPING SYSTEM
    // ==========================================================================
    function showModal(title, msg, icon = "😊") {
        document.getElementById("modal-title").innerText = title;
        document.getElementById("modal-message").innerText = msg;
        document.getElementById("modal-icon").innerText = icon;
        document.getElementById("custom-modal").classList.add("active");
    }

    function runTypingEffect(text, element, speed = 30) {
        element.innerHTML = "";
        let i = 0;
        clearTimeout(typingTimeout);
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                typingTimeout = setTimeout(type, speed);
            }
        }
        type();
    }

    function advanceDialogue() {
        const themeConfig = dialogueData[state.currentTheme];
        if (dialogueIndex < themeConfig.script.length) {
            let pureText = themeConfig.script[dialogueIndex].replace("[NAMA]", state.name);
            const textContainer = document.getElementById("dialogue-text");
            runTypingEffect(pureText, textContainer);
            dialogueIndex++;
        } else {
            // Dialogue completed -> Move to subject menu
            navigateTo("screen-menu");
        }
    }

    // ==========================================================================
    // INITIALIZATION & PREFERENCE APPLICATIONS
    // ==========================================================================
    function applySavedPreferences() {
        // Name Setup
        if(state.name) {
            document.getElementById("student-name").value = state.name;
        }

        // Theme Setup
        document.body.className = `theme-${state.currentTheme}`;
        document.querySelectorAll(".theme-card").forEach(c => {
            c.classList.remove("active");
            if(c.getAttribute("data-theme") === state.currentTheme) c.classList.add("active");
        });

        // Settings Elements
        document.getElementById("setting-music").checked = state.settings.music;
        document.getElementById("setting-volume").value = state.settings.volume;
        document.getElementById("setting-particles").checked = state.settings.particles;
        document.getElementById("setting-animations").checked = state.settings.animations;

        if(!state.settings.animations) {
            document.body.classList.add("no-animations");
        } else {
            document.body.classList.remove("no-animations");
        }

        renderBackgroundFX();
        if(state.settings.music) startThemeMusic();
    }

    // Simulate 2s Splash Screen Loading
    setTimeout(() => {
        const loader = document.getElementById("loading-screen");
        loader.classList.remove("active");
        applySavedPreferences();
    }, 2000);

    // ==========================================================================
    // DOM EVENT LISTENERS
    // ==========================================================================
    
    // Theme Card Selection Mechanic
    document.querySelectorAll(".theme-card").forEach(card => {
        card.addEventListener("click", () => {
            playClickSound();
            document.querySelectorAll(".theme-card").forEach(c => c.classList.remove("active"));
            card.classList.add("active");
            
            state.currentTheme = card.getAttribute("data-theme");
            document.body.className = `theme-${state.currentTheme}`;
            
            // Save state immediately
            localStorage.setItem("hw_theme", state.currentTheme);
            renderBackgroundFX();
            if(state.settings.music) startThemeMusic();
        });
    });

    // Start Button Action
    document.getElementById("btn-start").addEventListener("click", () => {
        const inputName = document.getElementById("student-name").value.trim();
        if (!inputName) {
            showModal("Nama masih kosong.", "Yuk isi dulu namamu 😊", "⚠️");
            return;
        }

        state.name = inputName;
        localStorage.setItem("hw_student_name", state.name);

        // Prep narrative room setup
        const themeConfig = dialogueData[state.currentTheme];
        document.getElementById("narrator-name").innerText = themeConfig.character;
        document.getElementById("narrator-avatar").innerText = themeConfig.avatar;
        dialogueIndex = 0;

        // Animate button scaling dynamic feedback
        const btn = document.getElementById("btn-start");
        btn.style.transform = "scale(0.9)";
        setTimeout(() => {
            btn.style.transform = "";
            navigateTo("screen-narrative");
            advanceDialogue();
        }, 200);
    });

    // Narrative Progress Bar
    document.getElementById("btn-narrative-next").addEventListener("click", advanceDialogue);

    // Menu Navigation Branches
    document.getElementById("matpel-math").addEventListener("click", () => navigateTo("screen-math"));
    
    document.getElementById("matpel-indo").addEventListener("click", () => {
        showModal("Mohon bersabar 😊", "Materi Bahasa Indonesia sedang disiapkan secara mendalam oleh tim hebat HW Les Private.", "📖");
    });
    document.getElementById("math-materi").addEventListener("click", () => {
        showModal("Fitur ini akan segera hadir.", "Sistem peta belajar per bab sedang didesain demi kemudahan belajarmu.", "📚");
    });
    document.getElementById("math-simulasi").addEventListener("click", () => {
        showModal("Fitur ini sedang dibuat.", "Simulasi Real-time TKA dengan sistem skor instan sedang masuk tahap akhir pengodean.", "🏆");
    });

    // Global Modals Closure
    document.getElementById("modal-close").addEventListener("click", () => {
        playClickSound();
        document.getElementById("custom-modal").classList.remove("active");
    });

    // Setting Trigger UI Actions
    document.getElementById("btn-settings").addEventListener("click", () => {
        playClickSound();
        document.getElementById("settings-modal").classList.add("active");
    });

    document.getElementById("settings-save").addEventListener("click", () => {
        state.settings.music = document.getElementById("setting-music").checked;
        state.settings.volume = parseFloat(document.getElementById("setting-volume").value);
        state.settings.particles = document.getElementById("setting-particles").checked;
        state.settings.animations = document.getElementById("setting-animations").checked;

        localStorage.setItem("hw_settings", JSON.stringify(state.settings));
        document.getElementById("settings-modal").classList.remove("active");
        applySavedPreferences();
    });

    document.getElementById("settings-reset").addEventListener("click", () => {
        state.settings = { music: false, volume: 0.5, particles: true, animations: true };
        document.getElementById("setting-music").checked = false;
        document.getElementById("setting-volume").value = 0.5;
        document.getElementById("setting-particles").checked = true;
        document.getElementById("setting-animations").checked = true;
        stopThemeMusic();
    });

    // Close settings modal when clicking outer window area
    window.addEventListener("click", (e) => {
        const modal = document.getElementById("settings-modal");
        if (e.target === modal) modal.classList.remove("active");
    });

    // All Global Back button iterations listeners
    document.querySelectorAll(".btn-back").forEach(btn => {
        btn.addEventListener("click", navigateBack);
    });
});
