import "./MoviesCardList.css";
import MoviesCard from "../MoviesCard/MoviesCard";
import { useLocation } from "react-router-dom";
import { CARDS_AT_SCREEN, SAVED_MOVIES_ROUTE, MOVIES_ROUTE } from "../../../utils/consts";
import React from "react";

const MoviesCardList = (props) => {
  const location = useLocation();

  const [numberOfInitialCards, setNumberOfInitialCards] = React.useState(0);
  const [numberOfAdditionalCards, setNumberOfAdditionalCards] =
    React.useState(0);
  const [sizeWindow, setSizeWindow] = React.useState(0);

  const numberOfCards = (width) => {
    if (width >= CARDS_AT_SCREEN.pcMonitor.width) {
      return CARDS_AT_SCREEN.pcMonitor;
    } else if (width >= CARDS_AT_SCREEN.tabletPc.width) {
      return CARDS_AT_SCREEN.tabletPc;
    } else if (width >= CARDS_AT_SCREEN.mobileScreen.width) {
      return CARDS_AT_SCREEN.mobileScreen;
    }
  };

  React.useEffect(() => {
    const cardsOnPage = numberOfCards(window.screen.width);
    setNumberOfInitialCards(cardsOnPage.cardsPerPage);
    setNumberOfAdditionalCards(cardsOnPage.addCards);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sizeWindow]);

  React.useEffect(() => {
    let timer = null;

    const resize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setSizeWindow(window.screen.width), 300);
    };

    window.addEventListener("resize", resize);
  }, []);

  const moreCardRender = props.movies.slice(0, numberOfInitialCards);
  const renderMoviesList = moreCardRender.map((card) => {
    const isMovieRoute = location.pathname === MOVIES_ROUTE;
    let isSaved = true;
    if (isMovieRoute) {
      isSaved = props.savedMovies.some(({id}) => card.id === id)
    }

    return (
      <MoviesCard
        card={card}
        key={card.id || card._id}
        onSaveMovie={props.onSaveMovie}
        onRemoveMovie={props.onRemoveMovie}
        isSaved={isSaved}
      />
    );
  });

  const loadMore = () => {
    setNumberOfInitialCards((data) => {
      return data + numberOfAdditionalCards;
    });
  };

  return (
    <section className="movies-cards">
      <ul className="movies-card-list">
        {renderMoviesList.length > 0 && renderMoviesList}
        {renderMoviesList.length === 0 && !props.movieSearchError && (
          <span className="movies__not-found">Ничего не найдено</span>
        )}

        {props.movieSearchError && (
          <span className="movies__not-found movies__not-found_error">
            Во время запроса произошла ошибка. Возможно, проблема с соединением
            или сервер недоступен. Подождите немного и попробуйте ещё раз.
          </span>
        )}
      </ul>
      {renderMoviesList.length < props.movies.length && (
        <button
          className={`movie__bottom-button ${
            location.pathname === SAVED_MOVIES_ROUTE
              ? "movie__bottom-button display-none"
              : ""
          }`}
          onClick={() => loadMore()}
        >
          Ещё
        </button>
      )}
    </section>
  );
};

export default MoviesCardList;
