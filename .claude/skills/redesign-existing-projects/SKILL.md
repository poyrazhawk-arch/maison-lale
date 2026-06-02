---
name: redesign-existing-projects
description: Upgrades existing websites and apps to premium quality. Audits current design, identifies generic AI patterns, and applies high-end design standards without breaking functionality. Works with any CSS framework or vanilla CSS.
---

# Redesign Skill

## How This Works

When applied to an existing project, follow this sequence:

1. **Scan** â€” Read the codebase. Identify the framework, styling method (Tailwind, vanilla CSS, styled-components, etc.), and current design patterns.
2. **Diagnose** â€” Run through the audit below. List every generic pattern, weak point, and missing state you find.
3. **Fix** â€” Apply targeted upgrades working with the existing stack. Do not rewrite from scratch. Improve what's there.

## Design Audit

### Typography

Check for these problems and fix them:

- **Browser default fonts or Inter everywhere.** Replace with a font that has character. Good options: `Geist`, `Outfit`, `Cabinet Grotesk`, `Satoshi`. For editorial/creative projects, pair a serif header with a sans-serif body.
- **Headlines lack presence.** Increase size for display text, tighten letter-spacing, reduce line-height. Headlines should feel heavy and intentional.
- **Body text too wide.** Limit paragraph width to roughly 65 characters. Increase line-height for readability.
- **Only Regular (400) and Bold (700) weights used.** Introduce Medium (500) and SemiBold (600) for more subtle hierarchy.
- **Numbers in proportional font.** Use a monospace font or enable tabular figures (`font-variant-numeric: tabular-nums`) for data-heavy interfaces.
- **Missing letter-spacing adjustments.** Use negative tracking for large headers, positive tracking for small caps or labels.
- **All-caps subheaders everywhere.** Try lowercase italics, sentence case, or small-caps instead.
- **Orphaned words.** Single words sitting alone on the last line. Fix with `text-wrap: balance` or `text-wrap: pretty`.

### Color and Surfaces

- **Pure `#000000` background.** Replace with off-black, dark charcoal, or tinted dark (`#0a0a0a`, `#121212`, or a dark navy).
- **Oversaturated accent colors.** Keep saturation below 80%. Desaturate accents so they blend with neutrals instead of screaming.
- **More than one accent color.** Pick one. Remove the rest. Consistency beats variety.
- **Mixing warm and cool grays.** Stick to one gray family. Tint all grays with a consistent hue (warm or cool, not both).
- **Purple/blue "AI gradient" aesthetic.** This is the most common AI design fingerprint. Replace with neutral bases and a single, considered accent.
- **Generic `box-shadow`.** Tint shadows to match the background hue. Use colored shadows (e.g., dark blue shadow on a blue background) instead of pure black at low opacity.
- **Flat design with zero texture.** Add subtle noise, grain, or micro-patterns to backgrounds. Pure flat vectors feel sterile.
- **Perfectly even gradients.** Break the uniformity with radial gradients, noise overlays, or mesh gradients instead of standard linear 45-degree fades.
- **Inconsistent lighting direction.** Audit all shadows to ensure they suggest a single, consistent light source.
- **Random dark sections in a light mode page (or vice versa).** A single dark-background section breaking an otherwise light page looks like a copy-paste accident. Either commit to a full dark mode or keep a consistent background tone throughout. If contrast is needed, use a slightly darker shade of the same palette â€” not a sudden jump to `#111` in the middle of a cream page.
- **Empty, flat sections with no visual depth.** Sections that are just text on a plain background feel unfinished. Add high-quality background imagery (blurred, overlaid, or masked), subtle patterns, or ambient gradients. Use reliable placeholder sources like `https://picsum.photos/seed/{name}/1920/1080` when real assets are not available. Experiment with background images behind hero sections, feature blocks, or CTAs â€” even a subtle full-width photo at low opacity adds presence.

### Layout

