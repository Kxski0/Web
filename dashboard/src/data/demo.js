/**
 * Demodaten.
 *
 * Werden NICHT automatisch geladen. Die App startet leer; Demodaten lassen sich
 * in den Einstellungen bewusst laden, um Ansichten und Berechnungen mit Inhalt
 * zu sehen, und dort mit einem Klick wieder entfernen.
 */
import { uid } from '../core/util.js';
import { toDayString } from '../core/format.js';

function dayOffset(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return toDayString(d);
}

function stamp(record, createdOffset = -30) {
  const created = new Date();
  created.setDate(created.getDate() + createdOffset);
  return {
    _id: uid(),
    _createdAt: created.toISOString(),
    _updatedAt: created.toISOString(),
    ...record,
  };
}

/** Erzeugt einen zusammenhängenden Beispielbestand mit korrekten Beziehungen. */
export function buildDemoData() {
  const customers = [
    stamp({
      company: 'Nordlicht Bau GmbH',
      contact: 'Max Müller',
      email: 'max.mueller@nordlicht-bau.example',
      phone: '+49 40 1234567',
      website: 'https://nordlicht-bau.example',
      street: 'Hafenstraße 12',
      zip: '20359',
      city: 'Hamburg',
      country: 'Deutschland',
      notes: 'Bevorzugt Termine am Vormittag. Rechnungen per E-Mail an die Buchhaltung.',
    }, -240),
    stamp({
      company: 'Praxis Dr. Lehmann',
      contact: 'Anja Lehmann',
      email: 'kontakt@praxis-lehmann.example',
      phone: '+49 30 998877',
      website: 'https://praxis-lehmann.example',
      street: 'Kantstraße 4',
      zip: '10623',
      city: 'Berlin',
      country: 'Deutschland',
      notes: '',
    }, -180),
    stamp({
      company: 'Alpenrose Hotel',
      contact: 'Stefan Gruber',
      email: 's.gruber@alpenrose.example',
      phone: '+43 512 445566',
      website: 'https://alpenrose.example',
      street: 'Talweg 3',
      zip: '6020',
      city: 'Innsbruck',
      country: 'Österreich',
      notes: 'Saisongeschäft, Anfragen meist im Herbst.',
    }, -120),
    stamp({
      company: 'Studio Klar',
      contact: 'Lena Vogt',
      email: 'hallo@studio-klar.example',
      phone: '+49 221 445566',
      website: 'https://studio-klar.example',
      street: 'Ehrenstraße 88',
      zip: '50672',
      city: 'Köln',
      country: 'Deutschland',
      notes: '',
    }, -60),
  ];

  const [nordlicht, praxis, alpenrose, studio] = customers;

  const orders = [
    stamp({
      title: 'Unternehmenswebsite Relaunch',
      customerId: nordlicht._id,
      value: 8400,
      orderDate: dayOffset(-210),
      deadline: dayOffset(-150),
      status: 'abgeschlossen',
      paymentStatus: 'bezahlt',
      description: 'Neuaufbau der Website mit Referenzbereich und Bewerbungsformular.',
      notes: '',
    }, -210),
    stamp({
      title: 'Terminbuchung und Praxisseite',
      customerId: praxis._id,
      value: 5200,
      orderDate: dayOffset(-160),
      deadline: dayOffset(-100),
      status: 'abgeschlossen',
      paymentStatus: 'bezahlt',
      description: 'Praxiswebsite inklusive Online-Terminanfrage.',
      notes: '',
    }, -160),
    stamp({
      title: 'Hotelseite mit Zimmerübersicht',
      customerId: alpenrose._id,
      value: 11800,
      orderDate: dayOffset(-70),
      deadline: dayOffset(20),
      status: 'in_bearbeitung',
      paymentStatus: 'teilbezahlt',
      description: 'Mehrsprachige Hotelseite, Anbindung an das Buchungssystem.',
      notes: 'Fotos vom Kunden stehen noch aus.',
    }, -70),
    stamp({
      title: 'Portfolio-Onepager',
      customerId: studio._id,
      value: 3200,
      orderDate: dayOffset(-25),
      deadline: dayOffset(12),
      status: 'wartet_kunde',
      paymentStatus: 'offen',
      description: 'Einseitiges Portfolio mit Projektgalerie.',
      notes: 'Warten auf Freigabe der Texte.',
    }, -25),
    stamp({
      title: 'Wartungspaket 2026',
      customerId: nordlicht._id,
      value: 1800,
      orderDate: dayOffset(-12),
      deadline: dayOffset(45),
      status: 'angebot',
      paymentStatus: 'offen',
      description: 'Laufende Pflege, Updates und Sicherung.',
      notes: '',
    }, -12),
    stamp({
      title: 'Landingpage Frühjahrsaktion',
      customerId: praxis._id,
      value: 1400,
      orderDate: dayOffset(-4),
      deadline: dayOffset(30),
      status: 'anfrage',
      paymentStatus: 'offen',
      description: 'Kurzfristige Aktionsseite mit Formular.',
      notes: '',
    }, -4),
  ];

  const [relaunch, praxisOrder, hotelOrder, portfolioOrder] = orders;

  const invoices = [
    stamp({
      number: '2026-001',
      customerId: nordlicht._id,
      orderId: relaunch._id,
      amount: 8400,
      issueDate: dayOffset(-150),
      dueDate: dayOffset(-136),
      paidDate: dayOffset(-140),
      status: 'bezahlt',
      notes: '',
    }, -150),
    stamp({
      number: '2026-002',
      customerId: praxis._id,
      orderId: praxisOrder._id,
      amount: 5200,
      issueDate: dayOffset(-100),
      dueDate: dayOffset(-86),
      paidDate: dayOffset(-92),
      status: 'bezahlt',
      notes: '',
    }, -100),
    stamp({
      number: '2026-003',
      customerId: alpenrose._id,
      orderId: hotelOrder._id,
      amount: 5900,
      issueDate: dayOffset(-60),
      dueDate: dayOffset(-46),
      paidDate: dayOffset(-50),
      status: 'bezahlt',
      notes: 'Erste Rate (50 %).',
    }, -60),
    stamp({
      number: '2026-004',
      customerId: alpenrose._id,
      orderId: hotelOrder._id,
      amount: 5900,
      issueDate: dayOffset(-8),
      dueDate: dayOffset(6),
      paidDate: '',
      status: 'offen',
      notes: 'Schlussrate nach Abnahme.',
    }, -8),
    stamp({
      number: '2026-005',
      customerId: studio._id,
      orderId: portfolioOrder._id,
      amount: 1600,
      issueDate: dayOffset(-40),
      dueDate: dayOffset(-26),
      paidDate: '',
      status: 'offen',
      notes: 'Anzahlung. Wird beim Laden automatisch auf "Überfällig" gesetzt.',
    }, -40),
    stamp({
      number: '2026-006',
      customerId: nordlicht._id,
      orderId: '',
      amount: 450,
      issueDate: dayOffset(-2),
      dueDate: dayOffset(12),
      paidDate: '',
      status: 'entwurf',
      notes: 'Kleinreparatur, noch nicht versendet.',
    }, -2),
  ];

  const websites = [
    stamp({
      title: 'nordlicht-bau.example',
      customerId: nordlicht._id,
      url: 'https://nordlicht-bau.example',
      status: 'live',
      launchDate: dayOffset(-148),
      tech: ['Wix', 'Velo', 'Wix CMS'],
      description: 'Unternehmenswebsite mit Referenzen und Stellenbereich.',
      thumbnail: '',
      notes: '',
    }, -148),
    stamp({
      title: 'praxis-lehmann.example',
      customerId: praxis._id,
      url: 'https://praxis-lehmann.example',
      status: 'live',
      launchDate: dayOffset(-98),
      tech: ['Wix', 'Wix Bookings'],
      description: 'Praxisseite mit Online-Terminanfrage.',
      thumbnail: '',
      notes: '',
    }, -98),
    stamp({
      title: 'alpenrose.example',
      customerId: alpenrose._id,
      url: 'https://alpenrose.example',
      status: 'entwicklung',
      launchDate: dayOffset(-60),
      tech: ['Wix Studio', 'Velo', 'Multilingual'],
      description: 'Mehrsprachige Hotelseite.',
      thumbnail: '',
      notes: 'Launch geplant zum Saisonstart.',
    }, -60),
    stamp({
      title: 'studio-klar.example',
      customerId: studio._id,
      url: 'https://studio-klar.example',
      status: 'ueberarbeitung',
      launchDate: dayOffset(-300),
      tech: ['Wix', 'GSAP'],
      description: 'Portfolio, wird gerade überarbeitet.',
      thumbnail: '',
      notes: '',
    }, -300),
  ];

  const references = [
    stamp({
      name: 'Stripe',
      url: 'https://stripe.com',
      category: 'saas',
      tags: ['gradient', 'produktseite', 'klar'],
      likeReason: 'Sehr ruhige Struktur, starke Typografie, Inhalt steht im Vordergrund.',
      takeaway: 'Aufbau der Produktabschnitte und die zurückhaltende Farbverwendung.',
      screenshot: '',
      analysis: '',
      notes: '',
    }, -50),
    stamp({
      name: 'Linear',
      url: 'https://linear.app',
      category: 'landingpage',
      tags: ['dark', 'produkt', 'detail'],
      likeReason: 'Dichte Informationen ohne Unruhe, sehr konsequentes Raster.',
      takeaway: 'Rasterlogik und die Abstände zwischen den Abschnitten.',
      screenshot: '',
      analysis: '',
      notes: '',
    }, -30),
    stamp({
      name: 'Apple',
      url: 'https://www.apple.com',
      category: 'hero',
      tags: ['produktfoto', 'scroll'],
      likeReason: 'Große Bildflächen, klarer Fokus pro Abschnitt.',
      takeaway: 'Ein Thema pro Bildschirmhöhe.',
      screenshot: '',
      analysis: '',
      notes: '',
    }, -14),
  ];

  const projects = [
    stamp({
      title: 'Eigenes Portfolio 2026',
      kind: 'eigenes',
      customerId: '',
      status: 'in_arbeit',
      priority: 'hoch',
      deadline: dayOffset(35),
      budget: 0,
      description: 'Neue eigene Website mit Referenzbereich.',
      links: ['https://www.figma.com'],
      files: [],
      notes: '',
    }, -40),
    stamp({
      title: 'Hotelseite Alpenrose',
      kind: 'kundenprojekt',
      customerId: alpenrose._id,
      status: 'review',
      priority: 'dringend',
      deadline: dayOffset(20),
      budget: 11800,
      description: 'Abnahme durch den Kunden steht an.',
      links: [],
      files: [],
      notes: '',
    }, -70),
    stamp({
      title: 'Angebotsvorlage überarbeiten',
      kind: 'intern',
      customerId: '',
      status: 'geplant',
      priority: 'normal',
      deadline: dayOffset(60),
      budget: 0,
      description: 'Einheitliche Vorlage für Angebote und Rechnungen.',
      links: [],
      files: [],
      notes: '',
    }, -20),
  ];

  const [portfolioProject, hotelProject, templateProject] = projects;

  const tasks = [
    stamp({
      title: 'Fotos vom Hotel anfordern',
      projectId: hotelProject._id,
      status: 'offen',
      priority: 'dringend',
      deadline: dayOffset(2),
      description: 'Zimmerbilder in hoher Auflösung fehlen noch.',
    }, -10),
    stamp({
      title: 'Rechnung 2026-005 nachfassen',
      projectId: '',
      status: 'offen',
      priority: 'hoch',
      deadline: dayOffset(-1),
      description: 'Zahlungserinnerung senden.',
    }, -6),
    stamp({
      title: 'Referenzbereich im Portfolio aufbauen',
      projectId: portfolioProject._id,
      status: 'in_arbeit',
      priority: 'normal',
      deadline: dayOffset(14),
      description: '',
    }, -8),
    stamp({
      title: 'Angebotsvorlage: Textbausteine sammeln',
      projectId: templateProject._id,
      status: 'offen',
      priority: 'niedrig',
      deadline: dayOffset(40),
      description: '',
    }, -5),
    stamp({
      title: 'Impressum aller Kundenseiten prüfen',
      projectId: '',
      status: 'erledigt',
      priority: 'normal',
      deadline: dayOffset(-12),
      description: '',
    }, -20),
  ];

  return { customers, orders, invoices, websites, references, projects, tasks };
}
