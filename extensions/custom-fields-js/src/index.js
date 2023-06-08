import {
  extend,
  TextField,
  BlockStack,
  Checkbox,
} from "@shopify/checkout-ui-extensions";

// [START custom-fields-js.ext-index]
extend("Checkout::ShippingMethods::RenderAfter", (root, api) => {
// [END custom-fields-js.ext-index]
  // Keep track of the UI state
  const state = {
    metafields: api.metafields.current,
    showDeliveryInstructions: false,
  };

  // Render the initial extension UI
  renderUI({ root, api, state });

  // Keep track if metafields change. If they do, then re-render.
  api.metafields.subscribe((newMetafields) => {
    state.metafields = newMetafields;
    renderUI({ root, api, state });
  });
});

function renderUI({ root, api, state }) {
  const { applyMetafieldChange } = api;

  // In case this is a re-render, then remove all previous children
  for (const child of root.children) {
    root.removeChild(child);
  }

  // Define the metafield namespace and key
  const metafieldNamespace = "yourAppNamespace";
  const metafieldKey = "deliveryInstructions";

  // Get a reference to the metafield
  const deliveryInstructions = state.metafields?.find(
    (field) =>
      field.namespace === metafieldNamespace && field.key === metafieldKey
  );

  // Create the Checkbox component
  const app = root.createComponent(BlockStack, {}, [
    root.createComponent(
      Checkbox,
      {
        checked: state.showDeliveryInstructions,
        onChange: () => {
          state.showDeliveryInstructions = !state.showDeliveryInstructions;
          renderUI({ root, api, state });
        },
      },
      "Provide delivery instructions"
    ),
  ]);

  // If the Checkbox component is selected, then create a TextField component
  if (state.showDeliveryInstructions) {
    app.appendChild(
      root.createComponent(TextField, {
        multiline: 3,
        label: "Delivery instructions",
        onChange: (value) => {
          // Apply the change to the metafield
          applyMetafieldChange({
            type: "updateMetafield",
            namespace: metafieldNamespace,
            key: metafieldKey,
            valueType: "string",
            value,
          });
        },
        value: deliveryInstructions?.value,
      })
    );
  }

  // Render the extension components
  root.appendChild(app);
}