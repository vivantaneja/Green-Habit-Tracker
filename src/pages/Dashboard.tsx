import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Flame, Bottle, Leaf, Wind, CheckCircle2, CircleDollar } from '../components/Icons'
import { useHabitLogs } from '../hooks/useHabitLogs'
import { useReTurnLogs } from '../hooks/useReTurnLogs'
import { useImpactTotals } from '../hooks/useImpactTotals'
import { getStreak } from '../lib/impact'
import { HABITS } from '../lib/habits'
import { useQuickLogHabits } from '../hooks/useQuickLogHabits'
import { useDistanceUnit } from '../hooks/useDistanceUnit'
import { ImpactMetric } from '../components/ImpactMetric'
import { ImpactBar } from '../components/ImpactBar'
import { BottleIllustration } from '../components/BottleIllustration'
import { TreeIllustration } from '../components/TreeIllustration'
import { HabitCard } from '../components/HabitCard'
import { HeroPattern } from '../components/HeroPattern'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export default function Dashboard() {
  const { logs, addLog, removeLog } = useHabitLogs()
  const { totals: reTurnTotals, getEntryForDate, upsertEntry } = useReTurnLogs()
  const totals = useImpactTotals(logs)
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
  const { quickLogIds } = useQuickLogHabits()
  const [distanceUnit] = useDistanceUnit()
  const todayLogs = logs.filter((l) => l.date === today)
  const quickLogHabits = HABITS.filter((h) => quickLogIds.includes(h.id))
  const streak = getStreak(logs)

  const getCount = (habitId: string) =>
    todayLogs.find((l) => l.habitId === habitId)?.count ?? 0

  const handleLog = (habitId: string, amountToAdd: number) => {
    const current = getCount(habitId)
    addLog({ date: today, habitId, count: current + amountToAdd })
  }

  const hasAnyLogs = logs.length > 0
  const bottles = Math.max(0, Number(totals.totalBottlesSaved ?? 0))
  const co2Kg = Math.max(0, Number(totals.totalCo2Kg ?? 0))
  const trees = Math.max(0, Number(totals.treeEquivalent ?? 0))
  const maxImpact = Math.max(
    bottles,
    Math.ceil(co2Kg) || 1,
    trees * 10 || 1
  )

  return (
    <div className="space-y-10">
      {/* Hero: dark teal, light green headline, geometric pattern */}
      <section className="relative rounded-2xl bg-primary-hero overflow-hidden transition-all duration-500 hover:shadow-lg">
        <HeroPattern />
        <div className="relative px-6 py-10 sm:px-8 sm:py-12">
          <h1 className="font-display text-3xl font-bold tracking-tight text-primary-on-hero sm:text-4xl animate-card-in">
            {hasAnyLogs ? 'Your impact grows.' : 'Track green habits.'}
          </h1>
          <p className="mt-3 max-w-xl text-base text-white/90">
            {hasAnyLogs
              ? `You've saved ${bottles} bottles and avoided ~${co2Kg.toFixed(0)} kg CO₂. Keep it up.`
              : 'Log daily habits like skipping plastic bottles and biking. See your environmental impact add up.'}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/habits"
              className="inline-flex items-center justify-center rounded-lg bg-primary-300 px-5 py-2.5 text-sm font-semibold text-primary-900 hover:bg-primary-200 transition-colors"
            >
              {hasAnyLogs ? 'Log more' : 'Get started'}
            </Link>
            <Link
              to="/impact"
              className="inline-flex items-center justify-center rounded-lg border-2 border-primary-300 bg-transparent px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              View impact
            </Link>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-1 text-sm text-primary-200">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-primary-400" size={16} /> No account needed
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-primary-400" size={16} /> Data stays on your device
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-primary-400" size={16} /> Free forever
            </li>
          </ul>
        </div>
      </section>

      {!hasAnyLogs && (
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
          <p className="text-sm text-slate-600">
            Log your first habit below to see your impact grow.
          </p>
        </div>
      )}

      <section>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-sm font-medium text-slate-900">Today’s habits</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Add an amount (or leave blank for 1) and tap Log. Total for today is shown.
            </p>
          </div>
          <Link
            to="/habits#quick-log"
            className="shrink-0 text-sm font-medium text-primary-700 hover:text-primary-800"
          >
            Customise
          </Link>
        </div>
        {quickLogHabits.length > 0 ? (
          <div className="space-y-4">
            {quickLogHabits.map((habit) => {
              const count = Math.max(0, Number(getCount(habit.id) ?? 0))
              return (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  count={count}
                  onLog={(amount) => handleLog(habit.id, amount)}
                  distanceUnit={distanceUnit}
                />
              )
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
            <p className="text-sm text-slate-600">
              Pick which habits to show here on the Habits page.
            </p>
            <Link
              to="/habits#quick-log"
              className="mt-3 inline-block text-sm font-semibold text-primary-700 hover:text-primary-800"
            >
              Choose quick-log habits →
            </Link>
          </div>
        )}
      </section>

      {/* Re-turn: under habits, subtle but clear */}
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-card border-l-4 border-l-primary-500">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-medium text-slate-900">Re-turn (Ireland DRS)</h3>
            <p className="mt-1 text-sm text-slate-500">
              Small 15c, large 25c. Returned at a shop or RVM with the Re-turn logo. <Link to="/return" className="text-primary-600 hover:underline">Full page</Link>
            </p>
          </div>
          <div className="flex items-center gap-5">
            <label className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600">Small</span>
              <input
                type="number"
                min={0}
                step={1}
                className="w-20 rounded-lg border-2 border-slate-300 px-3 py-2 text-base tabular-nums"
                value={reTurnSmallStr}
                onChange={(e) => setReTurnSmallStr(e.target.value)}
                onBlur={() => {
                  const v = Math.max(0, parseInt(reTurnSmallStr, 10) || 0)
                  const largeVal = Math.max(0, parseInt(reTurnLargeStr, 10) || 0)
                  setReTurnSmallStr(String(v))
                  upsertEntry(today, v, largeVal)
                }}
              />
            </label>
            <label className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600">Large</span>
              <input
                type="number"
                min={0}
                step={1}
                className="w-20 rounded-lg border-2 border-slate-300 px-3 py-2 text-base tabular-nums"
                value={reTurnLargeStr}
                onChange={(e) => setReTurnLargeStr(e.target.value)}
                onBlur={() => {
                  const v = Math.max(0, parseInt(reTurnLargeStr, 10) || 0)
                  const smallVal = Math.max(0, parseInt(reTurnSmallStr, 10) || 0)
                  setReTurnLargeStr(String(v))
                  upsertEntry(today, smallVal, v)
                }}
              />
            </label>
          </div>
        </div>
        {(reTurnTotals.containersReturned > 0 || reTurnSmall + reTurnLarge > 0) && (
          <p className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-600">
            €{(Number(reTurnTotals.moneyEuros) || 0).toFixed(2)} earned · {Math.max(0, Number(reTurnTotals.containersReturned) || 0)} containers · ~{(Number(reTurnTotals.weightKgEquivalent) || 0).toFixed(2)} kg diverted
          </p>
        )}
      </section>

      {streak > 0 && (
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-card animate-card-in">
          <div className="flex items-center gap-3">
            <Flame className="h-10 w-10 text-orange-500 animate-streak-flame shrink-0" size={40} />
            <div>
              <p className="text-2xl font-semibold text-slate-900 tabular-nums">{streak}</p>
              <p className="text-sm text-slate-500">day streak</p>
            </div>
          </div>
        </section>
      )}

      <section>
        <h2 className="text-sm font-medium text-slate-900">Your impact</h2>
        <p className="mt-0.5 text-sm text-slate-500 mb-4">
          Cumulative impact from your logged habits.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ImpactMetric
            value={bottles}
            label="Bottles not used"
            icon={<Bottle className="h-5 w-5" size={20} />}
          />
          <ImpactMetric
            value={`~${co2Kg.toFixed(1)} kg`}
            label="CO₂ avoided"
            icon={<Wind className="h-5 w-5" size={20} />}
          />
          <ImpactMetric
            value={`~${trees.toFixed(1)}`}
            label="Trees equivalent"
            icon={<Leaf className="h-5 w-5" size={20} />}
          />
        </div>
      </section>

      {/* Horizontal bar style (Customer.io campaign-style) */}
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-card transition-all duration-300 hover:shadow-card-hover">
        <h3 className="text-sm font-medium text-slate-900 mb-4">Impact overview</h3>
        <div className="space-y-5">
          <ImpactBar
            label="Bottles saved"
            value={bottles}
            max={Math.max(maxImpact, 1)}
          />
          <ImpactBar
            label="CO₂ avoided (kg)"
            value={co2Kg}
            max={Math.max(maxImpact, 1)}
            format={(n) => n.toFixed(1)}
          />
          <ImpactBar
            label="Trees equivalent"
            value={trees}
            max={Math.max(maxImpact / 10, 0.1)}
            format={(n) => n.toFixed(1)}
          />
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover">
          <h3 className="flex items-center gap-2 text-sm font-medium text-slate-900">
            <Bottle className="h-4 w-4 text-primary-600" size={16} /> Bottles saved
          </h3>
          <BottleIllustration count={bottles} className="mt-4" />
          <p className="mt-4 text-center text-sm text-slate-500">
            {bottles} plastic bottles kept out of landfills
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover">
          <h3 className="flex items-center gap-2 text-sm font-medium text-slate-900">
            <Leaf className="h-4 w-4 text-primary-600" size={16} /> Tree growth
          </h3>
          <div className="mt-4">
            <TreeIllustration progress={Math.min(1, trees)} />
          </div>
          <p className="mt-4 text-center text-sm text-slate-500">
            ~{trees.toFixed(1)} trees worth of CO₂ avoided
          </p>
        </div>
      </section>
    </div>
  )
}
