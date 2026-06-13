(function () {
    const menuToggle = document.querySelector("[data-menu-toggle]");
    const mobileNav = document.querySelector("[data-mobile-nav]");

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener("click", function () {
            mobileNav.classList.toggle("open");
        });
    }

    const hero = document.querySelector("[data-hero]");

    if (hero) {
        const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
        const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
        let activeIndex = 0;

        function showSlide(index) {
            activeIndex = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === activeIndex);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === activeIndex);
            });
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                showSlide(dotIndex);
            });
        });

        if (slides.length > 1) {
            setInterval(function () {
                showSlide(activeIndex + 1);
            }, 5200);
        }
    }

    const filterList = document.querySelector("[data-filter-list]");

    if (filterList) {
        const input = document.querySelector("[data-filter-input]");
        const yearSelect = document.querySelector("[data-year-filter]");
        const cards = Array.from(filterList.querySelectorAll("[data-filter-card]"));

        function applyFilter() {
            const keyword = input ? input.value.trim().toLowerCase() : "";
            const year = yearSelect ? yearSelect.value : "";

            cards.forEach(function (card) {
                const text = [
                    card.getAttribute("data-title"),
                    card.getAttribute("data-genre"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-year")
                ].join(" ").toLowerCase();
                const matchedKeyword = !keyword || text.includes(keyword);
                const matchedYear = !year || card.getAttribute("data-year") === year;
                card.style.display = matchedKeyword && matchedYear ? "" : "none";
            });
        }

        if (input) {
            input.addEventListener("input", applyFilter);
        }

        if (yearSelect) {
            yearSelect.addEventListener("change", applyFilter);
        }
    }
})();
