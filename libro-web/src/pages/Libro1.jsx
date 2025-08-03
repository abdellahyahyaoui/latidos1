"use client"

import React, { useRef, useState, useEffect, useMemo } from "react"
import HTMLFlipBook from "react-pageflip"
import Portada from "./Portada"
import Prologo from "./Prologo"
import Indice from "./Indice"
import Relato from "./Relato"
import AutorIndice from "../components/AutorIndice"
import { splitPrologoIntoPages, splitRelatoWithPartsIntoPages } from "./utils/splitContentIntoPages"
import "./Libro.css"
import autoresData from "../data/autores.json"
import cartasEsperanzaData from "../data/cartas-esperanza.json"
import poesiaData from "../data/poesia.json"
import { prologoContent } from "./utils/prologo"

const Pagina = React.forwardRef(({ children }, ref) => (
  <div className="pagina-libro" ref={ref}>
    {children}
  </div>
))

export default function Libro() {
  const bookRef = useRef()
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1000,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  })
  const [isMobile, setIsMobile] = useState(false)

  // Incluir todos los autores (libro + cartas + poesía)
  const autores = [...autoresData, ...cartasEsperanzaData, ...poesiaData]

  // ✅ UNIFICAR PARÁMETROS: Usar los mismos parámetros del prólogo para todos
  const paginatedPrologo = useMemo(() => {
    return splitPrologoIntoPages(prologoContent, 12)
  }, [])

  const paginatedAutores = useMemo(() => {
    return autores.map((autor) => {
      // ✅ USAR LOS MISMOS PARÁMETROS PARA TODOS (como el prólogo)
      const paginatedContent = splitRelatoWithPartsIntoPages(autor.parts, 12, 10)
      return {
        ...autor,
        paginatedContent: paginatedContent,
      }
    })
  }, [])

  const pageMapData = useMemo(() => {
    const map = []
    let currentPageIndex = 0

    // Mapas para navegación
    const authorIndexPageStarts = {} // { autorId: globalPageIndex }
    const authorStoryPageStarts = {} // { autorId: globalPageIndex de la primera página del relato }
    const autorPartGlobalPageStarts = {} // { autorId: { "Titulo de la Parte": globalPageIndex } }

    // 0: Portada
    map.push({ type: "portada" })
    currentPageIndex++

    // 1-N: Páginas del prólogo
    paginatedPrologo.forEach((pageContent, pageIndex) => {
      map.push({ type: "prologo", pageIndex: pageIndex })
      currentPageIndex++
    })

    // Índice principal
    const mainIndexPage = currentPageIndex
    map.push({ type: "indice" })
    currentPageIndex++

    // Páginas de índice de autor y páginas de relato
    paginatedAutores.forEach((autor) => {
      // Página de índice del autor
      authorIndexPageStarts[autor.id] = currentPageIndex
      map.push({ type: "autorIndice", autorId: autor.id })
      currentPageIndex++

      // Inicializar el mapa de partes para este autor
      autorPartGlobalPageStarts[autor.id] = {}

      // Páginas del relato del autor
      authorStoryPageStarts[autor.id] = currentPageIndex // Guarda el inicio del relato completo del autor
      autor.paginatedContent.forEach((pageData, pageIndexInAutor) => {
        // Si es la primera página de una nueva sección (part), guarda su índice global
        if (pageData.isFirstPageOfSection && pageData.sectionTitle) {
          autorPartGlobalPageStarts[autor.id][pageData.sectionTitle] = currentPageIndex
        }

        map.push({
          type: "relato",
          autorId: autor.id,
          pageIndex: pageIndexInAutor, // Índice dentro del paginatedContent del autor
          sectionTitle: pageData.sectionTitle,
          isFirstPageOfSection: pageData.isFirstPageOfSection,
        })
        currentPageIndex++
      })
    })

    return { map, authorIndexPageStarts, authorStoryPageStarts, mainIndexPage, autorPartGlobalPageStarts }
  }, [paginatedPrologo])

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth
      const newHeight = window.innerHeight
      setWindowDimensions({
        width: newWidth,
        height: newHeight,
      })
      setIsMobile(newWidth <= 768)
    }

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize)
      handleResize()
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  const avanzarPagina = () => {
    const flip = bookRef.current.pageFlip()
    flip.flipNext()
  }

  const retrocederConAnimacion = () => {
    const flip = bookRef.current.pageFlip()
    if (flip.getCurrentPageIndex() > 0) {
      flip.flipPrev()
    }
  }

  const volverAlInicio = () => {
    const flip = bookRef.current.pageFlip()
    flip.turnToPage(0)
  }

  const irAPagina = (pageIndex) => {
    const flip = bookRef.current.pageFlip()
    flip.turnToPage(pageIndex)
  }

  return (
    <div className="contenedor-libro">
      <HTMLFlipBook
        ref={bookRef}
        width={windowDimensions.width}
        height={isMobile ? "auto" : windowDimensions.height}
        size="stretch"
        minWidth={windowDimensions.width}
        maxWidth={windowDimensions.width}
        minHeight={isMobile ? 0 : windowDimensions.height}
        maxHeight={isMobile ? "auto" : windowDimensions.height}
        showCover={false}
        mobileScrollSupport={true}
        usePortrait={true}
        singlePage={true}
        className="libro-pantalla-completa"
        useMouseEvents={false}
      >
        {pageMapData.map.map((pageInfo, index) => {
          if (pageInfo.type === "portada") {
            return (
              <Pagina key={index}>
                <Portada avanzarPagina={avanzarPagina} onGoToHome={volverAlInicio} />
              </Pagina>
            )
          } else if (pageInfo.type === "prologo") {
            const contentForPage = paginatedPrologo[pageInfo.pageIndex]
            const esPrimeraPagina = pageInfo.pageIndex === 0
            return (
              <Pagina key={index}>
                <Prologo
                  contenido={contentForPage}
                  avanzarPagina={avanzarPagina}
                  retrocederPagina={retrocederConAnimacion}
                  onGoToHome={volverAlInicio}
                  onGoToMainIndex={() => irAPagina(pageMapData.mainIndexPage)}
                  esPrimeraPagina={esPrimeraPagina}
                />
              </Pagina>
            )
          } else if (pageInfo.type === "indice") {
            return (
              <Pagina key={index}>
                <Indice
                  autores={paginatedAutores}
                  onGoToHome={volverAlInicio}
                  irAPagina={(autorId) => irAPagina(pageMapData.authorIndexPageStarts[autorId])}
                />
              </Pagina>
            )
          } else if (pageInfo.type === "autorIndice") {
            const autor = paginatedAutores.find((a) => a.id === pageInfo.autorId)
            return (
              <Pagina key={index}>
                <AutorIndice
                  autor={autor}
                  irAPagina={irAPagina}
                  onGoToHome={volverAlInicio}
                  // Pasar el mapa de inicio de páginas de las partes de este autor
                  autorPartGlobalPageStarts={pageMapData.autorPartGlobalPageStarts}
                />
              </Pagina>
            )
          } else if (pageInfo.type === "relato") {
            const autor = paginatedAutores.find((a) => a.id === pageInfo.autorId)
            const pageData = autor.paginatedContent[pageInfo.pageIndex]
            const authorIndexPage = pageMapData.authorIndexPageStarts[autor.id]

            return (
              <Pagina key={index}>
                <Relato
                  autor={autor.nombre}
                  titulo={autor.titulo} // Título general del autor
                  contenido={pageData.content}
                  sectionTitle={pageData.sectionTitle} // Título de la sección actual
                  isFirstPageOfSection={pageData.isFirstPageOfSection} // Si es la primera página de la sección
                  esPrimeraPagina={pageInfo.pageIndex === 0} // Si es la primera página del relato completo del autor
                  avanzarPagina={avanzarPagina}
                  retrocederPagina={retrocederConAnimacion}
                  onGoToHome={volverAlInicio}
                  onGoToAuthorIndex={() => irAPagina(authorIndexPage)}
                  onGoToMainIndex={() => irAPagina(pageMapData.mainIndexPage)}
                />
              </Pagina>
            )
          }
          return null
        })}
      </HTMLFlipBook>
    </div>
  )
}
