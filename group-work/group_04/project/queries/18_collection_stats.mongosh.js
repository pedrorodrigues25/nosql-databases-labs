// Query 18: Collection Statistics // Título da consulta
// Analysis of size and performance of collections // Descrição em inglês
// Usage: mongosh queries/18_collection_stats.mongosh.js // Como executar

// Seleciona o banco de dados correto
db = db.getSiblingDB("group_04_airbnb"); // Troca para o DB do grupo

// Imprime o título da consulta no terminal
print("\n=== Collection Statistics ===\n");

// Lista das coleções a analisar
const collections = ["listings", "hosts", "bookings"];

// Para cada coleção, mostra estatísticas
collections.forEach((collName) => {
  const stats = db[collName].stats(); // Obtém estatísticas da coleção

  print(`\n${collName.toUpperCase()}:`); // Imprime nome da coleção
  printjson({
    namespace: stats.ns, // Nome completo da coleção
    documents: stats.count, // Número de documentos
    avgDocSize: stats.avgObjSize, // Tamanho médio dos documentos
    dataSizeMB: (stats.size / (1024 * 1024)).toFixed(4), // Tamanho total dos dados (MB)
    storageSizeMB: (stats.storageSize / (1024 * 1024)).toFixed(4), // Tamanho em disco (MB)
    totalIndexes: stats.nindexes, // Número de índices
  });

  // Mostra os índices de cada coleção
  print(`  Indexes on ${collName}:`);
  db[collName].getIndexes().forEach((idx) => {
    print(`    - ${idx.name}: ${JSON.stringify(idx.key)}`); // Nome e campos do índice
  });
});

// Mostra estatísticas gerais da base de dados
print("\n=== Database Statistics ===\n");
const dbStats = db.stats(); // Obtém estatísticas da base de dados
printjson({
  database: dbStats.db, // Nome da base de dados
  collections: dbStats.collections, // Número de coleções
  objects: dbStats.objects, // Número de objetos
  avgObjSize: dbStats.avgObjSize, // Tamanho médio dos objetos
  dataSizeMB: (dbStats.dataSize / (1024 * 1024)).toFixed(4), // Tamanho total dos dados (MB)
  storageSizeMB: (dbStats.storageSize / (1024 * 1024)).toFixed(4), // Tamanho em disco (MB)
  indexes: dbStats.indexes, // Número de índices
  indexSizeMB: (dbStats.indexSize / (1024 * 1024)).toFixed(4), // Tamanho dos índices (MB)
});

// Imprime mensagem de sucesso no terminal
print("\n✓ Query executed successfully\n");
