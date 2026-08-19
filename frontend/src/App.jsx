import { useEffect, useState } from 'react'
import './App.css'

// In production (docker-compose) Nginx proxies /api/* to the Django
// backend, so the frontend can always call a same-origin relative path.
// This also works during local `npm run dev` if you run Vite's dev
// server behind the same Nginx, or set VITE_API_BASE_URL for standalone
// frontend development.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

function App() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTodos = () => {
    setLoading(true)
    fetch(`${API_BASE_URL}/todos/`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => {
        setTodos(data.results ?? data)
        setError(null)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  const addTodo = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    try {
      const res = await fetch(`${API_BASE_URL}/todos/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setTitle('')
      fetchTodos()
    } catch (err) {
      setError(err.message)
    }
  }

  const toggleTodo = async (todo) => {
    try {
      await fetch(`${API_BASE_URL}/todos/${todo.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_done: !todo.is_done }),
      })
      fetchTodos()
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/todos/${id}/`, { method: 'DELETE' })
      fetchTodos()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="app">
      <header>
        <h1>Storemesh IT Infra Demo</h1>
        <p className="subtitle">
          React.js (frontend) → Nginx (proxy) → Django REST API (backend) → PostgreSQL (database)
        </p>
      </header>

      <form className="add-form" onSubmit={addTodo}>
        <input
          type="text"
          placeholder="เพิ่มรายการใหม่..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">เพิ่ม</button>
      </form>

      {error && <p className="error">เกิดข้อผิดพลาด: {error}</p>}
      {loading && <p>กำลังโหลด...</p>}

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className={todo.is_done ? 'done' : ''}>
            <label>
              <input
                type="checkbox"
                checked={todo.is_done}
                onChange={() => toggleTodo(todo)}
              />
              <span>{todo.title}</span>
            </label>
            <button className="delete" onClick={() => deleteTodo(todo.id)}>
              ลบ
            </button>
          </li>
        ))}
      </ul>

      {!loading && todos.length === 0 && !error && (
        <p className="empty">ยังไม่มีรายการ ลองเพิ่มดูสิ</p>
      )}
    </div>
  )
}

export default App
