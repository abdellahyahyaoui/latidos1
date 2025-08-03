"use client"
import EncabezadoLibro from "../pages/EncabezadoLibro"
import "./AutorIndice.css"
import { useEffect, useRef, useState } from "react"
function esTextoArabe(texto) {
  return /[\u0600-\u06FF]/.test(texto);
}

export default function AutorIndice({ autor, irAPagina, onGoToHome, autorPartGlobalPageStarts }) {
  const [showScrollIndicatorLeft, setShowScrollIndicatorLeft] = useState(false)
  const [showScrollIndicatorRight, setShowScrollIndicatorRight] = useState(false)
  const [leftTriangleDirection, setLeftTriangleDirection] = useState("down") // ✅ AÑADIR: Dirección del triángulo izquierdo
  const [rightTriangleDirection, setRightTriangleDirection] = useState("down") // ✅ AÑADIR: Dirección del triángulo derecho

  const partsListRef = useRef(null)
  const descriptionRef = useRef(null)

  // ✅ AÑADIR: Función para hacer scroll en la lista de partes
  const handleLeftTriangleClick = () => {
    if (partsListRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = partsListRef.current
      const scrollAmount = clientHeight * 0.7 // Scroll 70% de la altura visible

      if (leftTriangleDirection === "down") {
        // Scroll hacia abajo
        partsListRef.current.scrollTo({
          top: scrollTop + scrollAmount,
          behavior: "smooth",
        })
      } else {
        // Scroll hacia arriba
        partsListRef.current.scrollTo({
          top: scrollTop - scrollAmount,
          behavior: "smooth",
        })
      }
    }
  }

  // ✅ AÑADIR: Función para hacer scroll en la descripción
  const handleRightTriangleClick = () => {
    if (descriptionRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = descriptionRef.current
      const scrollAmount = clientHeight * 0.7 // Scroll 70% de la altura visible

      if (rightTriangleDirection === "down") {
        // Scroll hacia abajo
        descriptionRef.current.scrollTo({
          top: scrollTop + scrollAmount,
          behavior: "smooth",
        })
      } else {
        // Scroll hacia arriba
        descriptionRef.current.scrollTo({
          top: scrollTop - scrollAmount,
          behavior: "smooth",
        })
      }
    }
  }

  // ✅ AÑADIR: Función para detectar posición del scroll y cambiar dirección del triángulo
  const handleLeftScroll = () => {
    if (partsListRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = partsListRef.current
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 10
      const isNearTop = scrollTop <= 10

      if (isNearBottom) {
        setLeftTriangleDirection("up")
      } else if (isNearTop) {
        setLeftTriangleDirection("down")
      }
    }
  }

  const handleRightScroll = () => {
    if (descriptionRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = descriptionRef.current
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 10
      const isNearTop = scrollTop <= 10

      if (isNearBottom) {
        setRightTriangleDirection("up")
      } else if (isNearTop) {
        setRightTriangleDirection("down")
      }
    }
  }

  useEffect(() => {
    const checkScrollable = () => {
      // Verificar scroll en lista de partes (columna izquierda)
      if (partsListRef.current) {
        const { scrollHeight, clientHeight } = partsListRef.current
        setShowScrollIndicatorLeft(scrollHeight > clientHeight)
      }

      // Verificar scroll en descripción (columna derecha)
      if (descriptionRef.current) {
        const { scrollHeight, clientHeight } = descriptionRef.current
        setShowScrollIndicatorRight(scrollHeight > clientHeight)
      }
    }

    checkScrollable()
    window.addEventListener("resize", checkScrollable)

    // ✅ AÑADIR: Event listeners para scroll
    const leftElement = partsListRef.current
    const rightElement = descriptionRef.current

    if (leftElement) {
      leftElement.addEventListener("scroll", handleLeftScroll)
    }
    if (rightElement) {
      rightElement.addEventListener("scroll", handleRightScroll)
    }

    return () => {
      window.removeEventListener("resize", checkScrollable)
      if (leftElement) {
        leftElement.removeEventListener("scroll", handleLeftScroll)
      }
      if (rightElement) {
        rightElement.removeEventListener("scroll", handleRightScroll)
      }
    }
  }, [autor.parts, autor.description])

  return (
    <div className="autor-indice-container">
      <div className="autor-indice-header">
        <EncabezadoLibro onGoToHome={onGoToHome} />
      </div>

      <div className="autor-indice-main-content">
        <h2 className="autor-indice-titulo">Índice</h2>

        <div className="autor-indice-columns">
          <div className={`autor-indice-left-column ${!showScrollIndicatorLeft ? "no-scroll" : ""}`}>
            <h3 className="autor-indice-subtitulo">Partes del Relato</h3>
            <ul className="autor-indice-parts-list" ref={partsListRef}>
              {autor.parts.map((part, index) => (
                <li
                      key={index}
                      onClick={() => irAPagina(autorPartGlobalPageStarts[autor.id][part.title])}
                     className={`autor-indice-part-item ${esTextoArabe(part.title) ? "texto-arabe" : ""}`}
                     lang={esTextoArabe(part.title) ? "ar" : undefined}
>
                        {`${index + 1}. ${part.title}`}
                </li>

              ))}
            </ul>
            {/* ✅ CAMBIAR: Triángulo clickeable con dirección dinámica */}
            {showScrollIndicatorLeft && (
              <div
                className="scroll-indicator clickeable"
                onClick={handleLeftTriangleClick}
                title={leftTriangleDirection === "down" ? "Scroll hacia abajo" : "Scroll hacia arriba"}
              >
                {leftTriangleDirection === "down" ? "▼" : "▲"}
              </div>
            )}
          </div>

          <div className={`autor-indice-right-column ${!showScrollIndicatorRight ? "no-scroll" : ""}`}>
             <h3
             className={`autor-indice-subtitulo ${esTextoArabe(autor.nombre) ? "texto-arabe" : ""}`}
              lang={esTextoArabe(autor.nombre) ? "ar" : undefined}
               >
             {autor.nombre}
              </h3>
            <p className="autor-indice-description" ref={descriptionRef}>
              {autor.description}
            </p>
            {/* ✅ CAMBIAR: Triángulo clickeable con dirección dinámica */}
            {showScrollIndicatorRight && (
              <div
                className="scroll-indicator clickeable"
                onClick={handleRightTriangleClick}
                title={rightTriangleDirection === "down" ? "Scroll hacia abajo" : "Scroll hacia arriba"}
              >
                {rightTriangleDirection === "down" ? "▼" : "▲"}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="navegacion-relato" style={{ justifyContent: "flex-end" }}>
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
