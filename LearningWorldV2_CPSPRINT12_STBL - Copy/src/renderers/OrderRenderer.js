import { InteractionRenderer } from './InteractionRenderer.js';
import { DOMHelper } from '../helpers/DOMHelper.js';

/**
 * OrderRenderer - Sắp xếp thứ tự.
 */
export class OrderRenderer extends InteractionRenderer {
  buildInteractionLayout(question) {
    const root = this.getRoot();
    if (!root) return;

    const choices = DOMHelper.create('div', { classes: ['order-choices'] });
    for (const choice of question.choices) {
      choices.appendChild(this.createDraggable(choice, 'order-item'));
    }

    const slots = DOMHelper.create('div', { classes: ['order-slots'] });
    for (const zone of question.zones) {
      const slot = this.createZone(zone, 'order-slot', 'order-slot-area');
      const label = DOMHelper.create('div', { classes: ['order-slot-label'], text: zone.text || zone.value });
      slot.insertBefore(label, slot.firstChild);
      slots.appendChild(slot);
    }

    root.appendChild(choices);
    root.appendChild(slots);
    this.setChoicesContainer(choices);
  }

  onItemDropped(value, targetEl) {
    const dragged = this.getRoot()?.querySelector(`[data-value="${value}"][data-draggable]`);
    if (!dragged) return;
    const area = targetEl.querySelector('.order-slot-area');
    if (area) { area.appendChild(dragged); dragged.classList.add('placed'); }
  }
}
