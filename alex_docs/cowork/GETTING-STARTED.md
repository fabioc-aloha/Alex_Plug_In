# Getting started with Copilot Cowork

Source: Microsoft Learn (learn.microsoft.com/en-us/copilot/microsoft-365/cowork/get-started), collected 2026-04-02, updated 2026-04-09
Status: Frontier Preview (prerelease documentation, subject to change)

## Prerequisites

- **Microsoft 365 Copilot license**: Active license assigned to your account
- **Frontier program enrollment**: Must be enrolled in the Frontier preview program
- **Anthropic enabled in tenant**: Cowork uses Anthropic models as a subprocessor. Admin must enable this. See [Anthropic as subprocessor](https://learn.microsoft.com/en-us/microsoft-365/copilot/connect-to-ai-subprocessor)
- **Modern browser**: Microsoft Edge or Google Chrome recommended
- **Cowork enabled**: Must be enabled in your Microsoft 365 Copilot environment
- **Admin note**: If Cowork isn't visible in Admin Center Agent management, ensure admin account is enrolled in Frontier (Copilot > Settings > Frontier)

## Access points

| Platform    | How to access                                                                |
| ----------- | ---------------------------------------------------------------------------- |
| Browser     | https://m365.cloud.microsoft/ > Select "Cowork" (or find under "All agents") |
| Desktop app | Microsoft 365 Copilot app for Windows and Mac                                |
| Outlook     | Integrated in Outlook                                                        |
| Teams       | Integrated in Teams                                                          |
| Mobile      | Not yet available                                                            |

## First conversation walkthrough

### Step 1: Open Cowork

1. Open Microsoft 365 Copilot at m365.cloud.microsoft
2. Select **Cowork**
3. If not visible, select **All agents**

The home page shows: chat input + suggested prompts + recent tasks.

### Step 2: Describe your task

**Suggested prompts on the home page:**

- Catch me up
- Organize my inbox
- Organize my week
- Prep for a meeting
- Plan an event
- Prepare for my 1:1
- Research a company

**Input options:**

- Type your message (up to 16,000 characters)
- Drag and drop files onto the chat input
- Select "Upload images and files" to browse your device
- Select "Attach cloud files" for OneDrive, SharePoint, or Teams files
- Use voice input via microphone button

**Pro tip:** Be specific. Instead of "send an email", try "Send an email to the marketing team summarizing last week's campaign results and format the summary as a PDF."

### Step 3: Watch Cowork work

As Cowork processes your request:

- **Thinking indicator**: Animation while processing
- **Skill messages**: "Preparing to compose emails" or "Preparing to create Word documents"
- **Tool steps**: "Composing your email" or "Creating your presentation"
- **Streaming response**: Reply appears word by word in real time
- **Interactive cards**: Structured layouts with buttons and data displays

### Step 4: Approve actions

Before sensitive actions (sending email, posting in Teams, scheduling meeting), Cowork shows an approval dialog.

| Option                                      | Effect                                                                   |
| ------------------------------------------- | ------------------------------------------------------------------------ |
| Action button (Send, Post, Create, etc.)    | Proceed this one time. Button label matches the specific action.         |
| Don't ask again (dropdown on action button) | Proceed and skip future prompts for similar actions in this conversation |
| Approve All                                 | When multiple approvals are pending, allow all at once                   |
| Cancel                                      | Stop the action                                                          |

Medium and high risk actions include a risk level indicator. Some actions show a rich content preview (email draft, Teams message, scheduled meeting). You can select "Show parameters" to see technical details.

### Step 5: Review results

Files Cowork created appear in the side panel:

- Download individual files or "Download All" as a zip archive
- Preview files directly in browser (PDF, Markdown, Images, CSV, HTML)
- Open files in OneDrive or in native online apps
- Files are also saved to your OneDrive and SharePoint workspace
- Rate outputs with thumbs up/down
- Leave inline comments directly on specific parts of Cowork's messages for targeted feedback

### Step 6: Find past work

Select **Tasks** from main navigation for all previous conversations:

- **List view**: Vertical list with key details
- **Kanban board**: Columns by status (drag and drop)
- **Scheduled tab**: Manage scheduled prompts

Select any task to open it and resume the conversation.

## Connection handling

| Status       | Meaning                     |
| ------------ | --------------------------- |
| Connecting   | Cowork is getting ready     |
| Connected    | Connection is active        |
| Reconnecting | Brief drop; auto-restoring  |
| Failed       | Select "Retry" to reconnect |

If you lose your connection, Cowork auto-reconnects. Progress made while disconnected is preserved.

## Queuing messages

You can send additional messages while Cowork is busy. Messages are queued and processed in order. If your new message changes direction, Cowork adjusts its approach.

## Questions from Cowork

Sometimes Cowork needs more information. It presents choices for you to pick from. You can:

- Select an option
- Type your own answer
- Select "Skip" to let Cowork continue without additional input

Task status shows "Needs user input" when Cowork is waiting.
