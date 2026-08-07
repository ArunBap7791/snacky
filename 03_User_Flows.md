# 03_User_Flows.md

# User Flows

**Product Name:** Snacky  
**Product Type:** B2B2C Multi-Tenant Movie Ticket & Cinema Concession Platform  
**Platform:** Mobile Application (Android & iOS)  
**Version:** 1.0

---

# Purpose

This document defines how users accomplish tasks within Snacky by mapping every major journey from entry point to completion.

The flows are designed to:

- Minimize cognitive load.
- Reduce unnecessary navigation.
- Preserve the movie experience.
- Support multiple user intentions.
- Handle alternate paths, failures, and edge cases gracefully.

---

# Navigation Principles

All user flows follow these principles:

- Users should always know where they are.
- Navigation should never unexpectedly remove user progress.
- Important decisions should require confirmation.
- Theatre context determines snack availability.
- Users should always understand why an option is unavailable.
- Critical actions should be reversible whenever possible.

---

# Onboarding Flow

## First-Time User

```
App Launch
        ↓
Splash Screen
        ↓
Welcome
        ↓
Location Permission
        ↓
Notification Permission (Optional)
        ↓
Home
```

### Behaviour

Users are not required to create an account during onboarding.

After onboarding they can immediately:

- Browse movies
- Browse theatres
- Browse snack catalogues (after selecting a theatre)
- Explore the application

Authentication is required only before completing an order.

---

# Authentication Flow

Authentication is intentionally delayed until purchase to reduce friction.

## Entry Points

Users may be asked to authenticate when attempting to:

- Book movie tickets
- Purchase snacks
- Access Rewards
- View Profile
- View Booking History

---

## Login Flow

```
User Initiates Purchase
            ↓
Authentication Required
            ↓
Choose Login Method
            ↓
Successful Authentication
            ↓
Return To Previous Flow
```

---

## Supported Authentication Methods

- Mobile Number + OTP
- Google Sign-In
- Apple Sign-In (iOS)

---

## Authentication Principles

- Never interrupt browsing.
- Preserve user progress.
- Return users to the exact screen after login.
- Never clear cart during authentication.

---

# Browse Movies Flow

## Flow

```
Home
        ↓
Movies Tab
        ↓
Browse Movies

        OR

Search Movies / Search Theatres

        ↓
Movie Details
        ↓
Select Theatre
        ↓
Select Show Time
```

---

## Search Behaviour

The Movies tab contains a unified search experience.

Search results may include:

- Movies
- Theatres

Results should be grouped clearly so users understand whether they are selecting a movie or a theatre.

---

## Movie Details

Movie Details includes:

- Poster
- Synopsis
- Language
- Genre
- Duration
- Rating
- Available Formats
- Available Theatres
- Show Timings

Primary CTA

```
Book Tickets
```

---

# Movie Details Flow

```
Movie Details
        ↓
Choose Theatre
        ↓
Choose Show Time
        ↓
Seat Selection
```

---

## Theatre Selection

Users may:

- View all partner theatres
- Compare available show timings
- Select preferred theatre

Changing theatre later requires confirmation because seat selection will be cleared.

---

## Show Time Selection

Users select:

- Date
- Show Time

After confirmation they continue to Seat Selection.

---

# Theatre Selection Flow

```
Movie Details
        ↓
Available Theatres
        ↓
Choose Theatre
        ↓
Available Show Times
        ↓
Seat Selection
```

---

## Theatre Information

Each theatre may display:

- Theatre Name
- Distance
- Available Formats
- Available Languages
- Available Show Timings
- Snack Availability Indicator

---

# Seat Booking Flow

```
Seat Selection
        ↓
Select Seats
        ↓
Review Seats
        ↓
Continue
```

---

## Seat Selection Rules

Users can:

- Select available seats.
- Deselect selected seats.
- View seat categories.
- View pricing before confirmation.

Unavailable seats remain visible but cannot be selected.

---

## Seat Change Behaviour

If users change:

- Theatre
- Show Time

after selecting seats,

Snacky displays a confirmation dialog informing users that previously selected seats will be removed before continuing.

Seat selections are never cleared silently.

---

# Snack Ordering Flow

Snack ordering can be initiated through multiple user journeys depending on whether the user already has a movie booking.

---

## Snack Ordering Entry Points

Users can order snacks through the following journeys:

### Flow 1 — During Movie Booking

```
Movie Booking
        ↓
Seat Selection
        ↓
Snack Selection (Optional)
```

---

### Flow 2 — Existing Snacky Movie Booking

```
Home
        ↓
Snacks Tab
        ↓
Select Existing Booking
        ↓
Snack Catalogue
```

---

### Flow 3 — Existing Booking History

```
Bookings
        ↓
Select Booking
        ↓
Add Snacks
        ↓
Snack Catalogue
```

---

