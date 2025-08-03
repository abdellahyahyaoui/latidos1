"use client"
import { useEffect, useRef } from "react"
import "./AutorItem.css"

export default function AutorItem({ id, nombre, fragmento, onNavigateToPage }) {
  const tooltipRef = useRef(null)
  const itemRef = useRef(null)

  useEffect(() => {
    const handleMouseEnter = () => {
      if (tooltipRef.current && itemRef.current) {
        const tooltip = tooltipRef.current
        const item = itemRef.current
        const rect = item.getBoundingClientRect()
        const tooltipHeight = 200 // Altura aproximada del tooltip
        const spaceBelow = window.innerHeight - rect.bottom
        const spaceAbove = rect.top

        // ✅ AÑADIR: Posicionamiento inteligente
        if (spaceBelow < tooltipHeight && spaceAbove > tooltipHeight) {
          // Si no hay espacio abajo pero sí arriba, mostrar arriba
          tooltip.style.top = `${rect.top - tooltipHeight - 10}px`
          tooltip.style.left = `${rect.left + rect.width / 2}px`
          tooltip.classList.add("tooltip-above")
        } else {
          // Mostrar abajo por defecto
          tooltip.style.top = `${rect.bottom + 10}px`
          tooltip.style.left = `${rect.left + rect.width / 2}px`
          tooltip.classList.remove("tooltip-above")
        }
      }
    }

    const item = itemRef.current
    if (item) {
      item.addEventListener("mouseenter", handleMouseEnter)
      return () => item.removeEventListener("mouseenter", handleMouseEnter)
    }
  }, [])

  return (
    <div ref={itemRef} className="autor-item" onClick={onNavigateToPage}>
      <span className="nombre-autor">{nombre}</span>
      <div ref={tooltipRef} className="tooltip">
        {fragmento}
      </div>
    </div>
  )
}
