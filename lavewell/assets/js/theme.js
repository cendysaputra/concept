/*----------theme js-----------------*/

/*====================================
01. Header Search js
02. Mobile Menu js
03. header sticky js
04. Loder js
05. odometer js
06. venobox js
07. magnificPopup Js
08. hero slider all js
09. home-1 testi active js
10. home-2 testimonial active js
11. home-1 wedding active js
12. home-1 band-active js
13. Team icon active js
14. accordion js
15. barfiller script js
16. Custom Tab js
=====================================*/

(function ($) {
  "use strict";

  //Header Search js
  if ($(".search-box-outer").length) {
    $(".search-box-outer").on("click", function () {
      $("body").addClass("search-active");
    });
    $(".close-search").on("click", function () {
      $("body").removeClass("search-active");
    });
  }

  // Mobile Menu js
  $(".mobile-menu nav").meanmenu({
    meanScreenWidth: "991",
    meanMenuContainer: ".mobile-menu",
    meanMenuOpen: "<span></span> <span></span> <span></span>",
    onePage: false,
  });

  // header sticky js
  var wind = $(window);
  var sticky = $("#sticky-header");
  wind.on("scroll", function () {
    var scroll = wind.scrollTop();
    if (scroll < 100) {
      sticky.removeClass("sticky");
    } else {
      sticky.addClass("sticky");
    }
  });

  // Loder js //
  $(window).on("load", function () {
    $("#loading").fadeOut(2500);
  });

  ///////////////////////////////
  //odometer js

  $(document).ready(function () {
    $(".odometer-wrapper").appear(function () {
      let count = $(this).attr("data-count");
      let odometer = $(this).closest(".odometer-wrapper").find(".odometer");

      setTimeout(function () {
        odometer.html(count);
      }, 500);
    });
  });

  // venobox js
  $(".venobox").venobox({
    numeratio: true,

    infinigall: true,
  });

  //magnificPopup Js
  $(".popup-image").magnificPopup({
    type: "image",
    gallery: {
      enabled: true,
    },
  });

  // hero slider all js
  const sliderswiper = new Swiper(".lavewell-slider-active", {
    // Optional parameters
    speed: 2500,
    loop: true,
    slidesPerView: 1,
    autoplay: true,
    effect: "fade",
    breakpoints: {
      1600: {
        slidesPerView: 1,
      },
      1400: {
        slidesPerView: 1,
      },
      1200: {
        slidesPerView: 1,
      },
      992: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 1,
      },
      576: {
        slidesPerView: 1,
      },
      0: {
        slidesPerView: 1,
      },

      a11y: false,
    },

    // Navigation arrows
    navigation: {
      nextEl: ".slider-next",
      prevEl: ".slider-prev",
    },

    pagination: {
      el: ".lavewell-slider-dots",
      clickable: true,
    },
  });

  // home-1 testi active js
  var slider = new Swiper(".testi-active", {
    speed:2500,
    slidesPerView: 4,
    spaceBetween: 30,
    loop: true,
    breakpoints: {
      1400: {
        slidesPerView: 1,
      },
      1200: {
        slidesPerView: 1,
      },
      992: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 1,
      },
      576: {
        slidesPerView: 1,
      },
      0: {
        slidesPerView: 1,
      },
    },

    // Navigation arrows
    navigation: {
      nextEl: ".testi-next",
      prevEl: ".testi-prev",
    },
  });

  // home-2 testimonial active js
  var slider = new Swiper(".testimonial-active", {
    speed: 2500,
    slidesPerView: 4,
    spaceBetween: 30,
    loop: true,
    breakpoints: {
      1400: {
        slidesPerView: 1,
      },
      1200: {
        slidesPerView: 1,
      },
      992: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 1,
      },
      576: {
        slidesPerView: 1,
      },
      0: {
        slidesPerView: 1,
      },
    },

    // Navigation arrows
    navigation: {
      nextEl: ".testimonial-next",
      prevEl: ".testimonial-prev",
    },
  });

  // home-1 wedding active js
  var slider = new Swiper(".wedding-active", {
    speed: 2500,
    slidesPerView: 4,
    spaceBetween: 30,
    loop: true,
    breakpoints: {
      1400: {
        slidesPerView: 1,
      },
      1200: {
        slidesPerView: 1,
      },
      992: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 1,
      },
      576: {
        slidesPerView: 1,
      },
      0: {
        slidesPerView: 1,
      },
    },

    // Navigation arrows
    navigation: {
      nextEl: ".wedding-next",
      prevEl: ".wedding-prev",
    },
  });

  // home-1 band-active js
  var slider = new Swiper(".band-active", {
    speed:2500,
    slidesPerView: 4,
    spaceBetween: 30,
    loop: true,
    autoplay: true,
    breakpoints: {
      1920: {
        slidesPerView: 5,
      },
      1400: {
        slidesPerView: 5,
      },
      1200: {
        slidesPerView: 4,
      },
      992: {
        slidesPerView: 4,
      },
      768: {
        slidesPerView: 3,
      },
      576: {
        slidesPerView: 2,
      },
      0: {
        slidesPerView: 1,
      },
    },

    // Navigation arrows
    navigation: {
      nextEl: ".slider-next",
      prevEl: ".slider-prev",
    },
  });

  // Team icon active js
  $(".team-icon").on("click", function () {
    $(this).toggleClass("active");
    $(".team-icon").not(this).removeClass("active");
  });

  // 22. Video Modal
  var v_cursor = document.getElementById("video_cursor");
  var video_icon = document.querySelector(".video__area a");

  if (video_icon) {
    video_icon.addEventListener("mousemove", (e) => {
      let x = e.clientX;
      let y = e.clientY;
      v_cursor.style.top = y + "px";
      v_cursor.style.left = x + "px";
      v_cursor.style.transform = "translate(-50%, -50%) scale(1)";
    });

    video_icon.addEventListener("mouseout", (e) => {
      v_cursor.style.transform = "translate(-50%, -50%) scale(0)";
    });
  }

  jQuery(document).ready(function ($) {
    "use strict";

    // =======< accordion js >========
    jQuery(document).ready(function ($) {
      "use strict";

      $(".accordion > li:eq(0) a").addClass("active").next().slideDown();
      $(".accordion a").on("click", function (j) {
        let dropDown = $(this).closest("li").find("p");

        $(this).closest(".accordion").find("p").not(dropDown).slideUp();

        if ($(this).hasClass("active")) {
          $(this).removeClass("active");
        } else {
          $(this).closest(".accordion").find("a.active").removeClass("active");
          $(this).addClass("active");
        }

        dropDown.stop(false, true).slideToggle();

        j.preventDefault();
      });
    });

    jQuery(document).ready(function ($) {
      "use strict";

      $(".accordion2 > li:eq(0) a").addClass("active").next().slideDown();
      $(".accordion2 a").on("click", function (j) {
        let dropDown = $(this).closest("li").find("p");

        $(this).closest(".accordion2").find("p").not(dropDown).slideUp();

        if ($(this).hasClass("active")) {
          $(this).removeClass("active");
        } else {
          $(this).closest(".accordion2").find("a.active").removeClass("active");
          $(this).addClass("active");
        }

        dropDown.stop(false, true).slideToggle();

        j.preventDefault();
      });
    });

    //=====< barfiller script js>====
    $("#bar1").barfiller({
      duration: 7000,
    });
    $("#bar2").barfiller({
      duration: 7000,
    });
    $("#bar3").barfiller({
      duration: 7000,
    });
    $("#bar4").barfiller({
      duration: 7000,
    });
    $("#bar5").barfiller({
      duration: 7000,
    });

    //======< Custom Tab js>======
    $(".tab ul.tabs").addClass("active").find("> li:eq(0)").addClass("current");

    $(".tab ul.tabs li a").on("click", function (g) {
      var tab = $(this).closest(".tab"),
        index = $(this).closest("li").index();

      tab.find("ul.tabs > li").removeClass("current");
      $(this).closest("li").addClass("current");

      tab
        .find(".tab_content")
        .find("div.tabs_item")
        .not("div.tabs_item:eq(" + index + ")")
        .slideUp();
      tab
        .find(".tab_content")
        .find("div.tabs_item:eq(" + index + ")")
        .slideDown();

      g.preventDefault();
    });
  });
})(jQuery);
