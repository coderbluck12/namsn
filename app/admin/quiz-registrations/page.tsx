'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    getAllRegistrations,
    updateRegistrationStatus,
    pickRandomWinners,
    type QuizRegistration,
} from '@/lib/firebase/quizService';

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: QuizRegistration['status'] }) {
    const styles = {
        pending: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        selected: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        rejected: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    };
    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status]} capitalize`}>
            {status}
        </span>
    );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div
            className="flex flex-col gap-1 rounded-2xl border border-white/10 px-5 py-4"
            style={{ background: 'rgba(255,255,255,0.05)' }}
        >
            <span className={`text-3xl font-extrabold ${color}`}>{value}</span>
            <span className="text-white/50 text-xs font-medium tracking-wide uppercase">{label}</span>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function QuizRegistrationsAdminPage() {
    const [registrations, setRegistrations] = useState<QuizRegistration[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [winnersCount, setWinnersCount] = useState(5);
    const [picking, setPicking] = useState(false);
    const [pickedIds, setPickedIds] = useState<string[]>([]);
    const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllRegistrations();
            setRegistrations(data);
        } catch (err) {
            console.error(err);
            setError('Failed to load registrations. Check your Firebase connection.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleStatusChange = async (id: string, status: QuizRegistration['status']) => {
        setStatusUpdating(id);
        try {
            await updateRegistrationStatus(id, status);
            setRegistrations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
        } catch (err) {
            console.error(err);
        } finally {
            setStatusUpdating(null);
        }
    };

    const handlePickWinners = async () => {
        setPicking(true);
        try {
            const ids = await pickRandomWinners(winnersCount);
            setPickedIds(ids);
            await fetchData();
        } catch (err) {
            console.error(err);
        } finally {
            setPicking(false);
        }
    };

    const total = registrations.length;
    const pending = registrations.filter((r) => r.status === 'pending').length;
    const selected = registrations.filter((r) => r.status === 'selected').length;
    const rejected = registrations.filter((r) => r.status === 'rejected').length;

    return (
        <main className="min-h-screen bg-gradient-to-br from-[#0a0a2e] via-[#0d0d4a] to-[#1a0533] p-6 md:p-10">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div>
                        <p className="text-indigo-400 text-xs font-semibold tracking-widest uppercase mb-1">Admin Panel</p>
                        <h1 className="text-3xl font-extrabold text-white">
                            π Day Quiz{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                                Registrations
                            </span>
                        </h1>
                    </div>
                    <button
                        onClick={fetchData}
                        className="self-start md:self-auto text-xs text-indigo-300 border border-indigo-500/40 px-4 py-2 rounded-xl hover:bg-indigo-500/10 transition-all cursor-pointer"
                        id="refresh-btn"
                    >
                        ↺ Refresh
                    </button>
                </motion.div>

                {/* Stats */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <StatCard label="Total" value={total} color="text-white" />
                    <StatCard label="Pending" value={pending} color="text-amber-300" />
                    <StatCard label="Selected" value={selected} color="text-emerald-300" />
                    <StatCard label="Rejected" value={rejected} color="text-rose-300" />
                </motion.div>

                {/* Random Picker */}
                <motion.div
                    className="rounded-2xl border border-indigo-500/30 p-5 mb-8 flex flex-col sm:flex-row sm:items-center gap-4"
                    style={{ background: 'rgba(99,102,241,0.08)' }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    <div className="flex-1">
                        <p className="text-white font-semibold mb-0.5">🎲 Random Winner Picker</p>
                        <p className="text-indigo-300/70 text-xs leading-relaxed">
                            Randomly selects N participants from the <strong>pending</strong> pool and marks them as{' '}
                            <strong>selected</strong>. This ensures a fair, unbiased selection.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <label className="text-indigo-300 text-sm font-medium" htmlFor="winner-count">
                                Pick
                            </label>
                            <input
                                id="winner-count"
                                type="number"
                                min={1}
                                max={pending || 1}
                                value={winnersCount}
                                onChange={(e) => setWinnersCount(Number(e.target.value))}
                                className="w-16 rounded-xl px-3 py-2 bg-white/10 border border-white/20 text-white text-sm text-center focus:outline-none focus:border-indigo-400"
                            />
                            <span className="text-indigo-300 text-sm font-medium">winners</span>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handlePickWinners}
                            disabled={picking || pending === 0}
                            id="pick-winners-btn"
                            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50 cursor-pointer transition-all"
                            style={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
                            }}
                        >
                            {picking ? '⏳ Picking…' : '🎲 Pick!'}
                        </motion.button>
                    </div>
                </motion.div>

                {/* Newly picked banner */}
                <AnimatePresence>
                    {pickedIds.length > 0 && (
                        <motion.div
                            className="mb-5 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-4 text-emerald-300 text-sm"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            ✅ <strong>{pickedIds.length}</strong> participant(s) were randomly selected and marked as{' '}
                            <strong>selected</strong>. Highlighted in the table below.
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Table */}
                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <motion.span
                            className="text-5xl"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        >
                            π
                        </motion.span>
                    </div>
                ) : error ? (
                    <div className="text-rose-400 text-center py-12 text-sm">{error}</div>
                ) : registrations.length === 0 ? (
                    <div className="text-white/30 text-center py-16 text-base">No registrations yet. Share the form!</div>
                ) : (
                    <motion.div
                        className="rounded-2xl border border-white/10 overflow-hidden"
                        style={{ background: 'rgba(255,255,255,0.03)' }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {/* Table header */}
                        <div className="hidden md:grid grid-cols-[2fr_2fr_1.5fr_1fr_1fr_1.2fr] gap-4 px-6 py-3 border-b border-white/10 text-xs font-semibold text-white/40 uppercase tracking-wide">
                            <span>Name</span>
                            <span>Email</span>
                            <span>School</span>
                            <span>Level</span>
                            <span>Date</span>
                            <span>Status</span>
                        </div>

                        <div className="divide-y divide-white/5">
                            {registrations.map((r) => {
                                const isNew = pickedIds.includes(r.id);
                                const isExpanded = expandedId === r.id;

                                return (
                                    <motion.div
                                        key={r.id}
                                        className={`transition-all duration-300 ${isNew ? 'bg-emerald-500/8' : 'hover:bg-white/[0.02]'
                                            }`}
                                        layout
                                    >
                                        {/* Row */}
                                        <div className="grid grid-cols-1 md:grid-cols-[2fr_2fr_1.5fr_1fr_1fr_1.2fr] gap-2 md:gap-4 px-6 py-4 items-center">
                                            <button
                                                className="text-left"
                                                onClick={() => setExpandedId(isExpanded ? null : r.id)}
                                            >
                                                <span className="text-white font-medium text-sm flex items-center gap-1.5">
                                                    {isNew && <span className="text-emerald-400">★</span>}
                                                    {r.fullName}
                                                    <span className="text-white/30 text-xs ml-1">{isExpanded ? '▲' : '▼'}</span>
                                                </span>
                                                <span className="text-white/40 text-xs md:hidden">{r.email}</span>
                                            </button>
                                            <span className="hidden md:block text-white/60 text-sm truncate">{r.email}</span>
                                            <span className="hidden md:block text-white/40 text-xs">{r.levelOfStudy}</span>
                                            <span className="hidden md:block text-white/30 text-xs">
                                                {r.submittedAt
                                                    ? r.submittedAt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
                                                    : '—'}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <StatusBadge status={r.status} />
                                                <select
                                                    value={r.status}
                                                    onChange={(e) =>
                                                        handleStatusChange(r.id, e.target.value as QuizRegistration['status'])
                                                    }
                                                    disabled={statusUpdating === r.id}
                                                    className="text-[10px] bg-white/10 border border-white/20 text-white rounded-lg px-1.5 py-1 focus:outline-none disabled:opacity-50 cursor-pointer appearance-none"
                                                    id={`status-${r.id}`}
                                                >
                                                    <option value="pending" className="bg-[#0d0d4a]">Pending</option>
                                                    <option value="selected" className="bg-[#0d0d4a]">Selected</option>
                                                    <option value="rejected" className="bg-[#0d0d4a]">Rejected</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Expanded row — statement of interest */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-6 pb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                                                            <p className="text-indigo-300 text-xs font-semibold uppercase tracking-wide mb-2">
                                                                Statement of Interest
                                                            </p>
                                                            <p className="text-white/70 text-sm leading-relaxed">{r.statementOfInterest}</p>
                                                        </div>
                                                        <div className="rounded-xl bg-white/5 border border-white/10 p-4 flex flex-col gap-2 text-sm text-white/60">
                                                            <div className="flex justify-between">
                                                                <span className="text-white/40">Phone</span>
                                                                <span>{r.phone}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-white/40">π Enthusiasm</span>
                                                                <span>{'★'.repeat(r.enthusiasmRating)}{'☆'.repeat(5 - r.enthusiasmRating)}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-white/40">Submitted</span>
                                                                <span>
                                                                    {r.submittedAt
                                                                        ? r.submittedAt.toLocaleString('en-GB', {
                                                                            dateStyle: 'medium',
                                                                            timeStyle: 'short',
                                                                        })
                                                                        : '—'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                <p className="text-center text-white/20 text-xs mt-8">
                    π Pi Day Quiz Competition · Admin View · {new Date().getFullYear()}
                </p>
            </div>
        </main>
    );
}
