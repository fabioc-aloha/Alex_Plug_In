I will paste here the content and you create a document with a cohesive version.


Skip to main content

SharePoint
Search this site





FCFC

Microsoft

Discover

Publish

Build

OneDrive

New SharePoint


🆕 We gave the site a fresh new name: Builders Central! Your central place to learn, build, and extend what’s possible. Let’s build better, together! Select the banner to learn more.
2 of 2

Builders Central
HomeAgents at MicrosoftBuildPublishManageReadinessPower PlatformFabric and Power BISupport
Builders Central - Extending Copilot for M365
Banner with an icon of a computer with a website under construction
Extending Microsoft 365 Copilot
On its own, Microsoft 365 Copilot is a powerful productivity tool for keeping users in the flow of their work across Microsoft 365 applications. With Copilot extensibility, you can augment Copilot by creating agents with custom skills and domain-specific knowledge to enable truly spectacular AI scenarios:

You can extend Copilot's skills by transforming your app into an agent that increases user productivity across daily tasks and workflows.
You can create a Knowledge-only declarative agent
You can enrich the organizational knowledge accessible to Copilot by ingesting your data and content with Microsoft Graph connectors

You can create an action declarative agent, Power Platform Connector or custom agent

Click to discover more:

Agent onboarding

Graph Connector onboarding

Extending M365 Copilot Community/Team

Large Language Models approved tools
Types of agents
Knowledge-only declarative agents
Creating a declarative agent lets you personalize Microsoft 365 Copilot by specifying instructions and knowledge. These agents use the same foundation models and AI services as Copilot. Creating an agent to fit your business needs enhances collaboration, boosts productivity, and simplifies workflows. Declarative agents help automate processes from team onboarding to quickly resolving customer issues.

Declarative agents with actions
Declarative Agents with actions can:

Access real-time information such as finding the latest news coverage on a product launch
Retrieve relational data such as reporting on service tickets assigned to a given team member
Perform actions across apps such as creating a new task in your organization's work tracking system
Custom agents
Custom agents allow you to leverage the full capabilities of Power Platform to bring in additional data and add various actions. By combining generative AI with knowledge, flows, actions, and various data sources, a custom agent can be a powerful tool to address a wide range of use cases and business scenarios.

Building your agent: choose your path
.
Publishing agents
The publishing process differs depending on whether you are publishing a first-party Microsoft product, internal line-of-business solution, or a product from a third-party supplier.

Microsoft first-party agents
Must be onboarded by Tenant Trust.


Line-of-business agents
Covered by Microsoft Teams/Microsoft 365 LoB app publishing process.

Third-party agents
Covered by Teams third-party app onboarding process.

App must be granted Microsoft 365 Certification
Supplier must be approved for highly-confidential data access (HBI) by SSPA
Note: A responsible AI initial impact assessment is mandatory for apps that use AI in addition to agents in Copilot. Even if a plugin doesn't use AI and only ingests data into Copilot, it may still trigger sensitive use cases. Therefore, an initial RAI impact assessment is required to determine the potential impact of the agent and the necessity of full RAI assessment.

Requirements and usage guidelines
All agents must honor Responsible AI rules
Report all sensitive uses: https://aka.ms/ReportSensitiveUses

Any agent with Performance & Development scenarios must adhere to the Copilot usage for Performance & Development guidelines

Any use of M365 applications and services must adhere to M365 Usage Guidelines

Avoid disclosing sensitive information. For instance:
Understand and respect labels of knowledge sources, such as Highly Confidential sites or files
Don’t upload files into your declarative agent. Use existing sources to get the content dynamically
Microsoft's Anti-Harassment and Anti-Discrimination Policy and Business Conduct Policy apply to all conversations and content, electronic or otherwise
All custom agents except knowledge-only declarative agents are considered applications and therefore:
Must abide by SDL and AI processing requirements in Liquid: AI systems must follow the Responsible AI (RAI) Security Guidance
Should be covered by Responsible AI initial impact assessment
Always embody Least Privileged Access. Respect permissions that are already in place and ensure access to the agent only occurs for those who needed
Use user-delegated permissions wherever possible, not using service accounts and granting the account broad access. That can lead to individuals seeing results from content they don’t actually have access to

Agents going against Power Platform, Dynamics, and other platforms will be enabled by individual environment. Consider which specific environments this one is expected to operate in. When publishing, only ask for those environments to be enabled. This is to protect the company and its users from accidentally perceiving a response which includes non-production content as authoritative

The expectations of environments where such plug-ins are enabled are:

