import React, { useState, useEffect } from 'react';
import { FileText, Edit, Paperclip } from 'react-feather';
import { Editor } from 'primereact/editor';
import { useToast } from '../../utilities/ToastProvider';
import { updateSession, handleViewFile } from '../../../services/sessionService';
import 'quill/dist/quill.snow.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const SessionView = ({ session, setSelectedSession, fetchSessions, courseStatus }) => {
  const { showSuccess, showError, showWarn } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingFileId, setLoadingFileId] = useState(null);

  const [editedSession, setEditedSession] = useState({
    id: session.id,
    nameSession: session.nameSession,
    content: session.content,
    courseId: session.courseId,
  });
  const [attachments, setAttachments] = useState([]);

  const [originalSession, setOriginalSession] = useState(null);
  const [originalAttachments, setOriginalAttachments] = useState([]);

  useEffect(() => {
    setEditedSession({
      id: session.id,
      nameSession: session.nameSession,
      content: session.content,
      courseId: session.courseId,
    });
    if (session.multimedia) {
      setAttachments(session.multimedia);
    }
  }, [session]);

  const handleEdit = () => {
    setOriginalSession({ ...editedSession });
    setOriginalAttachments([...attachments]);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedSession({ ...originalSession });
    setAttachments([...originalAttachments]);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!editedSession.nameSession.trim()) {
      showWarn('Campos obligatorios', 'El título de la sesión es obligatorio.');
      return;
    }
    const confirmed = window.confirm('¿Estás seguro de que deseas guardar los cambios?');
    if (!confirmed) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('session', new Blob([JSON.stringify(editedSession)], { type: 'application/json' }));
      attachments.forEach((item) => {
        if (item instanceof File) {
          formData.append('files', item);
        }
      });

      const response = await updateSession(formData);

      if (response.status === 200) {
        showSuccess('Sesión actualizada correctamente', 'La sesión fue actualizada exitosamente');
        fetchSessions();
        setIsEditing(false);
      } else {
        showError('Error', response.message || 'Error al actualizar sesión');
      }
    } catch (error) {
      console.error(error);
      showError('Error', 'Ocurrió un error al guardar los cambios');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setAttachments((prev) => [...prev, ...selectedFiles]);
  };

  const removeAttachment = (index) => {
    const confirmed = window.confirm('¿Estás seguro de eliminar este archivo?');
    if (!confirmed) return;
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const renderCourseStatusMessage = (status) => {
    switch (status) {
      case 'Pendiente':
        return <span className="text-warning fw-semibold">Curso Pendiente - No editable</span>;
      case 'Rechazado':
        return <span className="text-danger fw-semibold">Curso Rechazado - No editable</span>;
      case 'Aprobado':
        return <span className="text-success fw-semibold">Curso Aprobado - No editable</span>;
      case 'Empezado':
        return <span className="text-primary fw-semibold">Curso Empezado - No editable</span>;
      default:
        return <span className="fw-semibold">Curso {status} - No editable</span>;
    }
  };

  const renderTopButtons = () => {
    if (courseStatus === 'Creado') {
      if (!isEditing) {
        return (
          <button className="btn btn-outline-primary d-flex align-items-center" onClick={handleEdit}>
            <Edit size={18} className="me-2" />
            Editar
          </button>
        );
      } else {
        return (
          <>
            <button className="btn btn-success d-flex align-items-center" onClick={handleSave} disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
            <button className="btn btn-danger d-flex align-items-center" onClick={handleCancel}>
              Cancelar
            </button>
          </>
        );
      }
    } else {
      return renderCourseStatusMessage(courseStatus);
    }
  };

  return (
    <div className="card shadow-sm p-4 m-4">
      {/* Encabezado con título + área de botones o mensajes */}
      <div className="bg-light p-2 mb-2 d-flex flex-wrap justify-content-between text-start align-items-center">
        <div className="flex-grow-1 me-3">
          {!isEditing ? (
            <h2 className="fw-bold mb-0">{editedSession.nameSession}</h2>
          ) : (
            <input
              type="text"
              className="form-control fw-bold fs-5"
              value={editedSession.nameSession}
              onChange={(e) =>
                setEditedSession({
                  ...editedSession,
                  nameSession: e.target.value,
                })
              }
            />
          )}
        </div>

        <div className="d-flex flex-wrap gap-2">{renderTopButtons()}</div>
      </div>

      {/* Contenido de la sesión (texto) */}
      {(isEditing || editedSession.content) &&
        (!isEditing ? (
          <>
            <hr />
            <div className="session-content bg-light rounded-4 p-4" dangerouslySetInnerHTML={{ __html: editedSession.content }} />
          </>
        ) : (
          <Editor value={editedSession.content} onTextChange={(e) => setEditedSession({ ...editedSession, content: e.htmlValue })} style={{ minHeight: '200px', width: '100%' }} />
        ))}

      <hr />

      {/* Material adjunto */}
      <div className="mt-3 p-3">
        <h5 className="fw-semibold mb-3">Material adjunto:</h5>

        {/* Sólo permitir añadir/eliminar archivos si el curso es "Creado" y estamos en edición */}
        {courseStatus === 'Creado' && isEditing && (
          <div className="d-flex align-items-center mb-3 flex-wrap gap-2">
            <label htmlFor="fileInput" className="btn btn-outline-secondary btn-sm d-flex align-items-center">
              <Paperclip size={18} className="me-1" />
              Adjuntar Archivos
            </label>
            <input type="file" id="fileInput" className="d-none" multiple onChange={handleFileChange} accept="application/pdf, image/*" />
          </div>
        )}

        {attachments.length > 0 ? (
          <div className="d-flex flex-wrap justify-content-center gap-3">
            {attachments.map((file, index) => {
              const fileName = file.fileName || file.name || 'Archivo';

              return (
                <div key={index} className="card p-3 shadow-sm" style={{ width: '220px' }}>
                  <div className="text-center">
                    <FileText size={40} className="text-secondary" />
                  </div>
                  <p className="small text-truncate mt-2 mb-2">{fileName}</p>
                  {courseStatus === 'Creado' && isEditing ? (
                    <button className="btn btn-sm btn-danger w-100" onClick={() => removeAttachment(index)}>
                      Eliminar
                    </button>
                  ) : (
                    <button className="btn btn-sm btn-purple-900 w-100" onClick={() => handleViewFile(session.id, file, setLoadingFileId)} disabled={loadingFileId === file.id}>
                      {loadingFileId === file.id ? <div className="spinner-border spinner-border-sm text-light" /> : 'Ver'}
                    </button>
                  )}
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

export default SessionView;
