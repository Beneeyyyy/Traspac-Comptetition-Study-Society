import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Clear existing data
async function clearDatabase() {
  const modelsToClear = [
    'serviceReview',
    'serviceBooking',
    'service',
    'creationCommentLike',
    'creationLike', 
    'creationComment',
    'creation',
    'forumVote',
    'forumComment',
    'forumAnswer',
    'forumPost',
    'like',
    'reply',
    'discussion',
    'materialProgress',
    'studyHistory',
    'userAchievement',
    'point',
    'stage',
    'material',
    'subcategory',
    'category',
    'user',
    'school'
  ];

  for (const model of modelsToClear) {
    await prisma[model].deleteMany();
  }
}

// Create sample schools
async function createSchools() {
  const schools = [
    {
      npsn: 'SCH001',
      name: 'SMA Negeri 1 Jakarta',
      address: 'Jl. Budi Utomo No. 7',
      city: 'Jakarta Pusat',
      province: 'DKI Jakarta',
      postalCode: '10710',
      level: 'SMA',
      type: 'Negeri',
      status: 'active'
    },
    {
      npsn: 'SCH002', 
      name: 'SMA Negeri 3 Bandung',
      address: 'Jl. Belitung No. 8',
      city: 'Bandung',
      province: 'Jawa Barat', 
      postalCode: '40113',
      level: 'SMA',
      type: 'Negeri',
      status: 'active'
    },
    {
      npsn: 'SCH003',
      name: 'SMA Santa Ursula Jakarta',
      address: 'Jl. Pos No. 2',
      city: 'Jakarta Pusat',
      province: 'DKI Jakarta',
      postalCode: '10710',
      level: 'SMA',
      type: 'Swasta',
      status: 'active'
    },
    {
      npsn: 'SCH004',
      name: 'SMA Negeri 1 Surabaya',
      address: 'Jl. Wijaya Kusuma No. 48',
      city: 'Surabaya',
      province: 'Jawa Timur',
      postalCode: '60242',
      level: 'SMA',
      type: 'Negeri', 
      status: 'active'
    },
    {
      npsn: 'SCH005',
      name: 'SMA Negeri 2 Yogyakarta',
      address: 'Jl. Bener No. 30',
      city: 'Yogyakarta',
      province: 'DI Yogyakarta',
      postalCode: '55243',
      level: 'SMA',
      type: 'Negeri',
      status: 'active'
    },
    {
      npsn: 'SCH006', 
      name: 'SMA Kristen Penabur Jakarta',
      address: 'Jl. Tanjung Duren Raya No. 4',
      city: 'Jakarta Barat',
      province: 'DKI Jakarta',
      postalCode: '11470',
      level: 'SMA',
      type: 'Swasta',
      status: 'active'
    },
    {
      npsn: 'SCH007',
      name: 'SMA Al-Azhar Jakarta',
      address: 'Jl. Sisingamangaraja No. 1',
      city: 'Jakarta Selatan', 
      province: 'DKI Jakarta',
      postalCode: '12110',
      level: 'SMA',
      type: 'Swasta',
      status: 'active'
    },
    {
      npsn: 'SCH008',
      name: 'SMA Negeri 1 Denpasar',
      address: 'Jl. Kamboja No. 4',
      city: 'Denpasar',
      province: 'Bali',
      postalCode: '80233',
      level: 'SMA',
      type: 'Negeri',
      status: 'active'
    },
    {
      npsn: 'SCH009',
      name: 'SMA Negeri 1 Medan',
      address: 'Jl. T. Cik Ditiro No. 1',
      city: 'Medan',
      province: 'Sumatera Utara',
      postalCode: '20152',
      level: 'SMA',
      type: 'Negeri',
      status: 'active'
    },
    {
      npsn: 'SCH010',
      name: 'SMA Xaverius 1 Palembang',
      address: 'Jl. Bangau No. 60',
      city: 'Palembang',
      province: 'Sumatera Selatan',
      postalCode: '30113',
      level: 'SMA',
      type: 'Swasta',
      status: 'active'
    }
  ];

  const createdSchools = [];
  for (const school of schools) {
    const createdSchool = await prisma.school.create({ data: school });
    createdSchools.push(createdSchool);
  }
  return createdSchools;
}

