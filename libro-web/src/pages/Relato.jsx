"use client"
import EncabezadoLibro from "../pages/EncabezadoLibro"
import "./Relato.css"
import VideoPlayer from "../pages/VideoPlayer"
import "./VideoPlayer.css"
import AudioPlayer from "../pages/AudioPlayer";

function esTextoArabe(texto) {
  return typeof texto === "string" && /[\u0600-\u06FF]/.test(texto)
}

export default function Relato(props) {
  const {
    autor,
    titulo,
    contenido,
    avanzarPagina,
    retrocederPagina,
    onGoToHome,
    onGoToAuthorIndex,
    onGoToMainIndex,
    esPrimeraPagina,
    sectionTitle,
    isFirstPageOfSection,
  } = props

  function procesarTexto(texto) {
    if (typeof texto !== "string") return ""

    return (
      texto
        // ✅ Citas entre comillas en rojo
        .replace(/"([^"]+)"/g, '<span class="cita-roja">"$1"</span>')

        // ✅ Refrán árabe (solo si ya está escrito así en el texto)
        .replace(/—\s*Refrán árabe/g, '<span class="refran-arabe">— Refrán árabe</span>')

        // ✅ Nombres propios en rojo (políticos/entidades)
        .replace(
          /\b(Netanyahu|Sisi|Trump|Pedro\s*Sánchez|Macron|Rufián|Abu\s*Ubaidah|Gustavo\s*Petro|Waseem\s*Hamid|Benjamin\s*Netanyahu|Abdel\s*Fattah\s*al-Sisi|Donald\s*Trump|Mohamed\s*Morsi|Yahya\s*Sinwar)\b/giu,
          '<span class="nombre-rojo">$1</span>',
        )
        .replace(
          /\b(los\s+Emiratos\s+Árabes|los\s+Emiratos|Estados\s+Unidos|Europa|India|Israel)\b/giu,
          '<span class="nombre-rojo">$1</span>',
        )

        // ✅ Nombres y referencias en verde
        .replace(
          /\b(Jesús|Moisés|Abraham|David|Mohamed\s*Bouazizi|Abdellah\s*Yahyaoui\s*Azuz)\b/giu,
          (match) => `<span class="nombre-profeta">${match}</span>`,
        )
        .replace(
          /\b(Waseem\s*Hamid|Mohamed\s*Bouazizi|Abdellah\s*Yahyaoui\s*Azuz|Morsi|Yahya\s*Sinwar|Abu\s*Ubaidah|Al-Aqsa|Mezquita\s*de\s*Al-Aqsa|Gustavo\s*Petro|Marruecos|marroquí|Yemen|Egipto|de\s*los\s*Magribíes|Jalil\s*al-Hayya)\b/giu,
          (match) => `<span class="nombre-profeta">${match}</span>`,
        )
        // 👉 Añadido: Mahmoud y Amira en verde (incluye "Mahmoud Al Amoudi")
        .replace(/\b(Mahmoud\s+Al[-\s]*Amoudi|Mahmoud|Amira)\b/giu, '<span class="nombre-profeta">$1</span>')

        // ✅ Palabras clave
        .replace(/\b(Palestina)\b/giu, '<span class="resaltar-palestina">$1</span>')
        .replace(/\b(latido[s]?)\b/giu, '<span class="resaltar-latido">$1</span>')
        .replace(/\b(Gaza)\b/giu, '<span class="resaltar-gaza">$1</span>')

        // ✅ Ejemplos literales religiosos en verde
        .replace(/Allah\s*ﷻ/giu, '<span class="referencia-allah">$&</span>')
        .replace(/Muḥammad\s*ﷺ/giu, '<span class="referencia-profeta">$&</span>')
        .replace(/Subḥānahu\s+wa\s+Taʿālā/giu, '<span class="referencia-allah">$&</span>')
        .replace(/Profeta\s*ﷺ/giu, '<span class="referencia-profeta">$&</span>')
        .replace(/—\s*Abdellah\s*Yahyaoui\s*Azuz\s*—/giu, '<span class="cita-autor">$&</span>')
        .replace(/\[QURAN\](.*?)\[\/QURAN\]/giu, '<span class="cita-coran">$1</span>')
    )
  }

  // 👇 APLANA si viene [[...]]
  const contenidoPlano = Array.isArray(contenido) && Array.isArray(contenido[0]) ? contenido.flat() : contenido

  const esEspecial = contenidoPlano?.[0]?.tipo !== undefined

  const renderEspecial = (page) => {
    if (!page) return null

    switch (page.tipo) {
      case "texto":
        return (page.content || []).map((parrafo, i) => (
          <div
            key={i}
            className={`parrafo-relato ${esTextoArabe(parrafo) ? "texto-arabe" : ""}`}
            dangerouslySetInnerHTML={{ __html: procesarTexto(parrafo) }}
          />
        ))

      case "videoTexto": {
        const paragraphs = Array.isArray(page.texto) ? page.texto : [page.texto].filter(Boolean)

        // Si NO hay vídeo, renderiza solo texto a ancho completo
        if (!page.video) {
          return paragraphs.map((parrafo, i) => (
            <div
              key={i}
              className={"parrafo-relato " + (esTextoArabe(parrafo) ? "texto-arabe" : "")}
              dangerouslySetInnerHTML={{ __html: procesarTexto(parrafo) }}
            />
          ))
        }

        // Si hay vídeo, layout a dos columnas con todos los párrafos del chunk
        return (
          <div className="especial-video-texto">
            <div className="video-col especial-media-box">
              <VideoPlayer src={page.video} title="" />
            </div>
            <div className="texto-col">
              {paragraphs.map((parrafo, i) => (
                <div
                  key={i}
                  className={"parrafo-relato " + (esTextoArabe(parrafo) ? "texto-arabe" : "")}
                  dangerouslySetInnerHTML={{ __html: procesarTexto(parrafo) }}
                />
              ))}
            </div>
          </div>
        )
      }

      case "dobleTexto": {
        const arrArabe = Array.isArray(page.arabe) ? page.arabe : [page.arabe].filter(Boolean)
        const arrEspanol = Array.isArray(page.espanol) ? page.espanol : [page.espanol].filter(Boolean)
        const len = Math.max(arrArabe.length, arrEspanol.length)
        const safeArabe = Array.from({ length: len }, (_, i) => arrArabe[i] || "")
        const safeEspanol = Array.from({ length: len }, (_, i) => arrEspanol[i] || "")

        return (
          <div className="especial-doble-texto">
            <div className="col-arabe texto-arabe">
              {safeArabe.map((txt, i) => (
                <div
                  key={i}
                  className="parrafo-relato texto-arabe"
                  dangerouslySetInnerHTML={{ __html: procesarTexto(txt) }}
                />
              ))}
            </div>
            <div className="col-espanol">
              {safeEspanol.map((txt, i) => (
                <div key={i} className="parrafo-relato" dangerouslySetInnerHTML={{ __html: procesarTexto(txt) }} />
              ))}
            </div>
          </div>
        )
      }

      case "imagen":
  return (
    <div className="cuadro-imagen-final">
      <img
        src={page.src || "/placeholder.svg?height=600&width=800&query=imagen%20de%20capitulo"}
        alt={page.alt || "imagen"}
      />
    </div>
  );

      default:
        return null
    }
  }

  return (
    <div className="relato-container">
      <div className="relato-header-top">
        <EncabezadoLibro onGoToHome={onGoToHome} />
        <span className="relato-autor-superior" onClick={onGoToAuthorIndex}>
          {autor}
        </span>
      </div>

      {sectionTitle && isFirstPageOfSection && (
        <h2 className={`relato-titulo ${esTextoArabe(sectionTitle) ? "texto-arabe" : ""}`}>{sectionTitle}</h2>
      )}
      {!sectionTitle && esPrimeraPagina && (
        <h2 className={`relato-titulo ${esTextoArabe(titulo) ? "texto-arabe" : ""}`}>{titulo}</h2>
      )}

      <div className="relato-content">
        {esEspecial
          ? renderEspecial(contenidoPlano[0]) // en especiales, contenido es [page]
          : (contenidoPlano || []).map((parrafo, i) => (
              <div
                key={i}
                className={`parrafo-relato ${esTextoArabe(parrafo) ? "texto-arabe" : ""}`}
                dangerouslySetInnerHTML={{ __html: procesarTexto(parrafo) }}
              />
            ))}
            
                    {/* ✅ MOVER: Reproductor de audio integrado en el contenido */}
                    {sectionTitle === "¡Jatofin! " && autor === "Abdellah Yahyaoui Azuz" && (
                      <AudioPlayer title="Road to gaza por Adam y.c" src="/audio/Voice-to-gaza.mp3" />
                    )}
                    {autor === "Abdul Razzaq Al-Majdalawi" &&
                      isFirstPageOfSection &&
                      (sectionTitle === "Oh Diyaa… cuentale al Mensajero de Allah" ||
                        sectionTitle === "يا ضياء... أخبر رسول الله.") && (
                        <AudioPlayer title="Oh Diyaa… Intro por Abdulrazzaq" src="/audio/abdulrazzaq.mp3" />
                      )}
                      
            
            
            
            {autor === "Khaled Abu Huwaishel" &&
            isFirstPageOfSection &&
            sectionTitle.includes("Ayuda Española") && (
              <VideoPlayer
                title=""
                src="/videos/ayuda-espana.mp4"
              />
              
              
            )}
            
            {autor === "Khaled Abu Huwaishel" &&
             isFirstPageOfSection &&
             sectionTitle === "مساعدات إسبانية: عارٌ يسقط على غزة" && (
              <VideoPlayer
                title=""
                src="/videos/ayuda-espana.mp4"
              />
              )}
      </div>
      

      <div className="navegacion-relato">
        <div className="boton-anterior" onClick={retrocederPagina}>
          <span className="texto-ant">Anterior</span>
        </div>
        <div className="boton-indice-principal" onClick={onGoToMainIndex} title="Ir al Índice Principal">
          <span className="triangulo rojo">▼</span>
        </div>
        <div className="boton-siguiente" onClick={avanzarPagina}>
          <span className="texto-sig">Siguiente</span>
        </div>
      </div>
    </div>
  )
}
