/**
 * HW Les Private - Petualangan TKA Engine Pro v2
 * Audio Streaming OpenSource & Dynamic Special Atmospheric Events
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================================================
    // STATE ENGINE CONFIG
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

    // OpenSource Royalty Free Audio Streams (Archive.org & Wikimedia Commons Assets)
    const audioStreams = {
        neon: "https://ia802804.us.archive.org/5/items/synthwave-ambient-track/synthwave_loop.mp3", // Neon Synthwave Ambient
        anime: "https://ia903103.us.archive.org/31/items/japanese-flute-koto-instrumental/sakura_koto.mp3", // Traditional Japanese Koto Flute
        ocean: "https://ia800108.us.archive.org/15/items/OceanWavesAmbient/ocean_waves.mp3" // Underwater/Sea Ambient
    };

    const dialogueData = {
        neon: {
            character: "Navigator Galaksi", avatar: "🧑‍✈️",
            script: [
                "Halo [NAMA]...", "Aku adalah Navigator Galaksi.",
                "Kami mendeteksi sinyal kosmis bahwa kamu akan menghadapi Tes Kemampuan Akademik.",
                "Jangan khawatir!", "Aku dan tim HW Les Private akan mendampingimu memetakan rasi bintang ilmu.",
                "Setiap modul latihan akan mengisi tabung energi kecerdasanmu.", "Siap meluncur menembus batas?"
            ]
        },
        anime: {
            character: "Sensei Sakura", avatar: "🧓",
            script: [
                "Konnichiwa, [NAMA]-kun! ✨", "Selamat datang di Akademi Sakura HW Les Private.",
                "Ujian TKA di depan mata layaknya badai kelopak bunga, tapi ketahuilah fokusmu adalah pedang terbaikmu.",
                "Jangan cemas, para guru andalan kami siap melatih jurus-jurus jitumu.",
                "Mari ambil napas dalam-dalam, bersihkan pikiran, dan bersiap memetik kemenangan!"
            ]
        },
        ocean: {
            character: "Penjaga Laut Pengetahuan", avatar: "🧜‍♂️",
            script: [
                "Selamat datang penyelam berani, [NAMA]...", "Aku Penjaga Samudra Terdalam Ilmu TKA.",
                "Di bawah perairan biru yang luas ini, tersimpan mutiara emas prestasi.",
                "Bersama bimbingan kuat HW Les Private, kamu akan menyelam dengan aman menembus palung tersulit.",
                "Ayo pasang tabung oksigen semangatmu, dayung sirip logikamu, dan temukan mutiaranya!"
            ]
        }
    };

    let dialogueIndex = 0;
    let typingTimeout;
    let audioElements = {};
    let atmosphericInterval = null;

    // ==========================================================================
    // AUDIO PLAYER & ATMOSPHERIC EVENT SYSTEM
    // ==========================================================================
    function initAudioStreams() {
        // Build individual streams elements smoothly
        Object.keys(audioStreams).forEach(key => {
            if (!audioElements[key]) {
                let audio = new Audio(audioStreams[key]);
                audio.loop = true;
                audio.volume = state.settings.volume;
                audioElements[key] = audio;
            }
        });
    }

    function playClickSound() {
        if (!state.settings.animations) return;
        try {
            let ctx = new (window.AudioContext || window.webkitAudioContext)();
            let osc = ctx.createOscillator();
            let gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.type = 'sine'; osc.frequency.setValueAtTime(580, ctx.currentTime);
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
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
            audioElements[state.currentTheme].play().catch(e => console.log("Interaksi user diperlukan untuk memicu audio"));
        }
    }

    function stopAllMusic() {
        Object.values(audioElements).forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
    }

    /**
     * REVISI PENTING 3: Efek Khusus/Atmosfer Menandakan Tema di Halaman Pertama secara Berkala
     */
    function triggerAtmosphericSpecialEvent() {
        if (state.currentScreen !== "screen-welcome" || !state.settings.particles) return;

        const container = document.getElementById("bg-effects-container");

        if (state.currentTheme === "neon") {
            // Event: Kilatan Komet/Meteor ganda melintas acak + Efek Suara Kosmis Frekuensi Tinggi
            for(let i=0; i<3; i++){
                setTimeout(() => {
                    let m = document.createElement("div");
                    m.className = "meteor";
                    m.style.top = Math.random() * 30 + "vh";
                    m.style.left = Math.random() * 30 + 70 + "vw";
                    container.appendChild(m);
                    setTimeout(() => m.remove(), 2500);
                }, i * 400);
            }
            // Sintesis suara kosmis ("Zing!")
            try {
                let ctx = new (window.AudioContext || window.webkitAudioContext)();
                let osc = ctx.createOscillator(); let gain = ctx.createGain();
                osc.connect(gain); gain.connect(ctx.destination);
                osc.type = 'sawtooth'; osc.frequency.setValueAtTime(800, ctx.currentTime);
                osc.frequency.linearRampToValueAtTime(1500, ctx.currentTime + 0.4);
                gain.gain.setValueAtTime(state.settings.volume * 0.05, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
                osc.start(); osc.stop(ctx.currentTime + 0.4);
            } catch(e){}

        } else if (state.currentTheme === "anime") {
            // Event: Angin puyuh menyapu kelopak sakura massal + Efek visual blur blur layaknya embusan angin sore
            const wind = document.getElementById("wind-overlay");
            wind.classList.add("wind-active");
            setTimeout(() => wind.classList.remove("wind-active"), 1500);

            for (let i = 0; i < 35; i++) {
                let s = document.createElement("div");
                s.className = "sakura-node";
                s.style.width = s.style.height = Math.random() * 12 + 8 + "px";
                s.style.left = Math.random() * 100 + "vw";
                s.style.top = "-20px";
                s.style.animationDuration = "2s"; // Fast fall due to wind
                container.appendChild(s);
                setTimeout(() => s.remove(), 2000);
            }
            // Sintesis noise desiran angin ("Whoosh")
            try {
                let ctx = new (window.AudioContext || window.webkitAudioContext)();
                let bufferSize = ctx.sampleRate * 1.5, buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate), data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) { data[i] = Math.random() * 2 - 1; }
                let noise = ctx.createBufferSource(); noise.buffer = buffer;
                let filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.setValueAtTime(400, ctx.currentTime);
                filter.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.7);
                let gain = ctx.createGain(); gain.gain.setValueAtTime(state.settings.volume * 0.15, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
                noise.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
                noise.start();
            } catch(e){}

        } else if (state.currentTheme === "ocean") {
            // Event: Paus biru purba melintas di latar belakang + Dentuman Frekuensi Rendah Sonar Paus
            let whale = document.createElement("div");
            whale.className = "ocean-whale";
            whale.innerText = "🐋";
            container.appendChild(whale);
            setTimeout(() => whale.remove(), 12000);

            // Sintesis dentuman sonar paus bawah laut dalam (Sub-bass low boom frequency)
            try {
                let ctx = new (window.AudioContext || window.webkitAudioContext)();
                let osc = ctx.createOscillator(); let gain = ctx.createGain();
                osc.connect(gain); gain.connect(ctx.destination);
                osc.type = 'sine'; osc.frequency.setValueAtTime(90, ctx.currentTime);
                osc.frequency.linearRampToValueAtTime(70, ctx.currentTime + 0.8);
                gain.gain.setValueAtTime(state.settings.volume * 0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
                osc.start(); osc.stop(ctx.currentTime + 1.2);
            } catch(e){}
        }
    }

    function startAtmosphericLoop() {
        if(atmosphericInterval) clearInterval(atmosphericInterval);
        // Terpicu berkala setiap 7 detik untuk menjaga keaktifan halaman utama
        atmosphericInterval = setInterval(triggerAtmosphericSpecialEvent, 7000);
    }

    // ==========================================================================
    // DENSITY PARTICLE GENERATOR (REVISI 1: Jauh Lebih Banyak & Hidup)
    // ==========================================================================
    const bgContainer = document.getElementById("bg-effects-container");

    function renderBackgroundFX() {
        bgContainer.innerHTML = "";
        if (!state.settings.particles) return;

        if (state.currentTheme === 'neon') {
            // Banyak Bintang Berkelap-kelip Padat (85 Nodes)
            for (let i = 0; i < 85; i++) {
                let star = document.createElement("div");
                star.className = "star-node";
                star.style.width = star.style.height = Math.random() * 3.5 + "px";
                star.style.top = Math.random() * 100 + "vh";
                star.style.left = Math.random() * 100 + "vw";
                star.style.animationDuration = `${2 + Math.random() * 4}s`;
                star.style.animationDelay = `${Math.random() * 3}s`;
                bgContainer.appendChild(star);
            }
            let grid = document.createElement("div");
            grid.className = "retro-grid";
            bgContainer.appendChild(grid);

        } else if (state.currentTheme === 'anime') {
            // Banyak Bunga Sakura / Dedaunan Berguguran Rimbun (45 Nodes)
            for (let i = 0; i < 45; i++) {
                let sakura = document.createElement("div");
                sakura.className = "sakura-node";
                sakura.style.width = sakura.style.height = Math.random() * 14 + 7 + "px";
                sakura.style.left = Math.random() * 100 + "vw";
                sakura.style.top = `-${Math.random() * 40 + 20}px`;
                sakura.style.animationDelay = `${Math.random() * 6}s`;
                sakura.style.animationDuration = `${5 + Math.random() * 6}s`;
                bgContainer.appendChild(sakura);
            }

        } else if (state.currentTheme === 'ocean') {
            // Gelembung Naik Sangat Banyak & Intens (55 Nodes)
            for (let i = 0; i < 55; i++) {
                let bubble = document.createElement("div");
                bubble.className = "bubble-node";
                bubble.style.width = bubble.style.height = Math.random() * 18 + 4 + "px";
                bubble.style.left = Math.random() * 100 + "vw";
                bubble.style.top = "105vh";
                bubble.style.animationDelay = `${Math.random() * 5}s`;
                bubble.style.animationDuration = `${4 + Math.random() * 5}s`;
                bgContainer.appendChild(bubble);
            }
        }
    }

    // ==========================================================================
    // SYSTEM NAVIGATION
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
        let i = 0;
        clearTimeout(typingTimeout);
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
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

    // ==========================================================================
    // ENGINE DISPATCHER & LISTENERS
    // ==========================================================================
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

        if(!state.settings.animations) document.body.classList.add("no-animations");
        else document.body.classList.remove("no-animations");

        renderBackgroundFX();
        startThemeMusic();
        startAtmosphericLoop();
    }

    // Initialize UI on splash timeout
    setTimeout(() => {
        document.getElementById("loading-screen").classList.remove("active");
        applyPreferences();
    }, 2000);

    // Card Theme Trigger selection
    document.querySelectorAll(".theme-card").forEach(card => {
        card.addEventListener("click", () => {
            state.currentTheme = card.getAttribute("data-theme");
            localStorage.setItem("hw_theme", state.currentTheme);
            applyPreferences();
            // Langsung picu pemicu atmosfer sesaat setelah diganti biar interaktif
            triggerAtmosphericSpecialEvent();
        });
    });

    // Start Journey Action
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

    /**
     * REVISI PENTING 4: Tombol SKIP / Lewati Cerita pada Halaman Narasi Percakapan
     */
    document.getElementById("btn-skip-narrative").addEventListener("click", () => {
        playClickSound();
        clearTimeout(typingTimeout);
        navigateTo("screen-menu"); // Potong jalur langsung menuju pemilihan mata pelajaran
    });

    // Menu selections branches
    document.getElementById("matpel-math").addEventListener("click", () => navigateTo("screen-math"));
    document.getElementById("matpel-indo").addEventListener("click", () => showModal("Mohon bersabar 😊", "Materi Bahasa Indonesia sedang disiapkan oleh tim HW Les Private.", "📖"));
    document.getElementById("math-materi").addEventListener("click", () => showModal("Fitur ini akan segera hadir.", "Fitur ini akan segera hadir.", "📚"));
    document.getElementById("math-simulasi").addEventListener("click", () => showModal("Fitur ini sedang dibuat.", "Fitur ini sedang dibuat.", "🏆"));

    document.getElementById("modal-close").addEventListener("click", () => {
        playClickSound();
        document.getElementById("custom-modal").classList.remove("active");
    });

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
        applyPreferences();
    });

    document.getElementById("settings-reset").addEventListener("click", () => {
        state.settings = { music: false, volume: 0.5, particles: true, animations: true };
        applyPreferences();
    });

    document.querySelectorAll(".btn-back").forEach(btn => btn.addEventListener("click", navigateBack));
});
