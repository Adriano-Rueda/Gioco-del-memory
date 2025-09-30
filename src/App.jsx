import React, { useState, useEffect } from 'react';
import Card from './components/Card';
import './App.css';
import Rating from '@mui/material/Rating';

const emojis = ['💻', '⌨️', '🖱️', '🛜', '💾', '🖨️', '🖲️', '💿', '📀'];

function shuffleCards() {
  const cards = [...emojis, ...emojis]
    .map((emoji, index) => ({ id: index, emoji, matched: false }))
    .sort(() => Math.random() - 0.5);
  return cards;
}

function App() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [scores, setScores] = useState({ 1: 0, 2: 0 });
  const [playerRatings, setPlayerRatings] = useState({ 1: null, 2: null });

  const isGameOver = matched.length === emojis.length;

  useEffect(() => {
    setCards(shuffleCards());
  }, []);

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [first, second] = newFlipped;
      const firstEmoji = cards[first].emoji;
      const secondEmoji = cards[second].emoji;

      if (firstEmoji === secondEmoji) {
        setMatched(prev => [...prev, firstEmoji]);
        setScores(prev => ({
          ...prev,
          [currentPlayer]: prev[currentPlayer] + 1
        }));
        setTimeout(() => setFlipped([]), 800);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setCurrentPlayer(prev => (prev === 1 ? 2 : 1));
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (matched.length === emojis.length) {
      let winner;
      if (scores[1] > scores[2]) winner = 'giocatore 1';
      else if (scores[2] > scores[1]) winner = 'giocatore 2';
      else winner = 'pareggio';

      setTimeout(() => {
        alert(`Gioco finito! Ha vinto il ${winner}`);
      }, 500);
    }
  }, [matched]);

  const handleRestart = () => {
    setCards(shuffleCards());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setCurrentPlayer(1);
    setScores({ 1: 0, 2: 0 });
    setPlayerRatings({ 1: null, 2: null });
  };

  const handleSave = () => {
    const partitaData = {
      scores,
      moves,
      playerRatings,
      timestamp: new Date(),
    };
    console.log('Dati partita da salvare:', partitaData);
    alert('Dati salvati e inviati al DB esterno!');
  };

  return (
    <div className="game">
      <h1>Gioco del memory</h1>

      <div className="regfun-box">
        <h2>Regolamento e funzionalità:</h2>
        <p>-2 giocatori</p>
        <p>-Un giocatore che indovina una coppia continua fino a che non sbaglia</p>
        <p>-Vince il giocatore che ha indovinato più coppie</p>
        <p>-Cliccando sul pulsante "Salva la partita e invia i dati al DB esterno" tutti i dati salvati vengono inviati a un DB esterno</p>
        <p>-Cliccando sul pulsante "Nuova partita" si avvia una nuova partita e le carte vengono mescolate</p>
        <h3>Buon divertimento!</h3>
      </div>

      <h4 className="turno-box">Turno del giocatore {currentPlayer}</h4>

      <div className="game-area">
        <div className="player-info left">
          <p className="player-name">Giocatore 1</p>
          <p>N° di coppie indovinate: {scores[1]}</p>
        </div>

        <div className="board">
          {cards.map((card, index) => (
            <Card
              key={card.id}
              card={card}
              onClick={() => handleCardClick(index)}
              isFlipped={flipped.includes(index)}
              isMatched={matched.includes(card.emoji)}
            />
          ))}
        </div>

        <div className="player-info right">
          <p className="player-name">Giocatore 2</p>
          <p>N° di coppie indovinate: {scores[2]}</p>
        </div>
      </div>

      {isGameOver && (
        <div className="rating-area">
          <div className="rating-title">Grazie per aver giocato!</div>

          <div className="rating-players">
            <div className="player-rating">
              <p>Voto giocatore 1:</p>
              <Rating
                name="player1-feedback"
                value={playerRatings[1]}
                onChange={(event, newValue) => {
                  setPlayerRatings(prev => ({ ...prev, 1: newValue }));
                }}
              />
            </div>

            <div className="player-rating">
              <p>Voto giocatore 2:</p>
              <Rating
                name="player2-feedback"
                value={playerRatings[2]}
                onChange={(event, newValue) => {
                  setPlayerRatings(prev => ({ ...prev, 2: newValue }));
                }}
              />
            </div>
          </div>

          <div>
            <button className="save-button" onClick={handleSave} style={{marginTop: '1px'}}>
              Salva la partita e invia i dati al DB esterno
            </button>
          </div>

          <div className="button-wrapper" style={{marginTop: '2px'}}>
            <button className="restart-button" onClick={handleRestart}>
              Nuova partita
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
