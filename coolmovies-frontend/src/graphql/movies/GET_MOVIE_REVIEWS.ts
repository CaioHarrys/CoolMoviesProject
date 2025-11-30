import { gql } from "@apollo/client";

export const MOVIE_REVIEWS = gql`
  query MovieReviews($movieId: UUID!) {
    allMovieReviews(filter: { movieId: { equalTo: $movieId } }) {
      nodes {
        id
        title
        body
        rating
        userByUserReviewerId {
          id
          name
        }
      }
    }
  }
`;
