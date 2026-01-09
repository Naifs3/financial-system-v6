// ╔═══════════════════════════════════════════════════════════════════════════════════╗
// ║                            التخزين المحلي - LocalStorage                          ║
// ╚═══════════════════════════════════════════════════════════════════════════════════╝

import { STORAGE_KEYS } from './ColorsAndConstants';
import { 
  defaultItemTypes, 
  defaultPlaces, 
  defaultWorkItems, 
  defaultProgramming 
} from './States';

// ═══════════════════════════════════════════════════════════════════════════════════
// 💾 دوال الحفظ
// ═══════════════════════════════════════════════════════════════════════════════════

// حفظ أنواع المساحة
export const saveItemTypes = (itemTypes) => {
  try {
    localStorage.setItem(STORAGE_KEYS.itemTypes, JSON.stringify(itemTypes));
    return true;
  } catch (error) {
    console.error('خطأ في حفظ أنواع المساحة:', error);
    return false;
  }
};

// حفظ الأماكن
export const savePlaces = (places) => {
  try {
    localStorage.setItem(STORAGE_KEYS.places, JSON.stringify(places));
    return true;
  } catch (error) {
    console.error('خطأ في حفظ الأماكن:', error);
    return false;
  }
};

// حفظ بنود العمل
export const saveWorkItems = (workItems) => {
  try {
    localStorage.setItem(STORAGE_KEYS.workItems, JSON.stringify(workItems));
    return true;
  } catch (error) {
    console.error('خطأ في حفظ بنود العمل:', error);
    return false;
  }
};

// حفظ البرمجة
export const saveProgramming = (programming) => {
  try {
    localStorage.setItem(STORAGE_KEYS.programming, JSON.stringify(programming));
    return true;
  } catch (error) {
    console.error('خطأ في حفظ البرمجة:', error);
    return false;
  }
};

// حفظ الفئات (الحاسبة)
export const saveCategories = (categories) => {
  try {
    localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(categories));
    return true;
  } catch (error) {
    console.error('خطأ في حفظ الفئات:', error);
    return false;
  }
};

// حفظ كل البيانات دفعة واحدة
export const saveAllData = (data) => {
  const { itemTypes, places, workItems, programming, categories } = data;
  
  let success = true;
  
  if (itemTypes) success = saveItemTypes(itemTypes) && success;
  if (places) success = savePlaces(places) && success;
  if (workItems) success = saveWorkItems(workItems) && success;
  if (programming) success = saveProgramming(programming) && success;
  if (categories) success = saveCategories(categories) && success;
  
  return success;
};

// ═══════════════════════════════════════════════════════════════════════════════════
// 📂 دوال الاسترجاع
// ═══════════════════════════════════════════════════════════════════════════════════

// استرجاع أنواع المساحة
export const loadItemTypes = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.itemTypes);
    if (stored) {
      const parsed = JSON.parse(stored);
      // دمج مع الافتراضي للتأكد من وجود جميع الحقول
      return { ...defaultItemTypes, ...parsed };
    }
    return defaultItemTypes;
  } catch (error) {
    console.error('خطأ في استرجاع أنواع المساحة:', error);
    return defaultItemTypes;
  }
};

// استرجاع الأماكن
export const loadPlaces = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.places);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultPlaces, ...parsed };
    }
    return defaultPlaces;
  } catch (error) {
    console.error('خطأ في استرجاع الأماكن:', error);
    return defaultPlaces;
  }
};

// استرجاع بنود العمل
export const loadWorkItems = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.workItems);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultWorkItems, ...parsed };
    }
    return defaultWorkItems;
  } catch (error) {
    console.error('خطأ في استرجاع بنود العمل:', error);
    return defaultWorkItems;
  }
};

// استرجاع البرمجة
export const loadProgramming = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.programming);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultProgramming, ...parsed };
    }
    return defaultProgramming;
  } catch (error) {
    console.error('خطأ في استرجاع البرمجة:', error);
    return defaultProgramming;
  }
};

