const nextArrow = document.querySelector('.slider__arrow--next');
const previousArrow = document.querySelector('.slider__arrow--prev');
let slideNumber = 1;

 
const showSlide = (n) => {
  const slidesLists = document.querySelectorAll('.slider');

  slidesLists.forEach((slidesList) => {
    const slides = slidesList.children;

    let i;
    if (n > slides.length) {
      slideNumber = 1;
    }
    if (n < 1) {
      slideNumber = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
      slides[i].classList.remove('slide--current');
    }

    slides[slideNumber-1].classList.add('slide--current');
  });
};


const onNextArrowClick = () => {
  showSlide(slideNumber += 1);
};


const onPreviousArrowClick = () => {
  showSlide(slideNumber -= 1);
};


function currentSlide (n) {
  showSlide(slideNumber = n);
}


const addArrowsHandlers = () => {
  nextArrow.addEventListener('click', onNextArrowClick);
  previousArrow.addEventListener('click', onPreviousArrowClick);
};


export {addArrowsHandlers, currentSlide};

