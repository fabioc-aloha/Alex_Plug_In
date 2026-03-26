/**
 * Rocket Character Icon Generator
 * 
 * Generates the full Command Center icon set using the Alex blue rocket
 * as a character base with accessories for each state/agent/persona.
 * 
 * Usage:
 *   node generate-rocket-icons.js              # Generate all 33 icons
 *   node generate-rocket-icons.js --only=states # Generate only state icons
 *   node generate-rocket-icons.js --only=tabs,agents
 *   node generate-rocket-icons.js --preview     # Generate HTML preview sheet
 * 
 * Output: alex_docs/research/mockups/rocket-icons/
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_DIR = path.join(__dirname, 'rocket-icons');

const args = process.argv.slice(2);
const PREVIEW = args.includes('--preview');
const onlyArg = args.find(a => a.startsWith('--only='));
const ONLY = onlyArg ? new Set(onlyArg.split('=')[1].split(',')) : null;

// ── Brand Colors ──────────────────────────────────────────────────────
const COLORS = {
    // Rocket body gradient
    rocketLight: '#38bdf8',
    rocketDark: '#0284c7',
    // Exhaust flame
    flame: '#f97316',
    flameLight: '#fdba74',
    // A cutout
    white: '#ffffff',
    // State/domain accent colors (CorreaX palette)
    indigo: '#6366f1',
    indigoLight: '#818cf8',
    blue: '#3b82f6',
    teal: '#0d9488',
    tealLight: '#2dd4bf',
    green: '#22c55e',
    emerald: '#10b981',
    amber: '#f59e0b',
    amberLight: '#fbbf24',
    gold: '#eab308',
    rose: '#f43f5e',
    red: '#ef4444',
    violet: '#8b5cf6',
    purple: '#a855f7',
    coral: '#f97316',
    cyan: '#06b6d4',
    pink: '#ec4899',
    sky: '#0ea5e9',
    slate: '#64748b',
    orange: '#f97316',
    // Backgrounds
    bgDark: '#1e1e1e',
    bgCard: '#252526',
};

// ── Shared Rocket Base ────────────────────────────────────────────────
// The base rocket is drawn at center of a 128x128 viewbox, angled 30 degrees.
// Accessories are layered on top. Each icon gets its own SVG.

function rocketDefs(id) {
    return `
    <defs>
        <linearGradient id="rocketBody${id}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="${COLORS.rocketLight}"/>
            <stop offset="100%" stop-color="${COLORS.rocketDark}"/>
        </linearGradient>
        <linearGradient id="flameGrad${id}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="${COLORS.flameLight}"/>
            <stop offset="100%" stop-color="${COLORS.flame}"/>
        </linearGradient>
    </defs>`;
}

function rocketBody(id) {
    // Base rocket: body, fins, A cutout, flame
    // Drawn centered around (64, 64) in 128x128 viewbox, with 30° lean
    return `
    <g transform="translate(64,64) rotate(30) translate(-64,-64)">
        <!-- Rocket body -->
        <path d="M64,14 C64,14 48,28 48,52 L48,80 L54,84 L54,76 L74,76 L74,84 L80,80 L80,52 C80,28 64,14 64,14 Z" 
              fill="url(#rocketBody${id})" />
        <!-- Left fin -->
        <polygon points="48,68 34,88 48,80" fill="url(#rocketBody${id})" />
        <!-- Right fin -->
        <polygon points="80,68 94,88 80,80" fill="url(#rocketBody${id})" />
        <!-- A cutout (negative space) -->
        <path d="M64,26 L55,62 L58,62 L61,52 L67,52 L70,62 L73,62 Z M62.5,47 L64,36 L65.5,47 Z" 
              fill="${COLORS.white}" />
        <!-- Exhaust flame -->
        <polygon points="54,82 64,98 74,82" fill="url(#flameGrad${id})" />
    </g>`;
}

function svgWrap(id, content, size = 128, angle = 0) {
    // Tighter viewBox: crop edges to fill the square, reduce dead space
    const inset = 6;
    const vbSize = size - inset * 2;
    const rotOpen = angle !== 0 ? `<g transform="rotate(${angle}, ${size / 2}, ${size / 2})">` : '';
    const rotClose = angle !== 0 ? '</g>' : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${inset} ${inset} ${vbSize} ${vbSize}" width="${size}" height="${size}">
${rocketDefs(id)}
<filter id="pop_${id}" x="-5%" y="-5%" width="110%" height="110%">
    <feMorphology in="SourceAlpha" operator="dilate" radius="1.5" result="expanded"/>
    <feFlood flood-color="#0a0e1a" result="dark"/>
    <feComposite in="dark" in2="expanded" operator="in" result="outline"/>
    <feMerge>
        <feMergeNode in="outline"/>
        <feMergeNode in="SourceGraphic"/>
    </feMerge>
</filter>
<g filter="url(#pop_${id})">
${rotOpen}
${rocketBody(id)}
${content}
${rotClose}
</g>
</svg>`;
}

// ── Accessory Drawing Functions ───────────────────────────────────────

// Hard hat (sits on top of rocket nose, rotated to match)
function hardHat(color) {
    return `
    <g transform="translate(64,64) rotate(30) translate(-64,-64)">
        <!-- Hard hat brim -->
        <ellipse cx="64" cy="24" rx="16" ry="5" fill="${color}" opacity="0.9"/>
        <!-- Hard hat dome -->
        <path d="M52,24 Q52,12 64,10 Q76,12 76,24 Z" fill="${color}"/>
        <!-- Hat highlight -->
        <path d="M57,20 Q60,14 64,13 Q63,14 60,20 Z" fill="${COLORS.white}" opacity="0.3"/>
    </g>
    <!-- Crossed wrench + hammer bottom-left -->
    <g transform="translate(16, 68)">
        <!-- Wrench -->
        <g transform="rotate(-30)">
            <rect x="-2" y="0" width="4" height="26" rx="1.5" fill="${color}" opacity="0.8"/>
            <path d="M-5,0 L-2,0 L-2,-5 L-5,-5 Z" fill="${color}" opacity="0.7"/>
            <path d="M2,0 L5,0 L5,-5 L2,-5 Z" fill="${color}" opacity="0.7"/>
            <rect x="-5" y="-5" width="10" height="2" rx="1" fill="${color}" opacity="0.6"/>
        </g>
        <!-- Hammer -->
        <g transform="rotate(30)">
            <rect x="-2" y="0" width="4" height="26" rx="1.5" fill="${color}" opacity="0.75"/>
            <rect x="-7" y="-5" width="14" height="7" rx="2" fill="${color}" opacity="0.9"/>
        </g>
    </g>
    <!-- Blueprint tube bottom-right -->
    <g transform="translate(94, 78) rotate(-10)">
        <rect x="-3" y="0" width="6" height="22" rx="3" fill="${COLORS.blue}" opacity="0.65"/>
        <ellipse cx="0" cy="0" rx="4" ry="2" fill="${COLORS.blue}" opacity="0.65"/>
        <rect x="-2" y="-4" width="4" height="5" rx="1" fill="${COLORS.white}" opacity="0.35"/>
    </g>`;
}

function constructionSite(color) {
    return `
    <!-- Mortar trowel — foreground overlap -->
    <g transform="translate(24, 22) rotate(-30)">
        <!-- Blade — flat triangular -->
        <path d="M0,0 L-12,28 L12,28 Z" fill="${COLORS.slate}" opacity="0.9"/>
        <!-- Blade highlight -->
        <path d="M0,4 L-6,22 L0,20 Z" fill="${COLORS.white}" opacity="0.15"/>
        <!-- Neck -->
        <rect x="-2" y="-6" width="4" height="8" rx="1" fill="${COLORS.slate}" opacity="0.75"/>
        <!-- Handle -->
        <rect x="-3.5" y="-20" width="7" height="16" rx="2.5" fill="${color}" opacity="0.95"/>
        <!-- Mortar smear on blade -->
        <ellipse cx="2" cy="18" rx="5" ry="3" fill="${COLORS.white}" opacity="0.25"/>
    </g>
    <!-- Brick stack bottom-right — larger -->
    <g transform="translate(68, 72)">
        <rect x="0" y="0" width="16" height="10" rx="1" fill="${COLORS.coral}" opacity="0.8"/>
        <rect x="18" y="0" width="16" height="10" rx="1" fill="${COLORS.coral}" opacity="0.7"/>
        <rect x="36" y="0" width="10" height="10" rx="1" fill="${COLORS.coral}" opacity="0.6"/>
        <rect x="8" y="-10" width="16" height="10" rx="1" fill="${COLORS.coral}" opacity="0.85"/>
        <rect x="26" y="-10" width="16" height="10" rx="1" fill="${COLORS.coral}" opacity="0.75"/>
        <rect x="16" y="-20" width="16" height="10" rx="1" fill="${COLORS.coral}" opacity="0.8"/>
    </g>`;
}

function detectiveHat(color) {
    return `
    <g transform="translate(64,64) rotate(30) translate(-64,-64)">
        <!-- Deerstalker / detective hat -->
        <ellipse cx="64" cy="22" rx="18" ry="5" fill="${color}" opacity="0.9"/>
        <path d="M50,22 Q50,8 64,6 Q78,8 78,22 Z" fill="${color}"/>
        <!-- Front bill -->
        <path d="M52,22 L46,28 L58,24 Z" fill="${color}" opacity="0.8"/>
        <!-- Back bill -->
        <path d="M76,22 L82,28 L70,24 Z" fill="${color}" opacity="0.8"/>
    </g>`;
}

function magnifyingGlass(color) {
    return `
    <g transform="translate(64,64) rotate(30) translate(-64,-64)">
        <!-- Magnifying glass, held to the right -->
        <circle cx="90" cy="40" r="10" fill="none" stroke="${color}" stroke-width="3"/>
        <line x1="83" y1="47" x2="76" y2="54" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
        <!-- Glass shine -->
        <path d="M86,34 Q88,33 90,34" stroke="${COLORS.white}" stroke-width="1.5" fill="none" opacity="0.5"/>
    </g>`;
}

function graduationCap(color) {
    return `
    <g transform="translate(64,64) rotate(30) translate(-64,-64)">
        <!-- Mortarboard -->
        <polygon points="64,8 44,18 64,22 84,18" fill="${color}"/>
        <!-- Board top -->
        <polygon points="44,18 64,14 84,18 64,22" fill="${color}" opacity="0.8"/>
        <!-- Tassel -->
        <line x1="76" y1="14" x2="84" y2="24" stroke="${COLORS.gold}" stroke-width="2" stroke-linecap="round"/>
        <circle cx="85" cy="26" r="2" fill="${COLORS.gold}"/>
    </g>`;
}

function professorPointer(color) {
    return `
    <!-- Large chalkboard behind rocket -->
    <g transform="translate(6, 10)">
        <!-- Board frame -->
        <rect x="0" y="0" width="48" height="36" rx="3" fill="${color}" opacity="0.45" stroke="${color}" stroke-width="2"/>
        <!-- Chalk writing -->
        <line x1="6" y1="10" x2="28" y2="10" stroke="${color}" stroke-width="2" opacity="0.5" stroke-linecap="round"/>
        <line x1="6" y1="17" x2="34" y2="17" stroke="${color}" stroke-width="2" opacity="0.4" stroke-linecap="round"/>
        <line x1="6" y1="24" x2="20" y2="24" stroke="${color}" stroke-width="2" opacity="0.35" stroke-linecap="round"/>
        <!-- Chalk tray -->
        <rect x="2" y="34" width="44" height="4" rx="1" fill="${color}" opacity="0.5"/>
        <rect x="6" y="34" width="8" height="3" rx="1" fill="${COLORS.white}" opacity="0.5"/>
    </g>
    <!-- Pointer stick -->
    <g transform="translate(98, 14) rotate(25)">
        <rect x="-1.5" y="0" width="3" height="28" rx="1" fill="${color}" opacity="0.75"/>
        <circle cx="0" cy="0" r="3" fill="${color}" opacity="0.9"/>
    </g>
    <!-- Lightbulb bottom-right -->
    <g transform="translate(104, 72)">
        <circle cx="0" cy="0" r="10" fill="${color}" opacity="0.15"/>
        <path d="M0,-7 Q-5,-7 -5,0 Q-5,4 -3,6 L3,6 Q5,4 5,0 Q5,-7 0,-7 Z" fill="${color}" opacity="0.75"/>
        <path d="M-1,0 L0,-2 L1,0" stroke="${COLORS.white}" stroke-width="1" fill="none" opacity="0.5"/>
        <rect x="-2" y="6" width="4" height="3" rx="0.5" fill="${color}" opacity="0.5"/>
        <line x1="0" y1="-12" x2="0" y2="-15" stroke="${color}" stroke-width="1.5" opacity="0.4" stroke-linecap="round"/>
        <line x1="8" y1="-4" x2="11" y2="-6" stroke="${color}" stroke-width="1.5" opacity="0.35" stroke-linecap="round"/>
        <line x1="-8" y1="-4" x2="-11" y2="-6" stroke="${color}" stroke-width="1.5" opacity="0.35" stroke-linecap="round"/>
    </g>`;
}

function zenHeadband(color) {
    return `
    <g transform="translate(64,64) rotate(30) translate(-64,-64)">
        <!-- Turban wrapping around rocket nose -->
        <path d="M50,28 Q50,10 64,6 Q78,10 78,28 Z" fill="${COLORS.white}" opacity="0.9"/>
        <!-- Turban wrap layers -->
        <path d="M50,16 Q58,14 64,16 Q70,14 78,16" stroke="${color}" stroke-width="0.8" fill="none" opacity="0.2"/>
        <path d="M50,22 Q58,20 64,22 Q70,20 78,22" stroke="${color}" stroke-width="0.8" fill="none" opacity="0.2"/>
        <!-- Turban fold/crest at top -->
        <path d="M58,8 Q64,4 70,8" fill="${COLORS.white}" opacity="0.8"/>
        <!-- Peaceful closed eyes -->
        <path d="M56,38 Q58,40 60,38" stroke="${color}" stroke-width="1.5" fill="none"/>
        <path d="M68,38 Q70,40 72,38" stroke="${color}" stroke-width="1.5" fill="none"/>
        <!-- Hands together at center (namaskar) -->
        <path d="M58,66 L64,60 L70,66" stroke="${color}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
    </g>`;
}

function lotusGlow(color) {
    return `
    <!-- Lotus flower + glow — foreground overlap -->
    <g transform="translate(64, 90)">
        <!-- Wide soft glow aura -->
        <ellipse cx="0" cy="-4" rx="40" ry="16" fill="${color}" opacity="0.08"/>
        <ellipse cx="0" cy="-4" rx="30" ry="12" fill="${color}" opacity="0.13"/>
        <ellipse cx="0" cy="-4" rx="18" ry="8" fill="${color}" opacity="0.2"/>
        <!-- Center petal (tall) -->
        <path d="M0,-14 Q-6,-6 0,2 Q6,-6 0,-14 Z" fill="${color}" opacity="0.75"/>
        <!-- Inner left petal -->
        <path d="M-8,-10 Q-14,-2 -4,2 Q-6,-5 -8,-10 Z" fill="${color}" opacity="0.6"/>
        <!-- Inner right petal -->
        <path d="M8,-10 Q14,-2 4,2 Q6,-5 8,-10 Z" fill="${color}" opacity="0.6"/>
        <!-- Outer left petal -->
        <path d="M-16,-6 Q-22,2 -10,4 Q-14,-1 -16,-6 Z" fill="${color}" opacity="0.4"/>
        <!-- Outer right petal -->
        <path d="M16,-6 Q22,2 10,4 Q14,-1 16,-6 Z" fill="${color}" opacity="0.4"/>
        <!-- Far left petal -->
        <path d="M-22,-2 Q-26,6 -16,6 Q-20,2 -22,-2 Z" fill="${color}" opacity="0.36"/>
        <!-- Far right petal -->
        <path d="M22,-2 Q26,6 16,6 Q20,2 22,-2 Z" fill="${color}" opacity="0.36"/>
    </g>
    <!-- Side aura particles -->
    <circle cx="20" cy="68" r="3" fill="${color}" opacity="0.14"/>
    <circle cx="108" cy="68" r="3" fill="${color}" opacity="0.14"/>
    <circle cx="16" cy="82" r="2" fill="${color}" opacity="0.12"/>
    <circle cx="112" cy="82" r="2" fill="${color}" opacity="0.12"/>`;
}

function learningKit(color) {
    return `
    <!-- Open book — large, colored, unmistakable -->
    <g transform="translate(8, 62)">
        <!-- Book cover/back -->
        <path d="M22,-4 L0,2 L0,32 L22,26 Z" fill="${color}" opacity="0.3"/>
        <path d="M22,-4 L44,2 L44,32 L22,26 Z" fill="${color}" opacity="0.2"/>
        <!-- Left page -->
        <path d="M22,-2 L2,3 L2,30 L22,24 Z" fill="${COLORS.white}" opacity="0.9"/>
        <!-- Right page -->
        <path d="M22,-2 L42,3 L42,30 L22,24 Z" fill="${COLORS.white}" opacity="0.75"/>
        <!-- Spine -->
        <line x1="22" y1="-2" x2="22" y2="24" stroke="${color}" stroke-width="2" opacity="0.7"/>
        <!-- Text lines left -->
        <line x1="6" y1="10" x2="18" y2="7" stroke="${color}" stroke-width="1.5" opacity="0.4" stroke-linecap="round"/>
        <line x1="6" y1="16" x2="17" y2="13" stroke="${color}" stroke-width="1.5" opacity="0.35" stroke-linecap="round"/>
        <line x1="6" y1="22" x2="15" y2="19" stroke="${color}" stroke-width="1.5" opacity="0.3" stroke-linecap="round"/>
        <!-- Text lines right -->
        <line x1="26" y1="7" x2="38" y2="10" stroke="${color}" stroke-width="1.5" opacity="0.4" stroke-linecap="round"/>
        <line x1="26" y1="13" x2="37" y2="16" stroke="${color}" stroke-width="1.5" opacity="0.35" stroke-linecap="round"/>
    </g>
    <!-- Lightbulb "aha!" top-right — bold -->
    <g transform="translate(100, 16)">
        <circle cx="0" cy="0" r="14" fill="${color}" opacity="0.12"/>
        <circle cx="0" cy="0" r="9" fill="${color}" opacity="0.18"/>
        <path d="M0,-9 Q-7,-9 -7,-1 Q-7,4 -4,8 L4,8 Q7,4 7,-1 Q7,-9 0,-9 Z" fill="${color}" opacity="0.85"/>
        <path d="M-1.5,0 L0,-3 L1.5,0" stroke="${COLORS.white}" stroke-width="1.2" fill="none" opacity="0.6"/>
        <rect x="-3" y="8" width="6" height="2.5" rx="1" fill="${color}" opacity="0.6"/>
        <line x1="0" y1="-14" x2="0" y2="-18" stroke="${color}" stroke-width="2" opacity="0.5" stroke-linecap="round"/>
        <line x1="10" y1="-6" x2="14" y2="-9" stroke="${color}" stroke-width="2" opacity="0.45" stroke-linecap="round"/>
        <line x1="-10" y1="-6" x2="-14" y2="-9" stroke="${color}" stroke-width="2" opacity="0.45" stroke-linecap="round"/>
    </g>`;
}

function ideaLightbulb(color) {
    return `
    <!-- Gold idea lightbulb — hero icon, left of rocket, slight tilt -->
    <g transform="translate(26, 24) rotate(-12)">
        <!-- Outer warm glow -->
        <circle cx="0" cy="-2" r="24" fill="${color}" opacity="0.06"/>
        <circle cx="0" cy="-2" r="18" fill="${color}" opacity="0.10"/>
        <circle cx="0" cy="-2" r="12" fill="${color}" opacity="0.14"/>

        <!-- Classic bulb shape — rounded dome tapering to neck -->
        <path d="M0,-14 Q-11,-14 -11,-3 Q-11,4 -7,9 Q-5,12 -5,14 L5,14 Q5,12 7,9 Q11,4 11,-3 Q11,-14 0,-14 Z" fill="${color}" opacity="0.9"/>

        <!-- Glass highlight arc -->
        <path d="M-5,-10 Q-2,-13 4,-9" stroke="${COLORS.white}" stroke-width="1.6" fill="none" opacity="0.45" stroke-linecap="round"/>
        <!-- Secondary highlight -->
        <path d="M-6,-5 Q-5,-7 -3,-6" stroke="${COLORS.white}" stroke-width="1" fill="none" opacity="0.3" stroke-linecap="round"/>

        <!-- Edison filament — W shape -->
        <path d="M-3,3 L-1.5,-2 L0,3 L1.5,-2 L3,3" stroke="${COLORS.white}" stroke-width="1.2" fill="none" opacity="0.55" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- Filament wires from base -->
        <line x1="-3" y1="3" x2="-3" y2="8" stroke="${COLORS.white}" stroke-width="0.8" opacity="0.35"/>
        <line x1="3" y1="3" x2="3" y2="8" stroke="${COLORS.white}" stroke-width="0.8" opacity="0.35"/>

        <!-- Screw base — 3 stepped rings -->
        <rect x="-5" y="14" width="10" height="3" rx="1.5" fill="${color}" opacity="0.7"/>
        <rect x="-4.5" y="17" width="9" height="2.5" rx="1.2" fill="${color}" opacity="0.55"/>
        <rect x="-3.5" y="19.5" width="7" height="2" rx="1" fill="${color}" opacity="0.4"/>
        <!-- Contact point -->
        <circle cx="0" cy="22.5" r="1.5" fill="${color}" opacity="0.35"/>

        <!-- Rays — 8-point starburst -->
        <line x1="0" y1="-22" x2="0" y2="-27" stroke="${color}" stroke-width="2.2" opacity="0.5" stroke-linecap="round"/>
        <line x1="14" y1="-10" x2="18" y2="-13" stroke="${color}" stroke-width="2" opacity="0.45" stroke-linecap="round"/>
        <line x1="-14" y1="-10" x2="-18" y2="-13" stroke="${color}" stroke-width="2" opacity="0.45" stroke-linecap="round"/>
        <line x1="16" y1="2" x2="20" y2="3" stroke="${color}" stroke-width="1.8" opacity="0.35" stroke-linecap="round"/>
        <line x1="-16" y1="2" x2="-20" y2="3" stroke="${color}" stroke-width="1.8" opacity="0.35" stroke-linecap="round"/>
        <!-- Diagonal sparkle rays -->
        <line x1="10" y1="-18" x2="13" y2="-22" stroke="${color}" stroke-width="1.6" opacity="0.35" stroke-linecap="round"/>
        <line x1="-10" y1="-18" x2="-13" y2="-22" stroke="${color}" stroke-width="1.6" opacity="0.35" stroke-linecap="round"/>
        <line x1="15" y1="-4" x2="19" y2="-5" stroke="${color}" stroke-width="1.4" opacity="0.28" stroke-linecap="round"/>
    </g>`;
}

function educationKit(color) {
    return `
    ${graduationCap(color)}
    <!-- Open book bottom-left -->
    <g transform="translate(6, 66)">
        <path d="M16,-2 L0,2 L0,24 L16,20 Z" fill="${color}" opacity="0.3"/>
        <path d="M16,-2 L32,2 L32,24 L16,20 Z" fill="${color}" opacity="0.2"/>
        <path d="M16,0 L2,3 L2,22 L16,18 Z" fill="${COLORS.white}" opacity="0.8"/>
        <path d="M16,0 L30,3 L30,22 L16,18 Z" fill="${COLORS.white}" opacity="0.65"/>
        <line x1="16" y1="0" x2="16" y2="18" stroke="${color}" stroke-width="1.5" opacity="0.5"/>
    </g>
    <!-- Large diploma scroll right -->
    <g transform="translate(76, 72)">
        <rect x="4" y="0" width="28" height="18" rx="1" fill="${COLORS.white}" opacity="0.8"/>
        <ellipse cx="18" cy="0" rx="16" ry="3" fill="${COLORS.white}" opacity="0.6"/>
        <ellipse cx="18" cy="18" rx="16" ry="3" fill="${COLORS.white}" opacity="0.65"/>
        <circle cx="18" cy="9" r="4" fill="${color}" opacity="0.7"/>
        <line x1="18" y1="13" x2="14" y2="18" stroke="${color}" stroke-width="1.5" opacity="0.5"/>
        <line x1="18" y1="13" x2="22" y2="18" stroke="${color}" stroke-width="1.5" opacity="0.5"/>
    </g>`;
}

function nightCap(color) {
    return `
    <g transform="translate(64,64) rotate(30) translate(-64,-64)">
        <!-- Droopy sleep cap -->
        <path d="M52,24 Q52,10 64,6 Q72,8 74,14 L86,20 Z" fill="${color}"/>
        <!-- Pom-pom at tip -->
        <circle cx="86" cy="20" r="4" fill="${color}" opacity="0.8"/>
    </g>
    <!-- Z's in screen space (not rotated) -->
    <text x="96" y="18" font-family="Segoe UI, sans-serif" font-size="14" font-weight="700" fill="${color}" opacity="0.8">z</text>
    <text x="104" y="10" font-family="Segoe UI, sans-serif" font-size="10" font-weight="700" fill="${color}" opacity="0.5">z</text>`;
}

function sleepingMask(color) {
    return `
    <g transform="translate(64,64) rotate(30) translate(-64,-64)">
        <!-- Elastic strap wrapping around head -->
        <path d="M42,36 Q38,34 38,30 Q38,26 42,24" stroke="${color}" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="0.5"/>
        <path d="M86,36 Q90,34 90,30 Q90,26 86,24" stroke="${color}" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="0.5"/>
        <!-- Main mask band — smooth contoured sleep mask -->
        <path d="M44,30 Q44,26 50,26 L54,25 Q58,24 64,25 Q70,24 74,25 L78,26 Q84,26 84,30 Q84,34 80,38 Q76,42 72,42 Q68,42 64,40 Q60,42 56,42 Q52,42 48,38 Q44,34 44,30 Z" fill="${color}" opacity="0.9"/>
        <!-- Left eye contour — padded oval indent -->
        <ellipse cx="54" cy="34" rx="7" ry="5.5" fill="#0f172a" opacity="0.35"/>
        <!-- Right eye contour — padded oval indent -->
        <ellipse cx="74" cy="34" rx="7" ry="5.5" fill="#0f172a" opacity="0.35"/>
        <!-- Nose bridge cutout -->
        <path d="M61,38 Q64,42 67,38" fill="#0f172a" opacity="0.2"/>
    </g>
    <!-- Zzzz... floating in screen space -->
    <text x="88" y="30" font-family="Segoe UI, sans-serif" font-size="16" font-weight="800" fill="${color}" opacity="0.9">Z</text>
    <text x="98" y="20" font-family="Segoe UI, sans-serif" font-size="13" font-weight="700" fill="${color}" opacity="0.7">z</text>
    <text x="106" y="12" font-family="Segoe UI, sans-serif" font-size="10" font-weight="700" fill="${color}" opacity="0.5">z</text>
    <text x="112" y="7" font-family="Segoe UI, sans-serif" font-size="7" font-weight="600" fill="${color}" opacity="0.45">z</text>`;
}

function explorerHat(color) {
    return `
    <g transform="translate(64,64) rotate(30) translate(-64,-64)">
        <!-- Fedora wide brim — curves down at front and back -->
        <path d="M42,24 Q44,28 54,28 Q64,29 74,28 Q84,28 86,24 Q84,22 74,21 Q64,20 54,21 Q44,22 42,24 Z" fill="${color}" opacity="0.85"/>
        <!-- Crown with pinch -->
        <path d="M52,22 Q52,10 58,6 L64,4 L70,6 Q76,10 76,22 Z" fill="${color}"/>
        <!-- Crown pinch dent -->
        <path d="M56,10 Q60,14 64,10 Q68,14 72,10" stroke="${color}" stroke-width="1.5" fill="none" opacity="0.5"/>
        <!-- Dark hat band -->
        <rect x="52" y="19" width="24" height="3" rx="1" fill="#1a1a1a" opacity="0.6"/>
    </g>
    <!-- Flashlight beam -->
    <g>
        <!-- Beam cone -->
        <polygon points="90,58 118,38 118,78" fill="${color}" opacity="0.12"/>
        <polygon points="90,58 114,42 114,74" fill="${color}" opacity="0.08"/>
        <!-- Flashlight body -->
        <rect x="78" y="54" width="14" height="8" rx="2" fill="${color}" opacity="0.8"/>
        <!-- Lens -->
        <rect x="91" y="55" width="3" height="6" rx="1" fill="${COLORS.white}" opacity="0.4"/>
        <!-- Grip lines -->
        <line x1="81" y1="55" x2="81" y2="61" stroke="${COLORS.white}" stroke-width="0.7" opacity="0.2"/>
        <line x1="84" y1="55" x2="84" y2="61" stroke="${COLORS.white}" stroke-width="0.7" opacity="0.2"/>
    </g>`;
}

function crown(color) {
    return `
    <g transform="translate(64,64) rotate(30) translate(-64,-64)">
        <!-- Crown -->
        <polygon points="50,24 52,12 56,20 60,8 64,20 68,8 72,20 76,12 78,24" fill="${color}"/>
        <!-- Gems -->
        <circle cx="60" cy="17" r="2" fill="${COLORS.white}" opacity="0.6"/>
        <circle cx="64" cy="14" r="2" fill="${COLORS.white}" opacity="0.6"/>
        <circle cx="68" cy="17" r="2" fill="${COLORS.white}" opacity="0.6"/>
    </g>`;
}

function headset(color) {
    return `
    <g transform="translate(64,64) rotate(30) translate(-64,-64)">
        <!-- Headset band -->
        <path d="M48,36 Q48,18 64,16 Q80,18 80,36" stroke="${color}" stroke-width="3" fill="none"/>
        <!-- Left ear cup -->
        <rect x="44" y="32" width="6" height="10" rx="2" fill="${color}"/>
        <!-- Right ear cup -->
        <rect x="78" y="32" width="6" height="10" rx="2" fill="${color}"/>
        <!-- Boom mic -->
        <path d="M44,39 L36,48 L38,52" stroke="${color}" stroke-width="2" fill="none" stroke-linecap="round"/>
        <circle cx="38" cy="53" r="3" fill="${color}"/>
    </g>`;
}

function blueprintRoll(color) {
    return `
    <!-- Clipboard with flowchart — foreground overlap -->
    <g transform="translate(22, 30)">
        <rect x="0" y="0" width="34" height="44" rx="3" fill="${color}" opacity="0.7" stroke="${color}" stroke-width="2"/>
        <!-- Clip -->
        <rect x="9" y="-4" width="16" height="6" rx="2.5" fill="${color}" opacity="0.95"/>
        <!-- Start node -->
        <rect x="9" y="6" width="16" height="7" rx="2" fill="${color}" opacity="0.9"/>
        <!-- Arrow down -->
        <line x1="17" y1="13" x2="17" y2="18" stroke="${color}" stroke-width="2"/>
        <!-- Diamond decision -->
        <polygon points="17,18 24,23 17,28 10,23" fill="${color}" opacity="0.75"/>
        <!-- Yes branch left -->
        <line x1="10" y1="23" x2="4" y2="23" stroke="${color}" stroke-width="1.5"/>
        <line x1="4" y1="23" x2="4" y2="32" stroke="${color}" stroke-width="1.5"/>
        <rect x="0" y="32" width="10" height="6" rx="1.5" fill="${color}" opacity="0.65"/>
        <!-- No branch right -->
        <line x1="24" y1="23" x2="30" y2="23" stroke="${color}" stroke-width="1.5"/>
        <line x1="30" y1="23" x2="30" y2="32" stroke="${color}" stroke-width="1.5"/>
        <rect x="24" y="32" width="10" height="6" rx="1.5" fill="${color}" opacity="0.65"/>
    </g>`;
}

function monocle(color) {
    return `
    <g transform="translate(64,64) rotate(30) translate(-64,-64)">
        <!-- Monocle on right side -->
        <circle cx="70" cy="38" r="6" fill="none" stroke="${color}" stroke-width="2"/>
        <!-- Chain -->
        <path d="M70,44 Q72,52 76,58" stroke="${color}" stroke-width="1" fill="none" opacity="0.6"/>
        <!-- Checklist beside -->
        <g transform="translate(92, 44)">
            <rect x="0" y="0" width="14" height="18" rx="2" fill="${color}" opacity="0.2" stroke="${color}" stroke-width="1"/>
            <line x1="3" y1="5" x2="11" y2="5" stroke="${color}" stroke-width="1"/>
            <line x1="3" y1="9" x2="11" y2="9" stroke="${color}" stroke-width="1"/>
            <line x1="3" y1="13" x2="9" y2="13" stroke="${color}" stroke-width="1"/>
        </g>
    </g>`;
}

function redPenReview(color) {
    return `
    <g transform="translate(64,64) rotate(30) translate(-64,-64)">
        <!-- Bold reading glasses -->
        <circle cx="56" cy="38" r="6" fill="none" stroke="${color}" stroke-width="2.5"/>
        <circle cx="72" cy="38" r="6" fill="none" stroke="${color}" stroke-width="2.5"/>
        <line x1="62" y1="38" x2="66" y2="38" stroke="${color}" stroke-width="2"/>
        <line x1="50" y1="38" x2="44" y2="35" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
        <line x1="78" y1="38" x2="84" y2="35" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
        <!-- Lens glint -->
        <circle cx="54" cy="36" r="1.5" fill="${COLORS.white}" opacity="0.3"/>
        <circle cx="70" cy="36" r="1.5" fill="${COLORS.white}" opacity="0.3"/>
    </g>
    <!-- Large checklist clipboard — fills right side -->
    <g transform="translate(74, 34)">
        <rect x="0" y="0" width="34" height="48" rx="3" fill="${color}" opacity="0.3" stroke="${color}" stroke-width="2"/>
        <rect x="9" y="-4" width="16" height="6" rx="2.5" fill="${color}" opacity="0.85"/>
        <!-- Check 1 -->
        <polyline points="4,10 8,14 15,6" stroke="${color}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>
        <line x1="18" y1="10" x2="30" y2="10" stroke="${color}" stroke-width="1.5" opacity="0.5"/>
        <!-- Check 2 -->
        <polyline points="4,22 8,26 15,18" stroke="${color}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>
        <line x1="18" y1="22" x2="30" y2="22" stroke="${color}" stroke-width="1.5" opacity="0.5"/>
        <!-- Pending 3 -->
        <rect x="4" y="32" width="9" height="6" rx="1" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.5"/>
        <line x1="18" y1="35" x2="28" y2="35" stroke="${color}" stroke-width="1.5" opacity="0.4"/>
        <!-- Red pen mark -->
        <line x1="4" y1="43" x2="20" y2="43" stroke="${COLORS.rose}" stroke-width="2" opacity="0.6" stroke-linecap="round"/>
    </g>`;
}

function shield(color) {
    return `
    <!-- Large shield — fills left side -->
    <g transform="translate(8, 44)">
        <path d="M0,-22 L28,-22 L28,4 Q28,22 14,30 Q0,22 0,4 Z" fill="${color}" opacity="0.85"/>
        <!-- Checkmark -->
        <polyline points="6,0 12,7 22,-7" stroke="${COLORS.white}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- Shield border highlight -->
        <path d="M2,-20 L26,-20 L26,3 Q26,19 14,26 Q2,19 2,3 Z" fill="none" stroke="${COLORS.white}" stroke-width="1" opacity="0.15"/>
    </g>
    <!-- Rejected X marks right side -->
    <g transform="translate(94, 72)">
        <g opacity="0.6">
            <line x1="-5" y1="-5" x2="5" y2="5" stroke="${COLORS.rose}" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="5" y1="-5" x2="-5" y2="5" stroke="${COLORS.rose}" stroke-width="2.5" stroke-linecap="round"/>
        </g>
        <g transform="translate(0, 16)" opacity="0.4">
            <line x1="-4" y1="-4" x2="4" y2="4" stroke="${COLORS.rose}" stroke-width="2" stroke-linecap="round"/>
            <line x1="4" y1="-4" x2="-4" y2="4" stroke="${COLORS.rose}" stroke-width="2" stroke-linecap="round"/>
        </g>
    </g>`;
}

function beret(color) {
    return `
    <g transform="translate(64,64) rotate(30) translate(-64,-64)">
        <!-- Beret -->
        <ellipse cx="64" cy="22" rx="14" ry="4" fill="${color}"/>
        <path d="M52,22 Q48,12 56,8 Q66,4 72,10 Q78,18 76,22 Z" fill="${color}"/>
        <!-- Beret nub -->
        <circle cx="58" cy="8" r="2" fill="${color}" opacity="0.7"/>
    </g>`;
}

function quillPen(color) {
    return `
    <g transform="translate(64,64) rotate(30) translate(-64,-64)">
        <!-- Quill held to the side -->
        <line x1="86" y1="36" x2="108" y2="14" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
        <!-- Feather -->
        <path d="M108,14 Q114,8 112,4 Q106,6 108,14" fill="${color}" opacity="0.6"/>
        <!-- Ink drip -->
        <circle cx="86" cy="38" r="1.5" fill="${color}" opacity="0.5"/>
    </g>`;
}

function documentarianKit(color) {
    return `
    <!-- Scroll bottom-left -->
    <g transform="translate(6, 56)">
        <rect x="4" y="0" width="30" height="26" rx="1" fill="${COLORS.amberLight}" opacity="0.7"/>
        <ellipse cx="19" cy="0" rx="17" ry="3.5" fill="${COLORS.amberLight}" opacity="0.9"/>
        <ellipse cx="19" cy="26" rx="17" ry="3.5" fill="${COLORS.amberLight}" opacity="0.8"/>
        <line x1="8" y1="7" x2="30" y2="7" stroke="${color}" stroke-width="1" opacity="0.4"/>
        <line x1="8" y1="12" x2="28" y2="12" stroke="${color}" stroke-width="1" opacity="0.4"/>
        <line x1="8" y1="17" x2="26" y2="17" stroke="${color}" stroke-width="1" opacity="0.4"/>
        <line x1="8" y1="22" x2="22" y2="22" stroke="${color}" stroke-width="1" opacity="0.3"/>
    </g>
    <!-- Large quill pen top-right -->
    <g transform="translate(96, 8) rotate(25)">
        <path d="M0,0 L-4,30 L0,28 L4,30 Z" fill="${COLORS.white}" opacity="0.9"/>
        <path d="M0,0 L-1.5,14 L1.5,14 Z" fill="${color}" opacity="0.3"/>
        <line x1="-3" y1="6" x2="0" y2="4" stroke="${color}" stroke-width="0.6" opacity="0.35"/>
        <line x1="3" y1="6" x2="0" y2="4" stroke="${color}" stroke-width="0.6" opacity="0.35"/>
        <line x1="-3.5" y1="12" x2="0" y2="9" stroke="${color}" stroke-width="0.6" opacity="0.35"/>
        <line x1="3.5" y1="12" x2="0" y2="9" stroke="${color}" stroke-width="0.6" opacity="0.35"/>
        <line x1="0" y1="28" x2="0" y2="34" stroke="${color}" stroke-width="1.5" opacity="0.6"/>
        <circle cx="2" cy="36" r="1.5" fill="${color}" opacity="0.4"/>
        <circle cx="-1" cy="38" r="1" fill="${color}" opacity="0.3"/>
    </g>`;
}

function typewriterKit(color) {
    return `
    <g transform="translate(64,64) rotate(30) translate(-64,-64)">
        <!-- Round reading glasses -->
        <circle cx="57" cy="36" r="5.5" fill="none" stroke="${color}" stroke-width="2"/>
        <circle cx="71" cy="36" r="5.5" fill="none" stroke="${color}" stroke-width="2"/>
        <line x1="62.5" y1="36" x2="65.5" y2="36" stroke="${color}" stroke-width="1.5"/>
        <line x1="51.5" y1="36" x2="46" y2="34" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="76.5" y1="36" x2="82" y2="34" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
    </g>
    <!-- Typewriter — foreground overlap -->
    <g transform="translate(52, 50)">
        <!-- Body -->
        <rect x="0" y="6" width="44" height="20" rx="3" fill="${color}" opacity="0.9"/>
        <!-- Paper roller -->
        <rect x="4" y="0" width="36" height="8" rx="2" fill="${color}" opacity="0.7"/>
        <!-- Paper coming out -->
        <rect x="8" y="-12" width="28" height="16" rx="1" fill="${COLORS.white}" opacity="0.85"/>
        <!-- Text on paper -->
        <line x1="11" y1="-8" x2="32" y2="-8" stroke="${color}" stroke-width="1.2" opacity="0.5"/>
        <line x1="11" y1="-4" x2="30" y2="-4" stroke="${color}" stroke-width="1.2" opacity="0.45"/>
        <line x1="11" y1="0" x2="28" y2="0" stroke="${color}" stroke-width="1.2" opacity="0.4"/>
        <!-- Keys row 1 -->
        <circle cx="8" cy="14" r="2" fill="#0f172a" opacity="0.5"/>
        <circle cx="14" cy="14" r="2" fill="#0f172a" opacity="0.5"/>
        <circle cx="20" cy="14" r="2" fill="#0f172a" opacity="0.5"/>
        <circle cx="26" cy="14" r="2" fill="#0f172a" opacity="0.5"/>
        <circle cx="32" cy="14" r="2" fill="#0f172a" opacity="0.5"/>
        <!-- Keys row 2 -->
        <circle cx="11" cy="20" r="2" fill="#0f172a" opacity="0.4"/>
        <circle cx="17" cy="20" r="2" fill="#0f172a" opacity="0.4"/>
        <circle cx="23" cy="20" r="2" fill="#0f172a" opacity="0.4"/>
        <circle cx="29" cy="20" r="2" fill="#0f172a" opacity="0.4"/>
    </g>`;
}

function cloudHalo(color) {
    return `
    <!-- Cloud cluster around rocket — bold and fluffy -->
    <!-- Top-left cloud -->
    <g opacity="0.7">
        <circle cx="28" cy="36" r="10" fill="${color}"/>
        <circle cx="40" cy="30" r="13" fill="${color}"/>
        <circle cx="52" cy="34" r="9" fill="${color}"/>
        <ellipse cx="40" cy="40" rx="15" ry="7" fill="${color}"/>
    </g>
    <!-- Right cloud -->
    <g opacity="0.6">
        <circle cx="86" cy="38" r="9" fill="${color}"/>
        <circle cx="96" cy="34" r="12" fill="${color}"/>
        <circle cx="106" cy="38" r="8" fill="${color}"/>
        <ellipse cx="96" cy="42" rx="13" ry="6" fill="${color}"/>
    </g>
    <!-- Bottom cloud -->
    <g opacity="0.5">
        <circle cx="48" cy="86" r="8" fill="${color}"/>
        <circle cx="58" cy="82" r="10" fill="${color}"/>
        <circle cx="68" cy="86" r="8" fill="${color}"/>
        <ellipse cx="58" cy="89" rx="13" ry="6" fill="${color}"/>
    </g>`;
}

function chatBubbles(color) {
    return `
    <!-- Chat/collab bubbles -->
    <g>
        <rect x="88" y="28" width="24" height="14" rx="6" fill="${color}" opacity="0.7"/>
        <polygon points="90,42 94,42 88,48" fill="${color}" opacity="0.7"/>
        <!-- Dots inside bubble -->
        <circle cx="95" cy="35" r="1.5" fill="${COLORS.white}"/>
        <circle cx="100" cy="35" r="1.5" fill="${COLORS.white}"/>
        <circle cx="105" cy="35" r="1.5" fill="${COLORS.white}"/>
        
        <rect x="6" y="58" width="20" height="12" rx="5" fill="${color}" opacity="0.5"/>
        <polygon points="24,70 20,70 26,76" fill="${color}" opacity="0.5"/>
    </g>`;
}

function m365Kit(color) {
    return `
    <g transform="translate(64,64) rotate(30) translate(-64,-64)">
        <!-- Headset band -->
        <path d="M50,34 Q50,18 64,16 Q78,18 78,34" stroke="${color}" stroke-width="3.5" fill="none"/>
        <!-- Left ear cup -->
        <rect x="45" y="30" width="7" height="10" rx="2.5" fill="${color}"/>
        <!-- Right ear cup -->
        <rect x="76" y="30" width="7" height="10" rx="2.5" fill="${color}"/>
    </g>
    <!-- Teams chat bubble — foreground overlap -->
    <g transform="translate(64, 48)">
        <rect x="0" y="0" width="40" height="24" rx="10" fill="${color}" opacity="0.9"/>
        <polygon points="4,24 12,24 2,34" fill="${color}" opacity="0.9"/>
        <!-- Dots -->
        <circle cx="12" cy="12" r="3" fill="${COLORS.white}" opacity="0.95"/>
        <circle cx="20" cy="12" r="3" fill="${COLORS.white}" opacity="0.95"/>
        <circle cx="28" cy="12" r="3" fill="${COLORS.white}" opacity="0.95"/>
    </g>`;
}

function binoculars(color) {
    return `
    <g transform="translate(64,64) rotate(30) translate(-64,-64)">
        <!-- Binoculars held up -->
        <circle cx="56" cy="38" r="5" fill="none" stroke="${color}" stroke-width="2.5"/>
        <circle cx="72" cy="38" r="5" fill="none" stroke="${color}" stroke-width="2.5"/>
        <rect x="60" y="35" width="8" height="6" rx="1" fill="${color}" opacity="0.5"/>
        <!-- Lens glint -->
        <circle cx="54" cy="36" r="1.5" fill="${COLORS.white}" opacity="0.4"/>
        <circle cx="70" cy="36" r="1.5" fill="${COLORS.white}" opacity="0.4"/>
    </g>`;
}

function researcherKit(color) {
    return `
    <g transform="translate(64,64) rotate(30) translate(-64,-64)">
        <!-- Fedora -->
        <path d="M42,24 Q44,28 54,28 Q64,29 74,28 Q84,28 86,24 Q84,22 74,21 Q64,20 54,21 Q44,22 42,24 Z" fill="${color}" opacity="0.85"/>
        <path d="M52,22 Q52,10 58,6 L64,4 L70,6 Q76,10 76,22 Z" fill="${color}"/>
        <path d="M56,10 Q60,14 64,10 Q68,14 72,10" stroke="${color}" stroke-width="1.5" fill="none" opacity="0.5"/>
        <rect x="52" y="19" width="24" height="3" rx="1" fill="#1a1a1a" opacity="0.6"/>
    </g>
    <!-- Notebook bottom-left -->
    <g transform="translate(6, 64)">
        <rect x="0" y="0" width="30" height="24" rx="2" fill="${color}" opacity="0.7"/>
        <line x1="7" y1="0" x2="7" y2="24" stroke="${COLORS.white}" stroke-width="1" opacity="0.2"/>
        <line x1="10" y1="5" x2="26" y2="5" stroke="${COLORS.white}" stroke-width="1" opacity="0.3"/>
        <line x1="10" y1="10" x2="24" y2="10" stroke="${COLORS.white}" stroke-width="1" opacity="0.25"/>
        <line x1="10" y1="15" x2="22" y2="15" stroke="${COLORS.white}" stroke-width="1" opacity="0.2"/>
        <circle cx="24" cy="20" r="4" fill="none" stroke="${COLORS.white}" stroke-width="1.5" opacity="0.3"/>
        <line x1="27" y1="23" x2="30" y2="26" stroke="${COLORS.white}" stroke-width="1.5" opacity="0.3" stroke-linecap="round"/>
    </g>
    <!-- Test tube — bigger, right side -->
    <g transform="translate(100, 42) rotate(15)">
        <rect x="-5" y="0" width="10" height="32" rx="5" fill="none" stroke="${color}" stroke-width="2.5" opacity="0.9"/>
        <rect x="-4" y="14" width="8" height="17" rx="4" fill="${color}" opacity="0.55"/>
        <rect x="-6" y="-3" width="12" height="5" rx="2" fill="${color}" opacity="0.7"/>
        <circle cx="0" cy="18" r="2" fill="${COLORS.white}" opacity="0.5"/>
        <circle cx="2" cy="24" r="1.5" fill="${COLORS.white}" opacity="0.35"/>
        <circle cx="-1" cy="12" r="1" fill="${COLORS.white}" opacity="0.3"/>
    </g>`;
}

function backpack(color) {
    return `
    <g transform="translate(64,64) rotate(30) translate(-64,-64)">
        <!-- Backpack on rocket's back -->
        <rect x="40" y="46" width="12" height="18" rx="4" fill="${color}" opacity="0.8"/>
        <!-- Straps -->
        <line x1="46" y1="46" x2="50" y2="38" stroke="${color}" stroke-width="1.5"/>
        <line x1="46" y1="46" x2="54" y2="42" stroke="${color}" stroke-width="1.5"/>
        <!-- Pocket -->
        <rect x="42" y="54" width="8" height="5" rx="2" fill="${color}" opacity="0.5"/>
    </g>`;
}

function brainGlow(color) {
    return `
    <g transform="translate(64,64) rotate(30) translate(-64,-64)">
        <!-- Brain aura around rocket head -->
        <ellipse cx="64" cy="30" rx="22" ry="18" fill="${color}" opacity="0.12"/>
        <ellipse cx="64" cy="30" rx="16" ry="13" fill="${color}" opacity="0.15"/>
        <!-- Synapse nodes -->
        <circle cx="48" cy="24" r="2" fill="${color}" opacity="0.6"/>
        <circle cx="80" cy="24" r="2" fill="${color}" opacity="0.6"/>
        <circle cx="54" cy="14" r="1.5" fill="${color}" opacity="0.5"/>
        <circle cx="74" cy="14" r="1.5" fill="${color}" opacity="0.5"/>
        <!-- Connection arcs -->
        <path d="M48,24 Q56,16 64,20" stroke="${color}" stroke-width="1" fill="none" opacity="0.3"/>
        <path d="M80,24 Q72,16 64,20" stroke="${color}" stroke-width="1" fill="none" opacity="0.3"/>
    </g>`;
}

function readingGlasses(color) {
    return `
    <g transform="translate(64,64) rotate(30) translate(-64,-64)">
        <!-- Reading glasses -->
        <circle cx="57" cy="38" r="5" fill="none" stroke="${color}" stroke-width="2"/>
        <circle cx="71" cy="38" r="5" fill="none" stroke="${color}" stroke-width="2"/>
        <line x1="62" y1="38" x2="66" y2="38" stroke="${color}" stroke-width="1.5"/>
        <!-- Temple arms -->
        <line x1="52" y1="38" x2="46" y2="36" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="76" y1="38" x2="82" y2="36" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
    </g>
    <!-- Small book below -->
    <g transform="translate(88, 80)">
        <rect x="0" y="0" width="18" height="14" rx="2" fill="${color}" opacity="0.6"/>
        <line x1="9" y1="0" x2="9" y2="14" stroke="${COLORS.white}" stroke-width="1" opacity="0.3"/>
        <!-- Page lines -->
        <line x1="2" y1="4" x2="7" y2="4" stroke="${COLORS.white}" stroke-width="0.7" opacity="0.3"/>
        <line x1="2" y1="7" x2="7" y2="7" stroke="${COLORS.white}" stroke-width="0.7" opacity="0.3"/>
    </g>`;
}

function threeRockets(color) {
    // Three mini rockets in formation (tab icon for Agents)
    return `
    <g opacity="0.5">
        <!-- Left wingman (smaller, behind) -->
        <g transform="translate(-18, 12) scale(0.5)">
            <g transform="translate(64,64) rotate(30) translate(-64,-64)">
                <path d="M64,14 C64,14 48,28 48,52 L48,80 L54,84 L54,76 L74,76 L74,84 L80,80 L80,52 C80,28 64,14 64,14 Z" fill="${color}" opacity="0.7"/>
                <polygon points="54,82 64,98 74,82" fill="${COLORS.flame}" opacity="0.6"/>
            </g>
        </g>
        <!-- Right wingman (smaller, behind) -->
        <g transform="translate(18, 12) scale(0.5)">
            <g transform="translate(64,64) rotate(30) translate(-64,-64)">
                <path d="M64,14 C64,14 48,28 48,52 L48,80 L54,84 L54,76 L74,76 L74,84 L80,80 L80,52 C80,28 64,14 64,14 Z" fill="${color}" opacity="0.7"/>
                <polygon points="54,82 64,98 74,82" fill="${COLORS.flame}" opacity="0.6"/>
            </g>
        </g>
    </g>`;
}

// Persona-specific simple props
function laptopProp(color) {
    return `<g transform="translate(72, 56)">
        <!-- Screen lid -->
        <rect x="0" y="0" width="40" height="28" rx="3" fill="${color}" opacity="0.85"/>
        <!-- Screen -->
        <rect x="3" y="3" width="34" height="21" rx="1.5" fill="#0f172a" opacity="0.9"/>
        <!-- Code lines — brighter -->
        <line x1="6" y1="7" x2="22" y2="7" stroke="#4ade80" stroke-width="1.5" opacity="0.8"/>
        <line x1="8" y1="11" x2="28" y2="11" stroke="#38bdf8" stroke-width="1.5" opacity="0.7"/>
        <line x1="8" y1="15" x2="20" y2="15" stroke="#a78bfa" stroke-width="1.5" opacity="0.6"/>
        <line x1="6" y1="19" x2="26" y2="19" stroke="#4ade80" stroke-width="1.5" opacity="0.5"/>
        <!-- Cursor blink -->
        <rect x="22" y="14" width="1.5" height="3" fill="#4ade80" opacity="0.9"/>
        <!-- Keyboard base -->
        <rect x="-3" y="28" width="46" height="5" rx="1.5" fill="${color}" opacity="0.55"/>
        <!-- Trackpad hint -->
        <rect x="13" y="29" width="14" height="3" rx="1" fill="${COLORS.white}" opacity="0.12"/>
    </g>`;
}

function gearProp(color) {
    // Big gear — 8 teeth
    const teeth = 8, outerR = 18, innerR = 13;
    let path1 = '';
    for (let i = 0; i < teeth; i++) {
        const a1 = (i / teeth) * 360 - (360 / teeth / 4);
        const a2 = (i / teeth) * 360 + (360 / teeth / 4);
        const a3 = ((i + 0.5) / teeth) * 360 - (360 / teeth / 4);
        const a4 = ((i + 0.5) / teeth) * 360 + (360 / teeth / 4);
        const rad = Math.PI / 180;
        const pts = [
            [outerR * Math.cos(a1 * rad), outerR * Math.sin(a1 * rad)],
            [outerR * Math.cos(a2 * rad), outerR * Math.sin(a2 * rad)],
            [innerR * Math.cos(a3 * rad), innerR * Math.sin(a3 * rad)],
            [innerR * Math.cos(a4 * rad), innerR * Math.sin(a4 * rad)],
        ];
        path1 += pts.map((p, j) => `${j === 0 && i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
    }
    path1 += 'Z';
    // Small interlocking gear — 6 teeth
    const teeth2 = 6, outerR2 = 10, innerR2 = 7;
    let path2 = '';
    for (let i = 0; i < teeth2; i++) {
        const a1 = (i / teeth2) * 360 - (360 / teeth2 / 4);
        const a2 = (i / teeth2) * 360 + (360 / teeth2 / 4);
        const a3 = ((i + 0.5) / teeth2) * 360 - (360 / teeth2 / 4);
        const a4 = ((i + 0.5) / teeth2) * 360 + (360 / teeth2 / 4);
        const rad = Math.PI / 180;
        const pts = [
            [outerR2 * Math.cos(a1 * rad), outerR2 * Math.sin(a1 * rad)],
            [outerR2 * Math.cos(a2 * rad), outerR2 * Math.sin(a2 * rad)],
            [innerR2 * Math.cos(a3 * rad), innerR2 * Math.sin(a3 * rad)],
            [innerR2 * Math.cos(a4 * rad), innerR2 * Math.sin(a4 * rad)],
        ];
        path2 += pts.map((p, j) => `${j === 0 && i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
    }
    path2 += 'Z';
    return `<!-- Big gear bottom-right -->
    <g transform="translate(86, 66)">
        <path d="${path1}" fill="${color}" opacity="0.85"/>
        <circle cx="0" cy="0" r="6" fill="#0f172a" opacity="0.8"/>
    </g>
    <!-- Small interlocking gear -->
    <g transform="translate(104, 82) rotate(22.5)">
        <path d="${path2}" fill="${color}" opacity="0.65"/>
        <circle cx="0" cy="0" r="3.5" fill="#0f172a" opacity="0.7"/>
    </g>
    <!-- Wrench top-left -->
    <g transform="translate(18, 24) rotate(-45)">
        <rect x="-2" y="0" width="4" height="22" rx="1.5" fill="${color}" opacity="0.6"/>
        <path d="M-5,-1 L-2,-1 L-2,-5 L-5,-5 Z" fill="${color}" opacity="0.55"/>
        <path d="M2,-1 L5,-1 L5,-5 L2,-5 Z" fill="${color}" opacity="0.55"/>
        <rect x="-5" y="-5" width="10" height="2" rx="1" fill="${color}" opacity="0.5"/>
    </g>`;
}

function labGoggles(color) {
    return `
    <g transform="translate(64,64) rotate(30) translate(-64,-64)">
        <!-- Goggles -->
        <rect x="52" y="33" width="12" height="10" rx="4" fill="none" stroke="${color}" stroke-width="2.5"/>
        <rect x="66" y="33" width="12" height="10" rx="4" fill="none" stroke="${color}" stroke-width="2.5"/>
        <line x1="64" y1="38" x2="66" y2="38" stroke="${color}" stroke-width="2"/>
        <!-- Strap -->
        <path d="M52,38 Q46,36 44,34" stroke="${color}" stroke-width="2" fill="none"/>
        <path d="M78,38 Q84,36 86,34" stroke="${color}" stroke-width="2" fill="none"/>
    </g>
    <!-- Flask — foreground overlap -->
    <g transform="translate(66, 40)">
        <path d="M8,0 L8,16 L-4,34 L24,34 L14,16 L14,0 Z" fill="${color}" opacity="0.85" stroke="${color}" stroke-width="1.5"/>
        <rect x="4" y="-5" width="16" height="6" rx="2.5" fill="${color}" opacity="0.8"/>
        <!-- Bubbles -->
        <circle cx="8" cy="24" r="3" fill="${COLORS.white}" opacity="0.5"/>
        <circle cx="14" cy="18" r="2.5" fill="${COLORS.white}" opacity="0.4"/>
        <circle cx="10" cy="12" r="2" fill="${COLORS.white}" opacity="0.35"/>
    </g>`;
}

function chartOverlay(color) {
    return `<!-- Large chart panel bottom-right -->
    <g transform="translate(66, 38)">
        <rect x="0" y="0" width="44" height="40" rx="3" fill="${color}" opacity="0.15" stroke="${color}" stroke-width="1.5"/>
        <!-- Bar chart — taller -->
        <rect x="4" y="24" width="8" height="13" fill="${color}" opacity="0.6"/>
        <rect x="14" y="16" width="8" height="21" fill="${color}" opacity="0.7"/>
        <rect x="24" y="6" width="8" height="31" fill="${color}" opacity="0.85"/>
        <rect x="34" y="18" width="7" height="19" fill="${color}" opacity="0.7"/>
        <!-- Trend line -->
        <polyline points="8,21 18,12 28,4 37,15" fill="none" stroke="${COLORS.white}" stroke-width="2" opacity="0.5"/>
    </g>
    <!-- Data nodes — foreground overlap left -->
    <g transform="translate(22, 30)">
        <circle cx="0" cy="0" r="7" fill="${color}" opacity="0.55"/>
        <circle cx="16" cy="18" r="6" fill="${color}" opacity="0.45"/>
        <circle cx="-2" cy="36" r="5" fill="${color}" opacity="0.5"/>
        <line x1="5" y1="5" x2="12" y2="14" stroke="${color}" stroke-width="2" opacity="0.35"/>
        <line x1="13" y1="22" x2="1" y2="32" stroke="${color}" stroke-width="2" opacity="0.3"/>
        <line x1="0" y1="7" x2="-1" y2="31" stroke="${color}" stroke-width="1.5" opacity="0.2"/>
    </g>`;
}

function designKit(color) {
    return `
    <!-- Color palette bottom-right -->
    <g transform="translate(76, 60)">
        <!-- Palette body -->
        <path d="M16,0 Q32,-2 34,12 Q36,26 22,30 Q10,34 2,26 Q-4,18 0,8 Q2,0 16,0Z" fill="${color}" opacity="0.8"/>
        <!-- Thumb hole -->
        <ellipse cx="10" cy="20" rx="4" ry="5" fill="${COLORS.bgDark}" opacity="0.9"/>
        <!-- Paint dots -->
        <circle cx="14" cy="6" r="3.5" fill="#f43f5e"/>
        <circle cx="24" cy="5" r="3" fill="#facc15"/>
        <circle cx="30" cy="12" r="3" fill="#4ade80"/>
        <circle cx="28" cy="22" r="3" fill="#38bdf8"/>
        <circle cx="18" cy="14" r="2.5" fill="#c084fc"/>
    </g>`;
}

function spotlight(color) {
    return `
    <!-- Spotlight beam -->
    <g opacity="0.25">
        <polygon points="64,20 40,100 88,100" fill="${color}"/>
    </g>
    <!-- Stage mic -->
    <g transform="translate(96, 72)">
        <circle cx="0" cy="0" r="5" fill="${color}" opacity="0.7"/>
        <line x1="0" y1="5" x2="0" y2="18" stroke="${color}" stroke-width="2"/>
        <line x1="-4" y1="18" x2="4" y2="18" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
    </g>`;
}

function paintbrushCanvas(color) {
    return `
    <!-- Canvas on easel bottom-left -->
    <g transform="translate(4, 52)">
        <!-- Easel legs -->
        <line x1="4" y1="36" x2="0" y2="50" stroke="${color}" stroke-width="1.5" opacity="0.5"/>
        <line x1="28" y1="36" x2="32" y2="50" stroke="${color}" stroke-width="1.5" opacity="0.5"/>
        <!-- Canvas frame -->
        <rect x="2" y="4" width="28" height="32" rx="1" fill="#1e293b" stroke="${color}" stroke-width="1.5" opacity="0.8"/>
        <!-- Color splashes on canvas -->
        <circle cx="10" cy="14" r="4" fill="#f43f5e" opacity="0.6"/>
        <circle cx="22" cy="12" r="3.5" fill="#38bdf8" opacity="0.6"/>
        <circle cx="16" cy="24" r="5" fill="#facc15" opacity="0.5"/>
        <circle cx="24" cy="28" r="3" fill="#4ade80" opacity="0.5"/>
        <circle cx="8" cy="30" r="2.5" fill="${color}" opacity="0.5"/>
    </g>
    <!-- Paintbrush held top-right -->
    <g transform="translate(96, 16) rotate(30)">
        <!-- Brush handle -->
        <rect x="-2" y="0" width="4" height="22" rx="1.5" fill="${color}" opacity="0.8"/>
        <!-- Ferrule -->
        <rect x="-2.5" y="22" width="5" height="4" rx="0.5" fill="#94a3b8" opacity="0.6"/>
        <!-- Bristles -->
        <path d="M-3,26 Q0,34 3,26" fill="#f43f5e" opacity="0.8"/>
    </g>`;
}

function briefcase(color) {
    return `<!-- Large briefcase bottom-right -->
    <g transform="translate(60, 46)">
        <rect x="0" y="10" width="46" height="34" rx="6" fill="${color}" opacity="0.85"/>
        <path d="M14,10 L14,2 L32,2 L32,10" stroke="${color}" stroke-width="3" fill="none"/>
        <rect x="17" y="22" width="12" height="6" rx="2" fill="${COLORS.white}" opacity="0.35"/>
        <line x1="5" y1="30" x2="41" y2="30" stroke="${COLORS.white}" stroke-width="1" opacity="0.2"/>
        <!-- Document peeking out -->
        <rect x="8" y="4" width="16" height="10" rx="1" fill="${COLORS.white}" opacity="0.25"/>
        <line x1="10" y1="7" x2="20" y2="7" stroke="${color}" stroke-width="0.8" opacity="0.15"/>
        <line x1="10" y1="10" x2="18" y2="10" stroke="${color}" stroke-width="0.8" opacity="0.12"/>
    </g>
    <!-- Small chart top-left -->
    <g transform="translate(8, 18)">
        <rect x="0" y="0" width="28" height="22" rx="2" fill="${color}" opacity="0.35" stroke="${color}" stroke-width="1.5"/>
        <polyline points="4,18 10,10 16,13 24,4" fill="none" stroke="${color}" stroke-width="2" opacity="0.6" stroke-linecap="round"/>
    </g>`;
}

function calculator(color) {
    return `<!-- Large calculator bottom-right -->
    <g transform="translate(70, 42)">
        <rect x="0" y="0" width="34" height="46" rx="4" fill="${color}" opacity="0.8"/>
        <rect x="3" y="3" width="28" height="12" rx="2" fill="#0a2e0a" opacity="0.6"/>
        <text x="28" y="12" font-size="8" fill="#4ade80" font-family="monospace" text-anchor="end" opacity="0.8">$1,024</text>
        ${[0,1,2,3].map(r => [0,1,2].map(c =>
            `<rect x="${3+c*10}" y="${18+r*7}" width="8" height="5.5" rx="1" fill="${COLORS.white}" opacity="0.25"/>`
        ).join('')).join('')}
    </g>
    <!-- Coins stack top-left -->
    <g transform="translate(12, 20)">
        <ellipse cx="10" cy="18" rx="11" ry="3.5" fill="${color}" opacity="0.45"/>
        <ellipse cx="10" cy="14" rx="11" ry="3.5" fill="${color}" opacity="0.55"/>
        <ellipse cx="10" cy="10" rx="11" ry="3.5" fill="${color}" opacity="0.65"/>
        <ellipse cx="10" cy="6" rx="11" ry="3.5" fill="${color}" opacity="0.75"/>
        <text x="10" y="9" font-size="7" fill="${COLORS.white}" font-family="sans-serif" text-anchor="middle" opacity="0.5">$</text>
    </g>`;
}

function compass(color) {
    return `
    <!-- Roadmap clipboard — foreground overlap -->
    <g transform="translate(58, 36)">
        <rect x="0" y="0" width="38" height="46" rx="3" fill="${color}" opacity="0.7" stroke="${color}" stroke-width="2"/>
        <!-- Clip at top -->
        <rect x="9" y="-4" width="20" height="7" rx="3" fill="${color}" opacity="0.95"/>
        <!-- Milestone dots with connecting line (roadmap timeline) -->
        <line x1="10" y1="8" x2="10" y2="40" stroke="${COLORS.white}" stroke-width="2" opacity="0.3"/>
        <!-- Done (green check) -->
        <circle cx="10" cy="13" r="4" fill="${COLORS.green}" opacity="0.95"/>
        <line x1="16" y1="13" x2="32" y2="13" stroke="${COLORS.white}" stroke-width="2" opacity="0.5"/>
        <!-- In progress (amber) -->
        <circle cx="10" cy="24" r="4" fill="${COLORS.amberLight}" opacity="0.9"/>
        <line x1="16" y1="24" x2="29" y2="24" stroke="${COLORS.white}" stroke-width="2" opacity="0.4"/>
        <!-- Upcoming (outline) -->
        <circle cx="10" cy="35" r="4" fill="none" stroke="${COLORS.white}" stroke-width="2" opacity="0.4"/>
        <line x1="16" y1="35" x2="26" y2="35" stroke="${COLORS.white}" stroke-width="2" opacity="0.3"/>
    </g>`;
}

function megaphone(color) {
    return `
    <!-- Megaphone — foreground overlap -->
    <g transform="translate(56, 48) rotate(-15)">
        <!-- Bell / cone -->
        <path d="M14,0 L46,-18 L46,18 Z" fill="${color}" opacity="0.9"/>
        <!-- Bell rim -->
        <ellipse cx="46" cy="0" rx="4" ry="18" fill="${color}" opacity="0.75"/>
        <!-- Handle grip -->
        <rect x="0" y="-6" width="16" height="12" rx="3" fill="${color}" opacity="0.95"/>
        <!-- Sound waves -->
        <path d="M51,-14 Q62,0 51,14" stroke="${color}" stroke-width="3" fill="none" opacity="0.7"/>
        <path d="M58,-20 Q70,0 58,20" stroke="${color}" stroke-width="2.5" fill="none" opacity="0.5"/>
    </g>`;
}

function chalkboard(color) {
    return `
    ${graduationCap(color)}`;
}

function stethoscope(color) {
    return `
    <!-- Large stethoscope — fills right side -->
    <g transform="translate(66, 30)">
        <circle cx="0" cy="0" r="4" fill="${color}" opacity="0.9"/>
        <circle cx="30" cy="0" r="4" fill="${color}" opacity="0.9"/>
        <path d="M0,4 Q-4,22 10,34 Q16,40 16,46" stroke="${color}" stroke-width="3" fill="none"/>
        <path d="M30,4 Q34,22 20,34 Q16,40 16,46" stroke="${color}" stroke-width="3" fill="none"/>
        <circle cx="16" cy="52" r="9" fill="${color}" opacity="0.9"/>
        <circle cx="16" cy="52" r="4" fill="${COLORS.white}" opacity="0.25"/>
    </g>
    <!-- Heart + ECG top-left -->
    <g transform="translate(20, 30)">
        <path d="M0,-6 Q-9,-16 -13,-6 Q-13,2 0,12 Q13,2 13,-6 Q9,-16 0,-6" fill="${color}" opacity="0.65"/>
        <polyline points="-15,0 -7,0 -4,-7 0,9 4,-7 7,0 15,0" stroke="${COLORS.white}" stroke-width="1.5" fill="none" opacity="0.5" stroke-linecap="round" stroke-linejoin="round"/>
    </g>`;
}

function balanceScale(color) {
    return `<!-- Large balance scale — fills left side -->
    <g transform="translate(32, 32)">
        <line x1="0" y1="-16" x2="0" y2="14" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
        <rect x="-10" y="12" width="20" height="4" rx="2" fill="${color}" opacity="0.8"/>
        <line x1="-20" y1="-14" x2="20" y2="-14" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
        <polygon points="-5,-16 5,-16 0,-22" fill="${color}" opacity="0.9"/>
        <line x1="-20" y1="-14" x2="-20" y2="-4" stroke="${color}" stroke-width="2"/>
        <path d="M-26,-4 Q-20,0 -14,-4" stroke="${color}" stroke-width="2" fill="${color}" opacity="0.3"/>
        <line x1="20" y1="-14" x2="20" y2="-4" stroke="${color}" stroke-width="2"/>
        <path d="M14,-4 Q20,0 26,-4" stroke="${color}" stroke-width="2" fill="${color}" opacity="0.3"/>
    </g>
    <!-- Gavel bottom-right -->
    <g transform="translate(96, 78) rotate(-20)">
        <rect x="-2" y="0" width="4" height="18" rx="1.5" fill="${color}" opacity="0.6"/>
        <rect x="-8" y="-4" width="16" height="6" rx="2" fill="${color}" opacity="0.8"/>
    </g>`;
}

function heartBadge(color) {
    return `
    <!-- Large heart — foreground overlap -->
    <g transform="translate(70, 30)">
        <path d="M0,-12 Q-16,-28 -24,-12 Q-24,4 0,22 Q24,4 24,-12 Q16,-28 0,-12" fill="${color}" opacity="0.9"/>
        <!-- Heart highlight -->
        <path d="M-10,-10 Q-14,-18 -18,-10" stroke="${COLORS.white}" stroke-width="2" fill="none" opacity="0.25"/>
    </g>
    <!-- Community people silhouettes -->
    <g transform="translate(56, 64)" opacity="0.85">
        <!-- Person left -->
        <circle cx="0" cy="0" r="6" fill="${color}"/>
        <path d="M-8,7 Q0,12 8,7 L8,14 L-8,14 Z" fill="${color}" opacity="0.8"/>
        <!-- Person center -->
        <circle cx="20" cy="-3" r="6" fill="${color}"/>
        <path d="M12,4 Q20,9 28,4 L28,11 L12,11 Z" fill="${color}" opacity="0.8"/>
        <!-- Person right -->
        <circle cx="40" cy="0" r="6" fill="${color}"/>
        <path d="M32,7 Q40,12 48,7 L48,14 L32,14 Z" fill="${color}" opacity="0.8"/>
    </g>`;
}

function orgChart(color) {
    return `<!-- Large org chart — fills left side -->
    <g transform="translate(30, 36)">
        <rect x="-8" y="-12" width="16" height="12" rx="3" fill="${color}" opacity="0.95"/>
        <circle cx="0" cy="-18" r="4" fill="${color}" opacity="0.8"/>
        <line x1="0" y1="0" x2="0" y2="8" stroke="${color}" stroke-width="2.5"/>
        <line x1="-18" y1="8" x2="18" y2="8" stroke="${color}" stroke-width="2.5"/>
        <line x1="-18" y1="8" x2="-18" y2="16" stroke="${color}" stroke-width="2.5"/>
        <line x1="0" y1="8" x2="0" y2="16" stroke="${color}" stroke-width="2.5"/>
        <line x1="18" y1="8" x2="18" y2="16" stroke="${color}" stroke-width="2.5"/>
        <rect x="-24" y="16" width="14" height="11" rx="3" fill="${color}" opacity="0.7"/>
        <rect x="-7" y="16" width="14" height="11" rx="3" fill="${color}" opacity="0.7"/>
        <rect x="11" y="16" width="14" height="11" rx="3" fill="${color}" opacity="0.7"/>
        <line x1="0" y1="-24" x2="0" y2="-30" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
        <polyline points="-5,-26 0,-30 5,-26" stroke="${color}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </g>`;
}

function typewriterKeys(color) {
    return `<g transform="translate(86, 68)">
        <rect x="0" y="0" width="24" height="18" rx="3" fill="${color}" opacity="0.6"/>
        <!-- Key rows -->
        ${[0,1,2].map(r => [0,1,2,3].map(c => 
            `<rect x="${2+c*5.5}" y="${2+r*5.5}" width="4" height="4" rx="1" fill="${COLORS.white}" opacity="0.2"/>`
        ).join('')).join('')}
        <!-- Paper coming out -->
        <rect x="4" y="-8" width="16" height="10" rx="1" fill="${COLORS.white}" opacity="0.15"/>
    </g>`;
}

// ── Icon Definitions ──────────────────────────────────────────────────

const ICON_GROUPS = {
    // Tab bar uses text labels per approved mockups — no rocket icons needed.
    states: {
        label: 'Cognitive State Icons',
        icons: [
            { slug: 'building', label: 'Building', angle: 10, accessory: (id) => constructionSite(COLORS.indigo) },
            { slug: 'debugging', label: 'Debugging', angle: -15, accessory: (id) => detectiveHat(COLORS.rose) + magnifyingGlass(COLORS.rose) },
            { slug: 'planning', label: 'Planning', angle: 5, accessory: (id) => blueprintRoll(COLORS.blue) },
            { slug: 'reviewing', label: 'Reviewing', angle: -10, accessory: (id) => redPenReview(COLORS.teal) },
            { slug: 'learning', label: 'Learning', angle: 0, accessory: (id) => learningKit(COLORS.green) },
            { slug: 'teaching', label: 'Teaching', angle: 15, accessory: (id) => professorPointer(COLORS.amber) },
            { slug: 'meditation', label: 'Meditation', angle: -20, accessory: (id) => zenHeadband(COLORS.emerald) + lotusGlow(COLORS.emerald) },
            { slug: 'dream', label: 'Dream', angle: -25, accessory: (id) => sleepingMask(COLORS.violet) },
            { slug: 'discovery', label: 'Discovery', angle: 20, accessory: (id) => explorerHat(COLORS.gold) },
        ],
    },
    agents: {
        label: 'Agent Mode Icons',
        icons: [
            { slug: 'alex', label: 'Alex', angle: 0, accessory: () => ideaLightbulb(COLORS.gold) },
            { slug: 'researcher', label: 'Researcher', angle: -10, accessory: (id) => researcherKit(COLORS.blue) },
            { slug: 'builder', label: 'Builder', angle: 15, accessory: (id) => hardHat(COLORS.green) },
            { slug: 'validator', label: 'Validator', angle: -15, accessory: (id) => shield(COLORS.rose) },
            { slug: 'documentarian', label: 'Documentarian', angle: 5, accessory: (id) => documentarianKit(COLORS.amber) },
            { slug: 'azure', label: 'Azure', angle: 10, accessory: (id) => cloudHalo(COLORS.sky) },
            { slug: 'm365', label: 'M365', angle: -5, accessory: (id) => m365Kit(COLORS.coral) },
        ],
    },
    personas: {
        label: 'Persona Category Icons',
        icons: [
            { slug: 'software', label: 'Software', angle: 0, accessory: (id) => laptopProp(COLORS.indigo) },
            { slug: 'engineering', label: 'Engineering', angle: 10, accessory: (id) => gearProp(COLORS.blue) },
            { slug: 'science', label: 'Science', angle: -10, accessory: (id) => labGoggles(COLORS.teal) },
            { slug: 'data', label: 'Data', angle: 5, accessory: (id) => chartOverlay(COLORS.cyan) },
            { slug: 'design', label: 'Design', angle: 15, accessory: (id) => designKit(COLORS.purple) },
            { slug: 'creative', label: 'Creative', angle: -15, accessory: (id) => paintbrushCanvas(COLORS.violet) },
            { slug: 'documentation', label: 'Documentation', angle: -5, accessory: (id) => typewriterKit(COLORS.amber) },
            { slug: 'business', label: 'Business', angle: 0, accessory: (id) => briefcase(COLORS.slate) },
            { slug: 'finance', label: 'Finance', angle: -10, accessory: (id) => calculator(COLORS.green) },
            { slug: 'product', label: 'Product', angle: 10, accessory: (id) => compass(COLORS.orange) },
            { slug: 'marketing', label: 'Marketing', angle: 15, accessory: (id) => megaphone(COLORS.coral) },
            { slug: 'education', label: 'Education', angle: -5, accessory: (id) => educationKit(COLORS.emerald) },
            { slug: 'healthcare', label: 'Healthcare', angle: 5, accessory: (id) => stethoscope(COLORS.red) },
            { slug: 'legal', label: 'Legal', angle: -15, accessory: (id) => balanceScale(COLORS.gold) },
            { slug: 'people', label: 'People', angle: 0, accessory: (id) => heartBadge(COLORS.pink) },
            { slug: 'career', label: 'Career', angle: 20, accessory: (id) => orgChart(COLORS.sky) },
        ],
    },
    default: {
        label: 'Default Icon',
        icons: [
            { slug: 'default', label: 'Default', angle: 0, accessory: () => '' },
        ],
    },
};

// ── Generator ─────────────────────────────────────────────────────────

function generateSvg(groupKey, icon) {
    const id = `${groupKey}_${icon.slug}`.replace(/[^a-zA-Z0-9_]/g, '_');
    const accessoryContent = icon.accessory(id);
    return svgWrap(id, accessoryContent, 128, icon.angle || 0);
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function generateAll() {
    ensureDir(OUTPUT_DIR);

    const report = { generated: 0, groups: {} };

    for (const [groupKey, group] of Object.entries(ICON_GROUPS)) {
        if (ONLY && !ONLY.has(groupKey)) continue;

        const groupDir = path.join(OUTPUT_DIR, groupKey);
        ensureDir(groupDir);
        report.groups[groupKey] = { label: group.label, count: 0, icons: [] };

        for (const icon of group.icons) {
            const svg = generateSvg(groupKey, icon);
            const outPath = path.join(groupDir, `${icon.slug}.svg`);
            fs.writeFileSync(outPath, svg, 'utf-8');
            report.generated++;
            report.groups[groupKey].count++;
            report.groups[groupKey].icons.push(icon.slug);
            console.log(`  ✓ ${groupKey}/${icon.slug}.svg`);
        }
    }

    // Write generation report
    const reportPath = path.join(OUTPUT_DIR, 'generation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
    console.log(`\n✅ Generated ${report.generated} rocket character icons`);
    console.log(`📁 Output: ${OUTPUT_DIR}`);

    if (PREVIEW) {
        generatePreview(report);
    }
}

function generatePreview(report) {
    const rows = [];

    for (const [groupKey, group] of Object.entries(ICON_GROUPS)) {
        if (ONLY && !ONLY.has(groupKey)) continue;

        rows.push(`<h2>${group.label}</h2>`);
        rows.push('<div style="display:flex;flex-wrap:wrap;gap:16px;margin-bottom:32px;">');

        for (const icon of group.icons) {
            const svgPath = `${groupKey}/${icon.slug}.svg`;
            rows.push(`
                <div style="text-align:center;width:140px;">
                    <img src="${svgPath}" width="96" height="96" style="border:1px solid #333;border-radius:8px;background:#1e1e1e;padding:4px;" />
                    <div style="font-size:11px;color:#ccc;margin-top:4px;">${icon.label}</div>
                </div>`);
        }

        rows.push('</div>');
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Rocket Character Icons — Preview</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; background: #181818; color: #eee; padding: 32px; max-width: 1200px; margin: 0 auto; }
        h1 { color: #818cf8; font-weight: 300; }
        h2 { color: #94a3b8; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #333; padding-bottom: 8px; }
    </style>
</head>
<body>
    <h1>🚀 Alex Rocket Character Icon System</h1>
    <p style="color:#94a3b8;">33 icons, one character, infinite personality. Every icon is the Alex blue rocket wearing a different accessory — rotated for variety.</p>
    ${rows.join('\n')}
</body>
</html>`;

    const previewPath = path.join(OUTPUT_DIR, 'preview.html');
    fs.writeFileSync(previewPath, html, 'utf-8');
    console.log(`🔍 Preview: ${previewPath}`);
}

// ── Run ───────────────────────────────────────────────────────────────
console.log('🚀 Generating Alex Rocket Character Icons...\n');
generateAll();
