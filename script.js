/**
 * WEBSITE UTAMA LATIHAN TKA - HAYAM WURUK LES PRIVATE (HW LES PRIVATE)
 * Edisi Pembaruan: Pengembalian Tema Sakura Berguguran Alami & Siluet Ikan Gelombang Kanan-Kiri
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================================================
    // 1. STATE & KONFIGURASI GLOBAL
    // ==========================================================================
    const state = {
        username: "",
        currentTheme: "antariksa",
        isMuted: false,
        activeView: "page-menu",
        narrationIndex: 0
    };

    const narrationData = {
        antariksa: {
            mentor: "Tentor Terbaik Galaksi 🚀",
            avatar: "🚀",
            dialogues: [
                "Halo, Petualang Hebat!",
                "Aku sudah menunggumu di pusat kendali ini.",
                "Hari ini kita akan menjelajahi Galaksi TKA yang sangat menantang.",
                "Setiap latihan soal yang kamu kerjakan akan membuat tokomu semakin kuat.",
                "Jangan pernah takut salah ya!",
                "Kesalahan adalah bahan bakar roketmu menuju keberhasilan. Ayo kita luncurkan!"
            ]
        },
        sakura: {
            mentor: "Tentor Terbaik Sakura 🌸",
            avatar: "🌸",
            dialogues: [
                "Selamat datang di taman belajar sakura yang indah...",
                "Aku sudah menyiapkan tempat yang hangat dan banyak latihan seru untukmu.",
                "Belajar materi TKA ditemani kelopak bunga berguguran tentu sangat menyenangkan, bukan?",
                "Tarik napas dalam-dalam, tenangkan pikiranmu.",
                "Aku yakin dengan latihan konsisten, kamu pasti bisa menaklukkannya!",
                "Mari kita mulai belajar bersama menyongsong hari esok yang cerah."
            ]
        },
        samudra: {
            mentor: "Tentor Terbaik Samudra 🐬",
            avatar: "🐬",
            dialogues: [
                "Halo anak muda, selamat datang di kedalaman Akademi Samudra.",
                "Di bawah laut ini tersimpan banyak sekali ilmu pengetahuan TKA.",
                "Kita akan menyelam bersama menembus palung-palung soal yang menantang.",
                "Semakin dalam kita menyelam dan berlatih, semakin kuat mental serta kemampuanmu.",
                "Jangan terburu-buru, nikmati arusnya, andalkan logikamu.",
                "Mari kita kayuh dayung belajarmu sekarang!"
            ]
        }
    };

    const elements = {
        progressBar: document.getElementById("progressBar"),
        loadingText: document.getElementById("loadingText"),
        loadingLogo: document.getElementById("loadingLogo"),
        pageLoading: document.getElementById("page-loading"),
        mainContent: document.getElementById("mainContent"),
        bgMusic: document.getElementById("bgMusic"),
        btnAudioToggle: document.getElementById("btnAudioToggle"),
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
    // 2. AUDIO ENGINE
    // ==========================================================================
    function triggerAudioOnInteraction() {
        if (!state.isMuted) {
            elements.bgMusic.muted = false;
            elements.bgMusic.volume = 0.4;
            elements.bgMusic.play().catch(() => {});
        }
    }

    function playSoundFX(type) {
        if (state.isMuted) return;
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            if (type === 'click') {
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(420, audioCtx.currentTime);
                gainNode.gain.setValueAtTime(0.06, audioCtx.currentTime);
                oscillator.start();
                oscillator.stop(audioCtx.currentTime + 0.08);
            } else if (type === 'popup') {
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(550, audioCtx.currentTime);
                gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
                oscillator.start();
                oscillator.stop(audioCtx.currentTime + 0.12);
            }
        } catch (e) {}
    }

    function initAudioControl() {
        elements.btnAudioToggle.addEventListener("click", () => {
            state.isMuted = !state.isMuted;
            if (state.isMuted) {
                elements.bgMusic.pause();
                elements.btnAudioToggle.innerText = "🔇";
            } else {
                elements.bgMusic.muted = false;
                elements.bgMusic.play().catch(() => {});
                elements.btnAudioToggle.innerText = "🔊";
            }
            playSoundFX('click');
        });
    }

    // ==========================================================================
    // 3. CORE MULTI-THEME REVISI ENGINE
    // ==========================================================================
    function generateBackgroundParticles(theme) {
        clearAllIntervals();
        elements.bgContainer.innerHTML = ""; 

        if (theme === "antariksa") { // TEMA: REVOLUSI GALAKSI 3D NEON
            // Bintang Kelap-Kelip Dinamis
            for (let i = 0; i < 50; i++) {
                const star = document.createElement("div");
                star.className = "star-twinkle";
                star.style.width = star.style.height = `${Math.random() * 2.8 + 1}px`;
                star.style.left = `${Math.random() * 100}vw`;
                star.style.top = `${Math.random() * 100}vh`;
                star.style.setProperty('--d', `${Math.random() * 2.5 + 1.5}s`);
                elements.bgContainer.appendChild(star);
            }

            // Kontainer Sistem Tata Surya 3D Miring
            const solarSystem = document.createElement("div");
            solarSystem.className = "system-solar-3d";
            
            const sun = document.createElement("div");
            sun.className = "sun-center-3d";
            solarSystem.appendChild(sun);

            const planetsData = [
                { size: '14px', color: '#00f3ff', glow: 'rgba(0,243,255,0.7)', orbit: '200px', speed: '12s' },
                { size: '20px', color: '#ffb703', glow: 'rgba(255,183,3,0.7)', orbit: '340px', speed: '20s' },
                { size: '16px', color: '#ff477e', glow: 'rgba(255,71,126,0.7)', orbit: '480px', speed: '28s' }
            ];

            planetsData.forEach(p => {
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

            // Spawner Komet Berjeda Acak
            const spawnMeteorStreak = () => {
                const meteor = document.createElement("div");
                meteor.className = "meteor-streak";
                const startX = Math.random() * 70 + 20;
                meteor.style.setProperty('--startX', `${startX}vw`);
                meteor.style.setProperty('--startY', `-80px`);
                meteor.style.setProperty('--endX', `${startX - 35}vw`);
                meteor.style.setProperty('--endY', `100vh`);
                meteor.style.setProperty('--dur', `${Math.random() * 0.4 + 1.0}s`);

                elements.bgContainer.appendChild(meteor);
                setTimeout(() => meteor.remove(), 1500);
            };

            const meteorSpawner = setInterval(() => {
                spawnMeteorStreak();
                if (Math.random() > 0.4) {
                    setTimeout(spawnMeteorStreak, Math.random() * 800 + 600);
                }
            }, 4000);
            themeIntervals.push(meteorSpawner);

        } else if (theme === "sakura") { // TEMA: KEMBALI KE SAKURA NEON BERGUGURAN LEBIH BANYAK & TERATUR
            const spawnSakuraPetal = (initial = false) => {
                const petal = document.createElement("div");
                petal.className = "sakura-petal";
                
                // Dimensi bervariasi teratur agar estetik
                const size = Math.random() * 12 + 10; 
                petal.style.width = `${size}px`;
                petal.style.height = `${size * 1.3}px`;
                
                petal.style.left = `${Math.random() * 100}vw`;
                
                // Durasi jatuhnya disesuaikan agar tidak seadanya, mengalir anggun
                const fallSpeed = Math.random() * 6 + 7;
                petal.style.setProperty('--speed', `${fallSpeed}s`);
                petal.style.setProperty('--sway', `${Math.random() * 150 - 75}px`);
                
                if (initial) {
                    petal.style.animationDelay = `-${Math.random() * 6}s`;
                }
                
                elements.bgContainer.appendChild(petal);
                
                setTimeout(() => petal.remove(), fallSpeed * 1000);
            };

            // Bangkitkan kelopak padat awal
            for (let i = 0; i < 25; i++) spawnSakuraPetal(true);
            
            // Interval spawner dipercepat (400ms) agar kuantitas bunga gugur banyak dan ramai
            const sakuraSpawner = setInterval(() => spawnSakuraPetal(false), 400);
            themeIntervals.push(sakuraSpawner);

        } else if (theme === "samudra") { // TEMA: SAMUDRA DEEP NEON (RAMAI GELEMBUNG & IKAN KANAN KE KIRI)
            // Melipatgandakan jumlah gelembung agar padat (75 Butir)
            for (let i = 0; i < 75; i++) {
                const bubble = document.createElement("div");
                bubble.className = "bubble-dense";
                const size = Math.random() * 9 + 3;
                bubble.style.width = bubble.style.height = `${size}px`;
                bubble.style.left = `${Math.random() * 100}vw`;
                bubble.style.setProperty('--d', `${Math.random() * 5 + 4}s`);
                bubble.style.animationDelay = `${Math.random() * 7}s`;
                elements.bgContainer.appendChild(bubble);
            }

            // Menyaring hanya ikon ikan berbentuk normal/wajar saja
            const normalFishIcons = ["🐟", "🐠"];
            
            const spawnMovingFish = (isGroup = false) => {
                const count = isGroup ? Math.floor(Math.random() * 4) + 4 : 1;
                const baseGroupY = Math.random() * 70 + 15;
                const speed = isGroup ? Math.random() * 4 + 9 : Math.random() * 4 + 6;
                
                for (let i = 0; i < count; i++) {
                    const fish = document.createElement("div");
                    fish.className = "fish-silhouette";
                    fish.innerText = normalFishIcons[Math.floor(Math.random() * normalFishIcons.length)];
                    
                    const spreadY = isGroup ? (Math.random() * 60 - 30) : 0;
                    const spreadX = isGroup ? (Math.random() * 100 - 50) : 0;
                    
                    fish.style.top = `${baseGroupY + spreadY}vh`;
                    fish.style.setProperty('--speed', `${speed}s`);
                    fish.style.setProperty('--size', isGroup ? "1.4rem" : "2.4rem");
                    
                    if (isGroup) {
                        fish.style.animationDelay = `${Math.random() * 0.4}s`;
                        // Posisi awal sebaran horizontal di kanan luar layar
                        fish.style.right = `${-100 + spreadX}px`;
                    }

                    elements.bgContainer.appendChild(fish);
                    setTimeout(() => fish.remove(), (speed * 1000) + 1000);
                }
            };

            // Panggil silih berganti secara acak waktu
            spawnMovingFish(true);
            const fishSpawner = setInterval(() => spawnMovingFish(false), 2400);
            const schoolFishSpawner = setInterval(() => spawnMovingFish(true), 7500);
            themeIntervals.push(fishSpawner, schoolFishSpawner);
        }
    }

    // ==========================================================================
    // 4. ROUTING SYSTEM
    // ==========================================================================
    function switchView(targetViewId) {
        playSoundFX('click');
        elements.pageViews.forEach(view => view.classList.remove("active-view"));
        
        const targetView = document.getElementById(targetViewId);
        if (targetView) {
            targetView.classList.add("active-view");
            state.activeView = targetViewId;
        }

        if (targetViewId === "page-narration") {
            state.narrationIndex = 0;
            startNarrationEngine();
        }
    }

    // ==========================================================================
    // 5. LOADING SYSTEM KATA-KATA BERGANTI SMOOTH
    // ==========================================================================
    const loadingPhases = [
        "Menghubungkan ke Galaksi Belajar...",
        "Menyiapkan Petualangan...",
        "Memanggil Tentor Terbaik...",
        "Menyiapkan Materi TKA...",
        "Selamat Datang..."
    ];

    function startLoadingSequence() {
        let currentPercent = 0;
        let phaseIndex = 0;

        const progressInterval = setInterval(() => {
            currentPercent += 2;
            elements.progressBar.style.width = `${currentPercent}%`;

            if (currentPercent % 20 === 0 && phaseIndex < loadingPhases.length - 1) {
                phaseIndex++;
                // Efek transisi pudar (fade out-in) yang halus, tidak patah-patah
                elements.loadingText.style.opacity = "0";
                elements.loadingText.style.transform = "translateY(5px)";
                setTimeout(() => {
                    elements.loadingText.innerText = loadingPhases[phaseIndex];
                    elements.loadingText.style.opacity = "1";
                    elements.loadingText.style.transform = "translateY(0)";
                }, 250);
            }

            if (currentPercent >= 100) {
                clearInterval(progressInterval);
                elements.loadingText.style.opacity = "0";
                
                setTimeout(() => {
                    elements.loadingText.classList.add("hidden");
                    elements.loadingLogo.classList.add("show");

                    setTimeout(() => {
                        elements.pageLoading.style.opacity = "0";
                        elements.pageLoading.style.visibility = "hidden";
                        elements.mainContent.classList.remove("hidden");
                        generateBackgroundParticles(state.currentTheme);
                    }, 1400);
                }, 400);
            }
        }, 75); 
    }

    // ==========================================================================
    // 6. MANAGEMENT TEMA
    // ==========================================================================
    function applyTheme(themeName) {
        document.body.setAttribute("data-theme", themeName);
        state.currentTheme = themeName;
        generateBackgroundParticles(themeName);

        if (themeName === "antariksa") {
            elements.avatarGraphic.innerText = "🚀";
        } else if (themeName === "sakura") {
            elements.avatarGraphic.innerText = "🌸";
        } else if (themeName === "samudra") {
            elements.avatarGraphic.innerText = "🐬";
        }
    }

    elements.themeButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            elements.themeButtons.forEach(b => b.classList.remove("active"));
            const selectedTheme = e.currentTarget.getAttribute("data-choose-theme");
            e.currentTarget.classList.add("active");
            applyTheme(selectedTheme);
            playSoundFX('click');
        });
    });

    // ==========================================================================
    // 7. DIALOGUE TYPEWRITER ENGINE
    // ==========================================================================
    let typewriterTimer;

    function runTypewriter(text, callback) {
        elements.typewriterText.innerHTML = "";
        let charIndex = 0;
        clearInterval(typewriterTimer);

        typewriterTimer = setInterval(() => {
            if (charIndex < text.length) {
                elements.typewriterText.innerHTML += text.charAt(charIndex);
                charIndex++;
            } else {
                clearInterval(typewriterTimer);
                if (callback) callback();
            }
        }, 25);
    }

    function startNarrationEngine() {
        const activeThemeData = narrationData[state.currentTheme];
        elements.mentorAvatar.innerText = activeThemeData.avatar;
        elements.mentorName.innerText = activeThemeData.mentor;
        renderDialogueStep();
    }

    function renderDialogueStep() {
        const activeThemeData = narrationData[state.currentTheme];
        let rawDialogue = activeThemeData.dialogues[state.narrationIndex];
        let customizedDialogue = rawDialogue.replace("(Nama)", state.username).replace("Nama", state.username);

        elements.btnNextNarration.classList.add("hidden");
        elements.btnSkip.classList.remove("hidden");

        runTypewriter(customizedDialogue, () => {
            elements.btnNextNarration.classList.remove("hidden");
        });
    }

    elements.btnNextNarration.addEventListener("click", () => {
        const activeThemeData = narrationData[state.currentTheme];
        state.narrationIndex++;

        if (state.narrationIndex < activeThemeData.dialogues.length) {
            renderDialogueStep();
        } else {
            switchView("page-subjects");
        }
    });

    elements.btnSkip.addEventListener("click", () => {
        switchView("page-subjects");
    });

    // ==========================================================================
    // 8. POPUP MODAL CONTROL SYSTEM
    // ==========================================================================
    function showAlertModal(title, text) {
        playSoundFX('popup');
        elements.modalTitle.innerText = title;
        elements.modalBody.innerHTML = `<p>${text}</p>`;
        elements.globalModal.classList.remove("hidden");
    }

    elements.btnModalClose.addEventListener("click", () => {
        playSoundFX('click');
        elements.globalModal.classList.add("hidden");
    });

    // ==========================================================================
    // 9. EVENT LISTENERS & INTERAKSI
    // ==========================================================================
    elements.btnStart.addEventListener("click", () => {
        const inputName = elements.usernameInput.value.trim();
        
        if (inputName === "") {
            showAlertModal("Pemberitahuan 📢", "Silakan tuliskan namamu terlebih dahulu.");
            return;
        }

        state.username = inputName;
        state.isMuted = false;
        initiateForcedPlay();

        switchView("page-narration");
    });

    function initiateForcedPlay() {
        elements.bgMusic.muted = false;
        elements.bgMusic.volume = 0.4;
        const playPromise = elements.bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                document.body.addEventListener('click', () => {
                    elements.bgMusic.play();
                }, { once: true });
            });
        }
    }

    elements.backButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            switchView(e.currentTarget.getAttribute("data-target"));
        });
    });

    elements.subjectMath.addEventListener("click", () => switchView("page-modes"));
    elements.subjectIndo.addEventListener("click", () => {
        showAlertModal("Fitur Bahasa Indonesia sedang kami siapkan.", "Mohon tunggu update berikutnya.");
    });

    elements.modeMaterial.addEventListener("click", () => {
        showAlertModal("Fitur ini sedang dalam tahap pengembangan.", "Kami akan segera menghadirkannya.");
    });

    elements.modeSimulation.addEventListener("click", () => {
        showAlertModal("Fitur simulasi sedang dipersiapkan.", "Nantikan update dari HW Les Private.");
    });

    elements.btnSetting.addEventListener("click", () => {
        playSoundFX('popup');
        elements.modalTitle.innerText = "Pusat Kontrol Website";
        elements.modalBody.innerHTML = `
            <div style="text-align:left; display:flex; flex-direction:column; gap:12px;">
                <label>🔊 <strong>Volume Musik:</strong></label>
                <input type="range" id="volumeRange" min="0" max="1" step="0.1" value="${elements.bgMusic.volume}" style="width:100%;">
                <hr style="border:0; border-top:1px solid var(--glass-border);">
                <button class="btn-secondary" id="btnFullscreenToggle" style="width:100%;">🖥️ Fullscreen Mode</button>
                <button class="btn-secondary" id="btnResetSystem" style="width:100%; color:#ff477e;">🔄 Reset App Website</button>
            </div>
        `;
        elements.globalModal.classList.remove("hidden");

        document.getElementById("volumeRange").addEventListener("input", (e) => {
            elements.bgMusic.volume = e.target.value;
        });

        document.getElementById("btnFullscreenToggle").addEventListener("click", () => {
            if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(()=>{});
            else document.exitFullscreen();
        });

        document.getElementById("btnResetSystem").addEventListener("click", () => window.location.reload());
    });

    document.body.addEventListener('click', triggerAudioOnInteraction, { once: true });

    startLoadingSequence();
    initAudioControl();
});
