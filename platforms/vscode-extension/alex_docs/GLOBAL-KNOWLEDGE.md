# 🌐 Knowledge That Travels With You

> Cross-project learning that compounds over time

---

## The Problem With Project-Locked Knowledge

Most of what you learn is trapped in the project where you learned it. You figure out a great error-handling pattern in Project A, but when you start Project B, you're starting from scratch. The insight exists somewhere—maybe in your head, maybe in old code—but it's not readily accessible.

Alex solves this with global knowledge: a personal knowledge base that lives outside any single project and is available everywhere you work.

---

## How It Works

When you learn something valuable, you can save it to your global knowledge base. These insights and patterns are stored in your home directory (`~/.alex/`) and are accessible from any project you open.

Say you're working on an e-commerce site and figure out a clean way to handle payment failures. Tell Alex:

*"Save this insight: Always implement idempotency keys for payment operations to prevent duplicate charges during retries."*

That knowledge is now global. Six months later, when you're on a completely different project and dealing with payments again, ask Alex what you know about payment handling. There it is.

---

## Insights vs. Patterns

Alex distinguishes between two types of global knowledge.

**Insights** are specific learnings, often tied to a particular discovery. They're timestamped and include context about when and why you learned them. They're great for capturing "aha moments" and gotchas.

**Patterns** are more polished, reusable solutions. They describe a general approach that applies across many situations. When you find yourself repeating the same insight across multiple projects, it might be time to promote it to a pattern.

Both are searchable, tagged by category, and available everywhere.

---

## Promoting Knowledge

Sometimes you build expertise within a project that deserves to be global. Maybe you've documented how your team handles API versioning, and you realize this approach would work anywhere.

You can promote project-local knowledge to global:

*"Promote our API versioning documentation to global knowledge."*

Alex copies it to your global base, making it available across all future projects.

---

## Team Sharing

Your global knowledge lives in a GitHub repository, which means:

**Backup.** Your insights survive hardware failures and machine changes.

**Multi-machine access.** Knowledge saved on your work laptop is available on your home machine.

**Team collaboration.** Share your GitHub username with teammates — they enter it during initialization.

**Full history.** Git versioning tracks all changes over time.

**Private repo support.** Team members sign in with GitHub for authenticated access.

---

## Searching Global Knowledge

Just ask:

*"What do we know about authentication?"*

*"Search global knowledge for error handling patterns."*

*"Did we ever figure out a good approach to rate limiting?"*

Alex searches across all your saved insights and patterns from every project. You get a curated view of your accumulated expertise.

You don't have to search explicitly, either. When Alex can't find something in the current project's context, it automatically checks global knowledge. This unconscious fallback means your cross-project learning surfaces when it's relevant—without you having to remember to look.

---

## Categories and Tags

Knowledge is organized by category (error-handling, api-design, testing, architecture, etc.) and can have custom tags. This makes search more precise and helps you build a mental model of what expertise you've accumulated.

When saving insights, you can specify categories and tags:

*"Save this to our testing knowledge: Always mock external APIs in unit tests to avoid flaky tests."*

Or let Alex infer the category based on content.

---

## Building Compound Expertise

The real payoff comes over time. Each project adds to your global knowledge. Each insight compounds on previous ones. A year from now, you'll have a rich, searchable base of everything you've learned—patterns that work, gotchas to avoid, approaches that succeeded.

That's institutional knowledge that doesn't depend on memory, doesn't get lost when projects end, and actively makes you more effective on every new challenge.

Your lead developer remembers everything valuable, and so does your team.

---

*For technical details on storage format and sync protocols, see the project documentation.*
