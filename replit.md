# StockFlow — Inventory Management System

A full-featured business management app built with **Laravel 12 + Inertia.js + React + Tailwind CSS**.

## Stack
- **Backend**: PHP 8.2 / Laravel 12, SQLite database, Inertia.js (server-side rendering bridge)
- **Frontend**: React 19, Tailwind CSS v4, Mantine UI, Recharts, Tabler Icons
- **Build**: Vite 6

## Running the App
The workflow `StockFlow Dev` runs: `php artisan serve --host=0.0.0.0 --port=8000`

After any frontend changes, rebuild assets:
```bash
npm run build
```

Then restart the workflow so Laravel picks up the new manifest.

**Demo login**: `demo@stockflow.app` / `password`

## Key Commands
```bash
php artisan migrate          # Run DB migrations
php artisan key:generate     # Regenerate APP_KEY
npm run build                # Build frontend assets
php artisan tinker           # REPL for testing
```

## Project Structure
```
app/Http/Controllers/   Laravel controllers (Dashboard, Products, Sales, Employees, Suppliers, Settings)
resources/js/
  Pages/                Inertia page components (React)
  components/           Shared components (Sidebar, Header, Modals, Charts)
  Layouts/              Layout wrappers
resources/css/          Global CSS (Tailwind v4)
database/migrations/    SQLite schema
public/build/           Compiled Vite assets (committed)
```

## Features
- 🏠 **Landing page** — Modern dark hero with feature grid
- 🔐 **Auth** — Split-screen Login & Register
- 📊 **Dashboard** — Stats cards + revenue area chart + recent sales
- 📦 **Products** — Card grid with stock badges, search, image upload, ratings
- 👥 **Employees** — Table with avatar initials, department badges, search
- 💰 **Sales** — Table with auto-calculated revenue, search, date tracking
- 🚚 **Suppliers** — Table with search and contact info
- ⚙️ **Settings** — Password change + app info
- 📱 **Responsive** — Hamburger menu on mobile, hidden columns on small screens
- 🗑️ **Delete confirmation** — Two-click delete on all tables (prevents accidents)

## User Preferences
- Keep existing Laravel + Inertia + React stack
- Indigo/slate dark theme with clean card-based UI
- Tailwind CSS for all styling (avoid inline styles)
