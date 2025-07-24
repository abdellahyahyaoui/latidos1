"use client"
import "./AutorItem.scss"

export default function AutorItem({ nombre, fragmento, id, onNavigateToPage }) {
  return (
    // onNavigateToPage ahora espera el ID del autor para ir a su página de índice
    <div className="autor-item" onClick={() => onNavigateToPage(id)}>
      <span className="nombre-autor">{nombre}</span>
      <div className="tooltip">{fragmento}</div>
    </div>
  )
}
