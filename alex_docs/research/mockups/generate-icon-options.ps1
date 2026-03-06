# Generate Command Center Icon Options (3 per position, 90 total)
# Run from repo root: .\alex_docs\research\mockups\generate-icon-options.ps1

$base = "$PSScriptRoot\icons"

# Create directories
foreach ($dir in @("tabs", "states", "agents", "personas", "default")) {
    New-Item -Path "$base\$dir" -ItemType Directory -Force | Out-Null
}

function Save-Svg([string]$Path, [string]$C1, [string]$C2, [string]$Bg, [string]$Sym) {
    $svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="64" height="64">' +
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="' + $C1 + '"/>' +
    '<stop offset="1" stop-color="' + $C2 + '"/>' +
    '</linearGradient></defs>' +
    $Bg + '<g fill="white">' + $Sym + '</g></svg>'
    [System.IO.File]::WriteAllText($Path, $svg)
}

# Container shapes
$circ = '<circle cx="24" cy="24" r="22" fill="url(#g)"/>'
$rect = '<rect x="2" y="2" width="44" height="44" rx="10" fill="url(#g)"/>'
$hex = '<path d="M24 2L44 13V35L24 46L4 35V13Z" fill="url(#g)"/>'
$sq = '<rect x="2" y="2" width="44" height="44" rx="16" fill="url(#g)"/>'

# ============================================================
# TAB ICONS (indigo, rounded rect container)
# ============================================================
$tc1 = "#6366f1"; $tc2 = "#818cf8"

# Mission Control
Save-Svg "$base\tabs\mission-a.svg" $tc1 $tc2 $rect '<rect x="14" y="17" width="20" height="3" rx="1.5"/><rect x="14" y="23" width="14" height="3" rx="1.5"/><rect x="14" y="29" width="8" height="3" rx="1.5"/>'
Save-Svg "$base\tabs\mission-b.svg" $tc1 $tc2 $rect '<path d="M14 30A14 14 0 0 1 34 30" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"/><line x1="24" y1="30" x2="29" y2="18" stroke="white" stroke-width="2.5" stroke-linecap="round"/><circle cx="24" cy="30" r="2"/>'
Save-Svg "$base\tabs\mission-c.svg" $tc1 $tc2 $rect '<polyline points="12,24 17,24 20,16 24,32 28,24 36,24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>'

# Agents
Save-Svg "$base\tabs\agents-a.svg" $tc1 $tc2 $rect '<circle cx="24" cy="17" r="5"/><path d="M14 34a10 10 0 0 1 20 0"/>'
Save-Svg "$base\tabs\agents-b.svg" $tc1 $tc2 $rect '<circle cx="19" cy="17" r="4"/><path d="M11 32a8 8 0 0 1 16 0"/><circle cx="30" cy="19" r="3.5"/><path d="M23 32a7 7 0 0 1 14 0"/>'
Save-Svg "$base\tabs\agents-c.svg" $tc1 $tc2 $rect '<circle cx="24" cy="14" r="3.5"/><circle cx="15" cy="30" r="3.5"/><circle cx="33" cy="30" r="3.5"/><line x1="24" y1="17.5" x2="15" y2="26.5" stroke="white" stroke-width="1.5"/><line x1="24" y1="17.5" x2="33" y2="26.5" stroke="white" stroke-width="1.5"/><line x1="18.5" y1="30" x2="29.5" y2="30" stroke="white" stroke-width="1.5"/>'

# Skill Store
Save-Svg "$base\tabs\skills-a.svg" $tc1 $tc2 $rect '<rect x="13" y="13" width="9" height="9" rx="2"/><rect x="26" y="13" width="9" height="9" rx="2"/><rect x="13" y="26" width="9" height="9" rx="2"/><rect x="26" y="26" width="9" height="9" rx="2"/>'
Save-Svg "$base\tabs\skills-b.svg" $tc1 $tc2 $rect '<path d="M26 12L18 26h8l-4 12 12-16h-8z"/>'
Save-Svg "$base\tabs\skills-c.svg" $tc1 $tc2 $rect '<path d="M24 12l3.5 7h7.5l-6 5 2 7.5-7-4.5-7 4.5 2-7.5-6-5h7.5z"/>'

# Mind
Save-Svg "$base\tabs\mind-a.svg" $tc1 $tc2 $rect '<path d="M24 14c-6 0-10 4-10 10s4 10 10 10" fill="none" stroke="white" stroke-width="2.5"/><path d="M24 14c6 0 10 4 10 10s-4 10-10 10" fill="none" stroke="white" stroke-width="2.5"/><line x1="24" y1="15" x2="24" y2="33" stroke="white" stroke-width="1.5"/>'
Save-Svg "$base\tabs\mind-b.svg" $tc1 $tc2 $rect '<circle cx="24" cy="24" r="3"/><ellipse cx="24" cy="24" rx="12" ry="5" fill="none" stroke="white" stroke-width="1.5" transform="rotate(30 24 24)"/><ellipse cx="24" cy="24" rx="12" ry="5" fill="none" stroke="white" stroke-width="1.5" transform="rotate(-30 24 24)"/>'
Save-Svg "$base\tabs\mind-c.svg" $tc1 $tc2 $rect '<circle cx="24" cy="24" r="10" fill="none" stroke="white" stroke-width="2"/><circle cx="24" cy="24" r="4" fill="none" stroke="white" stroke-width="2"/><circle cx="24" cy="24" r="1.5"/>'

