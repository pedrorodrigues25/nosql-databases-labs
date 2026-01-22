// Query 12: Listings Without Bookings // Título da consulta
// Underperforming inventory identification // Descrição em inglês
// Usage: mongosh queries/12_listings_without_bookings.mongosh.js // Como executar

// Seleciona o banco de dados correto
db = db.getSiblingDB("group_04_airbnb"); // Troca para o DB do grupo

// Imprime o título da consulta no terminal
print("\n=== Listings Without Any Bookings ===\n");

// Obtém todos os IDs de alojamentos que têm reservas
const listingsWithBookings = db.bookings.distinct("listing_id"); // Array de IDs

// Busca alojamentos que não têm reservas
db.listings
  .find(
    { listing_id: { $nin: listingsWithBookings } }, // Filtro: alojamentos sem reservas
    {
      _id: 0, // Não mostrar o campo _id
      listing_id: 1, // Mostrar o id do alojamento
      name: 1, // Mostrar o nome
      host: 1, // Mostrar o anfitrião
      neighbourhood: "$location.neighbourhood", // Mostrar o bairro
      room_type: 1, // Mostrar o tipo de quarto
      price: 1, // Mostrar o preço
      availability_365: "$booking_rules.availability_365", // Mostrar disponibilidade anual
      number_of_reviews: "$reviews.number_of_reviews" // Mostrar número de avaliações
    }
  )
  // Ordena pelo preço (menor para maior)
  .sort({ price: 1 })
  // Limita aos 25 resultados principais
  .limit(25)
  // Para cada documento do resultado, imprime em formato JSON
  .forEach((doc) => printjson(doc));

// Imprime mensagem de sucesso no terminal
print("\n✓ Query executed successfully\n");
