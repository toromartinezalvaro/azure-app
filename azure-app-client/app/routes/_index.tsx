import { useState } from "react";

export default function Index() {
  // State to store the backend response
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to call the backend
  const testDatabase = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      // Use environment variable for backend URL
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const res = await fetch(`${apiUrl}/test-db`);
      const data = await res.json();
      if (res.ok) {
        setResponse(`${data.message} (${data.timestamp})`);
      } else {
        setError(data.detail || "Error desconocido");
      }
    } catch (err) {
      setError("No se pudo conectar con el backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <button
          className="px-8 py-4 bg-blue-600 text-white rounded-lg text-xl font-bold shadow hover:bg-blue-700 transition"
          onClick={testDatabase}
          disabled={loading}
        >
          {loading ? "Probando..." : "Probar base de datos"}
        </button>
        {response && (
          <div className="mt-4 text-green-700 font-semibold text-lg">{response}</div>
        )}
        {error && (
          <div className="mt-4 text-red-600 font-semibold text-lg">{error}</div>
        )}
      </div>
    </div>
  );
}
