'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Zap, TrendingUp, Users } from 'lucide-react';

// Type Definitions for Animation Components
interface BaseAnimationProps {
    children: React.ReactNode;
    delay?: number;
}

interface FadeInProps extends BaseAnimationProps {
    duration?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
}

interface SlideInProps extends BaseAnimationProps {
    direction?: 'up' | 'down' | 'left' | 'right';
}

interface ScaleInProps extends BaseAnimationProps {}

interface StaggerChildrenProps {
    children: React.ReactNode;
    staggerDelay?: number;
}

interface CounterAnimationProps {
    end: number | string;
    duration?: number;
    suffix?: string;
    prefix?: string;
}

interface ParallaxProps {
    children: React.ReactNode;
    speed?: number;
}


// FADE IN ANIMATION
export const FadeIn: React.FC<FadeInProps> = ({ children, delay = 0, duration = 0.6, direction = 'up' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        // TypeScript infers ref.current is not null here due to the check
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const getTransform = (): string => {
    switch (direction) {
      case 'up': return 'translateY(30px)';
      case 'down': return 'translateY(-30px)';
      case 'left': return 'translateX(30px)';
      case 'right': return 'translateX(-30px)';
      default: return 'translateY(30px)';
    }
  };

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate(0)' : getTransform(),
        transition: `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

// SLIDE IN ANIMATION
export const SlideIn: React.FC<SlideInProps> = ({ children, delay = 0, direction = 'left' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const getTransform = (): string => {
    switch (direction) {
      case 'left': return 'translateX(-100px)';
      case 'right': return 'translateX(100px)';
      case 'up': return 'translateY(100px)';
      case 'down': return 'translateY(-100px)';
      default: return 'translateX(-100px)';
    }
  };

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate(0)' : getTransform(),
        transition: `all 0.8s ease-out ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

// SCALE ANIMATION
export const ScaleIn: React.FC<ScaleInProps> = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.8)',
        transition: `all 0.6s ease-out ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

// STAGGER CHILDREN
export const StaggerChildren: React.FC<StaggerChildrenProps> = ({ children, staggerDelay = 0.1 }) => {
  return (
    <>
      {React.Children.map(children, (child, index) => (
        <FadeIn key={index} delay={index * staggerDelay} duration={0.5}>
          {child}
        </FadeIn>
      ))}
    </>
  );
};

// COUNTER ANIMATION
export const CounterAnimation: React.FC<CounterAnimationProps> = ({ end, duration = 2, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: DOMHighResTimeStamp | undefined; // Explicitly typed as number, or undefined before first call
    const endValue: number = typeof end === 'string' ? parseInt(end, 10) : end;
    
    // Explicitly type the timestamp parameter
    const animate = (timestamp: DOMHighResTimeStamp) => {
      if (startTime === undefined) startTime = timestamp;
      const progress = (timestamp - startTime) / (duration * 1000);

      if (progress < 1) {
        setCount(Math.floor(endValue * progress));
        requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  );
};

// PARALLAX SCROLL
export const Parallax: React.FC<ParallaxProps> = ({ children, speed = 0.5 }) => {
  const [offset, setOffset] = useState(0);
  const ref = useRef<HTMLDivElement>(null); // Type the ref for div element

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        // ref.current is now correctly typed as HTMLDivElement, resolving the error
        const rect = ref.current.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        // Calculate rate based on scroll position relative to the element's position
        // This is a simpler parallax effect for demo purposes
        const rate = (scrolled - (rect.top + window.scrollY - window.innerHeight)) * speed;
        setOffset(rate);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div
      ref={ref}
      style={{
        // Apply the offset transform
        transform: `translateY(${offset}px)`,
        // Note: For a true background parallax feel, the speed should be less than 1 (0.5 is good).
        transition: 'transform 0.1s ease-out',
      }}
    >
      {children}
    </div>
  );
};

// DEMO PAGE
export default function AnimationDemo() {
  return (
    <div className="min-h-screen bg-white font-sans">
      
      {/* Hero Section with Animations */}
      <section className="pt-32 pb-20 px-6 bg-gray-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <FadeIn direction="up">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
              Animation Components
            </h1>
          </FadeIn>
          
          <FadeIn delay={0.2} direction="up">
            <p className="text-xl text-gray-300 mb-8 max-w-2xl">
              Reusable, responsive animation components built with React and Intersection Observer for performance.
            </p>
          </FadeIn>

          <FadeIn delay={0.4} direction="up">
            <button className="px-8 py-3 bg-teal-400 text-gray-900 rounded-full font-semibold hover:bg-teal-300 transition-colors shadow-lg shadow-teal-500/50">
              Explore Demo
            </button>
          </FadeIn>
        </div>
      </section>

      {/* Parallax Section - Scroll to see the effect */}
      <section className="h-[70vh] flex items-center justify-center bg-gray-100 border-b border-gray-200 overflow-hidden">
        <Parallax speed={0.3}>
            <div className="text-center p-10 bg-white shadow-xl rounded-3xl">
                <h2 className="text-4xl font-bold text-gray-900">Parallax Effect</h2>
                <p className="text-gray-600 mt-2">Scroll down to see this element move slower than the background.</p>
            </div>
        </Parallax>
      </section>

      <div className="h-[100vh] bg-white">
        {/* Counter Stats Section */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
                Animated Counters
              </h2>
            </FadeIn>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <StaggerChildren staggerDelay={0.15}>
                <div className="text-center p-6 bg-gray-50 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Users className="text-teal-600" size={28} />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    <CounterAnimation end={200} duration={1.5} suffix="+" />
                  </div>
                  <div className="text-gray-600">Projects Launched</div>
                </div>

                <div className="text-center p-6 bg-gray-50 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="text-purple-600" size={28} />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    <CounterAnimation end={98} duration={2} suffix="%" />
                  </div>
                  <div className="text-gray-600">Satisfaction Rate</div>
                </div>

                <div className="text-center p-6 bg-gray-50 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="text-blue-600" size={28} />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    <CounterAnimation end={24} duration={1.8} suffix="/7" />
                  </div>
                  <div className="text-gray-600">Hours Support</div>
                </div>

                <div className="text-center p-6 bg-gray-50 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Users className="text-green-600" size={28} />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    <CounterAnimation end={50} duration={2.2} suffix="+" />
                  </div>
                  <div className="text-gray-600">Team Members</div>
                </div>
              </StaggerChildren>
            </div>
          </div>
        </section>

        {/* Slide In Examples */}
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
                Slide In & Scale Animations
              </h2>
            </FadeIn>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <SlideIn direction="left">
                <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-teal-500">
                  <h3 className="text-2xl font-bold mb-4">Slide from Left</h3>
                  <p className="text-gray-600 mb-4">
                    This card slides in smoothly from the left when it enters the viewport.
                  </p>
                  <button className="inline-flex items-center gap-2 text-teal-600 font-semibold hover:text-teal-700 transition-colors">
                    Learn More <ArrowRight size={18} />
                  </button>
                </div>
              </SlideIn>

              <SlideIn direction="right" delay={0.2}>
                <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-blue-500">
                  <h3 className="text-2xl font-bold mb-4">Slide from Right</h3>
                  <p className="text-gray-600 mb-4">
                    This card slides in from the right with a slight delay for emphasis.
                  </p>
                  <button className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                    View Details <ArrowRight size={18} />
                  </button>
                </div>
              </SlideIn>

              <ScaleIn delay={0.4}>
                <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-purple-500">
                  <h3 className="text-2xl font-bold mb-4">Scale In Effect</h3>
                  <p className="text-gray-600 mb-4">
                    This card scales up from a smaller size, providing a subtle pop.
                  </p>
                  <button className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-700 transition-colors">
                    Discover <ArrowRight size={18} />
                  </button>
                </div>
              </ScaleIn>
            </div>
          </div>
        </section>

        {/* Usage Instructions */}
        <section className="py-20 px-6 bg-gray-900 text-white">
          <div className="max-w-4xl mx-auto">
            <FadeIn>
              <h2 className="text-3xl font-bold mb-8">How to Use the Components</h2>
            </FadeIn>

            <StaggerChildren staggerDelay={0.1}>
              <div className="bg-gray-800 rounded-2xl p-6 mb-4 border border-gray-700">
                <h3 className="text-xl font-bold mb-3 text-teal-400">1. FadeIn (General Entrance)</h3>
                <p className="text-gray-300 mb-2">Fades in and slides slightly. Customizable direction and duration.</p>
                <pre className="bg-gray-900 p-3 rounded-lg overflow-x-auto text-sm">
                  <code>{`<FadeIn delay={0.2} direction="up">...</FadeIn>`}</code>
                </pre>
              </div>

              <div className="bg-gray-800 rounded-2xl p-6 mb-4 border border-gray-700">
                <h3 className="text-xl font-bold mb-3 text-teal-400">2. StaggerChildren (Lists/Grids)</h3>
                <p className="text-gray-300 mb-2">Applies a timed delay to each immediate child element.</p>
                <pre className="bg-gray-900 p-3 rounded-lg overflow-x-auto text-sm">
                  <code>{`<StaggerChildren staggerDelay={0.15}>
  {/* List of items */}
</StaggerChildren>`}</code>
                </pre>
              </div>

              <div className="bg-gray-800 rounded-2xl p-6 mb-4 border border-gray-700">
                <h3 className="text-xl font-bold mb-3 text-teal-400">3. CounterAnimation (Statistics)</h3>
                <p className="text-gray-300 mb-2">Animates a number from 0 to the target value.</p>
                <pre className="bg-gray-900 p-3 rounded-lg overflow-x-auto text-sm">
                  <code>{`<CounterAnimation end={10000} prefix="$" duration={2} />`}</code>
                </pre>
              </div>
            </StaggerChildren>
          </div>
        </section>

      </div>

    </div>
  );
}