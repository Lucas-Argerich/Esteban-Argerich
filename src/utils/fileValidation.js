const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

/**
 * Validates an image file for upload.
 * Checks format first, then size.
 * @param {File | { size: number, type: string }} file
 * @returns {{ valid: boolean, error?: 'FILE_TOO_LARGE' | 'UNSUPPORTED_FORMAT' }}
 */
export function validateImageFile(file) {
  if (!ALLOWED_FORMATS.includes(file.type)) {
    return { valid: false, error: 'UNSUPPORTED_FORMAT' };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: 'FILE_TOO_LARGE' };
  }

  return { valid: true };
}
