"use client";

import { Loader2 } from "lucide-react";

export default function LoadingSpinner() {
    return (
        <div className="flex flex-col items-center justify-center p-20 text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
            <p className="text-sm font-medium">로딩 중입니다...</p>
        </div>
    );
}
