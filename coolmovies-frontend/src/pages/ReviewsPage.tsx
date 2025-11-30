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

  const [formData, setFormData] = useState({
    movieId: "",
    userReviewerId: "65549e6a-2389-42c5-909a-4475fdbb3e69",
    reviewerName: "",
    title: "",
    body: "",
    rating: 5,
  });

  const {
    data: moviesData,
    loading: loadingMovies,
    error: errorMovies,
  } = useQuery(ALL_MOVIES);

  const [fetchReviews] = useLazyQuery(MOVIE_REVIEWS, {
    onCompleted: (data) => {},
  });
  const [createReview, { loading: submitting }] = useMutation(CREATE_REVIEW, {
    onCompleted: () => {
      alert("Review enviada com sucesso!");
      // Refetch reviews do filme
      if (formData.movieId) {
        setLoadingReviewsByMovie((prev) => ({
          ...prev,
          [formData.movieId]: true,
        }));
        fetchReviews({ variables: { movieId: formData.movieId } });
      }
      setFormData((prev) => ({
        ...prev,
        reviewerName: "",
        title: "",
        body: "",
        rating: 5,
      }));
    },
  });

  const toggleReviews = (movieId: string) => {
    setOpenReviews((prev) => ({ ...prev, [movieId]: !prev[movieId] }));

    if (!openReviews[movieId] && !reviewsByMovie[movieId]) {
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.movieId ||
      !formData.reviewerName.trim() ||
      !formData.body.trim()
    )
      return;

    createReview({
      variables: {
        movieId: formData.movieId,
        title: formData.title || `${formData.reviewerName} avaliou`,
        body: formData.body,
        rating: formData.rating,
        userReviewerId: formData.userReviewerId,
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
          Erro ao carregar filmes
        </Alert>
      </Box>
    );
  }

  return (
    <>
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

        {/* REVIEWS LISTING */}
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

        {/* NEW REVIEW FORM */}
        <Paper
          elevation={20}
          sx={{
            mt: 16,
            p: { xs: 4, md: 8 },
            borderRadius: 6,
            bgcolor: colors.surface,
            maxWidth: 1100,
            mx: "auto",
            boxShadow: "0 40px 100px rgba(0,0,0,0.9)",
            border: `1px solid ${colors.border}`,
          }}
        >
          <Typography
            variant="h4"
            align="center"
            fontWeight="bold"
            color={colors.red}
            mb={4}
          >
            New Review
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Grid className="ReviewForms" container spacing={4}>
              {/* Seus campos do formulário aqui (iguais ao original) */}
              {/* ... (vou deixar os mesmos que você já tem) */}
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Quem está avaliando"
                  variant="filled"
                  fullWidth
                  value={formData.userReviewerId}
                  onChange={(e) =>
                    setFormData({ ...formData, userReviewerId: e.target.value })
                  }
                  sx={{
                    "& .MuiFilledInput-root": {
                      bgcolor: colors.surface2,
                      borderRadius: 3,
                    },
                  }}
                >
                  <MenuItem value="65549e6a-2389-42c5-909a-4475fdbb3e69">
                    Ayla
                  </MenuItem>
                  <MenuItem value="5f1e6707-7c3a-4acd-b11f-fd96096abd5a">
                    Chrono
                  </MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Seu nome (exibido)"
                  variant="filled"
                  fullWidth
                  required
                  value={formData.reviewerName}
                  onChange={(e) =>
                    setFormData({ ...formData, reviewerName: e.target.value })
                  }
                  sx={{
                    "& .MuiFilledInput-root": {
                      bgcolor: colors.surface2,
                      borderRadius: 3,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  select
                  label="Filme"
                  variant="filled"
                  fullWidth
                  required
                  value={formData.movieId}
                  onChange={(e) =>
                    setFormData({ ...formData, movieId: e.target.value })
                  }
                  sx={{
                    "& .MuiFilledInput-root": {
                      bgcolor: colors.surface2,
                      borderRadius: 3,
                    },
                  }}
                >
                  {movies.map((m: any) => (
                    <MenuItem key={m.id} value={m.id}>
                      {m.title}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Título, body, rating... (os mesmos) */}
              <Grid item xs={12}>
                <TextField
                  label="Título da review (opcional)"
                  variant="filled"
                  fullWidth
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  sx={{
                    "& .MuiFilledInput-root": {
                      bgcolor: colors.surface2,
                      borderRadius: 3,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Sua review"
                  variant="filled"
                  multiline
                  rows={7}
                  fullWidth
                  required
                  placeholder="Conte tudo o que achou..."
                  value={formData.body}
                  onChange={(e) =>
                    setFormData({ ...formData, body: e.target.value })
                  }
                  sx={{
                    "& .MuiFilledInput-root": {
                      bgcolor: colors.surface2,
                      borderRadius: 3,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography
                  component="legend"
                  gutterBottom
                  color={colors.textSecondary}
                  fontWeight="bold"
                >
                  Sua nota
                </Typography>
                <Rating
                  value={formData.rating}
                  onChange={(_, v) =>
                    setFormData({ ...formData, rating: v || 5 })
                  }
                  size="large"
                  sx={{ color: colors.red }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={submitting}
                  sx={{
                    mt: 6,
                    height: 76,
                    bgcolor: colors.red,
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    borderRadius: 38,
                    boxShadow: "0 15px 50px rgba(229,9,20,0.7)",
                    "&:hover": { bgcolor: "#ff0f1a" },
                  }}
                >
                  {submitting ? (
                    <CircularProgress size={40} color="inherit" />
                  ) : (
                    "Enviar Review"
                  )}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default ReviewsPage;
