export const en = {
  helloWorld: 'Hello World',
  errorPage: {
    title: 'Oops!',
    description: 'Something unexpected happened:',
    createIssue: 'Please create an issue at the <issueLink/>.',
  },
  notFound: {
    title: 'This page could not be found',
    description:
      '<code>(404)</code> page <code>{{pathname}}</code> seems not to exist.',
    createIssue:
      'If you believe it should, please create an issue at the <issueLink/>.',
  },
  legal: {
    englishBelow: '(English version below)',
    contact: 'Contact:',
    contactDetails: 'Contact Details',
    technicalContact: 'Technical Contact',
    loadError: 'The contact information could not be loaded.',
  },
  impressum: {
    title: 'Impressum',
    legalForm: 'Legal form:',
    vatId: 'VAT identification number:',
    vatIdBasis: 'according to §27a Sales Tax Act',
  },
  privacy: {
    title: 'Privacy Policy',
    collectedData:
      'Our server collects metadata (such as IP address, browser, operating system) and the data that the user enters into the editor. The data is used to compute the Lean output and display it to the user. The information will be stored as long as the user stays on our website and will be deleted immediately afterwards. We keep logs to improve our software, but the contained data is anonymized.',
    browserStorage:
      'We do not use cookies, but your game progress is stored in the browser as site data. Your game progress is not saved on the server; if you delete your browser storage, it is completely gone.',
    serverLocation: 'Our server is located in {{location}}.',
  },
  appBar: {
    backToLanding: 'Back to games selection',
    home: 'Home',
    previous: 'Previous',
    previousLevel: 'Previous level',
    next: 'Next',
    nextLevel: 'Next level',
    editorMode: 'Editor mode',
    typewriterMode: 'Typewriter mode',
    showInventory: 'Show inventory',
    gameInfo: 'Game Info',
    gameInfoTitle: 'Game Info & Credits',
    download: 'Download',
    downloadTitle: 'Download progress',
    upload: 'Upload',
    uploadTitle: 'Load progress from JSON',
    erase: 'Erase',
    eraseTitle: 'Clear progress',
    impressum: 'Impressum',
    privacy: 'Privacy Policy',
    preferences: 'Preferences',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    openLanguageMenu: 'Open language menu',
    closeLanguageMenu: 'Close language menu',
  },
  preferences: {
    title: 'Preferences',
    language: 'Language',
    languageNote:
      "If a game does not exist in the selected language, this setting has no effect and the game's default language is used.",
    useFlags: 'Use country flags to represent languages',
    layout: 'Layout',
    layouts: { mobile: 'Mobile', auto: 'Auto', desktop: 'Desktop' },
    showLockedInventory: 'Show locked inventory items',
    browserStorage: 'Browser Storage',
    savePreferences: 'Save my settings (in the browser storage)',
  },
} as const
