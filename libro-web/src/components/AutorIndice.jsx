"use client"
import EncabezadoLibro from "../pages/EncabezadoLibro"
import "./AutorIndice.css"

export default function AutorIndice({ autor, irAPagina, onGoToHome, autorPartGlobalPageStarts }) {
  return (
    <div className="autor-indice-container">
      <EncabezadoLibro onGoToHome={onGoToHome} />

      <div className="autor-indice-main-content">
        <h2 className="autor-indice-titulo">Índice</h2>

        <div className="autor-indice-columns">
          <div className="autor-indice-left-column">
            <h3 className="autor-indice-subtitulo">Partes del Relato</h3>
            <ul className="autor-indice-parts-list">
              {autor.parts.map((part, index) => (
                <li
                  key={index}
                  // Usar el mapa de páginas globales para navegar a la página correcta de cada parte
                  onClick={() => irAPagina(autorPartGlobalPageStarts[autor.id][part.title])}
                  className="autor-indice-part-item"
                >
                  {`${index + 1}. ${part.title}`}
                </li>
              ))}
            </ul>
          </div>

          <div className="autor-indice-right-column">
            <h3 className="autor-indice-subtitulo">{autor.nombre}</h3>
            <p className="autor-indice-description">{autor.description}</p>
          </div>
        </div>
      </div>

      <div className="navegacion-relato" style={{ justifyContent: "flex-end" }}>
        {/* Este botón ahora lleva a la primera página del primer relato del autor */}
        <div
          className="boton-siguiente"
          onClick={() => irAPagina(autorPartGlobalPageStarts[autor.id][autor.parts[0].title])}
        >
          <span className="texto-sig">Siguiente</span>
          <span className="triangulo rojo">▶</span>
        </div>
      </div>
    </div>
  )
}
