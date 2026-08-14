// src/components/Loader/Loader.jsx
export function Loader() {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-400">Pensando...</span>
      </div>
    );
  }