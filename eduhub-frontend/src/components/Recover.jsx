const Recover = ({ setView }) => {
  const handleBack = () => {
    setView("login");
  };

  return (
    <div>
      <div className="text-start mb-5">
        <button className="btn btn-outline-secondary mb-3 mt-2 rounded-3 position-absolute top-0" onClick={handleBack} >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-return-left" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5"/>
          </svg>
        </button>
      </div>
      <h5>Ingresa tu correo electrónico para recuperar tu contraseña</h5>
      <input
        type="text"
        className="form-control mt-5"
        placeholder="Ingresa tu correo electrónico"
        required
      />
      <button className="btn btn-purple-900 text-white mt-5 w-100 mb-4 sr-only" disabled>Enviar</button>
    </div>
  );
};

export default Recover;
