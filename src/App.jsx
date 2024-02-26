import { useState } from "react";
import { StartScreen, PlayScreen, GameOptionsScreen } from "./Screens";

function App() {
  const [gameState, setGameState] = useState("start");
  const [gameDifficulty, setGameDifficulty] = useState('4x4')
  const [gameMode, setGameMode] = useState('normal')

  switch (gameState) {
    case "start":
      return <StartScreen start={() => setGameState("options")} />;
    case "options":
      return <GameOptionsScreen
        gameDifficulty={gameDifficulty}
        setGameDifficulty={setGameDifficulty}
        gameMode={gameMode}
        setGameMode={setGameMode} 
        home={() => setGameState("start")}
        start={() => setGameState("play")} />;
    case "play":
      return <PlayScreen 
      gameDifficulty={gameDifficulty}
      gameMode={gameMode}
      home={() => setGameState("start")}
      previous={() => setGameState('options')}
      end={() => setGameState("start")} />;
    default:
      throw new Error("Invalid game state " + gameState);
  }
}

export default App;
