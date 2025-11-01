// CARRUSEL HERO - Solo automático
let currentHeroSlide = 0;
let heroAutoplayInterval;
const heroSlides = document.querySelectorAll('.hero-slide');
const heroDots = document.querySelectorAll('.hero-dot');

function showHeroSlide(index) {
    heroSlides.forEach(slide => slide.classList.remove('active'));
    heroDots.forEach(dot => dot.classList.remove('active'));
    
    heroSlides[index].classList.add('active');
    heroDots[index].classList.add('active');
}

function nextHeroSlide() {
    currentHeroSlide++;
    
    if (currentHeroSlide >= heroSlides.length) {
        currentHeroSlide = 0;
    }
    
    showHeroSlide(currentHeroSlide);
}

function startHeroAutoplay() {
    heroAutoplayInterval = setInterval(() => {
        nextHeroSlide();
    }, 5000); // Cambia cada 5 segundos
}

// Iniciar autoplay del hero
startHeroAutoplay();

// Menú móvil toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });
}


// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Cerrar menú móvil si está abierto
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        }
    });
});



// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Fade in animation on scroll
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, 50);
        }
    });
}, observerOptions);

// Observar todos los elementos con animación
document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .sector-card').forEach(el => {
    observer.observe(el);
});

// CARRUSEL AUTOMÁTICO DE MÁQUINAS
function autoChangeSlide(carousel) {
    const images = carousel.querySelectorAll('.carousel-img');
    
    let currentIndex = 0;
    images.forEach((img, index) => {
        if (img.classList.contains('active')) {
            currentIndex = index;
        }
    });
    
    images[currentIndex].classList.remove('active');
    let newIndex = (currentIndex + 1) % images.length;
    images[newIndex].classList.add('active');
}

function initializeAutoCarousels() {
    const carousels = document.querySelectorAll('.carousel-container');
    const intervals = [3500, 4200, 3800];
    
    carousels.forEach((carousel, index) => {
        const interval = intervals[index] || 3500;
        setInterval(() => {
            autoChangeSlide(carousel);
        }, interval);
    });
}

// CARRUSEL DE MARCAS
let currentBrandsSlide = 0;
let brandsPerView = getBrandsPerView();
let brandsAutoplayInterval;
let isTransitioning = false;

function getBrandsPerView() {
    const width = window.innerWidth;
    if (width <= 480) return 1;
    if (width <= 768) return 2;
    if (width <= 1024) return 3;
    return 3;
}

function initializeBrandsCarousel() {
    const track = document.querySelector('.brands-carousel-track');
    const items = document.querySelectorAll('.brand-item');
    const dotsContainer = document.querySelector('.brands-carousel-dots');
    
    if (!track || !items.length) return;
    
    brandsPerView = getBrandsPerView();
    const totalSlides = Math.ceil(items.length / brandsPerView);
    
    // Crear dots
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'brands-dot';
        if (i === 0) dot.classList.add('active');
        dot.onclick = () => goToBrandsSlide(i);
        dotsContainer.appendChild(dot);
    }
    
    // Ajustar el ancho de los items según la vista
    items.forEach(item => {
        if (brandsPerView === 1) {
            item.style.minWidth = '100%';
        } else if (brandsPerView === 2) {
            item.style.minWidth = 'calc(50% - 0.75rem)';
        } else {
            item.style.minWidth = 'calc(33.333% - 1.35rem)';
        }
    });
    
    updateBrandsCarousel();
    startBrandsAutoplay();
}

function updateBrandsCarousel() {
    const track = document.querySelector('.brands-carousel-track');
    const items = document.querySelectorAll('.brand-item');
    const dots = document.querySelectorAll('.brands-dot');
    const container = document.querySelector('.brands-carousel-wrapper');
    
    if (!track || !items.length || !container) return;
    
    const containerWidth = container.offsetWidth;
    const gap = window.innerWidth <= 480 ? 16 : (window.innerWidth <= 768 ? 24 : 32);
    
    // Calcular offset basado en el ancho del contenedor
    let offset;
    if (brandsPerView === 1) {
        offset = -(currentBrandsSlide * (containerWidth + gap));
    } else if (brandsPerView === 2) {
        const itemWidth = (containerWidth - gap) / 2;
        offset = -(currentBrandsSlide * brandsPerView * (itemWidth + gap));
    } else {
        const itemWidth = (containerWidth - (gap * 2)) / 3;
        offset = -(currentBrandsSlide * brandsPerView * (itemWidth + gap));
    }
    
    track.style.transform = `translateX(${offset}px)`;
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentBrandsSlide);
    });
}

function changeBrandsSlide(direction) {
    if (isTransitioning) return;
    
    const items = document.querySelectorAll('.brand-item');
    const totalSlides = Math.ceil(items.length / brandsPerView);
    
    isTransitioning = true;
    currentBrandsSlide += direction;
    
    if (currentBrandsSlide < 0) {
        currentBrandsSlide = totalSlides - 1;
    } else if (currentBrandsSlide >= totalSlides) {
        currentBrandsSlide = 0;
    }
    
    updateBrandsCarousel();
    resetBrandsAutoplay();
    
    setTimeout(() => {
        isTransitioning = false;
    }, 500);
}

function goToBrandsSlide(index) {
    if (isTransitioning) return;
    
    isTransitioning = true;
    currentBrandsSlide = index;
    updateBrandsCarousel();
    resetBrandsAutoplay();
    
    setTimeout(() => {
        isTransitioning = false;
    }, 500);
}

function startBrandsAutoplay() {
    clearInterval(brandsAutoplayInterval);
    brandsAutoplayInterval = setInterval(() => {
        changeBrandsSlide(1);
    }, 4000);
}

function resetBrandsAutoplay() {
    clearInterval(brandsAutoplayInterval);
    startBrandsAutoplay();
}

// Actualizar en resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        const newBrandsPerView = getBrandsPerView();
        if (newBrandsPerView !== brandsPerView) {
            brandsPerView = newBrandsPerView;
            currentBrandsSlide = 0;
            initializeBrandsCarousel();
        } else {
            updateBrandsCarousel();
        }
    }, 250);
});

// Prevenir zoom en doble tap en iOS
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, { passive: false });

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    initializeAutoCarousels();
    initializeBrandsCarousel();
});

// AUTOPLAY DE VIDEO EN SECCIÓN QUIÉNES SOMOS
function initVideoAutoplay() {
    const video = document.querySelector('.about-video');
    const quienesSection = document.querySelector('.quienes-somos');
    
    if (!video || !quienesSection) return;
    
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Usuario entró a la sección - reproducir video
                video.play().catch(error => {
                    console.log('Autoplay bloqueado por el navegador:', error);
                });
            } else {
                // Usuario salió de la sección - pausar video
                video.pause();
            }
        });
    }, {
        threshold: 0.5 // Se activa cuando el 50% de la sección está visible
    });
    
    videoObserver.observe(quienesSection);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    initializeAutoCarousels();
    initializeBrandsCarousel();
    initVideoAutoplay(); // Nueva función
});