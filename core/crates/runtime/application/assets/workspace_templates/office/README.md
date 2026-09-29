# Operit Office Documents Workspace

This is a professional document processing workspace with powerful document conversion and typesetting tools built in.

## Core Tools

### 📄 Pandoc - The document conversion powerhouse
Pandoc is the most powerful document format conversion tool, supporting conversions between dozens of formats.

#### Installing Pandoc
```bash
# Ubuntu/Termux
apt install pandoc

# Verify the installation
pandoc --version
```

#### Common conversion commands
```bash
# Markdown → PDF (XeLaTeX engine recommended)
pandoc input.md -o output.pdf --pdf-engine=xelatex -V CJKmainfont="Noto Sans CJK SC"

# Markdown → Word
pandoc input.md -o output.docx

# Markdown → HTML
pandoc input.md -o output.html --standalone

# Word → Markdown
pandoc input.docx -o output.md

# HTML → PDF
pandoc input.html -o output.pdf --pdf-engine=xelatex

# Batch-convert Markdown to PDF
for f in *.md; do pandoc "$f" -o "${f%.md}.pdf" --pdf-engine=xelatex; done
```

### 📐 XeLaTeX - Professional typesetting engine
XeLaTeX is a LaTeX engine with Unicode and modern font support, ideal for CJK typesetting.

#### Installing TeX Live (includes XeLaTeX)
```bash
# Ubuntu/Termux (minimal install)
apt install texlive-xetex texlive-fonts-recommended

# Full install (recommended, about 4GB)
apt install texlive-full
```

#### Compiling LaTeX directly
```bash
# Compile a .tex file to PDF
xelatex document.tex

# Compile multiple times (for the table of contents and references)
xelatex document.tex && xelatex document.tex
```

#### Advanced Pandoc + XeLaTeX usage
```bash
# Use a custom template
pandoc input.md -o output.pdf --template=mytemplate.tex --pdf-engine=xelatex

# Add a table of contents
pandoc input.md -o output.pdf --toc --pdf-engine=xelatex

# Set margins and fonts
pandoc input.md -o output.pdf --pdf-engine=xelatex \
  -V geometry:margin=2cm \
  -V CJKmainfont="Noto Sans CJK SC" \
  -V fontsize=12pt
```

## Other Useful Tools

### 📊 Text processing tools
```bash
# wkhtmltopdf - HTML to PDF (another option)
apt install wkhtmltopdf
wkhtmltopdf input.html output.pdf

# LibreOffice - Office document processing
apt install libreoffice
libreoffice --headless --convert-to pdf document.docx

# csvkit - CSV data processing
pip install csvkit
csvcut -c 1,3 data.csv > output.csv
csvsql --query "SELECT * FROM data WHERE value > 100" data.csv
```

### 🔍 Document search and processing
```bash
# Search for content across multiple files
grep -r "keyword" .

# Use ripgrep (faster)
rg "keyword" --type md

# Batch-rename files
rename 's/old/new/' *.txt

# PDF text extraction
pdftotext document.pdf output.txt
```

### 📝 Markdown extras
```bash
# markdown-toc - generate a table of contents automatically
npm install -g markdown-toc
markdown-toc -i README.md

# prettier - format Markdown
npm install -g prettier
prettier --write *.md
```

## Recommended Workflows

### 1. Writing in Markdown → publishing as PDF
```bash
# Write the Markdown document
vim report.md

# Convert it to a polished PDF
pandoc report.md -o report.pdf \
  --pdf-engine=xelatex \
  --toc \
  -V CJKmainfont="Noto Sans CJK SC" \
  -V geometry:margin=2.5cm
```

### 2. Converting documents to multiple formats
```bash
# Generate several formats at once
pandoc document.md -o document.pdf --pdf-engine=xelatex
pandoc document.md -o document.docx
pandoc document.md -o document.html --standalone
```

### 3. Academic typesetting with LaTeX
```bash
# Create an academic paper template
cat > paper.tex << 'EOF'
\documentclass{article}
\usepackage{xeCJK}
\setCJKmainfont{Noto Sans CJK SC}
\title{My Paper}
\author{Author}
\begin{document}
\maketitle
\section{Introduction}
Body text...
\end{document}
EOF

# Compile
xelatex paper.tex
```

## File Organization Suggestions

```
workspace/
├── source/         # Source files (Markdown, LaTeX)
├── output/         # Output files (PDF, DOCX)
├── templates/      # Custom templates
├── images/         # Image assets
└── README.md
```

## FAQ

### Q: Chinese characters in a PDF show up as boxes?
```bash
# Install CJK fonts
apt install fonts-noto-cjk

# Specify the font in the pandoc command
-V CJKmainfont="Noto Sans CJK SC"
```

### Q: How do I customize the PDF style?
Create a YAML metadata header:
```yaml
---
title: "Document Title"
author: "Author Name"
date: 2025-11-29
geometry: margin=2cm
fontsize: 12pt
---
```

### Q: How do I batch-process a large number of documents?
```bash
# Shell script automation
for file in source/*.md; do
    filename=$(basename "$file" .md)
    pandoc "$file" -o "output/${filename}.pdf" --pdf-engine=xelatex
done
```

## Tips

- 💡 Prefer the Pandoc + XeLaTeX combination to generate high-quality PDFs
- 💡 Markdown is the best source format — easy to edit and version control
- 💡 Use Git to manage document versions (.gitignore is preconfigured)
- 💡 Write LaTeX directly for complex typesetting needs
- 💡 Use shell scripts to automate batch processing

Happy Writing! ✍️✨
