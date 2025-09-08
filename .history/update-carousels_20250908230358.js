import { MongoClient } from 'mongodb';
import { config } from 'dotenv';

config();

async function updateCarousels() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db();
    
    // Nouvelles configurations des carousels
    const newCarousels = [
      {
        title: 'Systèmes de surveillance vidéo professionnels',
        buttonCaption: '',
        image: '/images/banner1.jpg',
        url: '/search?category=Surveillance vidéo',
        isPublished: true,
      },
      {
        title: 'Équipements de sécurité incendie',
        buttonCaption: '',
        image: '/images/banner2.jpg',
        url: '/search?category=Sécurité incendie',
        isPublished: true,
      },
      {
        title: "Meilleures offres sur l'équipement informatique",
        buttonCaption: '',
        image: '/images/banner3.jpg',
        url: '/search?category=Équipement informatique',
        isPublished: true,
      },
    ];
    
    // Mettre à jour les carousels dans les settings
    const result = await db.collection('settings').updateOne(
      {},
      { $set: { carousels: newCarousels } },
      { upsert: true }
    );
    
    console.log('Carousels mis à jour avec succès:', result);
    
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
  } finally {
    await client.close();
  }
}

updateCarousels().catch(console.error);
