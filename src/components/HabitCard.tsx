import { useState } from 'react'
import type { ComponentType } from 'react'
import type { Habit } from '../types'
import type { DistanceUnit } from '../lib/distanceUnit'
import { kmToMiles, milesToKm } from '../lib/distanceUnit'
import { Bottle, ShoppingBag, Bike, Recycle, Lightbulb, Droplets, Bus, Utensils, Leaf } from './Icons'

const HABIT_ICONS: Record<string, ComponentType<{ className?: string; size?: number }>> = {
  'no-plastic-bottle': Bottle,
  'reusable-bag': ShoppingBag,
  'bike-walk': Bike,
  recycle: Recycle,
  'meat-free-day': Utensils,
  'lights-off': Lightbulb,
  'shorter-shower': Droplets,
  'public-transport': Bus,
  composted: Leaf,
  'paper-recycled': Recycle,
  'glass-recycled': Bottle,
}

interface HabitCardProps {
  habit: Habit
  /** Total for today (in storage unit: count or km) */
  count: number
  /** Called when user adjusts today's total; delta is in storage unit (count or km). */
  onAdjust: (delta: number) => void
  /** Display unit for distance habits (count is always stored in km) */
  distanceUnit?: DistanceUnit
}

export function HabitCard({
  habit,
  count = 0,
  onAdjust,
  distanceUnit = 'km',
}: HabitCardProps) {
  const isDistanceHabit = habit.co2KgPerKm != null
  const displayTotal = isDistanceHabit && distanceUnit === 'miles' ? kmToMiles(count) : count
  const unitLabel = isDistanceHabit ? (distanceUnit === 'miles' ? 'mi' : 'km') : habit.unit
  const unitLabelShort = isDistanceHabit ? unitLabel : habit.unit.replace(/\s+(saved|avoided)$/i, '')
  const [addInput, setAddInput] = useState('')

  const getAmountFromInput = () => {
    const parsed = addInput.trim() === '' ? null : parseFloat(addInput)
    const amount = parsed != null && !Number.isNaN(parsed) && parsed > 0 ? parsed : 1
    return isDistanceHabit && distanceUnit === 'miles' ? milesToKm(amount) : amount
  }

  const handleAdd = () => {
    onAdjust(getAmountFromInput())
    setAddInput('')
  }

  const handleReduce = () => {
    onAdjust(-getAmountFromInput())
    setAddInput('')
  }

  return (
    <div className="rounded-lg bg-white border border-slate-200 p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover">
      <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_220px] items-start sm:items-center gap-4 min-w-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
            {(() => {
              const Icon = HABIT_ICONS[habit.id] ?? Recycle
              return <Icon className="h-5 w-5" size={20} />
            })()}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-900 truncate">{habit.name}</h3>
            <p className="text-sm text-slate-500 mt-0.5 truncate">{habit.unit}</p>
            <p className="mt-1 text-base font-semibold tabular-nums text-slate-900 truncate">
              Today: {isDistanceHabit ? Number(displayTotal).toFixed(1) : Math.round(displayTotal)} {unitLabel}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 h-9 justify-end">
          <label className="flex items-center gap-1.5 h-full">
            <span className="text-sm text-slate-600 leading-none">Amount:</span>
            <input
              type="number"
              min={0}
              step={isDistanceHabit ? (distanceUnit === 'miles' ? 0.1 : 0.5) : 1}
              className="h-9 w-14 rounded-lg border-2 border-slate-300 px-2 py-0 text-sm tabular-nums focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
              value={addInput}
              placeholder="1"
              onChange={(e) => setAddInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
            />
            <span className="inline-block text-sm text-slate-500 leading-none align-middle">{unitLabelShort}</span>
          </label>
          <button
            type="button"
            onClick={handleAdd}
            className="h-9 rounded-lg px-4 py-0 text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 transition-colors shadow-sm flex items-center justify-center"
          >
            Log
          </button>
          <button
            type="button"
            onClick={handleReduce}
            className="h-9 rounded-lg px-3 py-0 text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors flex items-center justify-center"
          >
            Reduce
          </button>
        </div>
      </div>
    </div>
  )
}
