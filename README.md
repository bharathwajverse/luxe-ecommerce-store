# 🛍️ FlipShop — Modern E-Commerce React App

A fully-featured single-page e-commerce application built with React 18, React Router v6, Context API, and Vite.

## 🌐 Live Demo

This project is deployed on Vercel:

https://flipshop-tawny.vercel.app/

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── main.jsx
├── App.jsx
├── styles/index.css
├── constants/
│   ├── products.js
│   └── theme.js
├── services/
│   └── api.js
├── utils/
│   └── validators.js
├── contexts/
│   ├── AuthContext.jsx
│   ├── CartContext.jsx
│   ├── ThemeContext.jsx
│   ├── ToastContext.jsx
│   └── WishlistContext.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useCart.js
│   └── useProducts.js
├── layouts/
│   ├── Footer.jsx
│   ├── MainLayout.jsx
│   └── Navbar.jsx
├── components/
│   ├── cart/OrderSummary.jsx
│   ├── product/ProductCard.jsx
│   ├── product/QtyControl.jsx
│   └── ui/
│       ├── Badge.jsx
│       ├── FormField.jsx
│       ├── Spinner.jsx
│       └── Stars.jsx
├── pages/
│   ├── auth/
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   ├── cart/
│   │   ├── CartPage.jsx
│   │   └── CheckoutPage.jsx
│   ├── product/ProductDetailPage.jsx
│   ├── shop/
│   │   ├── CategoryPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── OffersPage.jsx
│   │   └── SearchPage.jsx
│   └── user/
│       ├── OrdersPage.jsx
│       ├── OrderSuccessPage.jsx
│       └── WishlistPage.jsx
└── routes/
    ├── AppRoutes.jsx
    └── ProtectedRoute.jsx
```

## 🧩 Key Features

- Product listing, category filters, search, and offers page
- Product details with quantity selection
- Shopping cart management with localStorage persistence
- Wishlist and order flow
- User authentication using context and localStorage
- Protected routes for checkout and user pages
- Responsive UI with reusable components

## 📦 Tech Stack

- React 18
- React Router v6
- Vite
- Axios
- Framer Motion

## 📌 GitHub Ready Files

This repository includes the key files needed for GitHub:

- `README.md` — Project overview and setup instructions
- `.gitignore` — Ignore Node modules, build output, and local env files
- `package.json` — Project metadata and scripts
- `.eslintrc.cjs` — Linting rules for React and JSX
- `vite.config.js` — Vite build configuration
- `LICENSE` — Project license
- `CONTRIBUTING.md` — Contribution guidelines
- `CODE_OF_CONDUCT.md` — Community behavior guide
- `SECURITY.md` — Security policy and disclosure notes
- `CHANGELOG.md` — Release history and updates
- `.github/` — issue and pull request templates
- `src/` — Application source code
- `public/` — Static assets and HTML template

## ✅ Notes

- Use the Vercel deployment link above when sharing this demo.
- `npm run dev` launches the local development server.
- `npm run build` creates the production bundle.
