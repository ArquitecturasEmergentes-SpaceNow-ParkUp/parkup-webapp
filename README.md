# ParkUp Web Application

A modern parking management system built with Next.js 16, shadcn/ui, and TypeScript.

## Features

- 🔐 User authentication (login/register)
- 👥 Role-based access control (ROLE_USER, ROLE_ADMIN)
- 📊 Dashboard with real-time user data
- 🛡️ Separate admin panel for administrators
- 🎨 Modern UI with shadcn components
- 🌓 Dark mode support (next-themes)
- 📱 Responsive design
- 🔔 Toast notifications (Sonner)
- 🎯 Type-safe with TypeScript

## Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- Backend API running (default: http://localhost:8090)

## Environment Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd parkup-web
bun install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your backend API URL:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8090/api/v1
NODE_ENV=development
```

**Important:** Never commit `.env.local` to version control!

For detailed configuration options, see [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)

## Getting Started

First, run the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Build for Production

```bash
bun run build
bun run start
```

## Project Structure

```
parkup-web/
├── app/                      # Next.js app directory
│   ├── login/               # Login page
│   ├── register/            # Registration page
│   ├── dashboard/           # User dashboard (ROLE_USER)
│   └── admin/               # Admin panel (ROLE_ADMIN)
├── components/              # React components
│   ├── ui/                  # shadcn UI components
│   ├── app-sidebar.tsx      # User dashboard sidebar
│   ├── admin-sidebar.tsx    # Admin panel sidebar
│   ├── role-guard.tsx       # Role-based access control
│   └── dashboard/           # Dashboard-specific components
├── lib/                     # Utility functions
│   ├── actions.ts           # Server actions
│   ├── auth.ts              # Role utilities and helpers
│   ├── config.ts            # Environment configuration
│   └── utils.ts             # Helper functions
├── proxy.ts                 # Role-based routing proxy (Next.js 16+)
├── public/                  # Static assets
│   ├── logo_app.webp        # App logo
│   └── logo_banner.webp     # Banner logo
├── hooks/                   # Custom React hooks
└── docs/                    # Documentation
    └── ROLE_BASED_ACCESS.md # RBAC documentation
```

## Documentation

- [Environment Setup](./ENVIRONMENT_SETUP.md) - Configure environment variables
- [User Data Integration](./USER_DATA_INTEGRATION.md) - User authentication flow
- [Login Flow](./LOGIN_FLOW.md) - Authentication architecture
- [Role-Based Access Control](./docs/ROLE_BASED_ACCESS.md) - RBAC system documentation
- [UI Improvements](./UI_IMPROVEMENTS.md) - shadcn component integration
- [Sonner Usage](./SONNER_USAGE.md) - Toast notifications guide

## Role-Based Access Control

The application implements a comprehensive role-based access control (RBAC) system with two main roles:

### Roles

- **ROLE_USER**: Regular users with access to the standard dashboard
  - Routes: `/dashboard/*`
  - Features: View parking spots, make reservations, manage profile
  
- **ROLE_ADMIN**: Administrators with full system access
  - Routes: `/admin/*`
  - Features: User management, recognition units, system reports, analytics

### Key Features

- **Automatic Role-Based Routing**: Proxy function automatically redirects users to their appropriate dashboard
- **Server-Side Protection**: All routes are protected at the layout level
- **Client-Side Guards**: `RoleGuard` component for conditional UI rendering
- **Utility Functions**: Helper functions for role checking (`isAdmin`, `isUser`, `hasRole`, etc.)
- **Separate Interfaces**: Completely different UI and navigation for each role

### Quick Usage

```typescript
// Check if user is admin
import { isAdmin, ROLES } from "@/lib/auth";

if (isAdmin(user)) {
  // Show admin content
}

// Protect UI elements
import { RoleGuard } from "@/components/role-guard";

<RoleGuard requiredRole={ROLES.ADMIN}>
  <AdminOnlyComponent />
</RoleGuard>

// Use role hooks
import { useRole } from "@/components/role-guard";

const isAdmin = useRole(ROLES.ADMIN);
```

For detailed documentation, see [ROLE_BASED_ACCESS.md](./docs/ROLE_BASED_ACCESS.md).

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Form Validation:** React Hook Form + Zod
- **Icons:** Lucide React
- **Notifications:** Sonner
- **Theme:** next-themes

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## API Integration

The application connects to a backend API. Ensure your backend is running and accessible at the URL specified in `NEXT_PUBLIC_API_URL`.

Required endpoints:
- `POST /api/v1/authentication/login` - User login (returns token and user data with roles)
- `POST /api/v1/authentication/register` - User registration
- `GET /api/v1/users/{user_id}` - Get user details (must include roles array)

See [LOGIN_FLOW.md](./LOGIN_FLOW.md) for detailed API requirements.

## Development

### Code Formatting

```bash
bunx @biomejs/biome format --write .
```

### Type Checking

```bash
bun run build
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Format code with Biome
4. Test the build
5. Submit a pull request

## License

[Add your license here]
