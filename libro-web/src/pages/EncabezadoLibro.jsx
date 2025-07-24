import "./EncabezadoLibro.css"
import Corazon from "../components/Corazon"

// ✅ Añadido onGoToHome como prop
export default function EncabezadoLibro({ onGoToHome }) {
  return (
    <div className="encabezado-libro">
      {/* ✅ Pasado onGoToHome al Corazon */}
      <Corazon clickable onGoToHome={onGoToHome} />
      <h1>
        <span className="rojo">Latidos</span> <span className="negro">De</span> <span className="verde">Esperanza</span>
      </h1>
    </div>
  )
}
