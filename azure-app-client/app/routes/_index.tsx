import { useEffect, useState, useMemo } from "react";

// Expense type
interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: string;
}

export default function Index() {
  // State for expenses
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: ""
  });
  const [submitting, setSubmitting] = useState(false);

  let apiUrl = import.meta.env.VITE_API_URL || "https://azure-app-server.azurewebsites.net";
  
  // Limpiar barra final si existe
  if (apiUrl.endsWith('/')) {
    apiUrl = apiUrl.slice(0, -1);
  }
  
  // Debug para ver exactamente qué está pasando
  console.log("=== DEBUG API URL ===");
  console.log("VITE_API_URL raw:", import.meta.env.VITE_API_URL);
  console.log("apiUrl final:", apiUrl);
  console.log("URL completa que va a usar:", `${apiUrl}/expenses`);
  console.log("Entorno:", import.meta.env.MODE);
  console.log("===================");
  // Force rebuild: improved workflows with multiple tags
  // Trigger workflow: Docker Buildx setup added

  // Totals and summary (memoized)
  const totalAmount = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);
  const totalCount = expenses.length;
  const totalByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    for (const e of expenses) {
      map[e.category] = (map[e.category] || 0) + e.amount;
    }
    return map;
  }, [expenses]);

  // Fetch expenses on mount
  useEffect(() => {
    fetchExpenses();
    // eslint-disable-next-line
  }, []);

  // Fetch all expenses
  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/expenses`);
      const data = await res.json();
      if (res.ok) {
        setExpenses(data);
      } else {
        setError("Error al cargar los gastos");
      }
    } catch {
      setError("No se pudo conectar con el backend");
    } finally {
      setLoading(false);
    }
  };

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: form.description,
          amount: parseFloat(form.amount),
          category: form.category
        })
      });
      if (res.ok) {
        setForm({ description: "", amount: "", category: "" });
        fetchExpenses();
      } else {
        setError("Error al agregar el gasto");
      }
    } catch {
      setError("No se pudo conectar con el backend");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete expense
  const handleDelete = async (id: number) => {
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/expenses/${id}`, { method: "DELETE" });
      if (res.ok) {
        setExpenses(expenses.filter(e => e.id !== id));
      } else {
        setError("Error al eliminar el gasto");
      }
    } catch {
      setError("No se pudo conectar con el backend");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 font-sans flex flex-col items-center py-10">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-extrabold text-center mb-2 tracking-tight drop-shadow-lg">Registro de gastos personales</h1>
        <p className="text-center text-gray-400 mb-8">Administra tus gastos de manera sencilla y visual.</p>

        {/* Totals section */}
        <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-8 bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-700">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-lg text-gray-400">Total de gastos</span>
            <span className="text-2xl font-bold text-blue-400">${totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <span className="text-lg text-gray-400">Cantidad de gastos</span>
            <span className="text-2xl font-bold text-green-400">{totalCount}</span>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <span className="text-lg text-gray-400">Total por categoría</span>
            <ul className="mt-1 space-y-1">
              {Object.entries(totalByCategory).length === 0 ? (
                <li className="text-gray-500 text-sm">Sin categorías</li>
              ) : (
                Object.entries(totalByCategory).map(([cat, val]) => (
                  <li key={cat} className="text-sm text-gray-200">
                    <span className="font-semibold text-yellow-400">{cat}:</span> ${val.toFixed(2)}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        {/* Redesigned add expense card vertical layout */}
        <form
          className="w-full max-w-lg mx-auto flex flex-col gap-4 mb-10 bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-800"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label htmlFor="description" className="mb-1 text-sm text-gray-300 font-semibold">Descripción</label>
              <input
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 transition text-base"
                placeholder="Ej: Pago de servicios, compra de mercado, etc."
                required
                maxLength={200}
                autoComplete="off"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="amount" className="mb-1 text-sm text-gray-300 font-semibold">Monto</label>
              <input
                id="amount"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 transition text-base"
                placeholder="Ej: 25000"
                type="number"
                min="0"
                step="0.01"
                required
                autoComplete="off"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="category" className="mb-1 text-sm text-gray-300 font-semibold">Categoría</label>
              <input
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 transition text-base"
                placeholder="Ej: Alimentos, transporte, etc."
                required
                maxLength={50}
                autoComplete="off"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold shadow transition text-lg disabled:opacity-60"
              disabled={submitting}
            >
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M12 5v14m7-7H5"/></svg>
              {submitting ? "Agregando..." : "Agregar"}
            </button>
          </div>
        </form>

        {error && <div className="text-red-400 mb-4 text-center font-semibold animate-pulse">{error}</div>}
        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table className="w-full bg-gray-800 rounded-xl">
            <thead>
              <tr className="bg-gray-700 text-gray-300">
                <th className="py-3 px-4 text-left">Descripción</th>
                <th className="py-3 px-4 text-left">Monto</th>
                <th className="py-3 px-4 text-left">Categoría</th>
                <th className="py-3 px-4 text-left">Fecha</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-400 animate-pulse">
                    Cargando gastos...
                  </td>
                </tr>
              ) : expenses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    No hay gastos registrados
                  </td>
                </tr>
              ) : (
                expenses.map(expense => (
                  <tr key={expense.id} className="border-t border-gray-700 hover:bg-gray-700/40 transition">
                    <td className="py-3 px-4 font-medium">{expense.description}</td>
                    <td className="py-3 px-4">${expense.amount.toFixed(2)}</td>
                    <td className="py-3 px-4">{expense.category}</td>
                    <td className="py-3 px-4">{new Date(expense.date).toLocaleString("es-CO")}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
                        onClick={() => handleDelete(expense.id)}
                      >
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M6 6l12 12M6 18L18 6"/></svg>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
