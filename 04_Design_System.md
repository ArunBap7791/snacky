# 04_Design_System.md

# Design System

**Product Name:** Snacky  
**Product Type:** B2B2C Multi-Tenant Movie Ticket & Cinema Concession Platform  
**Platform:** Android • iOS • Tablet • Foldables  
**Version:** 1.0

---

# Purpose

This Design System establishes the visual language, interaction principles, reusable components, accessibility standards, and implementation guidelines for Snacky.

It serves as the single source of truth for designers and developers to ensure consistency, scalability, and a premium user experience across every screen.

---

# Design Philosophy

Snacky is not just a movie booking application.

It is a premium cinema companion that makes every interaction effortless—from discovering a movie to receiving snacks during the show.

Every interface should feel:

- Premium
- Cinematic
- Minimal
- Friendly
- Playful

The experience should reduce friction while allowing users to focus on enjoying their movie rather than navigating the application.

---

## Design Principles

### 1. Clarity Over Complexity

Users should immediately understand:

- Where they are.
- What they can do.
- What happens next.

Every screen should prioritize clarity over decoration.

---

### 2. One-Handed First

Snacky is primarily used while users are:

- Walking
- Waiting
- Standing in queues
- Sitting inside theatres

Critical interactions should remain comfortably reachable with one hand.

---

### 3. Reduce Cognitive Load

Users often make decisions under time pressure.

Examples:

- Booking tickets before seats sell out.
- Ordering snacks before the movie begins.
- Ordering during intermission.

Interfaces should:

- Present only relevant information.
- Minimize unnecessary decisions.
- Reduce visual noise.

---

### 4. Progressive Disclosure

Never overwhelm users.

Reveal information only when it becomes relevant.

Example:

Movie

↓

Seats

↓

Snacks

↓

Checkout

↓

Fulfilment

↓

Payment

Instead of displaying every option simultaneously.

---

### 5. Preserve Context

Users should never lose their progress unexpectedly.

Examples:

- Authentication
- Payment retry
- Network interruptions

must preserve the user's current state whenever possible.

---

### 6. Immediate Feedback

Every interaction should produce visible feedback.

Examples:

- Button press
- Add to cart
- Quantity changes
- Successful payment
- Errors
- Loading

Users should never wonder whether an action was successful.

---

### 7. Delight Through Motion

Animations should communicate purpose rather than decoration.

Motion should make the interface feel responsive without slowing users down.

---

# Brand Identity

## Brand Positioning

Snacky is a premium B2B2C platform connecting moviegoers with partner theatres for ticket booking and snack ordering.

The brand should communicate:

- Trust
- Simplicity
- Convenience
- Entertainment
- Premium Quality

---

## Brand Personality

Snacky is:

- Premium
- Modern
- Cinematic
- Friendly
- Playful
- Reliable
- Fast
- Human

---

## Emotional Goals

Users should feel:

- Excited before booking.
- Confident during checkout.
- Relaxed while ordering snacks.
- Delighted when receiving their order.

Every screen should contribute to these emotions.

---

# Design Language

Snacky's interface combines the strengths of three design philosophies.

---

## Apple Human Interface

Provides:

- Clean layouts
- Strong typography
- Natural spacing
- High readability
- Elegant interactions

---

## Linear

Provides:

- Precision
- Consistency
- Minimal visual noise
- Structured information hierarchy

---

## Arc Browser

Provides:

- Soft visual personality
- Friendly interactions
- Modern aesthetics
- Comfortable spacing

---

## Combined Experience

The resulting experience should feel:

- Elegant
- Fast
- Premium
- Approachable
- Modern

---

# Color System

## Primary

| Purpose | Color |
|----------|--------|
| Brand Primary | #FF2A55 |

Used for:

- Primary Buttons
- Active States
- Important Actions
- Progress Indicators
- Highlights

---

## Secondary

| Purpose | Color |
|----------|--------|
| Accent | #FFD000 |

Used for:

- Rewards
- Offers
- Promotional Elements
- Loyalty Features

---

## Success

| Purpose | Color |
|----------|--------|
| Success | #00E676 |

Used for:

- Successful Payments
- Booking Confirmation
- Positive Status
- Completed Orders

---

## Warning

| Purpose | Color |
|----------|--------|
| Warning | #FF9100 |

Used for:

- Delivery Window Closing
- Seat Availability Alerts
- Important Notifications

---

## Error

| Purpose | Color |
|----------|--------|
| Error | #FF5252 |

Used for:

- Payment Failures
- Form Errors
- Validation Messages
- Critical Alerts

---

## Neutral Palette

| Element | Color |
|----------|--------|
| Background | #0D0E12 |
| Surface | #181A20 |
| Text Primary | #F4F5F7 |
| Text Secondary | #9498A6 |

---

## Color Usage Principles

- Never rely on color alone to communicate meaning.
- Maintain sufficient contrast between foreground and background.
- Reserve Primary color for high-priority actions.
- Use Secondary color sparingly for promotional experiences.
- Error and Warning colors should attract attention without overwhelming the interface.
- Success color should reinforce positive outcomes.

---

# Typography

## Font Families

### iOS

SF Pro Display

---

### Android

Inter

---

## Typography Principles

Typography should prioritize:

- Readability
- Accessibility
- Clear hierarchy
- Consistency

Avoid decorative typography.

The interface should remain legible across all supported devices.

---

## Type Scale

| Style | Size | Weight |
|--------|------|---------|
| Display | 40 | Bold |
| H1 | 32 | Bold |
| H2 | 28 | Bold |
| H3 | 24 | Semibold |
| H4 | 20 | Semibold |
| H5 | 18 | Medium |
| Body Large | 16 | Regular |
| Body | 14 | Regular |
| Caption | 12 | Regular |
| Label | 11 | Medium |

