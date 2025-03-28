import React, { useState, useRef } from 'react';
import Navbar from '../Navbar';
import Sidebar from './Sidebar';
import { BookOpen, User } from 'react-feather';

export default function InstructorNotifications() {
  const navbarRef = useRef(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');

  return (
    <div>
      {/* SIDEBAR */}
      <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} navbarRef={navbarRef} />

      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex-grow-1">
        <div ref={navbarRef}>
          <Navbar toggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)} />
        </div>

        <div className="overflow-auto vh-100">
          <main className="px-3 px-md-5 pt-5 mt-5 ms-md-5">
            {/* BARRA DE NAVEGACIÓN SECUNDARIA */}
            <div className="bg-white shadow-sm mb-4">
              <div className="container-fluid px-4 py-2">
                <div className="row gx-3 align-items-center">
                  <div className="col-12 col-sm d-flex justify-content-center justify-content-sm-start">
                    <div className="d-flex flex-row flex-sm-row w-100 justify-content-around justify-content-sm-start">
                      {[
                        { tab: 'pending', icon: <User size={20} className="d-sm-none" />, label: 'Pendientes' },
                        { tab: 'allNotifications', icon: <BookOpen size={20} className="d-sm-none" />, label: 'Todas' },
                      ].map(({ tab, icon, label }) => (
                        <button key={tab} type="button" className={`btn border-0 ${activeTab === tab ? 'border-bottom border-purple border-3 fw-semibold' : ''}`} onClick={() => setActiveTab(tab)}>
                          {icon}
                          <span className="d-none d-sm-inline">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {activeTab === 'pending' ? (
                <h4>Aquí irán las notificaciones pendientes.</h4>
            ): (
                <h4>Aquí irán todas las notificaciones.</h4>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
