import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const regions = [
  'DKI Jakarta',
  'Jawa Barat',
  'Jawa Tengah',
  'Jawa Timur',
  'Bali'
];

const schoolNames = {
  'DKI Jakarta': [
    'SMA Negeri 1 Jakarta',
    'SMA Negeri 8 Jakarta',
    'SMA Negeri 28 Jakarta',
    'SMA Negeri 35 Jakarta',
    'SMA Negeri 70 Jakarta'
  ],
  'Jawa Barat': [
    'SMA Negeri 1 Bandung',
    'SMA Negeri 2 Bandung',
    'SMA Negeri 3 Bandung',
    'SMA Negeri 1 Bogor',
    'SMA Negeri 1 Bekasi'
  ],
  'Jawa Tengah': [
    'SMA Negeri 1 Semarang',
    'SMA Negeri 2 Semarang',
    'SMA Negeri 3 Semarang',
    'SMA Negeri 1 Solo',
    'SMA Negeri 1 Magelang'
  ],
  'Jawa Timur': [
    'SMA Negeri 1 Surabaya',
    'SMA Negeri 2 Surabaya',
    'SMA Negeri 5 Surabaya',
    'SMA Negeri 1 Malang',
    'SMA Negeri 1 Sidoarjo'
  ],
  'Bali': [
    'SMA Negeri 1 Denpasar',
    'SMA Negeri 2 Denpasar',
    'SMA Negeri 3 Denpasar',
    'SMA Negeri 1 Kuta',
    'SMA Negeri 1 Ubud'
  ]
};

const categories = [
  { name: 'Matematika', description: 'Pelajaran Matematika' },
  { name: 'Fisika', description: 'Pelajaran Fisika' },
  { name: 'Kimia', description: 'Pelajaran Kimia' },
  { name: 'Biologi', description: 'Pelajaran Biologi' }
];

const subcategories = {
  'Matematika': [
    'Aljabar',
    'Geometri',
    'Trigonometri',
    'Kalkulus'
  ],
  'Fisika': [
    'Mekanika',
    'Termodinamika',
    'Gelombang',
    'Listrik Magnet'
  ],
  'Kimia': [
    'Kimia Organik',
    'Kimia Anorganik',
    'Termokimia',
    'Elektrokimia'
  ],
  'Biologi': [
    'Sel',
    'Genetika',
    'Ekologi',
    'Evolusi'
  ]
};

function generateRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  console.log('🧹 Clearing existing data...');
  
  // Delete in correct order to handle foreign key constraints
  await prisma.point.deleteMany();
  await prisma.materialProgress.deleteMany();
  await prisma.forumVote.deleteMany();
  await prisma.forumComment.deleteMany();
  await prisma.forumAnswer.deleteMany();
  await prisma.forumPost.deleteMany();
  await prisma.like.deleteMany();
  await prisma.reply.deleteMany();
  await prisma.discussion.deleteMany();
  await prisma.userAchievement.deleteMany();
  await prisma.studyHistory.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.user.deleteMany();
  await prisma.school.deleteMany();
  await prisma.stage.deleteMany();
  await prisma.material.deleteMany();
  await prisma.subcategory.deleteMany();
  await prisma.category.deleteMany();

  console.log('✨ Existing data cleared');

  // Create categories and subcategories
  const createdCategories = {};
  const createdSubcategories = {};
  
  for (const category of categories) {
    const createdCategory = await prisma.category.create({
      data: {
        name: category.name,
        description: category.description
      }
    });
    createdCategories[category.name] = createdCategory;

    // Create subcategories for this category
    createdSubcategories[category.name] = [];
    for (const subName of subcategories[category.name]) {
      const subcategory = await prisma.subcategory.create({
        data: {
          name: subName,
          description: `${subName} dalam ${category.name}`,
          categoryId: createdCategory.id
        }
      });
      createdSubcategories[category.name].push(subcategory);
    }
  }

  console.log('📚 Created categories and subcategories');

  // Create default material for each subcategory
  console.log('📖 Creating default materials...');
  const defaultMaterials = {};
  
  for (const category of categories) {
    defaultMaterials[category.name] = [];
    for (const subcategory of createdSubcategories[category.name]) {
      const material = await prisma.material.create({
        data: {
          title: `Pengenalan ${subcategory.name}`,
          description: `Materi dasar tentang ${subcategory.name}`,
          subcategoryId: subcategory.id,
          xp_reward: 100,
          estimated_time: 30,
          is_published: true
        }
      });
      defaultMaterials[category.name].push(material);
    }
  }

  console.log('✅ Created default materials');

  // Create schools and users for each region
  for (const region of regions) {
    console.log(`🏫 Creating schools for ${region}...`);
    
    for (const schoolName of schoolNames[region]) {
      // Create school
      const school = await prisma.school.create({
        data: {
          npsn: Math.random().toString(36).substring(2, 10).toUpperCase(),
          name: schoolName,
          address: `Jalan ${schoolName.split(' ').pop()} No. ${Math.floor(Math.random() * 100) + 1}`,
          city: region.split(' ').pop(),
          province: region,
          postalCode: Math.floor(Math.random() * 90000 + 10000).toString(),
          level: 'SMA',
          type: 'Negeri',
          status: 'active',
          image: `https://ui-avatars.com/api/?name=${encodeURIComponent(schoolName)}&background=0D8ABC&color=fff`
        }
      });

      // Create 5 students for each school
      for (let i = 1; i <= 5; i++) {
        const studentName = `${['Andi', 'Budi', 'Citra', 'Dewi', 'Eka'][i-1]} ${school.name.split(' ').pop()}`;
        const randomId = Math.random().toString(36).substring(2, 8);
        const user = await prisma.user.create({
          data: {
            name: studentName,
            email: `${studentName.toLowerCase().replace(/\s+/g, '.')}${randomId}@student.com`,
            password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // 'password123'
            image: `https://ui-avatars.com/api/?name=${encodeURIComponent(studentName)}&background=0D8ABC&color=fff`,
            schoolId: school.id,
            totalStudyTime: Math.floor(Math.random() * 3000), // Random study time up to 3000 minutes
            completedMaterials: Math.floor(Math.random() * 20), // Random completed materials up to 20
            totalPoints: 0, // Will be updated as we add points
            totalXP: Math.floor(Math.random() * 5000), // Random XP
            rank: ['Pemula', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)],
            level: Math.floor(Math.random() * 10) + 1,
            studyStreak: Math.floor(Math.random() * 30),
            weeklyStudyTime: Math.floor(Math.random() * 600),
            monthlyStudyTime: Math.floor(Math.random() * 2400),
            lastStudyDate: new Date(),
            bio: `Student at ${school.name}`,
            currentGoal: "Becoming a better learner",
            interests: ['Mathematics', 'Science', 'Programming'].slice(0, Math.floor(Math.random() * 3) + 1)
          }
        });

        // Create points for this user
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1); // Points from last month

        // Create random points for each category
        for (const category of categories) {
          const numPoints = Math.floor(Math.random() * 10) + 5; // 5-15 point entries per category
          
          // Get random subcategory and material for this category
          const categorySubcategories = createdSubcategories[category.name];
          const categoryMaterials = defaultMaterials[category.name];
          
          for (let j = 0; j < numPoints; j++) {
            // Randomly select subcategory and corresponding material
            const randomIndex = Math.floor(Math.random() * categorySubcategories.length);
            const selectedSubcategory = categorySubcategories[randomIndex];
            const selectedMaterial = categoryMaterials[randomIndex];

            await prisma.point.create({
              data: {
                userId: user.id,
                categoryId: createdCategories[category.name].id,
                subcategoryId: selectedSubcategory.id,
                materialId: selectedMaterial.id,
                value: Math.floor(Math.random() * 100) + 10, // Random points between 10-110
                createdAt: generateRandomDate(startDate, new Date())
              }
            });
          }
        }
      }
    }
  }

  console.log('✅ Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error in seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 