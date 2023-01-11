import { MainPageView } from './templates/main-products';
import { MainPageController } from './controller/main-products';

const mainPage = new MainPageView();
const mainPageController = new MainPageController(mainPage);

mainPage.renderProducts();

const currentLocation = window.location.href.replace(window.location.origin, '');
mainPageController.currentURL(currentLocation);
mainPageController.startPage();

(document.querySelector('.filters-btns__reset') as HTMLButtonElement).addEventListener(
  'click',
  () => {
    window.history.replaceState({}, '', '/');
    window.location.href = '/';
  }
);
