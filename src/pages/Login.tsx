import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, User, Key, Sparkles, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import Waves from '@/components/Waves';
import atomLogo from '@/assets/atom-logo.webp';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const logoRef = useRef<HTMLDivElement>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (logoRef.current) {
      const rect = logoRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) / rect.width;
      const deltaY = (e.clientY - centerY) / rect.height;
      
      setMousePosition({
        x: deltaX * 20, // Reduced intensity for login page
        y: deltaY * 20
      });
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
    setIsHovering(false);
  };

  const handleClick = () => {
    setClickCount(prev => prev + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      // Firebase error codes are deliberately vague about which half of the
      // credentials was wrong; don't leak more than it does.
      const code = (err as { code?: string }).code;
      setError(
        code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password'
          ? 'Invalid email or password'
          : 'Sign-in failed. Please try again.',
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Waves Background */}
      <Waves
        lineColor="rgba(255, 255, 255, 0.25)"
        backgroundColor="transparent"
        waveSpeedX={0.012}
        waveSpeedY={0.008}
        waveAmpX={25}
        waveAmpY={15}
        xGap={15}
        yGap={25}
        friction={0.95}
        tension={0.008}
        maxCursorMove={100}
        className="opacity-80"
      />

      {/* Additional floating elements */}
      <motion.div
        className="absolute top-20 right-20 text-cyan-400/20 z-10"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <motion.img 
          src={atomLogo} 
          alt="ATOM" 
          className="w-12 h-12 opacity-20"
          style={{ objectFit: 'contain' }}
        />
      </motion.div>

      <motion.div
        className="absolute bottom-32 left-16 text-purple-400/20 z-10"
        animate={{
          y: [0, 20, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      >
        <Sparkles size={36} />
      </motion.div>

      <motion.div
        className="absolute top-1/3 right-1/4 text-blue-400/15 z-10"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <Zap size={32} />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Logo/Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-8"
          >
            <div className="relative inline-block">
              <motion.div 
                ref={logoRef}
                className="relative cursor-pointer select-none"
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
                animate={{
                  x: mousePosition.x,
                  y: mousePosition.y,
                  scale: isHovering ? 1.1 : 1,
                  rotateX: mousePosition.y * -0.5,
                  rotateY: mousePosition.x * 0.5,
                  rotateZ: isHovering ? mousePosition.x * 0.3 : 0
                }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  mass: 0.8
                }}
                style={{
                  transformStyle: "preserve-3d"
                }}
                whileTap={{
                  scale: 0.95,
                  rotateZ: 360,
                  transition: { duration: 0.6 }
                }}
              >
                {/* Animated Glow Ring */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={isHovering ? {
                    background: [
                      "radial-gradient(circle, rgba(33,150,243,0.2) 0%, transparent 70%)",
                      "radial-gradient(circle, rgba(255,64,129,0.2) 0%, transparent 70%)",
                      "radial-gradient(circle, rgba(76,175,80,0.2) 0%, transparent 70%)",
                      "radial-gradient(circle, rgba(33,150,243,0.2) 0%, transparent 70%)"
                    ],
                    scale: [1, 1.1, 1],
                    rotate: [0, 180, 360]
                  } : {
                    background: "transparent",
                    scale: 1,
                    rotate: 0
                  }}
                  transition={{
                    duration: 2,
                    repeat: isHovering ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Particle Effects */}
                {isHovering && [0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 bg-blue-400 rounded-full"
                    initial={{
                      x: 120 + Math.cos(i * 90 * Math.PI / 180) * 80,
                      y: 120 + Math.sin(i * 90 * Math.PI / 180) * 80,
                      scale: 0
                    }}
                    animate={{
                      x: 120 + Math.cos((i * 90 + Date.now() * 0.001) * Math.PI / 180) * (60 + mousePosition.x),
                      y: 120 + Math.sin((i * 90 + Date.now() * 0.001) * Math.PI / 180) * (60 + mousePosition.y),
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: "easeInOut"
                    }}
                  />
                ))}
                
                <motion.img 
                  src={atomLogo} 
                  alt="ATOM Club Logo" 
                  className="w-24 h-24 md:w-28 md:h-28 relative z-10"
                  style={{ objectFit: 'contain' }}
                  animate={{
                    filter: isHovering 
                      ? `drop-shadow(0 0 20px rgba(33, 150, 243, 0.6)) brightness(1.1) contrast(1.05)` 
                      : `drop-shadow(0 4px 8px rgba(0,0,0,0.2))`,
                    rotateY: clickCount * 180
                  }}
                  transition={{
                    filter: { duration: 0.3 },
                    rotateY: { duration: 0.8, ease: "easeOut" }
                  }}
                />
                
                {/* Click Ripple Effect */}
                <motion.div
                  key={clickCount}
                  className="absolute inset-0 border-2 border-blue-400 rounded-full"
                  initial={{ scale: 0, opacity: 0.8 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </motion.div>
            </div>

            <motion.h1
              className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mt-6 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              ATOM CMS
            </motion.h1>
          </motion.div>

          {/* Login Card with Glass Morphism */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative backdrop-blur-md bg-white/3 border border-white/8 rounded-3xl shadow-2xl shadow-black/30 p-8 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)',
              backdropFilter: 'blur(12px) saturate(150%) contrast(110%)',
              WebkitBackdropFilter: 'blur(12px) saturate(150%) contrast(110%)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              boxShadow: '0 20px 40px -8px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.03) inset, 0 8px 32px rgba(0, 0, 0, 0.2)'
            }}
          >
            {/* Enhanced Glass morphism background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/3 via-transparent to-white/2 opacity-20"></div>
            <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-cyan-500/6 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/6 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-conic from-blue-500/4 via-transparent to-cyan-500/4 rounded-full blur-2xl"></div>

            {/* Subtle inner glow with reduced opacity for wave visibility */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/3 via-transparent to-purple-500/3 opacity-15"></div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="relative z-10 text-center mb-6"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl mb-4 shadow-lg">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-slate-300 text-sm">Please sign in to your account</p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="relative z-10 space-y-2"
              >
                <Label htmlFor="email" className="text-slate-300 text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20 transition-all duration-200"
                    placeholder="you@karunya.edu"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="relative z-10 space-y-2"
              >
                <Label htmlFor="password" className="text-slate-300 text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20 transition-all duration-200"
                    placeholder="Enter your password"
                  />
                </div>
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  <Alert variant="destructive" className="border-red-500/20 bg-red-500/10">
                    <AlertDescription className="text-red-400">
                      {error}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="relative z-10"
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      ACCESSING THE SYSTEM ...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Lock className="w-5 h-5 mr-2" />
                      ACCESS THE SYSTEM
                    </div>
                  )}
                </Button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="relative z-10 mt-6 text-center"
            >
              <p className="text-xs text-slate-500">
                Secured by ATOM • Content Management System
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
