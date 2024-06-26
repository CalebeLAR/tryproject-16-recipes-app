import React, { useContext, useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { } from 'phosphor-react';
import { TbMeat, TbCup } from 'react-icons/tb';
import AppRecipeContext from '../contexts/AppRecipeContext';
import Loading from './Loading';
import styles from './RecipeCard.module.css';

export default function RecipeCard() {
  const {
    loading,
    // setLoading,
    arrMealAPI,
    arrDrinkAPI,
    arrMealCategAPI,
    arrDrinkCategAPI,
    route,
  } = useContext(AppRecipeContext);

  const history = useHistory();
  const { location: { pathname } } = history;
  const page = pathname.split('/')[1];

  useEffect(() => {
  }, [route]);

  const objFilterInitial = {
    arrRecipes: page === 'meals' ? arrMealAPI : arrDrinkAPI,
    filter: 'All',
  };

  const [objFilter, setObjFilter] = useState(objFilterInitial);

  const fetchByFilter = async (search) => {
    const twelve = 12;
    const url = (page === 'meals')
      ? (`https://www.themealdb.com/api/json/v1/1/filter.php?c=${search}`)
      : (`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${search}`);
    try {
      const response = await fetch(url);
      const data = await response.json();
      const newData = await data[page].filter((_recipe, i) => i < twelve);
      return newData;
    } catch (error) {
      Error(error.massage);
    }
  };

  const handleClickFilter = async (categ) => {
    const search = categ;
    if (search === objFilter.filter || search === 'All') {
      setObjFilter(objFilterInitial);
    } else {
      const newData = await fetchByFilter(search);
      setObjFilter({ arrRecipes: newData, filter: search });
    }
  };

  useEffect(() => {
    if (objFilter.filter === 'All') {
      setObjFilter(objFilterInitial);
    }
  }, [loading, route]);

  if (loading) return <Loading />;
  return (
    <div className={ styles.container }>
      <div className={ styles.categories }>
        {(page === 'meals'
          ? arrMealCategAPI
          : arrDrinkCategAPI
        )
          .map((categ, i) => (
            <div
              key={ i }
            >
              <button
                className={ styles.categories__buttons }
                type="button"
                data-testid={ `${categ}-category-filter` }
                onClick={ () => handleClickFilter(categ) }
              >
                {page === 'meals'
                  ? <TbMeat className={ styles.categories__icon } />
                  : <TbCup className={ styles.categories__icon } />}
                <br />
                { categ.split(' ')[0] }
              </button>

            </div>

          ))}
      </div>
      <button
        className={ styles.all_button }
        type="button"
        data-testid="All-category-filter"
        onClick={ () => handleClickFilter('All') }
      >
        Show All
      </button>
      {page === 'meals'
        ? objFilter.arrRecipes.map((recipe, index) => (
          <Link to={ `/meals/${recipe.idMeal}` } key={ index }>
            <div
              data-testid={ `${index}-recipe-card` }
              className={ styles.recipe }
            >
              <img
                className={ styles.recipe__image }
                src={ recipe.strMealThumb }
                alt={ recipe.strMeal }
                data-testid={ `${index}-card-img` }
              />
              <p
                data-testid={ `${index}-card-name` }
                className={ styles.recipe__name }
              >
                {recipe.strMeal}

              </p>
            </div>
          </Link>
        ))
        : objFilter.arrRecipes.map((recipe, index) => (
          <Link to={ `/drinks/${recipe.idDrink}` } key={ index }>
            <div
              data-testid={ `${index}-recipe-card` }
              className={ styles.recipe }
            >
              <img
                className={ styles.recipe__image }
                src={ recipe.strDrinkThumb }
                alt={ recipe.strDrink }
                data-testid={ `${index}-card-img` }
              />
              <p
                data-testid={ `${index}-card-name` }
                className={ styles.recipe__name }
              >
                {recipe.strDrink}

              </p>
            </div>
          </Link>
        ))}
    </div>
  );
}
