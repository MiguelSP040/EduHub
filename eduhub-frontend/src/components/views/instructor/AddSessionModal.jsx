import React, { useState, useEffect } from 'react';
import { createSession, updateSession } from '../../../services/sessionService';
import { Editor } from 'primereact/editor';
import { Paperclip } from 'react-feather';
import { useToast } from '../../utilities/ToastProvider';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'quill/dist/quill.snow.css';

const AddSessionModal = ({ courseId, fetchSessions, session }) => {
  const { showSuccess, showError, showWarn } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [sessionData, setSessionData] = useState({ nameSession: '', content: '' });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      setSessionData({ nameSession: session.nameSession, content: session.content });
      setFiles(session.multimedia || []);
    }
  }, [session]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleSaveSession = async () => {
    if (!sessionData.nameSession.trim()) {
      showWarn('Campos obligatorios', 'El título de la sesión es obligatorio.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('session', new Blob([JSON.stringify({ ...sessionData, courseId })], { type: 'application/json' }));

    files.forEach((file) => formData.append('files', file));

    let response;
    if (session) {
      response = await updateSession({ ...sessionData, id: session.id });
    } else {
      response = await createSession(formData);
    }

    setLoading(false);

    if (response.status === 200) {
      closeModal();
      fetchSessions();
    } else {
      showError('Error', response.message);
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setSessionData({ nameSession: '', content: '' });
    setFiles([]);
  };

  return (
    <>
      <button className="btn btn-purple-900" onClick={openModal}>
        {session ? <i className="bi bi-pencil-square"></i>  : <i className="bi bi-clipboard2-plus"></i> }{session ? ' Editar Sesión' : ' Añadir Sesión'}
      </button>

      {isOpen && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body text-center">
                <h5 className="modal-title mb-3">{session ? 'Editar Sesión' : 'Crear nueva Sesión'}</h5>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Título de la sesión"
                  value={sessionData.nameSession}
                  onChange={(e) => setSessionData({ ...sessionData, nameSession: e.target.value })}
                />

                {/* Rich Text Editor */}
                <div className="w-100 text-start">
                  <Editor
                    value={sessionData.content}
                    onTextChange={(e) => setSessionData({ ...sessionData, content: e.htmlValue })}
                    style={{ height: '320px', width: '100%' }}
                  />
                </div>

                {/* Botón de archivo */}
                <div className="d-flex align-items-center mt-2">
                  <label htmlFor="fileInput" className="btn btn-outline-secondary btn-sm d-flex align-items-center">
                    <Paperclip size={20} className="me-1" /> Adjuntar Archivos
                  </label>
                  <input type="file" id="fileInput" className="d-none" multiple onChange={handleFileChange} accept="application/pdf, image/*" />
                </div>

                {/* Lista de archivos seleccionados */}
                {files.length > 0 && (
                  <ul className="mt-2 list-unstyled">
                    {files.map((file, index) => (
                      <li key={index} className="d-flex justify-content-between align-items-center text-muted small">
                        {file.name || file.fileName}
                        <button className="btn btn-sm text-danger" onClick={() => removeFile(index)}>
                          ✖
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="text-end mt-3">
                  <button className="btn btn-purple-900 me-2" onClick={handleSaveSession} disabled={loading}>
                    {loading ? 'Guardando...' : session ? 'Actualizar' : 'Guardar'}
                  </button>
                  <button className="btn btn-outline-secondary" onClick={closeModal}>
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddSessionModal;
