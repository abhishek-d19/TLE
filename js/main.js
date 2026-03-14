// GSAP Animations and main interactivity logic

document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    // 1. Navbar Scroll Effect (index/shop/business)
    const navbar = document.getElementById("navbar");
    if(navbar) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 100) {
                navbar.classList.add("scrolled");
                navbar.classList.remove("py-6");
                navbar.classList.add("py-4");
            } else {
                navbar.classList.remove("scrolled");
                navbar.classList.add("py-6");
                navbar.classList.remove("py-4");
            }
        });
    }

    // --- Sub-Page Specific Animations --- //
    // Shop Page Animations
    if(document.querySelector("header h1")) {
        gsap.from("header h1", {
            y: "100%",
            opacity: 0,
            duration: 1.2,
            ease: "power4.out",
            clipPath: "inset(0 0 100% 0)", 
        });
        gsap.to("header h1", {
            clipPath: "inset(0 0 0% 0)",
            duration: 0.1
        });
        
        gsap.from("header p", {
            y: 20,
            opacity: 0,
            duration: 0.8,
            delay: 0.4
        });
        
        // Shop Grid Items
        gsap.from("section .group", {
            scrollTrigger: {
                trigger: "section",
                start: "top 80%"
            },
            y: 40,
            opacity: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: "power3.out"
        });
    }

    // Business & Login Forms Reveal
    if(document.querySelector("main form") || document.querySelector("main .grid > div")) {
        gsap.from("main h1, main h2", {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1
        });
        gsap.from("main > div > div", {
            y: 40,
            opacity: 0,
            stagger: 0.15,
            duration: 0.8,
            delay: 0.2
        });
    }
    // 2. Hero Animations - Brutalist reveal (sliding up harsh)
    const tlHero = gsap.timeline();
    
    tlHero.from(".hero-title", {
        y: "100%",
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        clipPath: "inset(0 0 100% 0)", 
        delay: 0.2
    })
    .to(".hero-title", {
        clipPath: "inset(0 0 0% 0)",
        duration: 0.1
    }, "<")
    .from(".hero-subtitle, .hero-cta", {
        y: 20,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out"
    }, "-=0.6");


    // 3. Features Animation
    gsap.from(".feature-header h2, .feature-header p", {
        scrollTrigger: {
            trigger: "#mission",
            start: "top 80%",
        },
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out"
    });

    gsap.from(".feature-card", {
        scrollTrigger: {
            trigger: ".feature-card",
            start: "top 85%",
        },
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out"
    });

    // 4. Material Section 
    gsap.from(".material-content h2, .material-content p, .material-content a", {
        scrollTrigger: {
            trigger: "#material",
            start: "top 75%",
        },
        y: 30,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out"
    });

    gsap.from(".material-image-container", {
        scrollTrigger: {
            trigger: "#material",
            start: "top 75%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power4.out"
    });

    // 5. Impact Counter Animation
    const counters = document.querySelectorAll(".counter");
    
    ScrollTrigger.create({
        trigger: "#impact",
        start: "top 80%",
        once: true,
        onEnter: () => {
            counters.forEach(counter => {
                const target = parseFloat(counter.getAttribute("data-target"));
                gsap.to(counter, {
                    innerHTML: target,
                    duration: 2,
                    ease: "power2.out",
                    snap: { innerHTML: target % 1 === 0 ? 1 : 0.1 },
                    onUpdate: function() {
                        if(target % 1 !== 0) {
                            counter.innerHTML = Number(this.targets()[0].innerHTML).toFixed(1);
                        }
                    }
                });
            });
            
            gsap.from(".stat-item", {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.15,
                ease: "power3.out"
            });
        }
    });

    // 6. Process Sequence
    gsap.from(".process-header h2", {
        scrollTrigger: {
            trigger: "#process",
            start: "top 80%"
        },
        y: 30,
        opacity: 0,
        duration: 0.8
    });

    // Animate process steps based on scroll
    const processSteps = document.querySelectorAll(".process-step");
    processSteps.forEach((step, i) => {
        gsap.from(step, {
            scrollTrigger: {
                trigger: step,
                start: "top 80%"
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        });
    });

    // 7. Products Section
    gsap.from(".products-header h2, .products-header a", {
        scrollTrigger: {
            trigger: "#products",
            start: "top 80%"
        },
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6
    });

    gsap.from(".product-card", {
        scrollTrigger: {
            trigger: ".product-card",
            start: "top 75%"
        },
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out"
    });

    // 8. CTA Scale
    gsap.from(".cta-section h2", {
        scrollTrigger: {
            trigger: ".cta-section",
            start: "top 80%"
        },
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: "power4.out"
    });
});