Will have Purview enabled

Permissions into and within the environment will be tightly managed, with full audit supported for all security changes

The content within the environment will be actively managed in alignment with corporate retention policy

Please be aware that agents going against certain environments or content may be prohibited due to the nature of the content they are processing. For instance, bringing in work items from ADO projects that handle OS flaws

As an employee at Microsoft, your activity and data are being collected and stored while you use these products. Activity may be reviewed for compliance and/or security purposes (e.g., to help prevent data over-exposure) as well as to help improve Microsoft products and services. For details, refer to the Microsoft policy on Responsible use of technology and Microsoft’s access to business and non-business related data


About
Privacy statement
Hub feedback
Extending Copilot for M365 page is loaded.




Skip to main content

SharePoint




FC

Microsoft

Discover

Publish

Build

OneDrive

New SharePoint


🚧Pardon our progress! Builders Central is evolving through ongoing improvements—select this banner to learn what’s changing.
1 of 2

Builders Central
HomeAgents at MicrosoftBuildPublishManageReadinessPower PlatformFabric and Power BISupport
Overview: Publish an Application
Published 1/7/2026
· 2 min read
Audience & purpose
This guidance is intended for developers and makers who need to publish a Line of Business (LOB) app in the Microsoft 365 app catalog.

Overview
Publishing a Line of Business (LOB) application to the Microsoft 365 app catalog requires a series of compliance and security steps to protect organizational data and maintain Microsoft’s regulatory standards. By adhering to MSD’s publication requirements, developers reinforce trust in Microsoft 365 solutions.

💡Jump to a specific workflow page or scroll down for a quick overview of each topic:

Compliance reviews

Submit for publication

Microsoft (1P) + Partner (3P) apps
Key topics
Compliance reviews
Compliance reviews are essential to maintaining a trusted Microsoft 365 app ecosystem. Every app must meet Microsoft’s standards for security, privacy, responsible AI (RAI), and accessibility before it can be published. Completing these reviews early helps avoid delays and ensures your app is ready for catalog submission.



What to review
Before submitting your app, make sure it meets requirements in the following areas:

Security
Privacy
Responsible AI
Accessibility

Each review supports Microsoft’s commitment to safe, inclusive, and compliant app experiences.

💡Jump to the compliance review pages for guidance on requirements and how to get started:

Security

Privacy

Responsible AI (RAI)

Accessibility
Submit for publication
Before your Line of Business (LOB) app can be published to the Microsoft 365 app catalog, it must go through a formal review process via the App Lifecycle Management (ALM) Portal.

Know the SLAs
⏱️Expect up to 10 business days for review, followed by best-effort admin enablement for Copilot agents, Teams/M365 apps, and Office add-ins.

⏱️Up to 12 business days for certain SharePoint Framework apps.

Additional reviews may extend timelines.

How to check if your request is within SLA?
Go to the ALM Portal.

Open the “All Requests” section in the menu. On this page, locate the desired request.

Select the link entry under the Request Type column. The application details side panel will open.

The “History” tab will provide the processing time for your request for the total time taken (working days) during review.


Review your Publishing request's total processing time
Plan for change freezes
🚫No apps are published during change freeze periods.

✅Reviews continue during change freeze periods.

📅 Check the change freeze calendar to avoid delays.

Submit via ALM Portal
Submit your Line of Business (LOB) app for publication through the ALM Portal. The ALM Review Team will conduct compliance checks before your app can be published to the Microsoft 365 app catalog.

💡Jump to the ALM submissions page for publishing guidance:

ALM submissions
Microsoft (1P) and Partner (3P)
Understanding the difference between first-party and third-party app governance is key to ensuring your app meets Microsoft’s publishing requirements.

First-party (1P) apps
Applications developed, owned, and maintained by Microsoft Corporation and are available to other customers.

These first-party (1P) apps are subject to internal governance and must be reviewed and approved by Tenant Trust through the Tenant Trust Review before they can be enabled in the Microsoft 365 app catalog in Microsoft Corporate tenant.

To get the 1P app/agent published to global app catalog, please follow this guidance for Teams apps and Copilot agents. If you don't have access to this product-owned wiki, you can request it here.

Third-party (3P) apps
Applications developed by vendors outside of Microsoft.

To enable a third-party (3P) app in the Microsoft 365 app catalog, developers must complete the 3P software governance process and achieve Microsoft 365 Certification. Guidance is available on the Third-party M365/Teams apps page, which outlines the steps and requirements for approval and enablement in the Microsoft tenant.



Skip to main content

SharePoint
Search this site





