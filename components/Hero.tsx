'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import CtaButton from './CtaButton';
import { offer } from '@/lib/config';

const SealMedallion = dynamic(() => import('./SealMedallion'), {
  ssr: false,
  loading: () => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/seal.png"
      alt="Yellow Zone certification seal"
      className="h-full w-full animate-drift object-contain p-8 opacity-90"
    />
  ),
});

const rise = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function Hero() {
  return (
    <section className="ground-ink relative overflow-hidden text-white">
      <div className="wrap grid items-center gap-8 px-5 pb-14 pt-12 sm:px-8 md:pb-20 md:pt-16 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.1, delayChildren: 0.05 }}
        >
          <motion.p variants={rise} transition={{ duration: 0.6 }} className="eyebrow text-gold">
            MiTran Global · Yellow Zone
          </motion.p>

          <motion.h1 variants={rise} transition={{ duration: 0.7 }} className="h1 mt-5 text-balance">
            Your school reports results.
            <span className="block text-gold">Can it report how students feel?</span>
          </motion.h1>

          <motion.p
            variants={rise}
            transition={{ duration: 0.7 }}
            className="lede mt-5 max-w-prose2 text-white/75"
          >
            Yellow Zone assesses your campus with Emotion AI, scores it against a
            defined standard, and certifies it.
          </motion.p>

          <motion.div
            variants={rise}
            transition={{ duration: 0.7 }}
            className="mt-8"
          >
            <CtaButton source="hero" className="w-full sm:w-auto">
              Apply now
            </CtaButton>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto h-[260px] w-full max-w-[420px] sm:h-[340px] lg:h-[440px] lg:max-w-none"
        >
          <SealMedallion />
        </motion.div>
      </div>

      <div className="h-[5px] w-full bg-gradient-to-r from-gold-deep via-gold to-gold-deep" />
    </section>
  );
}
