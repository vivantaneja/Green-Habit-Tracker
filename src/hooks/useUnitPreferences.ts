import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'
import {
  DEFAULT_UNIT_PREFERENCES,
  type UnitPreferences,
} from '../lib/measurementUnits'

const STORAGE_KEY = 'green-habit-unit-preferences'
const LEGACY_DISTANCE_KEY = 'green-habit-distance-unit'

export function useUnitPreferences(): [
  UnitPreferences,
  (value: UnitPreferences | ((prev: UnitPreferences) => UnitPreferences)) => void
] {
  const [prefs, setPrefs] = useLocalStorage<UnitPreferences>(
    STORAGE_KEY,
    DEFAULT_UNIT_PREFERENCES
  )

  useEffect(() => {
    setPrefs((prev) => {
      const normalized: UnitPreferences = {
        distance: prev.distance === 'miles' ? 'miles' : 'km',
        massSystem: prev.massSystem === 'imperial' ? 'imperial' : 'metric',
        volumeSystem: prev.volumeSystem === 'imperial' ? 'imperial' : 'metric',
      }
      const isSame =
        prev.distance === normalized.distance &&
        prev.massSystem === normalized.massSystem &&
        prev.volumeSystem === normalized.volumeSystem
      return isSame ? prev : normalized
    })
  }, [setPrefs])

  useEffect(() => {
    try {
      const legacyDistance = localStorage.getItem(LEGACY_DISTANCE_KEY)
      if (!legacyDistance) return
      const parsed = JSON.parse(legacyDistance) as UnitPreferences['distance']
      if (parsed !== 'km' && parsed !== 'miles') return
      setPrefs((prev) => ({ ...prev, distance: parsed }))
      localStorage.removeItem(LEGACY_DISTANCE_KEY)
    } catch {
      // ignore migration failure
    }
  }, [setPrefs])

  return [prefs, setPrefs]
}
