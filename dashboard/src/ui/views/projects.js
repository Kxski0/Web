/**
 * Projekte – für Kundenprojekte, eigene, interne und künftige Ideen.
 *
 * Aufgaben hängen an Projekten; die Detailseite zeigt sie mit Fortschritt.
 */
import { h } from '../dom.js';
import { Button, Card, StatCard, EmptyState } from '../components/basics.js';
import { Table, rowActionButtons } from '../components/Table.js';
import { openCreateDialog, openEditDialog, confirmDelete } from '../components/recordDialog.js';
import { createListView, selectFilter, refFilter, moneyCell, dateCell, statusCell, refCell } from './listView.js';
import { createDetailView } from './detailView.js';
import { PROJECT_STATUS, TASK_OPEN } from '../../data/schema.js';
import { formatMoney, formatPercent } from '../../core/format.js';
import { sum, sortBy } from '../../core/util.js';

export function renderProjects(ctx) {
  const { store, navigate } = ctx;
  const all = store.all('projects');
  const active = all.filter((p) => ['geplant', 'in_arbeit', 'review'].includes(p.status));

  const summary = h('div.stat-row.stat-row-compact', null,
    StatCard({ label: 'Projekte gesamt', value: all.length }),
    StatCard({ label: 'In Arbeit', value: all.filter((p) => p.status === 'in_arbeit').length, tone: 'progress' }),
    StatCard({ label: 'Ideen', value: all.filter((p) => p.status === 'idee').length }),
    StatCard({ label: 'Budget aktiv', value: sum(active, (p) => Number(p.budget) || 0), format: 'money' }));

  return createListView({
    ctx,
    entityKey: 'projects',
    subtitle: `${all.length} Projekte · ${active.length} in Planung oder Arbeit`,
    above: summary,
    columns: [
      { key: 'title', label: 'Projektname', primary: true, sortable: true, render: (p) => h('span.cell-strong', null, p.title) },
      { key: 'kind', label: 'Art', sortable: true, hideOn: 'narrow', render: (p) => statusCell('projects', 'kind', p.kind) },
      {
        key: 'customerId',
        label: 'Kunde',
        sortable: true,
        value: (p) => store.titleOf('customers', p.customerId),
        render: (p) => refCell(store, 'customers', p.customerId, (id) => navigate('kunden', id)),
      },
      { key: 'status', label: 'Status', sortable: true, render: (p) => statusCell('projects', 'status', p.status) },
      { key: 'priority', label: 'Priorität', sortable: true, render: (p) => statusCell('projects', 'priority', p.priority) },
      { key: 'deadline', label: 'Deadline', sortable: true, render: (p) => dateCell(p.deadline, { warnPast: !['fertig', 'archiviert'].includes(p.status) }) },
      { key: 'budget', label: 'Budget', align: 'right', sortable: true, value: (p) => Number(p.budget) || 0, render: (p) => moneyCell(p.budget) },
    ],
    filters: [
      selectFilter('projects', 'status'),
      selectFilter('projects', 'priority', 'Priorität'),
      selectFilter('projects', 'kind', 'Art'),
      refFilter(store, 'projects', 'customerId'),
    ],
    sorts: [
      { value: 'deadline', label: 'Deadline' },
      { value: 'title', label: 'Projektname' },
      { value: 'priority', label: 'Priorität' },
      { value: 'status', label: 'Status' },
      { value: 'budget', label: 'Budget' },
    ],
    onRowClick: (p) => navigate('projekte', p._id),
  });
}

/* ------------------------------------------------------------- Detail -- */

export function renderProjectDetail(ctx, id) {
  const { store, navigate } = ctx;
  const project = store.byId('projects', id);
  if (!project) return createDetailView({ ctx, entityKey: 'projects', id });

  const tasks = store.all('tasks').filter((t) => t.projectId === id);
  const done = tasks.filter((t) => t.status === 'erledigt').length;
  const progress = tasks.length ? (done / tasks.length) * 100 : 0;

  const stats = h('div.stat-row', null,
    StatCard({ label: 'Aufgaben', value: tasks.length, hint: `${done} erledigt` }),
    StatCard({ label: 'Fortschritt', value: formatPercent(progress), format: 'raw', tone: progress === 100 ? 'success' : 'progress' }),
    StatCard({ label: 'Budget', value: project.budget, format: 'money' }),
    StatCard({
      label: 'Offene Aufgaben',
      value: tasks.filter((t) => TASK_OPEN.includes(t.status)).length,
      tone: 'warn',
    }));

  const tasksCard = Card({
    title: 'Aufgaben',
    subtitle: tasks.length ? `${done} von ${tasks.length} erledigt` : null,
    actions: Button('Aufgabe anlegen', {
      variant: 'secondary', size: 'sm', iconName: 'plus',
      onClick: () => openCreateDialog({ store, entityKey: 'tasks', preset: { projectId: id } }),
    }),
    padded: tasks.length === 0,
    children: tasks.length
      ? Table({
        rows: sortBy(tasks, (t) => t.deadline || '9999-12-31', 1),
        onRowClick: (t) => navigate('aufgaben', t._id),
        columns: [
          { key: 'title', label: 'Titel', primary: true, render: (t) => h('span.cell-strong', null, t.title) },
          { key: 'status', label: 'Status', render: (t) => statusCell('tasks', 'status', t.status) },
          { key: 'priority', label: 'Priorität', render: (t) => statusCell('tasks', 'priority', t.priority) },
          { key: 'deadline', label: 'Deadline', render: (t) => dateCell(t.deadline, { warnPast: t.status !== 'erledigt' }) },
        ],
        rowActions: (t) => rowActionButtons({
          onEdit: () => openEditDialog({ store, entityKey: 'tasks', id: t._id }),
          onDelete: () => confirmDelete({ store, entityKey: 'tasks', id: t._id }),
        }),
      })
      : EmptyState({ iconName: 'checklist', title: 'Noch keine Aufgaben', text: 'Aufgaben zu diesem Projekt erscheinen hier.' }),
  });

  const nextStatus = { idee: 'geplant', geplant: 'in_arbeit', in_arbeit: 'review', review: 'fertig' }[project.status];
  const advance = nextStatus
    ? Button(`Auf „${PROJECT_STATUS.find((s) => s.value === nextStatus).label}" setzen`, {
      variant: 'primary',
      iconName: 'check',
      onClick: () => store.patch('projects', id, { status: nextStatus }),
    })
    : null;

  const customerCard = project.customerId && store.byId('customers', project.customerId)
    ? Card({
      title: 'Kunde',
      children: h('div.mini-item', null,
        h('button.cell-link', { type: 'button', onClick: () => navigate('kunden', project.customerId) },
          store.titleOf('customers', project.customerId))),
    })
    : null;

  return createDetailView({
    ctx,
    entityKey: 'projects',
    id,
    subtitle: [store.titleOf('customers', project.customerId), project.budget ? formatMoney(project.budget) : ''].filter(Boolean).join(' · '),
    stats,
    headerExtras: [advance].filter(Boolean),
    sections: [tasksCard],
    aside: [customerCard].filter(Boolean),
  });
}
