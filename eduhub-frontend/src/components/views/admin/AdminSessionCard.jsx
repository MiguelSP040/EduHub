import React from "react";
import { Image } from "react-feather";

const AdminSessionCard = ({ session }) => {
  return (
    <div className="card rounded-4 my-3 p-0">
      <div className="card-header bg-none d-flex align-items-center">
        <div className="d-flex align-items-center">
          <img 
            src="https://randomuser.me/api/portraits/men/22.jpg" 
            alt="Usuario" 
            className="rounded-circle d-none d-md-block user-select-none" 
            width="40" height="40" 
          />
          <p className="fw-semibold ms-2 my-0 text-wrap">{session.nameSession}</p>
        </div>
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
        <p className="text-truncate text-wrap">{session.content}</p>
      </div>
    </div>
  );
};

export default AdminSessionCard;
