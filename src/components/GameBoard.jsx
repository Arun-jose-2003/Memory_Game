import React, { useState, useEffect } from 'react';
import Card from './Card';

const cardImages = [
  { src: '/img/cake.png', matched: false },
  { src: '/img/cherries.png', matched: false },
  { src: '/img/milk-shake.png', matched: false },
  { src: '/img/strawberry.png', matched: false },
  { src: '/img/tree.png', matched: false },
  { src: '/img/watermelon.png', matched: false },
];

const MAX_TURNS = 15;

const GameBoard = () => {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false);

  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setTurns(0);
    setGameWon(false);
    setGameLost(false);
  };

  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.src === choiceTwo.src) {
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true };
            }
            return card;
          });
        });
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  useEffect(() => {
    if (cards.length && cards.every((card) => card.matched)) {
      setGameWon(true);
    }

    if (turns >= MAX_TURNS) {
      setGameLost(true);
    }
  }, [cards, turns]);

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prevTurns) => prevTurns + 1);
    setDisabled(false);
  };

  useEffect(() => {
    shuffleCards();
  }, []);

  return (
    <div className={`game-board-wrapper ${gameWon || gameLost ? 'modal-active' : ''}`}>
      <div className="game-board">
        <div className="info-container">
          <p style={{ animation: 'zoomOut 2s infinite',color:"black" }}>
            Turns: {turns}/{MAX_TURNS}
          </p>
          <div
            className="icon-container"
            onClick={shuffleCards}
            style={{ cursor: 'pointer', marginLeft: '10px' }}
          >
            <i
              className="fa-solid fa-rotate-right"
              style={{ color: 'red', fontSize: '24px' }}
            ></i>
          </div>
        </div>

        <h1 style={{ marginBottom: '30px', marginTop: '8px', color: 'black' }}>Memory Game</h1>

        <div className="card-grid">
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              handleChoice={handleChoice}
              flipped={card === choiceOne || card === choiceTwo || card.matched}
              disabled={disabled}
            />
          ))}
        </div>
      </div>

      {/* Modal for Game Won */}
      {gameWon && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={shuffleCards}>&times;</span>
            <h2>Congratulations! You Won!</h2>
            <img
              src="https://th.bing.com/th/id/OIP.Mn9bDsIPtaKch3Zl5-n4ggHaHa?rs=1&pid=ImgDetMain"
              alt="Winning gif"  width={200} 
            />
            <button className="form-control btn btn-outline-success" onClick={shuffleCards}>
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* Modal for Game Lost */}
      {gameLost && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={shuffleCards}>&times;</span>
            <h2>Game Over!</h2>
            <img style={{display:"flex",justifyContent:"center"}}
              src="https://media0.giphy.com/media/eJ4j2VnYOZU8qJU3Py/giphy.gif"
              alt="Losing gif"  width={200} 
            />
            <button className="form-control btn btn-outline-danger" onClick={shuffleCards}>
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
