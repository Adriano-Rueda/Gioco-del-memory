import React from 'react';
import './Card.css';

function Card({ card, onClick, isFlipped, isMatched }) {
  return (
    <div
      className={`card ${isFlipped || isMatched ? 'flipped' : ''}`}
      onClick={onClick}
    >
      <div className="card-inner">
        <div className="card-front">❓</div>
        <div className="card-back">{card.emoji}</div>
      </div>
    </div>
  );
}

export default Card;
