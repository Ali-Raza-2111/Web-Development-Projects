import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ArrowDown, Download } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex flex-col justify-center px-6 relative overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/50 bg-secondary/20 backdrop-blur-sm text-xs font-medium text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Available for opportunities
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold tracking-tighter leading-[0.9]">
            Ali Raza
          </h1>
          
          <h2 className="text-2xl md:text-4xl font-light text-muted-foreground max-w-2xl">
            Software Engineer <span className="text-foreground">&</span> AI Enthusiast
          </h2>

          <p className="text-lg text-muted-foreground/80 max-w-xl leading-relaxed">
            Crafting scalable backend systems and AI-powered applications with a focus on performance, elegance, and minimal design.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Button asChild size="lg" className="rounded-full text-base px-8">
              <a href="#contact">Contact Me</a>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full text-base px-8 gap-2">
              <a href="/resume.pdf">
                <Download size={18} />
                Resume
              </a>
            </Button>
          </div>

          <div className="flex gap-6 pt-8">
            {[
              { icon: Github, href: "https://github.com" },
              { icon: Linkedin, href: "https://linkedin.com" },
              { icon: Mail, href: "mailto:hello@aliraza.dev" }
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <social.icon size={24} />
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground"
      >
        <ArrowDown size={24} />
      </motion.div>
    </section>
  );
};

export default Hero;
