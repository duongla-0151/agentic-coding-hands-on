---
name: clarifications-login-page
description: Resolved design and implementation decisions for the Login page
metadata:
  type: project
---

## Session 2026-05-15

- Q: Supabase connection details → A: Use defaults — http://127.0.0.1:54321 with placeholder anon key in .env.local
- Q: Post-login redirect destination → A: / (root home page)
- Q: Language options → A: VN + EN with full i18n using next-intl
- Q: Key visual asset → A: MoMorph media API returned 404; use CSS radial-gradient approximation of the colorful abstract artwork
- Q: "ROOT FURTHER" display → A: MM_MEDIA_Root Further Logo is an embedded Figma image (not text); render as styled text with Montserrat 900 weight as approximation
- Q: Logo in header → A: Figma embedded image not accessible; use SVG text placeholder "Sun* Annual Awards 2025"

## Design Token Decisions (from MoMorph node context)

- Page background: #00101A
- Header bg: rgba(11, 15, 18, 0.8), height 80px, padding 12px 144px
- Left gradient overlay: linear-gradient(90deg, #00101A 0%, #00101A 25.41%, rgba(0,16,26,0) 100%)
- Bottom gradient overlay: linear-gradient(0deg, #00101A 22.48%, rgba(0,19,32,0) 51.74%)
- Description text: Montserrat 700, 20px, line-height 40px, color #FFFFFF
- Login button: 305×60px, bg #FFEA9E, border-radius 8px, padding 16px 24px, gap 8px
- Footer: padding 40px 90px, border-top 1px solid #2E3940
- Key visual node: full-width image (Figma embed, not accessible) → CSS gradient approximation
