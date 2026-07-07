/**
 * HW Les Private - Petualangan TKA Engine Pro v2.3
 * FULL SYNCHRONIZED VERSION (ANTI LAYAR EROR)
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================================================
    // 1. STATE MANAGEMENT CONFIG
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
        currentScreen: "screen-welcome"
    };

    // Musik Baru: Khusus Piano Instrumen Esensial (Fun, Klasik & Jazz)
    const audioStreams = {
        neon: "https://ia601409.us.archive.org/21/items/polyphonic-piano-jazz/jazz_piano_improvisation.mp3", 
        anime: "https://ia800100.us.archive.org/33/items/classical-piano-relaxing/beethoven_moonlight_sonata.mp3", 
        ocean: "https://ia802906.us.archive.org/16/items/happy-fun-piano/playful_learning_piano.mp3" 
    };

    const dialogueData = {
        neon: {
            character: "Navigator Galaksi", avatar: "🧑‍✈️",
            script: [
                "Halo [NAMA]...", "Aku adalah Navigator Galaksi.",
                "Kami mendeteksi sinyal kosmis bahwa kamu akan menghadapi Tes Kemampuan Akademik TKA Saintek.",
                "Jangan khawatir! Aku dan tim HW Les Private siap mendampingimu menembus batas kecerdasan."
            ]
        },
        anime: {
            character: "Sensei Sakura", avatar: "🧓",
            script: [
                "Konnichiwa, [NAMA]-kun! ✨ Selamat datang di Akademi Sakura HW Les Private.",
                "Ujian TKA di depan mata layaknya badai kelopak bunga, mari berlatih keras memetik kemenangan!"
            ]
        },
        ocean: {
            character: "Penjaga Laut Ilmu", avatar: "🧜‍♂️",
            script: [
                "Selamat datang penyelam berani, [NAMA]...",
                "Bersama bimbingan kuat HW Les Private, kamu akan menyelam dengan aman menembus palung soal ujian tersulit!"
            ]
        }
    };

    let dialogueIndex = 0;
    let typingTimeout;
    let audioElements = {};
    let meteorInterval = null;
    let windInterval = null;
    let fishInterval = null;
    let isAudioContextInitialized = false;

    // ==========================================================================
    // 2. AUDIO INSTRUMENTAL ENGINE (SUARA SFX SINTESIS DIHAPUS)
    // ==========================================================================
    function initAudioStreams() {
        Object.keys(audioStreams).forEach(key => {
            if (!audioElements[key]) {
                let audio = new Audio(audioStreams[key]);
                audio.loop = true;
                audio.crossOrigin = "anonymous";
                audio.volume = state.settings.volume;
                audioElements[key] = audio;
            }
        });
    }

    function playClickSound() {
        if (!state.settings.animations) return;
        try {
            let ctx = new (window.AudioContext || window.webkitAudioContext)();
            let osc = ctx.createOscillator(); let gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.type = 'sine'; osc.frequency.setValueAtTime(550, ctx.currentTime);
            gain.gain.setValueAtTime(0.06, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
            osc.start(); osc.stop(ctx.currentTime + 0.08);
        } catch(e){}
    }

    function startThemeMusic() {
        stopAllMusic();
        if (!state.settings.music) return;
        initAudioStreams();
        if (audioElements[state.currentTheme]) {
            audioElements[state.currentTheme].volume = state.settings.volume;
            audioElements[state.currentTheme].play().catch(() => {});
        }
    }

    function stopAllMusic() {
        Object.values(audioElements).forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
    }

    // ==========================================================================
    // 3. GENERATOR ELEMEN TEMATIK (TIMING & GERAKAN REVISI)
    // ==========================================================================
    function triggerBigMeteor() {
        if (state.currentScreen !== "screen-welcome" || state.currentTheme !== "neon" || !state.settings.particles) return;
        const container = document.getElementById("bg-effects-container");
        if (!container) return;

        let m = document.createElement("div");
        m.className = "big-meteor";
        m.style.top = "-40px";
        m.style.left = (Math.random() * 30 + 60) + "vw"; 
        container.appendChild(m);
        setTimeout(() => m.remove(), 1500);
    }

    function triggerSakuraWindGust() {
        if (state.currentScreen !== "screen-welcome" || state.currentTheme !== "anime" || !state.settings.particles) return;
        const petals = document.querySelectorAll(".sakura-node");
        
        petals.forEach(p => p.classList.add("sakura-wind-active"));
        setTimeout(() => {
            petals.forEach(p => p.classList.remove("sakura-wind-active"));
        }, 2000); // Angin berhembus 2 detik, lalu normal lagi
    }

    function triggerSchoolOfFish() {
        if (state.currentScreen !== "screen-welcome" || state.currentTheme !== "ocean" || !state.settings.particles) return;
        const container = document.getElementById("bg-effects-container");
        if (!container) return;

        let targetY = Math.random() * 50 + 25;
        let totalFish = Math.floor(Math.random() * 3) + 3;

        for(let i=0; i < totalFish; i++) {
            setTimeout(() => {
                let fish = document.createElement("div");
                fish.className = "school-fish";
                fish.innerText = Math.random() > 0.5 ? "🐟" : "🐠";
                fish.style.top = (targetY + (i * 12)) + "vh";
                fish.style.animationDelay = (i * 0.15) + "s";
                container.appendChild(fish);
                setTimeout(() => fish.remove(), 9200);
            }, i * 80);
        }
    }

    function startThemeLoops() {
        if(meteorInterval) clearInterval(meteorInterval);
        if(windInterval) clearInterval(windInterval);
        if(fishInterval) clearInterval(fishInterval);

        if(state.currentTheme === "neon") {
            meteorInterval = setInterval(triggerBigMeteor, 5000); // Tiap 5 Detik
        } else if(state.currentTheme === "anime") {
            windInterval = setInterval(triggerSakuraWindGust, 7000); // Tiap 7 Detik
        } else if(state.currentTheme === "ocean") {
            fishInterval = setInterval(triggerSchoolOfFish, 6000); // Tiap 6 Detik
        }
    }

    // ==========================================================================
    // 4. RENDERING BACKGROUND FX ENGINE
    // ==========================================================================
    const bgContainer = document.getElementById("bg-effects-container");

    function renderBackgroundFX() {
        if (!bgContainer) return;
        bgContainer.innerHTML = "";
        if (!state.settings.particles) return;

        // Pasang Garis Grid Terpisah Agar Aman
        if (state.currentTheme === 'neon') {
            let grid = document.createElement("div");
            grid.className = "retro-grid";
            bgContainer.appendChild(grid);
        } else if (state.currentTheme === 'anime') {
            let sGrid = document.createElement("div");
            sGrid.className = "sakura-clean-grid";
            bgContainer.appendChild(sGrid);
        }

        // Pasang Siluet Atmosfer Berkelanjutan
        let silhouette = document.createElement("div");
        silhouette.className = "ambient-silhouette";
        if(state.currentTheme === "neon") silhouette.innerText = "🛸";
        else if(state.currentTheme === "anime") silhouette.innerText = "鶴";
        else if(state.currentTheme === "ocean") silhouette.innerText = "🦑";
        bgContainer.appendChild(silhouette);

        // Pasang Partikel Inti Alami secara acak sempurna (Random delay)
        if (state.currentTheme === 'neon') {
            for (let i = 0; i < 60; i++) {
                let star = document.createElement("div");
                star.className = "star-node";
                star.style.width = star.style.height = Math.random() * 3 + "px";
                star.style.top = Math.random() * 100 + "vh";
                star.style.left = Math.random() * 100 + "vw";
                star.style.animationDuration = `${2 + Math.random() * 3}s`;
                star.style.animationDelay = `${Math.random() * 4}s`;
                bgContainer.appendChild(star);
            }
        } else if (state.currentTheme === 'anime') {
            for (let i = 0; i < 35; i++) {
                let sakura = document.createElement("div");
                sakura.className = "sakura-node";
                sakura.style.width = sakura.style.height = Math.random() * 10 + 6 + "px";
                sakura.style.left = Math.random() * 100 + "vw";
                sakura.style.top = `-${Math.random() * 40 + 20}px`;
                sakura.style.animationDelay = `${Math.random() * 8}s`; // Jatuh acak bergantian
                sakura.style.animationDuration = `${4 + Math.random() * 4}s`;
                bgContainer.appendChild(sakura);
            }
        } else if (state.currentTheme === 'ocean') {
            for (let i = 0; i < 40; i++) {
                let bubble = document.createElement("div");
                bubble.className = "bubble-node";
                bubble.style.width = bubble.style.height = Math.random() * 14 + 5 + "px";
                bubble.style.left = Math.random() * 100 + "vw";
                bubble.style.top = "105vh";
                bubble.style.animationDelay = `${Math.random() * 6}s`;
                bubble.style.animationDuration = `${5 + Math.random() * 4}s`;
                bgContainer.appendChild(bubble);
            }
        }
    }

    // ==========================================================================
    // 5. MASTER ROUTER SYSTEM NAVIGATION
    // ==========================================================================
    function navigateTo(screenId) {
        playClickSound();
        const activeScreen = document.querySelector(".screen.active");
        if (activeScreen) activeScreen.classList.remove("active");

        setTimeout(() => {
            const nextScreen = document.getElementById(screenId);
            if (nextScreen) {
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
            state.screenHistory.pop();
            const prev = state.screenHistory[state.screenHistory.length - 1];
            navigateTo(prev);
        }
    }

    function showModal(title, msg, icon = "😊") {
        document.getElementById("modal-title").innerText = title;
        document.getElementById("modal-message").innerText = msg;
        document.getElementById("modal-icon").innerText = icon;
        document.getElementById("custom-modal").classList.add("active");
    }

    function runTypingEffect(text, element) {
        element.innerHTML = "";
        let i = 0; clearTimeout(typingTimeout);
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i); i++;
                typingTimeout = setTimeout(type, 25);
            }
        }
        type();
    }

    function advanceDialogue() {
        const themeConfig = dialogueData[state.currentTheme];
        if (dialogueIndex < themeConfig.script.length) {
            let parsedText = themeConfig.script[dialogueIndex].replace("[NAMA]", state.name);
            runTypingEffect(parsedText, document.getElementById("dialogue-text"));
            dialogueIndex++;
        } else {
            navigateTo("screen-menu");
        }
    }

    function applyPreferences() {
        if(state.name) document.getElementById("student-name").value = state.name;

        document.body.className = `theme-${state.currentTheme}`;
        document.querySelectorAll(".theme-card").forEach(c => {
            c.classList.remove("active");
            if(c.getAttribute("data-theme") === state.currentTheme) c.classList.add("active");
        });

        document.getElementById("setting-music").checked = state.settings.music;
        document.getElementById("setting-volume").value = state.settings.volume;
        document.getElementById("setting-particles").checked = state.settings.particles;
        document.getElementById("setting-animations").checked = state.settings.animations;

        renderBackgroundFX();
        startThemeMusic();
        startThemeLoops();
    }

    // Unblock browser autoplay policy
    function unlockBrowserAudio() {
        if (!isAudioContextInitialized) {
            initAudioStreams();
            startThemeMusic();
            startThemeLoops();
            isAudioContextInitialized = true;
            window.removeEventListener("click", unlockBrowserAudio);
        }
    }
    window.addEventListener("click", unlockBrowserAudio);

    // Turn off loader
    setTimeout(() => {
        const loader = document.getElementById("loading-screen");
        if(loader) loader.classList.remove("active");
        applyPreferences();
    }, 1500);

    // Bindings
    document.querySelectorAll(".theme-card").forEach(card => {
        card.addEventListener("click", () => {
            state.currentTheme = card.getAttribute("data-theme");
            localStorage.setItem("hw_theme", state.currentTheme);
            applyPreferences();
        });
    });

    document.getElementById("btn-start").addEventListener("click", () => {
        const nameInput = document.getElementById("student-name").value.trim();
        if (!nameInput) {
            showModal("Nama masih kosong.", "Yuk isi dulu namamu 😊", "⚠️");
            return;
        }
        state.name = nameInput;
        localStorage.setItem("hw_student_name", state.name);

        const themeConfig = dialogueData[state.currentTheme];
        document.getElementById("narrator-name").innerText = themeConfig.character;
        document.getElementById("narrator-avatar").innerText = themeConfig.avatar;
        dialogueIndex = 0;
        navigateTo("screen-narrative");
        advanceDialogue();
    });

    document.getElementById("btn-narrative-next").addEventListener("click", advanceDialogue);
    document.getElementById("btn-skip-narrative").addEventListener("click", () => navigateTo("screen-menu"));
    document.getElementById("matpel-math").addEventListener("click", () => navigateTo("screen-math"));
    document.getElementById("matpel-indo").addEventListener("click", () => showModal("Mohon bersabar 😊", "Materi Bahasa Indonesia sedang disiapkan oleh tim HW Les Private.", "📖"));
    document.getElementById("math-materi").addEventListener("click", () => showModal("Fitur segera hadir.", "Modul ringkasan rumus cepat sedang disusun.", "📚"));
    document.getElementById("math-simulasi").addEventListener("click", () => showModal("Fitur sedang dibuat.", "Ruang simulasi ujian sedang dikonfigurasi.", "🏆"));
    document.getElementById("modal-close").addEventListener("click", () => document.getElementById("custom-modal").classList.remove("active"));
    
    document.getElementById("btn-settings").addEventListener("click", () => document.getElementById("settings-modal").classList.add("active"));
    document.getElementById("settings-save").addEventListener("click", () => {
        state.settings.music = document.getElementById("setting-music").checked;
        state.settings.volume = parseFloat(document.getElementById("setting-volume").value);
        state.settings.particles = document.getElementById("setting-particles").checked;
        state.settings.animations = document.getElementById("setting-animations").checked;
        localStorage.setItem("hw_settings", JSON.stringify(state.settings));
        document.getElementById("settings-modal").classList.remove("active");
        applyPreferences();
    });
    document.getElementById("settings-reset").addEventListener("click", () => {
        state.settings = { music: false, volume: 0.5, particles: true, animations: true };
        applyPreferences();
    });
    document.querySelectorAll(".btn-back").forEach(btn => btn.addEventListener("click", navigateBack));
});
