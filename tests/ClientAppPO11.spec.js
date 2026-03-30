const { test, expect } = require('@playwright/test')
const { customTest } = require('../utils/test-base')
const { POManager } = require('../pageObjects/POManager')
const testdata = JSON.parse(JSON.stringify(require('../utils/placeOrderTestData.json')));

//remove for loop and directly use 'testdata.prod...' if single dataset
for (const dataset of testdata) {
    test(`E2E Web App Test for ${dataset.productName}`, async ({ page }) => {

        const poManager = new POManager(page);

        const loginPage = poManager.getLoginPage();
        await loginPage.goto();
        await loginPage.validateLogin(dataset.email, dataset.password);

        const dashboardPage = poManager.getDashboardPage();
        await dashboardPage.searchProductAndAddToCart(dataset.productName);
        await dashboardPage.navigateToCart();

        const cartPage = poManager.getCartPage();
        // await page.pause();
        await cartPage.verifyProductIsDisplayed(dataset.productName);
        await cartPage.checkout1();

        const orderReviewPage = poManager.getOrderReviewPage();
        await orderReviewPage.searchCountryAndSelect("Ind", "India");
        await orderReviewPage.verifyEmailIdAndPlaceOrder(dataset.email);
        const orderId = await orderReviewPage.getOrderIdFromThankyouPage();

        //Click Your Orders History Link
        await dashboardPage.navigateToOrders();

        const orderHistoryPage = poManager.getOrderHistoryPage();
        await orderHistoryPage.searchOrderAndSelect(orderId);
        expect(orderId.includes(await orderHistoryPage.getOrderId())).toBeTruthy();

    });

}

customTest.only('Custom Fixture test', async ({ page, testDataForOrder }) => {

    const poManager = new POManager(page);

    const loginPage = poManager.getLoginPage();
    await loginPage.goto();
    await loginPage.validateLogin(testDataForOrder.email, testDataForOrder.password);

    const dashboardPage = poManager.getDashboardPage();
    await dashboardPage.searchProductAndAddToCart(testDataForOrder.productName);
    await dashboardPage.navigateToCart();

    const cartPage = poManager.getCartPage();
    // await page.pause();
    await cartPage.verifyProductIsDisplayed(testDataForOrder.productName);
    await cartPage.checkout1();
});
