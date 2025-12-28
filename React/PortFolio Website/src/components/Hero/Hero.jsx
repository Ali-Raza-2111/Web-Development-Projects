import { useEffect, useRef } from 'react';
import { Github, Linkedin, Mail, ArrowDown, Download } from 'lucide-react';
import { Button } from '../ui/button';
import Magnetic from '../ui/Magnetic';
import { animate, createTimeline, stagger, random } from 'animejs';
import profileImg from '../../assets/Personal_Image.jpeg';

const Hero = () => {
  const containerRef = useRef(null);
  const nameRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const ctaRef = useRef(null);
  const socialRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const timeline = createTimeline({
      easing: 'easeOutExpo',
      duration: 1000,
    });

    timeline
      .add(containerRef.current.querySelectorAll('.fade-in-up'), {
        translateY: ['50px', '0px'],
        opacity: [0, 1],
        delay: stagger(100),
      })
      .add(nameRef.current, {
        opacity: [0, 1],
        translateX: ['-50px', '0px'],
        duration: 1200,
      }, '-=800')
      .add(titleRef.current, {
        opacity: [0, 1],
        translateX: ['-30px', '0px'],
        duration: 1000,
      }, '-=1000')
      .add(descRef.current, {
        opacity: [0, 1],
        translateY: ['20px', '0px'],
        duration: 800,
      }, '-=800')
      .add(ctaRef.current.querySelectorAll('.magnetic-wrap'), {
        scale: [0.8, 1],
        opacity: [0, 1],
        delay: stagger(100),
      }, '-=600')
      .add(socialRef.current.children, {
        translateY: ['20px', '0px'],
        opacity: [0, 1],
        delay: stagger(50),
      }, '-=600')
      .add(imageRef.current, {
        opacity: [0, 1],
        translateX: ['50px', '0px'],
        rotate: ['10deg', '0deg'],
        duration: 1200,
      }, '-=1000');

      // Floating animation for background blobs
      animate('.bg-blob', {
        translateY: () => random(-30, 30) + 'px',
        translateX: () => random(-30, 30) + 'px',
        scale: () => random(0.9, 1.1),
        easing: 'easeInOutQuad',
        duration: 5000,
        direction: 'alternate',
        loop: true,
      });

  }, []);

  return (
    <section id="home" className="min-h-screen flex flex-col justify-center px-6 relative overflow-hidden pt-20" ref={containerRef}>
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.5]" />
        <div className="bg-blob absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="bg-blob absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 relative z-10">
            <div className="fade-in-up inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/10 bg-primary/5 backdrop-blur-sm text-xs font-medium text-primary/80 opacity-0 hover:bg-primary/10 transition-colors cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Available for opportunities
            </div>

            <h1 ref={nameRef} className="text-6xl md:text-8xl lg:text-9xl font-display font-bold tracking-tighter leading-[0.9] opacity-0">
              Ali Raza
            </h1>
            
            <h2 ref={titleRef} className="text-2xl md:text-4xl font-light text-muted-foreground max-w-2xl opacity-0">
              Software Engineer <span className="text-foreground">&</span> AI Enthusiast
            </h2>

            <p ref={descRef} className="text-lg text-muted-foreground/80 max-w-xl leading-relaxed opacity-0">
              Crafting scalable backend systems and AI-powered applications with a focus on performance, elegance, and minimal design.
            </p>

            <div ref={ctaRef} className="flex flex-wrap gap-4 pt-4">
              <div className="magnetic-wrap opacity-0">
                <Magnetic>
                  <Button asChild size="lg" className="rounded-full text-base px-8">
                    <a href="#contact">Contact Me</a>
                  </Button>
                </Magnetic>
              </div>
              <div className="magnetic-wrap opacity-0">
                <Magnetic>
                  <Button asChild variant="outline" size="lg" className="rounded-full text-base px-8 gap-2">
                    <a href="/resume.pdf">
                      <Download size={18} />
                      Resume
                    </a>
                  </Button>
                </Magnetic>
              </div>
            </div>

            <div ref={socialRef} className="flex gap-6 pt-8">
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
                  className="text-muted-foreground hover:text-foreground transition-colors opacity-0 hover:scale-110 transform duration-200"
                >
                  <social.icon size={24} />
                </a>
              ))}
            </div>
          </div>

          {/* Image Column */}
          <div className="relative hidden md:block">
            <div ref={imageRef} className="relative w-full max-w-sm mx-auto aspect-[3/4] opacity-0">
              <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 transition-opacity duration-500 group-hover:opacity-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 opacity-60" />
                <img 
                  src={profileImg} 
                  alt="Ali Raza" 
                  className="w-full h-full object-cover grayscale contrast-125 brightness-90 transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:scale-105 group-hover:brightness-100"
                />
              </div>
              {/* Decorative Elements */}
              <div className="absolute -inset-4 border border-primary/20 rounded-2xl -z-10 translate-x-4 translate-y-4" />
              <div className="absolute -inset-4 border border-white/5 rounded-2xl -z-20 -translate-x-4 -translate-y-4" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground">
        <ArrowDown size={24} />
      </div>
    </section>
  );
};

export default Hero;
