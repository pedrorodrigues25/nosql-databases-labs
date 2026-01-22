// Query 01: Top 10 Listings by Number of Reviews // Título da consulta
// Identifies most popular properties for marketing insights // Descrição em inglês
// Usage : mongosh queries/01_top_listings_by_reviews.mongosh.js // Como executar

// Seleciona o banco de dados correto
// Aqui trocamos para o banco de dados do grupo 04
// O método getSiblingDB permite alternar entre bases de dados no MongoDB
// "group_04_airbnb" é o nome da base de dados

db = db.getSiblingDB("group_04_airbnb");

// Imprime o título da consulta no terminal
print("\n=== Top 10 Listings by Number of Reviews ===\n");

// Inicia a agregação na coleção "listings"
db.listings
  .aggregate([
    {
      // Projeta apenas os campos relevantes para o resultado
      $project: {
        _id: 0, // Não mostrar o campo _id
        listing_id: 1, // Mostrar o id do alojamento
        name: 1, // Mostrar o nome do alojamento
        neighbourhood: "$location.neighbourhood", // Mostrar o bairro
        room_type: 1, // Mostrar o tipo de quarto
        price: 1, // Mostrar o preço
        number_of_reviews: "$reviews.number_of_reviews", // Mostrar o número de avaliações
        review_scores_rating: "$reviews.review_scores_rating" // Mostrar a nota média das avaliações
      }
    },
    // Ordena pelo número de avaliações (maior para menor)
    { $sort: { number_of_reviews: -1 } },
    // Limita o resultado aos 10 primeiros
    { $limit: 10 }
  ])
  // Para cada documento do resultado, imprime em formato JSON
  .forEach((doc) => printjson(doc));

// Imprime mensagem de sucesso no terminal
print("\n✓ Query executed successfully\n");
