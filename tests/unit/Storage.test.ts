import { Storage } from "../../src/utils/Storage";

describe("Storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  test("should save and retrieve user ID", () => {
    const userId = "test-user-123";
    Storage.saveUserId(userId);
    expect(Storage.getUserId()).toBe(userId);
  });

  test("should save and retrieve user state", () => {
    const state = "TX";
    Storage.saveUserState(state);
    expect(Storage.getUserState()).toBe(state);
  });

  test("should return null for missing user ID", () => {
    expect(Storage.getUserId()).toBeNull();
  });

  test("should return null for missing user state", () => {
    expect(Storage.getUserState()).toBeNull();
  });

  test("should clear all stored data", () => {
    Storage.saveUserId("test-123");
    Storage.saveUserState("TX");
    Storage.clear();

    expect(Storage.getUserId()).toBeNull();
    expect(Storage.getUserState()).toBeNull();
  });

  test("should handle localStorage errors gracefully", () => {
    localStorage.clear();
    
    const originalSetItem = localStorage.setItem;
    
    // Mock setItem to throw an error (simulating quota exceeded)
    localStorage.setItem = jest.fn(() => {
      throw new Error("Storage quota exceeded");
    });

    // Should not throw even if localStorage fails
    expect(() => Storage.saveUserId("test")).not.toThrow();
    
    // Restore original
    localStorage.setItem = originalSetItem;
    localStorage.clear();
  });
});
