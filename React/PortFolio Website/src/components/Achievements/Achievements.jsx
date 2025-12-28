import { motion } from 'framer-motion';
import { Trophy, Award, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

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
  return (
    <section id="achievements" className="py-24 bg-secondary/5">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-sm font-medium text-primary mb-4 tracking-widest uppercase">Milestones</h2>
          <h3 className="text-4xl font-display font-bold">Achievements</h3>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Hackathons */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Trophy className="text-primary" size={24} />
              <h4 className="text-2xl font-bold">Hackathons</h4>
            </div>
            <div className="space-y-8">
              {hackathons.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-8 border-l border-border/50"
                >
                  <div className="absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full bg-primary" />
                  <span className="text-xs font-mono text-muted-foreground mb-1 block">{item.date}</span>
                  <h5 className="text-lg font-bold mb-1">{item.title}</h5>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Award className="text-primary" size={24} />
              <h4 className="text-2xl font-bold">Certifications</h4>
            </div>
            <div className="space-y-4">
              {certifications.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:border-primary/50 transition-colors group cursor-default">
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <h5 className="font-bold text-sm mb-1">{item.title}</h5>
                        <p className="text-xs text-muted-foreground">{item.issuer}</p>
                      </div>
                      <ExternalLink size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Achievements;
