(function () {
  function queryAll(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  var toggle = document.querySelector('[data-mobile-toggle]');
  var panel = document.querySelector('[data-mobile-panel]');

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  queryAll('[data-hero-carousel]').forEach(function (carousel) {
    var slides = queryAll('[data-hero-slide]', carousel);
    var dots = queryAll('[data-hero-dot]', carousel);
    var active = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, current) {
        slide.classList.toggle('is-active', current === active);
      });
      dots.forEach(function (dot, current) {
        dot.classList.toggle('is-active', current === active);
      });
    }

    function play() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(active + 1);
      }, 5600);
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        play();
      });
    });

    carousel.addEventListener('mouseenter', function () {
      window.clearInterval(timer);
    });

    carousel.addEventListener('mouseleave', play);

    show(0);
    play();
  });

  function getParam(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name) || '';
  }

  queryAll('[data-filter-panel]').forEach(function (panelElement) {
    var input = panelElement.querySelector('[data-filter-input]');
    var type = panelElement.querySelector('[data-filter-type]');
    var year = panelElement.querySelector('[data-filter-year]');
    var region = panelElement.querySelector('[data-filter-region]');
    var section = panelElement.closest('section') || document;
    var cards = queryAll('[data-movie-card]', section);
    var empty = section.querySelector('[data-empty-state]');
    var initial = getParam('q');

    if (input && initial) {
      input.value = initial;
    }

    function matches(card) {
      var words = (input && input.value ? input.value : '').trim().toLowerCase();
      var typeValue = type && type.value ? type.value : '';
      var yearValue = year && year.value ? year.value : '';
      var regionValue = region && region.value ? region.value : '';
      var terms = (card.getAttribute('data-terms') || '').toLowerCase();
      var cardType = card.getAttribute('data-type') || '';
      var cardYear = card.getAttribute('data-year') || '';
      var cardRegion = card.getAttribute('data-region') || '';

      if (words && terms.indexOf(words) === -1) {
        return false;
      }
      if (typeValue && cardType !== typeValue) {
        return false;
      }
      if (yearValue && cardYear !== yearValue) {
        return false;
      }
      if (regionValue && cardRegion !== regionValue) {
        return false;
      }
      return true;
    }

    function update() {
      var visible = 0;
      cards.forEach(function (card) {
        var ok = matches(card);
        card.hidden = !ok;
        if (ok) {
          visible += 1;
        }
      });
      if (empty) {
        empty.hidden = visible > 0;
      }
    }

    [input, type, year, region].forEach(function (control) {
      if (control) {
        control.addEventListener('input', update);
        control.addEventListener('change', update);
      }
    });

    update();
  });
}());
