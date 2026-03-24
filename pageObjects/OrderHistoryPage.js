class OrderHistoryPage {
    constructor(page) {
        this.ordersTable = page.locator("tbody");
        this.orderHistoryRows = page.locator("tbody tr");
        this.orderIdDetails = page.locator(".row .col-text");
    }

    async searchOrderAndSelect(orderId) {

        await this.ordersTable.waitFor();
        for (let i = 0; i < await this.orderHistoryRows.count(); i++) {

            const orderHistoryOrderId = await this.orderHistoryRows.nth(i).locator("th").textContent();
            if (orderId.includes(orderHistoryOrderId)) {
                await this.orderHistoryRows.nth(i).locator("button").first().click();
                break;
            }
        }
    }

    //Order Summary on clicking View Button
    async getOrderId() {
        return await this.orderIdDetails.textContent();
    }
}
module.exports = { OrderHistoryPage }