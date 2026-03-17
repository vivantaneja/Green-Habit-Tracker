import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bottle, Leaf, CircleDollar } from '../components/Icons'
import { HeroPattern } from '../components/HeroPattern'
import { useReTurnLogs } from '../hooks/useReTurnLogs'
import { ImpactMetric } from '../components/ImpactMetric'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export default function ReTurn() {
  const { totals, getEntryForDate, upsertEntry } = useReTurnLogs()
  const today = todayStr()
  const reTurnToday = getEntryForDate(today)
  const reTurnSmall = Math.max(0, Number(reTurnToday?.smallCount ?? 0))
  const reTurnLarge = Math.max(0, Number(reTurnToday?.largeCount ?? 0))
  const [reTurnSmallStr, setReTurnSmallStr] = useState(() => String(reTurnSmall))
  const [reTurnLargeStr, setReTurnLargeStr] = useState(() => String(reTurnLarge))
  useEffect(() => {
    setReTurnSmallStr(String(reTurnSmall))
    setReTurnLargeStr(String(reTurnLarge))
  }, [today, reTurnSmall, reTurnLarge])
  const moneyEuros = Math.max(0, Number(totals.moneyEuros ?? 0))
  const containersReturned = Math.max(0, Number(totals.containersReturned ?? 0))
  const weightKg = Math.max(0, Number(totals.weightKgEquivalent ?? 0))

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="relative rounded-2xl bg-primary-hero overflow-hidden">
        <HeroPattern />
        <div className="relative px-6 py-10 sm:px-8 sm:py-12">
          <h1 className="font-display text-3xl font-bold tracking-tight text-primary-on-hero sm:text-4xl">
            Re-turn
          </h1>
          <p className="mt-3 max-w-xl text-base text-white/90">
            Ireland’s deposit return scheme. Log bottles and cans you return and track your refund and impact.
          </p>
          <p className="mt-2 text-base text-primary-200">
            Small: 150ml–500ml (15c) · Large: 500ml–3L (25c)
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center rounded-lg border-2 border-primary-300 bg-transparent px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
          >
            ← Dashboard
          </Link>
        </div>
      </section>

      {/* Today's log */}
      <section className="rounded-xl border-2 border-primary-200 bg-white p-8 shadow-card">
        <h2 className="text-xl font-semibold text-slate-900">Log today’s returns</h2>
        <p className="mt-1 text-base text-slate-500 mb-2">
          How many containers did you return today?
        </p>
        <p className="text-sm text-slate-500 mb-6">
          Returned at a shop or RVM with the Re-turn logo.
        </p>
        <div className="flex flex-wrap items-center gap-8">
          <label className="flex flex-col gap-2">
            <span className="text-base font-medium text-slate-700">Small (150ml–500ml)</span>
            <input
              type="number"
              min={0}
              step={1}
              className="w-28 rounded-lg border-2 border-slate-300 px-5 py-4 text-xl tabular-nums focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
              value={reTurnSmallStr}
              onChange={(e) => setReTurnSmallStr(e.target.value)}
              onBlur={() => {
                const v = Math.max(0, parseInt(reTurnSmallStr, 10) || 0)
                const largeVal = Math.max(0, parseInt(reTurnLargeStr, 10) || 0)
                setReTurnSmallStr(String(v))
                upsertEntry(today, v, largeVal)
              }}
            />
            <span className="text-sm text-slate-500">15c each</span>
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-base font-medium text-slate-700">Large (500ml–3L)</span>
            <input
              type="number"
              min={0}
              step={1}
              className="w-28 rounded-lg border-2 border-slate-300 px-5 py-4 text-xl tabular-nums focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
              value={reTurnLargeStr}
              onChange={(e) => setReTurnLargeStr(e.target.value)}
              onBlur={() => {
                const v = Math.max(0, parseInt(reTurnLargeStr, 10) || 0)
                const smallVal = Math.max(0, parseInt(reTurnSmallStr, 10) || 0)
                setReTurnLargeStr(String(v))
                upsertEntry(today, smallVal, v)
              }}
            />
            <span className="text-sm text-slate-500">25c each</span>
          </label>
        </div>
      </section>

      {/* Stats – always visible */}
      <section>
        <h2 className="text-base font-medium text-slate-900 mb-5">Your Re-turn impact</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          <div className="rounded-xl border-2 border-primary-100 bg-primary-50/50 p-6 shadow-card">
            <ImpactMetric
              value={`€${moneyEuros.toFixed(2)}`}
              label="Refund earned"
              icon={<CircleDollar className="h-8 w-8 text-primary-600" size={32} />}
            />
          </div>
          <div className="rounded-xl border-2 border-primary-100 bg-primary-50/50 p-6 shadow-card">
            <ImpactMetric
              value={containersReturned}
              label="Containers returned"
              icon={<Bottle className="h-8 w-8 text-primary-600" size={32} />}
            />
          </div>
          <div className="rounded-xl border-2 border-primary-100 bg-primary-50/50 p-6 shadow-card">
            <ImpactMetric
              value={`~${weightKg.toFixed(2)} kg`}
              label="Plastic diverted"
              icon={<Leaf className="h-8 w-8 text-primary-600" size={32} />}
            />
          </div>
        </div>
      </section>
    </div>
  )
}
