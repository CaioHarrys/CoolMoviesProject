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
  bg: "#0F0F0F",
  surface: "#141414",
  surface2: "#1F1F1F",
  red: "#E50914",
  textPrimary: "#FFFFFF",
  textSecondary: "#B3B3B3",
  textMuted: "#666666",
  border: "#333333",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.movieId ||
      !formData.reviewerName.trim() ||
      !formData.body.trim()
    )
      return;

    onSubmit(formData);

    // limpa alguns campos
    setFormData((prev) => ({
      ...prev,
      reviewerName: "",
      title: "",
      body: "",
      rating: 5,
    }));
  };

  return (
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
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Quem está avaliando"
              variant="filled"
              fullWidth
              value={formData.userReviewerId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  userReviewerId: e.target.value,
                })
              }
              sx={{
                "& .MuiFilledInput-root": {
                  bgcolor: colors.surface2,
                  borderRadius: 3,
                },
              }}
            >
              <MenuItem value="65549e6a-2389-42c5-909a-4475fdbb3e69">Ayla</MenuItem>
              <MenuItem value="5f1e6707-7c3a-4acd-b11f-fd96096abd5a">Chrono</MenuItem>
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
              {movies.map((m) => (
                <MenuItem key={m.id} value={m.id}>
                  {m.title}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

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
  );
}
