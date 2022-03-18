export const MARKDOWN_EXAMPLE = `# Markdown example

This example tries to cover most features. Please update it accordingly.

# Level 1
# Level 2
### Level 3
#### Level 4
##### Level 5
###### Level 6
Level 1
===
Level 2
---

**Bold 1**

__Bold 2__

_Italic 1_

*Italic 2*

~~Strikethrough~~

\`Inline code\`

[Link](https://github.com/)

\`\`\`tsx
export const Markdown = ({ value, headingLinks, ...props }: MarkdownProps) => (
  <Box {...props} p=".5em">
    <MarkdownProvider headingLinks={headingLinks}>
      <MemoizedMarkdown value={value} />
    </MarkdownProvider>
  </Box>
);
\`\`\`

> Quote block
> with some \`inner-code\`:
> \`\`\`python
> print("Hello world!")
> \`\`\`

![Image](https://labelflow.ai/static/icon-256x256.png)

<center>Raw HTML</center>
`;
