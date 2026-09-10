/**
 * Aufgaben.
 *
 * Zwei Ansichten aus denselben Daten: Liste (filterbar, sortierbar) und Board
 * nach Status. Das Abhaken funktioniert in beiden mit einem Tipp – das ist die
 * mit Abstand häufigste Aktion.
 */
import { h } from '../dom.js';
import { icon } from '../icons.js';
import { Button, StatCard } from '../components/basics.js';
import { SegmentedControl } from '../components/Toolbar.js';
import { openEditDialog, confirmDelete } from '../components/recordDialog.js';
import { createListView, selectFilter, refFilter, dateCell, statusCell, refCell } from './listView.js';
import { createDetailView } from './detailView.js';
import { TASK_STATUS, TASK_OPEN, optionLabel } from '../../data/schema.js';
import { formatDate, daysUntil } from '../../core/format.js';

export function renderTasks(ctx) {
  const { store, navigate } = ctx;
  const all = store.all('tasks');
  const open = all.filter((t) => TASK_OPEN.includes(t.status));
  const overdue = open.filter((t) => t.deadline && daysUntil(t.deadline) < 0);

  const viewState = ctx.getViewState('tasksView', { mode: 'list' });

  const summary = h('div.stat-row.stat-row-compact', null,
    StatCard({ label: 'Offen', value: all.filter((t) => t.status === 'offen').length, tone: 'warn' }),
    StatCard({ label: 'In Arbeit', value: all.filter((t) => t.status === 'in_arbeit').length, tone: 'progress' }),
    StatCard({ label: 'Erledigt', value: all.filter((t) => t.status === 'erledigt').length, tone: 'success' }),
    StatCard({ label: 'Überfällig', value: overdue.length, tone: overdue.length ? 'danger' : 'neutral' }));

  const modeSwitch = SegmentedControl({
    label: 'Ansicht',
    value: viewState.mode,
    items: [{ value: 'list', label: 'Liste' }, { value: 'board', label: 'Board' }],
    onChange: (mode) => {
      viewState.mode = mode;
      ctx.refresh();
    },
  });

  return createListView({
    ctx,
    entityKey: 'tasks',
    subtitle: `${open.length} offen · ${all.length} insgesamt`,
    above: summary,
    headerActions: [modeSwitch],
    columns: [
      {
        key: 'title',
        label: 'Titel',
        primary: true,
        sortable: true,
        render: (t) => h('span.task-title-cell', null,
          checkButton(ctx, t),
          h('span', { class: t.status === 'erledigt' ? 'cell-strong is-done' : 'cell-strong' }, t.title)),
      },
      {
        key: 'projectId',
        label: 'Projekt',
        sortable: true,
        value: (t) => store.titleOf('projects', t.projectId),
        render: (t) => refCell(store, 'projects', t.projectId, (id) => navigate('projekte', id)),
      },
      { key: 'priority', label: 'Priorität', sortable: true, render: (t) => statusCell('tasks', 'priority', t.priority) },
      { key: 'status', label: 'Status', sortable: true, render: (t) => statusCell('tasks', 'status', t.status) },
      {
        key: 'deadline',
        label: 'Deadline',
        sortable: true,
        render: (t) => dateCell(t.deadline, { warnPast: t.status !== 'erledigt' }),
      },
    ],
    filters: [
      selectFilter('tasks', 'status'),
      selectFilter('tasks', 'priority', 'Priorität'),
      refFilter(store, 'tasks', 'projectId', 'Projekt'),
      {
        name: 'due',
        label: 'Termin',
        options: [
          { value: 'overdue', label: 'Überfällig' },
          { value: 'week', label: 'Diese Woche' },
          { value: 'none', label: 'Ohne Termin' },
        ],
        all: 'Egal',
        test: (row, value) => {
          const left = daysUntil(row.deadline);
          if (value === 'none') return !row.deadline;
          if (left === null) return false;
          if (value === 'overdue') return left < 0 && row.status !== 'erledigt';
          if (value === 'week') return left >= 0 && left <= 7;
          return true;
        },
      },
    ],
    sorts: [
      { value: 'deadline', label: 'Deadline' },
      { value: 'priority', label: 'Priorität' },
      { value: 'title', label: 'Titel' },
      { value: 'status', label: 'Status' },
    ],
    onRowClick: (t) => navigate('aufgaben', t._id),
    renderRows: viewState.mode === 'board' ? (rows) => renderBoard(ctx, rows) : null,
  });
}

