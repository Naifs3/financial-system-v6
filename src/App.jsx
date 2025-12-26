import React, { useState, useEffect } from 'react';
import { 
  collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, 
  query, orderBy
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { db, storage, auth } from './config/firebase';
import { generateId, compressImage } from './utils/helpers';
import { getTheme, getStyles, THEME_LIST, SHARED } from './config/theme';

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
import { LogOut, Settings as SettingsIcon, Sun, Moon, Monitor } from 'lucide-react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [expenses, setExpenses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [themeMode, setThemeMode] = useState('dark');
  const [darkMode, setDarkMode] = useState(true);
  const [currentThemeId, setCurrentThemeId] = useState('tokyo-lights');
  const [fontSize, setFontSize] = useState(16);
  const [city, setCity] = useState('Riyadh');
  const [weather, setWeather] = useState(null);

  const [sessionStart, setSessionStart] = useState(null);

  const theme = getTheme(currentThemeId, darkMode);
  const styles = getStyles(currentThemeId, darkMode);
  const t = theme;

  // ═══════════════ 40 عبارة تشجيعية ═══════════════
  const motivationalQuotes = [
    "النجاح يبدأ بخطوة واحدة 🚀",
    "كل يوم هو فرصة جديدة للإنجاز ✨",
    "العمل الجاد يصنع المستحيل 💪",
    "معاً نبني المستقبل 🏗️",
    "الإتقان هو سر التميز ⭐",
    "خطوة بخطوة نحو القمة 📈",
    "الجودة هي عنواننا 🎯",
    "نحن نبني أحلامكم 🏠",
    "التميز ليس خياراً بل أسلوب حياة 🌟",
    "معاً لبناء مستقبل أفضل 🤝",
    "الطموح لا حدود له 🌈",
    "نصنع الفرق في كل مشروع 💎",
    "الإبداع هو وقودنا 🔥",
    "نحول الأفكار إلى واقع ✅",
    "التفاني في العمل سر نجاحنا 🏆",
    "نبني بثقة ونسلم بفخر 🎖️",
    "كل تفصيلة تهمنا 🔍",
    "الجودة قبل الكمية دائماً 💯",
    "نلتزم بما نعد به 🤞",
    "رضا العميل هدفنا الأول 😊",
    "الاحترافية في كل خطوة 👔",
    "نتعلم ونتطور كل يوم 📚",
    "الفريق الواحد يصنع المعجزات 👥",
    "لا نقبل إلا الأفضل 🥇",
    "الوقت من ذهب ونحترمه ⏰",
    "السلامة أولاً دائماً 🛡️",
    "نفخر بكل مشروع أنجزناه 🎉",
    "الثقة تُبنى بالعمل لا بالكلام 💬",
    "نحن شركاء نجاحكم 🤝",
    "كل مشروع قصة نجاح جديدة 📖",
    "الدقة في التنفيذ شعارنا 📐",
    "نسعى للكمال في كل عمل ✨",
    "العميل هو محور اهتمامنا 🎯",
    "نبني للأجيال القادمة 🌱",
    "الابتكار يميزنا عن غيرنا 💡",
    "نحقق ما يتخيله الآخرون 🌠",
    "معايير عالمية بلمسة محلية 🌍",
    "كل يوم فرصة لنكون أفضل 📆",
    "نؤمن بأن التفاصيل تصنع الفرق 🔎",
    "شغفنا هو سر تميزنا ❤️"
  ];

  // ═══════════════ 20 عبارة ترحيبية ═══════════════
  const greetingPhrases = [
    "أهلاً وسهلاً",
    "مرحباً بك",
    "سعداء بوجودك",
    "تشرفنا بك",
    "حياك الله",
    "نورت",
    "أهلاً بالغالي",
    "يسعدنا حضورك",
    "منور المكان",
    "أسعد الله يومك",
    "طابت أوقاتك",
    "يا هلا والله",
    "نتمنى لك يوماً موفقاً",
    "بداية موفقة",
    "أهلاً بمن نفتخر به",
    "سعيدون بعودتك",
    "وجودك يسعدنا",
    "يومك مليء بالإنجاز",
    "هلا بالعزيز",
    "نورتنا يا بطل"
  ];

  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);
  const [currentGreeting, setCurrentGreeting] = useState(greetingPhrases[0]);

  // ═══════════════ إحداثيات المدن ═══════════════
  const cityCoordinates = {
    'Riyadh': { lat: 24.7136, lon: 46.6753, name: 'الرياض' },
    'Jeddah': { lat: 21.4858, lon: 39.1925, name: 'جدة' },
    'Mecca': { lat: 21.3891, lon: 39.8579, name: 'مكة' },
    'Medina': { lat: 24.5247, lon: 39.5692, name: 'المدينة' },
    'Dammam': { lat: 26.4207, lon: 50.0888, name: 'الدمام' },
    'Khobar': { lat: 26.2172, lon: 50.1971, name: 'الخبر' },
    'Dhahran': { lat: 26.2361, lon: 50.0393, name: 'الظهران' },
    'Al Ahsa': { lat: 25.3648, lon: 49.5855, name: 'الأحساء' },
    'Tabuk': { lat: 28.3838, lon: 36.5550, name: 'تبوك' },
    'Abha': { lat: 18.2164, lon: 42.5053, name: 'أبها' },
    'Taif': { lat: 21.2703, lon: 40.4158, name: 'الطائف' },
    'Buraidah': { lat: 26.3260, lon: 43.9750, name: 'بريدة' },
    'Khamis Mushait': { lat: 18.3093, lon: 42.7453, name: 'خميس مشيط' },
    'Hail': { lat: 27.5114, lon: 41.7208, name: 'حائل' },
    'Najran': { lat: 17.4933, lon: 44.1277, name: 'نجران' },
    'Yanbu': { lat: 24.0895, lon: 38.0618, name: 'ينبع' },
    'Al Jubail': { lat: 27.0046, lon: 49.6225, name: 'الجبيل' }
  };

  // ═══════════════ تحديث الوقت والعبارات ═══════════════
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setCurrentQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
      setCurrentGreeting(greetingPhrases[Math.floor(Math.random() * greetingPhrases.length)]);
    }, 30000);
    return () => clearInterval(quoteTimer);
  }, []);

  // ═══════════════ جلب حالة الطقس ═══════════════
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const coords = cityCoordinates[city] || cityCoordinates['Riyadh'];
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,weather_code&timezone=auto`
        );
        if (response.ok) {
          const data = await response.json();
          const weatherCode = data.current.weather_code;
          let icon = '☀️';
          let description = 'صافي';
          
          if (weatherCode === 0) { icon = '☀️'; description = 'صافي'; }
          else if (weatherCode <= 3) { icon = '⛅'; description = 'غائم جزئياً'; }
          else if (weatherCode <= 49) { icon = '🌫️'; description = 'ضباب'; }
          else if (weatherCode <= 69) { icon = '🌧️'; description = 'ممطر'; }
          else if (weatherCode <= 79) { icon = '❄️'; description = 'ثلوج'; }
          else if (weatherCode <= 99) { icon = '⛈️'; description = 'عاصفة'; }
          
          setWeather({
            temp: Math.round(data.current.temperature_2m),
            description: description,
            icon: icon
          });
        }
      } catch (error) {
        setWeather({ temp: 25, description: 'صافي', icon: '☀️' });
      }
    };
    fetchWeather();
    const weatherTimer = setInterval(fetchWeather, 600000);
    return () => clearInterval(weatherTimer);
  }, [city]);

  // ═══════════════ تنسيق التاريخ ═══════════════
  const formatDate = () => {
    const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const day = currentTime.getDate();
    const month = currentTime.getMonth() + 1;
    const year = currentTime.getFullYear();
    const dayName = days[currentTime.getDay()];
    return { dayName, day, month, year };
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          setCurrentUser(JSON.parse(savedUser));
          setIsLoggedIn(true);
          const savedSessionStart = localStorage.getItem('sessionStart');
          setSessionStart(savedSessionStart ? parseInt(savedSessionStart) : Date.now());
        }
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const savedThemeMode = localStorage.getItem('themeMode') || 'dark';
    const savedThemeId = localStorage.getItem('currentThemeId') || 'tokyo-lights';
    const savedFontSize = parseInt(localStorage.getItem('fontSize')) || 16;
    const savedCity = localStorage.getItem('city') || 'Riyadh';

    setThemeMode(savedThemeMode);
    setCurrentThemeId(savedThemeId);
    setFontSize(savedFontSize);
    setCity(savedCity);
  }, []);

  useEffect(() => { localStorage.setItem('themeMode', themeMode); }, [themeMode]);
  useEffect(() => { localStorage.setItem('currentThemeId', currentThemeId); }, [currentThemeId]);
  useEffect(() => { localStorage.setItem('fontSize', fontSize); }, [fontSize]);
  useEffect(() => { localStorage.setItem('city', city); }, [city]);

  useEffect(() => {
    const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (themeMode === 'auto') {
      setDarkMode(getSystemTheme());
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => setDarkMode(mediaQuery.matches);
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      setDarkMode(themeMode === 'dark');
    }
  }, [themeMode]);

  // ═══════════════ Firebase listeners ═══════════════
  useEffect(() => {
    if (!isLoggedIn) return;
    const expensesQuery = query(collection(db, 'expenses'), orderBy('createdAt', 'desc'));
    const unsubExpenses = onSnapshot(expensesQuery, (snapshot) => {
      setExpenses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    const tasksQuery = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
    const unsubTasks = onSnapshot(tasksQuery, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    const projectsQuery = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsubProjects = onSnapshot(projectsQuery, (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    const accountsQuery = query(collection(db, 'accounts'), orderBy('createdAt', 'desc'));
    const unsubAccounts = onSnapshot(accountsQuery, (snapshot) => {
      setAccounts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => { unsubExpenses(); unsubTasks(); unsubProjects(); unsubAccounts(); };
  }, [isLoggedIn]);

  // ═══════════════ Handler Functions ═══════════════
  const handleLogin = async (userData) => {
    setCurrentUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    const now = Date.now();
    setSessionStart(now);
    localStorage.setItem('sessionStart', now.toString());
  };

  const handleSignupSuccess = (userData) => {
    setShowSignup(false);
    handleLogin(userData);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setCurrentUser(null);
      localStorage.removeItem('currentUser');
      localStorage.removeItem('sessionStart');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleAddExpense = async (expense) => { await addDoc(collection(db, 'expenses'), { ...expense, createdAt: new Date() }); };
  const handleEditExpense = async (expense) => { const { id, ...data } = expense; await updateDoc(doc(db, 'expenses', id), data); };
  const handleDeleteExpense = async (id) => { await deleteDoc(doc(db, 'expenses', id)); };
  const handleMarkPaid = async (id) => { await updateDoc(doc(db, 'expenses', id), { status: 'مدفوع' }); };
  const handleRefreshExpenses = () => console.log('Refreshing...');

  const handleAddTask = async (task) => { await addDoc(collection(db, 'tasks'), { ...task, createdAt: new Date() }); };
  const handleEditTask = async (task) => { const { id, ...data } = task; await updateDoc(doc(db, 'tasks', id), data); };
  const handleDeleteTask = async (id) => { await deleteDoc(doc(db, 'tasks', id)); };
  const handleToggleTaskStatus = async (id) => {
    const task = tasks.find(t => t.id === id);
    await updateDoc(doc(db, 'tasks', id), { status: task.status === 'مكتمل' ? 'قيد التنفيذ' : 'مكتمل' });
  };

  const handleAddProject = async (project) => { await addDoc(collection(db, 'projects'), { ...project, folders: [], createdAt: new Date() }); };
  const handleEditProject = async (project) => { const { id, ...data } = project; await updateDoc(doc(db, 'projects', id), data); };
  const handleDeleteProject = async (id) => { await deleteDoc(doc(db, 'projects', id)); };
  const handleAddFolder = async (projectId, folderName) => {
    const project = projects.find(p => p.id === projectId);
    await updateDoc(doc(db, 'projects', projectId), { folders: [...(project.folders || []), { id: generateId(), name: folderName, files: [] }] });
  };
  const handleUploadFile = async (projectId, folderId, file) => {
    const project = projects.find(p => p.id === projectId);
    const compressed = file.type.startsWith('image/') ? await compressImage(file) : file;
    const fileRef = ref(storage, `projects/${projectId}/${folderId}/${file.name}`);
    await uploadBytes(fileRef, compressed);
    const url = await getDownloadURL(fileRef);
    const updatedFolders = project.folders.map(f => f.id === folderId ? { ...f, files: [...f.files, { id: generateId(), name: file.name, url, type: file.type }] } : f);
    await updateDoc(doc(db, 'projects', projectId), { folders: updatedFolders });
  };
  const handleDeleteFile = async (projectId, folderId, fileId) => {
    const project = projects.find(p => p.id === projectId);
    const folder = project.folders.find(f => f.id === folderId);
    const file = folder.files.find(f => f.id === fileId);
    await deleteObject(ref(storage, `projects/${projectId}/${folderId}/${file.name}`));
    const updatedFolders = project.folders.map(f => f.id === folderId ? { ...f, files: f.files.filter(fi => fi.id !== fileId) } : f);
    await updateDoc(doc(db, 'projects', projectId), { folders: updatedFolders });
  };

  const handleAddAccount = async (account) => { await addDoc(collection(db, 'accounts'), { ...account, createdAt: new Date() }); };
  const handleEditAccount = async (account) => { const { id, ...data } = account; await updateDoc(doc(db, 'accounts', id), data); };
  const handleDeleteAccount = async (id) => { await deleteDoc(doc(db, 'accounts', id)); };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: t.bg.primary }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: `3px solid ${t.border.primary}`, borderTopColor: t.button.primary, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: t.text.primary }}>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    if (showSignup) return <SignUp onBack={() => setShowSignup(false)} onSuccess={handleSignupSuccess} darkMode={darkMode} theme={theme} />;
    return <Login onLogin={handleLogin} onShowSignup={() => setShowSignup(true)} darkMode={darkMode} theme={theme} />;
  }

  const dateInfo = formatDate();
  const cityName = cityCoordinates[city]?.name || 'الرياض';

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: t.bg.primary, color: t.text.primary, fontFamily: t.font.family, fontSize: `${fontSize}px`, transition: 'all 0.3s ease' }}>
      <link href={SHARED.font.url} rel="stylesheet" />
      
      {/* ═══════════════ Global Styles ═══════════════ */}
      <style>{`
        * { font-feature-settings: "tnum"; font-variant-numeric: tabular-nums; }
        input, select, textarea { font-family: inherit; }
        input[type="number"], input[type="date"], input[type="time"], input[type="tel"] { direction: ltr; text-align: right; }
        
        /* إخفاء أسهم input number */
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
          appearance: textfield;
        }
        
        /* تخصيص شريط التمرير */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: ${darkMode ? '#1a1a1a' : '#f1f1f1'};
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: ${darkMode ? '#333333' : '#c1c1c1'};
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${darkMode ? '#444444' : '#a1a1a1'};
        }
        
        /* Firefox */
        * {
          scrollbar-width: thin;
          scrollbar-color: ${darkMode ? '#333333 #1a1a1a' : '#c1c1c1 #f1f1f1'};
        }
        
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ═══════════════ Header ═══════════════ */}
      <header style={{ background: `${t.bg.secondary}ee`, backdropFilter: 'blur(10px)', borderBottom: `1px solid ${t.border.primary}`, position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '12px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            
            {/* ═══════════════ القسم الأيسر: الشعار والمعلومات ═══════════════ */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* الشعار */}
              <div style={{ 
                width: 48, 
                height: 48, 
                background: 'linear-gradient(135deg, #d4c5a9 0%, #9ca3af 100%)', 
                borderRadius: t.radius.lg, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                border: '1px solid #b8a88a', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)' 
              }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#3d3d3d', letterSpacing: '-0.5px' }}>RKZ</span>
              </div>
              
              {/* معلومات الشركة */}
              <div>
                <h1 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: t.text.primary }}>ركائز الأولى للتعمير</h1>
                {/* التاريخ والوقت والطقس */}
                <p style={{ fontSize: 11, color: t.text.muted, margin: '3px 0 0 0', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>📅 {dateInfo.dayName} {dateInfo.day}/{dateInfo.month}/{dateInfo.year}</span>
                  <span style={{ color: t.border.primary }}>|</span>
                  <span>🕐 {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                  <span style={{ color: t.border.primary }}>|</span>
                  <span>{weather?.icon || '☀️'} {weather?.temp || '--'}° {cityName}</span>
                </p>
                {/* العبارة التشجيعية */}
                <p style={{ fontSize: 11, color: t.text.muted, margin: '3px 0 0 0', opacity: 0.8 }}>{currentQuote}</p>
              </div>
            </div>

            {/* ═══════════════ القسم الأيمن: المستخدم والأزرار ═══════════════ */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              
              {/* العبارة الترحيبية + معلومات المستخدم في فقاعة واحدة */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 10, 
                background: t.bg.tertiary, 
                padding: '8px 14px', 
                borderRadius: t.radius.xl,
                border: `1px solid ${t.border.primary}`
              }}>
                {/* العبارة الترحيبية */}
                <span style={{ fontSize: 12, color: t.text.muted }}>{currentGreeting} 👋</span>
                <span style={{ color: t.border.primary }}>|</span>
                {/* الاسم والصفة */}
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: t.text.primary }}>{currentUser?.username || 'مستخدم'}</p>
                  <p style={{ fontSize: 10, color: t.text.muted, margin: 0 }}>{currentUser?.role || 'مدير النظام'}</p>
                </div>
              </div>
              
              {/* أزرار الثيم */}
              <div style={{ display: 'flex', gap: 2, background: t.bg.tertiary, padding: 3, borderRadius: t.radius.lg }}>
                {[
                  { mode: 'light', icon: <Sun size={15} /> },
                  { mode: 'dark', icon: <Moon size={15} /> },
                  { mode: 'auto', icon: <Monitor size={15} /> },
                ].map(({ mode, icon }) => (
                  <button key={mode} onClick={() => setThemeMode(mode)} style={{
                    padding: 7, borderRadius: t.radius.md, border: 'none',
                    background: themeMode === mode ? t.button.gradient : 'transparent',
                    color: themeMode === mode ? '#fff' : t.text.muted,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{icon}</button>
                ))}
              </div>

              {/* زر الإعدادات */}
              <button onClick={() => setCurrentView('settings')} style={{
                width: 36, height: 36, borderRadius: t.radius.lg, border: 'none',
                background: currentView === 'settings' ? t.button.gradient : t.bg.tertiary,
                color: currentView === 'settings' ? '#fff' : t.text.muted,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <SettingsIcon size={18} />
              </button>

              {/* زر الخروج */}
              <button onClick={handleLogout} style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px',
                borderRadius: t.radius.lg, border: 'none',
                background: `${t.status.danger.text}15`,
                color: t.status.danger.text, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit',
              }}>
                <LogOut size={15} />
                <span>خروج</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════════ Navigation ═══════════════ */}
      <Navigation currentView={currentView} setCurrentView={setCurrentView} darkMode={darkMode} theme={theme} />

      {/* ═══════════════ Main Content ═══════════════ */}
      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>
        {currentView === 'dashboard' && <Dashboard expenses={expenses} tasks={tasks} projects={projects} accounts={accounts} darkMode={darkMode} theme={theme} />}
        {currentView === 'expenses' && <Expenses expenses={expenses} accounts={accounts} onAdd={handleAddExpense} onEdit={handleEditExpense} onDelete={handleDeleteExpense} onMarkPaid={handleMarkPaid} onRefresh={handleRefreshExpenses} darkMode={darkMode} theme={theme} />}
        {currentView === 'tasks' && <Tasks tasks={tasks} projects={projects} onAdd={handleAddTask} onEdit={handleEditTask} onDelete={handleDeleteTask} onToggleStatus={handleToggleTaskStatus} darkMode={darkMode} theme={theme} />}
        {currentView === 'projects' && <Projects projects={projects} onAdd={handleAddProject} onEdit={handleEditProject} onDelete={handleDeleteProject} onAddFolder={handleAddFolder} onUploadFile={handleUploadFile} onDeleteFile={handleDeleteFile} darkMode={darkMode} theme={theme} />}
        {currentView === 'accounts' && <Accounts accounts={accounts} onAdd={handleAddAccount} onEdit={handleEditAccount} onDelete={handleDeleteAccount} darkMode={darkMode} theme={theme} />}
        {currentView === 'users' && <Users currentUser={currentUser} darkMode={darkMode} theme={theme} />}
        {currentView === 'settings' && <Settings darkMode={darkMode} themeMode={themeMode} setThemeMode={setThemeMode} currentThemeId={currentThemeId} setCurrentThemeId={setCurrentThemeId} fontSize={fontSize} setFontSize={setFontSize} city={city} setCity={setCity} theme={theme} themeList={THEME_LIST} />}
        {currentView === 'calculator' && <QuantityCalculator darkMode={darkMode} theme={theme} />}
      </main>

      {/* ═══════════════ Footer ═══════════════ */}
      <footer style={{ textAlign: 'center', padding: 20, color: t.text.muted, fontSize: 11 }}>
        <p style={{ margin: 0 }}>نظام ركائز الأولى للتعمير v7.0 © 2024</p>
      </footer>
    </div>
  );
}

export default App;
