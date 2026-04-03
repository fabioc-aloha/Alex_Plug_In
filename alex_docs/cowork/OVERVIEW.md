# Copilot Cowork: Architecture and Capabilities

Source: Microsoft official documentation and blog posts, collected 2026-04-02

## What Copilot Cowork does

Cowork is available in Microsoft 365 Copilot. It carries out tasks across your Microsoft 365 environment. Rather than describing what you _could_ do, it does the work.

Core actions:

- **Sends emails**: Drafts, replies, forwards, and sends messages through Outlook
- **Schedules meetings**: Creates calendar events, adds attendees, helps organize your day
- **Creates documents**: Builds Word documents, Excel spreadsheets, PowerPoint presentations, and PDFs
- **Posts in Teams**: Sends messages to channels and chats
- **Searches your organization**: Finds information across your company's resources

Cowork shows each step in your conversation, so you can follow along as it works.

## Capability breakdown

### Communication

- Draft and send emails
- Post updates in Teams channels or send direct messages in 1:1 or group chats
- Create and send HTML newsletters via email
- Manage inbox: sort emails into folders, delete emails, respond inline
- Prepare polished stakeholder communications (status updates, announcements, follow-ups)

### Documents and files

- Create Word, Excel, PowerPoint, and PDF from scratch
- Edit and refine existing documents shared in the conversation
- Browse your entire Work IQ to pull in content
- Create SharePoint and OneDrive folders
- Reorganize existing files into new or existing folders

### Calendar and meetings

- Schedule meetings using natural language (e.g., "set up a 30-minute check-in with Alex tomorrow at 2 PM")
- Manage calendar: add events, move things around, clean up conflicts by declining meetings (with message to organizer)
- Get meeting intelligence and insights to prepare for upcoming conversations
- Start your day with a daily briefing that highlights what's ahead

### Research and search

- Search across your organization for documents, messages, and information
- Perform deep research that synthesizes information from multiple sources into comprehensive reports
- Browse SharePoint and OneDrive folders and select files to work with

### Automation

- Run prompts on a schedule so recurring tasks happen automatically

## How the interaction model works

1. **Describe your task**: Tell Cowork what you need. You can also attach files by dragging them into the chat.
2. **Watch Cowork work**: Cowork breaks your request into steps and works through them one by one. You follow along as each step appears.
3. **Interrupt, steer, or pause**: At any point, you can give additional context or clarify your request.
4. **Approve actions when asked**: Before sensitive actions (sending email, scheduling meeting), Cowork pauses and asks for your go-ahead.
5. **Review the results**: Download documents, check sent messages, or ask Cowork to make changes.

## User controls

| Control              | Description                                                              |
| -------------------- | ------------------------------------------------------------------------ |
| Approve              | Allow action to proceed this one time                                    |
| Approve and Remember | Allow action and skip prompt for similar actions in current conversation |
| Reject               | Stop the action; Cowork skips it and moves on                            |
| Pause (soft)         | Cowork finishes current step, then pauses                                |
| Pause (hard)         | Cowork pauses immediately, including mid-step                            |
| Resume               | Continue from where Cowork stopped                                       |
| Cancel               | End the current task entirely                                            |

Approvals for medium and high risk actions include a risk level indicator so you can gauge impact before deciding.

## Task management

Cowork provides built-in project and task management:

| View         | Description                                                |
| ------------ | ---------------------------------------------------------- |
| List         | Tasks in a sortable vertical list                          |
| Kanban board | Tasks organized into columns by status (drag and drop)     |
| Scheduled    | Scheduled prompts with edit, pause, resume, delete options |

Task statuses: In progress, Needs user input, Done, Failed.

## Side panel

The collapsible side panel shows:

- **Progress**: Percentage complete + step-by-step log
- **Input folder**: Files you provided as context
- **Output folder**: Files Cowork created (with Download and Preview buttons)
- **Skills**: Skills loaded during the conversation (shown as chips)
- **Schedule**: Scheduled prompts with management options
- **Permissions**: Actions you approved with "Approve and Remember"

## Multi-model architecture

Working closely with Anthropic, Microsoft integrated the technology platform that powers Claude Cowork into Microsoft 365 Copilot. This is the multi-model advantage:

- Your work is not limited by one brand of models
- Copilot hosts innovation from across the industry and chooses the right model for the job
- Claude is available in mainline chat via the Frontier program
- In Auto mode, Copilot automatically applies the right model per task, all grounded in enterprise context

**Cowork model picker** (verified from UI, 2026-04-03): Users can explicitly choose between Auto (default), Claude Sonnet 4.6, and Claude Opus 4.6. Only Anthropic models appear in the Cowork picker. OpenAI models may participate behind the scenes in Auto mode or in Researcher's Critique/Council patterns.

The pattern: Anthropic's agentic model for multi-step tasks + Microsoft 365 security and governance = managed, enterprise-grade experience.

## Enterprise and security

- Runs within Microsoft 365's security and governance boundaries
- Identity, permissions, and compliance policies apply by default
- Actions and outputs are auditable
- Documents are immediately enterprise knowledge, protected and ready to share
- Runs in a protected, sandboxed cloud environment
- Tasks continue progressing safely as you move across devices
- Cowork accesses only the services and data you're already permitted to use
- Privacy: adheres to data protection policies detailed in OneDrive privacy/security documentation
- Anthropic is used as a subprocessor (see: learn.microsoft.com/en-us/copilot/microsoft-365/connect-to-ai-subprocessor)

## Supported file types

| Category   | Extensions                                       |
| ---------- | ------------------------------------------------ |
| Word       | doc, docx, docm, dot, dotx, odt, rtf             |
| Excel      | csv, xls, xlsm, xlsx, ods                        |
| PowerPoint | odp, ppt, pptm, pptx                             |
| PDF        | pdf                                              |
| Markdown   | md, markdown, mdx                                |
| Image      | png, jpg, jpeg, gif, webp, bmp, svg, ico         |
| Text       | txt, log                                         |
| Code       | js, ts, py, java, c, cpp, go, rb, rs, and others |
| Config     | json, yaml, yml, toml, ini, xml, env             |
| Notebook   | ipynb                                            |
| Audio      | mp3, wav, m4a, ogg, aac, flac                    |
| Video      | mp4, mov, avi, mkv, webm, wmv                    |
| Archive    | zip, rar, 7z, tar, gz, bz2                       |

Preview supported inline: PDF, CSV, Markdown, Images, HTML.

## Known limitations

- Cannot access or edit files stored locally on your device (only OneDrive/SharePoint)
- Cannot delete files or folders in OneDrive/SharePoint
- Custom skills created by users are not validated by Microsoft
- Mobile support not yet available
- Sessions time out after extended inactivity; conversation cannot be resumed after timeout (observed in Frontier Preview, 2026-04-03)

## Real-world scenarios (from announcement blog)

1. **Clean up your calendar**: Reviews Outlook schedule, asks what to prioritize, flags conflicts and low-value meetings, proposes changes, applies them (accept/decline/reschedule)
2. **Build the meeting packet**: Pulls relevant inputs from email/meetings/files, schedules prep time, produces briefing document + analysis + client-ready deck, saves to M365
3. **Research a company**: Gathers earnings reports, SEC filings, analyst commentary, news, organizes with citations, produces executive summary + research memo + Excel workbook
4. **Create the launch plan**: Builds competitive comparison in Excel, distills differentiation into value prop document, generates pitch deck, outlines milestones and next steps
