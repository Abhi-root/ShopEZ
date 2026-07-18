import express from 'express';
import {
  fetchProducts,
  fetchProductDetails,
  addNewProduct,
  updateProduct,
  deleteCategory,
  fetchCategories,
} from '../controllers/productController.js';

import { protect } from '../middleware/authMiddleware.js'; 
import { buyProduct } from '../controllers/productController.js';

const router = express.Router();


router.get('/fetch-products', fetchProducts);
router.get('/fetch-product-details/:id', fetchProductDetails);
router.get('/fetch-categories', fetchCategories);


router.post('/add-new-product', protect, addNewProduct);
router.put('/update-product/:id', protect, updateProduct);

router.delete('/delete-category/:name', protect, deleteCategory);

export default router;
