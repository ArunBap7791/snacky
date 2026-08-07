# 02_Information_Architecture.md

# Information Architecture

**Product Name:** Snacky  
**Product Type:** B2B2C Multi-Tenant Movie Ticket & Cinema Concession Platform  
**Platform:** Mobile Application (Android & iOS)  
**Version:** 1.0

---

# Purpose

The Information Architecture (IA) defines how information, screens, navigation, and user journeys are organized within Snacky.

The architecture is designed around two primary user intents:

1. Book a Movie
2. Order Snacks

Both journeys are interconnected while remaining independently accessible, allowing users to purchase movie tickets, snacks, or both based on their needs.

The IA prioritizes:

- Low cognitive load
- One-handed mobile interactions
- Fast task completion
- Predictable navigation
- Scalability for future partner theatres and features

---

# Product Structure

```
Snacky
│
├── Home
│   ├── Movies
│   └── Snacks
│
├── Rewards
│
├── Bookings
│
├── Cart
│
└── Profile
```

---

# Product Hierarchy

```
Snacky

├── Authentication
│
├── Home
│   │
│   ├── Movies
│   │   ├── Search
│   │   ├── Movie Listing
│   │   ├── Theatre Listing
│   │   ├── Movie Details
│   │   ├── Theatre Details
│   │   ├── Show Time Selection
│   │   ├── Seat Selection
│   │   ├── Snack Selection (Optional)
│   │   ├── Cart
│   │   ├── Checkout
│   │   ├── Fulfilment Selection
│   │   ├── Payment
│   │   └── Booking Confirmation
│   │
│   └── Snacks
│       ├── Existing Booking Selection
│       ├── Theatre Search
│       ├── Theatre Details
│       ├── Snack Categories
│       ├── Snack Details
│       ├── Cart
│       ├── Checkout
│       ├── Fulfilment Selection
│       ├── Payment
│       └── Order Confirmation
│
├── Rewards
│
├── Bookings
│   ├── Upcoming
│   ├── Completed
│   ├── Cancelled
│   ├── Booking Details
│   └── Add Snacks
│
├── Cart
│
└── Profile
```

---

# Sitemap

```
Snacky

Home
│
├── Movies
│   │
│   ├── Search
│   ├── Movie Listing
│   ├── Theatre Listing
│   ├── Movie Details
│   ├── Theatre Details
│   ├── Show Time Selection
│   ├── Seat Selection
│   ├── Snack Selection (Optional)
│   ├── Cart
│   ├── Checkout
│   ├── Fulfilment Selection
│   ├── Payment
│   └── Booking Confirmation
│
├── Snacks
│   │
│   ├── Existing Booking
│   ├── Search Theatre
│   ├── Theatre Details
│   ├── Snack Categories
│   ├── Snack Details
│   ├── Cart
│   ├── Checkout
│   ├── Fulfilment Selection
│   ├── Payment
│   └── Order Confirmation
│
├── Rewards
│
├── Bookings
│   ├── Upcoming
│   ├── Completed
│   ├── Cancelled
│   ├── Booking Details
│   └── Add Snacks
│
├── Cart
│
└── Profile
```

---

# Navigation Hierarchy

Snacky follows a hybrid navigation model that combines persistent navigation, contextual navigation, and task-based navigation.

## Primary Navigation

Bottom Navigation

- Home
- Rewards
- Bookings
- Cart
- Profile

The Bottom Navigation remains persistent throughout the application except during full-screen payment processing where appropriate.

---

## Secondary Navigation

Inside Home

```
Home

Movies
Snacks
```

These two tabs represent the user's primary intention.

---

### Movies

The Movies tab is designed for users who want to:

- Discover movies.
- Discover theatres.
- Search movies and theatres.
- Book movie tickets.
- Select seats.
- Optionally add snacks before payment.
- Choose a snack fulfilment method.
- Complete ticket and snack booking together.

---

### Snacks

The Snacks tab is designed for users who want to:

- Purchase snacks without booking a movie ticket.
- Add snacks to an existing Snacky movie booking.
- Purchase snacks even if their movie ticket was booked through another platform.
- Browse theatre snack menus.
- Choose a preferred fulfilment method based on eligibility.

#### Fulfilment Availability

**Seat Delivery**

Available only when:

- Movie ticket was booked through Snacky.
- Partner theatre supports Seat Delivery.
- Delivery slot is still available.
- User pays the applicable Seat Delivery fee.

Available delivery slots:

- Before Movie Starts
- During Intermission

Users will receive a notification when the order is ready and must verify using their QR Code or OTP during delivery.

---

**Express Pickup**

Available for all users.

This includes:

- Users who booked tickets through Snacky.
- Users who booked tickets elsewhere.
- Users ordering snacks without any movie ticket.

Users receive a notification when the order is ready and collect it from the Express Pickup Counter using their QR Code or OTP.

---

## Contextual Navigation

Navigation changes depending on the user's journey while always maintaining task continuity.

Examples:

Movie Listing

↓

Movie Details

↓

Theatre Selection

↓

Show Time

↓

Seat Selection

↓

Snack Selection (Optional)

↓

Cart

↓

Checkout

↓

Fulfilment Selection

↓

Payment

↓

Booking Confirmation

---

Snack Ordering

↓

Theatre Selection

↓

Snack Catalogue

↓

Cart

↓

Checkout

↓

Fulfilment Selection

↓

Payment

↓

Order Confirmation

---