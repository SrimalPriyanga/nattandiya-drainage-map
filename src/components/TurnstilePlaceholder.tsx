import { ShieldCheck } from 'lucide-react'
import { useI18n } from '../i18n/useI18n'

/**
 * Reserved slot for the Cloudflare Turnstile widget (300×65 px), so adding it later causes no
 * layout shift. Integration notes: DECISIONS.md, ADR-011 — the token MUST be verified
 * server-side (e.g. a Supabase Edge Function); a client-only check stops nothing.
 */
export function TurnstilePlaceholder() {
  const { t } = useI18n()
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim() || undefined

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-slate-800">{t.form.spamCheck}</p>
      <div
        id="turnstile-container"
        data-sitekey={siteKey}
        className="flex min-h-[65px] items-center gap-2.5 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-500"
      >
        <ShieldCheck className="size-5 shrink-0 text-slate-400" aria-hidden="true" />
        <span>{t.form.turnstilePlaceholder}</span>
      </div>
    </div>
  )
}
