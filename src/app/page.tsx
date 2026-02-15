"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Smartphone, UserCheck } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-primary/20">
            {/* Header / Nav */}
            <header className="fixed top-0 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                            C
                        </div>
                        <span className="text-xl font-bold tracking-tight">My Career Roadmap</span>
                    </div>
                    <Link
                        href="/login"
                        className="px-5 py-2.5 rounded-full bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
                    >
                        로그인 / 시작하기
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <main>
                <section className="pt-32 pb-20 px-6">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6 border border-primary/20">
                                특성화고 취업 성공의 지름길 🚀
                            </span>
                            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-slate-900 dark:text-white">
                                나의 꿈을 향한 <br className="hidden md:block" />
                                <span className="text-primary">확실한 로드맵</span>을 설계하세요
                            </h1>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
                        >
                            목표 설정부터 포트폴리오 관리까지, <br />
                            취업 준비에 필요한 모든 과정을 한 곳에서 관리하세요.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                        >
                            <Link
                                href="/login"
                                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-2"
                            >
                                무료로 시작하기 <ArrowRight className="w-5 h-5" />
                            </Link>
                            <a
                                href="#features"
                                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-bold text-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center"
                            >
                                기능 살펴보기
                            </a>
                        </motion.div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-24 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">취업 준비, 더 이상 막막하지 않아요</h2>
                            <p className="text-slate-600 dark:text-slate-400 text-lg">성공적인 취업을 위한 3가지 핵심 기능을 제공합니다.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <FeatureCard
                                icon={Smartphone}
                                title="나만의 로드맵"
                                description="희망 직무에 맞춰 단계별 학습 가이드와 목표를 제공합니다. 진도율을 한눈에 확인하세요."
                            />
                            <FeatureCard
                                icon={CheckCircle}
                                title="일일 목표 관리"
                                description="오늘 해야 할 공부와 활동을 기록하고 관리하세요. 꾸준한 습관이 합격의 비결입니다."
                            />
                            <FeatureCard
                                icon={UserCheck}
                                title="포트폴리오 자동생성"
                                description="활동 기록을 모아 깔끔한 PDF 포트폴리오로 만들어드립니다. 면접관에게 돋보이세요."
                            />
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-12 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 text-sm">
                    <p>© 2026 My Career Roadmap. All rights reserved.</p>
                    <p className="mt-2">Created for Vocational High School Students</p>
                </footer>
            </main>
        </div>
    );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Icon className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {description}
            </p>
        </div>
    );
}
