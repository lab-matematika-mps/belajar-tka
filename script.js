/**
 * WEBSITE UTAMA LATIHAN TKA - HAYAM WURUK LES PRIVATE (HW LES PRIVATE)
 * Edisi Pembaruan: Dua Kotak Terpisah, Scroll Tema, & Perbaikan Spasi Narasi
 */
document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. STATE & KONFIGURASI GLOBAL
    // ==========================================
    const state = {
        username: "",
        currentTheme: "galaksi",
        isMuted: false,
        activeView: "page-menu",
        narrationIndex: 0
    };

    // Data Narasi Lore Asal-mula tiap dunia pada Tampilan Awal
    const themeLoreData = {
        galaksi: "Mengorbit di ruang angkasa luas penuh misteri rumus-rumus bintang bersinar. Bersiaplah meluncur menembus batas logika sains matematika!",
        langit: "Terbang tinggi di atas awan putih lembut berembus sepoi kelopak sakura. Belajar dengan hati tenang, memetik rumus indah sehangat mentari pagi.",
        samudra: "Menyelam jauh ke kedalaman palung misterius tempat tersimpannya mutiara ilmu pengetahuan kuno. Kuatkan fokus pikiranmu menembus derasnya arus soal."
    };

    // Data Dialogue Mentor Halaman 2 (Spasi Diperbaiki)
    const narrationData = {
        galaksi: {
            mentor: "Tentor Terbaik Galaksi 🚀",
            avatar: "🚀",
            dialogues: [
                "Halo, Petualang Hebat! Selamat datang di markas ruang angkasa kita.",
                "Aku sudah menunggumu di pusat kendali radar konstelasi ini.",
                "Hari ini kita akan menjelajahi Galaksi TKA yang sangat menantang.",
                "Setiap latihan soal yang kamu kerjakan akan membuat mesin roketmu semakin kuat.",
                "Jangan pernah takut salah dalam melangkah ya!",
                "Kesalahan adalah bahan bakar roket terbaikmu menuju keberhasilan. Ayo kita luncurkan sekarang!"
            ]
        },
        langit: {
            mentor: "Tentor Terbaik Langit ☁️",
            avatar: "☁️",
            dialogues: [
                "Selamat datang di taman belajar awan sakura yang indah...",
                "Aku sudah menyiapkan tempat duduk yang hangat dan penuh ketenangan untukmu.",
                "Belajar materi hitungan TKA ditemani kelopak bunga berguguran tentu sangat menyenangkan, bukan?",
                "Tarik napas dalam-dalam, tenangkan barisan pikiranmu.",
                "Aku yakin dengan latihan yang konsisten, kamu pasti bisa menaklukkannya dengan mudah!",
                "Mari kita mulai lembaran belajar bersama menyongsong hari esok yang cerah."
            ]
        },
        samudra: {
            mentor: "Tentor Terbaik Samudra 🐬",
            avatar: "🐬",
            dialogues: [
                "Halo anak muda, selamat datang di kedalaman Akademi Kerajaan Samudra.",
                "Di bawah perlindungan laut ini tersimpan rahasia taktik ilmu pengetahuan TKA.",
                "Kita akan menyelam bersama menembus pusaran arus soal-soal matematika yang menantang.",
                "Semakin dalam kita menyelam dan berlatih, semakin kokoh mental serta ketangkasan logikamu.",
                "Jangan terburu-buru, nikmati alur gelombangnya, andalkan insting rumasmu.",
                "Mari kita kayuh dayung petualangan belajarmu sekarang juga!"
            ]
        }
    };

    const elements = {
        progressBar: document.getElementById("progressBar"),
        loadingText: document.getElementById("loadingText"),
        pageLoading: document.getElementById("page-loading"),
        mainContent: document.getElementById("mainContent"),
        bgMusic: document.getElementById("bgMusic"),
        themeButtons: document.querySelectorAll("[data-choose-theme]"),
        themeLoreText: document.getElementById("themeLoreText"),
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

    // ==========================================
    // 2. SISTEM LOADING SCREEN UTAMA
    // ==========================================
    function startLoadingSequence() {
        // Rentetan kata-kata sesuai instruksi, diakhiri nama instansi
        const loadingPhrases = [
            { time: 0, text: "Menghubungkan ke Galaksi Belajar..." },
            { time: 15, text: "Menyiapkan Petualangan Dunia..." },
            { time: 35, text: "Memanggil Mentor Ahli..." },
            { time: 55, text: "Menyusun Bank Materi TKA..." },
            { time: 75, text: "Sinkronisasi Peta Belajar..." },
            { time: 90, text: "Selamat Datang di HW Les Private" }
        ];

        let progress = 0;
        const interval = setInterval(() => {
            progress += 1;
            if (elements.progressBar) elements.progressBar.style.width = `${progress}%`;

            // Cek perubahan teks frase secara real-time berdasarkan persentase loading
            const match = loadingPhrases.find(p => p.time === progress);
            if (match && elements.loadingText) {
                elements.loadingText.innerText = match.text;
            }

            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    if (elements.pageLoading) {
                        elements.pageLoading.style.opacity = "0";
                        elements.pageLoading.style.transform = "scale(0.97)";
                        setTimeout(() => {
                            elements.pageLoading.classList.add("hidden");
                            if (elements.mainContent) elements.mainContent.classList.remove("hidden");
                            // Triggers autoplay audio
                            if (!state.isMuted && elements.bgMusic) {
                                elements.bgMusic.volume = 0.35;
                                elements.bgMusic.play().catch(() => {});
                            }
                        }, 600);
                    }
                }, 400);
            }
        }, 55); // Durasi loading bertambah anggun sesuai permintaan (~5.5 detik)
    }

    // ==========================================
    // 3. CORE MANAGEMENT TEMA & PARSE LORE
    // ==========================================
    function applyTheme(themeName) {
        document.body.setAttribute("data-theme", themeName);
        state.currentTheme = themeName;
        
        // Update Lore Asal Mula Dunia Real-time
        if (elements.themeLoreText) {
            elements.themeLoreText.innerText = themeLoreData[themeName];
        }

        // Ubah Grafis Avatar Tampilan Utama
        if (elements.avatarGraphic) {
            if (themeName === "galaksi") elements.avatarGraphic.innerText = "🚀";
            else if (themeName === "langit") elements.avatarGraphic.innerText = "☁️";
            else if (themeName === "samudra") elements.avatarGraphic.innerText = "🐬";
        }
    }

    // ==========================================
    // 4. ANIMASI TYPEWRITER TEXT (EFEK SPASI AMAN)
    // ==========================================
    let typewriterTimer = null;
    function typeWriterEffect(text, index = 0) {
        if (index === 0) {
            elements.typewriterText.innerHTML = "";
            elements.btnNextNarration.classList.add("hidden");
        }
        
        if (index < text.length) {
            // Pengamanan karakter spasi agar dicetak utuh tanpa menyatu kaku
            if (text[index] === " ") {
                elements.typewriterText.innerHTML += "&nbsp;";
            } else {
                elements.typewriterText.innerText += text[index];
            }
            
            typewriterTimer = setTimeout(() => {
                typeWriterEffect(text, index + 1);
            }, 25);
        } else {
            elements.btnNextNarration.classList.remove("hidden");
        }
    }

    function showNextDialogue() {
        clearTimeout(typewriterTimer);
        const currentData = narrationData[state.currentTheme];
        
        if (state.narrationIndex < currentData.dialogues.length) {
            if (elements.mentorName) elements.mentorName.innerText = currentData.mentor;
            if (elements.mentorAvatar) elements.mentorAvatar.innerText = currentData.avatar;
            
            typeWriterEffect(currentData.dialogues[state.narrationIndex]);
            state.narrationIndex++;
        } else {
            switchView("page-subjects");
        }
    }

    // ==========================================
    // 5. SISTEM NAVIGASI HALAMAN (SPA MURNI)
    // ==========================================
    function switchView(targetViewId) {
        elements.pageViews.forEach(view => {
            view.classList.add("hidden");
            view.classList.remove("active");
        });
        const targetView = document.getElementById(targetViewId);
        if (targetView) {
            targetView.classList.remove("hidden");
            targetView.classList.add("active");
            state.activeView = targetViewId;
        }

        // Jika masuk halaman narasi cerita, reset index dialog dari awal
        if (targetViewId === "page-narration") {
            state.narrationIndex = 0;
            showNextDialogue();
        }
    }

    // Modal Alert Global
    function showAlertModal(title, body) {
        if (elements.modalTitle) elements.modalTitle.innerText = title;
        if (elements.modalBody) elements.modalBody.innerHTML = `<p>${body}</p>`;
        if (elements.globalModal) elements.globalModal.classList.remove("hidden");
    }

    // ==========================================
    // 6. EVENT LISTENERS & INITIALIZATION
    // ==========================================
    // Klik Tombol Ganti Tema Petualangan
    elements.themeButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            elements.themeButtons.forEach(b => b.classList.remove("active"));
            const selectedBtn = e.currentTarget;
            selectedBtn.classList.add("active");
            applyTheme(selectedBtn.getAttribute("data-choose-theme"));
        });
    });

    // Tombol Mulai Belajar (Validasi Input Nama)
    if (elements.btnStart) {
        elements.btnStart.addEventListener("click", () => {
            const name = elements.usernameInput.value.trim();
            if (name === "") {
                showAlertModal("Akses Ditolak", "Silakan masukkan namamu terlebih dahulu untuk memulai petualangan!");
                return;
            }
            state.username = name;
            switchView("page-narration");
        });
    }

    // Kontrol Navigasi Dialog Cerita
    if (elements.btnNextNarration) elements.btnNextNarration.addEventListener("click", showNextDialogue);
    if (elements.btnSkip) elements.btnSkip.addEventListener("click", () => switchView("page-subjects"));

    // Tombol Kembali Global
    elements.backButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            switchView(e.currentTarget.getAttribute("data-target"));
        });
    });

    // Event Pengunci Pilihan Materi Matematika & Kunci Bahasa Indonesia
    if (elements.subjectMath) elements.subjectMath.addEventListener("click", () => switchView("page-modes"));
    if (elements.subjectIndo) {
        elements.subjectIndo.addEventListener("click", () => {
            showAlertModal("Zona Terkunci", "Materi Bahasa Indonesia sedang dipersiapkan oleh tim guru hebat HW Les Private.");
        });
    }
    if (elements.modeMaterial) {
        elements.modeMaterial.addEventListener("click", () => {
            showAlertModal("Dalam Pengembangan", "Sistem bank soal per materi sedang dirakit. Mohon nantikan update berikutnya!");
        });
    }
    if (elements.modeSimulation) {
        elements.modeSimulation.addEventListener("click", () => {
            showAlertModal("Pusat Simulasi", "Uji coba simulasi TKA berwaktu akan segera hadir secara serentak.");
        });
    }

    // Pengaturan Modal Tutup & Autoplay Sound Interaction Fallback
    if (elements.btnModalClose) elements.btnModalClose.addEventListener("click", () => elements.globalModal.classList.add("hidden"));
    window.addEventListener("click", () => {
        if (!state.isMuted && elements.bgMusic && elements.bgMusic.paused && !elements.mainContent.classList.contains("hidden")) {
            elements.bgMusic.play().catch(() => {});
        }
    }, { once: true });

    // Jalankan Website
    applyTheme("galaksi");
    startLoadingSequence();
});
