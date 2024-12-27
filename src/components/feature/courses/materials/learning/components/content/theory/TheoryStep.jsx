import { useState, Suspense, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiHeart, FiMessageCircle, FiMenu, FiX, FiArrowLeft } from 'react-icons/fi';
import { RiLightbulbLine, RiQuestionLine } from 'react-icons/ri';

import {
  TopNavigation,
  ContentSkeleton,
  SectionsList,
  ContentRenderer,
  ImageViewer,
  VideoPlayer,
  QuickTips,
  QuickQuiz
} from './components';

import iconCourse2 from '/src/assets/images/courses/iconCourse2.svg';
import DiscussionPanel from '../DiscussionPanel';

// Example theory content structure
const sections = [
  {
    id: 'basics',
    title: 'Pengertian Segitiga',
    type: 'text',
    duration: '5 menit',
    xp: 25,
    level: 'Dasar',
    difficulty: 'Mudah',
    objectives: [
      'Memahami definisi dasar segitiga',
      'Mengenal karakteristik utama segitiga',
      'Mengidentifikasi segitiga dalam kehidupan sehari-hari'
    ],
    content: `Segitiga adalah bangun datar yang dibatasi oleh tiga buah sisi dan membentuk tiga buah sudut. 
             Segitiga merupakan bangun datar paling sederhana yang dibatasi oleh garis lurus.
             
             Dalam matematika, segitiga memiliki peran penting sebagai dasar dari berbagai konsep geometri. 
             Segitiga dapat ditemukan di berbagai aspek kehidupan, mulai dari arsitektur hingga desain.`,
    quickTips: [
      'Ingat: Jumlah sudut dalam segitiga selalu 180°',
      'Tips: Bayangkan segitiga seperti sandwich yang dipotong diagonal',
      'Fun Fact: Piramida Mesir berbentuk segitiga karena kestabilannya'
    ],
    media: {
      type: 'image',
      url: '/materials/triangle-basic.svg',
      caption: 'Ilustrasi dasar segitiga'
    },
    quiz: {
      question: 'Berapa jumlah sisi pada segitiga?',
      options: ['2 sisi', '3 sisi', '4 sisi', '5 sisi'],
      correct: 1
    }
  },
  {
    id: 'elements',
    title: 'Unsur-unsur Segitiga',
    type: 'interactive',
    duration: '8 menit',
    xp: 35,
    level: 'Menengah',
    difficulty: 'Sedang',
    objectives: [
      'Mengidentifikasi komponen-komponen segitiga',
      'Memahami hubungan antar komponen',
      'Menerapkan konsep dalam pemecahan masalah'
    ],
    content: 'Komponen utama yang membentuk segitiga terdiri dari:',
    points: [
      'Sisi - garis yang membentuk segitiga',
      'Sudut - pertemuan dua sisi yang membentuk rotasi',
      'Tinggi - jarak tegak lurus dari titik ke alas',
      'Alas - sisi yang dijadikan dasar pengukuran',
      'Titik Sudut - titik pertemuan dua sisi'
    ],
    quickTips: [
      'Tips: Sisi terpanjang selalu berhadapan dengan sudut terbesar',
      'Ingat: Setiap segitiga memiliki 3 tinggi berbeda',
      'Fun Fact: Tinggi segitiga selalu tegak lurus dengan alas'
    ],
    demo: {
      type: 'interactive',
      id: 'triangle-elements'
    },
    quiz: {
      question: 'Manakah yang bukan merupakan unsur segitiga?',
      options: ['Sisi', 'Sudut', 'Diagonal', 'Tinggi'],
      correct: 2
    }
  },
  {
    id: 'types',
    title: 'Jenis-jenis Segitiga',
    type: 'text',
    duration: '10 menit',
    xp: 40,
    level: 'Menengah',
    difficulty: 'Sedang',
    objectives: [
      'Mengenal berbagai jenis segitiga',
      'Membedakan karakteristik tiap jenis',
      'Mengklasifikasikan segitiga berdasarkan sifatnya'
    ],
    content: `Segitiga dapat diklasifikasikan berdasarkan panjang sisi dan besar sudutnya:

    Berdasarkan panjang sisi:
    • Segitiga Sama Sisi - semua sisi sama panjang
    • Segitiga Sama Kaki - dua sisi sama panjang
    • Segitiga Sembarang - semua sisi berbeda panjang

    Berdasarkan besar sudut:
    • Segitiga Lancip - semua sudut < 90°
    • Segitiga Siku-siku - salah satu sudut = 90°
    • Segitiga Tumpul - salah satu sudut > 90°`,
    quickTips: [
      'Tips: Segitiga sama sisi selalu memiliki sudut 60°',
      'Ingat: Segitiga siku-siku memiliki teorema Pythagoras',
      'Fun Fact: Tidak ada segitiga dengan sudut 180°'
    ],
    media: {
      type: 'image',
      url: '/materials/triangle-types.svg',
      caption: 'Berbagai jenis segitiga'
    },
    quiz: {
      question: 'Segitiga dengan dua sisi sama panjang disebut...',
      options: ['Segitiga Sama Sisi', 'Segitiga Sama Kaki', 'Segitiga Sembarang', 'Segitiga Siku-siku'],
      correct: 1
    }
  },
  {
    id: 'properties',
    title: 'Sifat-sifat Segitiga',
    type: 'interactive',
    duration: '12 menit',
    xp: 45,
    level: 'Lanjutan',
    difficulty: 'Sulit',
    objectives: [
      'Memahami sifat-sifat dasar segitiga',
      'Menganalisis hubungan antar sifat',
      'Menerapkan sifat dalam pemecahan masalah'
    ],
    content: `Segitiga memiliki beberapa sifat penting:

    1. Jumlah sudut dalam segitiga = 180°
    2. Sisi terpanjang berhadapan dengan sudut terbesar
    3. Jumlah dua sisi selalu lebih besar dari sisi ketiga
    4. Sudut luar segitiga = jumlah dua sudut dalam yang tidak bersisian`,
    quickTips: [
      'Tips: Gunakan sifat sudut untuk mencari sudut yang belum diketahui',
      'Ingat: Sifat segitiga berlaku untuk semua jenis segitiga',
      'Fun Fact: Sifat ini ditemukan oleh matematikawan Yunani kuno'
    ],
    points: [
      'Sifat Sudut - jumlah sudut selalu 180°',
      'Sifat Sisi - ketidaksamaan segitiga',
      'Sifat Sudut Luar - lebih besar dari sudut dalam',
      'Sifat Kesebangunan - perbandingan sisi yang sesuai'
    ],
    quiz: {
      question: 'Berapakah jumlah sudut dalam segitiga?',
      options: ['90°', '180°', '270°', '360°'],
      correct: 1
    }
  },
  {
    id: 'applications',
    title: 'Penerapan Segitiga',
    type: 'text',
    duration: '15 menit',
    xp: 50,
    level: 'Lanjutan',
    difficulty: 'Sulit',
    objectives: [
      'Mengidentifikasi penerapan segitiga',
      'Memahami penggunaan dalam kehidupan',
      'Menyelesaikan masalah kontekstual'
    ],
    content: `Segitiga memiliki banyak penerapan dalam kehidupan sehari-hari:

    1. Arsitektur dan Konstruksi
       • Rangka atap bangunan
       • Struktur jembatan
       • Menara dan tiang penyangga

    2. Navigasi dan Pengukuran
       • Triangulasi dalam GPS
       • Pengukuran tinggi gedung
       • Penentuan jarak yang tidak dapat diukur langsung

    3. Desain dan Seni
       • Logo dan simbol
       • Pola dan motif
       • Desain furniture`,
    quickTips: [
      'Tips: Perhatikan penggunaan segitiga di sekitar Anda',
      'Ingat: Segitiga adalah bentuk paling stabil',
      'Fun Fact: Struktur Eiffel Tower menggunakan prinsip segitiga'
    ],
    media: {
      type: 'image',
      url: '/materials/triangle-applications.svg',
      caption: 'Penerapan segitiga dalam kehidupan'
    },
    quiz: {
      question: 'Manakah yang BUKAN penerapan segitiga dalam konstruksi?',
      options: ['Rangka atap', 'Pondasi bundar', 'Struktur jembatan', 'Menara triangle'],
      correct: 1
    }
  }
];

