$(document).ready(function () {
  // Initialize AOS (Animate On Scroll)
  AOS.init({
    duration: 800,
    once: true
  });

  // Bootstrap Carousel Effect Ken Burns
  function doAnimations(elems) {
    const animEndEv = 'animationend';

    elems.forEach((elem) => {
      elem.classList.add('animate__animated', 'animate__flipInX');
      elem.addEventListener(animEndEv, () => {
        elem.classList.remove('animate__animated', 'animate__flipInX');
      });
    });
  }

  // Variables on page load
  const carouselKenBurns = document.querySelector('#carouselKenBurns');

  if (carouselKenBurns) {
    const firstAnimatingElems = Array.from(
      carouselKenBurns.querySelector('.carousel-item:first-child')
        .querySelectorAll("[data-animation^='animated']")
    );

    doAnimations(firstAnimatingElems);

    carouselKenBurns.addEventListener('slid.bs.carousel', (e) => {
      const animatingElems = Array.from(e.relatedTarget.querySelectorAll("[data-animation^='animated']"));
      doAnimations(animatingElems);
    });
  }

  // Client Logo
  $('.client-logos').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '120px',
    autoplay: true,
    autoplaySpeed: 1500,
    arrows: false,
    dots: false,
    pauseOnHover: false,
    responsive: [{
      breakpoint: 768,
      settings: {
        slidesToShow: 2
      }
    }, {
      breakpoint: 520,
      settings: {
        slidesToShow: 1
      }
    }]
  });

  // Testimonial

  $('.testimonial-slide').slick({
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
    dots: true,
    arrows: false,
    autoplaySpeed: 2000,
    responsive: [{
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      }
    }, {
      breakpoint: 520,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      }
    }]
  });

  // Fancy Box
  Fancybox.bind("[data-fancybox]", {
    Carousel: {
      Video: {
        autoplay: false,
      },
    },
  });
});