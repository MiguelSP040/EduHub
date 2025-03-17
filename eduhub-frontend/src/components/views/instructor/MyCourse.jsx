import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "../Navbar";
import { AuthContext } from "../../../context/AuthContext";
import MyStudents from "./MyStudents";
import CourseConfig from "./CourseConfig";

const MyCourse = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const navbarRef = useRef(null);

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("material");

  // Estado local para "chapters"
  const [chapters, setChapters] = useState([]);

  // Control de modales
  const [showAddChapterModal, setShowAddChapterModal] = useState(false);
  const [showAddSessionModal, setShowAddSessionModal] = useState(false);

  // Datos temporales para nuevo capítulo
  const [newChapterName, setNewChapterName] = useState("");

  // Datos temporales para nueva sesión
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(null);
  const [newSessionName, setNewSessionName] = useState("");
  const [newSessionContent, setNewSessionContent] = useState("");
  const [newSessionMultimedia, setNewSessionMultimedia] = useState("");

  // Cargar datos del curso
  useEffect(() => {
    const data = location.state?.course;
    if (!data) {
      console.error("No se encontró la información del curso.");
      navigate("/instructor");
      return;
    }
    setCourse(data);
  }, [location, navigate]);

  // Al tener el "course", cargamos chapters de localStorage si existen;
  // si no, creamos unos de ejemplo o usamos los del backend.
  useEffect(() => {
    if (!course?.id) return;

    const stored = localStorage.getItem(`chapters_${course.id}`);
    if (stored) {
      // Cargamos del localStorage
      setChapters(JSON.parse(stored));
    } else {
      // Si no hay nada en localStorage, usamos los chapters del backend
      // o creamos un ejemplo por defecto
      const initChapters = course.chapters?.length ? course.chapters
        : [
            {
              name: "Capítulo 1 (ejemplo)",
              sessions: [
                {
                  name: "Sesión 1",
                  content: "Contenido de ejemplo para Sesión 1",
                  multimedia: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRR1wkcKkRmT4wWeSqd0SpJtfhAiTt-QBzgw&s",
                },
              ],
            },
            {
              name: "Capítulo 2 (ejemplo)",
              sessions: [],
            },
          ];
      setChapters(initChapters);
    }
  }, [course]);

  // Cada vez que "chapters" cambie, guardamos en localStorage
  useEffect(() => {
    if (course?.id) {
      localStorage.setItem(`chapters_${course.id}`, JSON.stringify(chapters));
    }
  }, [chapters, course]);

  // Añadir capítulo
  const handleCreateChapter = () => {
    if (!newChapterName.trim()) return;
    setChapters((prev) => [
      ...prev,
      { name: newChapterName, sessions: [] },
    ]);
    setNewChapterName("");
    setShowAddChapterModal(false);
  };

  // Abrir modal para añadir sesión en un capítulo
  const handleOpenAddSessionModal = (index) => {
    setSelectedChapterIndex(index);
    setNewSessionName("");
    setNewSessionContent("");
    setNewSessionMultimedia("");
    setShowAddSessionModal(true);
  };

  // Añadir sesión
  const handleCreateSession = () => {
    if (!newSessionName.trim()) return;
    const updated = [...chapters];
    updated[selectedChapterIndex].sessions.push({
      name: newSessionName,
      content: newSessionContent,
      multimedia: newSessionMultimedia,
    });
    setChapters(updated);
    setNewSessionName("");
    setNewSessionContent("");
    setNewSessionMultimedia("");
    setShowAddSessionModal(false);
  };

  return (
    <div className="d-flex">
      <Sidebar
        isExpanded={isSidebarExpanded}
        setIsExpanded={setIsSidebarExpanded}
        navbarRef={navbarRef}
      />
      <div className="flex-grow-1">
        <div ref={navbarRef}>
          <Navbar toggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)} />
        </div>

        <div className="overflow-auto vh-100">
          <main className="px-3 px-md-5 pt-5 mt-5 ms-md-5">
            {course ? (
              <>
                {/* Tabs */}
                <nav className="d-flex justify-content-center mb-4">
                  <ul className="nav nav-tabs">
                    <li className="nav-item">
                      <button
                        className={`btn ${
                          activeTab === "material"
                            ? "btn-purple-900"
                            : "btn-outline-secondary"
                        }`}
                        onClick={() => setActiveTab("material")}
                      >
                        Material
                      </button>
                    </li>
                    <li className="nav-item px-2">
                      <button
                        className={`btn ${
                          activeTab === "students"
                            ? "btn-purple-900"
                            : "btn-outline-secondary"
                        }`}
                        onClick={() => setActiveTab("students")}
                      >
                        Estudiantes
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`btn ${
                          activeTab === "config"
                            ? "btn-purple-900"
                            : "btn-outline-secondary"
                        }`}
                        onClick={() => setActiveTab("config")}
                      >
                        Configuración
                      </button>
                    </li>
                  </ul>
                </nav>

                {/* Contenido */}
                {activeTab === "material" && (
                  <div>
                    <h2>Material del curso</h2>
                    <button className="btn btn-purple-900 mb-3" onClick={() => setShowAddChapterModal(true)} >
                      Añadir Capítulo
                    </button>

                    {chapters.length > 0 ? (
                      chapters.map((chapter, i) => (
                        <div key={i} className="d-flex justify-content-center mb-3">
                          <div className="col-12 col-md-6 card p-0 rounded-4">
                            <div className="card-header text-start d-flex align-items-center bg-none">
                                <img src="https://randomuser.me/api/portraits/men/22.jpg" alt="Usuario" className="rounded-circle user-select-none" width="40" height="40"  />
                                <span className="card-title ms-3 mt-2 fw-bold">
                                    Capítulo. {i + 1} - {chapter.name}
                                </span>
                            </div>
                            <div className="card-body">
                              {chapter.sessions && chapter.sessions.length > 0 ? (chapter.sessions.map((s, idx) => (
                                  <div key={idx} className="card my-2 p-2">
                                    <div className="d-flex align-items-start text-start">
                                        <img src={s.multimedia} alt="multimedia" height={60} width={70} className="me-2 rounded-3" />
                                      <div>
                                        <h6 className="fw-bold">{s.name}</h6>
                                        <p className="mb-1">{s.content}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className="text-muted">
                                  No hay secciones en este capítulo.
                                </p>
                              )}
                            </div>
                            <div className="card-footer bg-none text-end">
                                <button className="btn btn-secondary btn-sm mb-2" onClick={() => handleOpenAddSessionModal(i)} >
                                    Añadir Sección
                                </button>
                              </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted">No hay capítulos aún.</p>
                    )}
                  </div>
                )}
                {activeTab === "students" && <MyStudents courseId={course.id} />}
                {activeTab === "config" && <CourseConfig course={course} />}
              </>
            ) : (
              <p className="text-muted">Cargando curso...</p>
            )}
          </main>
        </div>
      </div>

      {/* MODAL Añadir Capítulo */}
      {showAddChapterModal && (
        <div className="modal fade show" style={{ display: "block" }} onClick={() => setShowAddChapterModal(false)} >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()} >
            <div className="modal-content">
              <div className="modal-body">
                <h5 className="modal-title mb-3">Crear nuevo Capítulo</h5>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Nombre del capítulo"
                  value={newChapterName}
                  onChange={(e) => setNewChapterName(e.target.value)}
                />
                <div className="text-end">
                  <button className="btn btn-purple-900 me-2" onClick={handleCreateChapter} >
                    Guardar
                  </button>
                  <button className="btn btn-outline-secondary" onClick={() => setShowAddChapterModal(false)} >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL Añadir Sección */}
      {showAddSessionModal && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          onClick={() => setShowAddSessionModal(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-body">
                <h5 className="modal-title mb-3">Crear nueva Sección</h5>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Título de la sección (ej: Clase 1)"
                  value={newSessionName}
                  onChange={(e) => setNewSessionName(e.target.value)}
                />
                <textarea
                  className="form-control mb-2"
                  placeholder="Contenido de la sección"
                  rows={3}
                  value={newSessionContent}
                  onChange={(e) => setNewSessionContent(e.target.value)}
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="URL de multimedia (opcional)"
                  value={newSessionMultimedia}
                  onChange={(e) => setNewSessionMultimedia(e.target.value)}
                />
                <div className="text-end">
                  <button className="btn btn-purple-900 me-2" onClick={handleCreateSession} >
                    Guardar
                  </button>
                  <button className="btn btn-outline-secondary" onClick={() => setShowAddSessionModal(false)} >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCourse;
