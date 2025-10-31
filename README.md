# ParkUp Web Application

A modern parking management system built with Next.js 16, shadcn/ui, and TypeScript.

## Features

- 🔐 User authentication (login/register)
- 📊 Dashboard with real-time user data
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
│   └── dashboard/           # Dashboard routes
├── components/              # React components
│   ├── ui/                  # shadcn UI components
│   ├── app-sidebar.tsx      # Dashboard sidebar
│   └── dashboard/           # Dashboard-specific components
├── lib/                     # Utility functions
│   ├── actions.ts           # Server actions
│   ├── config.ts            # Environment configuration
│   └── utils.ts             # Helper functions
├── public/                  # Static assets
│   ├── logo_app.webp        # App logo
│   └── logo_banner.webp     # Banner logo
└── hooks/                   # Custom React hooks
```

## Documentation

- [Environment Setup](./ENVIRONMENT_SETUP.md) - Configure environment variables
- [User Data Integration](./USER_DATA_INTEGRATION.md) - User authentication flow
- [Login Flow](./LOGIN_FLOW.md) - Authentication architecture
- [UI Improvements](./UI_IMPROVEMENTS.md) - shadcn component integration
- [Sonner Usage](./SONNER_USAGE.md) - Toast notifications guide

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
- `POST /api/v1/authentication/login` - User login
- `POST /api/v1/authentication/register` - User registration
- `GET /api/v1/users/{user_id}` - Get user details

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
