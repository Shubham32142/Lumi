# Lumi 🌙 — PMS & Cycle Wellness App

> **Lumi** — your luminous cycle bestie. The name is the little sister of **Luna**, the in-app AI.
> The logo is a crescent moon cradling a glowing dot (see [`mobile/components/Logo.tsx`](./mobile/components/Logo.tsx)),
> and it plays as an animated intro on every launch ([`mobile/components/AnimatedSplash.tsx`](./mobile/components/AnimatedSplash.tsx)).

A fun, judgment-free app that helps women understand, track, and manage their cycle and PMS —
focused on **education + action + emotional support**, not just date prediction. Built to the
[pms-app-requirements.md](./pms-app-requirements.md) spec and the [ui-standards.md](./ui-standards.md)
visual standards.

This is a monorepo with two parts:

| Folder | What it is | Stack |
|--------|------------|-------|
| [`mobile/`](./mobile) | The app (works fully offline in **local mode**) | React Native · Expo Router · NativeWind · Zustand |
| [`backend/`](./backend) | API for accounts, cloud sync, and Luna (AI) | Next.js 15 · MongoDB/Mongoose · Anthropic Claude API |

---

## How the two specs were reconciled

The requirements ask for a **playful, emoji-forward** experience; the UI standards mandate a
**flat, classic, professional** visual system (no shadows, no gradients, no pill buttons, dark text
on light backgrounds, one accent per screen, a single token source of truth).

Both are honored by separating **content** from **structure**:

- **Playful = content.** Emojis, friendly phase names ("Glow Week", "The Dip"), and punchy copy live
  in the text and data — never in visual effects.
- **Professional = structure.** Every screen is flat white cards with 1px solid borders, `radius.md`
  buttons (never pills), no shadows/gradients, and a token-defined warm palette (a violet primary +
  four phase accent colors used as solid tags/dots, never gradients). Lucide outline icons throughout.
- **One source of truth.** [`mobile/theme/tokens.js`](./mobile/theme/tokens.js) defines every color,
  space, radius, font size, and dimension. `tailwind.config.js` is **generated from that same file**,
  so NativeWind classes and the typed `theme` object can never drift. Components reference tokens only.

---

## The four cycle phases

Everything (predictions, content, Luna, partner tips) is phase-aware:

| Phase | Friendly name | Accent |
|-------|---------------|--------|
| Menstruation | 🩸 Flow Days | rose |
| Follicular | ✨ Glow Week | teal |
| Ovulation | 💫 Peak Days | amber |
| Luteal / PMS | 🌧️ The Dip | indigo |

The cycle engine ([`mobile/lib/cycle.ts`](./mobile/lib/cycle.ts)) adapts phase boundaries to each
user's cycle length (ovulation ≈ 14 days before the next period) so irregular cycles never feel
"wrong", and it **learns** the average cycle length from logged period starts over time.

---

## Running the mobile app (local mode — no backend needed)

```bash
cd mobile
npm install
npx expo start
```

Open in Expo Go (scan the QR code) or press `i` / `a` for the iOS/Android simulator. Everything works
offline: onboarding, phase prediction, calendar, daily logging, insights, the Learn library, settings,
data export, and the partner-view preview. Data is persisted on-device with AsyncStorage.

**Luna (AI chat) is bring-your-own-key and runs entirely on-device** — no backend required. In
**Settings → Luna & AI** the user picks a provider (Claude, Gemini, OpenAI, or OpenRouter), pastes
their own API key, and chooses a model (a dropdown for Claude/Gemini, a free-text model field for
OpenAI/OpenRouter). The key is stored only on the device and the request goes straight to the chosen
provider — see [`mobile/lib/ai/`](./mobile/lib/ai). (The backend handles optional account sync only —
no AI key lives on the server; point the app at it via `extra.apiBaseUrl` in
[`mobile/app.json`](./mobile/app.json) if you want cloud features.)

The whole app is also **animated** — press-scale on every button/chip, staggered card entrances, a
floating phase emoji, a typing indicator for Luna, and a loading screen that cycles cheering quotes.
Daily logging **auto-saves on every tap** (no save button, no scrolling), and every screen reflects
changes live.

## Running the backend

```bash
cd backend
npm install
cp .env.example .env.local   # then fill in the three values
npm run dev                  # http://localhost:3000
```