# Docs
Save-Svg "$base\tabs\docs-a.svg" $tc1 $tc2 $rect '<rect x="15" y="12" width="18" height="24" rx="2" fill="none" stroke="white" stroke-width="2"/><line x1="19" y1="19" x2="29" y2="19" stroke="white" stroke-width="1.5"/><line x1="19" y1="24" x2="29" y2="24" stroke="white" stroke-width="1.5"/><line x1="19" y1="29" x2="25" y2="29" stroke="white" stroke-width="1.5"/>'
Save-Svg "$base\tabs\docs-b.svg" $tc1 $tc2 $rect '<path d="M24 15v18M12 17c4-2 8-2 12 0v18c-4-2-8-2-12 0z" fill="none" stroke="white" stroke-width="2"/><path d="M24 15c4-2 8-2 12 0v18c-4-2-8-2-12 0" fill="none" stroke="white" stroke-width="2"/>'
Save-Svg "$base\tabs\docs-c.svg" $tc1 $tc2 $rect '<path d="M16 12h16v26l-8-6-8 6z" fill="none" stroke="white" stroke-width="2.5"/>'

# ============================================================
# COGNITIVE STATE ICONS (circle container, state-specific colors)
# ============================================================

# Building (indigo)
Save-Svg "$base\states\building-a.svg" "#6366f1" "#818cf8" $circ '<path d="M24 14v18M17 21l7-7 7 7" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'
Save-Svg "$base\states\building-b.svg" "#6366f1" "#818cf8" $circ '<path d="M24 14l10 20H14z"/>'
Save-Svg "$base\states\building-c.svg" "#6366f1" "#818cf8" $circ '<rect x="21" y="14" width="6" height="20" rx="1"/><rect x="14" y="21" width="20" height="6" rx="1"/>'

# Debugging (red)
Save-Svg "$base\states\debugging-a.svg" "#ef4444" "#fca5a5" $circ '<circle cx="24" cy="24" r="8" fill="none" stroke="white" stroke-width="2"/><path d="M20 20l8 8M28 20l-8 8" stroke="white" stroke-width="2.5" stroke-linecap="round"/>'
Save-Svg "$base\states\debugging-b.svg" "#ef4444" "#fca5a5" $circ '<rect x="21" y="13" width="6" height="14" rx="3"/><circle cx="24" cy="33" r="3"/>'
Save-Svg "$base\states\debugging-c.svg" "#ef4444" "#fca5a5" $circ '<ellipse cx="24" cy="23" rx="6" ry="8"/><line x1="18" y1="19" x2="14" y2="15" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="30" y1="19" x2="34" y2="15" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="17" y1="24" x2="13" y2="24" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="31" y1="24" x2="35" y2="24" stroke="white" stroke-width="2" stroke-linecap="round"/>'

# Planning (blue)
Save-Svg "$base\states\planning-a.svg" "#3b82f6" "#93c5fd" $circ '<path d="M24 12l12 12-12 12-12-12z" fill="none" stroke="white" stroke-width="2.5"/>'
Save-Svg "$base\states\planning-b.svg" "#3b82f6" "#93c5fd" $circ '<rect x="14" y="16" width="20" height="3" rx="1.5"/><rect x="14" y="23" width="20" height="3" rx="1.5"/><rect x="14" y="30" width="12" height="3" rx="1.5"/>'
Save-Svg "$base\states\planning-c.svg" "#3b82f6" "#93c5fd" $circ '<path d="M24 34V24M24 24L16 14M24 24L32 14" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>'

# Reviewing (teal)
Save-Svg "$base\states\reviewing-a.svg" "#14b8a6" "#5eead4" $circ '<path d="M14 24l7 7 13-14" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'
Save-Svg "$base\states\reviewing-b.svg" "#14b8a6" "#5eead4" $circ '<path d="M10 24c4-7 9-10 14-10s10 3 14 10c-4 7-9 10-14 10S14 31 10 24z" fill="none" stroke="white" stroke-width="2"/><circle cx="24" cy="24" r="4"/>'
Save-Svg "$base\states\reviewing-c.svg" "#14b8a6" "#5eead4" $circ '<circle cx="21" cy="22" r="8" fill="none" stroke="white" stroke-width="2.5"/><line x1="27" y1="28" x2="34" y2="35" stroke="white" stroke-width="2.5" stroke-linecap="round"/>'

