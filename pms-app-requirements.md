# PMS & Cycle Wellness App — Requirements

## Overview

A fun, playful, and judgment-free mobile app that helps women of all ages understand, track, and manage their menstrual cycle and PMS — not just predict dates. Unlike Flo or Clue which focus on data logging, this app focuses on **education + action + emotional support**, telling women _why_ they feel what they feel and _what to do about it_. A partner mode lets the people around them understand and show up better.

**Free forever. No paywall. No ads.**

---

## Target Users

| User Type                  | What they need                                           |
| -------------------------- | -------------------------------------------------------- |
| General women (any age)    | Cycle prediction, symptom tracking, awareness            |
| Women with severe PMS/PMDD | Symptom patterns, AI support, abnormality alerts         |
| Teens / first-timers       | Simple education, friendly tone, no scary medical jargon |
| Education-seekers          | Phase-based content explaining the WHY behind symptoms   |
| Partners / family          | Understanding the cycle, how to support today            |

The app adapts its content depth based on user-selected experience level during onboarding (First Timer / Somewhat Familiar / I Know My Cycle).

---

## App Personality

**Fun & Playful — like a knowledgeable best friend who happens to know everything about periods.**

- No clinical coldness, no scary language
- Uses friendly nicknames for cycle phases (e.g. "Glow Week", "The Dip", "PMS Week", "Flow Days")
- Emoji-forward UI, warm color palette (not just pink — purples, corals, soft teals)
- Short, punchy copy ("Your uterus is doing the most right now 🌊")
- Celebrates self-awareness ("You logged 7 days in a row! Your body thanks you 🎉")

---

## The Four Cycle Phases

The entire app is structured around 4 phases:

| Phase        | Approx Days | Friendly Name | What's Happening                         |
| ------------ | ----------- | ------------- | ---------------------------------------- |
| Menstruation | Day 1–5     | 🩸 Flow Days  | Bleeding, lower energy, cramps           |
| Follicular   | Day 6–13    | ✨ Glow Week  | Rising estrogen, high energy, creativity |
| Ovulation    | Day 14–16   | 💫 Peak Days  | Highest energy, confidence, social       |
| Luteal / PMS | Day 17–28   | 🌧️ The Dip    | Progesterone drop, PMS symptoms          |

All content, suggestions, AI responses, and partner tips are **phase-aware**.

---

## Core Features (v1)

### 1. Cycle & Period Prediction

- Log period start and end dates
- App learns cycle length over time and improves predictions
- Calendar view showing predicted phases for next 3 months
- Handles irregular cycles gracefully (no "you're abnormal" vibes)
- Reminders: "Your period is coming in 3 days 🗓️"

### 2. Daily Symptom Logging

Quick, tap-based daily check-in (takes < 1 minute):

**Trackable symptoms:**

- 😊 Mood (Happy, Anxious, Irritable, Sad, Flat, Energized, Calm)
- ⚡ Energy (High / Medium / Low / Exhausted)
- 🤕 Pain (Cramps, Headache, Back pain, Breast tenderness) with intensity scale 1–5
- 🍕 Cravings (Sweet, Salty, Carbs, Nothing / Everything)
- 💧 Bloating (None / Mild / Bad)
- 😴 Sleep quality (Great / OK / Poor)
- 🌊 Flow intensity (if in period — Light / Medium / Heavy / Spotting)
- 🧠 Mental clarity (Sharp / Foggy / Scattered)
- 💬 Social battery (Social / Neutral / Leave me alone)

All symptoms are optional — log what you want, skip what you don't.

### 3. Educational Content Per Phase

Each day, users see a "Phase Card" explaining what's happening in their body **and why**:

- "Why do I feel so anxious right now?" → Progesterone is peaking and affecting GABA receptors
- "Why do I crave sugar before my period?" → Serotonin drops, your brain wants a quick fix
- "Why am I so social this week?" → Estrogen surge = confidence and communication boost

Content is written in plain English, no jargon. Short reads (< 2 min). Expandable for those who want to go deeper. Categories:

- 🧬 What's happening hormonally
- 🍎 What to eat (and avoid) this phase
- 🏃 Movement suggestions (hard workout vs. gentle yoga)
- 😴 Sleep & rest tips
- 💆 Emotional & mental health support
- ⚠️ When to see a doctor (red flag symptoms)

### 4. Notifications & Reminders

Smart, friendly push notifications:

- Period start prediction reminder (3 days before, 1 day before)
- Daily check-in nudge (user sets preferred time)
- Phase transition alert ("You're entering The Dip — here's what to expect 🌧️")
- Hydration / self-care nudges during PMS week
- "You haven't logged in 3 days — we miss you! 💕"
- All notifications are **opt-in** and fully customizable

### 5. AI Chat Assistant ("Luna" 🌙)

A friendly AI companion the user can talk to anytime.

**What Luna can do:**

- Answer "why am I feeling this?" based on current cycle phase
- Suggest food, movement, and lifestyle changes per phase
- Provide emotional support in "just listen" mode (empathetic, non-advice-giving)
- Explain medical terms in plain, friendly language (PMDD, endometriosis, luteal phase, etc.)
- Warn if logged symptoms sound abnormal and suggest seeing a doctor
- Remember the user's recent logs for context ("I see you've had cramps 3 days in a row…")

**Luna's personality:** Warm, fun, a little cheeky. Never preachy. Never dismissive.

**What Luna does NOT do:**

