const { test, expect } = require('@playwright/test');

test('Visual Test n Screenshot', async ({ page }) => {
    await page.goto("https://www.rahulshettyacademy.com/loginpagePractise/");
    console.log(await page.title());

    //1st time creates testFileName-snapshots directory under tests folder.
    //Takes current snapshot and compares to previous snapshot.
    expect(await page.screenshot()).toMatchSnapshot('previousSnap.png');

    await expect(page).toHaveTitle("LoginPage Practise | Rahul Shetty Academy");
    await page.locator("#username").fill("rahulshettyacademy");

    await page.locator("#username").screenshot({ path: 'partialScreenShot.jpg' });
    await page.screenshot({ path: 'fullPageScreenshot.png' });

    await page.locator("[name='password']").fill("earning@830$3mK2");
    await page.locator("#signInBtn").click();

})