- **Everything centered and symmetrical.** Break symmetry with offset margins, mixed aspect ratios, or left-aligned headers over centered content.
- **Three equal card columns as feature row.** This is the most generic AI layout. Replace with a 2-column zig-zag, asymmetric grid, horizontal scroll, or masonry layout.
- **Using `height: 100vh` for full-screen sections.** Replace with `min-height: 100dvh` to prevent layout jumping on mobile browsers (iOS Safari viewport bug).
- **Complex flexbox percentage math.** Replace with CSS Grid for reliable multi-column structures.
- **No max-width container.** Add a container constraint (around 1200-1440px) with auto margins so content doesn't stretch edge-to-edge on wide screens.
- **Cards of equal height forced by flexbox.** Allow variable heights or use masonry when content varies in length.
- **Uniform border-radius on everything.** Vary the radius: tighter on inner elements, softer on containers.
- **No overlap or depth.** Elements sit flat next to each other. Use negative margins to create layering and visual depth.
- **Symmetrical vertical padding.** Top and bottom padding are always identical. Adjust optically â€” bottom padding often needs to be slightly larger.
- **Dashboard always has a left sidebar.** Try top navigation, a floating command menu, or a collapsible panel instead.
- **Missing whitespace.** Double the spacing. Let the design breathe. Dense layouts work for data dashboards, not for marketing pages.
- **Buttons not bottom-aligned in card groups.** When cards have different content lengths, CTAs end up at random heights. Pin buttons to the bottom of each card so they form a clean horizontal line regardless of content above.
- **Feature lists starting at different vertical positions.** In pricing tables or comparison cards, the list of features should start at the same Y position across all columns. Use consistent spacing above the list or fixed-height title/price blocks.
- **Inconsistent vertical rhythm in side-by-side elements.** When placing cards, columns, or panels next to each other, align shared elements (titles, descriptions, prices, buttons) across all items. Misaligned baselines make the layout look broken.
- **Mathematical alignment that looks optically wrong.** Centering by the math doesn't always look centered to the eye. Icons next to text, play buttons in circles, or text in buttons often need 1-2px optical adjustments to feel right.

### Interactivity and States

- **No hover states on buttons.** Add background shift, slight scale, or translate on hover.
- **No active/pressed feedback.** Add a subtle `scale(0.98)` or `translateY(1px)` on press to simulate a physical click.
- **Instant transitions with zero duration.** Add smooth transitions (200-300ms) to all interactive elements.
- **Missing focus ring.** Ensure visible focus indicators for keyboard navigation. This is an accessibility requirement, not optional.
- **No loading states.** Replace generic circular spinners with skeleton loaders that match the layout shape.
- **No empty states.** An empty dashboard showing nothing is a missed opportunity. Design a composed "getting started" view.
- **No error states.** Add clear, inline error messages for forms. Do not use `window.alert()`.
- **Dead links.** Buttons that link to `#`. Either link to real destinations or visually disable them.
- **No indication of current page in navigation.** Style the active nav link differently so users know where they are.
- **Scroll jumping.** Anchor clicks jump instantly. Add `scroll-behavior: smooth`.
- **Animations using `top`, `left`, `width`, `height`.** Switch to `transform` and `opacity` for GPU-accelerated, smooth animation.

### Content

- **Generic names like "John Doe" or "Jane Smith".** Use diverse, realistic-sounding names.
- **Fake round numbers like `99.99%`, `50%`, `$100.00`.** Use organic, messy data: `47.2%`, `$99.00`, `+1 (312) 847-1928`.
- **Placeholder company names like "Acme Corp", "Nexus", "SmartFlow".** Invent contextual, believable brand names.
- **AI copywriting cliches.** Never use "Elevate", "Seamless", "Unleash", "Next-Gen", "Game-changer", "Delve", "Tapestry", or "In the world of...". Write plain, specific language.
- **Exclamation marks in success messages.** Remove them. Be confident, not loud.
- **"Oops!" error messages.** Be direct: "Connection failed. Please try again."
- **Passive voice.** Use active voice: "We couldn't save your changes" instead of "Mistakes were made."
- **All blog post dates identical.** Randomize dates to appear real.
- **Same avatar image for multiple users.** Use unique assets for every distinct person.
- **Lorem Ipsum.** Never use placeholder latin text. Write real draft copy.
- **Title Case On Every Header.** Use sentence case instead.

### Component Patterns

