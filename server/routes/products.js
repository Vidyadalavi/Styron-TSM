import express from 'express';
import Product from '../models/Product.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// ----------------------------------------------------
// GET /api/products
// Public. Anyone visiting the site can list products.
// Only returns active products unless ?all=true is passed
// (the admin panel uses ?all=true to also see disabled ones).
// ----------------------------------------------------
router.get('/', async (req, res) => {
  try {
    const filter = req.query.all === 'true' ? {} : { active: true };
    const products = await Product.find(filter).sort({ createdAt: 1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// ----------------------------------------------------
// GET /api/products/:slug
// Public. Fetch one product by its slug, e.g. "tsm-stirrups"
// ----------------------------------------------------
router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// ----------------------------------------------------
// POST /api/products
// Admin only. Create a new product.
// ----------------------------------------------------
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'A product with that slug or SKU already exists' });
    }
    console.error(err);
    res.status(400).json({ error: 'Failed to create product', details: err.message });
  }
});

// ----------------------------------------------------
// PUT /api/products/:slug
// Admin only. Update an existing product (price, stock, etc.)
// ----------------------------------------------------
router.put('/:slug', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to update product', details: err.message });
  }
});

// ----------------------------------------------------
// DELETE /api/products/:slug
// Admin only.
// ----------------------------------------------------
router.delete('/:slug', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ slug: req.params.slug });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
