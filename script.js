/**
 * وب‌سایت لوکس تولد حنا (فِری قاچو کش) 🌸🎂
 * ۱۳۸۹/۰۸/۰۸ | همراه و عاشق همیشگی: بنیامین 💖
 * Deluxe Level-10 Edition
 */

// رمزهای عبور معتبر (انعطاف‌پذیر برای راحتی کار)
const VALID_PASSCODES = [
    "13890808",
    "890808",
    "138988",
    "8988",
    "0808",
    "8888",
    "88",
    "13880808"
];

let currentPin = "";
let isUnlocked = false;
let candlesBlown = false;
let isMusicPlaying = false;
let synthAudioContext = null;
let melodyInterval = null;
let currentSlideIndex = 0;
let carouselTimer = null;
let giftBoxOpened = false;
let heartReactCount = 1548;

// ================= تبدیل اعداد فارسی و انگلیسی =================
function toEnglishDigits(str) {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return str.toString().replace(/[۰-۹]/g, w => persianDigits.indexOf(w));
}

function toPersianDigits(str) {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return str.toString().replace(/[0-9]/g, w => persianDigits[w]);
}

// ================= سیستم صوتی هوشمند (Web Audio API) =================
function getAudioContext() {
    if (!synthAudioContext) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        synthAudioContext = new AudioCtx();
    }
    if (synthAudioContext.state === 'suspended') {
        synthAudioContext.resume();
    }
    return synthAudioContext;
}

// صدای کلیک دلنشین
function playClickSound() {
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(980, ctx.currentTime + 0.07);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.07);
    } catch (e) {}
}

// زنگوله جادویی ورود
function playUnlockChime() {
    try {
        const ctx = getAudioContext();
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
        notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
            gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.45);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + idx * 0.1);
            osc.stop(ctx.currentTime + idx * 0.1 + 0.45);
        });
    } catch (e) {}
}

// صدای فوت شمع
function playBlowSound() {
    try {
        const ctx = getAudioContext();
        const bufferSize = ctx.sampleRate * 0.6;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(500, ctx.currentTime);
        filter.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.6);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
        noise.stop(ctx.currentTime + 0.6);
    } catch (e) {}
}

// صدای سوپرایز جعبه کادو (Tada Fanfare)
function playFanfareSound() {
    try {
        const ctx = getAudioContext();
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
            gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.6);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + i * 0.08);
            osc.stop(ctx.currentTime + i * 0.08 + 0.6);
        });
    } catch (e) {}
}

// ملودی اختصاصی سنتز شده در صورت نبود song.mp3
function playRomanticMelody() {
    try {
        const ctx = getAudioContext();
        const melody = [
            { f: 392.00, d: 0.4 }, // G4
            { f: 392.00, d: 0.4 }, // G4
            { f: 440.00, d: 0.8 }, // A4
            { f: 392.00, d: 0.8 }, // G4
            { f: 523.25, d: 0.8 }, // C5
            { f: 493.88, d: 1.4 }, // B4
            { f: 392.00, d: 0.4 }, // G4
            { f: 392.00, d: 0.4 }, // G4
            { f: 440.00, d: 0.8 }, // A4
            { f: 392.00, d: 0.8 }, // G4
            { f: 587.33, d: 0.8 }, // D5
            { f: 523.25, d: 1.4 }, // C5
        ];

        let noteIdx = 0;
        function nextNote() {
            if (!isMusicPlaying) return;
            const item = melody[noteIdx];
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(item.f, ctx.currentTime);
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + item.d);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + item.d);

            noteIdx = (noteIdx + 1) % melody.length;
            melodyInterval = setTimeout(nextNote, item.d * 1000 + 80);
        }
        nextNote();
    } catch (e) {}
}

