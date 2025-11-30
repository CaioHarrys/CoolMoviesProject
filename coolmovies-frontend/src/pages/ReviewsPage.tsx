"use client";

import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  CircularProgress,
  Alert,
  Rating,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import { useState } from "react";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import MovieCard from "../features/example/components/MovieCard";
import NewReviewForm from "../features/example/components/NewReviewForm";
import { ALL_MOVIES } from "../graphql/movies/GET_ALL_MOVIES";
import { MOVIE_REVIEWS } from "../graphql/movies/GET_MOVIE_REVIEWS";
import { CREATE_REVIEW } from "../graphql/movies/CREATE_REVIEW";

const colors = {
  bg: "#0F0F0F",
  surface: "#141414",
  surface2: "#1F1F1F",
  red: "#E50914",
  textPrimary: "#FFFFFF",
  textSecondary: "#B3B3B3",
  textMuted: "#666666",
  border: "#333333",
};

const ReviewsPage = () => {
  const [openReviews, setOpenReviews] = useState<Record<string, boolean>>({});
  const [reviewsByMovie, setReviewsByMovie] = useState<Record<string, any>>({});
  const [loadingReviewsByMovie, setLoadingReviewsByMovie] = useState<
    Record<string, boolean>
  >({});

  const {
    data: moviesData,
    loading: loadingMovies,
    error: errorMovies,
  } = useQuery(ALL_MOVIES);

  const [fetchReviews] = useLazyQuery(MOVIE_REVIEWS);

  const [createReview, { loading: submitting }] = useMutation(CREATE_REVIEW, {
    onCompleted: () => {
      alert("Review submitted successfully!");
    },
  });

  const toggleReviews = (movieId: string) => {
    setOpenReviews((prev) => ({ ...prev, [movieId]: !prev[movieId] }));

    const isOpening = !openReviews[movieId];
    const hasDataLoaded = !!reviewsByMovie[movieId];

    if (isOpening && !hasDataLoaded) {
      setLoadingReviewsByMovie((prev) => ({ ...prev, [movieId]: true }));

      fetchReviews({
        variables: { movieId },
        onCompleted: (data) => {
          setReviewsByMovie((prev) => ({ ...prev, [movieId]: data }));
          setLoadingReviewsByMovie((prev) => ({ ...prev, [movieId]: false }));
        },
      });
    }
  };

  const handleCreateReview = (data: any) => {
    const movieId = data.movieId;

    createReview({
      variables: {
        movieId,
        title: data.title || `${data.reviewerName} reviewed`,
        body: data.body,
        rating: data.rating,
        userReviewerId: data.userReviewerId,
      },
      onCompleted: () => {
        setLoadingReviewsByMovie((prev) => ({ ...prev, [movieId]: true }));

        fetchReviews({
          variables: { movieId },
          onCompleted: (response) => {
            setReviewsByMovie((prev) => ({ ...prev, [movieId]: response }));
            setLoadingReviewsByMovie((prev) => ({ ...prev, [movieId]: false }));
          },
        });
      },
    });
  };

  const movies = moviesData?.allMovies?.nodes || [];

  if (loadingMovies) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: colors.bg,
        }}
      >
        <CircularProgress size={80} thickness={5} sx={{ color: colors.red }} />
      </Box>
    );
  }

  if (errorMovies) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: colors.bg,
        }}
      >
        <Alert severity="error" sx={{ bgcolor: "#330000", color: "#fff" }}>
          Error loading movies
        </Alert>
      </Box>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{ py: 8, bgcolor: colors.bg, minHeight: "100vh" }}
    >
      <Typography
        variant="h3"
        sx={{
          mb: 8,
          fontWeight: 900,
          fontSize: { xs: "3rem", md: "4.5rem" },
          textAlign: "center",
          background: `linear-gradient(90deg, ${colors.red}, #ff3333)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Movie Reviews
      </Typography>

      <Grid className="cooler-container" container spacing={4}>
        {movies.map((movie: any, index: number) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            index={index}
            openReviews={openReviews}
            toggleReviews={toggleReviews}
            loadingReviews={loadingReviewsByMovie[movie.id]}
            reviewsData={reviewsByMovie[movie.id]}
          />
        ))}
      </Grid>

      <NewReviewForm
        movies={movies}
        submitting={submitting}
        onSubmit={handleCreateReview}
      />
    </Container>
  );
};

export default ReviewsPage;
