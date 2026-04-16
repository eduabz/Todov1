import { auth } from "@/constants/firebase";
import { RegisterUserRequest } from "@/type/User";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import { API_BASE_URL } from "@/constants/api";

export async function signIn(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function register(data: RegisterUserRequest): Promise<User> {
  // 1. Crear usuario en Firebase
  const credential = await createUserWithEmailAndPassword(
    auth,
    data.email,
    data.password,
  );
  const user = credential.user;

  // 2. Registrar en el backend enviando el firebaseUuid recién generado
  const res = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, firebaseUuid: user.uid }),
  });

  if (!res.ok) {
    // Si el backend falla, eliminar el usuario de Firebase para mantener consistencia
    await user.delete();
    throw new Error("Error al registrar el usuario en el servidor");
  }

  return user;
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

// Llama a esto antes de cada request al backend para obtener un token fresco
export async function getToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("No hay usuario autenticado");
  return user.getIdToken();
}