// ================= مدیریت صفحه قفل =================
function updatePinDisplay() {
    const dots = document.querySelectorAll('.pin-dot');
    const preview = document.getElementById('pinTextPreview');

    dots.forEach((dot, index) => {
        if (index < currentPin.length) {
            dot.classList.add('filled');
        } else {
            dot.classList.remove('filled');
        }
    });

    if (currentPin.length === 0) {
        preview.textContent = "_ _ _ _ / _ _ / _ _";
    } else {
        let displayStr = "";
        for (let i = 0; i < 8; i++) {
            if (i < currentPin.length) {
                displayStr += toPersianDigits(currentPin[i]) + " ";
            } else {
                displayStr += "_ ";
            }
            if (i === 3 || i === 5) displayStr += "/ ";
        }
        preview.textContent = displayStr.trim();
    }
}

function pressKey(num) {
    playClickSound();
    if (currentPin.length < 8) {
        currentPin += num;
        updatePinDisplay();
        hideError();
    }
    if (currentPin.length === 8) {
        checkPasscode();
    }
}

function clearPin() {
    playClickSound();
    currentPin = "";
    updatePinDisplay();
    hideError();
}

function showError() {
    const errorEl = document.getElementById('errorMsg');
    const pinDisplay = document.getElementById('pinDisplay');
    errorEl.classList.add('visible');
    pinDisplay.classList.add('shake-anim');
    setTimeout(() => {
        pinDisplay.classList.remove('shake-anim');
    }, 450);
}

function hideError() {
    const errorEl = document.getElementById('errorMsg');
    errorEl.classList.remove('visible');
}

function checkPasscode() {
    const cleanPin = toEnglishDigits(currentPin.trim());
    if (VALID_PASSCODES.includes(cleanPin)) {
        unlockWebsite();
    } else {
        showError();
        clearPin();
    }
}

function unlockWebsite() {
    if (isUnlocked) return;
    isUnlocked = true;

    playUnlockChime();

    // جشن کانفتی لوکس
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#ff758f', '#ff4d6d', '#ffd166', '#ffffff']
        });
    }

    const lockScreen = document.getElementById('lockScreen');
    const mainContent = document.getElementById('mainContent');

    lockScreen.classList.add('fade-out');

    setTimeout(() => {
        lockScreen.style.display = 'none';
        mainContent.classList.remove('hidden');
        mainContent.style.opacity = '1';

        // شروع شمارنده رابطه و اسلایدر
        initRelationshipCounter();
        startCarouselAutoPlay();

        // شروع خودکار موسیقی
        startMusicPlayback();
    }, 600);
}

// کیبورد فیزیکی لپ‌تاپ
document.addEventListener('keydown', (e) => {
    if (isUnlocked) return;
    if (e.key >= '0' && e.key <= '9') {
        pressKey(e.key);
    } else if (e.key === 'Backspace') {
        if (currentPin.length > 0) {
            currentPin = currentPin.slice(0, -1);
            updatePinDisplay();
            playClickSound();
        }
    } else if (e.key === 'Enter') {
        checkPasscode();
    }
});

// ================= ویجت موزیک پلیر =================
function startMusicPlayback() {
    const audio = document.getElementById('bgAudio');
    const toggleBtn = document.getElementById('musicToggleBtn');
    const disc = document.getElementById('vinylDisc');
    const statusText = document.getElementById('musicStatus');

    audio.play().then(() => {
        isMusicPlaying = true;
        toggleBtn.textContent = '⏸️';
        disc.classList.add('spinning');
        statusText.textContent = 'در حال پخش موزیک اختصاصی';
    }).catch(() => {
        // Fallback Web Audio
        isMusicPlaying = true;
        toggleBtn.textContent = '⏸️';
        disc.classList.add('spinning');
        statusText.textContent = 'پخش ملودی رمانتیک';
        playRomanticMelody();
    });
}

