// Query 11: Host Performance Metrics // Título da consulta
// Host evaluation and ranking // Descrição em inglês
// Usage: mongosh queries/11_host_performance_metrics.mongosh.js // Como executar

// Seleciona o banco de dados correto
db = db.getSiblingDB("group_04_airbnb"); // Troca para o DB do grupo

// Imprime o título da consulta no terminal
print("\n=== Host Performance Metrics ===\n");

// Inicia a agregação na coleção "bookings"
db.bookings
  .aggregate([
    // Filtra apenas reservas concluídas
    { $match: { status: "completed" } },
    // Agrupa por anfitrião
    {
      $group: {
        _id: "$host_id", // ID do anfitrião
        total_bookings: { $sum: 1 }, // Número total de reservas
        total_revenue: { $sum: "$total_price" }, // Receita total
        total_nights: { $sum: "$nights" }, // Total de noites
        avg_booking_value: { $avg: "$total_price" }, // Valor médio por reserva
        unique_listings: { $addToSet: "$listing_id" } // Lista de alojamentos únicos
      }
    },
    // Adiciona campos calculados
    {
      $project: {
        host_id: "$_id", // ID do anfitrião
        total_bookings: 1, // Número total de reservas
        total_revenue: 1, // Receita total
        total_nights: 1, // Total de noites
        avg_booking_value: 1, // Valor médio por reserva
        listings_with_bookings: { $size: "$unique_listings" }, // Quantidade de alojamentos
        avg_revenue_per_night: { $divide: ["$total_revenue", "$total_nights"] } // Receita média por noite
      }
    },
    // Ordena pela receita total (maior para menor)
    { $sort: { total_revenue: -1 } },
    // Limita aos 15 principais
    { $limit: 15 }
  ])
  // Para cada documento do resultado, imprime em formato JSON
  .forEach((doc) => printjson(doc));

// Imprime mensagem de sucesso no terminal
print("\n✓ Query executed successfully\n");
