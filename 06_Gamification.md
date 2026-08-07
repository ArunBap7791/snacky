# 06_Gamification.md

# Gamification System

**Product Name:** Snacky  
**Version:** 1.0

---

# Purpose

The Snacky Gamification System is designed to strengthen customer loyalty by rewarding repeat engagement rather than encouraging addictive behavior.

The system focuses on long-term customer retention, increased booking frequency, and higher snack purchases while maintaining a premium cinema experience.

Unlike traditional games, Snacky's gamification is subtle, reward-driven, and seamlessly integrated into the booking journey.

---

# Business Objectives

The Gamification System supports three primary business goals:

- Increase repeat movie bookings.
- Increase repeat snack purchases.
- Build a long-term customer loyalty ecosystem.

Every mechanic introduced into the system should directly support at least one of these objectives.

---

# Design Principles

Snacky's gamification follows these principles:

### Reward Real Purchases

Users earn rewards by completing meaningful transactions rather than repetitive actions.

---

### No Artificial Engagement

Snacky intentionally avoids mechanics that encourage unnecessary daily app usage.

Examples excluded from the system:

- Daily Login Rewards
- Daily Check-in Bonuses
- Endless Reward Spins
- Artificial Time-Based Engagement

---

### Transparent Rewards

Users should always understand:

- Why they earned XP.
- How much XP they earned.
- How much XP is required for the next level.
- What benefits each level unlocks.

There should never be hidden calculations.

---

### Premium Experience

Rewards should enhance the cinema experience rather than distract from it.

The system should feel like an exclusive membership program instead of a traditional gaming reward system.

---

# XP System

XP (Experience Points) measures a customer's loyalty and engagement with Snacky.

XP determines membership tier progression and unlocks exclusive benefits.

---

## XP Sources

Users earn XP only after a successful transaction.

Eligible actions include:

- Movie Ticket Booking
- Snack Purchase
- Combined Movie Ticket + Snack Purchase

No XP is awarded for:

- Opening the app
- Daily logins
- Browsing content
- Searching movies
- Searching theatres
- Cancelled orders
- Failed payments
- Refunded transactions

---

## XP Allocation Strategy

Snacky rewards higher-value engagement.

Priority:

```
Movie + Snacks
        ↓
Movie Booking
        ↓
Snack Purchase
```

Combined purchases should earn more XP than either purchase independently.

Exact XP values remain configurable by business administrators.

---

## XP Rules

XP is credited only when:

- Payment is successful.
- Booking is confirmed.
- Snack order is successfully placed.

XP is not credited during payment initiation or cart creation.

---

## XP Expiration

XP expires exactly **365 days** from its earning date.

Expired XP is automatically deducted from the user's total.

Users should receive reminders before XP expiration.

Recommended notifications:

- 30 Days Remaining
- 7 Days Remaining
- 1 Day Remaining

---

# Levels

Snacky uses a simple three-tier membership system.

```
Silver
    ↓
Gold
    ↓
Platinum
```

Membership reflects long-term loyalty rather than short-term activity.

---

## XP Progression

| Tier | XP Required |
|------|------------:|
| Silver | 0–999 XP |
| Gold | 1,000–4,999 XP |
| Platinum | 5,000+ XP |

These thresholds are configurable business values and may be adjusted as the platform evolves.

---

## Level Progress

Users can track their membership progress through:

- Profile Screen
- Rewards Screen

The progress indicator should clearly communicate:

- Current Membership
- Current XP
- XP Required for Next Level
- Progress Percentage

---

## Membership Upgrade

When sufficient XP is earned:

```
XP Earned
      ↓
Threshold Reached
      ↓
Membership Upgrade
      ↓
Benefits Activated
      ↓
Congratulations Screen
```

Membership upgrades should occur automatically without requiring user action.

---

## Membership Downgrade

If XP expires and falls below a membership threshold:

```
XP Expiration
        ↓
XP Recalculated
        ↓
Membership Updated
```

Users should receive a notification explaining the change before the downgrade takes effect.

---