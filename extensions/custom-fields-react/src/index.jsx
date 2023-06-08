import React, { useState } from "react";
import {
  render,
  TextField,
  BlockStack,
  useApplyMetafieldsChange,
  useMetafield,
  Checkbox,
} from "@shopify/checkout-ui-extensions-react";

// [START custom-fields-react.ext-index]
render("Checkout::ShippingMethods::RenderAfter", () => <App />);
// [END custom-fields-react.ext-index]

function App() {
  // Set up the checkbox state
  const [checked, setChecked] = useState(false);

  // [START custom-fields-react.define-metafield]
  const metafieldNamespace = "yourAppNamespace";
  const metafieldKey = "deliveryInstructions";
  // [END custom-fields-react.define-metafield]

  // [START custom-fields-react.use-metafield]
  const deliveryInstructions = useMetafield({
    namespace: metafieldNamespace,
    key: metafieldKey,
  });
  // [END custom-fields-react.use-metafield]

  // [START custom-fields-react.update-metafield]
  const applyMetafieldsChange = useApplyMetafieldsChange();
  // [END custom-fields-react.update-metafield]

  // Set a function to handle the Checkbox component's onChange event
  const handleChange = () => {
    setChecked(!checked);
  };

  // Render the extension components
  return (
    <BlockStack>
      <Checkbox checked={checked} onChange={handleChange}>
        Provide delivery instructions
      </Checkbox>
      {checked && (
        <TextField
          label="Delivery instructions"
          multiline={3}
          onChange={(value) => {
            // Apply the change to the metafield
            applyMetafieldsChange({
              type: "updateMetafield",
              namespace: metafieldNamespace,
              key: metafieldKey,
              valueType: "string",
              value,
            });
          }}
          value={deliveryInstructions?.value}
        />
      )}
    </BlockStack>
  );
}