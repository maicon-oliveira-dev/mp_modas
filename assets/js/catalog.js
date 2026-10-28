(function () {
    "use strict";
    const catalog = document.querySelector(".catalog");
    if (!catalog) return;
    const grid = catalog.querySelector(".catalog__grid");
    const count = catalog.querySelector(".catalog__count");
    const empty = catalog.querySelector(".catalog__empty");
    const params = new URLSearchParams(window.location.search);
    const categories = new Set(["all", "camiseta", "polo", "calcao", "calca", "moletom", "bone", "outros"]);
    const brands = new Set(["all", "bivik", "broken-rules", "cavaleira", "elemento-zero", "hawaiian-dreams", "lee", "levis", "lucano", "mcd", "oceano", "ogochi", "red-nose", "sem-marca", "surfside-living", "texas", "tookas", "youngstyle"]);
    const base = "../assets/img/produtos-novos/";
    const names = {bivik:"Bivik","broken-rules":"Broken Rules",cavaleira:"Cavaleira","elemento-zero":"Elemento Zero","hawaiian-dreams":"Hawaiian Dreams",lee:"Lee",levis:"Levi’s",lucano:"Lucano",mcd:"MCD",oceano:"Oceano",ogochi:"Ogochi","red-nose":"Red Nose","sem-marca":"Sem marca","surfside-living":"Surfside Living",texas:"Texas",tookas:"Tookas",youngstyle:"Youngstyle"};
    const prefixes = {camiseta:"CAM",polo:"POL",calcao:"CALCAO",calca:"CAL",moletom:"MOL",bone:"BONE",outros:"OUT"};
    const numbers = {camiseta:0,polo:0,calcao:0,calca:0,moletom:0,bone:0,outros:0};
    const additions = [];
    const add = (category, brand, name, path, subcategory = "") => {
        numbers[category] += 1;
        additions.push({category, brand, name, path, subcategory, ref: prefixes[category] + "-" + String(numbers[category]).padStart(3, "0")});
    };
    const series = (category, brand, name, folder, prefix, total, ext = "jpeg") => {
        for (let i = 1; i <= total; i += 1) add(category, brand, name + " " + String(i).padStart(2, "0"), folder + "/" + prefix + String(i).padStart(2, "0") + "." + ext);
    };

    [["elemento-zero",1],["hawaiian-dreams",2],["lee",1],["levis",1],["oceano",4],["ogochi",3],["youngstyle",2]].forEach(([brand,total]) => series("polo",brand,"Polo " + names[brand],"polos/" + brand,brand + "-polo-",total));
    [["bivik",3],["broken-rules",1],["hawaiian-dreams",14],["lee",1],["mcd",7],["oceano",21],["ogochi",34],["texas",8],["tookas",2]].forEach(([brand,total]) => series("calcao",brand,"Calção " + names[brand],"calcoes/" + brand,brand + "-calcao-",total));
    [1,2,3,4,5,6,8,9,10,11,12,15,16,20].forEach(i => add("calcao","youngstyle","Calção Youngstyle " + String(i).padStart(2,"0"),"calcoes/youngstyle/youngstyle-calcao-" + String(i).padStart(2,"0") + ".jpeg"));
    ["Ogochi.jpeg","Ogochi (2).jpeg","Ogochi (3).jpeg","Ogochi (4).jpeg","Ogochi (5).jpeg","Ogochi (6).jpeg","ogochi04.jpeg","ogochi05.jpeg"].forEach((file,i) => add("calcao","ogochi","Calção Ogochi " + String(i + 35).padStart(2,"0"),"caução/OGOCHI/" + file));
    ["youngstyle.jpeg","youngstyle (2).jpeg","youngstyle (3).jpeg","youngstyle (4).jpeg","youngstyle (5).jpeg"].forEach((file,i) => add("calcao","youngstyle","Calção Youngstyle " + String(i + 15).padStart(2,"0"),"caução/Youngstyle/" + file));

    [["Calça chino clara","calças/Calça chino clara em fundo neutro.png"],["Calça jeans azul-clara com rasgo","calças/Jeans Azul-Claros com Rasgo no Joelho.png"],["Calça jeans azul-marinho","calças/Jeans Azul-Marinho em Estúdio.png"],["Calça jeans preta reta","calças/Jeans pretos de corte reto em estúdio.png"],["Calça jeans índigo escura","calças/Jeans índigo escuro em fundo creme.png"]].forEach(([name,path]) => add("calca","sem-marca",name,path));
    add("calca","oceano","Calça Oceano","calcas/oceano/oceano-calca-01.png");
    [["Algodão Egípcio","preta","algodão egipcio.jpeg"],["Linho","off-white","linho.jpeg"],["Modal","verde","modal (2).jpeg"],["Modal","azul-marinho","Modal.jpeg"],["Modal","chumbo","Modal01.jpeg"],["Super Touch","preta","Super touch (2).jpeg"],["Super Touch","branca","Super touch (3).jpeg"],["Super Touch","cinza","Super touch (4).jpeg"],["Super Touch","bege","super touch.jpeg"]].forEach(([line,color,file]) => add("camiseta","sem-marca","Camiseta " + line + " " + color,"camisa_egipcia/" + file));
    [["levis","levis"],["lucano","lucano"],["oceano","oceano"],["red-nose","red-nose"],["surfside-living","surfside-living"]].forEach(([brand,folder]) => series("moletom",brand,"Moletom " + names[brand],"moletons/" + folder,folder + "-moletom-",1,"png"));
    [["cavaleira",11],["levis",3],["oceano",11]].forEach(([brand,total]) => series("bone",brand,"Boné " + names[brand],"bones/" + brand,brand + "-bone-",total));
    series("bone","ogochi","Boné Ogochi","bones/og","og-bone-",3);
    ["chinelo-Ogochi (1).jpeg","chinelo-Ogochi (2).jpeg","chinelo-Ogochi (3).jpeg"].forEach((file,i) => add("outros","ogochi","Chinelo Ogochi " + String(i + 1).padStart(2,"0"),"chinelo/" + file,"chinelo"));
    ["WhatsApp Image 2026-10-23 at 14.00.40.jpeg","WhatsApp Image 2026-10-23 at 14.00.55.jpeg","WhatsApp Image 2026-10-23 at 14.01.16.jpeg"].forEach((file,i) => add("outros","oceano","Kit Cueca Boxer Oceano — Variante " + String(i + 1).padStart(2,"0"),"cuecas/" + file,"cueca"));

    additions.forEach(product => {
        const card = document.createElement("article");
        card.className = "product-card";
        card.dataset.category = product.category; card.dataset.brand = product.brand; card.dataset.ref = product.ref;
        if (product.subcategory) card.dataset.subcategory = product.subcategory;
        const message = encodeURIComponent("Olá! Gostaria de saber mais sobre a peça " + product.ref + " — " + product.name + ".");
        card.innerHTML = '<div class="product-card__image"><span class="product-reference">' + product.ref + '</span><img src="' + base + product.path + '" alt="' + product.name + '" loading="lazy"></div><div class="product-card__details"><p class="product-card__brand">' + names[product.brand] + '</p><h3>' + product.name + '</h3><p class="product-card__price">Consulte o valor</p><a href="https://wa.me/554791106553?text=' + message + '" target="_blank" rel="noopener noreferrer">WhatsApp <span aria-hidden="true">↗</span></a></div>';
        grid.append(card);
    });
    const products = [...catalog.querySelectorAll(".product-card")];
    const activeCategory = categories.has(params.get("category")) ? params.get("category") : "all";
    const activeBrand = brands.has(params.get("brand")) ? params.get("brand") : "all";
    const url = (category, brand) => {
        const query = new URLSearchParams();
        if (category !== "all") query.set("category", category);
        if (brand !== "all") query.set("brand", brand);
        return "masculino.html" + (query.toString() ? "?" + query.toString() : "");
    };
    products.forEach(product => {
        product.hidden = !((activeCategory === "all" || product.dataset.category === activeCategory) && (activeBrand === "all" || product.dataset.brand === activeBrand));
    });
    const visible = products.filter(product => !product.hidden).length;
    if (count) count.textContent = visible === 1 ? "1 peça" : visible + " peças";
    if (empty) empty.hidden = visible !== 0;
    catalog.querySelectorAll("[data-category-link]").forEach(link => {
        const value = link.dataset.categoryLink; link.href = url(value, activeBrand); link.toggleAttribute("aria-current", value === activeCategory);
    });
    catalog.querySelectorAll("[data-brand-link]").forEach(link => {
        const value = link.dataset.brandLink; link.href = url(activeCategory, value); link.toggleAttribute("aria-current", value === activeBrand);
    });
}());
