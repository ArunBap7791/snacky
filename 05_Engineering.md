# 05_Engineering.md

# Engineering Documentation

**Product Name:** Snacky  
**Product Type:** B2B2C Multi-Tenant Movie Ticket & Cinema Concession Platform  
**Platform:** Web (Responsive), Android & iOS (PWA Ready)  
**Version:** 1.0

---

# Purpose

This document defines the engineering architecture, development standards, technical decisions, backend services, integrations, and implementation guidelines for Snacky.

It serves as the primary reference for engineers responsible for building, scaling, and maintaining the platform.

---

# Engineering Principles

Every engineering decision should follow these principles:

- Scalability
- Reliability
- Security
- Performance
- Maintainability
- Developer Experience
- API First
- Mobile-First Performance

---

# Functional Requirements

Snacky should enable users to:

- Browse movies.
- Browse theatres.
- Search movies.
- Search theatres.
- Book movie tickets.
- Select seats.
- Purchase snacks.
- Purchase snacks without booking tickets.
- Add snacks to existing bookings.
- Choose fulfilment methods.
- Complete secure payments.
- View bookings.
- Earn rewards.
- Receive notifications.
- Manage their profile.

Partner theatres should be able to:

- Sync movie schedules.
- Sync seat inventory.
- Sync snack inventory.
- Receive booking requests.
- Receive snack orders.
- Update fulfilment status.

---

# Technical Stack

## Frontend

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- TanStack Query
- React Hook Form
- Zod Validation

---

## Backend

- Next.js Route Handlers
- Next.js Server Actions
- Node.js Runtime

The backend handles:

- Authentication
- Business Logic
- Payment Processing
- Partner Integrations
- Notifications
- QR Generation

---

## Database

- Supabase
- PostgreSQL

Primary responsibilities:

- User Accounts
- Orders
- Rewards
- Theatre Metadata
- Partner Configuration
- Booking References

---

## Authentication

Prototype Stage

- Clerk Authentication

Supported methods:

- Mobile OTP
- Google Login
- Apple Login

Authentication is required only before completing a purchase.

---

## Payments

Gateway

- Razorpay

Supports:

- Movie Ticket Payments
- Snack Orders
- Combined Payments

---

## Notifications

Firebase Cloud Messaging (FCM)

Used for:

- Booking Confirmation
- Snack Ready
- Seat Delivery Updates
- Order Status
- Promotional Notifications

---

## Analytics

Firebase Analytics

Tracks:

- User Behaviour
- Funnel Performance
- Feature Adoption
- Booking Events
- Snack Purchase Behaviour

---

## Maps

Google Maps

Used for:

- Theatre Discovery
- Theatre Location
- Distance Calculation

---

# Technical Architecture

```
                        Snacky Platform

                        Next.js Frontend
               (App Router + TypeScript + Tailwind)

                               │
                               │
                      TanStack Query (REST)
                               │
                               ▼

                  Next.js Backend (API Routes)
               Server Actions + Business Logic
                               │
 ┌─────────────────────────────┼─────────────────────────────┐
 │                             │                             │
 ▼                             ▼                             ▼

Authentication          Booking Service              Snack Service
(Clerk)                 Movie Ticket Logic           Snack Ordering

 │                             │                             │
 └──────────────┬──────────────┴──────────────┬──────────────┘
                ▼                             ▼

        Payment Service               Notification Service
          (Razorpay)                      (Firebase FCM)

                │                             │
                └──────────────┬──────────────┘
                               ▼

                     Partner Theatre APIs

        • Movie Catalogue API
        • Show Timing API
        • Seat Inventory API
        • Ticket Booking API
        • Snack Catalogue API
        • Snack Inventory API
        • Order Status API

                               │
                               ▼

                    Supabase PostgreSQL
```

---

# System Responsibilities

## Snacky Owns

- Customer Experience
- User Accounts
- Authentication
- Rewards
- Booking Journey
- Snack Ordering Journey
- Checkout
- Payments
- Notifications
- QR Generation
- Analytics

---

## Partner Theatre Owns

- Movies
- Show Timings
- Seat Inventory
- Snack Inventory
- Order Fulfilment
- Seat Delivery Operations
- Express Pickup Operations

