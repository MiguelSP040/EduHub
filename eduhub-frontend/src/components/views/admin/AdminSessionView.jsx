import React from 'react';
import { ArrowLeft, FileText } from 'react-feather';

function base64ToBlob(base64Data, contentType = 'application/pdf') {
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
}

const AdminSessionView = ({ session, setSelectedSession }) => {
  return (
    <div className="container mt-4">
      <button className="btn btn-purple-400 mb-3 d-flex align-items-center" onClick={() => setSelectedSession(null)}>
        <ArrowLeft size={20} className="me-2" />
        Volver
      </button>

      <div className="card shadow-sm p-4">
        <h2 className="fw-bold">{session.nameSession}</h2>
        <hr />

        {/* Contenido de la sesión en texto enriquecido */}
        <div className="session-content bg-light rounded-4 p-4" dangerouslySetInnerHTML={{ __html: session.content }} />

        <hr />
        <h5 className="fw-semibold">Material adjunto:</h5>

        {session.multimedia && session.multimedia.length > 0 ? (
          <div className="d-flex justify-content-center flex-wrap gap-3 mt-3">
            {session.multimedia.map((file) => {
              const fileName = file.fileName;
              const fileType = file.fileType || 'application/pdf';

              const blob = base64ToBlob(file.data, fileType);
              const tempUrl = URL.createObjectURL(blob);

              return (
                <div key={file.id} className="card p-3 shadow-sm" style={{ width: '220px' }}>
                  <div className="text-center">
                    <FileText size={40} className="text-secondary" />
                  </div>
                  <p className="small text-truncate mt-2">{fileName}</p>

                  <a href={tempUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-purple-900 w-100">
                    Ver
                  </a>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-muted">No hay archivos adjuntos.</p>
        )}
      </div>
    </div>
  );
};

export default AdminSessionView;
