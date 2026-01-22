// Query 10: Booking Patterns by Month // Título da consulta
// Seasonal analysis for pricing optimization // Descrição em inglês
// Usage: mongosh queries/10_booking_patterns_by_month.mongosh.js // Como executar

// Seleciona o banco de dados correto
db = db.getSiblingDB("group_04_airbnb"); // Troca para o DB do grupo

// Imprime o título da consulta no terminal
print("\n=== Booking Patterns by Month ===\n");

// Inicia a agregação na coleção "bookings"
db.bookings
  .aggregate([
    // Extrai ano e mês da data de check-in
    {
      $project: {
        year: { $year: "$check_in" }, // Ano do check-in
        month: { $month: "$check_in" }, // Mês do check-in
        total_price: 1, // Valor total da reserva
        nights: 1, // Número de noites
        status: 1 // Estado da reserva
      }
    },
    // Filtra apenas reservas concluídas
    { $match: { status: "completed" } },
    // Agrupa por ano e mês
    {
      $group: {
        _id: { year: "$year", month: "$month" }, // Agrupamento por ano/mês
        booking_count: { $sum: 1 }, // Número de reservas
        total_revenue: { $sum: "$total_price" }, // Receita total
        total_nights: { $sum: "$nights" }, // Total de noites
        avg_booking_value: { $avg: "$total_price" } // Valor médio por reserva
      }
    },
    // Ordena cronologicamente
    { $sort: { "_id.year": 1, "_id.month": 1 } }
  ])
  // Para cada documento do resultado, imprime em formato JSON
  .forEach((doc) => printjson(doc));

// Imprime mensagem de sucesso no terminal
print("\n✓ Query executed successfully\n");
