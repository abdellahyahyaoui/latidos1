"use client"
import TituloPrincipal from "../components/TituloPrincipal"
import Firma from "../components/Firma"
import ContactButton from "../components/ContactButton" // ✅ Reintroducido
import corazon from "../assets/corazon.png"

export default function Portada({ avanzarPagina, onGoToHome, openContactModal }) {
  return (
    <div className="container">
      {/* ELIMINADO: SocialIconsHeader ya no va aquí */}

      <div
        style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TituloPrincipal />
        <img src={corazon || "/placeholder.svg"} alt="Corazón central" className="corazon" />
        <p className="autor">
          Dirigido por <Firma />
        </p>
        <ContactButton openContactModal={openContactModal} /> {/* ✅ Reintroducido el botón de contacto */}
      </div>

      <div className="navegacion-relato" style={{ justifyContent: "flex-end" }}>
        <div className="boton-siguiente" onClick={avanzarPagina}>
          <span className="texto-sig">Siguiente</span>
          <span className="triangulo rojo">▶</span>
        </div>
      </div>
    </div>
  )
}
