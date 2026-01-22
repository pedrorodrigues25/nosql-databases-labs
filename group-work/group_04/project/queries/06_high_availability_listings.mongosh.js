// Query 06: High Availability Listings (Available > 300 days) // Título da consulta
// Investment opportunity analysis // Descrição em inglês
// Usage : mongosh queries/06_high_availability_listings.mongosh.js // Como executar

// Seleciona o banco de dados correto
db = db.getSiblingDB("group_04_airbnb"); // Troca para o DB do grupo

// Imprime o título da consulta no terminal
print("\n=== High Availability Listings (>300 days/year) ===\n");

// Busca alojamentos com alta disponibilidade
db.listings
  .find(
    { "booking_rules.availability_365": { $gt: 300 } }, // Filtro: disponibilidade maior que 300 dias
    {
      _id: 0, // Não mostrar o campo _id
      listing_id: 1, // Mostrar o id do alojamento
      name: 1, // Mostrar o nome
      neighbourhood: "$location.neighbourhood", // Mostrar o bairro
      room_type: 1, // Mostrar o tipo de quarto
      price: 1, // Mostrar o preço
      availability_365: "$booking_rules.availability_365", // Mostrar disponibilidade anual
      number_of_reviews: "$reviews.number_of_reviews" // Mostrar número de avaliações
    }
  )
  // Ordena pela disponibilidade anual (maior para menor)
  .sort({ "booking_rules.availability_365": -1 })
  // Limita aos 15 resultados principais
  .limit(15)
  // Para cada documento do resultado, imprime em formato JSON
  .forEach((doc) => printjson(doc));

// Imprime mensagem de sucesso no terminal
print("\n✓ Query executed successfully\n");
