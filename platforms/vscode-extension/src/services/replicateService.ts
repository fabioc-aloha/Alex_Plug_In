/**
 * Replicate Image Generation Service
 *
 * Provides a unified interface for generating images via Replicate's model-based API.
 * All models are addressed by owner/name (latest version auto-resolved) — no hardcoded
 * version hashes that become stale.
 *
 * Model catalog sourced from: .github/skills/image-handling/SKILL.md (Replicate Model Selection)
 * ADR reference: alex_docs/decisions/ADR-007-image-generation.md
 */

import * as https from 'https';
import * as vscode from 'vscode';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ReplicatePrediction {
    id: string;
    status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
    output?: string | string[];
    error?: string;
    urls?: { cancel?: string; get?: string; web?: string };
}

export interface ReplicateModel {
    /** Replicate model identifier in `owner/name` format */
    id: string;
    /** Human-readable display name */
    label: string;
    /** Approximate cost per image */
    cost: string;
    /** Primary use case */
    bestFor: string;
    /** Activation keywords that map user intent to this model */
    keywords: string[];
    /** Whether this model supports LoRA fine-tuning */
    supportsLora: boolean;
    /** Whether this model reliably renders text inside images */
    textRendering: boolean;
}

export interface GenerateImageOptions {
    /** Text prompt describing the desired image */
    prompt: string;
    /** Aspect ratio string e.g. "1:1", "16:9" */
    aspectRatio?: string;
    /** Output format (default: png) */
    outputFormat?: 'png' | 'jpg' | 'webp';
    /** Number of inference steps (model-dependent) */
    numInferenceSteps?: number;
    /** Negative prompt (not supported by all models) */
    negativePrompt?: string;
    /** Guidance scale — creativity vs. fidelity */
    guidanceScale?: number;
    /** Image width in pixels */
    width?: number;
    /** Image height in pixels */
    height?: number;
}

// ---------------------------------------------------------------------------
// Model Catalog
// ---------------------------------------------------------------------------

/**
 * Canonical Replicate model catalog for Alex image generation.
 * Ordered from cheapest to most expensive for display in quick-pick.
 *
 * When adding a new model:
 * 1. Verify the model ID via `replicate.com/explore` or the MCP Replicate tool
 * 2. Add descriptive keywords so intent-based routing can select it
 * 3. Update .github/skills/image-handling/SKILL.md Replicate Model Selection table
 */
