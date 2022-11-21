/**
 *
 * @param {*} string
 * @returns JSON | null
 */
export const safeJSONparse = (value) => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return null;
  }
};
