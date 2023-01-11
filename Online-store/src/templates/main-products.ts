import { Products } from '../data/data';
import { checkSelector } from '../utils/checkSelector';
import { localStorageProducts } from '../utils/localStorageProducs';
import '../assets/images/logo.svg';
import '../assets/images/menu3x3.svg';
import '../assets/images/menu2x2.svg';
import '../assets/images/rs_school.svg';
import '../assets/styles/style.scss';

const main = document.getElementById('main');
let productsArr: localStorageProducts[] = [];

export class MainPageView {
  public renderMain = (): void => {
    const htmlMain = `
    <div class="info wrapper">
      <p class="info__found"><span>Found </span><span class="info__found-count">100</span> results</p>
    </div>
    <div class="sorts">
      <div class="sorts__container wrapper">
        <div class="view">
          <div class="view__small active">
            <img src="./assets/images/menu3x3.svg" alt="view-small" width="40px">
          </div>
            <div class="view__big">
              <img src="./assets/images/menu2x2.svg" alt="view-big" width="40px">
            </div>
        </div>
        <div class="sorts__bar">
            <select class="sorts__bar_select">
              <option disabled selected>Sort options</option>
              <option value="price-ASC">Price ↑</option>
              <option value="price-DESC">Price ↓</option>
              <option value="rating-ASC">Rating ↑</option>
              <option value="rating-DESC">Rating ↓</option>
              <option value="discount-ASC">Discount ↑</option>
              <option value="discount-DESC">Discount ↓</option>
            </select>
            <div class="search">
                <input class="search__field" type="text">
            </div>
          </div>
        </div>
      </div>
    <div class="products wrapper">
        <div class="filters">
            <div class="filters-category">
                <h3 class="filters__title">Category</h3>
                <div class="filters__list" id="categoryList"></div>
            </div>
            <div class="filters-brand">
                <h3 class="filters__title">Brand</h3>
                <div class="filters__list" id="brandList"></div>
            </div>

            <div class="filters-price">
                <h3 class="filters__title">Price</h3>
                <div class="price-range">
                    <div class="price-range__data">
                        <div class="price-range__data-in">€10</div>
                        <div class="price-range__data-arrow">⟷</div>
                        <div class="price-range__data-out">€1750</div>
                    </div>
                    <div class="price-range__input-container">
                        <input type="range" class="price-range__input price-range__input_left" min="10" max="1750" value="10" step="1">
                        <input type="range" class="price-range__input price-range__input_right" min="10" max="1750" value="1750" step="1">
                    </div>
                </div>
            </div>

          <div class="filters-stock">
            <h3 class="filters__title">Stock</h3>
            <div class="stock-range">
              <div class="stock-range__data">
                <div class="stock-range__data-in">1</div>
                  <div class="stock-range__data-arrow">⟷</div>
                  <div class="stock-range__data-out">150</div>
                </div>
                <div class="stock-range__input-container">
                  <input type="range" class="stock-range__input stock-range__input_left" min="1" max="150" value="1" step="1">
                  <input type="range" class="stock-range__input stock-range__input_right" min="1" max="150" value="150" step="1">
                </div>
              </div>
          </div>

          <div class="filters-btns">
            <button class="filters-btns__reset">Reset filters</button>
            <button class="filters-btns__copy">Copy link</button>
          </div>
        </div>
        <div class="products__container" id="productsContainer">

        </div>
    </div>`;
    if (main) {
      main.innerHTML = htmlMain;
    }
  };

  public renderProducts = (): void => {
    const catalogProducts = document.getElementById('productsContainer');
    const categoryList = document.getElementById('categoryList');
    const brandList = document.getElementById('brandList');
    const sumValue = checkSelector(document, '.sum__value');
    const cartSumNum = localStorage.getItem('cartSum');
    const cartCount = checkSelector(document, '.cart__count');
    const products = localStorage.getItem('products');

    let htmlCatalogProducts = `<div class="products__no-found">Products not found :(</div>`;
    let htmlFiltersCategory = '';
    let htmlFiltersBrand = '';
    const categoryArr: string[] = [];
    const brandArr: string[] = [];
    sumValue.innerHTML = `€${cartSumNum || 0}`;
    let btnToCartRender = '';
    const productsArrId: string[] = [];
    if (products) {
      productsArr = JSON.parse(products) as localStorageProducts[];
      cartCount.innerHTML = productsArr.length.toString();
      productsArr.forEach((item) => productsArrId.push(item.id));
      btnToCartRender = '<button class="products__info_btn-cart active">Drop to cart</button>';
    }

    Products.forEach(
      ({ id, title, price, discountPercentage, rating, stock, brand, category, thumbnail }) => {
        if (productsArrId.includes(id.toString())) {
          btnToCartRender = '<button class="products__info_btn-cart active">Drop to cart</button>';
        } else {
          btnToCartRender = '<button class="products__info_btn-cart">Add to cart</button>';
        }

        htmlCatalogProducts += `
          <div class="products__item" data-id="${id}" data-price="${price}">
            <div class="products__card" style="background-image: url(${thumbnail});">
              <div class="products__card_discount">-${discountPercentage}%</div>
            </div>
            <div class="products__info">
              <div class="products__info-left">
                <div class="products__info-price">
                  <span class="products__info-price_old">€${Math.round(
                    (price * 100) / (100 - discountPercentage)
                  )}</span>
                  <span class="products__info-price_new">€${price}</span>
                </div>
                <div class="products__info-name">
                  <span class="products__info-name_title">${
                    title[0].toUpperCase() + title.slice(1)
                  }/</span>
                  <span class="products__info-name_category">${
                    category[0].toUpperCase() + category.slice(1)
                  }</span>
                </div>
                <div class="products__info-rating">
                  <span>Rating: </span>
                  <span class="products__info-rating_count">${rating}</span>
                </div>
                <div class="products__info-brand">
                <span>Brand: </span>
                <span class="products__info-brand_name">${brand}</span>
              </div>
              </div>
              <div class="products__info-right">
                <div class="products__info-stock">
                  <span>Stock:<br></span>
                  <span class="products__info-stock_count">${stock}</span>
                </div>
                ${btnToCartRender}
                </div>
            </div>
          </div>
          `;
        // render category filters
        if (!categoryArr.includes(category) || categoryArr.length === 0) {
          categoryArr.push(category);
          htmlFiltersCategory += `
          <div class="filters__list-checkbox">
            <input type="checkbox" class="input-checkbox__category" id="${
              categoryArr[categoryArr.length - 1]
            }">
            <label for="${categoryArr[categoryArr.length - 1]}">${
            categoryArr[categoryArr.length - 1][0].toUpperCase() +
            categoryArr[categoryArr.length - 1].slice(1)
          }   </label>
          </div>
          `;
        }

        // render brands filters
        if (!brandArr.includes(brand) || brandArr.length === 0) {
          brandArr.push(brand);
          htmlFiltersBrand += `
          <div class="filters__list-checkbox">
            <input type="checkbox" class="input-checkbox__brand" id="${
              brandArr[brandArr.length - 1]
            }">
            <label for="${brandArr[brandArr.length - 1]}">${brandArr[brandArr.length - 1]} </label>
          </div>
          `;
        }
      }
    );

    if (catalogProducts) {
      catalogProducts.innerHTML = htmlCatalogProducts;
    }
    if (categoryList) {
      categoryList.innerHTML = htmlFiltersCategory;
    }
    if (brandList) {
      brandList.innerHTML = htmlFiltersBrand;
    }
  };
}
