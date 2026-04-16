// Refleja el entity User del backend (tabla `users`)
export type User = {
  id: string;          // UUID
  fullName: string;
  email: string;
  role: string;        // "USER"
  active: boolean;
  firebaseUuid: string;
};

// Body para POST /users
export type RegisterUserRequest = {
  fullName: string;       // 2–100 chars
  email: string;          // max 150 chars
  password: string;       // 8–64 chars, mínimo 1 minúscula, 1 mayúscula, 1 dígito
  passwordConfirm: string;
  firebaseUuid: string;   // UID de Firebase, creado por el frontend
};
