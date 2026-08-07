# 07_AI_System.md

# AI System

**Product Name:** Snacky  
**Version:** 1.0

---

# Purpose

The Snacky AI System enhances the customer experience through intelligent recommendations and conversational assistance.

The objective is not to automate the entire product, but to help users discover better movies, choose suitable snacks, understand offers, and receive timely assistance throughout their booking journey.

AI should always feel helpful, transparent, and trustworthy.

---

# AI Design Principles

Snacky's AI follows five core principles.

---

## Helpful

Every recommendation should solve a user problem.

Examples:

- Discover a movie.
- Find a suitable snack.
- Save money through relevant offers.

---

## Transparent

Users should understand why something is being recommended.

Example:

```
Recommended because you frequently watch Action movies.
```

or

```
Popular combo at your selected theatre.
```

AI recommendations should never feel random.

---

## Human

The assistant should communicate using:

- Friendly language
- Simple sentences
- Easy-to-understand explanations

Avoid technical terminology.

---

## Non-Intrusive

AI should assist users rather than interrupt them.

Recommendations should appear naturally within the booking journey without creating unnecessary distractions.

---

## Trustworthy

AI should recommend what genuinely benefits the user instead of maximizing clicks or purchases.

---

# Recommendation Engine

Snacky's AI Recommendation Engine provides contextual suggestions during the booking journey.

Recommendations include:

- Movies
- Snacks
- Combo Offers
- Promotional Offers

---

## Recommendation Locations

### Home Screen

Recommend:

- Popular Movies
- Recommended Movies
- Promotional Offers

---

### Theatre Selection

Recommend:

- Popular Shows
- Theatre Best Sellers
- Combo Offers

---

### Snack Selection

Recommend:

- Frequently Ordered Snacks
- Popular Combos
- Theatre Best Sellers

Recommendations should complement—not replace—the standard snack catalogue.

---

# Hybrid Recommendation Strategy

Snacky combines multiple recommendation techniques to improve relevance.

---

## Rule-Based Recommendations

Examples:

- Theatre Best Sellers
- Limited-Time Promotions
- Festival Offers
- New Movie Releases

These recommendations follow predefined business rules.

---

## Collaborative Filtering

Recommend items based on similar user behavior.

Example:

```
Users who watched this movie also ordered these snacks.
```

---

## Content-Based Recommendations

Recommend content based on user preferences.

Examples:

- Favourite Genres
- Preferred Theatres
- Language Preference
- Previous Snack Purchases

---

## Recommendation Priority

```
Personal Preferences
        ↓
Previous Purchases
        ↓
Popular Theatre Choices
        ↓
Business Promotions
```

Business promotions should never completely override personalized recommendations.

---

# Personalization

Snacky's AI personalizes recommendations using:

- Previous Movie Bookings
- Previous Snack Purchases
- Favourite Genres
- Preferred Theatres
- Language Preference

The recommendation model should improve over time as more interaction data becomes available.

---

## Smart Snack Recommendations

AI may recommend snacks using:

- Movie Genre
- Time of Day
- Previous Orders
- Theatre Best Sellers
- Weather Conditions
- Combo Popularity

Examples:

Action Movie

↓

Large Popcorn Combo

---

Morning Show

↓

Coffee + Sandwich

---

Family Movie

↓

Family Combo

---

Rainy Weather

↓

Hot Beverage Recommendations

---

# AI Assistant

Snacky's AI Assistant helps users complete tasks more efficiently.

The assistant should always prioritize direct answers over lengthy conversations.

---

## Supported Tasks

Users can ask the assistant to:

- Find movies
- Recommend snacks
- Explain offers
- Check booking status
- Ask refund questions
- Track seat delivery

---

## Assistant Personality

The assistant should be:

- Friendly
- Helpful
- Easy to understand
- Concise
- Professional when necessary

Avoid robotic or overly promotional responses.

---

## Example Queries

```
Recommend snacks for this movie.

```

```
Which combo saves the most money?

```

```
Where is my booking?

```

```
When will my seat delivery arrive?

```

```
What offers are available today?

```

---

# AI Guardrails

Snacky's AI must always operate within clearly defined ethical boundaries.

---

## Recommendations Must Not

- Manipulate users into unnecessary purchases.
- Create fake urgency.
- Mislead users about discounts.
- Spam users with recommendations.
- Favor sponsored content without disclosure.
- Make biased recommendations.

---

## Human Oversight

Business teams should retain control over:

- Promotional campaigns
- Recommendation rules
- Seasonal offers
- AI configuration

AI should support business decisions rather than replace them.

---

# Privacy Principles

Snacky's AI should respect user privacy at every stage.

---

## Data Usage

AI should only use data required for personalization.

Examples include:

- Booking history
- Snack purchase history
- Favourite genres
- Preferred theatres
- Language preference

---

## User Control

Users should be able to opt out of personalized recommendations while continuing to use the core features of Snacky.

---

## Sensitive Data

AI must never infer or store sensitive personal attributes unrelated to the service.

---

## Data Sharing

Personal booking history must never be shared with partner theatres for marketing or advertising purposes.

Partner theatres should receive only the operational data required to fulfil bookings and snack orders.

---

## Explainable Recommendations

Where appropriate, AI should explain why a recommendation is shown.

Examples:

- Recommended because you enjoy Action movies.
- Popular snack at your selected theatre.
- Frequently ordered with this movie.

---

# Future AI Features

## Voice Assistant

Future versions of Snacky may support voice-based interactions.

Possible use cases include:

- Search movies using voice.
- Find nearby theatres.
- Recommend snacks.
- Check booking status.
- Track seat delivery.
- Explain promotional offers.

The Voice Assistant should follow the same personality, privacy, and guardrail principles as the text-based AI Assistant.

---

# AI System Summary

Snacky's AI is designed to enhance—not replace—the movie booking experience.

Its primary responsibilities are to:

- Help users discover relevant movies.
- Recommend snacks and combo offers.
- Surface meaningful promotions.
- Provide quick conversational assistance.
- Deliver transparent and privacy-conscious recommendations.

Every AI interaction should remain helpful, explainable, user-centric, and aligned with Snacky's premium cinema experience.