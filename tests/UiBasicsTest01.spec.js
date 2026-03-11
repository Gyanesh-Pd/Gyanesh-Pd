const { test, expect } = require('@playwright/test')



test('TestCase 1 with browser context', async ({ browser }) => {

    const context = await browser.newContext();
    const page = await context.newPage();

    page.goto("https://www.rahulshettyacademy.com/loginpagePractise/");

})

test('TestCase 2 with Page', async ({ page }) => {
    await page.goto("https://www.rahulshettyacademy.com/loginpagePractise/");
    console.log(await page.title());
    await expect(page).toHaveTitle("LoginPage Practise | Rahul Shetty Academy");
    await page.locator("#username").fill("rahulshettyacademy");
    await page.locator("[name='password']").fill("earning@830$3mK2");
    await page.locator("#signInBtn").click();
    console.log(await page.locator("[style*='block']").textContent());
    await expect(page.locator("[style*='block']")).toContainText("Incorrect");

    await page.locator("#username").fill("");
    await page.locator("#username").fill("rahulshettyacademy");
    await page.locator("[name='password']").fill("Learning@830$3mK2");
    await page.locator("#signInBtn").click();

    console.log(await page.locator(".card-body a").first().textContent());
    //or   // console.log(await page.locator(".card-body a").nth(0).textContent());

    const allTitles = await page.locator(".card-body a").allTextContents();
    //Returns array. syncro not here, will not wait. Will give empty array.
    console.log(allTitles);
});


test('UI Controls', async ({ page }) => {

    await page.goto("https://www.rahulshettyacademy.com/loginpagePractise/")
    const userName = page.locator('#userName');
    const signIn = page.locator('#signInBtn');
    const documentLink = page.locator("[href*='documents-request']");

    const dropDown = page.locator('select.form-control');
    await dropDown.selectOption("consult");

    //radio
    await page.locator(".checkmark").nth(1).click();
    await page.locator('#okayBtn').click();

    //Radio assertion
    await expect(page.locator(".checkmark").nth(1)).toBeChecked();
    //Logs true or false
    console.log(await page.locator(".checkmark").nth(1).isChecked());

    //checkbox
    await page.locator('#terms').click();
    await expect(page.locator('#terms')).toBeChecked();

    //Uncheck checkbox or radiobox
    await page.locator('#terms').uncheck();

    //Assertion
    expect(await page.locator('#terms').isChecked()).toBeFalsy();

    //Blinking Text check
    await expect(documentLink).toHaveAttribute("class", "blinkingText");
    await page.pause();
});


test('Child Window Handle', async ({ browser }) => {

    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://www.rahulshettyacademy.com/loginpagePractise/")

    const userName = page.locator('#username');
    const documentLink = page.locator("[href*='documents-request']");

    const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        documentLink.click(),
    ])

    const text = await newPage.locator('.red a').textContent();
    const arrayOfText = text.split("@");
    const extractDomain = arrayOfText[1].split(" ")[0];
    console.log(extractDomain);

    //Using parent page context to fill value
    await userName.fill(extractDomain);
    console.log(await userName.inputValue());

})
