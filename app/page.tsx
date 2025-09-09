'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Calendar, Users, Award, BookOpen, Star, ChevronDown, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Navigation Component
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="fixed w-full z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          >
            <Image src="/namsn.png" alt="Logo" width={52} height={52} />
          </motion.div>
          <div className="hidden md:flex space-x-8">
            {['Home', 'About', 'Features', 'Team', 'Events', 'Contact'].map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-gray-700 hover:text-indigo-600 transition-all duration-300 font-medium relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
              </motion.a>
            ))}
          </div>
          <div className="flex space-x-4">
            <Link href={"/auth/login"} className="px-6 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-300 font-medium">
              Login
            </Link>
            <Link href={"/auth/register"} className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 font-medium mr-2">
              Get Started
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

const Hero = () => (
  <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50"></div>
    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM4QjVDRjYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
    
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-8"
      >
        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-6xl font-bold text-gray-900 leading-tight">
          The Home{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
            Of Future
          </span> <br />
          Mathematicians
        </h1>
        
        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
        >
          Mathematics is not just about numbers and theorems. Mathematicians are the bridge between theory and breakthrough.
        </motion.p>
        
        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 pt-4"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:shadow-2xl transform transition-all duration-300 font-semibold text-xl"
          >
            Pay Dues Now
          </motion.button>
          
          <motion.a
            href="/auth/register"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-5 border-2 border-gray-300 rounded-2xl hover:bg-gray-50 font-semibold text-xl transition-all duration-300 flex items-center space-x-3"
          >
            <span>Get Course Materials</span>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown className="w-6 h-6" />
            </motion.div>
          </motion.a>
        </motion.div>
        
        {/* Floating Icons/Elements for Visual Interest */}
        <div className="absolute top-20 left-10 opacity-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"
          />
        </div>
        
        <div className="absolute bottom-32 right-16 opacity-20">
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-12 h-12 bg-gradient-to-r from-teal-400 to-indigo-400 rounded-xl"
          />
        </div>
      </motion.div>
    </div>
  </section>
);

// Features Section
const Features = () => {
  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Course Materials",
      description: "Get easy access to course materials",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Announcement Access",
      description: "Get easy access to important announcements and updates",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Payment Portal",
      description: "Pay your dues easily and securely.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Event Management",
      description: "Seamless planning and coordination of academic events and activities.",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Powerful <span className="text-indigo-600">Features</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to modernize your department and enhance educational excellence
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-white mb-6`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Team Section
const Team = () => {
  const teamMembers = [
    {
      name: "Olojede Abisola",
      role: "President",
      image: "/prof.jpg",
      bio: "Leads the department, oversees activities, and represents students in official matters"
    },
    {
      name: "Olutade Akorede",
      role: "Vice President",
      image: "/korede.jpg",
      bio: "Assists the president and takes charge in their absence."
    },
    {
      name: "Abdulazeez Ridwan",
      role: "General Secretary",
      image: "/arridoh.jpg",
      bio: "Coordinates department activities, manages records, and ensures smooth operations."
    },
    {
      name: "Adegbenro Mustapha",
      role: "Asst. General Secretary",
      image: "/kudus.jpg",
      bio: "Supports the secretary and fills in when needed."
    },
    {
      name: "Mercy Osatofo",
      role: "Welfare Director",
      image: "/mercy.jpg",
      bio: "Coordinates welfare activities and ensures student well-being."
    },
    {
      name: "Oyenola Philip",
      role: "Financial Secretary",
      image: "/philip.jpg",
      bio: "Coordinates financial activities and ensures proper management of funds."
    },
    {
      name: "Ajayi Alice",
      role: "Treasurer",
      image: "/alice.jpg",
      bio: "Coordinates financial activities and ensures proper management of funds."
    },
    {
      name: "Olabode Goodness",
      role: "P.R.O 1",
      image: "/ogd.jpg",
      bio: "Handles communication, publicity, and external relations."
    },
    {
      name: "Lelile Oriade",
      role: "Sport Director",
      image: "/kendo.jpg",
      bio: "Coordinates sporting activities and competitions."
    },
    {
      name: "Onadairo Johnson",
      role: "Libarian",
      image: "/hammed.jpg",
      bio: "Manages academic materials, books, and resources."
    },
    {
      name: "Adetoye Martins",
      role: "Social Director",
      image: "/fawas.jpg",
      bio: "Organizes social events and programs."
    },
    {
      name: "Bankole Isreal",
      role: "P.R.O 2",
      image: "/samod.jpg",
      bio: "Assists P.R.O. 1 in publicity and student communication."
    }
  ];

  return (
    <section id="team" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Meet Our <span className="text-indigo-600">Team</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dedicated professionals committed to educational excellence and innovation
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 text-center group"
            >
              <div className="relative mb-6">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
              <p className="text-indigo-600 font-medium mb-4">{member.role}</p>
              <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Events Section
const Events = () => {
  const upcomingEvents = [
    {
      date: "Sep 15",
      title: "Academic Excellence Summit",
      time: "9:00 AM - 5:00 PM",
      location: "Main Auditorium",
      type: "Conference",
      color: "from-blue-500 to-indigo-500"
    },
    {
      date: "Sep 22",
      title: "Student Orientation Program",
      time: "10:00 AM - 2:00 PM",
      location: "Campus Center",
      type: "Orientation",
      color: "from-green-500 to-emerald-500"
    },
    {
      date: "Sep 28",
      title: "Faculty Development Workshop",
      time: "2:00 PM - 6:00 PM",
      location: "Conference Room A",
      type: "Workshop",
      color: "from-purple-500 to-pink-500"
    },
    {
      date: "Oct 05",
      title: "Research Symposium",
      time: "9:00 AM - 4:00 PM",
      location: "Science Building",
      type: "Symposium",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section id="events" className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Upcoming <span className="text-indigo-600">Events</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay connected with the latest academic events, workshops, and department activities
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-start space-x-4">
                <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-r ${event.color} rounded-2xl flex flex-col items-center justify-center text-white font-bold`}>
                  <div className="text-xs">{event.date.split(' ')[0]}</div>
                  <div className="text-lg">{event.date.split(' ')[1]}</div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-3 py-1 bg-gradient-to-r ${event.color} text-white text-xs font-medium rounded-full`}>
                      {event.type}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{event.title}</h3>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-300 font-medium">
            View All Events
          </button>
        </motion.div>
      </div>
    </section>
  );
};

// Statistics Section
const Statistics = () => {
  const stats = [
    { number: "5,000+", label: "Students Served", icon: <Users className="w-8 h-8" /> },
    { number: "95%", label: "Satisfaction Rate", icon: <Star className="w-8 h-8" /> },
    { number: "200+", label: "Faculty Members", icon: <Award className="w-8 h-8" /> },
    { number: "50+", label: "Courses Offered", icon: <BookOpen className="w-8 h-8" /> }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center text-white"
            >
              <div className="mb-4 flex justify-center text-white/80">
                {stat.icon}
              </div>
              <div className="text-4xl font-bold mb-2">{stat.number}</div>
              <div className="text-lg text-white/90">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// About Section
const About = () => (
  <section id="about" className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About Our <span className="text-indigo-600">Department</span>
          </h2>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
          Mathematics is a subject of varied features ranging from intrinsic beauty to its usefulness with wide-scope of applications in Science, Engineering, Technology and Social Sciences. This Mathematics programme is designed for students who are interested in these features. The curriculum has been carefully planned to equip students with a broad knowledge from various aspects of Mathematics.
          </p>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          The curriculum has been carefully planned to assist the students to specialize according to their own aptitude in Pure Mathematics or in any area of Applied Mathematics. The main goals of the programme are:
          </p>
          <div className="space-y-4">
            {["To train professional Mathematicians to reason rigorously and logically.", "To train graduates who are not only qualified in the core subjects but have a good overall ability in the applied mathematics.", "To train Mathematicians to pursue the study of scientific and technological problems"].map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                <span className="text-gray-700 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl p-8">
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop"
              alt="Department Building"
              className="rounded-2xl shadow-xl w-full h-80 object-cover"
            />
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

// Contact Section
const Contact = () => (
  <section id="contact" className="py-20 bg-gray-900 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Get In <span className="text-indigo-400">Touch</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Get in touch with us if you have any questions or inquiries.
        </p>
      </motion.div>
      
      <div className="grid md:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Email Us</h3>
              <p className="text-gray-300">contact@namsn.com</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Call Us</h3>
              <p className="text-gray-300">+234 812 345 6789</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Visit Us</h3>
              <p className="text-gray-300">123 Education Ave, Academic City</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-gray-800 rounded-2xl p-8"
        >
          <form className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:border-indigo-500 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:border-indigo-500 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <textarea
                placeholder="Your Message"
                rows={4}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:border-indigo-500 text-white placeholder-gray-400 resize-none"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 font-medium"
            >
              Send Message
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  </section>
);

// Footer
const Footer = () => (
  <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-4 gap-8">
        <div>
          <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Namsn
          </div>
          <p className="text-gray-400">
            Empowering education through innovative technology solutions.
          </p>
        </div>
        
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <div className="space-y-2">
            {['Home', 'Features', 'Team', 'Events'].map((link) => (
              <a key={link} href={`#${link.toLowerCase()}`} className="block text-gray-400 hover:text-white transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-lg font-semibold mb-4">Services</h4>
          <div className="space-y-2">
            {['Student Management', 'Faculty Portal', 'Analytics', 'Support'].map((service) => (
              <div key={service} className="text-gray-400">{service}</div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-lg font-semibold mb-4">Contact</h4>
          <div className="space-y-2 text-gray-400">
            <p>support@edumanagepro.com</p>
            <p>+1 (555) 123-4567</p>
            <p>123 Education St, Learning City, LC 12345</p>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-800 mt-8 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 EduManage Pro. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
);


export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Features />
      <Events />
      <Team />
      <Contact />
      <Footer />
    </main>
  );
}