# Learning (green)
Save-Svg "$base\states\learning-a.svg" "#22c55e" "#86efac" $circ '<path d="M24 15v17M13 17c4-2 7-2 11 0v17c-4-2-7-2-11 0z" fill="none" stroke="white" stroke-width="2"/><path d="M24 15c4-2 7-2 11 0v17c-4-2-7-2-11 0" fill="none" stroke="white" stroke-width="2"/>'
Save-Svg "$base\states\learning-b.svg" "#22c55e" "#86efac" $circ '<circle cx="24" cy="20" r="7" fill="none" stroke="white" stroke-width="2.5"/><line x1="24" y1="27" x2="24" y2="34" stroke="white" stroke-width="2.5" stroke-linecap="round"/><line x1="20" y1="34" x2="28" y2="34" stroke="white" stroke-width="2"/>'
Save-Svg "$base\states\learning-c.svg" "#22c55e" "#86efac" $circ '<path d="M10 22l14-6 14 6-14 6z"/><path d="M16 25v7c4 2 12 2 16 0v-7" fill="none" stroke="white" stroke-width="2"/>'

# Teaching (amber)
Save-Svg "$base\states\teaching-a.svg" "#f59e0b" "#fcd34d" $circ '<path d="M14 20h4l12-6v20l-12-6h-4z"/>'
Save-Svg "$base\states\teaching-b.svg" "#f59e0b" "#fcd34d" $circ '<circle cx="24" cy="16" r="4"/><rect x="18" y="24" width="12" height="12" rx="2" fill="none" stroke="white" stroke-width="2"/>'
Save-Svg "$base\states\teaching-c.svg" "#f59e0b" "#fcd34d" $circ '<circle cx="24" cy="24" r="4"/><path d="M16 16a12 12 0 0 1 16 0" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"/><path d="M12 12a17 17 0 0 1 24 0" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"/>'

# Meditation (emerald)
Save-Svg "$base\states\meditation-a.svg" "#10b981" "#6ee7b7" $circ '<path d="M16 30Q16 18 24 14Q32 18 32 30" fill="none" stroke="white" stroke-width="2.5"/><line x1="24" y1="14" x2="24" y2="34" stroke="white" stroke-width="2"/>'
Save-Svg "$base\states\meditation-b.svg" "#10b981" "#6ee7b7" $circ '<path d="M24 12a12 12 0 1 1-3 23.5" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"/>'
Save-Svg "$base\states\meditation-c.svg" "#10b981" "#6ee7b7" $circ '<circle cx="17" cy="24" r="7" fill="none" stroke="white" stroke-width="2.5"/><circle cx="31" cy="24" r="7" fill="none" stroke="white" stroke-width="2.5"/>'

# Dream (purple)
Save-Svg "$base\states\dream-a.svg" "#a855f7" "#c4b5fd" $circ '<path d="M28 12a12 12 0 1 0 0 24 10 10 0 0 1 0-24z"/>'
Save-Svg "$base\states\dream-b.svg" "#a855f7" "#c4b5fd" $circ '<path d="M26 12a12 12 0 1 0 0 24 9 9 0 0 1 0-24z"/><path d="M33 14l1.5 3 3 0.5-2 2 0.5 3-2.5-1.5-2.5 1.5 0.5-3-2-2 3-0.5z"/>'
Save-Svg "$base\states\dream-c.svg" "#a855f7" "#c4b5fd" $circ '<path d="M15 28a6 6 0 0 1 0-10h0.5a7 7 0 0 1 13 1h0.5a5 5 0 0 1 0 10z" fill="none" stroke="white" stroke-width="2"/><path d="M23 21h5l-5 5h5" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'

# Discovery (gold)
Save-Svg "$base\states\discovery-a.svg" "#eab308" "#fde047" $circ '<circle cx="24" cy="20" r="7" fill="none" stroke="white" stroke-width="2.5"/><line x1="24" y1="27" x2="24" y2="33" stroke="white" stroke-width="2.5" stroke-linecap="round"/><path d="M21 33h6" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M20 20a4.5 4.5 0 0 1 4.5-4.5" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/>'
Save-Svg "$base\states\discovery-b.svg" "#eab308" "#fde047" $circ '<path d="M24 10l2 8 8 2-8 2-2 8-2-8-8-2 8-2z"/>'
Save-Svg "$base\states\discovery-c.svg" "#eab308" "#fde047" $circ '<circle cx="24" cy="24" r="10" fill="none" stroke="white" stroke-width="2"/><path d="M24 14v4M24 30v4M14 24h4M30 24h4" stroke="white" stroke-width="2" stroke-linecap="round"/><circle cx="24" cy="24" r="2"/>'

# ============================================================
# AGENT ICONS (hexagon container, agent-specific colors)
# ============================================================

# Alex (indigo)
Save-Svg "$base\agents\alex-a.svg" "#6366f1" "#818cf8" $hex '<text x="24" y="32" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" font-weight="bold">A</text>'
Save-Svg "$base\agents\alex-b.svg" "#6366f1" "#818cf8" $hex '<path d="M24 12l3.5 7h7.5l-6 5 2 7.5-7-4.5-7 4.5 2-7.5-6-5h7.5z"/>'
Save-Svg "$base\agents\alex-c.svg" "#6366f1" "#818cf8" $hex '<circle cx="17" cy="24" r="6" fill="none" stroke="white" stroke-width="2.5"/><circle cx="31" cy="24" r="6" fill="none" stroke="white" stroke-width="2.5"/>'

