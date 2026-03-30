const base = require('@playwright/test');


exports.customTest = base.test.extend(
    {
        testDataForOrder: {
            productName: "ZARA COAT 3",
            email: "anshika@gmail.com",
            password: "Iamking@000"
        }
    }
)