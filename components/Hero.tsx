'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import CtaButton from './CtaButton';
import { offer } from '@/lib/config';

const SealMedallion = dynamic(() => import('./SealMedallion'), {
  ssr: false,
  loading: () => (
    // Flat seal until the canvas is ready — never an empty box.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/seal.png"
      alt="Yellow Zone certification seal"
      className="h-full w-full animate-drift object-contain p-8 opacity-90"
    />
  ),
});

const rise = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Hero() {
  return (
    <section className="ground-ink relative overflow-hidden text-white">
      <div className="wrap grid items-center gap-10 px-5 pb-16 pt-14 sm:px-8 md:pb-24 md:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.11, delayChildren: 0.08 }}
        >
          <motion.p
            variants={rise}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="eyebrow text-gold"
          >
            MiTran Global · Certification for Schools
          </motion.p>

          <motion.h1
            variants={rise}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="h1 mt-5 text-balance"
          >
            Every school reports results.
            <span className="block text-gold">
              Almost none can report how their students feel.
            </span>
          </motion.h1>

          <motion.p
            variants={rise}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lede mt-6 max-w-prose2 text-white/75"
          >
            Yellow Zone is an emotional wellbeing certification for schools. We
            assess your campus with Emotion AI, benchmark it against a defined
            standard, and certify what your prospectus has only ever been able
            to claim.
          </motion.p>

          <motion.div
            variants={rise}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <CtaButton source="hero" className="w-full sm:w-auto">
              Apply for a {offer.name.toLowerCase()}
            </CtaButton>
            <a href="#standard" className="btn-ghost-invert w-full sm:w-auto">
              What gets measured
            </a>
          </motion.div>

          <motion.dl
            variants={rise}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="mt-10 grid max-w-lg grid-cols-3 gap-px border border-white/12 bg-white/12"
          >
            {[
              { t: `${offer.seatsLeft} left`, d: `of ${offer.cohortSeats} campus places` },
              { t: `${offer.briefingMinutes} min`, d: 'assessment briefing' },
              { t: 'No fee', d: 'to apply and review' },
            ].map((item) => (
              <div key={item.d} className="bg-ink px-4 py-3.5">
                <dt className="font-display text-[1.05rem] font-extrabold text-gold">
                  {item.t}
                </dt>
                <dd className="mt-0.5 text-[0.72rem] leading-snug text-white/55">
                  {item.d}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto h-[300px] w-full max-w-[460px] sm:h-[400px] lg:h-[520px] lg:max-w-none"
        >
          <SealMedallion />
        </motion.div>
      </div>

      {/* Engraved base rule, as on the border of a printed certificate */}
      <div className="h-[6px] w-full bg-gradient-to-r from-gold-deep via-gold to-gold-deep" />
    </section>
  );
}
