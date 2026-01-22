// Query 08: Revenue Analysis by Price Category // Título da consulta
// Financial segmentation analysis // Descrição em inglês
// Usage: mongosh queries/08_revenue_by_price_category.mongosh.js // Como executar

// Seleciona o banco de dados correto
db = db.getSiblingDB("group_04_airbnb"); // Troca para o DB do grupo

// Imprime o título da consulta no terminal
print("\n=== Revenue Analysis by Price Category ===\n");

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
    // Agrupa por categoria de preço do alojamento
    {
      $group: {
        _id: "$listing.price_category", // Categoria de preço
        total_revenue: { $sum: "$total_price" }, // Receita total
        total_bookings: { $sum: 1 }, // Número de reservas
        total_nights: { $sum: "$nights" }, // Total de noites
        avg_booking_value: { $avg: "$total_price" } // Valor médio por reserva
      }
    },
    // Ordena pela receita total (maior para menor)
    { $sort: { total_revenue: -1 } }
  ])
  // Para cada documento do resultado, imprime em formato JSON
  .forEach((doc) => printjson(doc));

// Imprime mensagem de sucesso no terminal
print("\n✓ Query executed successfully\n");
