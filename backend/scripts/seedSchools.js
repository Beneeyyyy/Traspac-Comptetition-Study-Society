const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sampleSchools = [
  // Jakarta Pusat
  {
    npsn: "20100001",
    name: "SMA Negeri 1 Jakarta",
    address: "Jl. Budi Utomo No.7",
    city: "Jakarta Pusat",
    province: "DKI Jakarta",
    postalCode: "10710",
    level: "SMA",
    type: "Negeri",
    status: "active"
  },
  {
    npsn: "20100002",
    name: "SMP Negeri 1 Jakarta",
    address: "Jl. Cikini Raya No.87",
    city: "Jakarta Pusat",
    province: "DKI Jakarta",
    postalCode: "10330",
    level: "SMP",
    type: "Negeri",
    status: "active"
  },
  {
    npsn: "20100003",
    name: "SMK Negeri 2 Jakarta",
    address: "Jl. Batu No.3",
    city: "Jakarta Pusat",
    province: "DKI Jakarta",
    postalCode: "10720",
    level: "SMK",
    type: "Negeri",
    status: "active"
  },
  {
    npsn: "20100004",
    name: "SD Islam Al-Azhar",
    address: "Jl. Sabang No.15",
    city: "Jakarta Pusat",
    province: "DKI Jakarta",
    postalCode: "10710",
    level: "SD",
    type: "Swasta",
    status: "active"
  },
  {
    npsn: "20100005",
    name: "SMA Santa Ursula",
    address: "Jl. Pos No.2",
    city: "Jakarta Pusat",
    province: "DKI Jakarta",
    postalCode: "10710",
    level: "SMA",
    type: "Swasta",
    status: "active"
  },

  // Bandung
  {
    npsn: "20200001",
    name: "SMA Negeri 3 Bandung",
    address: "Jl. Belitung No.8",
    city: "Bandung",
    province: "Jawa Barat",
    postalCode: "40113",
    level: "SMA",
    type: "Negeri",
    status: "active"
  },
  {
    npsn: "20200002",
    name: "SMP Negeri 5 Bandung",
    address: "Jl. Sumatera No.40",
    city: "Bandung",
    province: "Jawa Barat",
    postalCode: "40117",
    level: "SMP",
    type: "Negeri",
    status: "active"
  },
  {
    npsn: "20200003",
    name: "SMK Negeri 1 Bandung",
    address: "Jl. Wastukencana No.3",
    city: "Bandung",
    province: "Jawa Barat",
    postalCode: "40117",
    level: "SMK",
    type: "Negeri",
    status: "active"
  },
  {
    npsn: "20200004",
    name: "SD Taruna Bakti",
    address: "Jl. L.L.R.E. Martadinata No.52",
    city: "Bandung",
    province: "Jawa Barat",
    postalCode: "40115",
    level: "SD",
    type: "Swasta",
    status: "active"
  },
  {
    npsn: "20200005",
    name: "SMA Pribadi Bandung",
    address: "Jl. Cihampelas No.167",
    city: "Bandung",
    province: "Jawa Barat",
    postalCode: "40131",
    level: "SMA",
    type: "Swasta",
    status: "active"
  },

  // Surabaya
  {
    npsn: "20300001",
    name: "SMA Negeri 5 Surabaya",
    address: "Jl. Kusuma Bangsa No.21",
    city: "Surabaya",
    province: "Jawa Timur",
    postalCode: "60272",
    level: "SMA",
    type: "Negeri",
    status: "active"
  },
  {
    npsn: "20300002",
    name: "SMP Negeri 1 Surabaya",
    address: "Jl. Pacar No.4-6",
    city: "Surabaya",
    province: "Jawa Timur",
    postalCode: "60174",
    level: "SMP",
    type: "Negeri",
    status: "active"
  },
  {
    npsn: "20300003",
    name: "SMK Negeri 1 Surabaya",
    address: "Jl. SMEA No.4",
    city: "Surabaya",
    province: "Jawa Timur",
    postalCode: "60243",
    level: "SMK",
    type: "Negeri",
    status: "active"
  },
  {
    npsn: "20300004",
    name: "SD Muhammadiyah 4",
    address: "Jl. Gadung III/7",
    city: "Surabaya",
    province: "Jawa Timur",
    postalCode: "60244",
    level: "SD",
    type: "Swasta",
    status: "active"
  },
  {
    npsn: "20300005",
    name: "SMA Petra 1",
    address: "Jl. H.R. Muhammad No.70",
    city: "Surabaya",
    province: "Jawa Timur",
    postalCode: "60226",
    level: "SMA",
    type: "Swasta",
    status: "active"
  },

  // Medan
  {
    npsn: "20400001",
    name: "SMA Negeri 1 Medan",
    address: "Jl. T. Cik Ditiro No.1",
    city: "Medan",
    province: "Sumatera Utara",
    postalCode: "20152",
    level: "SMA",
    type: "Negeri",
    status: "active"
  },
  {
    npsn: "20400002",
    name: "SMP Negeri 1 Medan",
    address: "Jl. Bunga Asoka No.6",
    city: "Medan",
    province: "Sumatera Utara",
    postalCode: "20123",
    level: "SMP",
    type: "Negeri",
    status: "active"
  },
  {
    npsn: "20400003",
    name: "SMK Negeri 1 Medan",
    address: "Jl. Sindoro No.1",
    city: "Medan",
    province: "Sumatera Utara",
    postalCode: "20214",
    level: "SMK",
    type: "Negeri",
    status: "active"
  },
  {
    npsn: "20400004",
    name: "SD Methodist 1",
    address: "Jl. Hang Tuah No.8",
    city: "Medan",
    province: "Sumatera Utara",
    postalCode: "20152",
    level: "SD",
    type: "Swasta",
    status: "active"
  },
  {
    npsn: "20400005",
    name: "SMA Sutomo 1",
    address: "Jl. Wahidin No.4",
    city: "Medan",
    province: "Sumatera Utara",
    postalCode: "20154",
    level: "SMA",
    type: "Swasta",
    status: "active"
  },

  // Makassar
  {
    npsn: "20500001",
    name: "SMA Negeri 1 Makassar",
    address: "Jl. Gunung Bawakaraeng No.53",
    city: "Makassar",
    province: "Sulawesi Selatan",
    postalCode: "90157",
    level: "SMA",
    type: "Negeri",
    status: "active"
  },
  {
    npsn: "20500002",
    name: "SMP Negeri 6 Makassar",
    address: "Jl. Ahmad Yani No.25",
    city: "Makassar",
    province: "Sulawesi Selatan",
    postalCode: "90174",
    level: "SMP",
    type: "Negeri",
    status: "active"
  },
  {
    npsn: "20500003",
    name: "SMK Negeri 1 Makassar",
    address: "Jl. Andi Mangerangi No.38",
    city: "Makassar",
    province: "Sulawesi Selatan",
    postalCode: "90145",
    level: "SMK",
    type: "Negeri",
    status: "active"
  },
  {
    npsn: "20500004",
    name: "SD Islam Athirah",
    address: "Jl. Kajaolalido No.22",
    city: "Makassar",
    province: "Sulawesi Selatan",
    postalCode: "90111",
    level: "SD",
    type: "Swasta",
    status: "active"
  },
  {
    npsn: "20500005",
    name: "SMA Katolik Rajawali",
    address: "Jl. Andalas No.51",
    city: "Makassar",
    province: "Sulawesi Selatan",
    postalCode: "90155",
    level: "SMA",
    type: "Swasta",
    status: "active"
  }
];

async function seedSchools() {
  try {
    console.log('Starting to seed schools...');

    // Delete existing schools
    await prisma.school.deleteMany();
    console.log('Deleted existing schools');

    // Create news schools
    for (const school of sampleSchools) {
      await prisma.school.create({
        data: school
      });
      console.log(`Created school: ${school.name}`);
    }

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding schools:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedSchools(); 