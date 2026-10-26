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
    github: 'Den Lean-Game-Server auf GitHub ansehen',
    openMenu: 'Menü öffnen',
    closeMenu: 'Menü schließen',
    openLanguageMenu: 'Sprachmenü öffnen',
    closeLanguageMenu: 'Sprachmenü schließen',
  },
  preferences: {
    title: 'Einstellungen',
    language: 'Sprache',
    languageNote:
      'Wenn ein Spiel nicht in der ausgewählten Sprache existiert, dann hat diese Einstellung keine Wirkung und die Standardsprache des Spiels wird verwendet.',
    useFlags: 'Sprachen durch Flaggen darstellen',
    layout: 'Seitenlayout',
    layouts: { mobile: 'Mobil', auto: 'Auto', desktop: 'Desktop' },
    showLockedInventory: 'Gesperrte Inventar-Einträge anzeigen',
    browserStorage: 'Browserspeicher',
    savePreferences: 'Einstellungen im Browser speichern',
  },
  layout: {
    openPanel: '{{title}} öffnen',
    closePanel: '{{title}} schließen',
  },
  game: {
    introduction: 'Einführung',
    inventory: 'Inventar',
  },
  landing: {
    title: 'Lean-Lern-Spiel-Server',
    subtitle:
      'Eine Sammlung von Lernspielen für den Beweisassistenten <leanLink>Lean</leanLink> <i>(Lean 4)</i> und dessen mathematische Bibliothek <mathlibLink>mathlib</mathlibLink>',
    games: {
      loading: 'Spiele werden geladen…',
      error: 'Die Spiele konnten nicht geladen werden.',
      none: 'Keine Spiele verfügbar.',
      noneDev:
        'Lokale Spiele sind die Ordner neben diesem Repository, die ein gebautes Spiel enthalten, d.h. eine `.lake/gamedata/game.json`.',
    },
    tile: {
      prerequisites: 'Voraussetzungen',
      prerequisitesTitle: 'Diese Spiele am besten vorher spielen.',
      worlds: 'Welten',
      levels: 'Level',
      languages: 'Sprachen',
    },
    capacity: {
      title: 'Server-Auslastung',
      description:
        'Dieser Server läuft auf universitärer Infrastruktur mit begrenzten Kapazitäten. Wir schätzen, dass unsere Konfiguration etwa 50 gleichzeitige Spiele mit hoher Leistung und bis zu 180 gleichzeitige Spiele mit geringerer Leistung unterstützt.',
      players: 'Aktive Spieler:innen: <strong>{{count}}</strong>',
      memory: 'RAM: <strong>{{value}} %</strong> belegt.',
      cpu: 'CPU: <strong>{{value}} %</strong> ausgelastet.',
    },
    development: {
      title: 'Entwicklungsstand',
      description:
        'Der Spieleserver und alle Spiele befinden sich in fortlaufender Entwicklung. Wir bitten darum, Fehler und Ungereimtheiten als <issueLink>GitHub Issue</issueLink> zu melden.',
    },
    newGames: {
      title: 'Neue Spiele hinzufügen',
      template:
        'Für alle, die selbst ein Spiel entwickeln möchten, gibt es das <skeletonLink>GameSkeleton GitHub Repo</skeletonLink> als Vorlage und die Anleitung <docsLink>How to Create a Game</docsLink>, die auch erklärt, wie ein Spiel auf den Server geladen und gespielt werden kann. Fragen dazu beantworten wir gern.',
      featured:
        'Auf dieser Seite ist nur eine kuratierte Auswahl an Spielen sichtbar. Wir erweitern diese Auswahl auf Anfrage sehr gerne.',
    },
    funding: {
      title: 'Finanzierung',
      description:
        'Dieser Spiele-Server wird von der Heinrich-Heine-Universität Düsseldorf bereitgestellt. Die lean4game-Software wurde im Rahmen des Projekts <adamLink>ADAM: Anticipating the Digital Age of Mathematics</adamLink> entwickelt, finanziert durch das Programm <i>Freiraum 2022</i> der <i>Stiftung Innovation in der Hochschullehre</i>. Der laufende Betrieb des Servers und die Weiterentwicklung der Software werden durch Mittel des <i>AI for Math Fund</i> der Stiftung <i>Renaissance Philanthropy</i> ermöglicht.',
    },
  },
} as const
