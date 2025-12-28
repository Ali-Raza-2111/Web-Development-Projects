import { useEffect, useRef } from 'react';
import { Code, Cpu, Zap, GraduationCap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
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
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="focus" ref={sectionRef} className="py-24 bg-background">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="mb-16 focus-anim opacity-0">
          <h2 className="text-sm font-medium text-primary mb-4 tracking-widest uppercase">Focus</h2>
          <h3 className="text-4xl font-display font-bold">Core Philosophies</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {focusAreas.map((area, index) => (
            <div key={index} className="focus-anim opacity-0">
              <Card className="h-full bg-secondary/5 border-border/50 hover:bg-secondary/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30">
                <CardHeader>
                  <area.icon size={32} className="text-primary mb-4" />
                  <CardTitle className="text-xl font-bold">{area.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{area.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {area.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="font-medium">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Focus;