export const REPLICATE_MODELS: Record<string, ReplicateModel> = {
    sdxl: {
        id: 'stability-ai/sdxl',
        label: 'SDXL',
        cost: '$0.009',
        bestFor: 'Classic diffusion quality, LoRA fine-tuning, artistic styles',
        keywords: ['sdxl', 'stable diffusion', 'stability', 'artistic', 'lora', 'fine-tune', 'classic'],
        supportsLora: true,
        textRendering: false
    },
    fluxSchnell: {
        id: 'black-forest-labs/flux-schnell',
        label: 'Flux Schnell',
        cost: '$0.003',
        bestFor: 'Fast prototyping and exploration — ~4 inference steps',
        keywords: ['schnell', 'flux schnell', 'fast', 'quick', 'prototype', 'draft', 'iterate', 'cheap', 'test'],
        supportsLora: false,
        textRendering: false
    },
    fluxDev: {
        id: 'black-forest-labs/flux-dev',
        label: 'Flux Dev',
        cost: '$0.025',
        bestFor: 'High-quality generation with LoRA support',
        keywords: ['flux dev', 'flux', 'high quality', 'detailed', 'lora', 'realistic', 'photorealistic'],
        supportsLora: true,
        textRendering: false
    },
    ideogramTurbo: {
        id: 'ideogram-ai/ideogram-v2-turbo',
        label: 'Ideogram v2 Turbo',
        cost: '$0.05',
        bestFor: 'Fast text-in-image generation — logos, banners, typography',
        keywords: ['ideogram turbo', 'fast text', 'logo fast', 'banner quick', 'typography fast', 'text fast'],
        supportsLora: false,
        textRendering: true
    },
    fluxPro: {
        id: 'black-forest-labs/flux-1.1-pro',
        label: 'Flux 1.1 Pro',
        cost: '$0.04',
        bestFor: 'Production-quality photorealistic images',
        keywords: ['flux pro', 'flux 1.1', 'production', 'professional', 'best quality', 'photorealistic', 'photo'],
        supportsLora: false,
        textRendering: false
    },
    ideogram: {
        id: 'ideogram-ai/ideogram-v2',
        label: 'Ideogram v2',
        cost: '$0.08',
        bestFor: 'Best-in-class text rendering — signage, typography, badges',
        keywords: [
            'ideogram', 'text in image', 'image with text', 'text rendering', 'sign',
            'badge', 'label', 'typography', 'word', 'letter', 'font', 'title overlay',
            'caption', 'subtitle', 'overlay text', 'inscription', 'diagram with text',
            'chart label', 'poster', 'card', 'banner'
        ],
        supportsLora: false,
        textRendering: true
    },
    seedream: {
        id: 'bytedance/seedream-5-lite',
        label: 'Seedream 5 Lite',
        cost: 'varies',
        bestFor: 'High-resolution 2K/3K outputs with visual reasoning',
        keywords: ['seedream', 'bytedance', '2k', '3k', 'high resolution', 'large', 'upscale', 'cinematic'],
        supportsLora: false,
        textRendering: true
    }
};

/**
 * Ordered list for Quick Pick display (cheapest first, then specialty models last).
 */
export const REPLICATE_MODEL_QUICK_PICK_ORDER: (keyof typeof REPLICATE_MODELS)[] = [
    'sdxl', 'fluxSchnell', 'fluxDev', 'fluxPro', 'ideogramTurbo', 'ideogram', 'seedream'
];

// ---------------------------------------------------------------------------
// Model Selection Intelligence
// ---------------------------------------------------------------------------

/**
 * Select the best Replicate model for the given prompt/intent.
 *
 * Resolution order:
 * 1. Text-in-image signals → Ideogram v2 (or Turbo for speed)
 * 2. Speed/prototype signals → Flux Schnell
 * 3. LoRA / fine-tune signals → Flux Dev or SDXL
 * 4. Production/professional signals → Flux 1.1 Pro
 * 5. High-resolution / cinematic → Seedream 5 Lite
 * 6. Default → Flux Dev (best balance of quality + cost)
 */
export function selectModelForPrompt(prompt: string, preferSpeed?: boolean): ReplicateModel {
    const lower = prompt.toLowerCase();

    // Text-in-image is a strong signal — Ideogram is best-in-class
    const textKeywords = REPLICATE_MODELS.ideogram.keywords;
    if (textKeywords.some(kw => lower.includes(kw))) {
        return preferSpeed ? REPLICATE_MODELS.ideogramTurbo : REPLICATE_MODELS.ideogram;
    }

    // Speed / prototyping
    if (['fast', 'quick', 'draft', 'prototype', 'test', 'iterate', 'cheap'].some(kw => lower.includes(kw))) {
        return REPLICATE_MODELS.fluxSchnell;
    }

    // High resolution
    if (['2k', '3k', 'cinematic', 'high resolution', 'large'].some(kw => lower.includes(kw))) {
        return REPLICATE_MODELS.seedream;
    }

    // Production / professional
    if (['production', 'professional', 'photo', 'photorealistic'].some(kw => lower.includes(kw))) {
        return REPLICATE_MODELS.fluxPro;
    }

    // Artistic / LoRA
    if (['artistic', 'art style', 'lora', 'fine-tune', 'stable diffusion'].some(kw => lower.includes(kw))) {
        return REPLICATE_MODELS.sdxl;
    }

    // Default: Flux Dev is the best balance of quality and cost
    return REPLICATE_MODELS.fluxDev;
}

