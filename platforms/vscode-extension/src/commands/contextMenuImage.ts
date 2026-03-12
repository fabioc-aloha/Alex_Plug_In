import * as vscode from "vscode";
import * as path from "path";
import {
  fetchIconifyIcon,
  fetchDiceBearAvatar,
} from "../services/illustrationService";
import {
  STOCK_ILLUSTRATIONS,
  LUCIDE_ICONS,
} from "../generators/illustrationIcons";
import { getToken } from "../services/secretsManager";
import {
  generateImage,
  downloadImageToWorkspace,
  createPrediction,
  pollPrediction,
  selectModelForPrompt,
  buildModelQuickPickItems,
  upscaleImage as replicateUpscale,
  buildUpscalingQuickPickItems,
  UPSCALING_MODELS,
} from "../services/replicateService";

// Maximum image dimension for API upload (to avoid payload size issues)
const MAX_IMAGE_DIMENSION = 1024;

/**
 * Resize image buffer if needed to stay within dimension limits
 */
async function resizeImageIfNeeded(
  buffer: Buffer | Uint8Array,
  maxDim: number = MAX_IMAGE_DIMENSION,
): Promise<Buffer> {
  const inputBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
  try {
    const sharp = await import("sharp");
    const metadata = await sharp.default(inputBuffer).metadata();

    if (!metadata.width || !metadata.height) {
      return inputBuffer;
    }

    if (metadata.width <= maxDim && metadata.height <= maxDim) {
      return inputBuffer;
    }

    const resized = await sharp
      .default(inputBuffer)
      .resize(maxDim, maxDim, { fit: "inside", withoutEnlargement: true })
      .png()
      .toBuffer();

    return resized;
  } catch (err) {
    console.warn('[Alex Image] Resize failed, using original:', err instanceof Error ? err.message : String(err));
    return inputBuffer;
  }
}

/**
 * Generate an SVG illustration from a natural language description.
 *
 * Strategy:
 * 1. Use the LLM to interpret the description and generate SVG code
 * 2. Falls back to keyword-matching against built-in icons/illustrations
 * 3. Falls back to Iconify API for icon-style illustrations
 * 4. Falls back to DiceBear for character/avatar requests
 */
