# GroceryXpert

A web-based grocery management system that helps track products and generate budget reports.

## Features

- **Product Management**
  - Add new products with details (name, description, price, image)
  - Edit existing product information
  - Delete products
  - View product images in modal

- **Cart System**
  - Add products to cart
  - Adjust quantities
  - Edit listed prices
  - Remove items from cart
  - Select/deselect items for purchase

- **Budget Management**
  - Real-time price calculations
  - Automatic grand total updates
  - Generate PDF budget reports
  - Track selected items and their costs

## Technical Stack

- Frontend:
  - HTML5
  - Bootstrap 5
  - jQuery
  - DataTables
  - Font Awesome icons

- Backend:
  - PHP
  - MYSQL
  - mPDF for PDF generation

## Installation

1. Clone the repository to your local XAMPP htdocs folder
2. Import the database schema
3. Update the database connection settings in `assets/php/conn.php`
4. Install dependencies:
```bash
cd assets/php
composer install
```

## Database Configuration

The system uses PostgreSQL with the following connection string format:
```
postgresql://username:password@hostname/database?sslmode=require
```

## License

This project is licensed under the MIT License.
