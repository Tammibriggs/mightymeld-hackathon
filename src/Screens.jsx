import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import * as icons from "react-icons/gi";
import { Tile } from "./Tile";
import { TbCardsFilled } from "react-icons/tb";
import { MdHome } from "react-icons/md";
import { TiArrowBack } from "react-icons/ti";
import { IoIosRefresh } from "react-icons/io";

export const possibleTileContents = [
  icons.GiHearts,
  icons.GiWaterDrop,
  icons.GiDiceSixFacesFive,
  icons.GiUmbrella,
  icons.GiCube,
  icons.GiBeachBall,
  icons.GiDragonfly,
  icons.GiHummingbird,
  icons.GiFlowerEmblem,
  icons.GiOpenBook,
  icons.GiAmericanFootballHelmet,
  icons.Gi3DGlasses,
  icons.GiAbstract042,
  icons.GiAfrica,
  icons.GiAcorn,
  icons.GiAges,
  icons.GiAirplane,
  icons.GiAnchor,
];

export function StartScreen({ start }) {
  return (
    <div className="text-center text-pink-500 flex flex-col gap-7 rounded-md bg-pink-50 w-80 py-24">
      <h1 className="font-bold text-4xl">Memory</h1>
      <p>Flip over tiles looking for pairs</p>
      <button
        onClick={start}
        className="bg-gradient-to-b from-pink-400 to-pink-600 active:from-pink-500 active:to-pink-600 text-xl text-white rounded-full mt-7 px-10 py-1 mx-auto"
      >
        Play
      </button>
    </div>
  );
}

