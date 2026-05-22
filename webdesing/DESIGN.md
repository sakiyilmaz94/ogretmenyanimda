---
name: Vibrant Scholastic System
colors:
  surface: '#fbf8ff'
  surface-dim: '#d5d8f9'
  surface-bright: '#fbf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f2ff'
  surface-container: '#ececff'
  surface-container-high: '#e5e6ff'
  surface-container-highest: '#dee0ff'
  on-surface: '#161a32'
  on-surface-variant: '#434656'
  inverse-surface: '#2b2f48'
  inverse-on-surface: '#f0efff'
  outline: '#747688'
  outline-variant: '#c4c5d9'
  surface-tint: '#124af0'
  primary: '#003fde'
  on-primary: '#ffffff'
  primary-container: '#2d5afe'
  on-primary-container: '#ededff'
  inverse-primary: '#b9c3ff'
  secondary: '#ae2f34'
  on-secondary: '#ffffff'
  secondary-container: '#ff6b6b'
  on-secondary-container: '#6d0010'
  tertiary: '#705d00'
  on-tertiary: '#ffffff'
  tertiary-container: '#caa800'
  on-tertiary-container: '#4c3e00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b9c3ff'
  on-primary-fixed: '#001356'
  on-primary-fixed-variant: '#0035be'
  secondary-fixed: '#ffdad8'
  secondary-fixed-dim: '#ffb3b0'
  on-secondary-fixed: '#410006'
  on-secondary-fixed-variant: '#8c1520'
  tertiary-fixed: '#ffe173'
  tertiary-fixed-dim: '#e8c426'
  on-tertiary-fixed: '#221b00'
  on-tertiary-fixed-variant: '#554500'
  background: '#fbf8ff'
  on-background: '#161a32'
  surface-variant: '#dee0ff'
typography:
  headline-xl:
    fontFamily: Quicksand
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Quicksand
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Quicksand
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Quicksand
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 28px
  body-md:
    fontFamily: Quicksand
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Quicksand
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Quicksand
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  headline-xl-mobile:
    fontFamily: Quicksand
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
  headline-lg-mobile:
    fontFamily: Quicksand
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 20px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

This design system is built to foster a sense of joy, curiosity, and safety for primary and middle school students. The personality is energetic and supportive, positioning the interface as a helpful companion rather than a rigid tool.

The style is **Modern-Friendly**, characterized by exaggerated roundedness, high-contrast energetic accents, and significant whitespace to reduce cognitive load. We intentionally avoid green tones to differentiate the experience, relying instead on a palette of deep blues for trust and warm corals for excitement. The visual language uses "soft-touch" elements that feel tactile and approachable, ensuring students feel encouraged rather than intimidated by the learning environment.

## Colors

The palette is designed to be vibrant and high-energy without the use of green. 

- **Primary (Deep Blue):** Used for core navigation, primary actions, and branding. It provides a stable, trustworthy foundation for the educational content.
- **Secondary (Warm Coral):** Used for highlighting progress, interactive rewards, and secondary calls to action. It injects warmth and human energy into the UI.
- **Tertiary (Sunny Yellow):** Used for celebratory moments, badges, and warnings. It represents optimism and achievement.
- **Neutral:** We utilize a soft navy-tinted charcoal for text to maintain high legibility while feeling softer than pure black. Backgrounds should remain off-white (#F8FAFC) to keep the interface feeling light and airy.

**Success States:** Since green is strictly prohibited, success states are indicated through the Primary Blue combined with celebratory Yellow accents or checkmark icons.

## Typography

The typography uses **Quicksand** exclusively to leverage its rounded terminals and open apertures, which are highly legible and friendly for younger readers. 

Headlines should be bold and expressive to create a clear hierarchy and guide the eye through learning modules. Body text uses a slightly larger base size (18px for primary content) to accommodate developing reading skills. We use generous line heights (1.5x) to prevent text from feeling cramped or overwhelming.

## Layout & Spacing

The layout follows a **Fluid Grid** system designed for high flexibility across tablets and desktops, which are common in educational settings.

- **Desktop:** 12-column grid with a maximum content width of 1280px.
- **Mobile:** 4-column grid with generous outside margins (16px) to ensure thumbs have easy reach to interactive elements.

Spacing follows an 8px rhythmic scale. We prioritize "Room to Breathe"—using the `lg` and `xl` spacing tokens between major sections to prevent the UI from feeling busy. Interactive elements like buttons and cards should have significant internal padding (`md`) to increase their tap targets.

## Elevation & Depth

To maintain a friendly, tactile feel, this design system uses **Tonal Layers** combined with **Ambient Shadows**.

- **Surface 0:** The main background, using an off-white tint.
- **Surface 1:** Raised cards and containers, using pure white with a very soft, diffused shadow (15% opacity of the Primary Blue).
- **Surface 2:** Active or hovered states, where the shadow deepens and the element may "lift" slightly (2px Y-offset).

Avoid harsh black shadows or heavy outlines. Depth should feel like layers of soft paper or smooth plastic, emphasizing a physical, "toy-like" quality that invites interaction.

## Shapes

The shape language is defined by **Maximum Roundedness (Pill-shaped)**. 

Every interactive element—from buttons and input fields to progress bars—should utilize the `rounded-full` approach. Large containers and cards should use `rounded-xl` (1.5rem / 24px) to ensure no sharp corners exist within the interface. This reinforces the "friendly and safe" brand narrative, removing any visual "points" that might feel aggressive or overly formal.

## Components

- **Buttons:** Large, pill-shaped, and high-contrast. Primary buttons use the Deep Blue background with White text. Secondary buttons use a thick Warm Coral border with Coral text.
- **Input Fields:** Rounded containers with a subtle soft-gray background. Upon focus, the border should transition to a 2px Deep Blue stroke.
- **Cards:** White backgrounds with `rounded-xl` corners and a soft Blue-tinted shadow. Cards for "Lessons" should feature a top accent bar in Sunny Yellow or Warm Coral.
- **Chips/Badges:** Use Tertiary Yellow for "New" or "In Progress" labels. They should be small, pill-shaped, and use `label-sm` typography.
- **Progress Bars:** Use a thick track (12px height). The "filled" portion should be the Primary Blue, while the "empty" portion is a very light tint of the same color.
- **Lists:** Items should be separated by whitespace rather than lines. Each list item should feel like a "mini-card" with its own rounded background on hover.
- **Feedback Indicators:** Use icons frequently. A "Success" state should use a Deep Blue checkmark with a celebratory Sunny Yellow burst effect.