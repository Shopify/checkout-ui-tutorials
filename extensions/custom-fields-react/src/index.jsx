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

  // Define the metafield namespace and key
  const metafieldNamespace = "yourAppNamespace";
  const metafieldKey = "deliveryInstructions";

  // Get a reference to the metafield
  const deliveryInstructions = useMetafield({
    namespace: metafieldNamespace,
    key: metafieldKey,
  });

  // Set a function to handle updating a metafield
  const applyMetafieldsChange = useApplyMetafieldsChange();

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