/** Abhaken ohne Umweg – der häufigste Handgriff bekommt das größte Ziel. */
function checkButton(ctx, task) {
  const done = task.status === 'erledigt';
  return h('button', {
    type: 'button',
    class: `task-check ${done ? 'is-done' : ''}`.trim(),
    'aria-pressed': done ? 'true' : 'false',
    'aria-label': done ? `„${task.title}" wieder öffnen` : `„${task.title}" als erledigt markieren`,
    title: done ? 'Wieder öffnen' : 'Als erledigt markieren',
    onClick: (e) => {
      e.stopPropagation();
      ctx.store.patch('tasks', task._id, { status: done ? 'offen' : 'erledigt' });
    },
  }, icon('check', { size: 14 }));
}

/** Board nach Status – auf dem iPad nebeneinander, auf dem Handy untereinander. */
function renderBoard(ctx, rows) {
  const { store, navigate } = ctx;
  const board = h('div.board');

  for (const status of TASK_STATUS) {
    const items = rows.filter((t) => t.status === status.value);
    board.appendChild(h('section.board-col', null,
      h('header.board-col-head', null,
        h('h3.board-col-title', null, status.label),
        h('span.board-col-count', null, String(items.length))),
      items.length
        ? h('ul.board-list', null, ...items.map((t) => h('li', null, h('article.board-card', null,
          h('div.board-card-head', null,
            checkButton(ctx, t),
            h('button.board-card-title', {
              type: 'button',
              onClick: () => navigate('aufgaben', t._id),
            }, t.title)),
          h('div.board-card-meta', null,
            statusCell('tasks', 'priority', t.priority),
            t.deadline
              ? h('span', {
                class: daysUntil(t.deadline) < 0 && t.status !== 'erledigt' ? 'row-meta tone-danger' : 'row-meta',
              }, formatDate(t.deadline))
              : null),
          t.projectId
            ? h('button.board-card-project', {
              type: 'button',
              onClick: () => navigate('projekte', t.projectId),
            }, store.titleOf('projects', t.projectId))
            : null,
          h('div.board-card-actions', null,
            Button('Bearbeiten', {
              variant: 'ghost', size: 'sm', iconName: 'edit', iconOnly: true,
              onClick: () => openEditDialog({ store, entityKey: 'tasks', id: t._id }),
            }),
            Button('Löschen', {
              variant: 'ghost-danger', size: 'sm', iconName: 'trash', iconOnly: true,
              onClick: () => confirmDelete({ store, entityKey: 'tasks', id: t._id }),
            }))))))
        : h('p.board-empty', null, 'Nichts hier')));
  }
  return board;
}

/* ------------------------------------------------------------- Detail -- */

export function renderTaskDetail(ctx, id) {
  const { store } = ctx;
  const task = store.byId('tasks', id);
  if (!task) return createDetailView({ ctx, entityKey: 'tasks', id });

  const done = task.status === 'erledigt';
  const toggle = Button(done ? 'Wieder öffnen' : 'Als erledigt markieren', {
    variant: done ? 'secondary' : 'primary',
    iconName: done ? 'refresh' : 'check',
    onClick: () => store.patch('tasks', id, { status: done ? 'offen' : 'erledigt' }),
  });

  const left = daysUntil(task.deadline);
  const stats = h('div.stat-row', null,
    StatCard({ label: 'Status', value: optionLabel(TASK_STATUS, task.status), format: 'raw', tone: done ? 'success' : 'progress' }),
    StatCard({
      label: 'Deadline',
      value: task.deadline ? formatDate(task.deadline) : '—',
      format: 'raw',
      tone: !done && left !== null && left < 0 ? 'danger' : 'neutral',
      hint: !done && left !== null ? (left < 0 ? `${Math.abs(left)} Tage überfällig` : `noch ${left} Tage`) : null,
    }),
    StatCard({ label: 'Projekt', value: store.titleOf('projects', task.projectId) || '—', format: 'raw' }));

  return createDetailView({
    ctx,
    entityKey: 'tasks',
    id,
    subtitle: store.titleOf('projects', task.projectId),
    stats,
    headerExtras: [toggle],
  });
}
