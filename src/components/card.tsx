import React from 'react'
import { Playlist } from '../routes/playlistsRoute';

type MusicCard = {
  name: string;
  imageUrl: string;
  isSelected: boolean;
  toggleSelect: () => void;
}

const Card = ({name, imageUrl, isSelected, toggleSelect}: MusicCard) => {

  return (
    <div className="card" style={{ backgroundColor: isSelected ? "#50c2ff" : "#fafafa" }}>
        <img className="card-image" src={imageUrl} alt='playlist img'></img>
        <h2 className='card-title'>{name}</h2>
        <button onClick={() => toggleSelect()}>{isSelected ? "X" : "Select"}</button>
    </div>
  )
}

export default Card;