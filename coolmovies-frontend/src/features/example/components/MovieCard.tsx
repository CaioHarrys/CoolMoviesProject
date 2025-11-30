"use client";

import React, { useState, useRef, useEffect } from "react"; // 👈 Adicionar useRef e useEffect
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Collapse,
  Rating,
  CircularProgress,
  Zoom,
} from "@mui/material";
import { motion } from "framer-motion";


type Movie = {
  id: string;
  title: string;
  imgUrl?: string;
  releaseDate?: string;
};

type Review = {
  id: string;
  title?: string;
  body?: string;
  rating: number;
  userByUserReviewerId: { name: string };
};

type MovieCardProps = {
  movie: Movie;
  index: number;
  openReviews: Record<string, boolean>;
  toggleReviews: (id: string) => void;
  loadingReviews?: boolean;
  reviewsData?: {
    allMovieReviews?: { nodes: Review[] };
  };
};

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  index,
  openReviews,
  toggleReviews,
  loadingReviews = false,
  reviewsData,
}) => {
  const [openReviewItem, setOpenReviewItem] = useState<Record<string, boolean>>({});
  
  // 1. Criar a referência para o Card
  const cardRef = useRef<HTMLDivElement>(null); 

  const toggleSingleReview = (reviewId: string) => {
    setOpenReviewItem(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const isReviewsOpen = openReviews[movie.id];
  
  // 2. Lógica para fechar ao clicar fora (Click Outside)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Verifica se o card está aberto E se o clique foi fora do elemento referenciado.
      if (isReviewsOpen && cardRef.current && !cardRef.current.contains(event.target as Node)) {
        // Se o clique foi fora do card, fechar as reviews.
        toggleReviews(movie.id);
      }
    };

    // Adiciona o event listener ao documento quando o componente é montado ou isReviewsOpen muda
    document.addEventListener("mousedown", handleClickOutside);

    // Remove o event listener quando o componente é desmontado
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isReviewsOpen, movie.id, toggleReviews]); // Dependências: re-executar quando o estado ou o ID do filme mudar

  return (
    <Grid item>
      <Zoom in style={{ transitionDelay: `${index * 80}ms` }}>
        <motion.div
          initial={{ opacity: 0, }}
          animate={{ opacity: 1, }}
          transition={{ duration: 2, delay: index * 0.6 }}
          // whileHover={{ y: -8 }}
        >
          {/* 3. Atribuir a referência ao elemento principal do Card */}
          <Card className="cooler-card" ref={cardRef}> 
            {/* Poster */}
            <div className="cooler-poster">
              <img src={movie.imgUrl || "/placeholder.jpg"} alt={movie.title} />
            </div>

            <CardContent className="cooler-content">
              <Typography className="cooler-title">{movie.title}</Typography>
              <Typography className="cooler-year">
                {movie.releaseDate
                  ? new Date(movie.releaseDate).getFullYear()
                  : "Ano desconhecido"}
              </Typography>
              
              <button className="cooler-button" onClick={() => toggleReviews(movie.id)}>
                {isReviewsOpen ? "Esconder Reviews" : "Reviews"}
              </button>
              
              <Collapse in={isReviewsOpen} timeout={600} unmountOnExit>
                <div className="cooler-reviews">
                  {loadingReviews ? (
                    <Box textAlign="center" py={5}>
                      <CircularProgress size={48} sx={{ color: "#E50914" }} />
                    </Box>
                  ) : (
                    <>
                      <Typography variant="h6" color="#E50914" fontWeight="bold" gutterBottom>
                        Reviews ({reviewsData?.allMovieReviews?.nodes.length || 0})
                      </Typography>

                      {reviewsData?.allMovieReviews?.nodes.length ? (
                        reviewsData.allMovieReviews.nodes.map((review) => {
                          const isOpen = openReviewItem[review.id];

                          return (
                            <div
                              key={review.id}
                              className={`cooler-review-item-accordion ${isOpen ? "open" : ""}`}
                            >
                              <div
                                className="cooler-review-header"
                                onClick={() => toggleSingleReview(review.id)}
                              >
                                <div className="cooler-review-avatar">
                                  {review.userByUserReviewerId.name[0].toUpperCase()}
                                </div>

                                <div className="cooler-review-username-wrapper">
                                  <Typography className="cooler-review-username">
                                    {review.userByUserReviewerId.name}
                                  </Typography>
                                  <div className="cooler-review-underline"></div>
                                </div>

                                <Box ml="auto">
                                  <Rating value={review.rating} readOnly size="small" sx={{ color: "#E50914" }} />
                                </Box>
                              </div>

                              <Collapse in={isOpen} timeout={400} unmountOnExit>
                                <div className="cooler-review-body-area">
                                  {review.title && (
                                    <Typography className="cooler-review-title">
                                      {review.title}
                                    </Typography>
                                  )}
                                  <Typography className="cooler-review-body">
                                    {review.body || "Sem comentário."}
                                  </Typography>
                                </div>
                              </Collapse>
                            </div>
                          );
                        })
                      ) : (
                        <div className="cooler-no-reviews">
                          Ainda não há reviews para este filme.
                        </div>
                      )}
                    </>
                  )}
                </div>
              </Collapse>
            </CardContent>
          </Card>
        </motion.div>
      </Zoom>
    </Grid>
  );
};

export default MovieCard;