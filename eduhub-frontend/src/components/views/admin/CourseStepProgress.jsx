import React from 'react';
import { ProgressBar, Step } from 'react-step-progress-bar';
import 'react-step-progress-bar/styles.css';

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

  const colorByStatus = {
    Creado: '#0dcaf0',
    Pendiente: '#ffc107',
    Rechazado: '#ffc107',
    Aprobado: '#198754',
    Empezado: '#0d6efd',
    Finalizado: '#dc3545',
  };

  const currentIndex = statusIndex[status] ?? 0;
  const currentColor = colorByStatus[status] ?? '#6c757d';
  const percent = (currentIndex / (steps.length - 1)) * 100;

  return (
    <div className="mb-5 px-4">
      <ProgressBar
        percent={percent}
        filledBackground={currentColor}
        height={6}
      >
        {steps.map((label, index) => (
          <Step key={index}>
            {({ accomplished }) => (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transform: 'translateY(10px)',
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    backgroundColor: accomplished ? currentColor : '#f1f3f5',
                    border: '2px solid #dee2e6',
                    zIndex: 1,
                  }}
                />
                <small
                  style={{
                    marginTop: 6,
                    color: accomplished ? currentColor : '#6c757d',
                  }}
                >
                  {label}
                </small>
              </div>
            )}
          </Step>
        ))}
      </ProgressBar>
    </div>
  );
};

export default CourseStepProgress;
