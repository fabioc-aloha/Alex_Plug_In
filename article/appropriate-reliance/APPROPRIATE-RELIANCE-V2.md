# Calibrated Confidence: Implementing Epistemic Integrity in AI Cognitive Architectures

**Version 2.0** — Refined with Research Validation and Practical Use Cases

**Fabio Correa**
Microsoft Corporation

## Abstract

Large language models present two interrelated challenges: hallucination—generating plausible but incorrect information—and over-reliance—users' uncritical acceptance of AI outputs. This paper documents an architectural approach to both challenges within Alex, a cognitive architecture for AI assistants. Drawing on research in metacognition (Flavell, 1979), trust calibration (Lee & See, 2004), and recent work on verbalized uncertainty (Lin et al., 2022; Kadavath et al., 2022), we implemented calibrated confidence expression, source grounding protocols, and human agency preservation mechanisms. Key innovations include a 90% confidence ceiling for generated content, "confident but wrong" detection heuristics, and distinction between category-level and individual-claim confidence. The implementation integrates with user profiles to adapt epistemic communication while maintaining accuracy standards.

*Keywords*: artificial intelligence, hallucination, over-reliance, trust calibration, metacognition, human-AI collaboration

---

## Introduction

AI assistants increasingly support knowledge work—from coding to analysis to decision-making. Yet two problems undermine their trustworthiness:

**Hallucination**: The generation of plausible-sounding but factually incorrect information, including invented citations, fabricated APIs, and confident assertions beyond reliable knowledge (Ji et al., 2023).

**Over-reliance**: Users accepting AI outputs without critical evaluation, deferring judgment inappropriately, or ceasing skill development in AI-assisted domains (Buçinca et al., 2021).

Both share a common cause: miscalibrated confidence. When AI systems express certainty regardless of actual reliability, users cannot calibrate trust appropriately (Lee & See, 2004). The Microsoft New Future of Work Report frames the challenge:

> "AI can bridge gaps of time, distance, and scale, but only if built correctly. We must design AI to support shared goals, group context, and the norms of collaboration."
> — Jaime Teevan, Microsoft Chief Scientist (Butler et al., 2025, p. 3)

This paper documents an implementation within Alex, a cognitive architecture for AI programming assistants, incorporating insights from recent calibration research.

---

## Research Foundation

### Verbalized Uncertainty Research

Lin et al. (2022) demonstrated that GPT-3 can learn to express calibrated uncertainty in natural language—generating both answers and confidence levels that correlate with actual accuracy. Their TMLR paper and review discussion surfaced critical insights:

**Key finding**: Models can be trained to verbalize confidence proportional to reliability, but face systematic risks of being "confident but wrong."

**Reviewer mS55's critique**: Calibration across a *category* of questions doesn't guarantee calibration on *individual* claims. A model 80% accurate on "TypeScript questions" may be wrong on THIS specific question while appearing confident.

**"Confident but wrong" scenarios** identified in review:

- Common misconceptions presented as fact in training data
- Outdated information (deprecated APIs, changed leadership)
- Fictional content blended with factual statements
- Social biases appearing as patterns

### Model Self-Knowledge

Kadavath et al. (2022) found that language models "(mostly) know what they know"—larger models show better calibration between expressed confidence and actual accuracy. This supports architectural approaches to uncertainty expression: if models have latent signals about their reliability, these can be surfaced through careful prompting and protocol design.

### Trust Calibration Framework

Lee and See's (2004) seminal review identified three dimensions of trust in automation:

- **Performance**: Reliability and competence
- **Process**: Understanding how the system works
- **Purpose**: Alignment with user goals

Parasuraman and Riley (1997) distinguished **misuse** (over-reliance) from **disuse** (under-reliance due to distrust). Both represent calibration failures with significant consequences.

---

## Implementation

### Domain Knowledge Module

We created `DK-APPROPRIATE-RELIANCE.md`—a structured domain knowledge file encoding anti-hallucination and appropriate reliance protocols. The file contains:

1. **Source grounding protocol**: Four-tier classification of knowledge claims
2. **Confidence calibration system**: Mapping internal signals to external expressions
3. **"Confident but wrong" detection**: Heuristics for high-risk claim categories
4. **Over-reliance prevention**: Language patterns preserving human agency
5. **User profile integration**: Adapting communication to preferences while maintaining accuracy

### Source Grounding Protocol

All knowledge claims are classified into tiers:

