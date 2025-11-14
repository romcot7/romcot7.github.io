// Navigation mobile améliorée
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        hamburger.innerHTML = navLinks.classList.contains("active")
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';
    });
}

// Header scroll effect avec parallaxe
window.addEventListener("scroll", () => {
    const header = document.getElementById("header");
    const scrolled = window.pageYOffset;

    if (scrolled > 100) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }

    // Effet de parallaxe sur les éléments flottants
    const floatingElements = document.querySelectorAll(".floating-element");
    floatingElements.forEach((element, index) => {
        const speed = 0.5 + index * 0.1;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.05}deg)`;
    });
});

// Animation des barres de compétences avec effet de progression
const skillBars = document.querySelectorAll(".skill-progress");

function animateSkillBars() {
    skillBars.forEach((bar) => {
        const width = bar.getAttribute("data-width");
        bar.style.width = "0%";

        setTimeout(() => {
            bar.style.width = width + "%";
        }, 300);
    });
}

// Observer pour l'animation des compétences
const skillsSection = document.getElementById("skills");
if (skillsSection) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateSkillBars();
                }
            });
        },
        { threshold: 0.3 }
    );

    observer.observe(skillsSection);
}

// Filtrage des projets avec animations
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            // Animation des boutons
            filterButtons.forEach((btn) => {
                btn.classList.remove("active");
                btn.style.transform = "scale(1)";
            });

            button.classList.add("active");
            button.style.transform = "scale(1.1)";

            const filterValue = button.getAttribute("data-filter");

            // Animation des cartes
            projectCards.forEach((card) => {
                if (filterValue === "all" || card.getAttribute("data-category") === filterValue) {
                    card.style.opacity = "0";
                    card.style.transform = "translateY(50px)";

                    setTimeout(() => {
                        card.style.display = "block";
                    }, 200);

                    setTimeout(() => {
                        card.style.opacity = "1";
                        card.style.transform = "translateY(0)";
                    }, 300);
                } else {
                    card.style.opacity = "0";
                    card.style.transform = "translateY(-50px)";

                    setTimeout(() => {
                        card.style.display = "none";
                    }, 300);
                }
            });
        });
    });
}

// Animation au défilement avancée
const fadeElements = document.querySelectorAll(
    ".about-text, .about-image, .skill-category, .project-card, .contact-info, .contact-form"
);

if (fadeElements.length > 0) {
    const fadeObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0) rotateX(0)";
                }
            });
        },
        { threshold: 0.1 }
    );

    fadeElements.forEach((element) => {
        element.style.opacity = "0";
        element.style.transform = "translateY(50px) rotateX(10deg)";
        element.style.transition = "opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
        fadeObserver.observe(element);
    });
}

// Effet de souris sur les cartes
document.addEventListener("mousemove", (e) => {
    const cards = document.querySelectorAll(".project-card, .skill-category");

    cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const angleY = (x - centerX) / 25;
            const angleX = (centerY - y) / 25;

            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateZ(10px)`;
        }
    });
});

// Reset des transformations quand la souris quitte
document.addEventListener("mouseout", (e) => {
    if (!e.target.closest(".project-card, .skill-category")) {
        const cards = document.querySelectorAll(".project-card, .skill-category");
        cards.forEach((card) => {
            card.style.transform = "";
        });
    }
});

// Effet de typing sur le titre hero
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = "";

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Timeline Horizontale - VERSION COMPLÈTEMENT CORRIGÉE
class HorizontalTimeline {
    constructor() {
        this.track = document.querySelector('.timeline-track');
        this.events = document.querySelectorAll('.timeline-event');
        this.progressFill = document.querySelector('.progress-fill');
        this.scrollIndicator = document.querySelector('.scroll-indicator');
        this.eventsContainer = document.querySelector('.timeline-events');
        
        this.isScrolling = false;
        this.startX = 0;
        this.scrollLeft = 0;
        this.velocity = 0;
        this.lastX = 0;
        this.animationFrame = null;
        
        this.init();
    }
    
    init() {
        // Vérifications initiales pour éviter les TypeError si le DOM n'a pas les éléments attendus
        if (!this.track) {
            console.warn('HorizontalTimeline: .timeline-track introuvable — initialisation annulée');
            return;
        }
        if (!this.eventsContainer) {
            console.warn('HorizontalTimeline: .timeline-events introuvable — initialisation annulée');
            return;
        }

        this.extendTimeline();
        this.setupDragBehavior();
        this.setupAnimations();
        this.setupProgress();
        this.hideScrollIndicator();
        this.setupTabs(); // Initialisation des onglets

        console.log('🚀 Timeline horizontale initialisée avec onglets');
    }
    
    extendTimeline() {
        const totalWidth = Array.from(this.events).reduce((total, event) => {
            return total + event.offsetWidth + 120;
        }, 200);
        
        if (this.eventsContainer) {
            this.eventsContainer.style.minWidth = `${totalWidth}px`;
        }
        
        const progressLine = document.querySelector('.progress-line');
        if (progressLine) {
            progressLine.style.width = `${totalWidth}px`;
        }
    }
    
