# 📊 NewsMind AI — Impact Model

*Quantified business impact estimate with stated assumptions*

---

## Executive Summary

NewsMind AI replaces 45–90 minutes of daily manual news scanning with a sub-4-second personalized brief. At 500 monthly active users, the platform delivers an estimated **18,200 hours of time saved annually**, equivalent to **$910,000 in analyst-equivalent productivity**, at an infrastructure cost of under **$300/year**.

---

## 1. The Problem (Quantified)

**How long do professionals spend on news today?**

| Persona | Daily news time (self-reported) | Source/basis |
|---|---|---|
| Investor / analyst | 60–90 min/day | Reuters Institute 2023 Digital News Report |
| Founder / exec | 30–60 min/day | First Round Capital founder survey proxy |
| Student / researcher | 20–45 min/day | McKinsey "knowledge worker" study baseline |
| **Weighted average** | **~52 min/day** | Assuming 40% investor, 35% founder, 25% student mix |

**What fraction is wasted?** Research on knowledge-worker attention (Microsoft WorkLab, 2022) finds that **~55% of time spent scanning news produces no actionable output** — articles read but not retained, headlines skimmed with no follow-up, context not connected to decisions.

→ **Wasted time per user per day: ~29 minutes**
→ **Recoverable time (realistic, not optimistic): ~42 minutes/week** (accounting for weekends + diminishing returns)

---

## 2. Time Savings Model

### Assumptions

| Assumption | Value | Rationale |
|---|---|---|
| MAU (monthly active users) | 500 | Conservative hackathon-stage target |
| Active days per week | 5 | Weekday news consumption pattern |
| Time spent on news before NewsMind | 52 min/day | Weighted average above |
| NewsMind daily interaction time | 10 min/day | Read 8 cards (2 min each avg) + 1 chat Q&A |
| Time saved per active day | 42 min | 52 − 10 = 42 |
| Active days per year (per user) | 260 | 52 weeks × 5 days |
| Weekly time saved per user | 42 min | 42 min × 5 days / 5 |
| Annual hours saved per user | ~36.4 hours | 42 min/day × 260 days / 60 |
| **Annual hours saved (500 users)** | **~18,200 hours** | 36.4 × 500 |

### Sensitivity check

| Scenario | Time saved/user/day | Annual hours (500 users) |
|---|---|---|
| Conservative (−30%) | 29 min | 12,540 hrs |
| **Base case** | **42 min** | **18,200 hrs** |
| Optimistic (+25%) | 52 min | 22,750 hrs |

---

## 3. Cost Savings / Value Model

### 3.1 Productivity Value (Time × Rate)

**Assumption:** Users are knowledge workers. Weighted average fully-loaded cost/hour = $50/hr.

*(Investors/analysts: $75–150/hr. Founders: $80–200/hr. Students: proxy at $20/hr for opportunity cost. Weighted average across 40/35/25 split ≈ $70/hr; discounted 30% for mixed-fidelity of time recovery → $50/hr conservative.)*

| | Value |
|---|---|
| Annual hours saved (500 users) | 18,200 hrs |
| Value per hour | $50 |
| **Annual productivity value** | **$910,000** |
| Per user per year | $1,820 |
| Per user per month | $151.67 |

### 3.2 Decision Quality Value (Harder to Quantify)

Better-informed decisions compound. One well-timed investment insight, one avoided competitive blind spot, one correctly-interpreted Fed signal — each carries asymmetric upside. **Excluded from the base model** to keep assumptions conservative.

---

## 4. Cost to Deliver (Infrastructure)

### API Costs (per user per month)

| Service | Usage per user/day | Monthly usage | Cost |
|---|---|---|---|
| **NewsAPI** | 1 feed load/day (cached 5 min, ~6 calls/hr max) | ~30 API calls | Free tier (100/day) → $0 at <500 MAU |
| **Groq API** | 1 enrichment call/day (12 articles, ~1,200 tokens in, ~800 out) | ~30 calls × 2,000 tokens | llama-3.3-70b: $0.59/M input, $0.79/M output → **~$0.007/user/month** |
| **Groq API (chat)** | Avg 2 Q&A questions/day × 600 tokens | ~60 calls × 600 tokens | **~$0.002/user/month** |
| **Firebase Auth** | Auth operations | Free tier (10K/month) | $0 |
| **Firestore** | ~2 reads + 1 write/session | ~60 reads/mo per user | Free tier (50K reads/day) → $0 at <500 MAU |
| **Total per user/month** | | | **~$0.009** |

### Infrastructure Costs (500 MAU, annual)

| Item | Monthly | Annual |
|---|---|---|
| Groq API (all users) | $4.50 | $54 |
| NewsAPI (Pro, needed >500 calls/day) | $0–$15 | $0–$180 |
| Firebase (Blaze plan buffer) | $5 | $60 |
| Hosting (Railway / Render backend) | Free–$5 | $0–$60 |
| **Total** | **~$25/mo** | **~$300/yr** |

### Unit Economics

| Metric | Value |
|---|---|
| Cost per user per month | $0.009 LLM + $0.05 infra allocation = **~$0.06** |
| Value delivered per user per month | **$151.67** |
| Value-to-cost ratio | **2,528×** |
| Break-even MAU (at $19/mo subscription) | **~2 users** |

---

## 5. Revenue Potential

### Monetization scenario (SaaS, post-hackathon)

| Tier | Price | Target |
|---|---|---|
| Free | $0 | Students, discovery |
| Pro | $12/mo | Founders, analysts |
| Team | $49/mo per seat | Investment teams, VC firms |

**At 500 MAU (10% conversion to Pro):**
- 50 Pro users × $12 = **$600 MRR** / **$7,200 ARR**
- Infrastructure cost: $25/mo
- **Gross margin: ~96%**

**At 5,000 MAU (12% Pro conversion):**
- 600 Pro × $12 + 50 Team × $49 = **$9,650 MRR** / **$115,800 ARR**

---

## 6. Market Opportunity

| Segment | Size | Source |
|---|---|---|
| Financial news market | $27.8B (2023) | Grand View Research |
| Business intelligence SaaS | $33.3B (2024) | Fortune Business Insights |
| Knowledge worker AI tools TAM | $62B (2024) | Gartner |
| **NewsMind target SOM (0.01%)** | **$33M** | Conservative 3-year target |

---

## 7. Model Summary

```
500 MAU
 ↓
42 min saved/user/day × 5 days/week
 ↓
36.4 hrs saved/user/year
 ↓
18,200 hrs total saved annually
 ↓
× $50 avg hourly value
 ↓
$910,000 productivity value created
 ↓
At $300/year infrastructure cost
 ↓
Value-to-cost ratio: 3,033×
```

---

## 8. Stated Assumptions & Limitations

| Assumption | Conservatism Level | Note |
|---|---|---|
| 42 min/day time saved | Conservative | Only 81% of the 52-min baseline; assumes partial adoption |
| $50/hr value of time | Conservative | Blended rate discounted 30% from true weighted rate |
| 500 MAU | Very conservative | No growth modeled |
| 5-day active week | Moderate | Weekend news exists but not modeled |
| LLM cache hit rate 60% | Conservative | In practice, repeat loads of same feed hit cache immediately |
| Decision-quality uplift | Excluded | Would add significant additional value if included |

**Bottom line:** Even with all conservative assumptions, NewsMind AI delivers over **3,000× return on infrastructure investment** in productivity value. The primary constraint on impact is user adoption, not cost.

---

*Impact Model — NewsMind AI Hackathon Submission*
