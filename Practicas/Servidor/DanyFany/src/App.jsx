import './App.css'

function App() {
  const hora = new Date().getHours();
  let saludo;

  // Lógica de tiempo
  if (hora >= 6 && hora < 12) {
    saludo = "buenos días";
  } else if (hora >= 12 && hora < 20) {
    saludo = "buenas tardes";
  } else {
    saludo = "buenas noches";
  }

  return (
    <div className="container">
      <h1>Daniela Stefany Sanchez Ayala</h1>
      <p>Hola, {saludo}</p>
    </div>
  )
}

export default App
