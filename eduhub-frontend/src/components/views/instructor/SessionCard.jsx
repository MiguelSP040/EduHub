import React, { useState } from "react";
import { updateSession, deleteSession } from "../../../services/sessionService";
import { Image } from "react-feather";

const SessionCard = ({ session, refreshSessions, isPublished, courseStatus  }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSession, setEditedSession] = useState(session);

  const handleUpdateSession = async () => {
    const response = await updateSession(editedSession);
    if (response.status === 200) {
      alert("Sesión actualizada correctamente");
      refreshSessions();
      setIsEditing(false);
    } else {
      alert("Error: " + response.message);
    }
  };

  const handleDeleteSession = async () => {
    if (window.confirm("¿Seguro que quieres eliminar esta sesión?")) {
      const response = await deleteSession(session.id);
      console.log("Respuesta DELETE:", response); // Depuración
      if (response.status === 200) {
        alert("Sesión eliminada correctamente");
        refreshSessions();
      } else {
        alert("Error: " + response.message);
      }
    }
  };  

  return (
    <div className="card rounded-4 my-3 p-0">
        <div className="card-header bg-none d-flex justify-content-between align-items-center">
            {isEditing ? (
                <input 
                    type="text" 
                    className="form-control w-100" 
                    value={editedSession.nameSession}
                    onChange={(e) => setEditedSession({ ...editedSession, nameSession: e.target.value })}
                    disabled={isPublished} 
                />
            ) : (
                <div className="d-flex align-items-center">
                    <img 
                        src="https://randomuser.me/api/portraits/men/22.jpg" 
                        alt="Usuario" 
                        className="rounded-circle d-none d-md-block user-select-none" 
                        width="40" height="40" 
                    />
                    <p className="fw-semibold ms-2 my-0 text-wrap">{session.nameSession}</p>
                </div>
            )}
        </div>
        <div className="card-body d-flex flex-wrap">
            <div className="img-container">
                <img 
                    src={session.multimedia} 
                    alt="multimedia" 
                    className="me-3 rounded-3 img-fluid d-none d-sm-block"
                    style={{ maxWidth: "150px", height: "120px", objectFit: "fill" }}
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150x120/png"; }}
                />
            </div>
            <Image className="d-block d-sm-none me-3" />
            {isEditing ? (
                <textarea 
                    className="form-control w-100" 
                    rows={3}
                    value={editedSession.content}
                    onChange={(e) => setEditedSession({ ...editedSession, content: e.target.value })}
                    disabled={isPublished}
                />
            ) : (
                <p className="text-truncate text-wrap">{session.content}</p>
            )}
        </div>
        <div className="card-footer text-end" style={{ display: courseStatus === "Aprobado" || courseStatus === "Empezado" ? "none" : "block"}}>
            <div>
                {isEditing ? (
                    <div>
                        <button className="btn btn-purple-900 btn-sm mx-2" onClick={handleUpdateSession} disabled={isPublished}>
                            Guardar
                        </button>
                        <button className="btn btn-purple-400 btn-sm" onClick={() => setIsEditing(false)} disabled={isPublished}>
                            Cancelar
                        </button>
                    </div>
                ) : (
                    <div>
                        <button className="btn btn-purple-900 btn-sm me-2" onClick={() => setIsEditing(true)} disabled={isPublished}>
                            Editar
                        </button>
                        <button className="btn btn-purple-400 btn-sm" onClick={handleDeleteSession} disabled={isPublished}>
                            Eliminar
                        </button>
                    </div>
                )}
            </div>
        </div>
    </div>
);
};

export default SessionCard;
