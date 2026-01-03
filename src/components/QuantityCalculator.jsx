import React, { useState } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════════
// التصميم المدمج الكامل
// الخارج: الفئات (أيقونات صلب عصري + شريط ملون - النموذج 4)
// الداخل: كل تفاصيل SummaryDesignExample كاملة
// ═══════════════════════════════════════════════════════════════════════════════════
// 📏 القياسات الموحدة (ثابتة):
//    - ارتفاع الأزرار والقوائم المنسدلة: 30px
//    - حجم الخط: 12px
//    - padding الأفقي: 12px
//    - borderRadius: 8px
// ═══════════════════════════════════════════════════════════════════════════════════

const FullCombinedDesign = () => {
  // ═══════════════════════════════════════════════════════════════════════════════════
  // الألوان
  // ═══════════════════════════════════════════════════════════════════════════════════
  const colors = {
    primary: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    purple: '#8b5cf6',
    cyan: '#06b6d4',
    orange: '#f97316',
    pink: '#ec4899',
    indigo: '#6366f1',
    bg: '#1a1a2e',
    card: '#16213e',
    border: '#2a3f5f',
    text: '#e2e8f0',
    muted: '#94a3b8'
  };

  // ═══════════════════════════════════════════════════════════════════════════════════
  // أيقونات صلب عصري (Solido Moderno) - النموذج 5
  // ═══════════════════════════════════════════════════════════════════════════════════
  const getIcon = (code, color, size = 28) => {
    const icons = {
      BLT: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="8" height="8" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.2"/>
          <rect x="13" y="3" width="8" height="8" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.2"/>
          <rect x="3" y="13" width="8" height="8" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.2"/>
          <rect x="13" y="13" width="8" height="8" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.2"/>
        </svg>
      ),
      DHN: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="5" y="3" width="14" height="6" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.2"/>
          <path d="M11 9h2v4h-2V9z" fill={color}/>
          <rect x="8" y="13" width="8" height="9" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.2"/>
        </svg>
      ),
      SBK: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M12 4c-4 4-5 7-5 9a5 5 0 0010 0c0-2-1-5-5-9z" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.2"/>
          <circle cx="12" cy="15" r="2" fill={color} fillOpacity="0.3"/>
        </svg>
      ),
      KHR: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M13 3L5 12h5l-1 9 10-10h-5l1-8z" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.2"/>
        </svg>
      ),
      NJR: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="5" y="3" width="14" height="18" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.2"/>
          <rect x="9" y="14" width="6" height="7" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.2"/>
          <circle cx="14.5" cy="11" r="1.2" fill={color}/>
        </svg>
      ),
      TKF: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="4" y="6" width="16" height="10" rx="2" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.2"/>
          <line x1="8" y1="16" x2="8" y2="19" stroke={color} strokeWidth="1.2"/>
          <line x1="16" y1="16" x2="16" y2="19" stroke={color} strokeWidth="1.2"/>
          <path d="M7 10h2M15 10h2" stroke={color} strokeWidth="1.5"/>
        </svg>
      ),
      JBS: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="4" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.2"/>
          <rect x="5" y="8" width="14" height="3" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.2"/>
          <path d="M7 11v6M12 11v8M17 11v6" stroke={color} strokeWidth="1.2"/>
        </svg>
      ),
      ALM: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="4" y="4" width="16" height="16" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="1.2"/>
          <line x1="12" y1="4" x2="12" y2="20" stroke={color} strokeWidth="1.2"/>
          <line x1="4" y1="12" x2="20" y2="12" stroke={color} strokeWidth="1.2"/>
          <rect x="6" y="6" width="4" height="4" fill={color} fillOpacity="0.2"/>
          <rect x="14" y="14" width="4" height="4" fill={color} fillOpacity="0.2"/>
        </svg>
      ),
      HDD: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="4" y="3" width="16" height="18" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="1.2"/>
          <line x1="4" y1="8" x2="20" y2="8" stroke={color} strokeWidth="1.2"/>
          <line x1="4" y1="13" x2="20" y2="13" stroke={color} strokeWidth="1.2"/>
          <line x1="4" y1="18" x2="20" y2="18" stroke={color} strokeWidth="1.2"/>
          <line x1="8" y1="3" x2="8" y2="21" stroke={color} strokeWidth="1.2"/>
          <line x1="16" y1="3" x2="16" y2="21" stroke={color} strokeWidth="1.2"/>
        </svg>
      ),
      TNZ: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M8 3h3v7H8z" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.2"/>
          <circle cx="9.5" cy="3" r="1.5" fill={color}/>
          <path d="M7 10c-2 0-3 1-3 3v6a2 2 0 002 2h7a2 2 0 002-2v-6c0-2-1-3-3-3" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.2"/>
          <path d="M17 8l2-2M19 6l-4 4" stroke={color} strokeWidth="1.5"/>
        </svg>
      ),
    };
    return icons[code] || icons.BLT;
  };

  // ═══════════════════════════════════════════════════════════════════════════════════
  // قائمة الأماكن المتاحة
  // ═══════════════════════════════════════════════════════════════════════════════════
  const placesList = ['صالة', 'مطبخ', 'دورة مياه', 'غرفة نوم', 'ممر', 'حوش', 'مجلس', 'غرفة معيشة', 'مدخل'];

  // ═══════════════════════════════════════════════════════════════════════════════════
  // قائمة الشروط المعرّفة مسبقاً
  // ═══════════════════════════════════════════════════════════════════════════════════
  const predefinedConditions = [
    'غير شامل الفك أو الإزالة',
    'غير شامل نقل الركام',
    'غير شامل المواد',
    'غير شامل الحاوية',
    'غير شامل التنظيف',
    'غير شامل التمديدات',
    'السعر لا يشمل ضريبة القيمة المضافة',
    'المدة المتوقعة للتنفيذ 7 أيام',
    'يتطلب معاينة قبل البدء',
    'العميل مسؤول عن توفير المواد',
    'الأسعار قابلة للتغيير حسب الكميات',
  ];

  // ═══════════════════════════════════════════════════════════════════════════════════
  // المرحلة الأولى - قائمة الأماكن والبنود الرئيسية
  // ═══════════════════════════════════════════════════════════════════════════════════
  const placesByType = {
    dry: { label: 'جاف', icon: '🏠', places: ['صالة', 'غرفة نوم', 'غرفة معيشة', 'مجلس', 'ممر', 'مدخل'] },
    wet: { label: 'رطب', icon: '💧', places: ['مطبخ', 'دورة مياه', 'مغسلة'] },
    outdoor: { label: 'خارجي', icon: '🌳', places: ['حوش', 'سطح', 'بلكونة', 'موقف سيارات'] }
  };

  const mainItemsConfig = [
    { id: 'tiles', name: 'بلاط', icon: '🔲', color: '#3b82f6', categoryCode: 'BLT' },
    { id: 'paint', name: 'دهان', icon: '🎨', color: '#8b5cf6', categoryCode: 'DHN' },
    { id: 'plumbing', name: 'سباكة', icon: '🚿', color: '#06b6d4', categoryCode: 'SBK' },
    { id: 'electric', name: 'كهرباء', icon: '⚡', color: '#ef4444', categoryCode: 'KHR' },
    { id: 'gypsum', name: 'جبس', icon: '🏗️', color: '#f59e0b', categoryCode: 'JBS' },
  ];

  // ═══════════════════════════════════════════════════════════════════════════════════
  // بيانات الفئات
  // ═══════════════════════════════════════════════════════════════════════════════════
  const [categories, setCategories] = useState([
    {
      id: 'cat1',
      code: 'BLT',
      name: 'بلاط',
      color: colors.primary,
      subItems: [
        { code: 'TF01', name: 'تركيب بلاط أرضيات (أكبر من 120سم)', price: 33, group: 'تبليط', type: 'floor' },
        { code: 'TF02', name: 'تركيب بلاط أرضيات (أصغر من 120سم)', price: 25, group: 'تبليط', type: 'floor' },
        { code: 'TF03', name: 'تركيب بلاط جدران', price: 40, group: 'تبليط', type: 'wall' },
        { code: 'RB01', name: 'إزالة بلاط (كمية متوسطة)', price: 13, group: 'إزالة', type: 'floor' },
        { code: 'RB02', name: 'إزالة بلاط (كمية كبيرة)', price: 10, group: 'إزالة', type: 'floor' },
      ],
      items: [],
      pendingPlaces: [],
      needsSubItemSelection: false,
      categoryConditions: [],
      options: {
        containerState: 'notMentioned',
        containerAmount: 0,
        materialsState: 'notMentioned',
        materialsAmount: 0,
        showMeters: true,
        sumMeters: true,
        showPrice: false,
        customAmount: 0,
        profitPercent: 10,
        discountPercent: 0,
        discountAmount: 0,
        taxPercent: 15,
        totalsContainerAmount: 0
      }
    },
    {
      id: 'cat2',
      code: 'DHN',
      name: 'دهان',
      color: colors.purple,
      subItems: [
        { code: 'PT01', name: 'دهان جدران داخلية (وجهين)', price: 12, group: 'دهان', type: 'wall' },
        { code: 'PT02', name: 'دهان جدران خارجية', price: 15, group: 'دهان', type: 'wall' },
        { code: 'PT03', name: 'دهان أسقف', price: 10, group: 'دهان', type: 'ceiling' },
        { code: 'PT04', name: 'معجون وتجهيز', price: 8, group: 'تجهيز', type: 'wall' },
      ],
      items: [],
      pendingPlaces: [],
      needsSubItemSelection: false,
      categoryConditions: [],
      options: {
        containerState: 'notMentioned',
        containerAmount: 0,
        materialsState: 'notMentioned',
        materialsAmount: 0,
        showMeters: true,
        sumMeters: true,
        showPrice: false,
        customAmount: 0,
        profitPercent: 10,
        discountPercent: 0,
        discountAmount: 0,
        taxPercent: 15,
        totalsContainerAmount: 0
      }
    },
    {
      id: 'cat3',
      code: 'SBK',
      name: 'سباكة',
      color: colors.cyan,
      subItems: [
        { code: 'PL01', name: 'تمديد نقاط مياه', price: 150, group: 'تمديدات', type: 'point' },
        { code: 'PL02', name: 'تركيب خلاط', price: 80, group: 'تركيب', type: 'unit' },
        { code: 'PL03', name: 'تركيب مغسلة', price: 120, group: 'تركيب', type: 'unit' },
        { code: 'PL04', name: 'تركيب كرسي أفرنجي', price: 200, group: 'تركيب', type: 'unit' },
      ],
      items: [],
      pendingPlaces: [],
      needsSubItemSelection: false,
      categoryConditions: [],
      options: {
        containerState: 'notMentioned',
        containerAmount: 0,
        materialsState: 'notMentioned',
        materialsAmount: 0,
        showMeters: false,
        sumMeters: false,
        showPrice: false,
        customAmount: 0,
        profitPercent: 15,
        discountPercent: 0,
        discountAmount: 0,
        taxPercent: 15,
        totalsContainerAmount: 0
      }
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════════════
  // الحالات (States)
  // ═══════════════════════════════════════════════════════════════════════════════════
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);
  const [newConditionText, setNewConditionText] = useState('');
  const [addingConditionForItem, setAddingConditionForItem] = useState(null);
  const [newCategoryConditionText, setNewCategoryConditionText] = useState('');
  const [addingCategoryCondition, setAddingCategoryCondition] = useState(null);
  const [editingSummary, setEditingSummary] = useState(null);
  const [customSummary, setCustomSummary] = useState({});
  const [expandedConditions, setExpandedConditions] = useState({}); // للتحكم في طي/فتح الشروط
  const [expandedPriceSummary, setExpandedPriceSummary] = useState({}); // للتحكم في طي/فتح ملخص السعر

  // حالات المرحلة الأولى
  const [phase1Expanded, setPhase1Expanded] = useState(true);
  const [selectedType, setSelectedType] = useState('dry');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [dimensions, setDimensions] = useState({ length: 4, width: 4, height: 3 });
  const [activeMainItems, setActiveMainItems] = useState({ 
    tiles: true, paint: true, plumbing: false, electric: false, gypsum: false 
  });

  const dimensionOptions = Array.from({ length: 20 }, (_, i) => i + 1);
  const heightOptions = [2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6];

  // ═══════════════════════════════════════════════════════════════════════════════════
  // دالة المرحلة الأولى: إضافة مكان لجميع الفئات المفعّلة
  // ═══════════════════════════════════════════════════════════════════════════════════
  const addPlaceToActiveCategories = () => {
    if (!selectedPlace) return;
    
    const newPlace = {
      id: 'p' + Date.now(),
      name: selectedPlace,
      length: dimensions.length,
      width: dimensions.width,
      height: dimensions.height,
      area: dimensions.length * dimensions.width
    };

    const activeCategoryCodes = mainItemsConfig
      .filter(item => activeMainItems[item.id])
      .map(item => item.categoryCode);

    setCategories(prev => {
      // إضافة الفئات الجديدة إذا لم تكن موجودة
      let updated = [...prev];
      
      activeCategoryCodes.forEach(code => {
        const exists = updated.find(cat => cat.code === code);
        if (!exists) {
          // إنشاء فئة جديدة فارغة مع المكان المعلق
          const template = getCategoryTemplate(code);
          if (template) {
            updated.push({
              ...template,
              id: 'cat' + Date.now() + code,
              pendingPlaces: [{ ...newPlace, id: 'p' + Date.now() + code }],
              needsSubItemSelection: true
            });
          }
        } else {
          // إضافة المكان للفئة الموجودة
          updated = updated.map(cat => {
            if (cat.code !== code) return cat;
            
            // إذا لم يكن هناك بنود، أضف للأماكن المعلقة
            if (cat.items.length === 0) {
              return {
                ...cat,
                pendingPlaces: [...(cat.pendingPlaces || []), { ...newPlace, id: 'p' + Date.now() + code }],
                needsSubItemSelection: true
              };
            }
            
            // إذا كان هناك بنود، أضف للبند الأول
            return {
              ...cat,
              items: cat.items.map((item, idx) => {
                if (idx === 0) {
                  return { ...item, places: [...item.places, { ...newPlace, id: 'p' + Date.now() + idx }] };
                }
                return item;
              })
            };
          });
        }
      });
      
      return updated;
    });

    setSelectedPlace('');
  };

  // قالب الفئات الجديدة
  const getCategoryTemplate = (code) => {
    const templates = {
      BLT: {
        code: 'BLT',
        name: 'بلاط',
        color: colors.primary,
        subItems: [
          { code: 'TF01', name: 'تركيب بلاط أرضيات (أكبر من 120سم)', price: 33, group: 'تبليط', type: 'floor' },
          { code: 'TF02', name: 'تركيب بلاط أرضيات (أصغر من 120سم)', price: 25, group: 'تبليط', type: 'floor' },
          { code: 'TF03', name: 'تركيب بلاط جدران', price: 40, group: 'تبليط', type: 'wall' },
        ],
        items: [],
        pendingPlaces: [],
        needsSubItemSelection: false,
        categoryConditions: [],
        options: { containerState: 'notMentioned', containerAmount: 0, materialsState: 'notMentioned', materialsAmount: 0, showMeters: true, profitPercent: 10, taxPercent: 15 }
      },
      DHN: {
        code: 'DHN',
        name: 'دهان',
        color: colors.purple,
        subItems: [
          { code: 'PT01', name: 'دهان جدران داخلية (وجهين)', price: 12, group: 'دهان', type: 'wall' },
          { code: 'PT02', name: 'دهان جدران خارجية', price: 15, group: 'دهان', type: 'wall' },
          { code: 'PT03', name: 'دهان أسقف', price: 10, group: 'دهان', type: 'ceiling' },
        ],
        items: [],
        pendingPlaces: [],
        needsSubItemSelection: false,
        categoryConditions: [],
        options: { containerState: 'notMentioned', containerAmount: 0, materialsState: 'notMentioned', materialsAmount: 0, showMeters: true, profitPercent: 10, taxPercent: 15 }
      },
      SBK: {
        code: 'SBK',
        name: 'سباكة',
        color: colors.cyan,
        subItems: [
          { code: 'PL01', name: 'تمديد نقاط مياه', price: 150, group: 'تمديدات', type: 'point' },
          { code: 'PL02', name: 'تركيب خلاط', price: 80, group: 'تركيب', type: 'unit' },
        ],
        items: [],
        pendingPlaces: [],
        needsSubItemSelection: false,
        categoryConditions: [],
        options: { containerState: 'notMentioned', containerAmount: 0, materialsState: 'notMentioned', materialsAmount: 0, showMeters: false, profitPercent: 15, taxPercent: 15 }
      },
      KHR: {
        code: 'KHR',
        name: 'كهرباء',
        color: colors.danger,
        subItems: [
          { code: 'EL01', name: 'تمديد نقاط كهرباء', price: 120, group: 'تمديدات', type: 'point' },
          { code: 'EL02', name: 'تركيب لوحة كهرباء', price: 500, group: 'تركيب', type: 'unit' },
        ],
        items: [],
        pendingPlaces: [],
        needsSubItemSelection: false,
        categoryConditions: [],
        options: { containerState: 'notMentioned', containerAmount: 0, materialsState: 'notMentioned', materialsAmount: 0, showMeters: false, profitPercent: 15, taxPercent: 15 }
      },
      JBS: {
        code: 'JBS',
        name: 'جبس',
        color: colors.warning,
        subItems: [
          { code: 'GY01', name: 'تركيب جبس أسقف', price: 45, group: 'جبس', type: 'ceiling' },
          { code: 'GY02', name: 'تركيب جبس جدران', price: 35, group: 'جبس', type: 'wall' },
        ],
        items: [],
        pendingPlaces: [],
        needsSubItemSelection: false,
        categoryConditions: [],
        options: { containerState: 'notMentioned', containerAmount: 0, materialsState: 'notMentioned', materialsAmount: 0, showMeters: true, profitPercent: 10, taxPercent: 15 }
      }
    };
    return templates[code];
  };

  // تحويل نوع البند للعربية
  const getTypeLabel = (type) => {
    const types = {
      floor: '🏠 أرضية',
      wall: '🧱 جدران',
      ceiling: '⬆️ سقف',
      point: '📍 نقطة',
      unit: '📦 وحدة'
    };
    return types[type] || '';
  };

  // ═══════════════════════════════════════════════════════════════════════════════════
  // الدوال المساعدة
  // ═══════════════════════════════════════════════════════════════════════════════════
  
  // تنسيق الأرقام برقمين عشريين
  const formatNumber = (num) => {
    const fixed = num.toFixed(2);
    if (fixed.endsWith('.00')) {
      return num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // حساب مساحة البند
  const getItemArea = (item) => item.places.reduce((sum, p) => sum + p.area, 0);

  // حساب إجمالي مساحة الفئة
  const getCategoryTotalArea = (cat) => cat.items.reduce((sum, item) => sum + getItemArea(item), 0);

  // حساب إجمالي سعر البنود
  const getCategoryItemsTotal = (cat) => cat.items.reduce((sum, item) => sum + getItemArea(item) * item.price, 0);

  // تجميع المساحات حسب المجموعة
  const getGroupedAreas = (cat) => {
    return cat.items.reduce((acc, item) => {
      acc[item.group] = (acc[item.group] || 0) + getItemArea(item);
      return acc;
    }, {});
  };

  // حساب الإجمالي النهائي للفئة
  const calculateCategoryTotals = (cat) => {
    const totalPrice = getCategoryItemsTotal(cat);
    const containerValue = cat.options.containerState === 'with' ? (cat.options.totalsContainerAmount || 0) : 0;
    const materialsValue = cat.options.materialsState === 'with' ? (cat.options.materialsAmount || 0) : 0;
    const baseTotal = totalPrice + containerValue + materialsValue + (cat.options.customAmount || 0);
    const profitAmount = baseTotal * (cat.options.profitPercent || 0) / 100;
    const withProfit = baseTotal + profitAmount;
    const discountByPercent = withProfit * (cat.options.discountPercent || 0) / 100;
    const discountByAmount = cat.options.discountAmount || 0;
    const totalDiscount = discountByPercent + discountByAmount;
    const afterDiscount = withProfit - totalDiscount;
    const taxAmount = afterDiscount * (cat.options.taxPercent || 0) / 100;
    const finalTotal = afterDiscount + taxAmount;

    return {
      totalPrice,
      containerValue,
      materialsValue,
      baseTotal,
      profitAmount,
      withProfit,
      discountByPercent,
      discountByAmount,
      totalDiscount,
      afterDiscount,
      taxAmount,
      finalTotal
    };
  };

  // الإجمالي الكلي لجميع الفئات
  const getGrandTotal = () => categories.reduce((sum, cat) => sum + calculateCategoryTotals(cat).finalTotal, 0);

  // التحقق من اختلاف سعر الحاوية
  const isContainerPriceDifferent = (cat) => cat.options.containerAmount !== cat.options.totalsContainerAmount;

  // ═══════════════════════════════════════════════════════════════════════════════════
  // دوال التحديث
  // ═══════════════════════════════════════════════════════════════════════════════════

  // تحديث خيارات الفئة
  const updateCategoryOptions = (catId, field, value) => {
    setCategories(prev => prev.map(cat => 
      cat.id === catId ? { ...cat, options: { ...cat.options, [field]: value } } : cat
    ));
  };

  // تحديث بند
  const updateItem = (catId, itemId, field, value) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        items: cat.items.map(item => 
          item.id === itemId ? { ...item, [field]: field === 'price' ? parseFloat(value) || 0 : value } : item
        )
      };
    }));
  };

  // تغيير البند الفرعي
  const changeSubItem = (catId, itemId, newCode) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      const subItem = cat.subItems.find(s => s.code === newCode);
      if (!subItem) return cat;
      return {
        ...cat,
        items: cat.items.map(item => 
          item.id === itemId ? { ...item, code: subItem.code, name: subItem.name, price: subItem.price, group: subItem.group } : item
        )
      };
    }));
  };

  // تحديث مكان
  const updatePlace = (catId, itemId, placeId, field, value) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        items: cat.items.map(item => {
          if (item.id !== itemId) return item;
          return {
            ...item,
            places: item.places.map(place => {
              if (place.id !== placeId) return place;
              const updated = { ...place, [field]: field === 'name' ? value : parseFloat(value) || 0 };
              
              if (field === 'manualArea') {
                updated.area = parseFloat(value) || 0;
                updated.manualArea = parseFloat(value) || 0;
              } else if (field === 'length' || field === 'width') {
                updated.area = updated.length * updated.width;
                delete updated.manualArea;
              }
              return updated;
            })
          };
        })
      };
    }));
  };

  // إضافة مكان
  const addPlace = (catId, itemId) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        items: cat.items.map(item => {
          if (item.id !== itemId) return item;
          return {
            ...item,
            places: [...item.places, { id: 'p' + Date.now(), name: 'صالة', length: 4, width: 4, height: 3, area: 16 }]
          };
        })
      };
    }));
  };

  // حذف مكان
  const deletePlace = (catId, itemId, placeId) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        items: cat.items.map(item => {
          if (item.id !== itemId) return item;
          return { ...item, places: item.places.filter(p => p.id !== placeId) };
        })
      };
    }));
  };

  // إضافة بند
  const addItem = (catId) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      const defaultSubItem = cat.subItems[0];
      const newItem = {
        id: Date.now(),
        code: defaultSubItem.code,
        name: defaultSubItem.name,
        price: defaultSubItem.price,
        group: defaultSubItem.group,
        places: [{ id: 'p' + Date.now(), name: 'صالة', length: 4, width: 4, height: 3, area: 16 }],
        conditions: []
      };
      return { ...cat, items: [...cat.items, newItem] };
    }));
  };

  // حذف بند
  const deleteItem = (catId, itemId) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return { ...cat, items: cat.items.filter(item => item.id !== itemId) };
    }));
    setEditingItemId(null);
  };

  // إضافة شرط للبند
  const addCondition = (catId, itemId, conditionText) => {
    if (!conditionText.trim()) return;
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        items: cat.items.map(item => {
          if (item.id !== itemId) return item;
          if (item.conditions.includes(conditionText.trim())) return item;
          return { ...item, conditions: [...item.conditions, conditionText.trim()] };
        })
      };
    }));
    setNewConditionText('');
    setAddingConditionForItem(null);
  };

  // حذف شرط من البند
  const deleteCondition = (catId, itemId, conditionIndex) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        items: cat.items.map(item => {
          if (item.id !== itemId) return item;
          return { ...item, conditions: item.conditions.filter((_, idx) => idx !== conditionIndex) };
        })
      };
    }));
  };

  // إضافة شرط للفئة
  const addCategoryCondition = (catId, conditionText) => {
    if (!conditionText.trim()) return;
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      if (cat.categoryConditions.includes(conditionText.trim())) return cat;
      return { ...cat, categoryConditions: [...cat.categoryConditions, conditionText.trim()] };
    }));
    setNewCategoryConditionText('');
    setAddingCategoryCondition(null);
  };

  // حذف شرط من الفئة
  const deleteCategoryCondition = (catId, conditionIndex) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return { ...cat, categoryConditions: cat.categoryConditions.filter((_, idx) => idx !== conditionIndex) };
    }));
  };

  // ═══════════════════════════════════════════════════════════════════════════════════
  // العرض (Render)
  // ═══════════════════════════════════════════════════════════════════════════════════
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: colors.bg, 
      padding: 20, 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      direction: 'rtl'
    }}>
      <style>{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type="number"] { -moz-appearance: textfield; }
        input:focus, select:focus, textarea:focus { outline: none; }
        * { box-sizing: border-box; }
      `}</style>
      
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        
        {/* ═══════════════════════════════════════════════════════════════════════════ */}
        {/* العنوان الرئيسي */}
        {/* ═══════════════════════════════════════════════════════════════════════════ */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: 24,
          padding: '20px 24px',
          background: colors.card,
          borderRadius: 16,
          border: `1px solid ${colors.border}`
        }}>
          <h2 style={{ color: colors.text, margin: 0, fontSize: 20, marginBottom: 8 }}>
            📋 عرض الأسعار - التصميم المدمج النهائي
          </h2>
          <p style={{ color: colors.muted, margin: 0, fontSize: 12 }}>
            اضغط على الفئة للتوسيع • اضغط على البند للتحرير • كل شيء في مكان واحد
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════════ */}
        {/* تسمية قسم إدخال البيانات */}
        {/* ═══════════════════════════════════════════════════════════════════════════ */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 12, 
          margin: '0 0 16px 0',
          padding: '0 8px'
        }}>
          <div style={{ 
            width: 32, height: 32, 
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.cyan})`,
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16
          }}>📐</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: colors.text }}>إدخال البيانات</div>
            <div style={{ fontSize: 11, color: colors.muted }}>اختر المكان والأبعاد ثم أضف للفئات</div>
          </div>
          <div style={{ flex: 1, height: 1, background: colors.border, marginRight: 12 }}></div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════════ */}
        {/* المرحلة الأولى - إدخال البيانات المساحية */}
        {/* ═══════════════════════════════════════════════════════════════════════════ */}
        <div style={{ 
          background: colors.card, 
          borderRadius: 12, 
          border: phase1Expanded ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`, 
          overflow: 'hidden', 
          marginBottom: 16 
        }}>
          {/* رأس المرحلة الأولى */}
          <div 
            onClick={() => setPhase1Expanded(!phase1Expanded)} 
            style={{ 
              display: 'flex', alignItems: 'center', cursor: 'pointer', padding: 16, 
              background: phase1Expanded ? `${colors.primary}10` : 'transparent' 
            }}
          >
            <div style={{ 
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.cyan})`, 
              padding: '12px 16px', borderRadius: 8, marginLeft: 12 
            }}>
              <span style={{ fontSize: 24 }}>📐</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: colors.text }}>المرحلة الأولى - إدخال البيانات</div>
              <div style={{ fontSize: 11, color: colors.muted }}>
                🏗️ {Object.values(activeMainItems).filter(v => v).length} بنود مفعّلة
              </div>
            </div>
            <span style={{ 
              fontSize: 16, color: colors.primary, 
              transform: phase1Expanded ? 'rotate(180deg)' : 'rotate(0deg)', 
              transition: 'transform 0.3s' 
            }}>▼</span>
          </div>

          {/* محتوى المرحلة الأولى */}
          {phase1Expanded && (
            <div style={{ padding: 16, borderTop: `1px dashed ${colors.primary}40` }}>
              
              {/* اختيار النوع والمكان */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <select 
                  value={selectedType} 
                  onChange={(e) => { setSelectedType(e.target.value); setSelectedPlace(''); }}
                  style={{ 
                    flex: 1, height: 40, borderRadius: 8, 
                    border: `1px solid ${colors.border}`, 
                    background: colors.bg, color: colors.text, 
                    fontSize: 14, padding: '0 12px' 
                  }}
                >
                  {Object.entries(placesByType).map(([key, val]) => (
                    <option key={key} value={key}>{val.icon} {val.label}</option>
                  ))}
                </select>
                <select 
                  value={selectedPlace} 
                  onChange={(e) => setSelectedPlace(e.target.value)}
                  style={{ 
                    flex: 2, height: 40, borderRadius: 8, 
                    border: `1px solid ${colors.border}`, 
                    background: colors.bg, color: colors.text, 
                    fontSize: 14, padding: '0 12px' 
                  }}
                >
                  <option value="">-- اختر المكان --</option>
                  {placesByType[selectedType].places.map(place => (
                    <option key={place} value={place}>{place}</option>
                  ))}
                </select>
              </div>

              {/* البنود الرئيسية */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
                {mainItemsConfig.map(item => (
                  <button 
                    key={item.id} 
                    onClick={() => setActiveMainItems(prev => ({ ...prev, [item.id]: !prev[item.id] }))} 
                    style={{ 
                      height: 32, padding: '0 10px', borderRadius: 6, 
                      border: `1px solid ${activeMainItems[item.id] ? item.color : colors.border}`, 
                      background: activeMainItems[item.id] ? `${item.color}20` : 'transparent', 
                      color: activeMainItems[item.id] ? item.color : colors.muted, 
                      fontSize: 11, fontWeight: 600, cursor: 'pointer', 
                      display: 'flex', alignItems: 'center', gap: 4 
                    }}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>

              {/* الأبعاد */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                {[{ key: 'length', label: 'الطول' }, { key: 'width', label: 'العرض' }, { key: 'height', label: 'الارتفاع' }].map(dim => (
                  <div key={dim.key} style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: colors.muted, marginBottom: 4, textAlign: 'center' }}>{dim.label}</div>
                    <select 
                      value={dimensions[dim.key]} 
                      onChange={(e) => setDimensions({ ...dimensions, [dim.key]: parseFloat(e.target.value) })} 
                      style={{ 
                        width: '100%', height: 36, borderRadius: 8, 
                        border: `1px solid ${colors.border}`, 
                        background: colors.bg, color: '#fff', 
                        fontSize: 14, textAlign: 'center' 
                      }}
                    >
                      {(dim.key === 'height' ? heightOptions : dimensionOptions).map(n => (
                        <option key={n} value={n}>{n} م</option>
                      ))}
                    </select>
                  </div>
                ))}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: colors.success, marginBottom: 4, textAlign: 'center' }}>المساحة</div>
                  <div style={{ 
                    height: 36, borderRadius: 8, 
                    border: `1px solid ${colors.success}`, 
                    background: `${colors.success}15`, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    color: '#fff', fontSize: 14, fontWeight: 700 
                  }}>
                    {dimensions.length * dimensions.width} م²
                  </div>
                </div>
              </div>

              {/* زر الإضافة */}
              <button 
                onClick={addPlaceToActiveCategories} 
                disabled={!selectedPlace || !Object.values(activeMainItems).some(v => v)} 
                style={{ 
                  width: '100%', height: 60, borderRadius: 8, 
                  border: `1px solid ${colors.success}`, 
                  background: `${colors.success}15`, 
                  color: colors.success, 
                  fontSize: 14, fontWeight: 700, 
                  cursor: (selectedPlace && Object.values(activeMainItems).some(v => v)) ? 'pointer' : 'not-allowed', 
                  opacity: (selectedPlace && Object.values(activeMainItems).some(v => v)) ? 1 : 0.5, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 
                }}
              >
                <span style={{ fontSize: 20, fontWeight: 900 }}>+</span>
                إضافة مكان
              </button>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════════ */}
        {/* تسمية قسم الفئات - تظهر فقط عند وجود فئات بها بنود أو أماكن معلقة */}
        {/* ═══════════════════════════════════════════════════════════════════════════ */}
        {categories.filter(cat => cat.items.length > 0 || (cat.pendingPlaces && cat.pendingPlaces.length > 0)).length > 0 && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 12, 
          margin: '24px 0 16px 0',
          padding: '0 8px'
        }}>
          <div style={{ 
            width: 32, height: 32, 
            background: `linear-gradient(135deg, ${colors.purple}, ${colors.primary})`,
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16
          }}>📦</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: colors.text }}>الفئات والبنود</div>
            <div style={{ fontSize: 11, color: colors.muted }}>اضغط على الفئة للتوسيع والتحرير</div>
          </div>
          <div style={{ flex: 1, height: 1, background: colors.border, marginRight: 12 }}></div>
        </div>
        )}

        {/* رسالة عند عدم وجود فئات مضافة */}
        {categories.filter(cat => cat.items.length > 0 || (cat.pendingPlaces && cat.pendingPlaces.length > 0)).length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: 40, 
            color: colors.muted, 
            fontSize: 14, 
            background: colors.card, 
            borderRadius: 16, 
            border: `1px solid ${colors.border}`,
            marginBottom: 16
          }}>
            <div style={{ fontSize: 50, marginBottom: 16, opacity: 0.3 }}>📦</div>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>لا توجد فئات مضافة</div>
            <div style={{ fontSize: 12 }}>اختر مكان من المرحلة الأولى واضغط "إضافة مكان" لبدء إضافة الفئات</div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════════ */}
        {/* الفئات */}
        {/* ═══════════════════════════════════════════════════════════════════════════ */}
        {categories.filter(cat => cat.items.length > 0 || (cat.pendingPlaces && cat.pendingPlaces.length > 0)).map((cat) => {
          const isExpanded = expandedCategory === cat.id;
          const catTotalArea = getCategoryTotalArea(cat);
          const catTotals = calculateCategoryTotals(cat);
          const groupedAreas = getGroupedAreas(cat);
          
          // جمع جميع الأماكن من جميع البنود بدون دمج (كل مكان منفصل) مع نوع البند
          const allPlaces = [];
          cat.items.forEach(item => {
            item.places.forEach(place => {
              allPlaces.push({
                name: place.name,
                length: place.length,
                width: place.width,
                area: place.area,
                type: item.type || 'floor'
              });
            });
          });
          
          // إضافة الأماكن المعلقة (بدون نوع محدد)
          const pendingPlaces = cat.pendingPlaces || [];

          return (
            <div 
              key={cat.id}
              style={{
                background: colors.card,
                borderRadius: 16,
                overflow: 'hidden',
                marginBottom: 12,
                border: isExpanded ? `2px solid ${cat.color}` : `1px solid ${colors.border}`,
                transition: 'all 0.3s'
              }}
            >
              {/* ─────────────────────────────────────────────────────────────────────── */}
              {/* رأس الفئة (الخارجي) - تصميم النموذج 4 (شريط ملون جانبي) */}
              {/* ─────────────────────────────────────────────────────────────────────── */}
              <div 
                onClick={() => {
                  setExpandedCategory(isExpanded ? null : cat.id);
                  setEditingItemId(null);
                  setAddingConditionForItem(null);
                  setAddingCategoryCondition(null);
                }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'stretch',
                  cursor: 'pointer',
                  background: isExpanded ? `${cat.color}08` : 'transparent'
                }}
              >
                {/* الأيقونة والكود - شريط جانبي */}
                <div style={{
                  display: 'flex',
                  alignItems: 'stretch',
                  borderLeft: `1px solid ${colors.border}`
                }}>
                  {/* الشريط الملون */}
                  <div style={{ width: 4, background: cat.color }}/>
                  
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px 20px',
                    gap: 6
                  }}>
                    {getIcon(cat.code, cat.color, 30)}
                    <span style={{ 
                      fontSize: 10, 
                      fontWeight: 700, 
                      color: cat.color,
                      letterSpacing: '0.5px'
                    }}>
                      {cat.code}
                    </span>
                  </div>
                </div>

                {/* معلومات الفئة */}
                <div style={{ flex: 1, padding: '16px 18px' }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: colors.text, marginBottom: 6 }}>
                    {cat.name}
                  </div>
                  
                  {/* رسالة التحذير مع مثلث أصفر */}
                  {cat.needsSubItemSelection && pendingPlaces.length > 0 && (
                    <div style={{ 
                      background: `${colors.warning}15`, 
                      border: `1px solid ${colors.warning}40`,
                      borderRadius: 6,
                      padding: '6px 10px',
                      marginBottom: 8,
                      fontSize: 11,
                      color: colors.warning,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}>
                      <span style={{ fontSize: 14, color: colors.warning }}>▲</span>
                      <span>هذه الفئة تحتاج إلى اختيار البنود الفرعية ({pendingPlaces.length} مكان معلق)</span>
                    </div>
                  )}
                  
                  {/* عدد البنود والشروط */}
                  <div style={{ display: 'flex', gap: 12, fontSize: 11, color: colors.muted, marginBottom: 8, flexWrap: 'wrap' }}>
                    <span>📦 {cat.items.length} {cat.items.length === 1 ? 'بند' : 'بنود'}</span>
                    {pendingPlaces.length > 0 && (
                      <span style={{ color: colors.warning }}>⏳ {pendingPlaces.length} معلق</span>
                    )}
                    {cat.options.containerState === 'with' && (
                      <span style={{ color: colors.warning }}>🚛 حاوية</span>
                    )}
                    {cat.options.materialsState === 'with' && (
                      <span style={{ color: colors.success }}>🧱 مواد</span>
                    )}
                    {cat.categoryConditions.length > 0 && (
                      <span style={{ color: colors.purple }}>📋 {cat.categoryConditions.length} شروط</span>
                    )}
                  </div>
                  
                  {/* الأماكن المعلقة */}
                  {pendingPlaces.length > 0 && (
                    <div style={{ 
                      display: 'flex', 
                      gap: 6, 
                      flexWrap: 'wrap',
                      fontSize: 10,
                      color: colors.text,
                      alignItems: 'center',
                      marginBottom: allPlaces.length > 0 ? 8 : 0
                    }}>
                      {pendingPlaces.map((place, idx) => (
                        <span 
                          key={idx}
                          style={{
                            background: `${colors.warning}15`,
                            padding: '3px 8px',
                            borderRadius: 4,
                            border: `1px dashed ${colors.warning}50`
                          }}
                        >
                          <span style={{ color: colors.warning }}>⏳</span> {place.name} <span style={{ color: colors.muted }}>({place.length}×{place.width}=</span><span style={{ color: colors.warning, fontWeight: 600 }}>{place.area}م</span><span style={{ color: colors.muted }}>)</span>
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* أسماء الأماكن مع الأبعاد والناتج */}
                  {allPlaces.length > 0 && (
                    <div style={{ 
                      display: 'flex', 
                      gap: 6, 
                      flexWrap: 'wrap',
                      fontSize: 10,
                      color: colors.text,
                      alignItems: 'center'
                    }}>
                      {allPlaces.map((place, idx) => (
                        <span 
                          key={idx}
                          style={{
                            background: `${cat.color}15`,
                            padding: '3px 8px',
                            borderRadius: 4,
                            border: `1px solid ${cat.color}30`
                          }}
                        >
                          {place.type && <span style={{ marginLeft: 4 }}>{place.type === 'floor' ? '🏠' : place.type === 'wall' ? '🧱' : '⬆️'}</span>}
                          {place.name} <span style={{ color: colors.muted }}>({place.length}×{place.width}=</span><span style={{ color: colors.success, fontWeight: 600 }}>{place.area}م</span><span style={{ color: colors.muted }}>)</span>
                        </span>
                      ))}
                      {/* مجموع الأمتار */}
                      <span style={{
                        background: `${colors.success}20`,
                        padding: '3px 10px',
                        borderRadius: 4,
                        border: `1px solid ${colors.success}50`,
                        fontWeight: 700,
                        color: colors.success
                      }}>
                        = {catTotalArea} م²
                      </span>
                    </div>
                  )}
                </div>

                {/* إجمالي الفئة */}
                <div style={{
                  background: `${colors.success}12`,
                  padding: '16px 22px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRight: `1px solid ${colors.border}`,
                  minWidth: 115
                }}>
                  <div style={{ fontSize: 9, color: colors.muted, marginBottom: 2 }}>الإجمالي</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: colors.success }}>
                    {formatNumber(catTotals.finalTotal)}
                  </div>
                  <div style={{ fontSize: 9, color: colors.muted }}>ريال</div>
                </div>

                {/* أيقونة التوسيع */}
                <div style={{
                  background: colors.bg,
                  padding: '16px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRight: `1px solid ${colors.border}`,
                  minWidth: 55
                }}>
                  <span style={{
                    fontSize: 16,
                    color: isExpanded ? cat.color : colors.muted,
                    transition: 'transform 0.3s',
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}>
                    ▼
                  </span>
                </div>
              </div>

              {/* ─────────────────────────────────────────────────────────────────────── */}
              {/* محتوى الفئة (الداخلي) - كل تفاصيل SummaryDesignExample */}
              {/* ─────────────────────────────────────────────────────────────────────── */}
              {isExpanded && (
                <div style={{ 
                  background: `${cat.color}05`,
                  borderTop: `1px dashed ${cat.color}40`,
                  padding: 16
                }}>
                  {/* ═══════════════════════════════════════════════════════════════════ */}
                  {/* قسم الأماكن المعلقة - يظهر فقط إذا كانت هناك أماكن معلقة */}
                  {/* ═══════════════════════════════════════════════════════════════════ */}
                  {pendingPlaces.length > 0 && (
                    <div style={{ 
                      marginBottom: 16, 
                      background: `${colors.warning}10`, 
                      borderRadius: 12, 
                      padding: 16,
                      border: `1px solid ${colors.warning}30`
                    }}>
                      <div style={{ 
                        fontSize: 12, 
                        fontWeight: 700, 
                        color: colors.warning, 
                        marginBottom: 12,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                      }}>
                        ⚠️ أماكن تحتاج اختيار البند الفرعي ({pendingPlaces.length})
                      </div>
                      
                      {/* قائمة الأماكن المعلقة */}
                      {pendingPlaces.map((place, placeIdx) => (
                        <div key={place.id} style={{ 
                          background: colors.card, 
                          borderRadius: 8, 
                          padding: 12, 
                          marginBottom: 8,
                          border: `1px dashed ${colors.warning}50`
                        }}>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 12,
                            flexWrap: 'wrap'
                          }}>
                            {/* معلومات المكان */}
                            <span style={{ 
                              fontSize: 13, 
                              fontWeight: 600, 
                              color: colors.text,
                              background: `${colors.warning}15`,
                              padding: '4px 10px',
                              borderRadius: 6
                            }}>
                              ⏳ {place.name} ({place.length}×{place.width}={place.area}م)
                            </span>
                            
                            {/* قائمة منسدلة لاختيار البند الفرعي */}
                            <select
                              defaultValue=""
                              onChange={(e) => {
                                if (!e.target.value) return;
                                
                                const subItem = cat.subItems.find(s => s.code === e.target.value);
                                if (!subItem) return;
                                
                                // إنشاء بند جديد من البند الفرعي مع المكان
                                const newItem = {
                                  id: Date.now() + Math.random(),
                                  code: subItem.code,
                                  name: subItem.name,
                                  price: subItem.price,
                                  group: subItem.group,
                                  type: subItem.type,
                                  places: [{ ...place }],
                                  conditions: []
                                };
                                
                                setCategories(prev => prev.map(c => {
                                  if (c.id !== cat.id) return c;
                                  
                                  // حذف المكان من الأماكن المعلقة وإضافة البند الجديد
                                  const newPendingPlaces = c.pendingPlaces.filter(p => p.id !== place.id);
                                  return {
                                    ...c,
                                    items: [...c.items, newItem],
                                    pendingPlaces: newPendingPlaces,
                                    needsSubItemSelection: newPendingPlaces.length > 0
                                  };
                                }));
                              }}
                              style={{
                                flex: 1,
                                minWidth: 200,
                                height: 36,
                                borderRadius: 6,
                                border: `1px solid ${cat.color}50`,
                                background: colors.bg,
                                color: colors.text,
                                fontSize: 12,
                                padding: '0 10px',
                                cursor: 'pointer'
                              }}
                            >
                              <option value="">-- اختر البند الفرعي --</option>
                              {cat.subItems.map(subItem => (
                                <option key={subItem.code} value={subItem.code}>
                                  {subItem.type === 'floor' ? '🏠' : subItem.type === 'wall' ? '🧱' : subItem.type === 'ceiling' ? '⬆️' : '📦'} {subItem.name} ({subItem.price}﷼)
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* ═══════════════════════════════════════════════════════════════════ */}
                  {/* قسم البنود */}
                  {/* ═══════════════════════════════════════════════════════════════════ */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ 
                      fontSize: 12, 
                      fontWeight: 700, 
                      color: colors.text, 
                      marginBottom: 10,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8
                    }}>
                      📦 البنود ({cat.items.length})
                      <span style={{ fontSize: 10, color: colors.muted, fontWeight: 400 }}>
                        • إجمالي {catTotalArea} م² • {formatNumber(catTotals.totalPrice)} ﷼
                      </span>
                    </div>

                    {cat.items.length === 0 && pendingPlaces.length === 0 && (
                      <div style={{ 
                        textAlign: 'center', 
                        padding: 20, 
                        color: colors.muted, 
                        fontSize: 12,
                        background: colors.card,
                        borderRadius: 8,
                        border: `1px dashed ${colors.border}`
                      }}>
                        لا توجد بنود. أضف مكان من المرحلة الأولى أو اضغط على زر إضافة بند
                      </div>
                    )}

                    {cat.items.map((item) => {
                      const isEditing = editingItemId === item.id;
                      const itemArea = getItemArea(item);
                      const itemTotal = itemArea * item.price;

                      return (
                        <div 
                          key={item.id}
                          style={{
                            background: colors.card,
                            borderRadius: 12,
                            overflow: 'hidden',
                            marginBottom: 8,
                            border: isEditing ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`,
                            transition: 'all 0.2s'
                          }}
                        >
                          {/* رأس البند (Accordion Header) */}
                          <div 
                            onClick={() => setEditingItemId(isEditing ? null : item.id)}
                            style={{ 
                              display: 'flex', 
                              alignItems: 'stretch',
                              cursor: 'pointer',
                              background: isEditing ? `${colors.primary}10` : 'transparent'
                            }}
                          >
                            {/* الكود */}
                            <div style={{
                              background: colors.primary,
                              padding: '14px 16px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minWidth: 65
                            }}>
                              <span style={{ 
                                fontSize: 12, 
                                fontWeight: 700, 
                                color: '#fff',
                                fontFamily: 'monospace'
                              }}>
                                {item.code}
                              </span>
                            </div>

                            {/* المحتوى الرئيسي */}
                            <div style={{ flex: 1, padding: '12px 14px' }}>
                              <div style={{ fontSize: 14, fontWeight: 600, color: colors.text, marginBottom: 6 }}>
                                {item.name}
                              </div>
                              <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 10,
                                fontSize: 11,
                                color: colors.muted,
                                marginBottom: item.conditions && item.conditions.length > 0 ? 8 : 0
                              }}>
                                <span>📍 {item.places.map(p => p.name).join('، ')}</span>
                                <span style={{ color: colors.border }}>|</span>
                                <span style={{ color: colors.success, fontWeight: 600 }}>{itemArea} م²</span>
                                <span style={{ color: colors.border }}>|</span>
                                <span>{item.price} ﷼/م²</span>
                              </div>

                              {/* الشروط */}
                              {item.conditions && item.conditions.length > 0 && (
                                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                  {item.conditions.map((cond, i) => (
                                    <span key={i} style={{
                                      fontSize: 9,
                                      color: colors.warning,
                                      background: `${colors.warning}15`,
                                      padding: '3px 8px',
                                      borderRadius: 4,
                                      border: `1px solid ${colors.warning}25`
                                    }}>
                                      {cond}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* الإجمالي */}
                            <div style={{
                              background: `${colors.success}12`,
                              padding: '12px 16px',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRight: `1px solid ${colors.border}`,
                              minWidth: 90
                            }}>
                              <div style={{ fontSize: 9, color: colors.muted, marginBottom: 2 }}>الإجمالي</div>
                              <div style={{ fontSize: 16, fontWeight: 700, color: colors.success }}>
                                {formatNumber(itemTotal)}
                              </div>
                              <div style={{ fontSize: 9, color: colors.muted }}>ريال</div>
                            </div>

                            {/* أيقونة التوسيع/الطي */}
                            <div style={{
                              background: colors.bg,
                              padding: '12px 16px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRight: `1px solid ${colors.border}`,
                              minWidth: 50
                            }}>
                              <span style={{
                                fontSize: 18,
                                color: isEditing ? colors.primary : colors.muted,
                                transition: 'transform 0.3s',
                                transform: isEditing ? 'rotate(180deg)' : 'rotate(0deg)'
                              }}>
                                ⚙️
                              </span>
                            </div>
                          </div>

                          {/* ═══════════════════════════════════════════════════════════ */}
                          {/* قسم التحرير (Accordion Body) */}
                          {/* ═══════════════════════════════════════════════════════════ */}
                          {isEditing && (
                            <div style={{ 
                              padding: 16,
                              background: `${colors.primary}08`,
                              borderTop: `1px dashed ${colors.primary}30`
                            }}>
                              {/* البند الفرعي */}
                              <div style={{ marginBottom: 12 }}>
                                <div style={{ fontSize: 10, color: colors.muted, marginBottom: 4 }}>البند الفرعي</div>
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 6,
                                  height: 30, padding: '0 12px',
                                  borderRadius: 8,
                                  border: `1px solid ${colors.border}`,
                                  background: colors.bg,
                                  
                                  width: '100%'
                                }}>
                                  <select
                                    value={item.code}
                                    onChange={(e) => changeSubItem(cat.id, item.id, e.target.value)}
                                    style={{
                                      flex: 1,
                                      padding: '0 8px 0 0',
                                      border: 'none',
                                      background: 'transparent',
                                      color: colors.text,
                                      fontSize: 12,
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      outline: 'none',
                                      width: '100%'
                                    }}
                                  >
                                    {cat.subItems.map(s => (
                                      <option key={s.code} value={s.code} style={{ background: colors.bg }}>[{s.code}] {s.name}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              {/* خط فاصل */}
                              <div style={{ borderBottom: `1px dashed ${colors.border}`, marginBottom: 12 }}></div>

                              {/* ═══════════════════════════════════════════════════════ */}
                              {/* الأماكن */}
                              {/* ═══════════════════════════════════════════════════════ */}
                              <div style={{ marginBottom: 12 }}>
                                <div style={{ fontSize: 10, color: colors.muted, marginBottom: 8 }}>📍 الأماكن ({item.places.length})</div>
                                
                                {item.places.map((place, pIdx) => (
                                  <div 
                                    key={place.id} 
                                    style={{ 
                                      marginBottom: 8,
                                      padding: 8,
                                      borderRadius: 8,
                                      background: pIdx % 2 === 0 ? `${colors.primary}08` : 'transparent'
                                    }}
                                  >
                                    {/* الصف الأول: اسم المكان + زر الحذف */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                      <div style={{
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 6,
                                        height: 30, padding: '0 12px',
                                        borderRadius: 8,
                                        border: `1px solid ${colors.border}`,
                                        background: colors.bg
                                      }}>
                                        <span style={{ color: colors.muted, fontSize: 12, fontWeight: 600 }}>المكان</span>
                                        <select
                                          value={place.name}
                                          onChange={(e) => updatePlace(cat.id, item.id, place.id, 'name', e.target.value)}
                                          style={{
                                            flex: 1,
                                            padding: '0 8px 0 0',
                                            border: 'none',
                                            background: 'transparent',
                                            color: '#fff',
                                            fontSize: 12,
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            outline: 'none'
                                          }}
                                        >
                                          {placesList.map(p => (
                                            <option key={p} value={p} style={{ background: colors.bg }}>{p}</option>
                                          ))}
                                        </select>
                                      </div>
                                      
                                      {/* زر الحذف */}
                                      {item.places.length > 1 && (
                                        <button
                                          onClick={() => deletePlace(cat.id, item.id, place.id)}
                                          style={{
                                            height: 30, 
                                            width: 30,
                                            padding: 0,
                                            borderRadius: 8,
                                            border: `1px solid ${colors.danger}`,
                                            background: `${colors.danger}10`,
                                            color: colors.danger,
                                            fontSize: 12,
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                          }}
                                        >
                                          ✕
                                        </button>
                                      )}
                                    </div>

                                    {/* الصف الثاني: الأبعاد والأسعار */}
                                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                                    {/* الطول */}
                                    <div 
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 4,
                                        height: 30, padding: '0 8px',
                                        borderRadius: 8,
                                        border: `1px solid ${colors.border}`,
                                        background: colors.bg,
                                        cursor: 'pointer'
                                      }}>
                                      <span style={{ color: colors.muted, fontSize: 11, fontWeight: 600 }}>الطول</span>
                                      <select
                                        value={place.length}
                                        onChange={(e) => {
                                          updatePlace(cat.id, item.id, place.id, 'length', e.target.value);
                                          // فتح قائمة العرض بعد اختيار الطول
                                          setTimeout(() => {
                                            const widthSelect = e.target.closest('div').parentElement.querySelector('[data-field="width"]');
                                            if (widthSelect) widthSelect.focus();
                                          }, 100);
                                        }}
                                        style={{
                                          width: 45,
                                          padding: 0,
                                          border: 'none',
                                          background: 'transparent',
                                          color: '#fff',
                                          fontSize: 12,
                                          fontWeight: 700,
                                          textAlign: 'center',
                                          outline: 'none',
                                          cursor: 'pointer'
                                        }}
                                      >
                                        {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10].map(n => (
                                          <option key={n} value={n} style={{ background: colors.bg }}>{n}</option>
                                        ))}
                                      </select>
                                    </div>

                                    {/* العرض */}
                                    <div 
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 4,
                                        height: 30, padding: '0 8px',
                                        borderRadius: 8,
                                        border: `1px solid ${colors.border}`,
                                        background: colors.bg,
                                        cursor: 'pointer'
                                      }}>
                                      <span style={{ color: colors.muted, fontSize: 11, fontWeight: 600 }}>العرض</span>
                                      <select
                                        data-field="width"
                                        value={place.width}
                                        onChange={(e) => {
                                          updatePlace(cat.id, item.id, place.id, 'width', e.target.value);
                                          // فتح قائمة الارتفاع بعد اختيار العرض
                                          setTimeout(() => {
                                            const heightSelect = e.target.closest('div').parentElement.querySelector('[data-field="height"]');
                                            if (heightSelect) heightSelect.focus();
                                          }, 100);
                                        }}
                                        style={{
                                          width: 45,
                                          padding: 0,
                                          border: 'none',
                                          background: 'transparent',
                                          color: '#fff',
                                          fontSize: 12,
                                          fontWeight: 700,
                                          textAlign: 'center',
                                          outline: 'none',
                                          cursor: 'pointer'
                                        }}
                                      >
                                        {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10].map(n => (
                                          <option key={n} value={n} style={{ background: colors.bg }}>{n}</option>
                                        ))}
                                      </select>
                                    </div>

                                    {/* الارتفاع */}
                                    <div 
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 4,
                                        height: 30, padding: '0 8px',
                                        borderRadius: 8,
                                        border: `1px solid ${colors.border}`,
                                        background: colors.bg,
                                        cursor: 'pointer'
                                      }}>
                                      <span style={{ color: colors.muted, fontSize: 11, fontWeight: 600 }}>الارتفاع</span>
                                      <select
                                        data-field="height"
                                        value={place.height}
                                        onChange={(e) => updatePlace(cat.id, item.id, place.id, 'height', e.target.value)}
                                        style={{
                                          width: 45,
                                          padding: 0,
                                          border: 'none',
                                          background: 'transparent',
                                          color: '#fff',
                                          fontSize: 12,
                                          fontWeight: 700,
                                          textAlign: 'center',
                                          outline: 'none',
                                          cursor: 'pointer'
                                        }}
                                      >
                                        {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10].map(n => (
                                          <option key={n} value={n} style={{ background: colors.bg }}>{n}</option>
                                        ))}
                                      </select>
                                    </div>

                                    {/* المساحة */}
                                    <div 
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 4,
                                        height: 30, padding: '0 8px',
                                        borderRadius: 8,
                                        border: `1px solid ${colors.success}`,
                                        background: `${colors.success}10`,
                                        cursor: 'pointer'
                                      }}>
                                      <select
                                        value={place.manualArea !== undefined ? place.manualArea : place.area}
                                        onChange={(e) => updatePlace(cat.id, item.id, place.id, 'manualArea', e.target.value)}
                                        style={{
                                          width: 45,
                                          padding: 0,
                                          border: 'none',
                                          background: 'transparent',
                                          color: '#fff',
                                          fontSize: 12,
                                          fontWeight: 700,
                                          textAlign: 'center',
                                          outline: 'none',
                                          cursor: 'pointer'
                                        }}
                                      >
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100].map(n => (
                                          <option key={n} value={n} style={{ background: colors.bg }}>{n}</option>
                                        ))}
                                      </select>
                                      <span style={{ color: colors.success, fontSize: 11, fontWeight: 600 }}>م²</span>
                                    </div>

                                    {/* سعر المتر */}
                                    <div 
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 4,
                                        height: 30, padding: '0 8px',
                                        borderRadius: 8,
                                        border: `1px solid ${colors.warning}`,
                                        background: `${colors.warning}10`,
                                        cursor: 'pointer'
                                      }}>
                                      <select
                                        value={place.meterPrice || item.price}
                                        onChange={(e) => updatePlace(cat.id, item.id, place.id, 'meterPrice', e.target.value)}
                                        style={{
                                          width: 45,
                                          padding: 0,
                                          border: 'none',
                                          background: 'transparent',
                                          color: '#fff',
                                          fontSize: 12,
                                          fontWeight: 700,
                                          textAlign: 'center',
                                          outline: 'none',
                                          cursor: 'pointer'
                                        }}
                                      >
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100].map(n => (
                                          <option key={n} value={n} style={{ background: colors.bg }}>{n}</option>
                                        ))}
                                      </select>
                                      <span style={{ color: colors.warning, fontSize: 11, fontWeight: 600 }}>﷼/م</span>
                                    </div>

                                    {/* الإجمالي */}
                                    <div 
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 4,
                                        height: 30, padding: '0 8px',
                                        borderRadius: 8,
                                        border: `1px solid ${colors.primary}`,
                                        background: `${colors.primary}10`
                                      }}>
                                      <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>
                                        {formatNumber((place.manualArea !== undefined ? place.manualArea : place.area) * (place.meterPrice || item.price))}
                                      </span>
                                      <span style={{ color: colors.primary, fontSize: 11, fontWeight: 600 }}>﷼</span>
                                    </div>
                                    </div>
                                  </div>
                                ))}

                                {/* زر إضافة مكان جديد */}
                                <button
                                  onClick={() => addPlace(cat.id, item.id)}
                                  style={{
                                    height: 30, padding: '0 12px',
                                    borderRadius: 8,
                                    border: `1px solid ${colors.success}`,
                                    background: `${colors.success}15`,
                                    color: colors.success,
                                    fontSize: 12,
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 6
                                  }}
                                >
                                  <span style={{ fontWeight: 900 }}>+</span> إضافة مكان
                                </button>
                              </div>

                              {/* ═══════════════════════════════════════════════════════ */}
                              {/* قسم الشروط والملاحظات */}
                              {/* ═══════════════════════════════════════════════════════ */}
                              <div style={{ marginBottom: 12 }}>
                                <div style={{ fontSize: 10, color: colors.warning, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                                  📋 الشروط والملاحظات
                                </div>
                                
                                {/* قائمة الشروط المضافة */}
                                {item.conditions && item.conditions.length > 0 ? (
                                  <div style={{ marginBottom: 10 }}>
                                    {item.conditions.map((condition, condIdx) => (
                                      <div 
                                        key={condIdx}
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 8,
                                          padding: '8px 12px',
                                          borderRadius: 8,
                                          border: `1px solid ${colors.warning}30`,
                                          background: `${colors.warning}08`,
                                          marginBottom: 6
                                        }}
                                      >
                                        <span style={{ color: colors.warning, fontSize: 12 }}>•</span>
                                        <span style={{ flex: 1, color: colors.text, fontSize: 12 }}>{condition}</span>
                                        <button
                                          onClick={() => deleteCondition(cat.id, item.id, condIdx)}
                                          style={{
                                            padding: '2px 8px',
                                            borderRadius: 4,
                                            border: 'none',
                                            background: `${colors.danger}20`,
                                            color: colors.danger,
                                            fontSize: 11,
                                            cursor: 'pointer'
                                          }}
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div style={{ 
                                    padding: '12px', 
                                    textAlign: 'center', 
                                    color: colors.muted, 
                                    fontSize: 11,
                                    border: `1px dashed ${colors.border}`,
                                    borderRadius: 8,
                                    marginBottom: 10
                                  }}>
                                    لا توجد شروط
                                  </div>
                                )}

                                {/* أزرار إضافة الشروط */}
                                <div style={{ display: 'flex', gap: 8 }}>
                                  <div style={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    height: 30, padding: '0 12px',
                                    borderRadius: 8,
                                    border: `1px solid ${colors.warning}`,
                                    background: colors.bg,
                                    
                                  }}>
                                    <span style={{ color: colors.warning, fontSize: 12, fontWeight: 600 }}>الشرط</span>
                                    <select
                                      value=""
                                      onChange={(e) => {
                                        if (e.target.value) {
                                          addCondition(cat.id, item.id, e.target.value);
                                        }
                                      }}
                                      style={{
                                        flex: 1,
                                        padding: '0 8px 0 0',
                                        border: 'none',
                                        background: 'transparent',
                                        color: '#fff',
                                        fontSize: 12,
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        outline: 'none'
                                      }}
                                    >
                                      <option value="" style={{ background: colors.bg }}>اختر من القائمة</option>
                                      {predefinedConditions
                                        .filter(c => !item.conditions?.includes(c))
                                        .map((cond, idx) => (
                                          <option key={idx} value={cond} style={{ background: colors.bg }}>{cond}</option>
                                        ))
                                      }
                                    </select>
                                  </div>

                                  <button
                                    onClick={() => setAddingConditionForItem(addingConditionForItem === item.id ? null : item.id)}
                                    style={{
                                      height: 30, padding: '0 12px',
                                      borderRadius: 8,
                                      border: `1px solid ${colors.warning}`,
                                      background: addingConditionForItem === item.id ? `${colors.warning}20` : `${colors.warning}15`,
                                      color: colors.warning,
                                      fontSize: 12,
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                      
                                      whiteSpace: 'nowrap'
                                    }}
                                  >
                                    <span style={{ fontWeight: 900 }}>+</span> أدخل شرط يدوي
                                  </button>
                                </div>

                                {/* حقل الإدخال اليدوي */}
                                {addingConditionForItem === item.id && (
                                  <div style={{ 
                                    display: 'flex', 
                                    gap: 8, 
                                    marginTop: 8,
                                    padding: 10,
                                    borderRadius: 8,
                                    border: `1px solid ${colors.warning}`,
                                    background: `${colors.warning}08`
                                  }}>
                                    <input
                                      type="text"
                                      value={newConditionText}
                                      onChange={(e) => setNewConditionText(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter' && newConditionText.trim()) {
                                          addCondition(cat.id, item.id, newConditionText);
                                        }
                                      }}
                                      placeholder="اكتب الشرط هنا..."
                                      autoFocus
                                      style={{
                                        flex: 1,
                                        height: 30, padding: '0 12px',
                                        borderRadius: 6,
                                        border: `1px solid ${colors.border}`,
                                        background: colors.bg,
                                        color: colors.text,
                                        fontSize: 12,
                                        outline: 'none'
                                      }}
                                    />
                                    <button
                                      onClick={() => {
                                        if (newConditionText.trim()) {
                                          addCondition(cat.id, item.id, newConditionText);
                                        }
                                      }}
                                      disabled={!newConditionText.trim()}
                                      style={{
                                        height: 30, padding: '0 12px',
                                        borderRadius: 6,
                                        border: 'none',
                                        background: newConditionText.trim() ? colors.success : colors.border,
                                        color: '#fff',
                                        fontSize: 12,
                                        fontWeight: 600,
                                        cursor: newConditionText.trim() ? 'pointer' : 'not-allowed'
                                      }}
                                    >
                                      إضافة
                                    </button>
                                    <button
                                      onClick={() => {
                                        setAddingConditionForItem(null);
                                        setNewConditionText('');
                                      }}
                                      style={{
                                        height: 30, padding: '0 12px',
                                        borderRadius: 6,
                                        border: `1px solid ${colors.border}`,
                                        background: 'transparent',
                                        color: colors.muted,
                                        fontSize: 12,
                                        cursor: 'pointer'
                                      }}
                                    >
                                      إلغاء
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* أزرار التحكم */}
                              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                <button
                                  onClick={() => deleteItem(cat.id, item.id)}
                                  style={{
                                    height: 30, padding: '0 12px',
                                    borderRadius: 8,
                                    border: `1px solid ${colors.danger}`,
                                    background: `${colors.danger}10`,
                                    color: colors.danger,
                                    fontSize: 12,
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                  }}
                                >
                                  حذف
                                </button>
                                <button
                                  onClick={() => setEditingItemId(null)}
                                  style={{
                                    height: 30, padding: '0 12px',
                                    borderRadius: 8,
                                    border: `1px solid ${colors.border}`,
                                    background: `${colors.muted}10`,
                                    color: colors.muted,
                                    fontSize: 12,
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                  }}
                                >
                                  إلغاء
                                </button>
                                <button
                                  onClick={() => setEditingItemId(null)}
                                  style={{
                                    height: 30, padding: '0 12px',
                                    borderRadius: 8,
                                    border: `1px solid ${colors.success}`,
                                    background: `${colors.success}10`,
                                    color: colors.success,
                                    fontSize: 12,
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                  }}
                                >
                                  حفظ
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* زر إضافة بند جديد */}
                    <button
                      onClick={() => addItem(cat.id)}
                      style={{
                        width: '100%',
                        height: 60,
                        padding: '0 16px',
                        borderRadius: 10,
                        border: `1px solid ${colors.success}`,
                        background: `${colors.success}15`,
                        color: colors.success,
                        fontSize: 14,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        marginBottom: 8
                      }}
                    >
                      <span style={{ fontSize: 20, fontWeight: 900 }}>+</span> إضافة بند جديد
                    </button>

                    {/* زر الشروط والملاحظات */}
                    <button
                      onClick={() => setExpandedConditions(prev => ({ ...prev, [cat.id]: !prev[cat.id] }))}
                      style={{
                        width: '100%',
                        height: 60,
                        padding: '0 16px',
                        borderRadius: 10,
                        border: `1px solid ${colors.warning}`,
                        background: expandedConditions[cat.id] ? `${colors.warning}20` : `${colors.warning}10`,
                        color: colors.warning,
                        fontSize: 14,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 8
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 18 }}>📋</span>
                        <span>الشروط والملاحظات</span>
                        {cat.categoryConditions.length > 0 && (
                          <span style={{ 
                            background: colors.warning, 
                            color: '#000', 
                            padding: '2px 8px', 
                            borderRadius: 10, 
                            fontSize: 11,
                            fontWeight: 700
                          }}>
                            {cat.categoryConditions.length}
                          </span>
                        )}
                      </div>
                      <span style={{ 
                        fontSize: 14,
                        transform: expandedConditions[cat.id] ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s'
                      }}>▼</span>
                    </button>

                    {/* زر ملخص السعر */}
                    <button
                      onClick={() => setExpandedPriceSummary(prev => ({ ...prev, [cat.id]: !prev[cat.id] }))}
                      style={{
                        width: '100%',
                        height: 60,
                        padding: '0 16px',
                        borderRadius: 10,
                        border: `1px solid ${colors.primary}`,
                        background: expandedPriceSummary[cat.id] ? `${colors.primary}20` : `${colors.primary}10`,
                        color: colors.primary,
                        fontSize: 14,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 18 }}>💰</span>
                        <span>ملخص السعر</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 16, fontWeight: 800 }}>{formatNumber(catTotals.finalTotal)} ﷼</span>
                        <span style={{ 
                          fontSize: 14,
                          transform: expandedPriceSummary[cat.id] ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s'
                        }}>▼</span>
                      </div>
                    </button>
                  </div>

                  {/* ═══════════════════════════════════════════════════════════════════ */}
                  {/* محتوى الشروط والملاحظات (قابل للطي) */}
                  {/* ═══════════════════════════════════════════════════════════════════ */}
                  {expandedConditions[cat.id] && (
                  <div style={{ 
                    padding: 14, 
                    background: `${colors.warning}08`, 
                    borderRadius: 10,
                    marginBottom: 12,
                    border: `1px solid ${colors.warning}30`
                  }}>
                    {/* أزرار الخيارات في سطر واحد */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12, alignItems: 'center' }}>
                      {/* زر الحاوية - 3 حالات */}
                      <div 
                        onClick={() => {
                          const states = ['with', 'notMentioned', 'without'];
                          const currentIndex = states.indexOf(cat.options.containerState);
                          const nextIndex = (currentIndex + 1) % states.length;
                          updateCategoryOptions(cat.id, 'containerState', states[nextIndex]);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          height: 30, padding: '0 12px',
                          borderRadius: 8,
                          border: `1px solid ${cat.options.containerState === 'with' ? colors.warning : cat.options.containerState === 'without' ? colors.danger : colors.border}`,
                          background: cat.options.containerState === 'with' ? `${colors.warning}15` : cat.options.containerState === 'without' ? `${colors.danger}15` : colors.bg,
                          cursor: 'pointer'
                        }}
                      >
                        <span style={{ 
                          color: cat.options.containerState === 'with' ? colors.warning : cat.options.containerState === 'without' ? colors.danger : colors.muted, 
                          fontSize: 12, 
                          fontWeight: 600 
                        }}>
                          {cat.options.containerState === 'with' ? 'الحاوية' : cat.options.containerState === 'without' ? 'بدون حاوية' : 'إخفاء الحاوية'}
                        </span>
                        {cat.options.containerState === 'with' && (
                          <>
                            <input
                              type="number"
                              inputMode="numeric"
                              value={cat.options.containerAmount}
                              onChange={(e) => updateCategoryOptions(cat.id, 'containerAmount', parseFloat(e.target.value) || 0)}
                              onFocus={(e) => e.target.select()}
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                width: 40,
                                padding: 0,
                                border: 'none',
                                background: 'transparent',
                                color: '#fff',
                                fontSize: 12,
                                fontWeight: 700,
                                textAlign: 'center'
                              }}
                            />
                            <span style={{ color: colors.warning, fontSize: 11, fontWeight: 700 }}>﷼</span>
                          </>
                        )}
                      </div>

                      {/* زر المواد - 3 حالات */}
                      <div 
                        onClick={() => {
                          const states = ['with', 'notMentioned', 'without'];
                          const currentIndex = states.indexOf(cat.options.materialsState);
                          const nextIndex = (currentIndex + 1) % states.length;
                          updateCategoryOptions(cat.id, 'materialsState', states[nextIndex]);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          height: 30, padding: '0 12px',
                          borderRadius: 8,
                          border: `1px solid ${cat.options.materialsState === 'with' ? colors.success : cat.options.materialsState === 'without' ? colors.danger : colors.border}`,
                          background: cat.options.materialsState === 'with' ? `${colors.success}15` : cat.options.materialsState === 'without' ? `${colors.danger}15` : colors.bg,
                          cursor: 'pointer'
                        }}
                      >
                        <span style={{ 
                          color: cat.options.materialsState === 'with' ? colors.success : cat.options.materialsState === 'without' ? colors.danger : colors.muted, 
                          fontSize: 12, 
                          fontWeight: 600 
                        }}>
                          {cat.options.materialsState === 'with' ? 'المواد' : cat.options.materialsState === 'without' ? 'بدون مواد' : 'إخفاء المواد'}
                        </span>
                        {cat.options.materialsState === 'with' && (
                          <>
                            <input
                              type="number"
                              inputMode="numeric"
                              value={cat.options.materialsAmount}
                              onChange={(e) => updateCategoryOptions(cat.id, 'materialsAmount', parseFloat(e.target.value) || 0)}
                              onFocus={(e) => e.target.select()}
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                width: 50,
                                padding: 0,
                                border: 'none',
                                background: 'transparent',
                                color: '#fff',
                                fontSize: 12,
                                fontWeight: 700,
                                textAlign: 'center'
                              }}
                            />
                            <span style={{ color: colors.success, fontSize: 11, fontWeight: 700 }}>﷼</span>
                          </>
                        )}
                      </div>

                      {/* الأمتار */}
                      <div 
                        onClick={() => updateCategoryOptions(cat.id, 'showMeters', !cat.options.showMeters)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          height: 30, padding: '0 12px',
                          borderRadius: 8,
                          border: `1px solid ${cat.options.showMeters ? colors.cyan : colors.border}`,
                          background: cat.options.showMeters ? `${colors.cyan}15` : colors.bg,
                          cursor: 'pointer'
                        }}
                      >
                        <span style={{ color: cat.options.showMeters ? colors.cyan : colors.muted, fontSize: 12, fontWeight: 600 }}>
                          الأمتار
                        </span>
                      </div>

                      {/* المساحات */}
                      <div 
                        onClick={() => updateCategoryOptions(cat.id, 'sumMeters', !cat.options.sumMeters)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          height: 30, padding: '0 12px',
                          borderRadius: 8,
                          border: `1px solid ${cat.options.sumMeters ? colors.purple : colors.border}`,
                          background: cat.options.sumMeters ? `${colors.purple}15` : colors.bg,
                          cursor: 'pointer'
                        }}
                      >
                        <span style={{ color: cat.options.sumMeters ? colors.purple : colors.muted, fontSize: 12, fontWeight: 600 }}>
                          المساحات
                        </span>
                      </div>

                      {/* السعر */}
                      <div 
                        onClick={() => updateCategoryOptions(cat.id, 'showPrice', !cat.options.showPrice)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          height: 30, padding: '0 12px',
                          borderRadius: 8,
                          border: `1px solid ${cat.options.showPrice ? colors.primary : colors.border}`,
                          background: cat.options.showPrice ? `${colors.primary}15` : colors.bg,
                          cursor: 'pointer'
                        }}
                      >
                        <span style={{ color: cat.options.showPrice ? colors.primary : colors.muted, fontSize: 12, fontWeight: 600 }}>
                          السعر
                        </span>
                      </div>

                      {/* فاصل */}
                      <div style={{ width: 1, height: 20, background: colors.border, margin: '0 4px' }}></div>

                      {/* تحرير */}
                      <div 
                        onClick={() => {
                          if (editingSummary !== cat.id) {
                            let summary = `تشمل الخدمة: ${cat.items.map(i => {
                              let itemText = cat.options.showMeters ? `${i.name} (${getItemArea(i)} م²)` : i.name;
                              if (i.conditions && i.conditions.length > 0) {
                                itemText += ` (${i.conditions.join('، ')})`;
                              }
                              return itemText;
                            }).join('، ')}.`;
                            
                            if (cat.categoryConditions.length > 0) {
                              summary += ` | ملاحظات: ${cat.categoryConditions.join('، ')}.`;
                            }
                            
                            if (cat.options.sumMeters && Object.keys(groupedAreas).length > 1) {
                              summary += ` | التجميع: ${Object.entries(groupedAreas).map(([group, area]) => `${group}: ${area} م²`).join('، ')}.`;
                            }
                            
                            if (cat.options.containerState === 'with') {
                              summary += ` تشمل الحاوية (${cat.options.containerAmount} ﷼).`;
                            } else if (cat.options.containerState === 'without') {
                              summary += ` لا تشمل الحاوية.`;
                            }
                            if (cat.options.materialsState === 'with') {
                              summary += ` تشمل المواد (${cat.options.materialsAmount} ﷼).`;
                            } else if (cat.options.materialsState === 'without') {
                              summary += ` لا تشمل المواد.`;
                            }
                            if (cat.options.showPrice) {
                              summary += ` | الإجمالي: ${formatNumber(catTotals.finalTotal)} ر.س`;
                            }
                            setCustomSummary({ ...customSummary, [cat.id]: summary });
                          }
                          setEditingSummary(editingSummary === cat.id ? null : cat.id);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          height: 30, padding: '0 12px',
                          borderRadius: 8,
                          border: `1px solid ${editingSummary === cat.id ? colors.warning : colors.border}`,
                          background: editingSummary === cat.id ? `${colors.warning}15` : colors.bg,
                          cursor: 'pointer'
                        }}
                      >
                        <span style={{ color: editingSummary === cat.id ? colors.warning : colors.muted, fontSize: 12, fontWeight: 600 }}>
                          ✏️ تحرير
                        </span>
                      </div>

                      {/* نسخ */}
                      <div 
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          height: 30, padding: '0 12px',
                          borderRadius: 8,
                          border: `1px solid ${colors.border}`,
                          background: colors.bg,
                          cursor: 'pointer'
                        }}
                      >
                        <span style={{ color: colors.muted, fontSize: 12, fontWeight: 600 }}>
                          📋 نسخ
                        </span>
                      </div>

                      {/* تراجع - يظهر فقط عند التحرير */}
                      {editingSummary === cat.id && (
                        <div 
                          onClick={() => { setEditingSummary(null); setCustomSummary({ ...customSummary, [cat.id]: '' }); }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            height: 30, padding: '0 12px',
                            borderRadius: 8,
                            border: `1px solid ${colors.danger}`,
                            background: `${colors.danger}15`,
                            cursor: 'pointer'
                          }}
                        >
                          <span style={{ color: colors.danger, fontSize: 12, fontWeight: 600 }}>
                            ↩️ تراجع
                          </span>
                        </div>
                      )}
                    </div>

                    {/* عنوان ملخص الخدمة */}
                    <div style={{ marginBottom: 10 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: colors.warning }}>📝 ملخص الخدمة</span>
                    </div>
                    
                    {editingSummary === cat.id ? (
                      <textarea
                        value={customSummary[cat.id] || ''}
                        onChange={(e) => setCustomSummary({ ...customSummary, [cat.id]: e.target.value })}
                        style={{
                          width: '100%',
                          minHeight: 80,
                          padding: 12,
                          borderRadius: 8,
                          border: `1px solid ${colors.warning}50`,
                          background: colors.bg,
                          color: colors.text,
                          fontSize: 12,
                          lineHeight: 1.8,
                          resize: 'vertical'
                        }}
                      />
                    ) : (
                      <div style={{ 
                        fontSize: 12, 
                        color: colors.text, 
                        lineHeight: 1.8, 
                        background: colors.bg, 
                        padding: 12, 
                        borderRadius: 8 
                      }}>
                        تشمل الخدمة: {cat.items.map((i, idx) => (
                          <span key={i.id}>
                            {cat.options.showMeters ? `${i.name} (${getItemArea(i)} م²)` : i.name}
                            {i.conditions && i.conditions.length > 0 && (
                              <span style={{ color: colors.warning }}> ({i.conditions.join('، ')})</span>
                            )}
                            {idx < cat.items.length - 1 ? '، ' : '.'}
                          </span>
                        ))}
                        
                        {cat.categoryConditions.length > 0 && (
                          <strong style={{ color: colors.warning }}> | ملاحظات: {cat.categoryConditions.join('، ')}.</strong>
                        )}
                        
                        {cat.options.sumMeters && Object.keys(groupedAreas).length > 1 && (
                          <span style={{ color: colors.primary }}> | التجميع: {Object.entries(groupedAreas).map(([group, area]) => `${group}: ${area} م²`).join('، ')}.</span>
                        )}
                        
                        {cat.options.containerState === 'with' && (
                          <span style={{ color: colors.warning }}> شامل الحاوية ({cat.options.containerAmount} ﷼).</span>
                        )}
                        {cat.options.containerState === 'without' && (
                          <span style={{ color: colors.danger }}> غير شامل الحاوية.</span>
                        )}
                        {cat.options.materialsState === 'with' && (
                          <span style={{ color: colors.success }}> شامل المواد ({cat.options.materialsAmount} ﷼).</span>
                        )}
                        {cat.options.materialsState === 'without' && (
                          <span style={{ color: colors.danger }}> غير شامل المواد.</span>
                        )}
                        
                        {cat.options.showPrice && (
                          <strong style={{ color: colors.success }}> | الإجمالي: {formatNumber(catTotals.finalTotal)} ر.س</strong>
                        )}
                      </div>
                    )}

                    {/* ─────────────────────────────────────────────────────────────── */}
                    {/* شروط وملاحظات عامة للفئة */}
                    {/* ─────────────────────────────────────────────────────────────── */}
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px dashed ${colors.warning}30` }}>
                      <div style={{ fontSize: 10, color: colors.warning, marginBottom: 8 }}>📋 شروط وملاحظات عامة للفئة</div>

                      {cat.categoryConditions.length > 0 && (
                        <div style={{ marginBottom: 10 }}>
                          {cat.categoryConditions.map((condition, condIdx) => (
                            <div 
                              key={condIdx}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '8px 12px',
                                borderRadius: 8,
                                border: `1px solid ${colors.warning}30`,
                                background: `${colors.warning}10`,
                                marginBottom: 6
                              }}
                            >
                              <span style={{ color: colors.warning, fontSize: 12 }}>•</span>
                              <span style={{ flex: 1, color: colors.text, fontSize: 12 }}>{condition}</span>
                              <button
                                onClick={() => deleteCategoryCondition(cat.id, condIdx)}
                                style={{
                                  padding: '2px 8px',
                                  borderRadius: 4,
                                  border: 'none',
                                  background: `${colors.danger}20`,
                                  color: colors.danger,
                                  fontSize: 11,
                                  cursor: 'pointer'
                                }}
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* أزرار إضافة الشروط */}
                      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                        <div style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          height: 30, padding: '0 12px',
                          borderRadius: 8,
                          border: `1px solid ${colors.warning}`,
                          background: colors.bg,
                          
                        }}>
                          <span style={{ color: colors.warning, fontSize: 12, fontWeight: 600 }}>الشرط</span>
                          <select
                            value=""
                            onChange={(e) => {
                              if (e.target.value) {
                                addCategoryCondition(cat.id, e.target.value);
                              }
                            }}
                            style={{
                              flex: 1,
                              padding: '0 8px 0 0',
                              border: 'none',
                              background: 'transparent',
                              color: '#fff',
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: 'pointer',
                              outline: 'none'
                            }}
                          >
                            <option value="" style={{ background: colors.bg }}>اختر من القائمة</option>
                            {predefinedConditions
                              .filter(c => !cat.categoryConditions.includes(c))
                              .map((cond, idx) => (
                                <option key={idx} value={cond} style={{ background: colors.bg }}>{cond}</option>
                              ))
                            }
                          </select>
                        </div>

                        <button
                          onClick={() => setAddingCategoryCondition(addingCategoryCondition === cat.id ? null : cat.id)}
                          style={{
                            height: 30, padding: '0 12px',
                            borderRadius: 8,
                            border: `1px solid ${colors.warning}`,
                            background: addingCategoryCondition === cat.id ? `${colors.warning}20` : `${colors.warning}15`,
                            color: colors.warning,
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: 'pointer',
                            
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <span style={{ fontWeight: 900 }}>+</span> أدخل شرط يدوي
                        </button>
                      </div>

                      {/* بوكس لا توجد شروط - أسفل الأزرار */}
                      {cat.categoryConditions.length === 0 && (
                        <div style={{ 
                          padding: '12px', 
                          textAlign: 'center', 
                          color: colors.warning, 
                          fontSize: 11,
                          border: `1px solid ${colors.warning}`,
                          background: `${colors.warning}15`,
                          borderRadius: 8,
                          marginBottom: 10
                        }}>
                          لا توجد شروط عامة
                        </div>
                      )}

                      {/* حقل الإدخال اليدوي */}
                      {addingCategoryCondition === cat.id && (
                        <div style={{ 
                          display: 'flex', 
                          gap: 8, 
                          marginTop: 8,
                          padding: 10,
                          borderRadius: 8,
                          border: `1px solid ${colors.warning}`,
                          background: `${colors.warning}08`
                        }}>
                          <input
                            type="text"
                            value={newCategoryConditionText}
                            onChange={(e) => setNewCategoryConditionText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && newCategoryConditionText.trim()) {
                                addCategoryCondition(cat.id, newCategoryConditionText);
                              }
                            }}
                            placeholder="اكتب الشرط هنا..."
                            autoFocus
                            style={{
                              flex: 1,
                              height: 30, padding: '0 12px',
                              borderRadius: 6,
                              border: `1px solid ${colors.border}`,
                              background: colors.bg,
                              color: colors.text,
                              fontSize: 12,
                              outline: 'none'
                            }}
                          />
                          <button
                            onClick={() => {
                              if (newCategoryConditionText.trim()) {
                                addCategoryCondition(cat.id, newCategoryConditionText);
                              }
                            }}
                            disabled={!newCategoryConditionText.trim()}
                            style={{
                              height: 30, padding: '0 12px',
                              borderRadius: 6,
                              border: 'none',
                              background: newCategoryConditionText.trim() ? colors.success : colors.border,
                              color: '#fff',
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: newCategoryConditionText.trim() ? 'pointer' : 'not-allowed'
                            }}
                          >
                            إضافة
                          </button>
                          <button
                            onClick={() => {
                              setAddingCategoryCondition(null);
                              setNewCategoryConditionText('');
                            }}
                            style={{
                              height: 30, padding: '0 12px',
                              borderRadius: 6,
                              border: `1px solid ${colors.border}`,
                              background: 'transparent',
                              color: colors.muted,
                              fontSize: 12,
                              cursor: 'pointer'
                            }}
                          >
                            إلغاء
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  )}

                  {/* ═══════════════════════════════════════════════════════════════════ */}
                  {/* إجمالي البنود والأسعار (الإطار الأزرق) - قابل للطي */}
                  {/* ═══════════════════════════════════════════════════════════════════ */}
                  {expandedPriceSummary[cat.id] && (
                  <div style={{ 
                    padding: 16, 
                    background: `${colors.primary}10`, 
                    borderRadius: 12,
                    border: `1px solid ${colors.primary}30`
                  }}>
                    {/* عنوان القسم */}
                    <div style={{ 
                      fontSize: 12, 
                      fontWeight: 700, 
                      color: colors.primary, 
                      marginBottom: 12,
                      paddingBottom: 8,
                      borderBottom: `1px solid ${colors.primary}30`
                    }}>
                      💰 إجمالي البنود والأسعار
                    </div>

                    {/* الإضافات - عمودياً */}
                    <div style={{ 
                      marginBottom: 12,
                      paddingBottom: 12,
                      borderBottom: `1px dashed ${colors.primary}30`
                    }}>
                      {(() => {
                        // بناء مصفوفة العناصر المرئية
                        const visibleRows = [
                          { id: 'base', visible: true },
                          { id: 'container', visible: cat.options.containerState === 'with' },
                          { id: 'materials', visible: cat.options.materialsState === 'with' },
                          { id: 'custom', visible: true },
                          { id: 'profit', visible: true },
                          { id: 'discountAmount', visible: true },
                          { id: 'discountPercent', visible: true },
                          { id: 'tax', visible: true }
                        ].filter(r => r.visible);
                        
                        const getRowBg = (id) => {
                          const idx = visibleRows.findIndex(r => r.id === id);
                          return idx % 2 === 0 ? `${colors.text}06` : 'transparent';
                        };

                        return (
                          <>
                            {/* الأسعار الأساسية */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 6px', borderRadius: 6, background: getRowBg('base') }}>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                height: 30, padding: '0 12px',
                                borderRadius: 8,
                                border: `1px solid ${colors.text}`,
                                background: `${colors.text}15`,
                                width: 150,
                                
                              }}>
                                <span style={{ color: colors.text, fontSize: 12, fontWeight: 600 }}>الأسعار الأساسية</span>
                              </div>
                              <span style={{ fontSize: 12, fontWeight: 600, color: colors.text, minWidth: 90, textAlign: 'left' }}>
                                {formatNumber(catTotals.totalPrice)} ر.س
                              </span>
                            </div>

                            {/* الحاوية */}
                            {cat.options.containerState === 'with' && (
                              <div style={{ padding: '4px 6px', borderRadius: 6, background: getRowBg('container') }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <div 
                                    onClick={(e) => e.currentTarget.querySelector('input')?.focus()}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      height: 30, padding: '0 12px',
                                      borderRadius: 8,
                                      border: `1px solid ${colors.warning}`,
                                      background: `${colors.warning}10`,
                                      width: 150,
                                      
                                      cursor: 'pointer'
                                    }}>
                                    <span style={{ width: '50%', color: colors.warning, fontSize: 12, fontWeight: 600 }}>الحاوية</span>
                                    <div style={{ width: '30%', textAlign: 'center' }}>
                                      <input
                                        type="number"
                                        inputMode="numeric"
                                        value={cat.options.totalsContainerAmount || ''}
                                        onChange={(e) => updateCategoryOptions(cat.id, 'totalsContainerAmount', parseFloat(e.target.value) || 0)}
                                        onFocus={(e) => e.target.select()}
                                        placeholder="0"
                                        style={{
                                          width: '100%',
                                          padding: 0,
                                          border: 'none',
                                          background: 'transparent',
                                          color: '#fff',
                                          fontSize: 12,
                                          fontWeight: 700,
                                          textAlign: 'center',
                                          outline: 'none'
                                        }}
                                      />
                                    </div>
                                    <span style={{ width: '20%', color: colors.warning, fontSize: 11, fontWeight: 700, textAlign: 'left', paddingRight: 4 }}>﷼</span>
                                  </div>
                                  <span style={{ fontSize: 12, fontWeight: 600, color: colors.warning, minWidth: 90, textAlign: 'left' }}>
                                    +{formatNumber(cat.options.totalsContainerAmount || 0)} ر.س
                                  </span>
                                </div>
                                {isContainerPriceDifferent(cat) && (
                                  <div style={{ fontSize: 10, color: colors.danger, marginTop: 4, marginRight: 4 }}>
                                    ⚠️ السعر مختلف عن الأعلى ({cat.options.containerAmount} ﷼)
                                  </div>
                                )}
                              </div>
                            )}

                            {/* المواد */}
                            {cat.options.materialsState === 'with' && (
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 6px', borderRadius: 6, background: getRowBg('materials') }}>
                                <div 
                                  onClick={(e) => e.currentTarget.querySelector('input')?.focus()}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    height: 30, padding: '0 12px',
                                    borderRadius: 8,
                                    border: `1px solid ${colors.success}`,
                                    background: `${colors.success}10`,
                                    width: 150,
                                    
                                    cursor: 'pointer'
                                  }}>
                                  <span style={{ width: '50%', color: colors.success, fontSize: 12, fontWeight: 600 }}>المواد</span>
                                  <div style={{ width: '30%', textAlign: 'center' }}>
                                    <input
                                      type="number"
                                      inputMode="numeric"
                                      value={cat.options.materialsAmount || ''}
                                      onChange={(e) => updateCategoryOptions(cat.id, 'materialsAmount', parseFloat(e.target.value) || 0)}
                                      onFocus={(e) => e.target.select()}
                                      placeholder="0"
                                      style={{
                                        width: '100%',
                                        padding: 0,
                                        border: 'none',
                                        background: 'transparent',
                                        color: '#fff',
                                        fontSize: 12,
                                        fontWeight: 700,
                                        textAlign: 'center',
                                        outline: 'none'
                                      }}
                                    />
                                  </div>
                                  <span style={{ width: '20%', color: colors.success, fontSize: 11, fontWeight: 700, textAlign: 'left', paddingRight: 4 }}>﷼</span>
                                </div>
                                <span style={{ fontSize: 12, fontWeight: 600, color: colors.success, minWidth: 90, textAlign: 'left' }}>
                                  +{formatNumber(catTotals.materialsValue)} ر.س
                                </span>
                              </div>
                            )}

                            {/* مبلغ إضافي */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 6px', borderRadius: 6, background: getRowBg('custom') }}>
                              <div 
                                onClick={(e) => e.currentTarget.querySelector('input')?.focus()}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  height: 30, padding: '0 12px',
                                  borderRadius: 8,
                                  border: `1px solid ${colors.success}`,
                                  background: `${colors.success}10`,
                                  width: 150,
                                  
                                  cursor: 'pointer'
                                }}>
                                <span style={{ width: '50%', color: colors.success, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>مبلغ إضافي</span>
                                <div style={{ width: '30%', textAlign: 'center' }}>
                                  <input
                                    type="number"
                                    inputMode="numeric"
                                    value={cat.options.customAmount || ''}
                                    onChange={(e) => updateCategoryOptions(cat.id, 'customAmount', parseFloat(e.target.value) || 0)}
                                    onFocus={(e) => e.target.select()}
                                    placeholder="0"
                                    style={{
                                      width: '100%',
                                      padding: 0,
                                      border: 'none',
                                      background: 'transparent',
                                      color: '#fff',
                                      fontSize: 12,
                                      fontWeight: 700,
                                      textAlign: 'center',
                                      outline: 'none'
                                    }}
                                  />
                                </div>
                                <span style={{ width: '20%', color: colors.success, fontSize: 11, fontWeight: 700, textAlign: 'left', paddingRight: 4 }}>﷼</span>
                              </div>
                              <span style={{ fontSize: 12, fontWeight: 600, color: colors.success, minWidth: 90, textAlign: 'left' }}>
                                {cat.options.customAmount > 0 ? `+${formatNumber(cat.options.customAmount)} ر.س` : '—'}
                              </span>
                            </div>

                            {/* إضافة نسبة */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 6px', borderRadius: 6, background: getRowBg('profit') }}>
                              <div 
                                onClick={(e) => e.currentTarget.querySelector('input')?.focus()}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  height: 30, padding: '0 12px',
                                  borderRadius: 8,
                                  border: `1px solid ${colors.success}`,
                                  background: `${colors.success}10`,
                                  width: 150,
                                  
                                  cursor: 'pointer'
                                }}>
                                <span style={{ width: '50%', color: colors.success, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>إضافة نسبة</span>
                                <div style={{ width: '30%', textAlign: 'center' }}>
                                  <input
                                    type="number"
                                    inputMode="numeric"
                                    value={cat.options.profitPercent || ''}
                                    onChange={(e) => updateCategoryOptions(cat.id, 'profitPercent', parseFloat(e.target.value) || 0)}
                                    onFocus={(e) => e.target.select()}
                                    placeholder="0"
                                    style={{
                                      width: '100%',
                                      padding: 0,
                                      border: 'none',
                                      background: 'transparent',
                                      color: '#fff',
                                      fontSize: 12,
                                      fontWeight: 700,
                                      textAlign: 'center',
                                      outline: 'none'
                                    }}
                                  />
                                </div>
                                <span style={{ width: '20%', color: colors.success, fontSize: 11, fontWeight: 700, textAlign: 'left', paddingRight: 4 }}>%</span>
                              </div>
                              <span style={{ fontSize: 12, fontWeight: 600, color: colors.success, minWidth: 90, textAlign: 'left' }}>
                                {cat.options.profitPercent > 0 ? `+${formatNumber(catTotals.profitAmount)} ر.س` : '—'}
                              </span>
                            </div>

                            {/* خصم إضافي */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 6px', borderRadius: 6, background: getRowBg('discountAmount') }}>
                              <div 
                                onClick={(e) => e.currentTarget.querySelector('input')?.focus()}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  height: 30, padding: '0 12px',
                                  borderRadius: 8,
                                  border: `1px solid ${colors.danger}`,
                                  background: `${colors.danger}10`,
                                  width: 150,
                                  
                                  cursor: 'pointer'
                                }}>
                                <span style={{ width: '50%', color: colors.danger, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>خصم إضافي</span>
                                <div style={{ width: '30%', textAlign: 'center' }}>
                                  <input
                                    type="number"
                                    inputMode="numeric"
                                    value={cat.options.discountAmount || ''}
                                    onChange={(e) => updateCategoryOptions(cat.id, 'discountAmount', parseFloat(e.target.value) || 0)}
                                    onFocus={(e) => e.target.select()}
                                    placeholder="0"
                                    style={{
                                      width: '100%',
                                      padding: 0,
                                      border: 'none',
                                      background: 'transparent',
                                      color: '#fff',
                                      fontSize: 12,
                                      fontWeight: 700,
                                      textAlign: 'center',
                                      outline: 'none'
                                    }}
                                  />
                                </div>
                                <span style={{ width: '20%', color: colors.danger, fontSize: 11, fontWeight: 700, textAlign: 'left', paddingRight: 4 }}>﷼</span>
                              </div>
                              <span style={{ fontSize: 12, fontWeight: 600, color: colors.danger, minWidth: 90, textAlign: 'left' }}>
                                {cat.options.discountAmount > 0 ? `-${formatNumber(catTotals.discountByAmount)} ر.س` : '—'}
                              </span>
                            </div>

                            {/* خصم نسبة */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 6px', borderRadius: 6, background: getRowBg('discountPercent') }}>
                              <div 
                                onClick={(e) => e.currentTarget.querySelector('input')?.focus()}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  height: 30, padding: '0 12px',
                                  borderRadius: 8,
                                  border: `1px solid ${colors.danger}`,
                                  background: `${colors.danger}10`,
                                  width: 150,
                                  
                                  cursor: 'pointer'
                                }}>
                                <span style={{ width: '50%', color: colors.danger, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>خصم نسبة</span>
                                <div style={{ width: '30%', textAlign: 'center' }}>
                                  <input
                                    type="number"
                                    inputMode="numeric"
                                    value={cat.options.discountPercent || ''}
                                    onChange={(e) => updateCategoryOptions(cat.id, 'discountPercent', parseFloat(e.target.value) || 0)}
                                    onFocus={(e) => e.target.select()}
                                    placeholder="0"
                                    style={{
                                      width: '100%',
                                      padding: 0,
                                      border: 'none',
                                      background: 'transparent',
                                      color: '#fff',
                                      fontSize: 12,
                                      fontWeight: 700,
                                      textAlign: 'center',
                                      outline: 'none'
                                    }}
                                  />
                                </div>
                                <span style={{ width: '20%', color: colors.danger, fontSize: 11, fontWeight: 700, textAlign: 'left', paddingRight: 4 }}>%</span>
                              </div>
                              <span style={{ fontSize: 12, fontWeight: 600, color: colors.danger, minWidth: 90, textAlign: 'left' }}>
                                {cat.options.discountPercent > 0 ? `-${formatNumber(catTotals.discountByPercent)} ر.س` : '—'}
                              </span>
                            </div>

                            {/* الضريبة */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 6px', borderRadius: 6, background: getRowBg('tax') }}>
                              <div 
                                onClick={(e) => e.currentTarget.querySelector('input')?.focus()}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  height: 30, padding: '0 12px',
                                  borderRadius: 8,
                                  border: `1px solid ${colors.primary}`,
                                  background: `${colors.primary}10`,
                                  width: 150,
                                  
                                  cursor: 'pointer'
                                }}>
                                <span style={{ width: '50%', color: colors.primary, fontSize: 12, fontWeight: 600 }}>الضريبة</span>
                                <div style={{ width: '30%', textAlign: 'center' }}>
                                  <input
                                    type="number"
                                    inputMode="numeric"
                                    value={cat.options.taxPercent || ''}
                                    onChange={(e) => updateCategoryOptions(cat.id, 'taxPercent', parseFloat(e.target.value) || 0)}
                                    onFocus={(e) => e.target.select()}
                                    placeholder="0"
                                    style={{
                                      width: '100%',
                                      padding: 0,
                                      border: 'none',
                                      background: 'transparent',
                                      color: '#fff',
                                      fontSize: 12,
                                      fontWeight: 700,
                                      textAlign: 'center',
                                      outline: 'none'
                                    }}
                                  />
                                </div>
                                <span style={{ width: '20%', color: colors.primary, fontSize: 11, fontWeight: 700, textAlign: 'left', paddingRight: 4 }}>%</span>
                              </div>
                              <span style={{ fontSize: 12, fontWeight: 600, color: colors.primary, minWidth: 90, textAlign: 'left' }}>
                                {cat.options.taxPercent > 0 ? `+${formatNumber(catTotals.taxAmount)} ر.س` : '—'}
                              </span>
                            </div>
                          </>
                        );
                      })()}
                    </div>

                    {/* الإجمالي النهائي */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center'
                    }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: colors.primary }}>الإجمالي النهائي</span>
                      <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>
                        {formatNumber(catTotals.finalTotal)} <span style={{ fontSize: 12, fontWeight: 400 }}>ريال</span>
                      </div>
                    </div>
                  </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* زر إضافة فئة جديدة - يظهر فقط عند وجود فئات */}
        {categories.filter(cat => cat.items.length > 0).length > 0 && (
        <button style={{
          width: '100%',
          height: 30,
          padding: '0 12px',
          borderRadius: 8,
          border: `1px solid ${colors.success}`,
          background: `${colors.success}15`,
          color: colors.success,
          fontSize: 12,
          fontWeight: 700,
          cursor: 'pointer',
          marginTop: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6
        }}>
          <span style={{ fontWeight: 900 }}>+</span> إضافة فئة جديدة
        </button>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════════ */}
        {/* تسمية قسم الإجمالي - يظهر فقط عند وجود فئات بها بنود */}
        {/* ═══════════════════════════════════════════════════════════════════════════ */}
        {categories.filter(cat => cat.items.length > 0).length > 0 && (
        <>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 12, 
          margin: '24px 0 16px 0',
          padding: '0 8px'
        }}>
          <div style={{ 
            width: 32, height: 32, 
            background: `linear-gradient(135deg, ${colors.success}, ${colors.cyan})`,
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16
          }}>💰</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: colors.text }}>ملخص العرض</div>
            <div style={{ fontSize: 11, color: colors.muted }}>الإجمالي النهائي شامل جميع الفئات</div>
          </div>
          <div style={{ flex: 1, height: 1, background: colors.border, marginRight: 12 }}></div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════════ */}
        {/* الإجمالي الكلي */}
        {/* ═══════════════════════════════════════════════════════════════════════════ */}
        <div style={{
          background: `linear-gradient(135deg, ${colors.success}20, ${colors.primary}20)`,
          borderRadius: 16,
          padding: 24,
          border: `2px solid ${colors.success}50`,
          textAlign: 'center',
          marginTop: 16
        }}>
          <div style={{ fontSize: 14, color: colors.muted, marginBottom: 8 }}>
            💰 الإجمالي الكلي للعرض
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
            {formatNumber(getGrandTotal())}
          </div>
          <div style={{ fontSize: 14, color: colors.success, fontWeight: 600 }}>
            ريال سعودي
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 24, 
            marginTop: 16,
            paddingTop: 16,
            borderTop: `1px dashed ${colors.border}`
          }}>
            <div style={{ fontSize: 12, color: colors.muted }}>
              الفئات: <span style={{ color: colors.text, fontWeight: 600 }}>{categories.filter(cat => cat.items.length > 0).length}</span>
            </div>
            <div style={{ fontSize: 12, color: colors.muted }}>
              البنود: <span style={{ color: colors.text, fontWeight: 600 }}>
                {categories.reduce((sum, cat) => sum + cat.items.length, 0)}
              </span>
            </div>
            <div style={{ fontSize: 12, color: colors.muted }}>
              المساحة: <span style={{ color: colors.text, fontWeight: 600 }}>
                {categories.reduce((sum, cat) => sum + getCategoryTotalArea(cat), 0)} م²
              </span>
            </div>
          </div>
        </div>
        </>
        )}
        <div style={{ 
          marginTop: 20, 
          padding: 16, 
          background: `${colors.success}10`, 
          borderRadius: 12, 
          border: `1px solid ${colors.success}30` 
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: colors.success, marginBottom: 8 }}>💡 كيفية الاستخدام:</div>
          <ul style={{ color: colors.text, fontSize: 13, lineHeight: 2, paddingRight: 20, margin: 0 }}>
            <li><strong>اضغط على الفئة</strong> → تفتح صفحة التحرير الكاملة</li>
            <li><strong>اضغط على أي بند</strong> → يفتح وضع التحرير المباشر</li>
            <li><strong>عدّل أي قيمة</strong> → الكود، الاسم، المكان، المساحة، السعر</li>
            <li><strong>أزرار الحاوية/المواد</strong> → 3 حالات بالضغط المتكرر</li>
            <li><strong>كل شيء في مكان واحد</strong> → بدون نوافذ منبثقة!</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default FullCombinedDesign;
