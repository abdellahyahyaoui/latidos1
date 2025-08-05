
"use client"
import EncabezadoLibro from "../pages/EncabezadoLibro"
import "./Relato.css"
import AudioPlayer from "../pages/AudioPlayer"; // Ajusta la ruta si es diferente
import VideoPlayer from "../pages/VideoPlayer";
import './VideoPlayer.css';

function esTextoArabe(texto) {
  return /[\u0600-\u06FF]/.test(texto);
}

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
  function procesarTexto(texto) {
    return texto
      // ✅ Citas entre comillas en rojo
      .replace(/"([^"]+)"/g, '<span class="cita-roja">"$1"</span>')

      // ✅ Refrán árabe (solo si ya está escrito así en el texto)
      .replace(/—\s*Refrán árabe/g, '<span class="refran-arabe">— Refrán árabe</span>')

      // ✅ Nombres propios que tú escribiste (en rojo)
      .replace(/\b(Netanyahu|Sisi|Trump|Pedro\s*Sánchez|Macron|Rufián|Abu\s*Ubaidah|Gustavo\s*Petro|Waseem\s*Hamid|Benjamin\s*Netanyahu|Abdel\s*Fattah\s*al-Sisi|Donald\s*Trump|Mohamed\s*Morsi|Yahya\s*Sinwar)\b/g,
        '<span class="nombre-rojo">$1</span>')
      .replace(/\b(Jesús|Moisés|Abraham|David|Mohamed\s*Bouazizi|Abdella\s*Yahyaoui\s*Azuz)\b/g, (match) => `<span class="nombre-profeta">${match}</span>`)
      .replace(/\b(Qur’an|Allah|Alá|Yahvé|El Profeta|Muhammad|Mohamed|Mohammed|Profeta Muhammad ﷺ)\b/g, (match) => `<span class="referencia-allah">${match}</span>`)
      .replace(/\b(Waseem\s*Hamid|Mohamed\s*Bouazizi|Abdellah\s*Yahyaoui\s*Azuz|Morsi|Yahya\s*Sinwar|Pedro\s*Sánchez|Rufián|Abu\s*Ubaidah|Al-Aqsa|Mezquita\s*de\s*Al-Aqsa|Gustavo\s*Petro|Marruecos|marroquí|Yemen|Egipto|de\s*los\s*Magribíes|Jalil\s*al-Hayya)\b/giu, (match) => `<span class="nombre-profeta">${match}</span>`)
      .replace(/\b(Waseem\s*Hamid|Mohamed\s*Bouazizi|Abdellah\s*Yahyaoui\s*Azuz|Morsi|Yahya\s*Sinwar|Pedro\s*Sánchez|Rufián|Abu\s*Ubaidah|Al-Aqsa|Mezquita\s*de\s*Al-Aqsa|mi\s*padre|mi\s*difunto\s*padre)\b/g, (match) => `<span class="nombre-profeta">${match}</span>`)
      .replace(/—\s*Abdellah\s*Yahyaoui\s*Azuz\s*—/g, (match) => `<span class="cita-autor">${match}</span>`)

      .replace(/\b(los\s+Emiratos\s+Árabes|los\s+Emiratos|Estados\s+Unidos|Europa|India|Israel)\b/g, (match) => `<span class="nombre-rojo">${match}</span>`)

      // ✅ Palabras clave (en rojo)
      .replace(/\b(Palestina)\b/g, '<span class="resaltar-palestina">$1</span>')
      .replace(/\b(latido[s]?)\b/gi, '<span class="resaltar-latido">$1</span>')
      .replace(/\b(Gaza)\b/g, '<span class="resaltar-gaza">$1</span>')

      // ✅ Ejemplos escritos literalmente en tus textos → en verde
      .replace(/Allah\s*ﷻ/g, '<span class="referencia-allah">$&</span>')
      .replace(/Muḥammad\s*ﷺ/g, '<span class="referencia-profeta">$&</span>')
      .replace(/Subḥānahu\s+wa\s+Taʿālā/g, '<span class="referencia-allah">$&</span>')
      .replace(/Profeta\s*ﷺ/g, '<span class="referencia-profeta">$&</span>')
      .replace(/—\s*Abdellah\s*Yahyaoui\s*Azuz\s*—/g, '<span class="cita-autor">$&</span>')
      .replace(/\[QURAN\](.*?)\[\/QURAN\]/g, '<span class="cita-coran">$1</span>')
  }

  return (
    <div className="relato-container">
      {/* ✅ RESTAURAR: Header original con autor en la parte superior derecha */}
      <div className="relato-header-top">
        <EncabezadoLibro onGoToHome={onGoToHome} />
        <span className="relato-autor-superior" onClick={onGoToAuthorIndex}>
          {autor}
        </span>
      </div>

      {/* Lógica para mostrar el título de la sección */}
      {sectionTitle && isFirstPageOfSection && (
        <h2 className={`relato-titulo ${esTextoArabe(sectionTitle) ? "texto-arabe" : ""}`}>
          {sectionTitle}
        </h2>
      )}

      {/* Fallback: Si no hay título de sección, muestra el título general del autor solo en la primera página del relato completo */}
      {!sectionTitle && esPrimeraPagina && (
        <h2 className={`relato-titulo ${esTextoArabe(titulo) ? "texto-arabe" : ""}`}>
          {titulo}
        </h2>
      )}

      <div className="relato-content">
        {contenido.map((parrafo, index) => (
          <div
            key={index}
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
          {/* <span className="triangulo verde">◀</span> */}
          <span className="texto-ant">Anterior</span>
        </div>

        <div className="boton-indice-principal" onClick={onGoToMainIndex} title="Ir al Índice Principal">
          <span className="triangulo rojo">▼</span>
        </div>

        <div className="boton-siguiente" onClick={avanzarPagina}>
          <span className="texto-sig">Siguiente</span>
          {/* <span className="triangulo rojo">▶</span> */}
        </div>
      </div>
    </div>
  )
}
