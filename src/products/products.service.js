const knex = require("../db/connection");

// Store the base query `knex("products")` in a variable
const products = knex("products");

const getAllProducts = () => products.select("*");

//const getProductById = productId =>
products.select("*").where({ product_id: productId }).first();

const getOutOfStockCount = () =>
  products
    .select("product_quantity_in_stock as out_of_stock")
    .count("product_id")
    .where({ product_quantity_in_stock: 0 })
    .groupBy("out_of_stock");

const getPriceSummary = () =>
  products
    .select("supplier_id")
    .min("product_price")
    .max("product_price")
    .avg("product_price")
    .groupBy("supplier_id");

const getTotalWeightOfEachProduct = () =>
  products
    .select(
      "product_sku",
      "product_title",
      knex.raw(
        "sum(product_weight_in_lbs * product_quantity_in_stock) as total_weight_in_lbs"
      )
    )
    .groupBy("product_title", "product_sku");

const productsCategoriesJoin = knex("products as p")
  .join("products_categories as pc", "p.product_id", "pc.product_id")
  .join("categories as c", "pc.category_id", "c.category_id");

// const getProductById = productId =>
//   productsCategoriesJoin
//     .select("p.*", "c.*")
//     .where({ "p.product_id": productId })
//     .first();
function getProductById(productId){
  productsCategoriesJoin
    .select(
      "p.product_id as id",
      "p.product_sku as sku",
      "p.product_title as title",
      "p.product_description as description",
      "p.product_price as price",
      "p.product_quantity_in_stock as quantity_in_stock",
      "p.product_weight_in_lbs as weight_in_lbs",
      "p.supplier_id as supplier:id",
      "p.created_at",
      "p.updated_at",
      "c.category_id as category:id",
      "c.category_name as category:name",
      "c.category_description as category:description"
    )
    .where({ "p.product_id": productId })
    .first();
    }

module.exports = {
  getAllProducts,
  getProductById,
  getOutOfStockCount,
  getPriceSummary,
  getTotalWeightOfEachProduct,
};