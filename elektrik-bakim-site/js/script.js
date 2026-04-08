/* ============================================
   ELEKTRASERV - Professional JavaScript
============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initPreloader();
    initNavigation();
    initScrollAnimations();
    initCountUp();
    initFAQ();
    initContactForm();
});

/* ========== Preloader ========== */
function initPreloader() {
    const preloader = document.getElementById('preloader');

    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 500);
    });
}

/* ========== Navigation ========== */
function initNavigation() {
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show');
        });
    }

    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('show');
        });
    }

    // Close menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show');
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Active link based on scroll position
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

/* ========== Scroll Animations ========== */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to animate
    const animateElements = document.querySelectorAll(
        '.service-card, .feature-item, .process-step, .team-card, ' +
        '.cert-card, .value-card, .stat-card, .contact-card, .faq-item'
    );

    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });

    // Add animate class styles
    const style = document.createElement('style');
    style.textContent = `
        .animate {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/* ========== Count Up Animation ========== */
function initCountUp() {
    const statNumbers = document.querySelectorAll('.stat-number[data-count], .stats-section .stat-number');

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const countTo = parseInt(target.getAttribute('data-count')) || parseInt(target.textContent);
                animateCount(target, countTo);
                observer.unobserve(target);
            }
        });
    }, observerOptions);

    statNumbers.forEach(num => {
        observer.observe(num);
    });
}

function animateCount(element, target) {
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

/* ========== FAQ Accordion ========== */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

/* ========== Contact Form ========== */
function initContactForm() {
    const form = document.getElementById('contactForm');

    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name')?.value || '',
            email: document.getElementById('email')?.value || '',
            phone: document.getElementById('phone')?.value || '',
            service: document.getElementById('service')?.value || '',
            message: document.getElementById('message')?.value || ''
        };

        // Validate
        if (!formData.name.trim()) {
            showNotification('Lütfen adınızı girin.', 'error');
            return;
        }

        if (!formData.email.trim() || !isValidEmail(formData.email)) {
            showNotification('Lütfen geçerli bir e-posta adresi girin.', 'error');
            return;
        }

        if (!formData.message.trim()) {
            showNotification('Lütfen mesajınızı girin.', 'error');
            return;
        }

        // Simulate form submission
        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';
        submitBtn.disabled = true;

        setTimeout(() => {
            console.log('Form Data:', formData);
            showNotification('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.', 'success');
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/* ========== Notification System ========== */
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            max-width: 400px;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            background: white;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            z-index: 9999;
            animation: slideIn 0.3s ease;
        }

        .notification.success {
            border-left: 4px solid #10b981;
        }

        .notification.error {
            border-left: 4px solid #ef4444;
        }

        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .notification-content i {
            font-size: 1.25rem;
        }

        .notification.success .notification-content i {
            color: #10b981;
        }

        .notification.error .notification-content i {
            color: #ef4444;
        }

        .notification-close {
            background: none;
            border: none;
            cursor: pointer;
            padding: 0.25rem;
            color: #9ca3af;
            transition: color 0.3s;
        }

        .notification-close:hover {
            color: #374151;
        }

        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }

        @media (max-width: 576px) {
            .notification {
                right: 10px;
                left: 10px;
                max-width: none;
            }
        }
    `;

    if (!document.querySelector('#notification-styles')) {
        style.id = 'notification-styles';
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        closeNotification(notification);
    });

    // Auto close
    setTimeout(() => {
        closeNotification(notification);
    }, 5000);
}

function closeNotification(notification) {
    notification.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => {
        notification.remove();
    }, 300);
}

/* ========== Smooth Scroll ========== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.getElementById('header')?.offsetHeight || 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

/* ========== Parallax Effect ========== */
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;

    // Hero parallax
    const heroShapes = document.querySelectorAll('.hero-shapes .shape');
    heroShapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.1;
        shape.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

/* ========== Typing Effect for Hero (Optional) ========== */
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

/* ========== Lazy Loading Images ========== */
function initLazyLoad() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

/* ========== Form Input Focus Effects ========== */
document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', function() {
        this.parentElement.classList.remove('focused');
    });
});

/* ========== Back to Top Button ========== */
function initBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTop);

    // Styles
    const style = document.createElement('style');
    style.textContent = `
        .back-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.25rem;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: 0 5px 20px rgba(255, 107, 53, 0.3);
        }

        .back-to-top:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(255, 107, 53, 0.4);
        }

        .back-to-top.show {
            opacity: 1;
            visibility: visible;
        }

        @media (max-width: 576px) {
            .back-to-top {
                bottom: 20px;
                right: 20px;
                width: 45px;
                height: 45px;
            }
        }
    `;
    document.head.appendChild(style);

    // Show/hide on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    // Scroll to top on click
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize back to top
initBackToTop();