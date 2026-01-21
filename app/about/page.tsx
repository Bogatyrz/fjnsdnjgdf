export default function AboutPage() {
  const skills = [
    { name: 'UI/UX Design', level: 95 },
    { name: 'Web Design', level: 90 },
    { name: 'Branding', level: 85 },
    { name: 'Prototyping', level: 90 },
    { name: 'User Research', level: 80 },
    { name: 'Wireframing', level: 90 },
  ];

  const tools = [
    'Figma',
    'Sketch',
    'Adobe XD',
    'Adobe Photoshop',
    'Adobe Illustrator',
    'InVision',
    'Principle',
    'Framer',
  ];

  const experience = [
    {
      year: '2022 - Present',
      role: 'Senior UI/UX Designer',
      company: 'Creative Studio Inc.',
      description: 'Leading design projects for major clients, managing a team of junior designers, and establishing design systems.',
    },
    {
      year: '2020 - 2022',
      role: 'UI/UX Designer',
      company: 'Digital Agency Co.',
      description: 'Designed user interfaces for web and mobile applications, conducted user research, and created interactive prototypes.',
    },
    {
      year: '2018 - 2020',
      role: 'Junior Designer',
      company: 'StartUp Tech',
      description: 'Assisted in creating design assets, participated in brainstorming sessions, and learned industry best practices.',
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-50 via-white to-blue-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6 font-serif">About Me</h1>
              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                Hi! I&apos;m Alex Morgan, a passionate UI/UX designer with over 6 years of experience in creating beautiful, functional, and user-centered digital experiences.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                I believe that great design is not just about aesthetics—it&apos;s about solving problems and creating meaningful connections between people and technology. My approach combines creativity with strategic thinking to deliver designs that are both visually stunning and highly effective.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                When I&apos;m not designing, you can find me exploring new design trends, attending design conferences, or enjoying a good cup of coffee while sketching ideas.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-64 h-64 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-8xl font-bold shadow-2xl">
                      AM
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center font-serif">Skills & Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {skills.map((skill) => (
              <div key={skill.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">{skill.name}</span>
                  <span className="text-sm text-gray-500">{skill.level}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full transition-all duration-1000"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center font-serif">Tools I Use</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {tools.map((tool) => (
              <div
                key={tool}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 text-center"
              >
                <p className="font-semibold text-gray-900">{tool}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center font-serif">Work Experience</h2>
          <div className="max-w-4xl mx-auto space-y-8">
            {experience.map((exp, index) => (
              <div
                key={index}
                className="relative pl-8 pb-8 border-l-2 border-purple-600 last:pb-0"
              >
                <div className="absolute left-0 top-0 w-4 h-4 bg-purple-600 rounded-full -translate-x-[9px]"></div>
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
                  <span className="text-sm font-medium text-purple-600">{exp.year}</span>
                  <h3 className="text-2xl font-bold text-gray-900 mt-2 mb-1">{exp.role}</h3>
                  <p className="text-lg text-gray-600 mb-3">{exp.company}</p>
                  <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 font-serif">Let&apos;s Connect</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Follow me on social media to stay updated with my latest work and design insights.
          </p>
          <div className="flex justify-center gap-6">
            {[
              { name: 'LinkedIn', url: 'https://linkedin.com', color: 'bg-blue-600 hover:bg-blue-700' },
              { name: 'Dribbble', url: 'https://dribbble.com', color: 'bg-pink-500 hover:bg-pink-600' },
              { name: 'Behance', url: 'https://behance.net', color: 'bg-blue-500 hover:bg-blue-600' },
              { name: 'Instagram', url: 'https://instagram.com', color: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' },
            ].map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-8 py-3 ${social.color} text-white rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
              >
                {social.name}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
