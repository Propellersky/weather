let sliderLine = document.querySelector(".slider-line")

let offset = 0;

document.querySelector(".swiper-button-prev").addEventListener("click", function () {
  offset = offset -= 300;
  if (offset === 0) {
    document.querySelector(".swiper-button-prev").classList.add("none")
  } else if (offset > 0) {
    document.querySelector(".swiper-button-next").classList.remove("none")
  }
  sliderLine.style.right = offset + "px";
})

document.querySelector(".swiper-button-next").addEventListener("click", function () {

  offset = offset += 300;

  if (offset === 300) {
    document.querySelector(".swiper-button-prev").classList.remove("none")
  } else if (offset === 1200) {
    document.querySelector(".swiper-button-next").classList.add("none")
  }
  sliderLine.style.right = offset + "px";
})
