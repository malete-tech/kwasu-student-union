"use client";

import React from "react";
import { Settings, ShieldCheck, TrendingUp } from "lucide-react";
import { motion, Variants } from "framer-motion";

const AdminAuthHero: React.FC = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-12 bg-zinc-950 text-white text-center lg:text-left overflow-hidden h-full w-full rounded-l-2xl">
      {/* Background glowing effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-brand-500 rounded-full mix-blend-screen filter blur-[120px] opacity-40 blur-3xl pointer-events-none" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-32 -right-32 w-96 h-96 bg-brand-gold rounded-full mix-blend-screen filter blur-[100px] opacity-20 blur-3xl pointer-events-none" 
        />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md space-y-10"
      >
        <motion.div variants={itemVariants} className="space-y-4">
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white drop-shadow-sm">
            Control <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-brand-gold">Central.</span>
          </h2>
          <p className="text-lg text-zinc-400 font-medium leading-relaxed">
            Unleash the full potential of the student body. Manage, monitor, and maximize engagement seamlessly.
          </p>
        </motion.div>

        <motion.div variants={containerVariants} className="space-y-4 pt-4">
          {[
            { icon: Settings, text: "Streamlined Ecosystem Management" },
            { icon: ShieldCheck, text: "Advanced Security & Roles" },
            { icon: TrendingUp, text: "Real-time Growth Insights" }
          ].map((feature, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants} 
              whileHover={{ scale: 1.02, x: 5 }}
              className="flex items-center gap-4 bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-xl shadow-lg transition-colors cursor-default hover:bg-white/10 hover:border-white/20"
            >
              <div className="bg-brand-500/20 p-2.5 rounded-lg border border-brand-400/30">
                <feature.icon className="h-6 w-6 text-brand-gold" />
              </div>
              <span className="text-zinc-200 font-semibold tracking-wide text-sm">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminAuthHero;