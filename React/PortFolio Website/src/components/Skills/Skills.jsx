import { motion } from 'framer-motion';
import { SiPython, SiJavascript, SiReact, SiFastapi, SiOpenai, SiPostgresql, SiMongodb, SiGit } from 'react-icons/si';
import { Card, CardContent } from '../ui/card';

const skills = [
  { name: "Python", icon: SiPython },
  { name: "JavaScript", icon: SiJavascript },
  { name: "React", icon: SiReact },
  { name: "FastAPI", icon: SiFastapi },
  { name: "OpenAI", icon: SiOpenai },
  { name: "PostgreSQL", icon: SiPostgresql },
  { name: "MongoDB", icon: SiMongodb },
  { name: "Git", icon: SiGit },
];

const Skills = () => {
  return (
    <section id="skills" className="py-24 bg-secondary/5">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-sm font-medium text-primary mb-4 tracking-widest uppercase">Expertise</h2>
          <h3 className="text-4xl font-display font-bold">Technical Arsenal</h3>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="group hover:border-primary/50 transition-all h-full">
                <CardContent className="p-6 flex flex-col items-center justify-center gap-4 aspect-square">
                  <skill.icon size={40} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="font-medium">{skill.name}</span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Skills;