async function generateIllustrationFromDescription(
  description: string,
): Promise<string | null> {
  // Strategy 1: Use LLM to generate SVG directly
  try {
    const models = await vscode.lm.selectChatModels({
      vendor: "copilot",
      family: "gpt-4o",
    });
    if (models.length > 0) {
      const model = models[0];
      const messages = [
        vscode.LanguageModelChatMessage.User(
          `You are an SVG illustration generator. Given a description, create a clean, modern SVG illustration.

Rules:
- Output ONLY the SVG code, no markdown fences, no explanation
- Use a viewBox of "0 0 400 300" 
- Use a professional color palette (blues: #0550ae, #ddf4ff; greens: #1a7f37, #dffbe0; grays: #57606a, #d0d7de)
- Keep illustrations simple and geometric — abstract business/tech style
- Use shapes (rect, circle, ellipse, path, line, polygon) with rounded corners where appropriate
- Add subtle fills and strokes for depth
- Include relevant text labels if the description implies them
- The SVG must be self-contained (no external references)
- Maximum complexity: ~50 SVG elements

Description: ${description}`,
        ),
      ];

      const response = await model.sendRequest(
        messages,
        {},
        new vscode.CancellationTokenSource().token,
      );
      let svgContent = "";
      for await (const chunk of response.text) {
        svgContent += chunk;
      }

      const svgMatch = svgContent.match(/<svg[\s\S]*?<\/svg>/i);
      if (svgMatch) {
        return svgMatch[0];
      }
    }
  } catch (err) {
    console.warn(
      "LLM SVG generation failed, falling back to keyword matching:",
      err,
    );
  }

  // Strategy 2: Keyword-match against built-in stock illustrations
  const descLower = description.toLowerCase();

  const stockKeywords: Record<string, string[]> = {
    collaboration: [
      "team", "collaborate", "together", "group", "meeting", "partner",
    ],
    growth: [
      "grow", "increase", "progress", "chart", "bar", "revenue", "sales",
    ],
    innovation: [
      "innovat", "idea", "creative", "lightbulb", "brainstorm", "new",
    ],
    security: ["security", "secure", "lock", "protect", "shield", "safe"],
    network: ["network", "connect", "node", "graph", "link", "web"],
    process: ["process", "flow", "step", "workflow", "pipeline", "sequence"],
    analytics: ["analytic", "data", "metric", "dashboard", "report", "insight"],
    timeline: ["timeline", "schedule", "roadmap", "milestone", "plan", "phase"],
  };

  for (const [name, keywords] of Object.entries(stockKeywords)) {
    if (keywords.some((kw) => descLower.includes(kw))) {
      const svg = STOCK_ILLUSTRATIONS[name];
      if (svg) {
        return svg;
      }
    }
  }

  // Strategy 3: Match Lucide icons by category
  const iconKeywords: Record<string, string[]> = {
    brain: ["brain", "ai", "intelligence", "cognitive", "neural", "think"],
    rocket: ["launch", "rocket", "deploy", "start", "fast", "speed"],
    heart: ["heart", "love", "favorite", "like", "health", "care"],
    star: ["star", "rating", "favorite", "best", "top", "award"],
    shield: ["shield", "protect", "guard", "defense", "firewall"],
    globe: ["globe", "world", "global", "international", "earth", "planet"],
    cloud: ["cloud", "saas", "hosting", "storage", "aws", "azure"],
    users: [
      "user", "people", "person", "team", "human", "community", "cat", "dog", "animal",
    ],
    lightbulb: ["light", "bulb", "idea", "bright", "eureka"],
    code: ["code", "program", "develop", "software", "script"],
    database: ["database", "db", "sql", "storage", "data"],
    server: ["server", "backend", "infrastructure", "hosting"],
    lock: ["lock", "password", "auth", "encrypt", "secret"],
    zap: ["fast", "instant", "lightning", "power", "energy", "electric"],
    sparkles: ["magic", "sparkle", "ai", "generate", "auto"],
    trophy: ["win", "trophy", "achievement", "success", "champion"],
    book: ["book", "read", "learn", "education", "knowledge", "library"],
    mail: ["mail", "email", "message", "send", "inbox", "letter"],
  };

  for (const [iconName, keywords] of Object.entries(iconKeywords)) {
    if (keywords.some((kw) => descLower.includes(kw))) {
      const iconSvg = LUCIDE_ICONS[iconName];
      if (iconSvg) {
        return wrapIconAsIllustration(iconSvg, iconName, description);
      }
    }
  }

  // Strategy 4: Try Iconify API for the most relevant term
  const words = description.split(/\s+/).filter((w) => w.length > 2);
  for (const word of words) {
    const normalized = word.toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (!normalized) {
      continue;
    }

    const svg = await fetchIconifyIcon("mdi", normalized, {
      width: 200,
      height: 200,
      color: "0550ae",
    });
    if (svg) {
      return svg;
    }
  }

  // Strategy 5: DiceBear avatar as last resort for character descriptions
  const characterWords = [
    "person", "character", "avatar", "face", "portrait", "cat", "dog", "animal", "bot", "robot",
  ];
  if (characterWords.some((w) => descLower.includes(w))) {
    const avatar = await fetchDiceBearAvatar(description, "bottts", {
      size: 200,
    });
    if (avatar) {
      return avatar;
    }
  }

  return null;
}

/**
 * Wrap a small Lucide icon into a proper illustration with label and background
 */
