document.addEventListener("DOMContentLoaded", () => {
    const state = {
        username: "", currentTheme: "antariksa", isMuted: false, activeView: "page-menu", narrationIndex: 0
    };

    const narrationData = {
        antariksa: {
            mentor: "Astronot Alva 🚀", avatar: "🚀",
            dialogues: [
                "Halo, Petualang Hebat!", "Aku sudah menunggumu di pusat kendali ini.",
                "Hari ini kita akan menjelajahi Galaksi TKA yang sangat menantang.",
                "Setiap latihan soal yang kamu kerjakan akan membuat tokomu semakin kuat.",
                "Jangan pernah takut salah ya!", "Kesalahan adalah bahan bakar roketmu menuju keberhasilan. Ayo kita luncurkan!"
            ]
        },
        sakura: {
            mentor: "Neko Sensei 🐱", avatar: "🐱",
            dialogues: [
                "Konichiwa! Halo sahabat belajar...", "Aku sudah menyiapkan tempat yang hangat dan banyak latihan seru untukmu.",
                "Belajar materi TKA sambil menikmati guguran bunga sakura tentu sangat menyenangkan, bukan?",
                "Tarik napas dalam-dalam, tenangkan pikiranmu.", "Aku yakin dengan latihan konsisten, kamu pasti bisa menaklukkannya!",
                "Mari kita mulai belajar bersama di bawah pohon sakura ini."
            ]
        },
        samudra: {
            mentor: "Kura-Kura Bijak 🐢", avatar: "🐢",
            dialogues: [
                "Halo anak muda, selamat datang di kedalaman Akademi Samudra.", "Di bawah laut ini tersimpan banyak sekali ilmu pengetahuan TKA.",
                "Kita akan menyelam bersama menembus palung-palung soal yang menantang.",
                "Semakin dalam kita menyelam dan berlatih, semakin kuat mental serta kemampuanmu.",
                "Jangan terburu-buru, nikmati arusnya, andalkan logikamu.", "Mari kita kayuh dayung belajarmu sekarang!"
            ]
        }
    };

    const elements = {
        progressBar: document.getElementById("progressBar"), loadingText: document.getElementById("loadingText"),
        loadingLogo: document.getElementById("loadingLogo"), pageLoading: document.getElementById("page-loading"),
        mainContent: document.getElementById("mainContent"), bgMusic: document.getElementById("bgMusic"),
        btnAudioToggle: document.getElementById("btnAudioToggle"), btnSetting: document.getElementById("btnSetting"),
        themeButtons: document.querySelectorAll("[data-choose-theme]"), avatarGraphic: document.getElementById("avatarGraphic"),
        usernameInput: document.getElementById("usernameInput"), btnStart: document.getElementById("btnStart"),
        pageViews: document.querySelectorAll(".page-view"), bgContainer: document.getElementById("bgContainer"),
        mentorAvatar: document.getElementById("mentorAvatar"), mentorName: document.getElementById("mentorName"),
        typewriterText: document.getElementById("typewriterText"), btnSkip: document.getElementById("btnSkip"),
        btnNextNarration: document.getElementById("btnNextNarration"), backButtons: document.querySelectorAll(".btn-back"),
        subjectMath: document.getElementById("subjectMath"), subjectIndo: document.getElementById("subjectIndo"),
        modeMaterial: document.getElementById("modeMaterial"), modeSimulation: document.getElementById("modeSimulation"),
        globalModal: document.getElementById("globalModal"), modalTitle: document.getElementById("modalTitle"),
        modalBody: document.getElementById("modalBody"), btnModalClose: document.getElementById("btnModalClose")
    };

    function playSoundFX(type) {
        if (state.isMuted) return;
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            oscillator.connect(gainNode); gainNode.connect(audioCtx.destination);
            if (type === 'click') {
                oscillator.type = 'sine'; oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
                gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime); oscillator.start(); oscillator.stop(audioCtx.currentTime + 0.1);
            } else if (type === 'popup') {
                oscillator.type = 'triangle'; oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime);
                gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime); oscillator.start(); oscillator.stop(audioCtx.currentTime + 0.15);
            }
        } catch (e) {}
    }

    function initAudioControl() {
        elements.btnAudioToggle.addEventListener("click", () => {
            state.isMuted = !state.isMuted;
            if (state.isMuted) { elements.bgMusic.pause(); elements.btnAudioToggle.innerText = "🔇"; }
            else { elements.bgMusic.play().catch(() => {}); elements.btnAudioToggle.innerText = "🔊"; }
            playSoundFX('click');
        });
    }

    function generateBackgroundParticles(theme) {
        elements.bgContainer.innerHTML = "";
        if (theme === "antariksa") {
            for (let i = 0; i < 40; i++) {
                const star = document.createElement("div"); star.className = "star";
                star.style.width = star.style.height = `${Math.random() * 3 + 1}px`;
                star.style.left = `${Math.random() * 100}vw`; star.style.top = `${Math.random() * 100}vh`;
                star.style.setProperty('--d', `${Math.random() * 3 + 2}s`); elements.bgContainer.appendChild(star);
            }
            const meteor = document.createElement("div"); meteor.className = "meteor-element"; elements.bgContainer.appendChild(meteor);
        } else if (theme === "sakura") {
            for (let i = 0; i < 25; i++) {
                const petal = document.createElement("div"); petal.className = "sakura-petal";
                petal.style.width = `${Math.random() * 12 + 6}px`; petal.style.height = `${Math.random() * 8 + 5}px`;
                petal.style.setProperty('--x', `${Math.random() * 100}vw`); petal.style.setProperty('--d', `${Math.random() * 5 + 4}s`);
                petal.style.animationDelay = `${Math.random() * 5}s`; elements.bgContainer.appendChild(petal);
            }
        } else if (theme === "samudra") {
            for (let i = 0; i < 30; i++) {
                const bubble = document.createElement("div"); bubble.className = "bubble-element";
                const size = Math.random() * 15 + 5; bubble.style.width = bubble.style.height = `${size}px`;
                bubble.style.left = `${Math.random() * 100}vw`; bubble.style.setProperty('--d', `${Math.random() * 4 + 3}s`);
                bubble.style.animationDelay = `${Math.random() * 4}s`; elements.bgContainer.appendChild(bubble);
            }
        }
    }

    function switchView(targetViewId) {
        playSoundFX('click');
        elements.pageViews.forEach(view => view.classList.remove("active-view"));
        const targetView = document.getElementById(targetViewId);
        if (targetView) { targetView.classList.add("active-view"); state.activeView = targetViewId; }
        if (targetViewId === "page-narration") { state.narrationIndex = 0; startNarrationEngine(); }
    }

    function startLoadingSequence() {
        let currentPercent = 0; let phaseIndex = 0;
        const progressInterval = setInterval(() => {
            currentPercent += 2; elements.progressBar.style.width = `${currentPercent}%`;
            if (currentPercent % 20 === 0 && phaseIndex < loadingPhases.length - 1) {
                phaseIndex++; elements.loadingText.style.opacity = 0;
                setTimeout(() => { elements.loadingText.innerText = loadingPhases[phaseIndex]; elements.loadingText.style.opacity = 1; }, 200);
            }
            if (currentPercent >= 100) {
                clearInterval(progressInterval); elements.loadingText.classList.add("hidden"); elements.loadingLogo.classList.add("show");
                setTimeout(() => { elements.pageLoading.style.opacity = 0; elements.pageLoading.style.visibility = "hidden"; elements.mainContent.classList.remove("hidden"); generateBackgroundParticles(state.currentTheme); }, 1500);
            }
        }, 90);
    }

    const loadingPhases = ["Menghubungkan ke Galaksi Belajar...", "Menyiapkan Petualangan...", "Memanggil Mentor...", "Menyiapkan Materi TKA...", "Selamat Datang..."];

    function applyTheme(themeName) {
        document.body.setAttribute("data-theme", themeName); state.currentTheme = themeName; generateBackgroundParticles(themeName);
        if (themeName === "antariksa") elements.avatarGraphic.innerText = "🚀";
        else if (themeName === "sakura") elements.avatarGraphic.innerText = "🐱";
        else if (themeName === "samudra") elements.avatarGraphic.innerText = "🐬";
    }

    elements.themeButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            elements.themeButtons.forEach(b => b.classList.remove("active"));
            const selectedTheme = e.currentTarget.getAttribute("data-choose-theme");
            e.currentTarget.classList.add("active"); applyTheme(selectedTheme); playSoundFX('click');
        });
    });

    let typewriterTimer;
    function runTypewriter(text, callback) {
        elements.typewriterText.innerHTML = ""; let charIndex = 0; clearInterval(typewriterTimer);
        typewriterTimer = setInterval(() => {
            if (charIndex < text.length) { elements.typewriterText.innerHTML += text.charAt(charIndex); charIndex++; }
            else { clearInterval(typewriterTimer); if (callback) callback(); }
        }, 30);
    }

    function startNarrationEngine() {
        const activeThemeData = narrationData[state.currentTheme];
        elements.mentorAvatar.innerText = activeThemeData.avatar; elements.mentorName.innerText = activeThemeData.mentor;
        renderDialogueStep();
    }

    function renderDialogueStep() {
        const activeThemeData = narrationData[state.currentTheme];
        let rawDialogue = activeThemeData.dialogues[state.narrationIndex];
        let customizedDialogue = rawDialogue.replace("(Nama)", state.username).replace("Nama", state.username);
        elements.btnNextNarration.classList.add("hidden"); elements.btnSkip.classList.remove("hidden");
        runTypewriter(customizedDialogue, () => { elements.btnNextNarration.classList.remove("hidden"); });
    }

    elements.btnNextNarration.addEventListener("click", () => {
        const activeThemeData = narrationData[state.currentTheme]; state.narrationIndex++;
        if (state.narrationIndex < activeThemeData.dialogues.length) { renderDialogueStep(); }
        else { switchView("page-subjects"); }
    });

    elements.btnSkip.addEventListener("click", () => { switchView("page-subjects"); });

    function showAlertModal(title, text) {
        playSoundFX('popup'); elements.modalTitle.innerText = title;
        elements.modalBody.innerHTML = `<p>${text}</p>`; elements.globalModal.classList.remove("hidden");
    }

    elements.btnModalClose.addEventListener("click", () => { playSoundFX('click'); elements.globalModal.classList.add("hidden"); });

    elements.btnStart.addEventListener("click", () => {
        const inputName = elements.usernameInput.value.trim();
        if (inputName === "") { showAlertModal("Pemberitahuan 📢", "Silakan tuliskan namamu terlebih dahulu."); return; }
        state.username = inputName; elements.bgMusic.play().catch(() => {}); switchView("page-narration");
    });

    elements.backButtons.forEach(btn => {
        btn.addEventListener("click", (e) => { switchView(e.currentTarget.getAttribute("data-target")); });
    });

    elements.subjectMath.addEventListener("click", () => { switchView("page-modes"); });
    elements.subjectIndo.addEventListener("click", () => { showAlertModal("Bahasa Indonesia 🇮🇩", "Fitur Bahasa Indonesia sedang kami siapkan.<br>Mohon tunggu update berikutnya."); });
    elements.modeMaterial.addEventListener("click", () => { showAlertModal("Latihan per Materi 📚", "Fitur ini sedang dalam tahap pengembangan.<br>Kami akan segera menghadirkannya."); });
    elements.modeSimulation.addEventListener("click", () => { showAlertModal("Simulasi TKA ⏱️", "Fitur simulasi sedang dipersiapkan.<br>Nantikan update dari HW Les Private."); });

    elements.btnSetting.addEventListener("click", () => {
        playSoundFX('popup'); elements.modalTitle.innerText = "Pusat Kontrol Website";
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
        document.getElementById("volumeRange").addEventListener("input", (e) => { elements.bgMusic.volume = e.target.value; });
        document.getElementById("btnFullscreenToggle").addEventListener("click", () => { if (!document.fullscreenElement) document.documentElement.requestFullscreen(); else document.exitFullscreen(); });
        document.getElementById("btnResetSystem").addEventListener("click", () => { window.location.reload(); });
    });

    startLoadingSequence(); initAudioControl();
});