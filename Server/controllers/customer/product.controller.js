import ProductModel from "../../models/product.model.js";
import ProductImageModel from "../../models/productImage.model.js";

export const getRecommendedProducts = async function (req, res) {
  try {
    const products = await ProductModel.find({
      $and: [
        { deletedAt: { $exists: false }, },
        
      ]
    }).limit(16);

    var images = {};
    for (let i in products) {
      const pid = products[i]._id.toString();
      const productImages = await ProductImageModel.find({
        productId: products[i]._id
      })

      images = {
        ...images,
        [pid]: productImages
      }
    };

    return res.status(200).json({
      products,
      images
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
export const get = async function (req, res) {
  const id = req.params.id;

  try {
    const product = await ProductModel.findOne({
      _id: id,
    });
    const productImages = await ProductImageModel.find({
      productId: product._id
    })
    return res.status(200).json({
      product,
      images: productImages
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
export const search = async function (req, res) {
  const keyword = req.query.keyword;
  if(keyword){
    try {
      var find_product_by_name = await ProductModel.find({
        name: { "$regex": keyword, "$options": "i" },
      });
      if (find_product_by_name) {
        find_product_by_name.map(async (product) => {
          const image = await ProductImageModel.findOne({
            productId: product._id
          });
          return {
            ...product,
            image
          };
        });
      }
      else {
        return res.status(204).json({
          products: [],
        });
      }
      return res.status(200).json({
        products: find_product_by_name,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: error.message,
      });
    }
  } else {
    return res.status(204).json({
      products: [],
    });
  }
}