/**
 * REVISI FINAL WEBSITE LATIHAN TKA - HW LES PRIVATE
 */
document.addEventListener("DOMContentLoaded", () => {

    const state = {
        username: "",
        currentTheme: "galaksi",
        isMuted: false,
        soundFXEnabled: true,
        volume: 0.4,
        narrationIndex: 0
    };

    const worldLoreData = {
        galaksi: "Asal-Usul: Kamu berada di pusat rasi bintang kecerdasan Hayam Wuruk. Konon, anak-anak bumi terpilih dilatih di galaksi ini agar memiliki pikiran secepat komet!",
        langit: "Asal-Usul: Di atas awan senja Jepang, terdapat pulau melayang tempat tinggal Kucing Sakura. Tempat damai ini dirancang khusus untuk mengasah ketenangan berpikir.",
        samudra: "Asal-Usul: Di kedalaman samudra biru yang tenang, berdiri benteng mutiara kuno. Penyu bijaksana menjaga gerbang ilmu matematika rahasia purba."
    };

    const narrationData = {
        galaksi: [
            "Halo, (Nama)! Selamat datang di jembatan komando kapal ruang angkasa kita.",
            "Hari ini misi kita adalah menembus koordinat sabuk meteor ujian TKA.",
            "Jangan takut salah ya! Setiap coretan salahmu adalah batu loncatan berharga menuju bintang prestasi tertinggi. Ayo siap meluncur!"
        ],
        langit: [
            "Halo, sahabat kecilku (Nama)... Senang sekali kamu bisa sampai ke atas awan indah ini.",
            "Sambil menikmati keindahan kelopak sakura yang menari, mari kita asah ketajaman otak kita.",
            "Tenang, rileks, fokus. Bersama-sama, tidak ada soal matematika yang terlalu sulit bagi kita!"
        ],
        samudra: [
            "Selamat datang penyelam tangguh, (Nama)! Kamu telah sampai di dasar laut terdalam.",
            "Di bawah sini tidak ada tekanan, yang ada hanyalah aliran arus ilmu yang melimpah.",
            "Semakin banyak latihan yang kamu selami, semakin kuat napas pengetahuanmu menghadapi ujian asli nanti."
        ]
    };

    const loadingPhases = [
        "Menghubungkan ke Galaksi Belajar...",
        "Menyiapkan Tentor Terbaik...",
        "Menghubungkan ke HW Les Private...",
        "Menyiapkan Materi TKA...",
        "Hampir Selesai...",
        "Selamat Datang di HW Les Private!"
    ];

    const elements = {
        progressBar: document.getElementById("progressBar"),
        loadingText: document.getElementById("loadingText"),
        pageLoading: document.getElementById("page-loading"),
        mainContent: document.getElementById("mainContent"),
        bgMusic: document.getElementById("bgMusic"),
        btnSetting: document.getElementById("btnSetting"),
        themeButtons: document.querySelectorAll("[data-choose-theme]"),
        avatarGraphic: document.getElementById("avatarGraphic"),
        usernameInput: document.getElementById("usernameInput"),
        btnStart: document.getElementById("btnStart"),
        pageViews: document.querySelectorAll(".page-view"),
        bgContainer: document.getElementById("bgContainer"),
        loreBox: document.getElementById("loreBox"),
        mentorAvatar: document.getElementById("mentorAvatar"),
        mentorName: document.getElementById("mentorName"),
        typewriterText: document.getElementById("typewriterText"),
        btnSkip: document.getElementById("btnSkip"),
        btnNextNarration: document.getElementById("btnNextNarration"),
        globalModal: document.getElementById("globalModal"),
        modalTitle: document.getElementById("modalTitle"),
        modalBody: document.getElementById("modalBody"),
        btnModalClose: document.getElementById("btnModalClose"),
        subjectMath: document.getElementById("subjectMath"),
        subjectIndo: document.getElementById("subjectIndo"),
        modeMaterial: document.getElementById("modeMaterial"),
        modeSimulation: document.getElementById("modeSimulation")
    };

    let backgroundTimers = [];
    function stopBackgroundTimers() {
        backgroundTimers.forEach(clearInterval);
        backgroundTimers = [];
    }

    // ==========================================
    // ENGINE AUDIO (AUTOPLAY FALLBACK)
    // ==========================================
    function setupAudioEngine() {
        elements.bgMusic.volume = state.volume;
        const startPlay = elements.bgMusic.play();
        if (startPlay !== undefined) {
            startPlay.catch(() => {
                document.addEventListener('click', () => { elements.bgMusic.play().catch(()=>{}); }, { once: true });
            });
        }
    }

    // ==========================================
    // DRAW LIVE ENGINE BACKGROUNDS
    // ==========================================
    function createLiveBackground(theme) {
        stopBackgroundTimers();
        elements.bgContainer.innerHTML = "";

        if (theme === "galaksi") {
            const colors = ["#ffffff", "#fffae0", "#e0f2fe", "#f5d0fe"];
            for (let i = 0; i < 60; i++) {
                const star = document.createElement("div");
                star.className = "star-twinkle";
                const size = Math.random() * 2 + 1;
                star.style.width = `${size}px`;
                star.style.height = `${size}px`;
                star.style.background = colors[Math.floor(Math.random() * colors.length)];
                star.style.left = `${Math.random() * 100}vw`;
                star.style.top = `${Math.random() * 100}vh`;
                star.style.setProperty('--d', `${Math.random() * 2 + 1}s`);
                elements.bgContainer.appendChild(star);
            }

            // Orbit Melingkar Proporsional Sempurna
            const centerPoint = document.createElement("div");
            centerPoint.className = "galaxy-orbit-line";
            centerPoint.style.width = "0px"; centerPoint.style.height = "0px";
            centerPoint.style.top = "30%"; centerPoint.style.left = "30%";
            
            const orbits = [
                { r: "100px", size: "12px", col: "#ffbc42", speed: "12s" },
                { r: "180px", size: "16px", col: "#00f3ff", speed: "20s" },
                { r: "260px", size: "20px", col: "#ff5c8a", speed: "28s" }
            ];

            orbits.forEach(o => {
                const line = document.createElement("div");
                line.className = "galaxy-orbit-line";
                line.style.width = line.style.height = o.r;
                line.style.setProperty('--speed', o.speed);

                const body = document.createElement("div");
                body.className = "orbit-planet-body";
                body.style.width = body.style.height = o.size;
                body.style.background = o.col;
                body.style.setProperty('--glow', `0 0 10px ${o.col}`);

                line.appendChild(body);
                elements.bgContainer.appendChild(line);
            });

        } else if (theme === "langit") {
            const spawnSakura = () => {
                const petal = document.createElement("div");
                petal.className = "sakura-petal";
                const size = Math.random() * 8 + 8;
                petal.style.width = `${size}px`; petal.style.height = `${size * 1.2}px`;
                petal.style.left = `${Math.random() * 100}vw`;
                const d = Math.random() * 4 + 5;
                petal.style.setProperty('--speed', `${d}s`);
                petal.style.setProperty('--sway', `${Math.random() * 100 - 50}px`);
                elements.bgContainer.appendChild(petal);
                setTimeout(() => petal.remove(), d * 1000);
            };
            const timer = setInterval(spawnSakura, 400);
            backgroundTimers.push(timer);

        } else if (theme === "samudra") {
            const spawnBubble = () => {
                const bubble = document.createElement("div");
                bubble.className = "bubble-dense";
                const size = Math.random() * 7 + 3;
                bubble.style.width = bubble.style.height = `${size}px`;
                bubble.style.left = `${Math.random() * 100}vw`;
                const d = Math.random() * 3 + 4;
                bubble.style.setProperty('--d', `${d}s`);
                bubble.style.setProperty('--sway', `${Math.random() * 60 - 30}px`);
                elements.bgContainer.appendChild(bubble);
                setTimeout(() => bubble.remove(), d * 1000);
            };
            const timer = setInterval(spawnBubble, 200);
            backgroundTimers.push(timer);
        }
    }

    // ==========================================
    // LOADING MECHANICS
    // ==========================================
    function startLoadingSequence() {
        let currentProgress = 0;
        let phaseIndex = 0;

        const loadingTimer = setInterval(() => {
            currentProgress += 1;
            elements.progressBar.style.width = `${currentProgress}%`;

            if (currentProgress % 17 === 0 && phaseIndex < loadingPhases.length - 1) {
                phaseIndex++;
                elements.loadingText.style.opacity = "0";
                setTimeout(() => {
                    elements.loadingText.innerText = loadingPhases[phaseIndex];
                    elements.loadingText.style.opacity = "1";
                }, 300);
            }

            if (currentProgress >= 100) {
                clearInterval(loadingTimer);
                setTimeout(() => {
                    elements.pageLoading.style.opacity = "0";
                    setTimeout(() => {
                        elements.pageLoading.classList.add("hidden");
                        elements.mainContent.classList.remove("hidden");
                        createLiveBackground(state.currentTheme);
                    }, 600);
                }, 400);
            }
        }, 50);
    }

    // ==========================================
    // NAVIGATION SYSTEM & TYPEWRITER DIALOGUE
    // ==========================================
    function viewTransition(targetId) {
        elements.pageViews.forEach(v => v.classList.add("hidden"));
        document.getElementById(targetId).classList.remove("hidden");
        state.activeView = targetId;

        if (targetId === "page-narration") {
            initNarrationScreen();
        }
    }

    function initNarrationScreen() {
        state.narrationIndex = 0;
        elements.loreBox.innerText = worldLoreData[state.currentTheme];
        elements.btnNextNarration.classList.add("hidden");
        elements.btnSkip.classList.remove("hidden");

        const mentors = { galaksi: "Tentor Astronot Galaksi 🚀", langit: "Tentor Kucing Sakura 🐱", samudra: "Tentor Penyu Bijak 🐬" };
        const emojis = { galaksi: "🚀", langit: "🐱", samudra: "🐬" };
        
        elements.mentorName.innerText = mentors[state.currentTheme];
        elements.mentorAvatar.innerText = emojis[state.currentTheme];

        typewriterWrite(narrationData[state.currentTheme][0]);
    }

    let writeTimer = null;
    function typewriterWrite(text) {
        clearInterval(writeTimer);
        elements.typewriterText.innerText = "";
        let index = 0;
        // Penempatan Spasi & Penggantian Token Nama Terkalibrasi Rapi
        const parsedText = text.replace("(Nama)", state.username);

        writeTimer = setInterval(() => {
            elements.typewriterText.innerText += parsedText.charAt(index);
            index++;
            if (index >= parsedText.length) {
                clearInterval(writeTimer);
                showNarrationControl();
            }
        }, 30);
    }

    function showNarrationControl() {
        const total = narrationData[state.currentTheme].length;
        if (state.narrationIndex < total - 1) {
            elements.btnNextNarration.innerText = "Lanjutkan ➡️";
        } else {
            elements.btnNextNarration.innerText = "Mulai Latihan TKA! 🎯";
        }
        elements.btnNextNarration.classList.remove("hidden");
    }

    // ==========================================
    // CLICK ACTION LISTENERS
    // ==========================================
    elements.themeButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            elements.themeButtons.forEach(b => b.classList.remove("active"));
            e.currentTarget.classList.add("active");
            
            const theme = e.currentTarget.getAttribute("data-choose-theme");
            state.currentTheme = theme;
            document.body.setAttribute("data-theme", theme);

            const avatars = { galaksi: "🚀", langit: "🐱", samudra: "🐬" };
            elements.avatarGraphic.innerText = avatars[theme];

            createLiveBackground(theme);
        });
    });

    elements.btnStart.addEventListener("click", () => {
        const name = elements.usernameInput.value.trim();
        if (!name) {
            elements.modalTitle.innerText = "Perhatian ⚠️";
            elements.modalBody.innerHTML = "<p>Silakan tuliskan namamu terlebih dahulu.</p>";
            elements.globalModal.classList.remove("hidden");
            return;
        }
        state.username = name;
        viewTransition("page-narration");
    });

    elements.btnNextNarration.addEventListener("click", () => {
        state.narrationIndex++;
        const currentList = narrationData[state.currentTheme];
        if (state.narrationIndex < currentList.length) {
            elements.btnNextNarration.classList.add("hidden");
            typewriterWrite(currentList[state.narrationIndex]);
        } else {
            viewTransition("page-subjects");
        }
    });

    elements.btnSkip.addEventListener("click", () => {
        clearInterval(writeTimer);
        viewTransition("page-subjects");
    });

    // Event Handler Halaman Menu Materi & Pop-up
    elements.subjectMath.addEventListener("click", () => viewTransition("page-modes"));
    elements.subjectIndo.addEventListener("click", () => {
        elements.modalTitle.innerText = "Bahasa Indonesia 📖";
        elements.modalBody.innerHTML = "<p>Fitur Bahasa Indonesia sedang kami siapkan.<br>Mohon tunggu update berikutnya.</p>";
        elements.globalModal.classList.remove("hidden");
    });
    elements.modeMaterial.addEventListener("click", () => {
        elements.modalTitle.innerText = "Latihan per Materi 📚";
        elements.modalBody.innerHTML = "<p>Fitur ini sedang dalam tahap pengembangan.<br>Kami akan segera menghadirkannya.</p>";
        elements.globalModal.classList.remove("hidden");
    });
    elements.modeSimulation.addEventListener("click", () => {
        elements.modalTitle.innerText = "Simulasi TKA 🏆";
        elements.modalBody.innerHTML = "<p>Fitur simulasi sedang dipersiapkan.<br>Nantikan update dari HW Les Private.</p>";
        elements.globalModal.classList.remove("hidden");
    });

    document.querySelectorAll(".btn-back").forEach(btn => {
        btn.addEventListener("click", (e) => viewTransition(e.currentTarget.getAttribute("data-target")));
    });

    elements.btnModalClose.addEventListener("click", () => elements.globalModal.classList.add("hidden"));

    // Settings Panel
    elements.btnSetting.addEventListener("click", () => {
        elements.modalTitle.innerText = "Pengaturan Web ⚙️";
        elements.modalBody.innerHTML = `
            <p style='margin-bottom:10px;'>Atur kenyamanan bermain sambil belajarmu disini:</p>
            <button class='btn-secondary-neon' style='width:100%; margin-bottom:8px;' onclick='window.location.reload()'>🔄 Reset Website</button>
            <button class='btn-secondary-neon' style='width:100%;' onclick='if(!document.fullscreenElement){document.documentElement.requestFullscreen()}else{document.exitFullscreen()}'>🖥️ Layar Penuh</button>
        `;
        elements.globalModal.classList.remove("hidden");
    });

    setupAudioEngine();
    startLoadingSequence();
});
