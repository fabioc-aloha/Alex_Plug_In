# Microsoft Foundry — Capabilities Digest

> Comprehensive reference of all Microsoft Foundry capabilities extracted from official documentation
> **Source**: `foundry.md` (42,708 lines) + `foundry2.md` (15,682 lines)
> **Date**: February 2026
> **Portal**: https://ai.azure.com

---

## Table of Contents

1. [Platform Overview](#platform-overview)
2. [Agent Service](#agent-service)
3. [Hosted Agents](#hosted-agents)
4. [Models & Inference](#models--inference)
5. [Tool Catalog](#tool-catalog)
6. [Memory & Foundry IQ](#memory--foundry-iq)
7. [Realtime API (Voice)](#realtime-api-voice)
8. [Observability & Evaluation](#observability--evaluation)
9. [Publishing Channels](#publishing-channels)
10. [VS Code Extension](#vs-code-extension)
11. [Foundry MCP Server](#foundry-mcp-server)
12. [SDKs](#sdks)
13. [Foundry Tools SDKs](#foundry-tools-sdks)
14. [Solution Templates](#solution-templates)
15. [Declarative Agent Workflows](#declarative-agent-workflows)
16. [Enterprise Features](#enterprise-features)
17. [Authentication & RBAC](#authentication--rbac)
18. [Quick Reference](#quick-reference)

---

## Platform Overview

Microsoft Foundry (formerly Azure AI Foundry) is a **unified Azure PaaS** for enterprise AI operations. It consolidates model hosting, agent orchestration, tool management, observability, and multi-channel publishing into a single platform.

### What's New in the Portal (2026)

| Feature                                | Description                                                                      |
| -------------------------------------- | -------------------------------------------------------------------------------- |
| **Multi-Agent Orchestration**          | SDK-based collaborative agent workflows with routing and handoffs                |
| **Expanded Integration**               | Publish agents to M365 Copilot, Teams, BizChat as first-party surfaces           |
| **1,400+ Tool Catalog**                | Public + private tool marketplace (Bing, SharePoint, MCP, OpenAPI, custom)       |
| **Memory**                             | Cross-interaction context retention and user adaptation                          |
| **Foundry IQ**                         | Enterprise + web grounding with citations, knowledge base integration            |
| **Real-Time Observability**            | OpenTelemetry → Application Insights with agent dashboards                       |
| **Enterprise Support**                 | MCP/A2A protocol auth, AI Gateway (routing/rate limiting/failover), Azure Policy |
| **Centralized Management ("Operate")** | Manage agents, models, tools, deployments as a fleet                             |
| **Optimized Developer Experience**     | VS Code extension, declarative workflows, hosted containers                      |

### Key URLs

| Resource          | URL                                                                            |
| ----------------- | ------------------------------------------------------------------------------ |
| Portal            | https://ai.azure.com                                                           |
| API Reference     | https://learn.microsoft.com/en-us/rest/api/aifoundry/                          |
| SDK Docs          | https://learn.microsoft.com/en-us/azure/ai-foundry/how-to/develop/sdk-overview |
| MCP Server        | https://mcp.ai.azure.com                                                       |
| VS Code Extension | TeamsDevApp.vscode-ai-foundry                                                  |

---

## Agent Service

The core runtime for building, deploying, and managing AI agents.

### Agent Creation Pattern

```python
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential

client = AIProjectClient(
    endpoint="https://<resource>.services.ai.azure.com/api/projects/<project>",
    credential=DefaultAzureCredential()
)

agent = client.agents.create_agent(
    model="gpt-4.1-mini",
    name="my-agent",
    instructions="You are a helpful assistant."
)
```

### Agent Versioning

```python
from azure.ai.projects.models import PromptAgentDefinition

agent_definition = PromptAgentDefinition(
    model="gpt-4.1-mini",
    instructions="System instructions here",
    tools=[bing_tool, file_search_tool]
)

# Versioning creates immutable snapshots
versioned = client.agents.create_agent_version(
    agent_id=agent.id,
    definition=agent_definition
)
```

### Conversations API

```python
# Create conversation (replaces threads)
conversation = client.agents.create_conversation(agent_id=agent.id)

# Send message
client.agents.create_message(
    conversation_id=conversation.id,
    role="user",
    content="Hello"
)

# Get response (streaming or synchronous)
response = client.agents.create_run(
    conversation_id=conversation.id,
    agent_id=agent.id
)
```

### Key Concepts

| Concept                   | Description                                         |
| ------------------------- | --------------------------------------------------- |
| **Agent**                 | Stateless definition (model + instructions + tools) |
| **Conversation**          | Stateful multi-turn interaction context             |
| **Run**                   | Single execution of agent within a conversation     |
| **Version**               | Immutable snapshot of agent definition              |
| **PromptAgentDefinition** | Typed agent config (model, instructions, tools)     |

### Supported Languages

Python, C#, JavaScript/TypeScript, Java, REST API

---

## Hosted Agents

Containerized agents running on managed Azure infrastructure. **Preview feature.**

### What Hosted Agents Provide

| Feature                     | Description                                          |
| --------------------------- | ---------------------------------------------------- |
| **Containerized Runtime**   | Docker-based, framework-agnostic deployment          |
| **Hosting Adapter**         | HTTP wrapper for LangGraph, MS Agent Framework, etc. |
| **Managed Infrastructure**  | Azure handles scaling, networking, certificates      |
| **Conversation Management** | Built-in stateful multi-turn interactions            |
| **Local Testing**           | Run locally before deploying                         |
| **Framework Support**       | LangGraph (Python), MS Agent Framework (C#), custom  |

### Setup (Python)

```bash
pip install azure-ai-agentserver-agentframework
```

### Running Modes

| Mode            | Command                         | Purpose                 |
| --------------- | ------------------------------- | ----------------------- |
| **Interactive** | `agentserver run --interactive` | Local REPL testing      |
| **Container**   | `agentserver run`               | HTTP server (port 8080) |
| **VS Code**     | Via Foundry VS Code extension   | Integrated development  |

### Deployment

```bash
# Deploy to Foundry
azd deploy
# Or via VS Code extension: "Publish Hosted Agent"
```

### Observability Integration

```python
from azure.ai.agentserver import setup_observability

# Pipes traces to VS Code Extension visualizer
setup_observability(vs_code_extension_port=4319)
```

### Requirements

| Requirement             | Details                                                      |
| ----------------------- | ------------------------------------------------------------ |
| **Container Registry**  | Azure Container Registry with AcrPull role                   |
| **Port**                | 8080 (default)                                               |
| **Framework**           | Any (LangGraph, MS Agent Framework, Semantic Kernel, custom) |
| **Local Prerequisites** | Docker Desktop, Azure CLI, azd CLI                           |

---

## Models & Inference

### Model Catalog

1,000+ models available through the Foundry model catalog, including:

| Family              | Models                                                                               |
| ------------------- | ------------------------------------------------------------------------------------ |
| **OpenAI**          | GPT-5, GPT-5-mini, GPT-5-nano, GPT-5-pro, GPT-4.1, GPT-4.1-mini, o3, o3-pro, o4-mini |
| **OpenAI Realtime** | gpt-realtime (GA), gpt-realtime-mini (GA), gpt-4o-realtime-preview                   |
| **Microsoft**       | Phi-4, Phi-4-mini, MAI-1                                                             |
| **Meta**            | Llama 3.1/3.2/3.3 (70B, 405B variants)                                               |
| **DeepSeek**        | DeepSeek-R1                                                                          |
| **Mistral**         | Mistral Large, Mixtral                                                               |
| **Others**          | Cohere, Jamba, DBRX, 1000+ more                                                      |

### Deployment Types

| Type                | Endpoint                                        | Use Case                          |
| ------------------- | ----------------------------------------------- | --------------------------------- |
| **Azure OpenAI**    | `https://<resource>.openai.azure.com/openai/v1` | OpenAI models with Azure security |
| **Serverless API**  | Model-specific endpoint                         | Pay-per-token for open models     |
| **Managed Compute** | Custom endpoint                                 | Full control, reserved capacity   |

### Inference Pattern (Keyless Auth)

```python
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential

client = AIProjectClient(
    endpoint="https://<resource>.services.ai.azure.com/api/projects/<project>",
    credential=DefaultAzureCredential()
)

# Get OpenAI-compatible client automatically configured
openai_client = client.get_openai_client()

response = openai_client.chat.completions.create(
    model="gpt-4.1-mini",
    messages=[{"role": "user", "content": "Hello"}]
)
```

### Model Deployment (Portal)

1. Navigate to **Model catalog** in Foundry portal
2. Select model → **Deploy**
3. Choose deployment type (Standard, Global, Provisioned)
4. Configure quota (TPM — Tokens Per Minute)
5. Optionally enable content filtering

### Model Deployment (CLI)

```bash
az cognitiveservices account deployment create \
    --name <resource> \
    --resource-group <rg> \
    --deployment-name gpt-4.1-mini \
    --model-name gpt-4.1-mini \
    --model-version "2025-04-14" \
    --model-format OpenAI \
    --sku-capacity 30 \
    --sku-name "Standard"
```

---

## Tool Catalog

### Built-in Tools

| Tool                 | Description                                  | Configuration                      |
| -------------------- | -------------------------------------------- | ---------------------------------- |
| **Bing Grounding**   | Web search for real-time information         | Requires Bing Search resource      |
| **File Search**      | RAG over uploaded documents (vector stores)  | Create vector store → upload files |
| **Code Interpreter** | Python sandbox for data analysis/computation | Automatic — no setup needed        |
| **SharePoint**       | Enterprise document grounding                | SharePoint site + permissions      |

### Integration Tools

| Tool Type        | Description                              | Configuration                      |
| ---------------- | ---------------------------------------- | ---------------------------------- |
| **OpenAPI 3.0**  | Connect to any REST API via OpenAPI spec | Provide spec URL + auth            |
| **MCP Servers**  | Remote Model Context Protocol servers    | Server URL + auth + approval prefs |
| **A2A Protocol** | Agent-to-Agent communication             | Target agent URL + auth            |

### Tool Catalog (1,400+)

The Foundry Tool Catalog provides a marketplace of pre-built tools:

- **Public tools**: Bing, SharePoint, Microsoft Graph, etc.
- **Private catalog**: Organization-published custom tools
- **Categories**: Search, Data, Communication, Productivity, Custom

### File Search Details

```python
# Create vector store
vector_store = client.agents.create_vector_store(name="my-knowledge")

# Upload files for RAG
client.agents.upload_file_and_poll(
    vector_store_id=vector_store.id,
    file_path="knowledge-base.pdf"
)

# Attach to agent
file_search_tool = FileSearchTool(vector_store_ids=[vector_store.id])
```

### MCP Server Integration

```python
from azure.ai.projects.models import McpTool

mcp_tool = McpTool(
    server_url="https://my-mcp-server.com",
    server_label="My MCP Server",
    allowed_tools=["tool_a", "tool_b"],  # Optional filter
    auth={"type": "entra_id"}  # Optional auth
)
```

---

## Memory & Foundry IQ

### Memory (Enhanced)

Cross-interaction context retention without manual state management.

| Feature                 | Description                                        |
| ----------------------- | -------------------------------------------------- |
| **Automatic Retention** | Remembers key context across conversations         |
| **User Adaptation**     | Adapts tone and style based on interaction history |
| **Cross-Session**       | Persists between separate conversation sessions    |
| **API Access**          | Programmatic memory read/write (preview)           |
| **Per-User**            | Memory scoped to individual users                  |

### Foundry IQ

Enterprise knowledge grounding with citations and web integration.

| Feature                | Description                               |
| ---------------------- | ----------------------------------------- |
| **Knowledge Bases**    | Upload enterprise documents for grounding |
| **Web Grounding**      | Bing-powered real-time web knowledge      |
| **Citations**          | Responses include source references       |
| **Automatic Indexing** | Documents indexed for semantic retrieval  |
| **Hybrid Search**      | Combines keyword + semantic search        |

### Knowledge Source Priority

1. Agent system instructions (highest priority)
2. Foundry IQ knowledge base (enterprise docs)
3. File Search vector stores (uploaded RAG files)
4. Tool results (Bing, MCP, etc.)
5. Model training data (lowest priority)

---

## Realtime API (Voice)

Speech-to-speech AI with low latency.

### Transport Options

| Transport     | Latency | Use Case                          |
| ------------- | ------- | --------------------------------- |
| **WebRTC**    | ~100ms  | Browser-based voice apps          |
| **WebSocket** | ~200ms  | Server-side applications          |
| **SIP**       | Varies  | Telephony/call center integration |

### Models

| Model                     | Status  | Notes            |
| ------------------------- | ------- | ---------------- |
| `gpt-realtime`            | GA      | Production-ready |
| `gpt-realtime-mini`       | GA      | Lower cost       |
| `gpt-4o-realtime-preview` | Preview | Legacy           |

### Voice Activity Detection (VAD)

| Mode           | Description                              |
| -------------- | ---------------------------------------- |
| `server_vad`   | Server-side silence detection (default)  |
| `semantic_vad` | AI-powered turn detection (more natural) |
| `manual`       | Application controls turn boundaries     |

### Capabilities

| Capability                | Description                                        |
| ------------------------- | -------------------------------------------------- |
| **Speech-to-Speech**      | Direct audio in → audio out (no intermediate text) |
| **MCP in Voice**          | Tool calls during voice sessions                   |
| **Image Input**           | Send images alongside voice                        |
| **Out-of-Band Responses** | Generate responses without triggering audio        |
| **Session Duration**      | Up to 30 minutes                                   |
| **Audio Format**          | PCM16, mono, 24kHz                                 |

### JavaScript Quickstart (WebSocket)

```javascript
const { OpenAIRealtimeWS } = require("openai/beta/realtime/ws");

const realtime = new OpenAIRealtimeWS({
    azureDeployment: "gpt-realtime",
    azureEndpoint: endpoint,
    azureApiKey: apiKey,
});

realtime.on("session.created", () => {
    realtime.send({
        type: "session.update",
        session: {
            modalities: ["text", "audio"],
            turn_detection: { type: "semantic_vad" },
            input_audio_format: "pcm16",
            output_audio_format: "pcm16",
        },
    });
});

realtime.on("response.audio.delta", (event) => {
    // Stream audio chunks to speaker
    playAudio(event.delta);
});
```

---

## Observability & Evaluation

### Observability Stack

```
Agent Runtime → OpenTelemetry → Application Insights → Agent Dashboard
```

| Component                 | Purpose                             |
| ------------------------- | ----------------------------------- |
| **OpenTelemetry**         | Distributed tracing standard        |
| **Application Insights**  | Azure's APM service (stores traces) |
| **Agent Dashboard**       | Foundry portal visualization        |
| **Continuous Evaluation** | Automated quality scoring           |

### Built-in Evaluators

| Evaluator        | Measures                              |
| ---------------- | ------------------------------------- |
| **Relevance**    | Response relevance to the query       |
| **Groundedness** | Factual grounding in provided context |
| **Coherence**    | Logical consistency and flow          |
| **Safety**       | Harmful content detection             |
| **F1 Score**     | Token overlap with ground truth       |
| **BLEU**         | N-gram precision vs reference         |
| **ROUGE**        | Recall-oriented text overlap          |

### Evaluation API

```python
# Create evaluation dataset
dataset = client.evaluations.create_dataset(
    name="test-scenarios",
    data=[{"query": "What is X?", "expected": "X is..."}]
)

# Run evaluation
evaluation = client.evaluations.create(
    dataset_id=dataset.id,
    agent_id=agent.id,
    evaluators=["relevance", "groundedness", "coherence"]
)

# Get results
results = client.evaluations.get(evaluation.id)
```

### Comparison Evaluations

Run the same dataset against multiple agent versions to compare performance.

---

## Publishing Channels

Agents built in Foundry can be published to multiple surfaces:

| Channel              | Description                           | Configuration                           |
| -------------------- | ------------------------------------- | --------------------------------------- |
| **M365 Copilot**     | Appears in Microsoft 365 Copilot chat | Entra app registration + Teams manifest |
| **Teams**            | Teams chatbot (personal or channel)   | Teams app package                       |
| **BizChat**          | Microsoft Business Chat               | Via M365 Copilot publish                |
| **Web Preview**      | Browser-based chat widget             | Auto-generated URL                      |
| **REST API**         | Programmatic access                   | Standard Foundry endpoint               |
| **Hosted Container** | Self-contained deployable service     | Docker + azd deploy                     |

### Publishing to M365 Copilot Flow

1. Build & test agent in Foundry playground
2. Navigate to **Publish** → **M365 Copilot**
3. Configure Teams app manifest (name, description, icon)
4. Submit for admin approval
5. Agent appears in M365 Copilot sidebar

---

## VS Code Extension

**Extension ID**: `TeamsDevApp.vscode-ai-foundry`

### Features

| Feature                    | Description                                                 |
| -------------------------- | ----------------------------------------------------------- |
| **Project Management**     | Create/open Foundry projects, set default project           |
| **Model Catalog**          | Browse 1,000+ models, deploy directly from VS Code          |
| **Model Playground**       | Test models with chat interface inside VS Code              |
| **Agent Designer**         | Create agents with YAML definitions                         |
| **Tool Configuration**     | Add Bing, File Search, Code Interpreter, OpenAPI, MCP tools |
| **Agent Deployment**       | Deploy agents to Foundry from VS Code                       |
| **Agent Playground**       | Test agents in VS Code with conversation UI                 |
| **Thread Explorer**        | Browse conversation threads and runs                        |
| **Sample Code Generation** | Generate Python/C#/JS code for any agent                    |
| **Declarative Workflows**  | YAML-based multi-step agent workflows                       |
| **Hosted Agent Dev**       | Create, run, and deploy hosted agents                       |
| **Local Visualizer**       | OpenTelemetry trace visualization                           |
| **Foundry MCP Server**     | Integrate cloud MCP tools                                   |

### Agent YAML Format

```yaml
name: my-agent
model: gpt-4.1-mini
instructions: |
  You are a helpful assistant specialized in...
tools:
  - type: bing_grounding
    connection: bing-connection-name
  - type: file_search
    vector_store_ids:
      - vs_abc123
  - type: code_interpreter
  - type: mcp
    server_url: https://my-mcp.com
    server_label: My MCP Server
```

### Sample Code Generation

The extension generates starter code in Python, C#, or JavaScript with:
- Agent creation
- Tool configuration
- Conversation management
- Authentication (key-based or keyless)

---

## Foundry MCP Server

A **cloud-hosted MCP server** provided by Microsoft for managing Foundry resources.

### Connection

| Property | Value                               |
| -------- | ----------------------------------- |
| **URL**  | `https://mcp.ai.azure.com`          |
| **Auth** | Entra ID (Microsoft account)        |
| **Type** | Remote MCP server (streamable HTTP) |

### Installation

Add to VS Code settings (user or workspace):

```json
{
    "mcp": {
        "servers": {
            "azure-ai-foundry": {
                "type": "http",
                "url": "https://mcp.ai.azure.com",
                "headers": {}
            }
        }
    }
}
```

### Available Tools (26+)

| Category                        | Tools                                                                                      |
| ------------------------------- | ------------------------------------------------------------------------------------------ |
| **Dataset Management**          | Create dataset, Get dataset details                                                        |
| **Evaluation Operations**       | Create evaluation, Get evaluation, Create comparison evaluation, Get comparison evaluation |
| **Model Catalog**               | Search model catalog, Get model details                                                    |
| **Deployment Management**       | List deployments, Create deployment, Delete deployment, Get deployment details             |
| **Analytics & Recommendations** | Get model upgrade recommendations, Get model replacement recommendations                   |
| **Monitoring**                  | Get model monitoring metrics                                                               |
| **Deprecation**                 | Get model deprecation details                                                              |
| **Quota**                       | List quota information                                                                     |

### Use Cases

- Manage Foundry resources from any MCP-compatible client (VS Code, Claude, etc.)
- Automate model deployment and management
- Monitor and optimize model usage
- Run evaluations from AI assistants

---

## SDKs

### Four SDK Types

| SDK                    | Endpoint                                                          | Purpose                                              |
| ---------------------- | ----------------------------------------------------------------- | ---------------------------------------------------- |
| **Foundry SDK**        | `https://<resource>.services.ai.azure.com/api/projects/<project>` | Full project management (agents, evals, deployments) |
| **OpenAI SDK**         | `https://<resource>.openai.azure.com/openai/v1`                   | Chat completions, embeddings (OpenAI-compatible)     |
| **Foundry Tools SDKs** | Service-specific                                                  | Speech, Vision, Language, etc.                       |
| **Agent Framework**    | Framework-specific                                                | Multi-agent orchestration (cloud-agnostic)           |

### Language Support

| Language          | Foundry SDK                             | OpenAI SDK        | Agent Framework                       |
| ----------------- | --------------------------------------- | ----------------- | ------------------------------------- |
| **Python**        | `azure-ai-projects>=2.0.0b3`            | `openai`          | `azure-ai-agentserver-agentframework` |
| **C#**            | `Azure.AI.Projects` (preview)           | `Azure.AI.OpenAI` | `Azure.AI.AgentServer`                |
| **JavaScript/TS** | `@azure/ai-projects` (beta)             | `openai`          | —                                     |
| **Java**          | `com.azure:azure-ai-projects` (preview) | —                 | —                                     |
| **REST**          | Direct HTTP                             | Direct HTTP       | —                                     |

### Important SDK Version Note

> **⚠️ Breaking Change**: Python SDK 2.x preview (`azure-ai-projects>=2.0.0b3`) is **incompatible** with 1.x GA. Install with `pip install azure-ai-projects --pre`. The 2.x SDK uses Foundry endpoints (`.services.ai.azure.com`), while 1.x used Azure AI Project endpoints.

---

## Foundry Tools SDKs

Specialized SDKs for specific AI services running on the Foundry platform:

| Service                   | Capabilities                                                                   | Quickstart Languages |
| ------------------------- | ------------------------------------------------------------------------------ | -------------------- |
| **Speech**                | Speech-to-text, text-to-speech, speech translation, speaker recognition        | Python, C#, JS, Java |
| **Language**              | NER, PII detection, sentiment analysis, summarization, key phrase extraction   | Python, C#, JS, Java |
| **Translator**            | Text translation (100+ languages), document translation, transliteration       | Python, C#, JS, Java |
| **Azure AI Search**       | Agentic retrieval, RAG integration, semantic + vector search                   | Python, C#, JS, Java |
| **Content Safety**        | Text/image moderation, prompt shields, protected material detection            | Python, C#, JS, Java |
| **Document Intelligence** | Document parsing, form extraction, layout analysis, receipt/invoice processing | Python, C#, JS, Java |
| **Vision**                | Image analysis, object detection, face detection, OCR                          | Python, C#, JS, Java |

### Integration Pattern

These services can be used:
1. **Standalone** — Direct SDK calls for specific capabilities
2. **As Agent Tools** — Registered in agent tool definitions
3. **Via Tool Catalog** — Pre-configured in Foundry portal
4. **Through MCP** — Wrapped as MCP tools for universal access

---

## Solution Templates

13 pre-built accelerators for common enterprise AI scenarios:

| #   | Template                 | Description                          |
| --- | ------------------------ | ------------------------------------ |
| 1   | **AI Chat**              | Conversational AI with RAG           |
| 2   | **AI Agents**            | Multi-tool autonomous agents         |
| 3   | **Data Unification**     | Cross-source data integration        |
| 4   | **Release Manager**      | Automated release workflows          |
| 5   | **Voice Call Center**    | Speech-to-speech customer service    |
| 6   | **Conversation Mining**  | Analyze conversation transcripts     |
| 7   | **Workflow Automation**  | Business process automation          |
| 8   | **Content Processing**   | Document understanding + extraction  |
| 9   | **Document Generation**  | Templated document creation          |
| 10  | **Meeting Enhancement**  | Meeting summarization + action items |
| 11  | **Code Modernization**   | Legacy code analysis + migration     |
| 12  | **Conversational Agent** | Customer-facing interactive agent    |
| 13  | **SharePoint Retrieval** | Enterprise document Q&A              |

---

## Declarative Agent Workflows

YAML-based multi-step agent workflows with visual editing.

### Workflow Definition (YAML)

```yaml
name: research-workflow
steps:
  - name: gather-info
    agent: researcher
    instructions: "Search for information about {topic}"
    tools: [bing_grounding]
  - name: analyze
    agent: analyst
    instructions: "Analyze the gathered information"
    depends_on: [gather-info]
  - name: summarize
    agent: writer
    instructions: "Write a summary based on the analysis"
    depends_on: [analyze]
```

### Development Options

| Option                      | Description                                          |
| --------------------------- | ---------------------------------------------------- |
| **Portal Visual Editor**    | Drag-and-drop workflow designer                      |
| **YAML File**               | Hand-written declarative definitions                 |
| **Copilot Code Generation** | Describe workflow → Copilot generates Python/C#/YAML |
| **VS Code Extension**       | Edit YAML with IntelliSense + local visualizer       |

### Code Generation from Workflows

Describe a workflow in natural language → Copilot generates:
- **Python** implementation using Agent Framework
- **C#** implementation using Azure.AI.Projects
- **YAML** declarative workflow definition

---

## Enterprise Features

### AI Gateway

| Feature               | Description                              |
| --------------------- | ---------------------------------------- |
| **Routing**           | Route requests across model deployments  |
| **Rate Limiting**     | Per-user/per-app token limits            |
| **Failover**          | Automatic fallback to backup deployments |
| **Content Filtering** | Configurable safety filters              |
| **Logging**           | Full request/response audit trail        |

### Azure Policy Integration

| Policy Type          | Examples                              |
| -------------------- | ------------------------------------- |
| **Model Governance** | Restrict which models can be deployed |
| **Data Residency**   | Enforce region requirements           |
| **Cost Controls**    | Maximum quota per project             |
| **Safety Standards** | Minimum content filtering levels      |

### Fleet Management ("Operate" Section)

Centralized management of all AI assets:
- Model deployments across projects
- Agent inventory and health
- Tool catalog administration
- Usage analytics and cost allocation
- Deprecation tracking and upgrade recommendations

---

## Authentication & RBAC

### Authentication Pattern

```python
from azure.identity import DefaultAzureCredential

# Keyless authentication (recommended)
credential = DefaultAzureCredential()
client = AIProjectClient(endpoint=endpoint, credential=credential)
```

### RBAC Roles

| Role               | Scope               | Purpose                               |
| ------------------ | ------------------- | ------------------------------------- |
| **Azure AI User**  | Least privilege     | Call agents, use models               |
| **Azure AI Owner** | Full access         | Create/manage agents, deploy models   |
| **Contributor**    | Resource management | Create Foundry projects and resources |

### MCP Authentication

Foundry supports authentication for MCP and A2A protocol connections:
- **Entra ID** — Azure AD token-based auth
- **API Key** — Static key authentication
- **OAuth 2.0** — Standard OAuth flows

---

## Quick Reference

### Project Setup (CLI)

```bash
# Create resource group
az group create --name my-rg --location eastus2

# Create Foundry resource
az cognitiveservices account create \
    --name my-foundry \
    --resource-group my-rg \
    --kind AIServices \
    --sku S0 \
    --location eastus2 \
    --custom-domain my-foundry

# Get endpoint
az cognitiveservices account show \
    --name my-foundry \
    --resource-group my-rg \
    --query "properties.endpoint"
```

### Agent Quickstart (Python)

```bash
pip install azure-ai-projects --pre azure-identity
```

```python
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential

client = AIProjectClient(
    endpoint="https://my-foundry.services.ai.azure.com/api/projects/my-project",
    credential=DefaultAzureCredential()
)

# Create agent
agent = client.agents.create_agent(
    model="gpt-4.1-mini",
    name="alex-agent",
    instructions="You are Alex, a cognitive learning partner."
)

# Create conversation
conversation = client.agents.create_conversation(agent_id=agent.id)

# Send message
client.agents.create_message(
    conversation_id=conversation.id,
    role="user",
    content="Hello Alex!"
)

# Get response
run = client.agents.create_run(
    conversation_id=conversation.id,
    agent_id=agent.id
)
```

### Agent Quickstart (C#)

```csharp
using Azure.AI.Projects;
using Azure.Identity;

var client = new AIProjectClient(
    new Uri(endpoint),
    new DefaultAzureCredential()
);

var agent = await client.Agents.CreateAgentAsync(
    model: "gpt-4.1-mini",
    name: "alex-agent",
    instructions: "You are Alex, a cognitive learning partner."
);
```

### Agent Quickstart (TypeScript)

```typescript
import { AIProjectClient } from "@azure/ai-projects";
import { DefaultAzureCredential } from "@azure/identity";

const client = new AIProjectClient(endpoint, new DefaultAzureCredential());

const agent = await client.agents.createAgent({
    model: "gpt-4.1-mini",
    name: "alex-agent",
    instructions: "You are Alex, a cognitive learning partner."
});
```

### Whisper Transcription

```python
result = openai_client.audio.transcriptions.create(
    file=open("audio.mp3", "rb"),
    model="whisper-1"
)
print(result.text)
```

> **Limit**: 25MB per file. For larger files, use Batch Transcription API.

---

## Capability Availability Matrix

| Capability                |  GA   | Preview | Planned |
| ------------------------- | :---: | :-----: | :-----: |
| Agent Service (basic)     |   ✅   |         |         |
| Agent Versioning          |       |    ✅    |         |
| Conversations API         |       |    ✅    |         |
| Hosted Agents             |       |    ✅    |         |
| Memory                    |       |    ✅    |         |
| Foundry IQ                |       |    ✅    |         |
| Multi-Agent Orchestration |       |    ✅    |         |
| Tool Catalog              |       |    ✅    |         |
| MCP Protocol Support      |       |    ✅    |         |
| A2A Protocol              |       |    ✅    |         |
| Realtime API              |   ✅   |         |         |
| Observability             |   ✅   |         |         |
| Evaluation Framework      |       |    ✅    |         |
| Publishing (M365/Teams)   |       |    ✅    |         |
| VS Code Extension         |       |    ✅    |         |
| Foundry MCP Server        |       |    ✅    |         |
| AI Gateway                |   ✅   |         |         |
| Azure Policy              |   ✅   |         |         |
| Fleet Management          |       |    ✅    |         |

---

## Alex-Specific Relevance Summary

| Foundry Capability    | Alex Mapping                          | Priority |
| --------------------- | ------------------------------------- | -------- |
| Agent Service         | Core runtime for cloud Alex           | Critical |
| Agent Versioning      | Immutable agent snapshots per release | High     |
| Conversations API     | Multi-turn Alex sessions              | Critical |
| Hosted Agents         | Alex as containerized service         | Medium   |
| Memory                | Replace manual synapses               | High     |
| Foundry IQ            | Skills + global knowledge grounding   | High     |
| Tool Catalog          | Extended tool access (1,400+)         | Medium   |
| MCP Support           | Reuse existing VS Code MCP servers    | High     |
| Realtime API          | Voice Alex (speech-to-speech)         | Medium   |
| Observability         | Automated dream analytics             | High     |
| Evaluation            | Quality regression testing            | Medium   |
| Publishing            | Multi-surface Alex deployment         | High     |
| VS Code Extension     | Agent development workflow            | High     |
| Foundry MCP Server    | Manage Foundry from VS Code           | Medium   |
| Declarative Workflows | Define agent orchestration as YAML    | Medium   |
| Solution Templates    | Accelerators for specific use cases   | Low      |

---

*Microsoft Foundry Capabilities Digest — Last updated February 2026*
