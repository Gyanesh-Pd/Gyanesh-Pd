class DashboardPage {

    constructor(page) {
        this.products = page.locator(".card-body");
        this.productsText = page.locator(".card-body b");
        this.cartLink = page.locator("[routerlink*='cart']");
        this.myOrders = page.locator("td label[routerlink*=myorders]")
    }

    async searchProductAndAddToCart(productName) {

        await this.productsText.last().waitFor();

        const allTitles = await this.productsText.allTextContents();
        console.log(allTitles);

        const productCount = await this.products.count();

        for (let i = 0; i < productCount; i++) {

            if (await this.products.nth(i).locator('b').textContent() === productName) {

                await this.products.nth(i).locator("text=' Add To Cart'").click();
                break;
            }
        }


    }

    async navigateToCart() {
        await this.cartLink.click();
    }

    async navigateToOrders() {
        await this.myOrders.click();
    }

}
module.exports = { DashboardPage };