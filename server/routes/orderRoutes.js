import express from 'express';
import {
  fetchOrders,
  buyProduct,
  cancelOrder,
  updateOrderStatus,
  placeCartOrder
} from '../controllers/orderController.js';

import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();


router.get('/fetch-orders', protect, fetchOrders);


router.post('/buy-product', protect, buyProduct);
router.put('/cancel-order', protect, cancelOrder);
router.post('/place-cart-order', protect, placeCartOrder);


router.put('/update-order-status', protect,  updateOrderStatus);

export default router;
