# M365 Workflows for GCX Teams

## How do I organize information in SharePoint for customer experience teams?

| Content Type              | SharePoint Location     | When to Use                                          | Search Strategy               |
| ------------------------- | ----------------------- | ---------------------------------------------------- | ----------------------------- |
| **Process Documentation** | `/Documents/Processes/` | Escalation procedures, workflow guides, SOPs         | Search "process" + keyword    |
| **Customer Templates**    | `/Templates/Customer/`  | Email responses, status updates, escalation scripts  | Browse by scenario type       |
| **Team Resources**        | `/Resources/Team/`      | Org charts, contact lists, RACI matrices             | Search by role or person name |
| **Project Archives**      | `/Projects/{Year}/`     | Completed initiatives, lessons learned, post-mortems | Filter by date range          |
| **Policy Documents**      | `/Policies/`            | Compliance guides, approval workflows, governance    | Search exact policy name      |
| **Meeting Records**       | `/Meetings/{Year}/`     | Decision logs, action items, recurring meeting notes | Search by meeting series name |

**SharePoint Search Tips:**
- Use quotes for exact phrases: `"customer escalation process"`
- Combine with file types: `template filetype:docx`
- Search within properties: `author:smith`
- Use wildcards sparingly: `customer*` (can be slow)

## When should I search SharePoint vs ask a person vs use knowledge files?

| Question Type                  | Best Source                             | Example                                       |
| ------------------------------ | --------------------------------------- | --------------------------------------------- |
| **Department processes**       | SharePoint site search                  | "How do we handle billing disputes?"          |
| **Current project status**     | Ask person directly (Teams/email)       | "What's the timeline for the Q2 integration?" |
| **General business knowledge** | GCX Coworker knowledge files            | "What are the principles of good API design?" |
| **Historical decisions**       | SharePoint meeting records              | "Why did we choose vendor X last year?"       |
| **Template or form**           | SharePoint Templates folder             | "I need the customer onboarding checklist"    |
| **Who owns what**              | Ask person or SharePoint team resources | "Who approves budget increases?"              |

**Decision Tree:**
1. Is it a standard process or template? → SharePoint
2. Is it about current work or urgent? → Ask person
3. Is it general professional knowledge? → Knowledge files
4. Is it a historical decision or archived project? → SharePoint

## Teams Collaboration Patterns for Customer Experience Work

### When to use Teams chat vs channel vs email

| Communication Type       | Best Channel                             | Rationale                                        |
| ------------------------ | ---------------------------------------- | ------------------------------------------------ |
| **Quick status check**   | Teams 1:1 chat                           | Fast, real-time, no formal record needed         |
| **Project coordination** | Teams channel                            | Transparent, searchable, includes whole team     |
| **Customer updates**     | Email                                    | Professional, formal record, external recipients |
| **Urgent escalation**    | Phone call + Teams chat follow-up        | Immediate attention + written confirmation       |
| **Document review**      | SharePoint comments + Teams notification | Version control + discussion threading           |
| **Cross-team requests**  | Email with Teams loop                    | Formal request + collaborative follow-up         |

### Teams Channel Structure for CX Teams

| Channel Name             | Purpose                                   | Who Should Join              |
| ------------------------ | ----------------------------------------- | ---------------------------- |
| **General**              | Team announcements, company news          | All team members             |
| **Daily Standup**        | Status updates, blockers, quick questions | Core project team            |
| **Customer Escalations** | Active escalation tracking, urgent issues | Support leads, managers      |
| **Process Improvement**  | Workflow optimization, tool feedback      | Process owners, stakeholders |
| **Training & Resources** | Learning materials, best practice sharing | All team members             |
| **Project: [Name]**      | Time-bound project collaboration          | Project team only            |

**Channel Naming Conventions:**
- Use consistent prefixes: `Project:`, `Client:`, `Initiative:`
- Include timeframes for temporary channels: `Q2-Planning`
- Archive completed project channels monthly

### Teams Tab and App Recommendations for CX Workflows

| Tab Type                        | Use Case                                | Setup Notes                           |
| ------------------------------- | --------------------------------------- | ------------------------------------- |
| **SharePoint Document Library** | Quick access to team templates          | Pin the Templates folder              |
| **Planner**                     | Project task tracking, sprint planning  | One plan per major initiative         |
| **Power BI**                    | Customer satisfaction dashboards        | Embed team-specific reports           |
| **OneNote**                     | Meeting notes, brainstorming            | Team notebook, not personal           |
| **Forms**                       | Customer feedback surveys, intake forms | Pin active forms only                 |
| **Excel Online**                | Shared tracking spreadsheets            | For simple lists, not complex reports |

