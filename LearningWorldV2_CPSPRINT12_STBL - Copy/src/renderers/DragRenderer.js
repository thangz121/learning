import { InteractionRenderer } from './InteractionRenderer.js';
import { DOMHelper } from '../helpers/DOMHelper.js';

/**
 * DragRenderer - Kéo thả vào zone.
 */
export class DragRenderer extends InteractionRenderer {
  buildInteractionLayout(question) {
    const root = this.getRoot();
    if (!root) return;

    const draggables = DOMHelper.create('div', { classes: ['drag-draggables'] });
    for (const choice of question.choices) {
      draggables.appendChild(this.createDraggable(choice, 'drag-item'));
    }

    const zones = DOMHelper.create('div', { classes: ['drag-zones'] });
    for (const zone of question.zones) {
      zones.appendChild(this.createZone(zone, 'drag-zone', 'drag-zone-area'));
    }

    root.appendChild(draggables);
    root.appendChild(zones);
  }

  onItemDropped(value, targetEl) {
    const dragged = this.getRoot()?.querySelector(`[data-value="${value}"][data-draggable]`);
    if (!dragged) return;
    const area = targetEl.querySelector('.drag-zone-area');
    if (area) { area.appendChild(dragged); dragged.classList.add('dropped'); }
  }
}
