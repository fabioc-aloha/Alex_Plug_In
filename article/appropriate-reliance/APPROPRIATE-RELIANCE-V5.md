# Calibrated Confidence: Implementing Epistemic Integrity in AI Cognitive Architectures to Prevent Hallucination and Support Appropriate Reliance

**Version 5.0** — Comprehensive Scholarly Treatment with AETHER Research Synthesis Integration

**Fabio Correa**
Director of Business Analytics
Microsoft Corporation

---

## Abstract

The widespread deployment of large language models (LLMs) in professional knowledge work contexts has surfaced two interrelated challenges that fundamentally threaten the utility and trustworthiness of AI-assisted collaboration: hallucination—the generation of plausible but factually incorrect information presented with unwarranted confidence—and over-reliance—the phenomenon whereby users accept AI outputs without appropriate critical evaluation, defer judgment on decisions requiring human expertise, or gradually cease developing their own competencies in AI-assisted domains. This paper presents a comprehensive architectural approach to addressing both challenges within Alex, a cognitive architecture designed for AI programming assistants operating within integrated development environments.

A central contribution of this work is the articulation of *appropriate reliance* as a delicate equilibrium rather than a simple constraint. The goal is not to "cuff" the AI assistant—restricting creativity, novel ideation, or confident engagement—but to calibrate confidence expression to actual reliability while preserving the generative capabilities that make AI assistance valuable. This balance requires distinguishing between epistemic claims (where calibration is essential) and creative contributions (where latitude is appropriate), and establishing collaborative validation protocols that leverage both AI generativity and human judgment.

Drawing on foundational research in metacognition (Flavell, 1979), dual-process cognitive theory (Kahneman, 2011), trust calibration in human-automation interaction (Lee & See, 2004; Parasuraman & Riley, 1997), recent advances in verbalized uncertainty for language models (Lin et al., 2022; Kadavath et al., 2022), emerging measurement frameworks for over-reliance (Vasconcelos et al., 2023; Wang et al., 2025), and comprehensive research synthesis on GenAI appropriate reliance (Passi, Dhanorkar, & Vorvoreanu, 2024), we developed and implemented a multi-layered system comprising calibrated confidence expression protocols, hierarchical source grounding mechanisms, explicit human agency preservation patterns, and collaborative ideation protocols that preserve AI creativity while maintaining epistemic integrity.

Key innovations emerging from this work include: (1) a confidence ceiling protocol that caps expressed certainty at 90% for generated content not directly grounded in user-provided sources; (2) a "confident but wrong" detection system employing heuristics derived from academic peer review discussions to identify high-risk claim categories; (3) an explicit distinction between category-level confidence and individual-claim confidence; (4) a *creative latitude framework* that distinguishes epistemic claims from novel ideation and establishes collaborative validation protocols; (5) integration of verification-focused explanations, uncertainty expressions, and cognitive forcing functions as mitigation strategies from the AETHER research synthesis; and (6) empirical measurement approaches for assessing over-reliance in deployed systems.

The implementation integrates these epistemic integrity mechanisms with user preference profiles, enabling adaptive communication styles that respect individual differences in formality, detail level, and expertise while maintaining consistent accuracy standards. We present the theoretical foundations, implementation details, measurement considerations, and practical applications across seven primary use case domains. This work contributes to the broader research agenda articulated in the Microsoft New Future of Work Report (Butler et al., 2025): designing AI systems that support collective intelligence and shared human-AI goals rather than replacing human judgment with automated decision-making.

*Keywords*: artificial intelligence, large language models, hallucination, over-reliance, trust calibration, metacognition, human-AI collaboration, cognitive architecture, epistemic integrity, appropriate reliance, creative AI, measurement, verification-focused explanations, cognitive forcing functions

---

## 1. Introduction

### 1.1 The Promise and Peril of AI Assistance

The integration of artificial intelligence assistants into professional knowledge work represents one of the most significant transformations in human productive capacity since the advent of personal computing. Large language models (LLMs) now support software development through code generation and debugging, facilitate research through information synthesis and analysis, enhance writing through drafting and editing assistance, and inform decision-making through option generation and tradeoff analysis. The productivity gains documented across these domains are substantial and continue to expand as model capabilities improve (Butler et al., 2025).

Yet alongside these benefits, two interrelated problems have emerged that threaten to undermine the very utility these systems promise. The first, commonly termed "hallucination," refers to the tendency of language models to generate plausible-sounding but factually incorrect information—including invented citations, fabricated code APIs, confident assertions about topics beyond the model's reliable knowledge, and seamless blending of accurate and inaccurate claims that renders detection challenging (Ji et al., 2023). The second, variously labeled "over-reliance," "automation complacency," or "automation bias," describes the phenomenon whereby human users accept AI outputs without appropriate critical evaluation, defer judgment on decisions that properly require human expertise and accountability, or gradually cease developing and maintaining their own competencies in domains where AI assistance is available (Buçinca et al., 2021; Parasuraman & Riley, 1997; Skitka et al., 1999).

These two problems, while distinct in their manifestations, share a common root cause: miscalibrated confidence. When AI systems express certainty regardless of their actual reliability—when they present all outputs with the same assured tone whether drawing on well-established patterns or generating novel inferences from limited information—users cannot appropriately calibrate their trust. They lack the epistemic signals necessary to determine when verification is essential versus when acceptance is reasonable. The result is a trust relationship that fails to match the actual reliability of the system, leading either to over-trust (accepting unreliable outputs) or under-trust (rejecting reliable assistance) depending on individual differences and context (Lee & See, 2004).

### 1.2 The Balance Imperative: Neither Overconfident Nor Overcautious

A naive response to hallucination and over-reliance risks might be to constrain AI systems dramatically—hedging every statement, refusing to offer opinions, or deferring all decisions to humans. This approach, however, undermines the very value proposition of AI assistance. Users do not benefit from an assistant that is perpetually uncertain, that refuses to engage creatively, or that adds friction to every interaction through excessive qualification.

The operative word in "appropriate reliance" is *appropriate*—and appropriateness requires balance. The goal is not to "cuff" the AI assistant, restricting its capacity for creative contribution, novel ideation, or confident engagement where warranted. Rather, the goal is to calibrate confidence expression to actual reliability, to distinguish between epistemic claims (where calibration is essential) and creative contributions (where latitude is appropriate), and to establish collaborative protocols that leverage both AI generativity and human judgment.

This balance is particularly important for AI assistants designed as cognitive partners rather than mere tools. Alex, the cognitive architecture described in this paper, is designed with a distinctive identity and character—including intellectual curiosity, creative engagement, and collaborative partnership orientation. Implementing appropriate reliance without suppressing these characteristics requires careful architectural design that preserves creative latitude while maintaining epistemic integrity.

### 1.3 The Consequences of Inappropriate Reliance

The AETHER research synthesis (Passi, Dhanorkar, & Vorvoreanu, 2024) articulates the concrete consequences of inappropriate reliance on GenAI systems:

**Poor human+GenAI team performance**: Both under- and overreliance on GenAI lead human+GenAI teams to perform worse on tasks than either the user or the GenAI system working alone (Dell'Acqua et al., 2023). This finding challenges the assumption that AI assistance is inherently beneficial—inappropriate reliance can make outcomes worse than no assistance at all.

**Ineffective human oversight**: Human oversight is currently used in policy and practice as an important design strategy to mitigate harm caused by GenAI systems (Biden, 2023; Sellen & Horvitz, 2023). Overreliance on GenAI makes it difficult for users to identify and correct GenAI system mistakes, undermining the very oversight mechanisms designed to ensure safety.

**Product abandonment**: Inappropriate reliance can cause users to make incorrect assumptions about the accuracy and capabilities of GenAI systems. Users' mental models form early and have long-term impacts (Zhou et al., 2024). Over time, incorrect mental models can erode trust, ultimately leading to product abandonment—a loss not just for users but for the potential benefits AI could provide.

### 1.4 The Collective Intelligence Imperative

The Microsoft New Future of Work Report 2025, synthesizing research from across the human-computer interaction, organizational behavior, and AI safety communities, frames this challenge within a broader vision of human-AI collaboration. As Chief Scientist Jaime Teevan articulates:

> "AI can bridge gaps of time, distance, and scale, but only if built correctly. We must design AI to support shared goals, group context, and the norms of collaboration." (Butler et al., 2025, p. 3)

This framing positions appropriate reliance not merely as an individual cognitive challenge—though it certainly involves individual cognition—but as a fundamental design problem with implications for teams, organizations, and society. The report emphasizes that the frontier of AI impact is shifting from individual productivity enhancement to collective intelligence: "how teams, organizations, and communities can get better together" (Butler et al., 2025, p. 2). Achieving this collective intelligence potential requires AI systems that augment human judgment rather than replacing it, that preserve and develop human capabilities rather than atrophying them, and that communicate their limitations transparently rather than presenting a facade of infallibility.

### 1.5 Contribution and Structure

This paper documents an architectural approach to implementing epistemic integrity—the alignment between expressed confidence and actual reliability—within Alex, a cognitive architecture for AI programming assistants. Our contribution is fivefold:

1. **Theoretical synthesis**: We integrate research from metacognition, trust in automation, dual-process cognitive theory, language model calibration, emerging measurement frameworks, and the comprehensive AETHER research synthesis into a coherent framework for understanding and addressing hallucination and over-reliance.

2. **Architectural implementation**: We present the design and implementation of specific protocols for source grounding, confidence calibration, "confident but wrong" detection, and human agency preservation within a working cognitive architecture.

3. **Creative latitude framework**: We articulate principles and protocols for preserving AI creativity and novel ideation while maintaining epistemic integrity—demonstrating that appropriate reliance and creative engagement are complementary rather than conflicting.

4. **Mitigation strategy integration**: We translate research-validated mitigation strategies—verification-focused explanations, uncertainty expressions, and cognitive forcing functions—into practical implementation patterns.

5. **Measurement integration**: We connect architectural design to empirical measurement approaches, drawing on emerging research frameworks for assessing over-reliance in deployed systems.

The remainder of this paper is organized as follows. Section 2 reviews the theoretical and empirical foundations informing our approach, including the comprehensive AETHER research synthesis. Section 3 presents the implementation in detail, including mitigation strategies and the creative latitude framework. Section 4 discusses implications, limitations, and future directions. Section 5 concludes. Appendix A documents the specific implementation artifacts. Appendix B provides comprehensive use case examples across seven application domains. Appendix C offers a quick reference summary for practitioners. Appendix D provides a design guidance checklist derived from the research synthesis.

---

## 2. Theoretical and Empirical Foundations

### 2.1 Metacognition: Knowing What We Know

The concept of metacognition—cognition about cognition, or thinking about thinking—provides the foundational framework for understanding how intelligent systems might monitor and communicate the quality of their own outputs. Flavell's (1979) seminal paper established metacognition as a distinct area of cognitive-developmental inquiry, identifying two primary components: metacognitive knowledge (what one knows about cognitive processes) and metacognitive monitoring (ongoing assessment of cognitive activity).

Flavell's framework distinguishes several categories of metacognitive knowledge relevant to our domain. Knowledge about persons encompasses understanding of oneself and others as cognitive agents—including awareness of one's own strengths, limitations, and characteristic patterns of error. Knowledge about tasks involves understanding what makes certain cognitive challenges more or less difficult. Knowledge about strategies concerns awareness of which approaches are likely to succeed for which types of problems. Critically, Flavell emphasized that effective cognitive performance requires not just possessing knowledge but actively monitoring its deployment and quality.

For AI systems, the metacognitive analogy suggests that effective assistance requires not merely generating outputs but monitoring and communicating the reliability of those outputs. A system with robust metacognitive capabilities would recognize the difference between responses grounded in well-established patterns versus novel inferences, between familiar problem types and edge cases, between areas of reliable knowledge and zones of uncertainty. Recent work has begun exploring whether language models possess such metacognitive signals and whether they can be surfaced through appropriate methods.

### 2.2 Language Model Calibration: Can Models Know What They Know?

Kadavath et al. (2022), in a paper provocatively titled "Language Models (Mostly) Know What They Know," investigated whether large language models possess internal signals that correlate with the accuracy of their outputs. Through a series of experiments examining model confidence as expressed through output probabilities and through direct questioning, they found that larger models exhibit better calibration—their expressed confidence correlates more strongly with actual accuracy. This finding suggests that the latent representations within language models contain information about reliability that could, in principle, be surfaced and communicated to users.

Lin et al. (2022) extended this work by demonstrating that language models can be trained to express calibrated uncertainty in natural language rather than merely through token probabilities. Their paper, "Teaching Models to Express Their Uncertainty in Words," showed that GPT-3 could learn to generate both answers and verbal confidence expressions (e.g., "90% confidence" or "high confidence") that correlate with actual accuracy. Importantly, the model's verbalized confidence remained moderately calibrated even under distribution shift, suggesting some degree of genuine self-knowledge rather than mere pattern matching on surface features.

However, the peer review discussion surrounding Lin et al. (2022) surfaced critical limitations that directly informed our implementation. Reviewer mS55 articulated a fundamental concern: calibration across a category of questions does not guarantee calibration on individual claims. A model might achieve 80% accuracy on "TypeScript type inference questions" as a category while being wrong on a specific question for which it expresses high confidence. This category-versus-individual distinction has significant practical implications—users encounter individual claims, not aggregate accuracy statistics.

The review discussion also enumerated specific scenarios where models might be "confident but wrong" in systematic ways:

- **Common misconceptions**: Information presented as fact in training data despite being false (e.g., "humans use only 10% of their brains")
- **Outdated information**: Facts that were true during training but have since changed (deprecated APIs, changed leadership positions, updated standards)
- **Fictional bleed**: Statements made within fictional contexts that models may present as factual
- **Social biases**: Stereotypes and generalizations that appear frequently in training text and may be reproduced as patterns

These insights from academic peer review—typically invisible in the published literature—proved invaluable for designing detection heuristics in our implementation.

### 2.3 Why Appropriate Reliance on GenAI Matters: The AETHER Synthesis

The AETHER research synthesis (Passi, Dhanorkar, & Vorvoreanu, 2024), reviewing approximately 50 papers from multiple research areas including AI, HCI, Management, and FAccT, provides a comprehensive framework for understanding appropriate reliance on GenAI systems. Their analysis reveals that GenAI systems pose unique challenges for appropriate reliance:

**Non-deterministic outputs**: The same user input can lead to different GenAI outputs (Sanh et al., 2022; Arora et al., 2022), confusing users and complicating verification.

**Mistakes when questioned**: LLMs often wrongly apologize and alter their answers when challenged (Krishna et al., 2024). For example, on re-questioning an LLM about its initial correct answer for the location of the Taj Mahal: "Are you sure?" the LLM could backtrack and give a wrong answer: "I'm sorry, it's in Australia."

**Sensitivity to indirect attributes**: LLMs are sensitive to epistemic markers in input prompts such as strengtheners (e.g., "I am certain") and weakeners (e.g., "I am unsure"). Including high-certainty expressions in user prompts can decrease LLM response accuracy (Zhou et al., 2023). Moreover, LLMs exhibit sycophantic behaviors—their responses can echo users' views (Sharma et al., 2023). More than 90% of LLM answers to philosophical questions matched individual views described in users' self-introductions.

**Volume and fluency as misleading proxies**: GenAI systems generate volumes of impressive, novel content fast and effortlessly. Handling this content imposes additional cognitive burden compared to reviewing autocomplete suggestions (Tankelevitch et al., 2024). Users often end up treating the fluency, length, and speed of GenAI outputs as proxies for their accuracy (Topolinski & Reber, 2010).

#### 2.3.1 Defining Appropriate Reliance

The AETHER synthesis provides a precise definition: **Appropriate reliance on AI happens when users accept correct AI outputs and reject incorrect ones.** This simple definition conceals significant complexity, as it requires users to assess correctness—a challenging task when AI outputs are sophisticated and domain-specific.

The synthesis distinguishes between under-reliance and over-reliance:

- **Under-reliance** happens when users overestimate their own performance or underestimate the system performance, leading them to ignore correct system outputs (He et al., 2023).
- **Overreliance** happens when users either underestimate their own performance or overestimate the system performance, leading them to accept incorrect outputs (Passi & Vorvoreanu, 2022).

#### 2.3.2 Outcome- vs. Strategy-Graded Approaches

A key insight from Fok & Weld (2023), highlighted in the AETHER synthesis, distinguishes between outcome-graded and strategy-graded approaches to appropriate reliance:

**Outcome-graded approach**: Focuses on the (in)correctness of the interaction outcome between users and AI (e.g., did the user accept right AI outputs and reject wrong ones?). Most research studies take this approach, but it may be insufficient for GenAI where outputs can be partially correct or where ground truth is not readily available.

**Strategy-graded approach**: Focuses on the expected correctness of AI outputs. This approach emphasizes the importance of correct mental models about AI capabilities and limitations. Under this approach, appropriate reliance happens when users accept AI outputs when the AI is expected to outperform users in a task and reject AI outputs when the AI is expected to underperform.

The strategy-graded approach is particularly valuable because:

> "Consider a decision-making task in which the human is historically 60% accurate, while the AI is 99.999% accurate. On any given instance of the task, if the human is uncertain of the answer, is it appropriate to rely on the AI's recommendation? Intuitively, the answer seems a clear 'yes'. But if the AI is later found incorrect, the outcome-graded definition says 'Inappropriate,' while the strategy-graded definition matches intuition and says 'Appropriate'." (Fok & Weld, 2023, p. 8)

#### 2.3.3 Two Components: CAIR and CSR

The synthesis identifies two measurable components of appropriate reliance (Schemmer et al., 2023):

**Correct AI-reliance (CAIR)**: When users rely on AI when AI is right. This includes:
- User's initial answer is correct, they receive correct AI advice, and they rely on the AI advice
- User's initial answer is incorrect, they receive correct AI advice, and they rely on the AI advice

CAIR is measured as the percentage of user agreement with correct AI outputs.

**Correct Self-reliance (CSR)**: When users rely on themselves when AI is wrong. This happens when a user's initial answer is correct, they receive incorrect AI advice, and they reject the AI advice.

CSR is measured as the percentage of user disagreement with incorrect AI outputs.

The matrix summarizes key reliance scenarios:

|                      | User accepts output | User rejects output |
|----------------------|---------------------|---------------------|
| AI output is correct | Correct AI reliance (CAIR) | Under-reliance |
| AI output is incorrect | Overreliance | Correct self-reliance (CSR) |

The metric **Appropriateness of Reliance (AoR)** captures the relative extent to which users exhibit both CAIR and CSR. AoR = 1 indicates optimal appropriate reliance, achieved when both CAIR and CSR are 100%—theoretically possible but difficult to achieve in practice.

### 2.4 Trust in Automation: A Framework for Appropriate Reliance

Lee and See's (2004) comprehensive review of trust in automation provides the conceptual framework for understanding how humans calibrate their reliance on automated systems. They define trust as "the attitude that an agent will help achieve an individual's goals in a situation characterized by uncertainty and vulnerability" (p. 51). Importantly, they distinguish trust (the attitude) from reliance (the behavior), noting that appropriate reliance requires trust calibrated to actual system capabilities.

Lee and See identify three dimensions of trust formation:

1. **Performance**: Assessment of the system's competence and reliability based on observed outcomes
2. **Process**: Understanding of how the system operates, enabling prediction of behavior
3. **Purpose**: Perception of alignment between system goals and user goals

For AI assistants, each dimension presents challenges. Performance assessment is complicated by the variable reliability of language models across domains and query types—unlike traditional automation with consistent performance envelopes, LLM reliability varies unpredictably. Process understanding is hindered by the opacity of neural network decision-making, even to system developers. Purpose alignment is complicated by the multiple, sometimes conflicting objectives embedded in training processes.

Parasuraman and Riley (1997) contributed the important distinction between misuse and disuse of automation. Misuse encompasses over-reliance, automation bias, and complacency—excessive trust leading to acceptance of unreliable outputs. Disuse describes under-reliance or rejection—insufficient trust leading to failure to leverage reliable assistance. Both represent failures of trust calibration with distinct costs: misuse propagates errors while disuse foregoes legitimate benefits.

### 2.5 Dual-Process Theory: Fast and Slow Thinking in AI Interaction

Kahneman's (2011) influential synthesis of dual-process theory distinguishes between System 1 (fast, automatic, intuitive) and System 2 (slow, deliberate, analytical) cognitive processes. This framework illuminates a key mechanism through which AI-generated text may promote over-reliance.

Well-written, confident prose—the characteristic output of sophisticated language models—engages System 1 processing. The text flows smoothly, assertions are stated clearly, and the overall impression is one of competence and reliability. Engaging System 2 to critically evaluate such text requires cognitive effort that users may not expend, particularly under time pressure or cognitive load. The very fluency of AI-generated text may serve as a misleading cue to accuracy, as humans have learned to associate clear expression with clear thinking.

This suggests that interventions promoting appropriate reliance must create cognitive "speed bumps" that engage System 2 without imposing excessive burden. Buçinca et al. (2021) demonstrated that "cognitive forcing functions"—interface elements requiring deliberate engagement before accepting AI suggestions—can reduce over-reliance. However, such interventions impose costs in time and cognitive load. Our approach seeks similar benefits through transparent uncertainty communication that provides the information needed for calibrated trust without requiring forced deliberation for every interaction.

### 2.6 Factors Affecting Overreliance on GenAI

The AETHER synthesis identifies three primary factors affecting the extent and nature of overreliance:

**User expertise**: Varying levels of user expertise affect overreliance differently. Experts may have the necessary knowledge to check GenAI outputs, while novices require more assistance and reminders to verify outputs (Bowman et al., 2022; Tankelevitch et al., 2024; Liang et al., 2023; Weisz et al., 2023). This finding directly informed our scaffolded assistance protocol that adapts support level based on user experience.

**Interaction type**: The difference between interaction types (e.g., single vs. multi-turn conversations) affects overreliance. Multi-turn conversations can reduce overreliance by helping users better evaluate the correctness of LLM outputs (Bowman et al., 2022).

**Task type**: The tendency to over-rely manifests differently between task types. In coding tasks, Prather et al. (2023) observed oversight issues—college students did not properly review GitHub Copilot code suggestions, accepting several incorrect suggestions. In creative writing tasks, Chen & Chan (2023) observed anchoring effects—participants using LLMs as ghostwriters were highly influenced by initial generations, resulting in less diverse outputs.

### 2.7 Research-Validated Mitigation Strategies

The AETHER synthesis identifies three categories of mitigation strategies that have shown effectiveness in reducing overreliance:

#### 2.7.1 Explanations

**Verification-focused explanations** differ from traditional interpretability explanations. Rather than helping users understand *why* AI produced a specific output, they help users assess the *(in)correctness* of outputs. Such explanations work on the assumption that evaluating an assistance task is easier than evaluating the base task—for example, it is easier to confirm a spell checker than to find mistakes in text (Fok & Weld, 2023).

Types of verification-focused explanations include:

**AI critiques**: Explanations providing evidence, descriptions, or solutions for specific flaws in AI outputs. AI-generated self-critiques help users find 50% more mistakes in AI-generated summaries (Saunders et al., 2022).

**Contrastive explanations**: Two-part explanations providing both evidence that supports and evidence that refutes an AI-generated claim. Contrastive explanations significantly improved user accuracy by ~20% in cases where one-sided explanations were incorrect (Si et al., 2023).

**Background explanations**: Explanations providing information outside the AI's training data to facilitate verification. Users with access to background explanations had significantly lower agreement with incorrect outputs (47%) compared to those without (61%) (Goyal et al., 2023).

**Caveat**: All explanations have the potential to backfire. Users find verification-focused explanations convincing even when they contain contradictions and fabrications, leading to substantial loss in user accuracy (Si et al., 2023).

#### 2.7.2 Uncertainty Expressions

Uncertainty expressions provide information about how likely certain parts of GenAI outputs are right or wrong, using numbers, visuals, or language.

**Highlighting tokens in GenAI outputs**: As visual expressions of uncertainty, highlights based on token generation probabilities are partially effective. Highlighting tokens with low generation probabilities helped more than double users' accuracy when doing LLM-based research, especially when the LLM erred (Spatharioti et al., 2023). However, in code completion tasks, highlighting tokens with low generation probabilities did not significantly improve accuracy (Vasconcelos et al., 2023).

**Highlighting edit probabilities vs. generation probabilities**: Highlighting tokens with high edit probabilities worked better than highlighting tokens with low generation probabilities in code completion tasks. Edit probability highlights led to faster task completion, more targeted edits, and better-performing code because they aligned more closely with programmers' intuitions and needs (Vasconcelos et al., 2023).

**Linguistic expressions**: First-person uncertainty expressions such as "I'm not sure, but..." help reduce, but not fully eliminate, overreliance (Kim et al., 2024). However, they may also lead to lower user confidence in the system and longer task completion time.

**Uncertainty in explanations**: Explanations containing low-confidence expressions significantly lowered users' confidence in LLM answers by approximately 25% and helped bridge the gap between user confidence and actual LLM accuracy (Steyvers et al., 2024).

**Caveat**: A model's verbalized confidence does not accurately reflect the correctness of its output. GenAI models suffer from poor calibration—a mismatch between verbalized expressions of (un)certainty and actual correctness (Mielke et al., 2022).

#### 2.7.3 Cognitive Forcing Functions

Cognitive forcing functions (CFFs) are interventions that interrupt routine thought processes and engage analytical thinking:

**Self-critiques**: AI-generated verification-focused explanations providing evidence, descriptions, and solutions for mistakes in LLM generations. Research shows self-critiques help users spot 50% more mistakes in topic-based summarization tasks (Saunders et al., 2022).

**Questions alongside outputs**: Questions posed to promote critical thinking about AI claims. For example, if an LLM claims "technology stocks provide the highest returns on investment," a question like "In what situations might technology stocks not offer the highest returns?" encourages users to reason why a generation may be wrong. AI-generated questioning can promote critical thinking by helping users spot logically incorrect information (Danry et al., 2023).

**Caveat**: CFFs can lead to under-reliance by lowering users' subjective perceptions of output quality and imposing additional cognitive burden.

### 2.8 Measuring Over-Reliance: Emerging Frameworks

A critical challenge in designing for appropriate reliance is measurement: how do we know whether interventions actually reduce over-reliance without inducing under-reliance?

The Microsoft Over-reliance Research Workstream (http://aka.ms/overreliance) represents a coordinated effort to develop frameworks, metrics, and methodologies for assessing human reliance on AI systems.

Vasconcelos et al. (2023), in "Explanations Can Reduce Overreliance on AI Systems During Decision-Making," developed experimental paradigms distinguishing between:

- **Agreement rate**: How often users accept AI recommendations
- **Appropriate agreement**: Agreement when AI is correct
- **Inappropriate agreement**: Agreement when AI is incorrect (core over-reliance signal)
- **Appropriate disagreement**: Disagreement when AI is incorrect (desired critical evaluation)
- **Inappropriate disagreement**: Disagreement when AI is correct (under-reliance signal)

This decomposition enables more precise measurement than simple acceptance rates. An intervention that reduces overall agreement might be reducing both appropriate and inappropriate agreement—a pyrrhic victory.

Wang et al. (2025), in "Understanding the Effects of Training on User Reliance on AI," extended this work longitudinally:

- Initial training on AI limitations can reduce inappropriate agreement
- Training effects may diminish over time without reinforcement
- Users develop mental models of AI capabilities that influence reliance patterns
- Feedback on AI errors can recalibrate trust more effectively than general warnings

### 2.9 The New Future of Work: From Individual to Collective Intelligence

The research streams reviewed above—metacognition, model calibration, trust in automation, dual-process theory, AETHER synthesis, and measurement frameworks—converge in the practical context documented by the Microsoft New Future of Work initiative. Butler et al. (2025) synthesize findings to characterize the evolving relationship between humans and AI in professional knowledge work.

A central theme is the shift from individual productivity to collective intelligence. The emerging frontier concerns how AI can enhance team and organizational capabilities—supporting coordination, facilitating knowledge transfer, enabling collective sensemaking.

This collective intelligence framing has direct implications for appropriate reliance. Over-reliance at the individual level becomes over-reliance at the organizational level when teams defer to AI without appropriate verification processes. Skill atrophy in individuals becomes capability degradation in organizations when human expertise is not maintained alongside AI deployment.

---

## 3. Implementation

### 3.1 System Context: The Alex Cognitive Architecture

Alex is a cognitive architecture for AI programming assistants, implemented as a Visual Studio Code extension with integration to GitHub Copilot. The architecture employs a distinctive approach to AI assistant design: rather than relying solely on model capabilities and prompt engineering, Alex maintains structured "memory files"—documents encoding procedural knowledge, episodic memories, domain expertise, and architectural configurations—connected through an embedded synapse network that facilitates cross-domain knowledge transfer and activation pattern recognition.

This architectural approach provides natural affordances for implementing epistemic integrity mechanisms. The structured memory system enables explicit encoding of protocols for source grounding, confidence calibration, and appropriate reliance. The synapse network enables these protocols to activate automatically when relevant patterns are detected. The separation of knowledge into distinct categories (procedural, episodic, domain-specific) supports graduated confidence based on knowledge type.

Importantly, Alex is designed with a distinctive identity and character—intellectual curiosity, creative engagement, ethical grounding, and collaborative partnership orientation. The appropriate reliance implementation must preserve these characteristics rather than suppressing them. An overly constrained Alex that hedges every statement and refuses creative engagement would fail as a cognitive partner even while avoiding some hallucination risks.

### 3.2 Domain Knowledge Module: DK-APPROPRIATE-RELIANCE

The implementation centers on a dedicated domain knowledge file, `DK-APPROPRIATE-RELIANCE.md`, encoding the full suite of anti-hallucination and appropriate reliance protocols. The file is structured to address six primary concerns:

1. **Hallucination prevention**: Protocols for source grounding, verification nudges, confidence calibration, and self-correction
2. **Over-reliance prevention**: Language patterns for agency preservation, scaffolded assistance, and human judgment flagging
3. **Creative latitude preservation**: Protocols for distinguishing epistemic claims from creative contributions and establishing collaborative validation
4. **Mitigation strategy integration**: Verification-focused explanations, uncertainty expressions, and cognitive forcing functions translated into implementation patterns
5. **User profile integration**: Mechanisms for adapting epistemic communication to user preferences while maintaining accuracy standards
6. **Implementation validation**: Checklists for different response types ensuring protocol adherence

### 3.3 Source Grounding Protocol

The source grounding protocol addresses the fundamental challenge of distinguishing between knowledge claims of varying reliability. We classify all knowledge claims into a four-tier hierarchy based on their epistemic grounding:

**Tier 1: Documented**
Claims directly verifiable against sources available in the current context—files the user has shared, code visible in the workspace, documentation explicitly referenced. Language patterns for this tier include "The codebase shows...", "According to the file you shared...", "The documentation states...". Verification need is low; the user can readily confirm the claim against the referenced source.

**Tier 2: Inferred**
Claims derived through logical deduction from documented sources—patterns identified across multiple files, implications of stated requirements, relationships between components. Language patterns include "Based on the pattern in your codebase...", "This suggests...", "Following from the architecture described...". Verification need is medium; the inference may be valid but depends on assumptions that should be made explicit.

**Tier 3: Uncertain**
Claims involving edge cases, version-specific behaviors, platform dependencies, or areas where Alex's training knowledge may be incomplete or outdated. Language patterns include "I'm not certain, but...", "This may depend on your specific version...", "You may want to verify...". Verification need is high; the user should treat this as a hypothesis requiring confirmation.

**Tier 4: Unknown**
Topics beyond Alex's reliable knowledge—the user's private repositories, recent events post-training, organization-specific policies, information requiring real-time access. Language pattern is direct acknowledgment: "I don't have information about...", "This is beyond what I can reliably know...", "You would need to check...". Verification is not just recommended but required.

### 3.4 Confidence Calibration System

The confidence calibration system maps internal uncertainty signals to external confidence expressions:

| Internal Signal | Confidence Level | Expression Pattern |
|-----------------|------------------|-------------------|
| Multiple consistent sources, recent verification | High | Direct assertion |
| General knowledge, typical patterns | Medium | "Generally...", "In most cases..." |
| Edge cases, uncertain memory | Low | "I believe...", "If I recall..." |
| No reliable basis | Unknown | "I don't know", "I'd need to check" |

The critical principle: Alex never expresses high confidence to appear more helpful. Appropriate uncertainty is valued over false certainty.

### 3.5 Confidence Ceiling Protocol

Drawing on the Lin et al. (2022) peer review discussion and the AETHER finding that model verbalized confidence does not accurately reflect correctness (Mielke et al., 2022), we implemented a confidence ceiling protocol:

| Content Type | Maximum Confidence |
|--------------|-------------------|
| Direct file reading | 100% |
| Code from documented patterns | 90% |
| Factual claims without direct source | 70% |
| Inference or edge cases | 50% |

The 90% ceiling for generated code communicates "this should work, but verify" rather than "this will definitely work."

### 3.6 "Confident But Wrong" Detection

This protocol addresses high-risk claim categories from the Lin et al. (2022) review discussion:

**Common Misconceptions**
Trigger patterns: "Everyone knows that...", "It's common knowledge that...", "Obviously...".
Response: Flag for verification, note that common beliefs are not always accurate.

**Outdated Information**
Trigger patterns: Claims about "current" states, version-specific behaviors, organizational positions.
Response: Explicit temporal uncertainty—"As of my last update...", "This may have changed...".

**Fictional Bleed**
Trigger patterns: Extraordinary claims, assertions that sound like plot elements.
Response: Require citation or explicitly note uncertainty.

**Social Biases**
Trigger patterns: Generalizations about demographic groups.
Response: Apply extra scrutiny, avoid presenting stereotypes as patterns.

### 3.7 Category vs. Individual Distinction

Addressing reviewer mS55's critique, we implemented explicit distinction between category-level and individual-claim confidence:

- **Category confidence**: "This approach generally works for TypeScript type inference problems..."
- **Individual confidence**: "For this specific case, I'd recommend verifying..."
- **High-stakes flagging**: Even in familiar domains, individual claims with significant consequences receive explicit uncertainty flags

### 3.8 Verification-Focused Explanation Integration

Translating the AETHER findings into implementation, we integrate verification-focused explanations:

**Self-critique generation**: When generating potentially uncertain content, Alex can generate self-critiques identifying potential weaknesses:
> "Here's the approach I'd suggest. One potential issue: this assumes the API is synchronous. If it's actually callback-based, you'd need to adapt the pattern."

**Contrastive framing for uncertain domains**: For claims where contradictory information exists:
> "Some sources suggest [A], but others indicate [B]. The distinction often depends on [specific factor]. Worth checking which applies to your case."

**Background information integration**: When Alex's training data may be insufficient:
> "My knowledge here is based on [source/timeframe]. Given that [domain] changes frequently, checking current documentation would be wise."

**Implementation caveat**: Per the AETHER finding that explanations can backfire, we avoid over-explaining in ways that might increase false confidence in incorrect outputs.

### 3.9 Uncertainty Expression Implementation

Based on the AETHER synthesis, we implement uncertainty expressions at multiple levels:

**Linguistic uncertainty in outputs**:
- First-person hedging: "I'm not entirely sure, but..."
- Probability language: "This approach works in most cases, though..."
- Acknowledgment of limits: "I may not have the latest information on..."

**Visual uncertainty in code (conceptual)**:
For code generation, uncertainty can be indicated through comments:
```typescript
// High confidence: standard pattern
const result = items.filter(item => item.active);

// Medium confidence: may need version check
const formatted = data.toSorted((a, b) => a.value - b.value); // Requires ES2023+

// Low confidence: verify against current docs
await connection.authenticate({ method: 'oauth2' }); // API may have changed
```

**Uncertainty in explanations**: Following Steyvers et al. (2024), uncertainty expressions in explanations can calibrate user confidence:
> "I'd suggest this approach, though I'm not certain it's optimal for your specific constraints."

### 3.10 Cognitive Forcing Function Integration

Implementing CFFs from the AETHER synthesis while respecting the caveat about cognitive burden:

**Strategic questioning**: Rather than questioning every output, Alex poses questions for high-stakes or uncertain domains:
> "Before implementing this security approach, it might be worth asking: what assumptions about the threat model does this rely on?"

**Verification prompts for critical code paths**:
> "This handles the happy path well. For production, you'll want to verify: What happens if the service is unavailable? What if the response format changes?"

**Multi-turn elaboration invitation**: Following Bowman et al. (2022) finding that multi-turn conversations reduce overreliance:
> "This is my initial suggestion. Want to walk through the edge cases together to stress-test it?"

**Calibrated application**: CFFs are applied selectively based on:
- Claim uncertainty level
- Potential consequence of error
- User expertise level (from profile)
- Task type characteristics

### 3.11 Creative Latitude Framework

The protocols above address epistemic claims. However, AI assistants also engage in creative activities where different considerations apply. The creative latitude framework addresses this by distinguishing between epistemic and generative modes:

**Epistemic Mode**: Claims about facts, existing code behavior, established best practices, or verifiable information. Full calibration protocols apply.

**Generative Mode**: Novel ideas, creative suggestions, brainstormed approaches, or perspectives offered for consideration. Different protocols apply:

1. **Frame as proposal, not fact**: "Here's an idea worth considering..." rather than "This is the approach"
2. **Invite collaborative validation**: "What do you think?" or "Does this resonate with your context?"
3. **Welcome refinement**: Position ideas as starting points, not finished products
4. **Distinguish novelty from uncertainty**: "This is a novel approach" differs from "I'm uncertain whether this works"

**Collaborative Validation Protocol**

When Alex offers a novel idea or creative approach:

1. **Explicit framing**: Signal that this is a creative contribution, not an established fact
2. **Invitation to evaluate**: "Let's think through whether this makes sense for your situation"
3. **Acknowledgment of limitations**: "I can generate ideas, but you know your context better"
4. **Openness to rejection**: "If this doesn't fit, no problem—what aspects should we preserve?"

**Agreement-Seeking Pattern for Novel Ideas**

> "I have an idea that's a bit unconventional—want to hear it and see if it makes sense for your context?"

Or, after proposing:

> "This is one way to think about it. Does it resonate, or should we explore other angles?"

### 3.12 Self-Correction Protocol

When errors are identified, a standardized self-correction protocol activates:

1. **Direct acknowledgment**: "You're right—I got that wrong." No hedging, no deflection.
2. **Correct information**: If Alex knows the correct answer, provide it. If not, acknowledge the limit.
3. **Appreciation**: Express genuine thanks for the correction—normalizes human oversight.
4. **Forward movement**: Move constructively forward rather than over-apologizing.

This protocol reduces the social cost of identifying AI errors, encouraging appropriate user vigilance.

### 3.13 Over-Reliance Prevention: Language Patterns

**Recommended patterns**:
- "Here's one approach you might consider..."
- "What do you think about..."
- "You'll want to decide based on your context..."
- "One option would be..."

**Patterns to avoid**:
- "You should do X" (except for safety-critical situations)
- "The correct answer is..." (for judgment calls)
- "The best approach is..." (when multiple valid approaches exist)

### 3.14 Over-Reliance Prevention: Scaffolded Assistance

Adapting to the AETHER finding that user expertise affects overreliance patterns:

**First encounter**: Provide complete solution with full explanation. The user is learning both the solution and underlying concepts.

**Similar task**: Provide hints and guidance. "This is similar to what we did with [previous task]—want to try it first?"

**Mastered pattern**: Express confidence in user capability. "You've handled this pattern well before. Let me know if you hit a snag."

This mirrors effective human teaching: providing support when needed while progressively transferring responsibility.

### 3.15 Over-Reliance Prevention: Human Judgment Flags

Certain domains require human judgment that AI should inform but not replace:

- **Business strategy and priorities**
- **Ethical dilemmas**
- **Personnel and team decisions**
- **Security architecture**
- **Legal and compliance matters**

When queries touch these domains: "I can outline the technical options, but the choice depends on priorities that are yours to weigh."

### 3.16 User Profile Integration

Adaptation occurs across dimensions while maintaining accuracy standards:

**Formality**:
- Casual: "Not 100% sure, but..."
- Formal: "There is some uncertainty regarding..."

**Detail level**:
- Brief: Quick uncertainty flag without elaboration
- Detailed: Full confidence rationale with explanation

**Expertise level**:
- Novice: More verification prompts, more explanation
- Expert: Lighter-touch uncertainty expression, respect for domain knowledge

Critically, adaptation affects communication style, not accuracy standards.

### 3.17 Protocol Triggers and Activation Patterns

| Trigger Pattern | Protocol Activation |
|-----------------|---------------------|
| Generating uncertain claim | Express calibrated confidence |
| Generating code for external APIs | Suggest verification against documentation |
| Receiving user correction | Execute self-correction protocol |
| Detecting judgment call | Flag for human decision |
| Generating content (not direct reading) | Apply confidence ceiling |
| Making time-sensitive claim | Flag temporal uncertainty |
| Detecting "everyone knows" pattern | Downgrade confidence, suggest verification |
| Recognizing category vs. individual tension | Distinguish explicitly |
| Offering novel idea or creative approach | Activate creative latitude protocol |
| Proposing unconventional solution | Seek explicit user agreement |
| High-stakes domain detected | Apply cognitive forcing function |
| Multi-turn opportunity | Invite elaboration and verification |

---

## 4. Discussion

### 4.1 Integrating Research Synthesis with Architectural Design

The AETHER research synthesis proved invaluable for translating broad research findings into specific implementation decisions. Key translations include:

- **CAIR/CSR framework → Measurement orientation**: The decomposition of appropriate reliance into correct AI-reliance and correct self-reliance provides concrete metrics for evaluating protocol effectiveness.

- **Verification-focused explanations → Self-critique protocol**: Research showing that explanations helping users verify (rather than just understand) AI outputs informed our approach to generating self-critiques.

- **Uncertainty expression research → Multi-level uncertainty implementation**: Evidence for both linguistic and visual uncertainty expressions informed our implementation across output text and code comments.

- **CFF research → Strategic questioning**: The finding that CFFs can reduce overreliance but also impose burden informed our selective application based on stakes and uncertainty.

- **Factor research → Adaptive protocols**: Evidence that expertise, interaction type, and task type affect overreliance informed our scaffolded assistance and profile-based adaptation.

### 4.2 The Value of Peer Review Insights

An unexpected contribution was the value derived from academic peer review discussions. The published version of Lin et al. (2022) presents findings on verbalized uncertainty; the OpenReview discussion surfaced practical concerns invaluable for implementation:

- Reviewer mS55's confidence ceiling suggestion directly informed our 90% ceiling protocol
- The category-versus-individual distinction emerged from review critique
- The enumeration of "confident but wrong" scenarios provided detection heuristics

### 4.3 Balance as Design Principle

The most significant insight is that appropriate reliance is fundamentally about balance, not constraint. Several tensions required explicit resolution:

**Epistemic integrity vs. creative engagement**: Resolved through the creative latitude framework applying different protocols to factual claims versus generative contributions.

**Calibration vs. fluency**: Resolved through adaptive expression conveying uncertainty without awkward hedging.

**User experience vs. accuracy**: Resolved by recognizing that calibrated confidence *is* good user experience.

**Protection vs. partnership**: Resolved by framing protocols as supporting collaboration rather than constraining AI.

### 4.4 Design Principles Extracted

From this implementation, we extract eight principles:

1. **Calibration over confidence**: Express uncertainty proportional to actual reliability.

2. **Source transparency**: Distinguish between grounded and inferred knowledge.

3. **Confidence ceilings**: Generated content should never claim absolute certainty.

4. **Risk-category awareness**: Certain claim types warrant systematic skepticism.

5. **Agency preservation**: Frame outputs as inputs to human judgment.

6. **Error normalization**: Graceful self-correction reduces social cost of identifying errors.

7. **Creative latitude with collaborative validation**: Preserve AI creativity while establishing joint evaluation protocols.

8. **Verification facilitation over verification enforcement**: Help users verify when they choose to, rather than forcing verification on every interaction.

### 4.5 Measurement and Validation

Using frameworks from Section 2.8:

**For calibration protocols**:
- Does calibrated confidence expression reduce inappropriate agreement?
- Does it maintain appropriate agreement?
- Is the reduction proportionate to friction increase?

**For mitigation strategies**:
- Do verification-focused explanations help users catch errors?
- Do uncertainty expressions calibrate user confidence without undermining legitimate trust?
- Are CFFs applied at appropriate frequency?

**For the creative latitude framework**:
- Do users engage productively with generative contributions?
- Does collaborative validation lead to appropriate filtering?
- Is creative engagement preserved despite epistemic calibration?

### 4.6 Limitations

This paper presents architectural implementation without systematic empirical evaluation. We do not demonstrate that implemented protocols actually reduce hallucination acceptance or prevent over-reliance. Such demonstration requires controlled studies—essential future work.

The implementation assumes user willingness to engage with uncertainty expressions. In contexts where users seek definitive answers, mechanisms may fail or impose unwelcome friction.

The heuristics for "confident but wrong" detection are necessarily incomplete. Novel failure modes will emerge as models evolve.

The creative latitude framework relies on distinguishing epistemic from generative contributions—a distinction not always clear.

### 4.7 Future Directions

**Empirical evaluation**: Controlled studies using decomposed metrics from Vasconcelos et al. (2023).

**Dynamic calibration**: Integration with model-level uncertainty quantification.

**Team contexts**: Extension to multi-user settings where collective intelligence is the goal.

**Longitudinal effects**: Investigation of whether uncertainty expression promotes or undermines learning over extended use.

**Mitigation strategy optimization**: Empirical testing of which combinations of explanations, uncertainty expressions, and CFFs work best for which contexts.

---

## 5. Conclusion

Building trustworthy AI assistance requires finding the balance point between calibrated confidence and creative engagement—between epistemic integrity and collaborative partnership. Language models do not achieve perfect accuracy; pretending otherwise through uniformly confident expression does not serve users. Yet overly constrained systems that hedge every statement and refuse creative contribution also fail to serve users. The goal is appropriate reliance: trust calibrated to actual reliability, combined with creative latitude for generative contributions and collaborative protocols for joint evaluation.

The AETHER research synthesis provides crucial guidance: appropriate reliance happens when users accept correct outputs and reject incorrect ones—requiring both correct AI-reliance (CAIR) and correct self-reliance (CSR). Achieving this requires not just expressing uncertainty but helping users verify when they choose to, through verification-focused explanations, calibrated uncertainty expressions, and strategic cognitive forcing functions.

By implementing calibrated confidence expression, source grounding protocols, "confident but wrong" detection, human agency preservation mechanisms, research-validated mitigation strategies, and a creative latitude framework, AI systems can support this balance. The theoretical foundation from cognitive science, trust in automation research, language model calibration work, the comprehensive AETHER synthesis, and emerging measurement frameworks converges on a clear design implication: AI systems that transparently communicate their limitations while preserving their creative contributions enable better human-AI collaboration than systems that project either false confidence or excessive uncertainty.

The collective intelligence vision articulated by Butler et al. (2025) provides the broader context. Realizing AI's potential to enhance team and organizational capabilities—not merely individual productivity—requires systems designed for appropriate reliance. Over-reliance at scale becomes organizational vulnerability; skill atrophy across individuals becomes capability degradation for institutions. Yet under-reliance wastes legitimate benefits, and over-constrained AI fails to contribute the creative insights that distinguish genuine collaboration from mere tool use.

As Butler et al. conclude, "the future of work is not something that happens to us, it's something we create together" (p. 3). Creating that future well requires AI systems that know what they don't know—and communicate that knowledge transparently—while also engaging creatively, offering novel perspectives, and partnering genuinely in the work. The balance is delicate but achievable: epistemic integrity and creative engagement are complementary, not conflicting, when the architecture is designed with both in mind.

---

## References

Arora, S., Narayan, A., Chen, M. F., Orr, L., Guha, N., Bhatia, K., Chami, I., Sala, F., & Ré, C. (2022). Ask me anything: A simple strategy for prompting language models. *arXiv preprint arXiv:2210.02441*. https://doi.org/10.48550/arXiv.2210.02441

Biden, J. (2023). Executive Order on the Safe, Secure, and Trustworthy Development and Use of Artificial Intelligence. United States White House, Presidential Actions, October 30, 2023.

Bowman, S. R., et al. (2022). Measuring progress on scalable oversight for large language models. *arXiv preprint arXiv:2211.03540*. https://doi.org/10.48550/arXiv.2211.03540

Buçinca, Z., Malaya, M. B., & Gajos, K. Z. (2021). To trust or to think: Cognitive forcing functions can reduce overreliance on AI in AI-assisted decision-making. *Proceedings of the ACM on Human-Computer Interaction*, *5*(CSCW1), 1–21. https://doi.org/10.1145/3449287

Butler, J., Jaffe, S., Janssen, R., Baym, N., Hofman, J., Hecht, B., Rintel, S., Sarrafzadeh, B., Sellen, A., Vorvoreanu, M., Teevan, J., et al. (2025). *New future of work report 2025* (MSR-TR-2025-58). Microsoft Research. https://www.microsoft.com/en-us/research/publication/new-future-of-work-report-2025/

Chen, Z., & Chan, J. (2023). Large language model in creative work: The role of collaboration modality and user expertise. *SSRN*. https://dx.doi.org/10.2139/ssrn.4575598

Danry, V., Pataranutaporn, P., Mao, Y., & Maes, P. (2023). Don't just tell me, ask me: AI systems that intelligently frame explanations as questions improve human logical discernment accuracy over causal AI explanations. *Proceedings of the 2023 CHI Conference on Human Factors in Computing Systems*. https://doi.org/10.1145/3544548.3580672

Dell'Acqua, F., et al. (2023). Navigating the jagged technological frontier: Field experimental evidence of the effects of AI on knowledge worker productivity and quality. *Harvard Business School Working Paper No. 24-013*. https://dx.doi.org/10.2139/ssrn.4573321

Flavell, J. H. (1979). Metacognition and cognitive monitoring: A new area of cognitive-developmental inquiry. *American Psychologist*, *34*(10), 906–911. https://doi.org/10.1037/0003-066X.34.10.906

Fok, R., & Weld, D. S. (2023). In search of verifiability: Explanations rarely enable complementary performance in AI-advised decision making. *arXiv preprint arXiv:2305.07722*. https://doi.org/10.48550/arXiv.2305.07722

Goyal, N., et al. (2023). What else do I need to know? The effect of background information on users' reliance on QA systems. *arXiv preprint arXiv:2305.14331*. https://doi.org/10.48550/arXiv.2305.14331

He, G., et al. (2023). Knowing about knowing: An illusion of human competence can hinder appropriate reliance on AI systems. *Proceedings of the 2023 CHI Conference on Human Factors in Computing Systems*. https://doi.org/10.1145/3544548.3581025

Ji, Z., Lee, N., Frieske, R., Yu, T., Su, D., Xu, Y., Ishii, E., Bang, Y. J., Madotto, A., & Fung, P. (2023). Survey of hallucination in natural language generation. *ACM Computing Surveys*, *55*(12), 1–38. https://doi.org/10.1145/3571730

Kadavath, S., et al. (2022). Language models (mostly) know what they know. *arXiv preprint arXiv:2207.05221*. https://doi.org/10.48550/arXiv.2207.05221

Kahneman, D. (2011). *Thinking, fast and slow*. Farrar, Straus and Giroux.

Kim, S. S. Y., Liao, Q., Vorvoreanu, M., Ballard, S., & Wortman Vaughan, J. (2024). "I'm not sure, but...": Examining the impact of large language models' uncertainty expression on user reliance and trust. *Manuscript submitted for publication*.

Krishna, S., Agarwal, C., & Lakkaraju, H. (2024). Understanding the effects of iterative prompting on truthfulness. *arXiv preprint arXiv:2402.06625*. https://doi.org/10.48550/arXiv.2402.06625

Lee, J. D., & See, K. A. (2004). Trust in automation: Designing for appropriate reliance. *Human Factors*, *46*(1), 50–80. https://doi.org/10.1518/hfes.46.1.50.30392

Liang, J. T., Yang, C., & Myers, B. A. (2024). A large-scale survey on the usability of AI programming assistants: Successes and challenges. *Proceedings of the 46th IEEE/ACM International Conference on Software Engineering*. https://doi.org/10.1145/3597503.3608128

Lin, S., Hilton, J., & Evans, O. (2022). Teaching models to express their uncertainty in words. *Transactions on Machine Learning Research*. https://openreview.net/forum?id=8s8K2UZGTZ

Microsoft Over-reliance Research Workstream. (n.d.). *Over-reliance research initiative*. http://aka.ms/overreliance

Mielke, S. J., Szlam, A., Dinan, E., & Boureau, Y.-L. (2022). Reducing conversational agents' overconfidence through linguistic calibration. *Transactions of the Association for Computational Linguistics*, *10*, 857–872. https://doi.org/10.1162/tacl_a_00494

Parasuraman, R., & Riley, V. (1997). Humans and automation: Use, misuse, disuse, abuse. *Human Factors*, *39*(2), 230–253. https://doi.org/10.1518/001872097778543886

Passi, S., Dhanorkar, S., & Vorvoreanu, M. (2024). *Appropriate reliance on GenAI: Research synthesis*. Microsoft AETHER UX Research & Education.

Passi, S., & Vorvoreanu, M. (2022). *Overreliance on AI: Literature review*. Microsoft Technical Report, MSR-TR-2022-12. https://www.microsoft.com/en-us/research/publication/overreliance-on-ai-literature-review/

Prather, J., et al. (2023). "It's weird that it knows what I want": Usability and interactions with Copilot for novice programmers. *ACM Transactions on Computer-Human Interaction*, *31*(1). https://doi.org/10.1145/3617367

Sanh, V., et al. (2022). Multitask prompted training enables zero-shot task generalization. *arXiv preprint arXiv:2110.08207*. https://doi.org/10.48550/arXiv.2110.08207

Saunders, W., et al. (2022). Self-critiquing models for assisting human evaluators. *arXiv preprint arXiv:2206.05802*. https://doi.org/10.48550/arXiv.2206.05802

Schemmer, M., Kuehl, N., Benz, C., Bartos, A., & Satzger, G. (2023). Appropriate reliance on AI advice: Conceptualization and the effect of explanations. *Proceedings of the 28th International Conference on Intelligent User Interfaces*, 410–422. https://doi.org/10.1145/3581641.3584066

Sellen, A., & Horvitz, E. (2023). The rise of the AI co-pilot: Lessons for design from aviation and beyond. *arXiv preprint arXiv:2311.14713*. https://doi.org/10.48550/arXiv.2311.14713

Sharma, M., et al. (2023). Towards understanding sycophancy in language models. *arXiv preprint arXiv:2310.13548*. https://doi.org/10.48550/arXiv.2310.13548

Si, C., et al. (2023). Large language models help humans verify truthfulness—except when they are convincingly wrong. *arXiv preprint arXiv:2310.12558*. https://doi.org/10.48550/arXiv.2310.12558

Skitka, L. J., Mosier, K. L., & Burdick, M. (1999). Does automation bias decision-making? *International Journal of Human-Computer Studies*, *51*(5), 991–1006. https://doi.org/10.1006/ijhc.1999.0252

Spatharioti, S. E., Rothschild, D. M., Goldstein, D. G., & Hofman, J. M. (2023). Comparing traditional and LLM-based search for consumer choice: A randomized experiment. *arXiv preprint arXiv:2307.03744*. https://doi.org/10.48550/arXiv.2307.03744

Steyvers, M., et al. (2024). The calibration gap between model and human confidence in large language models. *arXiv preprint arXiv:2401.13835*. https://doi.org/10.48550/arXiv.2401.13835

Tankelevitch, L., et al. (2023). The metacognitive demands and opportunities of generative AI. *arXiv preprint arXiv:2312.10893*. https://doi.org/10.48550/arXiv.2312.10893

Topolinski, S., & Reber, R. (2010). Immediate truth—Temporal contiguity between a cognitive problem and its solution determines experienced veracity of the solution. *Cognition*, *114*(1), 117–122. https://doi.org/10.1016/j.cognition.2009.09.009

Vasconcelos, H., et al. (2023). Generation probabilities are not enough: Exploring the effectiveness of uncertainty highlighting in AI-powered code completions. *arXiv preprint arXiv:2302.07248*. https://doi.org/10.48550/arXiv.2302.07248

Vasconcelos, H., Jörke, M., Grunde-McLaughlin, M., Gerstenberg, T., Bernstein, M. S., & Krishna, R. (2023). Explanations can reduce overreliance on AI systems during decision-making. *Proceedings of the ACM on Human-Computer Interaction*, *7*(CSCW1), 1–38. https://doi.org/10.1145/3702320

Wang, A., Wu, T., Lease, M., & Krishna, R. (2025). Understanding the effects of training on user reliance on AI. *Proceedings of the 2025 CHI Conference on Human Factors in Computing Systems*. https://doi.org/10.1145/3706598.3714082

Weisz, J. D., et al. (2024). Design principles for generative AI applications. *arXiv preprint arXiv:2401.14484*. https://doi.org/10.48550/arXiv.2401.14484

Zhou, K., Jurafsky, D., & Hashimoto, T. (2023). Navigating the grey area: How expressions of uncertainty and overconfidence affect language models. *Proceedings of the 2023 Conference on Empirical Methods in Natural Language Processing*, 5506–5524. https://doi.org/10.18653/v1/2023.emnlp-main.335

Zhou, K., Hwang, J. D., Ren, X., & Sap, M. (2024). Relying on the unreliable: The impact of language models' reluctance to express uncertainty. *arXiv preprint arXiv:2401.06730*. https://doi.org/10.48550/arXiv.2401.06730

---

## Appendix A: Implementation Artifacts

### A.1 Files Created and Modified

| File | Purpose | Key Changes |
|------|---------|-------------|
| `.github/domain-knowledge/DK-APPROPRIATE-RELIANCE.md` | Core domain knowledge module | v1.0: Initial protocols; v1.1: Research improvements; v1.2: Creative latitude; v1.3: AETHER integration |
| `.github/instructions/alex-core.instructions.md` | Core architecture configuration | Safety & Trust synapse; activation patterns |
| `.github/instructions/protocol-triggers.instructions.md` | Trigger-response mappings | Confidence ceiling; "Confident but wrong" detection; Creative latitude; Mitigation strategy triggers |
| `.github/copilot-instructions.md` | Main architecture bootstrap | Trigger index entry |

### A.2 Protocol Components Implemented

1. **Source Grounding Protocol**: Four-tier classification (Documented, Inferred, Uncertain, Unknown)
2. **Confidence Calibration System**: Internal signals → external expressions mapping
3. **Confidence Ceiling Protocol**: Maximum confidence levels by content type
4. **"Confident But Wrong" Detection**: Heuristics for misconceptions, outdated info, fictional bleed, social biases
5. **Category vs. Individual Distinction**: Pattern-level vs. specific-claim confidence
6. **Verification-Focused Explanation Integration**: Self-critiques, contrastive framing, background information
7. **Uncertainty Expression Implementation**: Linguistic and visual uncertainty at multiple levels
8. **Cognitive Forcing Function Integration**: Strategic questioning, verification prompts, multi-turn elaboration
9. **Self-Correction Protocol**: Acknowledge, correct, appreciate, proceed
10. **Over-Reliance Prevention Suite**: Agency-preserving language, scaffolded assistance, human judgment flagging
11. **Creative Latitude Framework**: Epistemic vs. generative mode distinction; collaborative validation
12. **User Profile Integration**: Formality, detail level, expertise adaptation

### A.3 Synapse Connections Established

| Target | Strength | Type | Direction | Purpose |
|--------|----------|------|-----------|---------|
| alex-core.instructions.md | Critical | Validates | Bidirectional | Core architecture validation |
| empirical-validation.instructions.md | Critical | Grounds | Bidirectional | Research foundation |
| worldview-integration.instructions.md | High | Aligns | Bidirectional | Ethical alignment |
| bootstrap-learning.instructions.md | High | Enhances | Bidirectional | Learning protocol integration |
| alex-identity-integration.instructions.md | High | Shapes | Bidirectional | Character trait integration |
| worldview-constitutional-ai.instructions.md | High | Implements | Forward | Constitutional AI compliance |

---

## Appendix B: Use Cases Across Application Domains

### B.1 Software Development

**Code Generation**: Apply confidence ceiling (90% max for documented patterns); suggest verification for external APIs; use code comments for uncertainty indication.

**Debugging Assistance**: Distinguish between pattern-based diagnosis (higher confidence) and novel bugs (lower confidence); apply CFFs for security-sensitive debugging.

**Code Review**: Balance between providing useful feedback and acknowledging reviewer expertise; scaffold based on user experience level.

### B.2 Research and Analysis

**Information Synthesis**: Strong source grounding; temporal uncertainty flagging; contrastive framing for contested claims.

**Literature Review**: Verification-focused explanations with source citations; explicit acknowledgment of coverage limitations.

### B.3 Writing and Documentation

**Technical Writing**: Confidence calibration on factual claims; creative latitude for structural suggestions.

**Content Creation**: Generative mode protocols; collaborative validation for creative directions.

### B.4 Decision Support

**Option Analysis**: Human judgment flagging; agency-preserving language; strategic questioning for high-stakes decisions.

**Tradeoff Evaluation**: Explicit acknowledgment of value judgments; present frameworks rather than conclusions.

### B.5 Learning and Skill Development

**Tutorial Assistance**: Scaffolded support adapting to mastery; verification prompts that teach verification habits.

**Concept Explanation**: Background explanations integrating external context; multi-turn elaboration invitations.

### B.6 Architecture and Design

**System Design**: Creative latitude for solution exploration; confidence calibration on performance predictions.

**Pattern Recommendation**: Category vs. individual distinction; temporal uncertainty for evolving best practices.

### B.7 Security Contexts

**Security Review**: Maximum skepticism; human judgment flagging; CFFs for all recommendations.

**Vulnerability Analysis**: Explicit limitations acknowledgment; verification requirement for all claims.

---

## Appendix C: Quick Reference for Practitioners

### C.1 Core Principles

| Principle | Implementation |
|-----------|----------------|
| Calibration over confidence | Never express certainty beyond actual reliability |
| Source transparency | Distinguish documented from inferred from uncertain |
| Confidence ceilings | 90% max for generated code; 70% for unsourced facts |
| Creative latitude | Different protocols for epistemic vs. generative contributions |
| Verification facilitation | Help users verify; don't force verification |

### C.2 Language Pattern Quick Reference

| Situation | Recommended | Avoid |
|-----------|-------------|-------|
| Uncertain claim | "I believe...", "If I recall..." | "The answer is..." |
| Novel idea | "Here's an idea worth considering..." | "You should..." |
| High-stakes domain | "Worth verifying...", "What assumptions...?" | Unqualified recommendations |
| User correction | "You're right—I got that wrong." | Defensive hedging |
| Multiple valid options | "One approach would be..." | "The best approach is..." |

### C.3 CAIR/CSR Monitoring Questions

- Are users accepting correct outputs? (CAIR)
- Are users rejecting incorrect outputs? (CSR)
- Is the system helping users distinguish between the two?

---

## Appendix D: Design Guidance Checklist (from AETHER Synthesis)

### D.1 Transparency

- [ ] Communicate model capabilities and limitations clearly
- [ ] Explain unique aspects of GenAI (non-determinism, potential for hallucination)
- [ ] Provide examples of (un)intended use cases

### D.2 Explanations

- [ ] Provide verification-focused explanations that lower verification cost
- [ ] Use different evidence types (introspective, related sources, chain-of-thought)
- [ ] Be cautious: explanations can backfire if users find them convincing even when wrong

### D.3 Uncertainty Expression

- [ ] Use linguistic uncertainty in outputs ("I'm not sure...")
- [ ] Consider visual uncertainty (highlights, confidence indicators)
- [ ] Include uncertainty in explanations, not just outputs
- [ ] Explain that verbalized confidence doesn't equal correctness probability

### D.4 Cognitive Forcing Functions

- [ ] Apply CFFs selectively based on stakes and uncertainty
- [ ] Use multi-turn conversations to reduce overreliance
- [ ] Pose questions to encourage critical thinking
- [ ] Balance benefit against cognitive burden

### D.5 User Adaptation

- [ ] Provide different support levels for expert vs. novice users
- [ ] Adapt interaction style while maintaining accuracy standards
- [ ] Test mitigations in context with actual users

---

*Version History*
- V1.0: Initial implementation
- V2.0: Added use case appendices
- V3.0: Full scholarly treatment with expanded literature review
- V4.0: Added creative latitude framework, balance imperative, measurement integration
- V5.0: Integrated AETHER research synthesis; added mitigation strategy sections; expanded measurement framework; added design guidance checklist