FCFC

Microsoft

Discover

Publish

Build

OneDrive

New SharePoint


Learn how the Employee Self-Service Agent can make your new year lighter and brighter. 🪁
2 of 2

Microsoft Teams
Get startedWhat's NewBest practicesMeetingsFeedback and supportExternal resources

Third-party M365/Teams apps
Overview  |  Is your app approved? |  Get a third-party app approved  |  Resources and support



_______________________________________________________

Overview: Third-party M365/Teams apps at Microsoft
The Microsoft 365 app catalog includes apps created by Microsoft* and third-party apps that are not developed by Microsoft. Microsoft-created apps align with our security standards and should be considered the default experience. Not all third-party apps in the M365 app catalog are validated yet for use at Microsoft.


As part of our Secure Future Initiative (SFI) all third-party apps require an assigned owner as of January 2025. ‌App owners must work with third-party app publishers to keep their apps updated with the latest patches and security updates, ensuring they meet all company standards. As of January 2025, non-compliant third-party Teams apps, including apps without an owner, will begin to be deprecated.



*Note: access applications created by product groups or internal engineering teams are outside of the scope of this site. If the app that you're looking for was created by an internal Microsoft team, refer to Build and publish your app for Microsoft 365 for next steps or TPROD Front Desk Support for guidance.




Is your third-party Teams app already approved for use?
For a full list of approved third-party software, go to the third-party software licensing catalog.

The table below lists third-party apps that that have not been approved for use in Teams. Use the table to find alternative solutions.



Deprecated third-party
Teams apps	Recommended alternatives	Migrate or export your data
Adobe Acrobat Sign	Use the desktop or web app. Learn more about our enterprise agreement with Adobe	Not applicable
Akouo Interpretation	Enable language interpretation in Microsoft Teams	Submit a request by emailing teams@akouo.io
Cisco Webex Meetings	Use Microsoft Teams for meetings whenever possible. If you have to use Webex, access it from the Software Catalog.	Ask Copilot: How can I migrate my data out of the Cisco Webex Meetings app in Microsoft Teams?
Event Management	Use Teams Webinars. Learn more on our large meetings and events page.	Ask Copilot: How can I migrate my data out of the Event Management app in Microsoft Teams?
FormMachines	Microsoft Forms: Web app or Teams app	Ask Copilot: How can I migrate my data out of the FormMachines app in Microsoft Teams?
Jira Data Center	Depends on your specific need. Learn about DevOps workflow integration in Teams
Ask Copilot:

How do I export my data from the Jira Data Center web app in Microsoft Teams?
How do I export my data from the Jira Data Center web app in Microsoft Teams into Azure DevOps?
Priority Matrix
Microsoft Planner: Web app or Teams app
Microsoft To Do: Web app or Teams app
If you require the use of Priority Matrix, submit a request for software approval.

Ask Copilot: How can I migrate my data from the Priority Matrix app in Microsoft Teams to Microsoft To Do or Microsoft Planner?
Salesforce
Dynamics 365 app in Microsoft Teams
If you require the use of Salesforce, submit a request for software approval.
Ask Copilot: How do I export my data out of the Salesforce app in Microsoft Teams?
ServiceDesk Plus Cloud
If you require the use of ServiceDesk Plus Cloud, submit a request for software approval.

Ask Copilot: How do I export my data out of ServiceDesk Plus Cloud? | Try in Copilot Chat
TINYPulse

Viva Pulse	Ask Copilot: How do I migrate my data out of the TINYpulse app in Microsoft Teams?




Get a third-party M365/Teams app approved for use at Microsoft
If the app you want is not already available in the third-party software licensing catalog, follow these steps:


1. M365 app certification

2. Understand app metadata

3. Submit your third-party app for compliance review

4. Become the owner of a Entra ID app that supports third-party M365/Teams app
Resources and support

Questions: contact M365 App Management


Learn more about Teams apps: Understand Microsoft Teams apps and their capabilities


Learn about third-party software governance: Third Party Software Governance


About
Privacy statement
Hub feedback
Height is 40 pixels.


Skip to main content

SharePoint
Search this site





FCFC

Microsoft

Discover

Publish

Build

OneDrive

New SharePoint


Learn how the Employee Self-Service Agent can make your new year lighter and brighter. 🪁
2 of 2

