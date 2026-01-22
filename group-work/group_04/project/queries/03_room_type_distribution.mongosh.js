// Query 03: Listings by Room Type Distribution // Título da consulta
// Property portfolio analysis // Descrição em inglês
// Usage : mongosh queries/03_room_type_distribution.mongosh.js // Como executar

// Seleciona o banco de dados correto
// "group_04_airbnb" é o nome da base de dados

db = db.getSiblingDB("group_04_airbnb");

// Imprime o título da consulta no terminal
print("\n=== Listings by Room Type ===\n");

// Inicia a agregação na coleção "listings"
db.listings
  .aggregate([
    {
      // Agrupa por tipo de quarto
      $group: {
        _id: "$room_type", // Tipo de quarto
        count: { $sum: 1 }, // Quantidade de alojamentos
        avg_price: { $avg: "$price" }, // Preço médio
        avg_rating: { $avg: "$reviews.review_scores_rating" }, // Nota média
        total_capacity: { $sum: "$capacity.accommodates" }, // Capacidade total
      },
    },
    {
      // Agrupa todos os tipos para calcular o total
      $group: {
        _id: null,
        total: { $sum: "$count" }, // Total de alojamentos
        room_types: { $push: "$$ROOT" }, // Lista de tipos de quarto
      },
    },
    {
      // Desfaz agrupamento para calcular percentagem
      $unwind: "$room_types",
    },
    {
      // Projeta campos finais
      $project: {
        _id: 0,
        room_type: "$room_types._id", // Tipo de quarto
        count: "$room_types.count", // Quantidade
        percentage: {
          $multiply: [{ $divide: ["$room_types.count", "$total"] }, 100], // Percentagem
        },
        avg_price: "$room_types.avg_price", // Preço médio
        avg_rating: "$room_types.avg_rating", // Nota média
        total_capacity: "$room_types.total_capacity", // Capacidade total
      },
    },
    {
      // Ordena por quantidade de alojamentos
      $sort: { count: -1 },
    },
  ])
  // Para cada documento do resultado, imprime em formato JSON
  .forEach((doc) => printjson(doc));

// Imprime mensagem de sucesso no terminal
print("\n✓ Query executed successfully\n");
