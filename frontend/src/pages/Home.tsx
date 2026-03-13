import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              DevForge – Crafting Code, Building Solutions
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              I'm a Master's student in Computer Science specializing in Mobility, Networks, and Embedded Systems. 
              I build automation scripts, web apps, and tools to solve real-world problems.
            </p>
            <div className="space-x-4">
              <Link
                to="/services"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                See My Services
              </Link>
              <Link
                to="/projects"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
              >
                View Portfolio
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Overview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">My Toolkit</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              'Python', 'JavaScript/TypeScript', 'React', 'Django',
              'Selenium', 'Playwright', 'Node.js', 'PostgreSQL',
              'Automation', 'Embedded C', 'Networking', 'Git'
            ].map(skill => (
              <div key={skill} className="bg-white p-4 rounded-lg shadow text-center font-medium">
                {skill}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to start your project?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Let's discuss your ideas and turn them into reality.
          </p>
          <Link
            to="/contact"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;