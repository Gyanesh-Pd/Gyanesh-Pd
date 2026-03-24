const { LoginPage } = require('./LoginPage');
const { DashboardPage } = require('./DashboardPage');
const { CartPage } = require('./CartPage');
const { OrderReviewPage } = require('./OrderReviewPage');
const { OrderHistoryPage } = require('./OrderHistoryPage');


class POManager {

    constructor(page) {
        this.loginPage = new LoginPage(page);
        this.dashboardPage = new DashboardPage(page);
        this.cartPage = new CartPage(page);
        this.orderReviewPage = new OrderReviewPage(page);
        this.orderHistoryPage = new OrderHistoryPage(page);
    }

    getLoginPage() {
        return this.loginPage;
    }

    getDashboardPage() {
        return this.dashboardPage;
    }

    getCartPage() {
        return this.cartPage;
    }

    getOrderReviewPage() {
        return this.orderReviewPage;
    }

    getOrderHistoryPage() {
        return this.orderHistoryPage;
    }
}
module.exports = { POManager };