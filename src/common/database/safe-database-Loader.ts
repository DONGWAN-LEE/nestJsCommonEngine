// src/common/safe-database-loader.ts
export function getEntities(): any {
    if (process.env.ENABLE_DATABASE === 'true') {
      try {
        return require('./entities/master');
      } catch (error) {
        console.warn('Failed to load entities:', error.message);
        return {};
      }
    }
    return {};
  }
  
  export function getTables(): any {
    if (process.env.ENABLE_DATABASE === 'true') {
      try {
        return require('./database/master');
      } catch (error) {
        console.warn('Failed to load tables:', error.message);
        return {};
      }
    }
    return {};
  }
  