- **Generic card look (border + shadow + white background).** Remove the border, or use only background color, or use only spacing. Cards should exist only when elevation communicates hierarchy.
- **Always one filled button + one ghost button.** Add text links or tertiary styles to reduce visual noise.
- **Pill-shaped "New" and "Beta" badges.** Try square badges, flags, or plain text labels.
- **Accordion FAQ sections.** Use a side-by-side list, searchable help, or inline progressive disclosure.
- **3-card carousel testimonials with dots.** Replace with a masonry wall, embedded social posts, or a single rotating quote.
- **Pricing table with 3 towers.** Highlight the recommended tier with color and emphasis, not just extra height.
- **Modals for everything.** Use inline editing, slide-over panels, or expandable sections instead of popups for simple actions.
- **Avatar circles exclusively.** Try squircles or rounded squares for a less generic look.
- **Light/dark toggle always a sun/moon switch.** Use a dropdown, system preference detection, or integrate it into settings.
- **Footer link farm with 4 columns.** Simplify. Focus on main navigational paths and legally required links.

### Iconography

- **Lucide or Feather icons exclusively.** These are the "default" AI icon choice. Use Phosphor, Heroicons, or a custom set for differentiation.
- **Rocketship for "Launch", shield for "Security".** Replace cliche metaphors with less obvious icons (bolt, fingerprint, spark, vault).
- **Inconsistent stroke widths across icons.** Audit all icons and standardize to one stroke weight.
- **Missing favicon.** Always include a branded favicon.
- **Stock "diverse team" photos.** Use real team photos, candid shots, or a consistent illustration style instead of uncanny stock imagery.

### Code Quality

- **Div soup.** Use semantic HTML: `<nav>`, `<main>`, `<article>`, `<aside>`, `<section>`.
- **Inline styles mixed with CSS classes.** Move all styling to the project's styling system.
- **Hardcoded pixel widths.** Use relative units (`%`, `rem`, `em`, `max-width`) for flexible layouts.
- **Missing alt text on images.** Describe image content for screen readers. Never leave `alt=""` or `alt="image"` on meaningful images.
- **Arbitrary z-index values like `9999`.** Establish a clean z-index scale in the theme/variables.
- **Commented-out dead code.** Remove all debug artifacts before shipping.
- **Import hallucinations.** Check that every import actually exists in `package.json` or the project dependencies.
- **Missing meta tags.** Add proper `<title>`, `description`, `og:image`, and social sharing meta tags.

### Strategic Omissions (What AI Typically Forgets)

- **No legal links.** Add privacy policy and terms of service links in the footer.
- **No "back" navigation.** Dead ends in user flows. Every page needs a way back.
- **No custom 404 page.** Design a helpful, branded "page not found" experience.
- **No form validation.** Add client-side validation for emails, required fields, and format checks.
- **No "skip to content" link.** Essential for keyboard users. Add a hidden skip-link.
- **No cookie consent.** If required by jurisdiction, add a compliant consent banner.

## Upgrade Techniques

When upgrading a project, pull from these high-impact techniques to replace generic patterns:

### Typography Upgrades
- **Variable font animation.** Interpolate weight or width on scroll or hover for text that feels alive.
- **Outlined-to-fill transitions.** Text starts as a stroke outline and fills with color on scroll entry or interaction.
- **Text mask reveals.** Large typography acting as a window to video or animated imagery behind it.

### Layout Upgrades
- **Broken grid / asymmetry.** Elements that deliberately ignore column structure â€” overlapping, bleeding off-screen, or offset with calculated randomness.
- **Whitespace maximization.** Aggressive use of negative space to force focus on a single element.
- **Parallax card stacks.** Sections that stick and physically stack over each other during scroll.
- **Split-screen scroll.** Two halves of the screen sliding in opposite directions.

### Motion Upgrades
- **Smooth scroll with inertia.** Decouple scrolling from browser defaults for a heavier, cinematic feel.
- **Staggered entry.** Elements cascade in with slight delays, combining Y-axis translation with opacity fade. Never mount everything at once.
- **Spring physics.** Replace linear easing with spring-based motion for a natural, weighty feel on all interactive elements.
- **Scroll-driven reveals.** Content entering through expanding masks, wipes, or draw-on SVG paths tied to scroll progress.

### Surface Upgrades
- **True glassmorphism.** Go beyond `backdrop-filter: blur`. Add a 1px inner border and a subtle inner shadow to simulate edge refraction.
- **Spotlight borders.** Card borders that illuminate dynamically under the cursor.
- **Grain and noise overlays.** A fixed, pointer-events-none overlay with subtle noise to break digital flatness.
- **Colored, tinted shadows.** Shadows that carry the hue of the background rather than using generic black.

## Fix Priority

Apply changes in this order for maximum visual impact with minimum risk:

