
export const RECHNIX_CONFIG = {
    stripe: {
        publishableKey: "pk_test_REPLACE_WITH_YOUR_KEY", // Replace with actual key
        products: {
            fullVersion: {
                priceId: "price_REPLACE_FULL_VERSION_ID",
                name: "Rechnix Vollversion",
                amount: 15.00 // Example
            },
            update: {
                priceId: "price_REPLACE_UPDATE_ID",
                name: "Rechnix Update",
                amount: 2.99 // Example
            }
        }
    },
    app: {
        currentVersion: "1.0.0",
        downloadFileName: "Rechnix-Installer.dmg"
    }
};
