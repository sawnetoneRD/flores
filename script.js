// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Iniciar la música de fondo con la primera interacción del usuario
    function playMusic() {
        const music = document.getElementById('backgroundMusic');
        if (!music) return;
        if (music.paused) {
            music.play().catch(() => {
                console.log('La reproducción automática fue bloqueada por el navegador.');
            });
        }
    }
    const playOnce = () => { playMusic(); document.body.removeEventListener('click', playOnce); };
    document.body.addEventListener('click', playOnce);

    // Crear partículas flotantes adicionales
    createFloatingParticles();
    
    // Configurar el botón mágico
    setupMagicButton();
    
    // Agregar efectos de sonido (simulados con vibraciones en dispositivos móviles)
    setupSoundEffects();
    
    // Crear efecto de lluvia de pétalos
    createPetalRain();
    
    // Agregar efectos de hover a los girasoles
    setupSunflowerInteractions();
    
    // Configurar animaciones de entrada secuenciales
    setupSequentialAnimations();

    // Tarjeta volteable eliminada (sin acción)
    
    // Preparar: eliminar cualquier flor grande previa y limpiar el campo
    removeSingleBouquet();
    clearBottomSunflowers();
});

// Tarjeta volteable eliminada
function setupFlipCard() { /* no-op */ }

// Función para crear partículas flotantes adicionales
function createFloatingParticles() {
    const particlesContainer = document.querySelector('.floating-particles');
    const particles = ['🌻', '🌼', '🌺', '💛', '✨', '🦋'];
    
    // Crear 15 partículas flotantes
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.textContent = particles[Math.floor(Math.random() * particles.length)];
        
        // Posición aleatoria
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';
        particle.style.fontSize = (10 + Math.random() * 10) + 'px';
        particle.style.opacity = '0.2';
        
        // Aplicar animación
        particle.style.animation = `float ${10 + Math.random() * 10}s infinite linear`;
        particle.style.animationDelay = Math.random() * 10 + 's';
        
        particlesContainer.appendChild(particle);
    }
}

// Quita todos los girasoles de la franja inferior
function clearBottomSunflowers() {
    const field = document.getElementById('sunflowerField');
    if (!field) return;
    const existingWraps = field.querySelectorAll(':scope > .sunflower-wrap');
    existingWraps.forEach(w => w.remove());
}

// Añade un girasol, calculando su posición en base al índice
function addOneBottomSunflower(index, total) {
    const field = document.getElementById('sunflowerField');
    if (!field) return;
    const wrap = document.createElement('div');
    wrap.className = 'sunflower-wrap';

    // Distribución determinista de izquierda a derecha
    const slots = Math.max(total, index + 1);
    const margin = 6;     // margen lateral en % para evitar que sobresalga por translateX(-50%)
    const span = 100 - (margin * 2); // ancho útil
    let x;
    if (slots > 1) {
        // coloca el índice 0 en el margen izquierdo y el último en el derecho
        x = margin + (index * (span / (slots - 1)));
    } else {
        x = 50; // caso seguro si solo hay 1
    }
    wrap.style.left = Math.max(2, Math.min(98, x)) + '%';
    wrap.style.bottom = '0';
    const scale = 0.55 + Math.random() * 0.2;
    wrap.style.transform = `translateX(-50%) scale(${scale})`;
    wrap.style.position = 'absolute';
    wrap.style.zIndex = '0';

    const flower = createSunflowerElement();
    wrap.appendChild(flower);
    field.appendChild(wrap);
}

// Muestra el mensaje final de amor
function showLoveOverlay() {
    if (document.querySelector('.love-overlay')) return;
    const overlay = document.createElement('div');
    overlay.className = 'love-overlay';
    overlay.innerHTML = `<div class="love-text">❤</div>`;
    document.body.appendChild(overlay);
}


