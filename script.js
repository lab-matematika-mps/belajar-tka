/**
 * HW Les Private - Petualangan TKA Engine Pro v2.2
 * REVISI: SFX DIHAPUS, PIANO INSTRUMENTAL, SILUET ATMOSFER, ANGIN SAKURA DINAMIS
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

    // Musik Baru: Khusus Piano Instrumen (Jazz, Klasik, & Fun Learning)
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
    let meteorInterval = null;
    let windInterval = null;
    let fishInterval = null;
    let isAudioContextInitialized = false;

    // ==========================================================================
    // AUDIO PLAYER SYSTEM (SFX SUARA SUDAH DIHAPUS)
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
            osc.type = 'sine'; osc.frequency.setValueAtTime(580, ctx.currentTime);
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
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
    // MANAGEMENT ELEMEN KHUSUS TIAP TEMA (DENGAN TIMING REVISI)
    // ==========================================================================
    
    // 1. REVISI NEON: Meteor Besar tiap 5 Detik
    function triggerBigMeteor() {
        if (state.currentScreen !== "screen-welcome" || state.currentTheme !== "neon" || !state.settings.particles) return;
        const container = document.getElementById("bg-effects-container");
        if (!container) return;

        let meteor = document.createElement("div");
        meteor.className = "big-meteor";
        meteor.style.top = Math.random() * -50 + "px";
        meteor.style.left = Math.random() * 40 + 50 + "vw"; // Muncul dari kanan atas
        container.appendChild(meteor);
        setTimeout(() => meteor.remove(), 1500);
    }

    // 2. REVISI SAKURA: Hembusan Angin Dinamis tiap 7 Detik (Miring 2 detik, lalu normal)
    function triggerSakuraWindGust() {
        if (state.currentScreen !== "screen-welcome" || state.currentTheme !== "anime" || !state.settings.particles) return;
        
        const petals = document.querySelectorAll(".sakura-node");
        
        // Aktifkan animasi hempasan angin kencang ke kanan
        petals.forEach(petal => {
            petal.classList.add("sakura-wind-active");
        });

        // Setelah 2 detik, kembalikan ke kondisi jatuh normal secara perlahan
        setTimeout(() => {
            petals.forEach(petal => {
                petal.classList.remove("sakura-wind-active");
            });
        }, 2000);
    }

    // 3. REVISI SAMUDRA: Kawanan ikan hidup melintas acak tiap 6 detik
    function triggerSchoolOfFish() {
        if (state.currentScreen !== "screen-welcome" || state.currentTheme !== "ocean" || !state.settings.particles) return;
        const container = document.getElementById("bg-effects-container");
        if (!container) return;

        let randomTop = Math.random() * 60 + 20; // Posisi tinggi acak
        let fishCount = Math.floor(Math.random() * 4) + 3; // 3 sampai 6 ikan berkelompok

        for(let i=0; i < fishCount; i++) {
            setTimeout(() => {
                let fish = document.createElement("div");
                fish.className = "school-fish";
                fish.innerText = Math.random() > 0.5 ? "🐟" : "🐠";
                fish.style.top = (randomTop + (i * 15)) + "vh";
                fish.style.animationDelay = (i * 0.2) + "s";
                container.appendChild(fish);
                setTimeout(() => fish.remove(), 9000);
            }, i * 100);
        }
    }

    // Mengatur siklus interval agar tidak bertabrakan antar tema
    function startThemeLoops() {
        if(meteorInterval) clearInterval(meteorInterval);
        if(windInterval) clearInterval(windInterval);
        if(fishInterval) clearInterval(fishInterval);

        if(state.currentTheme === "neon") {
            meteorInterval = setInterval(triggerBigMeteor, 5000); // 5 Detik sekali
        } else if(state.currentTheme === "anime") {
            windInterval = setInterval(triggerSakuraWindGust, 7000); // 7 Detik sekali
        } else if(state.currentTheme === "ocean") {
            fishInterval = setInterval(triggerSchoolOfFish, 6000); // 6 Detik sekali
        }
    }

    // ==========================================================================
    // REVISI PARTIKEL UTAMA & SILUET BACKGROUND
    // ==========================================================================
    const bgContainer = document.getElementById("bg-effects-container");

    function renderBackgroundFX() {
        if (!bgContainer) return;
        bgContainer.innerHTML = "";
        if (!state.settings.particles) return;

        // Tambahkan Garis Grid Tajam (Diaktifkan untuk Neon & Anime/Sakura dengan CSS yang diperjelas)
        if (state.currentTheme === 'neon' || state.currentTheme === 'anime') {
            let grid = document.createElement("div");
            grid.className = "retro-grid";
            bgContainer.appendChild(grid);
        }

        // TAMBAHKAN SILUET ATMOSFER LAMBAT (Ambient Silhouette)
        let silhouette = document.createElement("div");
        silhouette.className = "ambient-silhouette";
        if(state.currentTheme === "neon") silhouette.innerText = "🛸";
        else if(state.currentTheme === "anime") silhouette.innerText = "鶴"; // Kanze/Bangau Jepang klasik
        else if(state.currentTheme === "ocean") silhouette.innerText = "🦑"; // Gurita raksasa legendaris
        bgContainer.appendChild(silhouette);

        // Render partikel dasar masing-masing tema secara random acak sempurna
        if (state.currentTheme === 'neon') {
            for (let i = 0; i < 70; i++) {
                let star = document.createElement("div");
                star.className = "star-node";
                star.style.width = star.style.height = Math.random() * 3 + "px";
                star.style.top = Math.random() * 100 + "vh";
                star.style.left = Math.random() * 100 + "vw";
                star.style.animationDuration = `${2 + Math.random() * 4}s`;
                star.style.animationDelay = `${Math.random() * 4}s`;
                bgContainer.appendChild(star);
            }
        } else if (state.currentTheme === 'anime') {
            // REVISI: Kelopak Bunga Jatuh Random Sempurna tidak berbarengan
            for (let i = 0; i < 40; i++) {
                let sakura = document.createElement("div");
                sakura.className = "sakura-node";
                sakura.style.width = sakura.style.height = Math.random() * 12 + 6 + "px";
                sakura.style.left = Math.random() * 100 + "vw";
                sakura.style.top = `-${Math.random() * 50 + 20}px`;
                sakura.style.animationDelay = `${Math.random() * 8}s`; // Delay super acak
                sakura.style.animationDuration = `${4 + Math.random() * 5}s`; // Kecepatan acak
                bgContainer.appendChild(sakura);
            }
        } else if (state.currentTheme === 'ocean') {
            // REVISI: Mengaktifkan kembali Gelembung Air Konstan yang Indah
            for (let i = 0; i < 50; i++) {
                let bubble = document.createElement("div");
                bubble.className = "bubble-node";
                bubble.style.width = bubble.style.height = Math.random() * 16 + 5 + "px";
                bubble.style.left = Math.random() * 100 + "vw";
                bubble.style.top = "105vh";
                bubble.style.animationDelay = `${Math.random() * 6}s`;
                bubble.style.animationDuration = `${5 + Math.random() * 5}s`;
                bgContainer.appendChild(bubble);
            }
        }
    }

    // ==========================================================================
    // SYSTEM NAVIGATION & INTERFACES
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
    // DISPATCHER MASTER
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
        startThemeLoops();
    }

    // Unblock audio policy on interaction
    function unlockBrowserAudio() {
        if (!isAudioContextInitialized) {
            initAudioStreams();
            startThemeMusic();
            startThemeLoops();
            isAudioContextInitialized = true;
            window.removeEventListener("click", unlockBrowserAudio);
            window.removeEventListener("touchstart", unlockAudioFallback);
        }
    }
    function unlockAudioFallback() { unlockBrowserAudio(); }
    
    window.addEventListener("click", unlockBrowserAudio);
    window.addEventListener("touchstart", unlockAudioFallback);

    setTimeout(() => {
        const loader = document.getElementById("loading-screen");
        if(loader) loader.classList.remove("active");
        applyPreferences();
    }, 2000);

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
    document.getElementById("btn-skip-narrative").addEventListener("click", () => {
        playClickSound();
        clearTimeout(typingTimeout);
        navigateTo("screen-menu");
    });

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
