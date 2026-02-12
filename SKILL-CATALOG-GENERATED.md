# Alex Skills Catalog (Generated)

> Generated: 2026-02-12
> Total Skills: **102** (92 inheritable, 4 master-only, 1 universal, 3 VS Code, 2 M365)
> ⚠️ **Note**: This catalog is a simplified network diagram. See SKILLS-CATALOG.md for complete inventory.
> 🎉 **+12 skills promoted from sandbox heir** (frustration-recognition, coaching-techniques, deep-work-optimization, executive-storytelling, slide-design, academic-paper-drafting, literature-review, citation-management, dissertation-defense, azure-architecture-patterns, azure-devops-automation, airs-integration)
> 🆕 **+1 meta-skill**: skill-building (guides heirs in creating promotable skills)
> 🆕 **+1 growth skill**: skill-development (track wishlist, contextual skill acquisition)
> 🆕 **+6 domain skills**: bicep-avm-mastery, database-design, microsoft-graph-api, multi-agent-orchestration, observability-monitoring, performance-profiling

---

## Network Diagram

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'lineColor': '#666', 'primaryColor': '#e8f4f8', 'primaryBorderColor': '#0969da'}}}%%
flowchart LR
    subgraph Cognitive["🧠 Cognitive"]
        AR[appropriate-reliance]
        BL[bootstrap-learning]
        CL[cognitive-load]
        GK[global-knowledge]
        GKS[global-knowledge-sync]
        KS[knowledge-synthesis]
        LP[learning-psychology]
        M[meditation]
        MF[meditation-facilitation]
    end
    subgraph Empathy["💚 Empathy & Coaching"]
        FR[frustration-recognition]
        CT[coaching-techniques]
        PA[proactive-assistance]
    end
    subgraph Research["📚 Academic Research"]
        APD[academic-paper-drafting]
        LR[literature-review]
        CM[citation-management]
        DD[dissertation-defense]
        AI[airs-integration]
    end
    subgraph Productivity["⚡ Productivity"]
        DW[deep-work-optimization]
        ES[executive-storytelling]
        SD[slide-design]
    end
    subgraph Architecture["🏗️ Architecture"]
        AH[architecture-health]
        ARF[architecture-refinement]
        HC[heir-curation]
        SA[self-actualization]
        SCG[skill-catalog-generator]
        SB[skill-building]
        SDV[skill-development]
    end
    subgraph Documentation["📝 Documentation"]
        AAA[ascii-art-alignment]
        LCM[lint-clean-markdown]
        LMS[llm-model-selection]
        MM[markdown-mermaid]
        WP[writing-publication]
    end
    subgraph Vscode["💻 Vscode"]
        CPP[chat-participant-patterns]
        EI[enterprise-integration]
        VEP[vscode-extension-patterns]
    end
    subgraph Engineering["🔧 Engineering"]
        CR[code-review]
        DP[debugging-patterns]
        GW[git-workflow]
        PS[project-scaffolding]
        RP[refactoring-patterns]
        TS[testing-strategies]
        VE[vscode-environment]
    end
    subgraph Azure["☁️ Azure"]
        AAP[azure-architecture-patterns]
        ADA[azure-devops-automation]
    end
    subgraph Data["📊 Data & Fabric"]
        FNP[fabric-notebook-publish]
        MFB[microsoft-fabric]
    end
    subgraph Accessibility["🔊 Accessibility"]
        TTS[text-to-speech]
    end
    subgraph Operations["🚨 Operations"]
        ERP[error-recovery-patterns]
        IR[incident-response]
        RPF[release-preflight]
        RCA[root-cause-analysis]
        SM[scope-management]
        SR[status-reporting]
    end
    subgraph Visual["🎨 Visual"]
        IH[image-handling]
        SG[svg-graphics]
    end
    subgraph M365["☁️ M365"]
        MAD[m365-agent-debugging]
        TAP[teams-app-patterns]
    end
    subgraph Security["🔐 Security"]
        MS[microsoft-sfi]
        PRA[privacy-responsible-ai]
    end

    %% Connections - Original
    AR --> LP & MM & LCM
    AH --> SA & ARF
    AH -.-> MF
    AAA --> MM & LCM & WP
    BL --> LP & CL & AR
    BL -.-> KS
    CPP --> VEP & LMS & CL
    CR --> TS & GW
    CR -.-> RP
    CL --> LP & AR
    DP --> GW & VEP
    ERP --> DP & IR & TS
    GW --> RP
    GK --> KS & BL
    GK -.-> MF
    HC --> VEP & MAD & RPF
    HC -.-> ARF
    IH --> SG & PS & VEP
    IR -.-> RCA
    IR --> ERP & DP
    KS --> MF & LP
    LP --> AR
    LCM --> MM & ARF & WP
    LMS --> AR & ARF
    MAD --> HC
    MM --> WP & LCM
    M --> MF & SA & AH
    M -.-> KS

    %% New skill connections (promoted from heir)
    FR --> CT & CL & LP
    FR -.-> AR
    CT --> FR & LP & ES
    APD --> LR & CM & WP & DD
    LR --> APD & CM
    CM --> APD & LR
    DD --> APD & ES & SD
    DD -.-> CT
    AI --> AR & LP & DD
    DW --> CL & FR
    ES --> SD & DD & CT
    SD --> ES & MM
    AAP --> ADA & MS
    ADA --> AAP & GW
    MF --> LP & CL & KS
    MS --> PRA & IR
    MS -.-> CR
    PRA --> MS & IR
    PRA -.-> CR
    PS --> MM & SG & LCM & GW
    RP --> TS & DP & CR & GW & BT & VEP & MAD
    RCA --> DP & IR
    RCA -.-> ERP
    SA --> AH & MF & KS
    SA -.-> ARF
    SB --> BL & HC & SCG
    SB -.-> KS & ARF
    SDV --> SB & BL & SA & M
    SDV -.-> FR & CT & CL
    PA --> FR & CL & SR & SM
    PA -.-> ES
    SR --> PA & SM & ES
    SR -.-> GW
    SM --> PA & SR & RCA
    SM -.-> CT
    SCG --> MM & AH & KS
    SCG -.-> LP & PS
    SG --> PS & IH & MM
    SG -.-> AAA
    TAP --> MAD & RPF
    TS --> DP & RP & CR
    VE --> PS & VEP & GW & DP
    VEP --> HC
    WP --> MM
    WP -.-> LCM & ARF

    %% Styling
    classDef master fill:#fff3cd,stroke:#856404
    classDef vscode fill:#e1f0ff,stroke:#0969da
    classDef m365 fill:#e6f4ea,stroke:#1a7f37
    classDef inheritable fill:#e0f7fa,stroke:#00838f
    classDef newskill fill:#d4edda,stroke:#28a745,stroke-width:2px
    classDef stale stroke-dasharray:5 5,stroke-width:2px

    class AR,GK,HC,KS,LMS,M,MF,SA master
    class CPP,VEP vscode
    class MAD,TAP m365
    class AR,AH,AAA,BL,CR,CL,DP,ERP,GW,IH,IR,LP,LCM,MM,MS,PRA,PS,RP,RCA,SCG,SG,TS,VE,WP,AAP,ADA inheritable
    class FR,CT,APD,LR,CM,DD,AI,DW,ES,SD,SDV,PA,SR,SM newskill
    class CPP,GW,LMS,MAD,MS,PRA,TAP,VEP stale