# Researcher (blue)
Save-Svg "$base\agents\researcher-a.svg" "#3b82f6" "#93c5fd" $hex '<circle cx="21" cy="21" r="7" fill="none" stroke="white" stroke-width="2.5"/><line x1="26" y1="26" x2="34" y2="34" stroke="white" stroke-width="2.5" stroke-linecap="round"/>'
Save-Svg "$base\agents\researcher-b.svg" "#3b82f6" "#93c5fd" $hex '<path d="M20 14v8l-6 12h20l-6-12v-8z" fill="none" stroke="white" stroke-width="2"/><line x1="18" y1="14" x2="30" y2="14" stroke="white" stroke-width="2" stroke-linecap="round"/>'
Save-Svg "$base\agents\researcher-c.svg" "#3b82f6" "#93c5fd" $hex '<text x="24" y="33" text-anchor="middle" font-family="Georgia,serif" font-size="26" font-weight="bold">?</text>'

# Builder (green)
Save-Svg "$base\agents\builder-a.svg" "#22c55e" "#86efac" $hex '<rect x="22" y="24" width="4" height="12" rx="1"/><rect x="16" y="16" width="16" height="7" rx="2"/>'
Save-Svg "$base\agents\builder-b.svg" "#22c55e" "#86efac" $hex '<circle cx="24" cy="24" r="5" fill="none" stroke="white" stroke-width="2.5"/><path d="M24 12v4M24 32v4M12 24h4M32 24h4M16.5 16.5l3 3M28.5 28.5l3 3M31.5 16.5l-3 3M19.5 28.5l-3 3" stroke="white" stroke-width="2.5" stroke-linecap="round"/>'
Save-Svg "$base\agents\builder-c.svg" "#22c55e" "#86efac" $hex '<path d="M16 36V16h4v20" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"/><path d="M20 18h12" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M32 18v8" stroke="white" stroke-width="2" stroke-linecap="round"/>'

# Validator (red)
Save-Svg "$base\agents\validator-a.svg" "#ef4444" "#fca5a5" $hex '<path d="M24 12l10 4v10c0 6-4 10-10 12-6-2-10-6-10-12V16z" fill="none" stroke="white" stroke-width="2"/><path d="M19 24l4 4 6-8" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>'
Save-Svg "$base\agents\validator-b.svg" "#ef4444" "#fca5a5" $hex '<circle cx="24" cy="24" r="10" fill="none" stroke="white" stroke-width="2"/><path d="M18 24l4 5 8-10" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>'
Save-Svg "$base\agents\validator-c.svg" "#ef4444" "#fca5a5" $hex '<line x1="24" y1="14" x2="24" y2="34" stroke="white" stroke-width="2"/><line x1="14" y1="20" x2="34" y2="20" stroke="white" stroke-width="2"/><path d="M14 20l3 8h-6z" fill="none" stroke="white" stroke-width="1.5"/><path d="M34 20l-3 8h6z" fill="none" stroke="white" stroke-width="1.5"/>'

# Documentarian (amber)
Save-Svg "$base\agents\documentarian-a.svg" "#f59e0b" "#fcd34d" $hex '<rect x="16" y="14" width="14" height="20" rx="2" fill="none" stroke="white" stroke-width="2"/><line x1="20" y1="20" x2="28" y2="20" stroke="white" stroke-width="1.5"/><line x1="20" y1="25" x2="28" y2="25" stroke="white" stroke-width="1.5"/><line x1="20" y1="30" x2="24" y2="30" stroke="white" stroke-width="1.5"/>'
Save-Svg "$base\agents\documentarian-b.svg" "#f59e0b" "#fcd34d" $hex '<path d="M18 12h12v22a4 4 0 0 1-4 4H18V12z" fill="none" stroke="white" stroke-width="2"/><line x1="22" y1="18" x2="28" y2="18" stroke="white" stroke-width="1.5"/><line x1="22" y1="23" x2="28" y2="23" stroke="white" stroke-width="1.5"/>'
Save-Svg "$base\agents\documentarian-c.svg" "#f59e0b" "#fcd34d" $hex '<text x="24" y="30" text-anchor="middle" font-family="Georgia,serif" font-size="28" font-style="italic">&quot;</text>'

# Azure (azure blue)
Save-Svg "$base\agents\azure-a.svg" "#0078d4" "#50a0e4" $hex '<path d="M15 28a6 6 0 0 1 0-10h0.5a7 7 0 0 1 13 1h0.5a5 5 0 0 1 0 10z"/>'
Save-Svg "$base\agents\azure-b.svg" "#0078d4" "#50a0e4" $hex '<path d="M14 28a5 5 0 0 1 0-10h0.5a7 7 0 0 1 13.5 1.5h0.5a4.5 4.5 0 0 1 0 9z" fill="none" stroke="white" stroke-width="2"/><path d="M24 24v-6M21 20l3-3 3 3" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
Save-Svg "$base\agents\azure-c.svg" "#0078d4" "#50a0e4" $hex '<rect x="15" y="14" width="18" height="5" rx="1.5" fill="none" stroke="white" stroke-width="1.5"/><rect x="15" y="22" width="18" height="5" rx="1.5" fill="none" stroke="white" stroke-width="1.5"/><rect x="15" y="30" width="18" height="5" rx="1.5" fill="none" stroke="white" stroke-width="1.5"/><circle cx="19" cy="16.5" r="1"/><circle cx="19" cy="24.5" r="1"/><circle cx="19" cy="32.5" r="1"/>'

