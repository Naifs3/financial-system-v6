// src/components/Settings.jsx
import React, { useState } from 'react';
import { Settings as SettingsIcon, Sun, Moon, Monitor, Palette, Type, Check } from 'lucide-react';
import { THEMES, FONTS, ACCENT_COLORS, HEADER_COLORS } from '../config/constants';

const Settings = ({ 
  darkMode,
  themeMode, 
  setThemeMode, 
  bgIndex, 
  setBgIndex, 
  accentIndex, 
  setAccentIndex,
  headerColorIndex,
  setHeaderColorIndex,
  fontSize, 
  setFontSize,
  fontIndex,
  setFontIndex,
  txt, 
  txtSm, 
  card 
}) => {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 space-y-6 pb-20 md:pb-6">
      {/* العنوان */}
      <div>
        <h2 className={`text-2xl font-bold ${txt} flex items-center gap-2`}>
          <SettingsIcon className="w-6 h-6" />
          الإعدادات
        </h2>
        <p className={`text-sm ${txtSm} mt-1`}>تخصيص المظهر والخطوط</p>
      </div>

      {/* معلومة */}
      <div className={`${card} p-4 rounded-xl border ${darkMode ? 'border-blue-500/30' : 'border-blue-200'} bg-blue-500/10`}>
        <p className={`text-sm text-blue-400`}>
          💡 جميع الإعدادات يتم حفظها تلقائياً في المتصفح
        </p>
      </div>

      {/* وضع العرض */}
      <div className={`${card} p-6 rounded-2xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className={`text-lg font-bold ${txt} mb-4 flex items-center gap-2`}>
          {themeMode === 'light' ? <Sun className="w-5 h-5" /> : 
           themeMode === 'dark' ? <Moon className="w-5 h-5" /> : 
           <Monitor className="w-5 h-5" />}
          وضع العرض
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => { setThemeMode('light'); handleSave(); }}
            className={`p-4 rounded-xl border-2 transition-all ${
              themeMode === 'light'
                ? 'border-yellow-500 bg-yellow-500/20 ring-2 ring-yellow-500/30'
                : darkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <Sun className={`w-6 h-6 mx-auto mb-2 ${themeMode === 'light' ? 'text-yellow-400' : txtSm}`} />
            <p className={`text-sm font-bold ${txt}`}>نهاري</p>
          </button>
          
          <button
            onClick={() => { setThemeMode('dark'); handleSave(); }}
            className={`p-4 rounded-xl border-2 transition-all ${
              themeMode === 'dark'
                ? 'border-blue-500 bg-blue-500/20 ring-2 ring-blue-500/30'
                : darkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <Moon className={`w-6 h-6 mx-auto mb-2 ${themeMode === 'dark' ? 'text-blue-400' : txtSm}`} />
            <p className={`text-sm font-bold ${txt}`}>ليلي</p>
          </button>
          
          <button
            onClick={() => { setThemeMode('auto'); handleSave(); }}
            className={`p-4 rounded-xl border-2 transition-all ${
              themeMode === 'auto'
                ? 'border-purple-500 bg-purple-500/20 ring-2 ring-purple-500/30'
                : darkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <Monitor className={`w-6 h-6 mx-auto mb-2 ${themeMode === 'auto' ? 'text-purple-400' : txtSm}`} />
            <p className={`text-sm font-bold ${txt}`}>تلقائي</p>
          </button>
        </div>
      </div>

      {/* خلفية التطبيق */}
      <div className={`${card} p-6 rounded-2xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className={`text-lg font-bold ${txt} mb-4 flex items-center gap-2`}>
          <Palette className="w-5 h-5" />
          خلفية التطبيق
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => { setBgIndex(theme.id); handleSave(); }}
              className={`p-4 rounded-xl border-2 transition-all ${
                bgIndex === theme.id
                  ? 'border-blue-500 ring-2 ring-blue-500/30'
                  : darkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className={`h-16 rounded-lg bg-gradient-to-br ${darkMode ? theme.dark : theme.light} mb-2`} />
              <p className={`text-sm font-bold ${txt}`}>{theme.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* لون التمييز */}
      <div className={`${card} p-6 rounded-2xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className={`text-lg font-bold ${txt} mb-4`}>لون التمييز</h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {ACCENT_COLORS.map((color) => (
            <button
              key={color.id}
              onClick={() => { setAccentIndex(color.id); handleSave(); }}
              className={`p-4 rounded-xl border-2 transition-all ${
                accentIndex === color.id
                  ? 'border-blue-500 ring-2 ring-blue-500/30'
                  : darkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className={`h-12 rounded-lg bg-gradient-to-r ${color.gradient} mb-2`} />
              <p className={`text-xs font-bold ${txt}`}>{color.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* لون الهيدر */}
      <div className={`${card} p-6 rounded-2xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className={`text-lg font-bold ${txt} mb-4`}>لون الهيدر</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {HEADER_COLORS.map((color) => (
            <button
              key={color.id}
              onClick={() => { setHeaderColorIndex(color.id); handleSave(); }}
              className={`p-4 rounded-xl border-2 transition-all ${
                headerColorIndex === color.id
                  ? 'border-blue-500 ring-2 ring-blue-500/30'
                  : darkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className={`h-12 rounded-lg ${darkMode ? color.dark : color.light} mb-2`} />
              <p className={`text-sm font-bold ${txt}`}>{color.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* حجم الخط */}
      <div className={`${card} p-6 rounded-2xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className={`text-lg font-bold ${txt} mb-4 flex items-center gap-2`}>
          <Type className="w-5 h-5" />
          حجم الخط
        </h3>
        <div className="flex items-center gap-4">
          <button
            onClick={() => { setFontSize(Math.max(12, fontSize - 2)); handleSave(); }}
            className={`px-4 py-2 rounded-xl ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${txt} font-bold transition-colors`}
          >
            -
          </button>
          <div className="flex-1 text-center">
            <p className={`text-3xl font-bold ${txt}`} style={{ fontSize: `${fontSize}px` }}>
              {fontSize}px
            </p>
            <p className={`text-sm ${txtSm} mt-1`}>نص تجريبي للخط</p>
          </div>
          <button
            onClick={() => { setFontSize(Math.min(24, fontSize + 2)); handleSave(); }}
            className={`px-4 py-2 rounded-xl ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${txt} font-bold transition-colors`}
          >
            +
          </button>
        </div>
      </div>

      {/* نوع الخط */}
      <div className={`${card} p-6 rounded-2xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className={`text-lg font-bold ${txt} mb-4`}>نوع الخط العربي</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FONTS.map((font) => (
            <button
              key={font.id}
              onClick={() => { setFontIndex(font.id); handleSave(); }}
              className={`p-4 rounded-xl border-2 transition-all ${
                fontIndex === font.id
                  ? 'border-blue-500 ring-2 ring-blue-500/30'
                  : darkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <link href={font.url} rel="stylesheet" />
              <p 
                className={`text-xl font-bold ${txt} mb-2`}
                style={{ fontFamily: font.value }}
              >
                {font.name}
              </p>
              <p 
                className={`text-sm ${txtSm}`}
                style={{ fontFamily: font.value }}
              >
                نص تجريبي للخط العربي
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* زر الحفظ */}
      <div className="flex justify-center">
        <button
          onClick={handleSave}
          className={`px-8 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold transition-all hover:opacity-90 flex items-center gap-2 ${
            saved ? 'scale-110' : ''
          }`}
        >
          <Check className="w-5 h-5" />
          {saved ? 'تم الحفظ بنجاح!' : 'حفظ الإعدادات'}
        </button>
      </div>

      {/* معلومات النظام */}
      <div className={`${card} p-6 rounded-2xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'} text-center`}>
        <p className={`text-sm ${txt} font-bold mb-2`}>نظام الإدارة المالية v6.0</p>
        <p className={`text-xs ${txtSm}`}>ركائز الأولى للتعمير</p>
        <p className={`text-xs ${txtSm} mt-2`}>جميع الحقوق محفوظة © 2024</p>
      </div>
    </div>
  );
};

export default Settings;
```

---
