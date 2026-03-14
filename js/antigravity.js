document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('antigravity-container');
    const NUM_IMAGES = 12; // 8-12 images as requested
    const cards = [];
    
    // Seed sources for abstract/tech images
    const themes = ['technology', 'futuristic', 'abstract', 'neon', 'cyberpunk', 'glass', 'space', 'robot', 'code', 'ai', 'geometric', 'fluid'];
    
    for (let i = 0; i < NUM_IMAGES; i++) {
        // Create element
        const el = document.createElement('div');
        // Glassmorphism card effect, soft glow shadow, rounded corners
        el.className = 'absolute rounded-3xl overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.15)] cursor-pointer group flex items-center justify-center';
        
        // Dimensions
        const width = 200 + Math.random() * 150;
        const height = width * (0.8 + Math.random() * 0.4);
        
        el.style.width = width + 'px';
        el.style.height = height + 'px';
        // Base starting scale logic
        el.style.transformOrigin = 'center center';
        
        // Image
        const img = document.createElement('img');
        const seedReq = Math.floor(Math.random() * 1000);
        
        // Using picsum photos as requested, with random seeds for cache bursting
        img.src = `https://picsum.photos/seed/${themes[i % themes.length]}${seedReq}/${Math.round(width)}/${Math.round(height)}`;
        img.className = 'w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 group-hover:rotate-2 transition-all duration-500 rounded-3xl';
        img.crossOrigin = "anonymous";
        img.alt = `Floating ${themes[i % themes.length]} object`;
        
        const overlay = document.createElement('div');
        overlay.className = 'absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl';
        
        el.appendChild(img);
        el.appendChild(overlay);
        container.appendChild(el);
        
        // Physics properties
        cards.push({
            el: el,
            width: width,
            height: height,
            x: Math.random() * (window.innerWidth - width),
            y: Math.random() * (window.innerHeight - height),
            vx: (Math.random() - 0.5) * 3, // slightly faster initial velocity
            vy: (Math.random() - 0.5) * 3,
            rotation: Math.random() * 360,
            vr: (Math.random() - 0.5) * 1, // rotational velocity
            mass: width * height,
            isExpanded: false
        });
        
        // Click event to enlarge smoothing
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = cards[i];
            
            if (card.isExpanded) {
                // Shrink back
                card.isExpanded = false;
                el.style.zIndex = '10';
                el.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                
                // Remove fixed positioning styling
                el.style.width = card.width + 'px';
                el.style.height = card.height + 'px';
                el.classList.remove('shadow-[0_0_100px_rgba(255,255,255,0.4)]');
                
                // Allow physics to resume soon
                setTimeout(() => {
                    if(!card.isExpanded) el.style.transition = ''; // Remove transition for smooth physics
                }, 500);
                
            } else {
                // Shrink others
                cards.forEach(c => {
                    if(c.isExpanded) {
                        c.isExpanded = false;
                        c.el.style.zIndex = '10';
                        c.el.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                        c.el.style.width = c.width + 'px';
                        c.el.style.height = c.height + 'px';
                        c.el.classList.remove('shadow-[0_0_100px_rgba(255,255,255,0.4)]');
                        setTimeout(() => {
                            if(!c.isExpanded) c.el.style.transition = '';
                        }, 500);
                    }
                });
                
                // Expand this one
                card.isExpanded = true;
                el.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                el.style.zIndex = '50';
                
                // Center calculations - simulate fixed
                const cx = window.innerWidth / 2 - window.innerWidth * 0.3;
                const cy = window.innerHeight / 2 - window.innerHeight * 0.35;
                
                card.x = cx;
                card.y = cy;
                card.rotation = 0;
                
                // Make it huge
                el.style.width = '60vw';
                el.style.height = '70vh';
                el.classList.add('shadow-[0_0_100px_rgba(255,255,255,0.4)]');
                
                // kill velocity
                card.vx = 0;
                card.vy = 0;
                card.vr = 0;
            }
        });
    }
    
    // Un-expand on background click
    document.addEventListener('click', () => {
        cards.forEach(c => {
            if(c.isExpanded) {
                c.isExpanded = false;
                c.el.style.zIndex = '10';
                c.el.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                c.el.style.width = c.width + 'px';
                c.el.style.height = c.height + 'px';
                c.el.classList.remove('shadow-[0_0_100px_rgba(255,255,255,0.4)]');
                setTimeout(() => {
                    if(!c.isExpanded) c.el.style.transition = '';
                }, 500);
            }
        });
    });

    let mouseX = -1000;
    let mouseY = -1000;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    let lastTime = performance.now();

    // Physics Loop
    function update(time) {
        const dt = Math.min((time - lastTime) / 16, 2); // normalise to 60fps, cap at 2x frame drop
        lastTime = time;
        
        const W = window.innerWidth;
        const H = window.innerHeight;
        
        for (let i = 0; i < NUM_IMAGES; i++) {
            const card = cards[i];
            
            if (card.isExpanded) {
                // Enforce centered transform physically
                card.el.style.transform = `translate(${card.x}px, ${card.y}px) rotate(${card.rotation}deg)`;
                continue; 
            }
            
            // Apply velocity
            card.x += card.vx * dt;
            card.y += card.vy * dt;
            card.rotation += card.vr * dt;
            
            // Very light friction
            card.vx *= 0.999;
            card.vy *= 0.999;
            card.vr *= 0.995;
            
            // Mouse Repulsion
            const cx = card.x + card.width / 2;
            const cy = card.y + card.height / 2;
            const dx = cx - mouseX;
            const dy = cy - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 300) {
                const force = (300 - dist) / 300;
                card.vx += (dx / dist) * force * 0.3;
                card.vy += (dy / dist) * force * 0.3;
            }
            
            // Wall Collisions
            if (card.x <= 0) {
                card.x = 0;
                card.vx *= -1;
                card.vr += (Math.random() - 0.5);
            } else if (card.x + card.width >= W) {
                card.x = W - card.width;
                card.vx *= -1;
                card.vr += (Math.random() - 0.5);
            }
            
            if (card.y <= 0) {
                card.y = 0;
                card.vy *= -1;
                card.vr += (Math.random() - 0.5);
            } else if (card.y + card.height >= H) {
                card.y = H - card.height;
                card.vy *= -1;
                card.vr += (Math.random() - 0.5);
            }
            
            // Simple AABB Collision with other cards
            for (let j = i + 1; j < NUM_IMAGES; j++) {
                const other = cards[j];
                if (other.isExpanded) continue;
                
                if (card.x < other.x + other.width &&
                    card.x + card.width > other.x &&
                    card.y < other.y + other.height &&
                    card.height + card.y > other.y) {
                    
                    // Collision occurred
                    const overlapX = Math.min(card.x + card.width - other.x, other.x + other.width - card.x);
                    const overlapY = Math.min(card.y + card.height - other.y, other.y + other.height - card.y);
                    
                    if (overlapX < overlapY) {
                        const dir = card.x < other.x ? -1 : 1;
                        // elastic collision based on mass (size approximation)
                        const totalMass = card.mass + other.mass;
                        const v1x = card.vx;
                        const v2x = other.vx;
                        
                        card.vx = ((card.mass - other.mass) * v1x + 2 * other.mass * v2x) / totalMass * 0.9;
                        other.vx = ((other.mass - card.mass) * v2x + 2 * card.mass * v1x) / totalMass * 0.9;
                        
                        card.x += dir * overlapX / 2;
                        other.x -= dir * overlapX / 2;
                    } else {
                        const dir = card.y < other.y ? -1 : 1;
                        const totalMass = card.mass + other.mass;
                        const v1y = card.vy;
                        const v2y = other.vy;
                        
                        card.vy = ((card.mass - other.mass) * v1y + 2 * other.mass * v2y) / totalMass * 0.9;
                        other.vy = ((other.mass - card.mass) * v2y + 2 * card.mass * v1y) / totalMass * 0.9;
                        
                        card.y += dir * overlapY / 2;
                        other.y -= dir * overlapY / 2;
                    }
                    
                    // Add slight rotation on bounce
                    card.vr += (Math.random() - 0.5) * 0.8;
                    other.vr += (Math.random() - 0.5) * 0.8;
                }
            }
            
            // Limit speeds to prevent crazy flying
            const maxSpeed = 4;
            const speed = Math.sqrt(card.vx*card.vx + card.vy*card.vy);
            if(speed > maxSpeed) {
                card.vx = (card.vx/speed) * maxSpeed;
                card.vy = (card.vy/speed) * maxSpeed;
            }
            
            // Minimum speed to keep them floating
            if (speed < 0.2) {
                card.vx += (Math.random() - 0.5) * 0.1;
                card.vy += (Math.random() - 0.5) * 0.1;
            }
            
            // Render transform
            // Only update transform if not transitioning manually
            if (card.el.style.transition === '') {
                card.el.style.transform = `translate(${card.x}px, ${card.y}px) rotate(${card.rotation}deg)`;
            }
        }
        
        requestAnimationFrame(update);
    }
    
    // Start loop
    requestAnimationFrame(update);
});
