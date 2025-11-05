'use client';

import Link from 'next/link';
import Image from 'next/image';
import { GraduationCap, Users, BookOpen, Award, Target, Eye, Heart, Mail, Phone, MapPin } from 'lucide-react';

// Lecturer data with fallback photos
const lecturers = [
  {
    id: 1,
    name: 'Prof. Olajuwon Bakai',
    title: 'Professor',
    specialization: 'Applied Mathematics',
    email: 'adewale.johnson@university.edu',
    image: '/olajuwon.jpg',
  },
  {
    id: 2,
    name: 'Prof. Adeniran Olushola',
    title: 'Professor',
    specialization: 'Algebra',
    email: 'chioma.okonkwo@university.edu',
    image: '/adeniran.jpg',
  },
  {
    id: 3,
    name: 'Dr. Ilojide Emmanuel',
    title: 'Head Of Department',
    specialization: 'Mathematical Statistics',
    email: 'ibrahim.musa@university.edu',
    image: '/ilojide.jpg',
  },
  {
    id: 4,
    name: 'Prof. A.A.A Agboola',
    title: 'Professor',
    specialization: 'Fuzzy Algebra',
    email: 'funmilayo.adeyemi@university.edu',
    image: '/avatar.png',
  },
  {
    id: 5,
    name: 'Prof. Oguntuase James',
    title: 'Professor',
    specialization: 'Analysis',
    email: 'adewale.johnson@university.edu',
    image: '/avatar.png',
  },
  {
    id: 6,
    name: 'Prof. Osinuga Idowu',
    title: 'Professor',
    specialization: 'Optimization',
    email: 'grace.eze@university.edu',
    image: '/avatar.png',
  },
  {
    id: 7,
    name: 'Dr. Adeleke Emmanuel',
    title: 'Senior Lecturer',
    specialization: 'Mathematical Modelling',
    email: 'adewale.johnson@university.edu',
    image: '/avatar.png',
  },
  {
    id: 8,
    name: 'Dr. Ogunsola Olufemi',
    title: 'Lecturer I',
    specialization: 'Applied Mathematics',
    email: 'adewale.johnson@university.edu',
    image: '/ogunsola.jpg',
  },
  {
    id: 9,
    name: 'Dr. Raji Tayo',
    title: 'Senior Lecturer',
    specialization: 'Numerical Analysis',
    email: 'adewale.johnson@university.edu',
    image: '/avatar.png',
  },
  {
    id: 10,
    name: 'Dr. Fagbemiro Olalekan',
    title: 'Senior Lecturer',
    specialization: 'Applied Mathematics',
    email: 'adewale.johnson@university.edu',
    image: '/avatar.png',
  },
  {
    id: 11,
    name: 'Dr. Adeyanju Adedotun',
    title: 'Lecturer I',
    specialization: 'O.D.E',
    email: 'adewale.johnson@university.edu',
    image: '/avatar.png',
  },
  {
    id: 12,
    name: 'Dr. Yusuf Abdullahi',
    title: 'Senior Lecturer',
    specialization: 'Complex Analysis',
    email: 'mohammed.bello@university.edu',
    image: '/yusuf.jpg',
  },
  {
    id: 13,
    name: 'Dr. Adams Oluwasegun',
    title: 'Senior Lecturer',
    specialization: 'Complex Analysis',
    email: 'mohammed.bello@university.edu',
    image: '/adams.jpg',
  },
  {
    id: 14,
    name: 'Dr. Francis Nkwuda',
    title: 'Lecturer II',
    specialization: 'Mathematical Analysis',
    email: 'grace.eze@university.edu',
    image: '/francis.jpg',
  },
];

const stats = [
  { label: 'Students Enrolled', value: '500+', icon: Users },
  { label: 'Faculty Members', value: '25+', icon: GraduationCap },
  { label: 'Research Papers', value: '150+', icon: BookOpen },
  { label: 'Years of Excellence', value: '30+', icon: Award },
];

