import { useState, useEffect, useRef } from 'react';
import { Send, CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { animate, stagger } from 'animejs';

const Contact = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const sectionRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(sectionRef.current.querySelectorAll('.contact-anim'), {
              opacity: [0, 1],
              translateY: ['30px', '0px'],
              delay: stagger(100),
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Animate button scale
    animate('.submit-btn', {
        scale: [1, 0.95, 1],
        duration: 300,
        easing: 'easeInOutQuad'
    });

    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormState({ name: '', email: '', message: '' });
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <section id="contact" ref={sectionRef} className="py-24 bg-background relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] translate-y-1/2" />
      
      <div className="container mx-auto px-6 max-w-3xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="contact-anim opacity-0 text-sm font-medium text-primary mb-4 tracking-widest uppercase">Get in Touch</h2>
          <h3 className="contact-anim opacity-0 text-4xl md:text-5xl font-display font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text">Let's build something amazing.</h3>
          <p className="contact-anim opacity-0 text-muted-foreground text-lg">
            Have a project in mind or just want to say hi? I'm always open to discussing new opportunities.
          </p>
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="contact-anim opacity-0 space-y-6 bg-secondary/5 backdrop-blur-sm p-8 rounded-3xl border border-border/50 shadow-xl"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-muted-foreground">Name</label>
              <Input
                type="text"
                id="name"
                required
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                placeholder="John Doe"
                className="bg-secondary/5"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-muted-foreground">Email</label>
              <Input
                type="email"
                id="email"
                required
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                placeholder="john@example.com"
                className="bg-secondary/5"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-muted-foreground">Message</label>
            <Textarea
              id="message"
              required
              rows={6}
              value={formState.message}
              onChange={(e) => setFormState({ ...formState, message: e.target.value })}
              placeholder="Tell me about your project..."
              className="bg-secondary/5 resize-none"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "submit-btn w-full py-6 text-base rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/25",
              isSubmitted ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600" : "bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            )}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin mr-2" />
            ) : isSubmitted ? (
              <>
                <CheckCircle size={20} className="mr-2" />
                Message Sent
              </>
            ) : (
              <>
                Send Message
                <Send size={18} className="ml-2" />
              </>
            )}
          </Button>
        </form>
      </div>
    </section>
  );
};
export default Contact;
