import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to convert CSV placeholders to Handlebars syntax
function convertToHandlebars(text) {
  if (!text) return '';

  // Convert [Placeholder] to {{placeholder}} (lowercase, no brackets)
  // Handle various placeholder formats
  return text
    .replace(/\[([^\]]+)\]/g, (match, content) => {
      // Convert to lowercase and replace spaces/special chars with underscores
      const handlebarsVar = content
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, ''); // Remove leading/trailing underscores
      return `{{${handlebarsVar}}}`;
    })
    .replace(/^##/gm, ''); // Remove ## prefix if present at start of lines
}

// Function to sanitize filename and limit length
function sanitizeFilename(name, maxLength = 100) {
  let sanitized = name
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();

  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized || 'template';
}

// Function to create Dotprompt file
function createDotpromptFile(templateName, promptText, outputDir, category) {
  const sanitizedName = sanitizeFilename(templateName);
  const filename = `${sanitizedName}.prompt`;
  const filepath = path.join(outputDir, category, filename);

  // Ensure directory exists
  const categoryDir = path.join(outputDir, category);
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true });
  }

  // Convert prompt text to Handlebars
  const handlebarsPrompt = convertToHandlebars(promptText.trim());

  if (!handlebarsPrompt) {
    console.log(`Skipping ${templateName}: empty prompt text`);
    return;
  }

  // Extract input variables from Handlebars syntax
  const inputVars = [];
  const varMatches = handlebarsPrompt.match(/\{\{(\w+)\}\}/g);
  if (varMatches) {
    const uniqueVars = [...new Set(varMatches.map(m => m.replace(/[{}]/g, '')))];
    uniqueVars.forEach(v => {
      inputVars.push(`      ${v}: string`);
    });
  }

  // Create YAML frontmatter
  const yamlFrontmatter = `---
model: googleai/gemini-1.5-pro
input:
  schema:
${inputVars.length > 0 ? inputVars.join('\n') : '    text?: string'}
output:
  format: text
---
`;

  const content = yamlFrontmatter + handlebarsPrompt;

  fs.writeFileSync(filepath, content, 'utf-8');
  console.log(`Created: ${filepath}`);
}

// Main transformation function
function transformCSVFile(inputPath, outputDir, category, config) {
  console.log(`\nProcessing: ${inputPath}`);

  let content = fs.readFileSync(inputPath, 'utf-8');

  // Remove BOM if present
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }

  try {
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
      trim: true
    });

    console.log(`Found ${records.length} templates`);

    records.forEach((row, index) => {
      // Normalize column names by removing BOM and trimming
      const normalizedRow = {};
      Object.keys(row).forEach(key => {
        const normalizedKey = key.replace(/^\uFEFF/, '').trim();
        normalizedRow[normalizedKey] = row[key];
      });

      // Try to find the name column - check exact match first, then flexible
      let templateName = normalizedRow[config.nameColumn];
      if (!templateName) {
        // Try to find any column with 'name' in it
        const nameKey = Object.keys(normalizedRow).find(key =>
          key.toLowerCase().includes('name') ||
          key.toLowerCase().includes('template')
        );
        templateName = nameKey ? normalizedRow[nameKey] : null;
      }

      if (!templateName || !templateName.trim()) {
        templateName = `template_${index + 1}`;
      }

      // Try to find prompt columns - prefer packaged, then prompt
      let promptText = null;
      if (config.packagedColumn && normalizedRow[config.packagedColumn]) {
        promptText = normalizedRow[config.packagedColumn];
      } else if (config.promptColumn && normalizedRow[config.promptColumn]) {
        promptText = normalizedRow[config.promptColumn];
      } else {
        // Fallback: find any column with 'packaged' or 'prompt' in name
        const promptKey = Object.keys(normalizedRow).find(key =>
          key.toLowerCase().includes('packaged') ||
          key.toLowerCase().includes('prompt') ||
          key.toLowerCase().includes('template')
        );
        promptText = promptKey ? normalizedRow[promptKey] : null;
      }

      if (!promptText || !promptText.trim()) {
        console.log(`Skipping ${templateName}: no prompt text`);
        return;
      }

      createDotpromptFile(templateName.trim(), promptText, outputDir, category);
    });
  } catch (error) {
    console.error(`Error processing ${inputPath}:`, error.message);
  }
}

// Main execution
const inputDir = path.join(__dirname, 'input');
const outputDir = path.join(__dirname, 'prompts');

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Configuration for each CSV file
const fileConfigs = [
  {
    filename: '📃  writingBrandVoice-Grid view.csv',
    category: 'brand-voice',
    nameColumn: 'Brand Voice',
    promptColumn: 'Description',
    packagedColumn: '✍️ Blogpost'
  },
  {
    filename: '📃 blogpostTemplatePrompts-Grid view.csv',
    category: 'blogpost',
    nameColumn: 'blogpostTemplateName',
    promptColumn: 'blogpostPromptTemplate',
    packagedColumn: 'packagedPromptTemplateIdeas'
  },
  {
    filename: '📃 ideasTemplatePrompts-Grid view.csv',
    category: 'ideas',
    nameColumn: 'ideasTemplateName',
    promptColumn: 'ideasPromptTemplate',
    packagedColumn: 'packagedPromptTemplateIdeas'
  },
  {
    filename: '📃 promoEmailPromptTemplates-Grid view.csv',
    category: 'email',
    nameColumn: 'emailPromptName',
    promptColumn: 'emailTemplatePromptText',
    packagedColumn: 'packagedTemplatePromptText'
  },
  {
    filename: '📃 socialPostTemplates-Grid view.csv',
    category: 'social',
    nameColumn: 'SocialPromptName',
    promptColumn: 'templatePromptText',
    packagedColumn: 'packagedTemplatePromptTextForAI'
  },
  {
    filename: '📃 videoReelsHooksTemplates-Grid view.csv',
    category: 'video',
    nameColumn: 'reelsVideoHookPromptName',
    promptColumn: 'templateVideoHookPromptText',
    packagedColumn: 'packagedTemplatePromptTextForAI'
  }
];

// Process each file
fileConfigs.forEach(config => {
  const inputPath = path.join(inputDir, config.filename);
  if (fs.existsSync(inputPath)) {
    transformCSVFile(inputPath, outputDir, config.category, {
      nameColumn: config.nameColumn,
      promptColumn: config.promptColumn,
      packagedColumn: config.packagedColumn
    });
  } else {
    console.log(`File not found: ${inputPath}`);
  }
});

console.log('\n✅ Transformation complete!');
