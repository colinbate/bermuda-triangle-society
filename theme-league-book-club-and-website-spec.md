# Theme League Book Club + Website Spec

This document includes:
1) A concise synopsis of the **Theme League** book club concept
2) A practical implementation spec for a supporting **Astro + Tailwind 4 + MDX** website

---

## 1) Club Synopsis (Theme League Format)

**What it is:**  
A monthly, theme-based book club for fantasy, sci-fi, and mystery readers (plus the curious). Instead of assigning one required book, the club votes on a theme and members bring **any** book or audiobook that fits. The focus is on **recommendations, discovery, and honest opinions**—without homework pressure.

**How themes work:**  
Members can submit theme ideas to a shared pool. At each meeting, the group votes on the next theme from that pool. After voting, the group collaborates for a few minutes to create a **starter list** of books/audiobooks that match the theme—based on personal recommendations and quick library/Libby searches. The theme and starter list are shared afterward and posted to the club’s website.

**How meetings work (high-level):**  
At the next meeting, attendees bring a themed book/audiobook (or come just to listen) and share short, spoiler-light pitches: what it’s about, why it worked (or didn’t), and who it’s for. The outcome is a curated set of recommendations tailored to the group’s tastes, plus a welcoming space for casual attendees.

---

## 2) Website Spec (Astro + Tailwind 4 + MDX)

### Goal
A simple, fast website that:
- Explains the club in one glance
- Shows the **current theme** + **starter list**
- Archives past themes and recommendations
- Publishes meeting dates and basic logistics
- Lets members submit theme ideas (via a simple form link)

No accounts, no comments, no complex database. Static-first with lightweight forms.

---

## Information Architecture

### Primary Pages
1. **Home** (`/`)
2. **About / How it Works** (`/about`)
3. **Meetings** (`/meetings`)
4. **Themes** (`/themes`)
   - Theme detail page: (`/themes/[slug]`)
5. **Recommendations** (`/recs`) *(optional; can also live on theme pages)*
6. **Submit a Theme** (`/submit`) *(or a button linking to an external form)*

### Utility Pages
- **Code of Conduct** (`/conduct`) (short, friendly)
- **Contact** (`/contact`) (or just an email link/footer)

---

## Sitewide UI

### Header / Nav
- Left: site name (e.g. “Speculative Snacks Book Club”)
- Nav links: Home, Themes, Meetings, About, Submit a Theme
- Right (optional): a small “Current Theme” pill link

### Footer
- Meeting cadence (e.g. “Monthly · [Library Name]”)
- Contact email (or library contact)
- Small note: “All book covers belong to their owners.” (if covers ever added)

### Visual Style
- Clean, cozy, genre-adjacent without going full “dragon wallpaper”
- Neutral background, subtle accent color(s)
- Typography-forward (readable lists)
- Avoid heavy gradients; keep it print-friendly

---

## Content Model (MDX-driven)

Use Astro Content Collections (recommended) or simple `src/content/*` folders.

### 1) Themes Collection
Folder: `src/content/themes/`  
Each theme is an `.mdx` file.

**Frontmatter example:**
```md
---
title: "Found Family (but make it weird)"
slug: "found-family-weird"
status: "current" # current | upcoming | past
meetingDate: "2026-03-12"
voteDate: "2026-02-12"
summary: "Stories where bonds form under pressure, in strange worlds."
tags: ["fantasy", "sci-fi", "mystery"]
starterList:
  - title: "A Long Way to a Small, Angry Planet"
    author: "Becky Chambers"
    format: ["ebook", "audio"]
    source: "Libby"
    note: "Warm ensemble cast, space-roadtrip vibes."
  - title: "The Goblin Emperor"
    author: "Katherine Addison"
    format: ["print", "ebook"]
    source: "Library"
    note: "Court intrigue, kindness as strength."
---
```

**Body content (MDX):**
- 1–2 paragraphs expanding on the theme
- Optional: “What tends to fit this theme” bullet list
- Optional: “Hard no / content notes” section if needed

### 2) Meetings Collection
Folder: `src/content/meetings/`  
Each meeting is an `.mdx` file.

