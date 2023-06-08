import React, { useState } from "react";
import {
  render,
  TextField,
  BlockStack,
  useApplyMetafieldsChange,
  useMetafield,
  Checkbox,
} from "@shopify/checkout-ui-extensions-react";

// [START custom-field-react.ext-index]
render("Checkout::ShippingMethods::RenderAfter", () => <App />);
// [END custom-field-react.ext-index]

function App() {
  // Set up the checkbox state
  const [checked, setChecked] = useState(false);

  // [START custom-field-react.define-metafield]
  const metafieldNamespace = "yourAppNamespace";
  const metafieldKey = "deliveryInstructions";
  // [END custom-field-react.define-metafield]

  // [START custom-field-react.use-metafield]
  const deliveryInstructions = useMetafield({
    namespace: metafieldNamespace,
    key: metafieldKey,
  });
  // [END custom-field-react.use-metafield]

  // [START custom-field-react.update-metafield]
  const applyMetafieldsChange = useApplyMetafieldsChange();
  // [END custom-field-react.update-metafield]

  // Set a function to handle the Checkbox component's onChange event
  const handleChange = () => {
    setChecked(!checked);
  };

  // [START custom-field-react.instruction-ui]
  return (
    <BlockStack>
      <Checkbox checked={checked} onChange={handleChange}>
        Provide delivery instructions
      </Checkbox>
      {checked && (
        <TextField
          label="Delivery instructions"
          multiline={3}
          // [START custom-field-react.store-value]
          onChange={(value) => {
            applyMetafieldsChange({
              type: "updateMetafield",
              namespace: metafieldNamespace,
              key: metafieldKey,
              valueType: "string",
              value,
            });
          }}
          // [END custom-field-react.store-value]
          value={deliveryInstructions?.value}
        />
      )}
    </BlockStack>
  );
  // [END custom-field-react.instruction-ui]
}