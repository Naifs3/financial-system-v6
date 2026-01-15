import React, { useState } from 'react';

const CalculatorSection = () => {
  // البيانات الأساسية
  const workItems = {
    BL: { code: 'BL', name: 'البلاط', icon: '🏠', color: '#3b82f6', items: [
      { num: '01', name: 'بلاط سيراميك 60×60', price: 50 },
      { num: '02', name: 'بلاط بورسلان 120×120', price: 80 },
      { num: '03', name: 'إزالة بلاط قديم', price: 15 },
      { num: '04', name: 'صبة نظافة', price: 20 },
      { num: '05', name: 'تسوية أرضية', price: 25 }
    ]},
    DH: { code: 'DH', name: 'الدهان', icon: '🎨', color: '#8b5cf6', items: [
      { num: '01', name: 'دهان جدران', price: 25 },
      { num: '02', name: 'دهان سقف', price: 20 },
      { num: '03', name: 'معجون', price: 15 },
      { num: '04', name: 'دهان زيتي', price: 35 }
    ]},
    KH: { code: 'KH', name: 'الكهرباء', icon: '⚡', color: '#f59e0b', items: [
      { num: '01', name: 'نقطة إضاءة', price: 150 },
      { num: '02', name: 'نقطة بلك', price: 100 },
      { num: '03', name: 'نقطة تكييف', price: 200 }
    ]},
    SB: { code: 'SB', name: 'السباكة', icon: '🚿', color: '#06b6d4', items: [
      { num: '01', name: 'نقطة ماء', price: 200 },
      { num: '02', name: 'نقطة صرف', price: 180 },
      { num: '03', name: 'تمديد خط', price: 120 }
    ]},
    JB: { code: 'JB', name: 'الجبس', icon: '🏗️', color: '#10b981', items: [
      { num: '01', name: 'جبس بورد عادي', price: 45 },
      { num: '02', name: 'جبس بورد مقاوم', price: 55 },
      { num: '03', name: 'كرانيش', price: 30 }
    ]}
  };

  const defaultPlaces = [
    'المجلس', 'الصالة', 'غرفة النوم الرئيسية', 'غرفة النوم 2', 'غرفة النوم 3', 'غرفة النوم 4',
    'المدخل', 'الممر', 'المكتب', 'غرفة الطعام',
    'الحمام الرئيسي', 'الحمام 2', 'الحمام 3', 'الحمام 4', 'المطبخ', 'غرفة الغسيل',
    'البلكونة', 'السطح', 'الحوش', 'الملحق', 'المستودع', 'غرفة الخادمة', 'غرفة السائق'
  ];

  const predefinedConditions = [
    'غير شامل الفك أو الإزالة', 'غير شامل نقل الركام', 'غير شامل المواد', 'غير شامل الحاوية',
    'غير شامل التنظيف', 'غير شامل التمديدات', 'السعر لا يشمل ضريبة القيمة المضافة',
    'المدة المتوقعة للتنفيذ 7 أيام', 'يتطلب معاينة قبل البدء', 'العميل مسؤول عن توفير المواد'
  ];

  const dimOptions = [1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9,9.5,10,12,14,16,18,20,25,30];
  const heightOptions = [2,2.5,3,3.5,4,4.5,5,5.5,6];

  const [state, setState] = useState({
    quickEntryExpanded: true,
    selectedPlaces: [],
    newPlaceName: '',
    length: 4,
    width: 4,
    height: 3,
    activeMainItems: {},
    selectedSubs: {},
    categories: {},
    expandedCat: null,
    editingItemId: null,
    activeTab: {},
    addingCatCondition: null,
    addingItemCondition: null,
    editingSummary: null,
    customSummary: {},
    customPlaces: [],
    showToast: false
  });

  // الدوال المساعدة
  const fmt = n => n.toLocaleString('en-US');
  const genId = () => 'id' + Date.now() + Math.random().toString(36).substr(2,5);
  const getArea = () => state.length * state.width;
  const getAllPlaces = () => [...defaultPlaces, ...state.customPlaces];
  const getSelectedMainItems = () => Object.keys(state.activeMainItems).filter(k => state.activeMainItems[k]);

  const getAllSubItems = () => {
    const subs = [];
    getSelectedMainItems().forEach(code => {
      const config = workItems[code];
      config.items.forEach(item => {
        subs.push({ mainCode: code, code: `${code}${item.num}`, name: item.name, price: item.price, color: config.color });
      });
    });
    return subs;
  };

  const getSelectedSubsCount = () => Object.values(state.selectedSubs).filter(v => v).length;

  const calcCurrentTotal = () => {
    const area = getArea();
    return Object.keys(state.selectedSubs).filter(k => state.selectedSubs[k]).reduce((sum, code) => {
      const sub = getAllSubItems().find(s => s.code === code);
      return sum + (sub ? sub.price * area : 0);
    }, 0);
  };

  const calcPlaceArea = (place) => {
    const type = place.measureType || 'floor';
    const l = place.length || 4, w = place.width || 4, h = place.height || 3;
    switch(type) {
      case 'floor': case 'ceiling': return l * w;
      case 'walls': return (l + w) * 2 * h;
      case 'linear': return l;
      case 'manual': return place.manualArea || place.area || 0;
      default: return l * w;
    }
  };

  const getItemArea = item => item.places?.reduce((sum, p) => sum + (p.area || calcPlaceArea(p)), 0) || 0;
  const getCategoryTotalArea = cat => cat.items?.reduce((sum, item) => sum + getItemArea(item), 0) || 0;
  const getCategoryItemsTotal = cat => cat.items?.reduce((sum, item) => sum + getItemArea(item) * item.price, 0) || 0;

  const calcCatTotals = cat => {
    const totalPrice = getCategoryItemsTotal(cat);
    const containerVal = cat.options?.containerState === 'with' ? (cat.options?.containerAmount || 0) : 0;
    const materialsVal = cat.options?.materialsState === 'with' ? (cat.options?.materialsAmount || 0) : 0;
    const baseTotal = totalPrice + containerVal + materialsVal + (cat.options?.customAmount || 0);
    const profitAmount = baseTotal * (cat.options?.profitPercent || 0) / 100;
    const withProfit = baseTotal + profitAmount;
    const discountByPercent = withProfit * (cat.options?.discountPercent || 0) / 100;
    const discountByAmount = cat.options?.discountAmount || 0;
    const afterDiscount = withProfit - discountByPercent - discountByAmount;
    const taxAmount = afterDiscount * (cat.options?.taxPercent || 0) / 100;
    const finalTotal = afterDiscount + taxAmount;
    return { totalPrice, containerVal, materialsVal, baseTotal, profitAmount, withProfit, discountByPercent, discountByAmount, afterDiscount, taxAmount, finalTotal };
  };

  const calcGrandTotal = () => Object.values(state.categories).reduce((sum, cat) => sum + calcCatTotals(cat).finalTotal, 0);
  const getTotalItems = () => Object.values(state.categories).reduce((sum, cat) => sum + (cat.items?.length || 0), 0);
  const getTotalArea = () => Object.values(state.categories).reduce((sum, cat) => sum + getCategoryTotalArea(cat), 0);
  const hasCategories = () => Object.values(state.categories).some(cat => cat.items?.length > 0);

  // أحداث نموذج الإدخال السريع
  const toggleQuickEntry = () => setState(s => ({ ...s, quickEntryExpanded: !s.quickEntryExpanded }));

  const addPlaceFromSelect = (name) => {
    if (name && !state.selectedPlaces.includes(name)) {
      setState(s => ({ ...s, selectedPlaces: [...s.selectedPlaces, name] }));
    }
  };

  const removePlace = (name) => setState(s => ({ ...s, selectedPlaces: s.selectedPlaces.filter(p => p !== name) }));

  const addCustomPlace = () => {
    const name = state.newPlaceName.trim();
    if (name && !getAllPlaces().includes(name) && !state.selectedPlaces.includes(name)) {
      setState(s => ({ ...s, customPlaces: [...s.customPlaces, name], selectedPlaces: [...s.selectedPlaces, name], newPlaceName: '' }));
    } else if (name && !state.selectedPlaces.includes(name)) {
      setState(s => ({ ...s, selectedPlaces: [...s.selectedPlaces, name], newPlaceName: '' }));
    }
  };

  const updateDim = (dim, value) => setState(s => ({ ...s, [dim]: parseFloat(value) || 1 }));

  const toggleMainItem = (code) => {
    setState(s => {
      const newActive = { ...s.activeMainItems, [code]: !s.activeMainItems[code] };
      const newSubs = { ...s.selectedSubs };
      if (!newActive[code]) Object.keys(newSubs).forEach(key => { if (key.startsWith(code)) delete newSubs[key]; });
      return { ...s, activeMainItems: newActive, selectedSubs: newSubs };
    });
  };

  const toggleSub = (code) => setState(s => ({ ...s, selectedSubs: { ...s.selectedSubs, [code]: !s.selectedSubs[code] } }));

  const showToastMessage = () => {
    setState(s => ({ ...s, showToast: true }));
    setTimeout(() => setState(s => ({ ...s, showToast: false })), 2000);
  };

  const addItems = () => {
    if (state.selectedPlaces.length === 0 || getSelectedSubsCount() === 0) return;
    const area = getArea();
    const selectedSubCodes = Object.keys(state.selectedSubs).filter(k => state.selectedSubs[k]);
    const subsByMain = {};
    
    selectedSubCodes.forEach(code => {
      const sub = getAllSubItems().find(s => s.code === code);
      if (sub) {
        if (!subsByMain[sub.mainCode]) subsByMain[sub.mainCode] = [];
        subsByMain[sub.mainCode].push({
          id: genId(), code: sub.code, name: sub.name, price: sub.price,
          places: state.selectedPlaces.map(placeName => ({
            id: genId(), name: placeName, length: state.length, width: state.width, height: state.height, area: area, measureType: 'floor'
          })),
          conditions: []
        });
      }
    });

    setState(s => {
      const newCategories = { ...s.categories };
      Object.entries(subsByMain).forEach(([mainCode, items]) => {
        const config = workItems[mainCode];
        if (!newCategories[mainCode]) {
          newCategories[mainCode] = {
            code: mainCode, name: config.name, icon: config.icon, color: config.color,
            subItems: config.items.map(i => ({ code: `${mainCode}${i.num}`, name: i.name, price: i.price })),
            items: [], categoryConditions: [],
            options: { containerState: 'notMentioned', containerAmount: 0, materialsState: 'notMentioned', materialsAmount: 0,
              showMeters: true, showPlaces: false, showPrice: false, customAmount: 0, profitPercent: 0, discountPercent: 0, discountAmount: 0, taxPercent: 15 }
          };
        }
        newCategories[mainCode].items = [...newCategories[mainCode].items, ...items];
      });
      return { ...s, categories: newCategories, selectedPlaces: [], activeMainItems: {}, selectedSubs: {} };
    });
    showToastMessage();
  };

  // أحداث الفئات والبنود
  const toggleCat = (catCode) => setState(s => ({ ...s, expandedCat: s.expandedCat === catCode ? null : catCode, editingItemId: null }));
  const toggleItem = (itemId) => setState(s => ({ ...s, editingItemId: s.editingItemId === itemId ? null : itemId }));
  const setActiveTab = (catCode, tab) => setState(s => ({ ...s, activeTab: { ...s.activeTab, [catCode]: tab } }));

  const updateCatOption = (catCode, field, value) => {
    setState(s => {
      const newCategories = { ...s.categories };
      if (newCategories[catCode]) newCategories[catCode] = { ...newCategories[catCode], options: { ...newCategories[catCode].options, [field]: value } };
      return { ...s, categories: newCategories };
    });
  };

  const changeSubItem = (catCode, itemId, newCode) => {
    setState(s => {
      const newCategories = { ...s.categories };
      const cat = newCategories[catCode];
      if (!cat) return s;
      const sub = cat.subItems?.find(si => si.code === newCode);
      if (!sub) return s;
      newCategories[catCode] = { ...cat, items: cat.items.map(item => item.id === itemId ? { ...item, code: sub.code, name: sub.name, price: sub.price } : item) };
      return { ...s, categories: newCategories };
    });
  };

  const updatePlace = (catCode, itemId, placeId, field, value) => {
    setState(s => {
      const newCategories = { ...s.categories };
      const cat = newCategories[catCode];
      if (!cat) return s;
      newCategories[catCode] = {
        ...cat,
        items: cat.items.map(item => {
          if (item.id !== itemId) return item;
          return {
            ...item,
            places: item.places.map(place => {
              if (place.id !== placeId) return place;
              const updatedPlace = { ...place };
              if (field === 'name' || field === 'measureType') updatedPlace[field] = value;
              else if (field === 'manualArea') { updatedPlace.manualArea = parseFloat(value) || 0; updatedPlace.area = updatedPlace.manualArea; }
              else updatedPlace[field] = parseFloat(value) || 0;
              if (field !== 'manualArea') updatedPlace.area = calcPlaceArea(updatedPlace);
              return updatedPlace;
            })
          };
        })
      };
      return { ...s, categories: newCategories };
    });
  };

  const deletePlace = (catCode, itemId, placeId) => {
    setState(s => {
      const newCategories = { ...s.categories };
      const cat = newCategories[catCode];
      if (!cat) return s;
      newCategories[catCode] = { ...cat, items: cat.items.map(item => item.id !== itemId ? item : { ...item, places: item.places.filter(p => p.id !== placeId) }) };
      return { ...s, categories: newCategories };
    });
  };

  const deleteItem = (catCode, itemId) => {
    setState(s => {
      const newCategories = { ...s.categories };
      const cat = newCategories[catCode];
      if (!cat) return s;
      const newItems = cat.items.filter(i => i.id !== itemId);
      if (newItems.length === 0) delete newCategories[catCode];
      else newCategories[catCode] = { ...cat, items: newItems };
      return { ...s, categories: newCategories, editingItemId: null };
    });
  };

  const addItemCondition = (catCode, itemId, text) => {
    if (!text?.trim()) return;
    setState(s => {
      const newCategories = { ...s.categories };
      const cat = newCategories[catCode];
      if (!cat) return s;
      newCategories[catCode] = { ...cat, items: cat.items.map(item => {
        if (item.id !== itemId || item.conditions?.includes(text.trim())) return item;
        return { ...item, conditions: [...(item.conditions || []), text.trim()] };
      })};
      return { ...s, categories: newCategories, addingItemCondition: null };
    });
  };

  const deleteItemCondition = (catCode, itemId, index) => {
    setState(s => {
      const newCategories = { ...s.categories };
      const cat = newCategories[catCode];
      if (!cat) return s;
      newCategories[catCode] = { ...cat, items: cat.items.map(item => item.id !== itemId ? item : { ...item, conditions: item.conditions.filter((_, i) => i !== index) }) };
      return { ...s, categories: newCategories };
    });
  };

  const addCatCondition = (catCode, text) => {
    if (!text?.trim()) return;
    setState(s => {
      const newCategories = { ...s.categories };
      const cat = newCategories[catCode];
      if (!cat || cat.categoryConditions?.includes(text.trim())) return s;
      newCategories[catCode] = { ...cat, categoryConditions: [...(cat.categoryConditions || []), text.trim()] };
      return { ...s, categories: newCategories, addingCatCondition: null };
    });
  };

  const deleteCatCondition = (catCode, index) => {
    setState(s => {
      const newCategories = { ...s.categories };
      const cat = newCategories[catCode];
      if (!cat) return s;
      newCategories[catCode] = { ...cat, categoryConditions: cat.categoryConditions.filter((_, i) => i !== index) };
      return { ...s, categories: newCategories };
    });
  };

  const generateDefaultSummary = (cat) => {
    if (!cat) return '';
    const totals = calcCatTotals(cat);
    let summary = `تشمل الخدمة: ${cat.items?.map(i => {
      let text = cat.options?.showMeters ? `${i.name} (${getItemArea(i)} م²)` : i.name;
      if (cat.options?.showPlaces) text += ` [${i.places?.map(p => p.name).join('، ')}]`;
      return text;
    }).join('، ')}.`;
    if (cat.categoryConditions?.length > 0) summary += ` | ملاحظات: ${cat.categoryConditions.join('، ')}.`;
    if (cat.options?.containerState === 'with') summary += ` شامل الحاوية (${cat.options?.containerAmount || 0} ﷼).`;
    if (cat.options?.containerState === 'without') summary += ` غير شامل الحاوية.`;
    if (cat.options?.materialsState === 'with') summary += ` شامل المواد (${cat.options?.materialsAmount || 0} ﷼).`;
    if (cat.options?.materialsState === 'without') summary += ` غير شامل المواد.`;
    if (cat.options?.showPrice) summary += ` | الإجمالي: ${fmt(totals.finalTotal)} ﷼`;
    return summary;
  };

  const toggleEditSummary = (catCode) => {
    setState(s => {
      const cat = s.categories[catCode];
      if (s.editingSummary !== catCode) {
        const summary = s.customSummary[catCode] || cat?.customSummary || generateDefaultSummary(cat);
        return { ...s, editingSummary: catCode, customSummary: { ...s.customSummary, [catCode]: summary } };
      } else {
        const newCategories = { ...s.categories };
        if (newCategories[catCode]) newCategories[catCode] = { ...newCategories[catCode], customSummary: s.customSummary[catCode] || '' };
        return { ...s, editingSummary: null, categories: newCategories };
      }
    });
  };

  const resetCatOptions = (catCode) => {
    setState(s => {
      const newCategories = { ...s.categories };
      if (newCategories[catCode]) {
        newCategories[catCode] = { ...newCategories[catCode],
          options: { containerState: 'notMentioned', containerAmount: 0, materialsState: 'notMentioned', materialsAmount: 0,
            showMeters: true, showPlaces: false, showPrice: false, customAmount: 0, profitPercent: 0, discountPercent: 0, discountAmount: 0, taxPercent: 15 },
          categoryConditions: [], customSummary: '' };
      }
      return { ...s, categories: newCategories, customSummary: { ...s.customSummary, [catCode]: '' }, editingSummary: null };
    });
  };

  // المتغيرات للتصيير
  const selectedMains = getSelectedMainItems();
  const allSubs = getAllSubItems();
  const selectedSubsCount = getSelectedSubsCount();
  const currentTotal = calcCurrentTotal();
  const area = getArea();
  const canAdd = state.selectedPlaces.length > 0 && selectedSubsCount > 0;
  const availablePlaces = getAllPlaces().filter(p => !state.selectedPlaces.includes(p));

  // الأنماط
  const styles = {
    container: { maxWidth: '900px', margin: '0 auto', padding: '16px', fontFamily: "'Segoe UI', Tahoma, Arial, sans-serif", direction: 'rtl' },
    quickEntry: { background: '#16213e', borderRadius: '6px', border: '2px solid #3b82f6', overflow: 'hidden', marginBottom: '20px' },
    quickEntryHeader: { padding: '16px', background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(6,182,212,0.1))', borderBottom: '1px dashed rgba(59,130,246,0.4)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' },
    icon: { background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', padding: '12px 16px', borderRadius: '6px', fontSize: '24px' },
    stepNum: { width: '28px', height: '28px', borderRadius: '6px', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: '#fff' },
    stepBadge: { padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', background: '#10b981', color: '#fff', marginRight: 'auto' },
    placeInputRow: { display: 'flex', gap: '8px', marginBottom: '12px' },
    select: { flex: 1, height: '40px', padding: '0 14px', borderRadius: '6px', border: '1px solid #2a3f5f', background: '#1a1a2e', color: '#e2e8f0', fontSize: '13px' },
    input: { flex: 1, height: '40px', padding: '0 14px', borderRadius: '6px', border: '1px solid #2a3f5f', background: '#1a1a2e', color: '#e2e8f0', fontSize: '13px' },
    addBtn: { height: '40px', padding: '0 20px', borderRadius: '6px', border: '1px solid #10b981', background: 'rgba(16,185,129,0.15)', color: '#10b981', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
    selectedPlacesBox: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px', padding: '12px', background: 'rgba(59,130,246,0.08)', borderRadius: '6px', border: '1px solid rgba(59,130,246,0.2)', minHeight: '44px' },
    placeTag: { display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '6px', background: '#3b82f6', color: '#fff', fontSize: '12px', fontWeight: '600' },
    dimsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '16px' },
    dimBox: { background: '#1a1a2e', borderRadius: '6px', padding: '10px', textAlign: 'center', border: '1px solid #2a3f5f' },
    dimBoxArea: { background: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.3)' },
    mainItemsRow: { display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' },
    mainItemChip: { height: '40px', padding: '0 14px', borderRadius: '6px', border: '1px solid #2a3f5f', background: 'transparent', color: '#94a3b8', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' },
    subItemsGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' },
    subItemCard: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: '#1a1a2e', border: '1px solid #2a3f5f', borderRadius: '6px', cursor: 'pointer' },
    addSection: { marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #2a3f5f' },
    bigAddBtn: { width: '100%', height: '50px', borderRadius: '6px', border: 'none', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' },
    category: { background: '#16213e', borderRadius: '6px', border: '1px solid #2a3f5f', overflow: 'hidden', marginBottom: '12px' },
    categoryHeader: { display: 'flex', alignItems: 'stretch', cursor: 'pointer' },
    toast: { position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', background: '#10b981', color: '#fff', padding: '14px 24px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', zIndex: 1000, opacity: state.showToast ? 1 : 0, transition: 'opacity 0.3s' },
    emptyState: { textAlign: 'center', padding: '40px 30px', color: '#94a3b8', background: '#16213e', borderRadius: '6px', border: '1px solid #2a3f5f' },
    finalSummary: { background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(59,130,246,0.2))', borderRadius: '6px', padding: '24px', border: '2px solid rgba(16,185,129,0.5)', textAlign: 'center', marginTop: '20px' }
  };

  return (
    <div style={styles.container}>
      {/* نموذج الإدخال السريع */}
      <div style={styles.quickEntry}>
        <div style={styles.quickEntryHeader} onClick={toggleQuickEntry}>
          <div style={styles.icon}>📐</div>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#e2e8f0', margin: 0 }}>نموذج إدخال سريع</h2>
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0' }}>🏗️ {selectedMains.length} بنود مفعّلة | 📍 {state.selectedPlaces.length} أماكن</p>
          </div>
          <span style={{ fontSize: '16px', color: '#3b82f6', marginRight: 'auto', transform: state.quickEntryExpanded ? 'rotate(0)' : 'rotate(180deg)', transition: 'transform 0.3s' }}>▼</span>
        </div>

        {state.quickEntryExpanded && (
          <div style={{ padding: '16px' }}>
            {/* الخطوة 1: اختيار الأماكن */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={styles.stepNum}>1</div>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#e2e8f0' }}>اختر الأماكن</span>
                {state.selectedPlaces.length > 0 && <span style={styles.stepBadge}>{state.selectedPlaces.length} مكان</span>}
              </div>
              <div style={styles.placeInputRow}>
                <select style={styles.select} value="" onChange={(e) => { if(e.target.value) addPlaceFromSelect(e.target.value); }}>
                  <option value="">اختر مكان...</option>
                  {availablePlaces.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <input style={styles.input} type="text" placeholder="أو اكتب مكان جديد..." value={state.newPlaceName} onChange={(e) => setState(s => ({ ...s, newPlaceName: e.target.value }))} onKeyDown={(e) => { if(e.key === 'Enter') addCustomPlace(); }} />
                <button style={styles.addBtn} onClick={addCustomPlace}>+ إضافة</button>
              </div>
              {state.selectedPlaces.length > 0 && (
                <div style={styles.selectedPlacesBox}>
                  {state.selectedPlaces.map(p => (
                    <span key={p} style={styles.placeTag}>{p} <span style={{ cursor: 'pointer', fontWeight: '700' }} onClick={() => removePlace(p)}>✕</span></span>
                  ))}
                </div>
              )}
              <div style={styles.dimsRow}>
                <div style={styles.dimBox}>
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '6px' }}>الطول</div>
                  <select style={{ ...styles.select, height: '32px', textAlign: 'center' }} value={state.length} onChange={(e) => updateDim('length', e.target.value)}>
                    {dimOptions.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div style={styles.dimBox}>
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '6px' }}>العرض</div>
                  <select style={{ ...styles.select, height: '32px', textAlign: 'center' }} value={state.width} onChange={(e) => updateDim('width', e.target.value)}>
                    {dimOptions.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div style={styles.dimBox}>
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '6px' }}>الارتفاع</div>
                  <select style={{ ...styles.select, height: '32px', textAlign: 'center' }} value={state.height} onChange={(e) => updateDim('height', e.target.value)}>
                    {heightOptions.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div style={{ ...styles.dimBox, ...styles.dimBoxArea }}>
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '6px' }}>المساحة</div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#10b981' }}>{area} م²</div>
                </div>
              </div>
            </div>

            {/* الخطوة 2: البنود الرئيسية */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={styles.stepNum}>2</div>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#e2e8f0' }}>اختر البنود الرئيسية</span>
                {selectedMains.length > 0 && <span style={styles.stepBadge}>{selectedMains.length}</span>}
              </div>
              <div style={styles.mainItemsRow}>
                {Object.entries(workItems).map(([code, config]) => (
                  <div key={code} style={{ ...styles.mainItemChip, borderColor: state.activeMainItems[code] ? config.color : '#2a3f5f', background: state.activeMainItems[code] ? `${config.color}20` : 'transparent', color: state.activeMainItems[code] ? config.color : '#94a3b8' }} onClick={() => toggleMainItem(code)}>
                    <span style={{ fontSize: '16px' }}>{config.icon}</span><span>{config.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* الخطوة 3: البنود الفرعية */}
            {selectedMains.length > 0 && (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed #2a3f5f' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={styles.stepNum}>3</div>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#e2e8f0' }}>اختر البنود الفرعية</span>
                  {selectedSubsCount > 0 && <span style={styles.stepBadge}>{selectedSubsCount}</span>}
                </div>
                <div style={styles.subItemsGrid}>
                  {allSubs.map(sub => {
                    const isSelected = state.selectedSubs[sub.code];
                    return (
                      <div key={sub.code} style={{ ...styles.subItemCard, borderColor: isSelected ? sub.color : '#2a3f5f', background: isSelected ? `${sub.color}15` : '#1a1a2e' }} onClick={() => toggleSub(sub.code)}>
                        <div style={{ width: '22px', height: '22px', borderRadius: '6px', border: `2px solid ${isSelected ? sub.color : '#2a3f5f'}`, background: isSelected ? sub.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px' }}>{isSelected ? '✓' : ''}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '12px', fontWeight: '600', color: '#e2e8f0' }}>{sub.name}</div>
                          <div style={{ fontSize: '10px', color: '#94a3b8' }}>{sub.price} ﷼/م²</div>
                        </div>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: '#10b981' }}>{fmt(sub.price * area)} ﷼</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* قسم الإضافة */}
            <div style={styles.addSection}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', padding: '12px', background: '#1a1a2e', borderRadius: '6px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>إجمالي البنود المحددة:</span>
                <span style={{ fontSize: '18px', fontWeight: '700', color: '#10b981' }}>{fmt(currentTotal)} ﷼</span>
              </div>
              <button style={{ ...styles.bigAddBtn, opacity: canAdd ? 1 : 0.5, cursor: canAdd ? 'pointer' : 'not-allowed' }} onClick={addItems} disabled={!canAdd}>
                <span>➕</span><span>إضافة للعرض</span>
                {selectedSubsCount > 0 && <span style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.2)', borderRadius: '6px', fontSize: '12px' }}>{selectedSubsCount} بند</span>}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* الفئات */}
      {hasCategories() ? (
        <>
          {Object.entries(state.categories).map(([catCode, cat]) => {
            const isExpanded = state.expandedCat === catCode;
            const totals = calcCatTotals(cat);
            const catArea = getCategoryTotalArea(cat);
            const activeTab = state.activeTab[catCode] || 'conditions';

            return (
              <div key={catCode} style={{ ...styles.category, borderWidth: isExpanded ? '2px' : '1px', borderColor: isExpanded ? cat.color : '#2a3f5f' }}>
                <div style={styles.categoryHeader} onClick={() => toggleCat(catCode)}>
                  <div style={{ width: '4px', background: cat.color }}></div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 20px', borderLeft: '1px solid #2a3f5f' }}>
                    <span style={{ fontSize: '30px' }}>{cat.icon}</span>
                    <span style={{ fontSize: '10px', fontWeight: '700', color: cat.color }}>{cat.code}</span>
                  </div>
                  <div style={{ flex: 1, padding: '16px 18px' }}>
                    <div style={{ fontSize: '17px', fontWeight: '700', color: '#e2e8f0', marginBottom: '6px' }}>{cat.name}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>📦 {cat.items?.length || 0} بنود • {catArea} م²</div>
                  </div>
                  <div style={{ background: 'rgba(16,185,129,0.12)', padding: '16px 22px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #2a3f5f' }}>
                    <div style={{ fontSize: '9px', color: '#94a3b8' }}>الإجمالي</div>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: '#10b981' }}>{fmt(totals.finalTotal)}</div>
                  </div>
                  <div style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', background: '#1a1a2e' }}>
                    <span style={{ fontSize: '16px', transform: isExpanded ? 'rotate(180deg)' : 'none', color: isExpanded ? cat.color : '#94a3b8', transition: 'transform 0.3s' }}>▼</span>
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ padding: '16px', borderTop: '1px dashed rgba(255,255,255,0.1)', background: `${cat.color}05` }}>
                    {/* البنود */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '12px', color: '#e2e8f0', marginBottom: '10px' }}>📦 البنود ({cat.items?.length || 0}) • {catArea} م² • {fmt(totals.totalPrice)} ﷼</div>
                      {(cat.items || []).map(item => {
                        const isEditing = state.editingItemId === item.id;
                        const itemArea = getItemArea(item);
                        return (
                          <div key={item.id} style={{ background: '#16213e', borderRadius: '6px', marginBottom: '8px', border: `${isEditing ? '2px' : '1px'} solid ${isEditing ? '#3b82f6' : '#2a3f5f'}`, overflow: 'hidden' }}>
                            <div style={{ display: 'flex', alignItems: 'center', padding: '12px 14px', gap: '8px', cursor: 'pointer', background: isEditing ? 'rgba(59,130,246,0.1)' : 'transparent' }} onClick={() => toggleItem(item.id)}>
                              <div style={{ padding: '8px 12px', borderRadius: '6px', background: cat.color, color: '#fff', fontSize: '11px', fontWeight: '500' }}>{item.code}</div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '14px', fontWeight: '500', color: '#e2e8f0' }}>{item.name}</div>
                                <div style={{ fontSize: '11px', color: '#94a3b8' }}>📍 {item.places?.map(p => p.name).join('، ')} | {itemArea} م² | {item.price} ﷼/م²</div>
                              </div>
                              <div style={{ fontSize: '16px', fontWeight: '500', color: '#10b981' }}>{fmt(itemArea * item.price)} ﷼</div>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                {isEditing && <button style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.15)', color: '#10b981', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); setState(s => ({ ...s, editingItemId: null })); }}>✓</button>}
                                <button style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid rgba(59,130,246,0.3)', background: 'rgba(59,130,246,0.15)', color: '#3b82f6', cursor: 'pointer' }}>⚙️</button>
                                <button style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.1)', color: '#ef4444', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); deleteItem(catCode, item.id); }}>✕</button>
                              </div>
                            </div>

                            {isEditing && (
                              <div style={{ padding: '14px', background: 'rgba(59,130,246,0.08)', borderTop: '1px dashed rgba(59,130,246,0.3)' }}>
                                <select style={{ ...styles.select, marginBottom: '12px' }} value={item.code} onChange={(e) => changeSubItem(catCode, item.id, e.target.value)}>
                                  {(cat.subItems || []).map(s => <option key={s.code} value={s.code}>[{s.code}] {s.name}</option>)}
                                </select>

                                <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '6px' }}>📍 الأماكن</div>
                                {(item.places || []).map(place => (
                                  <div key={place.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 10px', background: 'rgba(59,130,246,0.08)', borderRadius: '6px', border: '1px solid rgba(59,130,246,0.2)', marginBottom: '6px', flexWrap: 'wrap' }}>
                                    <select style={{ ...styles.select, width: '80px', height: '32px', flex: 'none' }} value={place.name} onChange={(e) => updatePlace(catCode, item.id, place.id, 'name', e.target.value)}>
                                      {getAllPlaces().map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                    <select style={{ ...styles.select, width: '65px', height: '32px', flex: 'none' }} value={place.measureType || 'floor'} onChange={(e) => updatePlace(catCode, item.id, place.id, 'measureType', e.target.value)}>
                                      <option value="floor">أرضي</option>
                                      <option value="ceiling">سقف</option>
                                      <option value="walls">جدران</option>
                                      <option value="linear">طولي</option>
                                      <option value="manual">يدوي</option>
                                    </select>
                                    {place.measureType === 'manual' ? (
                                      <input type="number" style={{ ...styles.input, width: '55px', height: '32px', flex: 'none', borderColor: '#10b981', color: '#10b981', textAlign: 'center' }} value={place.manualArea || ''} onChange={(e) => updatePlace(catCode, item.id, place.id, 'manualArea', e.target.value)} placeholder="المساحة" />
                                    ) : (
                                      <>
                                        <div style={{ display: 'flex', alignItems: 'center', height: '32px', padding: '0 8px', borderRadius: '6px', border: '1px solid #2a3f5f', background: '#1a1a2e', gap: '4px' }}>
                                          <span style={{ fontSize: '10px', color: '#94a3b8' }}>طول:</span>
                                          <select style={{ border: 'none', background: 'transparent', color: '#e2e8f0', fontSize: '12px', fontWeight: '600', width: '35px' }} value={place.length} onChange={(e) => updatePlace(catCode, item.id, place.id, 'length', e.target.value)}>
                                            {dimOptions.map(n => <option key={n} value={n}>{n}</option>)}
                                          </select>
                                          <span style={{ fontSize: '10px', color: '#94a3b8' }}>م</span>
                                        </div>
                                        {place.measureType !== 'linear' && (
                                          <>
                                            <span style={{ color: '#94a3b8', fontSize: '12px' }}>×</span>
                                            <div style={{ display: 'flex', alignItems: 'center', height: '32px', padding: '0 8px', borderRadius: '6px', border: '1px solid #2a3f5f', background: '#1a1a2e', gap: '4px' }}>
                                              <span style={{ fontSize: '10px', color: '#94a3b8' }}>عرض:</span>
                                              <select style={{ border: 'none', background: 'transparent', color: '#e2e8f0', fontSize: '12px', fontWeight: '600', width: '35px' }} value={place.width} onChange={(e) => updatePlace(catCode, item.id, place.id, 'width', e.target.value)}>
                                                {dimOptions.map(n => <option key={n} value={n}>{n}</option>)}
                                              </select>
                                              <span style={{ fontSize: '10px', color: '#94a3b8' }}>م</span>
                                            </div>
                                          </>
                                        )}
                                        {['walls', 'floor', 'ceiling'].includes(place.measureType || 'floor') && (
                                          <div style={{ display: 'flex', alignItems: 'center', height: '32px', padding: '0 8px', borderRadius: '6px', border: '1px solid #8b5cf6', background: '#1a1a2e', gap: '4px' }}>
                                            <span style={{ fontSize: '10px', color: '#8b5cf6' }}>ارتفاع:</span>
                                            <select style={{ border: 'none', background: 'transparent', color: '#8b5cf6', fontSize: '12px', fontWeight: '600', width: '35px' }} value={place.height || 3} onChange={(e) => updatePlace(catCode, item.id, place.id, 'height', e.target.value)}>
                                              {heightOptions.map(n => <option key={n} value={n}>{n}</option>)}
                                            </select>
                                            <span style={{ fontSize: '10px', color: '#8b5cf6' }}>م</span>
                                          </div>
                                        )}
                                      </>
                                    )}
                                    <span style={{ padding: '4px 8px', borderRadius: '6px', background: 'rgba(16,185,129,0.2)', color: '#10b981', fontSize: '12px', fontWeight: '500' }}>{place.area} {place.measureType === 'linear' ? 'م.ط' : 'م²'}</span>
                                    <button style={{ width: '26px', height: '26px', borderRadius: '6px', border: '1px solid rgba(239,68,68,0.5)', background: 'rgba(239,68,68,0.1)', color: '#ef4444', cursor: 'pointer', fontSize: '12px' }} onClick={() => deletePlace(catCode, item.id, place.id)}>✕</button>
                                  </div>
                                ))}

                                {/* شروط البند */}
                                <div style={{ marginTop: '12px' }}>
                                  <div style={{ fontSize: '10px', color: '#f59e0b', marginBottom: '6px' }}>📋 الشروط والملاحظات</div>
                                  {(item.conditions || []).map((c, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', background: 'rgba(245,158,11,0.1)', borderRadius: '6px', border: '1px solid rgba(245,158,11,0.2)', marginBottom: '4px' }}>
                                      <span style={{ flex: 1, fontSize: '11px', color: '#e2e8f0' }}>{c}</span>
                                      <button style={{ width: '22px', height: '22px', borderRadius: '6px', border: '1px solid rgba(239,68,68,0.5)', background: 'rgba(239,68,68,0.1)', color: '#ef4444', cursor: 'pointer', fontSize: '11px' }} onClick={() => deleteItemCondition(catCode, item.id, i)}>✕</button>
                                    </div>
                                  ))}
                                  <div style={{ display: 'flex', gap: '8px' }}>
                                    <select style={{ ...styles.select, borderColor: '#f59e0b' }} value="" onChange={(e) => { if(e.target.value) addItemCondition(catCode, item.id, e.target.value); }}>
                                      <option value="">اختر شرط</option>
                                      {predefinedConditions.filter(c => !item.conditions?.includes(c)).map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    <button style={{ ...styles.addBtn, borderColor: '#f59e0b', color: '#f59e0b', background: 'rgba(245,158,11,0.15)' }} onClick={() => setState(s => ({ ...s, addingItemCondition: s.addingItemCondition === item.id ? null : item.id }))}>يدوي</button>
                                  </div>
                                  {state.addingItemCondition === item.id && (
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                      <input type="text" style={styles.input} placeholder="اكتب الشرط..." onKeyDown={(e) => { if(e.key === 'Enter') addItemCondition(catCode, item.id, e.target.value); }} />
                                      <button style={{ ...styles.addBtn, background: '#10b981', color: '#fff', border: 'none' }} onClick={(e) => addItemCondition(catCode, item.id, e.target.previousSibling.value)}>إضافة</button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* التبويبات */}
                    <div style={{ background: '#1e293b', borderRadius: '6px', border: '1px solid #3b82f6', overflow: 'hidden' }}>
                      <div style={{ display: 'flex', borderBottom: '1px solid #334155' }}>
                        <button style={{ flex: 1, padding: '12px', border: 'none', background: activeTab === 'conditions' ? 'rgba(245,158,11,0.15)' : 'transparent', color: activeTab === 'conditions' ? '#f59e0b' : '#64748b', borderBottom: activeTab === 'conditions' ? '2px solid #f59e0b' : '2px solid transparent', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }} onClick={() => setActiveTab(catCode, 'conditions')}>📋 الشروط والملاحظات</button>
                        <button style={{ flex: 1, padding: '12px', border: 'none', background: activeTab === 'price' ? 'rgba(59,130,246,0.15)' : 'transparent', color: activeTab === 'price' ? '#3b82f6' : '#64748b', borderBottom: activeTab === 'price' ? '2px solid #3b82f6' : '2px solid transparent', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }} onClick={() => setActiveTab(catCode, 'price')}>💰 ملخص السعر</button>
                      </div>

                      <div style={{ padding: '14px' }}>
                        {activeTab === 'conditions' && (
                          <>
                            {/* أزرار الخيارات */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '8px' }}>
                              <button style={{ height: '34px', borderRadius: '6px', border: `1px solid ${cat.options?.containerState === 'with' ? '#f59e0b' : cat.options?.containerState === 'without' ? '#ef4444' : '#2a3f5f'}`, background: cat.options?.containerState === 'with' ? 'rgba(245,158,11,0.2)' : cat.options?.containerState === 'without' ? 'rgba(239,68,68,0.15)' : 'rgba(100,116,139,0.15)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '11px', fontWeight: '700' }} onClick={() => { const states = ['with', 'notMentioned', 'without']; const idx = states.indexOf(cat.options?.containerState || 'notMentioned'); updateCatOption(catCode, 'containerState', states[(idx + 1) % 3]); }}>
                                {cat.options?.containerState === 'with' ? '🚛 الحاوية' : cat.options?.containerState === 'without' ? '🚫 بدون' : '🚛 الحاوية'}
                              </button>
                              <button style={{ height: '34px', borderRadius: '6px', border: `1px solid ${cat.options?.materialsState === 'with' ? '#10b981' : cat.options?.materialsState === 'without' ? '#ef4444' : '#2a3f5f'}`, background: cat.options?.materialsState === 'with' ? 'rgba(16,185,129,0.2)' : cat.options?.materialsState === 'without' ? 'rgba(239,68,68,0.15)' : 'rgba(100,116,139,0.15)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '11px', fontWeight: '700' }} onClick={() => { const states = ['with', 'notMentioned', 'without']; const idx = states.indexOf(cat.options?.materialsState || 'notMentioned'); updateCatOption(catCode, 'materialsState', states[(idx + 1) % 3]); }}>
                                {cat.options?.materialsState === 'with' ? '🧱 المواد' : cat.options?.materialsState === 'without' ? '🚫 بدون' : '🧱 المواد'}
                              </button>
                              <button style={{ height: '34px', borderRadius: '6px', border: `1px solid ${cat.options?.showMeters ? '#06b6d4' : '#2a3f5f'}`, background: cat.options?.showMeters ? 'rgba(6,182,212,0.2)' : 'rgba(100,116,139,0.15)', color: '#fff', cursor: 'pointer', fontSize: '11px', fontWeight: '700' }} onClick={() => updateCatOption(catCode, 'showMeters', !cat.options?.showMeters)}>📏 الأمتار</button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '12px' }}>
                              <button style={{ height: '34px', borderRadius: '6px', border: `1px solid ${cat.options?.showPlaces ? '#8b5cf6' : '#2a3f5f'}`, background: cat.options?.showPlaces ? 'rgba(139,92,246,0.2)' : 'rgba(100,116,139,0.15)', color: '#fff', cursor: 'pointer', fontSize: '11px', fontWeight: '700' }} onClick={() => updateCatOption(catCode, 'showPlaces', !cat.options?.showPlaces)}>📍 الأماكن</button>
                              <button style={{ height: '34px', borderRadius: '6px', border: `1px solid ${cat.options?.showPrice ? '#3b82f6' : '#2a3f5f'}`, background: cat.options?.showPrice ? 'rgba(59,130,246,0.2)' : 'rgba(100,116,139,0.15)', color: '#fff', cursor: 'pointer', fontSize: '11px', fontWeight: '700' }} onClick={() => updateCatOption(catCode, 'showPrice', !cat.options?.showPrice)}>💰 السعر</button>
                              <button style={{ height: '34px', borderRadius: '6px', border: `1px solid ${state.editingSummary === catCode ? '#f59e0b' : '#2a3f5f'}`, background: state.editingSummary === catCode ? 'rgba(245,158,11,0.2)' : 'rgba(100,116,139,0.15)', color: '#fff', cursor: 'pointer', fontSize: '11px', fontWeight: '700' }} onClick={() => toggleEditSummary(catCode)}>✏️ {state.editingSummary === catCode ? 'حفظ' : 'تحرير'}</button>
                              <button style={{ height: '34px', borderRadius: '6px', border: '1px solid #ef4444', background: 'rgba(239,68,68,0.15)', color: '#fff', cursor: 'pointer', fontSize: '11px', fontWeight: '700' }} onClick={() => resetCatOptions(catCode)}>🔄 إعادة ضبط</button>
                            </div>

                            {/* ملخص الخدمة */}
                            <div style={{ marginBottom: '12px' }}>
                              <div style={{ fontSize: '11px', fontWeight: '700', color: '#f59e0b', marginBottom: '8px' }}>📝 ملخص الخدمة</div>
                              {state.editingSummary === catCode ? (
                                <textarea style={{ width: '100%', minHeight: '120px', padding: '12px', borderRadius: '6px', border: '1px solid rgba(245,158,11,0.5)', background: '#1a1a2e', color: '#e2e8f0', fontSize: '12px', lineHeight: '1.8', resize: 'vertical' }} value={state.customSummary[catCode] || ''} onChange={(e) => setState(s => ({ ...s, customSummary: { ...s.customSummary, [catCode]: e.target.value } }))} />
                              ) : (
                                <div style={{ fontSize: '12px', color: '#e2e8f0', lineHeight: '2', background: '#1a1a2e', padding: '12px', borderRadius: '6px', minHeight: '60px' }}>{state.customSummary[catCode] || cat.customSummary || generateDefaultSummary(cat)}</div>
                              )}
                            </div>

                            {/* شروط الفئة */}
                            {cat.categoryConditions?.length > 0 && (
                              <div style={{ marginBottom: '12px' }}>
                                <div style={{ fontSize: '10px', color: '#f59e0b', marginBottom: '6px' }}>⚠️ الشروط</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                  {cat.categoryConditions.map((c, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(245,158,11,0.15)', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', color: '#f59e0b' }}>
                                      {c} <span style={{ cursor: 'pointer', color: '#ef4444', fontWeight: '700' }} onClick={() => deleteCatCondition(catCode, i)}>×</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* إضافة شرط */}
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <select style={{ ...styles.select, borderColor: '#f59e0b' }} value="" onChange={(e) => { if(e.target.value) addCatCondition(catCode, e.target.value); }}>
                                <option value="">اختر شرط</option>
                                {predefinedConditions.filter(c => !cat.categoryConditions?.includes(c)).map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                              <button style={{ ...styles.addBtn, borderColor: '#f59e0b', color: '#f59e0b', background: 'rgba(245,158,11,0.15)' }} onClick={() => setState(s => ({ ...s, addingCatCondition: s.addingCatCondition === catCode ? null : catCode }))}>يدوي</button>
                            </div>
                            {state.addingCatCondition === catCode && (
                              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                <input type="text" style={styles.input} placeholder="اكتب الشرط..." onKeyDown={(e) => { if(e.key === 'Enter') addCatCondition(catCode, e.target.value); }} />
                                <button style={{ ...styles.addBtn, background: '#10b981', color: '#fff', border: 'none' }} onClick={(e) => addCatCondition(catCode, e.target.previousSibling.value)}>إضافة</button>
                              </div>
                            )}
                          </>
                        )}

                        {activeTab === 'price' && (
                          <>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', height: '38px', padding: '0 8px', borderRadius: '6px', background: 'rgba(100,116,139,0.1)' }}>
                                <div style={{ padding: '0 12px', height: '30px', borderRadius: '6px', background: 'rgba(71,85,105,0.3)', border: '1px solid #475569', display: 'flex', alignItems: 'center', fontSize: '11px', fontWeight: '600', color: '#fff', minWidth: '155px' }}>الأسعار الأساسية</div>
                                <span style={{ flex: 1, textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#94a3b8' }}>{fmt(totals.totalPrice)} ريال</span>
                              </div>
                              {cat.options?.containerState === 'with' && (
                                <div style={{ display: 'flex', alignItems: 'center', height: '38px', padding: '0 8px', borderRadius: '6px', background: 'rgba(245,158,11,0.08)' }}>
                                  <div style={{ padding: '0 12px', height: '30px', borderRadius: '6px', background: 'rgba(245,158,11,0.2)', border: '1px solid #f59e0b', display: 'flex', alignItems: 'center', fontSize: '11px', fontWeight: '600', color: '#fff', minWidth: '155px' }}>🚛 الحاوية</div>
                                  <span style={{ flex: 1, textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#f59e0b' }}>+{fmt(cat.options?.containerAmount || 0)} ريال</span>
                                </div>
                              )}
                              {cat.options?.materialsState === 'with' && (
                                <div style={{ display: 'flex', alignItems: 'center', height: '38px', padding: '0 8px', borderRadius: '6px', background: 'rgba(16,185,129,0.08)' }}>
                                  <div style={{ padding: '0 12px', height: '30px', borderRadius: '6px', background: 'rgba(16,185,129,0.2)', border: '1px solid #10b981', display: 'flex', alignItems: 'center', fontSize: '11px', fontWeight: '600', color: '#fff', minWidth: '155px' }}>🧱 المواد</div>
                                  <span style={{ flex: 1, textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#10b981' }}>+{fmt(cat.options?.materialsAmount || 0)} ريال</span>
                                </div>
                              )}
                              <div style={{ display: 'flex', alignItems: 'center', height: '38px', padding: '0 8px', borderRadius: '6px', background: 'rgba(59,130,246,0.1)' }}>
                                <div style={{ padding: '0 12px', height: '30px', borderRadius: '6px', background: 'rgba(59,130,246,0.2)', border: '1px solid #3b82f6', display: 'flex', alignItems: 'center', fontSize: '11px', fontWeight: '600', color: '#fff', minWidth: '155px', gap: '8px' }}>
                                  الضريبة <input type="number" style={{ width: '42px', height: '22px', borderRadius: '6px', border: 'none', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: '10px', textAlign: 'center' }} value={cat.options?.taxPercent || ''} onChange={(e) => updateCatOption(catCode, 'taxPercent', parseFloat(e.target.value) || 0)} placeholder="0" /> %
                                </div>
                                <span style={{ flex: 1, textAlign: 'left', fontSize: '12px', fontWeight: '600', color: (cat.options?.taxPercent || 0) > 0 ? '#3b82f6' : '#64748b' }}>{(cat.options?.taxPercent || 0) > 0 ? `+${fmt(totals.taxAmount)} ريال` : '—'}</span>
                              </div>
                            </div>
                            <div style={{ borderTop: '1px dashed #334155', margin: '14px 0' }}></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '13px', color: '#94a3b8' }}>الإجمالي النهائي</span>
                              <span style={{ fontSize: '26px', fontWeight: '800', color: '#fff' }}>{fmt(totals.finalTotal)}<span style={{ fontSize: '12px', color: '#64748b', marginRight: '4px' }}>ريال</span></span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* الملخص النهائي */}
          <div style={styles.finalSummary}>
            <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>💰 الإجمالي الكلي للعرض</div>
            <div style={{ fontSize: '36px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>{fmt(calcGrandTotal())}</div>
            <div style={{ fontSize: '14px', color: '#10b981', fontWeight: '600' }}>ريال سعودي</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed #2a3f5f' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>الفئات: <span style={{ color: '#e2e8f0', fontWeight: '600' }}>{Object.keys(state.categories).length}</span></div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>البنود: <span style={{ color: '#e2e8f0', fontWeight: '600' }}>{getTotalItems()}</span></div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>المساحة: <span style={{ color: '#e2e8f0', fontWeight: '600' }}>{getTotalArea()} م²</span></div>
            </div>
          </div>
        </>
      ) : (
        <div style={styles.emptyState}>
          <div style={{ fontSize: '50px', marginBottom: '16px', opacity: 0.3 }}>📦</div>
          <div style={{ fontWeight: '600', marginBottom: '8px', color: '#e2e8f0' }}>لا توجد فئات مضافة</div>
          <p style={{ fontSize: '12px' }}>استخدم نموذج الإدخال السريع أعلاه لإضافة البنود</p>
        </div>
      )}

      {/* Toast */}
      <div style={styles.toast}>✓ تمت الإضافة بنجاح!</div>
    </div>
  );
};

export default CalculatorSection;