// ---------------------------------------------------------------------------
// API Client
// ---------------------------------------------------------------------------

/**
 * Create a prediction via the model-based endpoint (`/v1/models/{owner}/{name}/predictions`).
 * Uses `Prefer: wait` header — Replicate resolves fast models (e.g. Flux Schnell) synchronously.
 * Falls back to polling for models that exceed the wait timeout.
 */
export async function createPrediction(
    apiToken: string,
    modelId: string,
    input: Record<string, unknown>
): Promise<ReplicatePrediction> {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify({ input });

        const options: https.RequestOptions = {
            hostname: 'api.replicate.com',
            port: 443,
            path: `/v1/models/${modelId}/predictions`,
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiToken}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body),
                Prefer: 'wait'
            }
        };

        const req = https.request(options, (res) => {
            const chunks: Buffer[] = [];
            res.on('data', (chunk: Buffer) => chunks.push(chunk));
            res.on('end', () => {
                try {
                    const json = JSON.parse(Buffer.concat(chunks).toString());
                    resolve(json as ReplicatePrediction);
                } catch (err) {
                    reject(new Error(`Failed to parse Replicate response: ${err}`));
                }
            });
        });

        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

/**
 * Poll a prediction by ID until it reaches a terminal state.
 */
export async function pollPrediction(
    apiToken: string,
    predictionId: string,
    options: { maxAttempts?: number; intervalMs?: number } = {}
): Promise<ReplicatePrediction> {
    const maxAttempts = options.maxAttempts ?? 120;
    const intervalMs = options.intervalMs ?? 1000;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        await new Promise((r) => setTimeout(r, intervalMs));

        const prediction = await getPrediction(apiToken, predictionId);

        if (prediction.status === 'succeeded') {
            return prediction;
        }

        if (prediction.status === 'failed' || prediction.status === 'canceled') {
            throw new Error(prediction.error ?? `Prediction ${prediction.status}`);
        }
    }

    throw new Error(`Prediction timed out after ${maxAttempts}s`);
}

/**
 * Retrieve a prediction by ID.
 */
export function getPrediction(apiToken: string, predictionId: string): Promise<ReplicatePrediction> {
    return new Promise((resolve, reject) => {
        const options: https.RequestOptions = {
            hostname: 'api.replicate.com',
            port: 443,
            path: `/v1/predictions/${predictionId}`,
            method: 'GET',
            headers: { Authorization: `Bearer ${apiToken}` }
        };

        const req = https.request(options, (res) => {
            const chunks: Buffer[] = [];
            res.on('data', (chunk: Buffer) => chunks.push(chunk));
            res.on('end', () => {
                try {
                    resolve(JSON.parse(Buffer.concat(chunks).toString()) as ReplicatePrediction);
                } catch (err) {
                    reject(err);
                }
            });
        });

        req.on('error', reject);
        req.end();
    });
}

/**
 * Cancel a running prediction.
 */
