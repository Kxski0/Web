/**
 * Aktivitätsverlauf.
 *
 * Der Store protokolliert jede Änderung selbst (siehe data/store.js). Hier wird
 * das Protokoll nur gefiltert und nach Tagen gruppiert dargestellt.
 */
import { h } from '../dom.js';
import { PageHeader, EmptyState, Card } from '../components/basics.js';
import { Toolbar, createRegion } from '../components/Toolbar.js';
import { ENTITIES, ENTITY_ORDER } from '../../data/schema.js';
import { formatDateTime, formatRelative, formatDate, asDay, today } from '../../core/format.js';
import { fold } from '../../core/util.js';

const ACTION_LABELS = {
  create: 'Angelegt',
  update: 'Geändert',
  delete: 'Gelöscht',
  system: 'System',
};

export function renderActivity(ctx) {
  const { store, navigate } = ctx;
  const state = ctx.getViewState('activity', { search: '', entityKey: '', action: '' });
  const region = createRegion('list-region');
  const toolbarRegion = createRegion('toolbar-region');

  function draw() {
    const needle = fold(state.search);
    const rows = store.activity().filter((a) => {
      if (state.entityKey && a.entityKey !== state.entityKey) return false;
      if (state.action && a.action !== state.action) return false;
      if (needle && !fold(a.text).includes(needle)) return false;
      return true;
    });

    toolbarRegion.render(Toolbar({
      state,
      searchPlaceholder: 'Verlauf durchsuchen …',
      resultCount: rows.length,
      totalCount: store.activity().length,
      filters: [
        {
          name: 'entityKey',
          label: 'Bereich',
          options: ENTITY_ORDER.map((key) => ({ value: key, label: ENTITIES[key].label })),
        },
        {
          name: 'action',
          label: 'Art',
          options: Object.entries(ACTION_LABELS).map(([value, label]) => ({ value, label })),
        },
      ],
      onChange: (patch) => {
        Object.assign(state, patch);
        draw();
      },
    }));

    if (!rows.length) {
      region.render(EmptyState({
        iconName: 'activity',
        title: 'Keine Einträge',
        text: store.activity().length
          ? 'Für die aktuelle Auswahl gibt es keine Einträge.'
          : 'Sobald Sie Daten anlegen oder ändern, erscheint hier der Verlauf.',
      }));
      return;
    }

    // Nach Tagen gruppieren – dadurch bleibt eine lange Liste lesbar.
    const groups = [];
    let currentDay = null;
    for (const row of rows) {
      const day = asDay(row.at);
      if (day !== currentDay) {
        currentDay = day;
        groups.push({ day, items: [] });
      }
      groups[groups.length - 1].items.push(row);
    }

    region.render(...groups.map((group) => Card({
      title: dayHeading(group.day),
      subtitle: `${group.items.length} ${group.items.length === 1 ? 'Eintrag' : 'Einträge'}`,
      children: h('ul.activity-list', null, ...group.items.map((a) => {
        const route = a.entityKey ? ENTITIES[a.entityKey]?.route : null;
        const canOpen = Boolean(route && a.entityId && store.byId(a.entityKey, a.entityId));
        const content = [
          h('span', { class: `activity-dot action-${a.action}`, 'aria-hidden': 'true' }),
          h('span.activity-text', null, a.text),
          h('span.activity-time', { title: formatDateTime(a.at) }, formatRelative(a.at)),
        ];
        return h('li.activity-item', null,
          canOpen
            ? h('button.activity-btn', { type: 'button', onClick: () => navigate(route, a.entityId) }, ...content)
            : h('div.activity-btn', null, ...content));
      })),
    })));
  }

  draw();

  return h('div.view', null,
    PageHeader({
      title: 'Aktivitätsverlauf',
      subtitle: 'Was zuletzt passiert ist – automatisch protokolliert',
    }),
    toolbarRegion.el,
    region.el);
}

function dayHeading(day) {
  const now = today();
  if (day === now) return 'Heute';
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (day === asDay(yesterday.toISOString())) return 'Gestern';
  return formatDate(day);
}
