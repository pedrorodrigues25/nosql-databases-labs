// Query 07: Low-Rated Listings (Rating < 4.0) // Título da consulta
// Quality control and improvement opportunities // Descrição em inglês
// Usage : mongosh queries/07_low_rated_listings.mongosh.js // Como executar

// Seleciona o banco de dados correto
db = db.getSiblingDB("group_04_airbnb"); // Troca para o DB do grupo

// Imprime o título da consulta no terminal
print("\n=== Low-Rated Listings (Rating < 4.0) ===\n");

// Busca alojamentos com avaliação baixa
db.listings
  .find(
    {
      "reviews.review_scores_rating": { $lt: 4.0 }, // Filtro: nota média menor que 4.0
      "reviews.number_of_reviews": { $gt: 0 } // Filtro: tem pelo menos uma avaliação
    },
    {
      _id: 0, // Não mostrar o campo _id
      listing_id: 1, // Mostrar o id do alojamento
      name: 1, // Mostrar o nome
      host: 1, // Mostrar o anfitrião
      neighbourhood: "$location.neighbourhood", // Mostrar o bairro
      room_type: 1, // Mostrar o tipo de quarto
      price: 1, // Mostrar o preço
      review_scores_rating: "$reviews.review_scores_rating", // Mostrar nota média
      number_of_reviews: "$reviews.number_of_reviews" // Mostrar número de avaliações
    }
  )
  // Ordena pela nota média (menor para maior)
  .sort({ "reviews.review_scores_rating": 1 })
  // Limita aos 20 resultados principais
  .limit(20)
  // Para cada documento do resultado, imprime em formato JSON
  .forEach((doc) => printjson(doc));

// Imprime mensagem de sucesso no terminal
print("\n✓ Query executed successfully\n");
