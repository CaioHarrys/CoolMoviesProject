import { Container, Typography, Grid, Card, CardContent, CardMedia, Avatar, Box, Rating } from '@mui/material';
import { css } from '@emotion/react';

const ReviewsPage = () => {
  // Dados mockados (depois você vai substituir por data do GraphQL)
  const reviews = [
    {
      id: 1,
      movieTitle: "Duna: Parte Dois",
      moviePoster: "https://image.tmdb.org/t/p/w500/8zP7P6cKWa1J5L1mYjN7iLldZ8R.jpg",
      userName: "Ana Silva",
      userAvatar: "A",
      rating: 5,
      reviewText: "Melhor filme de ficção científica dos últimos 10 anos! Visual incrível, trilha sonora perfeita e atuações impecáveis. Denis Villeneuve é gênio!",
      date: "2024-03-15",
    },
    {
      id: 2,
      movieTitle: "Oppenheimer",
      moviePoster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFC0TApY0n0m4YSSi6XAs.jpg",
      userName: "Carlos Oliveira",
      userAvatar: "C",
      rating: 4,
      reviewText: "Filme denso, técnico e muito bem dirigido. Diálogos excelentes, mas exige atenção total. Cillian Murphy está incrível como sempre.",
      date: "2023-07-21",
    },
  ];

  return (
    <Container maxWidth="lg" css={styles.container}>
      {/* Título da página */}
      <Typography variant="h3" component="h1" gutterBottom align="center" css={styles.pageTitle}>
        Todas as Avaliações
      </Typography>

      {/* Grid com os cards */}
      <Grid container spacing={4}>
        {reviews.map((review) => (
          <Grid item xs={12} sm={6} md={6} key={review.id}>
            <Card css={styles.card}>
              <CardMedia
                component="img"
                height="400"
                image={review.moviePoster}
                alt={review.movieTitle}
                css={styles.poster}
              />
              <CardContent css={styles.content}>
                <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
                  {review.movieTitle}
                </Typography>

                {/* Usuário + Avatar + Rating */}
                <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                  <Avatar css={styles.avatar}>{review.userAvatar}</Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {review.userName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(review.date).toLocaleDateString('pt-BR')}
                    </Typography>
                  </Box>
                  <Box ml="auto">
                    <Rating value={review.rating} readOnly size="small" />
                  </Box>
                </Box>

                {/* Texto da review */}
                <Typography variant="body1" color="text.secondary" css={styles.reviewText}>
                  {review.reviewText}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Caso não tenha reviews (futuro) */}
      {reviews.length === 0 && (
        <Typography variant="h6" color="text.secondary" align="center" mt={8}>
          Nenhuma avaliação encontrada.
        </Typography>
      )}
    </Container>
  );
};

// Estilos com Emotion (mesmo padrão do projeto)
const styles = {
  container: css({
    padding: '40px 20px',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  }),
  pageTitle: css({
    marginBottom: '40px',
    fontWeight: 700,
    color: '#1976d2',
  }),
  card: css({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
    },
  }),
  poster: css({
    objectFit: 'cover',
  }),
  content: css({
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  }),
  avatar: css({
    backgroundColor: '#1976d2',
    fontWeight: 'bold',
  }),
  reviewText: css({
    lineHeight: 1.7,
    marginTop: 8,
  }),
};

export default ReviewsPage;