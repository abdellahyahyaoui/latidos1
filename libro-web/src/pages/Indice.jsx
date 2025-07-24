"use client"
import EncabezadoLibro from "../pages/EncabezadoLibro"
import AutorItem from "../pages/AutorItem" // Asegúrate de que la ruta sea correcta
import "./indice.css"

export default function Indice({ autores, onGoToHome, irAPagina }) {
  return (
    <div className="indice-container">
      <div className="indice-header">
        <EncabezadoLibro onGoToHome={onGoToHome} />
      </div>

      <div className="indice-content">
        <h2 className="indice-titulo">Índice de Autores</h2>

        <div className="descripcion-indice">
          
        </div>

        <div className="lista-autores">
          {autores.map((autor, index) => (
            <AutorItem
              key={autor.id}
              id={autor.id}
              nombre={`${index + 1}. ${autor.nombre}`}
              fragmento={autor.fragmento}
              // Ahora irAPagina recibe el ID del autor, y Libro.jsx lo mapeará a la página de índice del autor
              onNavigateToPage={() => irAPagina(autor.id)}
            />
          ))}
        </div>

        
      </div>
    </div>
  )
}
