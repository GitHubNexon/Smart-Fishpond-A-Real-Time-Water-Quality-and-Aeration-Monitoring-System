// src/utils/memory-token.ts
let headerToken: string | null = null;

export const memoryToken = {
  get: () => headerToken,
  set: (token: string) => {
    headerToken = token;
  },
  clear: () => {
    headerToken = null;
  },
};
