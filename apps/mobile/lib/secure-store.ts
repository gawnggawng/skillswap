import * as SecureStore from "expo-secure-store";

const SESSION_KEY = "sessionToken";

export async function saveToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(SESSION_KEY, token);
}

export async function getToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(SESSION_KEY);
}

export async function removeToken(): Promise<void> {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}
