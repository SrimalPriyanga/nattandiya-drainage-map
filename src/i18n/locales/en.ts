/**
 * English dictionary. Its shape defines the `Dictionary` type, so si.ts and ta.ts fail to
 * compile until every key added here is translated. Use functions for interpolated text.
 */
export const en = {
  meta: {
    title: 'Nattandiya Drainage Map',
  },
  header: {
    title: 'Nattandiya Drainage Map',
    subtitle: 'Report blocked drains, canal issues and illegal constructions that cause flooding.',
  },
  banner: {
    instruction: 'Tap the spot on the map where the problem is to report it.',
    anonymous: 'Reports are anonymous.',
    dismiss: 'Hide instructions',
  },
  config: {
    notConfigured: 'Reporting is unavailable right now: the database has not been connected yet.',
  },
  map: {
    label:
      'Map of Nattandiya. Tap or click where the problem is to report it. When the map has keyboard focus, use the arrow keys to move it and press Enter to report at the centre.',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    outsideArea: 'Please choose a location inside the Nattandiya area.',
  },
  categories: {
    blocked_drain: 'Blocked Drain',
    illegal_construction: 'Illegal Construction',
    canal_issue: 'Canal Issue',
    other: 'Other',
  },
  statuses: {
    pending: 'Pending',
    in_progress: 'In progress',
    resolved: 'Resolved',
  },
  legend: {
    title: 'Issue types',
    total: 'Total reports',
  },
  reports: {
    loading: 'Loading reports…',
    loadError: 'Could not load reports.',
    retry: 'Try again',
  },
  form: {
    title: 'Report a drainage problem',
    close: 'Close',
    location: 'Selected location',
    latitude: 'Latitude',
    longitude: 'Longitude',
    category: 'Problem type',
    categoryPlaceholder: 'Choose a problem type',
    categoryRequired: 'Please choose a problem type.',
    description: 'Description',
    descriptionPlaceholder:
      'What is the problem? e.g. The drain next to the bus stand is blocked with garbage.',
    descriptionTooShort: (min: number) =>
      `Please describe the problem in at least ${min} characters.`,
    descriptionTooLong: (max: number) => `Please keep the description within ${max} characters.`,
    privacyHint: 'Reports are shown publicly. Please don’t include names or phone numbers.',
    spamCheck: 'Spam protection',
    turnstilePlaceholder: 'Cloudflare Turnstile verification will appear here.',
    notConfigured: 'Submitting is disabled until the database is connected.',
    submitError:
      'Your report could not be sent. Please check your internet connection and try again.',
    cancel: 'Cancel',
    submit: 'Submit report',
    submitting: 'Submitting…',
  },
  toast: {
    submitted: 'Thank you! Your report has been added to the map.',
    dismiss: 'Dismiss notification',
  },
  popup: {
    status: 'Status',
    reportedOn: 'Reported on',
    coordinates: 'Coordinates',
    noDescription: 'No description provided.',
    close: 'Close details',
  },
}

export type Dictionary = typeof en