## Power Platform for Customer Experience Automation

### Common Power Automate Flows for CX Teams

| Flow Template                  | Trigger                  | Actions                                      | Business Value                    |
| ------------------------------ | ------------------------ | -------------------------------------------- | --------------------------------- |
| **Customer Escalation Router** | New high-priority ticket | Notify manager + create Teams chat           | Faster response times             |
| **Survey Response Handler**    | New Forms response       | Parse data + update tracking list            | Automated data entry              |
| **Meeting Follow-up**          | Teams meeting ends       | Extract action items + assign tasks          | Better accountability             |
| **Document Approval**          | New template uploaded    | Route to reviewers + track status            | Consistent review process         |
| **Status Report Generator**    | Weekly schedule          | Collect project updates + email summary      | Regular stakeholder communication |
| **Customer Onboarding**        | New client added         | Create folder structure + send welcome email | Standardized setup                |

**Flow Design Principles:**
- Keep flows simple: one clear trigger, direct actions
- Add error handling: what happens if someone's out of office?
- Use descriptive names: "Customer Escalation Router v2"
- Test with real data before going live

### Power BI Dashboard Patterns for CX Metrics

| Dashboard Type        | Key Visuals                                                   | Update Frequency | Audience         |
| --------------------- | ------------------------------------------------------------- | ---------------- | ---------------- |
| **Customer Health**   | Satisfaction scores, renewal rates, escalation counts         | Daily            | Account managers |
| **Team Performance**  | Response times, case closure rates, workload distribution     | Weekly           | Team leads       |
| **Executive Summary** | High-level trends, budget vs actual, strategic metrics        | Monthly          | Leadership       |
| **Project Status**    | Timeline progress, milestone completion, resource utilization | Real-time        | Project teams    |

**Design Guidelines:**
- Lead with the most important metric (biggest visual)
- Use consistent colors across all team dashboards
- Add context: not just "85%" but "85% (up from 82% last month)"
- Filter by team member, time period, customer segment

### Power Apps for CX Process Support

| App Type                 | Use Case                | Key Features                                        |
| ------------------------ | ----------------------- | --------------------------------------------------- |
| **Customer Intake Form** | New client setup        | Branching logic, file attachments, approval routing |
| **Escalation Tracker**   | Incident management     | Status updates, owner assignment, SLA monitoring    |
| **Resource Finder**      | Internal knowledge base | Search by category, bookmarking, usage analytics    |
| **Time Tracker**         | Project time logging    | Timer functionality, project codes, weekly reports  |

## Email Workflow Patterns for Customer Experience

### When to use email vs Teams vs SharePoint update

| Scenario                            | Best Choice               | Rationale                                |
| ----------------------------------- | ------------------------- | ---------------------------------------- |
| **External customer communication** | Email                     | Professional, audit trail, formal tone   |
| **Internal team coordination**      | Teams                     | Real-time collaboration, transparency    |
| **Document status updates**         | SharePoint comments       | Context stays with the document          |
| **Formal approvals**                | Email with cc/bcc         | Clear approval record, proper recipients |
| **Quick questions to colleague**    | Teams chat                | Immediate response, casual tone          |
| **Weekly status reports**           | Email                     | Scheduled delivery, formal record        |
| **Brainstorming or discussion**     | Teams channel             | Multiple perspectives, easy to follow    |
| **Policy or procedure changes**     | Email + SharePoint update | Notification + source of truth           |

### Email Templates for Common CX Scenarios

| Template Name                          | When to Use                          | Key Elements                                            |
| -------------------------------------- | ------------------------------------ | ------------------------------------------------------- |
| **Customer Escalation Acknowledgment** | Within 2 hours of escalation         | Clear next steps, timeline, single point of contact     |
| **Project Status Update**              | Weekly to stakeholders               | Executive summary, key metrics, risks/blockers          |
| **Customer Success Check-in**          | Monthly for key accounts             | Satisfaction inquiry, resource offers, feedback request |
| **Internal Handoff**                   | Transferring customer to team member | Complete context, customer preferences, history summary |
| **Issue Resolution**                   | Closing customer tickets             | Solution summary, prevention steps, feedback request    |
| **Stakeholder Update**                 | Major milestones or changes          | Impact assessment, timeline updates, action required    |