**Frontmatter example:**
```md
---
title: "March 2026 Meeting"
date: "2026-03-12"
time: "6:30–7:45 PM"
location: "Main Library – Meeting Room B"
themeSlug: "found-family-weird"
agenda:
  - "Quick hellos + reading mood check"
  - "Lightning pitches"
  - "Theme vote"
  - "Build starter list for next month"
---
```

**Body content:**
- Any notes
- Link to the theme page
- Optional “Recap” section later

### 3) Theme Pool Collection *(Optional)*
Folder: `src/content/theme-pool/`  
A curated list of submitted theme ideas you maintain manually (or mirror from a form).

Frontmatter:
```md
---
title: "Time Loops & Reset Stories"
slug: "time-loops"
submittedBy: "Anonymous"
status: "in-pool" # in-pool | used
notes: "Groundhog Day energy, but with lasers or murder."
---
```

If you don’t want to manage this, skip it and just link to a form.

---

## Core Components (Astro)

### `<Layout>`
- Provides header/footer
- Handles meta tags and default page width
- Default content width: comfortable reading column (e.g. `max-w-3xl`)

### `<Hero>`
Used on Home:
- Title, one-sentence description
- Buttons: “See current theme” and “Submit a theme”
- Small “Next meeting” line if available

### `<ThemeCard>`
Used on Home + Themes index:
- Theme title, summary
- Status badge (Current/Upcoming/Past)
- Meeting date
- CTA: “View theme”

### `<StarterList>`
Reusable list renderer:
- Book title + author
- Format chips: Print / Ebook / Audio
- Source tag: Library / Libby / Other
- Optional note

### `<MeetingCard>`
Used on Meetings index:
- Date, time, location
- Linked theme
- Optional “Add to calendar” link (static .ics is optional)

### `<TagPill>`
Simple badge component for tags and formats

---

## Page Specs

### Home (`/`)
**Purpose:** explain the club + show what to do next.

Sections:
1. Hero
2. “How it works” (3 bullets max)
3. Current Theme (ThemeCard + StarterList preview)
4. Next Meeting (MeetingCard)
5. “Past themes” teaser (3 cards)
6. CTA block: “Submit a theme”

### About (`/about`)
Short, friendly explanation:
- What the club is
- What happens at a meeting (lightning pitches, vote, starter list)
- “No homework required” explicitly
- 3–5 example themes

### Meetings (`/meetings`)
- Upcoming meetings first (sorted)
- Past meeting archive below
- Each meeting page can be simple, but link to its theme

### Themes (`/themes`)
- Filter tabs (optional): Current, Past
- Grid/list of ThemeCards
- Simple and browseable

### Theme Detail (`/themes/[slug]`)
- Title + summary
- Meeting date/time (if known)
- Starter list (the important part)
- Optional: a short “Fits this theme if…” section
- CTA: “Bring a book/audiobook that fits and pitch it next meeting”

### Submit (`/submit`)
Simple page with:
- Short instructions for theme submissions
- Button linking to external form (Google Form / Typeform / library site)
- Optional: list a few “good theme examples”

---

## Data + Sorting Rules
- A single theme can be marked `status: current` (assume only one at a time)
- Meetings should link to theme via `themeSlug`
- Sort:
  - Home: show `current` theme first
  - Meetings: upcoming by date ascending, then past descending
  - Themes: current/upcoming first, then past

---

## Content Entry Workflow (for organizers)
- When a meeting ends:
  1. Update next theme to `current`
  2. Add/update starter list on that theme page
  3. Create a new meeting entry for next month
- Optionally post a short recap in the meeting MDX

---

## Tailwind + Layout Guidance
- Use a simple spacing system: consistent vertical rhythm (`space-y-8`, `py-12`)
- Keep components as plain divs; avoid overengineering
- Favor readability:
  - Comfortable line length
  - Strong headings
  - Lists that look good on mobile

---

## Nice-to-Have Extras (Optional)
- **RSS feed** for new themes/meetings
- **ICS file** for next meeting
- **“Theme history”** section on each theme page linking previous similar themes
- **Print-friendly CSS** for theme pages (people may print the starter list)

---

## Definition of Done
A visitor can land on Home and immediately know:
- What this club is
- What the current theme is
- When/where the next meeting is
- How to participate (bring a themed book/audiobook or just come listen)
- How to submit a theme idea
