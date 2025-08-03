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
import ContactModal from "../components/ContactModal" // ✅ Reintroducido

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
  const [isContactModalOpen, setIsContactModalOpen] = useState(false) // ✅ Reintroducido el estado del modal

  const autores = useMemo(() => [...autoresData, ...cartasEsperanzaData, ...poesiaData], [])

  const paginatedPrologo = useMemo(() => {
    return splitPrologoIntoPages(prologoContent, 12)
  }, [])

  const paginatedAutores = useMemo(() => {
    return autores.map((autor) => {
      const paginatedContent = splitRelatoWithPartsIntoPages(autor.parts || [], 12, 10)
      return {
        ...autor,
        paginatedContent: paginatedContent,
      }
    })
  }, [autores])

  const pageMapData = useMemo(() => {
    const map = []
    let currentPageIndex = 0

    const authorIndexPageStarts = {}
    const authorStoryPageStarts = {}
    const autorPartGlobalPageStarts = {}

    map.push({ type: "portada" })
    currentPageIndex++

    paginatedPrologo.forEach((pageContent, pageIndex) => {
      map.push({ type: "prologo", pageIndex: pageIndex })
      currentPageIndex++
    })

    const mainIndexPage = currentPageIndex
    map.push({ type: "indice" })
    currentPageIndex++

    paginatedAutores.forEach((autor) => {
      authorIndexPageStarts[autor.id] = currentPageIndex
      map.push({ type: "autorIndice", autorId: autor.id })
      currentPageIndex++

      autorPartGlobalPageStarts[autor.id] = {}

      authorStoryPageStarts[autor.id] = currentPageIndex
      autor.paginatedContent.forEach((pageData, pageIndexInAutor) => {
        if (pageData.isFirstPageOfSection && pageData.sectionTitle) {
          autorPartGlobalPageStarts[autor.id][pageData.sectionTitle] = currentPageIndex
        }

        map.push({
          type: "relato",
          autorId: autor.id,
          pageIndex: pageIndexInAutor,
          sectionTitle: pageData.sectionTitle,
          isFirstPageOfSection: pageData.isFirstPageOfSection,
        })
        currentPageIndex++
      })
    })

    return { map, authorIndexPageStarts, authorStoryPageStarts, mainIndexPage, autorPartGlobalPageStarts }
  }, [paginatedPrologo, paginatedAutores])

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

  // ✅ Funciones para abrir y cerrar el modal
  const openContactModal = () => {
    setIsContactModalOpen(true)
  }
  const closeContactModal = () => {
    setIsContactModalOpen(false)
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
                <Portada
                  avanzarPagina={avanzarPagina}
                  onGoToHome={volverAlInicio}
                  openContactModal={openContactModal} 
                />
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
                  autorPartGlobalPageStarts={pageMapData.autorPartGlobalPageStarts}
                />
              </Pagina>
            )
          } else if (pageInfo.type === "relato") {
            const autor = paginatedAutores.find((a) => a.id === pageInfo.autorId)
            const pageData = autor?.paginatedContent?.[pageInfo.pageIndex]

            if (!autor || !pageData) {
              console.error("Error: Autor o datos de página no encontrados para relato", pageInfo)
              return null
            }

            const authorIndexPage = pageMapData.authorIndexPageStarts[autor.id]

            return (
              <Pagina key={index}>
                <Relato
                  autor={autor.nombre}
                  titulo={autor.titulo}
                  contenido={pageData.content}
                  sectionTitle={pageData.sectionTitle}
                  isFirstPageOfSection={pageData.isFirstPageOfSection}
                  esPrimeraPagina={pageInfo.pageIndex === 0}
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
      {isContactModalOpen && <ContactModal onClose={closeContactModal} />}{" "}
      {/* ✅ Renderiza el modal condicionalmente */}
    </div>
  )
}
