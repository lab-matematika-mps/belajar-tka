/**
 * CORE LOGIC WEBSITE UTAMA LATIHAN TKA - HAYAM WURUK LES PRIVATE (HW LES PRIVATE)
 * Versi Final 2026: Autoplay Adaptif Browser, Sistem Partikel Revolusioner 3 Tema.
 */

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================================================
    // 1. STATE MANAGEMENT GLOBAL
    // ==========================================================================
    const state = {
        username: "",
        currentTheme: "galaksi",
        isMuted: false,
        soundFXEnabled: true,
        volume: 0.4, // Default volume ideal 40%
        activeView: "page-menu",
        narrationIndex: 0
    };

    // Data Konten Dialog per Tema
    const narrationData = {
        galaksi: {
            mentor: "Tentor Terbaik Galaksi 🚀",
            avatar: "🚀",
            dialogues: [
                "Halo, Petualang Hebat! Aku sudah menunggumu di Pusat Kendali ini.",
                "Hari ini kita akan menjelajahi Galaksi TKA yang penuh tantangan seru.",
                "Setiap latihan soal yang kamu taklukkan akan membuat roket cerdasmu semakin kuat.",
                "Jangan pernah takut salah ya! Kesalahan adalah bahan bakar utama menuju bintang keberhasilan. Ayo meluncur!"
            ]
        },
        langit: {
            mentor: "Kucing Sakura Bijaksana 🐱🌸",
            avatar: "🐱",
            dialogues: [
                "Halo manis... selamat datang di Taman Langit Senja Sakura yang hangat.",
                "Aku sudah menggelar tikar belajar dan meracik banyak formula latihan menyenangkan.",
                "Belajar materi TKA ditemani tarian guguran kelopak bunga sakura tentu sangat rileks, bukan?",
                "Tarik napas dalam-dalam, tenangkan jiwamu. Aku yakin lembar demi lembar TKA bisa kamu taklukkan dengan mudah!"
            ]
        },
        samudra: {
            mentor: "Penyu Bijak Akademi Samudra 🐢",
            avatar: "🐢",
            dialogues: [
                "Halo anak muda, selamat datang di Kedalaman Akademi Samudra yang misterius.",
                "Di palung laut terdalam ini, tersimpan ribuan ilmu pengetahuan persiapan ujian TKA.",
                "Kita akan menyelam bersama-sama menembus terumbu karang soal yang menantang.",
                "Semakin dalam kita mengeksplorasi, semakin tangguh mental dan kemampuan logikamu. Mari dayung logikamu sekarang!"
            ]
        }
    };

    // Urutan teks transisi elegan di Loading Screen
    const loadingPhases = [
        "Menghubungkan ke Galaksi Belajar...",
        "Menyiapkan Tentor Terbaik...",
        "Menghubungkan ke HW Les Private...",
        "Menyiapkan Materi TKA...",
        "Hampir Selesai...",
        "Selamat Datang..."
    ];

    // Caching Elemen DOM
    const elements = {
        progressBar: document.getElementById("progressBar"),
        loadingText: document.getElementById("loadingText"),
        loadingLogo: document.getElementById("loadingLogo"),
        pageLoading: document.getElementById("page-loading"),
        mainContent: document.getElementById("mainContent"),
        bgMusic: document.getElementById("bgMusic"),
        btnAudioToggle: null, // Dinamis di modal setting
        btnSetting: document.getElementById("btnSetting"),
        themeButtons: document.querySelectorAll("[data-choose-theme]"),
        avatarGraphic: document.getElementById("avatarGraphic"),
        usernameInput: document.getElementById("usernameInput"),
        btnStart: document.getElementById("btnStart"),
        pageViews: document.querySelectorAll(".page-view"),
        bgContainer: document.getElementById("bgContainer"),
        mentorAvatar: document.getElementById("mentorAvatar"),
        mentorName: document.getElementById("mentorName"),
        typewriterText: document.getElementById("typewriterText"),
        btnSkip: document.getElementById("btnSkip"),
        btnNextNarration: document.getElementById("btnNextNarration"),
        backButtons: document.querySelectorAll(".btn-back"),
        subjectMath: document.getElementById("subjectMath"),
        subjectIndo: document.getElementById("subjectIndo"),
        modeMaterial: document.getElementById("modeMaterial"),
        modeSimulation: document.getElementById("modeSimulation"),
        globalModal: document.getElementById("globalModal"),
        modalTitle: document.getElementById("modalTitle"),
        modalBody: document.getElementById("modalBody"),
        btnModalClose: document.getElementById("btnModalClose")
    };

    let themeIntervals = [];
    function clearAllIntervals() {
        themeIntervals.forEach(clearInterval);
        themeIntervals = [];
    }

    // ==========================================================================
    // 2. AUDIO MANAGEMENT ENGINE (SMART AUTOPLAY FALLBACK)
    // ==========================================================================
    function initializeAudioEngine() {
        elements.bgMusic.volume = state.volume;
        
        // Coba putar otomatis langsung di loading screen
        const playPromise = elements.bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Diblokir browser, siapkan pemicu di klik perdana di layar dokumen
                document.addEventListener('click', triggerAutoplayOnInteraction, { once: true });
                document.addEventListener('keydown', triggerAutoplayOnInteraction, { once: true });
            });
        }
    }

    function triggerAutoplayOnInteraction() {
        if (!state.isMuted) {
            elements.bgMusic.play().catch(() => {});
        }
    }

    // Synthesizer Audio Efek Lembut Alami Menggunakan AudioContext (Bebas Lag / File Missing)
    function playSoundFX(type) {
        if (state.isMuted || !state.soundFXEnabled) return;
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            if (type === 'click') {
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(450, audioCtx.currentTime);
                gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
                oscillator.start();
                oscillator.stop(audioCtx.currentTime + 0.08);
            } else if (type === 'popup') {
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(520, audioCtx.currentTime);
                gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
                oscillator.start();
                oscillator.stop(audioCtx.currentTime + 0.15);
            } else if (type === 'transition') {
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.3);
                gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
                oscillator.start();
                oscillator.stop(audioCtx.currentTime + 0.3);
            }
        } catch (e) { console.log("Audio FX API Error"); }
    }

    // ==========================================================================
    // 3. GENERATOR PARTIKEL WALLPAPER HIDUP (60FPS THEMATIC)
    // ==========================================================================
    function renderThemeBackground(theme) {
        clearAllIntervals();
        elements.bgContainer.innerHTML = "";

        if (theme === "galaksi") {
            // --- GENERATE TEMA GALAKSI ---
            // 1. Ratusan Bintang Kecil
            for (let i = 0; i < 65; i++) {
                const star = document.createElement("div");
                star.className = "star-twinkle";
                const size = Math.random() * 2.5 + 1;
                star.style.width = `${size}px`;
                star.style.height = `${size}px`;
                star.style.left = `${Math.random() * 100}vw`;
                star.style.top = `${Math.random() * 100}vh`;
                star.style.setProperty('--d', `${Math.random() * 3 + 1.5}s`);
                elements.bgContainer.appendChild(star);
            }

            // 2. Kontainer Solar System Tata Surya 3D
            const solarSystem = document.createElement("div");
            solarSystem.className = "system-solar-3d";
            const sun = document.createElement("div");
            sun.className = "sun-center-3d";
            solarSystem.appendChild(sun);

            const planets = [
                { size: '12px', color: '#00f3ff', glow: '#00f3ff', orbit: '180px', speed: '14s' },
                { size: '18px', color: '#ffb703', glow: '#ffb703', orbit: '280px', speed: '22s' },
                { size: '15px', color: '#ff4d6d', glow: '#ff4d6d', orbit: '400px', speed: '30s' },
                { size: '22px', color: '#a2d2ff', glow: '#a2d2ff', orbit: '520px', speed: '45s' } // Bercincin/Besar
            ];

            planets.forEach(p => {
                const path = document.createElement("div");
                path.className = "orbit-ellipse-path";
                path.style.width = path.style.height = p.orbit;
                path.style.setProperty('--speed', p.speed);

                const planet = document.createElement("div");
                planet.className = "planet-3d";
                planet.style.width = planet.style.height = p.size;
                planet.style.background = p.color;
                planet.style.setProperty('--glow', p.glow);
                
                path.appendChild(planet);
                solarSystem.appendChild(path);
            });
            elements.bgContainer.appendChild(solarSystem);

            // 3. Spawner Meteor Besar Berjeda Acak
            const createMeteor = () => {
                const meteor = document.createElement("div");
                meteor.className = "meteor-streak";
                const startX = Math.random() * 60 + 30;
                meteor.style.setProperty('--startX', `${startX}vw`);
                meteor.style.setProperty('--startY', `-60px`);
                meteor.style.setProperty('--endX', `${startX - 40}vw`);
                meteor.style.setProperty('--endY', `105vh`);
                meteor.style.setProperty('--dur', `${Math.random() * 0.5 + 0.8}s`);
                
                elements.bgContainer.appendChild(meteor);
                setTimeout(() => meteor.remove(), 1500);
            };

            const meteorSpawner = setInterval(() => {
                createMeteor();
                if (Math.random() > 0.5) { // Kadang dua meteor meluncur berdekatan
                    setTimeout(createMeteor, Math.random() * 400 + 300);
                }
            }, 3500);
            themeIntervals.push(meteorSpawner);

        } else if (theme === "langit") {
            // --- GENERATE TEMA LANGIT SAKURA ---
            const makeSakuraPetal = (isInitial = false) => {
                const petal = document.createElement("div");
                petal.className = "sakura-petal";
                const size = Math.random() * 10 + 10;
                petal.style.width = `${size}px`;
                petal.style.height = `${size * 1.3}px`;
                petal.style.left = `${Math.random() * 100}vw`;
                
                const fallDuration = Math.random() * 5 + 6;
                petal.style.setProperty('--speed', `${fallDuration}s`);
                petal.style.setProperty('--sway', `${Math.random() * 160 - 80}px`);

                if (isInitial) {
                    petal.style.animationDelay = `-${Math.random() * 5}s`;
                }
                elements.bgContainer.appendChild(petal);
                setTimeout(() => petal.remove(), fallDuration * 1000);
            };

            // Hembusan angin kencang berbarengan berkala
            const triggerWindGust = () => {
                for(let i=0; i<15; i++) {
                    setTimeout(() => makeSakuraPetal(false), Math.random() * 600);
                }
            };

            for (let i = 0; i < 25; i++) makeSakuraPetal(true);
            const sakuraSpawner = setInterval(() => makeSakuraPetal(false), 350);
            const windSpawner = setInterval(triggerWindGust, 8000);
            themeIntervals.push(sakuraSpawner, windSpawner);

        } else if (theme === "samudra") {
            // --- GENERATE TEMA SAMUDRA DEEP BLUE ---
            // 1. Gelembung Normal Kontinu
            const injectBubble = (fastMode = false) => {
                const bubble = document.createElement("div");
                bubble.className = "bubble-dense";
                const size = Math.random() * 8 + 3;
                bubble.style.width = bubble.style.height = `${size}px`;
                bubble.style.left = `${Math.random() * 100}vw`;
                
                const speed = fastMode ? (Math.random() * 2 + 2) : (Math.random() * 4 + 5);
                bubble.style.setProperty('--d', `${speed}s`);
                bubble.style.setProperty('--sway', `${Math.random() * 80 - 40}px`);

                elements.bgContainer.appendChild(bubble);
                setTimeout(() => bubble.remove(), speed * 1000);
            };

            // Pop gelembung massal (Ledakan Gelembung)
            const burstBubbleStorm = () => {
                const count = Math.floor(Math.random() * 25) + 35;
                for(let i=0; i < count; i++) {
                    setTimeout(() => injectBubble(true), Math.random() * 900);
                }
            };

            for(let i=0; i < 40; i++) injectBubble(false);
            const bubbleSpawner = setInterval(() => injectBubble(false), 150);
            const stormSpawner = setInterval(burstBubbleStorm, 6000);
            themeIntervals.push(bubbleSpawner, stormSpawner);

            // 2. Siluet Ikan Berenang (Pola Sinusoid Kanan ke Kiri)
            const spawnSilhouetteFish = (isSchool = false) => {
                const fishes = ["🐟", "🐠"];
                const count = isSchool ? (Math.floor(Math.random() * 3) + 4) : 1;
                const baseGroupY = Math.random() * 60 + 15;
                const speed = isSchool ? (Math.random() * 3 + 10) : (Math.random() * 3 + 6);

                for (let i = 0; i < count; i++) {
                    const fish = document.createElement("div");
                    fish.className = "fish-silhouette";
                    fish.innerText = fishes[Math.floor(Math.random() * fishes.length)];
                    
                    const size = isSchool ? (Math.random() * 0.5 + 1) : (Math.random() * 0.8 + 1.2);
                    fish.style.setProperty('--sz', `${size}rem`);
                    fish.style.setProperty('--op', Math.random() * 0.3 + 0.4);
                    fish.style.setProperty('--speed', `${speed}s`);
                    
                    // Mengatur koordinat offset gerak gerombolan agar estetik
                    const spreadX = isSchool ? (Math.random() * 50 - 25) : 0;
                    const spreadY = isSchool ? (Math.random() * 40 - 20) : 0;
                    fish.style.top = `${baseGroupY}%`;
                    fish.style.transform = `scaleX(-1) translateY(${spreadY}px)`;
                    fish.style.animationDelay = isSchool ? `${Math.random() * 0.5}s` : `0s`;
                    fish.style.setProperty('--waveY', `${Math.random() * 60 - 30}px`);

                    elements.bgContainer.appendChild(fish);
                    setTimeout(() => fish.remove(), (speed * 1000) + 1000);
                }
            };

            spawnSilhouetteFish(true);
            const loneFishSpawner = setInterval(() => spawnSilhouetteFish(false), 2200);
            const schoolFishSpawner = setInterval(() => spawnSilhouetteFish(true), 7000);
            themeIntervals.push(loneFishSpawner, schoolFishSpawner);
        }
    }

    // ==========================================================================
    // 4. ANIMASI TRANSISI LOADING SEQUENCE (HALAMAN 0)
    // ==========================================================================
    function triggerLoadingSequence() {
        let percentage = 0;
        let activePhaseIndex = 0;

        const interval = setInterval(() => {
            percentage += 2;
            elements.progressBar.style.width = `${percentage}%`;

            // Hitungan pembagian fase teks narasi loading secara halus
            if (percentage % 18 === 0 && activePhaseIndex < loadingPhases.length - 1) {
                activePhaseIndex++;
                
                // Efek kombinasi Fade Out, Zoom out, Glow miring
                elements.loadingText.style.opacity = "0";
                elements.loadingText.style.transform = "scale(0.9) translateY(4px)";
                
                setTimeout(() => {
                    elements.loadingText.innerText = loadingPhases[activePhaseIndex];
                    elements.loadingText.style.opacity = "1";
                    elements.loadingText.style.transform = "scale(1) translateY(0)";
                }, 400);
            }

            if (percentage >= 100) {
                clearInterval(interval);
                
                // Animasi pamungkas Fade Out seluruh Loading Screen
                setTimeout(() => {
                    elements.pageLoading.style.opacity = "0";
                    elements.pageLoading.style.transform = "scale(1.05)";
                    playSoundFX('transition');

                    setTimeout(() => {
                        elements.pageLoading.classList.add("hidden");
                        elements.mainContent.classList.remove("hidden");
                        renderThemeBackground(state.currentTheme);
                    }, 800);
                }, 500);
            }
        }, 90);
    }

    // ==========================================================================
    // 5. ROUTING & SWITCH VIEW ENGINE
    // ==========================================================================
    function navigateToView(targetViewId) {
        playSoundFX('click');
        elements.pageViews.forEach(view => {
            view.classList.add("hidden");
        });
        const targetView = document.getElementById(targetViewId);
        targetView.classList.remove("hidden");
        state.activeView = targetViewId;

        // Trigger inisialisasi modul halaman tertentu saat aktif
        if (targetViewId === "page-narration") {
            startThematicNarration();
        }
    }

    // Modal Info Alert Global
    function displayModal(title, markup) {
        playSoundFX('popup');
        elements.modalTitle.innerText = title;
        elements.modalBody.innerHTML = markup;
        elements.globalModal.classList.remove("hidden");
        
        // Memasang handler audio interaktif dinamis jika ini modal Pengaturan
        const volumeSlider = document.getElementById("modalVolume");
        if (volumeSlider) {
            volumeSlider.addEventListener("input", (e) => {
                state.volume = e.target.value;
                elements.bgMusic.volume = state.volume;
            });
        }
        const checkMute = document.getElementById("modalMute");
        if (checkMute) {
            checkMute.addEventListener("change", (e) => {
                state.isMuted = e.target.checked;
                elements.bgMusic.muted = state.isMuted;
            });
        }
        const checkFX = document.getElementById("modalFX");
        if (checkFX) {
            checkFX.addEventListener("change", (e) => {
                state.soundFXEnabled = e.target.checked;
            });
        }
    }

    // ==========================================================================
    // 6. MODUL HALAMAN 1: INTERAKSI TEMA & FORM VALIDASI
    // ==========================================================================
    elements.themeButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const chosenTheme = e.currentTarget.getAttribute("data-choose-theme");
            
            elements.themeButtons.forEach(b => b.classList.remove("active"));
            e.currentTarget.classList.add("active");

            document.body.setAttribute("data-theme", chosenTheme);
            state.currentTheme = chosenTheme;

            // Perubahan Grafis Avatar instan mengikuti keselarasan tema pilihan
            if (chosenTheme === "galaksi") elements.avatarGraphic.innerText = "🚀";
            else if (chosenTheme === "langit") elements.avatarGraphic.innerText = "🐱";
            else if (chosenTheme === "samudra") elements.avatarGraphic.innerText = "🐬";

            playSoundFX('click');
            renderThemeBackground(chosenTheme);
        });
    });

    elements.btnStart.addEventListener("click", () => {
        const value = elements.usernameInput.value.trim();
        if (value === "") {
            displayModal("Perhatian ⚠️", "<p>Silakan tuliskan namamu terlebih dahulu untuk memulai petualangan belajar TKA!</p>");
            return;
        }
        state.username = value;
        navigateToView("page-narration");
    });

    // ==========================================================================
    // 7. MODUL HALAMAN 2: TYPEWRITER DIALOG ENGINE
    // ==========================================================================
    let typewriterTimer = null;
    
    function startThematicNarration() {
        state.narrationIndex = 0;
        const currentData = narrationData[state.currentTheme];
        
        elements.mentorAvatar.innerText = currentData.avatar;
        elements.mentorName.innerText = currentData.mentor;
        elements.btnNextNarration.classList.add("hidden");
        elements.btnSkip.classList.remove("hidden");

        renderDialogueCharacterByCharacter(currentData.dialogues[0]);
    }

    function renderDialogueCharacterByCharacter(text) {
        clearInterval(typewriterTimer);
        elements.typewriterText.innerText = "";
        let charIndex = 0;
        
        // Memasukkan nama user secara kustom ke baris dialog pembuka pertama
        const customText = text.replace("(Nama)", state.username).replace("Petualang Hebat", state.username);

        typewriterTimer = setInterval(() => {
            elements.typewriterText.innerText += customText.charAt(charIndex);
            charIndex++;
            if (charIndex >= customText.length) {
                clearInterval(typewriterTimer);
                evaluateNarrationProgressControl();
            }
        }, 25);
    }

    function evaluateNarrationProgressControl() {
        const maxDialogues = narrationData[state.currentTheme].dialogues.length;
        if (state.narrationIndex < maxDialogues - 1) {
            elements.btnNextNarration.innerText = "Lanjutkan ➡️";
        } else {
            elements.btnNextNarration.innerText = "Masuk Zona Latihan ⚔️";
        }
        elements.btnNextNarration.classList.remove("hidden");
    }

    elements.btnNextNarration.addEventListener("click", () => {
        state.narrationIndex++;
        const currentData = narrationData[state.currentTheme];
        if (state.narrationIndex < currentData.dialogues.length) {
            elements.btnNextNarration.classList.add("hidden");
            renderDialogueCharacterByCharacter(currentData.dialogues[state.narrationIndex]);
        } else {
            navigateToView("page-subjects");
        }
    });

    elements.btnSkip.addEventListener("click", () => {
        clearInterval(typewriterTimer);
        navigateToView("page-subjects");
    });

    // ==========================================================================
    // 8. INTERAKSI MENU MAPEL & PENGATURAN GLOBAL CONTROL
    // ==========================================================================
    elements.backButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const viewTarget = e.currentTarget.getAttribute("data-target");
            navigateToView(viewTarget);
        });
    });

    elements.subjectMath.addEventListener("click", () => navigateToView("page-modes"));
    
    elements.subjectIndo.addEventListener("click", () => {
        displayModal("Informasi Kurikulum 📖", "<p>Fitur <b>Bahasa Indonesia</b> sedang kami siapkan.<br>Mohon tunggu update materi seru berikutnya dari HW Les Private.</p>");
    });

    elements.modeMaterial.addEventListener("click", () => {
        displayModal("Tahap Penggodokan 📚", "<p>Fitur <b>Latihan per Materi</b> sedang dalam tahap pengembangan intensif.<br>Kami akan segera menghadirkannya dalam beberapa waktu ke depan.</p>");
    });

    elements.modeSimulation.addEventListener("click", () => {
        displayModal("Persiapan Ujian TKA 🏆", "<p>Fitur <b>Simulasi Komprehensif TKA</b> sedang dipersiapkan.<br>Nantikan pembaruan sistem berkala dari manajemen HW Les Private.</p>");
    });

    elements.btnModalClose.addEventListener("click", () => {
        playSoundFX('click');
        elements.globalModal.classList.add("hidden");
    });

    // Modal Control Panel Setting Website (Gear Button)
    elements.btnSetting.addEventListener("click", () => {
        const markup = `
            <div class="control-row">
                <label>🔊 Volume Musik Background</label>
                <input type="range" id="modalVolume" min="0" max="1" step="0.05" value="${state.volume}" class="slider-neon">
            </div>
            <div class="control-row">
                <label>🔇 Senyap Musik (Mute)</label>
                <input type="checkbox" id="modalMute" ${state.isMuted ? 'checked' : ''}>
            </div>
            <div class="control-row">
                <label>✨ Efek Suara Tombol (FX)</label>
                <input type="checkbox" id="modalFX" ${state.soundFXEnabled ? 'checked' : ''}>
            </div>
            <div class="control-row" style="margin-top:10px;">
                <button class="btn-secondary-neon" style="width:100%; font-size:0.85rem;" onclick="if(document.fullscreenElement){document.exitFullscreen();}else{document.documentElement.requestFullscreen();}">🖥️ Alihkan Layar Penuh</button>
            </div>
            <div class="control-row">
                <button class="btn-secondary-neon" style="width:100%; font-size:0.85rem; border-color:#ff4d6d;" onclick="window.location.reload();">🔄 Reset / Segarkan Website</button>
            </div>
        `;
        displayModal("Pusat Kontrol Website ⚙️", markup);
    });

    // ==========================================================================
    // 9. CORE INITIALIZATION
    // ==========================================================================
    initializeAudioEngine();
    triggerLoadingSequence();
});
