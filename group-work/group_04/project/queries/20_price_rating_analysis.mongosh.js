// Query 20: Price vs Rating Correlation Analysis // Título da consulta
// Analyzes relationship between price ranges and guest ratings // Descrição em inglês
// Usage: mongosh queries/20_price_rating_analysis.mongosh.js // Como executar

// Seleciona o banco de dados correto
db = db.getSiblingDB("group_04_airbnb"); // Troca para o DB do grupo

// Imprime o título da consulta no terminal
print("\n=== Price vs Rating Correlation Analysis ===\n");

// Inicia a agregação na coleção "listings"
db.listings
  .aggregate([
    // Filtra apenas alojamentos com avaliações
    { $match: { "reviews.number_of_reviews": { $gt: 0 } } },
    // Agrupa por faixas de preço
    {
      $bucket: {
        groupBy: "$price", // Campo de agrupamento
        boundaries: [
          NumberDecimal("0"),
          NumberDecimal("50"),
          NumberDecimal("75"),
          NumberDecimal("100"),
          NumberDecimal("125"),
          NumberDecimal("150"),
          NumberDecimal("200"),
          NumberDecimal("500"),
        ], // Limites das faixas
        default: "500+", // Faixa padrão para valores acima de 500
        output: {
          count: { $sum: 1 }, // Quantidade de alojamentos
          avg_rating: { $avg: "$reviews.review_scores_rating" }, // Nota média
          min_rating: { $min: "$reviews.review_scores_rating" }, // Nota mínima
          max_rating: { $max: "$reviews.review_scores_rating" }, // Nota máxima
          total_reviews: { $sum: "$reviews.number_of_reviews" }, // Total de avaliações
          avg_reviews_per_listing: { $avg: "$reviews.number_of_reviews" }, // Média de avaliações por alojamento
          sample_listings: {
            $push: { name: "$name", price: "$price", rating: "$reviews.review_scores_rating" }, // Exemplos
          },
        },
      },
    },
    // Formata o resultado final
    {
      $project: {
        price_range: "$_id", // Faixa de preço
        count: 1, // Quantidade
        avg_rating: { $round: ["$avg_rating", 2] }, // Nota média arredondada
        min_rating: 1, // Nota mínima
        max_rating: 1, // Nota máxima
        total_reviews: 1, // Total de avaliações
        avg_reviews_per_listing: { $round: ["$avg_reviews_per_listing", 1] }, // Média arredondada
        sample_listings: 1 // Exemplos de alojamentos
      }
    }
  ])
  // Para cada documento do resultado, imprime em formato JSON
  .forEach((doc) => printjson(doc));

// Imprime mensagem de sucesso no terminal
print("\n✓ Query executed successfully\n");
