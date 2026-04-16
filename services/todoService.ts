import { API_BASE_URL } from "@/constants/api";
import { CreateTaskListRequest, CreateTaskRequest, Subtask, Task, TaskList, UpdateTaskRequest } from "@/type/Task";

function authHeaders(token: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// ─── TODOS ───────────────────────────────────────────────

export async function fetchTodos(token: string): Promise<Task[]> {
  const res = await fetch(`${API_BASE_URL}/todos`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error(`Error al obtener tareas: ${res.status}`);
  return res.json();
}

export async function createTodo(data: CreateTaskRequest, token: string): Promise<Task> {
  const res = await fetch(`${API_BASE_URL}/todos`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Error al crear tarea: ${res.status}`);
  return res.json();
}

export async function updateTodo(id: string, data: UpdateTaskRequest, token: string): Promise<Task> {
  const res = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  if (res.status === 404) throw new Error("Tarea no encontrada");
  if (!res.ok) throw new Error(`Error al actualizar tarea: ${res.status}`);
  return res.json();
}

export async function deleteTodo(id: string, token: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (res.status === 404) throw new Error("Tarea no encontrada");
  if (!res.ok) throw new Error(`Error al eliminar tarea: ${res.status}`);
}

export async function patchTodoCompleted(id: string, completed: boolean, token: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/todos/${id}/completed`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({ completed }),
  });
  if (res.status === 404) throw new Error("Tarea no encontrada");
  if (!res.ok) throw new Error(`Error al actualizar tarea: ${res.status}`);
}

// ─── LISTAS ──────────────────────────────────────────────

export async function fetchLists(token: string): Promise<TaskList[]> {
  const res = await fetch(`${API_BASE_URL}/lists`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error(`Error al obtener listas: ${res.status}`);
  return res.json();
}

export async function createList(data: CreateTaskListRequest, token: string): Promise<TaskList> {
  const res = await fetch(`${API_BASE_URL}/lists`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Error al crear lista: ${res.status}`);
  return res.json();
}

export async function deleteList(id: string, token: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/lists/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error(`Error al eliminar lista: ${res.status}`);
}

// ─── SUBTASKS ─────────────────────────────────────────────

export async function fetchSubtasks(todoId: string, token: string): Promise<Subtask[]> {
  const res = await fetch(`${API_BASE_URL}/todos/${todoId}/subtasks`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error(`Error al obtener subtareas: ${res.status}`);
  return res.json();
}

export async function createSubtask(todoId: string, title: string, token: string): Promise<Subtask> {
  const res = await fetch(`${API_BASE_URL}/todos/${todoId}/subtasks`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error(`Error al crear subtarea: ${res.status}`);
  return res.json();
}

export async function patchSubtaskCompleted(todoId: string, subtaskId: string, completed: boolean, token: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/todos/${todoId}/subtasks/${subtaskId}/completed`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({ completed }),
  });
  if (!res.ok) throw new Error(`Error al actualizar subtarea: ${res.status}`);
}

export async function deleteSubtask(todoId: string, subtaskId: string, token: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/todos/${todoId}/subtasks/${subtaskId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error(`Error al eliminar subtarea: ${res.status}`);
}
