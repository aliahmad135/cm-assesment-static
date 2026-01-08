// Escapes HTML to prevent XSS attacks
export class Sanitizer {
  // Convert dangerous HTML characters to safe entities
  static escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };

    return text.replace(/[&<>"']/g, (char) => map[char] || char);
  }

  // Clean up text by trimming and escaping it
  static sanitizeText(text: string | null | undefined): string {
    if (!text) return '';
    return this.escapeHtml(String(text).trim());
  }
}

