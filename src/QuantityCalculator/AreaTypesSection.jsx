// ╔═══════════════════════════════════════════════════════════════════════════════════╗
// ║                       قسم أنواع المساحة - AreaTypesSection                        ║
// ╚═══════════════════════════════════════════════════════════════════════════════════╝

import React, { useState } from 'react';
import { formulaTemplates } from './ColorsAndConstants';

const AreaTypesSection = ({
  colors,
  itemTypes,
  workItems,
  setItemTypes,
  formatNumber
}) => {
  // ═══════════════════════════════════════════════════════════════════════════════════
  // الحالات المحلية
  // ═══════════════════════════════════════════════════════════════════════════════════
  const [editingItemType, setEditingItemType] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // ═══════════════════════════════════════════════════════════════════════════════════
  // دوال التحكم
  // ═══════════════════════════════════════════════════════════════════════════════════
  
  // إضافة نوع جديد
  const addItemType = () => {
    const newId = `type_${Date.now()}`;
    setItemTypes(prev => ({
      ...prev,
      [newId]: {
        id: newId,
        name: 'نوع جديد',
        icon: '📐',
        color: colors.primary,
        formula: 'length * width',
        formulaDisplay: 'ط × ع',
        unit: 'م²',
        description: 'وصف النوع',
        enabled: true
      }
    }));
  };

  // تحديث نوع
  const updateItemType = (typeId, updates) => {
    setItemTypes(prev => ({ ...prev, [typeId]: { ...prev[typeId], ...updates } }));
  };

  // حذف نوع
  const deleteItemType = (typeId) => {
    // التحقق من استخدام النوع في بنود العمل
    const isUsed = Object.values(workItems).some(cat =>
      cat.items.some(item => item.typeId === typeId)
    );
    if (isUsed) {
      alert('لا يمكن حذف هذا النوع لأنه مستخدم في بنود العمل!');
      return;
    }
    setItemTypes(prev => {
      const { [typeId]: _, ...rest } = prev;
      return rest;
    });
    setEditingItemType(null);
    setConfirmDelete(null);
  };

  // حساب المثال حسب المعادلة
  const getExampleResult = (formula) => {
    switch (formula) {
      case 'length * width': return '12 م²';
      case '(length + width) * 2 * height': return '42 م²';
      case 'length * height': return '12 م²';
      case '(length + width) * 2': return '14 م.ط';
      case 'quantity': return 'حسب العدد';
      default: return '—';
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════════════
  // المكونات الفرعية
  // ═══════════════════════════════════════════════════════════════════════════════════
  
  const ConfirmDialog = ({ title, message, onConfirm, onCancel }) => (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 }} onClick={onCancel}>
      <div style={{ background: colors.card, borderRadius: 20, padding: 32, width: '90%', maxWidth: 400, border: `2px solid ${colors.danger}40` }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 20, fontWeight: 700, color: colors.danger, marginBottom: 16 }}>⚠️ {title}</div>
        <div style={{ fontSize: 16, color: colors.text, marginBottom: 24, lineHeight: 1.6 }}>{message}</div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onCancel} style={{ flex: 1, height: 48, borderRadius: 12, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.muted, fontSize: 16, cursor: 'pointer' }}>إلغاء</button>
          <button onClick={onConfirm} style={{ flex: 1, height: 48, borderRadius: 12, border: 'none', background: colors.danger, color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>تأكيد الحذف</button>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════════════
  // العرض
  // ═══════════════════════════════════════════════════════════════════════════════════
  return (
    <>
      {confirmDelete && <ConfirmDialog {...confirmDelete} />}

      {/* عنوان القسم */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        <div style={{ width: 42, height: 42, background: `linear-gradient(135deg, ${colors.purple}, ${colors.pink})`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>📐</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: colors.text }}>برمجة القياس</div>
          <div style={{ fontSize: 13, color: colors.muted }}>معادلات حساب الكميات والمساحات</div>
        </div>
      </div>

      {/* شرح الأنواع */}
      <div style={{ background: `${colors.purple}15`, padding: 22, borderRadius: 16, border: `1px solid ${colors.purple}30`, marginBottom: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: colors.purple, marginBottom: 12 }}>💡 ما هو نوع المساحة؟</div>
        <div style={{ fontSize: 14, color: colors.text, lineHeight: 2 }}>
          نوع المساحة يحدد <strong style={{ color: colors.success }}>طريقة حساب الكمية</strong> لكل بند:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 16 }}>
          {[
            { icon: '⬇️', name: 'أرضية/سقف', formula: 'ط × ع', color: colors.success },
            { icon: '🧱', name: '4 جدران', formula: '(ط+ع)×2×ر', color: colors.primary },
            { icon: '▬', name: 'جدار واحد', formula: 'ط × ر', color: colors.cyan },
            { icon: '📏', name: 'وزرة', formula: '(ط+ع)×2', color: colors.pink },
            { icon: '🔢', name: 'وحدة', formula: 'العدد', color: colors.orange },
          ].map(t => (
            <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 10, background: `${t.color}15`, padding: '10px 14px', borderRadius: 10 }}>
              <span style={{ fontSize: 20 }}>{t.icon}</span>
              <span style={{ color: colors.text, fontWeight: 600 }}>{t.name}</span>
              <span style={{ color: t.color, fontWeight: 700, marginRight: 'auto' }}>{t.formula}</span>
            </div>
          ))}
        </div>
      </div>

      {/* قائمة الأنواع */}
      {Object.values(itemTypes).map((type) => (
        <div key={type.id} style={{ background: colors.card, borderRadius: 18, overflow: 'hidden', border: `1px solid ${colors.border}`, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'stretch' }}>
            <div style={{ width: 6, background: type.color }} />
            <div style={{ padding: '20px 22px', display: 'flex', alignItems: 'center', borderLeft: `1px solid ${colors.border}` }}>
              <div style={{ width: 60, height: 60, borderRadius: 16, background: `${type.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
                {type.icon}
              </div>
            </div>
            <div style={{ flex: 1, padding: '18px 20px' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: colors.text, marginBottom: 10 }}>{type.name}</div>
              <div style={{ fontSize: 13, color: colors.muted, marginBottom: 12 }}>{type.description}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ background: `${type.color}15`, padding: '10px 16px', borderRadius: 12 }}>
                  <span style={{ fontSize: 12, color: colors.muted }}>المعادلة: </span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: type.color }}>{type.formulaDisplay}</span>
                </div>
                <div style={{ background: colors.bg, padding: '10px 16px', borderRadius: 12 }}>
                  <span style={{ fontSize: 12, color: colors.muted }}>الوحدة: </span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: colors.text }}>{type.unit}</span>
                </div>
                <div style={{ background: `${colors.primary}15`, padding: '10px 16px', borderRadius: 12 }}>
                  <span style={{ fontSize: 12, color: colors.muted }}>مثال (4م × 3م): </span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: colors.primary }}>{getExampleResult(type.formula)}</span>
                </div>
              </div>
            </div>
            <div onClick={() => setEditingItemType({ ...type })} style={{ background: colors.bg, padding: '20px 24px', display: 'flex', alignItems: 'center', borderRight: `1px solid ${colors.border}`, cursor: 'pointer' }}>
              <span style={{ fontSize: 24, color: colors.muted }}>⚙️</span>
            </div>
          </div>
        </div>
      ))}

      {/* زر إضافة نوع */}
      <button onClick={addItemType} style={{ width: '100%', height: 64, borderRadius: 16, border: `2px dashed ${colors.purple}`, background: 'transparent', color: colors.purple, fontSize: 18, fontWeight: 700, cursor: 'pointer', marginTop: 20 }}>
        + إضافة نوع جديد
      </button>

      {/* إحصائيات */}
      <div style={{ background: `linear-gradient(135deg, ${colors.purple}25, ${colors.pink}25)`, borderRadius: 20, padding: 28, border: `2px solid ${colors.purple}50`, textAlign: 'center', marginTop: 28 }}>
        <div style={{ fontSize: 16, color: colors.muted, marginBottom: 12 }}>📊 إجمالي أنواع المساحة</div>
        <div style={{ fontSize: 48, fontWeight: 800, color: colors.purple }}>{Object.keys(itemTypes).length}</div>
        <div style={{ fontSize: 16, color: colors.muted }}>نوع مختلف</div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      {/* نافذة تحرير نوع المساحة                                                          */}
      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      {editingItemType && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }} onClick={() => setEditingItemType(null)}>
          <div style={{ background: colors.card, borderRadius: 20, padding: 32, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', border: `2px solid ${colors.purple}40` }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 22, fontWeight: 700, color: colors.text, marginBottom: 28 }}>✏️ تحرير نوع المساحة</div>

            {/* الاسم */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: colors.muted, marginBottom: 8 }}>الاسم</div>
              <input type="text" value={editingItemType.name} onChange={e => setEditingItemType({ ...editingItemType, name: e.target.value })} style={{ width: '100%', height: 48, padding: '0 16px', borderRadius: 12, border: `2px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 16 }} />
            </div>

            {/* الوصف */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: colors.muted, marginBottom: 8 }}>الوصف</div>
              <input type="text" value={editingItemType.description} onChange={e => setEditingItemType({ ...editingItemType, description: e.target.value })} style={{ width: '100%', height: 48, padding: '0 16px', borderRadius: 12, border: `2px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 16 }} />
            </div>

            {/* الأيقونة */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: colors.muted, marginBottom: 8 }}>الأيقونة</div>
              <input type="text" value={editingItemType.icon} onChange={e => setEditingItemType({ ...editingItemType, icon: e.target.value })} style={{ width: '100%', height: 48, padding: '0 16px', borderRadius: 12, border: `2px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 28, textAlign: 'center' }} />
            </div>

            {/* اللون */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: colors.muted, marginBottom: 8 }}>اللون</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[colors.primary, colors.success, colors.warning, colors.danger, colors.purple, colors.cyan, colors.orange, colors.pink].map(c => (
                  <button key={c} onClick={() => setEditingItemType({ ...editingItemType, color: c })} style={{ width: 44, height: 44, borderRadius: 12, background: c, border: editingItemType.color === c ? '3px solid #fff' : 'none', cursor: 'pointer', boxShadow: editingItemType.color === c ? `0 0 0 2px ${c}` : 'none' }} />
                ))}
              </div>
            </div>

            {/* قالب المعادلة */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: colors.muted, marginBottom: 8 }}>قالب المعادلة</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {formulaTemplates.map(t => (
                  <button key={t.id} onClick={() => setEditingItemType({ ...editingItemType, formula: t.formula, formulaDisplay: t.display, unit: t.unit })} style={{ height: 60, borderRadius: 12, border: editingItemType.formula === t.formula ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`, background: editingItemType.formula === t.formula ? `${colors.primary}15` : 'transparent', color: colors.text, fontSize: 14, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <span style={{ fontWeight: 600 }}>{t.name}</span>
                    <span style={{ fontSize: 12, color: colors.muted }}>{t.display}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* الوحدة */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: colors.muted, marginBottom: 8 }}>الوحدة</div>
              <div style={{ display: 'flex', gap: 10 }}>
                {['م²', 'م.ط', 'وحدة'].map(u => (
                  <button key={u} onClick={() => setEditingItemType({ ...editingItemType, unit: u })} style={{ flex: 1, height: 48, borderRadius: 12, border: editingItemType.unit === u ? `2px solid ${colors.success}` : `1px solid ${colors.border}`, background: editingItemType.unit === u ? `${colors.success}15` : 'transparent', color: colors.text, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>
                    {u}
                  </button>
                ))}
              </div>
            </div>

            {/* المعاينة */}
            <div style={{ background: `${editingItemType.color}15`, padding: 16, borderRadius: 12, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 50, height: 50, borderRadius: 12, background: `${editingItemType.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
                {editingItemType.icon}
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: colors.text }}>{editingItemType.name}</div>
                <div style={{ fontSize: 13, color: colors.muted }}>{editingItemType.formulaDisplay} → {editingItemType.unit}</div>
              </div>
            </div>

            {/* أزرار التحكم */}
            <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
              <button onClick={() => { setConfirmDelete({ title: 'حذف النوع', message: `هل أنت متأكد من حذف "${editingItemType.name}"؟`, onConfirm: () => deleteItemType(editingItemType.id), onCancel: () => setConfirmDelete(null) }); }} style={{ height: 52, padding: '0 24px', borderRadius: 12, border: `2px solid ${colors.danger}`, background: 'transparent', color: colors.danger, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
                🗑️ حذف
              </button>
              <div style={{ flex: 1 }} />
              <button onClick={() => setEditingItemType(null)} style={{ height: 52, padding: '0 28px', borderRadius: 12, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.muted, fontSize: 16, cursor: 'pointer' }}>
                إلغاء
              </button>
              <button onClick={() => { updateItemType(editingItemType.id, editingItemType); setEditingItemType(null); }} style={{ height: 52, padding: '0 32px', borderRadius: 12, border: 'none', background: colors.success, color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
                ✓ حفظ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AreaTypesSection;
