// One-time script to populate MongoDB with starter products.
// Run with: npm run seed   (from the /server folder)
// Safe to re-run: it clears the products collection first, so you won't get duplicates.

import 'dotenv/config';
import { connectDB } from './db.js';
import Product from './models/Product.js';
import mongoose from 'mongoose';

const STARTER_PRODUCTS = [
  {
    slug: 'tsm-stirrups',
    sku: 'TSM-001',
    icon: '⬡',
    image: '/images/products/tmt-bar-10mm.png',
    category: 'Stirrups',
    grade: 'Fe 500',
    title: 'TSM Steel Stirrups',
    desc: 'Precisely bent stirrups manufactured using high-tensile steel with accurate 135° hooks for maximum structural integrity.',
    tags: ['Precise 135° Hooks', 'High Tensile', 'IS 2502'],
    price: 8500,
    unit: 'per quintal (100 kg)',
    badge: 'Best Seller',
    stock: 240,
    active: true,
  },
  {
    slug: 'square-stirrups',
    sku: 'TSM-002',
    icon: '◻',
    image: '/images/products/wire-mesh.png',
    category: 'Stirrups',
    grade: 'Fe 500',
    title: 'Square / Ring Stirrups',
    desc: 'Uniform square-profile stirrups with exact dimensions and rust-resistant treatment for columns, beams, and frameworks.',
    tags: ['Exact Dims', 'Rust Resistant', 'Bulk Ready'],
    price: 7900,
    unit: 'per quintal (100 kg)',
    badge: null,
    stock: 180,
    active: true,
  },
  {
    slug: 'custom-stirrups',
    sku: 'TSM-003',
    icon: '⬭',
    image: '/images/products/structural-steel.png',
    category: 'Stirrups',
    grade: 'Fe 500D',
    title: 'Custom Bent Stirrups',
    desc: 'Bespoke solutions engineered from your structural drawings. CNC bending ensures every piece meets exact specifications.',
    tags: ['CNC Bending', 'Drawing-Based', 'Any Shape'],
    price: 9800,
    unit: 'per quintal (100 kg)',
    badge: 'Premium',
    stock: 95,
    active: true,
  },
  {
    slug: 'bulk-steel',
    sku: 'TSM-004',
    icon: '≡',
    image: '/images/products/gi-pipes.png',
    category: 'Structural Steel',
    grade: 'Fe 500',
    title: 'Bulk Steel Supply',
    desc: 'Large-scale reinforcement supply for industrial, commercial, and infrastructure projects with reliable logistics.',
    tags: ['Pan-India', 'All IS Grades', 'Timely Dispatch'],
    price: 7200,
    unit: 'per quintal (100 kg)',
    badge: 'Bulk Deal',
    stock: 420,
    active: true,
  },
];

async function seed() {
  await connectDB();

  console.log('🗑️  Clearing existing products...');
  await Product.deleteMany({});

  console.log('🌱 Inserting starter products...');
  await Product.insertMany(STARTER_PRODUCTS);

  console.log(`✅ Seeded ${STARTER_PRODUCTS.length} products`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
