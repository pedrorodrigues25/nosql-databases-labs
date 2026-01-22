// Query 16: Revenue by Neighbourhood and Room Type // Título da consulta
// Cross-dimensional analysis // Descrição em inglês
// Usage: mongosh queries/16_revenue_by_neighbourhood_roomtype.mongosh.js // Como executar

// Seleciona o banco de dados correto
db = db.getSiblingDB("group_04_airbnb"); // Troca para o DB do grupo

// Imprime o título da consulta no terminal
print("\n=== Revenue by Neighbourhood and Room Type ===\n");

// Inicia a agregação na coleção "bookings"
db.bookings
  .aggregate([
    // Filtra apenas reservas concluídas
    { $match: { status: "completed" } },
    // Junta detalhes do alojamento à reserva
    {
      $lookup: {
        from: "listings", // Coleção de alojamentos
        localField: "listing_id", // Campo de ligação
        foreignField: "listing_id", // Campo de ligação
        as: "listing" // Nome do campo resultante
      }
    },
    // Desfaz o array de alojamento para cada reserva
    { $unwind: "$listing" },
    // Agrupa por bairro e tipo de quarto
    {
      $group: {
        _id: {
          neighbourhood: "$listing.location.neighbourhood", // Bairro
          room_type: "$listing.room_type" // Tipo de quarto
        },
        revenue: { $sum: "$total_price" }, // Receita total
        bookings: { $sum: 1 }, // Número de reservas
        total_nights: { $sum: "$nights" }, // Total de noites
        avg_booking_value: { $avg: "$total_price" } // Valor médio por reserva
      }
    },
    // Ordena pela receita total (maior para menor)
    { $sort: { revenue: -1 } },
    // Limita aos 20 principais combinações
    { $limit: 20 }
  ])
  // Para cada documento do resultado, imprime em formato JSON
  .forEach((doc) => printjson(doc));

// Imprime mensagem de sucesso no terminal
print("\n✓ Query executed successfully\n");
