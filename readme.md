# XDCVALUATION.md — Build Bible

**Project:** XDC Valuation Framework — xdcvaluation.info
**Author:** Matt Blair (FutureXRP / @the5blairs)
**Sibling property:** xrpvaluation.info (XRP Valuation Series)
**Status:** Greenfield. This document is the single source of truth for Claude Code.

---

## 1. What this is

A standalone analytical publication applying the xrpvaluation.info methodology to XDC Network — but with its own thesis, its own math, and its own visual identity. This is NOT a reskin of the XRP site. It is a sibling in a family of valuation frameworks.

**One-line positioning:** A structural analysis of XDC as settlement and collateral infrastructure for digitized trade finance.

**The core thesis:** Global trade finance (~$28T annual market, $2.5–5T SME financing gap per ADB) is undergoing a once-in-four-centuries legal transition — MLETR and national laws like the UK Electronic Trade Documents Act 2023 are giving electronic trade documents the same legal standing as paper for the first time. XDC Network is positioned as the public chain where MLETR-compliant documents (via TradeTrust) and settlement (via USDC and native rails) live on one infrastructure.

**The honest core question (this defines the site's credibility):** Trade documents can be tokenized on XDC without XDC-the-token capturing proportional value. Settlement increasingly runs through USDC. TradeTrust is chain-agnostic. The framework's central analytical task is testing the *elasticity between trade finance volume on the network and demand for the native token* (gas, masternode staking collateral, protocol collateral). If that elasticity is weak, the thesis reprices. We say this on the landing page, not in a footnote.

---

## 2. Relationship to xrpvaluation.info

- Shared family vocabulary: "The Living Framework," "Field Notes," concession-at-full-strength, explicit falsification conditions, conditional analysis framing.
- Shared footer block on both sites cross-linking the two frameworks: "Part of the Valuation Frameworks family — XRP · XDC."
- Distinct thesis language. XRP = bridge asset at inter-bloc settlement seams, sized by the square-root market impact law. XDC = document-to-settlement infrastructure, sized by a TVL-linked accrual model. Never blur the two. The XRP site's square-root law is NOT the primary tool here (see §10, Part IV).
- The exploratory section gets its own name on this site: **The Manifest** (a ship's manifest lists cargo — exploratory pieces list what the framework is carrying but hasn't settled). Functionally identical to the XRP site's Observatory.

---

## 3. Methodology rules (non-negotiable, applies to all content)

1. **Primary sources only** for factual claims: UNCITRAL MLETR text, UK ETDA 2023, Singapore IMDA/TradeTrust documentation, ICC Digital Standards Initiative, ADB trade finance gap reports, BIS, IMF, national legislation, XDC Network technical docs, on-chain data (XDCScan). Secondary/aggregator sources may point us to primaries but are never cited as authority.
2. **Concession-at-full-strength:** every piece engages the strongest version of the opposing case. The bear case for XDC has actual tombstones (we.trade, Marco Polo, Contour — see Part III) and must be presented at full force before any rebuttal.
3. **Explicit falsification conditions:** every major claim ships with the observable conditions that would prove it wrong (see §11).
4. **Conditional analysis disclaimer** on every article: "This series argues from stated assumptions. The purpose is not to promise outcomes, but to show what the math and structure would require if adoption conditions are met — and to price the probability that they are met at all."
5. **Not financial advice** disclaimer in footer of every page.
6. **Attribution block** (About section): same honest framing as the XRP site — Matt's intellectual direction, Claude as the pen, no affiliation with XDC Network/XinFin or any entity with a financial interest.

---

## 4. Tech stack and hosting

- **Static site. No framework, no build step.** Plain HTML + CSS + vanilla JS, exactly like xrpvaluation.info. GitHub Pages deployment with custom domain xdcvaluation.info (CNAME file in repo root).
- Repo: `futurexrp/xdcvaluation` (or Matt's preferred name — confirm at init).
- Every dynamic section is **JSON-feed driven from day one.** No hardcoded content cards anywhere on index.html. This is a hard rule learned from the XRP site, where the Observatory section was hardcoded and still needs migration. Do not repeat that mistake.

---

## 5. File structure

```
/
├── CNAME                      # xdcvaluation.info
├── index.html                 # Landing page
├── styles.css                 # Full design system (see §7)
├── main.js                    # Feed rendering, live ticker, nav
├── feeds/
│   ├── series.json            # The five series parts (status-aware)
│   ├── fieldnotes.json        # Living Framework field notes
│   └── manifest.json          # The Manifest exploratory pieces
├── part1/index.html           # Standalone article pages, one dir each
├── part2/index.html
├── part3/index.html
├── part4/index.html
├── part5/index.html
├── fieldnotes/<slug>/index.html
├── manifest/<slug>/index.html
├── about/index.html           # Optional; About can live on index instead
└── assets/                    # og-image, favicon, any figures
```

Article pages are standalone HTML (each preserves its own exact text and formatting, matching the XRP site convention). They share styles.css but may carry page-scoped overrides.

---

## 6. JSON feed schemas

All three feeds share one card schema so main.js renders them with a single function:

```json
{
  "posts": [
    {
      "slug": "part1",
      "section": "series | fieldnote | manifest",
      "number": "Part I | Field Note 1 | Manifest No. 1",
      "kicker": "Structural Analysis",
      "title": "The four-hundred-year-old document.",
      "titleEmphasis": "document",
      "summary": "2–3 sentence card summary.",
      "tags": ["MLETR", "Bills of Lading", "Legal Adoption"],
      "inside": ["Bullet one", "Bullet two", "Bullet three"],
      "date": "2026-07-15",
      "url": "/part1/",
      "status": "published | coming"
    }
  ]
}
```

- `titleEmphasis`: optional substring of `title` to render in the accent style (italic/color), matching the family convention of emphasized title fragments.
- `status: "coming"` renders a non-linked card with a "Forthcoming" stamp — the series contents are visible from day one even before all parts publish.
- Rendering: main.js fetches all three feeds on load, renders series cards into the Series section (ordered by number), field notes into the Living Framework section (newest first), manifest pieces into The Manifest section (newest first). Graceful failure: if a fetch fails, the section shows a quiet "Feed unavailable" line, never a broken layout.

---

## 7. Design system — "The Documentary Ledger"

Sibling identity: same editorial seriousness as the XRP site, but its own world. XDC's subject is trade documents — bills of lading, letters of credit, customs stamps, manila folders, carbon-copy ink. The design is grounded there.

**Do not copy the XRP site's palette or type.** Claude Code should glance at the xrpvaluation repo only for layout conventions (hero → contents → article cards → living framework → about → footer), never for colors or fonts.

### 7.1 Color tokens

```css
:root {
  --ink:        #101820;  /* page background — deep documentary ink, not pure black */
  --ink-raised: #18232E;  /* cards, panels */
  --paper:      #EDE6D6;  /* primary text — aged document paper, warm off-white */
  --paper-dim:  #A89F8D;  /* secondary text, captions */
  --manila:     #D9B96C;  /* primary accent — manila tag / ledger gilt. Headlines' emphasis, links, stamps */
  --carbon:     #6E9BC5;  /* secondary accent — carbon-copy blue. Data, tags, live figures */
  --seal:       #B5482E;  /* used SPARINGLY — the wax-seal red. Falsification conditions, "Forthcoming" stamps, warnings only */
  --rule:       #2A3642;  /* hairline ledger rules */
}
```

Rule of use: manila is the voice, carbon is the data, seal is the warning. If seal red appears more than twice per viewport, it's being overused.

### 7.2 Typography

- **Display:** `Fraunces` (Google Fonts), optical size axis on, weights 400–600, used for headlines and emphasized title fragments (italic + manila). Fraunces has the ink-trap, old-ledger character this subject calls for without being a newspaper cliché.
- **Body:** `Source Serif 4`, 400/600, 1.7 line-height, max measure 68ch on article pages.
- **Utility/data:** `IBM Plex Mono` for tickers, stats, dates, tags, stamp labels, and falsification-condition blocks. Mono is the "typewritten manifest" voice — use it for anything that reads like a record.
- Type scale: 12 / 14 / 16 / 19 / 24 / 34 / 52 (px, fluid via clamp() at the top two sizes).

### 7.3 Signature element — the Customs Stamp

Each card and article header carries a **stamp**: an inline-block label set in IBM Plex Mono, uppercase, letter-spaced, inside a 1px border with slightly rounded corners and a 1–2° rotation (`transform: rotate(-1.5deg)`), colored per section — manila for Series, carbon for Field Notes/Manifest, seal for "Forthcoming" and falsification blocks. This is the one memorable device; everything else stays quiet. Respect `prefers-reduced-motion`: the stamp never animates, it just *is*.

### 7.4 Everything else stays disciplined

- Ledger rules: 1px `--rule` horizontal dividers between sections; section headers sit on the rule like ledger headings.
- Cards: `--ink-raised`, 1px rule border, no shadows, 2px radius. Hover: border shifts to manila, nothing moves.
- Motion: one orchestrated page-load fade/rise on the hero only. No scroll-triggered effects.
- Fully responsive to 360px. Visible keyboard focus (2px carbon outline). Semantic HTML, single h1 per page.
- OG image: ink background, Fraunces title, one manila stamp. Generate a simple 1200×630 SVG→PNG.

---

## 8. Landing page (index.html) — section order

1. **Header bar:** wordmark "XDC Valuation Framework" + live ticker (see §9) + link to sibling site ("XRP Series ↗").
2. **Hero:** kicker stamp "A five-part publication" · h1 "XDC Valuation Framework" · dek: "A structural analysis of XDC as settlement and collateral infrastructure for digitized trade finance." · Conditional-analysis panel (§3.4 text).
3. **The honest core panel:** a short, prominent block (stamped "THE OPEN QUESTION", carbon) stating the value-accrual problem in 3–4 sentences. This site leads with its hardest question. Nothing like this exists on the XRP site — it is this site's front-door credibility move.
4. **Contents:** the five parts as a compact list (number, title, one-liner), rendered from series.json.
5. **Articles:** full series cards from series.json (published ones link out; forthcoming ones carry the seal "Forthcoming" stamp).
6. **The Living Framework:** intro paragraph (framework not frozen, tracks evidence against falsification criteria) + cards from fieldnotes.json.
7. **The Manifest:** intro paragraph (exploratory analysis beyond the core accrual model — rigorous thinking, provisional conclusions) + cards from manifest.json.
8. **About this framework:** first-person text from Matt (adapt the XRP About voice: retail investor, no affiliation, Claude as pen, honest-conviction framing — but write fresh copy for XDC; do not paste the XRP text). Include the falsification-conditions summary (§11) here, stamped in seal.
9. **Footer:** disclaimers, FutureXRP · @the5blairs, family cross-links.

---

## 9. Live data

- **Ticker:** XDC/USD price, 24h volume, market cap. Source: CoinGecko public API (`/simple/price?ids=xdce-crowd-sale&vs_currencies=usd&include_24hr_vol=true&include_market_cap=true`) — verify the CoinGecko id at build time. Fetch on load, refresh every 60s, render in IBM Plex Mono in the header. Graceful "—" placeholders on failure. No API key required.
- **Phase 2 (do not build at launch):** "The Accrual Engine" — an interactive tool modeling TVL → native-token-demand elasticity (staking collateral ratios, fee burn, masternode economics) with live RWA TVL inputs. Analog of the XRP site's calculator/terminal. Spec separately after Part IV's math is written and stress-tested. Leave a stub card in the Manifest section only when Part IV publishes.

---

## 10. The series — content briefs

These briefs guide the writing sessions. Claude Code builds the page shells now (hero, article layout, stamped headers, footer, prev/next nav); article text is written with Matt in dedicated sessions, one part at a time, and dropped into the shells.

**Part I — The four-hundred-year-old document.** *(Anchor piece. Written first.)*
The bill of lading and why paper still governs a $28T market. MLETR (UNCITRAL, 2017) as the legal unlock; UK Electronic Trade Documents Act 2023 as the watershed (English law governs the majority of global trade documentation). The jurisdiction-by-jurisdiction MLETR adoption curve — chartable, datable, the framework's empirical spine. ADB trade finance gap data. TradeTrust and what "MLETR-compliant on a public chain" concretely means. Ends by posing, not answering, the value-accrual question.
Primary sources: UNCITRAL MLETR text + status page, ETDA 2023 text, ICC DSI publications, ADB gap reports, IMDA TradeTrust docs.

**Part II — The value accrual problem.** *(The honest core, placed early on purpose.)*
Does document tokenization create token demand? The three demand channels: gas, masternode staking collateral (fixed 10M XDC per masternode — verify current parameters against primary docs), and emergent protocol collateral. The USDC settlement problem: settlement value flowing through Circle's rails, not the native token. The inverted-RLUSD structure: the XRP framework argued a stablecoin cannot substitute for a bridge asset at the seam; here we must test whether the stablecoin does substitute for the native token in the settlement role. TradeTrust chain-agnosticism as a standing threat. Supply overhang: ~20B circulating vs ~38B total (verify current figures on-chain). Derive the elasticity question formally; Part IV quantifies it.

**Part III — The consortium graveyard.** *(Concession at full strength.)*
we.trade (dissolved 2022), Marco Polo Network (insolvent 2023), Contour (wound down 2023) — blockchain trade finance backed by the world's largest banks failed three times in two years. Autopsy each: governance, incentive misalignment, permissioned-network liquidity islands, and — critically — the absence of legal recognition for electronic transferable records during their lifetimes. Then the differentiation argument, only as far as it honestly goes: MLETR/ETDA changes the legal substrate; public-chain neutrality changes the incentive structure; TFDi participation changes distribution. State plainly which failure causes are cured by these changes and which are not.

**Part IV — Sizing the machine.** *(The quantitative contribution.)*
XDC is not a bridge asset absorbing peak tickets — the square-root market impact law is not the primary tool. Build the TVL-linked accrual model instead: for $X of on-chain trade finance, derive token demand from (a) staking collateral required for validator economics at the implied security budget, (b) fee demand at observed gas dynamics, (c) any protocol-collateral requirements. Produce scenario table: penetration of the digitizable trade market × XDC's chain share × accrual elasticity → implied market cap → implied price at projected circulating supply. Where the square-root law DOES apply: sizing the liquidity XDC's own market needs to absorb institutional staking positions without unacceptable impact. This part's math feeds the Phase 2 Accrual Engine.

**Part V — The case against, taken seriously.** *(Series close.)*
Failure modes at full strength: (1) accrual decoupling — TVL grows, token demand doesn't (the ghost-chain outcome); (2) TradeTrust multichain migration to a larger ecosystem; (3) USDC/stablecoin capture of the full settlement layer; (4) supply overhang absorption; (5) consortium-graveyard repeat via enterprise-adoption stall. Probability table, expected value, Kelly sizing, explicit falsification criteria. Same discipline as XRP Part VI: the bull case earned only by taking the bear case on its own terms.

---

## 11. Falsification conditions (site-level, published in About)

Initial set — refine as parts are written:
1. MLETR-aligned adoption stalls below a stated jurisdiction count by a stated date (set thresholds in Part I from the current UNCITRAL status page).
2. On-chain trade finance TVL grows ≥3× while native staking + fee demand remains flat — confirmed accrual decoupling (Part II/IV metrics define the exact measurement).
3. TradeTrust production deployments migrate predominantly to a competing chain.
4. TFDi or equivalent institutional distribution channels settle exclusively in stablecoins with no measurable native-token demand response over a stated window.
Each falsification block on the site is stamped in seal red, set in IBM Plex Mono.

---

## 12. Build phases

**Phase 1 — this build (Claude Code, now):**
1. Repo scaffold, CNAME, full styles.css design system per §7.
2. index.html complete per §8, with all three feeds wired and rendering.
3. series.json seeded with all five parts, `status: "coming"` (Part I flips to published when written).
4. fieldnotes.json and manifest.json seeded as empty `{"posts": []}` — sections render their intros with a quiet "First entries forthcoming" line.
5. Article page template built as part1/index.html shell (stamped header, article typography, sources block, falsification block style, prev/next, footer) — then duplicated to parts 2–5.
6. Live ticker working with graceful failure.
7. OG image, favicon (a manila stamp "XDC" mark), meta tags, sitemap.xml, robots.txt.

**Definition of done for Phase 1:** site deploys on GitHub Pages, renders correctly at 360/768/1440px, all feeds load, ticker live, Lighthouse accessibility ≥ 95, zero hardcoded content cards in index.html.

**Phase 2 — after Part IV:** The Accrual Engine (separate spec).
**Phase 3 — ongoing:** Field Notes and Manifest pieces via feed appends + standalone pages; identical commit workflow to the XRP site.

---

## 13. Voice guide (for all site copy Claude Code writes now)

- Confident, measured, first-person-plural avoided; the framework speaks, not a brand.
- Short declarative headlines with one emphasized fragment (the `titleEmphasis` convention).
- Never hype. Never price predictions in site chrome. The strongest statements on this site are its concessions.
- Plain-language explanations of technical machinery — written for the intelligent non-specialist, same register as the XRP series.
- The words "could," "would require," and "if" do heavy lifting by design. Conditional analysis is the genre.

## 14. Do not

- Do not hardcode content cards anywhere on index.html.
- Do not reuse the XRP site's palette, fonts, or About text.
- Do not apply the square-root law as the headline valuation tool.
- Do not cite aggregators, exchanges, or price-prediction content as sources.
- Do not soften Part III. The graveyard is the point.
- Do not add the seal-red accent to anything that is not a warning, a falsification condition, or a "Forthcoming" stamp.
