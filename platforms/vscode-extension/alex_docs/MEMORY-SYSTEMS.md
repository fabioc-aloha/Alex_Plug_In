# 📚 How Alex Remembers

> Your institutional knowledge, organized and accessible

---

## The Challenge Alex Solves

Every development team builds institutional knowledge—patterns, gotchas, lessons learned. The problem is that knowledge usually lives in people's heads, scattered Slack threads, or documentation nobody reads.

Alex solves this by giving you a structured way to capture, organize, and retrieve knowledge. And unlike a wiki that gathers dust, Alex actively uses this knowledge to help you work.

---

## Where Knowledge Lives

Alex organizes knowledge into layers, from temporary to permanent, from local to global.

**Working Memory** is what Alex holds during a single conversation. Like a developer's mental context while debugging—rich and relevant, but cleared when the session ends. Alex can hold roughly seven active concepts at once, which matches human cognitive limits.

**Project Memory** lives in your project's `.github/` folder. This is expertise specific to this codebase: how your API is structured, what patterns your team uses, gotchas specific to your architecture. It travels with the project.

**Global Memory** lives in your home directory (`~/.alex/`). This is knowledge that applies everywhere: general patterns, cross-cutting insights, lessons learned that help on any project. It travels with you.

**Team Sharing** shares your global memory via a GitHub repository. This means your knowledge works across teams, lives across multiple computers, and is backed up with full Git history.

---

## What Gets Remembered

Not everything needs to be remembered. Alex distinguishes between different types of knowledge.

**Insights** are specific learnings tied to a moment—"React hooks need cleanup functions," "This API rate-limits to 100 requests per minute," "Never trust user input in that field." They're timestamped and tagged for easy retrieval.

**Patterns** are reusable solutions that apply broadly—error handling strategies, API design approaches, testing patterns. They're more polished and organized than raw insights.

**Procedures** are how-to knowledge—release checklists, code review guidelines, debugging workflows. These become instructions that Alex follows when relevant situations arise.

**Domain Expertise** is deep knowledge about a specific area—your authentication system, your deployment pipeline, React best practices for your team. This builds up over time as you work with Alex.

---

## How to Capture Knowledge

The easiest way is conversation. When you learn something valuable, just tell Alex:

*"Remember that our API returns 429 when rate-limited, and we should implement exponential backoff."*

*"Save this: the CustomerService class is the source of truth for customer data, never query the database directly."*

Alex saves it to your global knowledge, tagged and searchable.

For more deliberate consolidation, ask Alex to meditate at the end of a session. Alex reviews what you discussed, identifies insights worth keeping, and saves them properly.

You can also promote project-specific knowledge to global—when you realize something you learned here applies everywhere, tell Alex to promote it.

---

## How to Retrieve Knowledge

Just ask. Alex searches your knowledge automatically when relevant.

*"What do we know about error handling?"*

*"Did we learn anything about rate limiting?"*

*"Search our knowledge for React patterns."*

Alex searches across all your saved insights and patterns, from all projects. If you're working in Project B and need knowledge from Project A, it's there.

Alex also searches automatically in the background. When local project context doesn't have an answer, Alex checks global knowledge without you asking. This is the "unconscious" part of the architecture—routine retrieval that just happens.

---

## Keeping Knowledge Healthy

Knowledge systems can get cluttered or out of date. Alex has built-in maintenance.

**Dream mode** checks that everything is properly organized—files are in the right places, connections are intact, nothing is corrupted. Run it occasionally, like maintenance on a well-tuned system.

**Meditation** is how you curate knowledge—reviewing what's been captured and deciding what's worth keeping. It's a conscious checkpoint rather than automatic hoarding.

If knowledge becomes outdated, you can tell Alex to forget it or update it. The system is designed to be curated, not just accumulated.

---

## The Payoff

Over time, you build a genuine institutional knowledge base. Lessons learned don't disappear when projects end or people leave. Patterns discovered once become available forever. Each project makes you and Alex smarter for the next one.

That's the promise: your lead developer gets better over time, and so does your accumulated expertise.

---

*For technical details on file formats and locations, see the project documentation.*
