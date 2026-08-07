# Indo.Cab Operations Portal

A modern, high-performance operations and administration dashboard designed to manage fleets, bookings, billing, pricing, and live tracking for Indo.Cab.

---

## 🛠️ Technology Stack

Here is the comprehensive list of technologies and libraries driving the application:

### Core Framework & Build Tools
* **React 19** (`react` / `react-dom`): UI structure and component lifecycle.
* **TypeScript 6** (`typescript`): Static typing and developer safety.
* **Vite 8** (`vite`): Fast development server and production bundler.
* **Oxlint** (`oxlint`): Lightning-fast code linter.

### State Management & Routing
* **Redux Toolkit & React Redux** (`@reduxjs/toolkit` / `react-redux`): Global client state management (specifically user sessions and tokens with built-in localStorage persistence).
* **React Router DOM v7** (`react-router-dom`): Client-side routing and protected layout guards.

### Data Fetching & Networking
* **TanStack React Query v5** (`@tanstack/react-query`): Declarative server state management, caching, and background synchronizations.
* **Axios** (`axios`): Promise-based HTTP client for API networking.
* **Socket.io Client** (`socket.io-client`): Real-time web socket connection for vehicle tracking.

### Form Validation
* **React Hook Form** (`react-hook-form`): Performant form validation.
* **Zod** (`zod`): Strict schema declaration and payload validation.

### UI & Styling
* **Tailwind CSS v4** (`tailwindcss`): Utility-first styling framework.
* **Radix UI Primitives**: Fully accessible, unstyled interactive components (Dialogs, Selects, Dropdowns, Switch, Tooltips, etc.).
* **Lucide React** (`lucide-react`): Icon pack.
* **Class Variance Authority (CVA)**: Helps structure reusable, variant-based components cleanly.

### Charts & Visualization
* **Leaflet & React Leaflet** (`leaflet` / `react-leaflet`): Open-source maps for dispatching and route monitoring.
* **Recharts** (`recharts`): Data visualization for dashboard metrics.

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* npm or yarn

### Installation
1. Clone the repository.
2. Install the dependencies:
   ```bash
   npm install
   ```

### Development
Start the development server:
```bash
npm run dev
```

### Production Build
Compile and bundle for production:
```bash
npm run build
```
