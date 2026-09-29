(function () {
    "use strict";
    const catalog = document.querySelector(".catalog");
    if (!catalog) return;
    const products = [...catalog.querySelectorAll(".product-card")];
    const count = catalog.querySelector(".catalog__count");
    const empty = catalog.querySelector(".catalog__empty");
    const brandLinks = [...catalog.querySelectorAll("[data-brand-link]")];
    const params = new URLSearchParams(window.location.search);
    const categories = new Set(["all", "camiseta", "jaqueta", "calca", "bermuda"]);
    const brands = new Set(["all", "mcd", "levis", "lee", "ogochi", "oceano"]);
    const getFilterValue = (value, allowedValues) =>
        allowedValues.has(value) ? value : "all";
    const activeCategory = getFilterValue(params.get("category"), categories);
    const activeBrand = getFilterValue(params.get("brand"), brands);
    if (!products.length) return;

    function updateCatalog() {
        let visible = 0;
        products.forEach((product) => {
            const matchesCategory =
                activeCategory === "all" ||
                product.dataset.category === activeCategory;
            const matchesBrand =
                activeBrand === "all" ||
                product.dataset.brand === activeBrand;
            const isVisible = matchesCategory && matchesBrand;
            product.hidden = !isVisible;
            if (isVisible) visible += 1;
        });
        if (count) {
            count.textContent = visible === 1 ? "1 peça" : visible + " peças";
        }

        if (empty) {
            empty.hidden = visible !== 0;
        }

    }

    function updateBrandNavigation() {
        brandLinks.forEach((link) => {
            const brand = link.dataset.brandLink;
            const linkParams = new URLSearchParams();

            if (activeCategory !== "all") {
                linkParams.set("category", activeCategory);
            }

            if (brand !== "all") {
                linkParams.set("brand", brand);
            }

            const query = linkParams.toString();
            link.href = "masculino.html" + (query ? "?" + query : "");

            if (brand === activeBrand) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    updateCatalog();
    updateBrandNavigation();
})();
