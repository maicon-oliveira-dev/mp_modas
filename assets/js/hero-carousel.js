(function () {
    "use strict";

    const hero = document.querySelector(".hero");

    if (!hero) {
        return;
    }

    const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
    const previousButton = hero.querySelector("[data-hero-previous]");
    const nextButton = hero.querySelector("[data-hero-next]");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const delay = 6000;
    let activeIndex = 0;
    let timerId;
    let touchStart;
    const swipeThreshold = 50;

    function canAutoplay() {
        return !reducedMotion.matches && !document.hidden && !hero.matches(":hover") && !hero.contains(document.activeElement);
    }

    function stopAutoplay() {
        window.clearTimeout(timerId);
        timerId = undefined;
    }

    function startAutoplay() {
        stopAutoplay();

        if (!canAutoplay()) {
            return;
        }

        timerId = window.setTimeout(() => {
            goTo(activeIndex + 1);
            startAutoplay();
        }, delay);
    }

    function goTo(index) {
        activeIndex = (index + slides.length) % slides.length;

        slides.forEach((slide, slideIndex) => {
            const isActive = slideIndex === activeIndex;

            slide.classList.toggle("is-active", isActive);
            slide.toggleAttribute("aria-hidden", !isActive);
            slide.toggleAttribute("inert", !isActive);
        });

        hero.dataset.controlsTheme = slides[activeIndex].dataset.controlsTheme || "light";

    }

    previousButton?.addEventListener("click", () => {
        goTo(activeIndex - 1);
        startAutoplay();
    });

    nextButton?.addEventListener("click", () => {
        goTo(activeIndex + 1);
        startAutoplay();
    });

    hero.addEventListener("mouseenter", stopAutoplay);
    hero.addEventListener("mouseleave", startAutoplay);
    hero.addEventListener("focusin", stopAutoplay);
    hero.addEventListener("focusout", () => window.setTimeout(startAutoplay));
    hero.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            goTo(activeIndex - 1);
            startAutoplay();
        }

        if (event.key === "ArrowRight") {
            event.preventDefault();
            goTo(activeIndex + 1);
            startAutoplay();
        }
    });
    hero.addEventListener("touchstart", (event) => {
        const interactiveTarget = event.target instanceof Element && event.target.closest("a, button");

        if (event.touches.length !== 1 || interactiveTarget) {
            touchStart = undefined;
            return;
        }

        const touch = event.touches[0];

        touchStart = { x: touch.clientX, y: touch.clientY };
        stopAutoplay();
    }, { passive: true });
    hero.addEventListener("touchend", (event) => {
        if (!touchStart) {
            return;
        }

        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - touchStart.x;
        const deltaY = touch.clientY - touchStart.y;

        touchStart = undefined;

        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) >= swipeThreshold) {
            goTo(activeIndex + (deltaX < 0 ? 1 : -1));
        }

        startAutoplay();
    }, { passive: true });
    hero.addEventListener("touchcancel", () => {
        touchStart = undefined;
        startAutoplay();
    }, { passive: true });
    document.addEventListener("visibilitychange", startAutoplay);
    reducedMotion.addEventListener("change", startAutoplay);

    goTo(0);
    startAutoplay();
})();
