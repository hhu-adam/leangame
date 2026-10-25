import type { DeepPartialTranslation } from '../utils/DeepPartialTranslation'
import { en } from './en'

export const de: DeepPartialTranslation<typeof en> = {
  helloWorld: 'Hallo Welt',
  errorPage: {
    title: 'Oops!',
    description: 'Etwas Unerwartetes ist passiert:',
    createIssue: 'Bitte erstelle ein Issue im <issueLink/>.',
  },
  notFound: {
    title: 'Diese Seite wurde nicht gefunden',
    description:
      '<code>(404)</code> Die Seite <code>{{pathname}}</code> scheint nicht zu existieren.',
    createIssue:
      'Falls Du denkst, dass es sie geben sollte, erstelle bitte ein Issue im <issueLink/>.',
  },
  legal: {
    englishBelow: '(Englische Version unten)',
    contact: 'Kontakt:',
    contactDetails: 'Kontaktinformationen',
    technicalContact: 'Technischer Kontakt',
    loadError: 'Die Kontaktinformationen konnten nicht geladen werden.',
  },
  impressum: {
    title: 'Impressum',
    legalForm: 'Rechtsform:',
    vatId: 'Umsatzsteuer-Identifikationsnummer:',
    vatIdBasis: 'gemäß §27a Umsatzsteuergesetz',
  },
  privacy: {
    title: 'Datenschutzerklärung',
    collectedData:
      'Unser Server verarbeitet Metadaten (zum Beispiel IP-Adresse, Browser, Betriebssystem) sowie die Eingaben in den Editor. Diese Daten werden verwendet, um die Lean-Ausgabe zu berechnen und anzuzeigen. Die Informationen werden nur gespeichert, solange man auf unserer Webseite bleibt, und anschließend sofort gelöscht. Wir führen Log-Dateien, um die Software zu verbessern, aber die enthaltenen Daten sind anonymisiert.',
    browserStorage:
      'Wir verwenden keine Cookies, aber der Spielstand wird im Browser als „Website-Daten“ gespeichert. Der Spielstand wird nicht auf dem Server gespeichert; wird er im Browser gelöscht, kann er nicht wiederhergestellt werden.',
    serverLocation: 'Unser Server steht in {{location}}.',
  },
  appBar: {
    backToLanding: 'Zurück zur Spielauswahl',
    home: 'Home',
    previous: 'Zurück',
    previousLevel: 'Vorheriges Level',
    next: 'Weiter',
    nextLevel: 'Nächstes Level',
    editorMode: 'Editor',
    typewriterMode: 'Schreibmaschine',
    showInventory: 'Inventar öffnen',
    gameInfo: 'Spielinfo',
    gameInfoTitle: 'Spielinfo & Credits',
    download: 'Herunterladen',
    downloadTitle: 'Spielstand herunterladen',
    upload: 'Laden',
    uploadTitle: 'Spielstand aus JSON laden',
    erase: 'Löschen',
    eraseTitle: 'Spielstand löschen',
    impressum: 'Impressum',
    privacy: 'Datenschutzerklärung',
    preferences: 'Einstellungen',
    openMenu: 'Menü öffnen',
    closeMenu: 'Menü schließen',
    openLanguageMenu: 'Sprachmenü öffnen',
    closeLanguageMenu: 'Sprachmenü schließen',
  },
} as const