// Create sample users
async function createUsers(schools) {
  const users = [
    {
      name: 'Admin User',
      email: 'admin@studysociety.com',
      password: '$2a$10$GQf3MrAqDqXRUuQY6ZJIcOXkQs0yp8U8UQxX8Y5YZqx5xZX5X5X5X',
      role: 'admin',
      schoolId: null,
      bio: 'Platform Administrator',
      interests: ['Education Technology', 'E-Learning'],
      currentGoal: 'Manage and improve the platform',
      totalPoints: 1000,
      totalXP: 5000,
      rank: 'Admin',
      level: 10
    },
    {
      name: 'Teacher One',
      email: 'teacher1@school.com', 
      password: '$2a$10$GQf3MrAqDqXRUuQY6ZJIcOXkQs0yp8U8UQxX8Y5YZqx5xZX5X5X5X',
      role: 'teacher',
      schoolId: schools[0].id,
      bio: 'Mathematics Teacher',
      interests: ['Mathematics', 'Education'],
      currentGoal: 'Help students excel in math',
      totalPoints: 800,
      totalXP: 4000,
      rank: 'Senior Teacher',
      level: 8
    },
    {
      name: 'Student One',
      email: 'student1@school.com',
      password: '$2a$10$GQf3MrAqDqXRUuQY6ZJIcOXkQs0yp8U8UQxX8Y5YZqx5xZX5X5X5X',
      role: 'student',
      schoolId: schools[0].id,
      bio: 'Passionate learner',
      interests: ['Mathematics', 'Physics', 'Programming'],
      currentGoal: 'Master calculus',
      totalPoints: 500,
      totalXP: 2500,
      rank: 'Rising Star',
      level: 5
    },
    {
      name: 'Student Two',
      email: 'student2@school.com',
      password: '$2a$10$GQf3MrAqDqXRUuQY6ZJIcOXkQs0yp8U8UQxX8Y5YZqx5xZX5X5X5X',
      role: 'student',
      schoolId: schools[1].id,
      bio: 'Love learning new things',
      interests: ['Biology', 'Chemistry'],
      currentGoal: 'Excel in science subjects',
      totalPoints: 300,
      totalXP: 1500,
      rank: 'Explorer',
      level: 3
    }
  ];

  const createdUsers = [];
  for (const user of users) {
    const createdUser = await prisma.user.create({ data: user });
    createdUsers.push(createdUser);
  }
  return createdUsers;
}

// Create categories and subcategories
async function createCategories() {
  const categories = [
    {
      name: 'Matematika',
      description: 'Pelajari konsep-konsep matematika secara mendalam',
      image: 'https://example.com/math.jpg',
      subcategories: {
        create: [
          {
            name: 'Aljabar',
            description: 'Belajar tentang persamaan dan fungsi matematika',
            image: 'https://example.com/algebra.jpg'
          },
          {
            name: 'Geometri',
            description: 'Pelajari bentuk, ukuran, dan posisi bangun datar dan ruang',
            image: 'https://example.com/geometry.jpg'
          },
          {
            name: 'Statistika',
            description: 'Analisis data dan probabilitas',
            image: 'https://example.com/statistics.jpg'
          },
          {
            name: 'Kalkulus',
            description: 'Turunan, integral, dan aplikasinya',
            image: 'https://example.com/calculus.jpg'
          }
        ]
      }
    },
    {
      name: 'Fisika',
      description: 'Pelajari hukum-hukum alam dan fenomena fisika',
      image: 'https://example.com/physics.jpg',
      subcategories: {
        create: [
          {
            name: 'Mekanika',
            description: 'Gerak, gaya, dan energi',
            image: 'https://example.com/mechanics.jpg'
          },
          {
            name: 'Listrik dan Magnet',
            description: 'Konsep kelistrikan dan kemagnetan',
            image: 'https://example.com/electricity.jpg'
          },
          {
            name: 'Gelombang',
            description: 'Gelombang mekanik dan elektromagnetik',
            image: 'https://example.com/waves.jpg'
          },
          {
            name: 'Termodinamika',
            description: 'Suhu, kalor, dan perubahan energi',
            image: 'https://example.com/thermo.jpg'
          }
        ]
      }
    },
    {
      name: 'Kimia',
      description: 'Pelajari struktur, sifat, dan perubahan materi',
      image: 'https://example.com/chemistry.jpg',
      subcategories: {
        create: [
          {
            name: 'Struktur Atom',
            description: 'Teori atom dan susunan elektron',
            image: 'https://example.com/atomic.jpg'
          },
          {
            name: 'Ikatan Kimia',
            description: 'Pembentukan senyawa dan molekul',
            image: 'https://example.com/bonding.jpg'
          },
          {
            name: 'Reaksi Kimia',
            description: 'Stoikiometri dan kesetimbangan',
            image: 'https://example.com/reaction.jpg'
          },
          {
            name: 'Kimia Organik',
            description: 'Senyawa karbon dan turunannya',
            image: 'https://example.com/organic.jpg'
          }
        ]
      }
    },
    {
      name: 'Biologi',
      description: 'Pelajari makhluk hidup dan proses kehidupan',
      image: 'https://example.com/biology.jpg',
      subcategories: {
        create: [
          {
            name: 'Sel dan Jaringan',
            description: 'Struktur dan fungsi sel',
            image: 'https://example.com/cell.jpg'
          },
          {
            name: 'Sistem Tubuh',
            description: 'Anatomi dan fisiologi manusia',
            image: 'https://example.com/anatomy.jpg'
          },
          {
            name: 'Genetika',
            description: 'Pewarisan sifat dan evolusi',
            image: 'https://example.com/genetics.jpg'
          },
          {
            name: 'Ekologi',
            description: 'Interaksi makhluk hidup dengan lingkungan',
            image: 'https://example.com/ecology.jpg'
          }
        ]
      }
    },
    {
      name: 'Bahasa Indonesia',
      description: 'Pelajari bahasa dan sastra Indonesia',
      image: 'https://example.com/indonesian.jpg',
      subcategories: {
        create: [
          {
            name: 'Tata Bahasa',
            description: 'Struktur dan kaidah bahasa Indonesia',
            image: 'https://example.com/grammar.jpg'
          },
          {
            name: 'Sastra',
            description: 'Prosa, puisi, dan drama',
            image: 'https://example.com/literature.jpg'
          },
          {
            name: 'Menulis',
            description: 'Teknik menulis dan komposisi',
            image: 'https://example.com/writing.jpg'
          },
          {
            name: 'Berbicara',
            description: 'Public speaking dan presentasi',
            image: 'https://example.com/speaking.jpg'
          }
        ]
      }
    },
    {
      name: 'Bahasa Inggris',
      description: 'Pelajari bahasa Inggris untuk komunikasi global',
      image: 'https://example.com/english.jpg',
      subcategories: {
        create: [
          {
            name: 'Grammar',
            description: 'English grammar and structure',
            image: 'https://example.com/eng-grammar.jpg'
          },
          {
            name: 'Speaking',
            description: 'Conversation and pronunciation',
            image: 'https://example.com/eng-speaking.jpg'
          },
          {
            name: 'Writing',
            description: 'Essay and composition',
            image: 'https://example.com/eng-writing.jpg'
          },
          {
            name: 'Listening',
            description: 'Listening comprehension',
            image: 'https://example.com/eng-listening.jpg'
          }
        ]
      }
    }
  ];

  const createdCategories = [];
  for (const category of categories) {
    const createdCategory = await prisma.category.create({
      data: category,
      include: {
        subcategories: true
      }
    });
    createdCategories.push(createdCategory);
  }
  return createdCategories;
}

