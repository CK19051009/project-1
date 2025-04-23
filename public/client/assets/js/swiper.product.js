const swiperProducrDetail = new Swiper(".mySwiper", {
  spaceBetween: 10,
  slidesPerView: 4,
  freeMode: true,
});
const swiperProducrDetail2 = new Swiper(".mySwiper2", {
  spaceBetween: 10,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  thumbs: {
    swiper: swiperProducrDetail,
  },
});

const swiper = new Swiper(".mySwiperAds", {
  slidesPerView: 1,
  spaceBetween: 4,
  breakpoints: {
    // Khi màn hình >= 992px
    1010: {
      slidesPerView: 2,
      spaceBetween: 4,
    },
  },
  // Tự động chuyển slide
  autoplay: {
    delay: 3000, // Thời gian delay giữa các slide (ms) - 3 giây
    disableOnInteraction: false, // Tiếp tục autoplay sau khi user tương tác
  },

  keyboard: {
    enabled: true,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  // Hiệu ứng chuyển động (tuỳ chọn)
  effect: "coverflow", // hoặc 'fade', 'cube', 'coverflow', 'flip',slide
  speed: 600, // Tốc độ chuyển động (ms)

  // Lặp lại vô hạn (tuỳ chọn)
  loop: true,
});