export function PlayScreen({ home, previous, gameMode, gameDifficulty }) {
  const targetTries = useRef();

  const [tiles, setTiles] = useState(null);
  const [tryCount, setTryCount] = useState(0);
  const [gameResult, setGameResult] = useState("");

  useEffect(() => {
    if (gameMode === "limited_tries") {
      if (gameDifficulty === "4x4") {
        const triesRange = [5, 16, 17, 18, 19, 20];
        const randomValue = triesRange[Math.floor(Math.random() * triesRange.length)];
        setTryCount(randomValue);
        targetTries.current = randomValue;
      }
      if (gameDifficulty === "6x6") {
        const triesRange = [25, 26, 27, 28, 29, 30];
        const randomValue = triesRange[Math.floor(Math.random() * triesRange.length)];
        setTryCount(randomValue);
        targetTries.current = randomValue;
      }
    }
  }, []);

  const getTiles = (tryAgain = false) => {
    let tileCount;
    if (gameDifficulty === "4x4") tileCount = 16;
    if (gameDifficulty === "6x6") tileCount = 36;

    // Throw error if count is not even.
    if (tileCount % 2 !== 0) {
      throw new Error("The number of tiles must be even.");
    }

    // Use the existing list if it exists.
    if (tiles && !tryAgain) return tiles;

    const pairCount = tileCount / 2;

    // Take only the items we need from the list of possibilities.
    const usedTileContents = possibleTileContents.slice(0, pairCount);

    // Double the array and shuffle it.
    const shuffledContents = usedTileContents
      .concat(usedTileContents)
      .sort(() => Math.random() - 0.5)
      .map((content) => ({ content, state: "start", clicked: false }));

    setTiles(shuffledContents);
    return shuffledContents;
  };

  const flip = (i) => {
    // Is the tile already flipped? We don’t allow flipping it back.
    if (tiles[i].state === "flipped") return;

    // How many tiles are currently flipped?
    const flippedTiles = tiles.filter((tile) => tile.state === "flipped");
    const flippedCount = flippedTiles.length;

    // Don't allow more than 2 tiles to be flipped at once.
    if (flippedCount === 2) return;

    // On the second flip, check if the tiles match.
    if (flippedCount === 1) {
      let newCount;
      if (gameMode === "limited_tries") newCount = tryCount - 1;
      else newCount = tryCount + 1;
      setTryCount(newCount);

      const alreadyFlippedTile = flippedTiles[0];
      const justFlippedTile = tiles[i];

      let newState = "start";

      if (alreadyFlippedTile.content === justFlippedTile.content) {
        confetti({
          ticks: 100,
        });
        newState = "matched";
      }

      // After a delay, either flip the tiles back or mark them as matched.
      setTimeout(() => {
        setTiles((prevTiles) => {
          const newTiles = prevTiles.map((tile) => ({
            ...tile,
            state: tile.state === "flipped" ? newState : tile.state,
          }));

          const allIsMatched = newTiles.every(
            (tile) => tile.state === "matched"
          );

          // If all tiles are matched, the game is over.
          if (allIsMatched && gameMode === "normal") setGameResult('completed');
          if (gameMode === "limited_tries") {
            if (allIsMatched) setGameResult('won');
            else if (newCount === 0) setGameResult('lost')
          }

          return newTiles;
        });
      }, 1000);
    }

    setTiles((prevTiles) => {
      return prevTiles.map((tile, index) => ({
        ...tile,
        state: i === index ? "flipped" : tile.state,
        clicked: i === index ? true : tile.clicked
      }));
    });
  };

  const tryAgain = () => {
    setGameResult("");
    if (gameMode === "limited_tries") setTryCount(targetTries.current);
    else setTryCount(0);
    getTiles(true);
  };

  const getGameResult = () => {
    switch (gameResult) {
      case "won":
        return "YOU WON!";
      case "lost":
        return "YOU LOST!";
      default:
        return "WELL DONE!";
    }
  };

  const getGameScore = () => {
    switch (gameResult) {
      case "won":
        return (
          <>
            Target Tries: {targetTries.current}
            <br />
            Tries: {targetTries.current - tryCount}
          </>
        );
      case "lost":
        return (
          <>
            Target Tries: {targetTries.current}
            <br />
            Remaining Tiles: {tiles?.filter((tile) => tile.state !== "matched")?.length}
          </>
        );
      default:
        return <>Tries: {tryCount}</>;
    }
  };

  return (
    <div>
      <div>
        <div className="flex gap-2 justify-center mb-10 text-indigo-500">
          <span>Tries</span>
          <span className="bg-indigo-200 px-2 rounded-md">{tryCount}</span>
        </div>
        <div
          className={`flex flex-wrap bg-indigo-50 rounded-md w-80 justify-center ${
            gameDifficulty === "6x6" ? "gap-2 p-2" : "gap-3 p-3"
          }`}
        >
          {getTiles().map((tile, i) => (
            <div
              key={i}
              className={`flex ${
                gameDifficulty === "6x6" ? "basis-[42px] h-14" : "basis-16 h-16"
              }`}
            >
              <Tile flip={() => flip(i)} {...tile} />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5 flex gap-2">
        <button
          onClick={previous}
          className="mt-5 cursor-pointer border border-amber-500 border-solid rounded-md text-amber-500"
        >
          <TiArrowBack size={30} />
        </button>
        <button
          onClick={home}
          className="mt-5 cursor-pointer border border-amber-500 border-solid rounded-md text-amber-500"
        >
          <MdHome size={30} />
        </button>
      </div>

      {!!gameResult && (
        <div className="absolute top-0 bottom-0 left-0 right-0 bg-slate-500 bg-opacity-50 flex items-center justify-center">
          <div className="w-48 bg-gradient-to-b from-amber-500 to-pink-400 rounded-xl flex flex-col gap-5 p-3">
            <h2 className={"font-bold text-2xl text-white mx-auto"}>
              {getGameResult()}
            </h2>
            <div className="text-white text-lg text-center">
              {getGameScore()}
            </div>
            <div className="flex gap-2 justify-center">
              <button
                onClick={tryAgain}
                className="cursor-pointer rounded-md text-amber-500 bg-amber-500 p-1"
              >
                <IoIosRefresh size={30} className="text-white" />
              </button>
              <button
                onClick={home}
                className="cursor-pointer rounded-md text-amber-500 bg-amber-500 p-1"
              >
                <MdHome size={30} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export const GameOptionsScreen = ({
  gameDifficulty,
  setGameDifficulty,
  gameMode,
  setGameMode,
  start,
  home,
}) => {
  return (
    <div>
      <div className="flex gap-7 flex-col bg-slate-200 p-5 rounded-md text-slate-800">
        <h1 className="font-bold text-4xl">Game Options</h1>
        <div>
          <h3 className="font-medium mb-1">Game Difficulty</h3>
          <div className="flex gap-2">
            <div
              onClick={() => setGameDifficulty("4x4")}
              className={`flex gap-2 shadow-md rounded-xl items-center p-2 cursor-pointer ${
                gameDifficulty === "4x4" ? "bg-amber-500 text-white" : ""
              }`}
            >
              <TbCardsFilled size={30} className="text-indigo-500" />
              <span className="text-lg font-medium">4x4</span>
            </div>
            <div
              onClick={() => setGameDifficulty("6x6")}
              className={`flex gap-2 shadow-md rounded-xl items-center p-2 cursor-pointer ${
                gameDifficulty === "6x6" ? "bg-amber-500 text-white" : ""
              }`}
            >
              <TbCardsFilled size={30} className="text-indigo-500" />
              <span className="text-lg font-medium">6x6</span>
            </div>
          </div>
        </div>

        <div className="">
          <h3 className="font-medium mb-1">Game Modes</h3>
          <label htmlFor="normal" className="flex gap-1 w-fit text-sm">
            <input
              type="radio"
              id="normal"
              value={gameMode}
              checked={gameMode === "normal"}
              onChange={() => setGameMode("normal")}
              className="w-4"
            />
            Normal
          </label>
          <label htmlFor="limited_tries" className="flex gap-1 text-sm mt-2">
            <input
              type="radio"
              id="limited_tries"
              className="w-4"
              value={gameMode}
              checked={gameMode === "limited_tries"}
              onChange={() => setGameMode("limited_tries")}
            />
            Limited Tries
          </label>
        </div>
        <button
          onClick={start}
          className="rounded-full py-1 px-5 text-xl text-white bg-gradient-to-b from-amber-400 to-amber-600 w-fit ml-auto"
        >
          Start
        </button>
      </div>
      <button
        onClick={home}
        className="mt-5 cursor-pointer border border-amber-500 border-solid rounded-md text-amber-500"
      >
        <MdHome size={30} />
      </button>
    </div>
  );
};
