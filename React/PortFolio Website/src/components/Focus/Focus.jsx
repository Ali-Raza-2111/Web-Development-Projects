import { useEffect, useRef } from 'react';
import { Code, Cpu, Zap, GraduationCap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import Tilt from '../ui/Tilt';
import { animate, stagger } from 'animejs';

const focusAreas = [
  {
    icon: Code,
    title: 'Backend Architecture',
    description: 'Building robust, scalable backend systems with clean architecture principles.',
    tags: ['FastAPI', 'REST APIs', 'System Design'],
  },
  {
    icon: Cpu,
    title: 'AI Integration',
    description: 'Integrating large language models and generative AI into practical applications.',
    tags: ['OpenAI', 'LangChain', 'RAG Systems'],
  },
  {
    icon: Zap,
    title: 'Agentic Systems',
    description: 'Exploring and building autonomous AI agents using cutting-edge frameworks.',
    tags: ['LangGraph', 'AutoGen', 'Agent SDK'],
  },
  {
    icon: GraduationCap,
    title: 'Continuous Learning',
    description: 'Dedicated to staying current with emerging technologies and best practices.',
    tags: ['Coursera', 'Hackathons', 'Open Source'],
  },
];

const Focus = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(sectionRef.current.querySelectorAll('.focus-anim'), {
              opacity: [0, 1],
              translateY: ['30px', '0px'],
              delay: stagger(150),
              easing: 'easeOutQuad',
              duration: 800,
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="focus" ref={sectionRef} className="py-24 bg-background relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-purple-500/5 rounded-full blur-[100px] -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-72 h-72 bg-pink-500/5 rounded-full blur-[100px] -translate-y-1/2" />
      
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="mb-16 focus-anim text-center md:text-left">
          <h2 className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 mb-4 tracking-widest uppercase">Focus</h2>
          <h3 className="text-4xl md:text-5xl font-display font-bold">Core <span className="text-muted-foreground">Philosophies</span></h3>
          <p className="text-muted-foreground mt-4 max-w-lg">The principles that guide my work and passion</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {focusAreas.map((area, index) => (
            <div key={index} className="focus-anim">
              <Tilt className="h-full">
                <Card className="h-full bg-secondary/5 border-border/30 hover:bg-secondary/10 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 group overflow-hidden relative">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardHeader className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center mb-4 group-hover:from-primary/20 group-hover:to-purple-500/20 transition-all duration-300">
                      <area.icon size={28} className="text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors duration-300">{area.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <p className="text-muted-foreground mb-6 leading-relaxed">{area.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {area.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="font-medium bg-secondary/50 hover:bg-primary/10 hover:text-primary transition-colors duration-200">
                          {tag}
                        </Badge>
                      ))}
                    </div>
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
export default Focus;
