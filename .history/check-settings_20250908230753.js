const { connectToDatabase } = require('./lib/db/connect');
const Setting = require('./lib/db/models/setting.model').default;

async function checkAndUpdateSettings() {
  try {
    await connectToDatabase();
    const setting = await Setting.findOne().lean();
    
    console.log('Current carousels in DB:');
    console.log(JSON.stringify(setting.carousels, null, 2));
    
    // Update the carousels with correct URLs
    const updatedCarousels = [
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
    
    await Setting.findOneAndUpdate(
      {},
      { carousels: updatedCarousels },
      { new: true }
    );
    
    console.log('\nUpdated carousels:');
    console.log(JSON.stringify(updatedCarousels, null, 2));
    
    console.log('\nSettings updated successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
  process.exit(0);
}

checkAndUpdateSettings();
