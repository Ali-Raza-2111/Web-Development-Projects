import { useEffect, useRef } from 'react';
import { Bot, Brain, Wallet, ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import Tilt from '../ui/Tilt';
import { animate, stagger } from 'animejs';

const projects = [
  {
    title: 'Customer Support Agent',
    description: 'An intelligent AI-powered customer support agent that collects user information through natural conversation, stores data securely in a database, and automatically sends personalized follow-up emails to users.',
    icon: Bot,
    tags: ['Python', 'LangChain', 'PostgreSQL', 'FastAPI', 'Email API'],
    color: '#10A37F',
    features: ['AI Conversation', 'Data Collection', 'Auto Emails', 'Database Storage'],
    github: '#',
    live: '#',
  },
  {
    title: 'FlashQuiz',
    description: 'A smart learning platform that uses RAG (Retrieval-Augmented Generation) to automatically generate interactive quizzes and flashcards from documents uploaded by users, making studying more efficient.',
    icon: Brain,
    tags: ['RAG', 'OpenAI', 'Vector DB', 'React', 'FastAPI'],
    color: '#8B5CF6',
    features: ['Document Upload', 'AI Quiz Generation', 'Flashcards', 'RAG System'],
    github: '#',
    live: '#',
  },
  {
    title: 'Academy Finance System',
    description: 'A comprehensive financial management system designed for educational academies. Handles all financial operations including fee collection, expense tracking, payroll, and detailed financial reporting.',
    icon: Wallet,
    tags: ['React', 'Node.js', 'PostgreSQL', 'Charts.js', 'PDF Reports'],
    color: '#F59E0B',
    features: ['Fee Management', 'Expense Tracking', 'Payroll', 'Reports'],
    github: '#',
    live: '#',
  },
];

const Projects = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(sectionRef.current.querySelectorAll('.project-anim'), {
              opacity: [0, 1],
              translateY: ['50px', '0px'],
              delay: stagger(200),
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
    <section id="projects" ref={sectionRef} className="py-24 bg-secondary/5 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/5 rounded-full blur-[120px]" />
      
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="mb-16 project-anim text-center">
          <h2 className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 mb-4 tracking-widest uppercase">Portfolio</h2>
          <h3 className="text-4xl md:text-5xl font-display font-bold mb-4">Featured <span className="text-muted-foreground">Projects</span></h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">A selection of projects that showcase my expertise in AI integration, backend architecture, and full-stack development.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="project-anim">
              <Tilt className="h-full">
                <Card 
                  style={{ '--project-color': project.color }}
                  className="h-full bg-background/80 backdrop-blur-sm border-border/30 hover:border-[var(--project-color)]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[var(--project-color)]/10 group overflow-hidden relative"
                >
                  {/* Top Gradient Line */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(90deg, transparent, ${project.color}, transparent)` }}
                  />
                  
                  {/* Gradient Glow */}
                  <div 
                    className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-30 transition-opacity duration-700"
                    style={{ background: project.color }}
                  />
                  
                  <CardHeader className="relative z-10 pb-4">
                    {/* Icon */}
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110"
                      style={{ 
                        background: `linear-gradient(135deg, ${project.color}20, ${project.color}10)`,
                        border: `1px solid ${project.color}30`
                      }}
                    >
                      <project.icon size={28} style={{ color: project.color }} />
                    </div>
                    
                    <CardTitle className="text-xl font-bold group-hover:text-[var(--project-color)] transition-colors duration-300">
                      {project.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="relative z-10 space-y-6">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {project.description}
                    </p>
                    
                    {/* Features */}
                    <div className="grid grid-cols-2 gap-2">
                      {project.features.map((feature, i) => (
                        <div 
                          key={i} 
                          className="flex items-center gap-2 text-xs text-muted-foreground"
                        >
                          <div 
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: project.color }}
                          />
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="secondary" 
                          className="text-xs bg-secondary/50 hover:bg-[var(--project-color)]/10 hover:text-[var(--project-color)] transition-colors duration-200"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button 
                        asChild 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 rounded-full border-border/50 hover:border-[var(--project-color)]/50 hover:bg-[var(--project-color)]/5 group/btn"
                      >
                        <a href={project.github} target="_blank" rel="noopener noreferrer">
                          <Github size={16} className="mr-2" />
                          Code
                        </a>
                      </Button>
                      <Button 
                        asChild 
                        size="sm" 
                        className="flex-1 rounded-full group/btn"
                        style={{ 
                          background: `linear-gradient(135deg, ${project.color}, ${project.color}CC)`,
                        }}
                      >
                        <a href={project.live} target="_blank" rel="noopener noreferrer">
                          Live Demo
                          <ArrowUpRight size={16} className="ml-2 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Tilt>
            </div>
          ))}
        </div>
        
        {/* View All Projects Link */}
        <div className="mt-16 text-center project-anim">
          <a 
            href="https://github.com/Ali-Raza-2111" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            View all projects on GitHub
            <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;
