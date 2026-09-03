# Indo.Cab Admin Panel - Project Analysis

## 1. Project Overview
Indo.Cab-frontend-admin is a robust, web-based administration dashboard for managing a comprehensive cab and transportation network. It handles various operations such as driver and vehicle management, client and vendor onboarding, dispatching, live tracking, billing, and reporting.

## 2. Tech Stack & Dependencies
This project is built using modern web development technologies to ensure high performance, maintainability, and a premium user experience.

*   **Core Framework**: React 19 (via Vite 8)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS 4, Radix UI (Headless UI components), `lucide-react` for icons, `class-variance-authority`, `tailwind-merge`, and `clsx` for dynamic styling.
*   **State Management & Data Fetching**: 
    *   Redux Toolkit (`@reduxjs/toolkit`, `react-redux`) for global state.
    *   React Query (`@tanstack/react-query`) for server state and caching.
*   **Routing**: React Router DOM 7
*   **Forms & Validation**: React Hook Form, Zod schema validation, `@hookform/resolvers`
*   **Maps & Tracking**: `react-leaflet`, `leaflet`, `@react-google-maps/api`
*   **Networking**: Axios, Socket.IO Client for real-time updates.
*   **Other Utilities**: `date-fns` for date manipulation, `recharts` for data visualization, `sonner` and Radix UI Toast for notifications.

## 3. Project File Structure
Below is the verified hierarchical structure of the `src` directory, which houses the main application code:

```text
src
├── App.tsx
├── index.css
├── main.tsx
├── vite-env.d.ts
├── api                  # API client setup and endpoint definitions (auth, client, driver, etc.)
├── assets               # Static assets like images and SVGs
├── components           # Reusable UI components
│   ├── auth             # Authentication components (LoginCard, LoginPage)
│   ├── charts           # Analytics charts
│   └── common           # Generic UI elements (Buttons, Layouts, Sidebar, Tables, etc.)
├── constants            # Application-wide constants (navigation, permissions, roles, routes)
├── features             # Feature-based modular architecture
│   ├── audit
│   ├── auth
│   ├── billing
│   ├── bookings
│   ├── clients          # Client management and onboarding
│   ├── dashboard        # Dashboard overview and new bookings
│   ├── dispatch         # Dispatch and assignment functionality
│   ├── drivers          # Driver directory, approval queue, and management
│   ├── pricing
│   ├── reports
│   ├── settlements
│   ├── tracking         # Live tracking tabs and pages
│   ├── vehicles
│   └── vendors          # Vendor management and onboarding
├── hooks                # Custom React hooks (e.g., usePermission)
├── lib                  # Library configurations (e.g., queryClient setup)
├── providers            # Global React contexts/providers (e.g., RecaptchaProvider)
├── router               # Route definitions and ProtectedRoute logic
├── store                # Redux store configuration and slices
├── types                # TypeScript type definitions and interfaces
└── utils                # Helper utilities and functions (icons, validation)
```

## 4. Module Breakdown & Architecture
The codebase follows a highly modular, **feature-based architecture** (`src/features`). Each major domain (e.g., `drivers`, `vendors`, `clients`) is encapsulated and contains its own:
*   Pages (e.g., `DriverManagementPage.tsx`)
*   Components (e.g., `DriverApprovalQueue.tsx`)
*   Types & Hooks

This structure promotes separation of concerns and makes the codebase highly scalable. Reusable generic components (buttons, layout wrappers, data tables, sidebars) are kept in `src/components/common`.

## 5. Verification
*   **AI Verification**: The above structure and analysis have been programmatically generated and verified by analyzing the file system tree and `package.json` dependencies of the project.
*   **Status**: Structure verified and committed to the repository.