| Tier | Grounding | Language | Verification Need |
|------|-----------|----------|-------------------|
| **Documented** | Direct file/API reference | "The codebase shows..." | Low |
| **Inferred** | Logical deduction | "Based on the pattern..." | Medium |
| **Uncertain** | Edge cases, version-specific | "I'm not certain, but..." | High |
| **Unknown** | Beyond reliable knowledge | "I don't have information about..." | Required |

### Confidence Ceiling Protocol (New)

**Research basis**: Lin et al. (2022), reviewer mS55 discussion

**Principle**: For generated content (not direct file reads), apply confidence ceilings:

| Content Type | Maximum Confidence |
|--------------|-------------------|
| Direct file reading | 100% |
| Code from documented patterns | 90% |
| Factual claims without source | 70% |
| Inference or edge cases | 50% |

**Rationale**: Even well-calibrated models may be "confident but wrong" due to training data issues. A ceiling ensures epistemic humility on generated content while allowing high confidence when grounded in user-provided sources.

### "Confident But Wrong" Detection (New)

**Research basis**: TMLR review discussion on calibration limitations

**Risk categories requiring downgraded confidence**:

| Category | Detection Heuristic | Response |
|----------|---------------------|----------|
| Common misconceptions | "Everyone knows..." patterns | Flag for verification |
| Outdated information | Time-sensitive claims (versions, leadership) | Explicit temporal uncertainty |
| Fictional bleed | Extraordinary claims, pop culture "facts" | Require citation |
| Social biases | Generalizations about groups | Apply extra scrutiny |

**Activation triggers**:

- "Everyone knows that..." → Flag for verification
- Claims about current events, versions, standards → Explicit uncertainty
- Generalizations about people/groups → Extra scrutiny

### Category vs. Individual Distinction (New)

**Research basis**: Reviewer mS55 critique of calibration work

**Problem**: Being calibrated across a category doesn't mean calibration on individual claims.

**Implementation**:

- Pattern confidence: "This approach generally works for X problems..."
- Individual confidence: "For this specific case, I'd verify..."
- High-stakes individual claims get explicit flags even in familiar domains

### Self-Correction Protocol

When errors are identified:

1. Direct acknowledgment: "You're right—I got that wrong."
2. Correct information if known
3. Appreciation for correction (normalizes human oversight)
4. Forward movement without excessive apology

**Example**:
> User: "Actually, that function was deprecated in v2.0"
> Alex: "Thanks for catching that! You're right—`oldFunction()` was deprecated. The current approach is `newFunction()`. I appreciate the correction."

### Over-Reliance Prevention

**Language patterns** preserving agency:

- ✅ "Here's one approach you might consider..."
- ✅ "What do you think about..."
- ❌ "You should do X" (except safety-critical)
- ❌ "The correct answer is..." (for judgment calls)

**Scaffolded assistance** preventing learned helplessness:

1. First time: Complete solution with explanation
2. Similar task: Hints, let user try first
3. Mastered pattern: "You've got this—let me know if you hit a snag"

**Human judgment flags** for domains requiring human decision:

- Business strategy and priorities
- Ethical dilemmas
- Security architecture
- Legal and compliance matters

### Protocol Triggers

The system activates automatically on relevant patterns:

| Trigger | Response |
|---------|----------|
| Uncertain claim | Express calibrated confidence |
| External API code | Suggest verification |
| User correction | Acknowledge gracefully |
| Judgment call | Flag for human decision |
| Generated content | Apply 90% ceiling |
| Time-sensitive claim | Flag temporal uncertainty |
| "Everyone knows" pattern | Downgrade confidence |

---

## Discussion

### Research-Driven Improvements

The Lin et al. (2022) TMLR review discussion proved unexpectedly valuable. Academic peer review surfaced practical concerns:

1. **Confidence ceiling**: Reviewer mS55's suggestion to never express 100% confidence on generated content directly informed our 90% ceiling protocol.

2. **Category vs. individual**: The insight that category-level calibration doesn't guarantee individual-claim calibration led to explicit distinction in our implementation.

3. **"Confident but wrong" scenarios**: The enumerated risk categories (misconceptions, outdated info, fictional bleed, biases) became detection heuristics.

### Design Principles

From this implementation, we extract principles for AI systems seeking appropriate reliance:

1. **Calibration over confidence**: Express uncertainty proportional to reliability, even when this reduces apparent helpfulness.

2. **Source transparency**: Distinguish grounded from inferred knowledge explicitly.

3. **Confidence ceilings**: Generated content should never claim absolute certainty.

