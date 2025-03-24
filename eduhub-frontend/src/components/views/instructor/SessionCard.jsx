import React from "react";
import { Clipboard, FileText } from "react-feather";

const SessionCard = ({ session, instructor, onSelect }) => {
    return (
        <div className="card p-3 mb-3 shadow-sm d-flex align-items-center" style={{ cursor: "pointer" }} onClick={onSelect}>
            <div className="d-flex w-100">
                {/* Ícono a la izquierda con línea divisoria */}
                <div className="d-flex align-items-center pe-3 border-end">
                    <Clipboard size={40} className="text-primary" />
                </div>

                {/* Contenido a la derecha */}
                <div className="ps-3 flex-grow-1 text-truncate overflow-auto">
                    <div className="d-flex align-items-center justify-content-between">
                        <h4 className="mb-0 fw-semibold">{instructor?.username} ha publicado: {session.nameSession}</h4>
                    </div>

                    {/* Archivos adjuntos en formato de etiquetas */}
                    <div className="mt-2 d-flex flex-wrap gap-2">
                        {session.multimedia && session.multimedia.map((file) => (
                            <span key={file.id} className="badge bg-secondary text-white d-flex align-items-center p-2">
                                <FileText size={16} className="me-1" /> {file.fileName}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SessionCard;
