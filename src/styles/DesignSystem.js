// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 RKZ Design System - نظام التصميم الموحد
// تاريخ التصدير: ٦‏/٧‏/١٤٤٧ هـ
// ═══════════════════════════════════════════════════════════════════════════════

const RKZ_DESIGN_SYSTEM = {

  // ═══════════════════════════════════════════════════════════════════════════
  // 🎨 الألوان - Colors
  // ═══════════════════════════════════════════════════════════════════════════
  
  colors: {
    // الوضع الداكن
    dark: {
      bgPrimary: '#0a0a0f',      // خلفية الصفحة
      bgSecondary: '#12121a',    // خلفية المودال/البطاقات
      bgTertiary: '#1a1a24',     // خلفية الحقول
      bgHover: '#252530',        // عند المرور
      textPrimary: '#ffffff',    // النص الرئيسي
      textSecondary: '#a0a0b0',  // النص الثانوي
      textMuted: '#6b6b80',      // النص الباهت
      border: '#2a2a3a',         // الحدود
    },
    // الوضع الفاتح
    light: {
      bgPrimary: '#f8fafc',
      bgSecondary: '#ffffff',
      bgTertiary: '#f1f5f9',
      bgHover: '#e2e8f0',
      textPrimary: '#1e293b',
      textSecondary: '#475569',
      textMuted: '#94a3b8',
      border: '#e2e8f0',
    },
    // الألوان المشتركة
    accent: {
      primary: '#6366f1',
      gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      success: '#10b981',
      danger: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🔘 BTN-001: زر رئيسي (موافق/إضافة)
  // ═══════════════════════════════════════════════════════════════════════════
  
  'BTN-001': {
    name: 'Primary Button',
    nameAr: 'زر رئيسي (موافق/إضافة)',
    usage: ['إضافة', 'حفظ', 'تأكيد', 'موافق'],
    height: 30,
    paddingX: 20,
    paddingY: 0,
    fontSize: 15,
    fontWeight: 600,
    borderRadius: 4,
    iconSize: 25,
    iconGap: 0,
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: '#ffffff',
    border: 'none',
    style: {
      height: 30,
      padding: '0px 20px',
      borderRadius: 4,
      border: 'none',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      color: '#ffffff',
      fontSize: 15,
      fontWeight: 600,
      fontFamily: 'inherit',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 0,
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🔘 BTN-002: زر ثانوي (إلغاء)
  // ═══════════════════════════════════════════════════════════════════════════
  
  'BTN-002': {
    name: 'Secondary Button',
    nameAr: 'زر ثانوي (إلغاء)',
    usage: ['إلغاء', 'رجوع', 'إغلاق'],
    height: 30,
    paddingX: 20,
    paddingY: 0,
    fontSize: 15,
    fontWeight: 600,
    borderRadius: 4,
    background: 'transparent',
    color: 'textSecondary',
    border: '1px solid border',
    style: {
      height: 30,
      padding: '0px 20px',
      borderRadius: 4,
      border: '1px solid', // + theme.border
      background: 'transparent',
      color: 'theme.textSecondary',
      fontSize: 15,
      fontWeight: 600,
      fontFamily: 'inherit',
      cursor: 'pointer',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🔘 BTN-003: زر خطر (حذف)
  // ═══════════════════════════════════════════════════════════════════════════
  
  'BTN-003': {
    name: 'Danger Button',
    nameAr: 'زر خطر (حذف)',
    usage: ['حذف', 'إزالة', 'تأكيد الحذف'],
    height: 30,
    paddingX: 20,
    paddingY: 0,
    fontSize: 15,
    fontWeight: 600,
    borderRadius: 4,
    iconSize: 15,
    iconGap: 4,
    background: '#ef4444',
    color: '#ffffff',
    border: 'none',
    style: {
      height: 30,
      padding: '0px 20px',
      borderRadius: 4,
      border: 'none',
      background: '#ef4444',
      color: '#ffffff',
      fontSize: 15,
      fontWeight: 600,
      fontFamily: 'inherit',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🔘 BTN-004: زر أيقونة
  // ═══════════════════════════════════════════════════════════════════════════
  
  'BTN-004': {
    name: 'Icon Button',
    nameAr: 'زر أيقونة',
    usage: ['إغلاق', 'تعديل', 'حذف', 'تنقل'],
    sm: {
      size: 30,
      iconSize: 20,
      borderRadius: 4,
    },
    md: {
      size: 30,
      iconSize: 20,
      borderRadius: 4,
    },
    lg: {
      size: 30,
      iconSize: 20,
      borderRadius: 4,
    },
    style: (size = 'md') => ({
      width: size === 'sm' ? 30 : size === 'lg' ? 30 : 30,
      height: size === 'sm' ? 30 : size === 'lg' ? 30 : 30,
      borderRadius: size === 'lg' ? 4 : 4,
      border: 'none',
      background: 'theme.bgTertiary',
      color: 'theme.textMuted',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
    }),
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🔘 BTN-005: زر اختيار
  // ═══════════════════════════════════════════════════════════════════════════
  
  'BTN-005': {
    name: 'Selection Button',
    nameAr: 'زر اختيار',
    usage: ['اختيار الحالة', 'اختيار النوع', 'اختيار الأولوية'],
    height: 30,
    paddingX: 20,
    paddingY: 0,
    fontSize: 15,
    fontWeight: 600,
    borderRadius: 4,
    borderActive: 1,
    style: (isActive, color = 'accent') => ({
      flex: 1,
      height: 30,
      padding: '0px 20px',
      borderRadius: 4,
      border: isActive ? '1px solid ' + color : '1px solid theme.border',
      background: isActive ? color + '15' : 'transparent',
      color: isActive ? color : 'theme.textSecondary',
      fontSize: 15,
      fontWeight: 600,
      fontFamily: 'inherit',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
    }),
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 📦 MOD-001: حاوية المودال
  // ═══════════════════════════════════════════════════════════════════════════
  
  'MOD-001': {
    name: 'Modal Container',
    nameAr: 'حاوية المودال',
    width: 400,
    borderRadius: 5,
    borderWidth: 2,
    style: {
      width: '100%',
      maxWidth: 400,
      borderRadius: 5,
      border: '2px solid', // + theme.border
      background: 'theme.bgSecondary',
      overflow: 'hidden',
      boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 📦 MOD-002: هيدر المودال
  // ═══════════════════════════════════════════════════════════════════════════
  
  'MOD-002': {
    name: 'Modal Header',
    nameAr: 'هيدر المودال',
    paddingX: 10,
    paddingY: 10,
    titleFontSize: 20,
    titleFontWeight: 500,
    codeFontSize: 15,
    iconSize: 40,
    iconRadius: 5,
    iconInnerSize: 30,
    closeButtonSize: 30,
    closeIconSize: 20,
    gap: 10,
    style: {
      padding: '10px 10px',
      borderBottom: '1px solid', // + theme.border
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    iconStyle: {
      width: 40,
      height: 40,
      borderRadius: 5,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    titleStyle: {
      fontSize: 20,
      fontWeight: 500,
      color: 'theme.textPrimary',
      margin: 0,
    },
    codeStyle: {
      fontSize: 15,
      fontWeight: 700,
      fontFamily: 'monospace',
    },
    closeButtonStyle: {
      width: 30,
      height: 30,
      borderRadius: 6,
      border: 'none',
      background: 'theme.bgTertiary',
      color: 'theme.textMuted',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 📦 MOD-003: جسم المودال
  // ═══════════════════════════════════════════════════════════════════════════
  
  'MOD-003': {
    name: 'Modal Body',
    nameAr: 'جسم المودال',
    paddingX: 20,
    paddingY: 38,
    gap: 10,
    maxHeight: 600,
    style: {
      padding: '38px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      maxHeight: 600,
      overflowY: 'auto',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 📦 MOD-004: فوتر المودال
  // ═══════════════════════════════════════════════════════════════════════════
  
  'MOD-004': {
    name: 'Modal Footer',
    nameAr: 'فوتر المودال',
    paddingX: 20,
    paddingY: 10,
    gap: 15,
    style: {
      padding: '10px 20px',
      borderTop: '1px solid', // + theme.border
      display: 'flex',
      gap: 15,
      justifyContent: 'flex-end',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 📝 INP-001: حقل نص عادي
  // ═══════════════════════════════════════════════════════════════════════════
  
  'INP-001': {
    name: 'Text Input',
    nameAr: 'حقل نص عادي',
    usage: ['اسم', 'بريد', 'رقم', 'نص قصير'],
    height: 40,
    paddingX: 12,
    paddingY: 10,
    fontSize: 13,
    fontWeight: 400,
    borderRadius: 8,
    borderWidth: 1,
    style: {
      width: '100%',
      height: 40,
      padding: '10px 12px',
      fontSize: 13,
      fontWeight: 400,
      borderRadius: 8,
      border: '1px solid', // + theme.border
      background: 'theme.bgTertiary',
      color: 'theme.textPrimary',
      fontFamily: 'inherit',
      outline: 'none',
      boxSizing: 'border-box',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 📝 INP-002: Label
  // ═══════════════════════════════════════════════════════════════════════════
  
  'INP-002': {
    name: 'Label',
    nameAr: 'عنوان الحقل',
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 4,
    style: {
      display: 'block',
      fontSize: 12,
      fontWeight: 600,
      marginBottom: 4,
      color: 'theme.textSecondary',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 📝 INP-003: حقل نص متعدد (Textarea)
  // ═══════════════════════════════════════════════════════════════════════════
  
  'INP-003': {
    name: 'Textarea',
    nameAr: 'حقل نص متعدد',
    usage: ['ملاحظات', 'وصف', 'تفاصيل'],
    minHeight: 80,
    paddingX: 12,
    paddingY: 10,
    fontSize: 13,
    fontWeight: 400,
    borderRadius: 8,
    borderWidth: 1,
    style: {
      width: '100%',
      minHeight: 80,
      padding: '10px 12px',
      fontSize: 13,
      fontWeight: 400,
      borderRadius: 8,
      border: '1px solid', // + theme.border
      background: 'theme.bgTertiary',
      color: 'theme.textPrimary',
      fontFamily: 'inherit',
      outline: 'none',
      resize: 'vertical',
      boxSizing: 'border-box',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 📝 INP-004: قائمة منسدلة (Select)
  // ═══════════════════════════════════════════════════════════════════════════
  
  'INP-004': {
    name: 'Select',
    nameAr: 'قائمة منسدلة',
    usage: ['اختيار نوع', 'اختيار حالة', 'اختيار من قائمة'],
    height: 40,
    paddingX: 12,
    paddingY: 10,
    fontSize: 13,
    fontWeight: 400,
    borderRadius: 8,
    borderWidth: 1,
    style: {
      width: '100%',
      height: 40,
      padding: '10px 12px',
      fontSize: 13,
      fontWeight: 400,
      borderRadius: 8,
      border: '1px solid', // + theme.border
      background: 'theme.bgTertiary',
      color: 'theme.textPrimary',
      fontFamily: 'inherit',
      outline: 'none',
      cursor: 'pointer',
      boxSizing: 'border-box',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 📝 INP-005: صف من حقلين
  // ═══════════════════════════════════════════════════════════════════════════
  
  'INP-005': {
    name: 'Input Row',
    nameAr: 'صف من حقلين',
    gap: 12,
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12,
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🎴 CRD-001: بطاقة مستطيلة
  // ═══════════════════════════════════════════════════════════════════════════
  
  'CRD-001': {
    name: 'Rectangle Card',
    nameAr: 'بطاقة مستطيلة',
    usage: ['المصروفات', 'المهام', 'المشاريع', 'الحسابات'],
    height: 70,
    paddingX: 10,
    paddingY: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 10,
    // الأيقونة
    iconSize: 35,
    iconRadius: 7,
    iconInnerSize: 26,
    // العنوان والكود
    titleFontSize: 15,
    titleFontWeight: 600,
    codeFontSize: 10,
    codeFontWeight: 700,
    // القيمة
    valueFontSize: 15,
    valueFontWeight: 700,
    // أزرار الإجراءات
    actionButtonSize: 30,
    actionIconSize: 20,
    style: {
      height: 70,
      padding: '10px 10px',
      borderRadius: 10,
      border: '1px solid', // + theme.border
      background: 'theme.bgSecondary',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    iconStyle: {
      width: 35,
      height: 35,
      borderRadius: 7,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    titleStyle: {
      fontSize: 15,
      fontWeight: 600,
      color: 'theme.textPrimary',
      margin: 0,
    },
    codeStyle: {
      fontSize: 10,
      fontWeight: 700,
      fontFamily: 'monospace',
    },
    valueStyle: {
      fontSize: 15,
      fontWeight: 700,
      color: 'theme.textPrimary',
    },
    actionButtonStyle: {
      width: 30,
      height: 30,
      borderRadius: 6,
      border: 'none',
      background: 'theme.bgTertiary',
      color: 'theme.textMuted',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🎴 CRD-002: بطاقة مربعة
  // ═══════════════════════════════════════════════════════════════════════════
  
  'CRD-002': {
    name: 'Square Card',
    nameAr: 'بطاقة مربعة',
    usage: ['الوحدات'],
    width: 100,
    height: 90,
    paddingX: 20,
    paddingY: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
    // الأيقونة
    iconSize: 35,
    iconRadius: 8,
    iconInnerSize: 20,
    // العنوان
    titleFontSize: 11,
    titleFontWeight: 600,
    // الكود
    codeFontSize: 10,
    codeFontWeight: 700,
    style: {
      width: 100,
      height: 90,
      padding: '12px 20px',
      borderRadius: 10,
      border: '1px solid', // + theme.border
      background: 'theme.bgSecondary',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    iconStyle: {
      width: 35,
      height: 35,
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    titleStyle: {
      fontSize: 11,
      fontWeight: 600,
      color: 'theme.textPrimary',
      textAlign: 'center',
    },
    codeStyle: {
      fontSize: 10,
      fontWeight: 700,
      fontFamily: 'monospace',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🎴 CRD-003: هيدر القسم
  // ═══════════════════════════════════════════════════════════════════════════
  
  'CRD-003': {
    name: 'Section Header',
    nameAr: 'هيدر القسم',
    titleFontSize: 20,
    titleFontWeight: 700,
    countFontSize: 20,
    countFontWeight: 600,
    countPaddingX: 20,
    countPaddingY: 2,
    countRadius: 10,
    marginBottom: 12,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12,
    },
    titleStyle: {
      fontSize: 20,
      fontWeight: 700,
      color: 'theme.textPrimary',
      margin: 0,
    },
    countStyle: {
      fontSize: 20,
      fontWeight: 600,
      padding: '2px 20px',
      borderRadius: 10,
      background: 'theme.accent + 20',
      color: 'theme.accent',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 📅 CAL-001: حاوية التقويم
  // ═══════════════════════════════════════════════════════════════════════════
  
  'CAL-001': {
    name: 'Calendar Container',
    nameAr: 'حاوية التقويم',
    width: 220,
    paddingX: 10,
    paddingY: 10,
    borderRadius: 12,
    borderWidth: 1,
    style: {
      width: 220,
      padding: '10px 10px',
      borderRadius: 12,
      border: '1px solid', // + theme.border
      background: 'theme.bgSecondary',
      boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 📅 CAL-002: هيدر التقويم
  // ═══════════════════════════════════════════════════════════════════════════
  
  'CAL-002': {
    name: 'Calendar Header',
    nameAr: 'هيدر التقويم',
    marginBottom: 8,
    titleFontSize: 12,
    titleFontWeight: 600,
    navButtonSize: 24,
    navIconSize: 14,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    titleStyle: {
      fontSize: 12,
      fontWeight: 600,
      color: 'theme.textPrimary',
    },
    navButtonStyle: {
      width: 24,
      height: 24,
      borderRadius: 4,
      border: 'none',
      background: 'theme.bgTertiary',
      color: 'theme.textMuted',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 📅 CAL-003: أيام الأسبوع
  // ═══════════════════════════════════════════════════════════════════════════
  
  'CAL-003': {
    name: 'Week Days',
    nameAr: 'أيام الأسبوع',
    fontSize: 9,
    fontWeight: 600,
    marginBottom: 4,
    height: 20,
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      marginBottom: 4,
    },
    dayStyle: {
      height: 20,
      fontSize: 9,
      fontWeight: 600,
      color: 'theme.textMuted',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 📅 CAL-004: خلايا الأيام
  // ═══════════════════════════════════════════════════════════════════════════
  
  'CAL-004': {
    name: 'Day Cells',
    nameAr: 'خلايا الأيام',
    size: 26,
    fontSize: 11,
    fontWeight: 500,
    borderRadius: 6,
    gap: 2,
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: 2,
    },
    cellStyle: {
      width: 26,
      height: 26,
      fontSize: 11,
      fontWeight: 500,
      borderRadius: 6,
      border: 'none',
      background: 'transparent',
      color: 'theme.textSecondary',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    selectedStyle: {
      background: 'theme.accentGradient',
      color: '#ffffff',
    },
    todayStyle: {
      border: '1px solid theme.accent',
      color: 'theme.accent',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 📅 CAL-005: أزرار الإجراءات السريعة
  // ═══════════════════════════════════════════════════════════════════════════
  
  'CAL-005': {
    name: 'Quick Actions',
    nameAr: 'أزرار الإجراءات السريعة',
    marginTop: 8,
    gap: 4,
    buttonHeight: 24,
    buttonFontSize: 10,
    buttonFontWeight: 600,
    buttonRadius: 6,
    buttonPaddingX: 8,
    style: {
      display: 'flex',
      gap: 4,
      marginTop: 8,
      paddingTop: 8,
      borderTop: '1px solid', // + theme.border
    },
    buttonStyle: {
      flex: 1,
      height: 24,
      padding: '0 8px',
      fontSize: 10,
      fontWeight: 600,
      borderRadius: 6,
      border: 'none',
      background: 'theme.bgTertiary',
      color: 'theme.textSecondary',
      cursor: 'pointer',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🔤 TYP-001: العناوين الرئيسية
  // ═══════════════════════════════════════════════════════════════════════════
  
  'TYP-001': {
    name: 'Headings',
    nameAr: 'العناوين الرئيسية',
    h1: {
      fontSize: 24,
      fontWeight: 700,
      style: { fontSize: 24, fontWeight: 700, color: 'theme.textPrimary', margin: 0 },
    },
    h2: {
      fontSize: 20,
      fontWeight: 700,
      style: { fontSize: 20, fontWeight: 700, color: 'theme.textPrimary', margin: 0 },
    },
    h3: {
      fontSize: 16,
      fontWeight: 600,
      style: { fontSize: 16, fontWeight: 600, color: 'theme.textPrimary', margin: 0 },
    },
    h4: {
      fontSize: 14,
      fontWeight: 600,
      style: { fontSize: 14, fontWeight: 600, color: 'theme.textPrimary', margin: 0 },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🔤 TYP-002: النص العادي
  // ═══════════════════════════════════════════════════════════════════════════
  
  'TYP-002': {
    name: 'Body Text',
    nameAr: 'النص العادي',
    fontSize: 14,
    fontWeight: 400,
    lineHeight: 1.6,
    style: {
      fontSize: 14,
      fontWeight: 400,
      lineHeight: 1.6,
      color: 'theme.textPrimary',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🔤 TYP-003: النص الصغير
  // ═══════════════════════════════════════════════════════════════════════════
  
  'TYP-003': {
    name: 'Small Text',
    nameAr: 'النص الصغير',
    fontSize: 12,
    fontWeight: 400,
    lineHeight: 1.5,
    style: {
      fontSize: 12,
      fontWeight: 400,
      lineHeight: 1.5,
      color: 'theme.textSecondary',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🔤 TYP-004: النص الباهت
  // ═══════════════════════════════════════════════════════════════════════════
  
  'TYP-004': {
    name: 'Muted Text',
    nameAr: 'النص الباهت',
    fontSize: 11,
    fontWeight: 400,
    style: {
      fontSize: 11,
      fontWeight: 400,
      color: 'theme.textMuted',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🔤 TYP-005: الأكواد والأرقام
  // ═══════════════════════════════════════════════════════════════════════════
  
  'TYP-005': {
    name: 'Code Text',
    nameAr: 'الأكواد والأرقام',
    fontSize: 11,
    fontWeight: 700,
    fontFamily: 'monospace',
    style: {
      fontSize: 11,
      fontWeight: 700,
      fontFamily: 'monospace',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🔤 TYP-006: التسميات (Labels)
  // ═══════════════════════════════════════════════════════════════════════════
  
  'TYP-006': {
    name: 'Labels',
    nameAr: 'التسميات',
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 4,
    style: {
      display: 'block',
      fontSize: 12,
      fontWeight: 600,
      marginBottom: 4,
      color: 'theme.textSecondary',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🔤 TYP-007: الشارات (Badges)
  // ═══════════════════════════════════════════════════════════════════════════
  
  'TYP-007': {
    name: 'Badges',
    nameAr: 'الشارات',
    fontSize: 10,
    fontWeight: 600,
    paddingX: 8,
    paddingY: 3,
    borderRadius: 6,
    style: (color) => ({
      display: 'inline-flex',
      alignItems: 'center',
      padding: '3px 8px',
      fontSize: 10,
      fontWeight: 600,
      borderRadius: 6,
      background: color + '20',
      color: color,
    }),
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🧭 NAV-001: الشريط الجانبي
  // ═══════════════════════════════════════════════════════════════════════════
  
  'NAV-001': {
    name: 'Sidebar',
    nameAr: 'الشريط الجانبي',
    width: 240,
    collapsedWidth: 70,
    paddingX: 10,
    paddingY: 15,
    gap: 0,
    style: {
      width: 240,
      padding: '15px 10px',
      background: 'theme.bgSecondary',
      borderLeft: '1px solid', // + theme.border (RTL)
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
    },
    collapsedStyle: {
      width: 70,
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🧭 NAV-002: عنصر القائمة
  // ═══════════════════════════════════════════════════════════════════════════
  
  'NAV-002': {
    name: 'Nav Item',
    nameAr: 'عنصر القائمة',
    height: 44,
    paddingX: 11,
    borderRadius: 10,
    iconSize: 20,
    fontSize: 14,
    fontWeight: 500,
    gap: 12,
    style: {
      height: 44,
      padding: '0 11px',
      borderRadius: 10,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      cursor: 'pointer',
      transition: 'all 0.2s',
      background: 'transparent',
      border: 'none',
      width: '100%',
      fontFamily: 'inherit',
    },
    activeStyle: {
      background: 'theme.accentGradient',
      color: '#ffffff',
    },
    hoverStyle: {
      background: 'theme.bgTertiary',
    },
    labelStyle: {
      fontSize: 14,
      fontWeight: 500,
      color: 'theme.textSecondary',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🧭 NAV-003: الهيدر العلوي
  // ═══════════════════════════════════════════════════════════════════════════
  
  'NAV-003': {
    name: 'Header',
    nameAr: 'الهيدر العلوي',
    height: 60,
    paddingX: 20,
    logoSize: 32,
    titleFontSize: 18,
    titleFontWeight: 700,
    style: {
      height: 60,
      padding: '0 20px',
      background: 'theme.bgSecondary',
      borderBottom: '1px solid', // + theme.border
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    logoStyle: {
      width: 32,
      height: 32,
    },
    titleStyle: {
      fontSize: 18,
      fontWeight: 700,
      color: 'theme.textPrimary',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🧭 NAV-004: أزرار الهيدر
  // ═══════════════════════════════════════════════════════════════════════════
  
  'NAV-004': {
    name: 'Header Buttons',
    nameAr: 'أزرار الهيدر',
    size: 40,
    iconSize: 20,
    borderRadius: 8,
    gap: 8,
    style: {
      width: 40,
      height: 40,
      borderRadius: 8,
      border: 'none',
      background: 'theme.bgTertiary',
      color: 'theme.textMuted',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🧭 NAV-005: فاصل القائمة
  // ═══════════════════════════════════════════════════════════════════════════
  
  'NAV-005': {
    name: 'Divider',
    nameAr: 'فاصل القائمة',
    marginY: 12,
    height: 1,
    style: {
      height: 1,
      margin: '12px 0',
      background: 'theme.border',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🧭 NAV-006: عنوان المجموعة
  // ═══════════════════════════════════════════════════════════════════════════
  
  'NAV-006': {
    name: 'Group Title',
    nameAr: 'عنوان المجموعة',
    fontSize: 10,
    fontWeight: 600,
    marginBottom: 8,
    paddingX: 12,
    style: {
      fontSize: 10,
      fontWeight: 600,
      marginBottom: 8,
      padding: '0 12px',
      color: 'theme.textMuted',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 📊 TBL-001: حاوية الجدول
  // ═══════════════════════════════════════════════════════════════════════════
  
  'TBL-001': {
    name: 'Table Container',
    nameAr: 'حاوية الجدول',
    borderRadius: 12,
    borderWidth: 1,
    style: {
      borderRadius: 12,
      border: '1px solid', // + theme.border
      background: 'theme.bgSecondary',
      overflow: 'hidden',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 📊 TBL-002: هيدر الجدول
  // ═══════════════════════════════════════════════════════════════════════════
  
  'TBL-002': {
    name: 'Table Header',
    nameAr: 'هيدر الجدول',
    height: 48,
    paddingX: 16,
    fontSize: 12,
    fontWeight: 600,
    style: {
      height: 48,
      background: 'theme.bgTertiary',
    },
    cellStyle: {
      padding: '0 16px',
      fontSize: 12,
      fontWeight: 600,
      color: 'theme.textMuted',
      textAlign: 'right',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 📊 TBL-003: صف الجدول
  // ═══════════════════════════════════════════════════════════════════════════
  
  'TBL-003': {
    name: 'Table Row',
    nameAr: 'صف الجدول',
    height: 56,
    paddingX: 16,
    fontSize: 14,
    fontWeight: 400,
    style: {
      height: 56,
      borderBottom: '1px solid', // + theme.border
      transition: 'background 0.2s',
    },
    hoverStyle: {
      background: 'theme.bgTertiary',
    },
    cellStyle: {
      padding: '0 16px',
      fontSize: 14,
      fontWeight: 400,
      color: 'theme.textPrimary',
      textAlign: 'right',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 📊 TBL-004: خلية الإجراءات
  // ═══════════════════════════════════════════════════════════════════════════
  
  'TBL-004': {
    name: 'Actions Cell',
    nameAr: 'خلية الإجراءات',
    buttonSize: 32,
    iconSize: 16,
    gap: 4,
    borderRadius: 6,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
    },
    buttonStyle: {
      width: 32,
      height: 32,
      borderRadius: 6,
      border: 'none',
      background: 'theme.bgTertiary',
      color: 'theme.textMuted',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 📊 TBL-005: الترقيم
  // ═══════════════════════════════════════════════════════════════════════════
  
  'TBL-005': {
    name: 'Pagination',
    nameAr: 'الترقيم',
    height: 56,
    paddingX: 16,
    buttonSize: 32,
    buttonRadius: 6,
    fontSize: 13,
    gap: 4,
    style: {
      height: 56,
      padding: '0 16px',
      borderTop: '1px solid', // + theme.border
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    buttonStyle: {
      width: 32,
      height: 32,
      borderRadius: 6,
      border: 'none',
      background: 'theme.bgTertiary',
      color: 'theme.textMuted',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 13,
    },
    activeButtonStyle: {
      background: 'theme.accentGradient',
      color: '#ffffff',
    },
    infoStyle: {
      fontSize: 13,
      color: 'theme.textMuted',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🌙 CLR-001: ألوان الثيم الداكن
  // ═══════════════════════════════════════════════════════════════════════════
  
  'CLR-001': {
    name: 'Dark Theme',
    nameAr: 'الثيم الداكن',
    colors: {
      bgPrimary: '#0a0a0f',
      bgSecondary: '#12121a',
      bgTertiary: '#1a1a24',
      bgHover: '#252530',
      textPrimary: '#ffffff',
      textSecondary: '#a0a0b0',
      textMuted: '#6b6b80',
      border: '#2a2a3a',
      accent: '#6366f1',
      accentHover: '#8b5cf6',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ☀️ CLR-002: ألوان الثيم الفاتح
  // ═══════════════════════════════════════════════════════════════════════════
  
  'CLR-002': {
    name: 'Light Theme',
    nameAr: 'الثيم الفاتح',
    colors: {
      bgPrimary: '#f8fafc',
      bgSecondary: '#ffffff',
      bgTertiary: '#f1f5f9',
      bgHover: '#e2e8f0',
      textPrimary: '#1e293b',
      textSecondary: '#475569',
      textMuted: '#94a3b8',
      border: '#e2e8f0',
      accent: '#6366f1',
      accentHover: '#8b5cf6',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🚦 CLR-003: ألوان الحالات
  // ═══════════════════════════════════════════════════════════════════════════
  
  'CLR-003': {
    name: 'Status Colors',
    nameAr: 'ألوان الحالات',
    colors: {
      success: '#10b981',
      successLight: '#10b98120',
      danger: '#ef4444',
      dangerLight: '#ef444420',
      warning: '#f59e0b',
      warningLight: '#f59e0b20',
      info: '#3b82f6',
      infoLight: '#3b82f620',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🏷️ CLR-004: ألوان الفئات
  // ═══════════════════════════════════════════════════════════════════════════
  
  'CLR-004': {
    name: 'Category Colors',
    nameAr: 'ألوان الفئات',
    colors: {
      expenses: '#ef4444',
      tasks: '#10b981',
      projects: '#6366f1',
      accounts: '#f59e0b',
      units: '#3b82f6',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🌈 CLR-005: التدرجات
  // ═══════════════════════════════════════════════════════════════════════════
  
  'CLR-005': {
    name: 'Gradients',
    nameAr: 'التدرجات',
    gradients: {
      accent: {
        type: 'linear',
        angle: 135,
        colors: ['#6366f1', '#8b5cf6'],
        css: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      },
      background: {
        enabled: false,
        type: 'linear',
        angle: 180,
        colors: ['#0a0a0f', '#12121a', '#0a0a0f'],
        css: 'linear-gradient(180deg, #0a0a0f, #12121a, #0a0a0f)',
      },
      card: {
        enabled: false,
        type: 'linear',
        angle: 135,
        colors: ['#12121a', '#1a1a24'],
        css: 'linear-gradient(135deg, #12121a, #1a1a24)',
      },
      custom1: {
        enabled: true,
        type: 'linear',
        angle: 135,
        colors: ['#6366f1', '#ec4899'],
        css: 'linear-gradient(135deg, #6366f1, #ec4899)',
      },
      custom2: {
        enabled: true,
        type: 'linear',
        angle: 90,
        colors: ['#10b981', '#3b82f6', '#8b5cf6'],
        css: 'linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6)',
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ✏️ FNT-001: الخطوط المتاحة
  // ═══════════════════════════════════════════════════════════════════════════
  
  'FNT-001': {
    name: 'Available Fonts',
    nameAr: 'الخطوط المتاحة',
    fonts: {
      // خطوط عربية
      tajawal: {
        name: 'Tajawal',
        nameAr: 'تجول',
        family: "'Tajawal', sans-serif",
        url: 'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;600;700&display=swap',
        type: 'arabic',
      },
      cairo: {
        name: 'Cairo',
        nameAr: 'القاهرة',
        family: "'Cairo', sans-serif",
        url: 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap',
        type: 'arabic',
      },
      almarai: {
        name: 'Almarai',
        nameAr: 'المراعي',
        family: "'Almarai', sans-serif",
        url: 'https://fonts.googleapis.com/css2?family=Almarai:wght@400;700&display=swap',
        type: 'arabic',
      },
      ibmPlexArabic: {
        name: 'IBM Plex Sans Arabic',
        nameAr: 'IBM بلكس عربي',
        family: "'IBM Plex Sans Arabic', sans-serif",
        url: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap',
        type: 'arabic',
      },
      notoSansArabic: {
        name: 'Noto Sans Arabic',
        nameAr: 'نوتو سانس عربي',
        family: "'Noto Sans Arabic', sans-serif",
        url: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap',
        type: 'arabic',
      },
      rubik: {
        name: 'Rubik',
        nameAr: 'روبيك',
        family: "'Rubik', sans-serif",
        url: 'https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&display=swap',
        type: 'both',
      },
      
      // خط الآيفون
      sfArabic: {
        name: 'SF Pro Arabic',
        nameAr: 'خط آبل العربي',
        family: "-apple-system, BlinkMacSystemFont, 'SF Pro Arabic', sans-serif",
        url: null, // متوفر في أجهزة Apple فقط
        type: 'system',
        fallback: "'Tajawal', sans-serif",
      },
      
      // خط ويندوز
      calibri: {
        name: 'Calibri',
        nameAr: 'كاليبري',
        family: "'Calibri', 'Segoe UI', sans-serif",
        url: null, // متوفر في ويندوز فقط
        type: 'system',
        fallback: "'Tajawal', sans-serif",
      },
    },
    
    // الخط الافتراضي
    default: 'tajawal',
    
    // ترتيب العرض
    order: ['tajawal', 'cairo', 'almarai', 'ibmPlexArabic', 'notoSansArabic', 'rubik', 'sfArabic', 'calibri'],
  },

};

export default RKZ_DESIGN_SYSTEM;
