import { Component, Input, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Strapi Blocks Renderer for Angular.
 * Replaces @strapi/blocks-react-renderer.
 * Renders Strapi's structured rich text content (paragraphs, headings, lists, images, quotes, code).
 */

@Pipe({ name: 'strapiBlocks', standalone: true })
export class StrapiBlocksPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(blocks: any[] | null | undefined): SafeHtml {
    if (!blocks || !Array.isArray(blocks)) return '';
    const html = blocks.map(block => this.renderBlock(block)).join('');
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  private renderBlock(block: any): string {
    switch (block.type) {
      case 'paragraph':
        return `<p>${this.renderChildren(block.children)}</p>`;
      case 'heading':
        const level = block.level || 2;
        return `<h${level}>${this.renderChildren(block.children)}</h${level}>`;
      case 'list':
        const tag = block.format === 'ordered' ? 'ol' : 'ul';
        const items = block.children
          .map((item: any) => `<li>${this.renderChildren(item.children)}</li>`)
          .join('');
        return `<${tag}>${items}</${tag}>`;
      case 'image':
        const src = block.image?.url || '';
        const alt = block.image?.alternativeText || '';
        return `<img src="${src}" alt="${alt}" class="rounded-lg my-4" loading="lazy" />`;
      case 'quote':
        return `<blockquote>${this.renderChildren(block.children)}</blockquote>`;
      case 'code':
        const code = block.children?.map((c: any) => c.text || '').join('') || '';
        return `<pre><code>${this.escapeHtml(code)}</code></pre>`;
      default:
        return '';
    }
  }

  private renderChildren(children: any[]): string {
    if (!children) return '';
    return children.map(child => this.renderChild(child)).join('');
  }

  private renderChild(child: any): string {
    if (child.type === 'text') {
      let text = this.escapeHtml(child.text || '');
      if (child.bold) text = `<strong>${text}</strong>`;
      if (child.italic) text = `<em>${text}</em>`;
      if (child.underline) text = `<u>${text}</u>`;
      if (child.strikethrough) text = `<del>${text}</del>`;
      if (child.code) text = `<code>${text}</code>`;
      return text;
    }

    if (child.type === 'link') {
      const href = child.url || '#';
      return `<a href="${href}" target="_blank" rel="noopener noreferrer">${this.renderChildren(child.children)}</a>`;
    }

    if (child.type === 'list-item') {
      return this.renderChildren(child.children);
    }

    return child.text ? this.escapeHtml(child.text) : '';
  }

  private escapeHtml(text: string): string {
    const div = typeof document !== 'undefined' ? document.createElement('div') : null;
    if (div) {
      div.textContent = text;
      return div.innerHTML;
    }
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}

@Component({
  selector: 'app-strapi-blocks',
  standalone: true,
  imports: [StrapiBlocksPipe],
  template: `<div [class]="className" [innerHTML]="content | strapiBlocks"></div>`,
  styles: [`:host { display: contents; }`],
})
export class StrapiBlocksComponent {
  @Input() content: any[] | null = null;
  @Input() className = '';
}