### Flow 4 — Standalone Snack Ordering

```
Home
        ↓
Snacks Tab
        ↓
Search Theatre
        ↓
Snack Catalogue
```

---

# Existing Booking Selection

If one or more upcoming Snacky movie bookings exist, users are presented with:

```
Upcoming Bookings

Movie A

Movie B

Movie C
```

Users may:

- Select an existing booking.
- Skip and continue with standalone snack ordering.

Selecting a booking automatically associates the snack order with that movie booking.

---

# Standalone Snack Ordering

Standalone ordering is designed for users who:

- Did not purchase movie tickets through Snacky.
- Purchased tickets through another platform.
- Only want to purchase snacks.

Flow

```
Snacks Tab
        ↓
Search Theatre
        ↓
Select Theatre
        ↓
Snack Catalogue
```

---

# Theatre Search

The Snacks tab search only returns:

- Partner Theatres

Movies are never displayed in this search because snack availability depends entirely on the selected theatre.

---

# Snack Catalogue

After theatre selection, users can:

- Browse snack categories.
- Search available snacks.
- View combo offers.
- View item details.
- View pricing.
- Add items to cart.

Snack search becomes available only after entering the snack catalogue.

---

# Snack Details

Each snack includes:

- Image
- Name
- Description
- Category
- Price
- Veg (🟢) / Non-Veg (🔴) Indicator
- Allergen Information (e.g., Contains Milk, Soy, Caffeine)
- Availability
- Customizations (if available)

Primary CTA

```
Add to Cart
```

---

# Cart Flow

```
Add Item
        ↓
Cart
        ↓
Update Quantity
        ↓
Continue Shopping

        OR

Checkout
```

---

## Cart Behaviour

Users can:

- Increase quantity.
- Decrease quantity.
- Remove items.
- Continue browsing.
- Review pricing.
- View unavailable items.

If a snack becomes unavailable before checkout:

- The item remains in the cart.
- It is clearly marked as unavailable.
- Users are asked to review the cart before proceeding.

Snacky never removes unavailable items automatically.

---

# Checkout Flow

Checkout is shared across:

- Ticket Only
- Snacks Only
- Ticket + Snacks

```
Cart
        ↓
Checkout
        ↓
Review Order
        ↓
Choose Fulfilment
        ↓
Payment
```

---

## Checkout Summary

Users review:

- Tickets
- Snacks
- Quantity
- Pricing
- Taxes
- Fees
- Discounts
- Rewards
- Final Total

Users may still return to the cart before payment.

---

# Fulfilment Flow

Users choose how they would like to receive their snack order.

```
Checkout
        ↓
Choose Fulfilment
```

Available fulfilment methods are displayed together with their pricing.

No fulfilment charges are hidden.

---

## Express Pickup

Available to all users.

```
Checkout
        ↓
Express Pickup
        ↓
Payment
```

Eligible users include:

- Snack-only customers.
- Movie ticket customers.
- Customers who booked through other ticketing platforms.

After order preparation:

```
Notification
        ↓
Visit Express Pickup Counter
        ↓
Show QR Code / OTP
        ↓
Receive Order
```

---

## Seat Delivery

Available only for eligible Snacky bookings.

```
Checkout
        ↓
Seat Delivery
        ↓
Choose Delivery Slot
        ↓
Payment
```

Available delivery slots:

- Before Movie Starts
- During Intermission

Seat Delivery displays:

- Delivery fee
- Estimated delivery timing
- Delivery instructions

---

## Seat Delivery Eligibility

Seat Delivery is available only when:

- Movie ticket was booked through Snacky.
- Theatre supports Seat Delivery.
- Delivery window is still open.
- User selects Seat Delivery.
- Additional delivery fee is accepted.

If eligibility conditions are not met:

- Seat Delivery remains visible.
- It is disabled.
- Snacky explains why the option is unavailable.
- Express Pickup remains available.

---

# Payment Flow

Snacky uses a unified payment flow for all purchase journeys.

Supported purchase combinations include:

- Movie Ticket Only
- Snacks Only
- Movie Ticket + Snacks

All purchases follow the same payment experience.

---

## Payment Flow

```
Checkout
        ↓
Review Order
        ↓
Choose Payment Method
        ↓
Confirm Payment
        ↓
Payment Processing
        ↓
Success / Failure
```

---

## Payment Methods

Supported payment methods may include:

- UPI
- Credit Card
- Debit Card
- Net Banking
- Digital Wallets

---

## Successful Payment

After successful payment:

```
Payment Success
        ↓
Booking / Order Confirmation
        ↓
Generate QR Code
        ↓
Generate OTP
        ↓
Confirmation Screen
```

Users receive:

- Booking confirmation
- Order summary
- QR Code
- OTP
- Digital receipt
- Notification

---

## Payment Failure

If payment fails:

```
Payment Failed
        ↓
Failure Reason
        ↓
Retry Payment

OR

Choose Another Payment Method
```

Snacky preserves:

- Selected seats
- Snack selections
- Fulfilment method
- Cart contents

Users never need to rebuild their order after a payment failure.

---

# Order History Flow

Bookings consolidates movie tickets and snack orders into a single experience.

```
Bookings
        ↓
Upcoming
Completed
Cancelled
```

---

## Upcoming Bookings

Each booking displays:

- Movie Details
- Theatre
- Show Time
- Seat Information
- Snack Order Status
- Fulfilment Method
- QR Code
- OTP

Available actions:

- View Booking
- Add Snacks
- View Receipt
- Contact Support (if required)

---

## Completed Bookings

Users can:

- View completed ticket bookings.
- View completed snack orders.
- View receipts.
- View order details.

---

## Cancelled Bookings

Users can:

- View cancellation details.
- View refund status (if applicable).

---

## Add Snacks Flow

Users may add snacks through either entry point:

### Home

```
Home
        ↓
Snacks
        ↓
Select Existing Booking
        ↓
Snack Catalogue
```

---

### Bookings

```
Bookings
        ↓
Select Booking
        ↓
Add Snacks
        ↓
Snack Catalogue
```

Both entry points follow the same checkout, fulfilment, and payment flow.

---

# Rewards Flow

Snacky rewards repeat purchases through its loyalty program.

```
Rewards
        ↓
Available Rewards
        ↓
Reward Details
        ↓
Redeem Reward
```

---

## Reward Behaviour

Users can:

- View available rewards.
- View reward history.
- Redeem eligible rewards.
- Apply rewards during checkout.

Reward points are credited only after successful order completion.

---

# Profile Flow

```
Profile
        ↓
Personal Information
        ↓
Preferences
        ↓
Payment Methods
        ↓
Notification Settings
        ↓
Help & Support
```

---

## Profile Management

Users can:

- Update personal details.
- Manage saved payment methods.
- Manage notification preferences.
- View account information.
- Access Help & Support.
- Log out.

---

# Error Flows

Snacky communicates errors clearly while preserving user progress wherever possible.

---

## Authentication Failure

```
Login
        ↓
Authentication Failed
        ↓
Retry
```

User progress is preserved.

---

## Payment Failure

```
Payment
        ↓
Failed
        ↓
Retry
```

The complete order remains intact.

---

## Theatre Unavailable

```
Selected Theatre
        ↓
Unavailable
        ↓
Choose Another Theatre
```

---

## Show Time Unavailable

```
Selected Show
        ↓
Sold Out / Unavailable
        ↓
Choose Another Show
```

Previously selected seats are cleared only after user confirmation.

---

## Snack Unavailable

If an item becomes unavailable before checkout:

- Keep the item in the cart.
- Clearly mark it as unavailable.
- Ask the user to review the cart.
- Allow users to remove or replace the item.

Snacky never removes unavailable items automatically.

---

## Seat Delivery Unavailable

If Seat Delivery cannot be selected:

- Keep the option visible.
- Disable selection.
- Explain the reason.
- Continue to offer Express Pickup.

---

## Network Failure

If connectivity is lost:

- Inform the user.
- Preserve current progress.
- Allow retry when connectivity returns.

---

# Edge Cases

---

## Multiple Upcoming Bookings

If users have multiple upcoming bookings:

- Display all eligible bookings.
- Allow users to choose one booking.
- Allow users to skip and continue with standalone snack ordering.

---

## Standalone Snack Orders

Users without a Snacky movie booking can:

- Search a partner theatre.
- Browse available snacks.
- Complete payment.
- Collect via Express Pickup.

---

## Movie Ticket Booked Elsewhere

Users who booked tickets through another platform can:

- Search for the theatre.
- Order snacks.
- Use Express Pickup.

Seat Delivery is unavailable for these orders.

---

## Movie Ticket Without Snacks

Users may complete a movie ticket booking without purchasing snacks.

Snacks can be added later through:

- Home → Snacks
- Bookings → Add Snacks

---

## Snack Order Without Ticket

Users may order snacks without booking a movie ticket through Snacky.

The fulfilment option is limited to those supported for standalone snack orders.

---

## Fulfilment Window Closed

If the Seat Delivery ordering window has closed:

- Seat Delivery remains visible but disabled.
- The reason is displayed.
- Express Pickup remains available.

---

## Cart Across Multiple Theatres

Users may maintain independent carts and orders across multiple theatres and shows.

Each checkout is completed independently based on its associated theatre and fulfilment method.

---

## Navigation Principles

Across all user journeys:

- Never silently remove user selections.
- Preserve progress whenever possible.
- Clearly explain unavailable options.
- Always provide a path to recovery from errors.
- Maintain consistency across all booking and ordering experiences.