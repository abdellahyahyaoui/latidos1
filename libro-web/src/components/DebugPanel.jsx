"use client"
import { useState } from "react"
import "./DebugPanel.css" // Asegúrate de tener un archivo CSS para esto

export default function DebugPanel({ autores, pageMapData, dataSource }) {
  const [isOpen, setIsOpen] = useState(false)

  const togglePanel = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={`debug-panel ${isOpen ? "open" : ""}`}>
      <button className="debug-toggle-button" onClick={togglePanel}>
        {isOpen ? "Cerrar Debug" : "Abrir Debug"}
      </button>
      {isOpen && (
        <div className="debug-content">
          <h3>Panel de Depuración</h3>
          <p>
            <strong>Fuente de Datos:</strong> {dataSource || "N/A"}
          </p>
          <h4>Autores Cargados ({autores.length}):</h4>
          <ul className="debug-list">
            {autores.map((autor) => (
              <li key={autor.id}>
                ID: {autor.id}, Nombre: {autor.nombre}, Partes: {autor.parts?.length || 0}
              </li>
            ))}
          </ul>
          <h4>Mapa de Páginas ({pageMapData?.map?.length || 0}):</h4>
          <ul className="debug-list">
            {pageMapData?.map?.slice(0, 20).map((page, index) => (
              <li key={index}>
                Página {index}: Tipo: {page.type}, Autor ID: {page.autorId || "N/A"}, Page Index:{" "}
                {page.pageIndex || "N/A"}
              </li>
            ))}
            {pageMapData?.map?.length > 20 && <li>... (mostrando las primeras 20 páginas)</li>}
          </ul>
          <h4>Inicio de Páginas de Índice de Autor:</h4>
          <ul className="debug-list">
            {pageMapData?.authorIndexPageStarts &&
              Object.entries(pageMapData.authorIndexPageStarts).map(([id, page]) => (
                <li key={id}>
                  Autor ID {id}: Página {page}
                </li>
              ))}
          </ul>
          <h4>Inicio de Páginas de Partes de Autor:</h4>
          <ul className="debug-list">
            {pageMapData?.autorPartGlobalPageStarts &&
              Object.entries(pageMapData.autorPartGlobalPageStarts).map(([autorId, parts]) => (
                <li key={autorId}>
                  Autor ID {autorId}:
                  <ul>
                    {Object.entries(parts).map(([partTitle, page]) => (
                      <li key={partTitle}>
                        Parte "{partTitle}": Página {page}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  )
}
