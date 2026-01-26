// Simple cross-page fade (works everywhere)
(() => {
    const D_OUT = 300;  // ms
    const body = document.body;
  
    // fade IN on load
    requestAnimationFrame(() => body.classList.add('page-fade-in'));
  
    // fade OUT on links marked data-fade
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[data-fade]');
      if (!a) return;
      // let modifier-clicks open a new tab normally
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === '_blank') return;
  
      e.preventDefault();
      const href = a.getAttribute('href');
      body.classList.add('page-fade-out');
      // navigate after the fade completes
      setTimeout(() => { window.location.href = href; }, D_OUT);
    });
  })();
  
// Initializes the Explore carousel with Center Mode and custom arrows.

$(function () {
    if (!$.fn.slick) {
      console.error("Slick failed to load. Check slick.min.js <script> tag.");
      return;
    }
  
    function syncNarrativeToSlide(index) {
      var $narratives = $(".explore-narrative");
      var n = $narratives.length;
      if (!n) return;
      var i = ((index % n) + n) % n;
      $narratives.removeClass("is-active").eq(i).addClass("is-active");
    }

    var $carousel = $(".explore-carousel");

    // Bind before .slick() so 'init' runs on first load. These persist across responsive re-inits.
    $carousel.on("init", function (event, slick) {
      syncNarrativeToSlide(slick.currentSlide);
    });
    $carousel.on("afterChange", function (event, slick, currentSlide) {
      syncNarrativeToSlide(currentSlide);
    });

    $carousel.slick({
      // Center Mode (React Slick parity)
      className: "center",
      centerMode: true,
      infinite: true,
      centerPadding: "6px",
      slidesToShow: 3,
      speed: 500,

      // UI
      dots: true,
      arrows: true,
      swipeToSlide: true,
      pauseOnFocus: true,
      lazyLoad: "ondemand",

      // Custom, larger arrow buttons using inline SVG (accessible)
      prevArrow:
        '<button type="button" class="slick-prev custom-arrow" aria-label="Previous slide">' +
          '<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
            '<path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
          "</svg>" +
        "</button>",
  
      nextArrow:
        '<button type="button" class="slick-next custom-arrow" aria-label="Next slide">' +
          '<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
            '<path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
          "</svg>" +
        "</button>",
  
      // Responsive breakpoints
      responsive: [
        { breakpoint: 1024, settings: { slidesToShow: 3, centerPadding: "40px" } },
        { breakpoint: 768,  settings: { slidesToShow: 1, centerPadding: "80px" } },
        { breakpoint: 480,  settings: { slidesToShow: 1, centerPadding: "40px" } }
      ]
    });
  });
  