---

## Typography Rules

- Use sentence case.
- Avoid excessive capitalization.
- Prefer concise labels.
- Keep line length comfortable for mobile reading.
- Maintain consistent spacing between headings and body text.

---

# Spacing

Snacky follows an 8-point spacing system.

## Base Unit

```
4px
```

---

## Spacing Scale

| Token | Value |
|--------|-------|
| XS | 4px |
| SM | 8px |
| MD | 16px |
| LG | 24px |
| XL | 32px |
| XXL | 48px |
| XXXL | 64px |

---

## Spacing Principles

Maintain generous whitespace to improve readability.

Use consistent spacing between:

- Sections
- Cards
- Buttons
- Form fields
- Navigation elements

Whitespace should create visual rhythm rather than empty space.

---

# Layout Grid

Snacky follows a responsive grid system that ensures consistency across mobile phones, tablets, and foldable devices.

---

## Mobile Grid

| Property | Value |
|----------|-------|
| Columns | 4 |
| Margin | 16px |
| Gutter | 16px |

Used for:

- Android
- iPhone

---

## Tablet Grid

| Property | Value |
|----------|-------|
| Columns | 8 |
| Margin | 24px |
| Gutter | 24px |

---

## Foldable Grid

| Property | Value |
|----------|-------|
| Folded | 4 Columns |
| Unfolded | 8 Columns |

The UI should seamlessly adapt between folded and unfolded states while preserving user context.

---

## Layout Principles

- Align all major content to the grid.
- Maintain consistent horizontal spacing.
- Avoid unnecessary full-width components.
- Prioritize thumb-friendly layouts.
- Keep primary actions within easy reach.

---

# Icons

Snacky uses the **Lucide** icon library.

---

## Icon Principles

Icons should be:

- Simple
- Minimal
- Easily recognizable
- Consistent in stroke weight
- Secondary to text

Icons should support content, not replace it.

---

## Icon Sizes

| Usage | Size |
|--------|------|
| Small | 16px |
| Default | 20px |
| Navigation | 24px |
| Hero | 32px |
| Empty States | 48px |

---

## Common Icons

- Home
- Search
- Movie
- Ticket
- Popcorn
- Shopping Cart
- Gift
- User
- Bell
- QR Code
- Clock
- Location
- Star
- Heart
- Wallet
- Settings
- Help Circle

---

## Icon Usage Rules

- Maintain consistent sizing within the same interface.
- Avoid mixing filled and outline styles.
- Pair icons with labels for important actions.
- Never rely solely on icons to communicate meaning.

---

# Illustrations

Illustrations should reinforce the brand without distracting from user tasks.

---

## Illustration Style

- Minimal
- Friendly
- Cinematic
- Rounded
- Modern
- Premium

---

## Usage

Illustrations are recommended for:

- Empty States
- Success Screens
- Error Screens
- Onboarding
- Rewards
- Promotions

Avoid illustrations during critical task flows such as checkout and payment.

---

# Motion

Motion should improve clarity and create a polished experience.

Animations should never slow down task completion.

---

## Motion Principles

- Purposeful
- Fast
- Responsive
- Delightful
- Non-intrusive

---

## Animation Duration

| Speed | Duration |
|--------|----------|
| Fast | 150ms |
| Standard | 250ms |
| Complex | 350ms |

---

## Motion Examples

### Page Transition

- Slide
- Fade

---

### Button Press

- Scale
- Ripple (Android)

---

### Bottom Sheet

- Slide Up
- Slide Down

---

### Cart

- Add to Cart animation
- Quantity change animation
- Badge count animation

---

### Loading

- Skeleton Loading
- Progress Indicators
- Circular Loader

---

### Success

- Booking Success
- Payment Success
- Snack Added
- Reward Earned

Use subtle celebration animations to reinforce successful actions.

---

# Components

Snacky follows a reusable component-driven design system.

Every component should:

- Be reusable.
- Support multiple states.
- Follow accessibility guidelines.
- Scale across all supported devices.

---

# Buttons

## Variants

- Filled
- Tonal
- Outline
- Text
- Disabled

---

## Sizes

| Size | Height |
|------|---------|
| Small | 40px |
| Medium | 48px |
| Large | 56px |

---

## Primary Button

Used for:

- Book Tickets
- Checkout
- Continue
- Pay Now

Only one primary button should appear within a major viewport whenever possible.

---

## Secondary Button

Used for:

- Cancel
- Back
- Skip
- View Details

---

## Button States

- Default
- Pressed
- Hover (Tablet)
- Focused
- Loading
- Disabled

---

# Movie Card

Displays:

- Poster
- Movie Name
- Language
- Genre
- Duration
- Rating
- Available Formats
- CTA (Book Tickets)

---

# Theatre Card

Displays:

- Theatre Name
- Distance
- Available Formats
- Available Languages
- Available Show Timings
- Snack Availability Indicator

Primary CTA:

```
Select Theatre
```

---

# Snack Card

Displays:

- Image
- Name
- Category
- Price
- Veg (🟢) / Non-Veg (🔴) Indicator
- Allergen Information (e.g., Contains Milk, Soy, Caffeine)
- Availability
- Quantity Stepper / Add Button

---

# Booking Card

Displays:

- Movie Poster
- Movie Name
- Theatre
- Show Time
- Seats
- Snack Status
- Fulfilment Method
- Booking Status

Available actions:

- View Booking
- Add Snacks
- View QR Code

---

# Reward Card

Displays:

- Reward Name
- Points Required
- Reward Description
- Expiry Date
- Redeem CTA

---

# QR Code Card

Displays:

- QR Code
- OTP
- Booking Reference
- Theatre
- Fulfilment Method

Used for:

- Express Pickup
- Seat Delivery Verification

---