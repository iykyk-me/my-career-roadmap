"use client";

import { useProfile, useDashboardStats, useMilestones, useDailyGoals } from "@/hooks/useLocalStorage";
import StatCard from "@/components/dashboard/StatCard";
import ProgressChart from "@/components/dashboard/ProgressChart";
import ActivityChart from "@/components/dashboard/ActivityChart";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { Flame, CheckCircle, Clock, Award, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export default function Dashboard() {
  const { data: profile } = useProfile();
  const { data: milestones } = useMilestones();
  const { data: dailyGoals } = useDailyGoals();
  const stats = useDashboardStats();

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayGoals = dailyGoals.find(dg => dg.date === today)?.goals || [];
  const activeMilestones = milestones.filter(m => m.status === 'in-progress').slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-1"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            반가워요, {profile.name}님! 👋
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            오늘도 꿈을 향해 한 걸음 더 나아가볼까요?
          </p>
        </motion.div>

        {/* D-Day Counter (Mock) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-500/20"
        >
          <div className="text-center">
            <span className="text-xs opacity-80 block">졸업까지</span>
            <span className="text-xl font-bold">D-320</span>
          </div>
          <div className="w-px h-8 bg-white/20"></div>
          <div className="text-center">
            <span className="text-xs opacity-80 block">전체 진행률</span>
            <span className="text-xl font-bold">45%</span>
          </div>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="연속 달성"
          value={`${stats.currentStreak}일째`}
          icon={Flame}
          colorClass="bg-orange-500 text-orange-500"
          subtext="이대로 쭉 가보자고! 🔥"
          delay={0.1}
        />
        <StatCard
          title="이번 달 목표 달성"
          value={`${stats.totalGoalsCompleted}개`}
          icon={CheckCircle}
          colorClass="bg-green-500 text-green-500"
          subtext="지난달보다 12% 증가 📈"
          delay={0.2}
        />
        <StatCard
          title="총 공부 시간"
          value={`${stats.totalStudyHours}시간`}
          icon={Clock}
          colorClass="bg-blue-500 text-blue-500"
          subtext="꾸준함이 재능을 이긴다 ⏳"
          delay={0.3}
        />
        <StatCard
          title="취득 자격증"
          value={`${stats.completedMilestones}개`}
          icon={Award}
          colorClass="bg-purple-500 text-purple-500"
          subtext="나의 경쟁력 +1 ✨"
          delay={0.4}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProgressChart />
        </div>
        <div>
          <ActivityChart />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentActivity />

        {/* Upcoming Milestones */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">진행 중인 마일스톤</h3>
            <Link href="/roadmap" className="text-sm text-blue-600 hover:underline">전체보기</Link>
          </div>
          <div className="space-y-4">
            {activeMilestones.length > 0 ? (
              activeMilestones.map(milestone => (
                <div key={milestone.id} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      {milestone.category}
                    </span>
                    <span className="text-xs text-slate-500">{milestone.endDate}까지</span>
                  </div>
                  <h4 className="font-medium text-slate-900 dark:text-slate-100">{milestone.title}</h4>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">진행률</span>
                      <span className="text-blue-600 font-medium">{milestone.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${milestone.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400">
                진행 중인 마일스톤이 없습니다.
              </div>
            )}
          </div>
        </motion.div>

        {/* Today's Goals Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg ring-1 ring-black/5 text-white"
        >
          <h3 className="text-lg font-bold mb-4">오늘의 목표 🎯</h3>
          <div className="space-y-3">
            {todayGoals.length > 0 ? (
              todayGoals.slice(0, 4).map(goal => (
                <div key={goal.id} className="flex items-center gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                  <div className={`w-5 h-5 rounded-full border-2 border-white/40 flex items-center justify-center ${goal.completed ? 'bg-white text-blue-500' : ''}`}>
                    {goal.completed && <CheckCircle className="w-3 h-3" />}
                  </div>
                  <span className={`text-sm ${goal.completed ? 'line-through opacity-60' : ''}`}>{goal.text}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 bg-white/10 rounded-lg">
                <p className="opacity-90 mb-2">오늘의 목표가 아직 없어요!</p>
                <Link href="/daily" className="inline-block px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-50 transition-colors">
                  목표 세우기
                </Link>
              </div>
            )}
            {todayGoals.length > 0 && (
              <Link href="/daily" className="flex items-center justify-center gap-2 w-full py-3 mt-4 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium">
                전체 관리하기 <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