# M365 (microsoft orange)
Save-Svg "$base\agents\m365-a.svg" "#d83b01" "#ff6a39" $hex '<rect x="14" y="14" width="8" height="8" rx="1"/><rect x="26" y="14" width="8" height="8" rx="1"/><rect x="14" y="26" width="8" height="8" rx="1"/><rect x="26" y="26" width="8" height="8" rx="1"/>'
Save-Svg "$base\agents\m365-b.svg" "#d83b01" "#ff6a39" $hex '<text x="24" y="32" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" font-weight="bold">M</text>'
Save-Svg "$base\agents\m365-c.svg" "#d83b01" "#ff6a39" $hex '<path d="M24 12l12 12-12 12-12-12z" fill="none" stroke="white" stroke-width="2.5"/><circle cx="24" cy="24" r="3"/>'

# ============================================================
# PERSONA CATEGORY ICONS (squircle container, category-specific colors)
# 16 categories covering all 33 AlexLearn workshop personas
# ============================================================

# Software (indigo) — Software Developers
Save-Svg "$base\personas\software-a.svg" "#6366f1" "#818cf8" $sq '<path d="M18 18l-6 6 6 6M30 18l6 6-6 6" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>'
Save-Svg "$base\personas\software-b.svg" "#6366f1" "#818cf8" $sq '<path d="M14 18l6 6-6 6" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><line x1="24" y1="30" x2="34" y2="30" stroke="white" stroke-width="2.5" stroke-linecap="round"/>'
Save-Svg "$base\personas\software-c.svg" "#6366f1" "#818cf8" $sq '<line x1="20" y1="13" x2="18" y2="35" stroke="white" stroke-width="2.5"/><line x1="28" y1="13" x2="30" y2="35" stroke="white" stroke-width="2.5"/><line x1="14" y1="20" x2="34" y2="20" stroke="white" stroke-width="2"/><line x1="14" y1="28" x2="34" y2="28" stroke="white" stroke-width="2"/>'

# Engineering (blue) — Engineers
Save-Svg "$base\personas\engineering-a.svg" "#3b82f6" "#93c5fd" $sq '<circle cx="24" cy="24" r="6" fill="none" stroke="white" stroke-width="2.5"/><path d="M24 12v4M24 32v4M12 24h4M32 24h4M16.5 16.5l3 3M28.5 28.5l3 3M31.5 16.5l-3 3M19.5 28.5l-3 3" stroke="white" stroke-width="2.5" stroke-linecap="round"/>'
Save-Svg "$base\personas\engineering-b.svg" "#3b82f6" "#93c5fd" $sq '<path d="M14 30l4-8 4 4 4-12 4 8 4-4 4 12" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>'
Save-Svg "$base\personas\engineering-c.svg" "#3b82f6" "#93c5fd" $sq '<rect x="14" y="14" width="10" height="10" rx="1" fill="none" stroke="white" stroke-width="2"/><rect x="24" y="14" width="10" height="10" rx="1" fill="none" stroke="white" stroke-width="2"/><rect x="14" y="24" width="10" height="10" rx="1" fill="none" stroke="white" stroke-width="2"/><circle cx="29" cy="29" r="5" fill="none" stroke="white" stroke-width="2"/>'

# Science (teal) — Scientists, AI Researchers
Save-Svg "$base\personas\science-a.svg" "#14b8a6" "#5eead4" $sq '<circle cx="24" cy="24" r="3"/><ellipse cx="24" cy="24" rx="12" ry="5" fill="none" stroke="white" stroke-width="1.5"/><ellipse cx="24" cy="24" rx="12" ry="5" fill="none" stroke="white" stroke-width="1.5" transform="rotate(60 24 24)"/><ellipse cx="24" cy="24" rx="12" ry="5" fill="none" stroke="white" stroke-width="1.5" transform="rotate(-60 24 24)"/>'
Save-Svg "$base\personas\science-b.svg" "#14b8a6" "#5eead4" $sq '<path d="M20 12v12l-6 10h20l-6-10V12" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="18" y1="12" x2="30" y2="12" stroke="white" stroke-width="2" stroke-linecap="round"/><circle cx="22" cy="28" r="1.5"/><circle cx="27" cy="30" r="1"/>'
Save-Svg "$base\personas\science-c.svg" "#14b8a6" "#5eead4" $sq '<circle cx="24" cy="16" r="3" fill="none" stroke="white" stroke-width="2"/><line x1="24" y1="19" x2="24" y2="30" stroke="white" stroke-width="2"/><path d="M20 34l4-4 4 4" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="16" y1="26" x2="32" y2="26" stroke="white" stroke-width="2" stroke-linecap="round"/>'

