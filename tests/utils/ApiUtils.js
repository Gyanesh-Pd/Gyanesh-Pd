class ApiUtils {


    constructor(apiContext, loginPayLoad) {
        this.apiContext = apiContext;
        this.loginPayLoad = loginPayLoad;
    }


    async getToken() {

        //login API - Post(url, {data})
        const loginResponseObject = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
            {
                data: this.loginPayLoad
            })

        //Returns json representation of loginResponse
        const loginResponseJson = await loginResponseObject.json();
        console.log("Login Response:", loginResponseJson);
        //Get the loginResponseJson's object token part
        const token = loginResponseJson.token;
        console.log("Token:", token);
        return token;
    }


    async createOrder(orderPayLoad) {

        let response = {};
        response.token = await this.getToken();
        console.log("Token to use for order:", response.token);

        const orderResponseObject = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order", {
            data: orderPayLoad,
            headers: {
                'Authorization': response.token,
                'Content-Type': 'application/json'
            },
        })

        const orderResponseJson = await orderResponseObject.json();
        console.log("Order Response:", orderResponseJson);

        if (!orderResponseJson.orders || orderResponseJson.orders.length === 0) {
            throw new Error("Order creation failed: " + JSON.stringify(orderResponseJson));
        }

        const orderId = orderResponseJson.orders[0];
        response.orderId = orderId;

        return response;
    }
}

module.exports = { ApiUtils };