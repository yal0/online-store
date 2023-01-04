import { Products } from '../data/data';
import '../assets/images/logo.svg';
import '../assets/images/rs_school.svg';
import '../assets/styles/style.scss';

const catalogProducts = document.getElementById('productsContainer');
// let total = 100,
//   skip = 0,
//   limit = 100;
export class Catalog {
  renderProducts() {
    let htmlCatalogProducts = '';

    Products.forEach(
      ({
        id,
        title,
        price,
        discountPercentage,
        rating,
        stock,
        brand,
        category,
        thumbnail,
      }) => {
        htmlCatalogProducts += `
          <div class="products__item" data-id="${id}">
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
                  } /</span>
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
                <button class="products__info_btn">Add to cart</button>
                </div>
            </div>
          </div>
          `;
      }
    );

    if (catalogProducts) {
      catalogProducts.innerHTML = htmlCatalogProducts;
    }
  }
}