- Diagnose medical conditions
- Replace professional medical advice
- Make the user feel broken or abnormal

Powered by Anthropic Claude API (claude-sonnet-4-6). System prompt is phase-aware and log-aware.

### 6. Partner Mode

A separate lightweight view for the user's partner (or trusted family member).

**How it works:**

- User sends an invite link/code to their partner
- Partner downloads the app and creates a "Support Account" (different from a user account)
- Partner sees a simplified, real-time dashboard

**What the partner sees:**

- Current phase with friendly name and emoji
- Today's mood and energy (if user has logged)
- 2–3 personalized "How to support her today" tips based on phase
  - e.g. during PMS: "She may need more reassurance than usual. Don't take mood changes personally. A warm meal or her favorite snack goes a long way 🍫"
  - e.g. during Glow Week: "She's probably feeling great! Great time for plans, deep conversations, or doing something fun together ✨"
- A simple "Send love" button that sends a push notification to the user ("Your person is thinking of you 💕")

**What the partner does NOT see:**

- Symptom details (pain, flow, cravings) — unless user explicitly enables full sharing
- Historical logs
- AI conversations

User has full control over what the partner can see, togglable per category from settings.

---

## Onboarding Flow

1. **Welcome screen** — fun animation, "Hey! Let's get to know your cycle 🌙"
2. **Experience level** — First Timer / Somewhat Familiar / I Know My Cycle
3. **Basic info** — Age range (13–17 / 18–25 / 26–35 / 36+), no name required
4. **Last period date** — calendar picker, or "I'm not sure" option
5. **Average cycle length** — slider (21–35 days), or "It's irregular" option
6. **Symptoms to track** — let user pick which ones matter to them (customizable from day 1)
7. **Notification preferences** — opt-in, choose time
8. **Partner mode setup** — optional, can skip
9. **Account creation** — email + password (bcrypt, no email verification), or skip for now (local mode)

---

## Screens (v1)

| Screen             | Description                                                          |
| ------------------ | -------------------------------------------------------------------- |
| **Home / Today**   | Phase card, quick log button, Luna shortcut, next period countdown   |
| **Calendar**       | Month view with phase colors, logged days, upcoming predictions      |
| **Log**            | Daily symptom check-in (tap-based, quick)                            |
| **Insights**       | Symptom patterns over time, charts, "Your PMS usually hits on day X" |
| **Learn**          | Phase-based article library, searchable, bookmarkable                |
| **Luna (AI Chat)** | Full-screen chat with Luna, phase-aware context                      |
| **Partner View**   | Separate simplified home for partner accounts                        |
| **Settings**       | Cycle settings, notification prefs, partner sharing, account         |

---

## Authentication

- Email + password (bcrypt, salt rounds 12, JWT in httpOnly cookie)
- No email verification in v1 — account active immediately
- **Local mode** — use the app without an account, data stored on device only
- Cloud sync when account is created
- No Google OAuth in v1 (v2)

---

## Data Privacy

- No health data sold or shared with third parties — ever
- Data encrypted at rest
- Users can export all their data as JSON anytime
- Users can delete account + all data with one tap
- Partner mode data shared only with explicit user consent per category

---

## Tech Stack

| Layer         | Choice                                                                        | Notes                                |
| ------------- | ----------------------------------------------------------------------------- | ------------------------------------ |
| Mobile        | **React Native + Expo**                                                       | iOS + Android from one codebase      |
| Navigation    | **Expo Router**                                                               | File-based routing, latest pattern   |
| Styling       | **NativeWind** (Tailwind for RN)                                              | Consistent design tokens             |
| Backend       | **Next.js 15** (API Routes)                                                   | Serverless, deployed on Vercel       |
| Database      | **MongoDB Atlas**                                                             | Flexible schema for symptom logs     |
| ODM           | **Mongoose**                                                                  | Familiar, works well with Atlas      |
| Auth          | **bcrypt + JWT**                                                              | httpOnly cookie, no third-party auth |
| AI            | **Anthropic Claude API or other free providers gemini or openrouter etc.** () | Luna chat assistant                  |
| Notifications | **Expo Notifications**                                                        | Push notifications iOS + Android     |
| Hosting       | **Vercel**                                                                    | Next.js API + static assets          |

---

## Data Models (rough)

```
User
  _id, email, passwordHash, experienceLevel, ageRange,
  cycleLength, lastPeriodDate, isIrregular, partnerId,
  trackedSymptoms[], notificationPrefs, createdAt

CycleLog (one per day)
  _id, userId, date, phase, mood, energy, pain{type, intensity}[],
  cravings[], bloating, sleepQuality, flowIntensity,
  mentalClarity, socialBattery, notes, createdAt

PartnerAccount
  _id, email, passwordHash, linkedUserId, sharedFields[],
  createdAt

Article
  _id, phase, category, title, body, readTimeMinutes,
  tags[], isBookmarkedBy[]

ChatMessage
  _id, userId, role (user | assistant), content, phase,
  timestamp
```

---

## Nice-to-Have (v2)

- Google OAuth login
- Hindi language support
- Cycle-aware workout plans (partnerships with fitness apps)
- Doctor report export — shareable PDF of symptom history
- Community / anonymous Q&A ("Ask other women")
- Apple Health / Google Fit integration
- Wearable data input (sleep, HRV from Fitbit/Oura)
- PMDD mode — more detailed mental health tracking
- Menopause / perimenopause mode
- Pregnancy mode
