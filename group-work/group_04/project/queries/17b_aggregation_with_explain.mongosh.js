// Query 17b: Complex Aggregation with Indexes // Título da consulta
// Performance comparison with indexes applied // Descrição em inglês
// Usage: mongosh queries/17b_aggregation_with_explain.mongosh.js // Como executar

// Seleciona o banco de dados correto
db = db.getSiblingDB("group_04_airbnb"); // Troca para o DB do grupo

// Imprime o título da consulta no terminal
print("\n=== Complex Aggregation: Revenue by Neighbourhood (WITH INDEXES) ===\n");

// Garante que os índices necessários existem
print("Creating/ensuring indexes exist...\n"); // Mensagem informativa
load("queries/index_blueprint.mongosh.js"); // Carrega script de índices

// Imprime mensagem antes de executar agregação
print("\n=== Running Aggregation with Index Support ===\n");

// Define o pipeline de agregação
const pipeline = [
  // Filtra apenas reservas concluídas
  { $match: { status: "completed" } },
  // Junta detalhes do alojamento à reserva
  {
    $lookup: {
      from: "listings", // Coleção de alojamentos
      localField: "listing_id", // Campo de ligação
      foreignField: "listing_id", // Campo de ligação
      as: "listing", // Nome do campo resultante
    },
  },
  // Desfaz o array de alojamento para cada reserva
  { $unwind: "$listing" },
  // Agrupa por bairro
  {
    $group: {
      _id: "$listing.location.neighbourhood", // Bairro
      revenue: { $sum: "$total_price" }, // Receita total
      bookings: { $sum: 1 }, // Número de reservas
      total_nights: { $sum: "$nights" }, // Total de noites
      unique_guests: { $addToSet: "$guest.guest_id" }, // IDs únicos de hóspedes
      unique_listings: { $addToSet: "$listing_id" }, // IDs únicos de alojamentos
    },
  },
  // Adiciona campos calculados
  {
    $project: {
      _id: 1, // Bairro
      revenue: 1, // Receita total
      bookings: 1, // Número de reservas
      total_nights: 1, // Total de noites
      unique_guests_count: { $size: "$unique_guests" }, // Número de hóspedes únicos
      unique_listings_count: { $size: "$unique_listings" }, // Número de alojamentos únicos
      avg_revenue_per_booking: { $divide: ["$revenue", "$bookings"] }, // Receita média por reserva
      avg_nights_per_booking: { $divide: ["$total_nights", "$bookings"] }, // Noites médias por reserva
    },
  },
  // Ordena pela receita total (maior para menor)
  { $sort: { revenue: -1 } },
  // Limita aos 10 principais
  { $limit: 10 },
];

print("Aggregation results:");
db.bookings.aggregate(pipeline).forEach((doc) => printjson(doc));

// Execute with explain for execution statistics
print("\n=== Execution Statistics (WITH INDEXES) ===\n");
const explainResult = db.bookings.explain("executionStats").aggregate(pipeline);

const execStats = explainResult.stages
  ? explainResult.stages[0].$cursor.executionStats
  : explainResult.executionStats;

printjson({
  executionTimeMillis: execStats.executionTimeMillis,
  totalDocsExamined: execStats.totalDocsExamined,
  totalKeysExamined: execStats.totalKeysExamined,
  nReturned: execStats.nReturned,
});

print("\n✓ Query executed successfully\n");
print("Compare these results with Query 20 (without indexes) to see performance improvement.\n");