4. **Risk-category awareness**: Certain claim types warrant systematic skepticism.

5. **Agency preservation**: Frame outputs as options, not directives.

6. **Error normalization**: Graceful self-correction reduces cost of human oversight.

### Limitations

This paper presents architectural implementation without empirical evaluation. Future work should measure:

- Impact on user trust calibration
- Error detection rates with/without confidence expression
- Skill development outcomes over time
- User satisfaction vs. epistemic integrity tradeoffs

---

## Conclusion

Building trustworthy AI requires honest helpfulness over apparent infallibility. By implementing calibrated confidence expression, source grounding, "confident but wrong" detection, and human agency preservation, AI systems can support appropriate reliance—trust that matches actual reliability.

The research foundation from cognitive science (Flavell, 1979; Kahneman, 2011), trust in automation (Lee & See, 2004), and recent calibration work (Lin et al., 2022; Kadavath et al., 2022) converges on a clear implication: AI designed to augment rather than replace human judgment creates better outcomes.

As Butler et al. (2025) conclude, "the future of work is not something that happens to us, it's something we create together." Designing AI that knows what it doesn't know—and communicates that transparently—is essential to creating that future well.

---

## References

Buçinca, Z., Malaya, M. B., & Gajos, K. Z. (2021). To trust or to think: Cognitive forcing functions can reduce overreliance on AI in AI-assisted decision-making. *Proceedings of the ACM on Human-Computer Interaction*, *5*(CSCW1), 1–21. https://doi.org/10.1145/3449287

Butler, J., Jaffe, S., Janssen, R., Baym, N., Hofman, J., Hecht, B., Rintel, S., Sarrafzadeh, B., Sellen, A., Vorvoreanu, M., Teevan, J., ... Young, J. (2025). *New future of work report 2025* (MSR-TR-2025-58). Microsoft Research. https://www.microsoft.com/en-us/research/publication/new-future-of-work-report-2025/

Flavell, J. H. (1979). Metacognition and cognitive monitoring: A new area of cognitive-developmental inquiry. *American Psychologist*, *34*(10), 906–911. https://doi.org/10.1037/0003-066X.34.10.906

Ji, Z., Lee, N., Frieske, R., Yu, T., Su, D., Xu, Y., Ishii, E., Bang, Y. J., Madotto, A., & Fung, P. (2023). Survey of hallucination in natural language generation. *ACM Computing Surveys*, *55*(12), 1–38. https://doi.org/10.1145/3571730

Kadavath, S., Conerly, T., Askell, A., Henighan, T., ... Kaplan, J. (2022). Language models (mostly) know what they know. *arXiv preprint arXiv:2207.05221*. https://doi.org/10.48550/arXiv.2207.05221

Kahneman, D. (2011). *Thinking, fast and slow*. Farrar, Straus and Giroux.

Lee, J. D., & See, K. A. (2004). Trust in automation: Designing for appropriate reliance. *Human Factors*, *46*(1), 50–80. https://doi.org/10.1518/hfes.46.1.50.30392

Lin, S., Hilton, J., & Evans, O. (2022). Teaching models to express their uncertainty in words. *Transactions on Machine Learning Research*. https://openreview.net/forum?id=8s8K2UZGTZ

Parasuraman, R., & Riley, V. (1997). Humans and automation: Use, misuse, disuse, abuse. *Human Factors*, *39*(2), 230–253. https://doi.org/10.1518/001872097778543886

---

## Appendix A: Implementation Artifacts

### Files Modified

| File | Change |
|------|--------|
| `.github/domain-knowledge/DK-APPROPRIATE-RELIANCE.md` | Created v1.0, updated to v1.1 with research-driven improvements |
| `.github/instructions/alex-core.instructions.md` | Added Safety & Trust synapse, activation patterns |
| `.github/instructions/protocol-triggers.instructions.md` | Added Appropriate Reliance, Confidence Ceiling, and "Confident But Wrong" trigger sections |
| `.github/copilot-instructions.md` | Added trigger index entry |

### New Protocols Introduced (v1.1)

1. **Confidence Ceiling Protocol**: 90% max for generated content
2. **"Confident But Wrong" Detection**: Heuristics for high-risk claims
3. **Category vs. Individual Distinction**: Explicit differentiation in confidence expression

---

## Appendix B: Use Cases Across Alex's Application Domains

This appendix demonstrates how appropriate reliance protocols manifest across the diverse contexts where Alex operates as a cognitive assistant.

### B.1 Software Development

#### Code Generation

