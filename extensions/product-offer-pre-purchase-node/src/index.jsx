import { React, useEffect, useState } from 'react';
import {
  useExtensionApi,
  render,
  Banner,
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
} from '@shopify/checkout-ui-extensions-react';

// [START product_offer-pre_purchase-react.sec_2-step_1]
render('Checkout::Dynamic::Render', () => <App />);
// [END product_offer-pre_purchase-react.sec_2-step_1]

function App() {
  const { query, i18n } = useExtensionApi();
  const applyCartLinesChange = useApplyCartLinesChange();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [showError, setShowError] = useState(false);
  // [START product_offer-pre_purchase-react.sec_2-step_2_2]
  const lines = useCartLines();
  // [END product_offer-pre_purchase-react.sec_2-step_2_2]
  // [START product_offer-pre_purchase-react.sec_2-step_2_1]
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
        variables: { first: 5 },
      }
    )
      .then(({ data }) => {
        setProducts(data.products.nodes);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);
  // [END product_offer-pre_purchase-react.sec_2-step_2_1]
  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => setShowError(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showError]);
  /* [START product_offer-pre_purchase-react.sec_2-step_3_2] */
  async function handleAddToCart(variantId) {
    setAdding(true);
    const result = await applyCartLinesChange({
      type: 'addCartLine',
      merchandiseId: variantId,
      quantity: 1,
    });
    setAdding(false);
    if (result.type === 'error') {
      setShowError(true);
      console.error(result.message);
    }
  }
  /* [END product_offer-pre_purchase-react.sec_2-step_3_2] */

  // [START product_offer-pre_purchase-react.sec_2-step_3_3]
  if (loading) {
    return (
      <BlockStack spacing='loose'>
        <Divider />
        <Heading level={2}>You might also like</Heading>
        <BlockStack spacing='loose'>
          <InlineLayout
            spacing='base'
            columns={[64, 'fill', 'auto']}
            blockAlignment='center'
          >
            <SkeletonImage aspectRatio={1} />
            <BlockStack spacing='none'>
              <SkeletonText inlineSize='large' />
              <SkeletonText inlineSize='small' />
            </BlockStack>
            <Button kind='secondary' disabled={true}>
              Add
            </Button>
          </InlineLayout>
        </BlockStack>
      </BlockStack>
    );
  }
  // [END product_offer-pre_purchase-react.sec_2-step_3_3]
  // [START product_offer-pre_purchase-react.sec_2-step_2_3]
  if (!loading && products.length === 0) {
    return null;
  }
  // [END product_offer-pre_purchase-react.sec_2-step_2_3]
  // [START product_offer-pre_purchase-react.sec_2-step_2_3]
  const cartLineProductVariantIds = lines.map((item) => item.merchandise.id);
  const productsOnOffer = products.filter((product) => {
    const isProductVariantInCart = product.variants.nodes.some(({ id }) =>
      cartLineProductVariantIds.includes(id)
    );
    return !isProductVariantInCart;
  });

  if (!productsOnOffer.length) {
    return null;
  }
  // [END product_offer-pre_purchase-react.sec_2-step_2_3]
  const { images, title, variants } = productsOnOffer[0];
  const renderPrice = i18n.formatCurrency(variants.nodes[0].price.amount);
  const imageUrl =
    images.nodes[0]?.url ??
    'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_medium.png?format=webp&v=1530129081';
  // [START product_offer-pre_purchase-react.sec_2-step_3_1]
  return (
    <BlockStack spacing='loose'>
      <Divider />
      <Heading level={2}>You might also like</Heading>
      <BlockStack spacing='loose'>
        <InlineLayout
          spacing='base'
          columns={[64, 'fill', 'auto']}
          blockAlignment='center'
        >
          <Image
            border='base'
            borderWidth='base'
            borderRadius='loose'
            source={imageUrl}
            description={title}
            aspectRatio={1}
          />
          <BlockStack spacing='none'>
            <Text size='medium' emphasis='strong'>
              {title}
            </Text>
            <Text appearance='subdued'>{renderPrice}</Text>
          </BlockStack>
          {/* [END product_offer-pre_purchase-react.sec_2-step_3_1] */}
          <Button
            kind='secondary'
            loading={adding}
            accessibilityLabel={`Add ${title} to cart`}
            onPress={() => handleAddToCart(variants.nodes[0].id)}
          >
            Add
          </Button>
        </InlineLayout>
      </BlockStack>

      {/* [START product_offer-pre_purchase-react.sec_2-step_3_4] */}
      {showError && (
        <Banner status='critical'>
          There was an issue adding this product. Please try again.
        </Banner>
      )}
      {/* [END product_offer-pre_purchase-react.sec_2-step_3_4] */}
    </BlockStack>
  );
}
