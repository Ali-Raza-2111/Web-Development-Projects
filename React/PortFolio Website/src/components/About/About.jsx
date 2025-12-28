import { motion } from 'framer-motion';
import { Code, Cpu, Layers } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Card, CardContent } from '../ui/card';

const About = () => {
  const highlights = [
    { icon: Code, title: 'Backend Focus', desc: 'Scalable systems' },
    { icon: Cpu, title: 'AI Integration', desc: 'Generative AI' },
    { icon: Layers, title: 'Full Stack', desc: 'End-to-end' },
  ];

  return (
    <section id="about" className="py-24 md:py-32 bg-background relative">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-medium text-primary mb-4 tracking-widest uppercase">About Me</h2>
            <h3 className="text-4xl md:text-5xl font-display font-bold mb-8 leading-tight">
              Passionate about building the <span className="text-muted-foreground">future</span>.
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              I am a software engineer with a deep focus on backend architecture and artificial intelligence. 
              I bridge the gap between complex algorithms and intuitive user experiences.
            </p>
          </motion.div>

          <div className="grid gap-6">
            {highlights.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="bg-secondary/10 border-border/50 hover:bg-secondary/20 transition-colors">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 rounded-full bg-background border border-border">
                      <item.icon size={24} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-lg">{item.title}</h4>
                      <p className="text-muted-foreground text-sm">{item.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default About;
