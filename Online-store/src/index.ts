import { MainPageView } from './templates/main-products';
import { MainPageController } from './controller/main-products';

const mainPage = new MainPageView();
mainPage.renderProducts();
const mainPageController = new MainPageController(mainPage);
mainPageController.setupPage();
