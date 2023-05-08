import {
  React,
  // [START product_offer_pre_purchase_node.step_2]
  useEffect,
  useState,
  // [END product_offer_pre_purchase_node.step_2]
} from "react";
import {
  useExtensionApi,
  render,
  Banner,
  // [START product_offer_pre_purchase_node.step_2]
  Divider,
  Image,
  Heading,
  Button,
  InlineLayout,
  BlockStack,
  Text,
  SkeletonText,
  SkeletonImage,
  useCartLines,
  useApplyCartLinesChange,
  // [END product_offer_pre_purchase_node.step_2]
} from "@shopify/checkout-ui-extensions-react";

// [START product_offer_pre_purchase_node.step_3]
render("Checkout::Dynamic::Render", () => <App />);
// [END product_offer_pre_purchase_node.step_3]

function App() {
  const { query, i18n } = useExtensionApi();
  const applyCartLinesChange = useApplyCartLinesChange();

  // [START product_offer_pre_purchase_node.step_4]
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  // [END product_offer_pre_purchase_node.step_4]

  const [adding, setAdding] = useState(false);

  // [START product_offer_pre_purchase_node.step_7]
  const [showError, setShowError] = useState(false);
  // [START product_offer_pre_purchase_node.step_7]

  // [START product_offer_pre_purchase_node.step_4]
  useEffect(() => {
    setLoading(true);
    query(
      `query ($first: Int!) {
        products(first: $first) {
          nodes {
            id
            title
            images(first:1){
              nodes {
                url
              }
            }
            variants(first: 1) {
              nodes {
                id
                price {
                  amount
                }
              }
            }
          }
        }
      }`,
      {
        variables: {first: 5},
      },
    )
    .then(({data}) => {
      setProducts(data.products.nodes);
    })
    .catch((error) => console.error(error))
    .finally(() => setLoading(false));
  }, []);
  // [END product_offer_pre_purchase_node.step_4]

  // [START product_offer_pre_purchase_node.step_7]
  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => setShowError(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showError]);
  // [END product_offer_pre_purchase_node.step_7]

  // [START product_offer_pre_purchase_node.step_6]
  const lines = useCartLines();
  // [START product_offer_pre_purchase_node.step_6]

  // [START product_offer_pre_purchase_node.step_5]
  if (loading) {
    return (
      <BlockStack spacing="loose">
        <Divider />
        <Heading level={2}>You might also like</Heading>
        <BlockStack spacing="loose">
          <InlineLayout
            spacing="base"
            columns={[64, "fill", "auto"]}
            blockAlignment="center"
          >
            <SkeletonImage aspectRatio={1} />
            <BlockStack spacing="none">
              <SkeletonText inlineSize="large" />
              <SkeletonText inlineSize="small" />
            </BlockStack>
            <Button kind="secondary" disabled={true}>
              Add
            </Button>
          </InlineLayout>
        </BlockStack>
      </BlockStack>
    );
  }
  // [END product_offer_pre_purchase_node.step_5]

  // [START product_offer_pre_purchase_node.step_6]
  if (!loading && products.length === 0) {
    return null;
  }
  // [START product_offer_pre_purchase_node.step_6]

  // [START product_offer_pre_purchase_node.step_6]
  const cartLineProductVariantIds = lines.map((item) => item.merchandise.id);
  const productsOnOffer = products.filter(
    (product) => {
      const isProductVariantInCart = product.variants.nodes.some(
        ({id}) => cartLineProductVariantIds.includes(id)
      );
      return !isProductVariantInCart;
    }
  );

  if (!productsOnOffer.length) {
    return null;
  }

  const { images, title, variants } = productsOnOffer[0];

  const renderPrice = i18n.formatCurrency(variants.nodes[0].price.amount);

  const imageUrl = images.nodes[0]?.url
    ?? "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_medium.png?format=webp&v=1530129081";

  // [END product_offer_pre_purchase_node.step_6]

  // [START product_offer_pre_purchase_node.step_7]
  return (
  // [END product_offer_pre_purchase_node.step_7]

    // [START product_offer_pre_purchase_node.step_8]
    <BlockStack spacing="loose">
      <Divider />
      <Heading level={2}>You might also like</Heading>
      <BlockStack spacing="loose">
        <InlineLayout
          spacing="base"
          columns={[64, "fill", "auto"]}
          blockAlignment="center"
        >
          <Image
            border="base"
            borderWidth="base"
            borderRadius="loose"
            source={imageUrl}
            description={title}
            aspectRatio={1}
          />
          <BlockStack spacing="none">
            <Text size="medium" emphasis="strong">
              {title}
            </Text>
            <Text appearance="subdued">{renderPrice}</Text>
          </BlockStack>
          <Button
            kind="secondary"
            loading={adding}
            accessibilityLabel={`Add ${title} to cart`}
            onPress={async () => {
              setAdding(true);
              const result = await applyCartLinesChange({
                type: "addCartLine",
                merchandiseId: variants.nodes[0].id,
                quantity: 1,
              });
              setAdding(false);
              if (result.type === "error") {
                setShowError(true);
                console.error(result.message);
              }
            }}
          >
            Add
          </Button>
        </InlineLayout>
      </BlockStack>
      // [END product_offer_pre_purchase_node.step_8]

      // [START product_offer_pre_purchase_node.step_7]
      {showError && (
        <Banner status="critical">
          There was an issue adding this product. Please try again.
        </Banner>
      )}
      // [END product_offer_pre_purchase_node.step_7]
      // [START product_offer_pre_purchase_node.step_8]
      </BlockStack>
      // [END product_offer_pre_purchase_node.step_8]

  // [START product_offer_pre_purchase_node.step_7]
  );
  // [END product_offer_pre_purchase_node.step_7]
}