(function () {
    const input = document.getElementById("search-input");
    const results = document.getElementById("search-results");
    const catalog = Array.isArray(window.SEARCH_MOVIES) ? window.SEARCH_MOVIES : [];

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function card(movie) {
        return [
            '<article class="movie-card">',
            '<a class="movie-poster" href="' + escapeHtml(movie.url) + '" aria-label="' + escapeHtml(movie.title) + '">',
            '<img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
            '<span class="poster-play">▶</span>',
            '</a>',
            '<div class="movie-info">',
            '<div class="movie-meta-line"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.type) + '</span></div>',
            '<h3><a href="' + escapeHtml(movie.url) + '">' + escapeHtml(movie.title) + '</a></h3>',
            '<p>' + escapeHtml(movie.oneLine) + '</p>',
            '<div class="tag-row"><span>' + escapeHtml(movie.genre) + '</span><span>' + escapeHtml(movie.category) + '</span></div>',
            '</div>',
            '</article>'
        ].join("");
    }

    function render(query) {
        const keyword = String(query || "").trim().toLowerCase();
        const list = catalog
            .filter(function (movie) {
                if (!keyword) {
                    return true;
                }
                return movie.searchText.includes(keyword);
            })
            .slice(0, 120);
        results.innerHTML = list.map(card).join("");
    }

    const params = new URLSearchParams(window.location.search);
    const initial = params.get("q") || "";

    if (input) {
        input.value = initial;
        input.addEventListener("input", function () {
            render(input.value);
        });
    }

    document.querySelectorAll("[data-search-term]").forEach(function (button) {
        button.addEventListener("click", function () {
            const term = button.getAttribute("data-search-term") || "";
            if (input) {
                input.value = term;
            }
            render(term);
        });
    });

    render(initial);
})();
