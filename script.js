// Оптимизированные функции для мобильных устройств
class MobileOptimizer {
    constructor() {
        this.isMobile = this.checkMobile();
        this.init();
    }
    
    checkMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    init() {
        if (this.isMobile) {
            this.optimizeForMobile();
        }
        this.setupEventListeners();
    }
    
    optimizeForMobile() {
        // Упрощаем анимации для мобильных
        this.disableHeavyAnimations();
        this.optimizeTouchEvents();
        this.lazyLoadResources();
    }
    
    disableHeavyAnimations() {
        // Отключаем конфетти на мобильных
        const confettiStyles = document.createElement('style');
        confettiStyles.textContent = `
            .confetti { display: none !important; }
            .container::before { display: none !important; }
        `;
        document.head.appendChild(confettiStyles);
    }
    
    optimizeTouchEvents() {
        // Оптимизация touch-событий
        document.addEventListener('touchstart', this.handleTouchStart, { passive: true });
        document.addEventListener('touchmove', this.handleTouchMove, { passive: true });
        document.addEventListener('touchend', this.handleTouchEnd, { passive: true });
    }
    
    handleTouchStart(e) {
        // Минимальная обработка touch-событий
    }
    
    handleTouchMove(e) {
        // Предотвращаем лаги при скролле
    }
    
    handleTouchEnd(e) {
        // Быстрая обработка окончания касания
    }
    
    lazyLoadResources() {
        // Ленивая загрузка для мобильных
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.classList.contains('loaded')) {
                img.loading = 'lazy';
            }
        });
    }
    
    setupEventListeners() {
        // Оптимизированные обработчики событий
        this.setupGiftInteraction();
        this.setupMusicPlayer();
        this.setupPhotoAnimation();
    }
    
    setupGiftInteraction() {
        const giftBox = document.getElementById('giftBox');
        if (!giftBox) return;
        
        giftBox.addEventListener('click', this.handleGiftClick.bind(this), { passive: true });
    }
    
    handleGiftClick() {
        const giftBox = document.getElementById('giftBox');
        const giftScreen = document.getElementById('giftScreen');
        const mainContent = document.getElementById('mainContent');
        
        giftBox.classList.add('open');
        giftBox.style.pointerEvents = 'none';
        
        setTimeout(() => {
            giftScreen.style.opacity = '0';
            setTimeout(() => {
                giftScreen.classList.add('hidden');
                mainContent.classList.remove('hidden');
                this.animateContent();
                this.startCountdown();
            }, this.isMobile ? 600 : 800);
        }, this.isMobile ? 600 : 800);
    }
    
    animateContent() {
        const elements = document.querySelectorAll('.content > *');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(15px)';
            element.style.transition = `opacity 0.5s ease ${index * 100}ms, transform 0.5s ease ${index * 100}ms`;
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 100 + (index * 100));
        });
    }
    
    setupMusicPlayer() {
        const playButton = document.getElementById('playButton');
        const audio = document.getElementById('birthdaySong');
        let isPlaying = false;
        
        if (!playButton || !audio) return;
        
        playButton.addEventListener('click', () => {
            if (isPlaying) {
                audio.pause();
                playButton.innerHTML = '<i class="fas fa-play"></i>';
            } else {
                audio.play().catch(() => {
                    console.log('Автовоспроизведение заблокировано');
                });
                playButton.innerHTML = '<i class="fas fa-pause"></i>';
            }
            isPlaying = !isPlaying;
        }, { passive: true });
    }
    
    setupPhotoAnimation() {
        const photo = document.querySelector('.main-photo');
        if (!photo || this.isMobile) return;
        
        photo.addEventListener('mouseenter', () => {
            photo.style.transform = 'scale(1.03)';
        });
        
        photo.addEventListener('mouseleave', () => {
            photo.style.transform = 'scale(1)';
        });
    }
    
    startCountdown() {
        const now = new Date();
        const currentYear = now.getFullYear();
        let nextBirthdayYear = currentYear;
        
        const currentMonth = now.getMonth();
        const currentDay = now.getDate();
        
        if ((currentMonth > 8) || (currentMonth === 8 && currentDay >= 3)) {
            nextBirthdayYear = currentYear + 1;
        }
        
        const nextBirthday = new Date(nextBirthdayYear, 8, 3);
        
        const updateCountdown = () => {
            const now = new Date();
            const diff = nextBirthday - now;
            
            if (diff <= 0) {
                ['days', 'hours', 'minutes', 'seconds'].forEach(id => {
                    document.getElementById(id).textContent = '0';
                });
                document.querySelector('.countdown h3').textContent = 'С Днём Рождения!';
                return;
            }
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            document.getElementById('days').textContent = days;
            document.getElementById('hours').textContent = hours;
            document.getElementById('minutes').textContent = minutes;
            document.getElementById('seconds').textContent = seconds;
            
            if (!this.isMobile) {
                requestAnimationFrame(updateCountdown);
            }
        };
        
        updateCountdown();
        if (this.isMobile) {
            setInterval(updateCountdown, 1000);
        }
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    // Используем requestIdleCallback для оптимальной загрузки
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            new MobileOptimizer();
        });
    } else {
        setTimeout(() => {
            new MobileOptimizer();
        }, 1000);
    }
});

// Оптимизация изменения ориентации
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        window.scrollTo(0, 0);
    }, 250);
});

// Предотвращение zoom на iOS
document.addEventListener('touchstart', function(event) {
    if (event.touches.length > 1) {
        event.preventDefault();
    }
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, { passive: false });