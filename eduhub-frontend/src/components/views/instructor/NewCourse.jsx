import React, { useState, useContext, useRef } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { createCourse } from "../../../services/courseService";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "../Navbar";

const NewCourse = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const navbarRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [studentsCount, setStudentsCount] = useState("");
  const [classTime, setClassTime] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreateCourse = async () => {
    if (
      !title.trim() ||
      !description.trim() ||
      !dateStart ||
      !dateEnd ||
      !studentsCount.trim() ||
      !classTime.trim() ||
      !price.trim() ||
      !category.trim()
    ) {
      setErrorMsg("Todos los campos son obligatorios.");
      return;
    }

    const start = new Date(dateStart);
    const end = new Date(dateEnd);

    if (end.getTime() < start.getTime()) {
      setErrorMsg("La fecha de fin no puede ser menor a la de inicio.");
      return;
    }

    setLoading(true);

    const newCourse = {
      title,
      description,
      price: price === "0" ? 0 : Number(price) || 0,
      dateStart: start,
      dateEnd: end,
      category,
      studentsCount: Number(studentsCount),
      classTime,
      isArchived: false,
      isPublished: false,
      status: "pendiente",
      docenteId: user.id,
      studentsEnrolled: [],
      sessions: [],
      ratings: []
    };

    try {
      const resp = await createCourse(newCourse);
      if (resp.status !== 200) {
        setErrorMsg(resp.message || "Error al crear el curso");
        setLoading(false);
        return;
      }
      alert("Curso registrado con éxito. Pendiente de aprobación.");
      navigate("/instructor");
    } catch (error) {
      console.error(error);
      setErrorMsg("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="d-flex">
      {/* SIDEBAR */}
      <Sidebar
        isExpanded={isSidebarExpanded}
        setIsExpanded={setIsSidebarExpanded}
        navbarRef={navbarRef}
      />

      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex-grow-1">
        {/* NAVBAR */}
        <div ref={navbarRef}>
          <Navbar toggleSidebar={toggleSidebar} />
        </div>

        {/* CONTENIDO */}
        <div className="overflow-auto vh-100">
          <main className="px-3 px-md-5 pt-5 mt-5 ms-md-5 text-start">
            <div className="mx-md-5 px-md-5">
              {errorMsg && (
                <div className="alert alert-danger" role="alert">
                  {errorMsg}
                </div>
              )}
              <div className="mb-5">
                <h1>Nuevo Curso</h1>
              </div>

              {/* Título y Descripción */}
              <div className="mb-3 fw-bold">
                <label>Título del curso</label>
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="mb-3 fw-bold">
                <label>Descripción</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Cantidad de estudiantes y horario */}
              <div className="row">
                <div className="col-12 col-md-6">
                  <div className="mb-3 fw-bold">
                    <label>Cantidad de estudiantes</label>
                    <input
                      type="number"
                      className="form-control"
                      value={studentsCount}
                      onChange={(e) => setStudentsCount(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="mb-3 fw-bold">
                    <label>Horario de clases</label>
                    <input
                      type="time"
                      className="form-control"
                      placeholder="HH:MM"
                      value={classTime}
                      onChange={(e) => setClassTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Precio y Categoría */}
              <div className="row">
                <div className="col-12 col-md-6">
                  <div className="mb-3 fw-bold">
                    <label>Precio del curso</label>
                    <input
                      type="text"
                      className="form-control"
                      value={price === "0" ? "Gratis" : price}
                      onChange={(e) => {
                        let value = e.target.value;
                        if (value.toLowerCase() === "gratis") {
                          setPrice("0");
                        } else if (/^\d*\.?\d*$/.test(value)) {
                          setPrice(value);
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="mb-3 fw-bold">
                    <label>Categoría del curso</label>
                    <input
                      type="text"
                      className="form-control"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Fechas de inicio y fin */}
              <div className="row">
                <div className="col-12 col-md-6">
                  <div className="mb-3 fw-bold">
                    <label>Fecha de Inicio</label>
                    <input
                      type="date"
                      className="form-control"
                      value={dateStart}
                      onChange={(e) => setDateStart(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="mb-3 fw-bold">
                    <label>Fecha de Fin</label>
                    <input
                      type="date"
                      className="form-control"
                      value={dateEnd}
                      onChange={(e) => setDateEnd(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* BOTONES */}
              <button
                className="btn btn-secondary me-2"
                disabled={loading}
                onClick={() => navigate("/instructor")}
              >
                Cancelar
              </button>
              <button
                className="btn btn-purple-900"
                disabled={loading}
                onClick={handleCreateCourse}
              >
                {loading ? (
                  <div className="spinner-border spinner-border-sm text-light" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                ) : (
                  "Confirmar"
                )}
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default NewCourse;
