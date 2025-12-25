// src/components/Settings.jsx
import React, { useState } from 'react';
import { Settings as SettingsIcon, Sun, Moon, Monitor, Palette, Type, Check } from 'lucide-react';

const Settings = ({ 
  darkMode,
  themeMode, 
  setThemeMode, 
  currentThemeId,
  setCurrentThemeId,
  fontSize, 
  setFontSize,
  txt, 
  txtSm, 
  card,
  theme,
  themeList
}) => {
  const [saved, setSaved] = useState(false);
  const t = theme;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ padding: 16, paddingBottom: 80 }}>
      
      {/* العنوان */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ 
          fontSize: 24, 
          fontWeight: 700, 
          color: t.text.primary,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          margin: 0,
        }}>
          <SettingsIcon size={24} />
          الإعدادات
        </h2>
        <p style={{ fontSize: 14, color: t.text.muted, marginTop: 4 }}>
          تخصيص المظهر والقوالب
        </p>
      </div>

      {/* تنبيه الحفظ التلقائي */}
      <div style={{
        background: `${t.button.primary}15`,
        border: `1px solid ${t.button.primary}30`,
        borderRadius: t.radius.lg,
        padding: 16,
        marginBottom: 24,
      }}>
        <p style={{ fontSize: 14, color: t.button.primary, margin: 0 }}>
          💡 جميع الإعدادات يتم حفظها تلقائياً في المتصفح
        </p>
      </div>

      {/* ═══════════════ وضع العرض ═══════════════ */}
      <div style={{
        background: t.bg.secondary,
        borderRadius: t.radius.xl,
        border: `1px solid ${t.border.primary}`,
        padding: 24,
        marginBottom: 20,
      }}>
        <h3 style={{ 
          fontSize: 18, 
          fontWeight: 700, 
          color: t.text.primary,
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          {themeMode === 'light' ? <Sun size={20} /> : 
           themeMode === 'dark' ? <Moon size={20} /> : 
           <Monitor size={20} />}
          وضع العرض
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { mode: 'light', icon: <Sun size={24} />, label: 'نهاري', color: '#f59e0b' },
            { mode: 'dark', icon: <Moon size={24} />, label: 'ليلي', color: '#3b82f6' },
            { mode: 'auto', icon: <Monitor size={24} />, label: 'تلقائي', color: '#8b5cf6' },
          ].map(({ mode, icon, label, color }) => (
            <button
              key={mode}
              onClick={() => { setThemeMode(mode); handleSave(); }}
              style={{
                padding: 16,
                borderRadius: t.radius.lg,
                border: `2px solid ${themeMode === mode ? color : t.border.primary}`,
                background: themeMode === mode ? `${color}20` : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: themeMode === mode ? `0 0 20px ${color}30` : 'none',
              }}
            >
              <div style={{ 
                color: themeMode === mode ? color : t.text.muted,
                marginBottom: 8,
                display: 'flex',
                justifyContent: 'center',
              }}>
                {icon}
              </div>
              <p style={{ 
                fontSize: 14, 
                fontWeight: 700, 
                color: t.text.primary,
                margin: 0,
              }}>
                {label}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════════ اختيار القالب ═══════════════ */}
      <div style={{
        background: t.bg.secondary,
        borderRadius: t.radius.xl,
        border: `1px solid ${t.border.primary}`,
        padding: 24,
        marginBottom: 20,
      }}>
        <h3 style={{ 
          fontSize: 18, 
          fontWeight: 700, 
          color: t.text.primary,
          marginBottom: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <Palette size={20} />
          قالب التصميم
        </h3>
        <p style={{ fontSize: 13, color: t.text.muted, marginBottom: 20 }}>
          اختر القالب المناسب لك - كل قالب يحتوي على تركيبة ألوان مختلفة
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {themeList.map((themeItem) => {
            const isSelected = currentThemeId === themeItem.id;
            const previewTheme = theme.id === themeItem.id ? theme : null;
            
            return (
              <button
                key={themeItem.id}
                onClick={() => { setCurrentThemeId(themeItem.id); handleSave(); }}
                style={{
                  padding: 20,
                  borderRadius: t.radius.xl,
                  border: `2px solid ${isSelected ? t.button.primary : t.border.primary}`,
                  background: isSelected ? `${t.button.primary}15` : t.bg.tertiary,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: isSelected ? t.button.glow : 'none',
                  textAlign: 'right',
                }}
              >
                {/* أيقونة القالب */}
                <div style={{ 
                  fontSize: 32, 
                  marginBottom: 12,
                  textAlign: 'center',
                }}>
                  {themeItem.icon}
                </div>
                
                {/* اسم القالب */}
                <p style={{ 
                  fontSize: 16, 
                  fontWeight: 700, 
                  color: t.text.primary,
                  margin: '0 0 4px 0',
                  textAlign: 'center',
                }}>
                  {themeItem.name}
                </p>
                
                {/* وصف القالب */}
                <p style={{ 
                  fontSize: 11, 
                  color: t.text.muted,
                  margin: 0,
                  textAlign: 'center',
                }}>
                  {themeItem.description}
                </p>
                
                {/* علامة الاختيار */}
                {isSelected && (
                  <div style={{
                    marginTop: 12,
                    display: 'flex',
                    justifyContent: 'center',
                  }}>
                    <div style={{
                      background: t.button.gradient,
                      borderRadius: t.radius.full,
                      padding: '4px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}>
                      <Check size={14} color="#fff" />
                      <span style={{ fontSize: 12, color: '#fff', fontWeight: 600 }}>مُفعّل</span>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══════════════ معاينة الألوان ═══════════════ */}
      <div style={{
        background: t.bg.secondary,
        borderRadius: t.radius.xl,
        border: `1px solid ${t.border.primary}`,
        padding: 24,
        marginBottom: 20,
      }}>
        <h3 style={{ 
          fontSize: 18, 
          fontWeight: 700, 
          color: t.text.primary,
          marginBottom: 16,
        }}>
          🎨 ألوان القالب الحالي
        </h3>
        
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {t.colorKeys.map((colorKey) => (
            <div key={colorKey} style={{ textAlign: 'center' }}>
              <div style={{
                width: 50,
                height: 50,
                borderRadius: t.radius.lg,
                background: t.colors[colorKey].gradient,
                boxShadow: darkMode ? t.colors[colorKey].glow : 'none',
                marginBottom: 6,
              }} />
              <p style={{ 
                fontSize: 10, 
                color: t.text.muted,
                margin: 0,
                textTransform: 'capitalize',
              }}>
                {colorKey}
              </p>
            </div>
          ))}
        </div>
        
        {/* لون الأزرار */}
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${t.border.primary}` }}>
          <p style={{ fontSize: 13, color: t.text.secondary, marginBottom: 12 }}>
            لون الأزرار الموحد:
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: t.radius.md,
              background: t.button.gradient,
              boxShadow: t.button.glow,
            }} />
            <code style={{ 
              fontSize: 12, 
              color: t.button.primary,
              background: `${t.button.primary}15`,
              padding: '4px 10px',
              borderRadius: t.radius.sm,
            }}>
              {t.button.primary}
            </code>
          </div>
        </div>
      </div>

      {/* ═══════════════ حجم الخط ═══════════════ */}
      <div style={{
        background: t.bg.secondary,
        borderRadius: t.radius.xl,
        border: `1px solid ${t.border.primary}`,
        padding: 24,
        marginBottom: 20,
      }}>
        <h3 style={{ 
          fontSize: 18, 
          fontWeight: 700, 
          color: t.text.primary,
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <Type size={20} />
          حجم الخط
        </h3>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={() => { setFontSize(Math.max(12, fontSize - 2)); handleSave(); }}
            style={{
              width: 48,
              height: 48,
              borderRadius: t.radius.lg,
              border: 'none',
              background: t.bg.tertiary,
              color: t.text.primary,
              fontSize: 20,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            −
          </button>
          
          <div style={{ flex: 1, textAlign: 'center' }}>
            <p style={{ 
              fontSize: fontSize, 
              fontWeight: 700, 
              color: t.text.primary,
              margin: 0,
            }}>
              {fontSize}px
            </p>
            <p style={{ fontSize: 13, color: t.text.muted, marginTop: 4 }}>
              نص تجريبي للخط
            </p>
          </div>
          
          <button
            onClick={() => { setFontSize(Math.min(24, fontSize + 2)); handleSave(); }}
            style={{
              width: 48,
              height: 48,
              borderRadius: t.radius.lg,
              border: 'none',
              background: t.bg.tertiary,
              color: t.text.primary,
              fontSize: 20,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            +
          </button>
        </div>
        
        {/* شريط التحكم */}
        <div style={{ marginTop: 16 }}>
          <input
            type="range"
            min="12"
            max="24"
            step="2"
            value={fontSize}
            onChange={(e) => { setFontSize(parseInt(e.target.value)); handleSave(); }}
            style={{
              width: '100%',
              accentColor: t.button.primary,
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: 11, color: t.text.muted }}>12px</span>
            <span style={{ fontSize: 11, color: t.text.muted }}>24px</span>
          </div>
        </div>
      </div>

      {/* ═══════════════ زر الحفظ ═══════════════ */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <button
          onClick={handleSave}
          style={{
            padding: '14px 32px',
            borderRadius: t.radius.lg,
            border: 'none',
            background: saved 
              ? 'linear-gradient(135deg, #10b981, #059669)' 
              : t.button.gradient,
            color: '#fff',
            fontWeight: 700,
            fontSize: 15,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: t.button.glow,
            transform: saved ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 0.3s',
          }}
        >
          <Check size={20} />
          {saved ? 'تم الحفظ بنجاح!' : 'حفظ الإعدادات'}
        </button>
      </div>

      {/* ═══════════════ الفوتر ═══════════════ */}
      <div style={{
        background: t.bg.secondary,
        borderRadius: t.radius.xl,
        border: `1px solid ${t.border.primary}`,
        padding: 24,
        textAlign: 'center',
      }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: t.text.primary, margin: '0 0 8px 0' }}>
          نظام الإدارة المالية v7.0
        </p>
        <p style={{ fontSize: 12, color: t.text.muted, margin: 0 }}>
          ركائز الأولى للتعمير
        </p>
        <p style={{ fontSize: 12, color: t.text.muted, marginTop: 8 }}>
          جميع الحقوق محفوظة © 2024
        </p>
      </div>
    </div>
  );
};

export default Settings;
