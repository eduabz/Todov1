# Plan de Componentes — todoweb

## Estado
- [ ] = pendiente
- [x] = completado

---

## Grupo 1 — Feedback & Estado
| # | Componente | Archivo | Estado |
|---|---|---|---|
| 1 | `EmptyState` | `components/EmptyState.tsx` | [x] |
| 2 | `ErrorBanner` | `components/ErrorBanner.tsx` | [x] |
| 3 | `Toast` | `components/Toast.tsx` | [x] |

## Grupo 2 — Tareas
| # | Componente | Archivo | Estado |
|---|---|---|---|
| 4 | `TaskItemSkeleton` | `components/TaskItemSkeleton.tsx` | [x] |
| 5 | `TaskCounter` | `components/TaskCounter.tsx` | [x] |
| 6 | `TaskFilter` | `components/TaskFilter.tsx` | [x] |
| 7 | `SwipeableTaskItem` | `components/SwipeableTaskItem.tsx` | [x] |

## Grupo 3 — Formularios & Inputs
| # | Componente | Archivo | Estado |
|---|---|---|---|
| 8 | `FormInput` | `components/FormInput.tsx` | [x] |
| 9 | `PasswordInput` | `components/PasswordInput.tsx` | [x] |
| 10 | `PrimaryButton` | `components/PrimaryButton.tsx` | [x] |

## Grupo 4 — Navegación & Layout
| # | Componente | Archivo | Estado |
|---|---|---|---|
| 11 | `ScreenHeader` | `components/ScreenHeader.tsx` | [x] |
| 12 | `FAB` | `components/FAB.tsx` | [x] |
| 13 | `Divider` | `components/Divider.tsx` | [x] |

## Grupo 5 — Auth
| # | Componente | Archivo | Estado |
|---|---|---|---|
| 14 | `AuthCard` | `components/AuthCard.tsx` | [x] |
| 15 | `UserAvatar` | `components/UserAvatar.tsx` | [x] |

---

## Descripción detallada

### Grupo 1 — Feedback & Estado

**EmptyState**
- Ícono grande + título + subtítulo + botón de acción opcional
- Props: `icon`, `title`, `subtitle`, `actionLabel?`, `onAction?`
- Uso: pantalla de tareas vacía, búsqueda sin resultados

**ErrorBanner**
- Banda roja con mensaje de error y botón "Reintentar"
- Props: `message`, `onRetry?`
- Uso: reemplaza el texto de error actual en HomeScreen

**Toast**
- Notificación temporal que aparece arriba/abajo y desaparece sola
- Props: `message`, `type: 'success' | 'error' | 'info'`, `duration?`
- Uso: confirmación de tarea creada, eliminada, error de red

### Grupo 2 — Tareas

**TaskItemSkeleton**
- Placeholder animado (shimmer) que imita la forma de `TaskItem`
- Props: ninguna
- Uso: mostrar mientras se hace fetch de tareas

**TaskCounter**
- Badge/pill que muestra "3 de 5 completadas" + barra de progreso
- Props: `completed`, `total`
- Uso: header de la lista de tareas

**TaskFilter**
- Tres chips horizontales: Todas / Pendientes / Completadas
- Props: `value: 'all' | 'pending' | 'completed'`, `onChange`
- Uso: filtrar la lista en HomeScreen

**SwipeableTaskItem**
- Envuelve `TaskItem` con swipe hacia la izquierda para revelar botón eliminar
- Props: mismas que `TaskItem`
- Uso: reemplazar `TaskItem` en la lista principal

### Grupo 3 — Formularios & Inputs

**FormInput**
- TextInput estilizado con label encima y mensaje de error abajo
- Props: `label`, `error?`, + todas las props de TextInput
- Uso: base para todos los inputs del proyecto

**PasswordInput**
- `FormInput` con botón ojo para mostrar/ocultar contraseña
- Props: `label`, `error?`, `value`, `onChangeText`
- Uso: campos de contraseña en login y register

**PrimaryButton**
- Botón azul con estado loading (spinner) y disabled (opacidad)
- Props: `label`, `onPress`, `loading?`, `disabled?`
- Uso: reemplazar todos los botones de submit

### Grupo 4 — Navegación & Layout

**ScreenHeader**
- Header consistente: título centrado, slot izquierdo y derecho
- Props: `title`, `leftAction?`, `rightAction?`
- Uso: reemplazar los headers inline actuales

**FAB**
- Botón circular flotante en esquina inferior derecha
- Props: `icon`, `onPress`, `color?`
- Uso: abrir modal de nueva tarea

**Divider**
- Línea horizontal con texto opcional centrado (ej: "o continúa con")
- Props: `label?`
- Uso: separadores en pantallas de auth

### Grupo 5 — Auth

**AuthCard**
- Contenedor con sombra, bordes redondeados y padding consistente
- Props: `children`
- Uso: envolver el formulario en login y register

**UserAvatar**
- Círculo con la inicial del nombre del usuario en color primario
- Props: `name`, `size?: 'sm' | 'md' | 'lg'`
- Uso: header de HomeScreen junto al saludo
