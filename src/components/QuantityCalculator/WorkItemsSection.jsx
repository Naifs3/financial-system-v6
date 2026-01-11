import React, { useState } from 'react';

const WorkItemsSection = ({ colors, places, workItems, programming, itemTypes, setWorkItems, setProgramming, formatNumber, getColor, placeTypeColors }) => {
  const [expandedPlaceType, setExpandedPlaceType] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);

  const isCategoryEnabled = (ptKey, catKey) => programming[ptKey]?.[catKey]?.enabled ?? false;
  const isItemEnabled = (ptKey, catKey, itemId) => programming[ptKey]?.[catKey]?.items?.includes(itemId) ?? false;

  const toggleCategory = (ptKey, catKey) => {
    setProgramming(prev => ({
      ...prev,
      [ptKey]: { ...prev[ptKey], [catKey]: { ...prev[ptKey]?.[catKey], enabled: !prev[ptKey]?.[catKey]?.enabled, items: prev[ptKey]?.[catKey]?.items || [] } }
    }));
  };

  const toggleItem = (ptKey, catKey, itemId) => {
    setProgramming(prev => {
      const current = prev[ptKey]?.[catKey]?.items || [];
      const newItems = current.includes(itemId) ? current.filter(i => i !== itemId) : [...current, itemId];
      return { ...prev, [ptKey]: { ...prev[ptKey], [catKey]: { ...prev[ptKey]?.[catKey], items: newItems } } };
    });
  };

  const ToggleSwitch = ({ enabled, onToggle, small }) => (
    <div onClick={(e) => { e.stopPropagation(); onToggle(); }} style={{ width: small ? 40 : 48, height: small ? 22 : 26, borderRadius: 13, background: enabled ? colors.success : colors.border, padding: 2, cursor: 'pointer', transition: 'background 0.3s' }}>
      <div style={{ width: small ? 18 : 22, height: small ? 18 : 22, borderRadius: '50%', background: '#fff', transform: enabled ? `translateX(${small ? 18 : 22}px)` : 'translateX(0)', transition: 'transform 0.3s' }} />
    </div>
  );

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        <div style={{ width: 42, height: 42, background: `linear-gradient(135deg, ${colors.primary}, ${colors.purple})`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>📦</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: colors.text }}>بنود العمل</div>
          <div style={{ fontSize: 13, color: colors.muted }}>إدارة البنود لكل نوع مكان</div>
        </div>
      </div>

      {Object.entries(places).filter(([_, pt]) => pt.enabled).map(([ptKey, placeType]) => {
        const ptColor = placeTypeColors[ptKey] || colors.primary;
        const isExpanded = expandedPlaceType === ptKey;

        return (
          <div key={ptKey} style={{ background: colors.card, borderRadius: 16, overflow: 'hidden', marginBottom: 12, border: isExpanded ? `2px solid ${ptColor}` : `1px solid ${colors.border}` }}>
            <div onClick={() => setExpandedPlaceType(isExpanded ? null : ptKey)} style={{ display: 'flex', alignItems: 'stretch', cursor: 'pointer', background: isExpanded ? `${ptColor}08` : 'transparent' }}>
              <div style={{ width: 4, background: ptColor }} />
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center' }}>
                <div style={{ width: 50, height: 50, borderRadius: 12, background: `${ptColor}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{placeType.icon}</div>
              </div>
              <div style={{ flex: 1, padding: '16px 18px' }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: colors.text, marginBottom: 4 }}>{placeType.name}</div>
                <div style={{ fontSize: 12, color: colors.muted }}>{placeType.places?.length || 0} مكان</div>
              </div>
              <div style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', background: colors.bg }}>
                <span style={{ fontSize: 16, color: isExpanded ? ptColor : colors.muted, transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>
              </div>
            </div>

            {isExpanded && (
              <div style={{ padding: 16, background: `${ptColor}05`, borderTop: `1px dashed ${ptColor}40` }}>
                {Object.entries(workItems).map(([catKey, cat], catIdx) => {
                  const catColor = getColor(catIdx);
                  const isEnabled = isCategoryEnabled(ptKey, catKey);
                  const isCatExpanded = expandedCategory === `${ptKey}-${catKey}`;
                  const enabledCount = cat.items.filter(i => isItemEnabled(ptKey, catKey, i.id)).length;

                  return (
                    <div key={catKey} style={{ background: colors.card, borderRadius: 12, overflow: 'hidden', marginBottom: 10, border: isCatExpanded ? `2px solid ${catColor}` : `1px solid ${colors.border}`, opacity: isEnabled ? 1 : 0.6 }}>
                      <div onClick={() => setExpandedCategory(isCatExpanded ? null : `${ptKey}-${catKey}`)} style={{ display: 'flex', alignItems: 'stretch', cursor: 'pointer', background: isCatExpanded ? `${catColor}08` : 'transparent' }}>
                        <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center' }}>
                          <div style={{ width: 42, height: 42, borderRadius: 10, background: `${catColor}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{cat.icon}</div>
                        </div>
                        <div style={{ flex: 1, padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                            <span style={{ fontSize: 15, fontWeight: 700, color: colors.text }}>{cat.name}</span>
                            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: catColor, color: '#fff', fontFamily: 'monospace' }}>{cat.code}</span>
                          </div>
                          <div style={{ fontSize: 11, color: colors.muted }}>{cat.items.length} بند • {enabledCount} مفعّل</div>
                        </div>
                        <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', borderRight: `1px solid ${colors.border}` }}>
                          <ToggleSwitch enabled={isEnabled} onToggle={() => toggleCategory(ptKey, catKey)} />
                        </div>
                        <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', background: colors.bg }}>
                          <span style={{ fontSize: 14, color: isCatExpanded ? catColor : colors.muted, transform: isCatExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>
                        </div>
                      </div>

                      {isCatExpanded && isEnabled && (
                        <div style={{ padding: 14, background: `${catColor}05`, borderTop: `1px dashed ${catColor}30` }}>
                          {cat.items.map(item => {
                            const isOn = isItemEnabled(ptKey, catKey, item.id);
                            const typeInfo = itemTypes[item.typeId] || { icon: '📦', name: 'عام' };

                            return (
                              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', marginBottom: 8, background: colors.card, borderRadius: 10, border: isOn ? `1px solid ${colors.success}40` : `1px solid ${colors.border}`, opacity: isOn ? 1 : 0.5 }}>
                                <div style={{ background: catColor, padding: '6px 10px', borderRadius: 6 }}>
                                  <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>{cat.code}{item.num}</span>
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 2 }}>{item.name}</div>
                                  <div style={{ fontSize: 11, color: colors.muted, display: 'flex', gap: 10 }}>
                                    <span>{typeInfo.icon} {typeInfo.name}</span>
                                    <span style={{ color: colors.warning }}>💰 {formatNumber(item.exec)}</span>
                                  </div>
                                </div>
                                <ToggleSwitch small enabled={isOn} onToggle={() => toggleItem(ptKey, catKey, item.id)} />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default WorkItemsSection;