function toggleMusic() {
    playClickSound();
    const audio = document.getElementById('bgAudio');
    const toggleBtn = document.getElementById('musicToggleBtn');
    const disc = document.getElementById('vinylDisc');
    const statusText = document.getElementById('musicStatus');

    if (isMusicPlaying) {
        audio.pause();
        if (melodyInterval) clearTimeout(melodyInterval);
        isMusicPlaying = false;
        toggleBtn.textContent = '▶️';
        disc.classList.remove('spinning');
        statusText.textContent = 'متوقف شد';
    } else {
        startMusicPlayback();
    }
}

// ================= شمارنده رابطه عاشقانه (۳ خرداد ۱۴۰۵) =================
function initRelationshipCounter() {
    // ۳ خرداد ۱۴۰۵ سال آشنایی (24 May 2026)
    const startDate = new Date(2026, 4, 24, 0, 0, 0);

    function update() {
        const now = new Date();
        let diff = now - startDate;
        if (diff < 0) diff = Math.abs(diff);

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('daysCount').textContent = toPersianDigits(days);
        document.getElementById('hoursCount').textContent = toPersianDigits(hours);
        document.getElementById('minutesCount').textContent = toPersianDigits(minutes);
        document.getElementById('secondsCount').textContent = toPersianDigits(seconds);
    }

    update();
    setInterval(update, 1000);
}

// ================= کیک تولد تعاملی و فوت شمع‌ها =================
function blowCandles() {
    if (candlesBlown) return;
    candlesBlown = true;

    playBlowSound();

    const candles = document.querySelectorAll('.candle');
    candles.forEach(c => c.classList.add('blown'));

    const hint = document.getElementById('blowHint');
    if (hint) hint.innerHTML = '<span>✨ آرزوت به آسمون فرستاده شد فریِ من! ✨</span>';

    setTimeout(() => {
        playFanfareSound();

        // ۳ مرحله آتش‌بازی و کانفتی شگفت‌انگیز
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 160,
                spread: 100,
                origin: { y: 0.5 },
                colors: ['#ff4d6d', '#ffd166', '#ff758f', '#fff']
            });
            setTimeout(() => {
                confetti({
                    particleCount: 100,
                    angle: 60,
                    spread: 70,
                    origin: { x: 0.1, y: 0.6 }
                });
                confetti({
                    particleCount: 100,
                    angle: 120,
                    spread: 70,
                    origin: { x: 0.9, y: 0.6 }
                });
            }, 350);
        }

        const wishBox = document.getElementById('cakeWishBox');
        wishBox.classList.remove('hidden');
        wishBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 700);
}

// پرواز فانوس به آسمان
function releaseSkyLantern() {
    playFanfareSound();
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 120,
            spread: 140,
            origin: { y: 0.7 },
            colors: ['#ffd166', '#f4a261', '#ff758f']
        });
    }

    // ایجاد فانوس متحرک
    const lantern = document.createElement('div');
    lantern.textContent = '🏮';
    lantern.style.position = 'fixed';
    lantern.style.bottom = '100px';
    lantern.style.left = '50%';
    lantern.style.transform = 'translateX(-50%)';
    lantern.style.fontSize = '3.5rem';
    lantern.style.zIndex = '9999';
    lantern.style.transition = 'all 4s ease-in-out';
    lantern.style.filter = 'drop-shadow(0 0 20px #ffd166)';
    document.body.appendChild(lantern);

    setTimeout(() => {
        lantern.style.bottom = '110vh';
        lantern.style.transform = 'translateX(-80%) scale(0.4)';
        lantern.style.opacity = '0.3';
    }, 50);

    setTimeout(() => {
        lantern.remove();
        alert('✨ فانوس آرزوت با تمام عشق به آسمون رفت و به ستاره‌ها رسید فریِ من! 💖');
    }, 4200);
}