Snacky acts as the orchestration layer between customers and partner theatres while allowing theatres to remain the operational source of truth.

---

# Backend Overview

Snacky follows a service-oriented architecture.

Core services include:

- Authentication Service
- Movie Service
- Theatre Service
- Seat Booking Service
- Snack Service
- Cart Service
- Checkout Service
- Payment Service
- Rewards Service
- Notification Service
- Analytics Service

Each service owns its business logic while sharing common authentication and data access layers.

---

# API Guidelines

Snacky follows a REST-based API architecture.

All APIs should be:

- Stateless
- Versioned
- Secure
- Predictable
- Well documented
- Consistent in request and response formats

---

## API Design Principles

- Use nouns instead of verbs in endpoints.
- Return standard HTTP status codes.
- Validate all incoming requests.
- Use pagination for list endpoints.
- Return meaningful error messages.
- Never expose internal implementation details.

---

## API Versioning

```
/api/v1/
```

Future breaking changes should introduce new API versions instead of modifying existing endpoints.

Example:

```
/api/v1/movies
/api/v1/bookings
/api/v1/snacks
```

---

## Core API Modules

### Authentication

```
POST /auth/login
POST /auth/logout
POST /auth/verify
GET  /auth/profile
```

---

### Movies

```
GET /movies
GET /movies/{id}
GET /movies/search
```

---

### Theatres

```
GET /theatres
GET /theatres/{id}
GET /theatres/search
```

---

### Shows

```
GET /shows
GET /shows/{id}
```

---

### Seats

```
GET /shows/{id}/seats
POST /bookings/reserve-seats
```

---

### Snacks

```
GET /theatres/{id}/snacks
GET /snacks/{id}
POST /cart/snacks
```

---

### Bookings

```
POST /bookings
GET /bookings
GET /bookings/{id}
```

---

### Payments

```
POST /payments/create
POST /payments/verify
```

---

### Rewards

```
GET /rewards
POST /rewards/redeem
```

---

### Notifications

```
GET /notifications
PATCH /notifications/{id}
```

---

# Data Models

The following entities represent the core domain model of Snacky.

---

## User

Attributes

- User ID
- Full Name
- Mobile Number
- Email
- Profile Image
- Reward Points
- Created At
- Updated At

---

## Movie

Attributes

- Movie ID
- Title
- Language
- Genre
- Duration
- Rating
- Poster
- Description

---

## Theatre

Attributes

- Theatre ID
- Theatre Name
- Address
- Latitude
- Longitude
- Partner ID
- Available Facilities

---

## Show

Attributes

- Show ID
- Movie ID
- Theatre ID
- Screen
- Date
- Start Time
- End Time
- Seat Layout

---

## Seat

Attributes

- Seat ID
- Seat Number
- Seat Type
- Status
- Price

---

## Snack

Attributes

- Snack ID
- Theatre ID
- Category
- Name
- Description
- Price
- Veg / Non-Veg
- Allergen Information
- Availability
- Image URL

---

## Cart

Attributes

- Cart ID
- User ID
- Theatre ID
- Booking Reference (Optional)
- Items
- Fulfilment Method
- Total Amount

---

## Booking

Attributes

- Booking ID
- User ID
- Movie
- Theatre
- Show
- Seats
- Snack Order
- Fulfilment Method
- QR Code
- OTP
- Booking Status

---

## Payment

Attributes

- Payment ID
- Booking ID
- Razorpay Order ID
- Payment Status
- Amount
- Timestamp

---

# Error Handling

Snacky should provide consistent and user-friendly error responses.

---

## API Error Structure

Every error response should include:

- Error Code
- Error Message
- HTTP Status
- Timestamp
- Request ID

---

## Common Error Types

### Authentication

- Unauthorized
- Session Expired
- Invalid OTP

---

### Booking

- Seat Already Reserved
- Show Sold Out
- Booking Expired

---

### Snacks

- Item Out of Stock
- Menu Unavailable
- Theatre Closed

---

### Payment

- Payment Failed
- Payment Cancelled
- Verification Failed

---

### Network

- Timeout
- Connection Lost
- Server Unavailable

---

## Error Handling Principles

- Preserve user progress whenever possible.
- Explain errors using clear, human-readable language.
- Provide recovery actions such as Retry or Change Payment Method.
- Log unexpected failures for monitoring and debugging.

