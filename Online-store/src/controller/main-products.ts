import { MainPageView } from '../templates/main-products';
import { checkSelector } from '../utils/checkSelector';

export class MainPageController {
  view: MainPageView;
  constructor(view: MainPageView) {
    this.view = view;
  }

  setupPage() {
    this.copyLink();
  }

  copyLink() {
    checkSelector(document, '.filters-btns__copy').addEventListener('click', (e) => {
      (async () => {
        await navigator.clipboard.writeText(window.location.href);
        const target = e.target as HTMLButtonElement;
        target.textContent = 'Copied!';
        target.classList.add('copied');
        setTimeout(() => {
          target.textContent = 'Copy link';
          target.classList.remove('copied');
        }, 1000);
      })().catch(() => 'err');
    });
  }
}

// const priceInputLeft = document.getElementById(
//   'priceInputLeft'
// ) as HTMLInputElement;
// const priceInputRight = document.getElementById(
//   'priceInputRight'
// ) as HTMLInputElement;
// const thumbLeft = document.querySelector(
//   '.price-slider__thumb_left'
// ) as HTMLElement;
// const thumbRight = document.querySelector('.price-slider__thumb_right');
// const priceRange = document.querySelector('price-slider__range') as HTMLElement;
// let total = 100,
//   skip = 0,
//   limit = 100;

// export class CatalogPage {

// }
// setLeftValue(): void {
//   const min = parseInt(priceInputLeft.min);
//   const max = parseInt(priceInputLeft.max);
//   priceInputLeft.value = Math.min(
//     parseInt(priceInputLeft.value),
//     parseInt(priceInputLeft.value) - 1
//   ).toString();
//   const percent = ((+priceInputLeft.value - min) / (max - min)) * 100;
//   thumbLeft.style.left = `${percent}%`;
//   priceRange.style.left = `${percent}%`;
//   priceInputLeft.addEventListener('input', setLeftValue);
// }

//priceInputRight.addEventListener('input', setRightValue);
