# Supabase Integration for 4ortune Fitness

This document outlines the implementation of Supabase integration for the 4ortune Fitness e-commerce platform.

## Setup Instructions

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Configure environment variables in `.env` file:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Run the database migration script from `supabase/migrations/20250306000000_create_tables.sql`

## Database Schema

The database includes the following tables:

1. **profiles** - User profile information, linked to Supabase Auth
2. **products** - Product catalog with details, pricing, and inventory status
3. **orders** - Order history with shipping, billing, and payment information
4. **reviews** - Product reviews with ratings and comments
5. **wishlist_items** - User wishlist items

The schema includes Row Level Security (RLS) policies to ensure data security.

## API Modules

The integration includes the following API modules:

### Authentication (`src/lib/api/auth.ts`)
- User registration
- Login with email/password
- OAuth login (Google)
- Password reset flow
- Profile management

### Products (`src/lib/api/products.ts`)
- Product listing and filtering
- Product details
- Category management
- Search functionality

### Orders (`src/lib/api/orders.ts`)
- Order creation
- Order history
- Order details
- Order cancellation

### Reviews (`src/lib/api/reviews.ts`)
- Create, update, and delete reviews
- Fetch product reviews
- User review history

### Wishlist (`src/lib/api/wishlist.ts`)
- Add/remove products from wishlist
- View wishlist
- Check if product is in wishlist

## Authentication Context

A React context (`src/contexts/AuthContext.tsx`) is provided to manage authentication state throughout the application. This includes:

- Current user session
- User profile data
- Authentication methods (sign in, sign up, sign out)
- Status indicators (loading, authenticated)

## Protected Routes

Protected routes require authentication to access. These include:

- Checkout
- User profile
- Order history
- Order details
- Wishlist

The `ProtectedRoute` component handles redirection to login if not authenticated.

## Authentication Pages

The following authentication pages are included:

- **Login** (`src/pages/auth/Login.tsx`) - Email/password and Google login
- **Register** (`src/pages/auth/Register.tsx`) - New user registration
- **ResetPassword** (`src/pages/auth/ResetPassword.tsx`) - Password reset flow
- **AuthCallback** (`src/pages/auth/AuthCallback.tsx`) - Handle OAuth redirects

## Integration with E-commerce Features

The Supabase integration connects with existing e-commerce functionality:

- Products from database loaded to shop pages
- User wishlist synced with database
- Orders saved to database on checkout
- Reviews tied to user accounts and products

## Best Practices

- Environment variables for Supabase credentials
- Type safety with TypeScript definitions
- Row Level Security policies on tables
- Error handling throughout API calls
- Loading states for better UX
- Session persistence

## Next Steps

1. Implement admin interface for product management
2. Add server-side functions for business logic
3. Set up Storage for product images
4. Implement real-time updates with Supabase subscriptions
5. Add analytics tracking

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
