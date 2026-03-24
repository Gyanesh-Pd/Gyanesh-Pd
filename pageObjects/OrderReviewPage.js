const { expect } = require('@playwright/test')

class OrderReviewPage {

    constructor(page) {
        this.countryBox = page.locator("[placeholder*='Country']");
        this.countryDropdown = page.locator("[class*='ta-results']");
        this.summaryEmailId = page.locator(".user__name [type='text']").first();
        this.placeOrder = page.locator(".action__submit");
        this.orderConfirmationText = page.locator(".hero-primary");
        this.orderId = page.locator(".em-spacer-1 .ng-star-inserted");
    }

    async searchCountryAndSelect(countryCode, countryName) {

        await this.countryBox.type(countryCode, { delay: 150 });
        await this.countryDropdown.waitFor();
        const dropdownOptionsCount = await this.countryDropdown.locator("button").count();

        for (let i = 0; i < dropdownOptionsCount; i++) {

            const dropdownText = await this.countryDropdown.locator("button").nth(i).textContent();

            if (dropdownText.trim() === countryName) {
                await this.countryDropdown.locator("button").nth(i).click();
                break;
            }
        }
    }

    async verifyEmailIdAndPlaceOrder(email) {
        await expect(this.summaryEmailId).toHaveText(email);
        await this.placeOrder.click();
    }

    async getOrderIdFromThankyouPage() {

        await expect(this.orderConfirmationText).toHaveText(" Thankyou for the order. ");
        const orderId = await this.orderId.textContent();
        console.log(orderId);
        return orderId;
    }
}
module.exports = { OrderReviewPage }