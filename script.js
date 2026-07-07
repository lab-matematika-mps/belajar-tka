/**
 * WEBSITE UTAMA LATIHAN TKA - HAYAM WURUK LES PRIVATE (HW LES PRIVATE)
 * Tahun Rilis: 2026
 * Arsitektur Ter-Update: Manajemen Tema Dinamis & Autoplay Audio Engine
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

    // Database Narasi Sesuai Karakter Tema
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
            mentor: "Tentor Terbaik Langit ☁️",
            avatar: "🐱",
            dialogues: [
                "Konichiwa! Selamat datang di atas langit impian...",
                "Aku sudah menyiapkan tempat yang hangat dan banyak latihan seru untukmu.",
                "Belajar materi TKA ditemani awan yang tenang tentu sangat menyenangkan, bukan?",
                "Tarik napas dalam-dalam, tenangkan pikiranmu.",
                "Aku yakin dengan latihan konsisten, kamu pasti bisa menaklukkannya!",
                "Mari kita mulai belajar bersama menyongsong hari esok yang cerah."
            ]
        },
        samudra: {
            mentor: "Tentor Terbaik Samudra 🐢",
            avatar: "🐢",
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

    // DOM Elements Mapping
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
        
        // Narasi Elements
        mentorAvatar: document.getElementById("mentorAvatar"),
        mentorName: document.getElementById("mentorName"),
        typewriterText: document.getElementById("typewriterText"),
        btnSkip: document.getElementById("btnSkip"),
        btnNextNarration: document.getElementById("btnNextNarration"),
        
        // Navigation Back Buttons
        backButtons: document.querySelectorAll(".btn-back"),
        
        // Cards Selection
        subjectMath: document.getElementById("subjectMath"),
        subjectIndo: document.getElementById("subjectIndo"),
        modeMaterial: document.getElementById("modeMaterial"),
        modeSimulation: document.getElementById("modeSimulation"),
        
        // Modal
        globalModal: document.getElementById("globalModal"),
        modalTitle: document.getElementById("modalTitle"),
        modalBody: document.getElementById("modalBody"),
        btnModalClose: document.getElementById("btnModalClose")
    };

    // Interval timers untuk pembersihan memori background
    let themeIntervals = [];

    function clearAllIntervals() {
        themeIntervals.forEach(clearInterval);
        themeIntervals = [];
    }

    // ==========================================================================
    // 2. AUDIO ENGINE & AUTOPLAY REVOLUTION
    // ==========================================================================
    function triggerAudioOnInteraction() {
        if (!state.isMuted) {
            elements.bgMusic.muted = false;
            elements.bgMusic.volume = 0.5;
            elements.bgMusic.play().catch(e => console.log("Menunggu interaksi penuh..."));
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
                oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
                gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
                oscillator.start();
                oscillator.stop(audioCtx.currentTime + 0.08);
            } else if (type === 'popup') {
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime);
                gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
                oscillator.start();
                oscillator.stop(audioCtx.currentTime + 0.15);
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
    // 3. CORE MULTI-THEME ENGINE (GALAKSI, LANGIT, & SAMUDRA)
    // ==========================================================================
    function generateBackgroundParticles(theme) {
        clearAllIntervals();
        elements.bgContainer.innerHTML = ""; 

        if (theme === "antariksa") { // TEMA: GALAKSI
            // 1. Render Bintang Berkelip latar belakang
            for (let i = 0; i < 45; i++) {
                const star = document.createElement("div");
                star.className = "star";
                star.style.width = star.style.height = `${Math.random() * 2.5 + 1}px`;
                star.style.left = `${Math.random() * 100}vw`;
                star.style.top = `${Math.random() * 100}vh`;
                star.style.setProperty('--d', `${Math.random() * 3 + 2}s`);
                elements.bgContainer.appendChild(star);
            }

            // 2. Render Sistem Tata Surya (Matahari dikitari planet)
            const solarSystem = document.createElement("div");
            solarSystem.className = "system-solar";
            
            const sun = document.createElement("div");
            sun.className = "sun-center";
            solarSystem.appendChild(sun);

            // Buat 3 Lintasan Planet Bimasakti
            const planetsData = [
                { size: '12px', color: '#00b4d8', orbit: '160px', speed: '9s' },
                { size: '16px', color: '#ffbd00', orbit: '260px', speed: '15s' },
                { size: '14px', color: '#ff4d6d', orbit: '370px', speed: '22s' }
            ];

            planetsData.forEach(p => {
                const path = document.createElement("div");
                path.className = "orbit-line-path";
                path.style.width = path.style.height = p.orbit;
                path.style.setProperty('--speed', p.speed);

                const planet = document.createElement("div");
                planet.className = "planet-element";
                planet.style.width = planet.style.height = p.size;
                planet.style.background = p.color;

                path.appendChild(planet);
                solarSystem.appendChild(path);
            });
            elements.bgContainer.appendChild(solarSystem);

            // 3. Spawner Meteor Sesekali Berkejutan
            const meteorSpawner = setInterval(() => {
                const meteor = document.createElement("div");
                meteor.className = "meteor-random";
                const startX = Math.random() * 80 + 20; 
                meteor.style.setProperty('--startX', `${startX}vw`);
                meteor.style.setProperty('--startY', `-100px`);
                meteor.style.setProperty('--endX', `${startX - 40}vw`);
                meteor.style.setProperty('--endY', `100vh`);
                
                elements.bgContainer.appendChild(meteor);
                setTimeout(() => meteor.remove(), 1300);
            }, 3500);
            themeIntervals.push(meteorSpawner);

        } else if (theme === "sakura") { // TEMA: LANGIT
            // 1. Tambahkan 1 Matahari Terbit Elegan
            const sunRise = document.createElement("div");
            sunRise.className = "sun-rise";
            elements.bgContainer.appendChild(sunRise);

            // 2. Buat Awan Transparan Berjalan Beriringan
            const spawnCloud = (initial = false) => {
                const cloud = document.createElement("div");
                cloud.className = "cloud-transparent";
                const scale = Math.random() * 0.6 + 0.6;
                cloud.style.transform = `scale(${scale})`;
                cloud.style.top = `${Math.random() * 45 + 5}%`;
                cloud.style.setProperty('--speed', `${Math.random() * 20 + 25}s`);
                
                if (initial) {
                    cloud.style.left = `${Math.random() * 80}vw`;
                }
                elements.bgContainer.appendChild(cloud);
                
                // Hapus jika sudah keluar dari layar komputer
                if (!initial) {
                    setTimeout(() => cloud.remove(), 45000);
                }
            };

            // Spawns awal saat transparansi aktif
            for(let i=0; i<4; i++) spawnCloud(true);
            const cloudSpawner = setInterval(() => spawnCloud(false), 9000);
            themeIntervals.push(cloudSpawner);

        } else if (theme === "samudra") { // TEMA: SAMUDRA
            // 1. Gelembung Air Alami
            for (let i = 0; i < 20; i++) {
                const bubble = document.createElement("div");
                bubble.className = "bubble-element";
                const size = Math.random() * 12 + 4;
                bubble.style.width = bubble.style.height = `${size}px`;
                bubble.style.left = `${Math.random() * 100}vw`;
                bubble.style.setProperty('--d', `${Math.random() * 4 + 4}s`);
                bubble.style.animationDelay = `${Math.random() * 5}s`;
                elements.bgContainer.appendChild(bubble);
            }

            // 2. Pembuat Gerombolan & Ikan Berkejaran Acak
            const fishTypes = ["🐟", "🐠", "🐡", "🦑"];
            const spawnFish = (isGerombolan = false) => {
                const fishCount = isGerombolan ? Math.floor(Math.random() * 4) + 4 : 1;
                const baseGroupY = Math.random() * 70 + 15;
                const speed = isGerombolan ? Math.random() * 4 + 7 : Math.random() * 3 + 4; // Kejar-kejaran lebih cepat
                
                for (let i = 0; i < fishCount; i++) {
                    const fish = document.createElement("div");
                    fish.className = "fish-swim";
                    fish.innerText = fishTypes[Math.floor(Math.random() * fishTypes.length)];
                    
                    const spreadY = isGerombolan ? (Math.random() * 60 - 30) : 0;
                    const spreadX = isGerombolan ? (Math.random() * 80 - 40) : 0;
                    
                    fish.style.setProperty('--y', `${baseGroupY + spreadY}vh`);
                    fish.style.setProperty('--y2', `${baseGroupY + spreadY + (Math.random() * 10 - 5)}vh`);
                    fish.style.setProperty('--speed', `${speed}s`);
                    fish.style.setProperty('--size', isGerombolan ? "1.5rem" : "2.2rem");
                    fish.style.setProperty('--dir', "1"); // Arah berenang ke kanan
                    
                    if (isGerombolan) {
                        fish.style.animationDelay = `${Math.random() * 0.5}s`;
                        fish.style.left = `${-80 + spreadX}px`;
                    }

                    elements.bgContainer.appendChild(fish);
                    setTimeout(() => fish.remove(), (speed * 1000) + 1000);
                }
            };

            // Loop Spawner Ikan Mandiri & Gerombolan berkala
            spawnFish(true); // langsung panggil gerombolan pertama
            const fishSpawner = setInterval(() => spawnFish(false), 2000);
            const schoolFishSpawner = setInterval(() => spawnFish(true), 6500);
            themeIntervals.push(fishSpawner, schoolFishSpawner);
        }
    }

    // ==========================================================================
    // 4. ROUTING SYSTEM (PERPINDAHAN HALAMAN HALUS)
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
    // 5. HALAMAN 0: PROSES LOADING SEQUENCE
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
                elements.loadingText.style.opacity = 0;
                setTimeout(() => {
                    elements.loadingText.innerText = loadingPhases[phaseIndex];
                    elements.loadingText.style.opacity = 1;
                }, 200);
            }

            if (currentPercent >= 100) {
                clearInterval(progressInterval);
                elements.loadingText.classList.add("hidden");
                elements.loadingLogo.classList.add("show");

                setTimeout(() => {
                    elements.pageLoading.style.opacity = 0;
                    elements.pageLoading.style.visibility = "hidden";
                    elements.mainContent.classList.remove("hidden");
                    generateBackgroundParticles(state.currentTheme);
                }, 1300);
            }
        }, 80); 
    }

    // ==========================================================================
    // 6. MANAGEMENT TEMA & AVATAR DINAMIS
    // ==========================================================================
    function applyTheme(themeName) {
        document.body.setAttribute("data-theme", themeName);
        state.currentTheme = themeName;
        generateBackgroundParticles(themeName);

        if (themeName === "antariksa") {
            elements.avatarGraphic.innerText = "🚀";
        } else if (themeName === "sakura") {
            elements.avatarGraphic.innerText = "☁️";
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
    // 7. DIALOGUE TYPEWRITER ENGINE (HALAMAN 2)
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
        }, 30);
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
    // 9. EVENT LISTENERS & LOGIKA INTERAKSI
    // ==========================================================================
    elements.btnStart.addEventListener("click", () => {
        const inputName = elements.usernameInput.value.trim();
        
        if (inputName === "") {
            showAlertModal("Pemberitahuan 📢", "Silakan tuliskan namamu terlebih dahulu.");
            return;
        }

        state.username = inputName;
        
        // REVOLUSI AUTOPLAY: Sekali klik tombol mulai belajar, instrumen langsung dipaksa berbunyi!
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
                // Atasi pengaman sisa jika browser super protektif
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

    // Panel Pengaturan Tombol Gear
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

    // Pemicu interaksi global cadangan untuk meloloskan aturan keras browser
    document.body.addEventListener('click', triggerAudioOnInteraction, { once: true });

    // RUNNER UTAMA
    startLoadingSequence();
    initAudioControl();
});
