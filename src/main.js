import './style.css';
import { gsap } from 'gsap';

const container = document.querySelector('#image-container');
const beginBtn = document.querySelector('#begin-btn');

const allImages = import.meta.glob('./assets/hero-images/*.jfif', { 
    eager: true, 
    import: 'default' 
});

const imageUrls = Object.values(allImages);

let imageIndex = 0;
let lastMousePos = { x: 0, y: 0 };

const threshold = 220; 
const imgWidth = 220;
const imgHeight = 200;

const createTrailImage = (x, y) => {
    if (imageUrls.length === 0) return;

    const img = document.createElement('div');
    img.className = 'trail-image';
    img.style.backgroundImage = `url(${imageUrls[imageIndex]})`;
    imageIndex = (imageIndex + 1) % imageUrls.length;

    const offsetX = imgWidth / 2;
    const offsetY = imgHeight / 2;

    gsap.set(img, {
        x: x - offsetX,
        y: y - offsetY,
        scale: 0.8,
        opacity: 0
    });

    container.appendChild(img);

    const tl = gsap.timeline();
    tl.to(img, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
    })
    .to(img, {
        opacity: 0,
        scale: 0.7,
        duration: 0.8,
        delay: 0.2,
        onComplete: () => img.remove()
    });
};

beginBtn.addEventListener('click', (e) => {
    e.preventDefault(); 
    gsap.to(["#app", ".trail-image"], {
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut",
        onComplete: () => {
            window.location.href = '/menu.html';
        }
    });
});

window.addEventListener('mousemove', (e) => {
    const distance = Math.hypot(
        e.clientX - lastMousePos.x, 
        e.clientY - lastMousePos.y
    );

    if (distance > threshold) {
        createTrailImage(e.clientX, e.clientY);
        lastMousePos = { x: e.clientX, y: e.clientY };
    }
});