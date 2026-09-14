(function () {
    "use strict";

    const hero = document.querySelector(".hero");

    if (!hero) {
        return;
    }

    const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
    const previousButton = hero.querySelector("[data-hero-previous]");
    const nextButton = hero.querySelector("[data-hero-next]");
    const indicators = Array.from(hero.querySelectorAll("[data-hero-indicator]"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const delay = 6000;
    let activeIndex = 0;
    let timerId;
    let touchStartX = 0;

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

        indicators.forEach((indicator, indicatorIndex) => {
            indicator.toggleAttribute("aria-current", indicatorIndex === activeIndex);
        });
    }

    previousButton?.addEventListener("click", () => {
        goTo(activeIndex - 1);
        startAutoplay();
    });

    nextButton?.addEventListener("click", () => {
        goTo(activeIndex + 1);
        startAutoplay();
    });

    indicators.forEach((indicator) => {
        indicator.addEventListener("click", () => {
            goTo(Number(indicator.dataset.heroIndicator));
            startAutoplay();
        });
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
        touchStartX = event.changedTouches[0].clientX;
        stopAutoplay();
    }, { passive: true });
    hero.addEventListener("touchend", (event) => {
        const distance = event.changedTouches[0].clientX - touchStartX;

        if (Math.abs(distance) > 40) {
            goTo(activeIndex + (distance < 0 ? 1 : -1));
        }

        startAutoplay();
    }, { passive: true });
    document.addEventListener("visibilitychange", startAutoplay);
    reducedMotion.addEventListener("change", startAutoplay);

    goTo(0);
    startAutoplay();
})();
