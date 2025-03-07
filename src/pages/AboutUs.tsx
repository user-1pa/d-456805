// src/pages/AboutUs.tsx
import React from 'react';

export default function AboutUs() {
  // Sample team data
  const teamMembers = [
    {
      name: 'Alex Davis',
      role: 'Founder & CEO',
      bio: 'Former professional athlete with a passion for making fitness accessible to everyone. Alex founded 4ortune Fitness with a mission to blend technology and exercise science.',
      imageSrc: '/team/alex-davis.jpg',
    },
    {
      name: 'Jamie Chen',
      role: 'Chief Product Officer',
      bio: 'Product design expert with 15+ years of experience creating innovative fitness equipment. Jamie leads our product development team with a focus on ergonomics and functionality.',
      imageSrc: '/team/jamie-chen.jpg',
    },
    {
      name: 'Taylor Wilson',
      role: 'Head of Training',
      bio: 'Certified strength and conditioning specialist with a background in sports medicine. Taylor oversees our workout programs and ensures they're scientifically sound.',
      imageSrc: '/team/taylor-wilson.jpg',
    },
    {
      name: 'Morgan Lee',
      role: 'Director of Operations',
      bio: 'Supply chain expert who ensures our products are sustainably sourced and efficiently delivered. Morgan's leadership has been crucial to our growth.',
      imageSrc: '/team/morgan-lee.jpg',
    },
  ];
  
  // Values data
  const values = [
    {
      title: 'Quality',
      description: 'We never compromise on the materials, design, or construction of our products. Everything we make is built to last through years of intense training.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: 'Innovation',
      description: 'We're constantly researching the latest advances in exercise science and materials to bring you the most effective fitness solutions possible.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      title: 'Inclusivity',
      description: 'Fitness is for everyone. We design our products and programs to be accessible to people of all fitness levels, body types, and backgrounds.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      title: 'Sustainability',
      description: 'We're committed to reducing our environmental impact through sustainable materials, ethical manufacturing, and eco-friendly packaging.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];
  
  // Timeline/history data
  const timeline = [
    {
      year: '2018',
      title: 'The Beginning',
      description: 'Founded in a small garage with a vision to create better fitness equipment',
    },
    {
      year: '2019',
      title: 'First Product Launch',
      description: 'Released our flagship adjustable dumbbells, selling out within the first month',
    },
    {
      year: '2020',
      title: 'Digital Expansion',
      description: 'Launched our online training platform to help people exercise effectively at home',
    },
    {
      year: '2021',
      title: 'Product Line Expansion',
      description: 'Introduced our apparel line and expanded equipment offerings to over 50 products',
    },
    {
      year: '2022',
      title: 'Going Global',
      description: 'Expanded shipping to 25 countries and opened our first international warehouse',
    },
    {
      year: '2023',
      title: 'Sustainability Initiative',
      description: 'Committed to 100% sustainable packaging and carbon-neutral shipping',
    },
    {
      year: '2024',
      title: 'AI Fitness Coach',
      description: 'Introduced our AI-powered fitness assistant to provide personalized guidance',
    },
    {
      year: '2025',
      title: 'New Headquarters',
      description: 'Moved into our new eco-friendly headquarters with an employee fitness center',
    },
  ];
  
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-60"></div>
          <img
            src="/images/about-hero.jpg"
            alt="Team working out together"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">About 4ortune Fitness</h1>
          <p className="text-xl max-w-3xl">
            We're on a mission to transform lives through innovative fitness products and accessible training solutions.
          </p>
        </div>
      </div>
      
      {/* Our Story Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="prose prose-lg">
              <p>
                4ortune Fitness began in 2018 with a simple observation: fitness equipment hadn't evolved much in decades, 
                despite significant advances in materials science and exercise research.
              </p>
              <p>
                Our founder, Alex Davis, a former professional athlete, was frustrated with the limitations of existing 
                equipment and decided to create something better. Starting with a small team of engineers and fitness 
                experts, 4ortune developed its first prototype: an innovative set of adjustable dumbbells that saved 
                space without sacrificing quality.
              </p>
              <p>
                The response was overwhelming. Within a month of launch, our first production run sold out completely. 
                We knew we had tapped into something important: people want fitness equipment that's thoughtfully designed, 
                built to last, and enhances their workout experience.
              </p>
              <p>
                Since then, we've expanded our product line to include everything from cutting-edge resistance training 
                equipment to performance apparel. But our mission remains the same: to create innovative fitness solutions 
                that help people achieve their health and wellness goals, regardless of their experience level or background.
              </p>
              <p>
                Today, 4ortune Fitness serves customers in over 25 countries and continues to push the boundaries of what's 
                possible in fitness equipment design and training methodology.
              </p>
            </div>
          </div>
          <div className="mt-10 lg:mt-0">
            <img
              src="/images/about-story.jpg"
              alt="4ortune Fitness original garage workshop"
              className="rounded-lg shadow-lg"
            />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <img
                src="/images/about-product.jpg"
                alt="Original prototype dumbbells"
                className="rounded-lg shadow-lg"
              />
              <img
                src="/images/about-team.jpg"
                alt="Early team members"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Our Values */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Values</h2>
            <p className="text-lg text-gray-600 mb-12">
              The core principles that guide everything we do at 4ortune Fitness.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="bg-black p-4 flex justify-center">
                  <div className="rounded-full p-3 bg-gray-800">
                    {value.icon}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Our Team */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Team</h2>
          <p className="text-lg text-gray-600 mb-12">
            Meet the passionate individuals behind 4ortune Fitness.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden border">
              <div className="aspect-w-1 aspect-h-1">
                <img
                  src={member.imageSrc}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/300?text=Team+Member';
                  }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-black font-medium mb-2">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Our Journey Timeline */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Journey</h2>
            <p className="text-lg text-gray-600 mb-12">
              The key milestones in our path to becoming a leader in fitness innovation.
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-300"></div>
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div 
                  key={index} 
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'justify-start' : 'justify-end'
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-black"></div>
                  
                  {/* Content */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <div className="inline-block py-1 px-3 rounded-full bg-black text-white text-sm font-medium mb-2">
                      {item.year}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mission & Vision */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <div className="prose prose-lg">
              <p>
                To create innovative fitness products and provide accessible training solutions that 
                empower people of all fitness levels to achieve their health and wellness goals.
              </p>
              <p>
                We believe that fitness should be enjoyable, effective, and accessible to everyone. 
                That's why we design our products with a focus on user experience, effectiveness, 
                and inclusivity. Whether you're just starting your fitness journey or you're a 
                seasoned athlete, 4ortune Fitness has the tools and resources you need to succeed.
              </p>
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
            <div className="prose prose-lg">
              <p>
                To be the global leader in fitness innovation, setting new standards for what's possible 
                in exercise equipment design and training methodology.
              </p>
              <p>
                We envision a world where fitness is a natural, enjoyable part of daily life for everyone. 
                A world where people have access to the best possible tools and knowledge to improve their 
                physical wellbeing. Through continuous innovation and a commitment to quality, we aim to 
                make this vision a reality.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Join Us CTA */}
      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Journey</h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            We're always looking for passionate individuals to join our team and help us revolutionize the fitness industry.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/careers"
              className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-100"
            >
              View Careers
            </a>
            <a
              href="/contact"
              className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-black"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
