import { useEffect, useRef } from 'react';
import { Trophy, Award, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { createTimeline, stagger } from 'animejs';

const hackathons = [
  { title: 'Tech Innovation Hackathon', desc: 'AI-powered content generation', date: '2024' },
  { title: 'Code Sprint Challenge', desc: 'Real-time collaboration tool', date: '2024' },
  { title: 'AI/ML Hackathon', desc: 'Intelligent document processing', date: '2023' },
  { title: 'Developer Conference', desc: 'Full-stack AI application', date: '2023' },
];

const certifications = [
  { title: 'Python for Everybody', issuer: 'University of Michigan', date: '2024' },
  { title: 'Machine Learning', issuer: 'DeepLearning.AI', date: '2024' },
  { title: 'Generative AI with LLMs', issuer: 'DeepLearning.AI', date: '2024' },
];

const Achievements = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const timeline = createTimeline({
              easing: 'easeOutQuad',
            });

            timeline
              .add(sectionRef.current.querySelectorAll('.achieve-title'), {
                opacity: [0, 1],
                translateY: ['20px', '0px'],
                duration: 600,
              })
              .add(sectionRef.current.querySelectorAll('.hackathon-item'), {
                opacity: [0, 1],
                translateX: ['-20px', '0px'],
                delay: stagger(100),
                duration: 800,
              }, '-=400')
              .add(sectionRef.current.querySelectorAll('.cert-item'), {
                opacity: [0, 1],
                translateX: ['20px', '0px'],
                delay: stagger(100),
                duration: 800,
              }, '-=800');

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
    <section id="achievements" ref={sectionRef} className="py-24 bg-secondary/5">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="mb-16 achieve-title opacity-0">
          <h2 className="text-sm font-medium text-primary mb-4 tracking-widest uppercase">Milestones</h2>
          <h3 className="text-4xl font-display font-bold">Achievements</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Hackathons */}
          <div>
            <div className="flex items-center gap-3 mb-8 achieve-title opacity-0">
              <Trophy className="text-primary" size={24} />
              <h4 className="text-2xl font-bold">Hackathons</h4>
            </div>
            <div className="space-y-8">
              {hackathons.map((item, index) => (
                <div key={index} className="hackathon-item opacity-0 relative pl-8 border-l border-border/50 hover:border-primary/50 transition-colors duration-300 group">
                  <div className="absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full bg-primary transition-transform duration-300 group-hover:scale-150" />
                  <span className="text-xs font-mono text-muted-foreground mb-1 block">{item.date}</span>
                  <h5 className="text-lg font-bold mb-1">{item.title}</h5>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <div className="flex items-center gap-3 mb-8 achieve-title opacity-0">
              <Award className="text-primary" size={24} />
              <h4 className="text-2xl font-bold">Certifications</h4>
            </div>
            <div className="space-y-4">
              {certifications.map((item, index) => (
                <div key={index} className="cert-item opacity-0">
                  <Card className="hover:border-primary/50 transition-all duration-300 group cursor-default hover:-translate-y-1 hover:shadow-md">
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <h5 className="font-bold text-sm mb-1">{item.title}</h5>
                        <p className="text-xs text-muted-foreground">{item.issuer}</p>
                      </div>
                      <ExternalLink size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Achievements;
