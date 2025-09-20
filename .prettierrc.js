// .prettierrc.js - Prettier configuration for consistent code formatting
module.exports = {
  // Basic formatting options
  semi: true,                    // Add semicolons at the end of statements
  singleQuote: true,            // Use single quotes instead of double quotes
  trailingComma: 'es5',         // Add trailing commas where valid in ES5
  tabWidth: 2,                  // Number of spaces per indentation level
  useTabs: false,               // Use spaces instead of tabs
  
  // Line length and wrapping
  printWidth: 80,               // Line length that prettier will wrap on
  
  // Object and array formatting
  bracketSpacing: true,         // Print spaces between brackets in object literals
  bracketSameLine: false,       // Put the > of a multi-line JSX element at the end of the last line
  
  // Arrow function formatting
  arrowParens: 'always',        // Always include parens around arrow function parameters
  
  // JSX specific formatting
  jsxSingleQuote: false,        // Use double quotes in JSX
  jsxBracketSameLine: false,    // Put the > of a multi-line JSX element at the end of the last line
  
  // Other options
  endOfLine: 'lf',              // Line ending style
  quoteProps: 'as-needed',      // Only add quotes around object properties when needed
  
  // File-specific overrides
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 120,
        tabWidth: 2,
      },
    },
    {
      files: '*.md',
      options: {
        printWidth: 100,
        proseWrap: 'always',
      },
    },
  ],
};