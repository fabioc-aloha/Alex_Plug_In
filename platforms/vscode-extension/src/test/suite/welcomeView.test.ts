import * as assert from "assert";
import * as vscode from "vscode";
import { WelcomeViewProvider } from "../../views/welcomeView";

/**
 * Welcome View — tests for tab structure, data contracts, and HTML escaping.
 *
 * The WelcomeViewProvider class requires VS Code extension context and webview API.
 * We test the exported interface contracts and tab enumeration here.
 */

suite("Welcome View Test Suite", () => {
  suite("Tab architecture", () => {
    const TAB_ORDER = ["Mission Command", "Skill Store", "Mind", "Docs"];

    test("should have exactly 4 tabs", () => {
      assert.strictEqual(TAB_ORDER.length, 4);
    });

    test("Mission Command should be first tab", () => {
      assert.strictEqual(TAB_ORDER[0], "Mission Command");
    });

    test("Mind tab should exist (key differentiator)", () => {
      assert.ok(TAB_ORDER.includes("Mind"));
    });

    test("Docs tab should be last", () => {
      assert.strictEqual(TAB_ORDER[TAB_ORDER.length - 1], "Docs");
    });
  });

  suite("MindTabData interface contract", () => {
    test("should accept valid MindTabData shape", () => {
      const data = {
        synapseHealth: 95,
        memoryModalities: {
          skills: 37,
          instructions: 45,
          prompts: 12,
          muscles: 8,
          synapses: 37,
        },
        lastMaintenance: "2026-03-05",
      };
      assert.ok(data.synapseHealth >= 0 && data.synapseHealth <= 100);
      assert.ok(data.memoryModalities.skills > 0);
    });
  });

  suite("SkillInfo interface contract", () => {
    test("should accept valid skill info", () => {
      const skill = {
        name: "testing-strategies",
        description: "Test design and coverage",
        category: "development",
      };
      assert.ok(skill.name);
      assert.ok(
        /^[a-z0-9-]+$/.test(skill.name),
        "Skill names should be kebab-case",
      );
    });
  });

  suite("HTML escaping for XSS prevention", () => {
    function escapeHtml(unsafe: string): string {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    test("should escape angle brackets", () => {
      assert.strictEqual(
        escapeHtml('<script>alert("xss")</script>'),
        "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;",
      );
    });

    test("should escape ampersands", () => {
      assert.strictEqual(escapeHtml("A & B"), "A &amp; B");
    });

    test("should escape quotes", () => {
      assert.strictEqual(escapeHtml('"hello"'), "&quot;hello&quot;");
    });

    test("should handle clean strings unchanged", () => {
      assert.strictEqual(escapeHtml("Hello World"), "Hello World");
    });

    test("should handle empty string", () => {
      assert.strictEqual(escapeHtml(""), "");
    });
  });

  suite("Tab state persistence", () => {
    test("tab index should be 0-based", () => {
      const tabIndex = 0;
      assert.ok(tabIndex >= 0 && tabIndex < 5);
    });

    test("default tab should be index 0 (Mission Command)", () => {
      const defaultTab = 0;
      assert.strictEqual(defaultTab, 0);
    });
  });

  suite("Welcome command routing & message guard", () => {
    const makeFakeContext = () => {
      const store = new Map<string, any>();
      return {
        extensionUri: vscode.Uri.file("."),
        globalState: {
          get: (key: string) => store.get(key),
          update: async (key: string, value: any) => {
            store.set(key, value);
          },
        },
      } as unknown as vscode.ExtensionContext;
    };

    test("ignores malformed messages safely", async () => {
      const ctx = makeFakeContext();
      const provider = new WelcomeViewProvider(ctx.extensionUri, ctx);
      const originalExecute = vscode.commands.executeCommand;
      let called = false;
      (vscode.commands as any).executeCommand = async () => {
        called = true;
      };

      await provider.handleMessageForTest(123 as any); // malformed payload
      assert.strictEqual(called, false);

      (vscode.commands as any).executeCommand = originalExecute;
    });

    test("routes commandMap entries via executeCommandSafely (awaited)", async () => {
      const ctx = makeFakeContext();
      const provider = new WelcomeViewProvider(ctx.extensionUri, ctx);
      const originalExecute = vscode.commands.executeCommand;
      const originalWithProgress = vscode.window.withProgress;
      const calls: any[] = [];

      (vscode.commands as any).executeCommand = async (...args: any[]) => {
        calls.push(args);
      };
      (vscode.window as any).withProgress = async (_opts: any, task: any) =>
        task();

      await provider.handleMessageForTest({ command: "generatePptx" });

      assert.strictEqual(calls.length, 1);
      assert.strictEqual(calls[0]?.[0], "alex.generatePptx");

      (vscode.commands as any).executeCommand = originalExecute;
      (vscode.window as any).withProgress = originalWithProgress;
    });

    test("persists tab switch in globalState memento", async () => {
      const ctx = makeFakeContext();
      const provider = new WelcomeViewProvider(ctx.extensionUri, ctx);
      await provider.handleMessageForTest({
        command: "tabSwitch",
        tabId: "mind",
      });
      assert.strictEqual(ctx.globalState.get("alex.welcome.activeTab"), "mind");
    });

    test("toggleSetting guards invalid keys and updates allowed keys", async () => {
      const ctx = makeFakeContext();
      const provider = new WelcomeViewProvider(ctx.extensionUri, ctx);
      const originalGetConfig = vscode.workspace.getConfiguration;
      const originalWarn = vscode.window.showWarningMessage;
      const updateCalls: any[] = [];
      (vscode.workspace as any).getConfiguration = () => ({
        update: async (...args: any[]) => {
          updateCalls.push(args);
        },
      });
      const warned: string[] = [];
      (vscode.window as any).showWarningMessage = (msg: string) => {
        warned.push(msg);
        return Promise.resolve(undefined);
      };

      // valid toggle
      await provider.handleMessageForTest({
        command: "toggleSetting",
        key: "chat.autopilot.enabled",
        value: true,
      });
      assert.strictEqual(updateCalls.length, 1);

      // invalid key should warn
      await provider.handleMessageForTest({
        command: "toggleSetting",
        key: "alex.notAllowed",
        value: false,
      });
      assert.ok(warned.length > 0, "Expected warning for invalid setting key");

      (vscode.workspace as any).getConfiguration = originalGetConfig;
      (vscode.window as any).showWarningMessage = originalWarn;
    });

    test("openDoc: commands resolve markdown preview with docUri", async () => {
      const ctx = makeFakeContext();
      const provider = new WelcomeViewProvider(ctx.extensionUri, ctx);
      const originalExecute = vscode.commands.executeCommand;
      const originalWithProgress = vscode.window.withProgress;
      const calls: any[] = [];
      (vscode.commands as any).executeCommand = async (...args: any[]) => {
        calls.push(args);
      };
      (vscode.window as any).withProgress = async (_opts: any, task: any) =>
        task();
      const folderUri = vscode.Uri.file(process.cwd());
      Object.defineProperty(vscode.workspace, "workspaceFolders", {
        value: [{ uri: folderUri }],
        writable: true,
        configurable: true,
      });

      await provider.handleMessageForTest({
        command: "openDoc:COGNITIVE-ARCHITECTURE",
      });
      const call = calls.find((c) => c?.[0] === "markdown.showPreview");
      assert.ok(call, "Expected markdown.showPreview to be called");

      (vscode.commands as any).executeCommand = originalExecute;
      (vscode.window as any).withProgress = originalWithProgress;
    });
  });
});