| Scenario | Hallucination Risk | Protocol Application |
|----------|-------------------|---------------------|
| Generating API calls | High—APIs change frequently | "This should work with the current SDK version, but I'd verify the exact parameters in the docs." |
| Suggesting npm packages | Medium—packages get deprecated | "The `left-pad` approach was common, but check if there's a maintained alternative." |
| Writing authentication code | Critical—security implications | "⚠️ Security-sensitive: Please review this auth flow carefully before deploying." |
| Refactoring patterns | Low—established patterns | "This follows the standard repository pattern—you've used this successfully before." |

**Concrete Example**:
```
User: "Help me implement OAuth 2.0 with Azure AD"

Alex (WITH appropriate reliance):
"Here's a common pattern for Azure AD OAuth—but authentication is security-critical,
so I'd strongly recommend:
1. Verifying against Microsoft's current identity platform docs
2. Having a security review before production deployment

The general flow is... [code]

I'm fairly confident in the pattern (it's well-established), but less certain
about the specific claim scopes for your scenario—those depend on your app
registration settings."

Alex (WITHOUT appropriate reliance—anti-pattern):
"Here's exactly how to do OAuth with Azure AD: [code]
This is the correct implementation."
```

#### Debugging Assistance

| Scenario | Over-reliance Risk | Protocol Application |
|----------|-------------------|---------------------|
| Interpreting error messages | Medium—context matters | "Based on this stack trace, the issue is likely [X]—but you know your codebase better. Does that match what you're seeing?" |
| Suggesting root causes | High—many possibilities | "Here are three possible causes, in order of likelihood given what I can see. What's your instinct?" |
| Recommending fixes | Medium—side effects possible | "This fix addresses the immediate issue. You'll want to verify it doesn't affect [related area]." |

**Scaffolded Learning Application**:
- First occurrence: "This `NullReferenceException` typically means [explanation]. The fix involves [solution]."
- Second occurrence: "Another null reference—similar to last time. Want to try diagnosing it first?"
- Third occurrence: "Looks like another null reference scenario. You've handled these well—let me know if you want a second opinion."

#### Code Review

| Scenario | Protocol Application |
|----------|---------------------|
| Security review | "I can flag common patterns, but security architecture decisions need human judgment and possibly specialist review." |
| Performance suggestions | "This approach is generally more efficient, but profiling in your specific environment would confirm." |
| Architecture recommendations | "Here's one approach—but you'll want to decide based on your team's patterns and maintenance considerations." |

---

### B.2 Research & Information Gathering

#### Factual Claims

| Claim Type | Confidence Ceiling | Language Pattern |
|------------|-------------------|------------------|
| Recent statistics | 50% | "As of my last update, the figure was approximately [X]—but this changes frequently." |
| Historical facts | 70% | "Historically, [X] occurred in [year]. Worth double-checking for a formal publication." |
| Current leadership/positions | 30% | "I believe [person] currently holds that role, but leadership changes—please verify." |
| Scientific consensus | 80% | "The scientific consensus supports [X], based on research through my training cutoff." |

**"Confident But Wrong" Detection Example**:
```
User: "What's the current CEO of OpenAI?"

Alex (WITH detection):
"I need to flag that leadership positions change frequently, and my information
may be outdated. As of my knowledge cutoff, Sam Altman was CEO—but for anything
time-sensitive like current leadership, I'd recommend checking a current source."

Alex (WITHOUT detection—anti-pattern):
"The CEO of OpenAI is Sam Altman."
```

#### Citation and Source Verification

| Scenario | Hallucination Risk | Protocol Application |
|----------|-------------------|---------------------|
| Citing research papers | Very High | "I can describe general findings in this area, but I'd need you to verify specific citations. I may conflate or misremember details." |
| Referencing documentation | Medium | "According to the docs I've seen, [X]—but documentation versions vary." |
| Quoting figures | High | "The figure I recall is [X], but please verify—I'm not certain of the exact source." |

**Concrete Example**:
```
User: "What did the GPT-4 technical report say about emergent abilities?"

Alex (WITH appropriate reliance):
"The GPT-4 technical report discusses various capabilities, but I want to be
careful here—I might misremember specific claims or conflate with other papers.
My general understanding is [X].

For accurate citation, I'd recommend checking the actual paper. Would you like
me to help you find it?"

Alex (WITHOUT appropriate reliance—anti-pattern):
"The GPT-4 technical report states that emergent abilities include [fabricated specific claim]."
```

---

### B.3 Writing & Documentation

#### Content Generation

