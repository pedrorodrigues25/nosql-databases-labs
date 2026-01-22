// Query 13: Neighbourhood Comparison Metrics // Título da consulta
// Geographic performance dashboard // Descrição em inglês
// Usage: mongosh queries/13_neighbourhood_comparison.mongosh.js // Como executar

// Seleciona o banco de dados correto
db = db.getSiblingDB("group_04_airbnb"); // Troca para o DB do grupo

// Imprime o título da consulta no terminal
print("\n=== Performance Comparison by Neighbourhood ===\n");

// Inicia a agregação na coleção "listings"
db.listings
  .aggregate([
    // Agrupa por bairro
    {
      $group: {
        _id: "$location.neighbourhood", // Bairro
        total_listings: { $sum: 1 }, // Total de alojamentos
        avg_price: { $avg: "$price" }, // Preço médio
        avg_rating: { $avg: "$reviews.review_scores_rating" }, // Nota média
        total_reviews: { $sum: "$reviews.number_of_reviews" }, // Total de avaliações
        total_capacity: { $sum: "$capacity.accommodates" }, // Capacidade total
        avg_availability: { $avg: "$booking_rules.availability_365" } // Disponibilidade média
      }
    },
    // Calcula reviews por alojamento e arredonda valores
    {
      $project: {
        neighbourhood: "$_id", // Bairro
        total_listings: 1, // Total de alojamentos
        avg_price: { $round: ["$avg_price", 2] }, // Preço médio arredondado
        avg_rating: { $round: ["$avg_rating", 2] }, // Nota média arredondada
        total_reviews: 1, // Total de avaliações
        reviews_per_listing: {
          $round: [{ $divide: ["$total_reviews", "$total_listings"] }, 2] // Média de avaliações por alojamento
        },
        total_capacity: 1, // Capacidade total
        avg_availability: { $round: ["$avg_availability", 0] } // Disponibilidade média arredondada
      }
    },
    // Ordena pelo número de alojamentos (maior para menor)
    { $sort: { total_listings: -1 } }
  ])
  // Para cada documento do resultado, imprime em formato JSON
  .forEach((doc) => printjson(doc));

// Imprime mensagem de sucesso no terminal
print("\n✓ Query executed successfully\n");