const programs = [
  {
    title: 'B.Sc. Mathematics',
    duration: '4 Years',
    description: 'A comprehensive undergraduate program covering pure and applied mathematics.',
  },
  {
    title: 'M.Sc. Mathematics',
    duration: '2 Years',
    description: 'Advanced study in specialized areas of mathematics with research opportunities.',
  },
  {
    title: 'Ph.D. Mathematics',
    duration: '3-5 Years',
    description: 'Doctoral research program for aspiring mathematicians and researchers.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/namsn.png" alt="Logo" width={52} height={52} />
            </Link>
            <Link
              href="/"
              className="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                About Our Department
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              The Department offers courses in Mathematics at the undergraduate level leading to the award of B.Sc. (Hons) in Mathematics. The Department also offers Postgraduate Programmes leading to the award of M.Sc. and Ph.D. degrees in Mathematics.

              The Department will operate the following curriculum for its B. Sc. (Hons) Mathematics Programme
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Mathematics is a subject of varied features ranging from intrinsic beauty to its usefulness with wide-scope of applications in Science, Engineering, Technology and Social Sciences. This Mathematics programme is designed for students who are interested in these features. The curriculum has been carefully planned to equip students with a broad knowledge from various aspects of Mathematics.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
              The curriculum has been carefully planned to assist the students to specialize according to their own aptitude in Pure Mathematics or in any area of Applied Mathematics.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <div className="flex items-start space-x-4">
                  <div className="bg-indigo-100 p-3 rounded-lg">
                    <Target className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Missions</h3>
                    <p className="text-gray-600">
                    To train professional Mathematicians to reason rigorously and logically, as well as to be objective and analytical. This can easily make our graduates branch out to be successful in business, system analysis or financial sector.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Eye className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Missions</h3>
                    <p className="text-gray-600">
                    To train Mathematicians to pursue the study of scientific and technological problems by mathematical techniques and to undertake research in various branches of mathematics.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <div className="flex items-start space-x-4">
                  <div className="bg-pink-100 p-3 rounded-lg">
                    <Heart className="h-6 w-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Values</h3>
                    <p className="text-gray-600">
                      Excellence, integrity, innovation, collaboration, and a commitment to student success and academic freedom.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Academic Programs
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive range of programs designed to build strong mathematical foundations and advanced expertise.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-xl shadow-md hover:shadow-xl transition-all border border-indigo-100"
              >
                <div className="bg-white w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{program.title}</h3>
                <div className="text-indigo-600 font-semibold mb-4">{program.duration}</div>
                <p className="text-gray-600">{program.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lecturers Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Department Lecturers
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our distinguished faculty members are dedicated to excellence in teaching and groundbreaking research.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {lecturers.map((lecturer) => (
              <div
                key={lecturer.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden group"
              >
                <div className="relative h-64 bg-gradient-to-br from-indigo-100 to-purple-100 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                    <Image src={lecturer.image} alt={lecturer.name} width={128} height={128} className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{lecturer.name}</h3>
                  <p className="text-indigo-600 font-semibold mb-2">{lecturer.title}</p>
                  <p className="text-gray-600 mb-4">{lecturer.specialization}</p>
                  {/* <a
                    href={`mailto:${lecturer.email}`}
                    className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Contact
                  </a> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get In Touch
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <MapPin className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Visit Us</h3>
                  <p className="text-gray-600">
                    Department of Mathematics<br />
                    College of Physical Sciences<br />
                    Federal University of Agriculture<br />
                    Abeokuta, Ogun State, Nigeria
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Phone className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Call Us</h3>
                  <p className="text-gray-600">
                    +234 (0) 800 000 0000<br />
                    +234 (0) 800 000 0001
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-pink-100 p-3 rounded-lg">
                  <Mail className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h3>
                  <p className="text-gray-600">
                    info@mathematics.funaab.edu.ng<br />
                    admissions@mathematics.funaab.edu.ng
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-xl border border-indigo-100">
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Your message..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Image src="/namsn.png" alt="Logo" width={52} height={52} />
              <span className="text-xl font-bold">Namsn</span>
            </div>
            <p className="text-gray-400 mb-4">
              © 2025 Team ExcelSheOr. All rights reserved.
            </p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
