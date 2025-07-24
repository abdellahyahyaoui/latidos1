"use client"
import Firma from "../components/Firma"
import "../App.css"
import "./Prologo.css"
import EncabezadoLibro from "../pages/EncabezadoLibro"

export default function Prologo({
  contenido,
  avanzarPagina,
  retrocederPagina,
  onGoToHome,
  onGoToMainIndex,
  esPrimeraPagina,
}) {
  const esUltimaPagina = contenido && contenido.some((p) => p.includes("— Abdellah"))

  const handleAvanzar = () => avanzarPagina && avanzarPagina()
  const handleRetroceder = () => retrocederPagina && retrocederPagina()

  // Frases clave para identificar las citas
  const citaLargaInicio = '"Porque los grandes cambios no siempre nacen de gobiernos'
  const citaLargaFin = 'y construyen el cambio real."'
  const citaSimple = "la causa palestina es la causa más noble de nuestra era."

  

  const transformarParrafo = (parrafo, index) => {
  const trimmed = parrafo.trim()

  // Verificar cita simple
  const esCitaSimple = trimmed.includes("la causa palestina es la causa más noble de nuestra era")
  
  // Para cita larga, verificar si estamos en medio de una cita
  const indiceFin = contenido.findIndex((p) => p.trim().endsWith(citaLargaFin))
  const indiceInicio = contenido.findIndex((p) => p.trim().startsWith(citaLargaInicio))
  
  let dentroDeCitaLarga = false
  
  if (indiceInicio !== -1 && indiceFin !== -1) {
    // Ambos están en esta página
    dentroDeCitaLarga = index >= indiceInicio && index <= indiceFin
  } else if (indiceInicio === -1 && indiceFin !== -1) {
    // Solo está el final, asumimos que empezamos en cita
    dentroDeCitaLarga = index <= indiceFin
  } else if (indiceInicio !== -1 && indiceFin === -1) {
    // Solo está el inicio, asumimos que sigue hasta el final
    dentroDeCitaLarga = index >= indiceInicio
  }

  const esCita = esCitaSimple || dentroDeCitaLarga

  if (esCita) {
    return <span className="cita-especial">{parrafo}</span>
  }

  // Resaltar palabras específicas
  const textoHTML = parrafo
    .replace(/(Palestina)/gi, '<span class="resaltar-palestina">$1</span>')
    .replace(/(latido[s]?)/gi, '<span class="resaltar-latido">$1</span>')

  return <span dangerouslySetInnerHTML={{ __html: textoHTML }} />
}

  return (
    <div className="prologo-container">
      <EncabezadoLibro onGoToHome={onGoToHome} />

      <div className="prologo-main-content">
        {esPrimeraPagina && <h2 className="titulo-prologo">Prólogo</h2>}

        <div className="cita">
          {contenido && contenido.length > 0 ? (
            contenido.map((parrafo, index) => (
              <div key={index} className="parrafo-prologo">
                {transformarParrafo(parrafo, index)}
              </div>
            ))
          ) : (
            <div>Cargando contenido...</div>
          )}
        </div>

        
      </div>

      <div className="navegacion-relato">
        <div className="boton-anterior" onClick={handleRetroceder}>
          <span className="triangulo verde">◀</span>
          <span className="texto-ant">Anterior</span>
        </div>

        {onGoToMainIndex && (
          <div
            className="boton-indice-principal"
            onClick={onGoToMainIndex}
            title="Ir al Índice Principal"
          >
            <span className="triangulo rojo">▼</span>
          </div>
        )}

        <div className="boton-siguiente" onClick={handleAvanzar}>
          <span className="texto-sig">Siguiente</span>
          <span className="triangulo rojo">▶</span>
        </div>
      </div>
    </div>
  )
}
