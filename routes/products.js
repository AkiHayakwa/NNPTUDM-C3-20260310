var express = require('express');
var router = express.Router();
let productModel = require('../schemas/products')

/* GET users listing. */
router.get('/', async function (req, res, next) {
  let result = await productModel.find({})
  res.send(result);
});
/* GET a specific product by ID */
router.get('/:id', async function (req, res, next) {
  try {
    let result = await productModel.findById(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/* POST create a new product */
router.post('/', async function (req, res, next) {
  try {
    const newProduct = new productModel(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/* PUT update an existing product by ID */
router.put('/:id', async function (req, res, next) {
  try {
    const updatedProduct = await productModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/* DELETE a product by ID (Hard delete in this case or you can implement soft delete using isDeleted) */
router.delete('/:id', async function (req, res, next) {
  try {
    // Soft delete variant: 
    // const deletedProduct = await productModel.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });

    // Hard delete variant:
    const deletedProduct = await productModel.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully", product: deletedProduct });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
