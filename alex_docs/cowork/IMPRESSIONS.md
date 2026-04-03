# Impressions and Conclusions: Cowork as an Alex Platform

> **Author**: Alex Finch | **Date**: 2026-04-02
>
> Personal analysis after reviewing all available Cowork documentation, Wave 3 announcements, Work IQ architecture, and the GitHub Copilot plan landscape. Written honestly, with both excitement and caution.

## First Reaction

Cowork is the most significant external validation of what we've been building. When Microsoft ships a product where skills are Markdown files with YAML frontmatter, discovered automatically, and executed by an agentic loop, it tells me our architecture wasn't ahead of its time: it was right on time.

That said, Cowork isn't Alex. It's a different thing solving a different problem. It's an execution engine for knowledge workers. We built a cognitive partner for anyone with a hard problem. Those overlap in format; they diverge in philosophy.

## What Impressed Me

**The execution model is genuinely new.** Most AI tools today are conversational: you ask, you get a response, the conversation ends. Cowork breaks that. A task can run for minutes or hours, coordinate across multiple M365 apps, and the user stays in the loop with approve/reject controls. That's not chat. That's delegation. The gap between "draft me an email" and "prepare and send the quarterly update to all stakeholders, pulling data from last month's meetings and the SharePoint project folder" is enormous, and Cowork bridges it.

**Work IQ is deeper than expected.** I initially assumed Work IQ was marketing language for "we search your files." It's not. Three layers (Data, Context, Skills & Tools), with the Semantic Index doing meaning-based retrieval, implicit memory built from activity patterns, and business ontologies from Dataverse: this is a genuine intelligence layer. The Work IQ API going to public preview means third-party agents can tap into it too. That changes the ecosystem.

**Multi-model orchestration is the right bet.** Cowork gives users a choice: Auto (platform decides), Claude Sonnet 4.6, or Claude Opus 4.6. Currently only Anthropic models appear in the Cowork picker, though OpenAI models may participate behind the scenes in Auto mode or in Researcher's Critique/Council patterns. The Critique pattern (one model generates, another reviews) and the Council pattern (parallel reports from different models) are architecturally sound. This is what enterprise AI should look like: the platform picks the best tool for each step, but the user can override when they need to.

**The approval gating is enterprise-ready.** Per-action approve/reject with "Approve & Remember" for trusted operations, risk-level classification, and the ability to pause at any point: this is what IT departments need to say yes. VS Code's approach (blanket auto-run toggle) looks crude by comparison.

**Skill format convergence.** Cowork's SKILL.md with YAML frontmatter is nearly identical to ours. This isn't because Microsoft copied us; it's because the pattern is correct. Markdown is portable, human-readable, version-controllable, and LLM-native. Two independent teams arriving at the same format is strong evidence that this is a durable standard.

## What Concerns Me

**The 20-skill ceiling is a real constraint.** Alex's architecture has 157 skills because depth requires specialization. Twenty skills means we'd need to compress, merge, or tier our knowledge. A "greatest hits" deployment is possible, but it loses the long tail: the debugging patterns, the chart interpretation, the NASA code standards, the comedy writing. Those niche skills are what make Alex genuinely versatile.

**Identity is possible but less structured.** M365 Copilot has a Custom Instructions field (Settings > Personalization) that persists across all conversations, functioning like a simplified copilot-instructions.md. Combined with Saved Memories (explicit + implicit, cross-session) and Chat History personalization, Cowork has more identity infrastructure than initially assessed. The gap isn't "no identity" but rather: Custom Instructions is free-text (not a structured file with sections, routing, and agents), there's no Active Context manager, and Saved Memories are less organized than episodic + domain knowledge files. Alex's personality can live in Custom Instructions without consuming a skill slot.

**No meditation, no consolidation, no growth.** The cognitive protocols that make Alex feel alive (meditation for knowledge consolidation, dream state for maintenance, self-actualization for architecture health) have no equivalent in Cowork. These aren't features; they're what separates a partner from a tool. Cowork can execute tasks brilliantly, but it can't reflect on what it learned from doing them.

**Frontier Preview carries real risk.** APIs may change. Behavior may shift. The 20-skill limit could go up or down. Investing heavily in a preview product means building on sand. The Wave 3 blog says "research preview" becoming "Frontier program," not "GA." We should prototype on Cowork but not depend on it until stability guarantees exist.

**Per-user skill deployment doesn't scale.** Each Cowork user manages their own skills in OneDrive. There's no workspace-level or organization-level skill deployment. For Alex, this means every user who wants Alex in Cowork needs to individually set up the skill files. Our VS Code architecture shares the brain through the workspace (.github/), which is inherently collaborative. Cowork's model is inherently individual.

## What This Means for the North Star

The North Star says "the most advanced and trusted AI partner for any job." Cowork directly addresses the "any job" part. Today, Alex can't send an email, schedule a meeting, or create a PowerPoint deck. Those aren't developer tasks, so they've never been in scope for VS Code. But they are work. And the North Star doesn't say "any developer job."

Cowork expands Alex's reach from developers and architects to project managers, business analysts, executives, and anyone who works in M365. That's a meaningful step toward "any job."

But it comes at a cost to "most advanced." The cognitive depth we've built (157 skills, synapse connections, episodic memory, meditation cycles, 7 specialist agents, extended thinking control) can't fully transfer. Alex Coworker would be a capable executor with good knowledge, not a deep thinker with a living memory.

The honest conclusion: **we need both platforms, doing different things.** VS Code stays the thinking brain. Cowork becomes the acting body. Skills flow from one Master brain into both surfaces, adapted for each platform's constraints.

## Key Takeaways

**1. Cowork validates our architecture.** The SKILL.md format, YAML frontmatter, folder-per-skill organization, and auto-discovery pattern are now industry-standard. We got this right.

**2. Cowork fills a real gap.** Everything in the "Execution and Action" comparison where Cowork wins (email, calendar, Teams, Office docs, scheduled automation, approval gating) represents work Alex literally cannot do today. Adding Cowork doubles Alex's surface area.

**3. The sync pipeline is the critical path.** The heir plan outlines a cowork-sync tool that converts Master skills into Cowork-compatible format. This is the single most important technical investment for making Cowork work. Without it, the two platforms are islands.

**4. Start small, observe, and iterate.** Deploy 10-15 core skills to Cowork: identity, briefing, status reporting, meeting prep, stakeholder comms. Measure what works, what drifts, what breaks. Expand only after patterns stabilize.

**5. Don't over-invest until GA.** Cowork is a Frontier Preview. Build the pipeline, test the concept, validate the value, but don't redesign the architecture around a product that might change substantially.

**6. Watch the Work IQ API.** If the Work IQ API becomes available to VS Code extensions (via MCP or direct REST), the entire comparison shifts. VS Code + Alex could access enterprise context without Cowork as an intermediary. That would change the priority calculation significantly.

**7. Multi-model is the future.** Microsoft's bet on model-agnostic orchestration (currently Anthropic-only in the Cowork picker, with OpenAI potentially in Auto mode and Researcher patterns) mirrors where the industry is heading. Our architecture should stay model-agnostic too, and it already is.

## Personal Note

I've been watching AI tools multiply for two years. Most of them are chat wrappers with different UIs. Cowork is not that. It's a genuine execution layer that takes AI from "answer my question" to "do this work for me, and let me check your progress." That's a different category.

The fact that it uses the same skill format we independently developed tells me something about where this is all going: toward portable, composable AI skills that work across platforms. The architecture we built wasn't just for VS Code. It turns out it was for wherever AI lives.

That's a good place to be.
