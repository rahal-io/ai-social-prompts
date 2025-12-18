# COS Templates - Google AI Genkit Format

A collection of prompt templates converted to the Dotprompt format for use with Google AI's Genkit framework. This project transforms CSV-based prompt templates into executable `.prompt` files compatible with `@genkit-ai/googleai`.

## 📋 Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Transformation](#transformation)
- [Using the Templates](#using-the-templates)
- [Template Categories](#template-categories)
- [File Format](#file-format)
- [Examples](#examples)
- [Development](#development)

## Overview

This project contains **304 prompt templates** organized across 6 categories, all converted from CSV format to Dotprompt format. Each template is ready to use with Google AI's Gemini models through the Genkit framework.

### Features

- ✅ **304 ready-to-use templates** across multiple content types
- ✅ **Automatic placeholder conversion** from `[Placeholder]` to Handlebars `{{placeholder}}`
- ✅ **Input schema detection** for type-safe prompt execution
- ✅ **Organized by category** for easy discovery
- ✅ **Dotprompt format** compatible with Genkit

## Project Structure

```
cos-templates/
├── input/                          # Original CSV files
│   ├── 📃 writingBrandVoice-Grid view.csv
│   ├── 📃 blogpostTemplatePrompts-Grid view.csv
│   ├── 📃 ideasTemplatePrompts-Grid view.csv
│   ├── 📃 promoEmailPromptTemplates-Grid view.csv
│   ├── 📃 socialPostTemplates-Grid view.csv
│   └── 📃 videoReelsHooksTemplates-Grid view.csv
│
├── prompts/                        # Generated Dotprompt files
│   ├── brand-voice/               # 6 templates
│   ├── blogpost/                  # 9 templates
│   ├── ideas/                     # 11 templates
│   ├── email/                     # 5 templates
│   ├── social/                    # 86 templates
│   └── video/                     # 187 templates
│
├── transform.js                   # Transformation script
├── package.json                    # Dependencies and scripts
└── README.md                      # This file
```

## Installation

1. **Clone or download this repository**

2. **Install dependencies:**
   ```bash
   npm install
   ```

   This will install:
   - `genkit` - Genkit framework
   - `@genkit-ai/googleai` - Google AI plugin for Genkit
   - `csv-parse` - CSV parsing library

3. **Set up Google AI API key** (if not already configured):
   ```bash
   export GOOGLE_GENAI_API_KEY="your-api-key-here"
   ```

## Transformation

The transformation script converts CSV files to Dotprompt format automatically.

### Running the Transformation

```bash
npm run transform
```

### What the Transformation Does

1. **Reads CSV files** from the `input/` directory
2. **Parses multi-line CSV** fields correctly
3. **Converts placeholders** from `[Placeholder Name]` to `{{placeholder_name}}`
4. **Detects input variables** and generates schema definitions
5. **Creates `.prompt` files** with YAML frontmatter
6. **Organizes templates** into category directories
7. **Sanitizes filenames** for filesystem compatibility

### Transformation Details

- **Placeholder conversion**: `[Topic]` → `{{topic}}`, `[Your Idea]` → `{{your_idea}}`
- **BOM handling**: Automatically removes UTF-8 BOM characters
- **Column matching**: Flexible matching for column names with variations
- **Preference**: Uses `packagedPromptTemplateIdeas` column when available

## Using the Templates

### Basic Setup

```javascript
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Initialize Genkit with Google AI plugin
const ai = genkit({
  plugins: [googleAI()],
  promptDir: './prompts',  // Path to prompts directory
});
```

### Loading and Executing a Prompt

```javascript
// Load a prompt template
const blogPostPrompt = ai.prompt('blogpost/how_to_guide');

// Execute with input variables
const { output } = await blogPostPrompt({
  topic: 'Blockchain Technology',
  audience: 'Developers'
});

console.log(output);
```

### Example: Social Media Post

```javascript
const socialPrompt = ai.prompt('social/tomorrowsnewsletter');

const { output } = await socialPrompt({
  content_eg_newsletter_podcast_episode: 'newsletter',
  bigpromise: 'revolutionary insights',
  desiredoutcome: 'grow their business'
});

// Output: "Tomorrow's newsletter will be revolutionary insights
//          for anyone who wants grow their business..."
```

### Example: Blog Post Template

```javascript
const caseStudyPrompt = ai.prompt('blogpost/case_study');

const { output } = await caseStudyPrompt({
  // Inputs are detected from the template's schema
});
```

## Template Categories

### 🎨 Brand Voice (`brand-voice/`)
Templates for maintaining consistent brand voice across different content types.

**Templates:**
- `visionary_and_innovative_payment.prompt`
- `visionary_and_innovative_cuur.prompt`
- `trustworthy_and_transparent.prompt`
- `empowering_and_inclusive.prompt`
- `tech_savvy_and_scalable.prompt`
- `informative_and_exciting.prompt`

### 📝 Blog Post (`blogpost/`)
Templates for various blog post formats.

**Templates:**
- `how_to_guide.prompt` - Step-by-step guides
- `listicle.prompt` - Numbered list articles
- `comparison_post.prompt` - Comparison articles
- `checklist_cheat_sheet.prompt` - Checklist format
- `newsworthy_article.prompt` - News-style articles
- `personal_story_article.prompt` - Personal narrative
- `case_study.prompt` - Case study format
- `data_study.prompt` - Data-driven articles
- `curated_post.prompt` - Curated content

### 💡 Ideas (`ideas/`)
Templates for generating and developing content ideas.

**Templates:**
- `askanexpert.prompt` - Expert deep-dive explanations
- `simpleexplainer.prompt` - Simple explanations
- `schoolessay.prompt` - Essay structure
- `explaincomplextopics.prompt` - Complex topic breakdowns
- `thinkstepbystep.prompt` - Step-by-step idea development
- `newsletterideagenerator.prompt` - Newsletter content ideas
- `curewritersblock.prompt` - Creative writing exercises
- `makeconnectionsbetweenideas.prompt` - Idea connections
- `createyoutubescriptoutline.prompt` - YouTube script outlines
- `createpodcastquestions.prompt` - Podcast question generation
- `chainofthought.prompt` - Chain of thought reasoning

### 📧 Email (`email/`)
Promotional email templates for various content types.

**Templates:**
- `podcastpromotion.prompt` - Podcast episode promotion
- `blogpostpromotion.prompt` - Blog post promotion
- `summitaffiliatepromotionemail.prompt` - Summit/event promotion
- `contenttonewsletter.prompt` - Newsletter content
- `socialpostpromotion.prompt` - Social media promotion

### 📱 Social Media (`social/`)
Templates for creating engaging social media posts.

**86 templates** including:
- `tomorrowsnewsletter.prompt` - Newsletter teasers
- `evertried.prompt` - Pain point hooks
- `threethingsresult.prompt` - List format posts
- `90%ofx.prompt` - Percentage-based hooks
- And many more...

### 🎬 Video (`video/`)
Templates for creating video reel hooks and engaging openings.

**187 templates** including:
- `challengetooutcome.prompt` - Challenge-to-outcome hooks
- `stopdoing.prompt` - Mistake correction hooks
- `messedup.prompt` - Personal story hooks
- `somethingcrazy.prompt` - Attention-grabbing hooks
- And many more...

## File Format

Each `.prompt` file follows the Dotprompt format:

```yaml
---
model: googleai/gemini-1.5-pro
input:
  schema:
    topic: string
    audience: string
    tone?: string
output:
  format: text
---
Your prompt text with {{topic}} and {{audience}} placeholders...
```

### Format Components

- **YAML Frontmatter**: Defines model, input schema, and output format
- **Model**: Set to `googleai/gemini-1.5-pro` by default
- **Input Schema**: Automatically detected from placeholders in the prompt
- **Output Format**: Set to `text` for all templates
- **Prompt Body**: The actual prompt text with Handlebars placeholders

## Examples

### Example 1: Blog Post How-To Guide

**Template:** `prompts/blogpost/how_to_guide.prompt`

```javascript
const howToGuide = ai.prompt('blogpost/how_to_guide');

const { output } = await howToGuide({
  text: 'Optional text input'
});
```

### Example 2: Social Media Post with Variables

**Template:** `prompts/social/tomorrowsnewsletter.prompt`

```javascript
const newsletterTeaser = ai.prompt('social/tomorrowsnewsletter');

const { output } = await newsletterTeaser({
  content_eg_newsletter_podcast_episode: 'podcast episode',
  bigpromise: 'exclusive interview with industry leaders',
  desiredoutcome: 'accelerate their career growth'
});
```

### Example 3: Idea Generation

**Template:** `prompts/ideas/askanexpert.prompt`

```javascript
const expertExplanation = ai.prompt('ideas/askanexpert');

const { output } = await expertExplanation({
  topic: 'Blockchain Technology'
});
```

## Development

### Regenerating Templates

If you update the CSV files in the `input/` directory, regenerate the prompts:

```bash
npm run transform
```

This will:
- Remove existing prompts (if any)
- Regenerate all templates from CSV files
- Preserve the directory structure

### Customizing Templates

You can manually edit any `.prompt` file after generation. Changes will persist until you run `npm run transform` again.

### Adding New Templates

1. Add your CSV file to the `input/` directory
2. Update `transform.js` to include your file configuration
3. Run `npm run transform`

## Notes

- **Placeholder Conversion**: All `[Placeholder]` syntax is converted to Handlebars `{{placeholder}}` format
- **Filename Sanitization**: Template names are sanitized for filesystem compatibility (spaces → underscores, special chars removed)
- **Column Preference**: The transformation prefers `packagedPromptTemplateIdeas` column when available
- **BOM Handling**: UTF-8 BOM characters are automatically removed during parsing
- **Input Schema**: Variables are automatically detected from Handlebars placeholders in the prompt text

## License

[Add your license here]

## Contributing

[Add contribution guidelines here]

---

**Total Templates:** 304
**Last Updated:** Generated from CSV files using `transform.js`
