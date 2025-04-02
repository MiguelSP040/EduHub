import React, { useState } from 'react';
import { ArrowLeft, FileText } from 'react-feather';
import { handleViewFile } from '../../../services/sessionService';

const AdminSessionView = ({ session, setSelectedSession }) => {
  const [loadingFileId, setLoadingFileId] = useState(null);

  return (
    <div className="container mt-4">

      <div className="card shadow-sm p-4">
        <h2 className="fw-bold">{session.nameSession}</h2>
        <hr />
        <div className="session-content bg-light rounded-4 p-4" dangerouslySetInnerHTML={{ __html: session.content }} />
        <hr />
        <h5 className="fw-semibold">Material adjunto:</h5>

        {session.multimedia && session.multimedia.length > 0 ? (
          <div className="d-flex justify-content-center flex-wrap gap-3 mt-3">
            {session.multimedia.map((file) => (
              <div key={file.id} className="card p-3 shadow-sm" style={{ width: '220px' }}>
                <div className="text-center">
                  <FileText size={40} className="text-secondary" />
                </div>
                <p className="small text-truncate mt-2">{file.fileName}</p>
                <button
                  className="btn btn-sm btn-purple-900 w-100"
                  onClick={() => handleViewFile(session.id, file, setLoadingFileId)}
                  disabled={loadingFileId === file.id}
                >
                  {loadingFileId === file.id ? (
                    <div className="spinner-border spinner-border-sm text-light" />
                  ) : (
                    'Ver'
                  )}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">No hay archivos adjuntos.</p>
        )}
      </div>
    </div>
  );
};

export default AdminSessionView;
