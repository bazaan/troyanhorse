import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'

export default function HeatmapChart({ reportes }) {
  const startDate = new Date(new Date().getFullYear(), 0, 1)
  const endDate = new Date()

  const values = reportes.map(r => {
    const count = ['meditacion', 'entrenamiento', 'correr', 'lectura', 'ayuno']
      .filter(k => r[k]).length
    return { date: r.fecha, count }
  })

  return (
    <div className="overflow-x-auto">
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={values}
        classForValue={value => {
          if (!value || value.count === 0) return 'color-empty'
          return `color-scale-${value.count}`
        }}
        tooltipDataAttrs={value => ({
          'data-tip': value.date
            ? `${value.date}: ${value.count} actividades`
            : 'Sin reporte'
        })}
        showWeekdayLabels
      />
    </div>
  )
}
