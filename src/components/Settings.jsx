import React, { useState } from 'react';
import { Sun, Moon, Monitor, Check, Type, Palette, MapPin, ChevronDown, Save, RotateCcw } from 'lucide-react';

export default function Settings({
  darkMode,
  themeMode,
  setThemeMode,
  currentThemeId,
  setCurrentThemeId,
  fontSize,
  setFontSize,
  city,
  setCity,
  theme,
  themeList = [],
}) {
  const t = theme;
  
  // حالات مؤقتة للإعدادات (لا تُطبق إلا عند الضغط على حفظ)
  const [tempThemeMode, setTempThemeMode] = useState(themeMode);
  const [tempThemeId, setTempThemeId] = useState(currentThemeId);
  const [tempFontSize, setTempFontSize] = useState(fontSize);
  const [tempCity, setTempCity] = useState(city);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const cities = [
    { id: 'Riyadh', name: 'الرياض' },
    { id: 'Jeddah', name: 'جدة' },
    { id: 'Mecca', name: 'مكة المكرمة' },
    { id: 'Medina', name: 'المدينة المنورة' },
    { id: 'Dammam', name: 'الدمام' },
    { id: 'Khobar', name: 'الخبر' },
    { id: 'Dhahran', name: 'الظهران' },
    { id: 'Al Ahsa', name: 'الأحساء' },
    { id: 'Tabuk', name: 'تبوك' },
    { id: 'Abha', name: 'أبها' },
    { id: 'Taif', name: 'الطائف' },
    { id: 'Buraidah', name: 'بريدة' },
    { id: 'Khamis Mushait', name: 'خميس مشيط' },
    { id: 'Hail', name: 'حائل' },
    { id: 'Najran', name: 'نجران' },
    { id: 'Yanbu', name: 'ينبع' },
    { id: 'Al Jubail', name: 'الجبيل' },
  ];

  // تحديث مع تتبع التغييرات
  const updateSetting = (setter) => (value) => {
    setter(value);
    setHasChanges(true);
    setSaved(false);
  };

  // حفظ جميع الإعدادات
  const handleSave = (e) => {
    e.preventDefault();
    setThemeMode(tempThemeMode);
    setCurrentThemeId(tempThemeId);
    setFontSize(tempFontSize);
    setCity(tempCity);
    setSaved(true);
    setHasChanges(false);
    
    // إخفاء رسالة الحفظ بعد 2 ثانية
    setTimeout(() => setSaved(false), 2000);
  };

  // إعادة تعيين
  const handleReset = (e) => {
    e.preventDefault();
    setTempThemeMode('dark');
    setTempThemeId('tokyo-lights');
    setTempFontSize(16);
    setTempCity('Riyadh');
    setHasChanges(true);
  };

  // ستايل البطاقة
  const cardStyle = {
    background: t.bg.secondary,
    borderRadius: 16,
    border: `1px solid ${t.border.primary}`,
    padding: 20,
    marginBottom: 16,
  };

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
    fontSize: 15,
    fontWeight: 600,
    color: t.text.primary,
  };

  return (
    <div style={{ padding: '20px 0', maxWidth: 600, margin: '0 auto' }}>
      
      {/* العنوان */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: t.text.primary, margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Palette size={26} color={t.button.primary} />
          الإعدادات
        </h2>
        
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={handleReset}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '10px 16px', borderRadius: 10,
              border: `1px solid ${t.border.primary}`,
              background: t.bg.tertiary, color: t.text.muted,
              fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            <RotateCcw size={16} />
            إعادة تعيين
          </button>
          
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '10px 20px', borderRadius: 10, border: 'none',
              background: hasChanges ? t.button.gradient : t.bg.tertiary,
              color: hasChanges ? '#fff' : t.text.muted,
              fontSize: 13, fontWeight: 600, cursor: hasChanges ? 'pointer' : 'not-allowed',
              fontFamily: 'inherit', opacity: hasChanges ? 1 : 0.6,
            }}
          >
            <Save size={16} />
            حفظ التغييرات
          </button>
        </div>
      </div>

      {/* رسالة الحفظ */}
      {saved && (
        <div style={{
          background: '#10b98120', border: '1px solid #10b98150',
          borderRadius: 10, padding: '12px 16px', marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 10,
          color: '#10b981', fontSize: 14, fontWeight: 600,
        }}>
          <Check size={18} />
          تم حفظ الإعدادات بنجاح!
        </div>
      )}

      {/* وضع العرض */}
      <div style={cardStyle}>
        <div style={labelStyle}>
          {darkMode ? <Moon size={20} color={t.button.primary} /> : <Sun size={20} color={t.button.primary} />}
          وضع العرض
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { id: 'light', name: 'فاتح', icon: Sun, desc: 'مظهر فاتح' },
            { id: 'dark', name: 'داكن', icon: Moon, desc: 'مظهر داكن' },
            { id: 'auto', name: 'تلقائي', icon: Monitor, desc: 'حسب النظام' },
          ].map((mode) => {
            const Icon = mode.icon;
            const isActive = tempThemeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => updateSetting(setTempThemeMode)(mode.id)}
                style={{
                  padding: 16, borderRadius: 12,
                  border: isActive ? `2px solid ${t.button.primary}` : `1px solid ${t.border.primary}`,
                  background: isActive ? `${t.button.primary}15` : t.bg.tertiary,
                  cursor: 'pointer', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 8, fontFamily: 'inherit',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={24} color={isActive ? t.button.primary : t.text.muted} />
                <span style={{ fontSize: 13, fontWeight: 600, color: isActive ? t.button.primary : t.text.secondary }}>
                  {mode.name}
                </span>
                <span style={{ fontSize: 10, color: t.text.muted }}>{mode.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* الثيمات */}
      {themeList.length > 0 && (
        <div style={cardStyle}>
          <div style={labelStyle}>
            <Palette size={20} color={t.button.primary} />
            الثيم
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {themeList.map((themeItem) => {
              const isActive = tempThemeId === themeItem.id;
              return (
                <button
                  key={themeItem.id}
                  onClick={() => updateSetting(setTempThemeId)(themeItem.id)}
                  style={{
                    padding: 14, borderRadius: 12,
                    border: isActive ? `2px solid ${t.button.primary}` : `1px solid ${t.border.primary}`,
                    background: isActive ? `${t.button.primary}15` : t.bg.tertiary,
                    cursor: 'pointer', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: 8, fontFamily: 'inherit',
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: themeItem.preview || t.button.gradient,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: isActive ? `2px solid ${t.button.primary}` : 'none',
                  }}>
                    {isActive && <Check size={18} color="#fff" />}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: isActive ? t.button.primary : t.text.secondary }}>
                    {themeItem.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* حجم الخط */}
      <div style={cardStyle}>
        <div style={{ ...labelStyle, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Type size={20} color={t.button.primary} />
            حجم الخط
          </div>
          <span style={{
            background: t.button.gradient, color: '#fff',
            padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
          }}>
            {tempFontSize}px
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <span style={{ fontSize: 12, color: t.text.muted }}>أ</span>
          <input
            type="range"
            min="12"
            max="24"
            value={tempFontSize}
            onChange={(e) => updateSetting(setTempFontSize)(parseInt(e.target.value))}
            style={{
              flex: 1, height: 8, borderRadius: 4,
              appearance: 'none', background: t.bg.tertiary, cursor: 'pointer',
            }}
          />
          <span style={{ fontSize: 20, color: t.text.muted }}>أ</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {[
            { size: 14, label: 'صغير' },
            { size: 16, label: 'متوسط' },
            { size: 18, label: 'كبير' },
            { size: 20, label: 'أكبر' },
          ].map((item) => (
            <button
              key={item.size}
              onClick={() => updateSetting(setTempFontSize)(item.size)}
              style={{
                padding: '10px 8px', borderRadius: 8,
                border: tempFontSize === item.size ? `2px solid ${t.button.primary}` : `1px solid ${t.border.primary}`,
                background: tempFontSize === item.size ? `${t.button.primary}15` : 'transparent',
                cursor: 'pointer', fontSize: 12, fontWeight: 600,
                color: tempFontSize === item.size ? t.button.primary : t.text.muted,
                fontFamily: 'inherit',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* المدينة */}
      <div style={cardStyle}>
        <div style={labelStyle}>
          <MapPin size={20} color={t.button.primary} />
          المدينة
          <span style={{ fontSize: 11, color: t.text.muted, fontWeight: 400 }}>(لعرض حالة الطقس)</span>
        </div>
        <div style={{ position: 'relative' }}>
          <select
            value={tempCity}
            onChange={(e) => updateSetting(setTempCity)(e.target.value)}
            style={{
              width: '100%', padding: '14px 16px', borderRadius: 12,
              border: `1px solid ${t.border.primary}`, background: t.bg.tertiary,
              color: t.text.primary, fontSize: 14, fontFamily: 'inherit',
              cursor: 'pointer', appearance: 'none',
            }}
          >
            {cities.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <ChevronDown 
            size={20} 
            color={t.text.muted}
            style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          />
        </div>
      </div>

      {/* تذكير بالحفظ */}
      {hasChanges && (
        <div style={{
          background: `${t.button.primary}10`, border: `1px solid ${t.button.primary}30`,
          borderRadius: 12, padding: '14px 18px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          color: t.button.primary, fontSize: 13,
        }}>
          <span>لديك تغييرات غير محفوظة</span>
          <button
            onClick={handleSave}
            style={{
              padding: '8px 16px', borderRadius: 8, border: 'none',
              background: t.button.gradient, color: '#fff',
              fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            حفظ الآن
          </button>
        </div>
      )}

    </div>
  );
}
