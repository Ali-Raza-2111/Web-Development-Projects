import { useEffect, useRef } from 'react';
import { Code, Cpu, Layers } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import Tilt from '../ui/Tilt';
import { createTimeline, stagger } from 'animejs';

const About = () => {
  const sectionRef = useRef(null);
  
  const highlights = [
    { icon: Code, title: 'Backend Focus', desc: 'Scalable systems' },
    { icon: Cpu, title: 'AI Integration', desc: 'Generative AI' },
    { icon: Layers, title: 'Full Stack', desc: 'End-to-end' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const timeline = createTimeline({
              easing: 'easeOutExpo',
            });

            timeline
              .add(sectionRef.current.querySelectorAll('.about-text'), {
                opacity: [0, 1],
                translateY: ['50px', '0px'],
                delay: stagger(100),
                duration: 1000,
              })
              .add(sectionRef.current.querySelectorAll('.word-anim'), {
                opacity: [0, 1],
                translateY: ['20px', '0px'],
                delay: stagger(30),
                duration: 800,
              }, '-=800')
              .add(sectionRef.current.querySelectorAll('.about-card'), {
                opacity: [0, 1],
                translateX: ['50px', '0px'],
                delay: stagger(150),
                duration: 800,
              }, '-=800');

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const splitText = (text) => {
    return text.split(' ').map((word, i) => (
      <span key={i} className="inline-block mr-1 overflow-hidden">
        <span className="word-anim inline-block opacity-0 translate-y-4">{word}</span>
      </span>
    ));
  };

  return (
    <section id="about" ref={sectionRef} className="py-24 md:py-32 bg-background relative">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div className="relative">
            <div className="absolute -left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent hidden md:block" />
            <h2 className="about-text opacity-0 text-sm font-medium text-primary mb-4 tracking-widest uppercase">About Me</h2>
            <h3 className="about-text opacity-0 text-4xl md:text-5xl font-display font-bold mb-8 leading-tight">
              Passionate about building the <span className="text-muted-foreground">future</span>.
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {splitText("I am a software engineer with a deep focus on backend architecture and artificial intelligence. I bridge the gap between complex algorithms and intuitive user experiences.")}
            </p>
          </div>

          <div className="grid gap-6">
            {highlights.map((item, index) => (
              <div key={index} className="about-card opacity-0 group">
                <Tilt>
                  <Card className="bg-secondary/10 border-border/50 hover:bg-secondary/20 transition-all duration-300 hover:shadow-lg hover:border-primary/20">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="p-3 rounded-full bg-background border border-border group-hover:border-primary/50 transition-colors">
                        <item.icon size={24} className="text-primary" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-lg">{item.title}</h4>
                        <p className="text-muted-foreground text-sm">{item.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Tilt>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default About;
