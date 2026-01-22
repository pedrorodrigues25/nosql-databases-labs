// Query 09: Most Profitable Listings // Título da consulta
// Revenue leaders identification // Descrição em inglês
// Usage: mongosh queries/09_most_profitable_listings.mongosh.js // Como executar

// Seleciona o banco de dados correto
db = db.getSiblingDB("group_04_airbnb"); // Troca para o DB do grupo

// Imprime o título da consulta no terminal
print("\n=== Top 15 Most Profitable Listings ===\n");

// Inicia a agregação na coleção "bookings"
db.bookings
  .aggregate([
    // Filtra apenas reservas concluídas
    { $match: { status: "completed" } },
    // Agrupa por alojamento
    {
      $group: {
        _id: "$listing_id", // ID do alojamento
        listing_name: { $first: "$listing_name" }, // Nome do alojamento
        total_revenue: { $sum: "$total_price" }, // Receita total
        booking_count: { $sum: 1 }, // Número de reservas
        total_nights: { $sum: "$nights" }, // Total de noites
        avg_revenue_per_booking: { $avg: "$total_price" } // Receita média por reserva
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
