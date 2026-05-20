import i18n
from "i18next";

import {
  initReactI18next,
} from "react-i18next";

i18n.use(
  initReactI18next
).init({

  resources: {

    en: {

      translation: {

        welcome:
        "Welcome",

        cart:
        "Cart",

        orders:
        "Orders",

        profile:
        "Profile",

        logout:
        "Logout",

        farmerDashboard:
        "Farmer Dashboard",

        marketPrices:
        "Market Prices",

        uploadProduct:
        "Upload Product",

        submittedProducts:
        "Submitted Products",

        productName:
        "Product Name",

        category:
        "Category",

        quantity:
        "Quantity",

        marketPrice:
        "Market Price",

        farmerPrice:
        "Farmer Price",

        description:
        "Description",

        submitForApproval:
        "Submit for Approval",

        startVoice:
        "Start Kannada Voice",

        listening:
        "Listening...",

        competitivePrice:
        "Good competitive pricing",

        higherPrice:
        "Suggested price is higher than market",

        approvalStatus:
        "Approval Status",
      },
    },

    kn: {

      translation: {

        welcome:
        "ಸ್ವಾಗತ",

        cart:
        "ಕಾರ್ಟ್",

        orders:
        "ಆರ್ಡರ್‌ಗಳು",

        profile:
        "ಪ್ರೊಫೈಲ್",

        logout:
        "ಲಾಗ್ ಔಟ್",

        farmerDashboard:
        "ರೈತ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",

        marketPrices:
        "ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು",

        uploadProduct:
        "ಉತ್ಪನ್ನ ಅಪ್‌ಲೋಡ್",

        submittedProducts:
        "ಸಲ್ಲಿಸಿದ ಉತ್ಪನ್ನಗಳು",

        productName:
        "ಉತ್ಪನ್ನದ ಹೆಸರು",

        category:
        "ವರ್ಗ",

        quantity:
        "ಪ್ರಮಾಣ",

        marketPrice:
        "ಮಾರುಕಟ್ಟೆ ಬೆಲೆ",

        farmerPrice:
        "ರೈತ ಬೆಲೆ",

        description:
        "ವಿವರಣೆ",

        submitForApproval:
        "ಅನುಮೋದನೆಗೆ ಸಲ್ಲಿಸಿ",

        startVoice:
        "ಕನ್ನಡ ಧ್ವನಿ ಆರಂಭಿಸಿ",

        listening:
        "ಆಲಿಸುತ್ತಿದೆ...",

        competitivePrice:
        "ಉತ್ತಮ ಸ್ಪರ್ಧಾತ್ಮಕ ಬೆಲೆ",

        higherPrice:
        "ಸೂಚಿಸಿದ ಬೆಲೆ ಮಾರುಕಟ್ಟೆಗಿಂತ ಹೆಚ್ಚಾಗಿದೆ",

        approvalStatus:
        "ಅನುಮೋದನೆ ಸ್ಥಿತಿ",
      },
    },
  },

  lng: "en",

  fallbackLng: "en",

  interpolation: {

    escapeValue: false,
  },
});

export default
i18n;