function wrapIconAsIllustration(
  iconSvg: string,
  iconName: string,
  description: string,
): string {
  const innerContent = iconSvg.replace(/<svg[^>]*>/, "").replace(/<\/svg>/, "");

  const label =
    description.length > 30
      ? description.substring(0, 27) + "..."
      : description;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
  <!-- Background -->
  <rect width="400" height="300" rx="16" fill="#f6f8fa" stroke="#d0d7de" stroke-width="2"/>
  
  <!-- Decorative circle -->
  <circle cx="200" cy="120" r="70" fill="#ddf4ff" stroke="#0550ae" stroke-width="2" opacity="0.5"/>
  
  <!-- Icon (scaled up from 24x24) -->
  <g transform="translate(164, 84) scale(3)" stroke="#0550ae" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
    ${innerContent}
  </g>
  
  <!-- Label -->
  <text x="200" y="240" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="16" fill="#24292f" font-weight="600">${escapeXml(label)}</text>
  <text x="200" y="265" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#57606a">Generated by Alex</text>
</svg>`;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Register image-related context menu commands
 * (generate illustration, generate AI image, edit image, upscale)
 */
export function registerImageCommands(context: vscode.ExtensionContext): void {
  // Generate image from selection
  const generateImageFromSelectionDisposable = vscode.commands.registerCommand(
    "alex.generateImageFromSelection",
    async (uri?: vscode.Uri) => {
      let text: string | undefined;

      if (uri) {
        try {
          const content = await vscode.workspace.fs.readFile(uri);
          text = new TextDecoder().decode(content);
        } catch (err) {
          vscode.window.showErrorMessage(`Failed to read file: ${err}`);
          return;
        }
      } else {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
          const selection = editor.selection;
          text = !selection.isEmpty ? editor.document.getText(selection) : "";
        }
      }

      let prompt: string;

      if (!text) {
        const userInput = await vscode.window.showInputBox({
          prompt: "Describe the illustration you want to generate",
          placeHolder: "e.g., A flowchart showing user authentication process",
          ignoreFocusOut: true,
        });

        if (!userInput) {
          return;
        }
        prompt = userInput;
      } else {
        prompt = text;
      }

      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: "Generating illustration...",
          cancellable: false,
        },
        async () => {
          try {
            const svg = await generateIllustrationFromDescription(prompt);
            if (!svg) {
              vscode.window.showWarningMessage(
                "Could not generate an illustration. Try a more specific description.",
              );
              return;
            }

            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders) {
              vscode.window.showWarningMessage("No workspace folder found");
              return;
            }

            const slug = prompt
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "")
              .substring(0, 40);
            const fileName = `illustration-${slug}.svg`;
            const outputDir = path.join(
              workspaceFolders[0].uri.fsPath,
              "assets",
            );
            const outputPath = path.join(outputDir, fileName);

            const outputUri = vscode.Uri.file(outputPath);
            await vscode.workspace.fs.createDirectory(
              vscode.Uri.file(outputDir),
            );
            await vscode.workspace.fs.writeFile(
              outputUri,
              Buffer.from(svg, "utf8"),
            );

            const doc = await vscode.workspace.openTextDocument(outputUri);
            await vscode.window.showTextDocument(doc);

            const relativePath = vscode.workspace.asRelativePath(outputUri);
            vscode.window
              .showInformationMessage(
                `✅ Illustration saved: ${relativePath}`,
                "Open Preview",
              )
              .then((action) => {
                if (action === "Open Preview") {
                  vscode.commands.executeCommand("vscode.open", outputUri);
                }
              });
          } catch (err) {
            vscode.window.showErrorMessage(
              `Failed to generate illustration: ${err}`,
            );
          }
        },
      );
    },
  );

  // Generate AI Image from file content
  const generateAIImageDisposable = vscode.commands.registerCommand(
    "alex.generateAIImage",
    async (uri?: vscode.Uri) => {
      const apiToken = getToken("REPLICATE_API_TOKEN");
      if (!apiToken) {
        const result = await vscode.window.showWarningMessage(
          "Replicate API Token not configured. Set your API token to generate AI images.",
          "Configure API Token",
          "Get API Token",
          "Cancel",
        );
        if (result === "Configure API Token") {
          vscode.commands.executeCommand("alex.manageSecrets");
        }
        if (result === "Get API Token") {
          vscode.env.openExternal(
            vscode.Uri.parse("https://replicate.com/account/api-tokens"),
          );
        }
        return;
      }

      let prompt: string;

      if (uri) {
        try {
          const content = await vscode.workspace.fs.readFile(uri);
          prompt = new TextDecoder().decode(content);
        } catch (err) {
          vscode.window.showErrorMessage(`Failed to read file: ${err}`);
          return;
        }
      } else {
        const userInput = await vscode.window.showInputBox({
          prompt: "Describe the image you want to generate",
          placeHolder:
            "e.g., A serene mountain landscape at sunset with a lake",
          ignoreFocusOut: true,
        });

        if (!userInput) {
          return;
        }
        prompt = userInput;
      }

      const suggestedModel = selectModelForPrompt(prompt);

      const modelItems = buildModelQuickPickItems(suggestedModel.id);
      const modelOption = await vscode.window.showQuickPick(modelItems, {
        placeHolder: "Select AI model (✨ = recommended for your prompt)",
        title: "Alex — AI Image Generation",
      });

      if (!modelOption) {
        return;
      }

      const aspectOption = await vscode.window.showQuickPick(
        [
          { label: "1:1 Square", value: "1:1" },
          { label: "16:9 Widescreen", value: "16:9" },
          { label: "9:16 Portrait", value: "9:16" },
          { label: "4:3 Standard", value: "4:3" },
          { label: "3:4 Portrait", value: "3:4" },
          { label: "3:2 Landscape", value: "3:2" },
        ],
        {
          placeHolder: "Select aspect ratio",
          title: "Alex — AI Image Generation",
        },
      );

      if (!aspectOption) {
        return;
      }

      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: `Generating image with ${modelOption.model.label}…`,
          cancellable: false,
        },
        async (progress) => {
          try {
            const imageUrl = await generateImage(
              apiToken,
              modelOption.model.id,
              {
                prompt,
                aspectRatio: aspectOption.value,
                outputFormat: "png",
              },
              progress,
            );

            if (!imageUrl) {
              vscode.window.showErrorMessage(
                "Failed to generate image — no output received from Replicate",
              );
              return;
            }

            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders) {
              vscode.window.showWarningMessage("No workspace folder found");
              return;
            }

            const timestamp = Date.now();
            const fileName = `ai-image-${timestamp}.png`;
            const outputUri = vscode.Uri.joinPath(
              workspaceFolders[0].uri,
              "assets",
              "generated",
              fileName,
            );

            await downloadImageToWorkspace(imageUrl, outputUri, progress);

            vscode.commands.executeCommand("vscode.open", outputUri);

            const relativePath = vscode.workspace.asRelativePath(outputUri);
            vscode.window
              .showInformationMessage(
                `✅ AI image saved: ${relativePath}`,
                "Copy Path",
              )
              .then((action) => {
                if (action === "Copy Path") {
                  vscode.env.clipboard.writeText(relativePath);
                }
              });
          } catch (err) {
            vscode.window.showErrorMessage(
              `Failed to generate AI image: ${err}`,
            );
          }
        },
      );
    },
  );

  // Edit image with AI prompt
  const editImageWithPromptDisposable = vscode.commands.registerCommand(
    "alex.editImageWithPrompt",
    async (uri?: vscode.Uri) => {
      const apiToken = getToken("REPLICATE_API_TOKEN");
      if (!apiToken) {
        const result = await vscode.window.showWarningMessage(
          "Replicate API Token not configured. Set your API token to edit images with AI.",
          "Configure API Token",
          "Get API Token",
          "Cancel",
        );
        if (result === "Configure API Token") {
          vscode.commands.executeCommand("alex.manageSecrets");
        }
        if (result === "Get API Token") {
          vscode.env.openExternal(
            vscode.Uri.parse("https://replicate.com/account/api-tokens"),
          );
        }
        return;
      }

      let imageUri: vscode.Uri | undefined = uri;
      if (!imageUri) {
        const files = await vscode.window.showOpenDialog({
          canSelectFiles: true,
          canSelectFolders: false,
          canSelectMany: false,
          filters: {
            Images: ["png", "jpg", "jpeg", "webp", "gif"],
          },
          title: "Select image to edit",
        });
        if (!files || files.length === 0) {
          return;
        }
        imageUri = files[0];
      }

      const ext = path.extname(imageUri.fsPath).toLowerCase();
      if (![".png", ".jpg", ".jpeg", ".webp", ".gif"].includes(ext)) {
        vscode.window.showWarningMessage(
          "Please select an image file (PNG, JPG, JPEG, WEBP, GIF)",
        );
        return;
      }

      const editPrompt = await vscode.window.showInputBox({
        prompt:
          "Describe the desired result (reference image will be used for face/style consistency)",
        placeHolder:
          "e.g., Same person in a professional business suit, office background",
        ignoreFocusOut: true,
      });

      if (!editPrompt) {
        return;
      }

      const aspectOption = await vscode.window.showQuickPick(
        [
          { label: "1:1 Square", value: "1:1" },
          { label: "16:9 Widescreen", value: "16:9" },
          { label: "9:16 Portrait", value: "9:16" },
          { label: "4:3 Standard", value: "4:3" },
          { label: "3:4 Vertical", value: "3:4" },
        ],
        {
          placeHolder: "Select output aspect ratio",
          title: "AI Image Edit - Aspect Ratio",
        },
      );

      if (!aspectOption) {
        return;
      }

      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: "Editing image with AI...",
          cancellable: false,
        },
        async (progress) => {
          try {
            progress.report({ message: "Reading and resizing image…" });

            const rawBytes = await vscode.workspace.fs.readFile(imageUri);
            const imageBuffer = await resizeImageIfNeeded(
              Buffer.from(rawBytes),
              MAX_IMAGE_DIMENSION,
            );

            const base64 = imageBuffer.toString("base64");
            const mimeType =
              ext === ".png"
                ? "image/png"
                : ext === ".gif"
                  ? "image/gif"
                  : ext === ".webp"
                    ? "image/webp"
                    : "image/jpeg";
            const dataUri = `data:${mimeType};base64,${base64}`;

            progress.report({ message: "Processing image with AI…" });

            let prediction = await createPrediction(
              apiToken,
              "google/nano-banana-pro",
              {
                prompt: editPrompt,
                image_input: [dataUri],
                aspect_ratio: aspectOption.value,
                output_format: "png",
                safety_filter_level: "block_only_high",
              },
            );

            if (prediction.status !== "succeeded" && prediction.id) {
              prediction = await pollPrediction(apiToken, prediction.id);
            }

            const outputArr = prediction.output;
            const result = Array.isArray(outputArr) ? outputArr[0] : outputArr;

            if (!result) {
              vscode.window.showErrorMessage(
                "Failed to edit image — no output received",
              );
              return;
            }

            progress.report({ message: "Saving result…" });

            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders) {
              vscode.window.showWarningMessage("No workspace folder found");
              return;
            }

            const originalName = path.basename(imageUri.fsPath, ext);
            const timestamp = Date.now();
            const fileName = `${originalName}-edited-${timestamp}.png`;
            const outputUri = vscode.Uri.joinPath(
              workspaceFolders[0].uri,
              "assets",
              "edited",
              fileName,
            );

            await downloadImageToWorkspace(
              result as string,
              outputUri,
              progress,
            );

            vscode.commands.executeCommand("vscode.open", outputUri);

            const relativePath = vscode.workspace.asRelativePath(outputUri);
            vscode.window
              .showInformationMessage(
                `✅ Edited image saved: ${relativePath}`,
                "Copy Path",
                "Open Original",
              )
              .then((action) => {
                if (action === "Copy Path") {
                  vscode.env.clipboard.writeText(relativePath);
                }
                if (action === "Open Original") {
                  vscode.commands.executeCommand("vscode.open", imageUri);
                }
              });
          } catch (err) {
            vscode.window.showErrorMessage(`Failed to edit image: ${err}`);
          }
        },
      );
    },
  );

  // Upscale image with AI
  const upscaleImageDisposable = vscode.commands.registerCommand(
    "alex.upscaleImage",
    async (uri?: vscode.Uri) => {
      const apiToken = getToken("REPLICATE_API_TOKEN");
      if (!apiToken) {
        const result = await vscode.window.showWarningMessage(
          "Replicate API Token not configured. Set your API token to upscale images.",
          "Configure API Token",
          "Get API Token",
          "Cancel",
        );
        if (result === "Configure API Token") {
          vscode.commands.executeCommand("alex.manageSecrets");
        }
        if (result === "Get API Token") {
          vscode.env.openExternal(
            vscode.Uri.parse("https://replicate.com/account/api-tokens"),
          );
        }
        return;
      }

      let imageUri: vscode.Uri | undefined = uri;
      if (!imageUri) {
        const files = await vscode.window.showOpenDialog({
          canSelectFiles: true,
          canSelectFolders: false,
          canSelectMany: false,
          filters: {
            Images: ["png", "jpg", "jpeg", "webp"],
          },
          title: "Select image to upscale",
        });
        if (!files || files.length === 0) {
          return;
        }
        imageUri = files[0];
      }

      // Validate it's an image file
      const ext = path.extname(imageUri.fsPath).toLowerCase();
      if (![".png", ".jpg", ".jpeg", ".webp"].includes(ext)) {
        vscode.window.showWarningMessage(
          "Please select an image file (PNG, JPG, JPEG, WEBP)",
        );
        return;
      }

      // Model selection
      const modelItems = buildUpscalingQuickPickItems();
      const selectedItem = await vscode.window.showQuickPick(modelItems, {
        title: "Select Upscaling Model",
        placeHolder: "Choose a model based on your needs",
      });

      if (!selectedItem) {
        return;
      }

      // Find model key from selected model
      const modelKey = Object.entries(UPSCALING_MODELS).find(
        ([, m]) => m.id === selectedItem.model.id,
      )?.[0] as keyof typeof UPSCALING_MODELS;

      if (!modelKey) {
        return;
      }

      // Scale factor selection
      const maxScale = selectedItem.model.maxScale;
      const scaleOptions = [];
      for (let i = 2; i <= maxScale; i += 2) {
        scaleOptions.push({ label: `${i}x`, value: i });
      }
      if (scaleOptions.length === 0) {
        scaleOptions.push({ label: "2x", value: 2 });
      }

      const scaleOption = await vscode.window.showQuickPick(scaleOptions, {
        title: "Select Scale Factor",
        placeHolder: "How much to upscale?",
      });

      if (!scaleOption) {
        return;
      }

      // Face enhancement option for supported models
      let faceEnhance = false;
      if (modelKey === "realEsrgan" || modelKey === "codeformer") {
        const enhanceOption = await vscode.window.showQuickPick(
          [
            { label: "Yes", description: "Apply face enhancement" },
            { label: "No", description: "Skip face enhancement" },
          ],
          {
            title: "Face Enhancement",
            placeHolder: "Apply face restoration?",
          },
        );
        faceEnhance = enhanceOption?.label === "Yes";
      }

      // Process with progress
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: `Upscaling with ${selectedItem.model.label}`,
          cancellable: false,
        },
        async (progress) => {
          try {
            progress.report({ message: "Reading image…" });

            // Read image and convert to base64 data URL for API
            const imageData = await vscode.workspace.fs.readFile(imageUri!);
            const resized = await resizeImageIfNeeded(
              Buffer.from(imageData),
              2048,
            );
            const base64 = resized.toString("base64");
            const mimeType =
              ext === ".png"
                ? "image/png"
                : ext === ".webp"
                  ? "image/webp"
                  : "image/jpeg";
            const dataUrl = `data:${mimeType};base64,${base64}`;

            progress.report({ message: "Uploading to Replicate…" });

            const imageUrl = await replicateUpscale(
              apiToken,
              dataUrl,
              modelKey,
              { scale: scaleOption.value, faceEnhance },
              progress,
            );

            if (!imageUrl) {
              throw new Error("No output received from model");
            }

            progress.report({ message: "Saving upscaled image…" });

            // Save to workspace
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders) {
              vscode.window.showWarningMessage("No workspace folder found");
              return;
            }

            const originalName = path.basename(imageUri!.fsPath, ext);
            const fileName = `${originalName}-${scaleOption.value}x-upscaled${ext}`;
            const outputUri = vscode.Uri.joinPath(
              workspaceFolders[0].uri,
              "assets",
              "upscaled",
              fileName,
            );

            await downloadImageToWorkspace(imageUrl, outputUri, progress);

            // Open the upscaled image
            vscode.commands.executeCommand("vscode.open", outputUri);

            const relativePath = vscode.workspace.asRelativePath(outputUri);
            vscode.window
              .showInformationMessage(
                `✅ Upscaled image saved: ${relativePath}`,
                "Copy Path",
                "Open Original",
              )
              .then((action) => {
                if (action === "Copy Path") {
                  vscode.env.clipboard.writeText(relativePath);
                }
                if (action === "Open Original") {
                  vscode.commands.executeCommand("vscode.open", imageUri);
                }
              });
          } catch (err) {
            vscode.window.showErrorMessage(`Failed to upscale image: ${err}`);
          }
        },
      );
    },
  );

  context.subscriptions.push(generateImageFromSelectionDisposable);
  context.subscriptions.push(generateAIImageDisposable);
  context.subscriptions.push(editImageWithPromptDisposable);
  context.subscriptions.push(upscaleImageDisposable);
}
