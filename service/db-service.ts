export const dbService = {
  init: async () => {
    await fetch('/api/init-db');
  }
}