# Data (cyan) — Data Analysts, Visual Storytellers
Save-Svg "$base\personas\data-a.svg" "#06b6d4" "#67e8f9" $sq '<rect x="14" y="26" width="5" height="10" rx="1"/><rect x="22" y="18" width="5" height="18" rx="1"/><rect x="30" y="22" width="5" height="14" rx="1"/>'
Save-Svg "$base\personas\data-b.svg" "#06b6d4" "#67e8f9" $sq '<ellipse cx="24" cy="16" rx="10" ry="4" fill="none" stroke="white" stroke-width="2"/><path d="M14 16v16c0 2.2 4.5 4 10 4s10-1.8 10-4V16" fill="none" stroke="white" stroke-width="2"/><path d="M14 24c0 2.2 4.5 4 10 4s10-1.8 10-4" fill="none" stroke="white" stroke-width="2"/>'
Save-Svg "$base\personas\data-c.svg" "#06b6d4" "#67e8f9" $sq '<circle cx="24" cy="24" r="10" fill="none" stroke="white" stroke-width="2"/><path d="M24 24V14" stroke="white" stroke-width="2"/><path d="M24 24l7 7" stroke="white" stroke-width="2"/><path d="M24 24l-8 4" stroke="white" stroke-width="2"/>'

# Design (purple) — Designers (UX/UI)
Save-Svg "$base\personas\design-a.svg" "#a855f7" "#c4b5fd" $sq '<path d="M24 14l6 16-6-4-6 4z"/>'
Save-Svg "$base\personas\design-b.svg" "#a855f7" "#c4b5fd" $sq '<circle cx="18" cy="19" r="4"/><circle cx="30" cy="19" r="4"/><circle cx="24" cy="30" r="4"/>'
Save-Svg "$base\personas\design-c.svg" "#a855f7" "#c4b5fd" $sq '<rect x="22" y="14" width="4" height="12" rx="1"/><path d="M18 26c0 4 2.5 8 6 8s6-4 6-8z"/>'

# Creative (violet) — Creative Writers, Content Creators, Podcasters, Standup Comics, Journalists
Save-Svg "$base\personas\creative-a.svg" "#8b5cf6" "#a78bfa" $sq '<path d="M32 12c-12 4-16 12-16 22l4-4c0-4 4-10 14-14z"/>'
Save-Svg "$base\personas\creative-b.svg" "#8b5cf6" "#a78bfa" $sq '<circle cx="24" cy="18" r="4" fill="none" stroke="white" stroke-width="2"/><line x1="24" y1="22" x2="24" y2="30" stroke="white" stroke-width="3" stroke-linecap="round"/><path d="M18 34h12" stroke="white" stroke-width="2" stroke-linecap="round"/>'
Save-Svg "$base\personas\creative-c.svg" "#8b5cf6" "#a78bfa" $sq '<circle cx="20" cy="26" r="6" fill="none" stroke="white" stroke-width="2"/><circle cx="28" cy="26" r="6" fill="none" stroke="white" stroke-width="2"/><path d="M22 14c0 0-4 4-4 8" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M26 14c0 0 4 4 4 8" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/>'

# Documentation (amber) — Technical Writers
Save-Svg "$base\personas\documentation-a.svg" "#f59e0b" "#fcd34d" $sq '<rect x="14" y="12" width="16" height="22" rx="2" fill="none" stroke="white" stroke-width="2"/><line x1="18" y1="18" x2="26" y2="18" stroke="white" stroke-width="1.5"/><line x1="18" y1="22" x2="26" y2="22" stroke="white" stroke-width="1.5"/><line x1="18" y1="26" x2="23" y2="26" stroke="white" stroke-width="1.5"/><path d="M28 24l6 6v4H28V24z" fill="none" stroke="white" stroke-width="2"/>'
Save-Svg "$base\personas\documentation-b.svg" "#f59e0b" "#fcd34d" $sq '<text x="24" y="33" text-anchor="middle" font-family="Georgia,serif" font-size="24" font-style="italic">A</text>'
Save-Svg "$base\personas\documentation-c.svg" "#f59e0b" "#fcd34d" $sq '<text x="24" y="33" text-anchor="middle" font-family="Arial,sans-serif" font-size="24">&#182;</text>'

# Business (slate) — Consultants, Knowledge Workers, Executives
Save-Svg "$base\personas\business-a.svg" "#64748b" "#94a3b8" $sq '<rect x="14" y="18" width="20" height="16" rx="2" fill="none" stroke="white" stroke-width="2.5"/><path d="M20 18v-4a4 4 0 0 1 8 0v4" fill="none" stroke="white" stroke-width="2"/>'
Save-Svg "$base\personas\business-b.svg" "#64748b" "#94a3b8" $sq '<path d="M24 12l12 6v16H12V18z" fill="none" stroke="white" stroke-width="2"/><rect x="20" y="26" width="8" height="8"/>'
Save-Svg "$base\personas\business-c.svg" "#64748b" "#94a3b8" $sq '<circle cx="18" cy="24" r="4" fill="none" stroke="white" stroke-width="2"/><circle cx="30" cy="24" r="4" fill="none" stroke="white" stroke-width="2"/><path d="M22 24h4" stroke="white" stroke-width="2.5" stroke-linecap="round"/><line x1="24" y1="22" x2="24" y2="26" stroke="white" stroke-width="2.5" stroke-linecap="round"/>'

