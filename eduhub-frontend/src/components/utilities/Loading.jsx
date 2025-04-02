import React from 'react';
import '../../assets/styles/Loading.css';

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Cargando...</p>
    </div>
  );
};

export default Loading;
