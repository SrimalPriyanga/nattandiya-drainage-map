import type { Dictionary } from './en'

/** සිංහල — the default UI language. */
export const si: Dictionary = {
  meta: {
    title: 'නාත්තන්ඩිය ජලාපවහන සිතියම',
  },
  header: {
    title: 'නාත්තන්ඩිය ජලාපවහන සිතියම',
    subtitle:
      'ගංවතුරට හේතු වන අවහිර වූ කාණු, ඇළ මාර්ග ගැටලු සහ අනවසර ඉදිකිරීම් වාර්තා කරන්න.',
  },
  banner: {
    instruction: 'ගැටලුව ඇති ස්ථානය සිතියම මත ඔබා එය වාර්තා කරන්න.',
    anonymous: 'වාර්තා නිර්නාමික වේ.',
    dismiss: 'උපදෙස් සඟවන්න',
  },
  config: {
    notConfigured: 'වාර්තා කිරීම දැනට ලබා ගත නොහැක: දත්ත සමුදාය තවම සම්බන්ධ කර නැත.',
  },
  map: {
    label:
      'නාත්තන්ඩිය සිතියම. ගැටලුව ඇති ස්ථානය ඔබා හෝ ක්ලික් කර එය වාර්තා කරන්න. යතුරුපුවරුවෙන් සිතියම තෝරා ඇති විට, ඊතල යතුරු මගින් සිතියම චලනය කර, මැද ස්ථානය වාර්තා කිරීමට Enter ඔබන්න.',
    zoomIn: 'විශාලනය කරන්න',
    zoomOut: 'කුඩා කරන්න',
    outsideArea: 'කරුණාකර නාත්තන්ඩිය ප්‍රදේශය තුළ ස්ථානයක් තෝරන්න.',
  },
  categories: {
    blocked_drain: 'අවහිර වූ කාණුව',
    illegal_construction: 'අනවසර ඉදිකිරීම',
    canal_issue: 'ඇළ මාර්ග ගැටලුව',
    other: 'වෙනත්',
  },
  statuses: {
    pending: 'පොරොත්තුවෙන්',
    in_progress: 'කටයුතු සිදු වෙමින්',
    resolved: 'විසඳා ඇත',
  },
  legend: {
    title: 'ගැටලු වර්ග',
    total: 'මුළු වාර්තා',
  },
  reports: {
    loading: 'වාර්තා පූරණය වෙමින්…',
    loadError: 'වාර්තා පූරණය කළ නොහැකි විය.',
    retry: 'නැවත උත්සාහ කරන්න',
  },
  form: {
    title: 'ජලාපවහන ගැටලුවක් වාර්තා කරන්න',
    close: 'වසන්න',
    location: 'තෝරාගත් ස්ථානය',
    latitude: 'අක්ෂාංශය',
    longitude: 'දේශාංශය',
    category: 'ගැටලුවේ වර්ගය',
    categoryPlaceholder: 'ගැටලුවේ වර්ගය තෝරන්න',
    categoryRequired: 'කරුණාකර ගැටලුවේ වර්ගය තෝරන්න.',
    description: 'විස්තරය',
    descriptionPlaceholder:
      'ගැටලුව කුමක්ද? උදා: බස් නැවතුම්පොළ අසල කාණුව කසළ නිසා අවහිර වී ඇත.',
    descriptionTooShort: (min: number) =>
      `කරුණාකර ගැටලුව අවම වශයෙන් අක්ෂර ${min}කින් විස්තර කරන්න.`,
    descriptionTooLong: (max: number) => `කරුණාකර විස්තරය අක්ෂර ${max}කට සීමා කරන්න.`,
    privacyHint:
      'වාර්තා ප්‍රසිද්ධියේ පෙන්වනු ලැබේ. කරුණාකර නම් හෝ දුරකථන අංක ඇතුළත් නොකරන්න.',
    spamCheck: 'අයාචිත පණිවිඩ ආරක්ෂණය',
    turnstilePlaceholder: 'Cloudflare Turnstile තහවුරු කිරීම මෙහි දිස් වනු ඇත.',
    notConfigured: 'දත්ත සමුදාය සම්බන්ධ කරන තුරු වාර්තා යොමු කිරීම අක්‍රිය කර ඇත.',
    submitError:
      'ඔබගේ වාර්තාව යැවීමට නොහැකි විය. කරුණාකර අන්තර්ජාල සම්බන්ධතාවය පරීක්ෂා කර නැවත උත්සාහ කරන්න.',
    cancel: 'අවලංගු කරන්න',
    submit: 'වාර්තාව යොමු කරන්න',
    submitting: 'යොමු කරමින්…',
  },
  toast: {
    submitted: 'ස්තූතියි! ඔබගේ වාර්තාව සිතියමට එක් කරන ලදී.',
    dismiss: 'දැනුම්දීම ඉවත් කරන්න',
  },
  popup: {
    status: 'තත්ත්වය',
    reportedOn: 'වාර්තා කළ දිනය',
    coordinates: 'ඛණ්ඩාංක',
    noDescription: 'විස්තරයක් ලබා දී නැත.',
    close: 'විස්තර වසන්න',
  },
}
