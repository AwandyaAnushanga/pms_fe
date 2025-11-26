# Property Management System - Frontend

A modern, responsive property management system built with React, TypeScript, and Tailwind CSS.

## Features

- **Dashboard**: Analytics overview with key metrics
- **Owners Management**: Full CRUD operations for property owners
- **Properties Management**: Manage properties with owner relationships
- **Units Management**: Card-based unit management with property links
- **Tenants Management**: Tenant profiles with unit assignments
- **Leases Management**: Lease tracking with expiration alerts
- **Payments Management**: Payment tracking with filtering
- **Maintenance Requests**: Kanban board for maintenance workflow

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Vite
- Lucide React (icons)

## Prerequisites

- Node.js 18+ and npm
- Spring Boot backend running on `http://localhost:8080`

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file in the root directory:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build

To create a production build:
```bash
npm run build
```

The built files will be in the `dist` directory.

## API Integration

This frontend connects to a Spring Boot REST API. See `API_DOCUMENTATION.md` for complete API specifications including:
- All endpoints
- Request/response formats
- Database schema
- Error handling

## Project Structure

```
src/
├── components/
│   ├── layout/        # Layout components (Sidebar, TopNav, DashboardLayout)
│   └── ui/            # Reusable UI components (Button, Modal, Table, etc.)
├── lib/
│   └── api.ts         # API service layer
├── pages/             # Page components for each module
├── types/             # TypeScript type definitions
├── App.tsx            # Main app component with routing
└── main.tsx           # Entry point
```

## Key Components

### Layout Components
- `DashboardLayout`: Main layout with sidebar and top navigation
- `Sidebar`: Navigation menu
- `TopNav`: Top navigation bar with search

### UI Components
- `Button`: Styled button with variants
- `Modal`: Modal dialog component
- `Table`: Data table with sorting and pagination
- `Input`: Form input with label and error handling
- `Select`: Dropdown select component
- `Badge`: Status badge component
- `Toast`: Toast notification system

### Pages
- `Dashboard`: Analytics and stats overview
- `Owners`: Owner management
- `Properties`: Property management
- `Units`: Unit management with card view
- `Tenants`: Tenant management with profiles
- `Leases`: Lease management with alerts
- `Payments`: Payment tracking with filters
- `Maintenance`: Kanban board for maintenance requests

## Development

### Adding a New Module

1. Create page component in `src/pages/`
2. Add API methods in `src/lib/api.ts`
3. Define types in `src/types/index.ts`
4. Add route in `src/App.tsx`
5. Add menu item in `src/components/layout/Sidebar.tsx`

### Styling

- Uses Tailwind CSS for styling
- Custom color scheme: Blue primary, clean grays
- Responsive design with mobile breakpoints
- Smooth transitions and hover effects

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Proprietary
