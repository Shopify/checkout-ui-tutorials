import React, { useState } from "react";
import {
  render,
  TextField,
  BlockStack,
  useApplyMetafieldsChange,
  useMetafield,
  Checkbox,
} from "@shopify/checkout-ui-extensions-react";

// [START custom_fields-react.ext-index]
render("Checkout::ShippingMethods::RenderAfter", () => <App />);
// [END custom_fields-react.ext-index]

function App() {
  // Set up the checkbox state
  const [checked, setChecked] = useState(false);

  // [START custom_fields-react.define-metafield]
  const metafieldNamespace = "yourAppNamespace";
  const metafieldKey = "deliveryInstructions";
  // [END custom_fields-react.define-metafield]

  // [START custom_fields-react.use-metafield]
  const deliveryInstructions = useMetafield({
    namespace: metafieldNamespace,
    key: metafieldKey,
  });
  // [END custom_fields-react.use-metafield]

  // [START custom_fields-react.update-metafield]
  const applyMetafieldsChange = useApplyMetafieldsChange();
  // [END custom_fields-react.update-metafield]

  // Set a function to handle the Checkbox component's onChange event
  const handleChange = () => {
    setChecked(!checked);
  };

  // [START custom_fields-react.instruction-ui]
  return (
    <BlockStack>
      <Checkbox checked={checked} onChange={handleChange}>
        Provide delivery instructions
      </Checkbox>
      {checked && (
        <TextField
          label="Delivery instructions"
          multiline={3}
          // [START custom_fields-react.store-value]
          onChange={(value) => {
            applyMetafieldsChange({
              type: "updateMetafield",
              namespace: metafieldNamespace,
              key: metafieldKey,
              valueType: "string",
              value,
            });
          }}
          // [END custom_fields-react.store-value]
          value={deliveryInstructions?.value}
        />
      )}
    </BlockStack>
  );
  // [END custom_fields-react.instruction-ui]
}