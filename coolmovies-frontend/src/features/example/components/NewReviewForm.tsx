"use client";

import {
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Rating,
  Box,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";

const colors = {
  bg: "#0A0A0A",
  surface: "#121212",
  surface2: "#1A1A1A",
  red: "#E50914",
  white: "#FFFFFF",
  border: "#2A2A2A",
};

interface Movie {
  id: string;
  title: string;
}

interface NewReviewFormProps {
  movies: Movie[];
  submitting: boolean;
  onSubmit: (data: {
    movieId: string;
    userReviewerId: string;
    reviewerName: string;
    title: string;
    body: string;
    rating: number;
  }) => void;
}

export default function NewReviewForm({
  movies,
  submitting,
  onSubmit,
}: NewReviewFormProps) {
  const [formData, setFormData] = useState({
    movieId: "",
    userReviewerId: "65549e6a-2389-42c5-909a-4475fdbb3e69",
    reviewerName: "",
    title: "",
    body: "",
    rating: 5,
  });

  const inputStyles = {
    "& .MuiInputLabel-root": {
      color: colors.white,
      fontWeight: "bold",
      "&.Mui-focused": {
        color: colors.red,
      },
    },
    "& .MuiFilledInput-root": {
      backgroundColor: colors.surface2,
      borderRadius: 6,
      color: colors.white,
      border: `1px solid ${colors.border}`,
      transition: "all 0.2s ease-in-out",
      "&::before": {
        display: "none !important",
      },
      "&::after": {
        display: "none !important",
      },
      "&:hover": {
        backgroundColor: "#222222 !important",
        borderColor: colors.red,
        boxShadow: "0 0 0 1px rgba(229, 9, 20, 0.2)",
      },
      "&.Mui-focused": {
        backgroundColor: "#222222",
        borderColor: colors.red,
        boxShadow: `0 0 0 2px rgba(229, 9, 20, 0.35)`,
      },
    },
    "& .MuiFilledInput-underline:before": {
      display: "none",
    },
    "& .MuiFilledInput-underline:after": {
      display: "none",
    },
    "& .MuiInputBase-input::placeholder": {
      color: "#AAAAAA",
      opacity: 1,
    },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.movieId ||
      !formData.reviewerName.trim() ||
      !formData.body.trim()
    ) {
      return;
    }

    onSubmit(formData);

    alert("Review submitted — may the force be with you!");

    setFormData((prev) => ({
      ...prev,
      reviewerName: "",
      title: "",
      body: "",
      rating: 5,
      movieId: "",
    }));
  };

  return (
    <Paper
      elevation={12}
      sx={{
        mt: 6,
        p: { xs: 3, md: 4 },
        borderRadius: 4,
        bgcolor: colors.surface,
        maxWidth: 600,
        mx: "auto",
        boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        border: `1px solid ${colors.border}`,
      }}
    >
      <Typography
        variant="h5"
        align="center"
        fontWeight="bold"
        color={colors.red}
        mb={3}
      >
        New Review
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Reviewer"
              variant="filled"
              fullWidth
              value={formData.userReviewerId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  userReviewerId: e.target.value,
                })
              }
              sx={inputStyles}
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
              label="Display Name"
              variant="filled"
              fullWidth
              required
              value={formData.reviewerName}
              onChange={(e) =>
                setFormData({ ...formData, reviewerName: e.target.value })
              }
              sx={inputStyles}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              label="Movie"
              variant="filled"
              fullWidth
              required
              value={formData.movieId}
              onChange={(e) =>
                setFormData({ ...formData, movieId: e.target.value })
              }
              sx={inputStyles}
            >
              {movies.map((m) => (
                <MenuItem key={m.id} value={m.id}>
                  {m.title}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Review Title"
              variant="filled"
              fullWidth
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              sx={inputStyles}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Your Review"
              variant="filled"
              multiline
              rows={5}
              fullWidth
              required
              value={formData.body}
              onChange={(e) =>
                setFormData({ ...formData, body: e.target.value })
              }
              sx={inputStyles}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography
              component="legend"
              gutterBottom
              color={colors.white}
              fontWeight="bold"
              fontSize="0.9rem"
            >
              Rating
            </Typography>

            <Rating
              value={formData.rating}
              onChange={(_, v) => setFormData({ ...formData, rating: v || 5 })}
              size="large"
              sx={{
                color: colors.red,
                "& .MuiRating-iconFilled": {
                  color: colors.red,
                },
                "& .MuiRating-iconHover": {
                  color: "#ff3333",
                },
              }}
            />
          </Grid>

          <Grid item xs={12} textAlign="center">
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={submitting}
              sx={{
                mt: 3,
                height: 56,
                bgcolor: colors.red,
                fontSize: "1.1rem",
                fontWeight: "bold",
                borderRadius: 28,
                color: colors.white,
                boxShadow: "0 10px 30px rgba(229,9,20,0.5)",
                "&:hover": {
                  bgcolor: "#ff0f1a",
                  boxShadow: "0 15px 40px rgba(229,9,20,0.6)",
                },
                "&:disabled": {
                  bgcolor: "#333",
                },
              }}
            >
              {submitting ? (
                <CircularProgress size={30} color="inherit" />
              ) : (
                "Submit Review"
              )}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
