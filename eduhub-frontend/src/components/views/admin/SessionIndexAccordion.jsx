import React, { useState, useRef, useEffect } from 'react';
import { List, ChevronDown, ChevronUp } from 'react-feather';

const SessionIndexAccordion = ({ sessions }) => {
  const [open, setOpen] = useState(false);
  const contentRef = useRef(null);
  const [height, setHeight] = useState('0px');

  useEffect(() => {
    if (open) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setHeight('0px');
    }
  }, [open, sessions]);

  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center bg-light" style={{ cursor: 'pointer' }} onClick={() => setOpen(!open)}>
        <div className="d-flex align-items-center">
          <List className="me-2 text-purple" />
          <strong>Índice de sesiones</strong>
        </div>
        {open ? <ChevronUp /> : <ChevronDown />}
      </div>

      <div
        ref={contentRef}
        style={{
          maxHeight: height,
          overflow: 'hidden',
          transition: 'max-height 0.4s ease',
        }}
      >
        <ul className="list-group list-group-flush">
          {sessions.length > 0 ? (
            sessions.map((session, index) => (
              <li key={session.id} className="list-group-item session-acordeon d-flex align-items-center" style={{ cursor: 'pointer' }} onClick={() => handleScrollTo(`session-${session.id}`)}>
                <span className="badge text-bg-secondary me-3">{index + 1}</span>
                <span className="text-truncate">{session.nameSession}</span>
              </li>
            ))
          ) : (
            <li className="list-group-item text-muted text-center">No hay sesiones disponibles.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SessionIndexAccordion;
