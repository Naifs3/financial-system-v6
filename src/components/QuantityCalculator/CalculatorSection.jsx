import React, { useState } from 'react';
import { dimensionOptions } from './ColorsAndConstants';

const CalculatorSection = ({ colors, places, workItems, programming, itemTypes, categories, setCategories, formatNumber, getColor, placeTypeColors }) => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);
  const [phase1Expanded, setPhase1Expanded] = useState(true);
  const [selectedPlaceType, setSelectedPlaceType] = useState('dry');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [dimensions, setDimensions] = useState({ length: 4, width: 4, height: 3 });
  const [activeMainItems, setActiveMainItems] = useState({});

  const heightOptions = [2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6];
  const placesList = places[selectedPlaceType]?.places || [];

  const getItemArea = (item) => item.places?.reduce((sum, p) => sum + (p.area || 0), 0) || 0;
  const getCategoryItemsTotal = (cat) => cat.items?.reduce((sum, item) => sum + getItemArea(item) * item.price, 0) || 0;

  const calculateCategoryTotals = (cat) => {
    const totalPrice = getCategoryItemsTotal(cat);
    const profitAmount = totalPrice * (cat.options?.profitPercent || 0) / 100;
    const withProfit = totalPrice + profitAmount;
    const taxAmount = withProfit * (cat.options?.taxPercent || 0) / 100;
    const finalTotal = withProfit + taxAmount;
    return { totalPrice, profitAmount, taxAmount, finalTotal };
  };

  const getGrandTotal = () => (categories || []).reduce((sum, cat) => sum + calculateCategoryTotals(cat).finalTotal, 0);

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
            options: { profitPercent: 0, taxPercent: 15 }
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
      const newItem = { id: Date.now(), code: subItem.code, name: subItem.name, price: subItem.price, group: subItem.group, places: [{ ...place }], conditions: [] };
      const newPendingPlaces = cat.pendingPlaces.filter(p => p.id !== placeId);
      return { ...cat, items: [...cat.items, newItem], pendingPlaces: newPendingPlaces, needsSubItemSelection: newPendingPlaces.length > 0 };
    }));
  };

  const addItem = (catId) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      const sub = cat.subItems?.[0] || { code: 'XX01', name: 'بند جديد', price: 0 };
      return { ...cat, items: [...cat.items, { id: Date.now(), code: sub.code, name: sub.name, price: sub.price, places: [{ id: 'p' + Date.now(), name: placesList[0] || 'مكان', length: 4, width: 4, height: 3, area: 16 }], conditions: [] }] };
    }));
  };

  const deleteItem = (catId, itemId) => {
    setCategories(prev => prev.map(cat => cat.id !== catId ? cat : { ...cat, items: cat.items.filter(item => item.id !== itemId) }));
    setEditingItemId(null);
  };

  const changeSubItem = (catId, itemId, newCode) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      const sub = cat.subItems?.find(s => s.code === newCode);
      if (!sub) return cat;
      return { ...cat, items: cat.items.map(item => item.id === itemId ? { ...item, code: sub.code, name: sub.name, price: sub.price } : item) };
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
          if (field === 'length' || field === 'width') updated.area = updated.length * updated.width;
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

  const hasCategories = (categories || []).filter(cat => cat.items?.length > 0 || cat.pendingPlaces?.length > 0).length > 0;

  return (
    <>
      <div style={{ background: colors.card, borderRadius: 16, border: phase1Expanded ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`, overflow: 'hidden', marginBottom: 20 }}>
        <div onClick={() => setPhase1Expanded(!phase1Expanded)} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: 16, background: phase1Expanded ? `${colors.primary}10` : 'transparent' }}>
          <div style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.cyan})`, padding: '12px 16px', borderRadius: 10, marginLeft: 12 }}><span style={{ fontSize: 24 }}>📐</span></div>
          <div style={{ flex: 1 }}><div style={{ fontSize: 16, fontWeight: 700, color: colors.text }}>إدخال البيانات</div><div style={{ fontSize: 11, color: colors.muted }}>🏗️ {Object.values(activeMainItems).filter(v => v).length} بنود</div></div>
          <span style={{ fontSize: 16, color: colors.primary, transform: phase1Expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>
        </div>

        {phase1Expanded && (
          <div style={{ padding: 16, borderTop: `1px dashed ${colors.primary}40` }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <select value={selectedPlaceType} onChange={(e) => { setSelectedPlaceType(e.target.value); setSelectedPlace(''); }} style={{ flex: 1, height: 40, borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 14, padding: '0 12px' }}>
                {Object.entries(places).filter(([_, pt]) => pt.enabled).map(([key, pt]) => (<option key={key} value={key}>{pt.icon} {pt.name}</option>))}
              </select>
              <select value={selectedPlace} onChange={(e) => setSelectedPlace(e.target.value)} style={{ flex: 2, height: 40, borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 14, padding: '0 12px' }}>
                <option value="">-- اختر المكان --</option>
                {placesList.map(place => (<option key={place} value={place}>{place}</option>))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
              {Object.entries(workItems).map(([catKey, cat], idx) => {
                if (!programming[selectedPlaceType]?.[catKey]?.enabled) return null;
                const catColor = getColor(idx);
                return (<button key={catKey} onClick={() => setActiveMainItems(prev => ({ ...prev, [catKey]: !prev[catKey] }))} style={{ height: 32, padding: '0 10px', borderRadius: 6, border: `1px solid ${activeMainItems[catKey] ? catColor : colors.border}`, background: activeMainItems[catKey] ? `${catColor}20` : 'transparent', color: activeMainItems[catKey] ? catColor : colors.muted, fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}><span>{cat.icon}</span><span>{cat.name}</span></button>);
              })}
            </div>

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

            <button onClick={addPlaceToActiveCategories} disabled={!selectedPlace || !Object.values(activeMainItems).some(v => v)} style={{ width: '100%', height: 56, borderRadius: 10, border: `1px solid ${colors.success}`, background: `${colors.success}15`, color: colors.success, fontSize: 14, fontWeight: 700, cursor: (selectedPlace && Object.values(activeMainItems).some(v => v)) ? 'pointer' : 'not-allowed', opacity: (selectedPlace && Object.values(activeMainItems).some(v => v)) ? 1 : 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><span style={{ fontSize: 20, fontWeight: 900 }}>+</span>إ