```

---

## Legend

| Color           | Inheritance              |
| --------------- | ------------------------ |
| 🟨 Yellow        | Master-only              |
| 🟦 Blue          | VS Code heir             |
| 🟩 Green         | M365 heir                |
| 💚 Green (solid) | NEW (promoted from heir) |
| 🧊 Cyan          | Inheritable              |

| Arrow  | Meaning                  |
| ------ | ------------------------ |
| `<-->` | Bidirectional (mutual)   |
| `-->`  | Strong connection (≥0.7) |
| `-.->` | Weak connection (<0.7)   |

---

## Skills in Network Diagram

> Skills shown below are those with synaptic connections. For complete 102-skill inventory, see SKILLS-CATALOG.md.

### 💚 NEW - Promoted from Heir (13)

| Skill                       | Category     | Connections |
| --------------------------- | ------------ | ----------- |
| frustration-recognition     | Empathy      | 4           |
| coaching-techniques         | Empathy      | 3           |
| academic-paper-drafting     | Research     | 4           |
| literature-review           | Research     | 2           |
| citation-management         | Research     | 2           |
| dissertation-defense        | Research     | 4           |
| airs-integration            | Research     | 3           |
| deep-work-optimization      | Productivity | 2           |
| executive-storytelling      | Productivity | 3           |
| slide-design                | Productivity | 2           |
| azure-architecture-patterns | Azure        | 2           |
| azure-devops-automation     | Azure        | 2           |
| skill-development           | Architecture | 7           |

### 🧊 Inheritable (29 shown)

| Skill                   | Connections |
| ----------------------- | ----------- |
| appropriate-reliance    | 4           |
| architecture-health     | 3           |
| ascii-art-alignment     | 3           |
| bootstrap-learning      | 4           |
| code-review             | 3           |
| cognitive-load          | 3           |
| debugging-patterns      | 2           |
| error-recovery-patterns | 3           |
| fabric-notebook-publish | 4           |
| git-workflow            | 2           |
| global-knowledge-sync   | 3           |
| image-handling          | 3           |
| incident-response       | 3           |
| learning-psychology     | 3           |
| lint-clean-markdown     | 3           |
| markdown-mermaid        | 2           |
| microsoft-fabric        | 5           |
| microsoft-sfi           | 4           |
| privacy-responsible-ai  | 3           |
| project-scaffolding     | 4           |
| refactoring-patterns    | 3           |
| release-preflight       | 5           |
| root-cause-analysis     | 3           |
| skill-catalog-generator | 5           |
| svg-graphics            | 4           |
| testing-strategies      | 3           |
| text-to-speech          | 6           |
| vscode-environment      | 4           |
| writing-publication     | 3           |

### 🟨 Master-Only (8 shown)

| Skill                   | Connections |
| ----------------------- | ----------- |
| architecture-refinement | 5           |
| global-knowledge        | 3           |
| heir-curation           | 4           |
| knowledge-synthesis     | 3           |
| llm-model-selection     | 2           |
| meditation              | 4           |
| meditation-facilitation | 4           |
| self-actualization      | 4           |

### 🟦 VS Code Heir (2)

| Skill                     | Connections |
| ------------------------- | ----------- |
| chat-participant-patterns | 3           |
| vscode-extension-patterns | 2           |

### 🟩 M365 Heir (2)

| Skill                | Connections |
| -------------------- | ----------- |
| m365-agent-debugging | 1           |
| teams-app-patterns   | 2           |

---

## Staleness-Prone Skills

| Skill                     | Reason                          |
| ------------------------- | ------------------------------- |
| vscode-extension-patterns | Platform/API changes frequently |
| chat-participant-patterns | Platform/API changes frequently |
| m365-agent-debugging      | Platform/API changes frequently |
| teams-app-patterns        | Platform/API changes frequently |
| llm-model-selection       | Platform/API changes frequently |
| git-workflow              | Platform/API changes frequently |
| privacy-responsible-ai    | Platform/API changes frequently |
| microsoft-sfi             | Platform/API changes frequently |

---

*Generated by Alex: Generate Skill Catalog command*