**Email Template Structure:**
1. **Subject Line**: Action required, timeline, key identifier
2. **Opening**: Context in one sentence
3. **Body**: Bullet points, clear sections, bold key information
4. **Closing**: Next steps, contact information, timeline
5. **Signature**: Role, direct contact methods, availability

### Inbox Management for High-Volume CX Roles

| Organization Strategy      | Setup                                    | Maintenance                        |
| -------------------------- | ---------------------------------------- | ---------------------------------- |
| **Priority-Based Folders** | Urgent, This Week, This Month, Reference | Daily triage, weekly cleanup       |
| **Customer-Based Folders** | Major accounts as top-level folders      | Archive completed projects monthly |
| **Project-Based Labels**   | Use categories/tags instead of folders   | Consistent naming conventions      |
| **Time-Based Approach**    | Today, This Week, Later folders          | Process daily, archive weekly      |

**Email Processing Rules:**
- Touch each email once: read, respond, defer, or delete
- Use Quick Steps for common actions (forward + archive)
- Set up rules for automated sorting by sender or keywords
- Schedule email processing times, don't check constantly

## Calendar and Meeting Integration for Distributed CX Teams

### Scheduling Patterns for Global CX Teams

| Meeting Type                 | Optimal Time Slots                           | Duration      | Preparation                    |
| ---------------------------- | -------------------------------------------- | ------------- | ------------------------------ |
| **Daily Standup**            | Early overlap hours (8am PT/11am ET)         | 15 minutes    | Status updates pre-shared      |
| **Customer Calls**           | Customer's business hours + 1 hour buffer    | 30-60 minutes | Agenda sent 24h prior          |
| **Team Planning**            | Mid-week, mid-day overlap                    | 60-90 minutes | Materials shared 48h prior     |
| **All-Hands**                | Rotating time slots monthly                  | 60 minutes    | Recording for time zone misses |
| **1:1 Check-ins**            | Individual preference + manager availability | 30 minutes    | Goal setting template          |
| **Cross-Team Collaboration** | Find overlap or async handoff                | 45 minutes    | Clear deliverables defined     |

**Time Zone Management:**
- Use Outlook Scheduling Assistant to find optimal times
- Always include time zones in meeting invites: "2pm PT / 5pm ET"
- Record important meetings for those who can't attend
- Rotate meeting times for recurring cross-regional meetings

### Meeting Preparation Workflow

| Timeline            | Action                              | Owner                 | Tool                     |
| ------------------- | ----------------------------------- | --------------------- | ------------------------ |
| **48 hours before** | Send agenda with pre-reads          | Meeting organizer     | Teams calendar invite    |
| **24 hours before** | Review materials, prepare questions | All attendees         | Individual prep          |
| **2 hours before**  | Test tech, prepare materials        | Presenter             | Teams/equipment check    |
| **During meeting**  | Take notes in shared location       | Designated note-taker | OneNote or Teams wiki    |
| **Within 24 hours** | Distribute action items             | Meeting organizer     | Email + task assignments |
| **1 week after**    | Follow up on commitments            | Action item owners    | Teams chat or email      |

**Meeting Agenda Template:**
1. **Context** (5 min): Why we're meeting, decisions needed
2. **Updates** (15 min): Progress since last meeting, blockers
3. **Discussion** (20 min): Key decisions, options, recommendations
4. **Action Items** (10 min): Who, what, when, definition of done
5. **Next Steps** (5 min): Next meeting date, interim check-ins

### Focus Time Protection Strategies

| Strategy                  | Implementation                            | Benefits                             |
| ------------------------- | ----------------------------------------- | ------------------------------------ |
| **Blocked Focus Hours**   | 2-hour morning blocks, recurring meeting  | Deep work on complex customer issues |
| **Communication Windows** | Check email/Teams 3x daily: 9am, 1pm, 5pm | Reduced context switching            |
| **Meeting-Free Fridays**  | Team agreement, calendar blocks           | Catch-up time, project work          |
| **Buffer Time**           | 15-minute gaps between meetings           | Transition time, note review         |
| **Quiet Hours**           | 7-9am for urgent-only communication       | Prep time, planning                  |