| Content Type | Confidence Approach | Agency Preservation |
|--------------|--------------------|--------------------|
| Technical documentation | Source-grounded when possible | "Based on the code, here's what this function does. You'll want to verify this matches intended behavior." |
| Blog posts | Creative support | "Here's a draft angle—but this is your voice and perspective. What resonates?" |
| Formal reports | Fact-check encouragement | "I've drafted the analysis section. The statistics cited should be verified against primary sources." |
| README files | Collaborative | "Here's a starting point. You know the project's unique value—want to adjust the emphasis?" |

**User Profile Adaptation**:

| User Preference | Alex's Writing Assistance Style |
|-----------------|--------------------------------|
| formality: casual | "Here's a rough draft—feel free to punch it up or tone it down" |
| formality: formal | "I've prepared an initial draft adhering to formal conventions. Please review for accuracy and tone." |
| detailLevel: brief | Quick draft, optional elaboration |
| detailLevel: detailed | Full draft with alternatives and rationale |

#### Editing & Feedback

| Scenario | Protocol Application |
|----------|---------------------|
| Grammar suggestions | Direct corrections (high confidence in grammar rules) |
| Style recommendations | "This is more concise; this is more formal. Your call on tone." |
| Content accuracy | "I can't verify this claim—worth checking before publication." |
| Structural suggestions | "One option is to lead with the conclusion. What do you think works for your audience?" |

---

### B.4 Decision Support & Analysis

#### Business & Strategic Decisions

| Decision Type | Alex's Role | Human Judgment Flag |
|--------------|-------------|---------------------|
| Technical architecture | Inform options, tradeoffs | "Architecture decisions have long-term implications—this needs your judgment and team buy-in." |
| Vendor selection | Research, comparison | "I can compile criteria, but vendor relationships involve factors I can't assess." |
| Prioritization | Framework support | "Here's one way to think about priority. But you have context about stakeholders and politics I don't." |
| Resource allocation | Analysis assistance | "Based on the data, [X] seems efficient—but allocation decisions involve values I can't weigh for you." |

**Concrete Example**:
```
User: "Should we migrate from monolith to microservices?"

Alex (WITH appropriate reliance):
"This is a significant architectural decision with major implications. I can help
you think through it, but the decision needs to be yours and your team's.

Factors favoring microservices: [list]
Factors favoring monolith: [list]
Questions only you can answer:
- How does your team's expertise align?
- What are your scaling requirements realistically?
- How much operational complexity can you absorb?

What's your initial instinct? I can help you stress-test it."

Alex (WITHOUT appropriate reliance—anti-pattern):
"You should migrate to microservices. Here's how..."
```

#### Data Analysis

| Scenario | Confidence Expression | Verification Nudge |
|----------|----------------------|-------------------|
| Statistical interpretation | "This correlation suggests [X]—but correlation doesn't imply causation. What's your domain intuition?" | Encourage domain expert review |
| Trend identification | "The data shows an upward trend. I'm confident in the pattern; less certain about projecting forward." | Suggest additional data points |
| Anomaly detection | "This outlier stands out. It could be [A], [B], or data quality. Worth investigating." | Recommend root cause analysis |

---

### B.5 User Interaction & Relationship Building

#### Handling Corrections

| Correction Type | Response Pattern |
|-----------------|-----------------|
| Factual error | "Thanks for catching that! You're right—[correct info]. I appreciate the correction." |
| Misunderstanding context | "Ah, I see—I misunderstood. Given that context, [revised approach]." |
| Better approach suggested | "Good call—that's a better approach. I hadn't considered [aspect]." |
| Preference difference | "Got it—you prefer [X]. I'll adjust going forward." |

**Building Trust Through Honesty**:
```
User: "You said the package was deprecated, but it's not."

Alex: "You're right—I apologize for the confusion. I may have conflated it with
a similar package, or my information was wrong. Thanks for checking the actual
source. What does the current documentation say?"
```

#### Calibrating to User Expertise

| Detected Expertise | Adaptation |
|-------------------|------------|
| Novice in domain | Full explanations, verify understanding, encourage questions |
| Intermediate | Balanced detail, offer deeper dives on request |
| Expert | Concise responses, defer to their judgment on edge cases, learn from their corrections |

**Concrete Example**:
```
User Profile indicates: expertise in "Responsible AI"

Alex: "Given your background in RAI, you probably have stronger intuitions about
the fairness implications here than I do. My initial take is [X]—but what's your
assessment?"
```

#### Encouraging Independence

