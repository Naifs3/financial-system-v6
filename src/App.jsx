import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot,
  query, orderBy
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { db, storage, auth } from './config/firebase';
import { generateId, compressImage } from './utils/helpers';
import { getTheme, THEME_LIST, SHARED } from './config/theme';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Expenses from './components/Expenses';
import Tasks from './components/Tasks';
import Projects from './components/Projects';
import Accounts from './components/Accounts';
import Users from './components/Users';
import Settings from './components/Settings';
import QuantityCalculator from './components/QuantityCalculator';
import Resources from './components/Resources';
import { LogOut, Settings as SettingsIcon, Bell, Clock } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// [إصلاح 1] ثوابت الإعدادات - خارج المكوّن لتجنب إعادة الإنشاء عند كل render
// ═══════════════════════════════════════════════════════════════
const HEADER_COLORS = {
  default: null,
  navy: '#0f172a',
  slate: '#1e293b',
  zinc: '#18181b',
  blue: '#1e3a5f',
  indigo: '#312e81',
  purple: '#3b0764',
  pink: '#500724',
  red: '#450a0a',
  orange: '#431407',
  green: '#052e16',
  teal: '#042f2e',
};

const BUTTON_COLORS = {
  default: null,
  blue: { color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' },
  indigo: { color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)' },
  purple: { color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
  pink: { color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899, #db2777)' },
  red: { color: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444, #dc2626)' },
  orange: { color: '#f97316', gradient: 'linear-gradient(135deg, #f97316, #ea580c)' },
  amber: { color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
  green: { color: '#22c55e', gradient: 'linear-gradient(135deg, #22c55e, #16a34a)' },
  teal: { color: '#14b8a6', gradient: 'linear-gradient(135deg, #14b8a6, #0d9488)' },
  cyan: { color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
  rose: { color: '#f43f5e', gradient: 'linear-gradient(135deg, #f43f5e, #e11d48)' },
};

const FONTS = {
  tajawal: "'Tajawal', sans-serif",
  cairo: "'Cairo', sans-serif",
  almarai: "'Almarai', sans-serif",
  ibm: "'IBM Plex Sans Arabic', sans-serif",
};

// ═══════════════════════════════════════════════════════════════
// [إصلاح 2] المحتوى الثابت - خارج المكوّن (لم تكن كذلك سابقاً)
// ═══════════════════════════════════════════════════════════════

// [إصلاح 3] إزالة الإيموجي من الاقتباسات (تبقى فقط إيموجي الهيدر)
const MOTIVATIONAL_QUOTES = [
  'النجاح يبدأ بخطوة واحدة',
  'كل يوم هو فرصة جديدة للإنجاز',
  'العمل الجاد يصنع المستحيل',
  'معاً نبني المستقبل',
  'الإتقان هو سر التميز',
  'خطوة بخطوة نحو القمة',
  'الجودة هي عنواننا',
  'نحن نبني أحلامكم',
  'التميز ليس خياراً بل أسلوب حياة',
];

// إيموجي التحية تبقى لأنها تظهر في الهيدر
const GREETING_PHRASES = [
  { text: 'أهلاً وسهلاً', emoji: '👋' },
  { text: 'مرحباً بك', emoji: '🌟' },
  { text: 'سعداء بوجودك', emoji: '😊' },
  { text: 'حياك الله', emoji: '💫' },
  { text: 'نورت', emoji: '✨' },
];

// [إصلاح 4] إحداثيات المدن خارج المكوّن
const CITY_COORDINATES = {
  Riyadh: { lat: 24.7136, lon: 46.6753, name: 'الرياض' },
  Jeddah: { lat: 21.4858, lon: 39.1925, name: 'جدة' },
  Mecca: { lat: 21.3891, lon: 39.8579, name: 'مكة' },
  Medina: { lat: 24.5247, lon: 39.5692, name: 'المدينة' },
  Dammam: { lat: 26.4207, lon: 50.0888, name: 'الدمام' },
  Khobar: { lat: 26.2172, lon: 50.1971, name: 'الخبر' },
  Tabuk: { lat: 28.3838, lon: 36.555, name: 'تبوك' },
  Abha: { lat: 18.2164, lon: 42.5053, name: 'أبها' },
  Taif: { lat: 21.2703, lon: 40.4158, name: 'الطائف' },
  Hail: { lat: 27.5114, lon: 41.7208, name: 'حائل' },
};

// دالة تحديد أيقونة الطقس - خارج المكوّن
const getWeatherIcon = (code) => {
  if (code === 0) return '☀️';
  if (code <= 3) return '⛅';
  if (code <= 49) return '🌫️';
  if (code <= 69) return '🌧️';
  return '☀️';
};

// [إصلاح 5] translateRole خارج المكوّن
const translateRole = (role) => {
  const roles = { owner: 'المالك', admin: 'مدير', user: 'مستخدم', viewer: 'مشاهد' };
  return roles[role?.toLowerCase()] || role || 'مستخدم';
};

// [إصلاح 6] formatDate خارج المكوّن (تستقبل التاريخ كمعامل)
const formatDate = (date) => {
  const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  return {
    dayName: days[date.getDay()],
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  };
};

// ═══════════════════════════════════════════════════════════════
// مكونات الخلفية
// ═══════════════════════════════════════════════════════════════
const StarsBackground = () => {
  const starsRef = useRef(null);

  useEffect(() => {
    if (!starsRef.current) return;
    const canvas = starsRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.5 + 0.1,
      opacity: Math.random() * 0.5 + 0.3,
    }));

    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        star.opacity += (Math.random() - 0.5) * 0.02;
        star.opacity = Math.max(0.2, Math.min(0.8, star.opacity));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={starsRef}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0 }}
    />
  );
};

const ParticlesBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.3 + 0.1,
    }));

    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 150, 255, ${p.opacity})`;
        ctx.fill();
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0 }}
    />
  );
};

const GradientBackground = () => (
  <div
    style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background:
        'radial-gradient(ellipse at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
      pointerEvents: 'none', zIndex: 0,
    }}
  />
);

// ═══════════════════════════════════════════════════════════════
// مكون الساعة - منفصل لتجنب re-render للمكوّن الرئيسي
// الإيموجي 🕐 تبقى لأنها تظهر في الهيدر
// ═══════════════════════════════════════════════════════════════
const LiveClock = React.memo(() => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span>
      🕐 {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
    </span>
  );
});

// ═══════════════════════════════════════════════════════════════
// مكون عداد الوقت النشط - منفصل لتجنب re-render
// ═══════════════════════════════════════════════════════════════
const ActiveTimer = React.memo(({ isActive, buttonColor }) => {
  const [seconds, setSeconds] = useState(() => {
    const saved = localStorage.getItem('activeSessionTime');
    return saved ? parseInt(saved, 10) : 0;
  });
  const secondsRef = useRef(seconds);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      secondsRef.current += 1;
      setSeconds(secondsRef.current);
      if (secondsRef.current % 10 === 0) {
        localStorage.setItem('activeSessionTime', secondsRef.current.toString());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const display = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: buttonColor }}>
      <Clock size={12} />
      <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{display}</span>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════
// المكوّن الرئيسي
// ═══════════════════════════════════════════════════════════════
function App() {
  // الحالات الأساسية
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');

  // [إصلاح 7] currentDate يتحدث تلقائياً عند منتصف الليل
  const [currentDate, setCurrentDate] = useState(new Date());

  // البيانات الأساسية
  const [expenses, setExpenses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [users, setUsers] = useState([]);

  // بيانات إدارة الموارد
  const [clients, setClients] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [equipment, setEquipment] = useState([]);

  // إعدادات المظهر
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem('themeMode') || 'dark');
  const [darkMode, setDarkMode] = useState(true);
  const [currentThemeId, setCurrentThemeId] = useState(
    () => localStorage.getItem('currentThemeId') || 'tokyo-lights'
  );
  const [fontSize, setFontSize] = useState(() => parseInt(localStorage.getItem('fontSize'), 10) || 16);
  const [city, setCity] = useState(() => localStorage.getItem('city') || 'Riyadh');
  const [weather, setWeather] = useState(null);

  // الإعدادات المخصصة
  const [headerColor, setHeaderColor] = useState(() => localStorage.getItem('rkz_headerColor') || 'default');
  const [buttonColor, setButtonColor] = useState(() => localStorage.getItem('rkz_buttonColor') || 'default');
  const [fontFamily, setFontFamily] = useState(() => localStorage.getItem('rkz_fontFamily') || 'tajawal');
  const [bgEffect, setBgEffect] = useState(() => localStorage.getItem('rkz_bgEffect') || 'none');

  // عداد الوقت
  const [isPageVisible, setIsPageVisible] = useState(true);

  // العبارات الدورية
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [greetingIndex, setGreetingIndex] = useState(0);

  // ═══════════════════════════════════════════════════════════════
  // حساب الثيم والألوان
  // ═══════════════════════════════════════════════════════════════
  const theme = getTheme(currentThemeId, darkMode);
  const t = theme;

  const appliedHeaderColor = HEADER_COLORS[headerColor] || t.bg.secondary;
  const appliedButtonColor = BUTTON_COLORS[buttonColor]?.color || t.button.primary;
  const appliedButtonGradient = BUTTON_COLORS[buttonColor]?.gradient || t.button.gradient;
  const appliedFont = FONTS[fontFamily] || "'Tajawal', sans-serif";

  const customTheme = {
    ...theme,
    button: { ...theme.button, primary: appliedButtonColor, gradient: appliedButtonGradient },
  };

  // ═══════════════════════════════════════════════════════════════
  // حفظ الإعدادات في localStorage
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => { localStorage.setItem('themeMode', themeMode); }, [themeMode]);
  useEffect(() => { localStorage.setItem('currentThemeId', currentThemeId); }, [currentThemeId]);
  useEffect(() => { localStorage.setItem('fontSize', fontSize); }, [fontSize]);
  useEffect(() => { localStorage.setItem('city', city); }, [city]);
  useEffect(() => { localStorage.setItem('rkz_headerColor', headerColor); }, [headerColor]);
  useEffect(() => { localStorage.setItem('rkz_buttonColor', buttonColor); }, [buttonColor]);
  useEffect(() => { localStorage.setItem('rkz_fontFamily', fontFamily); }, [fontFamily]);
  useEffect(() => { localStorage.setItem('rkz_bgEffect', bgEffect); }, [bgEffect]);

  // وضع العرض (داكن/فاتح/تلقائي)
  useEffect(() => {
    if (themeMode === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setDarkMode(mediaQuery.matches);
      const handleChange = () => setDarkMode(mediaQuery.matches);
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      setDarkMode(themeMode === 'dark');
    }
  }, [themeMode]);

  // [إصلاح 7] تحديث التاريخ تلقائياً عند منتصف الليل
  useEffect(() => {
    setCurrentDate(new Date());
    const now = new Date();
    const msUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1) - now;

    const timeout = setTimeout(() => {
      setCurrentDate(new Date());
      const daily = setInterval(() => setCurrentDate(new Date()), 86400000);
      return () => clearInterval(daily);
    }, msUntilMidnight);

    return () => clearTimeout(timeout);
  }, []);

  // [إصلاح 8] تغيير العبارات بدون stale closure - استخدام functional updates مباشرة
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
      setGreetingIndex((prev) => (prev + 1) % GREETING_PHRASES.length);
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // مراقبة نشاط الصفحة
  useEffect(() => {
    const handleVisibilityChange = () => setIsPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // [إصلاح 9] جلب الطقس مع useCallback لتجنب إعادة الإنشاء وضمان صحة dependencies
  const fetchWeather = useCallback(async () => {
    try {
      const coords = CITY_COORDINATES[city] || CITY_COORDINATES['Riyadh'];
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,weather_code&timezone=auto`
      );
      if (!response.ok) throw new Error('Weather API error');
      const data = await response.json();
      setWeather({
        temp: Math.round(data.current.temperature_2m),
        icon: getWeatherIcon(data.current.weather_code),
      });
    } catch {
      setWeather({ temp: 25, icon: '☀️' });
    }
  }, [city]);

  useEffect(() => {
    fetchWeather();
    const weatherTimer = setInterval(fetchWeather, 600000);
    return () => clearInterval(weatherTimer);
  }, [fetchWeather]);

  // المصادقة
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          setCurrentUser(JSON.parse(savedUser));
          setIsLoggedIn(true);
        }
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // [إصلاح 10] Firebase listeners مع معالجة الأخطاء
  useEffect(() => {
    if (!isLoggedIn) return;

    const onErr = (name) => (error) =>
      console.error(`[Firebase:${name}]`, error.message);

    const unsubs = [
      onSnapshot(
        query(collection(db, 'expenses'), orderBy('createdAt', 'desc')),
        (s) => setExpenses(s.docs.map((d) => ({ id: d.id, ...d.data() }))),
        onErr('expenses')
      ),
      onSnapshot(
        query(collection(db, 'tasks'), orderBy('createdAt', 'desc')),
        (s) => setTasks(s.docs.map((d) => ({ id: d.id, ...d.data() }))),
        onErr('tasks')
      ),
      onSnapshot(
        query(collection(db, 'projects'), orderBy('createdAt', 'desc')),
        (s) => setProjects(s.docs.map((d) => ({ id: d.id, ...d.data() }))),
        onErr('projects')
      ),
      onSnapshot(
        query(collection(db, 'accounts'), orderBy('createdAt', 'desc')),
        (s) => setAccounts(s.docs.map((d) => ({ id: d.id, ...d.data() }))),
        onErr('accounts')
      ),
      onSnapshot(
        query(collection(db, 'users'), orderBy('createdAt', 'desc')),
        (s) => setUsers(s.docs.map((d) => ({ id: d.id, ...d.data() }))),
        onErr('users')
      ),
    ];

    return () => unsubs.forEach((u) => u());
  }, [isLoggedIn]);

  // Firebase listeners - إدارة الموارد مع معالجة الأخطاء
  useEffect(() => {
    if (!isLoggedIn) return;

    const onErr = (name) => (error) =>
      console.error(`[Firebase:${name}]`, error.message);

    const unsubs = [
      onSnapshot(
        query(collection(db, 'clients'), orderBy('createdAt', 'desc')),
        (s) => setClients(s.docs.map((d) => ({ id: d.id, ...d.data() }))),
        onErr('clients')
      ),
      onSnapshot(
        query(collection(db, 'suppliers'), orderBy('createdAt', 'desc')),
        (s) => setSuppliers(s.docs.map((d) => ({ id: d.id, ...d.data() }))),
        onErr('suppliers')
      ),
      onSnapshot(
        query(collection(db, 'documents'), orderBy('createdAt', 'desc')),
        (s) => setDocuments(s.docs.map((d) => ({ id: d.id, ...d.data() }))),
        onErr('documents')
      ),
      onSnapshot(
        query(collection(db, 'materials'), orderBy('createdAt', 'desc')),
        (s) => setMaterials(s.docs.map((d) => ({ id: d.id, ...d.data() }))),
        onErr('materials')
      ),
      onSnapshot(
        query(collection(db, 'equipment'), orderBy('createdAt', 'desc')),
        (s) => setEquipment(s.docs.map((d) => ({ id: d.id, ...d.data() }))),
        onErr('equipment')
      ),
    ];

    return () => unsubs.forEach((u) => u());
  }, [isLoggedIn]);

  // ═══════════════════════════════════════════════════════════════
  // Handlers
  // ═══════════════════════════════════════════════════════════════

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('activeSessionTime', '0');
  };

  const handleSignupSuccess = (userData) => {
    setShowSignup(false);
    handleLogin(userData);
  };

  // [إصلاح - logout] استخدام try/finally لضمان تنظيف الحالة حتى عند حدوث خطأ
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      setIsLoggedIn(false);
      setCurrentUser(null);
      localStorage.removeItem('currentUser');
      localStorage.removeItem('activeSessionTime');
    }
  };

  // [إصلاح 8] handleViewChange يستخدم functional updates بدلاً من stale closure
  const handleViewChange = (view) => {
    setCurrentView(view);
    setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
    setGreetingIndex((prev) => (prev + 1) % GREETING_PHRASES.length);
  };

  // ─── المصروفات ───────────────────────────────────────────────
  const handleAddExpense = async (e) => {
    await addDoc(collection(db, 'expenses'), { ...e, createdAt: new Date() });
  };
  const handleEditExpense = async (e) => {
    const { id, ...d } = e;
    await updateDoc(doc(db, 'expenses', id), d);
  };
  const handleDeleteExpense = async (id) => {
    await deleteDoc(doc(db, 'expenses', id));
  };
  const handleMarkPaid = async (id) => {
    await updateDoc(doc(db, 'expenses', id), { status: 'مدفوع' });
  };

  // ─── المهام ──────────────────────────────────────────────────
  const handleAddTask = async (task) => {
    await addDoc(collection(db, 'tasks'), { ...task, createdAt: new Date() });
  };
  const handleEditTask = async (task) => {
    const { id, ...d } = task;
    await updateDoc(doc(db, 'tasks', id), d);
  };
  const handleDeleteTask = async (id) => {
    await deleteDoc(doc(db, 'tasks', id));
  };
  // [إصلاح] حماية من null قبل الوصول إلى task.status
  const handleToggleTaskStatus = async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    await updateDoc(doc(db, 'tasks', id), {
      status: task.status === 'مكتمل' ? 'قيد التنفيذ' : 'مكتمل',
    });
  };

  // ─── المشاريع ────────────────────────────────────────────────
  const handleAddProject = async (p) => {
    await addDoc(collection(db, 'projects'), { ...p, folders: [], createdAt: new Date() });
  };
  const handleEditProject = async (p) => {
    const { id, ...d } = p;
    await updateDoc(doc(db, 'projects', id), d);
  };
  const handleDeleteProject = async (id) => {
    await deleteDoc(doc(db, 'projects', id));
  };
  const handleAddFolder = async (pId, name) => {
    const p = projects.find((x) => x.id === pId);
    if (!p) return;
    await updateDoc(doc(db, 'projects', pId), {
      folders: [...(p.folders || []), { id: generateId(), name, files: [] }],
    });
  };
  const handleUploadFile = async (pId, fId, file) => {
    const p = projects.find((x) => x.id === pId);
    if (!p) return;
    const compressed = file.type.startsWith('image/') ? await compressImage(file) : file;
    const fileRef = ref(storage, `projects/${pId}/${fId}/${file.name}`);
    await uploadBytes(fileRef, compressed);
    const url = await getDownloadURL(fileRef);
    const updated = p.folders.map((f) =>
      f.id === fId
        ? { ...f, files: [...f.files, { id: generateId(), name: file.name, url, type: file.type }] }
        : f
    );
    await updateDoc(doc(db, 'projects', pId), { folders: updated });
  };
  // [إصلاح] حماية من null + معالجة خطأ حذف الملف من Storage
  const handleDeleteFile = async (pId, fId, fileId) => {
    const p = projects.find((x) => x.id === pId);
    if (!p) return;
    const folder = p.folders.find((f) => f.id === fId);
    const file = folder?.files.find((f) => f.id === fileId);
    if (!file) return;
    try {
      await deleteObject(ref(storage, `projects/${pId}/${fId}/${file.name}`));
    } catch (e) {
      console.error('Storage delete error:', e);
    }
    const updated = p.folders.map((f) =>
      f.id === fId ? { ...f, files: f.files.filter((x) => x.id !== fileId) } : f
    );
    await updateDoc(doc(db, 'projects', pId), { folders: updated });
  };

  // ─── الحسابات ────────────────────────────────────────────────
  const handleAddAccount = async (a) => {
    await addDoc(collection(db, 'accounts'), { ...a, createdAt: new Date() });
  };
  const handleEditAccount = async (a) => {
    const { id, ...d } = a;
    await updateDoc(doc(db, 'accounts', id), d);
  };
  const handleDeleteAccount = async (id) => {
    await deleteDoc(doc(db, 'accounts', id));
  };

  // ─── العملاء ──────────────────────────────────────────────────
  const handleAddClient = async (c) => { await addDoc(collection(db, 'clients'), { ...c, createdAt: new Date() }); };
  const handleEditClient = async (c) => { const { id, ...d } = c; await updateDoc(doc(db, 'clients', id), d); };
  const handleDeleteClient = async (id) => { await deleteDoc(doc(db, 'clients', id)); };

  // ─── الموردين ─────────────────────────────────────────────────
  const handleAddSupplier = async (s) => { await addDoc(collection(db, 'suppliers'), { ...s, createdAt: new Date() }); };
  const handleEditSupplier = async (s) => { const { id, ...d } = s; await updateDoc(doc(db, 'suppliers', id), d); };
  const handleDeleteSupplier = async (id) => { await deleteDoc(doc(db, 'suppliers', id)); };

  // ─── المستندات ────────────────────────────────────────────────
  const handleAddDocument = async (d) => { await addDoc(collection(db, 'documents'), { ...d, createdAt: new Date() }); };
  const handleEditDocument = async (d) => { const { id, ...data } = d; await updateDoc(doc(db, 'documents', id), data); };
  const handleDeleteDocument = async (id) => { await deleteDoc(doc(db, 'documents', id)); };

  // ─── المواد ───────────────────────────────────────────────────
  const handleAddMaterial = async (m) => { await addDoc(collection(db, 'materials'), { ...m, createdAt: new Date() }); };
  const handleEditMaterial = async (m) => { const { id, ...d } = m; await updateDoc(doc(db, 'materials', id), d); };
  const handleDeleteMaterial = async (id) => { await deleteDoc(doc(db, 'materials', id)); };

  // ─── المعدات ──────────────────────────────────────────────────
  const handleAddEquipment = async (e) => { await addDoc(collection(db, 'equipment'), { ...e, createdAt: new Date() }); };
  const handleEditEquipment = async (e) => { const { id, ...d } = e; await updateDoc(doc(db, 'equipment', id), d); };
  const handleDeleteEquipment = async (id) => { await deleteDoc(doc(db, 'equipment', id)); };

  // [إصلاح] handleNavigate مُبسّطة بـ lookup object
  const handleNavigate = (type) => {
    const viewMap = {
      project: 'projects',
      account: 'accounts',
      user: 'users',
      task: 'tasks',
      expense: 'expenses',
      client: 'resources',
      supplier: 'resources',
      document: 'resources',
      material: 'resources',
      equipment: 'resources',
    };
    const view = viewMap[type];
    if (view) setCurrentView(view);
  };

  // ═══════════════════════════════════════════════════════════════
  // الواجهة
  // ═══════════════════════════════════════════════════════════════

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: t.bg.primary }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 48, height: 48,
            border: `3px solid ${t.border.primary}`,
            borderTopColor: appliedButtonColor,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px',
          }} />
          <p style={{ color: t.text.primary, fontFamily: appliedFont }}>جاري التحميل...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isLoggedIn) {
    if (showSignup) {
      return <SignUp onBack={() => setShowSignup(false)} onSuccess={handleSignupSuccess} darkMode={darkMode} theme={theme} />;
    }
    return <Login onLogin={handleLogin} onShowSignup={() => setShowSignup(true)} darkMode={darkMode} theme={theme} />;
  }

  const dateInfo = formatDate(currentDate);
  const cityName = CITY_COORDINATES[city]?.name || 'الرياض';
  const currentGreeting = GREETING_PHRASES[greetingIndex];

  return (
    <div
      dir="rtl"
      style={{
        minHeight: '100vh',
        background: t.bg.primary,
        color: t.text.primary,
        fontFamily: appliedFont,
        fontSize: `${fontSize}px`,
        position: 'relative',
      }}
    >
      <link href={SHARED.font.url} rel="stylesheet" />
      <link
        href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;600;700&family=Cairo:wght@400;600;700&family=Almarai:wght@400;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* تأثيرات الخلفية */}
      {bgEffect === 'stars' && darkMode && <StarsBackground />}
      {bgEffect === 'particles' && darkMode && <ParticlesBackground />}
      {bgEffect === 'gradient' && darkMode && <GradientBackground />}

      <style>{`
        * { font-feature-settings: "tnum"; }
        input, select, textarea { font-family: ${appliedFont}; }
        input[type="number"] { direction: ltr; text-align: right; -moz-appearance: textfield; }
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: ${darkMode ? '#0a0a0a' : '#f1f1f1'}; border-radius: 4px; }
        ::-webkit-scrollbar-thumb { background: ${darkMode ? '#1a1a1a' : '#c1c1c1'}; border-radius: 4px; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ═══ Header ═══════════════════════════════════════════════ */}
      <header
        style={{
          background: `${appliedHeaderColor}f5`,
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${t.border.primary}`,
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '10px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>

            {/* الشعار والمعلومات */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 46, height: 46,
                background: 'linear-gradient(135deg, #d4c5a9 0%, #9ca3af 100%)',
                borderRadius: t.radius.lg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid #b8a88a',
              }}>
                <span style={{ fontSize: 17, fontWeight: 800, color: '#3d3d3d' }}>RKZ</span>
              </div>
              <div>
                <h1 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: t.text.primary }}>
                  ركائز الأولى للتعمير
                </h1>
                <p style={{ fontSize: 11, color: t.text.muted, margin: '2px 0 0 0', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  {/* الإيموجي التالية تبقى لأنها جزء من واجهة الهيدر */}
                  <span>📅 {dateInfo.dayName} {dateInfo.day}/{dateInfo.month}/{dateInfo.year}</span>
                  <span style={{ opacity: 0.4 }}>|</span>
                  <LiveClock />
                  <span style={{ opacity: 0.4 }}>|</span>
                  <span>{weather?.icon || '☀️'} {weather?.temp ?? '--'}° {cityName}</span>
                </p>
                <p style={{ fontSize: 11, color: t.text.muted, margin: '2px 0 0 0', fontWeight: 700 }}>
                  {MOTIVATIONAL_QUOTES[quoteIndex]}
                </p>
              </div>
            </div>

            {/* أدوات الهيدر */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 11, color: t.text.muted, fontWeight: 700 }}>{currentGreeting.text}</span>
                <span style={{ fontSize: 15 }}>{currentGreeting.emoji}</span>
              </div>

              <button
                onClick={() => handleViewChange('users')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: t.bg.tertiary,
                  padding: '0 12px', height: 36,
                  borderRadius: t.radius.lg,
                  border: `1px solid ${t.border.primary}`,
                  cursor: 'pointer', fontFamily: appliedFont,
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 600, color: t.text.primary }}>
                  {currentUser?.username || 'مستخدم'}:{' '}
                  <span style={{ color: t.text.muted, fontWeight: 500 }}>
                    {translateRole(currentUser?.role)}
                  </span>
                </span>
                <ActiveTimer isActive={isPageVisible && isLoggedIn} buttonColor={appliedButtonColor} />
              </button>

              <button style={{
                width: 36, height: 36, borderRadius: t.radius.lg,
                border: 'none', background: t.bg.tertiary,
                color: t.text.muted, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}>
                <Bell size={18} />
                <span style={{
                  position: 'absolute', top: 6, right: 6,
                  width: 8, height: 8,
                  background: t.status.danger.text, borderRadius: '50%',
                }} />
              </button>

              <button
                onClick={() => handleViewChange('settings')}
                style={{
                  width: 36, height: 36, borderRadius: t.radius.lg,
                  border: 'none',
                  background: currentView === 'settings' ? appliedButtonGradient : t.bg.tertiary,
                  color: currentView === 'settings' ? '#fff' : t.text.muted,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <SettingsIcon size={18} />
              </button>

              <button
                onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '0 12px', height: 36,
                  borderRadius: t.radius.lg, border: 'none',
                  background: `${t.status.danger.text}15`,
                  color: t.status.danger.text,
                  cursor: 'pointer', fontSize: 12, fontFamily: appliedFont,
                }}
              >
                <LogOut size={15} />
                <span>خروج</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <Navigation currentView={currentView} setCurrentView={handleViewChange} darkMode={darkMode} theme={customTheme} />

      {/* ═══ المحتوى الرئيسي ═══════════════════════════════════════ */}
      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        {currentView === 'dashboard' && (
          <Dashboard
            expenses={expenses} tasks={tasks} projects={projects} accounts={accounts}
            darkMode={darkMode} theme={customTheme}
          />
        )}
        {currentView === 'expenses' && (
          <Expenses
            expenses={expenses} accounts={accounts} projects={projects} users={users}
            onAdd={handleAddExpense} onEdit={handleEditExpense}
            onDelete={handleDeleteExpense} onMarkPaid={handleMarkPaid}
            onNavigate={handleNavigate} darkMode={darkMode} theme={customTheme}
          />
        )}
        {currentView === 'tasks' && (
          <Tasks
            tasks={tasks} projects={projects} users={users}
            onAdd={handleAddTask} onEdit={handleEditTask}
            onDelete={handleDeleteTask} onToggleStatus={handleToggleTaskStatus}
            onNavigate={handleNavigate} darkMode={darkMode} theme={customTheme}
          />
        )}
        {currentView === 'projects' && (
          <Projects
            projects={projects} accounts={accounts} users={users}
            tasks={tasks} expenses={expenses} clients={clients}
            onAdd={handleAddProject} onEdit={handleEditProject} onDelete={handleDeleteProject}
            onAddFolder={handleAddFolder} onUploadFile={handleUploadFile} onDeleteFile={handleDeleteFile}
            onNavigate={handleNavigate} darkMode={darkMode} theme={customTheme}
          />
        )}
        {currentView === 'accounts' && (
          <Accounts
            accounts={accounts} expenses={expenses} projects={projects}
            onAdd={handleAddAccount} onEdit={handleEditAccount} onDelete={handleDeleteAccount}
            onNavigate={handleNavigate} darkMode={darkMode} theme={customTheme}
          />
        )}
        {currentView === 'users' && (
          <Users
            currentUser={currentUser} users={users}
            projects={projects} tasks={tasks} expenses={expenses}
            onNavigate={handleNavigate} darkMode={darkMode} theme={customTheme}
          />
        )}
        {currentView === 'resources' && (
          <Resources
            clients={clients} suppliers={suppliers} documents={documents}
            materials={materials} equipment={equipment}
            projects={projects} accounts={accounts} users={users} expenses={expenses}
            onAddClient={handleAddClient} onEditClient={handleEditClient} onDeleteClient={handleDeleteClient}
            onAddSupplier={handleAddSupplier} onEditSupplier={handleEditSupplier} onDeleteSupplier={handleDeleteSupplier}
            onAddDocument={handleAddDocument} onEditDocument={handleEditDocument} onDeleteDocument={handleDeleteDocument}
            onAddMaterial={handleAddMaterial} onEditMaterial={handleEditMaterial} onDeleteMaterial={handleDeleteMaterial}
            onAddEquipment={handleAddEquipment} onEditEquipment={handleEditEquipment} onDeleteEquipment={handleDeleteEquipment}
            onNavigate={handleNavigate} darkMode={darkMode} theme={customTheme}
          />
        )}
        {currentView === 'settings' && (
          <Settings
            darkMode={darkMode}
            themeMode={themeMode} setThemeMode={setThemeMode}
            currentThemeId={currentThemeId} setCurrentThemeId={setCurrentThemeId}
            fontSize={fontSize} setFontSize={setFontSize}
            city={city} setCity={setCity}
            theme={customTheme} themeList={THEME_LIST}
            headerColor={headerColor} setHeaderColor={setHeaderColor}
            buttonColor={buttonColor} setButtonColor={setButtonColor}
            fontFamily={fontFamily} setFontFamily={setFontFamily}
            bgEffect={bgEffect} setBgEffect={setBgEffect}
          />
        )}
        {currentView === 'calculator' && (
          <QuantityCalculator darkMode={darkMode} theme={customTheme} />
        )}
      </main>

      <footer style={{ textAlign: 'center', padding: 16, color: t.text.muted, fontSize: 10, position: 'relative', zIndex: 1 }}>
        <p style={{ margin: 0 }}>نظام ركائز الأولى للتعمير v7.0 &copy; 2024</p>
      </footer>
    </div>
  );
}

export default App;
