(function () {
    "use strict";

    const catalog = document.querySelector("[data-feminino-catalog]");
    if (!catalog) return;

    const products = [...catalog.querySelectorAll(".feminino-product")];
    const count = catalog.querySelector("[data-feminino-count]");
    const empty = catalog.querySelector("[data-feminino-empty]");
    const params = new URLSearchParams(window.location.search);
    const allowedCategories = new Set(["all", "camiseta", "calca", "outros"]);
    const allowedBrands = new Set(["all", "elavive", "bivik", "lee", "levis", "youngstyle"]);
    const activeCategory = allowedCategories.has(params.get("category")) ? params.get("category") : "all";
    const activeBrand = allowedBrands.has(params.get("brand")) ? params.get("brand") : "all";

    const url = (category, brand) => {
        const query = new URLSearchParams();
        if (brand !== "all") query.set("brand", brand);
        if (category !== "all") query.set("category", category);
        return "feminino.html" + (query.toString() ? "?" + query.toString() : "");
    };

    products.forEach(product => {
        product.hidden = !((activeCategory === "all" || product.dataset.category === activeCategory)
            && (activeBrand === "all" || product.dataset.brand === activeBrand));
    });

    const visible = products.filter(product => !product.hidden).length;
    if (count) count.textContent = visible === 1 ? "1 peça" : visible + " peças";
    if (empty) empty.hidden = visible !== 0;

    catalog.querySelectorAll("[data-feminino-category]").forEach(link => {
        const value = link.dataset.femininoCategory;
        link.href = url(value, activeBrand);
        link.toggleAttribute("aria-current", value === activeCategory);
    });
    catalog.querySelectorAll("[data-feminino-brand]").forEach(link => {
        const value = link.dataset.femininoBrand;
        link.href = url(activeCategory, value);
        link.toggleAttribute("aria-current", value === activeBrand);
    });
}());
