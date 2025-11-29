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
import { css, Global } from '@emotion/react';
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

// Paleta Netflix 2025
const colors = {
  bg: '#000000',
  surface: '#141414',
  surfaceHover: '#1f1f1f',
  accent: '#E50914',
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
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

  if (loadingMovies) return <Box css={styles.loader}><CircularProgress size={90} sx={{ color: colors.accent }} /></Box>;
  if (errorMovies) return <Box css={styles.loader}><Alert severity="error">Erro ao carregar filmes</Alert></Box>;

  return (
    <>
      {/* Banner Cinematográfico */}
      <Box css={styles.hero}>
        <Box css={styles.heroOverlay} />
        <Typography variant="h1" css={styles.heroTitle}>
          Movie Reviews
        </Typography>
        <Typography variant="h5" css={styles.heroSubtitle}>
          Descubra o que a galera tá falando sobre os clássicos
        </Typography>
      </Box>

      <Container maxWidth="xl" css={styles.mainContainer}>
        <Grid container spacing={4} justifyContent="center">
          {movies.map((movie: any) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
              <Card css={styles.movieCard}>
                <Box css={styles.posterWrapper}>
                  <CardMedia
                    component="img"
                    image={movie.imgUrl || '/placeholder.jpg'}
                    alt={movie.title}
                    css={styles.poster}
                  />
                  <Box css={styles.posterOverlay} />
                </Box>

                <CardContent css={styles.cardContent}>
                  <Typography variant="h6" css={styles.movieTitle}>
                    {movie.title}
                  </Typography>
                  <Typography variant="body2" css={styles.movieYear}>
                    {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : '????'}
                  </Typography>

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => toggleReviews(movie.id)}
                    css={styles.actionButton}
                  >
                    {openReviews[movie.id] ? 'Esconder Reviews' : 'Ver Reviews'}
                  </Button>

                  <Collapse in={openReviews[movie.id]} timeout={600}>
                    <Box css={styles.reviewsSection}>
                      <Typography variant="subtitle1" css={styles.reviewsHeader}>
                        Reviews ({reviewsData?.allMovieReviews?.nodes.length || 0})
                      </Typography>
                      <Divider sx={{ bgcolor: colors.border, my: 2 }} />

                      {loadingReviews ? (
                        <Box textAlign="center" py={4}><CircularProgress size={36} sx={{ color: colors.accent }} /></Box>
                      ) : reviewsData?.allMovieReviews?.nodes.length > 0 ? (
                        <Box css={styles.reviewsList}>
                          {reviewsData.allMovieReviews.nodes.map((review: any) => (
                            <Box key={review.id} css={styles.reviewCard}>
                              <Box display="flex" alignItems="center" gap={2} mb={1.5}>
                                <Avatar sx={{ bgcolor: colors.accent, width: 40, height: 40 }}>
                                  {review.userByUserReviewerId.name[0]}
                                </Avatar>
                                <Box>
                                  <Typography variant="subtitle2" fontWeight="bold">
                                    {review.userByUserReviewerId.name}
                                  </Typography>
                                  <Rating value={review.rating} readOnly size="small" sx={{ color: '#FFA726' }} />
                                </Box>
                              </Box>
                              {review.title && (
                                <Typography variant="body2" fontWeight="bold" color={colors.textSecondary} mb={1}>
                                  {review.title}
                                </Typography>
                              )}
                              <Typography variant="body2" css={styles.reviewText}>
                                {review.body || 'Sem comentário.'}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        <Typography css={styles.noReviews}>Nenhuma review ainda.</Typography>
                      )}
                    </Box>
                  </Collapse>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Formulário de Nova Review */}
        <Paper css={styles.formContainer} elevation={24}>
          <Typography variant="h4" css={styles.formTitle}>Adicionar Review</Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField select label="Quem está avaliando" fullWidth variant="filled" value={formData.userReviewerId}
                  onChange={(e) => setFormData({ ...formData, userReviewerId: e.target.value })}
                  sx={{ bgcolor: colors.surfaceHover }}>
                  <MenuItem value="65549e6a-2389-42c5-909a-4475fdbb3e69">Ayla</MenuItem>
                  <MenuItem value="5f1e6707-7c3a-4acd-b11f-fd96096abd5a">Chrono</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Seu nome (exibido)" fullWidth variant="filled" required value={formData.reviewerName}
                  onChange={(e) => setFormData({ ...formData, reviewerName: e.target.value })}
                  sx={{ bgcolor: colors.surfaceHover }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField select label="Filme" fullWidth variant="filled" required value={formData.movieId}
                  onChange={(e) => setFormData({ ...formData, movieId: e.target.value })}
                  sx={{ bgcolor: colors.surfaceHover }}>
                  {movies.map((m: any) => <MenuItem key={m.id} value={m.id}>{m.title}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Título da review (opcional)" fullWidth variant="filled" value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  sx={{ bgcolor: colors.surfaceHover }} />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Sua review" fullWidth variant="filled" multiline rows={5} required value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  placeholder="Conte tudo o que achou..."
                  sx={{ bgcolor: colors.surfaceHover }} />
              </Grid>
              <Grid item xs={12}>
                <Typography gutterBottom>Sua nota</Typography>
                <Rating value={formData.rating} onChange={(_, v) => setFormData({ ...formData, rating: v || 5 })} size="large" />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" fullWidth size="large" disabled={submitting}
                  sx={{ height: 64, bgcolor: colors.accent, fontSize: '1.3rem', fontWeight: 'bold', borderRadius: 4,
                    '&:hover': { bgcolor: '#f40612' } }}>
                  {submitting ? <CircularProgress size={32} color="inherit" /> : 'Enviar Review'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

// ESTILOS — NÍVEL NETFLIX
const styles = {
  hero: css({
    position: 'relative',
    height: '90vh',
    background: 'linear-gradient(135deg, #000000 0%, #1a0000 100%), ur[](https://images.alphacoders.com/132/1326147.jpg) center/cover no-repeat',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: '#fff',
    marginBottom: '100px',
  }),
  heroOverlay: css({
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.9) 100%)',
  }),
  heroTitle: css({
    fontSize: '7rem',
    fontWeight: 900,
    letterSpacing: '-0.05em',
    background: 'linear-gradient(90deg, #E50914, #ff4d4d)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    zIndex: 1,
  }),
  heroSubtitle: css({ zIndex: 1, opacity: 0.9, maxWidth: 800, fontWeight: 300 }),
  mainContainer: css({ paddingBottom: '150px' }),
  movieCard: css({
    backgroundColor: colors.surface,
    borderRadius: '16px',
    overflow: 'hidden',
    transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
    '&:hover': { transform: 'translateY(-16px)', boxShadow: '0 32px 64px rgba(229,9,20,0.3)' },
  }),
  posterWrapper: css({ position: 'relative', overflow: 'hidden' }),
  poster: css({
    width: '100%',
    height: '450px',
    objectFit: 'cover',
    transition: 'transform 0.6s ease',
    '&:hover': { transform: 'scale(1.1)' },
  }),
  posterOverlay: css({
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)',
  }),
  cardContent: css({ padding: '24px', color: '#fff' }),
  movieTitle: css({ fontWeight: 700, mb: 1, fontSize: '1.4rem' }),
  movieYear: css({ color: colors.textMuted, mb: 3 }),
  actionButton: css({
    mt: 2,
    height: 56,
    borderRadius: 28,
    bgcolor: colors.accent,
    fontWeight: 'bold',
    fontSize: '1.1rem',
    '&:hover': { bgcolor: '#f40612', transform: 'scale(1.05)' },
  }),
  reviewsSection: css({
    mt: 4,
    maxHeight: '600px',
    transition: 'all 0.6s ease',
  }),
  reviewsHeader: css({ color: colors.accent, fontWeight: 'bold' }),
  reviewsList: css({
    maxHeight: '520px',
    overflowY: 'auto',
    pr: 1,
    '&::-webkit-scrollbar': { width: '8px' },
    '&::-webkit-scrollbar-track': { background: 'transparent' },
    '&::-webkit-scrollbar-thumb': { background: '#333', borderRadius: '4px' },
  }),
  reviewCard: css({
    backgroundColor: colors.surfaceHover,
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '16px',
    border: `1px solid ${colors.border}`,
  }),
  reviewText: css({
    color: colors.textSecondary,
    lineHeight: 1.7,
    fontSize: '0.95rem',
  }),
  noReviews: css({ color: colors.textMuted, textAlign: 'center', py: 6, fontStyle: 'italic' }),
  formContainer: css({
    mt: '120px',
    maxWidth: 900,
    margin: '120px auto',
    padding: '60px 50px',
    backgroundColor: colors.surface,
    borderRadius: '24px',
    boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
  }),
  formTitle: css({ color: colors.accent, textAlign: 'center', fontWeight: 900 }),
  loader: css({ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }),
};

export default ReviewsPage;