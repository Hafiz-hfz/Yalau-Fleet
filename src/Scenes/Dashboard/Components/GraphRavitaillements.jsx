import { BarChart } from '@mui/x-charts/BarChart';
import { useState, useEffect } from "react";

function GraphRavitaillements() {
  const [data, setData] = useState({})

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/dashboard/ravitaillements-jour`)
      .then(res => res.json())
      .then(setData)
  }, [])

  const jours = ['lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.']
  const valeurs = jours.map(j => data[j] || 0)

  return (
    <BarChart
      xAxis={[{ scaleType: 'band', data: jours }]}
      series={[{ data: valeurs, label: 'Ravitaillements', color: '#4cceac' }]}
      height={300}
    />
  )
}

export default GraphRavitaillements