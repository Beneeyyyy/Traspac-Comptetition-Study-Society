import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    }
  });

  console.log('Admin user created:', adminUser.email);

  // Create Programming Dasar Category
  const programmingCategory = await prisma.category.create({
    data: {
      name: "Programming Dasar",
      description: "Pelajari dasar-dasar pemrograman untuk memulai perjalanan coding Anda",
      image: "https://example.com/programming-basic.jpg",
      subcategories: {
        create: [
          {
            name: "Pengenalan JavaScript",
            description: "Fundamental JavaScript untuk pemula",
            image: "https://example.com/js-basic.jpg",
            materials: {
              create: [
                {
                  title: "Pengenalan JavaScript untuk Pemula",
                  description: "Pelajari dasar-dasar JavaScript, bahasa pemrograman yang powerful untuk web development. Kamu akan belajar konsep dasar, cara menulis kode, dan implementasi sederhana.",
                  image: "https://example.com/js-intro.jpg",
                  xp_reward: 100,
                  estimated_time: 45,
                  glossary: [
                    { term: "Variable", definition: "Wadah untuk menyimpan data dalam program" },
                    { term: "Function", definition: "Blok kode yang dapat digunakan ulang" },
                    { term: "Console", definition: "Tool untuk debugging dan melihat output program" }
                  ],
                  stages: {
                    create: [
                      {
                        title: "1. Konsep Dasar JavaScript",
                        order: 1,
                        contents: [
                          {
                            type: "text",
                            content: "JavaScript adalah bahasa pemrograman yang sangat populer untuk pengembangan web. Mari mulai dengan memahami apa itu JavaScript dan mengapa kita menggunakannya.",
                            order: 1
                          },
                          {
                            type: "image",
                            content: "https://example.com/js-ecosystem.jpg",
                            caption: "Ekosistem JavaScript",
                            order: 2
                          },
                          {
                            type: "text",
                            content: "JavaScript memungkinkan kita membuat website yang interaktif dan dinamis.",
                            order: 3
                          }
                        ]
                      },
                      {
                        title: "2. Praktik Dasar",
                        order: 2,
                        contents: [
                          {
                            type: "text",
                            content: "Mari mulai menulis kode JavaScript pertama kita!",
                            order: 1
                          },
                          {
                            type: "code",
                            content: "let name = 'John';\nconst age = 25;\nconsole.log('Nama:', name);",
                            language: "javascript",
                            order: 2
                          }
                        ]
                      },
                      {
                        title: "3. Eksplorasi dan Latihan",
                        order: 3,
                        contents: [
                          {
                            type: "text",
                            content: "Saatnya berlatih dengan beberapa tantangan sederhana!",
                            order: 1
                          },
                          {
                            type: "exercise",
                            content: "Buatlah program untuk menghitung luas persegi",
                            order: 2
                          }
                        ]
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  });

  // Create Daataabase Category
  const databaseCategory = await prisma.category.create({
    data: {
      name: "Database",
      description: "Pelajari cara mengelola dan mengoptimalkan database",
      image: "https://example.com/database.jpg",
      subcategories: {
        create: [
          {
            name: "SQL Dasar",
            description: "Fundamental SQL dan database relasional",
            image: "https://example.com/sql-basic.jpg",
            materials: {
              create: [
                {
                  title: "Pengenalan SQL dan Database",
                  description: "Pelajari dasar-dasar SQL dan database relasional untuk mengelola data dengan efektif",
                  image: "https://example.com/sql-intro.jpg",
                  xp_reward: 120,
                  estimated_time: 60,
                  glossary: [
                    { term: "Database", definition: "Kumpulan data terstruktur" },
                    { term: "Query", definition: "Perintah untuk mengakses atau memanipulasi data" },
                    { term: "Table", definition: "Struktur untuk menyimpan data dalam database" }
                  ],
                  stages: {
                    create: [
                      {
                        title: "1. Pengenalan Database",
                        order: 1,
                        contents: [
                          {
                            type: "text",
                            content: "Database adalah sistem untuk menyimpan dan mengelola data secara terstruktur",
                            order: 1
                          },
                          {
                            type: "image",
                            content: "https://example.com/database-structure.jpg",
                            caption: "Struktur Database Relasional",
                            order: 2
                          }
                        ]
                      },
                      {
                        title: "2. Basic SQL Commands",
                        order: 2,
                        contents: [
                          {
                            type: "text",
                            content: "Mari belajar perintah SQL dasar",
                            order: 1
                          },
                          {
                            type: "code",
                            content: "SELECT * FROM users;\nINSERT INTO users (name, age) VALUES ('John', 25);",
                            language: "sql",
                            order: 2
                          }
                        ]
                      },
                      {
                        title: "3. Latihan Query",
                        order: 3,
                        contents: [
                          {
                            type: "text",
                            content: "Saatnya berlatih membuat query SQL",
                            order: 1
                          },
                          {
                            type: "exercise",
                            content: "Buatlah query untuk menampilkan semua user berusia di atas 20 tahun",
                            order: 2
                          }
                        ]
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  });

  // Create Web Development Category
  const webDevCategory = await prisma.category.create({
    data: {
      name: "Web Development",
      description: "Pelajari pengembangan website modern dari dasar hingga mahir",
      image: "https://example.com/web-dev.jpg",
      subcategories: {
        create: [
          {
            name: "HTML & CSS",
            description: "Fundamental pembangunan website dengan HTML dan CSS",
            image: "https://example.com/html-css.jpg",
            materials: {
              create: [
                {
                  title: "Dasar HTML5 Modern",
                  description: "Pelajari HTML5 untuk membangun struktur website yang semantik dan accessible",
                  image: "https://example.com/html5.jpg",
                  xp_reward: 90,
                  estimated_time: 40,
                  glossary: [
                    { term: "Semantic HTML", definition: "Tag HTML yang memiliki makna dan tujuan spesifik" },
                    { term: "Accessibility", definition: "Membuat website dapat diakses oleh semua pengguna" }
                  ],
                  stages: {
                    create: [
                      {
                        title: "1. Struktur Dasar HTML5",
                        order: 1,
                        contents: [
                          {
                            type: "text",
                            content: "HTML5 adalah versi terbaru dari HTML yang membawa banyak fitur modern.",
                            order: 1
                          },
                          {
                            type: "code",
                            content: "<!DOCTYPE html>\n<html lang=\"id\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>Website Modern</title>\n</head>\n<body>\n  <header>...</header>\n  <main>...</main>\n  <footer>...</footer>\n</body>\n</html>",
                            language: "html",
                            order: 2
                          }
                        ]
                      },
                      {
                        title: "2. Semantic Elements",
                        order: 2,
                        contents: [
                          {
                            type: "text",
                            content: "Semantic elements membantu mesin dan developer memahami struktur konten.",
                            order: 1
                          },
                          {
                            type: "code",
                            content: "<article>\n  <h1>Judul Artikel</h1>\n  <section>\n    <h2>Sub Judul</h2>\n    <p>Konten...</p>\n  </section>\n</article>",
                            language: "html",
                            order: 2
                          }
                        ]
                      },
                      {
                        title: "3. Praktik Forms",
                        order: 3,
                        contents: [
                          {
                            type: "text",
                            content: "Mari buat form yang accessible dan user-friendly.",
                            order: 1
                          },
                          {
                            type: "exercise",
                            content: "Buatlah form pendaftaran dengan field nama, email, dan pesan",
                            order: 2
                          }
                        ]
                      }
                    ]
                  }
                }
              ]
            }
          },
          {
            name: "React Modern",
            description: "Pengembangan aplikasi web dengan React dan ekosistemnya",
            image: "https://example.com/react.jpg",
            materials: {
              create: [
                {
                  title: "React Hooks dan Components",
                  description: "Pelajari penggunaan React Hooks dan pembuatan komponen yang reusable",
                  image: "https://example.com/react-hooks.jpg",
                  xp_reward: 150,
                  estimated_time: 60,
                  glossary: [
                    { term: "Hooks", definition: "Fungsi spesial untuk menggunakan state dan fitur React lainnya" },
                    { term: "Component", definition: "Bagian UI yang dapat digunakan ulang" }
                  ],
                  stages: {
                    create: [
                      {
                        title: "1. Pengenalan Hooks",
                        order: 1,
                        contents: [
                          {
                            type: "text",
                            content: "React Hooks memungkinkan kita menggunakan state dan fitur React lainnya dalam functional components.",
                            order: 1
                          },
                          {
                            type: "code",
                            content: "import { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <button onClick={() => setCount(count + 1)}>\n      Count: {count}\n    </button>\n  );\n}",
                            language: "javascript",
                            order: 2
                          }
                        ]
                      },
                      {
                        title: "2. Custom Hooks",
                        order: 2,
                        contents: [
                          {
                            type: "text",
                            content: "Buat dan gunakan custom hooks untuk logic yang reusable.",
                            order: 1
                          },
                          {
                            type: "code",
                            content: "function useWindowSize() {\n  const [size, setSize] = useState({ width: 0, height: 0 });\n  // ... implementation\n  return size;\n}",
                            language: "javascript",
                            order: 2
                          }
                        ]
                      },
                      {
                        title: "3. Project Mini",
                        order: 3,
                        contents: [
                          {
                            type: "text",
                            content: "Saatnya membuat project sederhana dengan React Hooks!",
                            order: 1
                          },
                          {
                            type: "exercise",
                            content: "Buat aplikasi todo list dengan useState dan useEffect",
                            order: 2
                          }
                        ]
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  });

  // Create Mobile Development Category
  const mobileDevCategory = await prisma.category.create({
    data: {
      name: "Mobile Development",
      description: "Pelajari pengembangan aplikasi mobile untuk Android dan iOS",
      image: "https://example.com/mobile-dev.jpg",
      subcategories: {
        create: [
          {
            name: "React Native Basics",
            description: "Dasar-dasar pengembangan aplikasi mobile dengan React Native",
            image: "https://example.com/react-native.jpg",
            materials: {
              create: [
                {
                  title: "Memulai dengan React Native",
                  description: "Pelajari fundamental React Native untuk membuat aplikasi mobile cross-platform",
                  image: "https://example.com/rn-start.jpg",
                  xp_reward: 130,
                  estimated_time: 55,
                  glossary: [
                    { term: "Cross-platform", definition: "Aplikasi yang dapat berjalan di berbagai platform" },
                    { term: "Native Components", definition: "Komponen UI yang sesuai dengan platform" }
                  ],
                  stages: {
                    create: [
                      {
                        title: "1. Setup Project",
                        order: 1,
                        contents: [
                          {
                            type: "text",
                            content: "Persiapkan environment development React Native.",
                            order: 1
                          },
                          {
                            type: "code",
                            content: "npx react-native init MyFirstApp\ncd MyFirstApp\nnpx react-native start",
                            language: "bash",
                            order: 2
                          }
                        ]
                      },
                      {
                        title: "2. Basic Components",
                        order: 2,
                        contents: [
                          {
                            type: "text",
                            content: "Kenali komponen dasar React Native.",
                            order: 1
                          },
                          {
                            type: "code",
                            content: "import { View, Text, StyleSheet } from 'react-native';\n\nfunction Welcome() {\n  return (\n    <View style={styles.container}>\n      <Text>Welcome to React Native!</Text>\n    </View>\n  );\n}",
                            language: "javascript",
                            order: 2
                          }
                        ]
                      },
                      {
                        title: "3. Layout dengan Flexbox",
                        order: 3,
                        contents: [
                          {
                            type: "text",
                            content: "Belajar mengatur layout dengan Flexbox di React Native.",
                            order: 1
                          },
                          {
                            type: "exercise",
                            content: "Buat layout untuk halaman profil pengguna",
                            order: 2
                          }
                        ]
                      }
                    ]
                  }
                }
              ]
            }
          },
          {
            name: "Flutter Fundamentals",
            description: "Pengembangan aplikasi mobile dengan Flutter dan Dart",
            image: "https://example.com/flutter.jpg",
            materials: {
              create: [
                {
                  title: "Dart dan Flutter untuk Pemula",
                  description: "Pelajari bahasa Dart dan framework Flutter untuk membuat aplikasi mobile yang menarik",
                  image: "https://example.com/flutter-basic.jpg",
                  xp_reward: 140,
                  estimated_time: 65,
                  glossary: [
                    { term: "Widget", definition: "Komponen UI dasar dalam Flutter" },
                    { term: "Hot Reload", definition: "Fitur untuk melihat perubahan secara instan" }
                  ],
                  stages: {
                    create: [
                      {
                        title: "1. Pengenalan Dart",
                        order: 1,
                        contents: [
                          {
                            type: "text",
                            content: "Dart adalah bahasa pemrograman modern untuk Flutter.",
                            order: 1
                          },
                          {
                            type: "code",
                            content: "void main() {\n  var name = 'Flutter';\n  print('Hello, $name!');\n}",
                            language: "dart",
                            order: 2
                          }
                        ]
                      },
                      {
                        title: "2. Widget Tree",
                        order: 2,
                        contents: [
                          {
                            type: "text",
                            content: "Memahami hierarki widget dalam Flutter.",
                            order: 1
                          },
                          {
                            type: "code",
                            content: "class MyApp extends StatelessWidget {\n  @override\n  Widget build(BuildContext context) {\n    return MaterialApp(\n      home: Scaffold(\n        body: Center(\n          child: Text('Hello Flutter!')\n        )\n      )\n    );\n  }\n}",
                            language: "dart",
                            order: 2
                          }
                        ]
                      },
                      {
                        title: "3. Stateful Widgets",
                        order: 3,
                        contents: [
                          {
                            type: "text",
                            content: "Belajar membuat widget yang dapat berubah state-nya.",
                            order: 1
                          },
                          {
                            type: "exercise",
                            content: "Buat counter app dengan StatefulWidget",
                            order: 2
                          }
                        ]
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  });

  // Create Data Science Category
  const dataScienceCategory = await prisma.category.create({
    data: {
      name: "Data Science",
      description: "Pelajari analisis data dan machine learning",
      image: "https://example.com/data-science.jpg",
      subcategories: {
        create: [
          {
            name: "Python untuk Data Science",
            description: "Fundamental Python untuk analisis data",
            image: "https://example.com/python-ds.jpg",
            materials: {
              create: [
                {
                  title: "Analisis Data dengan Python",
                  description: "Pelajari penggunaan Python dan libraries untuk analisis data",
                  image: "https://example.com/python-analysis.jpg",
                  xp_reward: 160,
                  estimated_time: 70,
                  glossary: [
                    { term: "Pandas", definition: "Library Python untuk manipulasi data" },
                    { term: "DataFrame", definition: "Struktur data 2D untuk analisis" }
                  ],
                  stages: {
                    create: [
                      {
                        title: "1. Pengenalan Pandas",
                        order: 1,
                        contents: [
                          {
                            type: "text",
                            content: "Pandas adalah library powerful untuk analisis data.",
                            order: 1
                          },
                          {
                            type: "code",
                            content: "import pandas as pd\n\ndf = pd.DataFrame({\n  'Name': ['John', 'Anna'],\n  'Age': [25, 28]\n})\nprint(df.describe())",
                            language: "python",
                            order: 2
                          }
                        ]
                      },
                      {
                        title: "2. Data Cleaning",
                        order: 2,
                        contents: [
                          {
                            type: "text",
                            content: "Belajar membersihkan dan mempersiapkan data.",
                            order: 1
                          },
                          {
                            type: "code",
                            content: "# Handle missing values\ndf.fillna(0)\n\n# Remove duplicates\ndf.drop_duplicates()",
                            language: "python",
                            order: 2
                          }
                        ]
                      },
                      {
                        title: "3. Visualisasi Data",
                        order: 3,
                        contents: [
                          {
                            type: "text",
                            content: "Membuat visualisasi data dengan matplotlib dan seaborn.",
                            order: 1
                          },
                          {
                            type: "exercise",
                            content: "Buat visualisasi dari dataset penumpang Titanic",
                            order: 2
                          }
                        ]
                      }
                    ]
                  }
                }
              ]
            }
          },
          {
            name: "Machine Learning Basics",
            description: "Dasar-dasar machine learning dengan scikit-learn",
            image: "https://example.com/ml-basic.jpg",
            materials: {
              create: [
                {
                  title: "Supervised Learning",
                  description: "Pelajari konsep dan implementasi supervised learning",
                  image: "https://example.com/supervised.jpg",
                  xp_reward: 180,
                  estimated_time: 75,
                  glossary: [
                    { term: "Classification", definition: "Prediksi kategori/kelas" },
                    { term: "Regression", definition: "Prediksi nilai kontinyu" }
                  ],
                  stages: {
                    create: [
                      {
                        title: "1. Konsep Dasar",
                        order: 1,
                        contents: [
                          {
                            type: "text",
                            content: "Memahami supervised learning dan komponennya.",
                            order: 1
                          },
                          {
                            type: "code",
                            content: "from sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LogisticRegression\n\nX_train, X_test, y_train, y_test = train_test_split(X, y)",
                            language: "python",
                            order: 2
                          }
                        ]
                      },
                      {
                        title: "2. Model Training",
                        order: 2,
                        contents: [
                          {
                            type: "text",
                            content: "Belajar melatih model machine learning.",
                            order: 1
                          },
                          {
                            type: "code",
                            content: "model = LogisticRegression()\nmodel.fit(X_train, y_train)\npredictions = model.predict(X_test)",
                            language: "python",
                            order: 2
                          }
                        ]
                      },
                      {
                        title: "3. Model Evaluation",
                        order: 3,
                        contents: [
                          {
                            type: "text",
                            content: "Evaluasi performa model dengan berbagai metrik.",
                            order: 1
                          },
                          {
                            type: "exercise",
                            content: "Evaluasi model klasifikasi dengan accuracy, precision, dan recall",
                            order: 2
                          }
                        ]
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  });

  // Create Theory Material
  const theoryMaterial = await prisma.material.create({
    data: {
      title: "Pengenalan Segitiga",
      description: "Pelajari konsep dasar segitiga dan penerapannya",
      image: "https://example.com/triangle.jpg",
      xp_reward: 100,
      estimated_time: 45,
      subcategoryId: 1,
      stages: {
        create: [
          {
            title: "1. Konsep Dasar Segitiga",
            order: 1,
            contents: [
              {
                type: "text",
                content: "Segitiga adalah bangun datar dengan tiga sisi.",
                order: 1
              },
              {
                type: "image",
                content: "https://example.com/triangle-basic.jpg",
                caption: "Bagian Segitiga",
                order: 2
              },
              {
                type: "text",
                content: "Jumlah sudut dalam segitiga selalu 180°.",
                order: 3
              },
              {
                type: "video",
                content: "https://example.com/triangle-intro.mp4",
                caption: "Visual Segitiga",
                order: 4
              }
            ]
          },
          {
            title: "2. Jenis Segitiga",
            order: 2,
            contents: [
              {
                type: "video",
                content: "https://example.com/triangle-types.mp4",
                caption: "Jenis-jenis Segitiga",
                order: 1
              },
              {
                type: "text",
                content: "Berdasarkan sisi: sama sisi, sama kaki, dan sembarang.",
                order: 2
              },
              {
                type: "image",
                content: "https://example.com/triangle-types.jpg",
                caption: "Tipe Segitiga",
                order: 3
              },
              {
                type: "text",
                content: "Berdasarkan sudut: lancip, siku-siku, dan tumpul.",
                order: 4
              },
              {
                type: "code",
                content: `function cekJenisSegitiga(s1, s2, s3) {
  if (s1 === s2 && s2 === s3) return "Sama Sisi";
  if (s1 === s2 || s2 === s3 || s1 === s3) return "Sama Kaki";
  return "Sembarang";
}`,
                language: "javascript",
                order: 5
              }
            ]
          },
          {
            title: "3. Sifat Segitiga",
            order: 3,
            contents: [
              {
                type: "text",
                content: "Sifat utama: jumlah sudut 180° dan ketidaksamaan segitiga.",
                order: 1
              },
              {
                type: "image",
                content: "https://example.com/triangle-properties.jpg",
                caption: "Sifat Segitiga",
                order: 2
              },
              {
                type: "video",
                content: "https://example.com/triangle-rules.mp4",
                caption: "Aturan Segitiga",
                order: 3
              },
              {
                type: "code",
                content: `function hitungLuas(alas, tinggi) {
  return (alas * tinggi) / 2;
}`,
                language: "javascript",
                order: 4
              }
            ]
          }
        ]
      }
    }
  });

  console.log('Theory material created with stages');

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 