import AppContainer from '@/components/AppContainer';
import datapack from '@/data/datapack.json';
import { DataPack } from '@/types';

export default function Home() {
  const data = datapack as DataPack;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Gradient Mesh Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.1),transparent_50%)] pointer-events-none"></div>

      {/* Header */}
      <header className="relative bg-white/5 backdrop-blur-2xl border-b border-white/10 sticky top-0 z-50 shadow-2xl shadow-blue-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                    <span className="text-3xl">⚡</span>
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
                    Executive Productivity Agent
                  </h1>
                  <p className="mt-1.5 text-sm text-gray-400 font-medium">
                    For <span className="font-bold text-blue-400">{data.metadata.user.name}</span>
                    <span className="mx-2 text-gray-600">•</span>
                    <span className="text-gray-500">September 21-25, 2026</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-full border border-emerald-400/30 backdrop-blur-xl shadow-lg shadow-emerald-500/20">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-lg shadow-emerald-500/50"></span>
              </div>
              <span className="text-sm font-bold text-emerald-300">Live Dashboard</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto">
        <AppContainer data={data} />
      </main>

      {/* Footer */}
      <footer className="relative mt-12 bg-white/5 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center gap-2">
            <p className="text-sm text-gray-400 font-medium">
              Executive Productivity Agent
            </p>
            <span className="text-gray-600">•</span>
            <p className="text-sm bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">
              Built for Peak Performance
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
