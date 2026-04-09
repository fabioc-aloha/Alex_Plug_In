import * as assert from "assert";
import { HealthStatus, clearHealthCache } from "../../shared/healthCheck";

suite("Health Check Test Suite", () => {
  suite("HealthStatus enum", () => {
    test("should have Healthy value", () => {
      assert.strictEqual(HealthStatus.Healthy, "healthy");
    });

    test("should have Warning value", () => {
      assert.strictEqual(HealthStatus.Warning, "warning");
    });

    test("should have Error value", () => {
      assert.strictEqual(HealthStatus.Error, "error");
    });

    test("should have NotInitialized value", () => {
      assert.strictEqual(HealthStatus.NotInitialized, "not-initialized");
    });
  });

  suite("Cache management", () => {
    test("clearHealthCache should not throw", () => {
      clearHealthCache();
    });
  });
});
