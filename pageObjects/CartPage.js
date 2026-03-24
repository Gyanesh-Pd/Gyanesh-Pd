const { expect } = require('@playwright/test')

class CartPage {
    constructor(page) {
        this.page = page;
        this.cartProducts = page.locator("div li").first();
        this.checkout = page.locator("text=Checkout");
    }


    async verifyProductIsDisplayed(productName) {
        await this.cartProducts.waitFor();
        const isCartProduct = await this.getProductLocator(productName).isVisible();
        expect(isCartProduct).toBeTruthy();
    }

    async checkout1() {
        await this.checkout.click();
    }

    getProductLocator(productName) {
        return this.page.locator("h3:has-text('" + productName + "')");
    }
}
module.exports = { CartPage };