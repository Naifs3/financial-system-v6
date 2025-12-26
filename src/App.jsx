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
import { LogOut, Settings as SettingsIcon, Sun, Moon, Monitor, CloudSun, CloudRain, Cloud, Thermometer } from 'lucide-react';

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

  // ═══════════════ العبارات التشجيعية ═══════════════
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
    "معاً لبناء مستقبل أفضل 🤝"
  ];

  // ═══════════════ العبارات الترحيبية ═══════════════
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return 'صباح الخير';
    if (hour >= 12 && hour < 17) return 'مساء الخير';
    if (hour >= 17 && hour < 21) return 'مساء النور';
    return 'مساء الخير';
  };

  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);

  // ═══════════════ تحديث الوقت والعبارات ═══════════════
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const quoteTimer = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
      setCurrentQuote(motivationalQuotes[randomIndex]);
    }, 30000);
    return () => clearInterval(quoteTimer);
  }, []);

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

  // ═══════════════ جلب حالة الطقس (Open-Meteo - مجاني بدون مفتاح) ═══════════════
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
          let icon = 'Clear';
          let description = 'صافي';
          
          if (weatherCode === 0) { icon = 'Clear'; description = 'صافي'; }
          else if (weatherCode <= 3) { icon = 'Clouds'; description = 'غائم جزئياً'; }
          else if (weatherCode <= 49) { icon = 'Fog'; description = 'ضباب'; }
          else if (weatherCode <= 69) { icon = 'Rain'; description = 'ممطر'; }
          else if (weatherCode <= 79) { icon = 'Snow'; description = 'ثلوج'; }
          else if (weatherCode <= 99) { icon = 'Storm'; description = 'عاصفة'; }
          
          setWeather({
            temp: Math.round(data.current.temperature_2m),
            description: description,
            icon: icon
          });
        }
      } catch (error) {
        console.log('Weather fetch error:', error);
        setWeather({ temp: 25, description: 'صافي', icon: 'Clear' });
      }
    };
    fetchWeather();
    const weatherTimer = setInterval(fetchWeather, 600000);
    return () => clearInterval(weatherTimer);
  }, [city]);

  // ═══════════════ تنسيق التاريخ ═══════════════
  const formatDate = () => {
    const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const dayName = days[currentTime.getDay()];
    const day = currentTime.getDate();
    const month = months[currentTime.getMonth()];
    const year = currentTime.getFullYear();
    return { dayName, day, month, year };
  };

  const getWeatherIcon = () => {
    if (!weather) return <Cloud size={20} />;
    switch (weather.icon) {
      case 'Clear': return <Sun size={20} color="#fbbf24" />;
      case 'Clouds': return <Cloud size={20} color="#9ca3af" />;
      case 'Rain': return <CloudRain size={20} color="#60a5fa" />;
      default: return <CloudSun size={20} color="#fbbf24" />;
    }
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

  // Expenses handlers
  const handleAddExpense = async (expense) => {
    await addDoc(collection(db, 'expenses'), { ...expense, createdAt: new Date() });
  };
  const handleEditExpense = async (expense) => {
    const { id, ...data } = expense;
    await updateDoc(doc(db, 'expenses', id), data);
  };
  const handleDeleteExpense = async (id) => {
    await deleteDoc(doc(db, 'expenses', id));
  };
  const handleMarkPaid = async (id) => {
    await updateDoc(doc(db, 'expenses', id), { status: 'مدفوع' });
  };
  const handleRefreshExpenses = () => console.log('Refreshing expenses...');

  // Tasks handlers
  const handleAddTask = async (task) => {
    await addDoc(collection(db, 'tasks'), { ...task, createdAt: new Date() });
  };
  const handleEditTask = async (task) => {
    const { id, ...data } = task;
    await updateDoc(doc(db, 'tasks', id), data);
  };
  const handleDeleteTask = async (id) => {
    await deleteDoc(doc(db, 'tasks', id));
  };
  const handleToggleTaskStatus = async (id) => {
    const task = tasks.find(t => t.id === id);
    const newStatus = task.status === 'مكتمل' ? 'قيد التنفيذ' : 'مكتمل';
    await updateDoc(doc(db, 'tasks', id), { status: newStatus });
  };

  // Projects handlers
  const handleAddProject = async (project) => {
    await addDoc(collection(db, 'projects'), { ...project, folders: [], createdAt: new Date() });
  };
  const handleEditProject = async (project) => {
    const { id, ...data } = project;
    await updateDoc(doc(db, 'projects', id), data);
  };
  const handleDeleteProject = async (id) => {
    await deleteDoc(doc(db, 'projects', id));
  };
  const handleAddFolder = async (projectId, folderName) => {
    const project = projects.find(p => p.id === projectId);
    const newFolder = { id: generateId(), name: folderName, files: [] };
    await updateDoc(doc(db, 'projects', projectId), { folders: [...(project.folders || []), newFolder] });
  };
  const handleUploadFile = async (projectId, folderId, file) => {
    const project = projects.find(p => p.id === projectId);
    const compressed = file.type.startsWith('image/') ? await compressImage(file) : file;
    const fileRef = ref(storage, `projects/${projectId}/${folderId}/${file.name}`);
    await uploadBytes(fileRef, compressed);
    const url = await getDownloadURL(fileRef);
    const newFile = { id: generateId(), name: file.name, url, type: file.type };
    const updatedFolders = project.folders.map(f => f.id === folderId ? { ...f, files: [...f.files, newFile] } : f);
    await updateDoc(doc(db, 'projects', projectId), { folders: updatedFolders });
  };
  const handleDeleteFile = async (projectId, folderId, fileId) => {
    const project = projects.find(p => p.id === projectId);
    const folder = project.folders.find(f => f.id === folderId);
    const file = folder.files.find(f => f.id === fileId);
    const fileRef = ref(storage, `projects/${projectId}/${folderId}/${file.name}`);
    await deleteObject(fileRef);
    const updatedFolders = project.folders.map(f => f.id === folderId ? { ...f, files: f.files.filter(fi => fi.id !== fileId) } : f);
    await updateDoc(doc(db, 'projects', projectId), { folders: updatedFolders });
  };

  // Accounts handlers
  const handleAddAccount = async (account) => {
    await addDoc(collection(db, 'accounts'), { ...account, createdAt: new Date() });
  };
  const handleEditAccount = async (account) => {
    const { id, ...data } = account;
    await updateDoc(doc(db, 'accounts', id), data);
  };
  const handleDeleteAccount = async (id) => {
    await deleteDoc(doc(db, 'accounts', id));
  };

  const txt = { color: t.text.primary };
  const txtSm = { color: t.text.muted };
  const card = { background: t.bg.secondary, borderRadius: t.radius.xl, border: `1px solid ${t.border.primary}` };

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
    if (showSignup) {
      return <SignUp onBack={() => setShowSignup(false)} onSuccess={handleSignupSuccess} darkMode={darkMode} theme={theme} />;
    }
    return <Login onLogin={handleLogin} onShowSignup={() => setShowSignup(true)} darkMode={darkMode} theme={theme} />;
  }

  const dateInfo = formatDate();

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: t.bg.primary, color: t.text.primary, fontFamily: t.font.family, fontSize: `${fontSize}px`, transition: 'all 0.3s ease' }}>
      <link href={SHARED.font.url} rel="stylesheet" />
      
      <style>{`
        * { font-feature-settings: "tnum"; font-variant-numeric: tabular-nums; }
        input, select, textarea { font-family: inherit; }
        input[type="number"], input[type="date"], input[type="time"], input[type="tel"] { direction: ltr; text-align: right; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ═══════════════ Header ═══════════════ */}
      <header style={{ background: `${t.bg.secondary}ee`, backdropFilter: 'blur(10px)', borderBottom: `1px solid ${t.border.primary}`, position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '16px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            
            {/* Logo & Company Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {/* الشعار - بيج غامق متدرج إلى رمادي */}
              <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg, #d4c5a9 0%, #9ca3af 100%)', borderRadius: t.radius.lg, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #b8a88a', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#4a4a4a' }}>RKZ</span>
              </div>
              <div>
                <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: t.text.primary }}>ركائز الأولى للتعمير</h1>
                {/* العبارة التشجيعية */}
                <p style={{ fontSize: 12, color: t.text.muted, margin: '4px 0 0 0', transition: 'all 0.5s ease' }}>{currentQuote}</p>
              </div>
            </div>

            {/* Center - Date & Weather */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, background: t.bg.tertiary, padding: '10px 20px', borderRadius: t.radius.xl, border: `1px solid ${t.border.primary}` }}>
              {/* التاريخ */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: t.text.muted }}>{dateInfo.dayName}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: t.text.primary }}>{dateInfo.day}</div>
                <div style={{ fontSize: 11, color: t.text.muted }}>{dateInfo.month} {dateInfo.year}</div>
              </div>
              
              <div style={{ width: 1, height: 40, background: t.border.primary }} />
              
              {/* الوقت */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: t.button.primary, fontFamily: 'monospace' }}>
                  {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                </div>
                <div style={{ fontSize: 11, color: t.text.muted }}>
                  {currentTime.toLocaleTimeString('en-US', { second: '2-digit' }).split(' ')[0].split(':')[2] || currentTime.getSeconds().toString().padStart(2, '0')}
                </div>
              </div>
              
              <div style={{ width: 1, height: 40, background: t.border.primary }} />
              
              {/* الطقس */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {getWeatherIcon()}
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: t.text.primary }}>{weather?.temp || '--'}°</div>
                  <div style={{ fontSize: 10, color: t.text.muted }}>{city}</div>
                </div>
              </div>
            </div>

            {/* Right - User & Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* معلومات المستخدم مع الترحيب */}
              <div style={{ textAlign: 'left', marginLeft: 8 }}>
                <p style={{ fontSize: 14, fontWeight: 600, margin: 0, color: t.text.primary }}>
                  {getGreeting()}، {currentUser?.username || 'مستخدم'}
                </p>
                <p style={{ fontSize: 11, color: t.text.muted, margin: 0 }}>
                  {currentUser?.role || 'مدير النظام'}
                </p>
              </div>
              
              {/* Theme buttons */}
              <div style={{ display: 'flex', gap: 4, background: t.bg.tertiary, padding: 4, borderRadius: t.radius.lg }}>
                {[
                  { mode: 'light', icon: <Sun size={16} />, title: 'نهاري' },
                  { mode: 'dark', icon: <Moon size={16} />, title: 'ليلي' },
                  { mode: 'auto', icon: <Monitor size={16} />, title: 'تلقائي' },
                ].map(({ mode, icon, title }) => (
                  <button key={mode} onClick={() => setThemeMode(mode)} title={title} style={{
                    padding: 8, borderRadius: t.radius.md, border: 'none',
                    background: themeMode === mode ? t.button.gradient : 'transparent',
                    color: themeMode === mode ? '#fff' : t.text.muted,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{icon}</button>
                ))}
              </div>

              {/* زر الإعدادات (ترس) */}
              <button onClick={() => setCurrentView('settings')} title="الإعدادات" style={{
                width: 40, height: 40, borderRadius: t.radius.lg, border: 'none',
                background: currentView === 'settings' ? t.button.gradient : t.bg.tertiary,
                color: currentView === 'settings' ? '#fff' : t.text.muted,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}>
                <SettingsIcon size={20} />
              </button>

              {/* زر الخروج */}
              <button onClick={handleLogout} style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
                borderRadius: t.radius.lg, border: 'none',
                background: `${t.status.danger.text}15`,
                color: t.status.danger.text, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit',
              }}>
                <LogOut size={16} />
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
      <footer style={{ textAlign: 'center', padding: 20, color: t.text.muted, fontSize: 12 }}>
        <p style={{ margin: 0 }}>نظام ركائز الأولى للتعمير v7.0 - جميع الحقوق محفوظة © 2024</p>
      </footer>
    </div>
  );
}

export default App;
