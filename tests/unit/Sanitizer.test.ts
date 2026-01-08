import { Sanitizer } from "../../src/utils/Sanitizer";

describe("Sanitizer", () => {
  describe("escapeHtml", () => {
    test("should escape HTML special characters", () => {
      expect(Sanitizer.escapeHtml('<script>alert("xss")</script>')).toBe(
        "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
      );
      expect(Sanitizer.escapeHtml("John & Jane")).toBe("John &amp; Jane");
      expect(Sanitizer.escapeHtml("It's working")).toBe("It&#039;s working");
    });

    test("should not escape safe characters", () => {
      const safe = "Hello World 123";
      expect(Sanitizer.escapeHtml(safe)).toBe(safe);
    });

    test("should handle empty strings", () => {
      expect(Sanitizer.escapeHtml("")).toBe("");
    });

    test("should escape all dangerous characters", () => {
      const input = "<>&\"'";
      const output = Sanitizer.escapeHtml(input);
      // Check that dangerous chars are escaped (not checking for & since &amp; contains &)
      expect(output).toBe("&lt;&gt;&amp;&quot;&#039;");
      expect(output).not.toContain("<");
      expect(output).not.toContain(">");
      expect(output).not.toContain('"');
      expect(output).not.toContain("'");
      // & is escaped to &amp;, so we check the escaped version exists
      expect(output).toContain("&amp;");
    });
  });

  describe("sanitizeText", () => {
    test("should trim and escape text", () => {
      const result = Sanitizer.sanitizeText(
        '  <script>alert("xss")</script>  '
      );
      expect(result).toBe(
        "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
      );
    });

    test("should handle null and undefined", () => {
      expect(Sanitizer.sanitizeText(null)).toBe("");
      expect(Sanitizer.sanitizeText(undefined)).toBe("");
    });

    test("should handle empty strings", () => {
      expect(Sanitizer.sanitizeText("")).toBe("");
      expect(Sanitizer.sanitizeText("   ")).toBe("");
    });
  });
});