const TheoryStep = ({ material }) => {
  const [activeSection, setActiveSection] = useState(0);
  const [showMedia, setShowMedia] = useState(false);
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [manuallyHidden, setManuallyHidden] = useState(false);
  const mainContentRef = useRef(null);
  
  const navigate = useNavigate();
  const { categoryId, subcategoryId } = useParams();

  useEffect(() => {
    const mainContent = mainContentRef.current;
    if (!mainContent) return;

    const controlNavbar = () => {
      const currentScrollY = mainContent.scrollTop;
      
      if (currentScrollY > lastScrollY && currentScrollY > 50) { 
        // Scrolling down & not at top - hide nav
        setShowNav(false);
      } else if (currentScrollY === 0) { 
        // Only show nav when at the very top
        setShowNav(true);
        setManuallyHidden(false);
      }

      setLastScrollY(currentScrollY);
    };

    mainContent.addEventListener('scroll', controlNavbar);
    return () => mainContent.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  const handleCloseNav = () => {
    setShowNav(false);
    setManuallyHidden(true);
  };

  const handleBackToMaterials = () => {
    navigate(`/courses/${categoryId}/subcategory/${subcategoryId}/materials`);
  };

  const currentSection = sections[activeSection];

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Top Navigation */}
      <TopNavigation 
        section={currentSection} 
        onBack={handleBackToMaterials}
        onClose={handleCloseNav}
        show={showNav}
      />

      <div className={`fixed inset-0 transition-all duration-300 ${showNav ? 'top-[160px]' : 'top-0'} bottom-16 lg:bottom-20 flex`}>
        {/* Mobile Menu Buttons */}
        <button
          onClick={() => setShowLeftSidebar(true)}
          className="lg:hidden fixed left-4 top-[160px] z-50 p-2 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10"
        >
          <FiMenu className="w-5 h-5" />
        </button>

        <button
          onClick={() => setShowRightSidebar(true)}
          className="lg:hidden fixed right-4 top-[160px] z-50 p-2 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10"
        >
          <RiLightbulbLine className="w-5 h-5" />
        </button>

        {/* Left Sidebar - Fixed */}
        <aside className={`
          fixed left-0 ${showNav ? 'top-[160px]' : 'top-0'} bottom-16 lg:bottom-20 w-80 lg:w-72 
          bg-black/80 backdrop-blur-lg border-r border-white/[0.05]
          transition-all duration-300 z-40 overflow-y-auto
          ${showLeftSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-4">
            <SectionsList 
              sections={sections}
              activeSection={activeSection}
              onSectionChange={(index) => {
                setActiveSection(index);
                setShowLeftSidebar(false);
              }}
            />
          </div>
        </aside>

        {/* Main Content Area */}
        <main ref={mainContentRef} className="flex-1 ml-0 lg:ml-72 mr-0 lg:mr-72 overflow-y-auto">
          <div className="min-h-full">
            <div className="max-w-[2000px] mx-auto px-4 lg:px-5 py-8">
              {/* Welcome Message - Only show on first section */}
              {currentSection.id === 'basics' && (
                <div className="flex flex-col items-center gap-6 mb-12 text-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl rounded-full"></div>
                    <img src={iconCourse2} alt="Course Icon" className="relative w-[250px] h-[250px] animate-float" />
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Selamat datang di pembelajaran Segitiga!
                    </h2>
                    <p className="text-white/60 max-w-2xl">
                      Mari kita mulai petualangan belajar yang menyenangkan. Setiap langkah membawamu lebih dekat ke penguasaan materi!
                    </p>
                  </div>
                </div>
              )}

              <Suspense fallback={<ContentSkeleton />}>
                {/* Main Content */}
                <div className="mb-8 bg-black/[0.02] border border-white/[0.05] rounded-2xl p-6 lg:p-8 backdrop-blur-sm hover:border-white/10 transition-colors">
                  {/* Section Progress */}
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                        <RiLightbulbLine className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-white/60">Progress Belajar</p>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-32 bg-white/5 rounded-full">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                              style={{ width: `${(activeSection + 1) / sections.length * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-white/80">{Math.round((activeSection + 1) / sections.length * 100)}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/5">
                        <span className="text-sm text-white/80">Bagian {activeSection + 1} dari {sections.length}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <ContentRenderer section={currentSection} />

                  {/* Section Objectives */}
                  <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-white/5">
                    <h3 className="text-lg font-semibold text-white/90 mb-3">Tujuan Pembelajaran</h3>
                    <ul className="space-y-2">
                      {currentSection.objectives?.map((objective, index) => (
                        <li key={index} className="flex items-start gap-2 text-white/70">
                          <div className="h-5 w-5 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs text-blue-400">{index + 1}</span>
                          </div>
                          {objective}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mb-12">
                  <button
                    onClick={() => activeSection > 0 && setActiveSection(activeSection - 1)}
                    className={`flex items-center gap-2 px-2 py-1 transition-all ${
                      activeSection > 0 
                        ? 'text-white/80 hover:text-white' 
                        : 'text-white/20 cursor-not-allowed'
                    }`}
                    disabled={activeSection === 0}
                  >
                    <FiArrowLeft className="w-5 h-5" />
                    <span>Previous</span>
                  </button>
                  <button
                    onClick={() => activeSection < sections.length - 1 && setActiveSection(activeSection + 1)}
                    className={`flex items-center gap-2 px-2 py-1 transition-all ${
                      activeSection < sections.length - 1 
                        ? 'text-white/80 hover:text-white' 
                        : 'text-white/20 cursor-not-allowed'
                    }`}
                    disabled={activeSection === sections.length - 1}
                  >
                    <span>Next</span>
                    <FiArrowLeft className="w-5 h-5 rotate-180" />
                  </button>
                </div>

                {/* Discussion Panel */}
                <div className="mt-12 pt-8 border-t border-white/[0.05]">
                 
                  <div className="bg-black/[0.02] border border-white/[0.05] rounded-2xl p-8 hover:border-white/10 transition-colors backdrop-blur-sm">
                    <DiscussionPanel 
                      materialId={material?.id}
                      sectionId={currentSection.id}
                    />
                  </div>
                </div>
              </Suspense>
            </div>
          </div>
        </main>

        {/* Right Sidebar - Fixed */}
        <aside className={`
          fixed right-0 ${showNav ? 'top-[160px]' : 'top-0'} bottom-16 lg:bottom-20 w-80 lg:w-72
          bg-black/80 backdrop-blur-lg border-l border-white/[0.05]
          transition-all duration-300 z-40
          ${showRightSidebar ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}>
          <div className="h-full p-6 overflow-y-auto">
            <div className="space-y-8">
              {currentSection.quickTips && (
                <QuickTips tips={currentSection.quickTips} />
              )}
              {currentSection.quiz && (
                <QuickQuiz quiz={currentSection.quiz} />
              )}
            </div>
          </div>
        </aside>
      </div>
      

     

      {/* Backdrop for mobile sidebars */}
      {(showLeftSidebar || showRightSidebar) && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => {
            setShowLeftSidebar(false);
            setShowRightSidebar(false);
          }}
        />
      )}

      {/* Media Viewers */}
      {showMedia && currentSection.media?.type === 'image' && (
        <ImageViewer
          url={currentSection.media.url}
          caption={currentSection.media.caption}
          onClose={() => setShowMedia(false)}
        />
      )}
      {showMedia && currentSection.media?.type === 'video' && (
        <VideoPlayer
          url={currentSection.media.url}
          onClose={() => setShowMedia(false)}
        />
      )}
    </div>
    
  );
};

export default TheoryStep; 