1. **Font swap** â€” biggest instant improvement, lowest risk
2. **Color palette cleanup** â€” remove clashing or oversaturated colors
3. **Hover and active states** â€” makes the interface feel alive
4. **Layout and spacing** â€” proper grid, max-width, consistent padding
5. **Replace generic components** â€” swap cliche patterns for modern alternatives
6. **Add loading, empty, and error states** â€” makes it feel finished
7. **Polish typography scale and spacing** â€” the premium final touch

## Rules

- Work with the existing tech stack. Do not migrate frameworks or styling libraries.
- Do not break existing functionality. Test after every change.
- Before importing any new library, check the project's dependency file first.
- If the project uses Tailwind, check the version (v3 vs v4) before modifying config.
- If the project has no framework, use vanilla CSS.
- Keep changes reviewable and focused. Small, targeted improvements over big rewrites.
# Design System: Taste Standard
**Skill:** stitch-design-taste

---

## Configuration â€” Set Your Style
Adjust these dials before using this design system. They control how creative, dense, and animated the output should be. Pick the level that fits your project.

| Dial | Level | Description |
|------|-------|-------------|
| **Creativity** | `8` | `1` = Ultra-minimal, Swiss, silent, monochrome. `5` = Balanced, clean but with personality. `10` = Expressive, editorial, bold typography experiments, inline images in headlines, strong asymmetry. Default: `8` |
| **Density** | `4` | `1` = Gallery-airy, massive whitespace. `5` = Balanced sections. `10` = Cockpit-dense, data-heavy. Default: `4` |
| **Variance** | `8` | `1` = Predictable, symmetric grids. `5` = Subtle offsets. `10` = Artsy chaotic, no two sections alike. Default: `8` |
| **Motion Intent** | `6` | `1` = Static, no animation noted. `5` = Subtle hover/entrance cues. `10` = Cinematic orchestration noted in every component. Default: `6` |

> **How to use:** Change the numbers above to match your project's vibe. At **Creativity 1â€“3**, the system produces clean, quiet, Notion-like interfaces. At **Creativity 7â€“10**, expect inline image typography, dramatic scale contrast, and strong editorial layouts. The rest of the rules below adapt to your chosen levels.

---

## 1. Visual Theme & Atmosphere
A restrained, gallery-airy interface with confident asymmetric layouts and fluid spring-physics motion. The atmosphere is clinical yet warm â€” like a well-lit architecture studio where every element earns its place through function. Density is balanced (Level 4), variance runs high (Level 8) to prevent symmetrical boredom, and motion is fluid but never theatrical (Level 6). The overall impression: expensive, intentional, alive.