export function cancelPrediction(apiToken: string, predictionId: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const options: https.RequestOptions = {
            hostname: 'api.replicate.com',
            port: 443,
            path: `/v1/predictions/${predictionId}/cancel`,
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiToken}`,
                'Content-Length': 0
            }
        };

        const req = https.request(options, (res) => {
            res.resume();
            res.on('end', () => (res.statusCode === 200 ? resolve() : reject(new Error(`Cancel returned ${res.statusCode}`))));
        });

        req.on('error', reject);
        req.end();
    });
}

// ---------------------------------------------------------------------------
// High-level generation API
// ---------------------------------------------------------------------------

/**
 * Generate an image and return its URL.
 *
 * @param apiToken   Replicate API token (from SecretStorage)
 * @param modelId    Replicate model identifier e.g. `black-forest-labs/flux-dev`
 * @param options    Generation options
 * @param progress   Optional VS Code progress reporter
 * @returns          Output image URL or null
 */
export async function generateImage(
    apiToken: string,
    modelId: string,
    options: GenerateImageOptions,
    progress?: vscode.Progress<{ message?: string }>
): Promise<string | null> {
    progress?.report({ message: 'Creating prediction…' });

    const input: Record<string, unknown> = {
        prompt: options.prompt.substring(0, 2000)
    };

    // Map common options — not every model supports all of these; Replicate ignores unknown keys
    if (options.aspectRatio) { input.aspect_ratio = options.aspectRatio; }
    if (options.outputFormat) { input.output_format = options.outputFormat; }
    if (options.numInferenceSteps) { input.num_inference_steps = options.numInferenceSteps; }
    if (options.negativePrompt) { input.negative_prompt = options.negativePrompt; }
    if (options.guidanceScale !== undefined) { input.guidance_scale = options.guidanceScale; }
    if (options.width) { input.width = options.width; }
    if (options.height) { input.height = options.height; }

    let prediction = await createPrediction(apiToken, modelId, input);

    // If Prefer:wait resolved it synchronously — done
    if (prediction.status !== 'succeeded' && prediction.id) {
        progress?.report({ message: 'Waiting for model…' });
        prediction = await pollPrediction(apiToken, prediction.id);
    }

    if (prediction.error) {
        throw new Error(`Replicate error: ${prediction.error}`);
    }

    const output = prediction.output;
    if (Array.isArray(output) && output.length > 0) {
        return output[0] as string;
    }
    if (typeof output === 'string') {
        return output;
    }

    return null;
}

// ---------------------------------------------------------------------------
// File helpers
// ---------------------------------------------------------------------------

/**
 * Download an image from a URL and save it to a workspace path using vscode.workspace.fs.
 */
export async function downloadImageToWorkspace(
    imageUrl: string,
    outputUri: vscode.Uri,
    progress?: vscode.Progress<{ message?: string }>
): Promise<void> {
    progress?.report({ message: 'Downloading image…' });

    const buffer = await fetchImageBuffer(imageUrl);

    // Ensure parent directory exists
    const parentUri = vscode.Uri.joinPath(outputUri, '..');
    try {
        await vscode.workspace.fs.createDirectory(parentUri);
    } catch {
        // Directory may already exist — not an error
    }

    await vscode.workspace.fs.writeFile(outputUri, buffer);
}

/**
 * Fetch raw image bytes from a URL (follows one redirect).
 */
function fetchImageBuffer(url: string): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                fetchImageBuffer(res.headers.location!).then(resolve).catch(reject);
                return;
            }

            const chunks: Buffer[] = [];
            res.on('data', (chunk: Buffer) => chunks.push(chunk));
            res.on('end', () => resolve(Buffer.concat(chunks)));
            res.on('error', reject);
        }).on('error', reject);
    });
}

// ---------------------------------------------------------------------------
// Quick-pick helpers for VS Code UI
// ---------------------------------------------------------------------------

export interface ModelQuickPickItem extends vscode.QuickPickItem {
    model: ReplicateModel;
}

/**
 * Build the VS Code Quick Pick items for model selection.
 * Optionally marks the recommended model based on the user's prompt.
 */
export function buildModelQuickPickItems(suggestedModelId?: string): ModelQuickPickItem[] {
    return REPLICATE_MODEL_QUICK_PICK_ORDER.map((key) => {
        const model = REPLICATE_MODELS[key];
        const isSuggested = model.id === suggestedModelId;
        return {
            label: isSuggested ? `$(sparkle) ${model.label}` : `$(symbol-color) ${model.label}`,
            description: `${model.cost} — ${model.bestFor}`,
            detail: isSuggested ? '✨ Recommended for your prompt' : undefined,
            alwaysShow: true,
            model
        };
    });
}
