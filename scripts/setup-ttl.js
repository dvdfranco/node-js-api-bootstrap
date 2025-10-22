const { PrismaClient } = require('@prisma/client');

async function setupTTL() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Setting up TTL index for AccessTokens...');
    
    // First, drop the existing index
    try {
      await prisma.$runCommandRaw({
        dropIndexes: 'access_tokens',
        index: 'ttl_index'
      });
      console.log('Dropped existing index');
    } catch (error) {
      console.log('No existing index to drop or error dropping:', error.message);
    }
    
    // Create TTL index that expires documents after 20 seconds
    await prisma.$runCommandRaw({
      createIndexes: 'access_tokens',
      indexes: [
        {
          key: { expiresAt: 1 },
          name: 'ttl_index',
          expireAfterSeconds: 20
        }
      ]
    });
    
    console.log('TTL index created successfully - documents will expire after 20 seconds');
    
  } catch (error) {
    console.error('Error setting up TTL index:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupTTL().catch(console.error);