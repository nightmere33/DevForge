import React from 'react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">About Me</h1>
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="prose max-w-none">
          <p className="text-lg mb-4">
            I'm currently a <strong>Master 1 student in Computer Science</strong> specializing in <strong>Mobility, Networks, and Embedded Systems</strong>. 
            My passion lies in building efficient, automated solutions that bridge software and hardware.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-3">Education</h2>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Master 1 in Computer Science</strong> – Mobility, Networks & Embedded Systems (2025–Present)</li>
            <li><strong>Bachelor's in Computer Science</strong> – [Your University, Year]</li>
          </ul>
          <h2 className="text-2xl font-semibold mt-6 mb-3">Technical Skills</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Languages</h3>
              <p>Python, JavaScript/TypeScript, Java, C, SQL</p>
            </div>
            <div>
              <h3 className="font-medium">Frameworks & Tools</h3>
              <p>React, Django, Node.js, Selenium, Playwright, Docker, Git</p>
            </div>
            <div>
              <h3 className="font-medium">Automation</h3>
              <p>SeleniumBase, Puppeteer, Tampermonkey scripts</p>
            </div>
            <div>
              <h3 className="font-medium">Networking & Embedded</h3>
              <p>TCP/IP, IoT, Arduino, Raspberry Pi</p>
            </div>
          </div>
          <h2 className="text-2xl font-semibold mt-6 mb-3">What I Do</h2>
          <p>
            I specialize in creating automation scripts (web scraping, testing with Selenium/Playwright), 
            building full-stack web applications, and developing tools for system integration. 
            I also enjoy writing Tampermonkey scripts to enhance web experiences.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;