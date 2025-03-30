import React from 'react';
import { Stepper, Step, StepLabel } from '@mui/material';

const CourseStepProgress = ({ status }) => {
  const steps = ['Creado', 'En Revisión', 'Aprobado', 'En Curso', 'Finalizado'];

  const statusIndex = {
    Creado: 0,
    Pendiente: 1,
    Rechazado: 1,
    Aprobado: 2,
    Empezado: 3,
    Finalizado: 4,
  };

  const currentIndex = statusIndex[status] ?? 0;

  return (
    <div className="mb-5 px-4">
      <Stepper activeStep={currentIndex} alternativeLabel>
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
