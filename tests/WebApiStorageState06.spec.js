const { test, expect } = require('@playwright/test')

let storageStateContext;
const email = "anshika@gmail.com";

test.beforeAll(async ({ browser }) => {

    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://www.rahulshettyacademy.com/client/");
    console.log(await page.title());

    await page.locator("#userEmail").fill(email);
    await page.locator("#userPassword").fill("Iamking@000");
    await page.locator("[value='Login']").click();
    await page.locator('.card-body b').last().waitFor();

    await context.storageState({ path: 'state.json' });
    storageStateContext = await browser.newContext({ storageState: 'state.json' });
})


test('E2E Web App Test', async () => {

    //product to Search
    const productName = "ZARA COAT 3";

    const page = await storageStateContext.newPage();

    await page.goto("https://www.rahulshettyacademy.com/client/");

    // await page.waitForLoadState('networkidle');
    await page.locator('.card-body b').last().waitFor();

    //All products
    const products = page.locator(".card-body");

    const allTitles = await page.locator(".card-body b").allTextContents();
    console.log(allTitles);

    const productCount = await products.count();

    for (let i = 0; i < productCount; i++) {

        if (await products.nth(i).locator('b').textContent() === productName) {

            await products.nth(i).locator("text=' Add To Cart'").click();
            break;
        }
    }
    await page.locator("[routerlink*='cart']").click();
    await page.locator("div li").first().waitFor();
    const isCartProduct = page.locator("h3:has-text('ZARA COAT 3')").isVisible();
    expect(isCartProduct).toBeTruthy();
    await page.locator("text=Checkout").click();
    await page.locator("[placeholder*='Country']").pressSequentially("ind", { delay: 150 });

    const dropdown = page.locator("[class*='ta-results']");
    await dropdown.waitFor();

    const dropdownOptionsCount = await dropdown.locator("button").count();

    for (let i = 0; i < dropdownOptionsCount; i++) {

        const dropdownText = await dropdown.locator("button").nth(i).textContent();

        if (dropdownText.trim() === "India") {
            await dropdown.locator("button").nth(i).click();
            break;
        }
    }

    await expect(page.locator(".user__name [type='text']").first()).toHaveText(email);
    await page.locator(".action__submit").click();

    //Thank you page
    await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
    const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
    console.log(orderId);

    //Click Order History Link
    await page.locator("td label[routerlink*=myorders]").click();
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

    expect(orderId.includes(orderIdFromSummary)).toBeTruthy();

    // await page.pause();

});

