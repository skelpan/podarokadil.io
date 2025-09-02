class BirthdayWebsite {
    constructor() {
        this.isMobile = this.checkMobile();
        this.videoDuration = 24000; // 10 секунд видео
        this.isVideoMuted = false;
        this.init();
    }
    setupMusicPlayer() {
    const playButton = document.getElementById('playButton');
    const audio = document.getElementById('birthdaySong');
    
    if (!playButton || !audio) return;

    // Состояние
    let isPlaying = false;

    // Пытаемся сразу запустить музыку
    audio.play().then(() => {
        console.log('Музыка автоматически запущена');
        isPlaying = true;
        playButton.innerHTML = '<i class="fas fa-pause"></i>';
    }).catch(() => {
        console.log('Автовоспроизведение аудио заблокировано, ждём клика пользователя');
        
        // Включаем при первом клике в любое место
        const resumeMusic = () => {
            audio.play().then(() => {
                isPlaying = true;
                playButton.innerHTML = '<i class="fas fa-pause"></i>';
                document.removeEventListener('click', resumeMusic);
            });
        };
        document.addEventListener('click', resumeMusic);
    });

    // Обработчик кнопки
    playButton.addEventListener('click', (e) => {
        e.stopPropagation(); // чтобы клик не срабатывал на документ

        if (isPlaying) {
            audio.pause();
            isPlaying = false;
            playButton.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            audio.play().then(() => {
                isPlaying = true;
                playButton.innerHTML = '<i class="fas fa-pause"></i>';
            }).catch(() => {
                console.log('Не удалось воспроизвести аудио');
            });
        }
    });

    // Если музыка закончилась — сбрасываем кнопку
    audio.addEventListener('ended', () => {
        isPlaying = false;
        playButton.innerHTML = '<i class="fas fa-play"></i>';
    });
}
    checkMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    init() {
        this.setupEventListeners();
        this.setupVideo();
        if (this.isMobile) {
            this.optimizeForMobile();
        }
    }
    
    setupVideo() {
        // Видео уже показывается по умолчанию
        this.startVideo();
        
    }
    
    async startVideo() {
        const video = document.getElementById('birthdayVideo');
        
        try {
            // Сначала пытаемся запустить со звуком
            await video.play();
            console.log('Видео запущено со звуком');
            this.startVideoTimer();
        } catch (error) {
            console.log('Автовоспроизведение со звуком заблокировано, пробуем без звука');
            
            // Пробуем запустить без звука
            video.muted = true;
            this.isVideoMuted = true;
            this.updateMuteButton();
            
            try {
                await video.play();
                this.startVideoTimer();
            } catch (error2) {
                console.log('Не удалось запустить видео, пропускаем');
                this.hideVideo();
            }
        }
    }
    
    startVideoTimer() {
        // Автоматически скрываем видео после заданного времени
        this.videoTimer = setTimeout(() => {
            this.hideVideo();
        }, this.videoDuration);
    }
    
    hideVideo() {
        const videoScreen = document.getElementById('videoScreen');
        const video = document.getElementById('birthdayVideo');
        
        // Останавливаем таймер
        if (this.videoTimer) {
            clearTimeout(this.videoTimer);
        }
        
        videoScreen.style.opacity = '0';
        video.pause();
        
        setTimeout(() => {
            videoScreen.classList.add('hidden');
            this.showGiftScreen();
        }, 500);
    }
    
    showGiftScreen() {
        const giftScreen = document.getElementById('giftScreen');
        giftScreen.classList.remove('hidden');
    }
    
    async showVideoAgain() {
        const videoScreen = document.getElementById('videoScreen');
        const video = document.getElementById('birthdayVideo');
        
        videoScreen.classList.remove('hidden');
        videoScreen.style.opacity = '1';
        
        // Перематываем видео в начало
        video.currentTime = 0;
        
        // Включаем звук при повторном просмотре
        if (this.isVideoMuted) {
            video.muted = false;
            this.isVideoMuted = false;
            this.updateMuteButton();
        }
        
        try {
            await video.play();
            this.startVideoTimer();
        } catch (error) {
            console.log('Не удалось запустить видео');
            this.hideVideo();
        }
    }
    
    toggleMute() {
        const video = document.getElementById('birthdayVideo');
        video.muted = !video.muted;
        this.isVideoMuted = video.muted;
        this.updateMuteButton();
    }
    
    updateMuteButton() {
        const muteButton = document.getElementById('muteVideo');
        if (muteButton) {
            muteButton.innerHTML = this.isVideoMuted ? 
                '<i class="fas fa-volume-mute"></i>' : 
                '<i class="fas fa-volume-up"></i>';
        }
    }
    
    setupEventListeners() {
        this.setupSkipVideo();
        this.setupMuteButton();
        this.setupGiftInteraction();
        this.setupMusicPlayer();
        this.setupVideoReplay();
        
        // Обработчик для самого видео
        const video = document.getElementById('birthdayVideo');
        if (video) {
            video.addEventListener('click', () => {
                this.toggleMute();
            });
        }
    }
    
    setupSkipVideo() {
        const skipButton = document.getElementById('skipVideo');
        if (skipButton) {
            skipButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.hideVideo();
            });
        }
    }
    
    setupMuteButton() {
        const muteButton = document.getElementById('muteVideo');
        if (muteButton) {
            muteButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMute();
            });
        }
    }
    
    setupVideoReplay() {
        const replayButton = document.getElementById('replayVideo');
        if (replayButton) {
            replayButton.addEventListener('click', () => {
                this.showVideoAgain();
            });
        }
    }
    
    setupGiftInteraction() {
        const giftBox = document.getElementById('giftBox');
        if (!giftBox) return;
        
        giftBox.addEventListener('click', () => {
            this.handleGiftClick();
        });
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
                    console.log('Автовоспроизведение аудио заблокировано');
                });
                playButton.innerHTML = '<i class="fas fa-pause"></i>';
            }
            isPlaying = !isPlaying;
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
                    const element = document.getElementById(id);
                    if (element) element.textContent = '0';
                });
                const countdownTitle = document.querySelector('.countdown h3');
                if (countdownTitle) {
                    countdownTitle.textContent = 'С Днём Рождения!';
                }
                return;
            }
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            const daysElement = document.getElementById('days');
            const hoursElement = document.getElementById('hours');
            const minutesElement = document.getElementById('minutes');
            const secondsElement = document.getElementById('seconds');
            
            if (daysElement) daysElement.textContent = days;
            if (hoursElement) hoursElement.textContent = hours;
            if (minutesElement) minutesElement.textContent = minutes;
            if (secondsElement) secondsElement.textContent = seconds;
        };
        
        updateCountdown();
        this.countdownInterval = setInterval(updateCountdown, 1000);
    }
    
    optimizeForMobile() {
        // Оптимизация для мобильных устройств
        this.disableHeavyAnimations();
    }
    
    disableHeavyAnimations() {
        // Упрощаем анимации для мобильных
        const style = document.createElement('style');
        style.textContent = `
            .confetti { display: none !important; }
            .container::before { display: none !important; }
        `;
        document.head.appendChild(style);
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    window.birthdayApp = new BirthdayWebsite();
});

// Обработчик изменения ориентации
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 300);
});

// Глобальные функции для отладки
window.skipVideo = function() {
    if (window.birthdayApp) {
        window.birthdayApp.hideVideo();
    }
};

window.replayVideo = function() {
    if (window.birthdayApp) {
        window.birthdayApp.showVideoAgain();
    }
};