Teamwork in Microsoft 365
HomeWhat's Next BlogCollaboration TechnologiesHow-toFeedback & SupportWhat to Use WhenCommunities
Updated October 18, 2024
Microsoft 365 Usage Guidelines
7 min read
Below you’ll find our Microsoft 365 Usage Guidelines—these outline our expectations for Microsoft users while using Microsoft 365 apps and services. Do not share these guidelines externally. For questions about these guidelines, post in the TechConnect Viva Engage community at the bottom of this page.​​​​​​​

What we expect from you: Keep it secure | Act respectfully | Be accountable | Know your apps | Content moderation


Keep it secure. Here's how:
​​​​​​​​​​​​​​Do not disclose Microsoft confidential information unless there is a compelling business reason to do so and you have obtained a non-disclosure agreement. Sensitive information should only be shared as allowed by Microsoft policy.

If you see inappropriate disclosure of confidential information, submit a report to the ‘Report It Now’ site, just as you would any other security incident. For details, refer to the Microsoft's Confidential Information Policy.

Use the Microsoft classification and sensitivity labeling for Microsoft groups and Office documents.

Classification labels are Public, Non-Business, General, Confidential, and Highly Confidential. Confidential and Highly Confidential groups must be set to "Private." If you create a public Confidential or Highly Confidential group, the privacy will be reset to "Private."

For more information, refer to the Data Classification page.

Microsoft 365 Group names are discoverable, so you should use non-confidential, work-appropriate language to name your teams in Microsoft Teams, groups in Outlook, communities in Viva Engage, or SharePoint team sites. Groups with names that are not work-appropriate will be deleted.

Do not use software or services that are not approved by Microsoft to send or store business-related data, because they may not retain reliable records of that data on Microsoft systems.

​​​​​​​Instead, use your Microsoft corporate accounts and Microsoft 365 services to send and store this data (e.g., store your documents in OneDrive or SharePoint).

For more information, refer to the page on Restricted and Evicted Software.

Policy on Confidential Information

How to classify your data

Create an NDA

Report It Now

Restricted and Evicted Software

Data classification labels in Federal

Act respectfully. Here's what we expect:
Be respectful and inclusive with your colleagues. At Microsoft, we strive to have a culture where employees can have an open dialogue and share their opinions and ideas without fear of personal attacks, intimidation, or reprisal.
​​​​​​​
DO assume everyone is coming to the conversation in good faith.
DON’T say anything on Viva Engage, Teams, or other forums that you would not say in a meeting room or in a face-to-face meeting with a fellow employee.
DO respectfully disagree with people. Listen and seek to understand where they’re coming from.
DON’T turn disagreements into personal attacks or name-calling.
DO avoid using language or statements that could be perceived as threatening.

​​​​​​​Practice awareness, exercise curiosity, and demonstrate courage. In support of Microsoft Inclusive Capabilities, we all have a role to play in creating an experience for others that makes them feel valued, respected, and feel that they belong.

Microsoft may monitor content in public communities to ensure alignment with these Microsoft 365 Usage Guidelines, company policies, and our company values. Microsoft also monitors content across all communities for potential threats to life or safety for appropriate action.

Microsoft does not intend to chill, undermine or otherwise monitor or act against legally protected activity, including discussion of working conditions, pay, benefits and the like in public or private communities.


Microsoft reserves the right to remove or edit content in public communities that is not otherwise legally protected which violates Microsoft’s guidelines or policies, and to follow up directly with employees to address as appropriate. If you have concerns about content that may violate Microsoft’s guidelines or policies, you should report such concerns through AskHR on HRWeb.


Microsoft's Anti-Harassment and Anti-Discrimination Policy and Business Conduct Policy apply to all conversations and content, electronic or otherwise.

If you see inappropriate behavior online, report it with AskHR on HRWeb just as you would any other inappropriate behavior. Viva Engage admins may close conversations that are no longer productive or devolve into personal attacks.

Anti-Harassment and Anti-Discrimination Policy

Business Conduct Policy

Ask HR on HRWeb

Microsoft Inclusive Capabilities

Be accountable. Here's what you should know:
Information you share in Microsoft 365 Groups (e.g., Microsoft Teams, Viva Engage, SharePoint Online, Outlook Groups, etc.) may be viewed by a mixture of Microsoft employees and their guests.

As an employee at Microsoft, your clicks, information, and data are being collected and stored while you use these products. Activity may be mined and processed both for compliance and/or security purposes (e.g., to help prevent data over-exposure) as well as to help improve Microsoft products and services.

For details, refer to the Microsoft policy on Responsible use of technology and Microsoft’s access to business and non-business related data.

Privacy laws vary by country. Refer to the page on Privacy to find your Privacy contact.