---

# Analytics Events

Snacky uses Firebase Analytics to measure user behavior and product performance.

---

## Authentication Events

- Login Started
- Login Completed
- Logout

---

## Movie Events

- Movie Viewed
- Theatre Viewed
- Show Selected
- Seat Selected

---

## Snack Events

- Snack Viewed
- Snack Added
- Snack Removed
- Quantity Updated

---

## Checkout Events

- Checkout Started
- Fulfilment Selected
- Payment Initiated
- Payment Completed
- Payment Failed

---

## Booking Events

- Ticket Booked
- Snack Ordered
- Booking Viewed
- QR Viewed

---

## Rewards Events

- Reward Viewed
- Reward Redeemed
- Reward Earned

---

# Security

Snacky follows security best practices across authentication, payments, APIs, and data storage.

---

## Authentication Security

- Clerk-managed authentication
- Secure session management
- Protected routes
- Role-based authorization for administrative functions

---

## API Security

- HTTPS only
- Input validation
- Rate limiting
- Request authentication
- Server-side authorization
- CORS protection

---

## Payment Security

- Razorpay-hosted payment flow
- No storage of card information
- Payment signature verification
- Secure webhook validation

---

## Data Security

- Encrypt sensitive data in transit.
- Encrypt sensitive data at rest where applicable.
- Store secrets using secure environment variables.
- Restrict database access using least-privilege principles.

---

## QR & OTP Security

- Generate unique QR Codes per booking.
- Generate time-bound OTPs.
- Prevent QR/OTP reuse after successful fulfilment.
- Validate QR/OTP server-side before confirming order handover.

---

# Performance

Snacky is designed to provide a fast, reliable, and responsive experience across modern browsers and devices.

---

## Performance Goals

| Metric | Target |
|----------|---------|
| First Contentful Paint (FCP) | < 1.8 seconds |
| Largest Contentful Paint (LCP) | < 2.5 seconds |
| Time to Interactive (TTI) | < 3.0 seconds |
| API Response Time | < 300 ms (Average) |
| Search Response Time | < 500 ms |
| Page Transition | < 200 ms |
| Payment Response | < 5 seconds |

---

## Frontend Optimization

Leverage Next.js 15 features for optimal performance:

- Server Components by default.
- Client Components only when interaction is required.
- Route-based code splitting.
- Dynamic imports for heavy components.
- Image optimization using `next/image`.
- Font optimization using `next/font`.
- Lazy loading for below-the-fold content.

---

## Data Fetching Strategy

TanStack Query should be used for:

- API caching
- Background refetching
- Optimistic updates
- Request deduplication
- Error retries

Use Server Components where possible to reduce client-side JavaScript.

---

## Media Optimization

- Optimize movie posters before delivery.
- Serve responsive image sizes.
- Use modern image formats (WebP/AVIF where supported).
- Lazy load images outside the viewport.

---

## Database Optimization

- Proper indexing on frequently queried fields.
- Pagination for large datasets.
- Avoid N+1 query patterns.
- Use database transactions for booking operations.
- Archive historical records when appropriate.

---

## API Optimization

- Enable response compression.
- Cache frequently accessed data where appropriate.
- Validate requests before business logic execution.
- Minimize payload sizes.
- Batch related requests when practical.

---

# Offline Strategy

Snacky is an online-first application with graceful degradation during connectivity issues.

---

## Available Offline

Users may continue to access:

- Previously viewed pages (cached)
- Booking confirmations
- QR Codes
- OTPs
- Basic profile information

---

## Requires Internet Connection

The following actions require an active connection:

- Browse live movies
- Search theatres
- Seat availability
- Snack availability
- Booking tickets
- Payments
- Reward redemption
- Real-time inventory updates

---

## Offline Behaviour

When connectivity is lost:

- Preserve user progress.
- Display a clear offline indicator.
- Retry failed requests when connectivity returns.
- Prevent duplicate submissions.
- Inform users when live data cannot be refreshed.

---

# Folder Structure

Recommended project structure for Snacky.

