# Blog & Case Studies Setup Guide

This guide walks you through setting up the Contentful CMS integration for your portfolio blog.

## Files Added

- `article.html` — Individual article/case study template (loads article by `?slug=` query param)
- `script.js` — Updated with `initContentfulBlog()` and `renderBlogList()` functions
- `index.html` — Added blog section between projects and contact, plus Contentful CDN script and nav link
- `styles.css` — Added `.blog`, `.post-tile`, `.read-more` styling
- `contentful-migration.json` — Reference file listing Article and CaseStudy content type fields

## Quick Setup (5 minutes)

### 1. Create Contentful Content Types

Visit [Contentful](https://contentful.com) and create a **free account** if you don't have one.

#### Create "Article" Content Type:
1. Go to **Settings** → **Content model** → **Create content type**
2. **Name**: Article  
   **Api Identifier**: article
3. Click **Create**
4. Add the following fields:
   - **title** (Short text, required)
   - **slug** (Short text, required & unique)
   - **publishDate** (Date & time)
   - **excerpt** (Short text)
   - **coverImage** (Media — images only)
   - **body** (Rich Text — with embedded assets & entries)
   - **tags** (Array of short text)
   - **featured** (Boolean)
   - **seoDescription** (Short text)

#### Create "CaseStudy" Content Type:
1. Create a second content type with **Name**: Case Study  
   **Api Identifier**: caseStudy
2. Add the same fields as Article, plus:
   - **metrics** (JSON object)
   - **techStack** (Array of short text)
   - **ctaLinks** (JSON object)

### 2. Get Your API Keys

1. In Contentful, go to **Settings** → **API keys**
2. Click **Add API key**
3. Copy your **Space ID** and **Content Delivery API (CDA) token** (read-only)

### 3. Add Keys to Code

Replace placeholders in two files:

**`contentful-config.js`**:
```javascript
window.CONTENTFUL_CONFIG = {
    space: 'YOUR_SPACE_ID',
    accessToken: 'YOUR_CDA_TOKEN',
    environment: 'master'
};
```

Your current `contentful-config.js` is already filled with the live Space ID and Content Delivery API token.

### Optional: Run the Migration

Your Contentful space currently has the `Article` content type, but it may still need the remaining blog fields. If you have the Contentful CLI installed and are logged in, run:

```bash
contentful space migration --space-id 84io6ov68x39 --environment-id master contentful-migration.js
```

This adds the missing `Article` fields and creates the `Case Study` content type.

### 4. Write Your First Article

1. In Contentful, go to **Content** → **Create entry**
2. Select **Article**
3. Fill in:
   - **title**: "My First Article"
   - **slug**: `my-first-article` (used in URL: `article.html?slug=my-first-article`)
   - **body**: Use the rich text editor (paste text, add headings, bold, etc.)
   - **publishDate**: Today
   - **excerpt**: Brief summary
4. Click **Publish**

### 5. View Your Blog

- Refresh your portfolio homepage — you should see the article in the "Blog & Case Studies" section
- Click **Read →** to view the full article at `article.html?slug=my-first-article`

## Features

### Rich Text Body
Use Contentful's built-in rich text editor to add:
- Headings, paragraphs, lists, blockquotes
- **Bold**, *italic*, `code`
- Embedded images (via Assets)
- Embedded code blocks (if you create a separate CodeBlock entry type)

### Syntax Highlighting
The `article.html` includes **Prism.js** for code block syntax highlighting. Code blocks render as:
```html
<pre><code class="language-javascript">your code here</code></pre>
```

### SEO
Each article has:
- `slug` for friendly URLs
- `seoDescription` for meta tags (optional, add to article.html template if needed)
- `coverImage` for social previews

## Optional Enhancements

### Code Blocks with Language Tags
Create a separate **CodeBlock** content type:
- **code** (Text, required)
- **language** (Short text, e.g., `javascript`, `python`)

Link it in Article's **body** as an embedded entry, and it will render with language-specific highlighting.

### Webhooks (Auto-Rebuild)
If you host on Vercel/Netlify:
1. Go to **Settings** → **Webhooks**
2. Add a webhook pointing to your build URL (e.g., Vercel deploy hook)
3. On "Publish" or "Unpublish", your site rebuilds instantly

### Localization
To support multiple languages:
1. In **Settings** → **Locales**, add a new locale (e.g., Spanish)
2. In content types, enable localization for fields like title, body, slug
3. Update `article.html` to handle locale query params

## Troubleshooting

**"Articles not loading"**
- Check browser console (F12) for errors
- Verify Space ID and CDA token are correct
- Ensure article entries are **Published** (not Draft)

**"Article page shows 'not found'"**
- Double-check the **slug** in Contentful (should match query param: `?slug=...`)
- Slugs are case-sensitive and must follow the regex: `^[a-z0-9]+(?:-[a-z0-9]+)*$` (lowercase, hyphens only)

**Code blocks not highlighting**
- Prism is already included in `article.html`
- Ensure your code is inside a `<pre><code class="language-xxx">` tag
- Refresh the page after adding new code blocks

## Files Reference

| File | Purpose |
|------|---------|
| `script.js` | Contentful client init, blog fetching & rendering |
| `article.html` | Individual article template with rich text + code highlighting |
| `index.html` | Blog section HTML + navigation link |
| `styles.css` | `.blog`, `.post-tile`, `.read-more` styles |
| `contentful-config.js` | Shared Space ID, CDA token, and environment |
| `contentful-migration.json` | Reference schema (manual setup guide) |
| `contentful-migration.js` | Runnable Contentful CLI migration |

## Next Steps

- Write 3–5 articles to populate your blog
- Customize CSS (colors, grid layout) in `styles.css` if desired
- Add a search feature or filter by tags
- Set up webhooks for auto-rebuild on publish
- Consider migrating GitHub readmes or project docs into case studies

Happy blogging! 🚀
