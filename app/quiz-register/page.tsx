'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { submitQuizRegistration } from '@/lib/firebase/quizService';

// ─── Validation Schema ───────────────────────────────────────────────────────
const schema = z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().min(7, 'Please enter a valid phone number'),
    levelOfStudy: z.string().min(1, 'Level of study is required'),
    statementOfInterest: z
        .string()
        .min(50, 'Please write at least 50 characters')
        .max(500, 'Maximum 500 characters allowed'),
    enthusiasmRating: z.number().min(1).max(5),
});

type FormValues = z.infer<typeof schema>;

// ─── Floating Pi Symbols ─────────────────────────────────────────────────────
const FloatingPi = ({ index }: { index: number }) => {
    const positions = [
        { left: '5%', top: '10%' },
        { left: '90%', top: '15%' },
        { left: '20%', top: '80%' },
        { left: '75%', top: '70%' },
        { left: '50%', top: '5%' },
        { left: '10%', top: '50%' },
        { left: '85%', top: '40%' },
        { left: '35%', top: '90%' },
    ];
    const pos = positions[index % positions.length];
    const size = 24 + (index % 4) * 12;
    const duration = 6 + (index % 5) * 2;

    return (
        <motion.div
            className="absolute pointer-events-none select-none font-bold opacity-5 text-indigo-600"
            style={{ left: pos.left, top: pos.top, fontSize: size }}
            animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
            transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
        >
            π
        </motion.div>
    );
};

