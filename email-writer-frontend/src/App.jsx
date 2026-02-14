import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Copy, 
  RefreshCcw, 
  Mail, 
  CheckCircle2, 
  ChevronRight,
  AlertCircle,
  FileText,
  MousePointer2,
  Zap,
  ShieldCheck
} from 'lucide-react';
import axios from 'axios';

/**
 * Custom Logo Component
 */
const Logo = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <motion.path 
      d="M30 25V75C30 77.7614 32.2386 80 35 80H55C68.8071 80 80 68.8071 80 55V45C80 31.1929 68.8071 20 55 20H35C32.2386 20 30 22.2386 30 25Z" 
      stroke="currentColor" 
      strokeWidth="6" 
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    />
    <motion.path 
      d="M30 45L45 55L30 65" 
      stroke="#818cf8" 
      strokeWidth="6" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8 }}
    />
    <circle cx="55" cy="50" r="8" fill="#818cf8" className="animate-pulse" />
  </svg>
);

/**
 * 3D Dynamic Background
 */
const ThreeBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const particles = new THREE.BufferGeometry();
    const count = 1200;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 15;
    particles.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const partMat = new THREE.PointsMaterial({ size: 0.012, color: '#818cf8', transparent: true, opacity: 0.25 });
    const points = new THREE.Points(particles, partMat);
    scene.add(points);

    const spheres = [];
    const sphereGeo = new THREE.IcosahedronGeometry(1, 15);
    for (let i = 0; i < 4; i++) {
      const mat = new THREE.MeshPhongMaterial({
        color: i % 2 === 0 ? '#4f46e5' : '#818cf8',
        wireframe: true,
        transparent: true,
        opacity: 0.06,
      });
      const sphere = new THREE.Mesh(sphereGeo, mat);
      sphere.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 5);
      sphere.scale.setScalar(Math.random() * 1.5 + 0.5);
      sphere.userData = { 
        rot: Math.random() * 0.0015,
        float: Math.random() * 0.0008 
      };
      spheres.push(sphere);
      scene.add(sphere);
    }

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 2);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    camera.position.z = 5;

    let mouseX = 0, mouseY = 0;
    const onMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) - 0.5;
      mouseY = (e.clientY / window.innerHeight) - 0.5;
    };
    window.addEventListener('mousemove', onMove);

    const animate = () => {
      requestAnimationFrame(animate);
      points.rotation.y += 0.0004;
      spheres.forEach(s => {
        s.rotation.y += s.userData.rot;
        s.rotation.z += s.userData.rot;
        s.position.y += Math.sin(Date.now() * 0.001) * s.userData.float;
      });
      camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.03;
      camera.position.y += (-mouseY * 1.2 - camera.position.y) * 0.03;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

export default function App() {
  // --- Original Functionality State ---
  const [emailContent, setEmailContent] = useState("");
  const [tone, setTone] = useState("");
  const [generatedReply, setGeneratedReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Injects Tailwind CDN
  useEffect(() => {
    if (!document.getElementById('tailwind-cdn')) {
      const script = document.createElement("script");
      script.id = "tailwind-cdn";
      script.src = "https://cdn.tailwindcss.com";
      document.head.appendChild(script);
    }
  }, []);

  // --- Original API Logic ---
  const handleSubmit = async () => {
    if (!emailContent.trim()) {
        setError("Please provide email content.");
        return;
    }
    setLoading(true);
    setError("");
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const response = await axios.post(
        `${API_URL}/api/email/generate`,
        {
          emailContent,
          tone,
        }
      );
      setGeneratedReply(
        typeof response.data === "string"
          ? response.data
          : JSON.stringify(response.data)
      );
    } catch (err) {
      setError("Failed to generate reply. Please try again.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tones = [
    { label: "Professional", value: "professional" },
    { label: "Casual", value: "casual" },
    { label: "Friendly", value: "friendly" }
  ];

  return (
    <div className="min-h-screen bg-[#060608] text-slate-100 font-sans selection:bg-indigo-500/30 overflow-x-hidden antialiased">
      <ThreeBackground />

      {/* Navigation */}
      <header className="relative z-10 flex items-center justify-between px-8 py-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Logo className="w-10 h-10 text-indigo-500" />
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter uppercase leading-none">Draft AI</span>
            <span className="text-[10px] font-bold tracking-[0.3em] text-indigo-400/80 uppercase leading-none mt-1">Intelligent Response</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/5 border border-indigo-500/10">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300/80">API Connection Active</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        
        {/* Hero Section */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-8xl font-black mb-4 tracking-tighter leading-[0.85]">
              Master the art <br />
              <span className="text-indigo-500">of the reply.</span>
            </h1>
            <p className="text-slate-400 max-w-lg text-lg leading-relaxed mt-8 font-medium opacity-80">
              Draft AI turns scattered thoughts into high-impact communication. 
              Write better, faster, and with absolute confidence.
            </p>
          </motion.div>
        </div>

        {/* Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Input Panel */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.99 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-7"
          >
            <div className="p-8 rounded-[3rem] bg-slate-900/30 border border-white/5 backdrop-blur-3xl shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/10 rounded-xl">
                    <Mail size={16} className="text-indigo-400" />
                  </div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Step 1: The Context</h3>
                </div>
                {emailContent && (
                  <button 
                    onClick={() => { setEmailContent(""); setGeneratedReply(""); }}
                    className="text-[10px] font-black text-indigo-400/40 hover:text-indigo-400 transition-colors uppercase tracking-widest"
                  >
                    Reset
                  </button>
                )}
              </div>
              
              <textarea
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                placeholder="Paste the email thread here that you want to reply to..."
                className="w-full h-80 bg-black/40 border border-white/5 rounded-[2rem] p-8 text-sm text-slate-200 placeholder:text-slate-800 focus:outline-none focus:border-indigo-500/30 transition-all resize-none leading-relaxed font-medium"
              />

              <div className="mt-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Step 2: Tone Profile</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setTone("")}
                    className={`px-6 py-3 rounded-2xl text-[11px] font-bold border transition-all ${
                      tone === "" 
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl shadow-indigo-600/20 scale-105' 
                      : 'bg-white/5 border-white/5 text-slate-500 hover:text-slate-200 hover:bg-white/10'
                    }`}
                  >
                    None (Auto)
                  </button>
                  {tones.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTone(t.value)}
                      className={`px-6 py-3 rounded-2xl text-[11px] font-bold border transition-all ${
                        tone === t.value 
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl shadow-indigo-600/20 scale-105' 
                        : 'bg-white/5 border-white/5 text-slate-500 hover:text-slate-200 hover:bg-white/10'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading || !emailContent.trim()}
                className={`w-full mt-10 py-5 rounded-[2rem] flex items-center justify-center gap-3 font-black uppercase tracking-[0.3em] text-[11px] transition-all ${
                  loading || !emailContent.trim()
                  ? 'bg-slate-800/50 text-slate-700'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-2xl shadow-indigo-600/30 active:scale-[0.98]'
                }`}
              >
                {loading ? <RefreshCcw className="animate-spin" size={18} /> : <>Step 3: Generate Response <ChevronRight size={14} /></>}
              </button>
            </div>
          </motion.div>

          {/* Result Panel */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.99 }} 
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-5 flex flex-col"
          >
            <div className="flex-grow p-8 rounded-[3rem] bg-indigo-600/[0.02] border border-indigo-500/10 backdrop-blur-3xl flex flex-col min-h-[500px]">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${loading ? 'bg-indigo-400 animate-pulse' : 'bg-indigo-600'}`} />
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-200/40">Step 4: Refined Output</span>
                </div>
                {generatedReply && (
                  <button 
                    onClick={handleCopy}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-5 py-2.5 bg-white text-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl"
                  >
                    {copied ? <CheckCircle2 size={12} /> : "Copy Result"}
                  </button>
                )}
              </div>

              <div className="flex-grow relative">
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div 
                      key="loading"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="h-full flex flex-col items-center justify-center gap-5 text-slate-600"
                    >
                      <div className="w-12 h-12 border-2 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin" />
                      <span className="text-[9px] font-black uppercase tracking-[0.4em]">Processing via Backend...</span>
                    </motion.div>
                  ) : generatedReply ? (
                    <motion.div 
                      key="content"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="text-[14px] text-slate-300 leading-relaxed whitespace-pre-wrap font-mono p-6 rounded-[2rem] bg-white/[0.01] border border-white/5 shadow-inner h-full overflow-y-auto"
                    >
                      {generatedReply}
                    </motion.div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-900 text-center select-none opacity-40">
                      <FileText size={64} className="mb-8 opacity-10" />
                      <p className="text-[9px] font-black uppercase tracking-[0.5em] leading-loose">Awaiting Input Stream<br />Ready for Synthesis</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {error && (
                <div className="mt-6 p-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-3">
                  <AlertCircle size={14} /> {error}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* User Guide Section */}
        <section className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-16 border-t border-white/5 pt-20">
          <Feature 
            icon={<ShieldCheck size={18} className="text-indigo-400" />}
            title="1. Secure Context" 
            desc="Paste the email you received. Our engine analyzes nuance and intent locally to provide accurate suggestions." 
          />
          <Feature 
            icon={<MousePointer2 size={18} className="text-indigo-400" />}
            title="2. Select Persona" 
            desc="Choose from Professional, Casual, or Friendly tones to match your communication style." 
          />
          <Feature 
            icon={<Zap size={18} className="text-indigo-400" />}
            title="3. Instant Draft" 
            desc="The AI generates a high-quality draft instantly. Simply copy and paste into your email client." 
          />
        </section>
      </main>

      <footer className="relative z-10 py-24 text-center opacity-20">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
        </div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.8em]">
          DRAFT AI • 2026
        </p>
        <br />
         <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.8em]">
          Developed By Darsh Tank
        </p>
      </footer>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="group">
      <div className="mb-6">{icon}</div>
      <h3 className="text-[11px] font-black text-white uppercase tracking-[0.25em] mb-5 flex items-center gap-3">
        <div className="w-2 h-2 bg-indigo-600 rounded-full" />
        {title}
      </h3>
      <p className="text-[12px] text-slate-500 leading-relaxed font-medium group-hover:text-slate-400 transition-colors duration-500">
        {desc}
      </p>
    </div>
  );
}