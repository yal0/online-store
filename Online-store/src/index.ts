import { MainPageView } from './templates/main-products';
import { MainPageController } from './controller/main-products';

const mainPage = new MainPageView();
const mainPageController = new MainPageController(mainPage);

mainPage.renderProducts();
mainPageController.startPage();
