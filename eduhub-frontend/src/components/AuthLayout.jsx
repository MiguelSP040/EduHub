const AuthLayout = ({ children }) => {
    return (
        <main className="container">
            <div className="row justify-content-center">
                <div className="col-12 col-xl-9 p-md-0 p-3">
                    <div className="card bg-white-200 border-0 shadow rounded-4 p-2">
                        <div className="row g-0">
                        {/* Sección Izquierda */}
                            <div className="col-md-6 bg-purple-800 rounded-3 text-white d-flex flex-column text-center p-5 d-none d-md-block">
                                <div className="d-flex align-items-center justify-content-center">
                                <img src="./src/assets/img/eduhub-icon.png" alt="EduHub" height="350" />
                                </div>
                                <p>EduHubPro 2025 - Copyright</p>
                            </div>
                            {/* Sección Derecha */}
                            <div className="col-md-6 d-flex align-items-center p-0 p-md-4">
                                <div className="w-100">{children}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AuthLayout;