`.env.local` needs just two values (no AI key — Luna runs on-device with the user's own key):

- `MONGODB_URI` — a MongoDB Atlas connection string
- `JWT_SECRET` — any long random string

### API endpoints

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/auth/signup` | — | Create account (bcrypt rounds 12, JWT in httpOnly cookie) |
| POST | `/api/auth/login` | — | Log in |
| POST | `/api/auth/logout` | — | Clear the auth cookie |
| GET / POST | `/api/logs` | ✅ | List / upsert daily logs (cloud sync) |
| POST | `/api/cycle/predict` | — | Stateless phase + period prediction |
| GET | `/api/partner` | ✅ | Partner-visible snapshot for the signed-in user |
| GET | `/api/health` | — | Health check |

---

## Building an Android APK

A signed, installable `Lumi.apk` has already been built (release variant, JS bundled, arm64-v8a).
To rebuild:

**Easiest — EAS (cloud, no local Android toolchain):**

```bash
cd mobile
npm install            # installs expo-asset + applies the NativeWind patch (postinstall)
npx eas-cli login
npx eas-cli build -p android --profile preview   # → downloadable APK (see eas.json)
```

**Local (Windows) — what it takes** (these were the real gotchas, now documented):

1. **JDK 17** — Gradle needs it. Point `JAVA_HOME`/`org.gradle.java.home` at a JDK 17 (e.g. Temurin).
2. **`npx expo prebuild -p android`** to generate `android/`.
3. **Kotlin 1.9.25** — RN 0.76 pins the Kotlin Gradle plugin to 1.9.24, which the Compose compiler
   (in `expo-modules-core`) rejects. In `android/build.gradle`, pin it:
   `classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVersion")` with
   `android.kotlinVersion=1.9.25` in `gradle.properties`. *(This file is regenerated by prebuild.)*
4. **Short, non-OneDrive path** — Reanimated's native build embeds the full source path into object
   files and blows past Windows' 260-char limit under `…/OneDrive/Desktop/…`. Build from something
   like `C:\lumi` instead.
5. `cd android && ./gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a`
   → `android/app/build/outputs/apk/release/app-release.apk`.

The two **source-level** fixes (missing `expo-asset`, and the NativeWind/`react-native-css-interop`
babel line that assumes Reanimated 4) are already baked into `package.json` + `patches/`, so they apply
on any platform — including EAS.

> The APK is signed with the **debug keystore** (Expo's default for the release variant) so it
> sideloads, but it is **not** Play-Store-ready. For the store, add a real release keystore.

## What's built

**Mobile (complete, runs in local mode):** 9-step onboarding · Today hub (phase card with the "why",
period countdown, streaks, quick log) · phase-colored Calendar · tap-based daily Log (mood, energy,
pain + intensity, cravings, bloating, sleep, flow, clarity, social, notes) · Insights (pattern
detection, "tough days hit around day X") · searchable/bookmarkable Learn library with per-phase
content across all 6 categories · Luna chat UI (support / just-listen modes) · Settings (cycle,
tracked symptoms, notifications, partner sharing, account, JSON export, delete-all) · Partner view.

**Backend (complete, optional):** auth + JWT cookies · Mongoose models (User, CycleLog, PartnerAccount,
Article) · log sync · stateless cycle prediction · partner snapshot. No AI key — Luna is fully
client-side, so the backend never sees a provider key.

**Luna safety guardrails** live in the on-device system prompt ([`mobile/lib/ai/prompt.ts`](./mobile/lib/ai/prompt.ts)):
no diagnosis, a gentle "see a doctor" on red-flag symptoms, and never making anyone feel abnormal.

## Follow-ups (intentionally scoped out of this pass)

- Wiring the mobile app's account flow to push/pull logs from `/api/logs` (the API client and endpoints
  exist; the sync trigger on login is the remaining glue).
- Push notifications via Expo Notifications (preferences are captured; scheduling is the next step).
- A standalone Partner **app/login** with server-enforced per-category sharing (the in-app preview and
  snapshot endpoint exist; partner-account auth is the follow-up).
- Seeding the `Article` collection (the mobile Learn content ships in-app; the model is ready for a
  server-backed library).

> Medical note: Luna and all content provide general information and support only — not diagnosis.
> Red-flag symptoms always route the user toward a real clinician.