// استرجاع الفئات
export const loadCategories = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.categories);
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  } catch (error) {
    console.error('خطأ في استرجاع الفئات:', error);
    return [];
  }
};

// استرجاع كل البيانات
export const loadAllData = () => {
  return {
    itemTypes: loadItemTypes(),
    places: loadPlaces(),
    workItems: loadWorkItems(),
    programming: loadProgramming(),
    categories: loadCategories()
  };
};

// ═══════════════════════════════════════════════════════════════════════════════════
// 🗑️ دوال الحذف
// ═══════════════════════════════════════════════════════════════════════════════════

// حذف أنواع المساحة
export const clearItemTypes = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.itemTypes);
    return true;
  } catch (error) {
    console.error('خطأ في حذف أنواع المساحة:', error);
    return false;
  }
};

// حذف الأماكن
export const clearPlaces = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.places);
    return true;
  } catch (error) {
    console.error('خطأ في حذف الأماكن:', error);
    return false;
  }
};

// حذف بنود العمل
export const clearWorkItems = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.workItems);
    return true;
  } catch (error) {
    console.error('خطأ في حذف بنود العمل:', error);
    return false;
  }
};

// حذف البرمجة
export const clearProgramming = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.programming);
    return true;
  } catch (error) {
    console.error('خطأ في حذف البرمجة:', error);
    return false;
  }
};

// حذف الفئات
export const clearCategories = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.categories);
    return true;
  } catch (error) {
    console.error('خطأ في حذف الفئات:', error);
    return false;
  }
};

// حذف كل البيانات
export const clearAllData = () => {
  let success = true;
  
  success = clearItemTypes() && success;
  success = clearPlaces() && success;
  success = clearWorkItems() && success;
  success = clearProgramming() && success;
  success = clearCategories() && success;
  
  return success;
};

// ═══════════════════════════════════════════════════════════════════════════════════
// 🔄 إعادة التعيين للافتراضي
// ═══════════════════════════════════════════════════════════════════════════════════

// إعادة تعيين أنواع المساحة
export const resetItemTypes = () => {
  return saveItemTypes(defaultItemTypes);
};

// إعادة تعيين الأماكن
export const resetPlaces = () => {
  return savePlaces(defaultPlaces);
};

// إعادة تعيين بنود العمل
export const resetWorkItems = () => {
  return saveWorkItems(defaultWorkItems);
};

// إعادة تعيين البرمجة
export const resetProgramming = () => {
  return saveProgramming(defaultProgramming);
};

// إعادة تعيين كل البيانات
export const resetAllData = () => {
  let success = true;
  
  success = resetItemTypes() && success;
  success = resetPlaces() && success;
  success = resetWorkItems() && success;
  success = resetProgramming() && success;
  success = clearCategories() && success;
  
  return success;
};

// ═══════════════════════════════════════════════════════════════════════════════════
// 📊 دوال مساعدة
// ═══════════════════════════════════════════════════════════════════════════════════

// التحقق من وجود بيانات محفوظة
export const hasStoredData = () => {
  return !!(
    localStorage.getItem(STORAGE_KEYS.itemTypes) ||
    localStorage.getItem(STORAGE_KEYS.places) ||
    localStorage.getItem(STORAGE_KEYS.workItems) ||
    localStorage.getItem(STORAGE_KEYS.programming) ||
    localStorage.getItem(STORAGE_KEYS.categories)
  );
};

// الحصول على حجم البيانات المحفوظة (بالكيلوبايت)
export const getStorageSize = () => {
  let totalSize = 0;
  
  Object.values(STORAGE_KEYS).forEach(key => {
    const item = localStorage.getItem(key);
    if (item) {
      totalSize += item.length * 2; // UTF-16
    }
  });
  
  return (totalSize / 1024).toFixed(2); // KB
};

// تصدير البيانات كـ JSON
export const exportData = () => {
  const data = loadAllData();
  return JSON.stringify(data, null, 2);
};

// استيراد البيانات من JSON
export const importData = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    return saveAllData(data);
  } catch (error) {
    console.error('خطأ في استيراد البيانات:', error);
    return false;
  }
};
