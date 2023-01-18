import { MainPageView } from '../templates/main-products';
import { checkSelector } from '../utils/checkSelector';
import { localStorageProducts } from '../utils/localStorageProducs';
import { urlInterface } from '../utils/urlInterface';

export class MainPageController {
  view: MainPageView;
  url: Partial<urlInterface>;

  constructor(view: MainPageView) {
    this.view = view;
    this.url = {};
  }

  currentURL(location: string) {
    const queryURL = location.replace('/?', '').split('&');
    queryURL.forEach((query) => {
      if (query.includes('search=')) {
        this.url.search = query;
      }
      if (query.includes('big=')) {
        this.url.big = query;
      }
      if (query.includes('sort=')) {
        this.url.sort = query;
      }
      if (query.includes('category=')) {
        this.url.category = query;
      }
      if (query.includes('brand=')) {
        this.url.brand = query;
      }
      if (query.includes('price=')) {
        this.url.price = query;
      }
      if (query.includes('stock=')) {
        this.url.stock = query;
      }
    });

    if (this.url.search) {
      const searchInput = checkSelector(document, '.search__field') as HTMLInputElement;
      searchInput.value = `${this.url.search.replace('search=', '')}`;
      searchInput.value;
    }
    if (Object.keys(this.url).length !== 0) return;
  }

  startPage() {
    this.copyLink();
    this.addToCart();
    this.searchText();
    this.toggleView();
    this.sort();
    this.filterByCategoryAndBrand();
    this.filterRange();
  }

