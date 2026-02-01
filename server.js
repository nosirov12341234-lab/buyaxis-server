const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (boshlang'ich)
let database = {
  categories: [
    { id: 'women', name: 'Ayollar Kiyimi', icon: 'fas fa-female' },
    { id: 'men', name: 'Erkaklar Kiyimlari', icon: 'fas fa-male' },
    { id: 'sports', name: 'Sport', icon: 'fas fa-futbol' },
    { id: 'cosmetics', name: 'Kosmetika', icon: 'fas fa-spa' },
    { id: 'electronics', name: 'Elektronika', icon: 'fas fa-laptop' },
    { id: 'gifts', name: "Sovg'alar", icon: 'fas fa-gift' }
  ],
  products: [
    {
      id: 'prod1',
      name: 'Ayollar Jeans Kiyim',
      description: 'Zamonaviy dizayn, yuqori sifat',
      price: 189000,
      category_id: 'women',
      image_url: '',
      discount: 0,
      is_featured: true,
      is_new: true
    },
    {
      id: 'prod2',
      name: 'Erkaklar Sport Kiyim',
      description: 'Sport uchun qulay kiyim',
      price: 145000,
      category_id: 'sports',
      image_url: '',
      discount: 10,
      is_featured: true,
      is_new: false
    },
    {
      id: 'prod3',
      name: 'Parfyum Kollektsiyasi',
      description: 'Original xitoy parfyumlari',
      price: 285000,
      category_id: 'cosmetics',
      image_url: '',
      discount: 15,
      is_featured: false,
      is_new: true
    }
  ],
  orders: [],
  admin: {
    username: 'admin',
    password: 'admin123'
  }
};

// API Routes
app.get('/', (req, res) => {
  res.json({ message: 'BuyAxis Server is running!' });
});

// Categories
app.get('/api/categories', (req, res) => {
  res.json(database.categories);
});

app.post('/api/categories', (req, res) => {
  const newCategory = {
    id: 'cat_' + Date.now(),
    ...req.body
  };
  database.categories.push(newCategory);
  res.json({ success: true, category: newCategory });
});

// Products
app.get('/api/products', (req, res) => {
  res.json(database.products);
});

app.get('/api/products/:id', (req, res) => {
  const product = database.products.find(p => p.id === req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.post('/api/products', (req, res) => {
  const newProduct = {
    id: 'prod_' + Date.now(),
    created_at: new Date().toISOString(),
    ...req.body
  };
  database.products.push(newProduct);
  res.json({ success: true, product: newProduct });
});

app.put('/api/products/:id', (req, res) => {
  const index = database.products.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    database.products[index] = { ...database.products[index], ...req.body };
    res.json({ success: true, product: database.products[index] });
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.delete('/api/products/:id', (req, res) => {
  database.products = database.products.filter(p => p.id !== req.params.id);
  res.json({ success: true });
});

// Orders
app.get('/api/orders', (req, res) => {
  res.json(database.orders);
});

app.get('/api/orders/:code', (req, res) => {
  const order = database.orders.find(o => o.order_code === req.params.code);
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

app.post('/api/orders', (req, res) => {
  const newOrder = {
    id: 'ord_' + Date.now(),
    created_at: new Date().toISOString(),
    ...req.body
  };
  database.orders.push(newOrder);
  res.json({ success: true, order: newOrder });
});

app.put('/api/orders/:code', (req, res) => {
  const index = database.orders.findIndex(o => o.order_code === req.params.code);
  if (index !== -1) {
    database.orders[index] = { ...database.orders[index], ...req.body };
    res.json({ success: true, order: database.orders[index] });
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === database.admin.username && password === database.admin.password) {
    res.json({ success: true, token: 'admin_token_' + Date.now() });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Dashboard stats
app.get('/api/stats', (req, res) => {
  const stats = {
    total_orders: database.orders.length,
    total_products: database.products.length,
    total_revenue: database.orders.reduce((sum, order) => sum + (order.total_amount || 0), 0),
    pending_orders: database.orders.filter(o => o.status === 'pending').length
  };
  res.json(stats);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});