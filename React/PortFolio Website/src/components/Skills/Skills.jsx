import { useEffect, useRef } from 'react';
import { SiPython, SiJavascript, SiReact, SiFastapi, SiOpenai, SiPostgresql, SiMongodb, SiGit } from 'react-icons/si';
import { Card, CardContent } from '../ui/card';
import Tilt from '../ui/Tilt';
import { animate, stagger } from 'animejs';

const skills = [
  { name: "Python", icon: SiPython, color: "#3776AB" },
  { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
  { name: "React", icon: SiReact, color: "#61DAFB" },
  { name: "FastAPI", icon: SiFastapi, color: "#009688" },
  { name: "OpenAI", icon: SiOpenai, color: "#10A37F" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "#336791" },
  { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
  { name: "Git", icon: SiGit, color: "#F05032" },
];

const Skills = () => {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate Title
            animate(sectionRef.current.querySelectorAll('.skill-title'), {
              opacity: [0, 1],
              translateY: ['20px', '0px'],
              delay: stagger(100),
              easing: 'easeOutQuad',
            });

            // Animate Grid
            animate(gridRef.current.children, {
              opacity: [0, 1],
              scale: [0.8, 1],
              translateY: ['50px', '0px'],
              delay: stagger(100, { grid: [4, 2], from: 'center' }),
              easing: 'easeOutElastic(1, .6)',
            });
            
            // Animate Background Lines (Network effect)
            const lines = sectionRef.current.querySelectorAll('.network-line');
            lines.forEach(line => {
                const length = line.getTotalLength();
                line.style.strokeDasharray = length;
                line.style.strokeDashoffset = length;
            });

            animate('.network-line', {
              strokeDashoffset: [
                  (el) => el.getTotalLength(),
                  0
              ],
              easing: 'easeInOutSine',
              duration: 3000,
              delay: stagger(500),
              direction: 'alternate',
              loop: true
            });

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="py-24 bg-secondary/5 relative overflow-hidden">
       {/* Abstract Network Background */}
       <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
         <g className="network-lines" fill="none" stroke="currentColor" strokeWidth="2">
            <path className="network-line" d="M-100,50 Q200,150 400,50 T1200,50" />
            <path className="network-line" d="M-100,200 Q300,100 600,200 T1400,100" />
            <path className="network-line" d="M100,-100 Q150,300 400,400 T600,1000" />
            <path className="network-line" d="M800,-100 Q700,300 900,600 T1000,1000" />
         </g>
       </svg>

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="mb-16 text-center md:text-left">
          <h2 className="skill-title opacity-0 text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 mb-4 tracking-widest uppercase">Expertise</h2>
          <h3 className="skill-title opacity-0 text-4xl md:text-5xl font-display font-bold">Technical <span className="text-muted-foreground">Arsenal</span></h3>
          <p className="skill-title opacity-0 text-muted-foreground mt-4 max-w-lg">Technologies I use to bring ideas to life</p>
        </div>

        <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {skills.map((skill, index) => (
            <div key={index} className="opacity-0">
              <Tilt className="h-full">
                <Card 
                  style={{ '--skill-color': skill.color }}
                  className="group hover:border-[var(--skill-color)] transition-all duration-300 h-full bg-background/50 backdrop-blur-sm hover:shadow-[0_0_30px_-10px_var(--skill-color)]"
                >
                  <CardContent className="p-6 flex flex-col items-center justify-center gap-4 aspect-square">
                    <skill.icon size={40} className="text-muted-foreground group-hover:text-[var(--skill-color)] transition-colors duration-300" />
                    <span className="font-medium group-hover:text-[var(--skill-color)] transition-colors duration-300">{skill.name}</span>
                  </CardContent>
                </Card>
              </Tilt>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Skills;
