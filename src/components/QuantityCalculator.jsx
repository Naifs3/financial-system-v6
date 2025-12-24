import React, { useState, useEffect } from 'react';
import { 
  collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';

const QuantityCalculator = ({ darkMode = true }) => {
  
  const t = {
    bg: darkMode ? '#12121a' : '#f8fafc',
    card: darkMode ? '#1e1e2a' : '#ffffff',
    cardAlt: darkMode ? '#252535' : '#f1f5f9',
    border: darkMode ? '#3a3a4a' : '#e2e8f0',
    text: darkMode ? '#f1f1f1' : '#1e293b',
    muted: darkMode ? '#9ca3af' : '#64748b',
    accent: '#818cf8',
    accentDark: '#6366f1',
    success: '#4ade80',
    warning: '#fbbf24',
    danger: '#f87171',
    info: '#22d3ee',
  };

  const [mainTab, setMainTab] = useState('calculator');
  const [loading, setLoading] = useState(true);

  // ==================== البنود الافتراضية ====================
  const defaultWorkItems = {
    tiles: {
      name: 'البلاط', icon: '🔲',
      items: [
        { id: 't1', name: 'إزالة بلاط', exec: 13, cont: 8, type: 'floor' },
        { id: 't2', name: 'صبة أرضية', exec: 47, cont: 35, type: 'floor' },
        { id: 't3', name: 'تبليط أرضيات', exec: 33, cont: 22, type: 'floor' },
        { id: 't4', name: 'تبليط جدران', exec: 40, cont: 28, type: 'wall' },
        { id: 't5', name: 'نعلات سيراميك', exec: 13, cont: 8, type: 'floor' },
      ]
    },
    paint: {
      name: 'الدهانات', icon: '🎨',
      items: [
        { id: 'p1', name: 'دهان داخلي جوتن', exec: 21, cont: 14, type: 'wall' },
        { id: 'p2', name: 'دهان داخلي الجزيرة', exec: 20, cont: 13, type: 'wall' },
        { id: 'p3', name: 'دهان خارجي', exec: 19, cont: 12, type: 'wall' },
      ]
    },
    gypsum: {
      name: 'الجبس', icon: '🏛️',
      items: [
        { id: 'g1', name: 'جبس بورد', exec: 60, cont: 40, type: 'ceiling' },
        { id: 'g2', name: 'جبس بلدي', exec: 53, cont: 35, type: 'ceiling' },
      ]
    },
    electrical: {
      name: 'الكهرباء', icon: '⚡',
      items: [
        { id: 'e1', name: 'تأسيس كهرباء', exec: 45, cont: 30, type: 'floor' },
        { id: 'e2', name: 'تشطيب كهرباء', exec: 25, cont: 18, type: 'floor' },
      ]
    },
    plumbing: {
      name: 'السباكة', icon: '🔧',
      items: [
        { id: 'pb1', name: 'تأسيس سباكة', exec: 80, cont: 55, type: 'floor' },
        { id: 'pb2', name: 'تشطيب سباكة', exec: 40, cont: 28, type: 'floor' },
      ]
    },
    insulation: {
      name: 'العزل', icon: '🛡️',
      items: [
        { id: 'i1', name: 'عزل مائي', exec: 20, cont: 13, type: 'floor' },
        { id: 'i2', name: 'عزل حراري', exec: 25, cont: 17, type: 'floor' },
      ]
    },
    ac: {
      name: 'التكييف', icon: '❄️',
      items: [
        { id: 'ac1', name: 'تأسيس سبليت', exec: 300, cont: 200, type: 'unit' },
        { id: 'ac2', name: 'تأسيس مركزي', exec: 150, cont: 100, type: 'floor' },
      ]
    },
  };

  const defaultPlaces = {
    dry: { name: 'جاف', icon: '🏠', color: '#818cf8', enabled: true, isCore: true },
    wet: { name: 'رطب', icon: '🚿', color: '#22d3ee', enabled: true, isCore: true },
    outdoor: { name: 'خارجي', icon: '🌳', color: '#4ade80', enabled: true, isCore: true }
  };

  const defaultProgramming = {
    dry: {
      tiles: ['t1', 't2', 't3', 't5'],
      paint: ['p1', 'p2'],
      gypsum: ['g1', 'g2'],
      electrical: ['e1', 'e2'],
      plumbing: [],
      insulation: [],
      ac: ['ac1', 'ac2'],
    },
    wet: {
      tiles: ['t1', 't2', 't3', 't4'],
      paint: ['p1', 'p2'],
      gypsum: ['g1'],
      electrical: ['e1', 'e2'],
      plumbing: ['pb1', 'pb2'],
      insulation: ['i1'],
      ac: [],
    },
    outdoor: {
      tiles: ['t1', 't2', 't3'],
      paint: ['p3'],
      gypsum: [],
      electrical: ['e1'],
      plumbing: ['pb1'],
      insulation: ['i1', 'i2'],
      ac: [],
    }
  };

  const calcPlaces = {
    dry: ['صالة', 'مجلس', 'غرفة نوم رئيسية', 'غرفة نوم 1', 'غرفة نوم 2', 'ممر', 'مكتب'],
    wet: ['مطبخ', 'دورة مياه رئيسية', 'دورة مياه 1', 'دورة مياه 2', 'غرفة غسيل'],
    outdoor: ['حوش', 'سطح', 'موقف', 'حديقة']
  };

  // ==================== الحالات ====================
  const [workItems, setWorkItems] = useState(defaultWorkItems);
  const [places, setPlaces] = useState(defaultPlaces);
  const [programming, setProgramming] = useState(defaultProgramming);
  
  const [selectedPlaceType, setSelectedPlaceType] = useState('');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [addedItems, setAddedItems] = useState({});
  
  const [inputMethod, setInputMethod] = useState('direct');
  const [area, setArea] = useState(0);
  const [length, setLength] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(4);

  const [selectedCategory, setSelectedCategory] = useState('tiles');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showPlaceModal, setShowPlaceModal] = useState(false);
  const [showPlaceItemsModal, setShowPlaceItemsModal] = useState(false);
  
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', exec: 0, cont: 0, type: 'floor' });
  const [addItemForm, setAddItemForm] = useState({ name: '', exec: 0, cont: 0, type: 'floor', category: 'tiles' });
  const [placeForm, setPlaceForm] = useState({ name: '', icon: '📍', color: '#818cf8' });
  const [editingPlaceItems, setEditingPlaceItems] = useState(null);

  // ==================== Firebase ====================
  useEffect(() => {
    const unsubscribes = [];

    const workItemsUnsub = onSnapshot(doc(db, 'calculator', 'workItems'), (snap) => {
      if (snap.exists()) setWorkItems(snap.data());
      setLoading(false);
    }, () => setLoading(false));
    unsubscribes.push(workItemsUnsub);

    const placesUnsub = onSnapshot(doc(db, 'calculator', 'places'), (snap) => {
      if (snap.exists()) setPlaces(snap.data());
    });
    unsubscribes.push(placesUnsub);

    const programmingUnsub = onSnapshot(doc(db, 'calculator', 'programming'), (snap) => {
      if (snap.exists()) setProgramming(snap.data());
    });
    unsubscribes.push(programmingUnsub);

    return () => unsubscribes.forEach(u => u());
  }, []);

  const saveWorkItems = async (data) => { try { await setDoc(doc(db, 'calculator', 'workItems'), data); } catch (e) { console.error(e); } };
  const savePlaces = async (data) => { try { await setDoc(doc(db, 'calculator', 'places'), data); } catch (e) { console.error(e); } };
  const saveProgramming = async (data) => { try { await setDoc(doc(db, 'calculator', 'programming'), data); } catch (e) { console.error(e); } };

  // ==================== دوال مساعدة ====================
  const quickAreas = [5, 10, 15, 20, 25, 30];
  const calcFloorArea = () => length * width;
  const calcWallArea = () => 2 * (length + width) * height;
  const getArea = () => inputMethod === 'direct' ? area : calcFloorArea();
  const getWallArea = () => inputMethod === 'dimensions' ? calcWallArea() : 0;
  
  const adjustValue = (setter, value, delta, min = 0) => {
    const newVal = Math.max(min, value + delta);
    setter(Number.isInteger(newVal) ? newVal : parseFloat(newVal.toFixed(1)));
  };

  const fmt = (n) => n.toLocaleString('ar-SA');

  // ==================== دوال البرمجة ====================
  const toggleProgramming = (placeKey, catKey, itemId) => {
    const newProg = { ...programming };
    if (!newProg[placeKey]) newProg[placeKey] = {};
    if (!newProg[placeKey][catKey]) newProg[placeKey][catKey] = [];
    
    if (newProg[placeKey][catKey].includes(itemId)) {
      newProg[placeKey][catKey] = newProg[placeKey][catKey].filter(id => id !== itemId);
    } else {
      newProg[placeKey][catKey] = [...newProg[placeKey][catKey], itemId];
    }
    
    setProgramming(newProg);
    saveProgramming(newProg);
  };

  const toggleAllCategory = (placeKey, catKey, enable) => {
    const items = workItems[catKey]?.items || [];
    const newProg = { ...programming, [placeKey]: { ...programming[placeKey], [catKey]: enable ? items.map(i => i.id) : [] } };
    setProgramming(newProg);
    saveProgramming(newProg);
  };

  const isItemEnabled = (placeKey, catKey, itemId) => programming[placeKey]?.[catKey]?.includes(itemId) || false;

  // ==================== دوال التحرير ====================
  const openEditModal = (catKey, item) => {
    setEditingItem({ catKey, itemId: item.id });
    setEditForm({ name: item.name, exec: item.exec, cont: item.cont, type: item.type });
    setShowEditModal(true);
  };

  const saveEdit = () => {
    if (!editingItem) return;
    const newItems = { ...workItems, [editingItem.catKey]: { ...workItems[editingItem.catKey], items: workItems[editingItem.catKey].items.map(item => item.id === editingItem.itemId ? { ...item, ...editForm } : item) } };
    setWorkItems(newItems);
    saveWorkItems(newItems);
    setShowEditModal(false);
  };

  const deleteItem = (catKey, itemId) => {
    const newItems = { ...workItems, [catKey]: { ...workItems[catKey], items: workItems[catKey].items.filter(item => item.id !== itemId) } };
    setWorkItems(newItems);
    saveWorkItems(newItems);
    
    const newProg = { ...programming };
    Object.keys(newProg).forEach(pk => { if (newProg[pk][catKey]) newProg[pk][catKey] = newProg[pk][catKey].filter(id => id !== itemId); });
    setProgramming(newProg);
    saveProgramming(newProg);
  };

  const openAddItemModal = (catKey = null) => {
    setAddItemForm({ name: '', exec: 0, cont: 0, type: 'floor', category: catKey || selectedCategory });
    setShowAddItemModal(true);
  };

  const saveNewItem = () => {
    if (!addItemForm.name.trim()) return;
    const newId = `item_${Date.now()}`;
    const newItems = { ...workItems, [addItemForm.category]: { ...workItems[addItemForm.category], items: [...workItems[addItemForm.category].items, { id: newId, name: addItemForm.name, exec: addItemForm.exec, cont: addItemForm.cont, type: addItemForm.type }] } };
    setWorkItems(newItems);
    saveWorkItems(newItems);
    setShowAddItemModal(false);
  };

  // ==================== دوال الأماكن ====================
  const savePlace = () => {
    if (!placeForm.name.trim()) return;
    const newKey = `place_${Date.now()}`;
    const newPlaces = { ...places, [newKey]: { ...placeForm, enabled: true, isCore: false } };
    setPlaces(newPlaces);
    savePlaces(newPlaces);
    setProgramming({ ...programming, [newKey]: {} });
    saveProgramming({ ...programming, [newKey]: {} });
    setShowPlaceModal(false);
  };

  const togglePlaceEnabled = (placeKey) => {
    const newPlaces = { ...places, [placeKey]: { ...places[placeKey], enabled: !places[placeKey].enabled } };
    setPlaces(newPlaces);
    savePlaces(newPlaces);
  };

  const deletePlace = (placeKey) => {
    if (places[placeKey]?.isCore) return;
    const newPlaces = { ...places }; delete newPlaces[placeKey];
    setPlaces(newPlaces); savePlaces(newPlaces);
    const newProg = { ...programming }; delete newProg[placeKey];
    setProgramming(newProg); saveProgramming(newProg);
  };

  const updatePlaceSettings = (placeKey, updates) => {
    const newPlaces = { ...places, [placeKey]: { ...places[placeKey], ...updates } };
    setPlaces(newPlaces);
    savePlaces(newPlaces);
  };

  // ==================== دوال الحاسبة ====================
  const toggleItem = (id) => setSelectedItems(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const getAvailableItems = () => {
    if (!selectedPlaceType) return [];
    const items = [];
    Object.entries(workItems).forEach(([catKey, cat]) => {
      const enabledIds = programming[selectedPlaceType]?.[catKey] || [];
      cat.items.forEach(item => { if (enabledIds.includes(item.id)) items.push({ ...item, category: cat.name, catKey }); });
    });
    return items;
  };

  const addItems = () => {
    const floorArea = getArea();
    const wallArea = getWallArea();
    if (!selectedPlace || floorArea <= 0 || selectedItems.length === 0) return;
    
    const available = getAvailableItems();
    const newAdded = { ...addedItems };

    selectedItems.forEach(id => {
      const item = available.find(w => w.id === id);
      if (!item) return;
      
      const isWall = item.type === 'wall' || item.type === 'ceiling';
      const finalArea = isWall && wallArea > 0 ? wallArea : floorArea;

      if (!newAdded[item.id]) newAdded[item.id] = { ...item, places: [] };

      const existing = newAdded[item.id].places.find(p => p.name === selectedPlace);
      if (existing) existing.area += finalArea;
      else newAdded[item.id].places.push({ name: selectedPlace, area: finalArea, type: selectedPlaceType });
    });

    setAddedItems(newAdded);
    setSelectedItems([]);
    setArea(0); setLength(0); setWidth(0);
  };

  const removePlace = (itemKey, placeName) => {
    setAddedItems(prev => {
      const n = { ...prev };
      if (n[itemKey]) {
        n[itemKey].places = n[itemKey].places.filter(p => p.name !== placeName);
        if (n[itemKey].places.length === 0) delete n[itemKey];
      }
      return n;
    });
  };

  const calcTotals = () => {
    let exec = 0, cont = 0;
    Object.values(addedItems).forEach(item => {
      const total = item.places.reduce((s, p) => s + p.area, 0);
      exec += total * item.exec;
      cont += total * item.cont;
    });
    return { exec, cont, profit: exec - cont };
  };

  const { exec: totalExec, cont: totalCont, profit } = calcTotals();

  // ==================== Loading ====================
  if (loading) {
    return (
      <div dir="rtl" style={{ minHeight: '50vh', background: 'transparent', color: t.text, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: `3px solid ${t.accent}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
          <p>جاري التحميل...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ==================== الواجهة ====================
  return (
    <div dir="rtl" style={{ color: t.text, fontFamily: 'system-ui' }}>
      
      <style>{`
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${t.cardAlt}; border-radius: 3px; }
        ::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 3px; }
      `}</style>

      {/* Header Tabs */}
      <div style={{ display: 'flex', gap: 4, background: t.card, padding: 6, borderRadius: 12, marginBottom: 16, border: `1px solid ${t.border}` }}>
        {[{ id: 'calculator', label: 'الحاسبة', icon: '🧮' }, { id: 'items', label: 'البنود', icon: '📋' }, { id: 'programming', label: 'البرمجة', icon: '⚙️' }].map(tab => (
          <button key={tab.id} onClick={() => setMainTab(tab.id)} style={{ flex: 1, padding: '10px 16px', borderRadius: 8, border: 'none', background: mainTab === tab.id ? t.accent : 'transparent', color: mainTab === tab.id ? '#fff' : t.muted, fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* ==================== الحاسبة ==================== */}
      {mainTab === 'calculator' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          
          {/* الإدخال */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            
            {/* نوع المكان */}
            <div style={{ background: t.card, borderRadius: 12, padding: 14, border: `1px solid ${t.border}` }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: t.muted }}>نوع المكان</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {Object.entries(places).filter(([_, p]) => p.enabled).map(([key, place]) => (
                  <button key={key} onClick={() => { setSelectedPlaceType(key); setSelectedPlace(''); setSelectedItems([]); }} style={{ padding: 10, borderRadius: 10, border: selectedPlaceType === key ? `2px solid ${place.color}` : `1px solid ${t.border}`, background: selectedPlaceType === key ? `${place.color}15` : t.cardAlt, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 18 }}>{place.icon}</span>
                    <span style={{ fontSize: 11, color: selectedPlaceType === key ? place.color : t.text }}>{place.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* المكان */}
            {selectedPlaceType && (
              <div style={{ background: t.card, borderRadius: 12, padding: 14, border: `1px solid ${t.border}` }}>
                <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: t.muted }}>المكان</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {calcPlaces[selectedPlaceType]?.map(p => (
                    <button key={p} onClick={() => setSelectedPlace(p)} style={{ padding: '6px 12px', borderRadius: 6, border: selectedPlace === p ? `2px solid ${places[selectedPlaceType].color}` : `1px solid ${t.border}`, background: selectedPlace === p ? `${places[selectedPlaceType].color}15` : 'transparent', color: selectedPlace === p ? places[selectedPlaceType].color : t.text, fontSize: 11, cursor: 'pointer' }}>{p}</button>
                  ))}
                </div>
              </div>
            )}

            {/* المساحة */}
            {selectedPlace && (
              <div style={{ background: t.card, borderRadius: 12, padding: 14, border: `1px solid ${t.border}` }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                  <button onClick={() => setInputMethod('direct')} style={{ flex: 1, padding: 8, borderRadius: 6, border: inputMethod === 'direct' ? `2px solid ${t.accent}` : `1px solid ${t.border}`, background: inputMethod === 'direct' ? `${t.accent}15` : 'transparent', color: inputMethod === 'direct' ? t.accent : t.text, fontSize: 11, cursor: 'pointer' }}>مساحة مباشرة</button>
                  <button onClick={() => setInputMethod('dimensions')} style={{ flex: 1, padding: 8, borderRadius: 6, border: inputMethod === 'dimensions' ? `2px solid ${t.accent}` : `1px solid ${t.border}`, background: inputMethod === 'dimensions' ? `${t.accent}15` : 'transparent', color: inputMethod === 'dimensions' ? t.accent : t.text, fontSize: 11, cursor: 'pointer' }}>طول × عرض</button>
                </div>

                {inputMethod === 'direct' ? (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <button onClick={() => adjustValue(setArea, area, -1)} style={{ width: 32, height: 32, borderRadius: 6, border: 'none', background: t.cardAlt, color: t.text, fontSize: 16, cursor: 'pointer' }}>−</button>
                      <input type="number" value={area || ''} onChange={(e) => setArea(parseFloat(e.target.value) || 0)} style={{ flex: 1, padding: 8, borderRadius: 6, border: `1px solid ${t.border}`, background: t.cardAlt, color: t.text, fontSize: 18, textAlign: 'center', outline: 'none' }} placeholder="0" />
                      <button onClick={() => adjustValue(setArea, area, 1)} style={{ width: 32, height: 32, borderRadius: 6, border: 'none', background: t.cardAlt, color: t.text, fontSize: 16, cursor: 'pointer' }}>+</button>
                      <span style={{ fontSize: 11, color: t.muted }}>م²</span>
                    </div>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {quickAreas.map(q => (
                        <button key={q} onClick={() => setArea(q)} style={{ padding: '4px 10px', borderRadius: 4, border: `1px solid ${area === q ? t.accent : t.border}`, background: area === q ? `${t.accent}15` : 'transparent', color: area === q ? t.accent : t.muted, fontSize: 10, cursor: 'pointer' }}>{q}</button>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                      {[{ l: 'الطول', v: length, s: setLength }, { l: 'العرض', v: width, s: setWidth }, { l: 'الارتفاع', v: height, s: setHeight }].map(({ l, v, s }) => (
                        <div key={l}>
                          <label style={{ fontSize: 9, color: t.muted, display: 'block', marginBottom: 4 }}>{l}</label>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <button onClick={() => adjustValue(s, v, -0.5)} style={{ width: 24, height: 28, borderRadius: 4, border: 'none', background: t.cardAlt, color: t.text, cursor: 'pointer' }}>−</button>
                            <input type="number" value={v || ''} onChange={(e) => s(parseFloat(e.target.value) || 0)} style={{ flex: 1, padding: 6, borderRadius: 4, border: `1px solid ${t.border}`, background: t.cardAlt, color: t.text, fontSize: 12, textAlign: 'center', outline: 'none', width: '100%' }} />
                            <button onClick={() => adjustValue(s, v, 0.5)} style={{ width: 24, height: 28, borderRadius: 4, border: 'none', background: t.cardAlt, color: t.text, cursor: 'pointer' }}>+</button>
                          </div>
                        </div>
                      ))}
                    </div>
                    {length > 0 && width > 0 && (
                      <div style={{ marginTop: 10, padding: 8, background: t.cardAlt, borderRadius: 6, display: 'flex', justifyContent: 'space-around', fontSize: 10 }}>
                        <span>أرضية: <b style={{ color: t.success }}>{calcFloorArea()} م²</b></span>
                        <span>جدران: <b style={{ color: t.info }}>{calcWallArea()} م²</b></span>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* البنود */}
            {selectedPlace && getArea() > 0 && (
              <div style={{ background: t.card, borderRadius: 12, padding: 14, border: `1px solid ${t.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 600, color: t.muted, margin: 0 }}>البنود</h3>
                  <span style={{ fontSize: 10, color: t.accent }}>{selectedItems.length} محدد</span>
                </div>
                
                <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                  {Object.entries(workItems).map(([catKey, cat]) => {
                    const enabled = programming[selectedPlaceType]?.[catKey] || [];
                    const items = cat.items.filter(i => enabled.includes(i.id));
                    if (!items.length) return null;
                    
                    return (
                      <div key={catKey} style={{ marginBottom: 10 }}>
                        <div style={{ fontSize: 10, color: t.muted, marginBottom: 4 }}>{cat.icon} {cat.name}</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {items.map(item => (
                            <button key={item.id} onClick={() => toggleItem(item.id)} style={{ padding: '4px 8px', borderRadius: 4, border: selectedItems.includes(item.id) ? `2px solid ${t.accent}` : `1px solid ${t.border}`, background: selectedItems.includes(item.id) ? `${t.accent}15` : 'transparent', color: selectedItems.includes(item.id) ? t.accent : t.text, fontSize: 10, cursor: 'pointer' }}>{item.name}</button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button onClick={addItems} disabled={!selectedItems.length} style={{ width: '100%', marginTop: 10, padding: 10, borderRadius: 8, border: 'none', background: selectedItems.length ? t.accent : t.cardAlt, color: selectedItems.length ? '#fff' : t.muted, fontSize: 12, fontWeight: 600, cursor: selectedItems.length ? 'pointer' : 'default' }}>+ إضافة البنود</button>
              </div>
            )}
          </div>

          {/* النتائج */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            
            {/* الإجماليات */}
            <div style={{ background: t.card, borderRadius: 12, padding: 14, border: `1px solid ${t.border}` }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: t.muted }}>الإجماليات</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                <div style={{ padding: 10, borderRadius: 8, background: `${t.warning}10`, textAlign: 'center' }}>
                  <div style={{ fontSize: 9, color: t.muted }}>التنفيذ</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: t.warning }}>{fmt(totalExec)}</div>
                </div>
                <div style={{ padding: 10, borderRadius: 8, background: `${t.info}10`, textAlign: 'center' }}>
                  <div style={{ fontSize: 9, color: t.muted }}>المقاول</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: t.info }}>{fmt(totalCont)}</div>
                </div>
                <div style={{ padding: 10, borderRadius: 8, background: `${t.success}10`, textAlign: 'center' }}>
                  <div style={{ fontSize: 9, color: t.muted }}>الربح</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: t.success }}>{fmt(profit)}</div>
                </div>
              </div>
            </div>

            {/* البنود المضافة */}
            <div style={{ background: t.card, borderRadius: 12, padding: 14, border: `1px solid ${t.border}`, flex: 1 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: t.muted }}>البنود المضافة</h3>
              
              {!Object.keys(addedItems).length ? (
                <div style={{ textAlign: 'center', padding: 30, color: t.muted }}>
                  <div style={{ fontSize: 30, marginBottom: 8, opacity: 0.5 }}>📋</div>
                  <div style={{ fontSize: 11 }}>لم تتم إضافة بنود</div>
                </div>
              ) : (
                <div style={{ maxHeight: 350, overflowY: 'auto' }}>
                  {Object.entries(addedItems).map(([key, item]) => {
                    const total = item.places.reduce((s, p) => s + p.area, 0);
                    return (
                      <div key={key} style={{ marginBottom: 10, padding: 10, background: t.cardAlt, borderRadius: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ fontWeight: 600, fontSize: 12 }}>{item.name}</span>
                          <span style={{ fontSize: 10, color: t.muted }}>{item.category}</span>
                        </div>
                        
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
                          {item.places.map(p => (
                            <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 6px', background: t.card, borderRadius: 4, fontSize: 10 }}>
                              <span>{p.name}</span>
                              <span style={{ color: t.accent }}>{p.area}م²</span>
                              <button onClick={() => removePlace(key, p.name)} style={{ background: 'none', border: 'none', color: t.danger, cursor: 'pointer', padding: 0, fontSize: 12 }}>×</button>
                            </div>
                          ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10 }}>
                          <span style={{ color: t.muted }}>{total} م²</span>
                          <div style={{ display: 'flex', gap: 10 }}>
                            <span style={{ color: t.warning }}>{fmt(total * item.exec)}</span>
                            <span style={{ color: t.success }}>+{fmt(total * (item.exec - item.cont))}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== البنود ==================== */}
      {mainTab === 'items' && (
        <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 12 }}>
          
          <div style={{ background: t.card, borderRadius: 12, padding: 10, border: `1px solid ${t.border}`, height: 'fit-content' }}>
            {Object.entries(workItems).map(([key, cat]) => (
              <button key={key} onClick={() => setSelectedCategory(key)} style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: 'none', background: selectedCategory === key ? `${t.accent}15` : 'transparent', color: selectedCategory === key ? t.accent : t.text, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2, textAlign: 'right' }}>
                <span>{cat.icon}</span>
                <span style={{ flex: 1 }}>{cat.name}</span>
                <span style={{ fontSize: 10, color: t.muted }}>{cat.items.length}</span>
              </button>
            ))}
          </div>

          <div style={{ background: t.card, borderRadius: 12, padding: 14, border: `1px solid ${t.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{workItems[selectedCategory]?.icon} {workItems[selectedCategory]?.name}</h3>
              <button onClick={() => openAddItemModal(selectedCategory)} style={{ padding: '6px 12px', borderRadius: 6, border: 'none', background: t.accent, color: '#fff', fontSize: 11, cursor: 'pointer' }}>+ إضافة</button>
            </div>

            <div style={{ display: 'grid', gap: 6 }}>
              {workItems[selectedCategory]?.items.map(item => {
                const typeColor = item.type === 'floor' ? t.success : item.type === 'wall' ? t.info : t.warning;
                return (
                  <div key={item.id} style={{ padding: 10, background: t.cardAlt, borderRadius: 8, border: `1px solid ${t.border}` }}>
                    <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 6 }}>{item.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 9, color: typeColor, background: `${typeColor}15`, padding: '2px 6px', borderRadius: 3 }}>{item.type === 'floor' ? 'أرضية' : item.type === 'wall' ? 'جدران' : 'أسقف'}</span>
                      <div style={{ flex: 1 }} />
                      <span style={{ fontSize: 10, color: t.warning, fontWeight: 600 }}>{item.exec}</span>
                      <span style={{ fontSize: 10, color: t.info, fontWeight: 600 }}>{item.cont}</span>
                      <span style={{ fontSize: 10, color: t.success, fontWeight: 600 }}>{item.exec - item.cont}</span>
                      <button onClick={() => openEditModal(selectedCategory, item)} style={{ width: 24, height: 24, borderRadius: 4, border: 'none', background: `${t.accent}15`, color: t.text, cursor: 'pointer', fontSize: 10 }}>✎</button>
                      <button onClick={() => deleteItem(selectedCategory, item.id)} style={{ width: 24, height: 24, borderRadius: 4, border: 'none', background: `${t.danger}15`, color: t.danger, cursor: 'pointer', fontSize: 12 }}>×</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ==================== البرمجة ==================== */}
      {mainTab === 'programming' && (
        <div style={{ background: t.card, borderRadius: 12, padding: 14, border: `1px solid ${t.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>إدارة الأماكن</h3>
            <button onClick={() => { setPlaceForm({ name: '', icon: '📍', color: '#818cf8' }); setShowPlaceModal(true); }} style={{ padding: '6px 12px', borderRadius: 6, border: 'none', background: t.accent, color: '#fff', fontSize: 11, cursor: 'pointer' }}>+ إضافة مكان</button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Object.keys(places).length}, 1fr)`, gap: 12 }}>
            {Object.entries(places).map(([pk, place]) => (
              <div key={pk} style={{ background: t.cardAlt, borderRadius: 10, border: `1px solid ${t.border}`, opacity: place.enabled ? 1 : 0.5 }}>
                <div style={{ padding: 10, background: `${place.color}15`, borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 16 }}>{place.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, flex: 1 }}>{place.name}</span>
                  <button onClick={() => togglePlaceEnabled(pk)} style={{ width: 32, height: 18, borderRadius: 9, border: 'none', background: place.enabled ? place.color : t.border, cursor: 'pointer', position: 'relative' }}>
                    <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, right: place.enabled ? 2 : 16, transition: 'right 0.2s' }} />
                  </button>
                  <button onClick={() => { setEditingPlaceItems(pk); setShowPlaceItemsModal(true); }} style={{ width: 22, height: 22, borderRadius: 4, border: 'none', background: `${t.accent}20`, color: t.text, cursor: 'pointer', fontSize: 10 }}>✎</button>
                  {!place.isCore && <button onClick={() => deletePlace(pk)} style={{ width: 22, height: 22, borderRadius: 4, border: 'none', background: `${t.danger}15`, color: t.danger, cursor: 'pointer', fontSize: 12 }}>×</button>}
                </div>
                <div style={{ padding: 8, maxHeight: 300, overflowY: 'auto' }}>
                  {Object.entries(workItems).map(([ck, cat]) => {
                    const count = (programming[pk]?.[ck] || []).length;
                    return (
                      <div key={ck} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px', borderRadius: 6, marginBottom: 2, background: count > 0 ? `${place.color}08` : 'transparent' }}>
                        <span style={{ fontSize: 12 }}>{cat.icon}</span>
                        <span style={{ fontSize: 11, flex: 1 }}>{cat.name}</span>
                        <span style={{ fontSize: 9, color: place.color, fontWeight: 600 }}>{count}/{cat.items.length}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== النوافذ ==================== */}
      
      {/* تحرير بند */}
      {showEditModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: t.bg, borderRadius: 16, padding: 20, maxWidth: 400, width: '100%', border: `1px solid ${t.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>✏️ تحرير البند</h3>
              <button onClick={() => setShowEditModal(false)} style={{ background: 'none', border: 'none', fontSize: 20, color: t.muted, cursor: 'pointer' }}>×</button>
            </div>

            <div style={{ display: 'grid', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, color: t.muted, display: 'block', marginBottom: 4 }}>الاسم</label>
                <input type="text" value={editForm.name} onChange={(e) => setEditForm(p => ({ ...p, name: e.target.value }))} style={{ width: '100%', padding: 10, borderRadius: 8, border: `1px solid ${t.border}`, background: t.card, color: t.text, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              
              <div>
                <label style={{ fontSize: 11, color: t.muted, display: 'block', marginBottom: 4 }}>التخصص</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                  {[{ k: 'floor', l: 'أرضية', c: t.success }, { k: 'wall', l: 'جدران', c: t.info }, { k: 'ceiling', l: 'أسقف', c: t.warning }].map(x => (
                    <button key={x.k} onClick={() => setEditForm(p => ({ ...p, type: x.k }))} style={{ padding: 8, borderRadius: 6, border: editForm.type === x.k ? `2px solid ${x.c}` : `1px solid ${t.border}`, background: editForm.type === x.k ? `${x.c}15` : t.card, color: editForm.type === x.k ? x.c : t.text, fontSize: 11, cursor: 'pointer' }}>{x.l}</button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 11, color: t.muted, display: 'block', marginBottom: 4 }}>سعر التنفيذ</label>
                  <input type="number" value={editForm.exec} onChange={(e) => setEditForm(p => ({ ...p, exec: parseFloat(e.target.value) || 0 }))} style={{ width: '100%', padding: 10, borderRadius: 8, border: `1px solid ${t.warning}40`, background: `${t.warning}10`, color: t.warning, fontSize: 14, fontWeight: 600, outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: t.muted, display: 'block', marginBottom: 4 }}>سعر المقاول</label>
                  <input type="number" value={editForm.cont} onChange={(e) => setEditForm(p => ({ ...p, cont: parseFloat(e.target.value) || 0 }))} style={{ width: '100%', padding: 10, borderRadius: 8, border: `1px solid ${t.info}40`, background: `${t.info}10`, color: t.info, fontSize: 14, fontWeight: 600, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ padding: 12, borderRadius: 8, background: `${t.success}10`, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: t.muted, fontSize: 11 }}>الربح</span>
                <span style={{ color: t.success, fontSize: 16, fontWeight: 700 }}>{editForm.exec - editForm.cont} ر.س</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button onClick={() => { if (editingItem) { deleteItem(editingItem.catKey, editingItem.itemId); setShowEditModal(false); } }} style={{ padding: 10, borderRadius: 8, border: 'none', background: `${t.danger}15`, color: t.danger, fontSize: 12, cursor: 'pointer' }}>🗑️</button>
              <div style={{ flex: 1 }} />
              <button onClick={() => setShowEditModal(false)} style={{ padding: '10px 16px', borderRadius: 8, border: `1px solid ${t.border}`, background: 'transparent', color: t.text, fontSize: 12, cursor: 'pointer' }}>إلغاء</button>
              <button onClick={saveEdit} style={{ padding: '10px 16px', borderRadius: 8, border: 'none', background: t.accent, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>حفظ</button>
            </div>
          </div>
        </div>
      )}

      {/* إضافة بند */}
      {showAddItemModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: t.bg, borderRadius: 16, padding: 20, maxWidth: 400, width: '100%', border: `1px solid ${t.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>+ إضافة بند</h3>
              <button onClick={() => setShowAddItemModal(false)} style={{ background: 'none', border: 'none', fontSize: 20, color: t.muted, cursor: 'pointer' }}>×</button>
            </div>

            <div style={{ display: 'grid', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, color: t.muted, display: 'block', marginBottom: 4 }}>التصنيف</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {Object.entries(workItems).map(([k, c]) => (
                    <button key={k} onClick={() => setAddItemForm(p => ({ ...p, category: k }))} style={{ padding: '4px 8px', borderRadius: 4, border: addItemForm.category === k ? `2px solid ${t.accent}` : `1px solid ${t.border}`, background: addItemForm.category === k ? `${t.accent}15` : t.card, color: addItemForm.category === k ? t.accent : t.text, fontSize: 10, cursor: 'pointer' }}>{c.icon} {c.name}</button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, color: t.muted, display: 'block', marginBottom: 4 }}>الاسم</label>
                <input type="text" value={addItemForm.name} onChange={(e) => setAddItemForm(p => ({ ...p, name: e.target.value }))} placeholder="مثال: تركيب سيراميك" style={{ width: '100%', padding: 10, borderRadius: 8, border: `1px solid ${t.border}`, background: t.card, color: t.text, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ fontSize: 11, color: t.muted, display: 'block', marginBottom: 4 }}>التخصص</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                  {[{ k: 'floor', l: 'أرضية', c: t.success }, { k: 'wall', l: 'جدران', c: t.info }, { k: 'ceiling', l: 'أسقف', c: t.warning }].map(x => (
                    <button key={x.k} onClick={() => setAddItemForm(p => ({ ...p, type: x.k }))} style={{ padding: 8, borderRadius: 6, border: addItemForm.type === x.k ? `2px solid ${x.c}` : `1px solid ${t.border}`, background: addItemForm.type === x.k ? `${x.c}15` : t.card, color: addItemForm.type === x.k ? x.c : t.text, fontSize: 11, cursor: 'pointer' }}>{x.l}</button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 11, color: t.muted, display: 'block', marginBottom: 4 }}>سعر التنفيذ</label>
                  <input type="number" value={addItemForm.exec} onChange={(e) => setAddItemForm(p => ({ ...p, exec: parseFloat(e.target.value) || 0 }))} style={{ width: '100%', padding: 10, borderRadius: 8, border: `1px solid ${t.warning}40`, background: `${t.warning}10`, color: t.warning, fontSize: 14, fontWeight: 600, outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: t.muted, display: 'block', marginBottom: 4 }}>سعر المقاول</label>
                  <input type="number" value={addItemForm.cont} onChange={(e) => setAddItemForm(p => ({ ...p, cont: parseFloat(e.target.value) || 0 }))} style={{ width: '100%', padding: 10, borderRadius: 8, border: `1px solid ${t.info}40`, background: `${t.info}10`, color: t.info, fontSize: 14, fontWeight: 600, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button onClick={() => setShowAddItemModal(false)} style={{ flex: 1, padding: 10, borderRadius: 8, border: `1px solid ${t.border}`, background: 'transparent', color: t.text, fontSize: 12, cursor: 'pointer' }}>إلغاء</button>
              <button onClick={saveNewItem} style={{ flex: 1, padding: 10, borderRadius: 8, border: 'none', background: t.accent, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>+ إضافة</button>
            </div>
          </div>
        </div>
      )}

      {/* إضافة مكان */}
      {showPlaceModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: t.bg, borderRadius: 16, padding: 20, maxWidth: 350, width: '100%', border: `1px solid ${t.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>+ إضافة مكان</h3>
              <button onClick={() => setShowPlaceModal(false)} style={{ background: 'none', border: 'none', fontSize: 20, color: t.muted, cursor: 'pointer' }}>×</button>
            </div>

            <div style={{ display: 'grid', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, color: t.muted, display: 'block', marginBottom: 4 }}>الاسم</label>
                <input type="text" value={placeForm.name} onChange={(e) => setPlaceForm(p => ({ ...p, name: e.target.value }))} placeholder="مثال: ملحق" style={{ width: '100%', padding: 10, borderRadius: 8, border: `1px solid ${t.border}`, background: t.card, color: t.text, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ fontSize: 11, color: t.muted, display: 'block', marginBottom: 4 }}>الأيقونة</label>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {['🏠', '🚿', '🌳', '🏢', '🏬', '📍', '⛺', '🏭'].map(i => (
                    <button key={i} onClick={() => setPlaceForm(p => ({ ...p, icon: i }))} style={{ width: 32, height: 32, borderRadius: 6, border: placeForm.icon === i ? `2px solid ${placeForm.color}` : `1px solid ${t.border}`, background: placeForm.icon === i ? `${placeForm.color}20` : t.card, fontSize: 16, cursor: 'pointer' }}>{i}</button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, color: t.muted, display: 'block', marginBottom: 4 }}>اللون</label>
                <div style={{ display: 'flex', gap: 4 }}>
                  {['#818cf8', '#22d3ee', '#4ade80', '#fbbf24', '#f87171', '#a78bfa'].map(c => (
                    <button key={c} onClick={() => setPlaceForm(p => ({ ...p, color: c }))} style={{ width: 28, height: 28, borderRadius: 6, border: placeForm.color === c ? `2px solid ${t.text}` : `1px solid ${t.border}`, background: c, cursor: 'pointer' }} />
                  ))}
                </div>
              </div>

              <div style={{ padding: 10, borderRadius: 8, background: `${placeForm.color}10`, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>{placeForm.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: placeForm.color }}>{placeForm.name || 'اسم المكان'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button onClick={() => setShowPlaceModal(false)} style={{ flex: 1, padding: 10, borderRadius: 8, border: `1px solid ${t.border}`, background: 'transparent', color: t.text, fontSize: 12, cursor: 'pointer' }}>إلغاء</button>
              <button onClick={savePlace} style={{ flex: 1, padding: 10, borderRadius: 8, border: 'none', background: placeForm.color, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>+ إضافة</button>
            </div>
          </div>
        </div>
      )}

      {/* تحرير بنود المكان */}
      {showPlaceItemsModal && editingPlaceItems && places[editingPlaceItems] && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: t.bg, borderRadius: 16, padding: 20, maxWidth: 600, width: '100%', maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', border: `1px solid ${t.border}` }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexShrink: 0 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20 }}>{places[editingPlaceItems].icon}</span>
                <span style={{ color: places[editingPlaceItems].color }}>{places[editingPlaceItems].name}</span>
              </h3>
              <button onClick={() => setShowPlaceItemsModal(false)} style={{ background: 'none', border: 'none', fontSize: 20, color: t.muted, cursor: 'pointer' }}>×</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {Object.entries(workItems).map(([ck, cat]) => {
                const enabled = programming[editingPlaceItems]?.[ck] || [];
                return (
                  <div key={ck} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 6, background: t.cardAlt, marginBottom: 6 }}>
                      <span style={{ fontSize: 12 }}>{cat.icon}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, flex: 1 }}>{cat.name}</span>
                      <span style={{ fontSize: 9, color: places[editingPlaceItems].color }}>{enabled.length}/{cat.items.length}</span>
                      <button onClick={() => toggleAllCategory(editingPlaceItems, ck, enabled.length !== cat.items.length)} style={{ padding: '3px 8px', borderRadius: 4, border: 'none', background: enabled.length === cat.items.length ? `${t.danger}15` : `${places[editingPlaceItems].color}15`, color: enabled.length === cat.items.length ? t.danger : places[editingPlaceItems].color, fontSize: 9, cursor: 'pointer' }}>
                        {enabled.length === cat.items.length ? 'إلغاء الكل' : 'تفعيل الكل'}
                      </button>
                    </div>
                    
                    <div style={{ display: 'grid', gap: 4 }}>
                      {cat.items.map(item => {
                        const isOn = enabled.includes(item.id);
                        return (
                          <div key={item.id} onClick={() => toggleProgramming(editingPlaceItems, ck, item.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px', borderRadius: 6, background: isOn ? `${places[editingPlaceItems].color}08` : t.card, border: `1px solid ${isOn ? places[editingPlaceItems].color + '30' : t.border}`, cursor: 'pointer' }}>
                            <div style={{ width: 14, height: 14, borderRadius: 3, border: `2px solid ${isOn ? places[editingPlaceItems].color : t.border}`, background: isOn ? places[editingPlaceItems].color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 8 }}>{isOn && '✓'}</div>
                            <span style={{ fontSize: 11, flex: 1, color: isOn ? t.text : t.muted }}>{item.name}</span>
                            <span style={{ fontSize: 9, color: t.warning }}>{item.exec}</span>
                            <span style={{ fontSize: 9, color: t.info }}>{item.cont}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${t.border}`, flexShrink: 0 }}>
              <button onClick={() => setShowPlaceItemsModal(false)} style={{ width: '100%', padding: 10, borderRadius: 8, border: 'none', background: places[editingPlaceItems].color, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>✓ حفظ وإغلاق</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuantityCalculator;
