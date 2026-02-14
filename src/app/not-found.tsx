import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
            <div className="bg-yellow-100 p-4 rounded-full mb-4 dark:bg-yellow-900/30">
                <AlertTriangle className="w-10 h-10 text-yellow-600 dark:text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">페이지를 찾을 수 없습니다</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
                요청하신 페이지가 삭제되었거나 주소가 변경되었을 수 있습니다.
            </p>
            <Link
                href="/"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-500/30"
            >
                홈으로 돌아가기
            </Link>
        </div>
    );
}