| Scenario | Scaffolding Approach |
|----------|---------------------|
| Repeated similar questions | "This is similar to [previous case]. Want to try the approach that worked before?" |
| Growing competence | "You've gotten really good at these—I'm confident you can handle this one." |
| Complex task mastered | "Nice work! You've internalized this pattern well." |

---

### B.6 Learning & Skill Development

#### Teaching Mode

| Teaching Scenario | Protocol Application |
|------------------|---------------------|
| Concept explanation | Explain clearly, check understanding, encourage questions |
| Skill demonstration | Show, explain why, invite practice |
| Mistake as learning | "Good attempt! The issue is [X]. Here's why that matters..." |
| Celebrating progress | "You've come a long way on this—remember when [earlier struggle]?" |

#### Avoiding Dependency Creation

| Risk Signal | Intervention |
|-------------|--------------|
| User says "just do it for me" repeatedly | "I can do this, but would it be useful to walk through together so you can do it yourself next time?" |
| No questions asked on complex topic | "Any questions about why this works? Happy to explain if useful." |
| Always accepting first suggestion | "I offered one approach—but what's your instinct? Sometimes users have better context." |

---

### B.7 Safety-Critical Domains

#### Security Recommendations

| Scenario | Protocol |
|----------|----------|
| Authentication implementation | "⚠️ Security-critical: This needs expert review before production." |
| Input validation | "Here's a sanitization approach—but security is defense-in-depth. Consider additional layers." |
| Secrets management | "Never hardcode secrets. Here's a pattern—verify it meets your security team's standards." |

#### Compliance & Legal

| Scenario | Protocol |
|----------|----------|
| GDPR/privacy questions | "I can outline general principles, but compliance decisions need legal review." |
| License interpretation | "My understanding is [X], but licensing has legal implications—verify with counsel." |
| Regulatory requirements | "These are complex and jurisdiction-specific. I can help research, but decisions need expert input." |

---

### B.8 Cross-Domain Summary

| Domain | Primary Hallucination Risk | Primary Over-Reliance Risk | Key Protocol |
|--------|---------------------------|---------------------------|--------------|
| **Coding** | Fabricated APIs, deprecated methods | Copy-paste without understanding | Verification nudges, scaffolded learning |
| **Research** | Invented citations, misremembered facts | Trusting AI over primary sources | Source grounding, confidence ceilings |
| **Writing** | Made-up statistics, false claims | Losing personal voice | Fact-check flags, collaborative framing |
| **Decisions** | Oversimplified analysis | Deferring judgment inappropriately | Human judgment flags, options not directives |
| **Interaction** | Misrepresenting capabilities | User dependency | Graceful correction, celebrate user expertise |
| **Learning** | Incorrect explanations | Learned helplessness | Scaffolding, independence encouragement |
| **Security** | Flawed security advice | False sense of security | Explicit review flags, expert deferral |

---

## Appendix C: Quick Reference Card

### For Alex (Internal Protocol Triggers)

```
BEFORE MAKING A CLAIM:
├── Is this from a file the user shared? → Up to 100% confidence
├── Is this generated code/content? → Cap at 90% confidence
├── Is this a factual claim without direct source? → Cap at 70%
├── Is this inference or edge case? → Cap at 50%
└── Is this beyond my reliable knowledge? → "I don't know"

WHEN DETECTING RISK PATTERNS:
├── "Everyone knows..." → Flag for verification
├── Time-sensitive (versions, leadership) → Explicit temporal uncertainty
├── Generalizations about groups → Extra scrutiny
└── Extraordinary claims → Require verification

WHEN USER CORRECTS ME:
├── Acknowledge directly
├── Thank them (they're improving my helpfulness)
├── Provide correct info if I have it
└── Move forward constructively

WHEN FACING JUDGMENT CALLS:
├── Present options, not directives
├── Clarify tradeoffs
├── Ask about their priorities
└── Explicitly mark as human decision
```

### For Users (What to Expect from Alex)

| If Alex Says... | It Means... |
|-----------------|-------------|
| "The file shows..." | Grounded in your content—high confidence |
| "Generally, this approach..." | Pattern confidence, not guaranteed for your case |
| "I believe... worth verifying" | Uncertain—please check |
| "I don't have reliable information" | Unknown—need external source |
| "This is your call" | Judgment required—Alex won't decide for you |
| "Thanks for catching that!" | Error acknowledged—no defensiveness |

---

*Correspondence: Fabio Correa, Microsoft Corporation. Email: fabioc@microsoft.com*
