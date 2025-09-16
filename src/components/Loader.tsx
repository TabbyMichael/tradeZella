import React from 'react';
import './Loader.css';

const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="loader">
        <div className="loader__image">
          <div className="loader__coin">
            <img src="https://www.dropbox.com/s/fzc3fidyxqbqhnj/loader-coin.png?raw=1" alt="Loading..." />
          </div>
          <div className="loader__hand">
            <img src="https://www.dropbox.com/s/y8uqvjn811z6npu/loader-hand.png?raw=1" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
