import { gql } from "@apollo/client";

export const CREATE_REVIEW = gql`
  mutation CreateReview(
    $movieId: UUID!
    $title: String!
    $rating: Int!
    $body: String!
    $userReviewerId: UUID!
  ) {
    createMovieReview(
      input: {
        movieReview: {
          movieId: $movieId
          title: $title
          rating: $rating
          body: $body
          userReviewerId: $userReviewerId
        }
      }
    ) {
      movieReview {
        id
      }
    }
  }
`;
