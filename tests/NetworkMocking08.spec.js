const { test, expect, request } = require('@playwright/test');
const { ApiUtils } = require('../utils/ApiUtils')

const loginPayLoad = { userEmail: "anshika@gmail.com", userPassword: "Iamking@000" };
const orderPayLoad = { orders: [{ country: "India", productOrderedId: "6960ea76c941646b7a8b3dd5" }] };
const fakePayLoadOrders = { data: [], message: "No Orders" };

let response;


test.beforeAll(async () => {

    //Login apicontext(CALL(url), data)
    const apiContext = await request.newContext();

    //Create object of ApiUtils
    const apiUtils = new ApiUtils(apiContext, loginPayLoad);

    response = await apiUtils.createOrder(orderPayLoad);

})


test('Mocking No Orders in Order History Page', async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/client/");

    page.on('request', request => console.log(request.url()));
    page.on('response', response => console.log(response.url(), response.status()));

    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token);

    await page.reload();

    //block all images
    page.route('**/*.{jpg,png,jpeg}', route => route.abort());


    //intercepting response -APi response-> { playwright fakeresponse}->browser->render data on front end
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
        async route => {
            const response1 = await page.request.fetch(route.request());
            let body = JSON.stringify(fakePayLoadOrders);
            route.fulfill(
                {
                    response1,
                    body,

                });
        });

    await page.locator("button[routerlink*='myorders']").click();
    await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*")

    console.log(await page.locator(".mt-4").textContent());



});

