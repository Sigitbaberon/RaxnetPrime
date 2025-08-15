# Raxnet Prime News Platform

## Overview

Raxnet Prime is a modern news platform built with React and Express, featuring a sleek user interface for browsing news articles across different categories. The application provides a complete news consumption experience with features like article viewing, commenting, search functionality, and an administrative dashboard for content management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The client-side application is built using React with TypeScript optimized for Cloudflare Pages deployment:

- **React Router**: Uses Wouter for lightweight client-side routing
- **UI Components**: Built with Radix UI primitives and styled using Tailwind CSS with shadcn/ui components
- **State Management**: React Query (TanStack Query) for server state management and data fetching
- **Styling**: Tailwind CSS with custom CSS variables for theming support
- **Theme System**: Light/dark mode toggle with system preference detection
- **Build Target**: Static site generation optimized for Cloudflare Pages CDN

### Backend Architecture

The backend is designed for Cloudflare ecosystem deployment:

- **Cloudflare Functions**: Serverless API endpoints replacing traditional Express server
- **Edge Computing**: Functions run at Cloudflare edge locations worldwide
- **CORS Configuration**: Static `_headers` file for cross-origin resource sharing
- **Routing**: File-based routing using Cloudflare Functions structure

### Data Storage Solutions

Cloudflare-optimized storage architecture:

- **Cloudflare D1**: SQLite-based edge database for production
- **Development Storage**: In-memory storage for local development
- **Schema Management**: SQLite schema optimized for D1 deployment
- **Edge Replication**: Data replicated across Cloudflare edge locations

### Database Schema

The data model includes four main entities:

- **Categories**: News categorization with slugs and color coding
- **Articles**: Full article content with metadata, view counts, and feature flags
- **Comments**: User comments with moderation approval system
- **Admins**: Administrative user accounts with role-based access

### Authentication and Authorization

Simple authentication system for administrative functions:

- **Admin Authentication**: Username/password login for content management
- **Session Storage**: Browser localStorage for maintaining admin sessions
- **Protected Routes**: Client-side route protection for admin dashboard access
- **Role-based Access**: Admin role system for future expansion

### Content Management Features

The platform includes comprehensive content management capabilities:

- **Article Management**: Create, edit, delete, and feature articles
- **Comment Moderation**: Approve or reject user comments
- **Category Management**: Organize content into themed categories
- **Analytics Dashboard**: View article statistics and engagement metrics

## External Dependencies

### Database and ORM
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe SQL query builder and schema management
- **Drizzle Kit**: Database migration and introspection tools

### UI and Styling
- **Radix UI**: Headless, accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Pre-built component library built on Radix UI
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Type safety and enhanced developer experience
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Autoprefixer

### State Management and Data Fetching
- **TanStack React Query**: Server state management and caching
- **React Hook Form**: Form handling with validation
- **Zod**: Runtime type validation and schema definition

### Additional Libraries
- **date-fns**: Date manipulation and formatting
- **wouter**: Lightweight React routing
- **class-variance-authority**: Utility for component variant management
- **clsx**: Conditional CSS class composition