// Rellenar la parte inferior del contenedor con muchos girasoles pequeños
function generateBottomSunflowerFill(count = 10) {
    const field = document.getElementById('sunflowerField');
    if (!field) return;

    // Limpiar relleno anterior (mantener bouquet si existiera)
    const existingWraps = field.querySelectorAll(':scope > .sunflower-wrap');
    existingWraps.forEach(w => w.remove());

    // Crear una banda inferior de girasoles distribuidos
    const slots = Math.max(count, 1);
    for (let i = 0; i < count; i++) {
        const wrap = document.createElement('div');
        wrap.className = 'sunflower-wrap';
        // Izquierda a derecha sin jitter
        const margin = 6;  // % margen más amplio para no cruzar bordes
        const span = 100 - (margin * 2);   // % efectivo
        const x = slots > 1 ? (margin + (i * (span / (slots - 1)))) : 50;
        wrap.style.left = Math.max(2, Math.min(98, x)) + '%';
        wrap.style.bottom = '0';
        const scale = 0.5 + Math.random() * 0.2; // 0.5..0.7
        wrap.style.transform = `translateX(-50%) scale(${scale})`;
        wrap.style.position = 'absolute';
        wrap.style.zIndex = '0';

        const flower = createSunflowerElement();
        wrap.appendChild(flower);
        field.appendChild(wrap);
    }

    setupSunflowerInteractions();
}

// Elimina la flor grande (ramo individual) si existe
function removeSingleBouquet() {
    const field = document.getElementById('sunflowerField');
    if (!field) return;
    const single = field.querySelector('.single-bouquet');
    if (single) single.remove();
}

// Configurar el botón mágico
function setupMagicButton() {
    const magicButton = document.getElementById('magicButton');
    const maxSunflowers = 10; // número total para mostrar el mensaje final
    let clickCount = 0;

    magicButton.addEventListener('click', function() {
        // Vibración en dispositivos móviles
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }

        // Añadir un nuevo girasol en la franja inferior
        addOneBottomSunflower(clickCount, maxSunflowers);
        clickCount++;

        // Cambiar el texto del botón
        updateButtonText(this, clickCount);

        // Pequeño efecto visual
        createFlowerExplosion(this);

        // Al llegar al máximo, mostrar mensaje final
        if (clickCount >= maxSunflowers) {
            showLoveOverlay();
            this.disabled = true;
            this.textContent = '❤';
        }
    });
}

// Función para crear explosión de flores
function createFlowerExplosion(button) {
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 12; i++) {
        const flower = document.createElement('div');
        flower.textContent = '🌻';
        flower.style.position = 'fixed';
        flower.style.left = centerX + 'px';
        flower.style.top = centerY + 'px';
        flower.style.fontSize = '20px';
        flower.style.pointerEvents = 'none';
        flower.style.zIndex = '1000';
        
        const angle = (i / 12) * Math.PI * 2;
        const distance = 100 + Math.random() * 50;
        const endX = centerX + Math.cos(angle) * distance;
        const endY = centerY + Math.sin(angle) * distance;
        
        document.body.appendChild(flower);
        
        // Animar la explosión
        flower.animate([
            { 
                transform: 'translate(0, 0) rotate(0deg) scale(1)',
                opacity: 1 
            },
            { 
                transform: `translate(${endX - centerX}px, ${endY - centerY}px) rotate(360deg) scale(0)`,
                opacity: 0 
            }
        ], {
            duration: 1000,
            easing: 'ease-out'
        }).onfinish = () => flower.remove();
    }
}

// Actualizar texto del botón
function updateButtonText(button, clickCount) {
    const messages = [
        '✨ Hacer Florecer Más Girasoles ✨',
        '🌻 ¡Qué hermoso! Más flores 🌻',
        '💛 ¡Continua asi! Falta poco 💛',
        '🌟 ¡Magia pura! 🌟',
        '🦋 No te rindas 🦋'
    ];
    
    const messageIndex = (clickCount - 1) % messages.length;
    button.textContent = messages[messageIndex];
    
    // Efecto de pulso
    button.style.animation = 'pulse 0.3s ease-out';
    setTimeout(() => {
        button.style.animation = '';
    }, 300);
}

// Agregar girasol dinámico
function addDynamicSunflower() {
    // Si existe ramo individual, no agregamos más para mantener una sola flor grande
    const field = document.getElementById('sunflowerField');
    if (!field) return;
    const single = field.querySelector('.single-bouquet');
    if (single) return;
    const bouquet = field.querySelector('.bouquet');
    const wrap = document.createElement('div');
    wrap.className = 'sunflower-wrap';

    if (bouquet) {
        // offsets alrededor del centro del ramo
        const offset = (Math.random() * 420) - 210; // -210px..210px
        wrap.style.left = `calc(50% + ${offset}px)`;
        wrap.style.bottom = '0';
        const scale = 0.75 + Math.random() * 0.2; // ligeramente variable
        wrap.style.transform = `scale(${scale})`;
        wrap.style.zIndex = String(80 + Math.floor(Math.random() * 10));

        const flower = createSunflowerElement();
        wrap.appendChild(flower);
        bouquet.appendChild(wrap);
    } else {
        // fallback al campo tradicional
        wrap.style.left = (30 + Math.random() * 40) + '%';
        wrap.style.bottom = '24%';
        const scale = 0.6 + Math.random() * 0.5;
        wrap.style.transform = 'scale(0)';
        wrap.style.zIndex = String(60);

        const flower = createSunflowerElement();
        wrap.appendChild(flower);
        field.appendChild(wrap);

        wrap.animate([
            { transform: 'scale(0)', opacity: 0 },
            { transform: `scale(${scale})`, opacity: 1 }
        ], {
            duration: 800,
            easing: 'ease-out',
            fill: 'forwards'
        });
    }
}

