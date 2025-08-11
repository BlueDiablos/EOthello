import "./App.css";
import Board from "./components/App/Board";
import Header from "./components/App/Header";

function App() {
  return (
    <>
      <Header />
      <Board
        Players={[
          { number: 1, colorPiece: "black", goesFirst: true },
          { number: 2, colorPiece: "white", goesFirst: false },
        ]}
        Rows={8}
        Columns={8}
      />
    </>
  );
}

export default App;
