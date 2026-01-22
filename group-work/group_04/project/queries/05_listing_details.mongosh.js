// Query 05: Listing Details for Specific ID // Título da consulta
// Customer service lookup via find() // Descrição em inglês
// Usage : mongosh queries/05_listing_details.mongosh.js // Como executar

// Seleciona o banco de dados correto
db = db.getSiblingDB("group_04_airbnb"); // Troca para o DB do grupo

// Define o ID do alojamento alvo
const TARGET_LISTING_ID = 10005; // Pode ser alterado conforme necessário

// Imprime o título da consulta no terminal
print(`\n=== Listing Details - ID ${TARGET_LISTING_ID} ===\n`);

// Imprime subtítulo para os dados do alojamento
print("Listing Information:");

// Busca detalhes do alojamento pelo ID
db.listings
  .find(
    { listing_id: TARGET_LISTING_ID }, // Filtro pelo ID
    {
      _id: 0, // Não mostrar o campo _id
      listing_id: 1, // Mostrar o id do alojamento
      name: 1, // Mostrar o nome
      host: 1, // Mostrar o anfitrião
      location: 1, // Mostrar localização
      room_type: 1, // Mostrar tipo de quarto
      price: 1, // Mostrar preço
      capacity: 1, // Mostrar capacidade
      reviews: 1 // Mostrar avaliações
    }
  )
  // Para cada documento do resultado, imprime em formato JSON
  .forEach((doc) => printjson(doc));

// Imprime subtítulo para os dados das reservas
print("\nBookings for this listing:");

// Busca as reservas do alojamento pelo ID
db.bookings
  .find(
    { listing_id: TARGET_LISTING_ID }, // Filtro pelo ID
    { _id: 0, booking_id: 1, check_in: 1, check_out: 1, nights: 1, total_price: 1, status: 1 } // Campos a mostrar
  )
  // Ordena as reservas pela data de check-in (mais recente primeiro)
  .sort({ check_in: -1 })
  // Limita aos 5 resultados mais recentes
  .limit(5)
  // Para cada documento do resultado, imprime em formato JSON
  .forEach((doc) => printjson(doc));

// Imprime mensagem de sucesso no terminal
print("\n✓ Query executed successfully\n");
