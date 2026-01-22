// Query 02: Average Price by Neighbourhood // Título da consulta
// Market analysis for pricing strategy // Descrição em inglês
// Usage : mongosh queries/02_avg_price_by_neighbourhood.mongosh.js // Como executar

// Seleciona o banco de dados correto
// O método getSiblingDB permite alternar entre bases de dados no MongoDB
// "group_04_airbnb" é o nome da base de dados

db = db.getSiblingDB("group_04_airbnb");

// Imprime o título da consulta no terminal
print("\n=== Average Price by Neighbourhood ===\n");

// Inicia a agregação na coleção "listings"
db.listings
  .aggregate([
    {
      // Agrupa os alojamentos por bairro
      $group: {
        _id: "$location.neighbourhood", // Bairro
        avg_price: { $avg: "$price" }, // Preço médio
        min_price: { $min: "$price" }, // Preço mínimo
        max_price: { $max: "$price" }, // Preço máximo
        listing_count: { $sum: 1 } // Número de alojamentos
      }
    },
    // Ordena pelo preço médio (maior para menor)
    { $sort: { avg_price: -1 } }
  ])
  // Para cada documento do resultado, imprime em formato JSON
  .forEach((doc) => printjson(doc));

// Imprime mensagem de sucesso no terminal
print("\n✓ Query executed successfully\n");