```text
snacky/
│
├── app/
│   ├── (auth)/
│   ├── (home)/
│   ├── movies/
│   ├── theatres/
│   ├── snacks/
│   ├── bookings/
│   ├── rewards/
│   ├── profile/
│   ├── api/
│   └── layout.tsx
│
├── components/
│   ├── ui/
│   ├── movie/
│   ├── theatre/
│   ├── snack/
│   ├── booking/
│   ├── rewards/
│   └── shared/
│
├── lib/
│   ├── api/
│   ├── auth/
│   ├── utils/
│   ├── validations/
│   └── constants/
│
├── hooks/
│
├── services/
│
├── types/
│
├── public/
│
├── styles/
│
├── middleware.ts
│
└── package.json
```

---

# Coding Standards

Snacky follows modern TypeScript development standards.

---

## General Principles

- Write readable code over clever code.
- Keep functions small and focused.
- Prefer composition over inheritance.
- Avoid duplicated logic.
- Follow the Single Responsibility Principle.

---

## TypeScript

- Enable strict mode.
- Avoid `any` whenever possible.
- Define reusable interfaces and types.
- Validate external data before use.

---

## React

- Prefer Server Components.
- Use Client Components only when necessary.
- Keep components focused on a single responsibility.
- Reuse UI through composition.
- Avoid unnecessary re-renders.

---

## Styling

- Use Tailwind CSS utility classes.
- Build reusable components with shadcn/ui.
- Avoid inline styles.
- Follow the Design System tokens for spacing, colors, and typography.

---

## Naming Conventions

| Item | Convention |
|--------|------------|
| Components | PascalCase |
| Hooks | camelCase with `use` prefix |
| Variables | camelCase |
| Constants | UPPER_SNAKE_CASE |
| Files | kebab-case or framework convention |
| API Routes | kebab-case |

---

## Code Review Checklist

Before merging code:

- Build passes successfully.
- No TypeScript errors.
- No ESLint errors.
- Responsive layout verified.
- Accessibility verified.
- Performance impact reviewed.
- Design System compliance checked.

---

# Git Workflow

Snacky follows a feature-branch workflow.

---

## Main Branches

```
main
develop
```

---

## Feature Branches

Examples:

```
feature/movie-booking

feature/snack-ordering

feature/rewards

feature/payment
```

---

## Bug Fixes

```
fix/payment-retry

fix/seat-selection

fix/snack-search
```

---

## Commit Message Convention

Examples:

```
feat: add snack ordering flow

fix: preserve cart after payment failure

refactor: optimize movie search

docs: update engineering documentation

style: improve button spacing

test: add booking service tests
```

---

## Pull Request Checklist

Every Pull Request should include:

- Clear description of changes.
- Screenshots or recordings for UI updates.
- Linked issue or task reference.
- Successful build verification.
- Code review approval before merge.

---

# Deployment Considerations

Snacky is designed for modern cloud-native deployment.

---

## Hosting

### Frontend & Backend

- Vercel

### Database

- Supabase PostgreSQL

### Background Services

- Railway (for long-running services or future worker processes)

---

## Environment Variables

Sensitive configuration should be managed through environment variables.

Examples include:

- Clerk credentials
- Supabase credentials
- Razorpay keys
- Firebase configuration
- Google Maps API key
- Analytics configuration

Secrets must never be committed to source control.

---

## Monitoring

Monitor the application for:

- API failures
- Payment failures
- Booking failures
- Slow database queries
- Client-side errors
- Server-side exceptions
- Notification delivery failures

---

## Logging

Log important system events such as:

- User authentication
- Booking creation
- Payment verification
- Snack order placement
- Fulfilment updates
- API integration failures

Avoid logging sensitive personal or payment information.

---

## Scalability Considerations

The architecture should support future growth through:

- Additional partner theatres
- Multiple cities and regions
- Increased concurrent bookings
- Expanded rewards and loyalty programs
- AI-powered recommendations
- Internationalization
- Additional payment providers

---

# Engineering Principles Summary

Snacky's engineering architecture is built around:

- API-first design
- Service-oriented architecture
- Secure-by-default implementation
- Responsive and performant user experience
- Scalable B2B2C integrations
- Maintainable and modular codebase
- Cloud-native deployment
- Consistent developer experience

This document should be treated as the engineering reference for implementing, maintaining, and scaling the Snacky platform.