**Tools:**
- Outlook Focus Time: automatic scheduling based on work patterns
- Teams status: "Do not disturb" during focus blocks
- Phone settings: VIP list for true emergencies only

## How should I use M365 Copilot across different apps?

### Copilot in Word for Customer Communication

| Use Case                    | Prompt Pattern                                                                                               | Output Quality                             |
| --------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------ |
| **Draft customer email**    | "Draft a professional email explaining the delay in project delivery, emphasizing our commitment to quality" | Good starting point, needs personalization |
| **Summarize meeting notes** | "Create an executive summary of this meeting transcript, highlighting decisions and action items"            | Very accurate, saves significant time      |
| **Policy documentation**    | "Convert these bullet points into a formal procedure document with numbered steps"                           | Good structure, verify technical accuracy  |
| **Customer proposal**       | "Draft a proposal section addressing their concerns about timeline and budget"                               | Solid foundation, add specific details     |

**Best Practices:**
- Provide context in prompts: customer name, project type, previous communication
- Always review and personalize before sending
- Use Copilot for structure and tone, add specific details manually

### Copilot in Excel for CX Data Analysis

| Task              | Effective Prompt                                                                             | Limitations                                   |
| ----------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------- |
| **Create charts** | "Create a line chart showing customer satisfaction trends over the last 6 months"            | Good at chart selection, verify data accuracy |
| **Find patterns** | "Identify which customer segments have the highest churn rates and explain possible reasons" | Helpful insights, but needs business context  |
| **Clean data**    | "Remove duplicates and standardize the formatting in the customer list"                      | Very reliable for standard operations         |
| **Formula help**  | "Create a formula to calculate customer lifetime value based on these columns"               | Excellent for complex calculations            |

**Tips:**
- Start with clean, well-labeled data for best results
- Verify calculations independently for critical business decisions
- Use Copilot to explain complex formulas others created

### Copilot in PowerPoint for Stakeholder Presentations

| Presentation Type            | Copilot Strength                           | Manual Enhancement Needed                  |
| ---------------------------- | ------------------------------------------ | ------------------------------------------ |
| **Project updates**          | Slide structure, bullet point organization | Add specific metrics, charts, timeline     |
| **Customer success stories** | Narrative flow, template design            | Real customer quotes, approval for sharing |
| **Team training**            | Learning objectives, slide sequence        | Interactive elements, real examples        |
| **Executive briefings**      | Executive summary focus, key points        | Strategic context, decision options        |

**Workflow:**
1. Outline key points manually
2. Use Copilot to create initial slide structure
3. Add specific data, images, and branding
4. Review for company tone and accuracy

### Copilot in Teams for Meeting Productivity

| Feature                   | Best Use                                     | Current Limitations                      |
| ------------------------- | -------------------------------------------- | ---------------------------------------- |
| **Meeting summaries**     | Action item extraction, key decision capture | May miss nuanced discussions             |
| **Chat assistance**       | Catching up on long conversation threads     | Needs context for complex topics         |
| **Follow-up suggestions** | Next steps based on meeting content          | Generic suggestions, needs customization |
| **Question answering**    | Quick facts from meeting transcripts         | Limited to what was explicitly discussed |

**Effective Patterns:**
- Ask specific questions: "What timeline was agreed for Phase 2?"
- Request structured output: "List all action items with owners and due dates"
- Use for follow-up: "Draft a summary for stakeholders who missed the meeting"

### When Copilot Can't Help (Know the Boundaries)

| Task Type                      | Why It Fails                     | Alternative Approach                            |
| ------------------------------ | -------------------------------- | ----------------------------------------------- |
| **Confidential customer data** | Privacy restrictions             | Use templates, anonymize examples               |
| **Real-time customer issues**  | No access to live systems        | Combine Copilot drafts with system data         |
| **Company-specific processes** | Limited organizational knowledge | Reference your SharePoint procedures first      |
| **Sensitive negotiations**     | Risk of inappropriate tone       | Draft outline only, write key sections manually |
| **Technical debugging**        | No access to actual systems      | Use for documentation, not troubleshooting      |
| **Budget approvals**           | No financial system access       | Copilot for formatting, not calculations        |

**Success Pattern:**
1. Use Copilot for structure, templates, and standard content
2. Add specific organizational knowledge and current data manually
3. Always review output for accuracy and appropriate tone
4. Remember: Copilot assists with tasks, doesn't replace judgment
