import { gql } from "@apollo/client";

export const ALL_MOVIES = gql`
  query AllMovies {
    allMovies {
      nodes {
        id
        title
        imgUrl
        releaseDate
      }
    }
  }
`;
