import './assets/css/App.css';
import apple from './assets/img/apple.svg';
import React, { useState, useEffect } from 'react';

export default function App() {
  const [snake, setSnake] = useState([{ top: 0, left: 0 }]);
  const [rotation, setRotation] = useState(0);
  const [direction, setDirection] = useState(null);
  const [lastDirection, setLastDirection] = useState(null);
  const [place, setPlace] = useState({ left: 100, top: 200 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('highScore'), 10) || 0;
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight' && lastDirection !== 'left') {
        setRotation(0);
        setDirection('right');
      } else if (event.key === 'ArrowLeft' && lastDirection !== 'right') {
        setRotation(180);
        setDirection('left');
      } else if (event.key === 'ArrowUp' && lastDirection !== 'down') {
        setRotation(270);
        setDirection('up');
      } else if (event.key === 'ArrowDown' && lastDirection !== 'up') {
        setRotation(90);
        setDirection('down');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const moveSnake = () => {
      if (!gameOver) {
        setSnake((prevSnake) => {
          const newSnake = [...prevSnake];
          let newHead = { ...newSnake[0] };

          if (direction === 'right') {
            newHead.left += 5;
          } else if (direction === 'left') {
            newHead.left -= 5;
          } else if (direction === 'up') {
            newHead.top -= 5;
          } else if (direction === 'down') {
            newHead.top += 5;
          }

          if (!gameOver && (newHead.left < 0 || newHead.top < 0 || newHead.left > 360 || newHead.top > 325)) {
            setGameOver(true);
          }

          if (Math.abs(newHead.left - place.left) < 10 && Math.abs(newHead.top - place.top) < 10) {
            setPlace({
              left: Math.floor(Math.random() * 300),
              top: Math.floor(Math.random() * 300),
            });
            newSnake.push({}); 
            setScore((prevScore) => {
              const newScore = prevScore + 1;
              if (newScore > highScore) {
                setHighScore(newScore);
                localStorage.setItem('highScore', newScore);
              }
              return newScore;
            });
          }

          newSnake.pop();
          newSnake.unshift(newHead); 
          for (let i = 1; i < newSnake.length; i++) {
            if (newSnake[i].top === newHead.top && newSnake[i].left === newHead.left) {
              setGameOver(true);
              return prevSnake;
            }
          }

          setLastDirection(direction);
          return newSnake;
        });
      }
    };

    const intervalId = setInterval(moveSnake, 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(intervalId);
    };
  }, [direction, gameOver, place, lastDirection, highScore]);

  const handleTryAgain = () => {
    window.location.reload();
  }
  return (
    <section className='w-full justify-center items-center content-center flex bg-[rgb(34,39,56)] h-[100vh] flex-wrap'>
      <div className='  w-[400px]  h-[400px] justify-center items-center flex flex-wrap '>
        <div className='flex px-5 *:text-[gray] *:mx-5 '>
          <div className='*:uppercase flex'>
            <span className='mx-2 text-[12px] justify-center items-center flex font-bold'>score:</span>
            <span className='font-bold text-[25px]'>{score}</span>
          </div>
          <div className='uppercase  flex'>
            <span className='mx-2 text-[12px] justify-center items-center flex font-bold' >high score: </span>
            <span className='font-bold text-[25px]'>{highScore}</span>
          </div>
        </div>

        <div className='w-full h-[90%] bg-[rgb(24,24,37)] relative'>
          {snake.map((segment, index) => (
            <span
              key={index}
              className='w-[30px] h-[15px] absolute bg-[white]'
              style={{
                top: segment.top,
                left: segment.left,
                transform: `rotate(${rotation}deg)`,
                boxShadow: index === 0 ? '0 0 10px white, 0 0 20px white' : 'none' 
              }}
            ></span>
          ))}
          <img src={apple} alt="" className='w-[30px] h-[30px] absolute' style={{ top: place.top, left: place.left }} />
        </div>


      </div>
      {gameOver && (
        <div className='absolute w-[450px] h-[450px] top-[5] left-[50%] flex justify-center items-center bg-[rgb(24,24,37)] translate-x-[-50%]'>
          <div className='relative w-full h-full  text-[rgb(77,254,215)] justify-center items-center flex flex-col'>
            <span className='text-[30px] font-bold '>You lose!</span>
            <button onClick={handleTryAgain} className='mt-4 p-2 cursor-pointer font-bold'>
              Try again
            </button>
          </div>
        </div>
      )}
      <div className='text-[white] w-full justify-center flex uppercase *:flex *:items-center *:mx-2 mt-5'>
        <h2 className='font-bold text-[gray] text-[20px]'>snake </h2>
        <span className='text-[15px] text-[gray]'>by sarvin nazeri</span>
      </div>

    </section>
  );
}
