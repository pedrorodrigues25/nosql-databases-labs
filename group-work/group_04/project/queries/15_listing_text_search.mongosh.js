// Query 15: Text Search on Listing Names // Título da consulta
// Search functionality demonstration // Descrição em inglês
// Usage: mongosh queries/15_listing_text_search.mongosh.js // Como executar

// Seleciona o banco de dados correto
db = db.getSiblingDB("group_04_airbnb"); // Troca para o DB do grupo

// Imprime o título da consulta no terminal
print("\n=== Text Search: Listings with 'Apartment' in Name ===\n");

// Garante que existe um índice de texto no campo "name"
try {
  db.listings.createIndex({ name: "text" }, { name: "idx_listing_name_text" }); // Cria índice de texto
} catch (e) {
  // Se o índice já existir, ignora o erro
}

// Pesquisa por texto "Apartment" no nome dos alojamentos
db.listings
  .find(
    { $text: { $search: "Apartment" } }, // Filtro de pesquisa textual
    {
      _id: 0, // Não mostrar o campo _id
      listing_id: 1, // Mostrar o id do alojamento
      name: 1, // Mostrar o nome
      neighbourhood: "$location.neighbourhood", // Mostrar o bairro
      room_type: 1, // Mostrar o tipo de quarto
      price: 1, // Mostrar o preço
      score: { $meta: "textScore" } // Mostrar relevância da pesquisa
    }
  )
  // Ordena pela relevância da pesquisa
  .sort({ score: { $meta: "textScore" } })
  // Limita aos 15 principais
  .limit(15)
  // Para cada documento do resultado, imprime em formato JSON
  .forEach((doc) => printjson(doc));

// Imprime alternativa de pesquisa por regex
print("\n--- Alternative: Regex Search for 'Porto' ---\n");

// Pesquisa por nome que contenha "Porto" (case-insensitive)
db.listings
  .find(
    { name: { $regex: /Porto/i } }, // Filtro regex
    {
      _id: 0, // Não mostrar o campo _id
      listing_id: 1, // Mostrar o id do alojamento
      name: 1, // Mostrar o nome
      neighbourhood: "$location.neighbourhood", // Mostrar o bairro
      price: 1 // Mostrar o preço
    }
  )
  // Limita aos 10 principais
  .limit(10)
  // Para cada documento do resultado, imprime em formato JSON
  .forEach((doc) => printjson(doc));

// Imprime mensagem de sucesso no terminal
print("\n✓ Query executed successfully\n");
