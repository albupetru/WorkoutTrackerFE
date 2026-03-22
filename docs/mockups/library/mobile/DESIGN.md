# Design System Strategy: Kinetic Noir

## 1. Overview & Creative North Star
**Creative North Star: "The High-Performance Engine"**

This design system rejects the static, boxy nature of traditional fitness trackers. Instead, it draws inspiration from high-end automotive instrumentation and premium technical apparel. We are building a "Digital Cockpit" for the athlete—where every data point feels machined, intentional, and high-velocity.

To move beyond the "template" look, we utilize **Kinetic Asymmetry**. Layouts should avoid perfect 50/50 splits. Use oversized typography that bleeds off the container edges and overlapping elements where a primary action chip might "bridge" two surface containers. This creates a sense of forward motion and mechanical depth that feels bespoke and editorial rather than "out-of-the-box."

---

## 2. Colors & Surface Architecture
The palette is rooted in absolute darkness (`#0e0e0e`), allowing our high-visibility accents to "glow" with phosphorescent intensity.

### The "No-Line" Rule
Traditional 1px solid borders are strictly prohibited for sectioning. We define space through **Chromatic Stepping**. A section is differentiated from the background by shifting from `surface` (`#0e0e0e`) to `surface_container_low` (`#131313`). This creates a sophisticated, seamless transition that feels like molded carbon fiber rather than a digital wireframe.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. 
*   **Base:** `surface` (#0e0e0e)
*   **Sectioning:** `surface_container` (#1a1a1a)
*   **Interactive Cards:** `surface_container_high` (#20201f)
*   **Floating Elements:** `surface_bright` (#2c2c2c) with 15% opacity `outline_variant` for definition.

### The "Glass & Gradient" Rule
To inject "soul" into the dark mode, use **Anodic Gradients**. CTAs should not be flat. Use a linear gradient from `primary` (`#f3ffca`) to `primary_container` (`#cafd00`) at a 135-degree angle. For non-critical overlays (like workout timers), use Glassmorphism: `surface_container_highest` at 60% opacity with a `24px` backdrop blur.

---

## 3. Typography
We employ a high-contrast pairing: **Lexend** for aggressive, athletic headlines and **Manrope** for technical, high-legibility data.

*   **Display & Headlines (Lexend):** These are your "Power Stats." Use `display-lg` (3.5rem) for workout durations or weights lifted. The wide tracking and bold weights convey stability and strength.
*   **Body & Labels (Manrope):** This is your "Technical Readout." Manrope’s geometric clarity ensures that even at `body-sm` (0.75rem), heart rate data and split times are instantly digestible during high-intensity movement.
*   **Editorial Intent:** Mix scales aggressively. A `display-lg` metric should be immediately followed by a `label-sm` unit (e.g., "185" in Lexend, "LBS" in Manrope) to create a professional, data-dense aesthetic.

---

## 4. Elevation & Depth
In this design system, elevation is a function of light, not shadows.

*   **Tonal Layering:** Instead of shadows, use "Inner Glows." On a `surface_container_high` card, apply a 1px inner stroke using `outline_variant` at 10% opacity on the top and left edges only. This mimics a light source hitting a machined edge.
*   **Ambient Shadows:** If a floating action button (FAB) requires a shadow, it must be a "Tinted Bloom." Use the `secondary` color (`#00e3fd`) at 8% opacity with a `48px` blur. It shouldn't look like a shadow; it should look like the button is emitting light onto the surface below.
*   **The "Ghost Border" Fallback:** Where separation is critical for accessibility, use the `outline_variant` (`#484847`) at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons (The Kinetic Triggers)
*   **Primary:** Gradient from `primary` to `primary_container`. Text in `on_primary_fixed` (#3a4a00). Roundedness: `md` (0.75rem).
*   **Secondary:** Ghost style. Transparent background with a `secondary` (`#00e3fd`) "Ghost Border" at 20% opacity.
*   **Tertiary:** Text-only using `secondary_fixed_dim`. 

### Interactive Chips
Used for muscle groups (e.g., "Quads," "Chest").
*   **Selected:** `secondary_container` background with `on_secondary_container` text.
*   **Unselected:** `surface_container_highest` with no border.

### Progress Gauges (Signature Component)
Avoid standard horizontal bars. Use **Concentric Rings** or **Thick Segmented Bars**. Use `primary` for completed segments and `surface_container_highest` for the track. This mimics high-end gym equipment displays.

### Performance Cards
*   **Rule:** Forbid divider lines. 
*   **Implementation:** Use a `12` (3rem) spacing unit to separate the "Exercise Name" from the "Set Data." Use a subtle background shift to `surface_container_low` for the "Rest Timer" section of the card to create a visual "pit stop" area.

### Input Fields
*   **State:** When active, the border should glow with a `2px` `secondary` edge and a subtle `surface_bright` inner fill.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use `primary` (`electric lime`) for "Success/Go" and `secondary` (`cyan`) for "Information/Tracking."
*   **Do** lean into extreme white space (e.g., `16` or `20` units) between major workout blocks to reduce cognitive load.
*   **Do** use `lg` (1rem) roundedness for large containers and `sm` (0.25rem) for small data chips to create a "nested" aesthetic.

### Don't:
*   **Don't** use 100% white (#ffffff) for long-form body text; use `on_surface_variant` (#adaaaa) to reduce eye strain in dark environments.
*   **Don't** use standard "Drop Shadows." They feel "web-like" and dated. Stick to tonal shifts and ambient glows.
*   **Don't** use sharp 90-degree corners. Everything in this system should feel ergonomic and "hand-held."
*   **Don't** use pure red for errors. Use `error` (#ff7351) which has a slight coral tint, keeping it within the vibrant, high-end neon family.