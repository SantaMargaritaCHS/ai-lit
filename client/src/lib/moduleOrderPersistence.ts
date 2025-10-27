/**
 * Module Order Persistence
 *
 * Saves custom module ordering to localStorage for developer/instructor use.
 * Allows reordering of module cards on the home page with persistence across sessions.
 */

const STORAGE_KEY = 'ai-literacy-module-order';

export interface ModuleOrderData {
  moduleIds: string[];
  lastUpdated: string;
}

/**
 * Save custom module order to localStorage
 */
export function saveModuleOrder(moduleIds: string[]): void {
  try {
    const data: ModuleOrderData = {
      moduleIds,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save module order:', error);
  }
}

/**
 * Load custom module order from localStorage
 * Returns null if no saved order exists
 */
export function loadModuleOrder(): string[] | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const data: ModuleOrderData = JSON.parse(stored);
    return data.moduleIds;
  } catch (error) {
    console.error('Failed to load module order:', error);
    return null;
  }
}

/**
 * Clear custom module order from localStorage
 * Returns modules to their default order
 */
export function clearModuleOrder(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear module order:', error);
  }
}

/**
 * Check if a custom module order exists
 */
export function hasCustomModuleOrder(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== null;
}