// Create materials
async function createMaterials(categories) {
  const materials = [];
  
  for (const category of categories) {
    for (const subcategory of category.subcategories) {
      // Create multiple materials for each subcategory
      const materialTemplates = [
        {
          title: `Introduction to ${subcategory.name}`,
          description: `Learn the basic concepts of ${subcategory.name}`,
          xp_reward: 100,
          estimated_time: 30
        },
        {
          title: `Intermediate ${subcategory.name}`,
          description: `Deepen your understanding of ${subcategory.name}`,
          xp_reward: 150,
          estimated_time: 45
        },
        {
          title: `Advanced ${subcategory.name}`,
          description: `Master complex topics in ${subcategory.name}`,
          xp_reward: 200,
          estimated_time: 60
        }
      ];

      for (const template of materialTemplates) {
        const material = {
          ...template,
          image: 'https://example.com/material.jpg',
          subcategoryId: subcategory.id,
          is_published: true,
          stages: {
            create: [
              {
                title: '1. Konsep Dasar',
                order: 1,
                contents: {
                  sections: [
                    {
                      type: 'text',
                      content: `Basic concepts of ${subcategory.name}`
                    },
                    {
                      type: 'image',
                      url: 'https://example.com/concept.jpg'
                    }
                  ]
                }
              },
              {
                title: '2. Eksplorasi',
                order: 2,
                contents: {
                  sections: [
                    {
                      type: 'text',
                      content: 'Practice problems and exercises'
                    },
                    {
                      type: 'quiz',
                      questions: [
                        {
                          question: 'Sample question 1?',
                          options: ['A', 'B', 'C', 'D'],
                          answer: 0
                        },
                        {
                          question: 'Sample question 2?',
                          options: ['A', 'B', 'C', 'D'],
                          answer: 1
                        }
                      ]
                    }
                  ]
                }
              },
              {
                title: '3. Penerapan',
                order: 3,
                contents: {
                  sections: [
                    {
                      type: 'text',
                      content: 'Real-world applications and examples'
                    },
                    {
                      type: 'video',
                      url: 'https://example.com/application.mp4'
                    }
                  ]
                }
              }
            ]
          }
        };
        
        const createdMaterial = await prisma.material.create({
          data: material,
          include: {
            stages: true
          }
        });
        materials.push(createdMaterial);
      }
    }
  }
  return materials;
}

