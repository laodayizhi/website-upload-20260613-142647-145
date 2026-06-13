(function () {
    function qs(selector, root) {
        return (root || document).querySelector(selector);
    }

    function qsa(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    function setupMenu() {
        var toggle = qs("[data-menu-toggle]");
        var panel = qs("[data-mobile-panel]");
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener("click", function () {
            panel.classList.toggle("is-open");
        });
    }

    function setupHero() {
        var slides = qsa("[data-hero-slide]");
        var dots = qsa("[data-hero-dot]");
        if (!slides.length) {
            return;
        }
        var active = 0;
        var timer;
        function show(index) {
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === active);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === active);
            });
        }
        function start() {
            stop();
            timer = window.setInterval(function () {
                show(active + 1);
            }, 5200);
        }
        function stop() {
            if (timer) {
                window.clearInterval(timer);
            }
        }
        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () {
                show(i);
                start();
            });
        });
        show(0);
        start();
    }

    function setupFilters() {
        qsa("[data-filter-scope]").forEach(function (scope) {
            var input = qs("[data-filter-text]", scope);
            var type = qs("[data-filter-type]", scope);
            var year = qs("[data-filter-year]", scope);
            var region = qs("[data-filter-region]", scope);
            var empty = qs("[data-empty]", scope);
            var cards = qsa("[data-card]", scope);
            function apply() {
                var keyword = normalize(input && input.value);
                var typeValue = normalize(type && type.value);
                var yearValue = normalize(year && year.value);
                var regionValue = normalize(region && region.value);
                var shown = 0;
                cards.forEach(function (card) {
                    var text = normalize([
                        card.getAttribute("data-title"),
                        card.getAttribute("data-region"),
                        card.getAttribute("data-type"),
                        card.getAttribute("data-year"),
                        card.getAttribute("data-tags")
                    ].join(" "));
                    var cardType = normalize(card.getAttribute("data-type"));
                    var cardYear = normalize(card.getAttribute("data-year"));
                    var cardRegion = normalize(card.getAttribute("data-region"));
                    var matched = true;
                    if (keyword && text.indexOf(keyword) === -1) {
                        matched = false;
                    }
                    if (typeValue && cardType !== typeValue) {
                        matched = false;
                    }
                    if (yearValue && cardYear.indexOf(yearValue) === -1) {
                        matched = false;
                    }
                    if (regionValue && cardRegion.indexOf(regionValue) === -1) {
                        matched = false;
                    }
                    card.classList.toggle("is-hidden", !matched);
                    if (matched) {
                        shown += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle("is-visible", shown === 0);
                }
            }
            [input, type, year, region].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", apply);
                    control.addEventListener("change", apply);
                }
            });
            apply();
        });
    }

    function setupPlayer() {
        var box = qs("[data-player]");
        if (!box) {
            return;
        }
        var video = qs("video", box);
        var button = qs("[data-play]", box);
        var streamUrl = box.getAttribute("data-stream");
        var hlsInstance = null;
        var loaded = false;
        function load() {
            if (!video || loaded || !streamUrl) {
                return;
            }
            loaded = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = streamUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hlsInstance.loadSource(streamUrl);
                hlsInstance.attachMedia(video);
            } else {
                video.src = streamUrl;
            }
        }
        function play() {
            load();
            box.classList.add("is-playing");
            video.setAttribute("controls", "controls");
            var promise = video.play();
            if (promise && promise.catch) {
                promise.catch(function () {
                    box.classList.remove("is-playing");
                });
            }
        }
        if (button) {
            button.addEventListener("click", play);
        }
        if (video) {
            video.addEventListener("click", function () {
                if (!loaded || video.paused) {
                    play();
                } else {
                    video.pause();
                }
            });
            video.addEventListener("play", function () {
                box.classList.add("is-playing");
            });
            video.addEventListener("pause", function () {
                if (video.currentTime === 0 || video.ended) {
                    box.classList.remove("is-playing");
                }
            });
        }
        window.addEventListener("pagehide", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        setupMenu();
        setupHero();
        setupFilters();
        setupPlayer();
    });
})();
