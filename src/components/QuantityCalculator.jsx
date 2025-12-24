import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const QuantityCalculator = ({ 
  darkMode = true,
  txt = 'text-white',
  txtSm = 'text-gray-400',
  card = 'bg-gray-800/80 backdrop-blur-sm',
  accentGradient = 'from-blue-500 to-purple-600'
}) => {
  const [mainTab, setMainTab] = useState('calculator');
  const [loading, setLoading] = useState(true);

  // ============ البيانات الافتراضية ============
  const defaultPlaces = {
    dry: ['صالة', 'مجلس', 'مكتب', 'غرفة طعام', 'ممر', 'غرفة نوم رئيسية', 'غرفة نوم 1', 'غرفة نوم 2'],
    wet: ['مطبخ', 'دورة مياه رئيسية', 'دورة مياه 1', 'دورة مياه 2', 'غرفة غسيل'],
    outdoor: ['حوش', 'سطح', 'موقف', 'حديقة']
  };

  const defaultWorkItems = {
    tiles: { name: 'البلاط', icon: '🔲', items: [
      { id: 't1', name: 'إزالة متوسطة', exec: 13, cont: 8, type: 'floor' },
      { id: 't2', name: 'إزالة كبيرة', exec: 20, cont: 12, type: 'floor' },
      { id: 't3', name: 'صبة شامل مواد', exec: 47, cont: 35, type: 'floor' },
      { id: 't4', name: 'صبة بدون مواد', exec: 20, cont: 14, type: 'floor' },
      { id: 't5', name: 'تبليط كبير', exec: 33, cont: 22, type: 'floor' },
      { id: 't6', name: 'تبليط صغير', exec: 25, cont: 17, type: 'floor' },
      { id: 't7', name: 'نعلات', exec: 13, cont: 8, type: 'floor' },
      { id: 't8', name: 'رصيف بلدورات', exec: 33, cont: 22, type: 'floor' },
      { id: 't9', name: 'رصيف بلاط', exec: 33, cont: 22, type: 'floor' },
    ]},
    paint: { name: 'الدهانات', icon: '🎨', items: [
      { id: 'p1', name: 'داخلي جوتن', exec: 21, cont: 14, type: 'wall' },
      { id: 'p2', name: 'داخلي الجزيرة', exec: 20, cont: 13, type: 'wall' },
      { id: 'p3', name: 'داخلي عسيب', exec: 19, cont: 12, type: 'wall' },
      { id: 'p4', name: 'داخلي بدون مواد', exec: 12, cont: 8, type: 'wall' },
      { id: 'p5', name: 'خارجي رشة', exec: 19, cont: 12, type: 'wall' },
      { id: 'p6', name: 'بروفايل جوتن', exec: 33, cont: 22, type: 'wall' },
      { id: 'p7', name: 'بروفايل الجزيرة', exec: 33, cont: 22, type: 'wall' },
    ]},
    paintRenew: { name: 'تجديد دهانات', icon: '🔄', items: [
      { id: 'pr1', name: 'إزالة دهان', exec: 5, cont: 3, type: 'wall' },
      { id: 'pr2', name: 'تجديد جوتن', exec: 16, cont: 10, type: 'wall' },
      { id: 'pr3', name: 'تجديد الجزيرة', exec: 15, cont: 9, type: 'wall' },
    ]},
    gypsum: { name: 'الجبس', icon: '🏛️', items: [
      { id: 'g1', name: 'جبسمبورد', exec: 60, cont: 40, type: 'ceiling' },
      { id: 'g2', name: 'جبس بلدي', exec: 53, cont: 35, type: 'ceiling' },
      { id: 'g3', name: 'إزالة جبس', exec: 5, cont: 3, type: 'ceiling' },
    ]},
    plaster: { name: 'اللياسة', icon: '🧱', items: [
      { id: 'pl1', name: 'قدة وزاوية', exec: 13, cont: 8, type: 'wall' },
      { id: 'pl2', name: 'ودع وقدة', exec: 20, cont: 13, type: 'wall' },
    ]},
    construction: { name: 'الإنشائيات', icon: '🏗️', items: [
      { id: 'c1', name: 'عظم + مواد', exec: 998, cont: 750, type: 'floor' },
      { id: 'c2', name: 'عظم فقط', exec: 665, cont: 500, type: 'floor' },
    ]},
    electrical: { name: 'الكهرباء', icon: '⚡', items: [
      { id: 'e1', name: 'تأسيس شامل', exec: 45, cont: 30, type: 'floor' },
      { id: 'e2', name: 'تشطيب', exec: 25, cont: 18, type: 'floor' },
      { id: 'e3', name: 'صيانة', exec: 15, cont: 10, type: 'floor' },
    ]},
    plumbing: { name: 'السباكة', icon: '🔧', items: [
      { id: 'pb1', name: 'تأسيس شامل', exec: 80, cont: 55, type: 'floor' },
      { id: 'pb2', name: 'تشطيب', exec: 40, cont: 28, type: 'floor' },
      { id: 'pb3', name: 'صيانة', exec: 20, cont: 12, type: 'floor' },
    ]},
    insulation: { name: 'العزل', icon: '🛡️', items: [
      { id: 'i1', name: 'عزل مائي', exec: 35, cont: 25, type: 'floor' },
      { id: 'i2', name: 'عزل حراري', exec: 30, cont: 20, type: 'floor' },
      { id: 'i3', name: 'عزل صوتي', exec: 40, cont: 28, type: 'wall' },
    ]},
    doors: { name: 'الأبواب', icon: '🚪', items: [
      { id: 'd1', name: 'باب خشب', exec: 800, cont: 600, type: 'unit' },
      { id: 'd2', name: 'باب حديد', exec: 1200, cont: 900, type: 'unit' },
      { id: 'd3', name: 'باب ألمنيوم', exec: 600, cont: 450, type: 'unit' },
    ]},
    windows: { name: 'النوافذ', icon: '🪟', items: [
      { id: 'w1', name: 'ألمنيوم عادي', exec: 350, cont: 250, type: 'floor' },
      { id: 'w2', name: 'ألمنيوم دبل', exec: 500, cont: 380, type: 'floor' },
      { id: 'w3', name: 'UPVC', exec: 450, cont: 320, type: 'floor' },
    ]},
    ac: { name: 'التكييف', icon: '❄️', items: [
      { id: 'ac1', name: 'تأسيس سبليت', exec: 300, cont: 200, type: 'unit' },
      { id: 'ac2', name: 'تأسيس مركزي', exec: 150, cont: 100, type: 'floor' },
      { id: 'ac3', name: 'تركيب وحدة', exec: 250, cont: 180, type: 'unit' },
    ]},
  };

  const defaultPlaceTypes = {
    dry: { name: 'جاف', icon: '🏠', color: 'indigo', enabled: true, isCore: true },
    wet: { name: 'رطب', icon: '🚿', color: 'cyan', enabled: true, isCore: true },
    outdoor: { name: 'خارجي', icon: '🌳', color: 'emerald', enabled: true, isCore: true }
  };

  const defaultProgramming = {
    dry: { tiles: ['t1','t2','t3','t4','t5','t6','t7'], paint: ['p1','p2','p3','p4'], paintRenew: ['pr1','pr2','pr3'], gypsum: ['g1','g2','g3'], plaster: ['pl1','pl2'], electrical: ['e1','e2','e3'], insulation: ['i3'], doors: ['d1','d2','d3'], ac: ['ac1','ac2','ac3'] },
    wet: { tiles: ['t1','t2','t3','t4','t5','t6'], paint: ['p5'], gypsum: ['g1','g3'], plaster: ['pl1','pl2'], plumbing: ['pb1','pb2','pb3'], electrical: ['e1','e2'], insulation: ['i1'], doors: ['d1','d3'] },
    outdoor: { tiles: ['t5','t8','t9'], paint: ['p5','p6','p7'], plaster: ['pl1','pl2'], construction: ['c1','c2'], insulation: ['i1','i2'], doors: ['d2'], windows: ['w1','w2','w3'] }
  };

  // ============ الحالات ============
  const [workItems, setWorkItems] = useState(defaultWorkItems);
  const [placeTypes, setPlaceTypes] = useState(defaultPlaceTypes);
  const [programming, setProgramming] = useState(defaultProgramming);
  const [locationType, setLocationType] = useState('');
  const [location, setLocation] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [addedItems, setAddedItems] = useState({});
  const [inputMethod, setInputMethod] = useState('direct');
  const [area, setArea] = useState(0);
  const [length, setLength] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(4);
  
  const [showProfitModal, setShowProfitModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('tiles');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', exec: 0, cont: 0, type: 'floor' });
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [addItemForm, setAddItemForm] = useState({ name: '', exec: 0, cont: 0, type: 'floor', category: 'tiles' });
  const [showPlaceModal, setShowPlaceModal] = useState(false);
  const [placeForm, setPlaceForm] = useState({ name: '', icon: '📍', color: 'indigo' });
  const [showPlaceItemsModal, setShowPlaceItemsModal] = useState(false);
  const [editingPlaceItems, setEditingPlaceItems] = useState(null);
  const [showAddedItemModal, setShowAddedItemModal] = useState(false);
  const [editingAddedItem, setEditingAddedItem] = useState(null);

  // ============ Firebase ============
  useEffect(() => {
    const unsubs = [];
    unsubs.push(onSnapshot(doc(db, 'calculator', 'workItems'), (snap) => { 
      if (snap.exists()) setWorkItems(snap.data()); 
      setLoading(false); 
    }, () => setLoading(false)));
    unsubs.push(onSnapshot(doc(db, 'calculator', 'placeTypes'), (snap) => { 
      if (snap.exists()) setPlaceTypes(snap.data()); 
    }));
    unsubs.push(onSnapshot(doc(db, 'calculator', 'programming'), (snap) => { 
      if (snap.exists()) setProgramming(snap.data()); 
    }));
    return () => unsubs.forEach(u => u());
  }, []);

  const saveWorkItems = async (d) => { try { await setDoc(doc(db, 'calculator', 'workItems'), d); } catch (e) { console.error(e); } };
  const savePlaceTypes = async (d) => { try { await setDoc(doc(db, 'calculator', 'placeTypes'), d); } catch (e) { console.error(e); } };
  const saveProgramming = async (d) => { try { await setDoc(doc(db, 'calculator', 'programming'), d); } catch (e) { console.error(e); } };

  // ============ دوال مساعدة ============
  const quickAreas = [5, 10, 15, 20, 25, 30];
  const calcFloorArea = () => length * width;
  const calcWallArea = () => 2 * (length + width) * height;
  const getArea = () => inputMethod === 'direct' ? area : calcFloorArea();
  const getWallArea = () => inputMethod === 'dimensions' ? calcWallArea() : 0;
  const getFloorFormula = () => inputMethod === 'dimensions' && length > 0 && width > 0 ? `${length}×${width}=${calcFloorArea()}` : '';
  const getWallFormula = () => inputMethod === 'dimensions' && length > 0 && width > 0 ? `2(${length}+${width})×${height}=${calcWallArea()}` : '';
  const adjustValue = (setter, value, delta, min = 0) => { const nv = Math.max(min, value + delta); setter(Number.isInteger(nv) ? nv : parseFloat(nv.toFixed(1))); };
  const fmt = (n) => n.toLocaleString('ar-SA');

  // ============ دوال البرمجة ============
  const toggleProgramming = (pt, ck, iid) => {
    const np = JSON.parse(JSON.stringify(programming));
    if (!np[pt]) np[pt] = {};
    if (!np[pt][ck]) np[pt][ck] = [];
    np[pt][ck] = np[pt][ck].includes(iid) ? np[pt][ck].filter(id => id !== iid) : [...np[pt][ck], iid];
    setProgramming(np);
    saveProgramming(np);
  };

  const toggleAllCategory = (pt, ck, en) => {
    const np = JSON.parse(JSON.stringify(programming));
    if (!np[pt]) np[pt] = {};
    np[pt][ck] = en ? workItems[ck].items.map(i => i.id) : [];
    setProgramming(np);
    saveProgramming(np);
  };

  const isItemEnabled = (pt, ck, iid) => programming[pt]?.[ck]?.includes(iid) || false;
  const isCategoryFullyEnabled = (pt, ck) => (programming[pt]?.[ck] || []).length === (workItems[ck]?.items?.length || 0);
  const isCategoryPartiallyEnabled = (pt, ck) => { const e = programming[pt]?.[ck] || []; return e.length > 0 && e.length < (workItems[ck]?.items?.length || 0); };

  // ============ دوال تحرير البنود ============
  const openEditModal = (ck, item) => {
    setEditingItem({ catKey: ck, itemId: item.id });
    setEditForm({ name: item.name, exec: item.exec, cont: item.cont, type: item.type });
    setShowEditModal(true);
  };

  const saveEdit = () => {
    if (!editingItem) return;
    const nw = JSON.parse(JSON.stringify(workItems));
    nw[editingItem.catKey].items = nw[editingItem.catKey].items.map(i => 
      i.id === editingItem.itemId ? { ...i, ...editForm } : i
    );
    setWorkItems(nw);
    saveWorkItems(nw);
    setShowEditModal(false);
    setEditingItem(null);
  };

  const deleteItem = (ck, iid) => {
    const nw = JSON.parse(JSON.stringify(workItems));
    nw[ck].items = nw[ck].items.filter(i => i.id !== iid);
    setWorkItems(nw);
    saveWorkItems(nw);
    const np = JSON.parse(JSON.stringify(programming));
    Object.keys(np).forEach(pk => { if (np[pk]?.[ck]) np[pk][ck] = np[pk][ck].filter(id => id !== iid); });
    setProgramming(np);
    saveProgramming(np);
  };

  const openAddItemModal = (ck = null) => {
    setAddItemForm({ name: '', exec: 0, cont: 0, type: 'floor', category: ck || selectedCategory });
    setShowAddItemModal(true);
  };

  const saveNewItem = () => {
    if (!addItemForm.name.trim()) return;
    const nw = JSON.parse(JSON.stringify(workItems));
    nw[addItemForm.category].items.push({ id: `item_${Date.now()}`, name: addItemForm.name, exec: Number(addItemForm.exec), cont: Number(addItemForm.cont), type: addItemForm.type });
    setWorkItems(nw);
    saveWorkItems(nw);
    setShowAddItemModal(false);
  };

  // ============ دوال الأماكن ============
  const openPlaceModal = () => { setPlaceForm({ name: '', icon: '📍', color: 'indigo' }); setShowPlaceModal(true); };

  const savePlace = () => {
    if (!placeForm.name.trim()) return;
    const npt = JSON.parse(JSON.stringify(placeTypes));
    npt[`place_${Date.now()}`] = { ...placeForm, enabled: true, isCore: false };
    setPlaceTypes(npt);
    savePlaceTypes(npt);
    const np = JSON.parse(JSON.stringify(programming));
    np[`place_${Date.now()}`] = {};
    setProgramming(np);
    saveProgramming(np);
    setShowPlaceModal(false);
  };

  const togglePlaceEnabled = (pk) => {
    const npt = JSON.parse(JSON.stringify(placeTypes));
    npt[pk].enabled = !npt[pk].enabled;
    setPlaceTypes(npt);
    savePlaceTypes(npt);
  };

  const deletePlace = (pk) => {
    if (placeTypes[pk]?.isCore) return;
    const npt = JSON.parse(JSON.stringify(placeTypes));
    delete npt[pk];
    setPlaceTypes(npt);
    savePlaceTypes(npt);
    const np = JSON.parse(JSON.stringify(programming));
    delete np[pk];
    setProgramming(np);
    saveProgramming(np);
  };

  const openPlaceItemsModal = (pk) => { setEditingPlaceItems(pk); setShowPlaceItemsModal(true); };

  // ============ دوال الحاسبة ============
  const toggleItem = (id) => setSelectedItems(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  
  const getAvailableItems = () => {
    if (!locationType) return [];
    const items = [];
    Object.entries(workItems).forEach(([ck, cat]) => {
      const eids = programming[locationType]?.[ck] || [];
      cat.items.forEach(i => { if (eids.includes(i.id)) items.push({ ...i, cat: cat.name, catKey: ck }); });
    });
    return items;
  };

  const addItems = () => {
    const fa = getArea(), wa = getWallArea();
    if (!location || fa <= 0 || selectedItems.length === 0) return;
    const ff = getFloorFormula(), wf = getWallFormula();
    const nai = JSON.parse(JSON.stringify(addedItems));
    const avail = getAvailableItems();
    selectedItems.forEach(id => {
      const item = avail.find(w => w.id === id);
      if (!item) return;
      const isWall = item.type === 'wall' || item.type === 'ceiling';
      const finalArea = isWall && wa > 0 ? wa : fa;
      const formula = isWall && wf ? wf : ff;
      const key = `${item.id}`;
      if (!nai[key]) nai[key] = { ...item, places: [] };
      const ep = nai[key].places.find(p => p.name === location);
      if (ep) { ep.area += finalArea; if (formula && !ep.formula?.includes(formula)) ep.formula = ep.formula ? `${ep.formula} + ${formula}` : formula; }
      else { nai[key].places.push({ name: location, area: finalArea, formula, areaType: isWall ? 'wall' : 'floor' }); }
    });
    setAddedItems(nai);
    setSelectedItems([]);
  };

  const removeItem = (key) => { const ni = { ...addedItems }; delete ni[key]; setAddedItems(ni); };
  const removePlace = (key, pn) => { const ni = JSON.parse(JSON.stringify(addedItems)); ni[key].places = ni[key].places.filter(p => p.name !== pn); if (ni[key].places.length === 0) delete ni[key]; setAddedItems(ni); };
  const clearAll = () => setAddedItems({});

  const openAddedItemModal = (key, item) => { setEditingAddedItem({ key, item: JSON.parse(JSON.stringify(item)) }); setShowAddedItemModal(true); };
  const saveAddedItemEdit = () => { if (!editingAddedItem) return; const nai = { ...addedItems }; nai[editingAddedItem.key] = editingAddedItem.item; setAddedItems(nai); setShowAddedItemModal(false); setEditingAddedItem(null); };
  const updateAddedItemPlace = (idx, val) => { if (!editingAddedItem) return; const u = { ...editingAddedItem }; u.item.places[idx].area = Number(val) || 0; setEditingAddedItem(u); };

  const getTotals = () => {
    let e = 0, c = 0, totalArea = 0;
    Object.values(addedItems).forEach(i => { const ta = i.places.reduce((s, p) => s + p.area, 0); totalArea += ta; e += ta * i.exec; c += ta * i.cont; });
    return { exec: e, cont: c, profit: e - c, totalArea };
  };

  const totals = getTotals();
  const itemCount = Object.keys(addedItems).length;
  const canAdd = location && getArea() > 0 && selectedItems.length > 0;
  const totalItemsCount = Object.values(workItems).reduce((s, c) => s + c.items.length, 0);

  // ============ التحميل ============
  if (loading) return (
    <div className="min-h-[50vh] flex items-center justify-center" dir="rtl">
      <div className="text-center">
        <div className={`w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4 ${darkMode ? 'border-blue-500' : 'border-blue-600'}`} />
        <p className={txt}>جاري التحميل...</p>
      </div>
    </div>
  );

  const border = darkMode ? 'border-gray-700' : 'border-gray-200';
  const cardAlt = darkMode ? 'bg-gray-700/50' : 'bg-gray-100';
  const input = `w-full p-3 rounded-xl border outline-none ${darkMode ? 'border-gray-600 bg-gray-700/50' : 'border-gray-300 bg-white'} ${txt}`;

  // ============ الواجهة ============
  return (
    <div className="p-4 md:p-6" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-4">
        
        {/* Header */}
        <div className={`${card} rounded-2xl p-5 border ${border}`}>
          <div className="flex justify-between items-center flex-wrap gap-3">
            <div>
              <h1 className={`text-xl font-bold ${txt}`}>حاسبة الكميات</h1>
              <p className={`text-sm ${txtSm}`}>إجمالي {totalItemsCount} بند في {Object.keys(workItems).length} تصنيف</p>
            </div>
            <button onClick={() => setShowProfitModal(true)} className={`px-4 py-2 bg-gradient-to-r ${accentGradient} text-white rounded-xl font-medium text-sm`}>📊 الأرباح</button>
          </div>
        </div>

        {/* Tabs */}
        <div className={`${card} rounded-xl p-1.5 border ${border}`}>
          <div className="flex gap-1">
            {[{ key: 'calculator', label: '🧮 الحاسبة' }, { key: 'items', label: '📋 البنود' }, { key: 'programming', label: '⚙️ البرمجة' }].map(tab => (
              <button key={tab.key} onClick={() => setMainTab(tab.key)} className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all ${mainTab === tab.key ? `bg-gradient-to-r ${accentGradient} text-white` : `${txtSm} hover:bg-gray-700/50`}`}>{tab.label}</button>
            ))}
          </div>
        </div>

        {/* ==================== تاب الحاسبة ==================== */}
        {mainTab === 'calculator' && (
          <>
            <div className={`${card} rounded-2xl p-5 border ${border} space-y-4`}>
              
              {/* نوع المكان */}
              <div>
                <label className={`block text-sm font-medium mb-3 ${txt}`}>📍 نوع المكان</label>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(placeTypes).filter(([_, p]) => p.enabled).map(([key, place]) => (
                    <button key={key} onClick={() => { setLocationType(key); setLocation(''); setSelectedItems([]); }} className={`p-4 rounded-xl border-2 text-center transition-all ${locationType === key ? `border-${place.color}-500 bg-${place.color}-500/15` : `${darkMode ? 'border-gray-600 bg-gray-700/30' : 'border-gray-300 bg-gray-100'}`}`}>
                      <div className="text-2xl mb-1">{place.icon}</div>
                      <div className={`text-sm font-medium ${txt}`}>{place.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* المكان */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${txt}`}>🏷️ المكان</label>
                <select value={location} onChange={(e) => setLocation(e.target.value)} disabled={!locationType} className={input}>
                  <option value="">اختر المكان</option>
                  {locationType && defaultPlaces[locationType]?.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              {/* المساحة */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${txt}`}>📐 المساحة</label>
                <div className={`${cardAlt} rounded-xl p-4 space-y-4`}>
                  <div className="flex gap-2">
                    <button onClick={() => setInputMethod('direct')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${inputMethod === 'direct' ? `bg-gradient-to-r ${accentGradient} text-white` : txtSm}`}>مساحة مباشرة</button>
                    <button onClick={() => setInputMethod('dimensions')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${inputMethod === 'dimensions' ? `bg-gradient-to-r ${accentGradient} text-white` : txtSm}`}>أبعاد الغرفة</button>
                  </div>

                  {inputMethod === 'direct' ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-4">
                        <button onClick={() => adjustValue(setArea, area, -1)} className={`w-12 h-12 rounded-xl border text-xl font-bold ${darkMode ? 'border-gray-600 bg-gray-800 hover:bg-gray-700' : 'border-gray-300 bg-white hover:bg-gray-50'} ${txt}`}>−</button>
                        <div className="text-center">
                          <input type="number" value={area || ''} onChange={(e) => setArea(parseFloat(e.target.value) || 0)} className={`w-24 text-center text-3xl font-bold bg-transparent border-none outline-none ${txt}`} placeholder="0" />
                          <div className={`text-sm ${txtSm}`}>م²</div>
                        </div>
                        <button onClick={() => adjustValue(setArea, area, 1)} className={`w-12 h-12 rounded-xl border text-xl font-bold ${darkMode ? 'border-gray-600 bg-gray-800 hover:bg-gray-700' : 'border-gray-300 bg-white hover:bg-gray-50'} ${txt}`}>+</button>
                      </div>
                      <div className="flex gap-2 justify-center flex-wrap">
                        {quickAreas.map(v => (<button key={v} onClick={() => setArea(v)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${area === v ? `bg-gradient-to-r ${accentGradient} text-white` : `${cardAlt} ${txt} hover:opacity-80`}`}>{v}</button>))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-3">
                        {[{ l: 'الطول', v: length, s: setLength }, { l: 'العرض', v: width, s: setWidth }, { l: 'الارتفاع', v: height, s: setHeight, c: 'yellow' }].map(({ l, v, s, c }) => (
                          <div key={l} className="text-center">
                            <label className={`text-xs font-medium mb-1 block ${c ? 'text-yellow-400' : txtSm}`}>{l}</label>
                            <div className="flex items-center justify-center gap-1">
                              <button onClick={() => adjustValue(s, v, -0.5)} className={`w-8 h-8 rounded-lg border text-sm font-bold ${c ? 'border-yellow-500/40 bg-yellow-500/20 text-yellow-400' : `${darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'} ${txt}`}`}>−</button>
                              <input type="number" value={v || ''} onChange={(e) => s(parseFloat(e.target.value) || 0)} className={`w-12 text-center text-lg font-bold bg-transparent border-none outline-none ${c ? 'text-yellow-400' : txt}`} />
                              <button onClick={() => adjustValue(s, v, 0.5)} className={`w-8 h-8 rounded-lg border text-sm font-bold ${c ? 'border-yellow-500/40 bg-yellow-500/20 text-yellow-400' : `${darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'} ${txt}`}`}>+</button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                          <div className="text-lg font-bold text-emerald-400">{calcFloorArea()}</div>
                          <div className={`text-xs ${txtSm}`}>م² أرضية</div>
                        </div>
                        <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-center">
                          <div className="text-lg font-bold text-cyan-400">{calcWallArea()}</div>
                          <div className={`text-xs ${txtSm}`}>م² جدران</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* بنود العمل */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${txt}`}>🔧 بنود العمل</label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {getAvailableItems().map(item => (
                    <div key={item.id} onClick={() => toggleItem(item.id)} className={`p-3 rounded-xl border cursor-pointer transition-all ${selectedItems.includes(item.id) ? 'border-indigo-500 bg-indigo-500/10' : `${darkMode ? 'border-gray-600 bg-gray-700/30' : 'border-gray-300 bg-gray-100'}`}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${txt}`}>{item.cat} - {item.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${item.type === 'floor' ? 'bg-emerald-500/20 text-emerald-400' : item.type === 'wall' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{item.type === 'wall' ? 'جدران' : item.type === 'ceiling' ? 'أسقف' : 'أرضية'}</span>
                        </div>
                        <span className={`text-sm ${txtSm} ${cardAlt} px-2 py-1 rounded-lg`}>{item.exec} ر.س</span>
                      </div>
                    </div>
                  ))}
                  {locationType && getAvailableItems().length === 0 && <div className={`text-center py-8 ${txtSm}`}>لا توجد بنود مبرمجة</div>}
                </div>
                <button onClick={addItems} disabled={!canAdd} className={`w-full mt-3 py-3 rounded-xl font-semibold transition-all ${canAdd ? `bg-gradient-to-r ${accentGradient} text-white` : `${cardAlt} ${txtSm} cursor-not-allowed`}`}>
                  {selectedItems.length > 0 ? `➕ إضافة ${selectedItems.length} بند` : 'اختر بنود للإضافة'}
                </button>
              </div>
            </div>

            {/* البنود المضافة */}
            <div className={`${card} rounded-2xl p-5 border ${border}`}>
              <div className="flex justify-between items-center mb-4">
                <span className={`font-semibold ${txt}`}>📋 البنود المضافة ({itemCount})</span>
                {itemCount > 0 && <button onClick={clearAll} className="px-3 py-1 rounded-lg bg-red-500/15 text-red-400 text-sm font-medium">مسح الكل</button>}
              </div>
              {itemCount === 0 ? (
                <div className={`text-center py-12 ${txtSm}`}><div className="text-4xl mb-2 opacity-40">📭</div>لا توجد بنود</div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(addedItems).map(([key, item]) => {
                    const ta = item.places.reduce((s, p) => s + p.area, 0);
                    const ex = ta * item.exec, co = ta * item.cont;
                    return (
                      <div key={key} className={`${cardAlt} rounded-xl p-4`}>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className={`font-semibold ${txt}`}>{item.cat} - {item.name}</div>
                            <div className={`text-sm ${txtSm}`}>{ta} م² × {item.exec} = {fmt(ex)} ر.س</div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => openAddedItemModal(key, item)} className={`w-8 h-8 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-gray-300'} ${txt} text-xs`}>✎</button>
                            <button onClick={() => removeItem(key)} className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 text-xs">✕</button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {item.places.map((p, i) => (
                            <div key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${p.areaType === 'wall' ? 'bg-cyan-500/15 border border-cyan-500/25' : 'bg-emerald-500/15 border border-emerald-500/25'}`}>
                              <span className={`text-sm font-medium ${txt}`}>{p.name}</span>
                              <span className={`text-sm font-bold ${p.areaType === 'wall' ? 'text-cyan-400' : 'text-emerald-400'}`}>{p.area}م²</span>
                              {p.formula && <span className={`text-xs ${txtSm} ${cardAlt} px-1.5 py-0.5 rounded`}>{p.formula}</span>}
                              <button onClick={(e) => { e.stopPropagation(); removePlace(key, p.name); }} className="text-red-400 text-xs">✕</button>
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="p-2 rounded-lg bg-yellow-500/10 text-center"><div className="text-yellow-400 font-bold">{fmt(ex)}</div><div className={`text-xs ${txtSm}`}>تنفيذ</div></div>
                          <div className="p-2 rounded-lg bg-cyan-500/10 text-center"><div className="text-cyan-400 font-bold">{fmt(co)}</div><div className={`text-xs ${txtSm}`}>مقاول</div></div>
                          <div className="p-2 rounded-lg bg-emerald-500/10 text-center"><div className="text-emerald-400 font-bold">{fmt(ex - co)}</div><div className={`text-xs ${txtSm}`}>ربح</div></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* الملخص */}
            {itemCount > 0 && (
              <div className={`${card} rounded-2xl p-5 border ${border}`}>
                <div className={`font-semibold mb-4 ${txt}`}>💰 الملخص المالي</div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className={`${cardAlt} p-3 rounded-xl text-center`}><div className={`text-2xl font-bold ${txt}`}>{totals.totalArea}</div><div className={`text-xs ${txtSm}`}>م² إجمالي</div></div>
                  <div className={`${cardAlt} p-3 rounded-xl text-center`}><div className={`text-2xl font-bold ${txt}`}>{itemCount}</div><div className={`text-xs ${txtSm}`}>بند</div></div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="p-3 rounded-xl bg-yellow-500/10 text-center"><div className="text-lg font-bold text-yellow-400">{fmt(totals.exec)}</div><div className={`text-xs ${txtSm}`}>تنفيذ</div></div>
                  <div className="p-3 rounded-xl bg-cyan-500/10 text-center"><div className="text-lg font-bold text-cyan-400">{fmt(totals.cont)}</div><div className={`text-xs ${txtSm}`}>مقاول</div></div>
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-center"><div className="text-lg font-bold text-emerald-400">{fmt(totals.profit)}</div><div className={`text-xs ${txtSm}`}>ربح</div></div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${accentGradient} text-center`}><div className="text-lg font-bold text-white">{fmt(Math.round(totals.exec * 1.15))}</div><div className="text-xs text-white/70">+ضريبة</div></div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ==================== تاب البنود ==================== */}
        {mainTab === 'items' && (
          <div className="grid md:grid-cols-4 gap-4">
            <div className={`${card} rounded-xl p-3 border ${border} md:col-span-1`}>
              <div className={`text-xs ${txtSm} mb-2 px-2`}>التصنيفات</div>
              {Object.entries(workItems).map(([k, c]) => (
                <button key={k} onClick={() => setSelectedCategory(k)} className={`w-full p-3 rounded-lg mb-1 text-right flex items-center gap-2 transition-all ${selectedCategory === k ? `bg-gradient-to-r ${accentGradient} text-white` : `${txtSm} hover:bg-gray-700/50`}`}>
                  <span className="text-lg">{c.icon}</span>
                  <div><div className={`text-sm font-medium ${selectedCategory === k ? 'text-white' : txt}`}>{c.name}</div><div className={`text-xs ${selectedCategory === k ? 'text-white/70' : txtSm}`}>{c.items.length} بند</div></div>
                </button>
              ))}
            </div>
            <div className={`${card} rounded-xl p-4 border ${border} md:col-span-3`}>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2"><span className="text-xl">{workItems[selectedCategory]?.icon}</span><h2 className={`text-lg font-bold ${txt}`}>{workItems[selectedCategory]?.name}</h2></div>
                <button onClick={() => openAddItemModal()} className={`px-4 py-2 bg-gradient-to-r ${accentGradient} text-white rounded-lg text-sm font-medium`}>+ إضافة</button>
              </div>
              <div className="space-y-2">
                {workItems[selectedCategory]?.items.map(item => (
                  <div key={item.id} className={`${cardAlt} p-3 rounded-xl`}>
                    <div className="flex items-center justify-between">
                      <div className={`font-medium ${txt}`}>{item.name}</div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${item.type === 'floor' ? 'bg-emerald-500/20 text-emerald-400' : item.type === 'wall' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{item.type === 'wall' ? 'جدران' : item.type === 'ceiling' ? 'أسقف' : 'أرضية'}</span>
                        <span className="text-yellow-400 text-sm font-semibold">{item.exec}</span>
                        <span className="text-cyan-400 text-sm font-semibold">{item.cont}</span>
                        <button onClick={() => openEditModal(selectedCategory, item)} className={`w-7 h-7 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-gray-300'} ${txt} text-xs`}>✎</button>
                        <button onClick={() => deleteItem(selectedCategory, item.id)} className="w-7 h-7 rounded-lg bg-red-500/20 text-red-400 text-xs">×</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== تاب البرمجة ==================== */}
        {mainTab === 'programming' && (
          <div className={`${card} rounded-xl p-4 border ${border}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`font-bold ${txt}`}>إدارة الأماكن والبرمجة</h2>
              <button onClick={openPlaceModal} className={`px-4 py-2 bg-gradient-to-r ${accentGradient} text-white rounded-lg text-sm font-medium`}>+ إضافة مكان</button>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {Object.entries(placeTypes).map(([pk, place]) => (
                <div key={pk} className={`${cardAlt} rounded-xl overflow-hidden ${!place.enabled && 'opacity-50'}`}>
                  <div className={`p-3 border-b ${border} flex items-center gap-2 bg-${place.color}-500/10`}>
                    <span className="text-lg">{place.icon}</span>
                    <span className={`font-semibold flex-1 ${txt}`}>{place.name}</span>
                    <button onClick={() => togglePlaceEnabled(pk)} className={`w-10 h-5 rounded-full relative transition-all ${place.enabled ? `bg-${place.color}-500` : 'bg-gray-600'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${place.enabled ? 'right-0.5' : 'right-5'}`} />
                    </button>
                    <button onClick={() => openPlaceItemsModal(pk)} className={`w-7 h-7 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-gray-300'} ${txt} text-xs`}>✎</button>
                    {!place.isCore && <button onClick={() => deletePlace(pk)} className="w-7 h-7 rounded-lg bg-red-500/20 text-red-400 text-xs">×</button>}
                  </div>
                  <div className="p-3 max-h-80 overflow-y-auto space-y-2">
                    {Object.entries(workItems).map(([ck, cat]) => {
                      const full = isCategoryFullyEnabled(pk, ck), partial = isCategoryPartiallyEnabled(pk, ck);
                      return (
                        <div key={ck}>
                          <button onClick={() => place.enabled && toggleAllCategory(pk, ck, !full)} className={`w-full p-2 rounded-lg flex items-center gap-2 text-sm ${full ? `bg-${place.color}-500/20 border border-${place.color}-500/40` : partial ? `bg-${place.color}-500/10 border border-${place.color}-500/20` : `${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}`}>
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center text-xs ${full ? `border-${place.color}-500 bg-${place.color}-500 text-white` : `border-gray-500`}`}>{full && '✓'}{partial && '−'}</div>
                            <span>{cat.icon}</span>
                            <span className={`flex-1 text-right ${txt}`}>{cat.name}</span>
                            <span className={txtSm}>{(programming[pk]?.[ck] || []).length}/{cat.items.length}</span>
                          </button>
                          <div className="mr-4 mt-1 space-y-1">
                            {cat.items.map(item => {
                              const en = isItemEnabled(pk, ck, item.id);
                              return (
                                <button key={item.id} onClick={() => place.enabled && toggleProgramming(pk, ck, item.id)} className={`w-full p-1.5 rounded-lg flex items-center gap-2 text-xs ${en ? `bg-${place.color}-500/10` : ''}`}>
                                  <div className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center ${en ? `border-${place.color}-500 bg-${place.color}-500 text-white` : 'border-gray-500'}`} style={{ fontSize: 8 }}>{en && '✓'}</div>
                                  <span className={en ? txt : txtSm}>{item.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== Modals ==================== */}
        
        {/* Profit Modal */}
        {showProfitModal && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className={`${card} rounded-2xl p-6 max-w-md w-full border ${border}`}>
              <div className="flex justify-between items-center mb-4"><h2 className={`text-lg font-bold ${txt}`}>📊 تقرير الأرباح</h2><button onClick={() => setShowProfitModal(false)} className={`text-2xl ${txtSm}`}>×</button></div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-4 rounded-xl bg-yellow-500/10 text-center"><div className="text-2xl font-bold text-yellow-400">{fmt(totals.exec)}</div><div className={`text-sm ${txtSm}`}>تنفيذ</div></div>
                <div className="p-4 rounded-xl bg-cyan-500/10 text-center"><div className="text-2xl font-bold text-cyan-400">{fmt(totals.cont)}</div><div className={`text-sm ${txtSm}`}>مقاول</div></div>
                <div className="p-4 rounded-xl bg-emerald-500/10 text-center"><div className="text-2xl font-bold text-emerald-400">{fmt(totals.profit)}</div><div className={`text-sm ${txtSm}`}>ربح</div></div>
                <div className={`p-4 rounded-xl bg-gradient-to-br ${accentGradient} text-center`}><div className="text-2xl font-bold text-white">{totals.cont > 0 ? ((totals.profit / totals.cont) * 100).toFixed(0) : 0}%</div><div className="text-sm text-white/70">نسبة</div></div>
              </div>
              <div className={`${cardAlt} p-4 rounded-xl mb-4`}>
                <div className="flex justify-between mb-2"><span className={txtSm}>المساحة</span><span className={txt}>{totals.totalArea} م²</span></div>
                <div className="flex justify-between mb-2"><span className={txtSm}>البنود</span><span className={txt}>{itemCount}</span></div>
                <div className="flex justify-between"><span className={txtSm}>+ ضريبة 15%</span><span className={`font-bold text-lg ${txt}`}>{fmt(Math.round(totals.exec * 1.15))}</span></div>
              </div>
              <button onClick={() => setShowProfitModal(false)} className={`w-full py-3 bg-gradient-to-r ${accentGradient} text-white rounded-xl font-semibold`}>إغلاق</button>
            </div>
          </div>
        )}

        {/* Edit Item Modal */}
        {showEditModal && editingItem && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className={`${card} rounded-2xl p-6 max-w-md w-full border ${border}`}>
              <div className="flex justify-between items-center mb-4"><h2 className={`text-lg font-bold ${txt}`}>✏️ تحرير البند</h2><button onClick={() => { setShowEditModal(false); setEditingItem(null); }} className={`text-2xl ${txtSm}`}>×</button></div>
              <div className="space-y-4">
                <div><label className={`text-sm ${txtSm} block mb-1`}>الاسم</label><input type="text" value={editForm.name} onChange={(e) => setEditForm(p => ({ ...p, name: e.target.value }))} className={input} /></div>
                <div className="grid grid-cols-3 gap-2">
                  {['floor', 'wall', 'ceiling'].map(t => (<button key={t} onClick={() => setEditForm(p => ({ ...p, type: t }))} className={`p-2 rounded-lg border text-sm ${editForm.type === t ? 'border-indigo-500 bg-indigo-500/20 text-indigo-400' : `${darkMode ? 'border-gray-600' : 'border-gray-300'} ${txt}`}`}>{t === 'floor' ? 'أرضية' : t === 'wall' ? 'جدران' : 'أسقف'}</button>))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className={`text-sm ${txtSm} block mb-1`}>تنفيذ</label><input type="number" value={editForm.exec} onChange={(e) => setEditForm(p => ({ ...p, exec: parseFloat(e.target.value) || 0 }))} className={`${input} text-yellow-400 border-yellow-500/40 bg-yellow-500/10`} /></div>
                  <div><label className={`text-sm ${txtSm} block mb-1`}>مقاول</label><input type="number" value={editForm.cont} onChange={(e) => setEditForm(p => ({ ...p, cont: parseFloat(e.target.value) || 0 }))} className={`${input} text-cyan-400 border-cyan-500/40 bg-cyan-500/10`} /></div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 flex justify-between"><span className={txtSm}>الربح</span><span className="text-emerald-400 font-bold text-lg">{editForm.exec - editForm.cont}</span></div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => { deleteItem(editingItem.catKey, editingItem.itemId); setShowEditModal(false); }} className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl text-sm">حذف</button>
                <div className="flex-1" />
                <button onClick={() => { setShowEditModal(false); setEditingItem(null); }} className={`px-4 py-2 border rounded-xl text-sm ${border} ${txt}`}>إلغاء</button>
                <button onClick={saveEdit} className={`px-4 py-2 bg-gradient-to-r ${accentGradient} text-white rounded-xl text-sm font-medium`}>حفظ</button>
              </div>
            </div>
          </div>
        )}

        {/* Add Item Modal */}
        {showAddItemModal && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className={`${card} rounded-2xl p-6 max-w-md w-full border ${border}`}>
              <div className="flex justify-between items-center mb-4"><h2 className={`text-lg font-bold ${txt}`}>+ إضافة بند</h2><button onClick={() => setShowAddItemModal(false)} className={`text-2xl ${txtSm}`}>×</button></div>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(workItems).map(([k, c]) => (<button key={k} onClick={() => setAddItemForm(p => ({ ...p, category: k }))} className={`p-2 rounded-lg text-center text-xs ${addItemForm.category === k ? `bg-gradient-to-r ${accentGradient} text-white` : cardAlt}`}><div className="text-lg">{c.icon}</div><div className={addItemForm.category === k ? 'text-white' : txtSm}>{c.name}</div></button>))}
                </div>
                <div><label className={`text-sm ${txtSm} block mb-1`}>الاسم</label><input type="text" value={addItemForm.name} onChange={(e) => setAddItemForm(p => ({ ...p, name: e.target.value }))} className={input} placeholder="اسم البند..." /></div>
                <div className="grid grid-cols-3 gap-2">
                  {['floor', 'wall', 'ceiling'].map(t => (<button key={t} onClick={() => setAddItemForm(p => ({ ...p, type: t }))} className={`p-2 rounded-lg border text-sm ${addItemForm.type === t ? 'border-indigo-500 bg-indigo-500/20 text-indigo-400' : `${darkMode ? 'border-gray-600' : 'border-gray-300'} ${txt}`}`}>{t === 'floor' ? 'أرضية' : t === 'wall' ? 'جدران' : 'أسقف'}</button>))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className={`text-sm ${txtSm} block mb-1`}>تنفيذ</label><input type="number" value={addItemForm.exec} onChange={(e) => setAddItemForm(p => ({ ...p, exec: parseFloat(e.target.value) || 0 }))} className={`${input} text-yellow-400 border-yellow-500/40 bg-yellow-500/10`} /></div>
                  <div><label className={`text-sm ${txtSm} block mb-1`}>مقاول</label><input type="number" value={addItemForm.cont} onChange={(e) => setAddItemForm(p => ({ ...p, cont: parseFloat(e.target.value) || 0 }))} className={`${input} text-cyan-400 border-cyan-500/40 bg-cyan-500/10`} /></div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowAddItemModal(false)} className={`flex-1 py-2 border rounded-xl text-sm ${border} ${txt}`}>إلغاء</button>
                <button onClick={saveNewItem} className={`flex-1 py-2 bg-gradient-to-r ${accentGradient} text-white rounded-xl text-sm font-medium`}>إضافة</button>
              </div>
            </div>
          </div>
        )}

        {/* Add Place Modal */}
        {showPlaceModal && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className={`${card} rounded-2xl p-6 max-w-sm w-full border ${border}`}>
              <div className="flex justify-between items-center mb-4"><h2 className={`text-lg font-bold ${txt}`}>+ إضافة مكان</h2><button onClick={() => setShowPlaceModal(false)} className={`text-2xl ${txtSm}`}>×</button></div>
              <div className="space-y-4">
                <div><label className={`text-sm ${txtSm} block mb-1`}>الاسم</label><input type="text" value={placeForm.name} onChange={(e) => setPlaceForm(p => ({ ...p, name: e.target.value }))} className={input} placeholder="اسم المكان..." /></div>
                <div><label className={`text-sm ${txtSm} block mb-1`}>الأيقونة</label><div className="flex gap-2 flex-wrap">{['🏠', '🚿', '🌳', '🏢', '🏬', '📍', '⛺', '🏪'].map(i => (<button key={i} onClick={() => setPlaceForm(p => ({ ...p, icon: i }))} className={`w-10 h-10 rounded-lg text-lg ${placeForm.icon === i ? 'bg-indigo-500/30 border-2 border-indigo-500' : cardAlt}`}>{i}</button>))}</div></div>
                <div><label className={`text-sm ${txtSm} block mb-1`}>اللون</label><div className="flex gap-2">{['indigo', 'cyan', 'emerald', 'yellow', 'red', 'purple'].map(c => (<button key={c} onClick={() => setPlaceForm(p => ({ ...p, color: c }))} className={`w-8 h-8 rounded-lg bg-${c}-500 ${placeForm.color === c ? 'ring-2 ring-white' : ''}`} />))}</div></div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowPlaceModal(false)} className={`flex-1 py-2 border rounded-xl text-sm ${border} ${txt}`}>إلغاء</button>
                <button onClick={savePlace} className={`flex-1 py-2 bg-gradient-to-r ${accentGradient} text-white rounded-xl text-sm font-medium`}>إضافة</button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Added Item Modal */}
        {showAddedItemModal && editingAddedItem && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className={`${card} rounded-2xl p-6 max-w-md w-full border ${border}`}>
              <div className="flex justify-between items-center mb-4"><h2 className={`text-lg font-bold ${txt}`}>✏️ تحرير البند</h2><button onClick={() => { setShowAddedItemModal(false); setEditingAddedItem(null); }} className={`text-2xl ${txtSm}`}>×</button></div>
              <div className={`font-semibold mb-2 ${txt}`}>{editingAddedItem.item.cat} - {editingAddedItem.item.name}</div>
              <div className={`text-sm mb-4 ${txtSm}`}>تنفيذ: {editingAddedItem.item.exec} | مقاول: {editingAddedItem.item.cont}</div>
              <div className="space-y-2 mb-4">
                {editingAddedItem.item.places.map((p, i) => (
                  <div key={i} className={`${cardAlt} p-3 rounded-xl flex items-center gap-3`}>
                    <span className={`flex-1 ${txt}`}>{p.name}</span>
                    {p.formula && <span className={`text-xs ${txtSm}`}>{p.formula}</span>}
                    <input type="number" value={p.area} onChange={(e) => updateAddedItemPlace(i, e.target.value)} className={`w-20 p-2 rounded-lg text-center border border-indigo-500/40 bg-indigo-500/10 text-indigo-400 font-semibold`} />
                    <span className={txtSm}>م²</span>
                    <button onClick={() => { const u = { ...editingAddedItem }; u.item.places = u.item.places.filter((_, x) => x !== i); if (u.item.places.length === 0) { removeItem(editingAddedItem.key); setShowAddedItemModal(false); setEditingAddedItem(null); } else setEditingAddedItem(u); }} className="text-red-400 text-xs">✕</button>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => { removeItem(editingAddedItem.key); setShowAddedItemModal(false); setEditingAddedItem(null); }} className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl text-sm">حذف الكل</button>
                <div className="flex-1" />
                <button onClick={() => { setShowAddedItemModal(false); setEditingAddedItem(null); }} className={`px-4 py-2 border rounded-xl text-sm ${border} ${txt}`}>إلغاء</button>
                <button onClick={saveAddedItemEdit} className={`px-4 py-2 bg-gradient-to-r ${accentGradient} text-white rounded-xl text-sm font-medium`}>حفظ</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default QuantityCalculator;
