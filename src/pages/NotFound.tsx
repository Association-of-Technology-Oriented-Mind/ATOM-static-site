import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div
      className="flex min-h-screen items-center justify-center overflow-x-hidden"
      style={{ backgroundColor: 'hsl(var(--ink))' }}
    >
      <div className="text-center px-6 sm:px-8 max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* 404 display */}
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(5rem, 15vw, 10rem)',
              letterSpacing: '-0.04em',
              lineHeight: 0.9,
              color: 'hsl(var(--chalk))',
            }}
          >
            404
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mb-4"
            style={{
              fontSize: '1.125rem',
              color: 'hsl(var(--text-secondary))',
            }}
          >
            This page doesn't exist.
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mb-10"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'hsl(var(--text-muted))',
            }}
          >
            <code
              className="px-2 py-1 rounded-sm"
              style={{
                background: 'hsl(var(--surface-raised))',
                border: '1px solid hsl(var(--border-default))',
                color: 'hsl(var(--phosphor))',
                fontSize: '0.6875rem',
              }}
            >
              {location.pathname}
            </code>
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center"
          >
            <button
              onClick={() => navigate("/")}
              className="btn-primary"
            >
              <Home className="w-4 h-4" />
              Return to Home
            </button>
            
            <button
              onClick={() => navigate(-1)}
              className="btn-ghost"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
