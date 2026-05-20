import React from 'react';
import { TrendingUp, Award, ShieldCheck, Target } from 'lucide-react';

const FinancialHealthScore = ({ financialData }) => {
    // Calculate Score Logic
    const calculateScore = () => {
        let score = 0;
        const { totalBalance, monthlyExpenses, investments } = financialData;

        // 1. Savings Buffer (30 points): Do they have enough cash to cover 3 months of expenses?
        if (monthlyExpenses > 0) {
            const monthsCovered = totalBalance / monthlyExpenses;
            score += Math.min(monthsCovered * 10, 30);
        } else if (totalBalance > 1000) {
            score += 30; // Default points if no expenses data but has balance
        }

        // 2. Investment Ratio (30 points): Are at least 20% of their assets invested?
        const totalAssets = totalBalance + investments;
        if (totalAssets > 0) {
            const investmentRatio = investments / totalAssets;
            score += Math.min(investmentRatio * 150, 30); // 20% ratio = 30 pts
        }

        // 3. Asset Base (20 points): Do they have positive net worth?
        if (totalAssets > 0) score += 20;

        // 4. Activity (20 points): Encouragement for tracking
        if (financialData.transactions?.length > 0) score += 20;

        return Math.round(score);
    };

    const score = calculateScore();

    // Determine Grade & Color
    const getGrade = (s) => {
        if (s >= 80) return { label: 'Excellent', color: 'text-emerald-500', bg: 'bg-emerald-500', sub: 'You are a financial master!' };
        if (s >= 60) return { label: 'Good', color: 'text-blue-500', bg: 'bg-blue-500', sub: 'On the right track, keep going.' };
        if (s >= 40) return { label: 'Fair', color: 'text-yellow-500', bg: 'bg-yellow-500', sub: 'Room for improvement.' };
        return { label: 'Needs Attention', color: 'text-red-500', bg: 'bg-red-500', sub: 'Let\'s start building your foundation.' };
    };

    const grade = getGrade(score);

    // SVG parameters for gauge
    const radius = 80;
    const stroke = 12;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="glass-card p-8 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
            {/* Decorative background blur */}
            <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none ${grade.bg}`}></div>

            <div className="flex-1 mb-8 md:mb-0 md:mr-8 text-center md:text-left z-10">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <Award className={`w-6 h-6 ${grade.color}`} />
                    <span className="text-sm font-bold tracking-wider text-slate-500 uppercase">Financial Health Score</span>
                </div>
                <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">
                    {grade.label}
                </h2>
                <p className="text-slate-600 mb-6 max-w-md">
                    {grade.sub} Your score is based on your savings, investments, and spending habits.
                </p>

                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span>Savings Buffer</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                        <span>Growth Potential</span>
                    </div>
                </div>
            </div>

            {/* Radial Gauge */}
            <div className="relative group cursor-pointer z-10">
                <div className="absolute inset-0 rounded-full bg-white/50 blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <svg
                    height={radius * 2}
                    width={radius * 2}
                    className="transform -rotate-90 relative"
                >
                    {/* Background Circle */}
                    <circle
                        stroke="#e2e8f0"
                        strokeWidth={stroke}
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                    {/* Progress Circle */}
                    <circle
                        stroke="currentColor"
                        className={`${grade.color} transition-all duration-1000 ease-out`}
                        strokeWidth={stroke}
                        strokeDasharray={circumference + ' ' + circumference}
                        style={{ strokeDashoffset }}
                        strokeLinecap="round"
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-4xl font-bold ${grade.color}`}>
                        {score}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold uppercase mt-1">/ 100</span>
                </div>
            </div>
        </div>
    );
};

export default FinancialHealthScore;
