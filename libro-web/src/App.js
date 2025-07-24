// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Portada from './pages/Portada';
// import Preambulo from './pages/Preambulo';
// import Indice from './pages/Indice';
// import Parte1 from './pages/Parte1';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Portada />} />
//         <Route path="/preambulo" element={<Preambulo />} />
//         <Route path="/indice" element={<Indice />} />
//         <Route path="/parte1" element={<Parte1 />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Libro from './pages/Libro';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Libro />} />
      </Routes>
    </Router>
  );
}

export default App;

