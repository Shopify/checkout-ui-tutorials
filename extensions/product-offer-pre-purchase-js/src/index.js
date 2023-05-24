import { extend, Banner } from "@shopify/checkout-ui-extensions";

extend("Checkout::Dynamic::Render", (root, { extensionPoint, i18n }) => {
  root.appendChild(
    root.createComponent(
      Banner,
      { title: "product-offer-pre-purchase-js" },
      i18n.translate('welcome', {extensionPoint})
    )
  );
  root.mount();
});