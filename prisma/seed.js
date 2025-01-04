import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function clearDatabase() {
  // Delete in correct order to handle foreign key constraints
  await prisma.serviceReview.deleteMany();
  await prisma.serviceBooking.deleteMany();
  await prisma.service.deleteMany();
  await prisma.creationCommentLike.deleteMany();
  await prisma.creationLike.deleteMany();
  await prisma.creationComment.deleteMany();
  await prisma.creation.deleteMany();
  await prisma.forumVote.deleteMany();
  await prisma.forumComment.deleteMany();
  await prisma.forumAnswer.deleteMany();
  await prisma.forumPost.deleteMany();
  await prisma.like.deleteMany();
  await prisma.reply.deleteMany();
  await prisma.discussion.deleteMany();
  await prisma.materialProgress.deleteMany();
  await prisma.studyHistory.deleteMany();
  await prisma.userAchievement.deleteMany();
  await prisma.point.deleteMany();
  await prisma.stage.deleteMany();
  await prisma.material.deleteMany();
  await prisma.subcategory.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.school.deleteMany();
}

async function createInitialSchools() {
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
    }
  ];

  const createdSchools = [];
  for (const school of schools) {
    const createdSchool = await prisma.school.create({ data: school });
    createdSchools.push(createdSchool);
  }
  return createdSchools;
}

async function createInitialUsers(schools) {
  const users = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      password: '$2a$10$K6O9YXlU9X9M2A1YgQeK3O6XkZq6WZzwVJXVFH3JJ1aMZjVXkrXbq', // "password123"
      role: 'user',
      image: 'https://i.pravatar.cc/150?img=1',
      schoolId: schools[0].id
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: '$2a$10$K6O9YXlU9X9M2A1YgQeK3O6XkZq6WZzwVJXVFH3JJ1aMZjVXkrXbq',
      role: 'user',
      image: 'https://i.pravatar.cc/150?img=2',
      schoolId: schools[0].id
    },
    {
      name: 'Bob Wilson',
      email: 'bob@example.com',
      password: '$2a$10$K6O9YXlU9X9M2A1YgQeK3O6XkZq6WZzwVJXVFH3JJ1aMZjVXkrXbq',
      role: 'user',
      image: 'https://i.pravatar.cc/150?img=3',
      schoolId: schools[1].id
    }
  ];

  const createdUsers = [];
  for (const user of users) {
    const createdUser = await prisma.user.create({ data: user });
    createdUsers.push(createdUser);
  }
  return createdUsers;
}

async function main() {
  console.log('🌱 Starting seed...');
  
  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await clearDatabase();
  
  // Create initial schools
  console.log('🏫 Creating schools...');
  const schools = await createInitialSchools();
  
  // Create initial users
  console.log('👥 Creating users...');
  const users = await createInitialUsers(schools);

  // Create sample services
  console.log('🛠️ Creating services...');
  const sampleServices = [
    {
      title: '1-on-1 Web Development Mentoring',
      description: 'Get personalized guidance from experienced web developer. Learn modern web technologies like React, Node.js, and more.',
      price: 50.00,
      category: 'Mentoring',
      images: [
        'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&h=300&fit=crop'
      ],
      providerId: users[0].id,
      rating: 4.8,
      totalReviews: 12,
      totalBookings: 25
    },
    {
      title: 'Python Programming Tutoring',
      description: 'Learn Python programming from basics to advanced. Perfect for beginners and intermediate learners.',
      price: 40.00,
      category: 'Tutoring',
      images: [
        'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&h=300&fit=crop'
      ],
      providerId: users[1].id,
      rating: 4.9,
      totalReviews: 8,
      totalBookings: 15
    },
    {
      title: 'Mobile App Development Workshop',
      description: 'Group workshop on mobile app development using React Native. Learn to build cross-platform mobile apps.',
      price: 30.00,
      category: 'Workshop',
      images: [
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500&h=300&fit=crop'
      ],
      providerId: users[0].id,
      rating: 4.7,
      totalReviews: 15,
      totalBookings: 30
    },
    {
      title: 'Code Review & Optimization',
      description: 'Professional code review service. Get feedback on your code quality, performance, and best practices.',
      price: 45.00,
      category: 'Review',
      images: [
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&h=300&fit=crop'
      ],
      providerId: users[1].id,
      rating: 5.0,
      totalReviews: 6,
      totalBookings: 10
    },
    {
      title: 'Tech Career Consultation',
      description: 'Get professional advice on your tech career path, interview preparation, and portfolio review.',
      price: 60.00,
      category: 'Consultation',
      images: [
        'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=500&h=300&fit=crop'
      ],
      providerId: users[0].id,
      rating: 4.9,
      totalReviews: 20,
      totalBookings: 40
    }
  ];

  const createdServices = [];
  for (const service of sampleServices) {
    const createdService = await prisma.service.create({
      data: service
    });
    createdServices.push(createdService);
  }

  // Create sample reviews
  console.log('⭐ Creating reviews...');
  const sampleReviews = [
    {
      serviceId: createdServices[0].id,
      userId: users[1].id,
      rating: 5.0,
      comment: 'Excellent mentoring session! Learned a lot about React and modern web development practices.'
    },
    {
      serviceId: createdServices[0].id,
      userId: users[2].id,
      rating: 4.5,
      comment: 'Very helpful mentor, explains concepts clearly and provides good resources.'
    },
    {
      serviceId: createdServices[1].id,
      userId: users[0].id,
      rating: 5.0,
      comment: 'Great Python tutoring! The instructor made complex concepts easy to understand.'
    },
    {
      serviceId: createdServices[2].id,
      userId: users[1].id,
      rating: 4.7,
      comment: 'Informative workshop on React Native. Good balance of theory and practice.'
    }
  ];

  for (const review of sampleReviews) {
    await prisma.serviceReview.create({
      data: review
    });
  }

  // Create sample bookings
  console.log('📅 Creating bookings...');
  const sampleBookings = [
    {
      serviceId: createdServices[0].id,
      userId: users[1].id,
      status: 'completed',
      schedule: new Date('2024-01-15T10:00:00Z'),
      duration: 60,
      notes: 'Would like to focus on React hooks and state management'
    },
    {
      serviceId: createdServices[0].id,
      userId: users[2].id,
      status: 'pending',
      schedule: new Date('2024-01-20T15:00:00Z'),
      duration: 90,
      notes: 'Need help with Next.js project setup'
    },
    {
      serviceId: createdServices[1].id,
      userId: users[0].id,
      status: 'completed',
      schedule: new Date('2024-01-10T13:00:00Z'),
      duration: 60,
      notes: 'Python data structures and algorithms'
    }
  ];

  for (const booking of sampleBookings) {
    await prisma.serviceBooking.create({
      data: booking
    });
  }

  console.log('✅ Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error in seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 