Our services add intelligence such as recommendations, insights, and information connections. Anything you have in Microsoft 365 may be processed by those services and surfaced to people who already have access to the content.


Permissions applied to the content are respected, so personal content will only have recommendations and insights for you. Conversations and files shared with others may have connections and recommendations visible to anyone who has access to them.


For instance, if you provide a comment to a topic in Viva Engage, anyone with access to that topic may be prompted with related intelligence. You can control this by managing permissions to limit access; for example, if you do not want guests to have permission to access content, use the “Internal Only” label.
​​​​​​​

As an internal Microsoft user there are additional guidelines that you should be aware of when working with external guests, e.g., vendors without a Microsoft.com account.

Highly Confidential groups do not allow sharing with external users without a security exception. All Highly Confidential groups are automatically set to block external sharing.

Use private teams and groups to share information that you don't want publicly available within Microsoft. Refer to the page on External Sharing for more information.​​​​​​​​​​​​​​​​​
Remain informed and know your apps. Here’s what you should keep in mind about our products:
Microsoft 365 Groups | SharePoint Online | Viva Engage | Meeting Recordings

Microsoft 365 Groups (e.g., Microsoft Teams teams, Viva Engage communities, SharePoint sites, Outlook groups, Microsoft Planner plans, Microsoft Stream channels, etc.)
Microsoft 365 Groups adhere to Microsoft security policies, which require:
Two (2) valid owners, at least one of whom must be a full-time employee (FTE).
Site classification is set using the appropriate classification and sensitivity labels. Refer to the Data Classification page for more information.

Use private teams and groups to share information that you don't want publicly available within Microsoft.

A public group is open to all of Microsoft, has searchable files, and is available for everyone in the company to join. A private group is only open, searchable, and viewable by the members of that group. In either case, the group name, description, picture, and membership can be discovered by non-members.

In a few rare cases, you may create a Microsoft 365 Group with the same name as an existing Distribution Group or Security Group. In these cases, our Global Helpdesk support staff will contact you and help you rename your Microsoft 365 group while we work on a permanent solution in the system.

SharePoint ​​Online
Help us keep costs down by using out-of-the-box solutions like page web parts instead of customizing your site.

Don't build apps for SharePoint Online that are resource intensive. Work with our Front Desk team to build it right.

If you need to share files larger than current file size limits visit the File Share page for information about large file transfer resources.

Viva Engage
Viva Engage is an internal social forum and content should not be copied and shared externally.

Anyone with valid Microsoft credentials has access to the internal Microsoft Viva Engage network.

You can store Highly Confidential data on Viva Engage if it's in a Private community.

​​​​​​Meeting Recordings (OneDrive, Microsoft Teams, Microsoft Stream)
Recording meetings in Teams makes it easy for those that cannot attend to quickly catch-up. All meeting recordings and transcripts are on the record and anything you say will be attributed to you. Refer to the page on Recording and live transcription for meetings in Teams.

Get permission from other participants before recording a meeting, there are times when recording a meeting may not be in the best interest of the company. Refer to the CELA statement on Smart Use Recording Meetings.

Microsoft Stream is an internal video platform and content should not be copied and shared externally. Anyone with valid Microsoft credentials has access to the internal Microsoft Stream platform. When you manually upload videos to Stream, you will be asked to attest to usage guidelines stating that you have the necessary rights and permissions from people in your video and that your video will not violate the copyright, privacy, or rights of others.

You can upload and store confidential videos on Stream if it's in a Private group or channel. Video permissions can be set in the video settings.
Content moderation
Microsoft reserves the right to remove or edit any content on workplace platforms that contradicts the Microsoft 365 Usage Guidelines, company policies, or our company values. We will follow up directly with employees to address as appropriate.


Teams Moderation Guidelines
Team owners can remove content if it meets the following criteria:

Is not related to the purpose of the channel or chat; and that

Is unrelated to the terms and conditions of employment (such as benefits, wages, working hours, etc.); and

