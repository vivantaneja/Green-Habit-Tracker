import type { DistanceUnit } from './distanceUnit'
import { kmToMiles, milesToKm } from './distanceUnit'

export type UnitSystem = 'metric' | 'imperial'

export interface UnitPreferences {
  distance: DistanceUnit
  massSystem: UnitSystem
  volumeSystem: UnitSystem
}

export const DEFAULT_UNIT_PREFERENCES: UnitPreferences = {
  distance: 'km',
  massSystem: 'metric',
  volumeSystem: 'metric',
}

type MeasurementKind = 'distance' | 'mass' | 'volume' | 'duration'
type BaseUnit = 'km' | 'g' | 'ml' | 'min'
type DisplayUnit =
  | 'km'
  | 'mi'
  | 'g'
  | 'kg'
  | 'oz'
  | 'lb'
  | 'ml'
  | 'l'
  | 'fl oz'
  | 'gal'
  | 'min'
  | 'h'

interface MeasurementDefinition {
  kind: MeasurementKind
  baseUnit: BaseUnit
}

const HABIT_MEASUREMENTS: Record<string, MeasurementDefinition> = {
  'bike-walk': { kind: 'distance', baseUnit: 'km' },
  'public-transport': { kind: 'distance', baseUnit: 'km' },
  composted: { kind: 'mass', baseUnit: 'g' },
  'shorter-shower': { kind: 'duration', baseUnit: 'min' },
}

export function getMeasurementDefinition(habitId: string): MeasurementDefinition | null {
  return HABIT_MEASUREMENTS[habitId] ?? null
}

function resolveDisplayUnit(def: MeasurementDefinition, prefs: UnitPreferences, baseValue: number): DisplayUnit {
  if (def.kind === 'distance') {
    return prefs.distance === 'miles' ? 'mi' : 'km'
  }
  if (def.kind === 'mass') {
    if (prefs.massSystem === 'imperial') {
      const ounces = baseValue / 28.349523125
      return Math.abs(ounces) >= 16 ? 'lb' : 'oz'
    }
    return Math.abs(baseValue) >= 1000 ? 'kg' : 'g'
  }
  if (def.kind === 'volume') {
    if (prefs.volumeSystem === 'imperial') {
      const flOz = baseValue / 29.5735295625
      return Math.abs(flOz) >= 128 ? 'gal' : 'fl oz'
    }
    return Math.abs(baseValue) >= 1000 ? 'l' : 'ml'
  }
  return Math.abs(baseValue) >= 60 ? 'h' : 'min'
}

function convertBaseToDisplay(baseValue: number, displayUnit: DisplayUnit): number {
  switch (displayUnit) {
    case 'mi':
      return kmToMiles(baseValue)
    case 'kg':
      return baseValue / 1000
    case 'oz':
      return baseValue / 28.349523125
    case 'lb':
      return baseValue / 453.59237
    case 'l':
      return baseValue / 1000
    case 'fl oz':
      return baseValue / 29.5735295625
    case 'gal':
      return baseValue / 3785.411784
    case 'h':
      return baseValue / 60
    default:
      return baseValue
  }
}

function convertDisplayToBase(displayValue: number, displayUnit: DisplayUnit): number {
  switch (displayUnit) {
    case 'mi':
      return milesToKm(displayValue)
    case 'kg':
      return displayValue * 1000
    case 'oz':
      return displayValue * 28.349523125
    case 'lb':
      return displayValue * 453.59237
    case 'l':
      return displayValue * 1000
    case 'fl oz':
      return displayValue * 29.5735295625
    case 'gal':
      return displayValue * 3785.411784
    case 'h':
      return displayValue * 60
    default:
      return displayValue
  }
}

function getDisplayStep(displayUnit: DisplayUnit): number {
  if (displayUnit === 'mi') return 0.1
  if (displayUnit === 'km') return 0.5
  if (displayUnit === 'lb') return 0.1
  if (displayUnit === 'oz') return 1
  if (displayUnit === 'kg') return 0.1
  if (displayUnit === 'fl oz') return 1
  if (displayUnit === 'gal') return 0.1
  if (displayUnit === 'l') return 0.1
  if (displayUnit === 'h') return 0.1
  return 1
}

function formatNumber(value: number, decimals = 1): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(decimals)
}

export interface HabitDisplayMeasurement {
  value: number
  valueLabel: string
  unit: string
  shortUnit: string
  inputStep: number
  quickStepBase: number
}

export function getHabitDisplayMeasurement(
  habitId: string,
  baseValue: number,
  prefs: UnitPreferences,
  fallbackUnit: string
): HabitDisplayMeasurement {
  const def = getMeasurementDefinition(habitId)
  if (!def) {
    const rounded = Math.round(baseValue)
    return {
      value: rounded,
      valueLabel: String(rounded),
      unit: fallbackUnit,
      shortUnit: fallbackUnit.replace(/\s+(saved|avoided)$/i, ''),
      inputStep: 1,
      quickStepBase: 1,
    }
  }

  const displayUnit = resolveDisplayUnit(def, prefs, baseValue)
  const displayValue = convertBaseToDisplay(baseValue, displayUnit)
  const unit = displayUnit
  return {
    value: displayValue,
    valueLabel: formatNumber(displayValue),
    unit,
    shortUnit: unit,
    inputStep: getDisplayStep(displayUnit),
    quickStepBase: convertDisplayToBase(1, displayUnit),
  }
}

export function convertHabitDisplayAmountToBase(
  habitId: string,
  displayAmount: number,
  prefs: UnitPreferences,
  currentBaseValue: number
): number {
  const def = getMeasurementDefinition(habitId)
  if (!def) return displayAmount
  const displayUnit = resolveDisplayUnit(def, prefs, currentBaseValue)
  return convertDisplayToBase(displayAmount, displayUnit)
}