// ─── Field Components ────────────────────────────────────────────────────────
function FieldWrapper({ label, error, children }: { label: string; error?: string; children: React.ReactNode }): React.JSX.Element {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700 tracking-wide">{label}</label>
            {children}
            <AnimatePresence>
                {error && (
                    <motion.p
                        className="text-xs text-rose-400 mt-0.5"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}

const inputClass =
    'w-full rounded-xl px-4 py-3 bg-white border border-slate-200 text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 text-sm';

// ─── Success Screen ───────────────────────────────────────────────────────────
function SuccessScreen({ name }: { name: string }) {
    return (
        <motion.div
            className="flex flex-col items-center justify-center gap-6 text-center py-12 px-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
            <motion.div
                className="text-7xl"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
            >
                π
            </motion.div>
            <h2 className="text-3xl font-bold text-slate-900">You&apos;re registered!</h2>
            <p className="text-slate-600 text-lg max-w-md">
                Thank you, <span className="text-indigo-600 font-semibold">{name}</span>! Your entry for the{' '}
                <span className="text-indigo-600 font-semibold">Pi Day Quiz Competition</span> has been received.
                We&apos;ll notify you if you are selected to participate. Good luck! 🎉
            </p>
            <motion.div className="flex gap-3 mt-4 text-4xl">
                {['π', '3', '.', '1', '4', 'π'].map((char, i) => (
                    <motion.span
                        key={i}
                        className="text-indigo-500 font-bold"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                    >
                        {char}
                    </motion.span>
                ))}
            </motion.div>
            <p className="text-slate-400 text-xs mt-6">Pi Day — March 14 (3.14)</p>
        </motion.div>
    );
}

export default function QuizRegisterPage() {
    const [step, setStep] = useState<1 | 2>(1);
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        trigger,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { enthusiasmRating: 3 },
    });

    const statementValue = watch('statementOfInterest') ?? '';
    const submittedName = watch('fullName') ?? '';
    const currentRating = watch('enthusiasmRating');

    const handleNext = async () => {
        const valid = await trigger(['fullName', 'email', 'phone', 'levelOfStudy']);
        if (valid) setStep(2);
    };

    const onSubmit = async (data: FormValues) => {
        setSubmitting(true);
        setSubmitError(null);
        try {
            await submitQuizRegistration(data);
            setSubmitted(true);
        } catch (err) {
            console.error(err);
            setSubmitError('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen relative overflow-hidden bg-slate-50 flex items-center justify-center p-4 py-10">
            {/* Background floating π */}
            {Array.from({ length: 8 }).map((_, i) => (
                <FloatingPi key={i} index={i} />
            ))}

            <div className="w-full max-w-xl z-10">
                {/* Header */}
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 text-indigo-600 text-xs font-semibold tracking-widest uppercase mb-4">
                        <span>π</span> March 14 · Pi Day 2026 <span>π</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        Pi Day Quiz<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">
                            Competition
                        </span>
                    </h1>
                    <p className="text-slate-600 text-sm mt-3 max-w-sm mx-auto leading-relaxed">
                        Register your interest to compete! Participants will be selected fairly at random. Fill in the form below to be considered.
                    </p>
                </motion.div>

                {/* Card */}
                <motion.div
                    className="rounded-3xl border border-slate-200 shadow-xl overflow-hidden bg-white"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <AnimatePresence mode="wait">
                        {submitted ? (
                            <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <SuccessScreen name={submittedName} />
                            </motion.div>
                        ) : (
                            <form key="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                                {/* Step indicator */}
                                <div className="flex items-center gap-0 border-b border-white/10">
                                    {([1, 2] as const).map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => s === 1 && setStep(1)}
                                            className={`flex-1 py-4 text-sm font-semibold transition-all duration-200 ${step === s
                                                ? 'text-indigo-600 border-b-2 border-indigo-500 bg-slate-50'
                                                : 'text-slate-400 hover:text-slate-600 cursor-pointer'
                                                }`}
                                        >
                                            {s === 1 ? '① Personal Details' : '② Why You?'}
                                        </button>
                                    ))}
                                </div>

                                <div className="p-6 sm:p-8">
                                    <AnimatePresence mode="wait">
                                        {/* ────── STEP 1: Personal Details ────── */}
                                        {step === 1 && (
                                            <motion.div
                                                key="step1"
                                                className="flex flex-col gap-5"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.25 }}
                                            >
                                                <FieldWrapper label="Full Name *" error={errors.fullName?.message}>
                                                    <input
                                                        {...register('fullName')}
                                                        placeholder="e.g. Ada Lovelace"
                                                        className={inputClass}
                                                        id="fullName"
                                                    />
                                                </FieldWrapper>

                                                <FieldWrapper label="Email Address *" error={errors.email?.message}>
                                                    <input
                                                        {...register('email')}
                                                        type="email"
                                                        placeholder="you@example.com"
                                                        className={inputClass}
                                                        id="email"
                                                    />
                                                </FieldWrapper>

                                                <FieldWrapper label="Phone Number *" error={errors.phone?.message}>
                                                    <input
                                                        {...register('phone')}
                                                        type="tel"
                                                        placeholder="+234 800 000 0000"
                                                        className={inputClass}
                                                        id="phone"
                                                    />
                                                </FieldWrapper>

                                                <FieldWrapper label="Level / Year of Study *" error={errors.levelOfStudy?.message}>
                                                    <input
                                                        {...register('levelOfStudy')}
                                                        placeholder="e.g. 200 Level"
                                                        className={inputClass}
                                                        id="levelOfStudy"
                                                    />
                                                </FieldWrapper>

                                                <motion.button
                                                    type="button"
                                                    onClick={handleNext}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="w-full mt-2 py-3.5 rounded-xl font-bold text-sm tracking-wide text-white cursor-pointer transition-all duration-200"
                                                    style={{
                                                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                                        boxShadow: '0 4px 24px rgba(99,102,241,0.4)',
                                                    }}
                                                    id="next-btn"
                                                >
                                                    Next: Tell Us About Yourself →
                                                </motion.button>
                                            </motion.div>
                                        )}

                                        {/* ────── STEP 2: Why Should You Be Selected ────── */}
                                        {step === 2 && (
                                            <motion.div
                                                key="step2"
                                                className="flex flex-col gap-5"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ duration: 0.25 }}
                                            >
                                                {/* Statement of Interest */}
                                                <FieldWrapper
                                                    label="Why should you be selected? *"
                                                    error={errors.statementOfInterest?.message}
                                                >
                                                    <div className="relative">
                                                        <textarea
                                                            {...register('statementOfInterest')}
                                                            placeholder="Tell us about your passion for maths, pi, or problem-solving. What makes you a great candidate? (50–500 characters)"
                                                            rows={5}
                                                            className={`${inputClass} resize-none`}
                                                            id="statementOfInterest"
                                                        />
                                                        <span
                                                            className={`absolute bottom-3 right-3 text-[10px] font-mono ${statementValue.length > 500
                                                                ? 'text-rose-500'
                                                                : statementValue.length >= 50
                                                                    ? 'text-emerald-500'
                                                                    : 'text-slate-400'
                                                                }`}
                                                        >
                                                            {statementValue.length}/500
                                                        </span>
                                                    </div>
                                                </FieldWrapper>

                                                {/* Enthusiasm Rating */}
                                                <FieldWrapper
                                                    label="How enthusiastic are you about maths & π? (1 = Curious, 5 = π is life)"
                                                    error={errors.enthusiasmRating?.message}
                                                >
                                                    <div className="flex gap-3 mt-1" id="enthusiasmRating">
                                                        {[1, 2, 3, 4, 5].map((val) => (
                                                            <button
                                                                key={val}
                                                                type="button"
                                                                onClick={() => setValue('enthusiasmRating', val, { shouldValidate: true })}
                                                                className={`flex-1 py-2.5 rounded-xl border text-center text-sm font-bold transition-all duration-200 ${currentRating === val
                                                                    ? 'bg-indigo-50 border-indigo-400 text-indigo-600 shadow-sm'
                                                                    : 'border-slate-200 text-slate-400 hover:border-indigo-200 hover:text-indigo-500 bg-white'
                                                                    }`}
                                                            >
                                                                {val}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <div className="flex justify-between text-[10px] text-slate-400 px-1 mt-1">
                                                        <span>Curious</span>
                                                        <span>π is life</span>
                                                    </div>
                                                </FieldWrapper>

                                                {submitError && (
                                                    <p className="text-rose-600 text-sm text-center bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
                                                        {submitError}
                                                    </p>
                                                )}

                                                <div className="flex gap-3 mt-2">
                                                    <motion.button
                                                        type="button"
                                                        onClick={() => setStep(1)}
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="flex-none px-5 py-3.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:border-slate-300 hover:text-slate-900 transition-all duration-200 cursor-pointer bg-slate-50"
                                                        id="back-btn"
                                                    >
                                                        ← Back
                                                    </motion.button>
                                                    <motion.button
                                                        type="submit"
                                                        aria-disabled={submitting}
                                                        whileHover={{ scale: submitting ? 1 : 1.02 }}
                                                        whileTap={{ scale: submitting ? 1 : 0.98 }}
                                                        className={`flex-1 py-3.5 rounded-xl font-bold text-sm tracking-wide text-white transition-all duration-200 cursor-pointer ${submitting ? 'opacity-70 pointer-events-none' : ''
                                                            }`}
                                                        style={{
                                                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                                            boxShadow: '0 4px 24px rgba(99,102,241,0.4)',
                                                        }}
                                                        id="submit-btn"
                                                    >
                                                        {submitting ? (
                                                            <span className="flex items-center justify-center gap-2">
                                                                <motion.span
                                                                    animate={{ rotate: 360 }}
                                                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                                    className="block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                                                />
                                                                Submitting…
                                                            </span>
                                                        ) : (
                                                            'Submit Registration π'
                                                        )}
                                                    </motion.button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </form>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Footer note */}
                <motion.p
                    className="text-center text-slate-400 text-xs mt-6 leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    Participants will be selected at random for a fair process. <br />
                    Submitting this form bring you one step closer to being accepted.
                </motion.p>
            </div>
        </main>
    );
}