# Finance (green) — Finance Professionals
Save-Svg "$base\personas\finance-a.svg" "#22c55e" "#86efac" $sq '<text x="24" y="33" text-anchor="middle" font-family="Arial,sans-serif" font-size="24" font-weight="bold">$</text>'
Save-Svg "$base\personas\finance-b.svg" "#22c55e" "#86efac" $sq '<path d="M14 28l5-6 5 4 5-10 5 8" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="34" cy="24" r="2"/>'
Save-Svg "$base\personas\finance-c.svg" "#22c55e" "#86efac" $sq '<rect x="14" y="16" width="20" height="16" rx="2" fill="none" stroke="white" stroke-width="2"/><line x1="14" y1="22" x2="34" y2="22" stroke="white" stroke-width="1.5"/><line x1="14" y1="28" x2="34" y2="28" stroke="white" stroke-width="1.5"/><line x1="22" y1="16" x2="22" y2="32" stroke="white" stroke-width="1.5"/><line x1="30" y1="16" x2="30" y2="32" stroke="white" stroke-width="1.5"/>'

# Product (orange) — Product Managers, Project Managers, Entrepreneurs
Save-Svg "$base\personas\product-a.svg" "#f97316" "#fdba74" $sq '<path d="M14 14h8v8h-8zM26 14h8v8h-8zM14 26h8v8h-8z" fill="none" stroke="white" stroke-width="2"/><line x1="26" y1="30" x2="34" y2="30" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="26" y1="34" x2="34" y2="34" stroke="white" stroke-width="2" stroke-linecap="round"/>'
Save-Svg "$base\personas\product-b.svg" "#f97316" "#fdba74" $sq '<path d="M24 12l3 8h8l-6.5 5 2.5 8L24 28l-7 5 2.5-8L13 20h8z" fill="none" stroke="white" stroke-width="2" stroke-linejoin="round"/>'
Save-Svg "$base\personas\product-c.svg" "#f97316" "#fdba74" $sq '<path d="M20 34V18l-6 4" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><line x1="18" y1="34" x2="30" y2="34" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M28 12l4 4-4 4" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'

# Marketing (coral) — Marketing, Sales, Real Estate Professionals
Save-Svg "$base\personas\marketing-a.svg" "#f43f5e" "#fda4af" $sq '<path d="M12 20v8l16-6v18l-16-6V20" fill="none" stroke="white" stroke-width="2.5" stroke-linejoin="round"/><path d="M28 22l6-4v12l-6-4" fill="none" stroke="white" stroke-width="2" stroke-linejoin="round"/>'
Save-Svg "$base\personas\marketing-b.svg" "#f43f5e" "#fda4af" $sq '<circle cx="24" cy="24" r="10" fill="none" stroke="white" stroke-width="2"/><circle cx="24" cy="24" r="6" fill="none" stroke="white" stroke-width="2"/><circle cx="24" cy="24" r="2"/>'
Save-Svg "$base\personas\marketing-c.svg" "#f43f5e" "#fda4af" $sq '<path d="M16 28l8-16 8 16" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="24" cy="12" r="2.5"/>'

# Education (emerald) — Teachers, Students, Researchers & Professors
Save-Svg "$base\personas\education-a.svg" "#10b981" "#6ee7b7" $sq '<path d="M10 22l14-6 14 6-14 6z"/><path d="M16 25v7c4 2 12 2 16 0v-7" fill="none" stroke="white" stroke-width="2"/>'
Save-Svg "$base\personas\education-b.svg" "#10b981" "#6ee7b7" $sq '<rect x="16" y="16" width="7" height="18" rx="1" fill="none" stroke="white" stroke-width="2"/><rect x="25" y="16" width="7" height="18" rx="1" fill="none" stroke="white" stroke-width="2"/><line x1="23" y1="18" x2="23" y2="32" stroke="white" stroke-width="2"/>'
Save-Svg "$base\personas\education-c.svg" "#10b981" "#6ee7b7" $sq '<circle cx="24" cy="20" r="6" fill="none" stroke="white" stroke-width="2"/><path d="M20 26v6a4 4 0 0 0 8 0v-6" fill="none" stroke="white" stroke-width="2"/><line x1="24" y1="14" x2="24" y2="10" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="28" y1="15" x2="30" y2="12" stroke="white" stroke-width="2" stroke-linecap="round"/>'

# Healthcare (red) — Healthcare Professionals, Psychology Counselors
Save-Svg "$base\personas\healthcare-a.svg" "#ef4444" "#fca5a5" $sq '<path d="M24 34c-8-6-14-10-14-16a7 7 0 0 1 14-2 7 7 0 0 1 14 2c0 6-6 10-14 16z" fill="none" stroke="white" stroke-width="2"/><line x1="24" y1="18" x2="24" y2="26" stroke="white" stroke-width="2.5"/><line x1="20" y1="22" x2="28" y2="22" stroke="white" stroke-width="2.5"/>'
Save-Svg "$base\personas\healthcare-b.svg" "#ef4444" "#fca5a5" $sq '<circle cx="24" cy="18" r="6" fill="none" stroke="white" stroke-width="2"/><path d="M16 18l-4 8h4v8M32 18l4 8h-4v8" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
Save-Svg "$base\personas\healthcare-c.svg" "#ef4444" "#fca5a5" $sq '<path d="M14 24h8l2-6 4 12 2-6h8" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>'