// Create forum posts and interactions
async function createForumContent(users) {
  const posts = [
    {
      title: 'Help with Calculus Problem',
      content: 'I need help solving this integration problem...',
      images: ['https://example.com/problem.jpg'],
      tags: ['mathematics', 'calculus', 'integration'],
      userId: users[2].id, // student
      answers: {
        create: [
          {
            content: 'Here\'s how you solve it...',
            images: ['https://example.com/solution.jpg'],
            userId: users[1].id, // teacher
            isAccepted: true,
            comments: {
              create: [
                {
                  content: 'Thanks, this helped!',
                  userId: users[2].id // student
                }
              ]
            }
          }
        ]
      }
    },
    {
      title: 'Physics Experiment Question',
      content: 'How do I set up this experiment?',
      images: ['https://example.com/experiment.jpg'],
      tags: ['physics', 'experiment', 'help'],
      userId: users[3].id, // another student
      answers: {
        create: [
          {
            content: 'The setup should look like this...',
            images: ['https://example.com/setup.jpg'],
            userId: users[1].id, // teacher
            isAccepted: false
          }
        ]
      }
    }
  ];

  const createdPosts = [];
  for (const post of posts) {
    const createdPost = await prisma.forumPost.create({
      data: post,
      include: {
        answers: {
          include: {
            comments: true
          }
        }
      }
    });
    createdPosts.push(createdPost);
  }
  return createdPosts;
}

// Create creations
async function createCreations(users) {
  const creations = [
    {
      title: 'My Physics Simulation',
      description: 'A simulation of projectile motion',
      category: 'Physics',
      author: users[2].name,
      tags: ['physics', 'simulation', 'javascript'],
      image: 'https://example.com/simulation.jpg',
      fileUrl: 'https://example.com/simulation.html',
      userId: users[2].id,
      status: 'published',
      comments: {
        create: [
          {
            content: 'Great work! Very educational',
            userId: users[1].id
          }
        ]
      }
    },
    {
      title: 'Math Learning Game',
      description: 'Interactive game for learning algebra',
      category: 'Mathematics',
      author: users[3].name,
      tags: ['mathematics', 'game', 'education'],
      image: 'https://example.com/mathgame.jpg',
      fileUrl: 'https://example.com/mathgame.html',
      userId: users[3].id,
      status: 'published'
    }
  ];

  const createdCreations = [];
  for (const creation of creations) {
    const createdCreation = await prisma.creation.create({
      data: creation,
      include: {
        comments: true
      }
    });
    createdCreations.push(createdCreation);
  }
  return createdCreations;
}

// Create services
async function createServices(users) {
  const services = [
    {
      title: 'Math Tutoring',
      description: 'One-on-one math tutoring sessions',
      price: 50.00,
      category: 'Tutoring',
      images: ['https://example.com/tutoring.jpg'],
      status: 'active',
      providerId: users[1].id,
      bookings: {
        create: [
          {
            userId: users[2].id,
            status: 'completed',
            schedule: new Date('2024-01-15T14:00:00Z'),
            duration: 60,
            notes: 'Need help with calculus'
          }
        ]
      },
      reviews: {
        create: [
          {
            userId: users[2].id,
            rating: 5,
            comment: 'Excellent tutor, very helpful!'
          }
        ]
      }
    },
    {
      title: 'Physics Workshop',
      description: 'Group workshop on mechanics',
      price: 30.00,
      category: 'Workshop',
      images: ['https://example.com/workshop.jpg'],
      status: 'active',
      providerId: users[1].id
    }
  ];

  const createdServices = [];
  for (const service of services) {
    const createdService = await prisma.service.create({
      data: service,
      include: {
        bookings: true,
        reviews: true
      }
    });
    createdServices.push(createdService);
  }
  return createdServices;
}

// Main function to run all seed operations
async function main() {
  console.log('🌱 Starting database seeding...');
  
  try {
    console.log('Clearing existing data...');
    await clearDatabase();

    console.log('Creating schools...');
    const schools = await createSchools();
    
    console.log('Creating users...');
    const users = await createUsers(schools);
    
    console.log('Creating categories and subcategories...');
    const categories = await createCategories();
    
    console.log('Creating materials...');
    const materials = await createMaterials(categories);
    
    console.log('Creating forum content...');
    const forumPosts = await createForumContent(users);
    
    console.log('Creating creations...');
    const creations = await createCreations(users);
    
    console.log('Creating services...');
    const services = await createServices(users);

    console.log('✅ Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Error in seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 