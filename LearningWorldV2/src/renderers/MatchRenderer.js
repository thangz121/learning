import { InteractionRenderer } from './InteractionRenderer.js';
import { DOMHelper } from '../helpers/DOMHelper.js';

/**
 * MatchRenderer - Ghép cặp.
 */
export class MatchRenderer extends InteractionRenderer {
  buildInteractionLayout(question) {
    const root = this.getRoot();
    if (!root) return;

    const choices = DOMHelper.create('div', { classes: ['match-choices'] });
    for (const choice of question.choices) {
      choices.appendChild(this.createDraggable(choice, 'match-item'));
    }

    const zones = DOMHelper.create('div', { classes: ['match-zones'] });
    for (const zone of question.zones) {
      zones.appendChild(this.createZone(zone, 'match-zone', 'match-zone-area'));
    }

    root.appendChild(choices);
    root.appendChild(zones);
    this.setChoicesContainer(choices);
  }

  onItemDropped(value, targetEl) {
    const dragged = this.getRoot()?.querySelector(`[data-value="${value}"][data-draggable]`);
    if (!dragged) return;
    const area = targetEl.querySelector('.match-zone-area');
    if (area) { area.appendChild(dragged); dragged.classList.add('matched'); }
  }
}
