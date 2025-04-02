import React from 'react';
import { Stepper, Step, StepLabel, useMediaQuery, useTheme } from '@mui/material';

const CourseStepProgress = ({ status }) => {
  const steps = ['Creado', 'En Revisión', 'Aprobado', 'En Curso', 'Finalizado'];

  // Mapeo de estados a índices
  const statusIndex = {
    Creado: 0,
    Pendiente: 1,
    Rechazado: 1,
    Aprobado: 2,
    Empezado: 3,
    Finalizado: 4,
  };

  const currentIndex = statusIndex[status] ?? 0;

  // Hook de MUI para detectar pantallas pequeñas
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div className="mb-5 px-4 d-flex justify-content-center d-md-block">
      <Stepper
        activeStep={currentIndex}
        alternativeLabel={!isMobile}
        orientation={isMobile ? 'vertical' : 'horizontal'}
      >
        {steps.map((label, index) => (
          <Step key={index} completed={index < currentIndex}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
};

export default CourseStepProgress;