## 2. Color Palette & Roles
- **Canvas White** (#F9FAFB) â€” Primary background surface. Warm-neutral, never clinical blue-white
- **Pure Surface** (#FFFFFF) â€” Card and container fill. Used with whisper shadow for elevation
- **Charcoal Ink** (#18181B) â€” Primary text. Zinc-950 depth â€” never pure black
- **Steel Secondary** (#71717A) â€” Body text, descriptions, metadata. Zinc-500 warmth
- **Muted Slate** (#94A3B8) â€” Tertiary text, timestamps, disabled states
- **Whisper Border** (rgba(226,232,240,0.5)) â€” Card borders, structural 1px lines. Semi-transparent for depth
- **Diffused Shadow** (rgba(0,0,0,0.05)) â€” Card elevation. Wide-spreading, 40px blur, -15px offset. Never harsh

### Accent Selection (Pick ONE per project)
- **Emerald Signal** (#10B981) â€” For growth, success, positive data dashboards
- **Electric Blue** (#3B82F6) â€” For productivity, SaaS, developer tools
- **Deep Rose** (#E11D48) â€” For creative, editorial, fashion-adjacent projects
- **Amber Warmth** (#F59E0B) â€” For community, social, warm-toned products

### Banned Colors
- Purple/Violet neon gradients â€” the "AI Purple" aesthetic
- Pure Black (#000000) â€” always Off-Black or Zinc-950
- Oversaturated accents above 80% saturation
- Mixed warm/cool gray systems within one project

## 3. Typography Rules
- **Display:** `Geist`, `Satoshi`, `Cabinet Grotesk`, or `Outfit` â€” Track-tight (`-0.025em`), controlled fluid scale, weight-driven hierarchy (700â€“900). Not screaming. Leading compressed (`1.1`). Alternatives forced â€” `Inter` is BANNED for premium contexts
- **Body:** Same family at weight 400 â€” Relaxed leading (`1.65`), 65ch max-width, Steel Secondary color (#71717A)
- **Mono:** `Geist Mono` or `JetBrains Mono` â€” For code blocks, metadata, timestamps. When density exceeds Level 7, all numbers switch to monospace
- **Scale:** Display at `clamp(2.25rem, 5vw, 3.75rem)`. Body at `1rem/1.125rem`. Mono metadata at `0.8125rem`

### Banned Fonts
- `Inter` â€” banned everywhere in premium/creative contexts
- Generic serif fonts (`Times New Roman`, `Georgia`, `Garamond`, `Palatino`) â€” BANNED. If serif is needed for editorial/creative, use only distinctive modern serifs like `Fraunces`, `Gambarino`, `Editorial New`, or `Instrument Serif`. Never use default browser serif stacks. Serif is always BANNED in dashboards or software UIs regardless

## 4. Component Stylings
* **Buttons:** Flat surface, no outer glow. Primary: accent fill with white text. Secondary: ghost/outline. Active state: `-1px translateY` or `scale(0.98)` for tactile push. Hover: subtle background shift, never glow
* **Cards/Containers:** Generously rounded corners (`2.5rem`). Pure white fill. Whisper border (`1px`, semi-transparent). Diffused shadow (`0 20px 40px -15px rgba(0,0,0,0.05)`). Internal padding `2remâ€“2.5rem`. Used ONLY when elevation communicates hierarchy â€” high-density layouts replace cards with `border-top` dividers or negative space
* **Inputs/Forms:** Label positioned above input. Helper text optional. Error text below in Deep Rose. Focus ring in accent color, `2px` offset. No floating labels. Standard `0.5rem` gap between label-input-error stack
* **Navigation:** Sleek, sticky. Icons scale on hover (Dock Magnification optional). No hamburger on desktop. Clean horizontal with generous spacing
* **Loaders:** Skeletal shimmer matching exact layout dimensions and rounded corners. Shifting light reflection across placeholder shapes. Never circular spinners
* **Empty States:** Composed illustration or icon composition with guidance text. Never just "No data found"
* **Error States:** Inline, contextual. Red accent underline or border. Clear recovery action

## 5. Hero Section
The Hero is the first impression â€” it must be striking, creative, and never generic.
- **Inline Image Typography:** Embed small, contextual photos or visuals directly between words or letters in the headline. Example: "We build [photo of hands typing] digital [photo of screen] products" â€” images sit inline at type-height, rounded, acting as visual punctuation between words. This is the signature creative technique
- **No Overlapping Elements:** Text must never overlap images or other text. Every element has its own clear spatial zone. No z-index stacking of content layers, no absolute-positioned headlines over images. Clean separation always
- **No Filler Text:** "Scroll to explore", "Swipe down", scroll arrow icons, bouncing chevrons, and any instructional UI chrome are BANNED. The user knows how to scroll. Let the content pull them in naturally
- **Asymmetric Structure:** Centered Hero layouts are BANNED at this variance level. Use Split Screen (50/50), Left-Aligned text / Right visual, or Asymmetric Whitespace with large empty zones
- **CTA Restraint:** Maximum one primary CTA button. No secondary "Learn more" links. No redundant micro-copy below the headline

## 6. Layout Principles
- **Grid-First:** CSS Grid for all structural layouts. Never flexbox percentage math (`calc(33% - 1rem)` is BANNED)
- **No Overlapping:** Elements must never overlap each other. No absolute-positioned layers stacking content on content. Every element occupies its own grid cell or flow position. Clean, separated spatial zones
- **Feature Sections:** The "3 equal cards in a row" pattern is BANNED. Use 2-column Zig-Zag, asymmetric Bento grids (2fr 1fr 1fr), or horizontal scroll galleries
- **Containment:** All content within `max-width: 1400px`, centered. Generous horizontal padding (`1rem` mobile, `2rem` tablet, `4rem` desktop)
- **Full-Height:** Use `min-height: 100dvh` â€” never `height: 100vh` (iOS Safari address bar jump)
- **Bento Architecture:** For feature grids, use Row 1: 3 columns | Row 2: 2 columns (70/30 split). Each tile contains a perpetual micro-animation

## 7. Responsive Rules
Every screen must work flawlessly across all viewports. **Responsive is not optional â€” it is a hard requirement. Every single element must be tested at 375px, 768px, and 1440px.**
- **Mobile-First Collapse (< 768px):** All multi-column layouts collapse to a strict single column. `width: 100%`, `padding: 1rem`, `gap: 1.5rem`. No exceptions
- **No Horizontal Scroll:** Horizontal overflow on mobile is a critical failure. All elements must fit within viewport width. If any element causes horizontal scroll, the design is broken
- **Typography Scaling:** Headlines scale down gracefully via `clamp()`. Body text stays `1rem` minimum. Never shrink body below `14px`. Headlines must remain readable on 375px screens
- **Touch Targets:** All interactive elements minimum `44px` tap target. Generous spacing between clickable items. Buttons must be full-width on mobile
- **Image Behavior:** Hero and inline images scale proportionally. Inline typography images (photos between words) stack below the headline on mobile instead of inline
- **Navigation:** Desktop horizontal nav collapses to a clean mobile menu (slide-in or full-screen overlay). No tiny hamburger icons without labels
- **Cards & Grids:** Bento grids and asymmetric layouts revert to stacked single-column cards with full-width. Maintain internal padding (`1rem`)
- **Spacing Consistency:** Vertical section gaps reduce proportionally on mobile (`clamp(3rem, 8vw, 6rem)`). Never cramped, never excessively airy
- **Testing Viewports:** Designs must be verified at: `375px` (iPhone SE), `390px` (iPhone 14), `768px` (iPad), `1024px` (small laptop), `1440px` (desktop)

## 8. Motion & Interaction (Code-Phase Intent)
> **Note:** Stitch generates static screens â€” it does not animate. This section documents the **intended motion behavior** so that the coding agent (Antigravity, Cursor, etc.) knows exactly how to implement animations when building the exported design into a live product.

- **Physics Engine:** Spring-based exclusively. `stiffness: 100, damping: 20`. No linear easing anywhere. Premium, weighty feel on all interactive elements
- **Perpetual Micro-Loops:** Every active dashboard component has an infinite-loop state â€” Pulse on status dots, Typewriter on search bars, Float on feature icons, Shimmer on loading states
- **Staggered Orchestration:** Lists and grids mount with cascaded delays (`animation-delay: calc(var(--index) * 100ms)`). Waterfall reveals, never instant mount
- **Layout Transitions:** Smooth re-ordering via shared element IDs. Items swap positions with physics, simulating real-time intelligence
- **Hardware Rules:** Animate ONLY `transform` and `opacity`. Never `top`, `left`, `width`, `height`. Grain/noise filters on fixed, pointer-events-none pseudo-elements only
- **Performance:** CPU-heavy perpetual animations isolated in microscopic leaf components. Never trigger parent re-renders. Target 60fps minimum

## 9. Anti-Patterns (Banned)
- No emojis â€” anywhere in UI, code, or alt text
- No `Inter` font â€” use `Geist`, `Outfit`, `Cabinet Grotesk`, `Satoshi`
- No generic serif fonts (`Times New Roman`, `Georgia`, `Garamond`) â€” if serif is needed, use distinctive modern serifs only (`Fraunces`, `Instrument Serif`)
- No pure black (`#000000`) â€” Off-Black or Zinc-950 only
- No neon outer glows or default box-shadow glows
- No oversaturated accent colors above 80%
- No excessive gradient text on large headers
- No custom mouse cursors
- No overlapping elements â€” text never overlaps images or other content. Clean spatial separation always
- No 3-column equal card layouts for features
- No centered Hero sections (at this variance level)
- No filler UI text: "Scroll to explore", "Swipe down", "Discover more below", scroll arrows, bouncing chevrons â€” all BANNED
- No generic names: "John Doe", "Sarah Chan", "Acme", "Nexus", "SmartFlow"
- No fake round numbers: `99.99%`, `50%`, `1234567` â€” use organic data: `47.2%`, `+1 (312) 847-1928`
- No AI copywriting clichÃ©s: "Elevate", "Seamless", "Unleash", "Next-Gen", "Revolutionize"
- No broken Unsplash links â€” use `picsum.photos/seed/{id}/800/600` or SVG UI Avatars
- No generic `shadcn/ui` defaults â€” customize radii, colors, shadows to match this system
- No `z-index` spam â€” use only for Navbar, Modal, Overlay layer contexts
- No `h-screen` â€” always `min-h-[100dvh]`
- No circular loading spinners â€” skeletal shimmer only
