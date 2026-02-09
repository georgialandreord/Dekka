# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Dekka is a Next.js application that integrates with Dropbox API to provide folder management and artistic transformation capabilities. The app uses modern React patterns with tRPC for type-safe API calls and Better Auth for authentication.

## Key Technologies

- **Framework**: Next.js 16 with App Router
- **Database**: Prisma with MongoDB adapter
- **Authentication**: Better Auth with Dropbox OAuth integration
- **API**: tRPC for type-safe client-server communication
- **Styling**: Tailwind CSS with custom gradient themes
- **State Management**: TanStack Query for server state
- **Routing**: React Router v7 for client-side navigation

## Development Commands

### Essential Scripts
```bash
# Development server with Turbo
pnpm dev

# Build for production
pnpm build

# Type checking and linting
pnpm check          # Runs both lint and typecheck
pnpm typecheck      # TypeScript type checking only
pnpm lint           # ESLint
pnpm lint:fix       # Auto-fix lint issues

# Database operations
pnpm db:generate    # Generate Prisma client and run migrations
pnpm db:migrate     # Deploy migrations to production
pnpm db:push        # Push schema changes to database
pnpm db:studio      # Open Prisma Studio

# Code formatting
pnpm format:check   # Check Prettier formatting
pnpm format:write   # Apply Prettier formatting
```

## Architecture

### Directory Structure
- `src/app/` - Next.js App Router pages and API routes
- `src/frontend/` - React Router components and pages
- `src/server/` - Server-side utilities (tRPC, auth, database)
- `src/components/` - Reusable UI components
- `src/lib/` - Utility functions and configurations
- `prisma/` - Database schema and migrations

### Key Architecture Patterns

**tRPC API Structure**:
- All API routes defined in `src/server/api/routers/`
- Main router combines all routers in `src/server/api/root.ts`
- Server-side context includes Dropbox client (`ctx.dbx`)

**Authentication Flow**:
- Better Auth configuration in `src/server/better-auth/`
- Dropbox OAuth integration with file permissions
- Session management through Prisma adapter

**Frontend Routing**:
- React Router v7 handles client-side navigation
- Nested routes for dashboard and folder management
- Breadcrumb navigation component for path tracking

**Dropbox Integration**:
- Folder router handles Dropbox API calls
- File listing and folder operations through Dropbox SDK
- Context passes authenticated Dropbox client to procedures

### Important Files

**Core Configuration**:
- `src/env.js` - Environment variables and validation
- `src/server/db.ts` - Prisma database connection
- `src/server/better-auth/config.ts` - Authentication setup

**tRPC Setup**:
- `src/server/api/trpc.ts` - tRPC server configuration
- `src/trpc/react.tsx` - Client-side tRPC setup
- `src/trpc/server.ts` - Server-side tRPC helpers

**Main Application**:
- `src/frontend/app.tsx` - React Router setup and layout components
- `src/app/layout.tsx` - Next.js root layout

## Development Notes

### Database Schema
The application uses Prisma with MongoDB adapter. The schema includes user authentication tables and Dropbox integration data.

### Dropbox API Integration
The app requires Dropbox App Console setup with appropriate permissions:
- `files.content.read/write`
- `files.metadata.read/write`
- `account_info.read`

### Styling Approach
Uses Tailwind CSS with custom gradient themes defined in global styles. The UI follows a modern design with purple-to-pink gradients for primary actions.

### State Management
Server state managed through TanStack Query with tRPC integration. Client state handled through React hooks and context providers.