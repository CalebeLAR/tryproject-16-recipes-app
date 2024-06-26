import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import shareIcon from '../images/shareIcon.svg';
import FavoriteButtons from './FavoriteButtons';

const copy = require('clipboard-copy');

const TIME_ALERT = 5000;
export default function FavoriteCard({ filteredRecipes, setFilteredRecipes, filter }) {
  const [messageCopy, setMessageCopy] = useState(false);
  const onShareBtnClick = async (type, id) => {
    setMessageCopy(true);
    const URL = `http://localhost:3000/${type}s/${id}`;
    copy(URL);
    setTimeout(() => {
      setMessageCopy(false);
    }, TIME_ALERT);
  };
  const storage = localStorage.getItem('favoriteRecipes');
  const oldFav = JSON.parse(storage);
  const onFavoriteBtnClick = (id) => {
    const favoriteAvoidRepeat = oldFav.filter((element) => element.id !== id);
    localStorage.setItem('favoriteRecipes', JSON.stringify([...favoriteAvoidRepeat]));
    setFilteredRecipes(favoriteAvoidRepeat);
  };
  const getFilterRecipes = () => {
    if (filter !== 'all') {
      const recipes = filteredRecipes.filter((recipe) => recipe.type === filter);
      return recipes;
    }
    const recipes = [...filteredRecipes];
    return recipes;
  };

  return (
    <section>
      {
        getFilterRecipes().map((favRecipe, index) => {
          const { type,
            name, image, category, alcoholicOrNot, nationality, id } = favRecipe;
          return (
            <div key={ name }>
              <Link to={ `/${type}s/${id}` }>

                <img
                  data-testid={ `${index}-horizontal-image` }
                  src={ image }
                  alt={ name }
                  width={ 200 }
                />
                <div>
                  <p
                    data-testid={ `${index}-horizontal-name` }
                  >
                    {name}
                  </p>

                  {
                    (type === 'meal') ? (
                      <p
                        data-testid={ `${index}-horizontal-top-text` }
                      >
                        {`${nationality} - ${category}`}
                      </p>
                    ) : (
                      <p
                        data-testid={ `${index}-horizontal-top-text` }
                      >
                        {alcoholicOrNot}
                      </p>
                    )
                  }
                </div>
              </Link>
              <div>
                <FavoriteButtons
                  dataTestid={ `${index}-horizontal-share-btn` }
                  src={ shareIcon }
                  alt={ blackHeartIcon }
                  onClick={ () => onShareBtnClick(type, id) }
                />
                {
                  messageCopy && <p>Link copied!</p>
                }
                <FavoriteButtons
                  dataTestid={ `${index}-horizontal-favorite-btn` }
                  src={ blackHeartIcon }
                  alt={ blackHeartIcon }
                  onClick={ () => onFavoriteBtnClick(id) }
                />
              </div>
            </div>
          );
        })
      }
    </section>
  );
}

FavoriteCard.propTypes = {
  filteredRecipes: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.string,
    nationality: PropTypes.string,
    category: PropTypes.string,
    alcoholicOrNot: PropTypes.string,
    name: PropTypes.string,
    image: PropTypes.string,
  })).isRequired,
  setFilteredRecipes: PropTypes.func.isRequired,
  filter: PropTypes.string.isRequired,
};