Is disruptive to the workplace [We're thinking about all the workplace chatter that happens in teams that is social, and likely unobjectionable.]


Teams channel moderators should strive to make these decisions on a content neutral basis.

For a list of all Microsoft 365 services, visit the site below:


Skip to main content

SharePoint
Search this site





FCFC

New SharePoint


Office of Responsible AI
For EveryoneRAI StandardBuild or Deploy AIFind It

Responsible AI Standard
Published 12/19/2025
Responsible AI by Design
Artificial Intelligence represents a fundamental shift in the way we design technology and is poised to transform business and society.

However, AI systems developed without careful consideration can have unintended consequences. To secure AI system benefits and to identify and mitigate any negative impacts, designing for Responsible AI should begin early in the planning of any AI system and should continue throughout the system’s lifecycle.

Toward this objective we have developed the Responsible AI Standard, the aim of which is to guide Responsible AI by Design at Microsoft and centralize the practices that are necessary for compliance with emerging laws and regulations that govern AI technologies. ​​​​​​​

Embed Preview.
VP, Chief Responsible AI Officer Natasha Crampton speaking about developing Microsoft's Responsible AI Standard
The Responsible AI Standard for Microsoft Owned & Operated AI Systems
Optimized for our engineering teams
The Responsible AI Standard for Microsoft Owned & Operated AI Systems has been optimized for engineering teams building AI systems. If you are a member of C+AI, E+D, Gaming, MS Security, SMT, or T+R, or if you are developing internal systems in MCAPS that are internal and not customer- or partner-facing, you should be using the RAI Standard v2.


How the Standard is structured
The Responsible AI Standard for Microsoft Owned & Operated AI Systems establishes 14 goals that flow from four of our AI principles: Accountability, Transparency, Fairness, and Reliability & Safety. The remaining two AI principles — Privacy & Security, and Inclusiveness — are governed by existing standards and policies (the Microsoft Privacy Standard, the Microsoft Security Policy, and the Microsoft Accessibility Standards).

Each goal in the Standard is composed of requirements – concrete steps for teams to follow to build AI systems in accordance with the Microsoft AI principles. Many of the requirements are intended to mitigate the potential harms of AI systems in addition to upholding our values. Compliance with the Standard is measured by the completion of all the steps for the goals that apply to a system. Some requirements are accompanied by recommended tools and practices to help teams reach compliance, but many additional tools and practices will be needed as we grow in this nascent domain.

Specific requirements for generative AI
The GenAI requirements are for Microsoft teams integrating pre-trained large language models (LLMs) or multi-modal models that can generate text and/or images from natural language–such as Azure Open AI Service (AOAI) Models (e.g., ChatGPT, GPT-4, or DALL-E 2) – into new or existing 1st party Microsoft products. “1st party” are AI systems that Microsoft develops as a product or service and provides to enterprise or consumer customers, as well as first-party AI systems we use internally. These requirements do not apply to LLMs that generate text from image input.

Microsoft Deployment Safety Board (DSB) review applies for all Microsoft teams developing, deploying or integrating generative AI into new or existing 1st party Microsoft products and research. This includes large language models, small language models, multi-modal models, foundation models, and pre-trained generative AI.

Supporting documents

Specific Requirements for GenAI document

Declarative agents
Interim Guidance

If internal usage of declarative agents meets a Restricted Use category, confirm with your CELA contact and Lead RAI Champ and register in OneRAI.

Scope
While this guidance was initially created to respond to “knowledge-only declarative agents”, this guidance applies to systems created for internal use and that do not take actions on behalf of the user ("knowledge-only" systems). Systems with similar functions that could be considered in scope are:

Knowledge-only declarative agents
SharePoint Copilots
Copilot agents in SharePoint
Copilot studio agent builder in copilot chat

What about systems in OneRAI?

Please contact your Lead RAI Champ if there are any division requirements you must complete, aside from ORA guidance.

Note: These Divisions have additional requirements so please contact your Lead RAI Champ for guidance: C+AI, CoreAI, and Microsoft Security

If you have a declarative agent registered in OneRAI that does not meet a Restricted Use category, you can deprecate the system.

If the system does meet a Restricted Use category, please make sure this is indicated in the System Information Assessment.

The Responsible AI Implementation Guidance for Custom Solutions
Customer engagements
Teams that are working on customer or partner facing projects that are in scope for our responsible AI program are required to follow the Responsible AI Implementation Guidance for Custom Solutions​​​​​​​. Review the 3 questions outlined in this document to determine whether your project is in scope.

NOTE: The Impact Assessment for the RAI Implementation Guidance for Custom Solutions is Microsoft Internal. Please do not​​​​​​​ share with customers or partners.

Learn more
To learn more about the steps teams should take to develop and deploy AI products safely, please visit our Policy Implementation & Compliance page.

Requirements Navigation

RAI Standard for Microsoft Owned & Operated AI Systems

RAI Implementation Guidance for Custom Solutions

Specific Requirements for GenAI

Restricted Uses

GenAI Content Disclosure Requirements [Interim]

Autonomous Agentic AI [Interim]

Model Policy [Interim]

Specific Requirements for Facial Recognition

Limited Access Requirements

Guidance for Limited Access Services

Policy for configurable and custom metaprompts

Model Upgrade Policy for Generative AI products

Implementation Guidance for Elections
Templates and Resources

Transparency Documentation

Impact Assessment Resources

Responsible AI Standard Glossary
Responsible AI Standard page is loaded.


Skip to main content

SharePoint
Search this site





FCFC

New SharePoint


🚧Pardon our progress! Builders Central is evolving through ongoing improvements—select this banner to learn what’s changing.
1 of 2

Builders Central
HomeAgents at MicrosoftBuildPublishManageReadinessPower PlatformFabric and Power BISupport
Builders Central - Extending Copilot for M365
Extending Microsoft 365 Copilot
On its own, Microsoft 365 Copilot is a powerful productivity tool for keeping users in the flow of their work across Microsoft 365 applications. With Copilot extensibility, you can augment Copilot by creating agents with custom skills and domain-specific knowledge to enable truly spectacular AI scenarios:

You can extend Copilot's skills by transforming your app into an agent that increases user productivity across daily tasks and workflows.
You can create a Knowledge-only declarative agent
You can enrich the organizational knowledge accessible to Copilot by ingesting your data and content with Microsoft Graph connectors

You can create an action declarative agent, Power Platform Connector or custom agent

Types of agents
Knowledge-only declarative agents
Creating a declarative agent lets you personalize Microsoft 365 Copilot by specifying instructions and knowledge. These agents use the same foundation models and AI services as Copilot. Creating an agent to fit your business needs enhances collaboration, boosts productivity, and simplifies workflows. Declarative agents help automate processes from team onboarding to quickly resolving customer issues.

Declarative agents with actions
Declarative Agents with actions can:

Access real-time information such as finding the latest news coverage on a product launch
Retrieve relational data such as reporting on service tickets assigned to a given team member
Perform actions across apps such as creating a new task in your organization's work tracking system
Custom agents
Custom agents allow you to leverage the full capabilities of Power Platform to bring in additional data and add various actions. By combining generative AI with knowledge, flows, actions, and various data sources, a custom agent can be a powerful tool to address a wide range of use cases and business scenarios.

Building your agent: choose your path
.
Publishing agents
The publishing process differs depending on whether you are publishing a first-party Microsoft product, internal line-of-business solution, or a product from a third-party supplier.

Microsoft first-party agents
Must be onboarded by Tenant Trust.


Line-of-business agents
Covered by Microsoft Teams/Microsoft 365 LoB app publishing process.

Third-party agents
Covered by Teams third-party app onboarding process.

App must be granted Microsoft 365 Certification
Supplier must be approved for highly-confidential data access (HBI) by SSPA
Note: A responsible AI initial impact assessment is mandatory for apps that use AI in addition to agents in Copilot. Even if a plugin doesn't use AI and only ingests data into Copilot, it may still trigger sensitive use cases. Therefore, an initial RAI impact assessment is required to determine the potential impact of the agent and the necessity of full RAI assessment.

Requirements and usage guidelines
All agents must honor Responsible AI rules
Report all sensitive uses: https://aka.ms/ReportSensitiveUses

Any agent with Performance & Development scenarios must adhere to the Copilot usage for Performance & Development guidelines

Any use of M365 applications and services must adhere to M365 Usage Guidelines

Avoid disclosing sensitive information. For instance:
Understand and respect labels of knowledge sources, such as Highly Confidential sites or files
Don’t upload files into your declarative agent. Use existing sources to get the content dynamically
Microsoft's Anti-Harassment and Anti-Discrimination Policy and Business Conduct Policy apply to all conversations and content, electronic or otherwise
All custom agents except knowledge-only declarative agents are considered applications and therefore:
Must abide by SDL and AI processing requirements in Liquid: AI systems must follow the Responsible AI (RAI) Security Guidance
Should be covered by Responsible AI initial impact assessment
Always embody Least Privileged Access. Respect permissions that are already in place and ensure access to the agent only occurs for those who needed
Use user-delegated permissions wherever possible, not using service accounts and granting the account broad access. That can lead to individuals seeing results from content they don’t actually have access to

Agents going against Power Platform, Dynamics, and other platforms will be enabled by individual environment. Consider which specific environments this one is expected to operate in. When publishing, only ask for those environments to be enabled. This is to protect the company and its users from accidentally perceiving a response which includes non-production content as authoritative

The expectations of environments where such plug-ins are enabled are:

Will have Purview enabled

Permissions into and within the environment will be tightly managed, with full audit supported for all security changes

The content within the environment will be actively managed in alignment with corporate retention policy

Please be aware that agents going against certain environments or content may be prohibited due to the nature of the content they are processing. For instance, bringing in work items from ADO projects that handle OS flaws

As an employee at Microsoft, your activity and data are being collected and stored while you use these products. Activity may be reviewed for compliance and/or security purposes (e.g., to help prevent data over-exposure) as well as to help improve Microsoft products and services. For details, refer to the Microsoft policy on Responsible use of technology and Microsoft’s access to business and non-business related data


About
Privacy statement
Hub feedback
Extending Copilot for M365 page is loaded.


Skip to main content

SharePoint
Search this site





FCFC

New SharePoint


🚧Pardon our progress! Builders Central is evolving through ongoing improvements—select this banner to learn what’s changing.
1 of 2

Builders Central
HomeAgents at MicrosoftBuildPublishManageReadinessPower PlatformFabric and Power BISupport
Overview: Publish an Application
Published 1/7/2026
· 2 min read
Audience & purpose
This guidance is intended for developers and makers who need to publish a Line of Business (LOB) app in the Microsoft 365 app catalog.

Overview
Publishing a Line of Business (LOB) application to the Microsoft 365 app catalog requires a series of compliance and security steps to protect organizational data and maintain Microsoft’s regulatory standards. By adhering to MSD’s publication requirements, developers reinforce trust in Microsoft 365 solutions.

💡Jump to a specific workflow page or scroll down for a quick overview of each topic:

Compliance reviews

Submit for publication

Microsoft (1P) + Partner (3P) apps
Key topics
Compliance reviews
Compliance reviews are essential to maintaining a trusted Microsoft 365 app ecosystem. Every app must meet Microsoft’s standards for security, privacy, responsible AI (RAI), and accessibility before it can be published. Completing these reviews early helps avoid delays and ensures your app is ready for catalog submission.



What to review
Before submitting your app, make sure it meets requirements in the following areas:

Security
Privacy
Responsible AI
Accessibility

Each review supports Microsoft’s commitment to safe, inclusive, and compliant app experiences.

💡Jump to the compliance review pages for guidance on requirements and how to get started:

Security

Privacy

Responsible AI (RAI)

Accessibility
Submit for publication
Before your Line of Business (LOB) app can be published to the Microsoft 365 app catalog, it must go through a formal review process via the App Lifecycle Management (ALM) Portal.

Know the SLAs
⏱️Expect up to 10 business days for review, followed by best-effort admin enablement for Copilot agents, Teams/M365 apps, and Office add-ins.

⏱️Up to 12 business days for certain SharePoint Framework apps.

Additional reviews may extend timelines.

How to check if your request is within SLA?
Go to the ALM Portal.

Open the “All Requests” section in the menu. On this page, locate the desired request.

Select the link entry under the Request Type column. The application details side panel will open.

The “History” tab will provide the processing time for your request for the total time taken (working days) during review.


Review your Publishing request's total processing time
Plan for change freezes
🚫No apps are published during change freeze periods.

✅Reviews continue during change freeze periods.

📅 Check the change freeze calendar to avoid delays.

Submit via ALM Portal
Submit your Line of Business (LOB) app for publication through the ALM Portal. The ALM Review Team will conduct compliance checks before your app can be published to the Microsoft 365 app catalog.

💡Jump to the ALM submissions page for publishing guidance:

ALM submissions
Microsoft (1P) and Partner (3P)
Understanding the difference between first-party and third-party app governance is key to ensuring your app meets Microsoft’s publishing requirements.

First-party (1P) apps
Applications developed, owned, and maintained by Microsoft Corporation and are available to other customers.

These first-party (1P) apps are subject to internal governance and must be reviewed and approved by Tenant Trust through the Tenant Trust Review before they can be enabled in the Microsoft 365 app catalog in Microsoft Corporate tenant.

To get the 1P app/agent published to global app catalog, please follow this guidance for Teams apps and Copilot agents. If you don't have access to this product-owned wiki, you can request it here.

Third-party (3P) apps
Applications developed by vendors outside of Microsoft.

To enable a third-party (3P) app in the Microsoft 365 app catalog, developers must complete the 3P software governance process and achieve Microsoft 365 Certification. Guidance is available on the Third-party M365/Teams apps page, which outlines the steps and requirements for approval and enablement in the Microsoft tenant.

💡Jump to the first-party (1P) and third-party (3P) app governance pages for guidance and how to get started:

Tenant Trust Review

Third-party M365/Teams apps

About
Privacy statement
Hub feedback

