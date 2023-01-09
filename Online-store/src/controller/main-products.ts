import { MainPageView } from '../templates/main-products';
import { checkSelector } from '../utils/checkSelector';
import { localStorageProducts } from '../utils/localStorageProducs';

export class MainPageController {
  view: MainPageView;
  url: Partial<URL>;

  constructor(view: MainPageView) {
    this.view = view;
    this.url = {};
  }

  setupPage() {
    this.copyLink();
    this.addToCart();
    this.searchText();
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

  addToCart() {
    const productItems: NodeListOf<HTMLElement> = document.querySelectorAll('.products__item');
    let productsArr: localStorageProducts[] = [];
    let cartSumNum = 0;
    productItems.forEach((item) => {
      const itemBtn = checkSelector(item, '.products__info_btn-cart');
      const cartCount = checkSelector(document, '.cart__count');
      const sumValue = checkSelector(document, '.sum__value');
      function toggleProductToCard() {
        const id = item.dataset.id;
        const count = 1;
        const price = item.dataset.price;
        const products = localStorage.getItem('products');
        if (products) {
          productsArr = JSON.parse(products) as localStorageProducts[];
        }

        if (productsArr.find((item) => item.id === id)) {
          const index = productsArr.findIndex((el) => el.id === id);
          productsArr.splice(index, 1);
          cartCount.innerHTML = productsArr.length.toString();
          itemBtn.innerHTML = 'Add to cart';
          itemBtn.classList.remove('active');
          cartSumNum = productsArr.reduce((sum, elem) => sum + +elem.price, 0);
        } else {
          let cartCountNum = productsArr.length;
          if (id && price) productsArr.push({ id, count, price });
          cartCountNum++;
          cartCount.innerHTML = cartCountNum.toString();
          itemBtn.innerHTML = 'Drop to cart';
          itemBtn.classList.add('active');
          cartSumNum = productsArr.reduce((sum, elem) => sum + +elem.price, 0);
        }
        localStorage.setItem('products', JSON.stringify(productsArr));
        localStorage.setItem('cartSum', cartSumNum.toString());
        sumValue.innerHTML = `€${cartSumNum}`;
      }
      itemBtn.addEventListener('click', toggleProductToCard);
    });
  }

  searchText() {
    const productsItems: NodeListOf<HTMLElement> = document.querySelectorAll('.products__item');
    const searchInput = checkSelector(document, '.search__field') as HTMLInputElement;
    const filter = searchInput.value.toLowerCase();
    productsItems.forEach((product: HTMLElement) => {
      const productDiscount = checkSelector(product, '.products__card_discount');
      const productRating = checkSelector(product, '.products__info-rating');
      const productPriceOld = checkSelector(product, '.products__info-price_old');
      const productPriceNew = checkSelector(product, '.products__info-price_new');
      const productTitle = checkSelector(product, '.products__info-name_title');
      const productCategory = checkSelector(product, '.products__info-name_category');
      const productRatingSpan = checkSelector(product, '.products__info-rating span');
      const productRatingCount = checkSelector(product, '.products__info-rating_count');
      const productBrandSpan = checkSelector(product, '.products__info-brand span');
      const productBrandName = checkSelector(product, '.products__info-brand_name');
      const productStockSpan = checkSelector(product, '.products__info-stock span');
      const productStockCount = checkSelector(product, '.products__info-stock_count');

      const productCheck = (el: Element) => {
        if (el.textContent) {
          return el.textContent.toLowerCase().indexOf(filter);
        }
      };

      if (
        productCheck(productDiscount) !== -1 ||
        productCheck(productRating) !== -1 ||
        productCheck(productPriceOld) !== -1 ||
        productCheck(productPriceNew) !== -1 ||
        productCheck(productTitle) !== -1 ||
        productCheck(productCategory) !== -1 ||
        productCheck(productRatingSpan) !== -1 ||
        productCheck(productRatingCount) !== -1 ||
        productCheck(productBrandSpan) !== -1 ||
        productCheck(productBrandName) !== -1 ||
        productCheck(productStockSpan) !== -1 ||
        productCheck(productStockCount) !== -1
      ) {
        product.style.display = 'block';
      } else {
        product.style.display = 'none';
      }
    });
    searchInput.addEventListener('input', () => this.searchText());
    this.foundCount();
  }

  foundCount() {
    const productsItems: NodeListOf<HTMLElement> = document.querySelectorAll('.products__item');
    const infoFoundCount = checkSelector(document, '.info__found-count');
    let foundCounter = 0;
    productsItems.forEach((product: HTMLElement) => {
      if (product.style.display === 'block') {
        foundCounter++;
      }
    });
    setTimeout(() => {
      infoFoundCount.innerHTML = `${foundCounter.toString()}`;
    }, 100);
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
