// Query 14: Luxury Listings Analysis (Price > €150) // Título da consulta
// Premium market segment analysis // Descrição em inglês
// Usage: mongosh queries/14_luxury_listings.mongosh.js // Como executar

// Seleciona o banco de dados correto
db = db.getSiblingDB("group_04_airbnb"); // Troca para o DB do grupo

// Imprime o título da consulta no terminal
print("\n=== Luxury Listings (Price > €150) ===\n");

// Inicia a agregação na coleção "listings"
db.listings
  .aggregate([
    // Filtra apenas alojamentos de luxo (preço > 150)
    { $match: { price: { $gt: NumberDecimal("150") } } },
    // Projeta os campos relevantes
    {
      $project: {
        _id: 0, // Não mostrar o campo _id
        listing_id: 1, // Mostrar o id do alojamento
        name: 1, // Mostrar o nome
        host_name: "$host.host_name", // Mostrar o nome do anfitrião
        neighbourhood: "$location.neighbourhood", // Mostrar o bairro
        room_type: 1, // Mostrar o tipo de quarto
        price: 1, // Mostrar o preço
        accommodates: "$capacity.accommodates", // Mostrar capacidade
        bedrooms: "$capacity.bedrooms", // Mostrar número de quartos
        rating: "$reviews.review_scores_rating", // Mostrar nota média
        reviews: "$reviews.number_of_reviews" // Mostrar número de avaliações
      }
    },
    // Ordena pelo preço (maior para menor)
    { $sort: { price: -1 } },
    // Limita aos 20 principais
    { $limit: 20 }
  ])
  // Para cada documento do resultado, imprime em formato JSON
  .forEach((doc) => printjson(doc));

// Imprime mensagem de sucesso no terminal
print("\n✓ Query executed successfully\n");
