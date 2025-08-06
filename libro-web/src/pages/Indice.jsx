"use client"
import EncabezadoLibro from "./EncabezadoLibro"
import AutorItem from "./AutorItem"
import autoresData from "../data/autores.json"
import cartasEsperanzaData from "../data/cartas-esperanza.json"
import poesiaData from "../data/poesia.json"
import "./indice.css"
import { useEffect, useRef, useState } from "react" // ✅ AÑADIR: Imports para scroll

export default function Indice({ autores, onGoToHome, irAPagina }) {
  // ✅ AÑADIR: Estados para los indicadores de scroll
  const [showScrollIndicators, setShowScrollIndicators] = useState({
    libro: false,
    cartas: false,
    poesia: false,
  })

  const [triangleDirections, setTriangleDirections] = useState({
    libro: "down",
    cartas: "down",
    poesia: "down",
  })

  // ✅ AÑADIR: Referencias para cada lista
  const libroListRef = useRef(null)
  const cartasListRef = useRef(null)
  const poesiaListRef = useRef(null)

  // Obtener los IDs de los autores de cartas y poesía para filtrarlos de la sección del libro
  const idsCartasEsperanza = cartasEsperanzaData.map((autor) => autor.id)
  const idsPoesia = poesiaData.map((autor) => autor.id)
  const idsExcluidos = [...idsCartasEsperanza, ...idsPoesia]

  // Filtrar autores del libro para excluir los que están en otras secciones
  const autoresDelLibroSolamente = autoresData.filter((autor) => !idsExcluidos.includes(autor.id))

  // ✅ AÑADIR: Funciones para manejar clicks en triángulos
  const handleTriangleClick = (section, listRef) => {
    if (listRef.current) {
      const { scrollTop, clientHeight } = listRef.current
      const scrollAmount = clientHeight * 0.7

      if (triangleDirections[section] === "down") {
        listRef.current.scrollTo({
          top: scrollTop + scrollAmount,
          behavior: "smooth",
        })
      } else {
        listRef.current.scrollTo({
          top: scrollTop - scrollAmount,
          behavior: "smooth",
        })
      }
    }
  }

  // ✅ AÑADIR: Funciones para detectar posición del scroll
  const handleScroll = (section, listRef) => {
    if (listRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 10
      const isNearTop = scrollTop <= 10

      setTriangleDirections((prev) => ({
        ...prev,
        [section]: isNearBottom ? "up" : "down",
      }))
    }
  }

  // ✅ AÑADIR: useEffect para configurar scroll listeners
  useEffect(() => {
    const checkScrollable = () => {
      // Verificar cada lista
      const lists = [
        { ref: libroListRef, section: "libro" },
        { ref: cartasListRef, section: "cartas" },
        { ref: poesiaListRef, section: "poesia" },
      ]

      const newIndicators = {}
      lists.forEach(({ ref, section }) => {
        if (ref.current) {
          const { scrollHeight, clientHeight } = ref.current
          newIndicators[section] = scrollHeight > clientHeight
        }
      })

      setShowScrollIndicators(newIndicators)
    }

    checkScrollable()
    window.addEventListener("resize", checkScrollable)

    // Event listeners para scroll
    const libroElement = libroListRef.current
    const cartasElement = cartasListRef.current
    const poesiaElement = poesiaListRef.current

    if (libroElement) {
      libroElement.addEventListener("scroll", () => handleScroll("libro", libroListRef))
    }
    if (cartasElement) {
      cartasElement.addEventListener("scroll", () => handleScroll("cartas", cartasListRef))
    }
    if (poesiaElement) {
      poesiaElement.addEventListener("scroll", () => handleScroll("poesia", poesiaListRef))
    }

    return () => {
      window.removeEventListener("resize", checkScrollable)
      if (libroElement) {
        libroElement.removeEventListener("scroll", () => handleScroll("libro", libroListRef))
      }
      if (cartasElement) {
        cartasElement.removeEventListener("scroll", () => handleScroll("cartas", cartasListRef))
      }
      if (poesiaElement) {
        poesiaElement.removeEventListener("scroll", () => handleScroll("poesia", poesiaListRef))
      }
    }
  }, [autoresDelLibroSolamente, cartasEsperanzaData, poesiaData])

  return (
    <div className="indice-container">
      <div className="indice-header">
        <EncabezadoLibro onGoToHome={onGoToHome} />
      </div>

      <div className="indice-content">
        <h2 className="indice-titulo">Índice de Autores</h2>

        <div className="secciones-container">
          {/* Sección: Los del libro */}
          <div className={`seccion-autores ${!showScrollIndicators.libro ? "no-scroll" : ""}`}>
            <h3 className="seccion-titulo">Latidos De Esperanza</h3>
            <p className="seccion-descripcion">Relatos y testimonios que forman parte de la obra principal</p>

            <div className="lista-autores" ref={libroListRef}>
              {autoresDelLibroSolamente.map((autor, index) => (
                <AutorItem
                  key={autor.id}
                  id={autor.id}
                  nombre={`${index + 1}. ${autor.nombre}`}
                  fragmento={autor.fragmento}
                  onNavigateToPage={() => {
                    console.log(`Clic en autor del libro: ${autor.nombre}, ID: ${autor.id}`)
                    irAPagina(autor.id)
                  }}
                />
              ))}
            </div>
            {/* ✅ AÑADIR: Indicador de scroll para libro */}
            {showScrollIndicators.libro && (
              <div
                className="scroll-indicator clickeable"
                onClick={() => handleTriangleClick("libro", libroListRef)}
                title={triangleDirections.libro === "down" ? "Scroll hacia abajo" : "Scroll hacia arriba"}
              >
                {triangleDirections.libro === "down" ? "▼" : "▲"}
              </div>
            )}
          </div>

          {/* Sección: Cartas de Esperanza */}
          <div className={`seccion-autores ${!showScrollIndicators.cartas ? "no-scroll" : ""}`}>
            <h3 className="seccion-titulo">Latidos Desde Gaza</h3>
            <p className="seccion-descripcion">Testimonios directos desde el corazón de la resistencia</p>

            <div className="lista-autores" ref={cartasListRef}>
              {cartasEsperanzaData.map((autor, index) => (
                <AutorItem
                  key={`carta-${autor.id}`}
                  id={autor.id}
                  nombre={`${index + 1}. ${autor.nombre}`}
                  fragmento={autor.fragmento}
                  onNavigateToPage={() => {
                    console.log(`Clic en autor de cartas: ${autor.nombre}, ID: ${autor.id}`)
                    irAPagina(autor.id)
                  }}
                />
              ))}
            </div>
            {/* ✅ AÑADIR: Indicador de scroll para cartas */}
            {showScrollIndicators.cartas && (
              <div
                className="scroll-indicator clickeable"
                onClick={() => handleTriangleClick("cartas", cartasListRef)}
                title={triangleDirections.cartas === "down" ? "Scroll hacia abajo" : "Scroll hacia arriba"}
              >
                {triangleDirections.cartas === "down" ? "▼" : "▲"}
              </div>
            )}
          </div>

          {/* Sección: Poesía */}
          <div className={`seccion-autores ${!showScrollIndicators.poesia ? "no-scroll" : ""}`}>
            <h3 className="seccion-titulo">Versos </h3>
            <p className="seccion-descripcion">Versos que trascienden fronteras y despiertan conciencias</p>

            <div className="lista-autores" ref={poesiaListRef}>
              {poesiaData.map((autor, index) => (
                <AutorItem
                  key={`poesia-${autor.id}`}
                  id={autor.id}
                  nombre={`${index + 1}. ${autor.nombre}`}
                  fragmento={autor.fragmento}
                  onNavigateToPage={() => {
                    console.log(`Clic en poeta: ${autor.nombre}, ID: ${autor.id}`)
                    irAPagina(autor.id)
                  }}
                />
              ))}
            </div>
            {/* ✅ AÑADIR: Indicador de scroll para poesía */}
            {showScrollIndicators.poesia && (
              <div
                className="scroll-indicator clickeable"
                onClick={() => handleTriangleClick("poesia", poesiaListRef)}
                title={triangleDirections.poesia === "down" ? "Scroll hacia abajo" : "Scroll hacia arriba"}
              >
                {triangleDirections.poesia === "down" ? "▼" : "▲"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}