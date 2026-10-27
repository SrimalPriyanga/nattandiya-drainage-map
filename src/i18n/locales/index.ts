import type { Language } from '../languages'
import { en, type Dictionary } from './en'
import { si } from './si'
import { ta } from './ta'

export type { Dictionary }

export const dictionaries: Record<Language, Dictionary> = { si, en, ta }