// Crear elemento de girasol
function createSunflowerElement() {
    const sunflower = document.createElement('div');
    sunflower.className = 'sunflower dynamic-sunflower';
    sunflower.style.animation = 'sway 3s ease-in-out infinite';
    sunflower.style.animationDelay = Math.random() * 2 + 's';
    
    sunflower.innerHTML = `
        <div class="stem"></div>
        <div class="flower">
            <div class="center"></div>
            <div class="petals">
                <div class="petal"></div>
                <div class="petal"></div>
                <div class="petal"></div>
                <div class="petal"></div>
                <div class="petal"></div>
                <div class="petal"></div>
                <div class="petal"></div>
                <div class="petal"></div>
            </div>
        </div>
    `;
    
    return sunflower;
}

// Crear efecto especial
function createSpecialEffect() {
    // Cambiar temporalmente el fondo
    document.body.style.background = 'linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 30%, #f39c12 60%, #e17055 100%)';
    
    // Crear lluvia de corazones
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createFallingHeart();
        }, i * 100);
    }
    
    // Restaurar fondo después de 3 segundos
    setTimeout(() => {
        document.body.style.background = 'linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 50%, #e17055 100%)';
    }, 3000);
}

// Crear corazón que cae
function createFallingHeart() {
    const heart = document.createElement('div');
    heart.textContent = '💛';
    heart.style.position = 'fixed';
    heart.style.top = '-50px';
    heart.style.left = Math.random() * window.innerWidth + 'px';
    heart.style.fontSize = (20 + Math.random() * 20) + 'px';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '999';
    
    document.body.appendChild(heart);
    
    heart.animate([
        { 
            transform: 'translateY(0) rotate(0deg)',
            opacity: 1 
        },
        { 
            transform: `translateY(${window.innerHeight + 100}px) rotate(360deg)`,
            opacity: 0 
        }
    ], {
        duration: 3000 + Math.random() * 2000,
        easing: 'ease-in'
    }).onfinish = () => heart.remove();
}

// Configurar efectos de sonido (simulados)
function setupSoundEffects() {
    // Simular efectos de sonido con vibraciones en móviles
    const interactiveElements = document.querySelectorAll('.sunflower, .magic-button, .message-card');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        });
    });
}

// Crear lluvia de pétalos
function createPetalRain() {
    setInterval(() => {
        if (Math.random() < 0.3) { // 30% de probabilidad cada intervalo
            createFallingPetal();
        }
    }, 2000);
}

// Crear pétalo que cae
function createFallingPetal() {
    const petals = ['🌼', '🌻', '🌺'];
    const petal = document.createElement('div');
    petal.textContent = petals[Math.floor(Math.random() * petals.length)];
    petal.style.position = 'fixed';
    petal.style.top = '-30px';
    petal.style.left = Math.random() * window.innerWidth + 'px';
    petal.style.fontSize = (15 + Math.random() * 10) + 'px';
    petal.style.pointerEvents = 'none';
    petal.style.zIndex = '1';
    petal.style.opacity = '0.7';
    
    document.body.appendChild(petal);
    
    petal.animate([
        { 
            transform: 'translateY(0) rotate(0deg)',
            opacity: 0.7 
        },
        { 
            transform: `translateY(${window.innerHeight + 50}px) rotate(${Math.random() * 360}deg)`,
            opacity: 0 
        }
    ], {
        duration: 5000 + Math.random() * 3000,
        easing: 'ease-in'
    }).onfinish = () => petal.remove();
}

