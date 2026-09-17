import AppContainer from '@/components/AppContainer';
import datapack from '@/data/datapack.json';
import { DataPack } from '@/types';

export default function Home() {
  const data = datapack as DataPack;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Executive Productivity Agent
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    For <span className="font-semibold text-blue-600">{data.metadata.user.name}</span> — 
                    <span className="ml-1 text-gray-500">Week of September 21-25, 2026</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Live Dashboard</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        <AppContainer data={data} />
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white/50 backdrop-blur-sm border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-sm text-gray-500 text-center">
            Executive Productivity Agent — Built with ❤️ for better productivity
          </p>
        </div>
      </footer>
    </div>
  );
}
