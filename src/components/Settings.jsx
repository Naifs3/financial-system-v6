import React, { useState, useEffect } from 'react';
import { 
  Sun, Moon, Monitor, Check, Type, Palette, Sparkles, MapPin, 
  ChevronDown, Sliders, PaintBucket, Heading, Square, RotateCcw,
  Eye, Layout, Zap
} from 'lucide-react';

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

  // ═══════════════════════════════════════════════════════════════
  // 🎨 الإعدادات المخصصة
  // ═══════════════════════════════════════════════════════════════

  // لون الهيدر
  const [headerColor, setHeaderColor] = useState(() => {
    return localStorage.getItem('rkz_headerColor') || 'default';
  });

  // لون الأزرار
  const [buttonColor, setButtonColor] = useState(() => {
    return localStorage.getItem('rkz_buttonColor') || 'default';
  });

  // لون البطاقات
  const [cardColor, setCardColor] = useState(() => {
    return localStorage.getItem('rkz_cardColor') || 'default';
  });

  // نوع الخط
  const [fontFamily, setFontFamily] = useState(() => {
    return localStorage.getItem('rkz_fontFamily') || 'tajawal';
  });

  // تأثير الخلفية
  const [bgEffect, setBgEffect] = useState(() => {
    return localStorage.getItem('rkz_bgEffect') || 'none';
  });

  // شفافية البطاقات
  const [cardOpacity, setCardOpacity] = useState(() => {
    return parseInt(localStorage.getItem('rkz_cardOpacity')) || 100;
  });

  // حفظ الإعدادات
  const saveHeaderColor = (color) => {
    setHeaderColor(color);
    localStorage.setItem('rkz_headerColor', color);
  };

  const saveButtonColor = (color) => {
    setButtonColor(color);
    localStorage.setItem('rkz_buttonColor', color);
  };

  const saveCardColor = (color) => {
    setCardColor(color);
    localStorage.setItem('rkz_cardColor', color);
  };

  const saveFontFamily = (font) => {
    setFontFamily(font);
    localStorage.setItem('rkz_fontFamily', font);
  };

  const saveBgEffect = (effect) => {
    setBgEffect(effect);
    localStorage.setItem('rkz_bgEffect', effect);
  };

  const saveCardOpacity = (opacity) => {
    setCardOpacity(opacity);
    localStorage.setItem('rkz_cardOpacity', opacity.toString());
  };

  // إعادة تعيين كل الإعدادات
  const resetAllSettings = () => {
    saveHeaderColor('default');
    saveButtonColor('default');
    saveCardColor('default');
    saveFontFamily('tajawal');
    saveBgEffect('none');
    saveCardOpacity(100);
    setFontSize(16);
    setThemeMode('dark');
  };

  // ═══════════════════════════════════════════════════════════════
  // 🎨 باليتات الألوان
  // ═══════════════════════════════════════════════════════════════

  const headerColors = [
    { id: 'default', name: 'افتراضي', color: t.bg.secondary },
    { id: 'blue', name: 'أزرق', color: '#1e3a5f' },
    { id: 'purple', name: 'بنفسجي', color: '#2d1b4e' },
    { id: 'green', name: 'أخضر', color: '#1a3a2a' },
    { id: 'red', name: 'أحمر', color: '#3d1a1a' },
    { id: 'orange', name: 'برتقالي', color: '#3d2a1a' },
    { id: 'teal', name: 'فيروزي', color: '#1a3d3d' },
    { id: 'pink', name: 'وردي', color: '#3d1a2d' },
    { id: 'gold', name: 'ذهبي', color: '#3d3a1a' },
    { id: 'navy', name: 'كحلي', color: '#0a1628' },
    { id: 'dark', name: 'داكن', color: '#0a0a0a' },
    { id: 'charcoal', name: 'فحمي', color: '#1a1a1a' },
  ];

  const buttonColors = [
    { id: 'default', name: 'افتراضي', color: t.button.primary, gradient: t.button.gradient },
    { id: 'blue', name: 'أزرق', color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' },
    { id: 'purple', name: 'بنفسجي', color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' },
    { id: 'green', name: 'أخضر', color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #059669)' },
    { id: 'red', name: 'أحمر', color: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444, #dc2626)' },
    { id: 'orange', name: 'برتقالي', color: '#f97316', gradient: 'linear-gradient(135deg, #f97316, #ea580c)' },
    { id: 'teal', name: 'فيروزي', color: '#14b8a6', gradient: 'linear-gradient(135deg, #14b8a6, #0d9488)' },
    { id: 'pink', name: 'وردي', color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899, #db2777)' },
    { id: 'indigo', name: 'نيلي', color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)' },
    { id: 'cyan', name: 'سماوي', color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
    { id: 'amber', name: 'كهرماني', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
    { id: 'rose', name: 'وردي فاتح', color: '#f43f5e', gradient: 'linear-gradient(135deg, #f43f5e, #e11d48)' },
  ];

  const cardColors = [
    { id: 'default', name: 'افتراضي', color: t.bg.secondary },
    { id: 'transparent', name: 'شفاف', color: 'transparent' },
    { id: 'glass', name: 'زجاجي', color: 'rgba(255,255,255,0.05)' },
    { id: 'blue', name: 'أزرق', color: 'rgba(59,130,246,0.1)' },
    { id: 'purple', name: 'بنفسجي', color: 'rgba(139,92,246,0.1)' },
    { id: 'green', name: 'أخضر', color: 'rgba(16,185,129,0.1)' },
    { id: 'warm', name: 'دافئ', color: 'rgba(249,115,22,0.08)' },
    { id: 'cool', name: 'بارد', color: 'rgba(6,182,212,0.08)' },
  ];

  const fonts = [
    { id: 'tajawal', name: 'تجول', family: "'Tajawal', sans-serif" },
    { id: 'cairo', name: 'القاهرة', family: "'Cairo', sans-serif" },
    { id: 'almarai', name: 'المراعي', family: "'Almarai', sans-serif" },
    { id: 'ibm', name: 'IBM عربي', family: "'IBM Plex Sans Arabic', sans-serif" },
    { id: 'noto', name: 'نوتو', family: "'Noto Sans Arabic', sans-serif" },
    { id: 'rubik', name: 'روبيك', family: "'Rubik', sans-serif" },
    { id: 'changa', name: 'تشانغا', family: "'Changa', sans-serif" },
    { id: 'amiri', name: 'أميري', family: "'Amiri', serif" },
  ];

  const cities = [
    { id: 'Riyadh', name: 'الرياض' },
    { id: 'Jeddah', name: 'جدة' },
    { id: 'Mecca', name: 'مكة' },
    { id: 'Medina', name: 'المدينة' },
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

  // ═══════════════════════════════════════════════════════════════
  // 🎨 مكون اختيار اللون
  // ═══════════════════════════════════════════════════════════════

  const ColorPicker = ({ colors, value, onChange, showGradient = false }) => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
      gap: 8,
    }}>
      {colors.map((item) => {
        const isActive = value === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            title={item.name}
            style={{
              width: '100%',
              aspectRatio: '1',
              borderRadius: 10,
              border: isActive ? `3px solid ${t.button.primary}` : `2px solid ${t.border.primary}`,
              background: showGradient && item.gradient ? item.gradient : item.color,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              transform: isActive ? 'scale(1.1)' : 'scale(1)',
              boxShadow: isActive ? `0 0 12px ${item.color}60` : 'none',
            }}
          >
            {isActive && <Check size={16} color="#fff" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }} />}
          </button>
        );
      })}
    </div>
  );

  // ═══════════════════════════════════════════════════════════════
  // 🎨 مكون القسم
  // ═══════════════════════════════════════════════════════════════

  const Section = ({ icon: Icon, title, subtitle, children }) => (
    <div style={{
      background: t.bg.secondary,
      borderRadius: 16,
      border: `1px solid ${t.border.primary}`,
      padding: 20,
      marginBottom: 16,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
      }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: `${t.button.primary}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Icon size={18} color={t.button.primary} />
        </div>
        <div>
          <span style={{ fontSize: 15, fontWeight: 600, color: t.text.primary, display: 'block' }}>
            {title}
          </span>
          {subtitle && (
            <span style={{ fontSize: 11, color: t.text.muted }}>{subtitle}</span>
          )}
        </div>
      </div>
      {children}
    </div>
  );

  // ═══════════════════════════════════════════════════════════════
  // 🖥️ معاينة مباشرة
  // ═══════════════════════════════════════════════════════════════

  const LivePreview = () => {
    const selectedHeaderColor = headerColors.find(c => c.id === headerColor)?.color || t.bg.secondary;
    const selectedButtonColor = buttonColors.find(c => c.id === buttonColor);
    const selectedCardColor = cardColors.find(c => c.id === cardColor)?.color || t.bg.secondary;
    const selectedFont = fonts.find(f => f.id === fontFamily)?.family || "'Tajawal', sans-serif";

    return (
      <div style={{
        background: t.bg.primary,
        borderRadius: 16,
        border: `1px solid ${t.border.primary}`,
        overflow: 'hidden',
        marginBottom: 16,
      }}>
        {/* هيدر المعاينة */}
        <div style={{
          background: selectedHeaderColor,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${t.border.primary}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: 'linear-gradient(135deg, #d4c5a9, #9ca3af)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: '#3d3d3d' }}>RKZ</span>
            </div>
            <span style={{ 
              fontSize: 12, 
              fontWeight: 600, 
              color: '#fff',
              fontFamily: selectedFont,
            }}>
              معاينة الهيدر
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
          </div>
        </div>

        {/* محتوى المعاينة */}
        <div style={{ padding: 16 }}>
          {/* بطاقة */}
          <div style={{
            background: selectedCardColor,
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            border: `1px solid ${t.border.primary}`,
            opacity: cardOpacity / 100,
            backdropFilter: cardColor === 'glass' ? 'blur(10px)' : 'none',
          }}>
            <p style={{ 
              fontSize: 13, 
              color: t.text.primary, 
              margin: '0 0 12px 0',
              fontFamily: selectedFont,
            }}>
              معاينة البطاقة والخط
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: 'none',
                background: selectedButtonColor?.gradient || selectedButtonColor?.color,
                color: '#fff',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: selectedFont,
              }}>
                زر رئيسي
              </button>
              <button style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: `1px solid ${selectedButtonColor?.color}`,
                background: 'transparent',
                color: selectedButtonColor?.color,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: selectedFont,
              }}>
                زر ثانوي
              </button>
            </div>
          </div>

          {/* شريط التنقل */}
          <div style={{
            display: 'flex',
            gap: 8,
            justifyContent: 'center',
          }}>
            {['الرئيسية', 'المصروفات', 'المهام'].map((item, i) => (
              <div
                key={item}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  background: i === 0 ? (selectedButtonColor?.gradient || selectedButtonColor?.color) : t.bg.tertiary,
                  color: i === 0 ? '#fff' : t.text.muted,
                  fontSize: 11,
                  fontFamily: selectedFont,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // 🖥️ واجهة المستخدم الرئيسية
  // ═══════════════════════════════════════════════════════════════

  return (
    <div style={{ padding: '20px 0' }}>
      {/* تحميل الخطوط */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;600;700&family=Cairo:wght@400;500;600;700&family=Almarai:wght@400;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Noto+Sans+Arabic:wght@400;500;600;700&family=Rubik:wght@400;500;600;700&family=Changa:wght@400;500;600;700&family=Amiri:wght@400;700&display=swap" />

      <div style={{
        maxWidth: 700,
        margin: '0 auto',
      }}>

        {/* العنوان */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: t.button.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Sliders size={24} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: t.text.primary, margin: 0 }}>
                الإعدادات
              </h2>
              <p style={{ fontSize: 13, color: t.text.muted, margin: 0 }}>
                خصّص مظهر التطبيق
              </p>
            </div>
          </div>
          
          <button
            onClick={resetAllSettings}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '10px 16px',
              borderRadius: 10,
              border: `1px solid ${t.border.primary}`,
              background: t.bg.tertiary,
              color: t.text.muted,
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            <RotateCcw size={16} />
            إعادة تعيين
          </button>
        </div>

        {/* المعاينة المباشرة */}
        <Section icon={Eye} title="معاينة مباشرة" subtitle="شاهد التغييرات فوراً">
          <LivePreview />
        </Section>

        {/* وضع العرض */}
        <Section icon={darkMode ? Moon : Sun} title="وضع العرض">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[
              { id: 'light', name: 'فاتح', icon: Sun },
              { id: 'dark', name: 'داكن', icon: Moon },
              { id: 'auto', name: 'تلقائي', icon: Monitor },
            ].map((mode) => {
              const Icon = mode.icon;
              const isActive = themeMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setThemeMode(mode.id)}
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    border: isActive ? `2px solid ${t.button.primary}` : `1px solid ${t.border.primary}`,
                    background: isActive ? `${t.button.primary}15` : t.bg.tertiary,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    fontFamily: 'inherit',
                    transition: 'all 0.2s',
                  }}
                >
                  <Icon size={24} color={isActive ? t.button.primary : t.text.muted} />
                  <span style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: isActive ? t.button.primary : t.text.secondary,
                  }}>{mode.name}</span>
                </button>
              );
            })}
          </div>
        </Section>

        {/* لون الهيدر */}
        <Section icon={Layout} title="لون الهيدر" subtitle="تخصيص لون الشريط العلوي">
          <ColorPicker colors={headerColors} value={headerColor} onChange={saveHeaderColor} />
        </Section>

        {/* لون الأزرار */}
        <Section icon={Square} title="لون الأزرار" subtitle="اللون الرئيسي للأزرار">
          <ColorPicker colors={buttonColors} value={buttonColor} onChange={saveButtonColor} showGradient />
        </Section>

        {/* لون البطاقات */}
        <Section icon={PaintBucket} title="نمط البطاقات" subtitle="خلفية البطاقات والصناديق">
          <ColorPicker colors={cardColors} value={cardColor} onChange={saveCardColor} />
          
          {/* شفافية البطاقات */}
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: t.text.muted }}>الشفافية</span>
              <span style={{ fontSize: 12, color: t.text.primary, fontWeight: 600 }}>{cardOpacity}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              value={cardOpacity}
              onChange={(e) => saveCardOpacity(parseInt(e.target.value))}
              style={{
                width: '100%',
                height: 6,
                borderRadius: 3,
                appearance: 'none',
                background: t.bg.tertiary,
                cursor: 'pointer',
              }}
            />
          </div>
        </Section>

        {/* نوع الخط */}
        <Section icon={Type} title="نوع الخط" subtitle="اختر الخط المناسب">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 8,
          }}>
            {fonts.map((font) => {
              const isActive = fontFamily === font.id;
              return (
                <button
                  key={font.id}
                  onClick={() => saveFontFamily(font.id)}
                  style={{
                    padding: '12px 8px',
                    borderRadius: 10,
                    border: isActive ? `2px solid ${t.button.primary}` : `1px solid ${t.border.primary}`,
                    background: isActive ? `${t.button.primary}15` : t.bg.tertiary,
                    cursor: 'pointer',
                    fontFamily: font.family,
                    fontSize: 13,
                    fontWeight: 600,
                    color: isActive ? t.button.primary : t.text.secondary,
                    transition: 'all 0.2s',
                  }}
                >
                  {font.name}
                </button>
              );
            })}
          </div>
        </Section>

        {/* حجم الخط */}
        <Section icon={Heading} title="حجم الخط" subtitle={`الحجم الحالي: ${fontSize}px`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: t.text.muted }}>أ</span>
            <input
              type="range"
              min="12"
              max="24"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              style={{
                flex: 1,
                height: 6,
                borderRadius: 3,
                appearance: 'none',
                background: t.bg.tertiary,
                cursor: 'pointer',
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
                onClick={() => setFontSize(item.size)}
                style={{
                  padding: '10px 8px',
                  borderRadius: 8,
                  border: fontSize === item.size ? `2px solid ${t.button.primary}` : `1px solid ${t.border.primary}`,
                  background: fontSize === item.size ? `${t.button.primary}15` : 'transparent',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 600,
                  color: fontSize === item.size ? t.button.primary : t.text.muted,
                  fontFamily: 'inherit',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </Section>

        {/* الثيمات */}
        {themeList.length > 0 && (
          <Section icon={Palette} title="الثيم" subtitle="اختر ثيم الألوان">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 10,
            }}>
              {themeList.map((themeItem) => {
                const isActive = currentThemeId === themeItem.id;
                return (
                  <button
                    key={themeItem.id}
                    onClick={() => setCurrentThemeId(themeItem.id)}
                    style={{
                      padding: 14,
                      borderRadius: 12,
                      border: isActive ? `2px solid ${t.button.primary}` : `1px solid ${t.border.primary}`,
                      background: isActive ? `${t.button.primary}15` : t.bg.tertiary,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 8,
                      fontFamily: 'inherit',
                    }}
                  >
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: themeItem.preview || t.button.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {isActive && <Check size={18} color="#fff" />}
                    </div>
                    <span style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: isActive ? t.button.primary : t.text.secondary,
                    }}>{themeItem.name}</span>
                  </button>
                );
              })}
            </div>
          </Section>
        )}

        {/* تأثيرات الخلفية */}
        <Section icon={Sparkles} title="تأثيرات الخلفية" subtitle="الوضع الداكن فقط">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 10,
          }}>
            {[
              { id: 'none', name: 'بدون', emoji: '○', bg: t.bg.primary },
              { id: 'stars', name: 'ياباني', emoji: '✨', bg: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 100%)' },
              { id: 'vegas', name: 'فيغاس', emoji: '🎰', bg: '#050508' },
            ].map((effect) => {
              const isActive = bgEffect === effect.id;
              return (
                <button
                  key={effect.id}
                  onClick={() => saveBgEffect(effect.id)}
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    border: isActive ? `2px solid ${t.button.primary}` : `1px solid ${t.border.primary}`,
                    background: isActive ? `${t.button.primary}15` : t.bg.tertiary,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 10,
                    fontFamily: 'inherit',
                  }}
                >
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: effect.bg,
                    border: `1px solid ${t.border.primary}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: 20 }}>{effect.emoji}</span>
                  </div>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: isActive ? t.button.primary : t.text.secondary,
                  }}>{effect.name}</span>
                </button>
              );
            })}
          </div>

          {bgEffect !== 'none' && !darkMode && (
            <div style={{
              marginTop: 12,
              padding: '10px 14px',
              borderRadius: 10,
              background: '#f59e0b15',
              border: '1px solid #f59e0b30',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}>
              <Zap size={18} color="#f59e0b" />
              <span style={{ fontSize: 12, color: '#f59e0b' }}>
                تأثيرات الخلفية تعمل في الوضع الداكن فقط
              </span>
            </div>
          )}
        </Section>

        {/* المدينة */}
        <Section icon={MapPin} title="المدينة" subtitle="لعرض حالة الطقس">
          <div style={{ position: 'relative' }}>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: 12,
                border: `1px solid ${t.border.primary}`,
                background: t.bg.tertiary,
                color: t.text.primary,
                fontSize: 14,
                fontFamily: 'inherit',
                cursor: 'pointer',
                appearance: 'none',
              }}
            >
              {cities.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <ChevronDown 
              size={20} 
              color={t.text.muted}
              style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}
            />
          </div>
        </Section>

      </div>
    </div>
  );
}