// Configurar interacciones con girasoles
function setupSunflowerInteractions() {
    const sunflowers = document.querySelectorAll('.sunflower');
    
    sunflowers.forEach((sunflower, index) => {
        sunflower.addEventListener('mouseenter', () => {
            sunflower.style.transform = 'scale(1.1)';
            sunflower.style.transition = 'transform 0.3s ease';
        });
        
        sunflower.addEventListener('mouseleave', () => {
            sunflower.style.transform = 'scale(1)';
        });
        
        sunflower.addEventListener('click', () => {
            // Crear mini explosión
            createMiniExplosion(sunflower);
        });
    });
}

// Crear mini explosión
function createMiniExplosion(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 6; i++) {
        const spark = document.createElement('div');
        spark.textContent = '✨';
        spark.style.position = 'fixed';
        spark.style.left = centerX + 'px';
        spark.style.top = centerY + 'px';
        spark.style.fontSize = '12px';
        spark.style.pointerEvents = 'none';
        spark.style.zIndex = '1000';
        
        document.body.appendChild(spark);
        
        const angle = (i / 6) * Math.PI * 2;
        const distance = 30 + Math.random() * 20;
        const endX = centerX + Math.cos(angle) * distance;
        const endY = centerY + Math.sin(angle) * distance;
        
        spark.animate([
            { 
                transform: 'translate(0, 0) scale(1)',
                opacity: 1 
            },
            { 
                transform: `translate(${endX - centerX}px, ${endY - centerY}px) scale(0)`,
                opacity: 0 
            }
        ], {
            duration: 600,
            easing: 'ease-out'
        }).onfinish = () => spark.remove();
    }
}

// Configurar animaciones secuenciales
function setupSequentialAnimations() {
    // Animar girasoles uno por uno al cargar
    const sunflowers = document.querySelectorAll('.sunflower');
    sunflowers.forEach((sunflower, index) => {
        sunflower.style.opacity = '0';
        sunflower.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            sunflower.animate([
                { opacity: 0, transform: 'translateY(50px)' },
                { opacity: 1, transform: 'translateY(0)' }
            ], {
                duration: 800,
                easing: 'ease-out',
                fill: 'forwards'
            });
        }, index * 200);
    });
}

// Generar un campo de girasoles dentro de #sunflowerField
function generateSunflowerField(count = 18) {
    const field = document.getElementById('sunflowerField');
    if (!field) return;

    // Limpiar campo actual
    field.innerHTML = '';

    // Distribuir en varias "filas" de profundidad para dar sensación 3D
    const layers = 5; // filas de profundidad
    const perLayer = Math.ceil(count / layers);

    for (let layer = 0; layer < layers; layer++) {
        for (let i = 0; i < perLayer; i++) {
            const wrap = document.createElement('div');
            wrap.className = 'sunflower-wrap';

            // Posición horizontal separada de manera uniforme con un pequeño jitter
            const slots = perLayer + 1; // dejar márgenes laterales
            const base = 10 + ((i + 1) / slots) * 80; // 10%..90%
            const jitter = (Math.random() * 6) - 3; // -3%..3%
            const x = Math.max(5, Math.min(95, base + jitter));
            wrap.style.left = x + '%';

            // Alinear con la parte superior del suelo sin desplazamientos adicionales
            const baseBottom = 24; // % (coincide con CSS .field::after)
            wrap.style.bottom = baseBottom + '%';

            // Escala según capa (más lejos = más pequeño) con límites más suaves para evitar solapes
            const scaleBase = 0.6 + layer * 0.06; // 0.6..0.84 aprox
            const scaleJitter = (Math.random() * 0.06) - 0.03; // variación leve
            const scale = Math.max(0.5, Math.min(1.0, scaleBase + scaleJitter));
            wrap.style.transform = `scale(${scale})`;

            // Profundidad/z-index para ordenar superposición
            wrap.style.zIndex = String(50 + layer);

            // Crear el girasol y adjuntar
            const flower = createSunflowerElement();
            wrap.appendChild(flower);
            field.appendChild(wrap);
        }
    }

    // Interacciones para todos los nuevos girasoles
    setupSunflowerInteractions();
}

// Agregar evento de redimensionamiento para responsive
window.addEventListener('resize', () => {
    // Limpiar partículas dinámicas si es necesario
    const dynamicSunflowers = document.querySelectorAll('.dynamic-sunflower');
    if (window.innerWidth < 768 && dynamicSunflowers.length > 2) {
        dynamicSunflowers.forEach((sunflower, index) => {
            if (index >= 2) {
                sunflower.remove();
            }
        });
    }
});
