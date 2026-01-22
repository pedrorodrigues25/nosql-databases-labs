// Query 19: Capacity Analysis by Neighbourhood // Título da consulta
// Identifies accommodation capacity distribution for tourism planning // Descrição em inglês
// Usage: mongosh queries/19_capacity_by_neighbourhood.mongosh.js // Como executar

// Seleciona o banco de dados correto
db = db.getSiblingDB("group_04_airbnb"); // Troca para o DB do grupo

// Imprime o título da consulta no terminal
print("\n=== Accommodation Capacity Analysis by Neighbourhood ===\n");

// Inicia a agregação na coleção "listings"
db.listings
  .aggregate([
    // Agrupa por bairro
    {
      $group: {
        _id: "$location.neighbourhood", // Bairro
        total_listings: { $sum: 1 }, // Total de alojamentos
        total_beds: { $sum: "$capacity.beds" }, // Total de camas
        total_accommodates: { $sum: "$capacity.accommodates" }, // Total de capacidade
        avg_beds_per_listing: { $avg: "$capacity.beds" }, // Média de camas por alojamento
        avg_accommodates: { $avg: "$capacity.accommodates" }, // Média de capacidade por alojamento
        max_capacity_listing: { $max: "$capacity.accommodates" }, // Maior capacidade individual
        listings_with_multiple_bedrooms: {
          $sum: { $cond: [{ $gte: ["$capacity.bedrooms", 2] }, 1, 0] }, // Contagem de alojamentos com 2+ quartos
        },
      },
    },
    // Adiciona cálculos de percentagem e arredondamentos
    {
      $project: {
        neighbourhood: "$_id", // Bairro
        total_listings: 1, // Total de alojamentos
        total_beds: 1, // Total de camas
        total_accommodates: 1, // Total de capacidade
        avg_beds_per_listing: { $round: ["$avg_beds_per_listing", 2] }, // Média arredondada
        avg_accommodates: { $round: ["$avg_accommodates", 2] }, // Média arredondada
        max_capacity_listing: 1, // Maior capacidade individual
        listings_with_multiple_bedrooms: 1, // Contagem de alojamentos com 2+ quartos
        capacity_per_listing: {
          $round: [{ $divide: ["$total_accommodates", "$total_listings"] }, 2], // Capacidade média por alojamento
        },
      },
    },
    // Ordena pelo total de capacidade (maior para menor)
    { $sort: { total_accommodates: -1 } },
  ])
  // Para cada documento do resultado, imprime em formato JSON
  .forEach((doc) => printjson(doc));

// Imprime mensagem de sucesso no terminal
print("\n✓ Query executed successfully\n");
