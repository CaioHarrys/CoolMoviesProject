import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Rating,
  TextField,
  MenuItem,
  Button,
  Paper,
  Collapse,
  Avatar,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { css } from '@emotion/react';
import { useState } from 'react';
import {
  useQuery,
  useLazyQuery,
  useMutation,
  gql,
} from '@apollo/client';

// ============ QUERIES & MUTATIONS ============
const ALL_MOVIES = gql`
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

const MOVIE_REVIEWS = gql`
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

const CREATE_REVIEW = gql`
  mutation CreateReview($movieId: UUID!, $title: String!, $rating: Int!, $body: String!, $userReviewerId: UUID!) {
    createMovieReview(input: {
      movieReview: {
        movieId: $movieId
        title: $title
        rating: $rating
        body: $body
        userReviewerId: $userReviewerId
      }
    }) {
      movieReview { id }
    }
  }
`;

// Paleta igual ao código "safe"
const colors = {
  bg: '#0F0F0F',
  surface: '#141414',
  surface2: '#1F1F1F',
  red: '#E50914',
  textPrimary: '#FFFFFF',
  textSecondary: '#B3B3B3',
  textMuted: '#666666',
  border: '#333333',
};

const ReviewsPage = () => {
  const [openReviews, setOpenReviews] = useState<{ [key: string]: boolean }>({});
  const [formData, setFormData] = useState({
    movieId: '',
    userReviewerId: '65549e6a-2389-42c5-909a-4475fdbb3e69',
    reviewerName: '',
    title: '',
    body: '',
    rating: 5,
  });

  const { data: moviesData, loading: loadingMovies, error: errorMovies } = useQuery(ALL_MOVIES);
  const [fetchReviews, { data: reviewsData, loading: loadingReviews }] = useLazyQuery(MOVIE_REVIEWS);
  const [createReview, { loading: submitting }] = useMutation(CREATE_REVIEW, {
    refetchQueries: [{ query: MOVIE_REVIEWS, variables: { movieId: formData.movieId } }],
    onCompleted: () => {
      alert('Review enviada com sucesso!');
      setFormData(prev => ({ ...prev, reviewerName: '', title: '', body: '', rating: 5 }));
    },
  });

  const toggleReviews = (movieId: string) => {
    setOpenReviews(prev => ({ ...prev, [movieId]: !prev[movieId] }));
    if (!openReviews[movieId]) fetchReviews({ variables: { movieId } });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.movieId || !formData.reviewerName.trim() || !formData.body.trim()) return;

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

  if (loadingMovies) return <Box css={styles.center}><CircularProgress size={80} thickness={5} sx={{ color: colors.red }} /></Box>;
  if (errorMovies) return <Box css={styles.center}><Alert severity="error" sx={{ bgcolor: '#330000', color: '#fff' }}>Erro ao carregar filmes</Alert></Box>;

  return (
    <Container maxWidth="lg" css={styles.container}>
      <Typography variant="h3" css={styles.pageTitle}>
        Movie Reviews
      </Typography>

      <Grid container spacing={5} mb={12}>
        {movies.map((movie: any) => (
          <Grid item xs={12} sm={6} md={4} key={movie.id}>
            <Card css={styles.card}>
              <CardMedia
                component="img"
                height="520"
                image={movie.imgUrl || '/placeholder.jpg'}
                alt={movie.title}
                css={styles.poster}
              />

              <CardContent css={styles.content}>
                <Typography variant="h5" align="center" fontWeight="bold" color={colors.textPrimary} gutterBottom>
                  {movie.title}
                </Typography>
                <Typography variant="body2" align="center" color={colors.textMuted} mb={3}>
                  {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'Ano desconhecido'}
                </Typography>

                <Box textAlign="center" my={3}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => toggleReviews(movie.id)}
                    sx={{
                      minWidth: 300,
                      height: 64,
                      bgcolor: colors.red,
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      borderRadius: 32,
                      textTransform: 'none',
                      boxShadow: '0 10px 40px rgba(229,9,20,0.5)',
                      '&:hover': { bgcolor: '#ff0f1a', transform: 'translateY(-4px)' },
                    }}
                  >
                    {openReviews[movie.id] ? 'Esconder Reviews' : 'Ver Reviews'}
                  </Button>
                </Box>

                <Collapse in={openReviews[movie.id]} timeout="auto" unmountOnExit>
                  <Box css={styles.reviewsContainer}>
                    {loadingReviews ? (
                      <Box textAlign="center" py={5}><CircularProgress size={48} sx={{ color: colors.red }} /></Box>
                    ) : (
                      <>
                        <Typography variant="h6" gutterBottom fontWeight="bold" color={colors.red}>
                          Reviews ({reviewsData?.allMovieReviews?.nodes.length || 0})
                        </Typography>

                        {reviewsData?.allMovieReviews?.nodes.length > 0 ? (
                          reviewsData.allMovieReviews.nodes.map((review: any) => (
                            <Box key={review.id} css={styles.singleReview}>
                              <Box display="flex" alignItems="center" gap={2} mb={2}>
                                <Avatar sx={{ bgcolor: colors.red, fontWeight: 'bold', width: 48, height: 48 }}>
                                  {review.userByUserReviewerId.name[0]}
                                </Avatar>
                                <Box>
                                  <Typography variant="subtitle1" fontWeight="bold" color={colors.textPrimary}>
                                    {review.userByUserReviewerId.name}
                                  </Typography>
                                </Box>
                                <Box ml="auto">
                                  <Rating value={review.rating} readOnly size="small" sx={{ color: colors.red }} />
                                </Box>
                              </Box>

                              {review.title && (
                                <Typography variant="subtitle2" color={colors.textSecondary} fontWeight="bold" mb={1}>
                                  {review.title}
                                </Typography>
                              )}

                              <Typography variant="body1" color={colors.textSecondary} lineHeight={1.8}>
                                {review.body || 'Sem comentário.'}
                              </Typography>

                              <Box my={4} borderTop={`1px solid ${colors.border}`} />
                            </Box>
                          ))
                        ) : (
                          <Typography color={colors.textMuted} textAlign="center" py={6} fontStyle="italic">
                            Ainda não há reviews para este filme.
                          </Typography>
                        )}
                      </>
                    )}
                  </Box>
                </Collapse>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Formulário idêntico ao do safe */}
      <Paper elevation={20} css={styles.formPaper}>
        <Typography variant="h4" align="center" fontWeight="bold" color={colors.red} mb={4}>
          Adicionar Review
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
                onChange={e => setFormData({ ...formData, userReviewerId: e.target.value })}
                sx={{ '& .MuiFilledInput-root': { bgcolor: colors.surface2, borderRadius: 3 } }}
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
                onChange={e => setFormData({ ...formData, reviewerName: e.target.value })}
                sx={{ '& .MuiFilledInput-root': { bgcolor: colors.surface2, borderRadius: 3 } }}
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
                onChange={e => setFormData({ ...formData, movieId: e.target.value })}
                sx={{ '& .MuiFilledInput-root': { bgcolor: colors.surface2, borderRadius: 3 } }}
              >
                {movies.map((m: any) => (
                  <MenuItem key={m.id} value={m.id}>{m.title}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Título da review (opcional)"
                variant="filled"
                fullWidth
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                sx={{ '& .MuiFilledInput-root': { bgcolor: colors.surface2, borderRadius: 3 } }}
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
                onChange={e => setFormData({ ...formData, body: e.target.value })}
                sx={{ '& .MuiFilledInput-root': { bgcolor: colors.surface2, borderRadius: 3 } }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography component="legend" gutterBottom color={colors.textSecondary} fontWeight="bold">
                Sua nota
              </Typography>
              <Rating
                value={formData.rating}
                onChange={(_, v) => setFormData({ ...formData, rating: v || 5 })}
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
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  borderRadius: 38,
                  boxShadow: '0 15px 50px rgba(229,9,20,0.7)',
                  '&:hover': { bgcolor: '#ff0f1a' },
                }}
              >
                {submitting ? <CircularProgress size={40} color="inherit" /> : 'Enviar Review'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

const styles = {
  container: css({
    padding: '100px 20px',
    minHeight: '100vh',
    backgroundColor: colors.bg,
  }),
  pageTitle: css({
    marginBottom: '100px',
    fontWeight: 900,
    fontSize: '4.5rem',
    textAlign: 'center',
    background: `linear-gradient(90deg, ${colors.red}, #ff3333)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }),
  center: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
  }),
  card: css({
    height: '100%',
    backgroundColor: colors.surface,
    borderRadius: 32,
    overflow: 'hidden',
    boxShadow: '0 15px 50px rgba(0,0,0,0.8)',
    transition: 'all 0.5s ease',
    '&:hover': { transform: 'translateY(-24px)', boxShadow: '0 50px 100px rgba(229,9,20,0.35)' },
  }),
  poster: css({
    objectFit: 'cover',
    transition: 'transform 0.7s',
    '&:hover': { transform: 'scale(1.08)' },
  }),
  content: css({ padding: '44px' }),
  reviewsContainer: css({
    backgroundColor: colors.surface2,
    padding: '36px',
    borderRadius: 24,
    border: `1px solid ${colors.border}`,
    marginTop: 28,
  }),
  singleReview: css({ paddingBottom: 28 }),
  formPaper: css({
    padding: '80px 60px',
    borderRadius: 40,
    backgroundColor: colors.surface,
    maxWidth: 1100,
    margin: '140px auto 100px',
    boxShadow: '0 40px 100px rgba(0,0,0,0.9)',
    border: `1px solid ${colors.border}`,
  }),
};

export default ReviewsPage;