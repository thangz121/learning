import { InteractionRenderer } from './InteractionRenderer.js';
import { DOMHelper } from '../helpers/DOMHelper.js';

/**
 * CategorizeRenderer - Phân loại.
 */
export class CategorizeRenderer extends InteractionRenderer {
  buildInteractionLayout(question) {
    const root = this.getRoot();
    if (!root) return;

    const choices = DOMHelper.create('div', { classes: ['categorize-choices'] });
    for (const choice of question.choices) {
      choices.appendChild(this.createDraggable(choice, 'categorize-item'));
    }

    const categories = DOMHelper.create('div', { classes: ['categorize-categories'] });
    for (const zone of question.zones) {
      const cat = this.createZone(zone, 'categorize-category', 'categorize-category-area');
      const header = DOMHelper.create('div', { classes: ['categorize-category-header'] });
      if (zone.image) {
        const img = DOMHelper.create('img', { classes: ['categorize-category-image'], attrs: { src: zone.image, alt: '' } });
        header.appendChild(img);
      }
      header.appendChild(DOMHelper.create('span', { classes: ['categorize-category-label'], text: zone.text || zone.value }));
      cat.insertBefore(header, cat.firstChild);
      categories.appendChild(cat);
    }

    root.appendChild(choices);
    root.appendChild(categories);
    this.setChoicesContainer(choices);
  }

  onItemDropped(value, targetEl) {
    const dragged = this.getRoot()?.querySelector(`[data-value="${value}"][data-draggable]`);
    if (!dragged) return;
    const area = targetEl.querySelector('.categorize-category-area');
    if (area) { area.appendChild(dragged); dragged.classList.add('categorized'); }
  }
}
