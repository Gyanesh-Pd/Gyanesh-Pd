const { test, expect, request } = require("@playwright/test");

const loginPayLoad = { userEmail: "anshika@gmail.com", userPassword: "Iamking@000" };
const orderPayLoad = { orders: [{ country: "India", productOrderedId: "6960ea76c941646b7a8b3dd5" }] }
let token;
let orderId;

test.beforeAll(async () => {
    const apiContext = await request.newContext();    //apicontext(CALL(url), data)

    //login API - Post(url, {data})
    const loginResponseObject = await apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
        {
            data: loginPayLoad
        })

    //assert loginResponse as success in 200 series
    expect(loginResponseObject.ok()).toBeTruthy();
    //Returns json representation of loginResponse
    const loginResponseJson = await loginResponseObject.json();
    //Get the loginResponseJson's object token part
    token = loginResponseJson.token;
    console.log(token);

    // Create Order API
    const orderResponseObject = await apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order", {
        data: orderPayLoad,
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        },
    })

    const orderResponseJson = await orderResponseObject.json();
    console.log(orderResponseJson);
    orderId = orderResponseJson.orders[0];

})


test('Client App Login', async ({ page }) => {


    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, token);

    // const email = "anshika@gmail.com";
    // console.log(await page.title());
    // await page.locator("#userEmail").fill(email);
    // await page.locator("#userPassword").fill("Iamking@000");
    // await page.locator("[value='Login']").click();
    // await page.waitForLoadState('networkidle');

    await page.goto("https://www.rahulshettyacademy.com/client/");
    // const productName = "ZARA COAT 3";              //product to Search
    // const products = page.locator(".card-body");    //All products


    // await page.locator('.card-body b').last().waitFor();

    // const allTitles = await page.locator(".card-body b").allTextContents();
    // console.log(allTitles);

    // const productCount = await products.count();

    // for (let i = 0; i < productCount; i++) {

    //     if (await products.nth(i).locator('b').textContent() === productName) {

    //         await products.nth(i).locator("text=' Add To Cart'").click();
    //         break;
    //     }
    // }
    // await page.locator("[routerlink*='cart']").click();
    // await page.locator("div li").first().waitFor();
    // const isCartProduct = page.locator("h3:has-text('ZARA COAT 3')").isVisible();
    // expect(isCartProduct).toBeTruthy();
    // await page.locator("text=Checkout").click();
    // await page.locator("[placeholder*='Country']").pressSequentially("ind", { delay: 150 });

    // const dropdown = page.locator("[class*='ta-results']");
    // await dropdown.waitFor();

    // const dropdownOptionsCount = await dropdown.locator("button").count();

    // for (let i = 0; i < dropdownOptionsCount; i++) {

    //     const dropdownText = await dropdown.locator("button").nth(i).textContent();

    //     if (dropdownText.trim() === "India") {
    //         await dropdown.locator("button").nth(i).click();
    //         break;
    //     }
    // }

    // await expect(page.locator(".user__name [type='text']").first()).toHaveText(email);
    // await page.locator(".action__submit").click();

    // //Thank you page
    // await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
    // const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
    // console.log(orderId);

    //Click Orders Page
    await page.locator("button[routerlink*=myorders]").click();
    await page.locator("tbody").waitFor();

    //On Order History Page
    const orderHistoryRows = page.locator("tbody tr");

    for (let i = 0; i < await orderHistoryRows.count(); i++) {

        const orderHistoryOrderId = await orderHistoryRows.nth(i).locator("th").textContent();
        if (orderId.includes(orderHistoryOrderId)) {
            await orderHistoryRows.nth(i).locator("button").first().click();
            break;
        }
    }

    //Order Summary on clicking View Button
    const orderIdFromSummary = await page.locator(".row .col-text").textContent();
    await page.pause();
    expect(orderId.includes(orderIdFromSummary)).toBeTruthy();

    // await page.pause();

});