// ================= جعبه کادوی جادویی ۳ بعدی =================
function toggleGiftBox() {
    playClickSound();
    const box = document.getElementById('giftBox');
    const revealed = document.getElementById('giftRevealed');
    const hint = document.getElementById('giftTapHint');

    if (!giftBoxOpened) {
        giftBoxOpened = true;
        box.classList.add('opened');
        playFanfareSound();

        if (typeof confetti === 'function') {
            confetti({
                particleCount: 130,
                spread: 110,
                origin: { y: 0.65 },
                colors: ['#ffd166', '#ff758f', '#c9184a']
            });
        }

        setTimeout(() => {
            revealed.classList.remove('hidden');
            revealed.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);

        hint.innerHTML = '<span>🎉 سورپرایز بنیامین برای فری باز شد! 💖</span>';
    }
}

// ================= اسلایدر و کاروسل عکس‌ها =================
function updateCarousel() {
    const track = document.getElementById('carouselTrack');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    const slides = document.querySelectorAll('.carousel-slide');

    track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;

    dots.forEach((dot, idx) => {
        if (idx === currentSlideIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });

    slides.forEach((s, idx) => {
        if (idx === currentSlideIndex) {
            s.classList.add('active');
        } else {
            s.classList.remove('active');
        }
    });
}

function moveCarousel(direction) {
    playClickSound();
    const slides = document.querySelectorAll('.carousel-slide');
    currentSlideIndex = (currentSlideIndex + direction + slides.length) % slides.length;
    updateCarousel();
    resetCarouselTimer();
}

function goToSlide(index) {
    playClickSound();
    currentSlideIndex = index;
    updateCarousel();
    resetCarouselTimer();
}

function startCarouselAutoPlay() {
    carouselTimer = setInterval(() => {
        const slides = document.querySelectorAll('.carousel-slide');
        if (slides.length > 0) {
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
            updateCarousel();
        }
    }, 4500);
}

function resetCarouselTimer() {
    if (carouselTimer) clearInterval(carouselTimer);
    startCarouselAutoPlay();
}

// لمس و سوایپ لمسی کاروسل روی موبایل (Mobile Touch Swipe)
function initCarouselTouch() {
    const track = document.getElementById('carouselTrack');
    if (!track) return;

    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const threshold = 35;
        if (touchEndX < touchStartX - threshold) {
            moveCarousel(1); // ورق زدن به بعدی
        } else if (touchEndX > touchStartX + threshold) {
            moveCarousel(-1); // ورق زدن به قبلی
        }
    }, { passive: true });
}

// ================= فول‌اسکرین لایت‌باکس عکس‌ها =================
function openLightbox(src, caption) {
    playClickSound();
    const modal = document.getElementById('photoLightbox');
    const img = document.getElementById('lightboxImg');
    const cap = document.getElementById('lightboxCaption');

    img.src = src;
    cap.textContent = caption;
    modal.classList.remove('hidden');
}

function closeLightbox(e) {
    const modal = document.getElementById('photoLightbox');
    modal.classList.add('hidden');
}

function reactHeart(btn) {
    playClickSound();
    heartReactCount++;
    document.getElementById('reactCounter').textContent = toPersianDigits(heartReactCount);

    btn.style.transform = 'scale(1.25)';
    setTimeout(() => {
        btn.style.transform = 'scale(1)';
    }, 200);

    // اسپری قلب
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 25,
            spread: 50,
            origin: { y: 0.8 },
            colors: ['#ff4d6d', '#ff758f']
        });
    }
}

