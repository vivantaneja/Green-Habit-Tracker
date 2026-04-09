import { useUnitPreferences } from '../hooks/useUnitPreferences'

export default function Settings() {
  const [unitPrefs, setUnitPrefs] = useUnitPreferences()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-slate-900 tracking-tight">
          Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Preferences for how data is displayed. Stored on your device.
        </p>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
        <h2 className="text-sm font-medium text-slate-900 mb-3">Distance</h2>
        <p className="text-sm text-slate-500 mb-4">
          Used for bike/walk distance on the Dashboard, Habits, and Impact pages.
        </p>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="distanceUnit"
              checked={unitPrefs.distance === 'km'}
              onChange={() => setUnitPrefs((prev) => ({ ...prev, distance: 'km' }))}
              className="h-4 w-4 border-slate-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-slate-700">Kilometres (km)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="distanceUnit"
              checked={unitPrefs.distance === 'miles'}
              onChange={() => setUnitPrefs((prev) => ({ ...prev, distance: 'miles' }))}
              className="h-4 w-4 border-slate-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-slate-700">Miles (mi)</span>
          </label>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
        <h2 className="text-sm font-medium text-slate-900 mb-3">Mass</h2>
        <p className="text-sm text-slate-500 mb-4">
          Choose metric or imperial. The app auto-switches units (for example g ↔ kg, oz ↔ lb).
        </p>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="massUnit"
              checked={unitPrefs.massSystem === 'metric'}
              onChange={() => setUnitPrefs((prev) => ({ ...prev, massSystem: 'metric' }))}
              className="h-4 w-4 border-slate-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-slate-700">Metric</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="massUnit"
              checked={unitPrefs.massSystem === 'imperial'}
              onChange={() => setUnitPrefs((prev) => ({ ...prev, massSystem: 'imperial' }))}
              className="h-4 w-4 border-slate-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-slate-700">Imperial</span>
          </label>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
        <h2 className="text-sm font-medium text-slate-900 mb-3">Volume</h2>
        <p className="text-sm text-slate-500 mb-4">
          Choose metric or imperial. The app auto-switches units (for example ml ↔ l, fl oz ↔ gal).
        </p>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="volumeUnit"
              checked={unitPrefs.volumeSystem === 'metric'}
              onChange={() => setUnitPrefs((prev) => ({ ...prev, volumeSystem: 'metric' }))}
              className="h-4 w-4 border-slate-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-slate-700">Metric</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="volumeUnit"
              checked={unitPrefs.volumeSystem === 'imperial'}
              onChange={() => setUnitPrefs((prev) => ({ ...prev, volumeSystem: 'imperial' }))}
              className="h-4 w-4 border-slate-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-slate-700">Imperial</span>
          </label>
        </div>
      </section>
    </div>
  )
}
