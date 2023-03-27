import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { AuthContext } from "../context/AuthContext";
import { toastWarnNotify } from "../helpers/ToastNotify";

// const API_KEY = "d6278b3dc3e6f8f8376a89851c3f8c8f";
const API_KEY = process.env.REACT_APP_TMDB_KEY;
const FEATURED_API = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}`;
const SEARCH_API = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;


const Main = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { currentUser } = useContext(AuthContext);
  const [page, setPage] = useState(1)

  const nextPage = () => {
    setPage(prev => prev + 1)
    axios
    .get(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=${page}`)
    .then((res) => {
      setMovies(res.data.results)
    }
      
      )
    .catch((err) => console.log(err));
  }



  const PreviousPage = () => {
    if(page > 1){
      setPage(prev => prev - 1)
    }
    
    axios
    .get(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=${page}`)
    .then((res) => {
      setMovies(res.data.results)
    }
      
      )
    .catch((err) => console.log(err));
  }

  useEffect(() => {
    getMovies(FEATURED_API);
  }, []);

  const getMovies = (API) => {
    axios
      .get(API)
      .then((res) => setMovies(res.data.results))
      .catch((err) => console.log(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm && currentUser) {
      getMovies(SEARCH_API + searchTerm);
    } else if (!currentUser) {
      toastWarnNotify("Please log in to search a movie");
      // alert("Please log in to search a movie");
    } else {
      toastWarnNotify("Please enter a text");
      // alert("Please enter a text");
    }
  };
  


  return (
    <>
      <form className="search" onSubmit={handleSubmit}>
        <input
          type="search"
          className="search-input"
          placeholder="Search a movie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="searchButton-3"type="submit">Search</button>
      </form>
      <div className="d-flex justify-content-center flex-wrap">
        {movies?.map((movie) => (
          <MovieCard key={movie.id} {...movie} />
        ))}
      </div>
      <div>
      <div style={{display: 'flex', justifyContent: 'center', marginTop: "20px", marginBottom: "20px"}}>
          <button className="pagination" color="primary" onClick={() => PreviousPage()} >Anterior</button>
          <button className="pagination" color="primary">
              {page}
          </button>
          <button className="pagination" color="primary" onClick={() => nextPage()} >Siguiente</button>
      </div>
      </div>
    </>
  );
};

export default Main;
