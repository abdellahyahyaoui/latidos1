"use client"
import EncabezadoLibro from "../pages/EncabezadoLibro"
import "./Relato.css"

export default function Relato({
  autor,
  titulo, // Este es el título general del autor, no el de la sección
  contenido,
  avanzarPagina,
  retrocederPagina,
  onGoToHome,
  onGoToAuthorIndex,
  onGoToMainIndex,
  esPrimeraPagina, // Si es la primera página de todo el libro/relato
  sectionTitle, // Título de la sección actual (si aplica)
  isFirstPageOfSection, // Si es la primera página de una sección específica
}) {
  return (
    <div className="relato-container">
      <div className="relato-header-top">
        <EncabezadoLibro onGoToHome={onGoToHome} />
        <span className="relato-autor-superior" onClick={onGoToAuthorIndex}>
          {autor}
        </span>
      </div>

      {/* Lógica para mostrar el título de la sección */}
      {sectionTitle && isFirstPageOfSection && <h2 className="relato-titulo">{sectionTitle}</h2>}

      {/* Fallback: Si no hay título de sección, muestra el título general del autor solo en la primera página del relato completo */}
      {!sectionTitle && esPrimeraPagina && <h2 className="relato-titulo">{titulo}</h2>}

      <div className="relato-content">
        {contenido.map((parrafo, index) => (
          <p key={index} className="parrafo-relato">
            {parrafo}
          </p>
        ))}
      </div>

      <div className="navegacion-relato">
        <div className="boton-anterior" onClick={retrocederPagina}>
          <span className="triangulo verde">◀</span>
          <span className="texto-ant">Anterior</span>
        </div>

        <div className="boton-indice-principal" onClick={onGoToMainIndex} title="Ir al Índice Principal">
          <span className="triangulo rojo">▼</span>
        </div>

        <div className="boton-siguiente" onClick={avanzarPagina}>
          <span className="texto-sig">Siguiente</span>
          <span className="triangulo rojo">▶</span>
        </div>
      </div>
    </div>
  )
}
