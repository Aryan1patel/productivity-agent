import AppContainer from '@/components/AppContainer';
import datapack from '@/data/datapack.json';
import { DataPack } from '@/types';

export default function Home() {
  const data = datapack as DataPack;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Executive Productivity Agent
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              For <span className="font-medium">{data.metadata.user.name}</span> — 
              Week of September 21-25, 2026
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        <AppContainer data={data} />
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-sm text-gray-500 text-center">
            Executive Productivity Agent — Assignment 1
          </p>
        </div>
      </footer>
    </div>
  );
}
