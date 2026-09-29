(function () {
    "use strict";

    const desktopMedia = window.matchMedia("(min-width: 48rem)");
    const menuButton = document.querySelector(".menu-button");
    const mobileMenu = document.querySelector("#mobile-menu");
    const mobileSubmenuToggle = mobileMenu?.querySelector(".mobile-submenu__toggle");
    const mobileSubmenu = mobileMenu?.querySelector("#mobile-submenu-masculino");
    const megaMenuItem = document.querySelector(".site-nav__item--has-mega");
    const megaMenuTrigger = megaMenuItem?.querySelector(".site-nav__mega-trigger");
    const megaMenu = megaMenuItem?.querySelector("#mega-menu-masculino");
    let megaCloseTimer = null;

    if (!menuButton || !mobileMenu) {
        return;
    }

    function getVisibleMenuLinks() {
        return Array.from(mobileMenu.querySelectorAll("a[href]"))
            .filter((link) => !link.closest("[hidden]"));
    }

    function isOpen() {
        return !mobileMenu.hidden;
    }

    function setMenuState(open, options = {}) {
        const { returnFocus = false, moveFocus = false } = options;

        mobileMenu.hidden = !open;
        menuButton.setAttribute("aria-expanded", String(open));
        menuButton.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
        document.body.classList.toggle("menu-open", open);

        if (open && moveFocus) {
            getVisibleMenuLinks()[0]?.focus();
        }

        if (!open && returnFocus) {
            menuButton.focus();
        }
    }

    function toggleMenu() {
        setMenuState(!isOpen(), { moveFocus: !isOpen(), returnFocus: isOpen() });
    }

    function handleMenuKeydown(event) {
        if (!isOpen()) {
            return;
        }

        if (event.key === "Escape") {
            event.preventDefault();
            setMenuState(false, { returnFocus: true });
            return;
        }

        const menuLinks = getVisibleMenuLinks();
        const firstMenuItem = menuLinks[0];
        const lastMenuItem = menuLinks.at(-1);

        if (event.key !== "Tab" || !firstMenuItem || !lastMenuItem) {
            return;
        }

        if (event.shiftKey) {
            if (document.activeElement === firstMenuItem) {
                event.preventDefault();
                menuButton.focus();
            } else if (document.activeElement === menuButton) {
                event.preventDefault();
                lastMenuItem.focus();
            }
        } else if (document.activeElement === lastMenuItem) {
            event.preventDefault();
            menuButton.focus();
        } else if (document.activeElement === menuButton) {
            event.preventDefault();
            firstMenuItem.focus();
        }
    }

    menuButton.addEventListener("click", toggleMenu);

    function setMobileSubmenuState(open) {
        if (!mobileSubmenuToggle || !mobileSubmenu) {
            return;
        }

        mobileSubmenu.hidden = !open;
        mobileSubmenuToggle.setAttribute("aria-expanded", String(open));
        mobileSubmenuToggle.setAttribute(
            "aria-label",
            open ? "Fechar submenu Masculino" : "Abrir submenu Masculino"
        );
    }

    mobileSubmenuToggle?.addEventListener("click", () => {
        setMobileSubmenuState(mobileSubmenu.hidden);
    });

    function setMegaMenuState(open, options = {}) {
        const { returnFocus = false } = options;

        if (!megaMenuItem || !megaMenuTrigger || !megaMenu || !desktopMedia.matches) {
            return;
        }

        if (open) {
            cancelMegaClose();
        }

        megaMenu.hidden = !open;
        megaMenuTrigger.setAttribute("aria-expanded", String(open));

        if (!open && returnFocus) {
            megaMenuTrigger.focus();
        }
    }

    function cancelMegaClose() {
        if (megaCloseTimer) {
            window.clearTimeout(megaCloseTimer);
            megaCloseTimer = null;
        }
    }

    function scheduleMegaClose() {
        cancelMegaClose();
        megaCloseTimer = window.setTimeout(() => {
            megaCloseTimer = null;
            setMegaMenuState(false);
        }, 150);
    }

    function closeMegaMenuWhenFocusLeaves() {
        window.setTimeout(() => {
            if (
                desktopMedia.matches &&
                megaMenuItem &&
                !megaMenuItem.contains(document.activeElement)
            ) {
                setMegaMenuState(false);
            }
        });
    }

    megaMenuItem?.addEventListener("pointerenter", () => setMegaMenuState(true));
    megaMenuItem?.addEventListener("pointerleave", scheduleMegaClose);
    megaMenuItem?.addEventListener("focusin", () => setMegaMenuState(true));
    megaMenuItem?.addEventListener("focusout", closeMegaMenuWhenFocusLeaves);
    megaMenuItem?.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            event.preventDefault();
            cancelMegaClose();
            setMegaMenuState(false, { returnFocus: true });
        }
    });

    document.addEventListener("pointerdown", (event) => {
        if (
            desktopMedia.matches &&
            megaMenuItem &&
            !megaMenuItem.contains(event.target)
        ) {
            cancelMegaClose();
            setMegaMenuState(false);
        }
    });

    mobileMenu.addEventListener("click", (event) => {
        if (event.target.closest("a[href]")) {
            setMenuState(false);
        }
    });

    document.addEventListener("keydown", handleMenuKeydown);

    desktopMedia.addEventListener("change", (event) => {
        if (event.matches && isOpen()) {
            setMenuState(false);
        }

        if (event.matches) {
            cancelMegaClose();
            setMobileSubmenuState(false);
        } else if (megaMenu && !megaMenu.hidden) {
            cancelMegaClose();
            megaMenu.hidden = true;
            megaMenuTrigger?.setAttribute("aria-expanded", "false");
        }
    });

    setMenuState(false);
    setMobileSubmenuState(false);
})();
