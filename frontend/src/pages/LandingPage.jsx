// frontend/src/pages/LandingPage.jsx

import React, { useRef, useEffect, useState } from 'react';
import { Sparkles, MessageSquare, UserCheck, ArrowRight, Shield, Quote } from 'lucide-react';
import { Card } from '../components/Card';

const primaryBtn = "rounded-xl bg-black px-6 py-3 text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors";

export function LandingPage({ navigate }) {
  const scrollerRef = useRef(null);
  const granimRef = useRef(null);
  const heroRef = useRef(null);
  const orbARef = useRef(null);
  const orbBRef = useRef(null);
  const [demoMessages, setDemoMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const testimonials = [
    {
      name: 'Raja Sharma',
      role: 'Post liver transplant patient',
      quote: 'The best part is the practical, lived experience. It helped me focus on what truly matters during recovery.',
    },
    {
      name: 'Zichuan Wang',
      role: 'Kidney transplant mentor',
      quote: 'Clear guidance and a safe chat—exactly what I needed the week before and after surgery.',
    },
    {
      name: 'Zian Hassan',
      role: 'Chemo support mentor',
      quote: 'Matching by lifestyle made it easy to talk. We shared routines that actually worked for us.',
    },
    {
      name: 'Nicholas Pisciotta',
      role: 'Heart surgery patient',
      quote: 'Fast introductions, real talk, and immediate value. I felt calmer and more prepared.',
    },
    {
      name: 'Joshua Obogbaimhe',
      role: 'Long COVID recovery mentor',
      quote: 'It feels approachable. I asked questions that are tough to ask elsewhere and got honest answers.',
    },
    {
      name: 'Michael Sanchez',
      role: 'Caregiver & patient advocate',
      quote: 'Small touches—calm color and clarity—made it easier to ask for help and share tips.',
    },
    {
      name: 'Moses Parente',
      role: 'Bone marrow transplant patient',
      quote: 'Reliable and simple—exactly what you want when everything else feels complicated.',
    },
    {
      name: 'Oren Steinberg',
      role: 'Peer mentor (surgical recovery)',
      quote: 'Peer mentorship adds empathetic context beyond the medical facts. This makes a difference.',
    },
    {
      name: 'Ming Lei',
      role: 'Chemo patient',
      quote: 'A thoughtful use of tech—simple, calm, and useful when you need reassurance most.',
    },
    {
      name: 'Freeman (Noryve) Irabaruta',
      role: 'Care partner & mentor',
      quote: 'It guides people to the right conversation at the right time. That timing matters.',
    },
  ];

  function TestimonialsCarousel({ testimonials }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const goToNext = () => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      setTimeout(() => setIsAnimating(false), 500);
    };

    const goToPrev = () => {
      if (isAnimating) return;
      setIsAnimating(true);
      setIsPaused(true);
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      setTimeout(() => setIsAnimating(false), 500);
    };

    const goToIndex = (index) => {
      if (isAnimating || index === currentIndex) return;
      setIsAnimating(true);
      setIsPaused(true);
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 500);
    };

    useEffect(() => {
      if (isPaused) return;
      const interval = setInterval(goToNext, 7000);
      return () => clearInterval(interval);
    }, [currentIndex, isPaused]);

    const t = testimonials[currentIndex];
    const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(t.name)}&backgroundType=gradientLinear`;

    return (
      <div className="relative max-w-4xl mx-auto">
        {/* Main testimonial card */}
        <div className="relative rounded-2xl p-8 md:p-12 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-lg">
          {/* Subtle quote icon decoration */}
          <div className="absolute top-6 left-6 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
            <Quote className="h-16 w-16 text-gray-900 dark:text-white" />
          </div>

          {/* Content */}
          <div className={`relative transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
            {/* Quote text */}
            <p className="text-lg md:text-xl leading-relaxed text-gray-700 dark:text-neutral-300 mb-8 italic">
              "{t.quote}"
            </p>

            {/* Author info */}
            <div className="flex items-center gap-4">
              <img 
                src={avatar} 
                alt={t.name} 
                className="h-14 w-14 rounded-full ring-2 ring-gray-200 dark:ring-neutral-700 flex-shrink-0" 
              />
              <div>
                <div className="font-semibold text-lg text-gray-900 dark:text-neutral-100">
                  {t.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-neutral-400">
                  {t.role}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation controls */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={goToPrev}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50"
            aria-label="Previous testimonial"
          >
            ‹
          </button>

          {/* Dots indicator */}
          <div className="flex items-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'w-8 bg-indigo-600 dark:bg-indigo-400' 
                    : 'w-2 bg-gray-300 dark:bg-neutral-700 hover:bg-gray-400 dark:hover:bg-neutral-600'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={goToNext}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50"
            aria-label="Next testimonial"
          >
            ›
          </button>
        </div>
      </div>
    );
  }

  const colorMap = {
    indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/40', text: 'text-indigo-700 dark:text-indigo-300' },
    green: { bg: 'bg-green-100 dark:bg-green-900/40', text: 'text-green-700 dark:text-green-300' },
    purple: { bg: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-700 dark:text-purple-300' },
    amber: { bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-700 dark:text-amber-300' },
    rose: { bg: 'bg-rose-100 dark:bg-rose-900/40', text: 'text-rose-700 dark:text-rose-300' },
    cyan: { bg: 'bg-cyan-100 dark:bg-cyan-900/40', text: 'text-cyan-700 dark:text-cyan-300' },
    violet: { bg: 'bg-violet-100 dark:bg-violet-900/40', text: 'text-violet-700 dark:text-violet-300' },
    teal: { bg: 'bg-teal-100 dark:bg-teal-900/40', text: 'text-teal-700 dark:text-teal-300' }
  };

  const scrollLeft = () => scrollerRef.current?.scrollBy({ left: -Math.round(scrollerRef.current.clientWidth * 0.9), behavior: 'smooth' });
  const scrollRight = () => scrollerRef.current?.scrollBy({ left: Math.round(scrollerRef.current.clientWidth * 0.9), behavior: 'smooth' });

  const onHeroMouseMove = (e) => {
    const el = heroRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;  // -0.5..0.5 approx
    const dy = (e.clientY - cy) / rect.height;
    const txA = (-dx * 30).toFixed(2); // px
    const tyA = (-dy * 30).toFixed(2);
    const txB = (dx * 40).toFixed(2);
    const tyB = (dy * 40).toFixed(2);
    if (orbARef.current) {
      orbARef.current.style.transform = `translate3d(${txA}px, ${tyA}px, 0) scale(1.02)`;
    }
    if (orbBRef.current) {
      orbBRef.current.style.transform = `translate3d(${txB}px, ${tyB}px, 0) scale(1.02)`;
    }
  };

  const onHeroMouseLeave = () => {
    if (orbARef.current) orbARef.current.style.transform = 'translate3d(0,0,0) scale(1)';
    if (orbBRef.current) orbBRef.current.style.transform = 'translate3d(0,0,0) scale(1)';
  };

  useEffect(() => {
    if (!window.Granim) return;
    if (granimRef.current) return;
    granimRef.current = new window.Granim({
      element: '#gradient-canvas',
      name: 'heallink-bg',
      direction: 'diagonal',
      opacity: [1, 1],
      isPausedWhenNotInView: true,
      states: {
        'default-state': {
          gradients: [
            ['#4f46e5', '#a78bfa'], // indigo -> violet
            ['#06b6d4', '#22d3ee'], // cyan tones
            ['#16a34a', '#86efac']  // green tones
          ],
          transitionSpeed: 8000
        },
        'cta-state': {
          gradients: [
            ['#f59e0b', '#ef4444'], // amber -> red
            ['#ef4444', '#8b5cf6']  // red -> violet
          ],
          transitionSpeed: 4000
        }
      }
    });
    return () => {
      try { granimRef.current?.destroy(); } catch (_) { /* noop */ }
      granimRef.current = null;
    };
  }, []);

  useEffect(() => {
    let active = true;
    let conversationIndex = 0;
    
    const conversations = [
      [
        { delay: 600, typing: true },
        { delay: 1800, typing: false, msg: { from: 'mentor', text: 'Welcome! Happy to chat about surgery day and the first week home.' } },
        { delay: 600, typing: true },
        { delay: 1600, typing: false, msg: { from: 'mentee', text: 'Thanks, Omar! Any tips for sleep the first few nights?' } },
        { delay: 800, typing: true },
        { delay: 1700, typing: false, msg: { from: 'mentor', text: 'Short walks, a pillow for support, and a light snack helped me.' } },
      ],
      [
        { delay: 600, typing: true },
        { delay: 1600, typing: false, msg: { from: 'mentor', text: 'Hey! I went through chemo last year. What questions do you have?' } },
        { delay: 700, typing: true },
        { delay: 1500, typing: false, msg: { from: 'mentee', text: 'Did you have trouble with nausea? What worked for you?' } },
        { delay: 900, typing: true },
        { delay: 1800, typing: false, msg: { from: 'mentor', text: 'Ginger tea and small meals every 2 hours made a big difference for me.' } },
      ],
      [
        { delay: 600, typing: true },
        { delay: 1700, typing: false, msg: { from: 'mentor', text: 'Hi! I had my kidney transplant 3 years ago. Here to help!' } },
        { delay: 650, typing: true },
        { delay: 1400, typing: false, msg: { from: 'mentee', text: 'How long before you felt back to normal activities?' } },
        { delay: 850, typing: true },
        { delay: 1600, typing: false, msg: { from: 'mentor', text: 'About 6 weeks for me. Listen to your body and don\'t rush it.' } },
      ],
      [
        { delay: 600, typing: true },
        { delay: 1500, typing: false, msg: { from: 'mentor', text: 'Welcome! I\'m here to share what helped me during recovery.' } },
        { delay: 700, typing: true },
        { delay: 1550, typing: false, msg: { from: 'mentee', text: 'What should I pack for the hospital stay?' } },
        { delay: 800, typing: true },
        { delay: 1750, typing: false, msg: { from: 'mentor', text: 'Comfy clothes, phone charger, and lip balm. Keep it simple!' } },
      ],
      [
        { delay: 600, typing: true },
        { delay: 1650, typing: false, msg: { from: 'mentor', text: 'Hi there! Happy to answer questions about the first month post-op.' } },
        { delay: 750, typing: true },
        { delay: 1450, typing: false, msg: { from: 'mentee', text: 'When did you start feeling like yourself again?' } },
        { delay: 900, typing: true },
        { delay: 1700, typing: false, msg: { from: 'mentor', text: 'Week 3 was the turning point for me. Hang in there!' } },
      ],
    ];

    const run = async () => {
      const script = conversations[conversationIndex % conversations.length];
      conversationIndex++;
      
      setDemoMessages([]);
      setTyping(false);
      for (const step of script) {
        await new Promise(r => setTimeout(r, step.delay));
        if (!active) return;
        if (step.typing) {
          setTyping(true);
        } else {
          setTyping(false);
          if (step.msg) setDemoMessages(prev => [...prev, step.msg]);
        }
      }
    };

    run();
    const loop = setInterval(run, 15000);
    return () => { active = false; clearInterval(loop); };
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-16">
      {/* Hero Section */}
      <Card ref={heroRef} onMouseMove={onHeroMouseMove} onMouseLeave={onHeroMouseLeave} className="relative overflow-hidden p-8 md:p-12 bg-gradient-to-b from-indigo-50 to-white dark:from-neutral-900 dark:to-neutral-950 border-2 dark:border-neutral-700 shadow-xl">
        {/* --- MODIFIED: Replaced Sparkles icon with your icon.svg --- */}
        <div className="mx-auto max-w-6xl grid gap-8 md:grid-cols-2 md:items-center">
          <div className="text-center md:text-left">
            <div className="flex h-16 w-16 mx-auto md:mx-0 items-center justify-center rounded-2xl bg-white/70 ring-1 ring-indigo-200 backdrop-blur-sm dark:bg-neutral-800/60 dark:ring-neutral-700">
              <img src="/icon.svg" alt="HealLink Icon" className="h-10 w-10 dark:invert dark:brightness-0" />
            </div>
            {/* ------------------------------------------------------------- */}
            <h1 className="mt-6 text-5xl font-semibold tracking-tight sm:text-6xl">
              Peer support for tough procedures
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-neutral-400 max-w-xl md:max-w-none md:pr-6">
              Get matched with someone who's already been through it. Ask questions, get tips, and feel less alone—confidentially.
            </p>
            <div className="mt-8 flex justify-center md:justify-start gap-4">
              <button
                onClick={() => navigate('login')}
                onMouseEnter={() => granimRef.current?.changeState('cta-state')}
                onMouseLeave={() => granimRef.current?.changeState('default-state')}
                className={primaryBtn}
              >
                <span className="inline-flex items-center gap-2 text-lg">
                  Find My Mentor <ArrowRight className="h-5 w-5" />
                </span>
              </button>
              <button onClick={() => navigate('matches')} className="rounded-xl px-6 py-3 border text-gray-800 hover:bg-gray-50 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                See How It Works
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-indigo-200/30 to-purple-200/30 blur-2xl dark:from-indigo-800/10 dark:to-purple-800/10"></div>
            <div className="relative">
              <div className="rounded-2xl border bg-white/70 p-4 shadow-sm backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/70">
                <div className="flex items-center gap-3 border-b pb-3 dark:border-neutral-800">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">OS</div>
                  <div className="flex-1">
                    <div className="font-semibold">Omar (Mentor)</div>
                    <div className="text-xs text-gray-500 dark:text-neutral-400">Liver Transplant • Night Owl • Runner</div>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  {demoMessages.map((m, i) => (
                    m.from === 'mentor' ? (
                      <div key={i} className="max-w-[80%] rounded-2xl rounded-tl-none bg-indigo-50 p-3 text-sm text-gray-700 dark:bg-indigo-900/30 dark:text-neutral-200">{m.text}</div>
                    ) : (
                      <div key={i} className="ml-auto max-w-[80%] rounded-2xl rounded-tr-none bg-gray-900 p-3 text-sm text-white dark:bg-neutral-800">{m.text}</div>
                    )
                  ))}
                  {typing && (
                    <div className="w-28 rounded-full bg-gray-100 px-3 py-2 text-center text-xs text-gray-500 dark:bg-neutral-800 dark:text-neutral-400 animate-pulse">typing…</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div ref={orbARef} className="pointer-events-none absolute -top-10 -left-10 h-64 w-64 rounded-full bg-indigo-200 blur-3xl opacity-30 transition-transform duration-200 will-change-transform dark:bg-indigo-700/30"></div>
        <div ref={orbBRef} className="pointer-events-none absolute -bottom-10 -right-10 h-72 w-72 rounded-full bg-purple-200 blur-3xl opacity-30 transition-transform duration-200 will-change-transform dark:bg-purple-700/30"></div>
      </Card>

      {/* Feature Section */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <Sparkles className="h-6 w-6 text-indigo-500" />
          <h2 className="mt-3 text-xl font-semibold">AI Semantic Matching</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
            User introductions are converted into vector embeddings to find the most relevant match, not just by procedure, but by personal interests and experience.
          </p>
        </Card>
        <Card>
          <MessageSquare className="h-6 w-6 text-green-500" />
          <h2 className="mt-3 text-xl font-semibold">Real-Time Chat</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
            A safe, secure, and instant chat platform built with WebSockets for one-on-one peer support between mentees and mentors.
          </p>
        </Card>
        <Card>
          <UserCheck className="h-6 w-6 text-purple-500" />
          <h2 className="mt-3 text-xl font-semibold">Experience-Based Support</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
            Receive support from volunteers who have recovered, offering emotional and logistical guidance beyond medical advice.
          </p>
        </Card>
      </div>

      <Card className="bg-white/70 dark:bg-neutral-900/70">
        <div className="grid gap-6 text-center sm:grid-cols-3">
          <div>
            <div className="text-3xl font-semibold">10k+</div>
            <div className="text-sm text-gray-600 dark:text-neutral-400">Messages exchanged</div>
          </div>
          <div>
            <div className="text-3xl font-semibold">92%</div>
            <div className="text-sm text-gray-600 dark:text-neutral-400">Felt more prepared</div>
          </div>
          <div>
            <div className="text-3xl font-semibold">150+</div>
            <div className="text-sm text-gray-600 dark:text-neutral-400">Procedures covered</div>
          </div>
        </div>
      </Card>

      <Card className="bg-white/70 dark:bg-neutral-900/70">
        <h2 className="text-2xl font-bold text-center">How it works</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 font-semibold">1</div>
            <div>
              <div className="font-semibold">Share your story</div>
              <div className="text-sm text-gray-600 dark:text-neutral-400">Create a short intro about your procedure, interests, and preferences.</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 font-semibold">2</div>
            <div>
              <div className="font-semibold">Get matched</div>
              <div className="text-sm text-gray-600 dark:text-neutral-400">We suggest a mentor who has been through a similar journey and vibe.</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 font-semibold">3</div>
            <div>
              <div className="font-semibold">Chat privately</div>
              <div className="text-sm text-gray-600 dark:text-neutral-400">Ask practical questions, swap tips, and feel supported—one-on-one.</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Testimonials Section */}
      <section className="py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-neutral-100 mb-3">
            What people are saying
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Real experiences from patients, mentors, and caregivers who've used HealLink
          </p>
        </div>

        <TestimonialsCarousel testimonials={testimonials} />
      </section>

      {/* Privacy and Trust Section */}
      <Card>
        <div className="flex items-center gap-2 text-lg font-semibold"><Shield className="h-5 w-5" /> Privacy First</div>
        <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
          Our prototype leverages local AI models (Ollama/Gemma) to ensure privacy-focused and offline-capable AI features, respecting your data.
        </p>
      </Card>

      <Card className="text-center bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-neutral-900 dark:to-neutral-800">
        <h3 className="text-2xl font-semibold">Ready to meet your mentor?</h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">Create your profile to get a tailored match and start chatting in minutes.</p>
        <div className="mt-6">
          <button
            onClick={() => navigate('login')}
            onMouseEnter={() => granimRef.current?.changeState('cta-state')}
            onMouseLeave={() => granimRef.current?.changeState('default-state')}
            className={primaryBtn}
          >
            Get Started
          </button>
        </div>
      </Card>

    </div>
  );
}