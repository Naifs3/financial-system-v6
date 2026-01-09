// ╔═══════════════════════════════════════════════════════════════════════════════════╗
// ║                           نظام التراجع والإعادة - UndoRedo                        ║
// ╚═══════════════════════════════════════════════════════════════════════════════════╝

import { useRef, useCallback } from 'react';

const MAX_HISTORY_SIZE = 20;
const DEBOUNCE_DELAY = 500;

// ═══════════════════════════════════════════════════════════════════════════════════
// 🎣 Hook للتراجع والإعادة
// ═══════════════════════════════════════════════════════════════════════════════════
export const useUndoRedo = () => {
  const historyRef = useRef([]);
  const currentIndexRef = useRef(-1);
  const isRestoringRef = useRef(false);
  const debounceTimerRef = useRef(null);

  // حفظ حالة في التاريخ (مع تأخير)
  const saveToHistory = useCallback((state) => {
    if (isRestoringRef.current) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      const history = historyRef.current;
      const currentIndex = currentIndexRef.current;
      const newHistory = history.slice(0, currentIndex + 1);
      newHistory.push(JSON.stringify(state));

      if (newHistory.length > MAX_HISTORY_SIZE) {
        newHistory.shift();
      }

      historyRef.current = newHistory;
      currentIndexRef.current = newHistory.length - 1;
    }, DEBOUNCE_DELAY);
  }, []);

  // حفظ فوري
  const saveImmediate = useCallback((state) => {
    if (isRestoringRef.current) return;

    const history = historyRef.current;
    const currentIndex = currentIndexRef.current;
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(JSON.stringify(state));

    if (newHistory.length > MAX_HISTORY_SIZE) {
      newHistory.shift();
    }

    historyRef.current = newHistory;
    currentIndexRef.current = newHistory.length - 1;
  }, []);

  // التراجع
  const undo = useCallback(() => {
    const currentIndex = currentIndexRef.current;
    if (currentIndex <= 0) return null;

    isRestoringRef.current = true;
    currentIndexRef.current = currentIndex - 1;
    const state = JSON.parse(historyRef.current[currentIndexRef.current]);

    setTimeout(() => { isRestoringRef.current = false; }, 100);
    return state;
  }, []);

  // الإعادة
  const redo = useCallback(() => {
    const currentIndex = currentIndexRef.current;
    const history = historyRef.current;
    if (currentIndex >= history.length - 1) return null;

    isRestoringRef.current = true;
    currentIndexRef.current = currentIndex + 1;
    const state = JSON.parse(historyRef.current[currentIndexRef.current]);

    setTimeout(() => { isRestoringRef.current = false; }, 100);
    return state;
  }, []);

  // التحقق من إمكانية التراجع/الإعادة
  const canUndo = useCallback(() => currentIndexRef.current > 0, []);
  const canRedo = useCallback(() => currentIndexRef.current < historyRef.current.length - 1, []);

  // معلومات التاريخ
  const getHistoryInfo = useCallback(() => ({
    total: historyRef.current.length,
    current: currentIndexRef.current + 1,
    canUndo: currentIndexRef.current > 0,
    canRedo: currentIndexRef.current < historyRef.current.length - 1
  }), []);

  // مسح التاريخ
  const clearHistory = useCallback(() => {
    historyRef.current = [];
    currentIndexRef.current = -1;
  }, []);

  // تهيئة التاريخ
  const initHistory = useCallback((state) => {
    historyRef.current = [JSON.stringify(state)];
    currentIndexRef.current = 0;
  }, []);

  // التحقق من وضع الاستعادة
  const isRestoring = useCallback(() => isRestoringRef.current, []);

  return {
    saveToHistory,
    saveImmediate,
    undo,
    redo,
    canUndo,
    canRedo,
    getHistoryInfo,
    clearHistory,
    initHistory,
    isRestoring
  };
};

// ═══════════════════════════════════════════════════════════════════════════════════
// 🔧 دوال مساعدة
// ═══════════════════════════════════════════════════════════════════════════════════

// إنشاء snapshot
export const createSnapshot = (states) => {
  const { itemTypes, places, workItems, programming, categories } = states;
  return {
    itemTypes: JSON.parse(JSON.stringify(itemTypes || {})),
    places: JSON.parse(JSON.stringify(places || {})),
    workItems: JSON.parse(JSON.stringify(workItems || {})),
    programming: JSON.parse(JSON.stringify(programming || {})),
    categories: JSON.parse(JSON.stringify(categories || []))
  };
};

// استعادة من snapshot
export const restoreFromSnapshot = (snapshot, setters) => {
  const { setItemTypes, setPlaces, setWorkItems, setProgramming, setCategories } = setters;
  if (snapshot.itemTypes && setItemTypes) setItemTypes(snapshot.itemTypes);
  if (snapshot.places && setPlaces) setPlaces(snapshot.places);
  if (snapshot.workItems && setWorkItems) setWorkItems(snapshot.workItems);
  if (snapshot.programming && setProgramming) setProgramming(snapshot.programming);
  if (snapshot.categories && setCategories) setCategories(snapshot.categories);
};

export default useUndoRedo;
