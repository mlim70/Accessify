/**
 * Generates a prompt for accessibility enhancement using Claude
 * @param {Object} preferences - User accessibility preferences
 * @param {string} html - The HTML content to enhance
 * @returns {string} The formatted prompt
 */
async function generateAccessibilityPrompt(preferences, html) {
  let prompt = `You are an accessibility expert. Your task is to enhance the 
    provided HTML to make it more accessible for users with specific disabilities.

    TARGET DISABILITIES:`;

  // Color blindness specifications
  if (preferences.colorBlindness !== "none") {
    prompt += `\n1. Color Blindness Type: ${preferences.colorBlindness}
        - For Red-Green (Deuteranopia/Protanopia): Avoid red/green contrasts, use blues and yellows
        - For Blue-Yellow (Tritanopia): Avoid blue/yellow contrasts, use reds and greens
        - For Complete (Monochromacy): Use high contrast patterns and shapes instead of color distinctions`;
  }

  // Dyslexia specifications
  if (preferences.dyslexia !== "none") {
    prompt += `\n2. Dyslexia Type: ${preferences.dyslexia}
        - For Phonological: Ensure clear font choices (OpenDyslexic or similar)
        - For Surface Dyslexia: Increase letter and line spacing
        - General: Use left-aligned text, avoid justified text`;
  }

  prompt += `\n\nREQUIRED MODIFICATIONS:
    1. Color and Contrast:
    - Ensure WCAG 2.1 AA standard contrast ratios (minimum 4.5:1 for normal text)
    - Add visual indicators beyond color for important elements
    - Use patterns or borders to distinguish elements when needed

    2. Typography and Readability:
    - Set line height to at least 1.5
    - Maintain consistent paragraph width (50-75 characters)
    - Use sans-serif fonts (Arial, Verdana, or OpenDyslexic)
    - Ensure minimum font size of 16px
    - Add appropriate letter-spacing (0.12em) and word-spacing (0.16em)

    3. Structure and Navigation:
    - Implement proper heading hierarchy (h1 through h6)
    - Add ARIA labels to all interactive elements
    - Ensure all images have descriptive alt text
    - Add skip navigation links if needed
    - Ensure keyboard navigation works properly

    4. Layout and Spacing:
    - Add sufficient white space between elements
    - Create clear visual hierarchies
    - Ensure consistent alignment
    - Add visible focus indicators

    5. Technical Requirements:
    - Preserve all existing JavaScript functionality and event listeners
    - Maintain original semantic structure
    - Keep all form functionality intact
    - Preserve existing CSS classes and IDs
    - Add comments explaining accessibility changes

    OUTPUT FORMAT:
    Return ONLY the modified HTML with no additional text or explanations.
    Ensure the HTML is complete and valid, including:
    - All required meta tags
    - Original DOCTYPE declaration
    - Preserved script tags
    - All necessary CSS modifications inline or in style tags

    CONSTRAINTS:
    - Do not remove any existing functionality
    - Do not change form submissions or button actions
    - Preserve all data attributes
    - Keep original content intact while enhancing accessibility

    The HTML to modify follows below:
    ${html}`;

  return prompt;
}

module.exports = {
  generateAccessibilityPrompt,
};