// ================= پاکت نامه عاشقانه =================
function openEnvelope() {
    playClickSound();
    const wrapper = document.getElementById('envelopeWrapper');
    const envelope = wrapper.querySelector('.envelope');

    if (!envelope.classList.contains('opened')) {
        playUnlockChime();
        envelope.classList.add('opened');

        if (typeof confetti === 'function') {
            confetti({
                particleCount: 60,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }
}

// ================= بازی کوییز ۳ سوالی =================
function answerQuestion(qNum, isCorrect, btnElement) {
    playClickSound();

    const card = document.getElementById('qCard' + qNum);
    const feedback = document.getElementById('feedback' + qNum);
    const allBtns = card.querySelectorAll('.option-btn');

    allBtns.forEach(b => b.style.pointerEvents = 'none');

    if (isCorrect) {
        btnElement.classList.add('correct');
        feedback.textContent = 'آفرین فری من! کاملاً درست زدی 💖';
        feedback.style.color = '#2b9348';
        playUnlockChime();

        setTimeout(() => {
            if (qNum < 3) {
                card.classList.add('hidden');
                const nextCard = document.getElementById('qCard' + (qNum + 1));
                nextCard.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
                const rewardBox = document.getElementById('quizRewardBox');
                rewardBox.classList.remove('hidden');

                if (typeof confetti === 'function') {
                    confetti({
                        particleCount: 180,
                        spread: 120,
                        origin: { y: 0.6 },
                        colors: ['#ffd166', '#f4a261', '#ff8fab', '#ffffff']
                    });
                }
            }
        }, 1300);

    } else {
        btnElement.classList.add('wrong');
        feedback.textContent = 'نه دیگه فری قاچو کش! یه بار دیگه خوب فکر کن و دوباره بزن 🥺';
        feedback.style.color = '#d90429';

        setTimeout(() => {
            btnElement.classList.remove('wrong');
            allBtns.forEach(b => b.style.pointerEvents = 'auto');
        }, 1200);
    }
}

// ================= کارت‌های پشت و رو (Flip Cards) =================
function flipCard(cardElement) {
    playClickSound();
    cardElement.classList.toggle('flipped');
}

// ================= تولیدکننده حرف‌های دلی و انرژی‌بخش بنیامین =================
const SWEET_MESSAGES = [
    "«فری جانم، یادت نره تو قشنگ‌ترین اتفاق زندگی منی! لبخند بزن چون با خنده‌هات دنیام روشن میشه... 🌸»",
    "«فری قاچو کش من، حتی اگه تمام دنیا باهات قهر کنن، من تا ابد طرفدار پروپاقرص و عاشق دیوونه‌اتم! 🍉💖»",
    "«دلت تنگ شده؟ چشاتو ببند و حس کن محکم بغلت کردم... من همیشه تا آخرش کنارتم حنای من 🖤»",
    "«موهای فرفریت قشنگ‌ترین موج دریای دنیاست، هیچ‌وقت غصه رو به چشمای عسلیت راه نده! ✨»",
    "«امروز بیشتر از دیروز و کمتر از فردا دوستت دارم... تولدت مبارک دلیل نفس کشیدنم 👑»",
    "«هر بار که به ۳ خرداد ۱۴۰۵ فکر می‌کنم، خدا رو هزار بار شکر می‌کنم که تو شدی سهم قلب من... 💕»"
];

let lastMsgIdx = 0;
function generateSweetMessage() {
    playClickSound();
    let nextIdx;
    do {
        nextIdx = Math.floor(Math.random() * SWEET_MESSAGES.length);
    } while (nextIdx === lastMsgIdx);
    lastMsgIdx = nextIdx;

    const display = document.getElementById('moodMessageDisplay');
    display.style.opacity = '0';
    display.style.transform = 'scale(0.95)';

    setTimeout(() => {
        display.textContent = SWEET_MESSAGES[nextIdx];
        display.style.opacity = '1';
        display.style.transform = 'scale(1)';
        playUnlockChime();
    }, 250);
}

// ================= جادوی لمس و نشانگر ماوس (Magic Touch & Sparkles) =================
function initMagicSparkles() {
    const sparkles = ['✨', '💖', '🌸', '⭐', '🎀'];
    let lastTime = 0;

    function createSparkle(x, y) {
        const now = Date.now();
        if (now - lastTime < 55) return; // کنترل نرخ ایجاد
        lastTime = now;

        const s = document.createElement('div');
        s.className = 'cursor-sparkle';
        s.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
        s.style.left = x + 'px';
        s.style.top = y + 'px';
        document.body.appendChild(s);

        setTimeout(() => {
            s.remove();
        }, 750);
    }

    window.addEventListener('mousemove', (e) => {
        createSparkle(e.clientX, e.clientY);
    });

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            createSparkle(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });
}

// ================= المان‌های شناور پس‌زمینه =================
function initFloatingHearts() {
    const container = document.getElementById('heartBg');
    const symbols = ['🌸', '💖', '✨', '🎀', '🌷', '🍉', '🎂', '🍓', '🤍'];

    function createHeart() {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = (7 + Math.random() * 6) + 's';
        heart.style.fontSize = (1 + Math.random() * 1.3) + 'rem';
        container.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 13000);
    }

    for (let i = 0; i < 15; i++) {
        setTimeout(createHeart, i * 300);
    }

    setInterval(createHeart, 1200);
}

// ================= جوجه وکتور اختصاصی با پاپیون صورتی (فری قاچو کش) =================
const CHICK_QUOTES = [
    "قاچ قاچ! فری قاچو کش وارد می‌شود! 🍉🔪",
    "کی جرأت کرده اشک فری منو دربیاره تا تیکه‌تیکه‌ش کنم؟! 🐥🔥",
    "فری قاچو کش، ملکه موفرفری بنیامین وارد می‌شود! 🍉✨",
    "امروز روز تولدته، هر کی اذیتت کرد با همین کارد حسابشو می‌رسم! 😜",
    "بنیامین سند قلبشو به نامت زده، تولدت مبارک حنای من! 💖",
    "یک قاچ هندونه‌ی شیرین تقدیم به خوشگل‌ترین دختر دنیا! 🍉🍰",
    "چاقوم همیشه تیزه برای محافظت از خنده‌های قشنگت! 🖤",
    "فری جانم، تا ابد کنارتم... با چاقوی تیز و پاپیون صورتی! 🎀🔪"
];

let chickSpeechTimeout = null;
let lastChickQuoteIdx = -1;

function playChirpSound() {
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(2200, ctx.currentTime + 0.08);
        osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.16);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.16);
    } catch (e) {}
}

