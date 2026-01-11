// ═══════════════════════════════════════════════════════════════════════════════════
// CalculatorSection.jsx - الملف الكامل
// ═══════════════════════════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { dimensionOptions } from './colorsandconstants';

const CalculatorSection = ({ colors, places, workItems, programming, itemTypes, categories, setCategories, formatNumber, getColor, placeTypeColors }) => {

  // ═══════════════════════════════════════════════════════════════════════════════════
  // أيقونات صلب عصري (Solido Moderno)
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
      JBS: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="4" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.2"/>
          <rect x="5" y="8" width="14" height="3" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.2"/>
          <path d="M7 11v6M12 11v8M17 11v6" stroke={color} strokeWidth="1.2"/>
        </svg>
      ),
    };
    return icons[code] || icons.BLT;
  };

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
  const [expandedConditions, setExpandedConditions] = useState({});
  const [expandedPriceSummary, setExpandedPriceSummary] = useState({});
  const [phase1Expanded, setPhase1Expanded] = useState(true);
  const [selectedPlaceType, setSelectedPlaceType] = useState('dry');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [dimensions, setDimensions] = useState({ length: 4, width: 4, height: 3 });
  const [activeMainItems, setActiveMainItems] = useState({});

  const heightOptions = [2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6];
  const placesList = places[selectedPlaceType]?.places || [];

  // ═══════════════════════════════════════════════════════════════════════════════════
  // الدوال المساعدة
  // ═══════════════════════════════════════════════════════════════════════════════════
  const getItemArea = (item) => item.places?.reduce((sum, p) => sum + (p.area || 0), 0) || 0;
  const getCategoryTotalArea = (cat) => cat.items?.reduce((sum, item) => sum + getItemArea(item), 0) || 0;
  const getCategoryItemsTotal = (cat) => cat.items?.reduce((sum, item) => sum + getItemArea(item) * item.price, 0) || 0;

  const getGroupedAreas = (cat) => {
    return cat.items?.reduce((acc, item) => {
      acc[item.group || 'عام'] = (acc[item.group || 'عام'] || 0) + getItemArea(item);
      return acc;
    }, {}) || {};
  };

  const calculateCategoryTotals = (cat) => {
    const totalPrice = getCategoryItemsTotal(cat);
    const containerValue = cat.options?.containerState === 'with' ? (cat.options?.totalsContainerAmount || 0) : 0;
    const materialsValue = cat.options?.materialsState === 'with' ? (cat.options?.materialsAmount || 0) : 0;
    const baseTotal = totalPrice + containerValue + materialsValue + (cat.options?.customAmount || 0);
    const profitAmount = baseTotal * (cat.options?.profitPercent || 0) / 100;
    const withProfit = baseTotal + profitAmount;
    const discountByPercent = withProfit * (cat.options?.discountPercent || 0) / 100;
    const discountByAmount = cat.options?.discountAmount || 0;
    const totalDiscount = discountByPercent + discountByAmount;
    const afterDiscount = withProfit - totalDiscount;
    const taxAmount = afterDiscount * (cat.options?.taxPercent || 0) / 100;
    const finalTotal = afterDiscount + taxAmount;
    return { totalPrice, containerValue, materialsValue, baseTotal, profitAmount, withProfit, discountByPercent, discountByAmount, totalDiscount, afterDiscount, taxAmount, finalTotal };
  };

  const getGrandTotal = () => (categories || []).reduce((sum, cat) => sum + calculateCategoryTotals(cat).finalTotal, 0);
  const isContainerPriceDifferent = (cat) => cat.options?.containerAmount !== cat.options?.totalsContainerAmount;

  // ═══════════════════════════════════════════════════════════════════════════════════
  // دوال التحديث
  // ═══════════════════════════════════════════════════════════════════════════════════
  const updateCategoryOptions = (catId, field, value) => {
    setCategories(prev => prev.map(cat => 
      cat.id === catId ? { ...cat, options: { ...cat.options, [field]: value } } : cat
    ));
  };

  const addPlaceToActiveCategories = () => {
    if (!selectedPlace) return;
    const newPlace = { id: 'p' + Date.now(), name: selectedPlace, length: dimensions.length, width: dimensions.width, height: dimensions.height, area: dimensions.length * dimensions.width };
    const activeCatKeys = Object.keys(activeMainItems).filter(k => activeMainItems[k]);

    setCategories(prev => {
      let updated = [...(prev || [])];
      activeCatKeys.forEach(catKey => {
        const catConfig = workItems[catKey];
        if (!catConfig) return;
        const existingCat = updated.find(c => c.code === catConfig.code);

        if (existingCat) {
          updated = updated.map(cat => {
            if (cat.code !== catConfig.code) return cat;
            if (cat.items.length === 0) return { ...cat, pendingPlaces: [...(cat.pendingPlaces || []), { ...newPlace, id: 'p' + Date.now() + catKey }], needsSubItemSelection: true };
            return { ...cat, items: cat.items.map((item, idx) => idx === 0 ? { ...item, places: [...item.places, { ...newPlace, id: 'p' + Date.now() + idx }] } : item) };
          });
        } else {
          updated.push({
            id: 'cat' + Date.now() + catKey, code: catConfig.code, name: catConfig.name, color: getColor(Object.keys(workItems).indexOf(catKey)),
            subItems: catConfig.items.map(item => ({ code: `${catConfig.code}${item.num}`, name: item.name, price: item.exec, group: catConfig.name, type: item.typeId })),
            items: [], pendingPlaces: [{ ...newPlace, id: 'p' + Date.now() + catKey }], needsSubItemSelection: true,
            categoryConditions: [],
            options: { containerState: 'notMentioned', containerAmount: 0, materialsState: 'notMentioned', materialsAmount: 0, showMeters: true, sumMeters: true, showPrice: false, customAmount: 0, profitPercent: 0, discountPercent: 0, discountAmount: 0, taxPercent: 15, totalsContainerAmount: 0 }
          });
        }
      });
      return updated;
    });
    setSelectedPlace('');
  };

  const selectPendingSubItem = (catId, placeId, subItemCode) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      const subItem = cat.subItems?.find(s => s.code === subItemCode);
      const place = cat.pendingPlaces?.find(p => p.id === placeId);
      if (!subItem || !place) return cat;
      const newItem = { id: Date.now(), code: subItem.code, name: subItem.name, price: subItem.price, group: subItem.group, type: subItem.type, places: [{ ...place }], conditions: [] };
      const newPendingPlaces = cat.pendingPlaces.filter(p => p.id !== placeId);
      return { ...cat, items: [...cat.items, newItem], pendingPlaces: newPendingPlaces, needsSubItemSelection: newPendingPlaces.length > 0 };
    }));
  };

  const changeSubItem = (catId, itemId, newCode) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      const sub = cat.subItems?.find(s => s.code === newCode);
      if (!sub) return cat;
      return { ...cat, items: cat.items.map(item => item.id === itemId ? { ...item, code: sub.code, name: sub.name, price: sub.price, group: sub.group } : item) };
    }));
  };

  const updatePlace = (catId, itemId, placeId, field, value) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return { ...cat, items: cat.items.map(item => {
        if (item.id !== itemId) return item;
        return { ...item, places: item.places.map(place => {
          if (place.id !== placeId) return place;
          const updated = { ...place, [field]: field === 'name' ? value : parseFloat(value) || 0 };
          if (field === 'manualArea') { updated.area = parseFloat(value) || 0; updated.manualArea = parseFloat(value) || 0; }
          else if (field === 'length' || field === 'width') { updated.area = updated.length * updated.width; delete updated.manualArea; }
          return updated;
        })};
      })};
    }));
  };

  const addPlace = (catId, itemId) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return { ...cat, items: cat.items.map(item => item.id !== itemId ? item : { ...item, places: [...item.places, { id: 'p' + Date.now(), name: placesList[0] || 'مكان', length: 4, width: 4, height: 3, area: 16 }] }) };
    }));
  };

  const deletePlace = (catId, itemId, placeId) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return { ...cat, items: cat.items.map(item => item.id !== itemId ? item : { ...item, places: item.places.filter(p => p.id !== placeId) }) };
    }));
  };

  const addItem = (catId) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      const sub = cat.subItems?.[0] || { code: 'XX01', name: 'بند جديد', price: 0, group: 'عام' };
      return { ...cat, items: [...cat.items, { id: Date.now(), code: sub.code, name: sub.name, price: sub.price, group: sub.group, places: [{ id: 'p' + Date.now(), name: placesList[0] || 'مكان', length: 4, width: 4, height: 3, area: 16 }], conditions: [] }] };
    }));
  };

  const deleteItem = (catId, itemId) => {
    setCategories(prev => prev.map(cat => cat.id !== catId ? cat : { ...cat, items: cat.items.filter(item => item.id !== itemId) }));
    setEditingItemId(null);
  };

  const addCondition = (catId, itemId, conditionText) => {
    if (!conditionText.trim()) return;
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return { ...cat, items: cat.items.map(item => {
        if (item.id !== itemId) return item;
        if (item.conditions?.includes(conditionText.trim())) return item;
        return { ...item, conditions: [...(item.conditions || []), conditionText.trim()] };
      })};
    }));
    setNewConditionText('');
    setAddingConditionForItem(null);
  };

  const deleteCondition = (catId, itemId, conditionIndex) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return { ...cat, items: cat.items.map(item => item.id !== itemId ? item : { ...item, conditions: item.conditions.filter((_, idx) => idx !== conditionIndex) }) };
    }));
  };

  const addCategoryCondition = (catId, conditionText) => {
    if (!conditionText.trim()) return;
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      if (cat.categoryConditions?.includes(conditionText.trim())) return cat;
      return { ...cat, categoryConditions: [...(cat.categoryConditions || []), conditionText.trim()] };
    }));
    setNewCategoryConditionText('');
    setAddingCategoryCondition(null);
  };

  const deleteCategoryCondition = (catId, conditionIndex) => {
    setCategories(prev => prev.map(cat => cat.id !== catId ? cat : { ...cat, categoryConditions: cat.categoryConditions.filter((_, idx) => idx !== conditionIndex) }));
  };

  const hasCategories = (categories || []).filter(cat => cat.items?.length > 0 || cat.pendingPlaces?.length > 0).length > 0;

  // ═══════════════════════════════════════════════════════════════════════════════════
  // العرض (Render)
  // ═══════════════════════════════════════════════════════════════════════════════════
  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* المرحلة الأولى - إدخال البيانات */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      <div style={{ background: colors.card, borderRadius: 16, border: phase1Expanded ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`, overflow: 'hidden', marginBottom: 20 }}>
        <div onClick={() => setPhase1Expanded(!phase1Expanded)} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: 16, background: phase1Expanded ? `${colors.primary}10` : 'transparent' }}>
          <div style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.cyan})`, padding: '12px 16px', borderRadius: 10, marginLeft: 12 }}><span style={{ fontSize: 24 }}>📐</span></div>
          <div style={{ flex: 1 }}><div style={{ fontSize: 16, fontWeight: 700, color: colors.text }}>المرحلة الأولى - إدخال البيانات</div><div style={{ fontSize: 11, color: colors.muted }}>🏗️ {Object.values(activeMainItems).filter(v => v).length} بنود مفعّلة</div></div>
          <span style={{ fontSize: 16, color: colors.primary, transform: phase1Expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>
        </div>

        {phase1Expanded && (
          <div style={{ padding: 16, borderTop: `1px dashed ${colors.primary}40` }}>
            {/* اختيار النوع والمكان */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <select value={selectedPlaceType} onChange={(e) => { setSelectedPlaceType(e.target.value); setSelectedPlace(''); }} style={{ flex: 1, height: 40, borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 14, padding: '0 12px' }}>
                {Object.entries(places).filter(([_, pt]) => pt.enabled).map(([key, pt]) => (<option key={key} value={key}>{pt.icon} {pt.name}</option>))}
              </select>
              <select value={selectedPlace} onChange={(e) => setSelectedPlace(e.target.value)} style={{ flex: 2, height: 40, borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 14, padding: '0 12px' }}>
                <option value="">-- اختر المكان --</option>
                {placesList.map(place => (<option key={place} value={place}>{place}</option>))}
              </select>
            </div>

            {/* البنود الرئيسية */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
              {Object.entries(workItems).map(([catKey, cat], idx) => {
                if (!programming[selectedPlaceType]?.[catKey]?.enabled) return null;
                const catColor = getColor(idx);
                return (<button key={catKey} onClick={() => setActiveMainItems(prev => ({ ...prev, [catKey]: !prev[catKey] }))} style={{ height: 32, padding: '0 10px', borderRadius: 6, border: `1px solid ${activeMainItems[catKey] ? catColor : colors.border}`, background: activeMainItems[catKey] ? `${catColor}20` : 'transparent', color: activeMainItems[catKey] ? catColor : colors.muted, fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}><span>{cat.icon}</span><span>{cat.name}</span></button>);
              })}
            </div>

            {/* الأبعاد */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {[{ key: 'length', label: 'الطول' }, { key: 'width', label: 'العرض' }, { key: 'height', label: 'الارتفاع' }].map(dim => (
                <div key={dim.key} style={{ flex: 1 }}><div style={{ fontSize: 10, color: colors.muted, marginBottom: 4, textAlign: 'center' }}>{dim.label}</div>
                  <select value={dimensions[dim.key]} onChange={(e) => setDimensions({ ...dimensions, [dim.key]: parseFloat(e.target.value) })} style={{ width: '100%', height: 36, borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.bg, color: '#fff', fontSize: 14, textAlign: 'center' }}>
                    {(dim.key === 'height' ? heightOptions : (dimensionOptions || [1,2,3,4,5,6,7,8,9,10]).slice(0, 20)).map(n => (<option key={n} value={n}>{n} م</option>))}
                  </select>
                </div>
              ))}
              <div style={{ flex: 1 }}><div style={{ fontSize: 10, color: colors.success, marginBottom: 4, textAlign: 'center' }}>المساحة</div><div style={{ height: 36, borderRadius: 8, border: `1px solid ${colors.success}`, background: `${colors.success}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 700 }}>{dimensions.length * dimensions.width} م²</div></div>
            </div>

            {/* زر الإضافة */}
            <button onClick={addPlaceToActiveCategories} disabled={!selectedPlace || !Object.values(activeMainItems).some(v => v)} style={{ width: '100%', height: 60, borderRadius: 8, border: `1px solid ${colors.success}`, background: `${colors.success}15`, color: colors.success, fontSize: 14, fontWeight: 700, cursor: (selectedPlace && Object.values(activeMainItems).some(v => v)) ? 'pointer' : 'not-allowed', opacity: (selectedPlace && Object.values(activeMainItems).some(v => v)) ? 1 : 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><span style={{ fontSize: 20, fontWeight: 900 }}>+</span>إضافة مكان</button>
          </div>
        )}
      </div>

      {/* رسالة لا توجد فئات */}
      {!hasCategories && (<div style={{ textAlign: 'center', padding: 40, color: colors.muted, fontSize: 14, background: colors.card, borderRadius: 16, border: `1px solid ${colors.border}`, marginBottom: 16 }}><div style={{ fontSize: 50, marginBottom: 16, opacity: 0.3 }}>📦</div><div style={{ fontWeight: 600, marginBottom: 8 }}>لا توجد فئات مضافة</div><div style={{ fontSize: 12 }}>اختر مكان من المرحلة الأولى واضغط "إضافة مكان" لبدء إضافة الفئات</div></div>)}

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* الفئات */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {(categories || []).filter(cat => cat.items?.length > 0 || cat.pendingPlaces?.length > 0).map((cat) => {
        const isExpanded = expandedCategory === cat.id;
        const catTotals = calculateCategoryTotals(cat);
        const catTotalArea = getCategoryTotalArea(cat);
        const groupedAreas = getGroupedAreas(cat);
        const pendingPlaces = cat.pendingPlaces || [];
        
        const allPlaces = [];
        cat.items?.forEach(item => {
          item.places?.forEach(place => {
            allPlaces.push({ name: place.name, length: place.length, width: place.width, area: place.area, type: item.type || 'floor' });
          });
        });

        return (
          <div key={cat.id} style={{ background: colors.card, borderRadius: 16, overflow: 'hidden', marginBottom: 12, border: isExpanded ? `2px solid ${cat.color}` : `1px solid ${colors.border}`, transition: 'all 0.3s' }}>
            {/* رأس الفئة */}
            <div onClick={() => { setExpandedCategory(isExpanded ? null : cat.id); setEditingItemId(null); setAddingConditionForItem(null); setAddingCategoryCondition(null); }} style={{ display: 'flex', alignItems: 'stretch', cursor: 'pointer', background: isExpanded ? `${cat.color}08` : 'transparent' }}>
              <div style={{ display: 'flex', alignItems: 'stretch', borderLeft: `1px solid ${colors.border}` }}>
                <div style={{ width: 4, background: cat.color }}/>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px 20px', gap: 6 }}>
                  {getIcon(cat.code, cat.color, 30)}
                  <span style={{ fontSize: 10, fontWeight: 700, color: cat.color, letterSpacing: '0.5px' }}>{cat.code}</span>
                </div>
              </div>

              <div style={{ flex: 1, padding: '16px 18px' }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: colors.text, marginBottom: 6 }}>{cat.name}</div>
                
                {cat.needsSubItemSelection && pendingPlaces.length > 0 && (
                  <div style={{ background: `${colors.warning}15`, border: `1px solid ${colors.warning}40`, borderRadius: 6, padding: '6px 10px', marginBottom: 8, fontSize: 11, color: colors.warning, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 14, color: colors.warning }}>▲</span>
                    <span>هذه الفئة تحتاج إلى اختيار البنود الفرعية ({pendingPlaces.length} مكان معلق)</span>
                  </div>
                )}
                
                <div style={{ display: 'flex', gap: 12, fontSize: 11, color: colors.muted, marginBottom: 8, flexWrap: 'wrap' }}>
                  <span>📦 {cat.items?.length || 0} {(cat.items?.length || 0) === 1 ? 'بند' : 'بنود'}</span>
                  {pendingPlaces.length > 0 && <span style={{ color: colors.warning }}>⏳ {pendingPlaces.length} معلق</span>}
                  {cat.options?.containerState === 'with' && <span style={{ color: colors.warning }}>🚛 حاوية</span>}
                  {cat.options?.materialsState === 'with' && <span style={{ color: colors.success }}>🧱 مواد</span>}
                  {cat.categoryConditions?.length > 0 && <span style={{ color: colors.purple }}>📋 {cat.categoryConditions.length} شروط</span>}
                </div>
                
                {pendingPlaces.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', fontSize: 10, color: colors.text, alignItems: 'center', marginBottom: allPlaces.length > 0 ? 8 : 0 }}>
                    {pendingPlaces.map((place, idx) => (
                      <span key={idx} style={{ background: `${colors.warning}15`, padding: '3px 8px', borderRadius: 4, border: `1px dashed ${colors.warning}50` }}>
                        <span style={{ color: colors.warning }}>⏳</span> {place.name} <span style={{ color: colors.muted }}>({place.length}×{place.width}=</span><span style={{ color: colors.warning, fontWeight: 600 }}>{place.area}م</span><span style={{ color: colors.muted }}>)</span>
                      </span>
                    ))}
                  </div>
                )}
                
                {allPlaces.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', fontSize: 10, color: colors.text, alignItems: 'center' }}>
                    {allPlaces.map((place, idx) => (
                      <span key={idx} style={{ background: `${cat.color}15`, padding: '3px 8px', borderRadius: 4, border: `1px solid ${cat.color}30` }}>
                        {place.type && <span style={{ marginLeft: 4 }}>{place.type === 'floor' ? '🏠' : place.type === 'wall' ? '🧱' : '⬆️'}</span>}
                        {place.name} <span style={{ color: colors.muted }}>({place.length}×{place.width}=</span><span style={{ color: colors.success, fontWeight: 600 }}>{place.area}م</span><span style={{ color: colors.muted }}>)</span>
                      </span>
                    ))}
                    <span style={{ background: `${colors.success}20`, padding: '3px 10px', borderRadius: 4, border: `1px solid ${colors.success}50`, fontWeight: 700, color: colors.success }}>= {catTotalArea} م²</span>
                  </div>
                )}
              </div>

              <div style={{ background: `${colors.success}12`, padding: '16px 22px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: `1px solid ${colors.border}`, minWidth: 115 }}>
                <div style={{ fontSize: 9, color: colors.muted, marginBottom: 2 }}>الإجمالي</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: colors.success }}>{formatNumber(catTotals.finalTotal)}</div>
                <div style={{ fontSize: 9, color: colors.muted }}>ريال</div>
              </div>

              <div style={{ background: colors.bg, padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: `1px solid ${colors.border}`, minWidth: 55 }}>
                <span style={{ fontSize: 16, color: isExpanded ? cat.color : colors.muted, transition: 'transform 0.3s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════════════ */}
            {/* محتوى الفئة المفتوحة */}
            {/* ═══════════════════════════════════════════════════════════════════════ */}
            {isExpanded && (
              <div style={{ background: `${cat.color}05`, borderTop: `1px dashed ${cat.color}40`, padding: 16 }}>
                
                {/* الأماكن المعلقة */}
                {pendingPlaces.length > 0 && (
                  <div style={{ marginBottom: 16, background: `${colors.warning}10`, borderRadius: 12, padding: 16, border: `1px solid ${colors.warning}30` }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: colors.warning, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>⚠️ أماكن تحتاج اختيار البند الفرعي ({pendingPlaces.length})</div>
                    {pendingPlaces.map((place) => (
                      <div key={place.id} style={{ background: colors.card, borderRadius: 8, padding: 12, marginBottom: 8, border: `1px dashed ${colors.warning}50` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: colors.text, background: `${colors.warning}15`, padding: '4px 10px', borderRadius: 6 }}>⏳ {place.name} ({place.length}×{place.width}={place.area}م)</span>
                          <select defaultValue="" onChange={(e) => { if (e.target.value) selectPendingSubItem(cat.id, place.id, e.target.value); }} style={{ flex: 1, minWidth: 200, height: 36, borderRadius: 6, border: `1px solid ${cat.color}50`, background: colors.bg, color: colors.text, fontSize: 12, padding: '0 10px', cursor: 'pointer' }}>
                            <option value="">-- اختر البند الفرعي --</option>
                            {(cat.subItems || []).map(subItem => (
                              <option key={subItem.code} value={subItem.code}>{subItem.type === 'floor' ? '🏠' : subItem.type === 'wall' ? '🧱' : subItem.type === 'ceiling' ? '⬆️' : '📦'} {subItem.name} ({subItem.price}﷼)</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* قسم البنود */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: colors.text, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                    📦 البنود ({cat.items?.length || 0})
                    <span style={{ fontSize: 10, color: colors.muted, fontWeight: 400 }}>• إجمالي {catTotalArea} م² • {formatNumber(catTotals.totalPrice)} ﷼</span>
                  </div>

                  {(cat.items?.length === 0 && pendingPlaces.length === 0) && (
                    <div style={{ textAlign: 'center', padding: 20, color: colors.muted, fontSize: 12, background: colors.card, borderRadius: 8, border: `1px dashed ${colors.border}` }}>لا توجد بنود. أضف مكان من المرحلة الأولى أو اضغط على زر إضافة بند</div>
                  )}

                  {/* البنود */}
                  {(cat.items || []).map((item) => {
                    const isEditing = editingItemId === item.id;
                    const itemArea = getItemArea(item);
                    const itemTotal = itemArea * item.price;

                    return (
                      <div key={item.id} style={{ background: colors.card, borderRadius: 12, overflow: 'hidden', marginBottom: 8, border: isEditing ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`, transition: 'all 0.2s' }}>
                        {/* رأس البند */}
                        <div onClick={() => setEditingItemId(isEditing ? null : item.id)} style={{ display: 'flex', alignItems: 'stretch', cursor: 'pointer', background: isEditing ? `${colors.primary}10` : 'transparent' }}>
                          <div style={{ background: colors.primary, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 65 }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>{item.code}</span>
                          </div>
                          <div style={{ flex: 1, padding: '12px 14px' }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: colors.text, marginBottom: 6 }}>{item.name}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, color: colors.muted, marginBottom: item.conditions?.length > 0 ? 8 : 0 }}>
                              <span>📍 {item.places?.map(p => p.name).join('، ')}</span>
                              <span style={{ color: colors.border }}>|</span>
                              <span style={{ color: colors.success, fontWeight: 600 }}>{itemArea} م²</span>
                              <span style={{ color: colors.border }}>|</span>
                              <span>{item.price} ﷼/م²</span>
                            </div>
                            {item.conditions?.length > 0 && (
                              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                {item.conditions.map((cond, i) => (
                                  <span key={i} style={{ fontSize: 9, color: colors.warning, background: `${colors.warning}15`, padding: '3px 8px', borderRadius: 4, border: `1px solid ${colors.warning}25` }}>{cond}</span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div style={{ background: `${colors.success}12`, padding: '12px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: `1px solid ${colors.border}`, minWidth: 90 }}>
                            <div style={{ fontSize: 9, color: colors.muted, marginBottom: 2 }}>الإجمالي</div>
                            <div style={{ fontSize: 16, fontWeight: 700, color: colors.success }}>{formatNumber(itemTotal)}</div>
                            <div style={{ fontSize: 9, color: colors.muted }}>ريال</div>
                          </div>
                          <div style={{ background: colors.bg, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: `1px solid ${colors.border}`, minWidth: 50 }}>
                            <span style={{ fontSize: 18, color: isEditing ? colors.primary : colors.muted, transition: 'transform 0.3s', transform: isEditing ? 'rotate(180deg)' : 'rotate(0deg)' }}>⚙️</span>
                          </div>
                        </div>

                        {/* قسم تحرير البند */}
                        {isEditing && (
                          <div style={{ padding: 16, background: `${colors.primary}08`, borderTop: `1px dashed ${colors.primary}30` }}>
                            {/* البند الفرعي */}
                            <div style={{ marginBottom: 12 }}>
                              <div style={{ fontSize: 10, color: colors.muted, marginBottom: 4 }}>البند الفرعي</div>
                              <select value={item.code} onChange={(e) => changeSubItem(cat.id, item.id, e.target.value)} style={{ width: '100%', height: 30, padding: '0 12px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 12, fontWeight: 600 }}>
                                {(cat.subItems || []).map(s => (<option key={s.code} value={s.code}>[{s.code}] {s.name}</option>))}
                              </select>
                            </div>

                            <div style={{ borderBottom: `1px dashed ${colors.border}`, marginBottom: 12 }}></div>

                            {/* الأماكن */}
                            <div style={{ marginBottom: 12 }}>
                              <div style={{ fontSize: 10, color: colors.muted, marginBottom: 8 }}>📍 الأماكن ({item.places?.length || 0})</div>
                              {(item.places || []).map((place, pIdx) => (
                                <div key={place.id} style={{ marginBottom: 8, padding: 8, borderRadius: 8, background: pIdx % 2 === 0 ? `${colors.primary}08` : 'transparent' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, height: 30, padding: '0 12px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.bg }}>
                                      <span style={{ color: colors.muted, fontSize: 12, fontWeight: 600 }}>المكان</span>
                                      <select value={place.name} onChange={(e) => updatePlace(cat.id, item.id, place.id, 'name', e.target.value)} style={{ flex: 1, padding: 0, border: 'none', background: 'transparent', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', outline: 'none' }}>
                                        {placesList.map(p => (<option key={p} value={p} style={{ background: colors.bg }}>{p}</option>))}
                                      </select>
                                    </div>
                                    {item.places.length > 1 && (
                                      <button onClick={() => deletePlace(cat.id, item.id, place.id)} style={{ height: 30, width: 30, padding: 0, borderRadius: 8, border: `1px solid ${colors.danger}`, background: `${colors.danger}10`, color: colors.danger, fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                                    )}
                                  </div>
                                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                                    {['length', 'width', 'height'].map(dim => (
                                      <div key={dim} style={{ display: 'flex', alignItems: 'center', gap: 4, height: 30, padding: '0 8px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.bg, cursor: 'pointer' }}>
                                        <span style={{ color: colors.muted, fontSize: 11, fontWeight: 600 }}>{dim === 'length' ? 'الطول' : dim === 'width' ? 'العرض' : 'الارتفاع'}</span>
                                        <select value={place[dim]} onChange={(e) => updatePlace(cat.id, item.id, place.id, dim, e.target.value)} style={{ width: 45, padding: 0, border: 'none', background: 'transparent', color: '#fff', fontSize: 12, fontWeight: 700, textAlign: 'center', outline: 'none', cursor: 'pointer' }}>
                                          {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10].map(n => (<option key={n} value={n} style={{ background: colors.bg }}>{n}</option>))}
                                        </select>
                                      </div>
                                    ))}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 30, padding: '0 8px', borderRadius: 8, border: `1px solid ${colors.success}`, background: `${colors.success}10`, cursor: 'pointer' }}>
                                      <select value={place.manualArea !== undefined ? place.manualArea : place.area} onChange={(e) => updatePlace(cat.id, item.id, place.id, 'manualArea', e.target.value)} style={{ width: 45, padding: 0, border: 'none', background: 'transparent', color: '#fff', fontSize: 12, fontWeight: 700, textAlign: 'center', outline: 'none', cursor: 'pointer' }}>
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100].map(n => (<option key={n} value={n} style={{ background: colors.bg }}>{n}</option>))}
                                      </select>
                                      <span style={{ color: colors.success, fontSize: 11, fontWeight: 600 }}>م²</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 30, padding: '0 8px', borderRadius: 8, border: `1px solid ${colors.primary}`, background: `${colors.primary}10` }}>
                                      <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>{formatNumber((place.manualArea !== undefined ? place.manualArea : place.area) * item.price)}</span>
                                      <span style={{ color: colors.primary, fontSize: 11, fontWeight: 600 }}>﷼</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              <button onClick={() => addPlace(cat.id, item.id)} style={{ height: 30, padding: '0 12px', borderRadius: 8, border: `1px solid ${colors.success}`, background: `${colors.success}15`, color: colors.success, fontSize: 12, fontWeight: 700, cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><span style={{ fontWeight: 900 }}>+</span> إضافة مكان</button>
                            </div>

                            {/* قسم الشروط والملاحظات */}
                            <div style={{ marginBottom: 12 }}>
                              <div style={{ fontSize: 10, color: colors.warning, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>📋 الشروط والملاحظات</div>
                              {item.conditions?.length > 0 ? (
                                <div style={{ marginBottom: 10 }}>
                                  {item.conditions.map((condition, condIdx) => (
                                    <div key={condIdx} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, border: `1px solid ${colors.warning}30`, background: `${colors.warning}08`, marginBottom: 6 }}>
                                      <span style={{ color: colors.warning, fontSize: 12 }}>•</span>
                                      <span style={{ flex: 1, color: colors.text, fontSize: 12 }}>{condition}</span>
                                      <button onClick={() => deleteCondition(cat.id, item.id, condIdx)} style={{ padding: '2px 8px', borderRadius: 4, border: 'none', background: `${colors.danger}20`, color: colors.danger, fontSize: 11, cursor: 'pointer' }}>✕</button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div style={{ padding: '12px', textAlign: 'center', color: colors.muted, fontSize: 11, border: `1px dashed ${colors.border}`, borderRadius: 8, marginBottom: 10 }}>لا توجد شروط</div>
                              )}
                              <div style={{ display: 'flex', gap: 8 }}>
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, height: 30, padding: '0 12px', borderRadius: 8, border: `1px solid ${colors.warning}`, background: colors.bg }}>
                                  <span style={{ color: colors.warning, fontSize: 12, fontWeight: 600 }}>الشرط</span>
                                  <select value="" onChange={(e) => { if (e.target.value) addCondition(cat.id, item.id, e.target.value); }} style={{ flex: 1, padding: 0, border: 'none', background: 'transparent', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', outline: 'none' }}>
                                    <option value="" style={{ background: colors.bg }}>اختر من القائمة</option>
                                    {predefinedConditions.filter(c => !item.conditions?.includes(c)).map((cond, idx) => (<option key={idx} value={cond} style={{ background: colors.bg }}>{cond}</option>))}
                                  </select>
                                </div>
                                <button onClick={() => setAddingConditionForItem(addingConditionForItem === item.id ? null : item.id)} style={{ height: 30, padding: '0 12px', borderRadius: 8, border: `1px solid ${colors.warning}`, background: addingConditionForItem === item.id ? `${colors.warning}20` : `${colors.warning}15`, color: colors.warning, fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}><span style={{ fontWeight: 900 }}>+</span> شرط يدوي</button>
                              </div>
                              {addingConditionForItem === item.id && (
                                <div style={{ display: 'flex', gap: 8, marginTop: 8, padding: 10, borderRadius: 8, border: `1px solid ${colors.warning}`, background: `${colors.warning}08` }}>
                                  <input type="text" value={newConditionText} onChange={(e) => setNewConditionText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && newConditionText.trim()) addCondition(cat.id, item.id, newConditionText); }} placeholder="اكتب الشرط هنا..." autoFocus style={{ flex: 1, height: 30, padding: '0 12px', borderRadius: 6, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 12, outline: 'none' }} />
                                  <button onClick={() => { if (newConditionText.trim()) addCondition(cat.id, item.id, newConditionText); }} disabled={!newConditionText.trim()} style={{ height: 30, padding: '0 12px', borderRadius: 6, border: 'none', background: newConditionText.trim() ? colors.success : colors.border, color: '#fff', fontSize: 12, fontWeight: 600, cursor: newConditionText.trim() ? 'pointer' : 'not-allowed' }}>إضافة</button>
                                  <button onClick={() => { setAddingConditionForItem(null); setNewConditionText(''); }} style={{ height: 30, padding: '0 12px', borderRadius: 6, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.muted, fontSize: 12, cursor: 'pointer' }}>إلغاء</button>
                                </div>
                              )}
                            </div>

                            {/* أزرار التحكم */}
                            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                              <button onClick={() => deleteItem(cat.id, item.id)} style={{ height: 30, padding: '0 12px', borderRadius: 8, border: `1px solid ${colors.danger}`, background: `${colors.danger}10`, color: colors.danger, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>حذف</button>
                              <button onClick={() => setEditingItemId(null)} style={{ height: 30, padding: '0 12px', borderRadius: 8, border: `1px solid ${colors.border}`, background: `${colors.muted}10`, color: colors.muted, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>إلغاء</button>
                              <button onClick={() => setEditingItemId(null)} style={{ height: 30, padding: '0 12px', borderRadius: 8, border: `1px solid ${colors.success}`, background: `${colors.success}10`, color: colors.success, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>حفظ</button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* زر إضافة بند جديد */}
                  <button onClick={() => addItem(cat.id)} style={{ width: '100%', height: 60, padding: '0 16px', borderRadius: 10, border: `1px solid ${colors.success}`, background: `${colors.success}15`, color: colors.success, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}><span style={{ fontSize: 20, fontWeight: 900 }}>+</span> إضافة بند جديد</button>

                  {/* زر الشروط والملاحظات */}
                  <button onClick={() => setExpandedConditions(prev => ({ ...prev, [cat.id]: !prev[cat.id] }))} style={{ width: '100%', height: 60, padding: '0 16px', borderRadius: 10, border: `1px solid ${colors.warning}`, background: expandedConditions[cat.id] ? `${colors.warning}20` : `${colors.warning}10`, color: colors.warning, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 18 }}>📋</span>
                      <span>الشروط والملاحظات</span>
                      {cat.categoryConditions?.length > 0 && (<span style={{ background: colors.warning, color: '#000', padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 700 }}>{cat.categoryConditions.length}</span>)}
                    </div>
                    <span style={{ fontSize: 14, transform: expandedConditions[cat.id] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>
                  </button>

                  {/* زر ملخص السعر */}
                  <button onClick={() => setExpandedPriceSummary(prev => ({ ...prev, [cat.id]: !prev[cat.id] }))} style={{ width: '100%', height: 60, padding: '0 16px', borderRadius: 10, border: `1px solid ${colors.primary}`, background: expandedPriceSummary[cat.id] ? `${colors.primary}20` : `${colors.primary}10`, color: colors.primary, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 18 }}>💰</span>
                      <span>ملخص السعر</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 16, fontWeight: 800 }}>{formatNumber(catTotals.finalTotal)} ﷼</span>
                      <span style={{ fontSize: 14, transform: expandedPriceSummary[cat.id] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>
                    </div>
                  </button>
                </div>

                {/* ═══════════════════════════════════════════════════════════════════ */}
                {/* محتوى الشروط والملاحظات (قابل للطي) */}
                {/* ═══════════════════════════════════════════════════════════════════ */}
                {expandedConditions[cat.id] && (
                  <div style={{ padding: 14, background: `${colors.warning}08`, borderRadius: 10, marginBottom: 12, border: `1px solid ${colors.warning}30` }}>
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px dashed ${colors.warning}30` }}>
                      <div style={{ fontSize: 10, color: colors.warning, marginBottom: 8 }}>📋 شروط وملاحظات عامة للفئة</div>
                      {cat.categoryConditions?.length > 0 && (
                        <div style={{ marginBottom: 10 }}>
                          {cat.categoryConditions.map((condition, condIdx) => (
                            <div key={condIdx} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, border: `1px solid ${colors.warning}30`, background: `${colors.warning}10`, marginBottom: 6 }}>
                              <span style={{ color: colors.warning, fontSize: 12 }}>•</span>
                              <span style={{ flex: 1, color: colors.text, fontSize: 12 }}>{condition}</span>
                              <button onClick={() => deleteCategoryCondition(cat.id, condIdx)} style={{ padding: '2px 8px', borderRadius: 4, border: 'none', background: `${colors.danger}20`, color: colors.danger, fontSize: 11, cursor: 'pointer' }}>✕</button>
                            </div>
                          ))}
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, height: 30, padding: '0 12px', borderRadius: 8, border: `1px solid ${colors.warning}`, background: colors.bg }}>
                          <span style={{ color: colors.warning, fontSize: 12, fontWeight: 600 }}>الشرط</span>
                          <select value="" onChange={(e) => { if (e.target.value) addCategoryCondition(cat.id, e.target.value); }} style={{ flex: 1, padding: 0, border: 'none', background: 'transparent', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', outline: 'none' }}>
                            <option value="" style={{ background: colors.bg }}>اختر من القائمة</option>
                            {predefinedConditions.filter(c => !cat.categoryConditions?.includes(c)).map((cond, idx) => (<option key={idx} value={cond} style={{ background: colors.bg }}>{cond}</option>))}
                          </select>
                        </div>
                        <button onClick={() => setAddingCategoryCondition(addingCategoryCondition === cat.id ? null : cat.id)} style={{ height: 30, padding: '0 12px', borderRadius: 8, border: `1px solid ${colors.warning}`, background: addingCategoryCondition === cat.id ? `${colors.warning}20` : `${colors.warning}15`, color: colors.warning, fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}><span style={{ fontWeight: 900 }}>+</span> شرط يدوي</button>
                      </div>
                      {cat.categoryConditions?.length === 0 && (<div style={{ padding: '12px', textAlign: 'center', color: colors.warning, fontSize: 11, border: `1px solid ${colors.warning}`, background: `${colors.warning}15`, borderRadius: 8, marginBottom: 10 }}>لا توجد شروط عامة</div>)}
                      {addingCategoryCondition === cat.id && (
                        <div style={{ display: 'flex', gap: 8, marginTop: 8, padding: 10, borderRadius: 8, border: `1px solid ${colors.warning}`, background: `${colors.warning}08` }}>
                          <input type="text" value={newCategoryConditionText} onChange={(e) => setNewCategoryConditionText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && newCategoryConditionText.trim()) addCategoryCondition(cat.id, newCategoryConditionText); }} placeholder="اكتب الشرط هنا..." autoFocus style={{ flex: 1, height: 30, padding: '0 12px', borderRadius: 6, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 12, outline: 'none' }} />
                          <button onClick={() => { if (newCategoryConditionText.trim()) addCategoryCondition(cat.id, newCategoryConditionText); }} disabled={!newCategoryConditionText.trim()} style={{ height: 30, padding: '0 12px', borderRadius: 6, border: 'none', background: newCategoryConditionText.trim() ? colors.success : colors.border, color: '#fff', fontSize: 12, fontWeight: 600, cursor: newCategoryConditionText.trim() ? 'pointer' : 'not-allowed' }}>إضافة</button>
                          <button onClick={() => { setAddingCategoryCondition(null); setNewCategoryConditionText(''); }} style={{ height: 30, padding: '0 12px', borderRadius: 6, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.muted, fontSize: 12, cursor: 'pointer' }}>إلغاء</button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ═══════════════════════════════════════════════════════════════════ */}
                {/* إجمالي البنود والأسعار (قابل للطي) */}
                {/* ═══════════════════════════════════════════════════════════════════ */}
                {expandedPriceSummary[cat.id] && (
                  <div style={{ padding: 16, background: `${colors.primary}10`, borderRadius: 12, border: `1px solid ${colors.primary}30` }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: colors.primary, marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${colors.primary}30` }}>💰 إجمالي البنود والأسعار</div>
                    <div style={{ marginBottom: 12, paddingBottom: 12, borderBottom: `1px dashed ${colors.primary}30` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 6px', borderRadius: 6, background: `${colors.text}06` }}><span style={{ color: colors.text, fontSize: 12, fontWeight: 600 }}>الأسعار الأساسية</span><span style={{ fontSize: 12, fontWeight: 600, color: colors.text }}>{formatNumber(catTotals.totalPrice)} ر.س</span></div>
                      {cat.options?.containerState === 'with' && (<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 6px', borderRadius: 6 }}><span style={{ color: colors.warning, fontSize: 12, fontWeight: 600 }}>+ الحاوية</span><span style={{ fontSize: 12, fontWeight: 600, color: colors.warning }}>+{formatNumber(cat.options?.totalsContainerAmount || 0)} ر.س</span></div>)}
                      {cat.options?.materialsState === 'with' && (<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 6px', borderRadius: 6, background: `${colors.text}06` }}><span style={{ color: colors.success, fontSize: 12, fontWeight: 600 }}>+ المواد</span><span style={{ fontSize: 12, fontWeight: 600, color: colors.success }}>+{formatNumber(catTotals.materialsValue)} ر.س</span></div>)}
                      {cat.options?.profitPercent > 0 && (<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 6px', borderRadius: 6 }}><span style={{ color: colors.success, fontSize: 12, fontWeight: 600 }}>+ إضافة نسبة {cat.options.profitPercent}%</span><span style={{ fontSize: 12, fontWeight: 600, color: colors.success }}>+{formatNumber(catTotals.profitAmount)} ر.س</span></div>)}
                      {cat.options?.discountAmount > 0 && (<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 6px', borderRadius: 6, background: `${colors.text}06` }}><span style={{ color: colors.danger, fontSize: 12, fontWeight: 600 }}>- خصم إضافي</span><span style={{ fontSize: 12, fontWeight: 600, color: colors.danger }}>-{formatNumber(catTotals.discountByAmount)} ر.س</span></div>)}
                      {cat.options?.discountPercent > 0 && (<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 6px', borderRadius: 6 }}><span style={{ color: colors.danger, fontSize: 12, fontWeight: 600 }}>- خصم نسبة {cat.options.discountPercent}%</span><span style={{ fontSize: 12, fontWeight: 600, color: colors.danger }}>-{formatNumber(catTotals.discountByPercent)} ر.س</span></div>)}
                      {cat.options?.taxPercent > 0 && (<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 6px', borderRadius: 6, background: `${colors.text}06` }}><span style={{ color: colors.primary, fontSize: 12, fontWeight: 600 }}>+ الضريبة {cat.options.taxPercent}%</span><span style={{ fontSize: 12, fontWeight: 600, color: colors.primary }}>+{formatNumber(catTotals.taxAmount)} ر.س</span></div>)}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: 14, fontWeight: 700, color: colors.primary }}>الإجمالي النهائي</span><div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>{formatNumber(catTotals.finalTotal)} <span style={{ fontSize: 12, fontWeight: 400 }}>ريال</span></div></div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* الإجمالي الكلي */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {hasCategories && (
        <div style={{ background: `linear-gradient(135deg, ${colors.success}20, ${colors.primary}20)`, borderRadius: 16, padding: 24, border: `2px solid ${colors.success}50`, textAlign: 'center', marginTop: 20 }}>
          <div style={{ fontSize: 14, color: colors.muted, marginBottom: 8 }}>💰 الإجمالي الكلي للعرض</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{formatNumber(getGrandTotal())}</div>
          <div style={{ fontSize: 14, color: colors.success, fontWeight: 600 }}>ريال سعودي</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 16, paddingTop: 16, borderTop: `1px dashed ${colors.border}` }}>
            <div style={{ fontSize: 12, color: colors.muted }}>الفئات: <span style={{ color: colors.text, fontWeight: 600 }}>{(categories || []).filter(cat => cat.items?.length > 0).length}</span></div>
            <div style={{ fontSize: 12, color: colors.muted }}>البنود: <span style={{ color: colors.text, fontWeight: 600 }}>{(categories || []).reduce((sum, cat) => sum + (cat.items?.length || 0), 0)}</span></div>
            <div style={{ fontSize: 12, color: colors.muted }}>المساحة: <span style={{ color: colors.text, fontWeight: 600 }}>{(categories || []).reduce((sum, cat) => sum + getCategoryTotalArea(cat), 0)} م²</span></div>
          </div>
        </div>
      )}
    </>
  );
};

export default CalculatorSection;