    setupDragBehavior() {
        if (!this.track) return; // garde supplémentaire

        // Empêche le comportement par défaut
        this.preventDefaultBehavior();
        
        // Drag start
        this.track.addEventListener('mousedown', (e) => {
            this.startDrag(e);
        });
        
        this.track.addEventListener('touchstart', (e) => {
            this.startDrag(e.touches[0]);
        });
        
        // Drag move
        document.addEventListener('mousemove', (e) => {
            this.dragMove(e);
        });
        
        document.addEventListener('touchmove', (e) => {
            this.dragMove(e.touches[0]);
        });
        
        // Drag end
        document.addEventListener('mouseup', () => {
            this.endDrag();
        });
        
        document.addEventListener('touchend', () => {
            this.endDrag();
        });
        
        // Empêche le menu contextuel
        this.track.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }

    // MÉTHODE CORRIGÉE POUR LES ONGLETS
    setupTabs() {
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const tabId = button.getAttribute('data-tab');
                const tabCard = button.closest('.tab-card');
                
                if (!tabCard) return;
                
                console.log('Clic sur onglet:', tabId);
                
                // Désactive tous les boutons dans cette carte
                tabCard.querySelectorAll('.tab-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Cache tous les panneaux dans cette carte
                tabCard.querySelectorAll('.tab-pane').forEach(pane => {
                    pane.classList.remove('active');
                });
                
                // Active le bouton et le panneau sélectionnés
                button.classList.add('active');
                
                const targetPane = tabCard.querySelector(`.tab-pane[data-tab="${tabId}"]`);
                if (targetPane) {
                    targetPane.classList.add('active');
                    console.log('Panneau activé:', tabId);
                }
            });
        });
        
        // Vérification initiale
        console.log('Onglets initialisés:', document.querySelectorAll('.tab-button').length);
    }
    
    preventDefaultBehavior() {
        this.track.addEventListener('dragstart', (e) => {
            e.preventDefault();
        });
        
        this.track.addEventListener('selectstart', (e) => {
            e.preventDefault();
        });
    }
    
    startDrag(e) {
        this.isScrolling = true;
        this.startX = e.pageX - this.track.offsetLeft;
        this.scrollLeft = this.track.scrollLeft;
        this.lastX = e.pageX;
        this.velocity = 0;
        
        this.track.style.cursor = 'grabbing';
        this.track.style.userSelect = 'none';
        
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
    
    dragMove(e) {
        if (!this.isScrolling) return;
        
        e.preventDefault();
        
        const x = e.pageX - this.track.offsetLeft;
        const walk = (x - this.startX) * 1.5;
        
        this.track.scrollLeft = this.scrollLeft - walk;
        
        this.velocity = e.pageX - this.lastX;
        this.lastX = e.pageX;
    }
    
    endDrag() {
        if (!this.isScrolling) return;
        
        this.isScrolling = false;
        this.track.style.cursor = 'grab';
        this.track.style.userSelect = 'none';
        
        this.applyInertia();
    }
    
    applyInertia() {
        if (Math.abs(this.velocity) < 0.5) return;
        
        const inertia = () => {
            this.track.scrollLeft -= this.velocity * 2;
            this.velocity *= 0.95;
            
            if (Math.abs(this.velocity) > 0.5) {
                this.animationFrame = requestAnimationFrame(inertia);
            } else {
                this.velocity = 0;
            }
        };
        
        this.animationFrame = requestAnimationFrame(inertia);
    }
    
    setupAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        });
        
        this.events.forEach(event => observer.observe(event));
    }
    
    setupProgress() {
        const updateProgress = () => {
            this.updateProgress();
            requestAnimationFrame(updateProgress);
        };
        
        requestAnimationFrame(updateProgress);
    }
    
    updateProgress() {
        const scrollableWidth = this.track.scrollWidth - this.track.clientWidth;
        const scrollProgress = scrollableWidth > 0 ? (this.track.scrollLeft / scrollableWidth) * 100 : 0;
        
        if (this.progressFill) {
            this.progressFill.style.width = `${scrollProgress}%`;
        }
    }
    
    hideScrollIndicator() {
        const checkScroll = () => {
            if (this.scrollIndicator && this.track.scrollLeft > 50) {
                this.scrollIndicator.classList.add('hidden');
            }
            requestAnimationFrame(checkScroll);
        };
        
        requestAnimationFrame(checkScroll);
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        new HorizontalTimeline();
    }, 100);
});

// Empêche le comportement par défaut
document.addEventListener('DOMContentLoaded', () => {
    const timelineSection = document.querySelector('.timeline-horizontal');
    if (timelineSection) {
        timelineSection.addEventListener('dragstart', (e) => {
            if (e.target.tagName === 'IMG') {
                e.preventDefault();
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-content h1'); // ou l'élément que vous voulez animer
    
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = ""; // Vide le texte
        
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 80);
        }, 500);
    }
});