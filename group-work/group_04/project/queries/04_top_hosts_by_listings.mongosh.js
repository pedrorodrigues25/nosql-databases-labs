// Query 04: Top Hosts by Number of Listings // Título da consulta
// Identifies professional hosts and property managers // Descrição em inglês
// Usage : mongosh queries/04_top_hosts_by_listings.mongosh.js // Como executar

// Seleciona o banco de dados correto
// "group_04_airbnb" é o nome da base de dados

db = db.getSiblingDB("group_04_airbnb");

// Imprime o título da consulta no terminal
print("\n=== Top 10 Hosts by Number of Listings ===\n");

// Busca na coleção de anfitriões
db.hosts
  .find(
    {}, // Busca todos os anfitriões
    {
      _id: 0, // Não mostrar o campo _id
      host_id: 1, // Mostrar o id do anfitrião
      host_name: 1, // Mostrar o nome do anfitrião
      listings_count: 1, // Mostrar o número de alojamentos
      total_capacity: 1, // Mostrar a capacidade total
      neighbourhoods: 1, // Mostrar os bairros
      avg_price: 1 // Mostrar o preço médio
    }
  )
  // Ordena pelo número de alojamentos (maior para menor)
  .sort({ listings_count: -1 })
  // Limita aos 10 principais
  .limit(10)
  // Para cada documento do resultado, imprime em formato JSON
  .forEach((doc) => printjson(doc));

// Imprime mensagem de sucesso no terminal
print("\n✓ Query executed successfully\n");