  copyLink() {
    const btnCopyLink = checkSelector(document, '.filters-btns__copy');
    btnCopyLink.addEventListener('click', (e) => {
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
    const productItems: NodeListOf<HTMLDivElement> = document.querySelectorAll('.products__item');
    let productsArr: localStorageProducts[] = [];
    let cartSumNum = 0;

    function toggleProductToCard(item: HTMLDivElement): void {
      const itemBtn = checkSelector(item, '.products__info_btn-cart');
      const cartCount = checkSelector(document, '.cart__count');
      const sumValue = checkSelector(document, '.sum__value');
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

    productItems.forEach((item: HTMLDivElement) => {
      checkSelector(item, '.products__info_btn-cart').addEventListener(
        'click',
        toggleProductToCard.bind(this, item)
      );
    });
  }

  searchText() {
    const productsItems: NodeListOf<HTMLDivElement> = document.querySelectorAll('.products__item');
    const searchInput = checkSelector(document, '.search__field') as HTMLInputElement;
    const filter = searchInput.value.toLowerCase();

    const productCheck = (el: Element) => {
      if (el.textContent) {
        return el.textContent.toLowerCase().indexOf(filter);
      }
    };

    productsItems.forEach((product: HTMLDivElement) => {
      const productDiscount = checkSelector(product, '.products__card_discount');
      const productRating = checkSelector(product, '.products__info-rating');
      const productPriceOld = checkSelector(product, '.products__info-price_old');
      const productPriceNew = checkSelector(product, '.products__info-price_new');
      const productTitle = checkSelector(product, '.products__info-name_title');
      const productCategory = checkSelector(product, '.products__info-name_category');
      const productRatingCount = checkSelector(product, '.products__info-rating_count');
      const productBrandName = checkSelector(product, '.products__info-brand_name');
      const productStockCount = checkSelector(product, '.products__info-stock_count');

      const isProductSearch =
        productCheck(productDiscount) !== -1 ||
        productCheck(productRating) !== -1 ||
        productCheck(productPriceOld) !== -1 ||
        productCheck(productPriceNew) !== -1 ||
        productCheck(productTitle) !== -1 ||
        productCheck(productCategory) !== -1 ||
        productCheck(productRatingCount) !== -1 ||
        productCheck(productBrandName) !== -1 ||
        productCheck(productStockCount) !== -1;

      if (product.style.display !== 'none' || !product.classList.contains('hide')) {
        if (isProductSearch) {
          product.style.display = 'block';
        } else {
          product.style.display = 'none';
        }
      }
    });

    if (filter.length !== 0) {
      this.url.search = `search=${filter}`;
      window.history.replaceState({}, '', `?${Object.values(this.url).join('&')}`);
    } else {
      delete this.url.search;
      window.history.replaceState({}, '', `?${Object.values(this.url).join('&')}`);
    }
    if (Object.keys(this.url).length === 0) {
      window.history.replaceState({}, '', `/`);
    }

    searchInput.addEventListener('input', () => this.searchText());
    this.foundCount();
  }

  foundCount() {
    const productsItems: NodeListOf<HTMLElement> = document.querySelectorAll('.products__item');
    const infoFoundCount = checkSelector(document, '.info__found-count');
    const noFoundProducts = checkSelector(document, '.products__no-found') as HTMLElement;
    const foundProductsArr = Array.from(productsItems).filter(
      (product) => product.style.display === 'block'
    );

    setTimeout(() => {
      infoFoundCount.innerHTML = `${foundProductsArr.length}`;
      if (foundProductsArr.length === 0) {
        noFoundProducts.style.display = 'block';
      } else {
        noFoundProducts.style.display = 'none';
      }
    }, 200);
  }

  toggleView() {
    const btnViewSmall = checkSelector(document, '.view__small');
    const btnViewBig = checkSelector(document, '.view__big') as HTMLButtonElement;
    const productsContainer = checkSelector(document, '#productsContainer') as HTMLDivElement;
    const productsItems: NodeListOf<HTMLElement> = document.querySelectorAll('.products__item');
    btnViewSmall.addEventListener('click', () => {
      btnViewSmall.classList.add('active');
      btnViewBig.classList.remove('active');
      productsContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
      productsItems.forEach((product: HTMLElement) => {
        product.classList.remove('big');
      });
      delete this.url.big;
      window.history.replaceState({}, '', `?${Object.values(this.url).join('&')}`);
      if (Object.keys(this.url).length === 0) {
        window.history.replaceState({}, '', `/`);
      }
    });

    btnViewBig.addEventListener('click', () => {
      btnViewBig.classList.add('active');
      btnViewSmall.classList.remove('active');
      productsContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
      productsItems.forEach((product: HTMLElement) => {
        product.classList.add('big');
      });
      this.url.big = 'big=true';
      window.history.replaceState({}, '', `?${Object.values(this.url).join('&')}`);
    });

    if (this.url.big === 'big=true') {
      btnViewBig.click();
    }
  }

  sort() {
    const sortSelect = checkSelector(document, '.sorts__bar_select') as HTMLOptionElement;
    if (this.url.sort) sortSelect.value = `${this.url.sort.replace('sort=', '')}`;

    const productsItems: NodeListOf<HTMLDivElement> = document.querySelectorAll('.products__item');
    type sortProduct = {
      el: HTMLDivElement;
      price: number;
      rating: number;
      discount: number;
    };

    const sortProductArr: sortProduct[] = [];

    productsItems.forEach((product) => {
      const price = Number(product.dataset.price);
      const rating = Number(checkSelector(product, '.products__info-rating_count').innerHTML);
      const discount = Number(
        checkSelector(product, '.products__card_discount').innerHTML.slice(1, -1)
      );
      sortProductArr.push({
        el: product,
        price: price,
        rating: rating,
        discount: discount,
      });
    });

    const productsContainer = checkSelector(document, '#productsContainer');

    const sortProducts = () => {
      if (sortSelect.value === 'price-ASC') sortProductArr.sort((a, b) => a.price - b.price);
      if (sortSelect.value === 'price-DESC') sortProductArr.sort((a, b) => b.price - a.price);
      if (sortSelect.value === 'rating-ASC') sortProductArr.sort((a, b) => a.rating - b.rating);
      if (sortSelect.value === 'rating-DESC') sortProductArr.sort((a, b) => b.rating - a.rating);
      if (sortSelect.value === 'discount-ASC') {
        sortProductArr.sort((a, b) => a.discount - b.discount);
      }
      if (sortSelect.value === 'discount-DESC') {
        sortProductArr.sort((a, b) => b.discount - a.discount);
      }

      sortProductArr.forEach((el) => productsContainer.append(el.el));
      this.url.sort = `sort=${sortSelect.value}`;
      window.history.replaceState({}, '', `/?${Object.values(this.url).join('&')}`);
    };

    sortSelect.addEventListener('change', sortProducts);
  }

  filterByCategoryAndBrand() {
    const inputCategory: NodeListOf<HTMLInputElement> = document.querySelectorAll(
      '.input-checkbox__category'
    );
    const inputBrand: NodeListOf<HTMLInputElement> =
      document.querySelectorAll('.input-checkbox__brand');
    const productsItems: NodeListOf<HTMLDivElement> = document.querySelectorAll('.products__item');

    const categoryURL = this.url.category?.replace('category=', '').split('%E2%86%95');
    const brandURL = this.url.brand?.replace('brand=', '').split('%E2%86%95');

    const checkCheckboxes = () => {
      const checkboxesCategoryArr: string[] = [];
      const checkboxesBrandArr: string[] = [];

      inputCategory.forEach((checkbox) => {
        if (checkbox instanceof HTMLInputElement && checkbox.checked) {
          checkboxesCategoryArr.includes(checkbox.id)
            ? null
            : checkboxesCategoryArr.push(checkbox.id);
        }
      });

      inputBrand.forEach((checkbox) => {
        if (checkbox instanceof HTMLInputElement && checkbox.checked) {
          checkboxesBrandArr.includes(checkbox.id) ? null : checkboxesBrandArr.push(checkbox.id);
        }
      });

      const priceRangeIn = checkSelector(document, '.price-range__data-in');
      const priceRangeOut = checkSelector(document, '.price-range__data-out');
      const stockRangeIn = checkSelector(document, '.stock-range__data-in');
      const stockRangeOut = checkSelector(document, '.stock-range__data-out');

      productsItems.forEach((product: HTMLDivElement) => {
        const productCategory = checkSelector(product, '.products__info-name_category');
        const productBrandName = checkSelector(product, '.products__info-brand_name');
        const price = Number(product.dataset.price);
        const stock = Number(checkSelector(product, '.products__info-stock_count').innerHTML);

        if (
          stock >= Number(stockRangeIn.innerHTML) &&
          stock <= Number(stockRangeOut.innerHTML) &&
          price >= Number(priceRangeIn.innerHTML.slice(1)) &&
          price <= Number(priceRangeOut.innerHTML.slice(1)) &&
          (checkboxesCategoryArr.includes(productCategory.innerHTML.toLowerCase()) ||
            checkboxesCategoryArr.length === 0)
        ) {
          product.style.display = 'block';
          product.classList.remove('hide');
        } else {
          product.style.display = 'none';
          product.classList.add('hide');
        }
        if (
          (checkboxesBrandArr.includes(productBrandName.innerHTML) ||
            checkboxesBrandArr.length === 0) &&
          product.style.display !== 'none'
        ) {
          product.style.display = 'block';
          product.classList.remove('hide');
        } else {
          product.style.display = 'none';
          product.classList.add('hide');
        }
      });

      this.foundCount.bind(MainPageController)();
      inputCategory.forEach((checkbox) => {
        if (!checkbox.checked) {
          delete this.url.category;
        }
      });
      inputBrand.forEach((checkbox) => {
        if (!checkbox.checked) {
          delete this.url.brand;
        }
      });

      checkboxesCategoryArr.length !== 0
        ? (this.url.category = `category=${checkboxesCategoryArr.join('↕')}`)
        : delete this.url.category;
      checkboxesBrandArr.length !== 0
        ? (this.url.brand = `brand=${checkboxesBrandArr.join('↕')}`)
        : delete this.url.brand;
      Object.keys(this.url).length !== 0
        ? window.history.replaceState({}, '', `/?${Object.values(this.url).join('&')}`)
        : window.history.replaceState({}, '', '');
    };

    if (categoryURL?.length !== 0 && categoryURL !== undefined) {
      inputCategory.forEach((checkbox) => {
        if (categoryURL?.length !== 0 && categoryURL !== undefined) {
          categoryURL.forEach((category) => {
            checkbox.id === category ? (checkbox.checked = true) : null;
          });
        }
      });
      checkCheckboxes();
    }
    if (brandURL?.length !== 0 && brandURL !== undefined) {
      inputBrand.forEach((checkbox) => {
        if (brandURL?.length !== 0 && brandURL !== undefined) {
          brandURL.forEach((brand) => {
            checkbox.id === brand ? (checkbox.checked = true) : null;
          });
        }
      });
      checkCheckboxes();
    }

    inputCategory.forEach((checkbox) => {
      checkbox.addEventListener('input', checkCheckboxes);
    });
    inputBrand.forEach((checkbox) => {
      checkbox.addEventListener('input', checkCheckboxes);
    });
  }

  filterRange() {
    const priceRangeIn = checkSelector(document, '.price-range__data-in');
    const priceRangeOut = checkSelector(document, '.price-range__data-out');
    const priceRangeInputLeft = checkSelector(
      document,
      '.price-range__input_left'
    ) as HTMLInputElement;
    const priceRangeInputRight = checkSelector(
      document,
      '.price-range__input_right'
    ) as HTMLInputElement;

    const stockRangeIn = checkSelector(document, '.stock-range__data-in');
    const stockRangeOut = checkSelector(document, '.stock-range__data-out');
    const stockRangeInputLeft = checkSelector(
      document,
      '.stock-range__input_left'
    ) as HTMLInputElement;
    const stockRangeInputRight = checkSelector(
      document,
      '.stock-range__input_right'
    ) as HTMLInputElement;

    const productsItems: NodeListOf<HTMLDivElement> = document.querySelectorAll('.products__item');

    const rangeChenge = () => {
      priceRangeIn.innerHTML =
        Number(priceRangeInputLeft.value) < Number(priceRangeInputRight.value)
          ? `€${priceRangeInputLeft.value}`
          : `€${priceRangeInputRight.value}`;
      priceRangeOut.innerHTML =
        Number(priceRangeInputRight.value) > Number(priceRangeInputLeft.value)
          ? `€${priceRangeInputRight.value}`
          : `€${priceRangeInputLeft.value}`;

      stockRangeIn.innerHTML =
        Number(stockRangeInputLeft.value) < Number(stockRangeInputRight.value)
          ? stockRangeInputLeft.value
          : stockRangeInputRight.value;
      stockRangeOut.innerHTML =
        Number(stockRangeInputRight.value) > Number(stockRangeInputLeft.value)
          ? stockRangeInputRight.value
          : stockRangeInputLeft.value;

      const inputCategory: NodeListOf<HTMLInputElement> = document.querySelectorAll(
        '.input-checkbox__category'
      );
      const isInput = Array.from(inputCategory).some((checkbox) => checkbox.checked);

      productsItems.forEach((product: HTMLDivElement) => {
        const price = Number(product.dataset.price);
        const stock = Number(checkSelector(product, '.products__info-stock_count').innerHTML);
        if (
          stock >= Number(stockRangeIn.innerHTML) &&
          stock <= Number(stockRangeOut.innerHTML) &&
          price >= Number(priceRangeIn.innerHTML.slice(1)) &&
          price <= Number(priceRangeOut.innerHTML.slice(1)) &&
          (!product.classList.contains('hide') || !isInput)
        ) {
          product.style.display = 'block';
        } else {
          product.style.display = 'none';
        }
      });

      if (priceRangeIn.innerHTML.slice(1) !== '10' || priceRangeOut.innerHTML.slice(1) !== '1750') {
        this.url.price = `price=${[
          priceRangeIn.innerHTML.slice(1),
          priceRangeOut.innerHTML.slice(1),
        ].join('↕')}`;
      } else {
        delete this.url.price;
      }

      if (stockRangeIn.innerHTML !== '1' || stockRangeOut.innerHTML !== '150') {
        this.url.stock = `stock=${[stockRangeIn.innerHTML, stockRangeOut.innerHTML].join('↕')}`;
      } else {
        delete this.url.stock;
      }

      Object.keys(this.url).length !== 0
        ? window.history.replaceState({}, '', `/?${Object.values(this.url).join('&')}`)
        : window.history.replaceState({}, '', '/');

      this.foundCount.bind(MainPageController)();
    };

    if (this.url.price) {
      priceRangeInputLeft.value = this.url.price.replace('price=', '').split('%E2%86%95')[0];
      priceRangeInputRight.value = this.url.price.replace('price=', '').split('%E2%86%95')[1];
      if (this.url.stock) {
        stockRangeInputLeft.value = this.url.stock.replace('stock=', '').split('%E2%86%95')[0];
        stockRangeInputRight.value = this.url.stock.replace('stock=', '').split('%E2%86%95')[1];
      }
      rangeChenge();
    }

    priceRangeInputLeft.addEventListener('change', rangeChenge);
    priceRangeInputRight.addEventListener('change', rangeChenge);
    stockRangeInputLeft.addEventListener('change', rangeChenge);
    stockRangeInputRight.addEventListener('change', rangeChenge);
  }
}
