import {
  extend,
  Text,
  InlineLayout,
  BlockStack,
  Divider,
  Image,
  Banner,
  Heading,
  Button,
  SkeletonImage,
  SkeletonText,
} from "@shopify/checkout-ui-extensions";
// [START product_offer-pre_purchase-js.step_4]
extend(
  "Checkout::Dynamic::Render",
  (root, { lines, applyCartLinesChange, query, i18n }) => {
// [END product_offer-pre_purchase-js.step_4]
    let products = [];
    let loading = true;
    let appRendered = false;

// [START product_offer-pre_purchase-js.step_5_1]
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
        products = data.products.nodes;
      })
      .catch((err) => console.error(err))
      .finally(() => {
        loading = false;
        renderApp();
      });
// [END product_offer-pre_purchase-js.step_5_1]

    lines.subscribe(() => renderApp());

// [START product_offer-pre_purchase-js.step_6_3]
    const loadingState = root.createComponent(
      BlockStack,
      { spacing: "loose" },
      [
        root.createComponent(Divider),
        root.createComponent(Heading, { level: 2 }, ["You might also like"]),
        root.createComponent(BlockStack, { spacing: "loose" }, [
          root.createComponent(
            InlineLayout,
            {
              spacing: "base",
              columns: [64, "fill", "auto"],
              blockAlignment: "center",
            },
            [
              root.createComponent(SkeletonImage, { aspectRatio: 1 }),
              root.createComponent(BlockStack, { spacing: "none" }, [
                root.createComponent(SkeletonText, { inlineSize: "large" }),
                root.createComponent(SkeletonText, { inlineSize: "small" }),
              ]),
              root.createComponent(
                Button,
                { kind: "secondary", disabled: true },
                [root.createText("Add")]
              ),
            ]
          ),
        ]),
      ]
    );

    if (loading) {
      root.appendChild(loadingState);
    }
// [END product_offer-pre_purchase-js.step_6_3]

// [START product_offer-pre_purchase-js.step_6_1]
    const imageComponent = root.createComponent(Image, {
      border: "base",
      borderWidth: "base",
      borderRadius: "loose",
      aspectRatio: 1,
      source: "",
    });
    const titleMarkup = root.createText("");
    const priceMarkup = root.createText("");
    const merchandise = { id: "" };''
// [END product_offer-pre_purchase-js.step_6_1]

    const addButtonComponent = root.createComponent(
      Button,
      {
        kind: "secondary",
        loading: false,
// [START product_offer-pre_purchase-js.step_6_2]
        onPress: async () => {
          addButtonComponent.updateProps({ loading: true });

          const result = await applyCartLinesChange({
            type: "addCartLine",
            merchandiseId: merchandise.id,
            quantity: 1,
          });

          addButtonComponent.updateProps({ loading: false });
// [END product_offer-pre_purchase-js.step_6_2]

// [START product_offer-pre_purchase-js.step_6_4]
          if (result.type === "error") {
            console.error(result.message);
            const errorComponent = root.createComponent(
              Banner,
              { status: "critical" },
              ["There was an issue adding this product. Please try again."]
            );
            const topLevelComponent = root.children[0];
            topLevelComponent.appendChild(errorComponent);
            setTimeout(
              () => topLevelComponent.removeChild(errorComponent),
              3000
            );
          }
// [END product_offer-pre_purchase-js.step_6_4]
        },
      },
      ["Add"]
    );

// [START product_offer-pre_purchase-js.step_6_1]
    const app = root.createComponent(BlockStack, { spacing: "loose" }, [
      root.createComponent(Divider),
      root.createComponent(Heading, { level: 2 }, "You might also like"),
      root.createComponent(BlockStack, { spacing: "loose" }, [
        root.createComponent(
          InlineLayout,
          {
            spacing: "base",
            columns: [64, "fill", "auto"],
            blockAlignment: "center",
          },
          [
            imageComponent,
            root.createComponent(BlockStack, { spacing: "none" }, [
              root.createComponent(
                Text,
                { size: "medium", emphasis: "strong" },
                [titleMarkup]
              ),
              root.createComponent(Text, { appearance: "subdued" }, [
                priceMarkup,
              ]),
            ]),
            addButtonComponent,
          ]
        ),
      ]),
    ]);

    function renderApp() {
      if (loading) {
        return;
      }

      if (!loading && products.length === 0) {
        root.removeChild(loadingState);
        return;
      }
// [END product_offer-pre_purchase-js.step_6_1]

// [START product_offer-pre_purchase-js.step_5_2]
      const cartLineProductVariantIds = lines.current.map((item) => item.merchandise.id);
      const productsOnOffer = products.filter(
        (product) => {
          const isProductVariantInCart = product.variants.nodes.some(
            ({id}) => cartLineProductVariantIds.includes(id)
          );
          return !isProductVariantInCart;
        }
      );
// [END product_offer-pre_purchase-js.step_5_2]

      if (!loading && productsOnOffer.length === 0) {
        if (loadingState.parent) root.removeChild(loadingState);
        return;
      }

// [START product_offer-pre_purchase-js.step_6_1]
      const { images, title, variants } = productsOnOffer[0];

      const renderPrice = i18n.formatCurrency(variants.nodes[0].price.amount);

      const imageUrl = images.nodes[0]?.url
        ?? "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_medium.png?format=webp&v=1530129081";

      imageComponent.updateProps({ source: imageUrl });
      titleMarkup.updateText(title);
      addButtonComponent.updateProps({
        accessibilityLabel: `Add ${title} to cart`,
      });
      priceMarkup.updateText(renderPrice);
      merchandise.id = variants.nodes[0].id;
// [END product_offer-pre_purchase-js.step_6_1]

      if (!appRendered) {
        root.removeChild(loadingState);
        root.appendChild(app);
        appRendered = true;
      }
    }
  }
);