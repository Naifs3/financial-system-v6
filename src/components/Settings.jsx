import React, { useState } from 'react';
import { Sun, Moon, Monitor, Check, Type, Palette, Sparkles, MapPin, ChevronDown } from 'lucide-react';

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
  // 🎨 تأثيرات الخلفية
  // ═══════════════════════════════════════════════════════════════
  
  const [bgEffect, setBgEffect] = useState(() => {
    return localStorage.getItem('rkz_bgEffect') || 'none';
  });

  const saveBgEffect = (effect) => {
    setBgEffect(effect);
    localStorage.setItem('rkz_bgEffect', effect);
  };

  // ═══════════════════════════════════════════════════════════════
  // 🏙️ المدن
  // ═══════════════════════════════════════════════════════════════
  
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
  // ⭐ خلفية النجوم والشهب (النمط الياباني)
  // ═══════════════════════════════════════════════════════════════
  
  const StarryBackground = () => {
    const stars = Array.from({ length: 35 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 3,
    }));

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
      }}>
        {stars.map((star) => (
          <div
            key={star.id}
            style={{
              position: 'absolute',
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: star.size,
              height: star.size,
              background: '#fff',
              borderRadius: '50%',
              opacity: 0.6,
              animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
            }}
          />
        ))}
        <div className="meteor" />
        <style>{`
          @keyframes twinkle {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.9; }
          }
          .meteor {
            position: absolute;
            top: 15%;
            right: -5%;
            width: 80px;
            height: 1px;
            background: linear-gradient(to left, #fff, transparent);
            transform: rotate(-35deg);
            opacity: 0;
            animation: shootingStar 12s ease-out infinite;
            animation-delay: 3s;
          }
          @keyframes shootingStar {
            0% { opacity: 0; transform: rotate(-35deg) translateX(0); }
            2% { opacity: 0.8; }
            8% { opacity: 0; transform: rotate(-35deg) translateX(-400px); }
            100% { opacity: 0; transform: rotate(-35deg) translateX(-400px); }
          }
        `}</style>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // 🎰 خلفية لاس فيغاس
  // ═══════════════════════════════════════════════════════════════
  
  const VegasBackground = () => {
    const neonLights = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 90 + 5,
      top: Math.random() * 90 + 5,
      size: Math.random() * 3 + 1,
      color: ['#ff00ff', '#00ffff', '#ff0066', '#00ff66', '#6600ff', '#ff3300'][Math.floor(Math.random() * 6)],
      delay: Math.random() * 4,
      duration: Math.random() * 2 + 1.5,
    }));

    const mysterySymbols = [
      { symbol: '♠', left: 8, top: 15, size: 12, opacity: 0.04, delay: 0 },
      { symbol: '♦', left: 92, top: 25, size: 14, opacity: 0.03, delay: 1 },
      { symbol: '♣', left: 15, top: 75, size: 10, opacity: 0.04, delay: 2 },
      { symbol: '♥', left: 85, top: 80, size: 11, opacity: 0.03, delay: 1.5 },
      { symbol: '7', left: 50, top: 10, size: 20, opacity: 0.02, delay: 0.5 },
      { symbol: '777', left: 30, top: 50, size: 16, opacity: 0.015, delay: 3 },
      { symbol: '★', left: 70, top: 40, size: 18, opacity: 0.03, delay: 2.5 },
      { symbol: '$', left: 25, top: 30, size: 15, opacity: 0.025, delay: 1.2 },
    ];

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
      }}>
        {mysterySymbols.map((item, i) => (
          <div
            key={`mystery-${i}`}
            style={{
              position: 'absolute',
              left: `${item.left}%`,
              top: `${item.top}%`,
              fontSize: item.size,
              color: '#fff',
              opacity: item.opacity,
              fontFamily: 'serif',
              animation: `mysteryPulse 8s ease-in-out ${item.delay}s infinite`,
            }}
          >
            {item.symbol}
          </div>
        ))}

        {neonLights.map((light) => (
          <div
            key={light.id}
            style={{
              position: 'absolute',
              left: `${light.left}%`,
              top: `${light.top}%`,
              width: light.size,
              height: light.size,
              background: light.color,
              borderRadius: '50%',
              boxShadow: `0 0 ${light.size * 4}px ${light.size}px ${light.color}40`,
              animation: `neonFloat ${light.duration}s ease-in-out ${light.delay}s infinite alternate`,
              opacity: 0.6,
            }}
          />
        ))}

        <style>{`
          @keyframes neonFloat {
            0% { opacity: 0.3; transform: scale(0.9) translateY(0); }
            100% { opacity: 0.7; transform: scale(1.1) translateY(-5px); }
          }
          @keyframes mysteryPulse {
            0%, 100% { opacity: 0.02; transform: scale(1); }
            50% { opacity: 0.06; transform: scale(1.1); }
          }
        `}</style>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // 🖥️ واجهة المستخدم
  // ═══════════════════════════════════════════════════════════════

  return (
    <div style={{ position: 'relative', padding: '20px 0' }}>
      {/* خلفية التأثيرات */}
      {bgEffect === 'stars' && darkMode && <StarryBackground />}
      {bgEffect === 'vegas' && darkMode && <VegasBackground />}

      <div style={{
        maxWidth: 600,
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
      }}>
        
        {/* العنوان */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{
            fontSize: 20,
            fontWeight: 700,
            color: t.text.primary,
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <Palette size={24} color={t.button.primary} />
            الإعدادات
          </h2>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* الوضع (داكن / فاتح / تلقائي) */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div style={{
          background: t.bg.secondary,
          borderRadius: t.radius.xl,
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
            {darkMode ? <Moon size={20} color={t.button.primary} /> : <Sun size={20} color={t.button.primary} />}
            <span style={{ fontSize: 15, fontWeight: 600, color: t.text.primary }}>وضع العرض</span>
          </div>

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
                    borderRadius: t.radius.lg,
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
                  <Icon size={24} color={isActive ? t.button.primary : t.text.muted} />
                  <span style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: isActive ? t.button.primary : t.text.secondary,
                  }}>{mode.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* الثيمات */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {themeList.length > 0 && (
          <div style={{
            background: t.bg.secondary,
            borderRadius: t.radius.xl,
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
              <Palette size={20} color={t.button.primary} />
              <span style={{ fontSize: 15, fontWeight: 600, color: t.text.primary }}>الثيم</span>
            </div>

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
                      padding: 12,
                      borderRadius: t.radius.lg,
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
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: themeItem.preview || t.button.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {isActive && <Check size={16} color="#fff" />}
                    </div>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: isActive ? t.button.primary : t.text.secondary,
                    }}>{themeItem.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* حجم الخط */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div style={{
          background: t.bg.secondary,
          borderRadius: t.radius.xl,
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
            <Type size={20} color={t.button.primary} />
            <span style={{ fontSize: 15, fontWeight: 600, color: t.text.primary }}>حجم الخط</span>
            <span style={{ fontSize: 12, color: t.text.muted, marginRight: 'auto' }}>{fontSize}px</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
            <span style={{ fontSize: 18, color: t.text.muted }}>أ</span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 8,
            marginTop: 12,
          }}>
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
                  padding: '8px 4px',
                  borderRadius: t.radius.md,
                  border: fontSize === item.size ? `2px solid ${t.button.primary}` : `1px solid ${t.border.primary}`,
                  background: fontSize === item.size ? `${t.button.primary}15` : 'transparent',
                  cursor: 'pointer',
                  fontSize: 11,
                  fontWeight: 600,
                  color: fontSize === item.size ? t.button.primary : t.text.muted,
                  fontFamily: 'inherit',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* المدينة */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div style={{
          background: t.bg.secondary,
          borderRadius: t.radius.xl,
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
            <MapPin size={20} color={t.button.primary} />
            <span style={{ fontSize: 15, fontWeight: 600, color: t.text.primary }}>المدينة</span>
          </div>

          <div style={{ position: 'relative' }}>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: t.radius.lg,
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
              size={18} 
              color={t.text.muted}
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* تأثيرات الخلفية */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div style={{
          background: t.bg.secondary,
          borderRadius: t.radius.xl,
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
            <Sparkles size={20} color={t.button.primary} />
            <span style={{ fontSize: 15, fontWeight: 600, color: t.text.primary }}>تأثيرات الخلفية</span>
            <span style={{ fontSize: 10, color: t.text.muted }}>(الوضع الداكن فقط)</span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 10,
          }}>
            {/* بدون تأثير */}
            <button
              onClick={() => saveBgEffect('none')}
              style={{
                padding: 16,
                borderRadius: t.radius.lg,
                border: bgEffect === 'none' ? `2px solid ${t.button.primary}` : `1px solid ${t.border.primary}`,
                background: bgEffect === 'none' ? `${t.button.primary}15` : t.bg.tertiary,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                fontFamily: 'inherit',
              }}
            >
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: t.bg.primary,
                border: `1px solid ${t.border.primary}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{ fontSize: 18, color: t.text.muted }}>○</span>
              </div>
              <span style={{
                fontSize: 11,
                fontWeight: 600,
                color: bgEffect === 'none' ? t.button.primary : t.text.secondary,
              }}>بدون</span>
            </button>

            {/* النمط الياباني */}
            <button
              onClick={() => saveBgEffect('stars')}
              style={{
                padding: 16,
                borderRadius: t.radius.lg,
                border: bgEffect === 'stars' ? `2px solid ${t.button.primary}` : `1px solid ${t.border.primary}`,
                background: bgEffect === 'stars' ? `${t.button.primary}15` : t.bg.tertiary,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                fontFamily: 'inherit',
              }}
            >
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{ fontSize: 18 }}>✨</span>
              </div>
              <span style={{
                fontSize: 11,
                fontWeight: 600,
                color: bgEffect === 'stars' ? t.button.primary : t.text.secondary,
              }}>ياباني</span>
            </button>

            {/* لاس فيغاس */}
            <button
              onClick={() => saveBgEffect('vegas')}
              style={{
                padding: 16,
                borderRadius: t.radius.lg,
                border: bgEffect === 'vegas' ? `2px solid ${t.button.primary}` : `1px solid ${t.border.primary}`,
                background: bgEffect === 'vegas' ? `${t.button.primary}15` : t.bg.tertiary,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                fontFamily: 'inherit',
              }}
            >
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: '#050508',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{ fontSize: 18 }}>🎰</span>
              </div>
              <span style={{
                fontSize: 11,
                fontWeight: 600,
                color: bgEffect === 'vegas' ? t.button.primary : t.text.secondary,
              }}>فيغاس</span>
            </button>
          </div>

          {bgEffect !== 'none' && !darkMode && (
            <div style={{
              marginTop: 12,
              padding: '8px 12px',
              borderRadius: 8,
              background: '#f59e0b20',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <span style={{ fontSize: 14 }}>⚠️</span>
              <span style={{ fontSize: 11, color: '#f59e0b' }}>
                تأثيرات الخلفية تعمل في الوضع الداكن فقط
              </span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
