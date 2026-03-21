const { test, expect, request } = require('@playwright/test');
const { ApiUtils } = require('./utils/ApiUtils')

const loginPayLoad = { userEmail: "anshika@gmail.com", userPassword: "Iamking@000" };
const orderPayLoad = { orders: [{ country: "India", productOrderedId: "6960ea76c941646b7a8b3dd5" }] }

let response;


test.beforeAll(async () => {

    //Login apicontext(CALL(url), data)
    const apiContext = await request.newContext();

    //Create object of ApiUtils
    const apiUtils = new ApiUtils(apiContext, loginPayLoad);

    response = await apiUtils.createOrder(orderPayLoad);

})


test('Client App Login', async ({ page }) => {

    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token);

    await page.goto("https://www.rahulshettyacademy.com/client/");

    //Click Orders Page
    await page.locator("button[routerlink*=myorders]").click();
    await page.locator("tbody").waitFor();

    //On Order History Page
    const orderHistoryRows = page.locator("tbody tr");

    for (let i = 0; i < await orderHistoryRows.count(); i++) {

        const orderHistoryOrderId = await orderHistoryRows.nth(i).locator("th").textContent();
        if (response.orderId.includes(orderHistoryOrderId)) {
            await orderHistoryRows.nth(i).locator("button").first().click();
            break;
        }
    }

    //Order Summary on clicking View Button
    const orderIdFromSummary = await page.locator(".row .col-text").textContent();
    await page.pause();
    expect(response.orderId.includes(orderIdFromSummary)).toBeTruthy();

    // await page.pause();

});

