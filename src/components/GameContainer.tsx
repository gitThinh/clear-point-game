import { useEffect, useState } from "react";
import { Circle, CIRCLE_SIZE } from "../models/circle";
import RenderCircle from "./RenderCircle";

const GameContainer = () => {
  const [gameState, setGameState] = useState<"playing" | "lose" | "win" | "ready">("ready");
  const [time, setTime] = useState<number>(0);
  const [circlesCount, setCirclesCount] = useState(3);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [nextExpectedId, setNextExpectedId] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [message, setMessage] = useState("");

  const generatePoint = () => {
    const circleCount = circlesCount;
    const generatedCircles: Circle[] = [];
  
    for (let i = 1; i <= circleCount; i++) {
      let position: Circle;
      let overlapping: boolean;
      do {
        overlapping = false;
        position = {
          id: i,
          x: Math.random() * (450 - CIRCLE_SIZE), // 450 is width of container render point
          y: Math.random() * (450 - CIRCLE_SIZE)
        };
  
        // over stack checking
        for (let j = 0; j < generatedCircles.length; j++) {
          const otherCircle = generatedCircles[j];
          if (position.x === otherCircle.x && position.y === otherCircle.y) {
            overlapping = true;
            break;
          }
        }
      } while (overlapping);
  
      generatedCircles.push(position);
    }
  
    setCircles(generatedCircles);
  };

  useEffect(() => {
      let interval: NodeJS.Timeout | undefined;
      
      if (isPlaying) {
        interval = setInterval(() => {
          setTime(prevTime => prevTime + 0.1);
        }, 100);
      }
    
      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }, [isPlaying]);

  const handleCircleClick = (id: number) => {
    if (!isPlaying) return false;

    if (id !== nextExpectedId) {
      setIsPlaying(false);
      setGameState("lose")
      return false;
    }
    setNextExpectedId((prev) => prev + 1);

    setTimeout(() => {
      setCircles((prevCircles) => {
        
        return prevCircles.filter(circle => circle.id !== id)
      });
    }, 1000);
    return true;
  };

  useEffect(() => {
    if (circles.length === 0 && circlesCount !== 0) {
      setIsPlaying(false)
      setGameState("win")
    }
  }, [circles]);

  const handlePlay = () => {
    if (circlesCount === 0) {
      setIsPlaying(false);
      generatePoint();
      setTime(0);
      setMessage("The points must be greater than 0.")
      return;
    }
    setNextExpectedId(1);
    setMessage("")
    setGameState("playing")
    generatePoint();
    setIsPlaying(true);
    setTime(0);
  };

  const renderTilte = () => {
    switch (gameState) {
      case "win": 
        return <h1 className="text-3xl font-bold mb-4 text-green-500">ALL CLEARED</h1>

      case "lose": 
        return <h1 className="text-3xl font-bold mb-4 text-red-500">GAME OVER</h1>
      
      default: 
        return <h1 className="text-3xl font-bold mb-4">LET'S PLAY</h1>
    }
  };

  return (
    <div className="flex flex-col p-10 mt-12 w-max text-left bg-white text-neutral-900">
      {renderTilte()}
      <div className="text-lg mb-2 flex flex-row gap-5">
        <p>Point:</p>
        <input className="border rounded-md pl-1" value={circlesCount} type="text" onChange={(e) => setCirclesCount(Number(e.target.value) || 0)} />
      </div>
      {message && <p className="text-sm text-red-600">{message}</p>}
      <div className="text-lg mb-4 flex flex-row gap-5">
        <p>Time:</p>
        <p>{time.toFixed(1)}s</p>
      </div>
      <button 
        onClick={handlePlay}
        className="w-max text-base border border-neutral-600 shadow-md bg-neutral-200 text-black px-6 rounded mb-4 hover:bg-neutral-300"
      >
        {gameState === "ready" ? "Play" : "Restart"}
      </button>
      <div className="relative w-[450px] aspect-square border-2 border-black">
        {circles.map(circle => (
          <div key={circle.id}>
            <RenderCircle circle={circle} onClick={handleCircleClick} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default GameContainer;