function pokeChick() {
    playChirpSound();

    const chick = document.getElementById('knifeChickMascot');
    const bubble = document.getElementById('chickSpeech');
    const textEl = document.getElementById('chickSpeechText');

    chick.classList.remove('slashing');
    void chick.offsetWidth;
    chick.classList.add('slashing');

    let nextIdx;
    do {
        nextIdx = Math.floor(Math.random() * CHICK_QUOTES.length);
    } while (nextIdx === lastChickQuoteIdx && CHICK_QUOTES.length > 1);
    lastChickQuoteIdx = nextIdx;

    if (textEl) textEl.textContent = CHICK_QUOTES[nextIdx];
    if (bubble) {
        bubble.classList.add('visible');

        if (chickSpeechTimeout) clearTimeout(chickSpeechTimeout);
        chickSpeechTimeout = setTimeout(() => {
            bubble.classList.remove('visible');
        }, 4200);
    }

    if (typeof confetti === 'function') {
        confetti({
            particleCount: 30,
            spread: 65,
            origin: { x: 0.88, y: 0.82 },
            colors: ['#ffd166', '#ff4d6d', '#2b9348', '#ff758f']
        });
    }
}

// شروع بعد از بارگذاری کامل صفحه
document.addEventListener('DOMContentLoaded', () => {
    initFloatingHearts();
    initMagicSparkles();
    initCarouselTouch();

    // فعال‌سازی پخش آهنگ با اولین لمس روی گوشی در صورت محدودیت مرورگر
    document.body.addEventListener('touchstart', () => {
        if (isUnlocked && !isMusicPlaying) {
            startMusicPlayback();
        }
    }, { once: true, passive: true });

    // سلام اولیه جوجه بعد از ۲.۵ ثانیه
    setTimeout(() => {
        const bubble = document.getElementById('chickSpeech');
        if (bubble) {
            bubble.classList.add('visible');
            setTimeout(() => {
                bubble.classList.remove('visible');
            }, 4200);
        }
    }, 2500);
});
