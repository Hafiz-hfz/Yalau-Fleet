import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import { useState, useEffect } from "react";

const data = [
  { value: 5, label: 'En route' },
  { value: 10, label: 'Disponible' },
  { value: 15, label: 'En maintenance' },
  { value: 20, label: 'Hors service' },
];

const size = {
  width: 400,
  height: 200,
};

const StyledText = styled('text')(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 20,
}));

function  PieCenterLabel({ children })  {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

export default function PieChartWithCenterLabel() {
   const [statuts, setStatuts] = useState({ enRoute: 0, disponible: 0, enPanne: 0, total: 0 })
    useEffect(() => {
    fetch('${import.meta.env.VITE_API_URL}/api/dashboard/statut-flotte')
      .then(res => res.json())
      .then(setStatuts)
  }, [])
     const data = [
    { value: statuts.enRoute, label: 'En route' },
    { value: statuts.disponible, label: 'Disponible' },
    { value: statuts.enPanne, label: 'En panne' },
  ]
  return (
    <PieChart series={[{ data, innerRadius: 70 }]} 
                        {...size}
                        slotProps={{
                          legend: {
                            direction: 'column',
                            position: { vertical: 'middle', horizontal: 'right' },
                            padding: { left: 80 }, // espace entre le cercle et la légende
                          },
                        }}
                        >
       <PieCenterLabel>{statuts.total} Total</PieCenterLabel>
    </PieChart>
  );
}
