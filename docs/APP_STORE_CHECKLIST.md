# App Store Submission Checklist

> **When to use**: Week 2, after core features are built
> **Status**: Pre-flight checklist, not blocking development

---

## Before You Build (Architecture Decisions)

- [x] Subscription system planned (RevenueCat)
- [x] Analytics approach decided (Convex + optional Mixpanel/PostHog)
- [x] Deep linking: NOT needed for MVP (book QR codes just link to App Store)
- [ ] Push notification categories registered

---

## Apple Developer Account

- [ ] Active Apple Developer membership ($99/year)
- [ ] App ID created in developer portal
- [ ] Provisioning profiles set up (EAS handles this)
- [ ] Push notification certificates configured

---

## App Store Connect Setup

- [ ] Create new app in App Store Connect
- [ ] Set bundle ID (match `app.json`)
- [ ] Configure in-app purchases:
  - [ ] Monthly subscription ($4.99)
  - [ ] Annual subscription ($39.99)
  - [ ] Subscription group created
- [ ] Link to RevenueCat

---

## Required Assets

| Asset | Spec | Status |
|-------|------|--------|
| App Icon | 1024x1024 PNG, no transparency | [ ] |
| iPhone Screenshots (6.7") | 1290 x 2796 px, 3-10 images | [ ] |
| iPhone Screenshots (6.5") | 1284 x 2778 px (optional but recommended) | [ ] |
| iPad Screenshots | 2048 x 2732 px (if supporting iPad) | [ ] |
| App Preview Video | 30 sec max, optional | [ ] |

---

## App Store Listing Content

### Text Content
- [ ] App name (30 chars max): "The Pause - Mind Mastery"
- [ ] Subtitle (30 chars max): "Breathe. Visualize. Focus."
- [ ] Description (4000 chars max)
- [ ] Keywords (100 chars max, comma-separated)
- [ ] Promotional text (170 chars, can update without review)
- [ ] What's New (for updates)

### URLs
- [ ] Privacy Policy URL (required)
- [ ] Terms of Service URL (required for subscriptions)
- [ ] Support URL
- [ ] Marketing URL (optional)

### Contact Info
- [ ] Support email
- [ ] Phone number (optional)

---

## Legal Requirements

### Privacy Policy Must Include:
- [ ] What data we collect (habits, sessions, intentions)
- [ ] How we use the data
- [ ] Third-party services (Clerk, Convex, RevenueCat, Resemble)
- [ ] User rights (data deletion, export)
- [ ] Contact information

### Subscription Terms Must Show:
- [ ] Price and billing period
- [ ] Free trial details (if any)
- [ ] Auto-renewal disclosure
- [ ] How to cancel
- [ ] Link to Apple's EULA

---

## In-App Requirements (Apple Review Will Check)

### Subscriptions
- [ ] "Restore Purchases" button visible in Settings
- [ ] Subscription terms visible before purchase
- [ ] Clear indication of what's free vs. premium
- [ ] Price displayed in local currency

### Sign-In
- [ ] App must show value before requiring sign-in
- [ ] Sign in with Apple required if we offer any social login
- [ ] Guest mode or skip option available

### Health/Wellness Language
- [ ] NO health claims - we teach practices, not treatments
- [ ] Use: "relaxation," "focus," "mental clarity," "well-being"
- [ ] Avoid: "treat," "cure," "therapy," "anxiety disorder," "clinical"
- [ ] Frame as: "tools for taking control of your mind" not medical intervention
- [ ] Dr. Miller is "clinical psychologist" in bio only, not in app marketing claims

### Content
- [ ] All content appropriate for rated age
- [ ] No placeholder content ("Lorem ipsum")
- [ ] No broken links or empty screens

---

## Build & Submit

### EAS Build Commands
```bash
# Create production build
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios
```

### TestFlight First
- [ ] Submit build to TestFlight
- [ ] Internal testing (your devices)
- [ ] External testing (beta users, Dr. Miller)
- [ ] Collect feedback, fix issues
- [ ] Then submit for App Store review

### Common Rejection Reasons to Avoid
1. **Broken functionality** - Test everything before submit
2. **Incomplete metadata** - Fill out all required fields
3. **Missing Restore Purchases** - Must have for subscriptions
4. **Forcing login** - Show app value first
5. **Inadequate privacy policy** - Must cover all data collection
6. **Misleading screenshots** - Must match actual app
7. **Health claims without disclaimers** - Be careful with language

---

## Post-Launch

- [ ] Monitor crash reports (Sentry or EAS)
- [ ] Respond to App Store reviews
- [ ] Track key metrics (downloads, retention, conversion)
- [ ] Plan first update based on feedback

---

## Monetization Features

### "Book a Call" Integration
Simple URL link to scheduling tool (Calendly, Acuity, etc.)

**Placement options:**
1. Settings screen: "Work with Dr. Miller directly"
2. After X pauses: Gentle prompt
3. Coach response: "For clinical guidance, book a session"
4. Premium upgrade screen: "Or work with Dr. Miller 1:1"

**Implementation:**
```typescript
import { Linking } from 'react-native';

const BOOKING_URL = 'https://calendly.com/dr-miller/consultation';

function openBookingLink() {
  Linking.openURL(BOOKING_URL);
}
```

### Affiliate/Referral (Future)
- Share codes for free premium months
- Track book purchases from app users

---

*Checklist created: December 2024*
*Reference when preparing for App Store submission*
