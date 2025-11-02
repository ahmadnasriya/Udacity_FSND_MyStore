# My Store

My Store is a full-stack e-commerce application built with Angular.  
It allows users to browse products, view details, add/remove items to/from a shopping cart, and complete a checkout process with validation and order confirmation.  

The application demonstrates modern Angular practices (signals, bindings, services, `@ViewChild`) while still fulfilling all rubric requirements such as data fetching, routing, cart management, parent–child communication, form handling, and user feedback.

---

## Features

### 🏠 Home Page
- Fetches product data from the backend API and refreshes every few seconds to reflect new/removed products.
- Detects lost connection and shows a **“No Internet Connection”** state until the connection is restored.
- Add products to the cart directly from the home page, with:
  - Maximum allowed quantity per product.  
  - Contextual feedback messages (added, limit reached, etc.).  
- Header cart icon updates immediately with the new item count.
- Clicking on a product opens its **details page**.

### 📦 Product Details
- Displays product image, title, price, and description.
- Users can add the product directly to the cart.

### 🛒 Shopping Cart
- Works for both guests and logged-in users:
  - Guests’ carts are stored in **localStorage**.  
  - On login, guest carts sync with the server.  
- Users can update quantities, remove items, and see subtotal updates in real time.
- Checkout button adapts:
  - Guests see **“Login & Checkout”** → redirects to login, then back to checkout.  
  - Logged-in users go directly to checkout.  
- VAT and shipping are shown as “to be calculated at checkout.”

### 🔐 Authentication
- Hybrid login/signup flow:
  - User enters email first.  
  - Backend decides if login or signup form is needed.  
  - Signup requires first/last name + strong password.  
- After authentication, users are redirected:
  - Back to the page they came from (e.g., checkout).  
  - Or to the home page if no redirect was requested.

### 💳 Checkout
- Restricted access: only logged-in users with a non-empty cart can enter.  
- Collects billing details (address, city, country, phone).  
- Card form:
  - Stripe test card guidance.  
  - Auto-formatted `mm/yy` expiration date field.  
- Country selection dynamically updates:
  - VAT rate in summary.  
  - Shipping options (free/paid, with estimated delivery times).  
- Order submission takes user to **success page**.

### ✅ Order Success Page
- Displays confirmation message:
  `Thank you for your purchase. Your order will be shipped to <address>, <city> in <duration>.`
- Protected route: only accessible after placing an order with a valid token.

---

## Access Control
- **Checkout page**: only accessible if logged in + cart is not empty.  
- **Success page**: only accessible right after a successful order.

---

## Prerequisites
Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v22+ recommended)
- [npm](https://www.npmjs.com/)
- [Bun](https://bun.sh/) (for running internal scripts)
- [Docker](https://www.docker.com/) (for the database container)

---

## Getting Started

### 1. Clone the repository (Optional)
If you're not using a local copy, you can clone the repository from GitHub:
```bash
git clone https://github.com/ahmadnasriya/Udacity_FSND_MyStore.git
cd Udacity_FSND_MyStore
```

### 2. Install Bun
```bash
npm install -g bun
```
This is used to run internal scripts.

### 3. Initialize the project & install dependencies
```bash
npm run init
```

### 4. Configure the project (optional)
Edit the `configs.ts` file with your desired configurations (database, ports, credentials, etc.).

### 5. Generate environment variables
This step is necessary after initialization or configuration changes.
```bash
npm run build:env
```
This will generate the `.env` files based on your configurations.

### 6. Build the database container (Optional)
```bash
npm run build:container
```
This will pull the required Docker image and create a container using the configurations from [step 4](#4-configure-the-project-optional).


---

## Running the Application
Start the server with:
```bash
npm start
```

---

## Rubric Notes
- **Forms & Validation**: Modern Angular bindings and `@ViewChild` replace older `ngModel`. Inputs still validate correctly (e.g., min length, required).
- **Component Communication**: Cart and other state are handled via shared services/signals instead of `EventEmitter`.
- **Data Fetching**: Products loaded via Angular `HttpClient`.
- **Routing**: Configured with `AppRoutingModule`, `<router-outlet>`, and `routerLink`>.
- **Models**: Strongly typed `BEProduct`, `ProductItem`, `CartItem`, and `CartBackendItem` models are used consistently to match the backend.
- **Services**: Dedicated `CartService` manages cart data and syncs across components.
