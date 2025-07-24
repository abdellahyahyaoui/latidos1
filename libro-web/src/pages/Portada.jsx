// "use client"
// import Corazon from "../components/Corazon"
// import TituloPrincipal from "../components/TituloPrincipal"
// import Firma from "../components/Firma"
// import corazon from "../assets/corazon.png"
// import "../App.css"

// // ✅ Añadido onGoToHome como prop
// export default function Portada({ avanzarPagina, onGoToHome }) {
//   return (
//     <div className="container">
//       {/* ✅ Pasado onGoToHome al Corazon */}
//       {/* <Corazon clickable onGoToHome={onGoToHome} /> */}
//       <TituloPrincipal />
//       <img src={corazon || "/placeholder.svg"} alt="Corazón central" className="corazon" />
//       <p className="autor">
//         Dirigido por <Firma />
//       </p>

//       <div className="boton-siguiente" onClick={avanzarPagina}>
//         <span className="texto-sig">Siguiente</span>
//         <span className="triangulo rojo">▶</span>
//       </div>
//     </div>
//   )
// }
"use client"
import TituloPrincipal from "../components/TituloPrincipal"
import Firma from "../components/Firma"
import corazon from "../assets/corazon.png"
// import "../App.scss" // Importar App.css para los estilos de navegación
import EncabezadoLibro from "./EncabezadoLibro"

export default function Portada({ avanzarPagina, onGoToHome }) {
  return (
    <div className="container">
      {" "}
      {/* .container ahora es flex column */}
      {/* <EncabezadoLibro onGoToHome={onGoToHome} /> */}
      {/* Contenido principal de la portada, que crecerá para empujar la navegación */}
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
      </div>
      {/* Contenedor de navegación para Portada */}
      <div className="navegacion-relato" style={{ justifyContent: "flex-end" }}>
        <div className="boton-siguiente" onClick={avanzarPagina}>
          <span className="texto-sig">Siguiente</span>
          <span className="triangulo rojo">▶</span>
        </div>
      </div>
    </div>
  )
}
