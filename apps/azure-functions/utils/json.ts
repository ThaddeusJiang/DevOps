/**
 *
 * @param value
 * @param handleError
 * @returns
 */
export const safeJSONparse = (value: string, handleError?: (error: Error) => void) => {
  try {
    return JSON.parse(value);
  } catch (e) {
    if (handleError) {
      handleError(e);
    }
    return null;
  }
};
