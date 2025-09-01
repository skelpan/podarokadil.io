// Создание конфетти
function createConfetti() {
    const confettiCount = 100; // Уменьшено для производительности
    const container = document.body;
    const colors = ['#ffd700', '#1a2a6c', '#ffffff', '#b21f1f', '#ff8c00'];

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        
        // Случайный цвет
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Случайная форма
        const shapes = ['square', 'rectangle', 'circle'];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        
        if (shape === 'circle') {
            confetti.style.borderRadius = '50%';
        } else if (shape === 'rectangle') {
            confetti.style.width = '8px';
            confetti.style.height = '20px';
        }
        
        // Случайные начальные позиции
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = -20 + 'px';
        
        // Случайный размер
        const size = Math.random() * 12 + 5;
        confetti.style.width = size + 'px';
        confetti.style.height = size + 'px';
        
        // Случайная скорость анимации
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        
        // Случайная задержка анимации
        confetti.style.animationDelay = (Math.random() * 3) + 's';
        
        container.appendChild(confetti);

        // Удаляем конфетти после завершения анимации
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, 6000);
    }
}

// Управление музыкой
function setupMusicPlayer() {
    const playButton = document.getElementById('playButton');
    const audio = document.getElementById('birthdaySong');
    let isPlaying = false;

    // Предзагрузка аудио
    audio.preload = 'auto';
    
    playButton.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            playButton.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            audio.play().catch(e => {
                console.log('Автовоспроизведение заблокировано:', e);
            });
            playButton.innerHTML = '<i class="fas fa-pause"></i>';
        }
        isPlaying = !isPlaying;
    });
}

// Анимация фото при наведении
function setupPhotoAnimation() {
    const photo = document.querySelector('.main-photo');
    
    photo.addEventListener('mouseenter', () => {
        photo.style.transform = 'scale(1.05) rotate(5deg)';
        photo.style.boxShadow = '0 0 35px rgba(255, 215, 0, 0.8)';
    });
    
    photo.addEventListener('mouseleave', () => {
        photo.style.transform = 'scale(1) rotate(0deg)';
        photo.style.boxShadow = '0 0 25px rgba(255, 215, 0, 0.5)';
    });
}

// Обработка открытия подарка
function setupGiftInteraction() {
    const giftBox = document.getElementById('giftBox');
    const giftScreen = document.getElementById('giftScreen');
    const mainContent = document.getElementById('mainContent');
    const audio = document.getElementById('birthdaySong');
    
    giftBox.addEventListener('click', function() {
        // Анимируем открытие подарка
        this.classList.add('open');
        
        // Отключаем дальнейшие клики
        this.style.pointerEvents = 'none';
        
        // Через секунду показываем основной контент
        setTimeout(() => {
            giftScreen.style.opacity = '0';
            
            // Еще через секунду скрываем экран с подарком и показываем основной контент
            setTimeout(() => {
                giftScreen.classList.add('hidden');
                mainContent.classList.remove('hidden');
                
                // Пытаемся запустить музыку
                audio.play().then(() => {
                    document.getElementById('playButton').innerHTML = '<i class="fas fa-pause"></i>';
                }).catch(e => {
                    console.log('Автовоспроизведение заблокировано');
                });
                
                // Запускаем анимации для основного контента
                animateContent();
                
                // Запускаем обратный отсчет
                startCountdown();
            }, 1000);
        }, 1000);
    });
}

// Анимация появления контента
function animateContent() {
    const elements = document.querySelectorAll('.content > *');
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 300 + (index * 200));
    });
}

// Обратный отсчет до следующего дня рождения (3 сентября)
function startCountdown() {
    const now = new Date();
    const currentYear = now.getFullYear();
    let nextBirthdayYear = currentYear;
    
    // Проверяем, прошел ли уже день рождения в этом году
    const currentMonth = now.getMonth(); // 0-11 (январь=0)
    const currentDay = now.getDate(); // 1-31
    
    // Если сейчас сентябрь (месяц 8) и число больше или равно 3, 
    // или если месяц позже сентября, то день рождения уже прошел в этом году
    if ((currentMonth > 8) || (currentMonth === 8 && currentDay >= 3)) {
        nextBirthdayYear = currentYear + 1;
    }
    
    // Создаем дату следующего дня рождения (3 сентября)
    const nextBirthday = new Date(nextBirthdayYear, 8, 3); // 8 = сентябрь (0-11)
    
    function updateCountdown() {
        const now = new Date();
        const diff = nextBirthday - now;
        
        // Если разница отрицательная (день рождения сегодня или прошел)
        if (diff <= 0) {
            document.getElementById('days').textContent = '0';
            document.getElementById('hours').textContent = '0';
            document.getElementById('minutes').textContent = '0';
            document.getElementById('seconds').textContent = '0';
            
            // Можно добавить специальное сообщение
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
    }
    
    updateCountdown();
    // Используем requestAnimationFrame для более плавного обновления
    let lastUpdate = Date.now();
    function animate() {
        const now = Date.now();
        if (now - lastUpdate >= 1000) {
            updateCountdown();
            lastUpdate = now;
        }
        requestAnimationFrame(animate);
    }
    animate();
}

// Ленивая загрузка изображений
function setupLazyLoading() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        }
    });
}

// Оптимизация для мобильных устройств
function setupMobileOptimization() {
    // Отключаем hover эффекты на тач-устройствах
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Настраиваем взаимодействие с подарком
    setupGiftInteraction();
    
    // Настраиваем ленивую загрузку
    setupLazyLoading();
    
    // Настраиваем оптимизацию для мобильных
    setupMobileOptimization();
    
    // Настраиваем плеер
    setupMusicPlayer();
    
    // Настраиваем анимацию фото
    setupPhotoAnimation();
    
    // Создаем конфетти с задержкой для улучшения производительности
    setTimeout(() => {
        createConfetti();
        setInterval(createConfetti, 8000);
    }, 2000);
});

// Обработка изменения размера окна
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Пересоздаем конфетти при изменении размера окна
        document.querySelectorAll('.confetti').forEach(confetti => {
            confetti.remove();
        });
        createConfetti();
    }, 250);
});