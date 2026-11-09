(function () {
    "use strict";

    const desktopMedia = window.matchMedia("(min-width: 48rem)");
    const menuButton = document.querySelector(".menu-button");
    const mobileMenu = document.querySelector("#mobile-menu");
    const mobileSubmenus = [...document.querySelectorAll(".mobile-submenu__toggle")]
        .map(toggle => ({ toggle, panel: document.getElementById(toggle.getAttribute("aria-controls")) }))
        .filter(item => item.panel);
    const megaMenus = [...document.querySelectorAll(".site-nav__item--has-mega")]
        .map(item => ({ item, trigger: item.querySelector(".site-nav__mega-trigger"), panel: item.querySelector(".mega-menu"), closeTimer: null }))
        .filter(item => item.trigger && item.panel);

    if (!menuButton || !mobileMenu) return;

    const visibleMobileControls = () => [...mobileMenu.querySelectorAll("a[href], button")]
        .filter(control => !control.closest("[hidden]"));
    const setMobileSubmenuState = (target, open) => {
        target.panel.hidden = !open;
        target.toggle.setAttribute("aria-expanded", String(open));
        const label = target.toggle.dataset.submenuLabel || target.toggle.getAttribute("aria-label").replace(/^(Abrir|Fechar)\s+/, "") || "submenu";
        target.toggle.setAttribute("aria-label", (open ? "Fechar " : "Abrir ") + label);
    };
    const closeMobileSubmenus = () => mobileSubmenus.forEach(item => setMobileSubmenuState(item, false));
    const setMenuState = (open, options = {}) => {
        const { returnFocus = false, moveFocus = false } = options;
        mobileMenu.hidden = !open;
        menuButton.setAttribute("aria-expanded", String(open));
        menuButton.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
        document.body.classList.toggle("menu-open", open);
        if (!open) closeMobileSubmenus();
        if (open && moveFocus) visibleMobileControls()[0]?.focus();
        if (!open && returnFocus) menuButton.focus();
    };

    menuButton.addEventListener("click", () => {
        const open = mobileMenu.hidden;
        setMenuState(open, { moveFocus: open, returnFocus: !open });
    });
    mobileSubmenus.forEach(target => target.toggle.addEventListener("click", () => {
        const open = target.panel.hidden;
        if (open) mobileSubmenus.filter(item => item !== target).forEach(item => setMobileSubmenuState(item, false));
        setMobileSubmenuState(target, open);
    }));

    const cancelMegaClose = target => {
        if (target.closeTimer) {
            window.clearTimeout(target.closeTimer);
            target.closeTimer = null;
        }
    };
    const setMegaMenuState = (target, open, options = {}) => {
        if (!desktopMedia.matches) return;
        if (open) {
            megaMenus.filter(item => item !== target).forEach(item => {
                cancelMegaClose(item);
                item.panel.hidden = true;
                item.trigger.setAttribute("aria-expanded", "false");
            });
            cancelMegaClose(target);
        }
        target.panel.hidden = !open;
        target.trigger.setAttribute("aria-expanded", String(open));
        if (!open && options.returnFocus) target.trigger.focus();
    };

    megaMenus.forEach(target => {
        const scheduleClose = () => {
            cancelMegaClose(target);
            target.closeTimer = window.setTimeout(() => {
                target.closeTimer = null;
                setMegaMenuState(target, false);
            }, 150);
        };
        target.item.addEventListener("pointerenter", () => setMegaMenuState(target, true));
        target.item.addEventListener("pointerleave", scheduleClose);
        target.item.addEventListener("focusin", () => setMegaMenuState(target, true));
        target.item.addEventListener("focusout", () => window.setTimeout(() => {
            if (desktopMedia.matches && !target.item.contains(document.activeElement)) setMegaMenuState(target, false);
        }));
        target.item.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                event.preventDefault();
                cancelMegaClose(target);
                setMegaMenuState(target, false, { returnFocus: true });
            }
        });
    });

    document.addEventListener("pointerdown", event => {
        if (desktopMedia.matches) megaMenus.forEach(target => {
            if (!target.item.contains(event.target)) {
                cancelMegaClose(target);
                setMegaMenuState(target, false);
            }
        });
    });
    mobileMenu.addEventListener("click", event => {
        if (event.target.closest("a[href]")) setMenuState(false);
    });
    document.addEventListener("keydown", event => {
        if (mobileMenu.hidden) return;
        if (event.key === "Escape") {
            event.preventDefault();
            setMenuState(false, { returnFocus: true });
            return;
        }
        const controls = visibleMobileControls();
        const first = controls[0];
        const last = controls.at(-1);
        if (event.key !== "Tab" || !first || !last) return;
        if (event.shiftKey && (document.activeElement === first || document.activeElement === menuButton)) {
            event.preventDefault();
            (document.activeElement === first ? menuButton : last).focus();
        } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === menuButton)) {
            event.preventDefault();
            (document.activeElement === last ? menuButton : first).focus();
        }
    });
    desktopMedia.addEventListener("change", event => {
        if (event.matches) {
            if (!mobileMenu.hidden) setMenuState(false);
            closeMobileSubmenus();
        } else {
            megaMenus.forEach(target => {
                cancelMegaClose(target);
                target.panel.hidden = true;
                target.trigger.setAttribute("aria-expanded", "false");
            });
        }
    });
    setMenuState(false);
}());