# Legal (gold) — Lawyers
Save-Svg "$base\personas\legal-a.svg" "#eab308" "#fde047" $sq '<line x1="24" y1="10" x2="24" y2="34" stroke="white" stroke-width="2.5"/><line x1="14" y1="18" x2="34" y2="18" stroke="white" stroke-width="2"/><circle cx="14" cy="22" r="3" fill="none" stroke="white" stroke-width="1.5"/><circle cx="34" cy="22" r="3" fill="none" stroke="white" stroke-width="1.5"/><line x1="18" y1="34" x2="30" y2="34" stroke="white" stroke-width="2.5" stroke-linecap="round"/>'
Save-Svg "$base\personas\legal-b.svg" "#eab308" "#fde047" $sq '<rect x="18" y="28" width="12" height="6" rx="1" fill="none" stroke="white" stroke-width="2"/><line x1="24" y1="28" x2="24" y2="18" stroke="white" stroke-width="3"/><circle cx="24" cy="16" r="4" fill="none" stroke="white" stroke-width="2"/>'
Save-Svg "$base\personas\legal-c.svg" "#eab308" "#fde047" $sq '<path d="M24 12l10 4v10c0 6-4 10-10 12-6-2-10-6-10-12V16z" fill="none" stroke="white" stroke-width="2"/><path d="M20 24l3 3 6-7" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>'

# People (pink) — HR & People Ops, CX Leaders, Nonprofit Leaders
Save-Svg "$base\personas\people-a.svg" "#ec4899" "#f9a8d4" $sq '<circle cx="20" cy="18" r="4" fill="none" stroke="white" stroke-width="2"/><circle cx="32" cy="18" r="4" fill="none" stroke="white" stroke-width="2"/><path d="M12 32c0-5 3.5-8 8-8s8 3 8 8" fill="none" stroke="white" stroke-width="2"/><path d="M24 32c0-5 3.5-8 8-8s8 3 8 8" fill="none" stroke="white" stroke-width="2"/>'
Save-Svg "$base\personas\people-b.svg" "#ec4899" "#f9a8d4" $sq '<circle cx="24" cy="24" r="10" fill="none" stroke="white" stroke-width="2"/><circle cx="20" cy="20" r="3" fill="none" stroke="white" stroke-width="1.5"/><circle cx="28" cy="20" r="3" fill="none" stroke="white" stroke-width="1.5"/><path d="M18 28a6 6 0 0 0 12 0" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/>'
Save-Svg "$base\personas\people-c.svg" "#ec4899" "#f9a8d4" $sq '<path d="M24 34c-6-4-12-8-12-14a6 6 0 0 1 12-2 6 6 0 0 1 12 2c0 6-6 10-12 14z" fill="none" stroke="white" stroke-width="2"/><path d="M20 22l-2 6h4z" fill="white" opacity="0.5"/>'

# Career (sky) — Job Seekers
Save-Svg "$base\personas\career-a.svg" "#0ea5e9" "#7dd3fc" $sq '<circle cx="24" cy="24" r="10" fill="none" stroke="white" stroke-width="2"/><path d="M24 16v8l5 3" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 12l2 4-2-1-2 1z"/>'
Save-Svg "$base\personas\career-b.svg" "#0ea5e9" "#7dd3fc" $sq '<path d="M16 34l2-8 4 2 2-10 2 10 4-2 2 8" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><line x1="24" y1="16" x2="24" y2="12" stroke="white" stroke-width="2" stroke-linecap="round"/><circle cx="24" cy="12" r="2"/>'
Save-Svg "$base\personas\career-c.svg" "#0ea5e9" "#7dd3fc" $sq '<rect x="14" y="18" width="20" height="16" rx="2" fill="none" stroke="white" stroke-width="2.5"/><path d="M20 18v-4a4 4 0 0 1 8 0v4" fill="none" stroke="white" stroke-width="2"/><path d="M20 24l3 3 6-6" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'

# ============================================================
# DEFAULT ICON (circle container, indigo)
# ============================================================
Save-Svg "$base\default\default-a.svg" "#6366f1" "#818cf8" $circ '<text x="24" y="32" text-anchor="middle" font-family="Arial,sans-serif" font-size="24" font-weight="bold">A</text>'
Save-Svg "$base\default\default-b.svg" "#6366f1" "#818cf8" $circ '<path d="M24 10l2 8 8 2-8 2-2 8-2-8-8-2 8-2z"/>'
Save-Svg "$base\default\default-c.svg" "#6366f1" "#818cf8" $circ '<circle cx="19" cy="21" r="2.5"/><circle cx="29" cy="21" r="2.5"/><path d="M18 30a8 8 0 0 0 12 0" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"/>'

Write-Host "Generated 114 icon SVGs in: $base" -ForegroundColor Green
Write-Host "  tabs/     : 15 files (5 icons x 3 options)"
Write-Host "  states/   : 27 files (9 icons x 3 options)"
Write-Host "  agents/   : 21 files (7 icons x 3 options)"
Write-Host "  personas/ : 48 files (16 icons x 3 options)"
Write-Host "  default/  :  3 files (1 icon  x 3 options)"
