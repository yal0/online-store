import { Products } from '../data/data';
import { checkSelector } from '../utils/checkSelector';
import { localStorageProducts } from '../utils/localStorageProducs';
import '../assets/images/logo.svg';
import '../assets/images/menu3x3.svg';
import '../assets/images/menu2x2.svg';
import '../assets/images/rs_school.svg';
import '../assets/styles/style.scss';

const catalogProducts = document.getElementById('productsContainer');
const categoryList = document.getElementById('categoryList');
const brandList = document.getElementById('brandList');
const sumValue = checkSelector(document, '.sum__value');
const cartSumNum = localStorage.getItem('cartSum');
const cartCount = checkSelector(document, '.cart__count');
const products = localStorage.getItem('products');
let productsArr: localStorageProducts[] = [];

export class MainPageView {
  public renderProducts = (): void => {
    let htmlCatalogProducts = `<div class="products__no-found">No products found :(</div>`;
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
            <input type="checkbox" class="input-checkbox" id="${
              categoryArr[categoryArr.length - 1]
            }">
            <label for="${categoryArr[categoryArr.length - 1]}">${
            categoryArr[categoryArr.length - 1][0].toUpperCase() +
            categoryArr[categoryArr.length - 1].slice(1)
          }   </label>
            <span>(5/5)</span>
          </div>
          `;
        }

        // render brands filters
        if (!brandArr.includes(brand) || brandArr.length === 0) {
          brandArr.push(brand);
          htmlFiltersBrand += `
          <div class="filters__list-checkbox">
            <input type="checkbox" class="input-checkbox" id="${brandArr[brandArr.length - 1]}">
            <label for="${brandArr[brandArr.length - 1]}">${brandArr[brandArr.length - 1]} </label>
            <span>(1/1)</span>
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
