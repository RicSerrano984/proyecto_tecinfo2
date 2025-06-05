document.addEventListener('DOMContentLoaded', () => {
    const title = document.querySelector('.vanguard-title');
    const sections = document.querySelectorAll('.vanguard-content section');
    const canvaLink = document.querySelector('.canva-link');

    // Efecto de desplazamiento para secciones (sutil)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0) rotate(var(--initial-rotate))';
                observer.unobserve(entry.target); // Detiene la observación una vez que es visible
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        // Establece una rotación inicial ligeramente diferente para cada sección
        const randomRotate = (Math.random() * 4 - 2).toFixed(1); // Entre -2 y 2 grados
        section.style.setProperty('--initial-rotate', `${randomRotate}deg`);
        section.style.opacity = 0;
        section.style.transform = 'translateY(20px)'; // Inicialmente fuera de vista
        section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        sectionObserver.observe(section);
    });

    // Pequeño efecto de "glitch" en el título al cargar
    if (title) {
        const originalText = title.textContent;
        const glitchChars = '!@#$%^&*()_+-=[]{};\':"|,.<>/?`~';
        let glitchCount = 0;

        function applyGlitch() {
            let glitchText = '';
            for (let i = 0; i < originalText.length; i++) {
                if (Math.random() < 0.2) { // 20% de probabilidad de glitchear un carácter
                    glitchText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
                } else {
                    glitchText += originalText[i];
                }
            }
            title.textContent = glitchText;
            glitchCount++;
            if (glitchCount < 5) { // Ejecutar unas pocas veces
                setTimeout(applyGlitch, 50);
            } else {
                title.textContent = originalText; // Restaurar el texto original
            }
        }
        setTimeout(applyGlitch, 500); // Iniciar el glitch después de un pequeño retraso
    }

    // Efecto interactivo al hacer hover en el link de Canva (más allá del CSS)
    if (canvaLink) {
        canvaLink.addEventListener('mouseenter', () => {
            canvaLink.style.textShadow = `0 0 5px var(--color-primary), 0 0 10px var(--color-accent)`;
        });
        canvaLink.addEventListener('mouseleave', () => {
            canvaLink.style.textShadow = 'none';
        });
    }

});
