const { test, expect } = require('@playwright/test')
const { POManager } = require('../pageObjects/POManager')

test('E2E Web App Test', async ({ page }) => {

    const productName = "ZARA COAT 3";
    const email = "anshika@gmail.com";
    const password = "Iamking@000"

    const poManager = new POManager(page);

    const loginPage = poManager.getLoginPage();
    await loginPage.goto();
    await loginPage.validateLogin(email, password);

    const dashboardPage = poManager.getDashboardPage();
    await dashboardPage.searchProductAndAddToCart(productName);
    await dashboardPage.navigateToCart();

    const cartPage = poManager.getCartPage();
    // await page.pause();
    await cartPage.verifyProductIsDisplayed(productName);
    await cartPage.checkout1();

    const orderReviewPage = poManager.getOrderReviewPage();
    await orderReviewPage.searchCountryAndSelect("Ind", "India");
    await orderReviewPage.verifyEmailIdAndPlaceOrder(email);
    const orderId = await orderReviewPage.getOrderIdFromThankyouPage();

    //Click Your Orders History Link
    await dashboardPage.navigateToOrders();

    const orderHistoryPage = poManager.getOrderHistoryPage();
    await orderHistoryPage.searchOrderAndSelect(orderId);
    expect(orderId.includes(await orderHistoryPage.getOrderId())).toBeTruthy();

});

