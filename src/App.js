
import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { Calendar, CheckSquare, Users, Moon, Sun, Plus, Archive, Clock, Activity, History, Loader, Power, Pencil, Trash2, RotateCcw, UserCog, ChevronLeft, Palette, FolderOpen, FileText, MapPin, User, X, Phone, Image, Upload, Filter, LogIn, Settings, Type, ChevronDown, Eye, EyeOff, Shield, Lock, Unlock } from 'lucide-react';

const firebaseConfig = {
  apiKey: "AIzaSyDpzPCma5c4Tuxd5htRHOvm4aYLRbj8Qkg",
  authDomain: "financial-system-8f4b3.firebaseapp.com",
  projectId: "financial-system-8f4b3",
  storageBucket: "financial-system-8f4b3.firebasestorage.app",
  messagingSenderId: "243232571212",
  appId: "1:243232571212:web:d3c5bd06b09ef825d959e9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const APP_VERSION = "4.0.0";

const versionHistory = [
  { version: "4.0.0", date: "2024-12-13", changes: ["نظام صلاحيات متقدم", "خريطة قوقل للمشاريع", "رفع الصور والملفات", "سجل محسن مع فلاتر", "تخصيص الألوان الكامل", "تتبع نشاط الأعضاء"] },
  { version: "3.0.0", date: "2024-12-13", changes: ["خلفيات متعددة بنقوش مالية", "نظام المشاريع الكامل", "50 عبارة تحفيزية", "نوافذ منبثقة محسنة"] },
  { version: "2.0.0", date: "2024-12-12", changes: ["إدارة المستخدمين", "الأرشيف والاستعادة", "سجل العمليات", "الوضع الليلي"] },
  { version: "1.0.0", date: "2024-12-10", changes: ["الإصدار الأول", "المصروفات والمهام", "الحسابات", "Firebase"] }
];

const quotes = [
  "يوم موفق! 🌟", "استمر في التميز! 💪", "النجاح قريب! 🎯", "أنت رائع! ⭐", "يوم مبارك! 🌸",
  "إلى القمة! 🚀", "ثق بنفسك! 💎", "أنت قادر! 🏆", "استثمر وقتك! ⏰", "فكر بإيجابية! 🌈",
  "خطوة للأمام! 👣", "لا تستسلم! 🔥", "أنت مميز! ✨", "اصنع الفرق! 💡", "كن الأفضل! 🥇",
  "النجاح عادة! 📈", "ابدأ الآن! ⚡", "حقق أحلامك! 🌙", "كن إيجابياً! 😊", "اعمل بذكاء! 🧠",
  "الإصرار مفتاح! 🔑", "تحدى نفسك! 💪", "اغتنم الفرص! 🎪", "كن مبدعاً! 🎨", "وقتك ثمين! 💰",
  "النمو مستمر! 🌱", "فكر كبيراً! 🏔️", "اصنع مستقبلك! 🔮", "كن قائداً! 👑", "تعلم دائماً! 📚",
  "الجودة أولاً! ✅", "خطط للنجاح! 📋", "نفذ بإتقان! 🎯", "راقب تقدمك! 📊", "احتفل بإنجازاتك! 🎉",
  "شارك النجاح! 🤝", "ألهم الآخرين! 💫", "كن مرناً! 🌊", "تكيف وتطور! 🦋", "ابتكر حلولاً! 💡",
  "وازن حياتك! ⚖️", "استثمر بحكمة! 💎", "ادخر للمستقبل! 🏦", "نوع استثماراتك! 📈", "خطط مالياً! 💵",
  "راقب ميزانيتك! 📝", "حقق الاستقلال! 🦅", "ابن ثروتك! 🏗️", "فكر طويل المدى! 🔭", "النجاح رحلة! 🛤️"
];

const backgrounds = [
  { id: 0, name: 'كلاسيكي', dark: 'from-gray-900 via-purple-900 to-gray-900', light: 'from-blue-50 via-indigo-50 to-purple-50' },
  { id: 1, name: 'أزرق ملكي', dark: 'from-blue-950 via-blue-900 to-indigo-950', light: 'from-blue-100 via-sky-50 to-indigo-100' },
  { id: 2, name: 'ذهبي فاخر', dark: 'from-yellow-950 via-amber-900 to-orange-950', light: 'from-yellow-50 via-amber-50 to-orange-50' },
  { id: 3, name: 'أخضر النجاح', dark: 'from-emerald-950 via-green-900 to-teal-950', light: 'from-emerald-50 via-green-50 to-teal-50' },
  { id: 4, name: 'بنفسجي راقي', dark: 'from-purple-950 via-violet-900 to-indigo-950', light: 'from-purple-50 via-violet-50 to-indigo-50' },
  { id: 5, name: 'فيروزي عصري', dark: 'from-cyan-950 via-teal-900 to-blue-950', light: 'from-cyan-50 via-teal-50 to-blue-50' },
  { id: 6, name: 'وردي أنيق', dark: 'from-pink-950 via-rose-900 to-red-950', light: 'from-pink-50 via-rose-50 to-red-50' },
  { id: 7, name: 'رمادي احترافي', dark: 'from-gray-950 via-slate-900 to-zinc-950', light: 'from-gray-100 via-slate-50 to-zinc-100' },
  { id: 8, name: 'برتقالي دافئ', dark: 'from-orange-950 via-red-900 to-rose-950', light: 'from-orange-50 via-red-50 to-rose-50' },
  { id: 9, name: 'زمردي ثمين', dark: 'from-teal-950 via-emerald-900 to-green-950', light: 'from-teal-50 via-emerald-50 to-green-50' }
];

const accentColors = [
  { id: 0, name: 'أزرق', color: 'bg-blue-500', hover: 'hover:bg-blue-600', text: 'text-blue-500', border: 'border-blue-500', gradient: 'from-blue-600 to-blue-700' },
  { id: 1, name: 'بنفسجي', color: 'bg-purple-500', hover: 'hover:bg-purple-600', text: 'text-purple-500', border: 'border-purple-500', gradient: 'from-purple-600 to-purple-700' },
  { id: 2, name: 'أخضر', color: 'bg-emerald-500', hover: 'hover:bg-emerald-600', text: 'text-emerald-500', border: 'border-emerald-500', gradient: 'from-emerald-600 to-emerald-700' },
  { id: 3, name: 'برتقالي', color: 'bg-orange-500', hover: 'hover:bg-orange-600', text: 'text-orange-500', border: 'border-orange-500', gradient: 'from-orange-600 to-orange-700' },
  { id: 4, name: 'وردي', color: 'bg-pink-500', hover: 'hover:bg-pink-600', text: 'text-pink-500', border: 'border-pink-500', gradient: 'from-pink-600 to-pink-700' },
  { id: 5, name: 'أحمر', color: 'bg-red-500', hover: 'hover:bg-red-600', text: 'text-red-500', border: 'border-red-500', gradient: 'from-red-600 to-red-700' },
  { id: 6, name: 'سماوي', color: 'bg-cyan-500', hover: 'hover:bg-cyan-600', text: 'text-cyan-500', border: 'border-cyan-500', gradient: 'from-cyan-600 to-cyan-700' },
  { id: 7, name: 'ذهبي', color: 'bg-amber-500', hover: 'hover:bg-amber-600', text: 'text-amber-500', border: 'border-amber-500', gradient: 'from-amber-600 to-amber-700' }
];

const fontFamilies = [
  { id: 0, name: 'الافتراضي', value: 'system-ui, -apple-system, sans-serif' },
  { id: 1, name: 'تجوال', value: 'Tajawal, sans-serif' },
  { id: 2, name: 'القاهرة', value: 'Cairo, sans-serif' },
  { id: 3, name: 'أميري', value: 'Amiri, serif' },
  { id: 4, name: 'الكوفي', value: 'Reem Kufi, sans-serif' },
  { id: 5, name: 'المراعي', value: 'El Messiri, sans-serif' }
];

const FinancialPattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="fin-pattern" x="0" y="0" width="450" height="450" patternUnits="userSpaceOnUse">
        <text x="25" y="45" fontSize="52" fill="currentColor" transform="rotate(-12 25 45)" style={{fontFamily:'Caveat,cursive'}}>$</text>
        <text x="380" y="70" fontSize="58" fill="currentColor" transform="rotate(25 380 70)" style={{fontFamily:'Caveat,cursive'}}>€</text>
        <text x="180" y="95" fontSize="48" fill="currentColor" transform="rotate(-5 180 95)" style={{fontFamily:'Caveat,cursive'}}>£</text>
        <text x="290" y="40" fontSize="44" fill="currentColor" transform="rotate(18 290 40)" style={{fontFamily:'Caveat,cursive'}}>¥</text>
        <text x="70" y="140" fontSize="40" fill="currentColor" transform="rotate(30 70 140)" style={{fontFamily:'Caveat,cursive'}}>ر.س</text>
        <text x="420" y="160" fontSize="56" fill="currentColor" transform="rotate(-22 420 160)" style={{fontFamily:'Caveat,cursive'}}>$</text>
        <text x="150" y="200" fontSize="50" fill="currentColor" transform="rotate(8 150 200)" style={{fontFamily:'Caveat,cursive'}}>€</text>
        <text x="320" y="130" fontSize="46" fill="currentColor" transform="rotate(-35 320 130)" style={{fontFamily:'Caveat,cursive'}}>£</text>
        <text x="40" y="260" fontSize="54" fill="currentColor" transform="rotate(15 40 260)" style={{fontFamily:'Caveat,cursive'}}>¥</text>
        <text x="250" y="240" fontSize="42" fill="currentColor" transform="rotate(-28 250 240)" style={{fontFamily:'Caveat,cursive'}}>$</text>
        <text x="400" y="280" fontSize="60" fill="currentColor" transform="rotate(40 400 280)" style={{fontFamily:'Caveat,cursive'}}>ر.س</text>
        <text x="120" y="320" fontSize="48" fill="currentColor" transform="rotate(-8 120 320)" style={{fontFamily:'Caveat,cursive'}}>€</text>
        <text x="340" y="340" fontSize="52" fill="currentColor" transform="rotate(22 340 340)" style={{fontFamily:'Caveat,cursive'}}>£</text>
        <text x="200" y="380" fontSize="44" fill="currentColor" transform="rotate(-18 200 380)" style={{fontFamily:'Caveat,cursive'}}>¥</text>
        <text x="50" y="400" fontSize="58" fill="currentColor" transform="rotate(35 50 400)" style={{fontFamily:'Caveat,cursive'}}>$</text>
        <text x="430" y="400" fontSize="46" fill="currentColor" transform="rotate(-42 430 400)" style={{fontFamily:'Caveat,cursive'}}>€</text>
        <text x="280" y="420" fontSize="50" fill="currentColor" transform="rotate(12 280 420)" style={{fontFamily:'Caveat,cursive'}}>ر.س</text>
        <text x="160" y="440" fontSize="54" fill="currentColor" transform="rotate(-25 160 440)" style={{fontFamily:'Caveat,cursive'}}>£</text>
        <text x="380" y="220" fontSize="48" fill="currentColor" transform="rotate(5 380 220)" style={{fontFamily:'Caveat,cursive'}}>¥</text>
        <text x="90" y="180" fontSize="56" fill="currentColor" transform="rotate(-15 90 180)" style={{fontFamily:'Caveat,cursive'}}>$</text>
        <text x="220" y="290" fontSize="42" fill="currentColor" transform="rotate(28 220 290)" style={{fontFamily:'Caveat,cursive'}}>€</text>
        <text x="10" y="350" fontSize="50" fill="currentColor" transform="rotate(-32 10 350)" style={{fontFamily:'Caveat,cursive'}}>£</text>
        <text x="310" y="80" fontSize="46" fill="currentColor" transform="rotate(45 310 80)" style={{fontFamily:'Caveat,cursive'}}>ر.س</text>
        <text x="440" y="350" fontSize="52" fill="currentColor" transform="rotate(-10 440 350)" style={{fontFamily:'Caveat,cursive'}}>¥</text>
        <text x="80" y="80" fontSize="44" fill="currentColor" transform="rotate(20 80 80)" style={{fontFamily:'Caveat,cursive'}}>$</text>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#fin-pattern)" />
  </svg>
);export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [currentUser, setCurrentUser] = useState(() => { const s = localStorage.getItem('currentUser'); return s ? JSON.parse(s) : null; });
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [fontSize, setFontSize] = useState(() => parseInt(localStorage.getItem('fontSize')) || 16);
  const [uiFontSize, setUiFontSize] = useState(() => parseInt(localStorage.getItem('uiFontSize')) || 14);
  const [bgIndex, setBgIndex] = useState(() => parseInt(localStorage.getItem('bgIndex')) || 0);
  const [accentIndex, setAccentIndex] = useState(() => parseInt(localStorage.getItem('accentIndex')) || 0);
  const [fontIndex, setFontIndex] = useState(() => parseInt(localStorage.getItem('fontIndex')) || 0);
  const [currentView, setCurrentView] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectFilter, setProjectFilter] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState(quotes[0]);
  const [newNotifications, setNewNotifications] = useState(0);
  const [showAuditPanel, setShowAuditPanel] = useState(false);
  const [showArchivePanel, setShowArchivePanel] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [auditFilter, setAuditFilter] = useState('all');
  const [sessionStart, setSessionStart] = useState(null);

  const auditRef = useRef(null);
  const archiveRef = useRef(null);
  const settingsRef = useRef(null);

  const defaultUsers = [
    { id: 1, username: 'نايف', password: '@Lion12345', role: 'owner', active: true, permissions: { expenses: ['view','add','edit','delete'], tasks: ['view','add','edit','delete'], projects: ['view','add','edit','delete'], accounts: ['view','add','edit','delete'], users: ['view','add','edit','delete'] } },
    { id: 2, username: 'منوّر', password: '@Lion12345', role: 'manager', active: true, permissions: { expenses: ['view','add','edit','delete'], tasks: ['view','add','edit','delete'], projects: ['view','add','edit','delete'], accounts: ['view','add','edit','delete'], users: ['view','add','edit'] } }
  ];

  const [users, setUsers] = useState(defaultUsers);
  const [expenses, setExpenses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  const [archivedExpenses, setArchivedExpenses] = useState([]);
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [archivedAccounts, setArchivedAccounts] = useState([]);
  const [archivedProjects, setArchivedProjects] = useState([]);
  const [loginLog, setLoginLog] = useState([]);

  const [newExpense, setNewExpense] = useState({ name: '', amount: '', currency: 'ر.س', dueDate: '', type: 'شهري', reason: '', status: 'قيد الانتظار' });
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', assignedTo: '', priority: 'متوسطة', status: 'قيد الانتظار', projectId: '' });
  const [newProject, setNewProject] = useState({ name: '', description: '', client: '', location: '', phone: '', startDate: '', endDate: '', budget: '', status: 'جاري', mapUrl: '', files: [] });
  const [newAccount, setNewAccount] = useState({ name: '', description: '', loginUrl: '', username: '', password: '', subscriptionDate: '', daysRemaining: 365 });
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'member', active: true, permissions: { expenses: ['view'], tasks: ['view'], projects: ['view'], accounts: [], users: [] } });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (auditRef.current && !auditRef.current.contains(e.target)) setShowAuditPanel(false);
      if (archiveRef.current && !archiveRef.current.contains(e.target)) setShowArchivePanel(false);
      if (settingsRef.current && !settingsRef.current.contains(e.target)) setShowSettingsPanel(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => { localStorage.setItem('isLoggedIn', isLoggedIn); if (currentUser) localStorage.setItem('currentUser', JSON.stringify(currentUser)); }, [isLoggedIn, currentUser]);
  useEffect(() => { localStorage.setItem('darkMode', darkMode); }, [darkMode]);
  useEffect(() => { localStorage.setItem('fontSize', fontSize); }, [fontSize]);
  useEffect(() => { localStorage.setItem('uiFontSize', uiFontSize); }, [uiFontSize]);
  useEffect(() => { localStorage.setItem('bgIndex', bgIndex); }, [bgIndex]);
  useEffect(() => { localStorage.setItem('accentIndex', accentIndex); }, [accentIndex]);
  useEffect(() => { localStorage.setItem('fontIndex', fontIndex); }, [fontIndex]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'data', 'main'), (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setUsers(d.users || defaultUsers);
        setExpenses(d.expenses || []);
        setTasks(d.tasks || []);
        setProjects(d.projects || []);
        setAccounts(d.accounts || []);
        setAuditLog(d.auditLog || []);
        setArchivedExpenses(d.archivedExpenses || []);
        setArchivedTasks(d.archivedTasks || []);
        setArchivedAccounts(d.archivedAccounts || []);
        setArchivedProjects(d.archivedProjects || []);
        setLoginLog(d.loginLog || []);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => { setQuote(quotes[Math.floor(Math.random() * quotes.length)]); }, [currentView]);
  useEffect(() => { const t = setInterval(() => setCurrentTime(new Date()), 1000); return () => clearInterval(t); }, []);
  useEffect(() => { if (isLoggedIn && !sessionStart) setSessionStart(Date.now()); }, [isLoggedIn]);

  const save = async (d) => { 
    try { 
      await setDoc(doc(db, 'data', 'main'), { 
        users: d.users || users, expenses: d.expenses || expenses, tasks: d.tasks || tasks, 
        projects: d.projects || projects, accounts: d.accounts || accounts, auditLog: d.auditLog || auditLog, 
        archivedExpenses: d.archivedExpenses || archivedExpenses, archivedTasks: d.archivedTasks || archivedTasks, 
        archivedAccounts: d.archivedAccounts || archivedAccounts, archivedProjects: d.archivedProjects || archivedProjects,
        loginLog: d.loginLog || loginLog 
      }); 
    } catch (e) { console.error(e); } 
  };

  const addLog = (action, itemType, itemName) => { 
    const actionText = action === 'add' ? 'أضاف' : action === 'edit' ? 'عدّل' : action === 'delete' ? 'حذف' : action === 'restore' ? 'استعاد' : action === 'pay' ? 'دفع' : action;
    const desc = `${currentUser?.username || 'نظام'} قام بـ${actionText} ${itemType}: ${itemName}`;
    const l = { id: `LOG${Date.now()}`, user: currentUser?.username || 'نظام', action, itemType, itemName, description: desc, timestamp: new Date().toISOString() }; 
    const nl = [l, ...auditLog]; setAuditLog(nl); setNewNotifications(p => p + 1); return nl; 
  };

  const calcDays = (d) => Math.ceil((new Date(d) - new Date()) / 86400000);
  const getSessionMinutes = () => sessionStart ? Math.floor((Date.now() - sessionStart) / 60000) : 0;

  const hasPermission = (section, action) => {
    if (!currentUser) return false;
    if (currentUser.role === 'owner') return true;
    if (currentUser.role === 'manager' && !(section === 'users' && action === 'delete')) return true;
    return currentUser.permissions?.[section]?.includes(action) || false;
  };

  const accent = accentColors[accentIndex];
  const currentBg = backgrounds[bgIndex];
  const currentFont = fontFamilies[fontIndex];
  const bg = `bg-gradient-to-br ${darkMode ? currentBg.dark : currentBg.light}`;
  const card = darkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200';
  const inp = darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900';
  const txt = darkMode ? 'text-white' : 'text-gray-900';
  const sub = darkMode ? 'text-gray-300' : 'text-gray-600';

  const IconBtn = ({ onClick, icon: Icon, color, title, disabled }) => (
    <button onClick={onClick} disabled={disabled} className={`p-2 rounded-lg ${color || accent.color} text-white ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'} transition-all`} title={title}>
      <Icon className="w-4 h-4" />
    </button>
  );const handleLogin = (e) => {
    e.preventDefault();
    const u = e.target.username.value.trim(), p = e.target.password.value.trim();
    const user = users.find(x => x.username === u && x.password === p && x.active !== false);
    if (user) {
      setCurrentUser(user); setIsLoggedIn(true); setSessionStart(Date.now());
      const ll = [{ id: `L${Date.now()}`, user: u, timestamp: new Date().toISOString(), action: 'دخول', duration: 0 }, ...loginLog];
      setLoginLog(ll); save({ loginLog: ll });
    } else alert('خطأ في البيانات');
  };

  const logout = () => {
    const duration = getSessionMinutes();
    const ll = [{ id: `L${Date.now()}`, user: currentUser.username, timestamp: new Date().toISOString(), action: 'خروج', duration }, ...loginLog];
    setLoginLog(ll); save({ loginLog: ll }); setIsLoggedIn(false); setCurrentUser(null); setSessionStart(null);
    localStorage.removeItem('isLoggedIn'); localStorage.removeItem('currentUser');
  };

  const addExpense = () => {
    if (!newExpense.name || !newExpense.amount || !newExpense.dueDate) return alert('املأ الحقول');
    const exp = { ...newExpense, id: `E${Date.now()}`, amount: parseFloat(newExpense.amount), createdAt: new Date().toISOString(), createdBy: currentUser.username };
    const ne = [...expenses, exp]; const al = addLog('add', 'مصروف', exp.name);
    setExpenses(ne); save({ expenses: ne, auditLog: al });
    setNewExpense({ name: '', amount: '', currency: 'ر.س', dueDate: '', type: 'شهري', reason: '', status: 'قيد الانتظار' }); setShowModal(false);
  };

  const editExpense = () => {
    if (!editingItem.name || !editingItem.amount) return alert('املأ الحقول');
    const ne = expenses.map(e => e.id === editingItem.id ? { ...editingItem, updatedAt: new Date().toISOString() } : e);
    const al = addLog('edit', 'مصروف', editingItem.name);
    setExpenses(ne); save({ expenses: ne, auditLog: al }); setEditingItem(null); setShowModal(false);
  };

  const delExpense = (exp) => {
    const ne = expenses.filter(e => e.id !== exp.id);
    const na = [{ ...exp, archivedAt: new Date().toISOString(), archivedBy: currentUser.username }, ...archivedExpenses];
    const al = addLog('delete', 'مصروف', exp.name);
    setExpenses(ne); setArchivedExpenses(na); save({ expenses: ne, archivedExpenses: na, auditLog: al }); setShowModal(false);
  };

  const restoreExpense = (exp) => {
    const na = archivedExpenses.filter(e => e.id !== exp.id);
    const { archivedAt, archivedBy, ...rest } = exp; const ne = [...expenses, rest];
    const al = addLog('restore', 'مصروف', exp.name);
    setExpenses(ne); setArchivedExpenses(na); save({ expenses: ne, archivedExpenses: na, auditLog: al });
  };

  const markPaid = (id) => {
    const exp = expenses.find(e => e.id === id);
    const ne = expenses.map(e => e.id === id ? { ...e, status: 'مدفوع', paidAt: new Date().toISOString() } : e);
    const al = addLog('pay', 'مصروف', exp.name); setExpenses(ne); save({ expenses: ne, auditLog: al });
  };

  const addTask = () => {
    if (!newTask.title || !newTask.dueDate) return alert('املأ الحقول');
    const t = { ...newTask, id: `T${Date.now()}`, createdAt: new Date().toISOString(), createdBy: currentUser.username };
    const nt = [...tasks, t]; const al = addLog('add', 'مهمة', t.title);
    setTasks(nt); save({ tasks: nt, auditLog: al });
    setNewTask({ title: '', description: '', dueDate: '', assignedTo: '', priority: 'متوسطة', status: 'قيد الانتظار', projectId: '' }); setShowModal(false);
  };

  const editTask = () => {
    if (!editingItem.title) return alert('املأ الحقول');
    const nt = tasks.map(t => t.id === editingItem.id ? { ...editingItem, updatedAt: new Date().toISOString() } : t);
    const al = addLog('edit', 'مهمة', editingItem.title);
    setTasks(nt); save({ tasks: nt, auditLog: al }); setEditingItem(null); setShowModal(false);
  };

  const delTask = (t) => {
    const nt = tasks.filter(x => x.id !== t.id);
    const na = [{ ...t, archivedAt: new Date().toISOString(), archivedBy: currentUser.username }, ...archivedTasks];
    const al = addLog('delete', 'مهمة', t.title);
    setTasks(nt); setArchivedTasks(na); save({ tasks: nt, archivedTasks: na, auditLog: al }); setShowModal(false);
  };

  const restoreTask = (t) => {
    const na = archivedTasks.filter(x => x.id !== t.id);
    const { archivedAt, archivedBy, ...rest } = t; const nt = [...tasks, rest];
    const al = addLog('restore', 'مهمة', t.title);
    setTasks(nt); setArchivedTasks(na); save({ tasks: nt, archivedTasks: na, auditLog: al });
  };

  const addProject = () => {
    if (!newProject.name) return alert('أدخل اسم المشروع');
    const p = { ...newProject, id: `P${Date.now()}`, createdAt: new Date().toISOString(), createdBy: currentUser.username, cards: [] };
    const np = [...projects, p]; const al = addLog('add', 'مشروع', p.name);
    setProjects(np); save({ projects: np, auditLog: al });
    setNewProject({ name: '', description: '', client: '', location: '', phone: '', startDate: '', endDate: '', budget: '', status: 'جاري', mapUrl: '', files: [] }); setShowModal(false);
  };

  const editProject = () => {
    if (!editingItem.name) return alert('أدخل اسم المشروع');
    const np = projects.map(p => p.id === editingItem.id ? { ...editingItem, updatedAt: new Date().toISOString() } : p);
    const al = addLog('edit', 'مشروع', editingItem.name);
    setProjects(np); save({ projects: np, auditLog: al }); setEditingItem(null); setShowModal(false);
  };

  const delProject = (p) => {
    const np = projects.filter(x => x.id !== p.id);
    const na = [{ ...p, archivedAt: new Date().toISOString(), archivedBy: currentUser.username }, ...archivedProjects];
    const al = addLog('delete', 'مشروع', p.name);
    setProjects(np); setArchivedProjects(na); save({ projects: np, archivedProjects: na, auditLog: al }); setShowModal(false);
  };

  const restoreProject = (p) => {
    const na = archivedProjects.filter(x => x.id !== p.id);
    const { archivedAt, archivedBy, ...rest } = p; const np = [...projects, rest];
    const al = addLog('restore', 'مشروع', p.name);
    setProjects(np); setArchivedProjects(na); save({ projects: np, archivedProjects: na, auditLog: al });
  };

  const addAccount = () => {
    if (!newAccount.name || !newAccount.username) return alert('املأ الحقول');
    const a = { ...newAccount, id: `A${Date.now()}`, createdAt: new Date().toISOString(), createdBy: currentUser.username };
    const na = [...accounts, a]; const al = addLog('add', 'حساب', a.name);
    setAccounts(na); save({ accounts: na, auditLog: al });
    setNewAccount({ name: '', description: '', loginUrl: '', username: '', password: '', subscriptionDate: '', daysRemaining: 365 }); setShowModal(false);
  };

  const editAccount = () => {
    if (!editingItem.name) return alert('املأ الحقول');
    const na = accounts.map(a => a.id === editingItem.id ? { ...editingItem, updatedAt: new Date().toISOString() } : a);
    const al = addLog('edit', 'حساب', editingItem.name);
    setAccounts(na); save({ accounts: na, auditLog: al }); setEditingItem(null); setShowModal(false);
  };

  const delAccount = (a) => {
    const na = accounts.filter(x => x.id !== a.id);
    const nar = [{ ...a, archivedAt: new Date().toISOString(), archivedBy: currentUser.username }, ...archivedAccounts];
    const al = addLog('delete', 'حساب', a.name);
    setAccounts(na); setArchivedAccounts(nar); save({ accounts: na, archivedAccounts: nar, auditLog: al }); setShowModal(false);
  };

  const restoreAccount = (a) => {
    const nar = archivedAccounts.filter(x => x.id !== a.id);
    const { archivedAt, archivedBy, ...rest } = a; const na = [...accounts, rest];
    const al = addLog('restore', 'حساب', a.name);
    setAccounts(na); setArchivedAccounts(nar); save({ accounts: na, archivedAccounts: nar, auditLog: al });
  };

  const addUser = () => {
    if (!newUser.username || !newUser.password) return alert('املأ الحقول');
    if (users.find(u => u.username === newUser.username)) return alert('موجود');
    const u = { ...newUser, id: Date.now(), createdAt: new Date().toISOString() };
    const nu = [...users, u]; const al = addLog('add', 'مستخدم', u.username);
    setUsers(nu); save({ users: nu, auditLog: al });
    setNewUser({ username: '', password: '', role: 'member', active: true, permissions: { expenses: ['view'], tasks: ['view'], projects: ['view'], accounts: [], users: [] } }); setShowModal(false);
  };

  const editUser = () => {
    if (!editingItem.username) return alert('املأ الحقول');
    const nu = users.map(u => u.id === editingItem.id ? { ...editingItem, updatedAt: new Date().toISOString() } : u);
    const al = addLog('edit', 'مستخدم', editingItem.username);
    setUsers(nu); save({ users: nu, auditLog: al }); setEditingItem(null); setShowModal(false);
  };

  const delUser = (u) => {
    if (u.role === 'owner') return alert('لا يمكن حذف المالك');
    if (u.username === currentUser.username) return alert('لا يمكن حذف نفسك');
    const nu = users.filter(x => x.id !== u.id); const al = addLog('delete', 'مستخدم', u.username);
    setUsers(nu); save({ users: nu, auditLog: al }); setShowModal(false);
  };

  const totalArchived = (archivedExpenses?.length || 0) + (archivedTasks?.length || 0) + (archivedAccounts?.length || 0) + (archivedProjects?.length || 0);

  const filteredAuditLog = auditFilter === 'all' 
    ? [...auditLog, ...loginLog.map(l => ({ ...l, isLogin: true }))].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    : auditFilter === 'login' 
    ? loginLog 
    : auditLog;

  const filteredTasks = projectFilter ? tasks.filter(t => t.projectId === projectFilter) : tasks;

  if (loading) return <div className={`min-h-screen ${bg} flex items-center justify-center`} dir="rtl"><Loader className="w-16 h-16 text-blue-500 animate-spin" /></div>;if (!isLoggedIn) return (
    <div className={`min-h-screen ${bg} flex items-center justify-center p-4 relative`} style={{ fontFamily: currentFont.value }} dir="rtl">
      <FinancialPattern />
      <div className={`${card} p-8 rounded-2xl shadow-2xl w-full max-w-md border relative z-10`}>
        <div className="text-center mb-8">
          <div className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-br ${accent.gradient} rounded-2xl flex items-center justify-center text-white text-2xl font-bold`}>RKZ</div>
          <h1 className={`text-2xl font-bold ${txt}`}>نظام الإدارة المالية</h1>
          <p className={sub}>ركائز الأولى للتعمير</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="text" name="username" placeholder="اسم المستخدم" className={`w-full p-3 border rounded-xl ${inp}`} required />
          <input type="password" name="password" placeholder="كلمة المرور" className={`w-full p-3 border rounded-xl ${inp}`} required />
          <button className={`w-full bg-gradient-to-r ${accent.gradient} text-white p-3 rounded-xl font-bold`}>دخول</button>
        </form>
        <div className="text-center mt-6"><button onClick={() => setShowVersions(true)} className={`text-xs ${sub} hover:${accent.text}`}>v{APP_VERSION}</button></div>
      </div>
      {showVersions && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowVersions(false)}>
          <div className={`${card} p-6 rounded-2xl max-w-md w-full border`} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4"><h3 className={`text-xl font-bold ${txt}`}>سجل النسخ</h3><button onClick={() => setShowVersions(false)} className={sub}><X className="w-5 h-5" /></button></div>
            <div className="space-y-4 max-h-96 overflow-y-auto">{versionHistory.map((v, i) => (<div key={v.version} className={`p-4 rounded-xl ${i === 0 ? `${accent.color}/20 border ${accent.border}` : darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}><div className="flex justify-between items-center mb-2"><span className={`font-bold ${txt}`}>v{v.version}</span><span className={`text-xs ${sub}`}>{v.date}</span></div><ul className={`text-sm ${sub} space-y-1`}>{v.changes.map((c, j) => <li key={j}>• {c}</li>)}</ul></div>))}</div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={`min-h-screen ${bg} relative`} style={{ fontSize: `${fontSize}px`, fontFamily: currentFont.value }} dir="rtl">
      <FinancialPattern />
      <div className={`${card} border-b px-4 py-3 flex flex-wrap items-center justify-between sticky top-0 z-50 gap-3 relative`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 bg-gradient-to-br ${accent.gradient} rounded-xl flex items-center justify-center text-white font-bold text-sm`}>RKZ</div>
          <div>
            <h1 className={`font-bold ${txt}`} style={{ fontSize: `${uiFontSize + 4}px` }}>نظام الإدارة المالية</h1>
            <p className={sub} style={{ fontSize: `${uiFontSize - 2}px` }}>ركائز الأولى للتعمير</p>
            <p className={sub} style={{ fontSize: `${uiFontSize - 2}px` }}>{currentTime.toLocaleDateString('ar-SA')} {currentTime.toLocaleTimeString('ar-SA')} | {quote}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-sm ${txt}`}>{currentUser.username}</span>
          <span className={`text-xs px-2 py-0.5 rounded ${currentUser.role === 'owner' ? 'bg-amber-500' : currentUser.role === 'manager' ? 'bg-blue-500' : 'bg-gray-500'} text-white`}>{currentUser.role === 'owner' ? 'مالك' : currentUser.role === 'manager' ? 'مدير' : 'عضو'}</span>
          <span className={`text-xs ${sub}`}>({getSessionMinutes()} د)</span>
          
          <div className="relative" ref={auditRef}>
            <button onClick={() => { setShowAuditPanel(!showAuditPanel); setShowArchivePanel(false); setShowSettingsPanel(false); setNewNotifications(0); }} className={`p-2 rounded-lg relative ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              <Clock className={`w-5 h-5 ${txt}`} />
              {newNotifications > 0 && <span className={`absolute -top-1 -right-1 w-4 h-4 ${accent.color} text-white text-xs rounded-full flex items-center justify-center`}>{newNotifications}</span>}
            </button>
            {showAuditPanel && (
              <div className={`absolute left-0 top-12 w-80 ${card} rounded-xl shadow-2xl border z-50 max-h-96 overflow-y-auto`}>
                <div className={`p-3 border-b flex justify-between items-center ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h3 className={`font-bold ${txt}`}>آخر العمليات</h3>
                  <button onClick={() => { setCurrentView('audit'); setShowAuditPanel(false); }} className={accent.text} style={{ fontSize: `${uiFontSize - 2}px` }}>عرض الكل</button>
                </div>
                <div className="p-2">{auditLog.slice(0, 8).map(l => (
                  <div key={l.id} className={`p-2 rounded-lg mb-1 cursor-pointer ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`} onClick={() => { setCurrentView('archive'); setShowAuditPanel(false); }}>
                    <p className={`text-sm ${txt}`}>{l.description}</p>
                    <span className={`text-xs ${sub}`}>{new Date(l.timestamp).toLocaleString('ar-SA')}</span>
                  </div>
                ))}</div>
              </div>
            )}
          </div>

          <div className="relative" ref={archiveRef}>
            <button onClick={() => { setShowArchivePanel(!showArchivePanel); setShowAuditPanel(false); setShowSettingsPanel(false); }} className={`p-2 rounded-lg relative ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              <Archive className={`w-5 h-5 ${txt}`} />
              {totalArchived > 0 && <span className={`absolute -top-1 -right-1 w-4 h-4 ${accent.color} text-white text-xs rounded-full flex items-center justify-center`}>{totalArchived}</span>}
            </button>
            {showArchivePanel && (
              <div className={`absolute left-0 top-12 w-72 ${card} rounded-xl shadow-2xl border z-50`}>
                <div className={`p-3 border-b flex justify-between ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}><h3 className={`font-bold ${txt}`}>الأرشيف</h3><button onClick={() => { setCurrentView('archive'); setShowArchivePanel(false); }} className={accent.text} style={{ fontSize: `${uiFontSize - 2}px` }}>عرض الكل</button></div>
                <div className="p-2">
                  {[{ label: 'المصروفات', count: archivedExpenses?.length || 0 },{ label: 'المهام', count: archivedTasks?.length || 0 },{ label: 'المشاريع', count: archivedProjects?.length || 0 },{ label: 'الحسابات', count: archivedAccounts?.length || 0 }].map(item => (
                    <button key={item.label} onClick={() => { setCurrentView('archive'); setShowArchivePanel(false); }} className={`w-full p-2 rounded-lg mb-1 flex justify-between items-center ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                      <span className={txt}>{item.label}</span><span className={`text-xs px-2 py-0.5 rounded-full ${item.count > 0 ? accent.color + ' text-white' : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'}`}>{item.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={settingsRef}>
            <button onClick={() => { setShowSettingsPanel(!showSettingsPanel); setShowAuditPanel(false); setShowArchivePanel(false); }} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}><Settings className={`w-5 h-5 ${txt}`} /></button>
            {showSettingsPanel && (
              <div className={`absolute left-0 top-12 w-72 ${card} rounded-xl shadow-2xl border z-50 p-4`}>
                <h4 className={`font-bold mb-3 ${txt}`}>الإعدادات</h4>
                
                <div className="mb-4">
                  <p className={`text-xs mb-2 ${sub}`}>الخلفية</p>
                  <div className="grid grid-cols-5 gap-2">{backgrounds.map((b, i) => (<button key={b.id} onClick={() => setBgIndex(i)} className={`w-8 h-8 rounded-lg bg-gradient-to-br ${b.dark} ${bgIndex === i ? `ring-2 ring-offset-2 ${accent.border}` : ''}`} title={b.name} />))}</div>
                </div>

                <div className="mb-4">
                  <p className={`text-xs mb-2 ${sub}`}>اللون الرئيسي</p>
                  <div className="grid grid-cols-4 gap-2">{accentColors.map((c, i) => (<button key={c.id} onClick={() => setAccentIndex(i)} className={`w-8 h-8 rounded-lg ${c.color} ${accentIndex === i ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`} title={c.name} />))}</div>
                </div>

                <div className="mb-4">
                  <p className={`text-xs mb-2 ${sub}`}>نوع الخط</p>
                  <select value={fontIndex} onChange={e => setFontIndex(parseInt(e.target.value))} className={`w-full p-2 rounded-lg text-sm ${inp}`}>
                    {fontFamilies.map((f, i) => <option key={f.id} value={i}>{f.name}</option>)}
                  </select>
                </div>

                <div className="mb-4">
                  <p className={`text-xs mb-2 ${sub}`}>حجم النص (A+)</p>
                  <div className="flex gap-2 items-center">
                    <button onClick={() => setFontSize(f => Math.max(12, f - 2))} className={`px-3 py-1 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} ${txt}`}>-</button>
                    <span className={txt}>{fontSize}</span>
                    <button onClick={() => setFontSize(f => Math.min(24, f + 2))} className={`px-3 py-1 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} ${txt}`}>+</button>
                  </div>
                </div>

                <div className="mb-4">
                  <p className={`text-xs mb-2 ${sub}`}>حجم الواجهة</p>
                  <div className="flex gap-2 items-center">
                    <button onClick={() => setUiFontSize(f => Math.max(10, f - 2))} className={`px-3 py-1 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} ${txt}`}>-</button>
                    <span className={txt}>{uiFontSize}</span>
                    <button onClick={() => setUiFontSize(f => Math.min(20, f + 2))} className={`px-3 py-1 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} ${txt}`}>+</button>
                  </div>
                </div>

                <button onClick={() => setDarkMode(!darkMode)} className={`w-full p-2 rounded-lg flex items-center justify-center gap-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} ${txt}`}>
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {darkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
                </button>
              </div>
            )}
          </div>

          <button onClick={logout} className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"><Power className="w-5 h-5" /></button>
        </div>
      </div><div className="flex flex-col md:flex-row">
        <div className={`w-full md:w-48 ${card} border-b md:border-l p-3`}>
          <nav className="flex md:flex-col gap-1 flex-wrap">
            {[{ id: 'dashboard', icon: Activity, label: 'الرئيسية' },{ id: 'expenses', icon: Calendar, label: 'المصروفات', perm: 'expenses' },{ id: 'tasks', icon: CheckSquare, label: 'المهام', perm: 'tasks' },{ id: 'projects', icon: FolderOpen, label: 'المشاريع', perm: 'projects' },{ id: 'accounts', icon: Users, label: 'الحسابات', perm: 'accounts' },{ id: 'users', icon: UserCog, label: 'المستخدمين', perm: 'users' },{ id: 'archive', icon: Archive, label: 'الأرشيف' },{ id: 'audit', icon: History, label: 'السجل' }].map(item => {
              if (item.perm && !hasPermission(item.perm, 'view')) return null;
              return (
                <button key={item.id} onClick={() => { setCurrentView(item.id); setSelectedProject(null); setProjectFilter(null); }} className={`flex items-center gap-2 p-3 rounded-xl transition-all ${currentView === item.id ? `bg-gradient-to-r ${accent.gradient} text-white` : darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`} style={{ fontSize: `${uiFontSize}px` }}>
                  <item.icon className="w-5 h-5" /><span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex-1 p-4 md:p-6 relative z-10">
          {currentView === 'dashboard' && (
            <div>
              <h2 className={`text-2xl font-bold mb-6 ${txt}`}>لوحة التحكم</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[{ label: 'المصروفات', value: expenses.length, sub: `${expenses.filter(e => e.status !== 'مدفوع').length} قيد الانتظار`, gradient: accent.gradient, view: 'expenses' },{ label: 'المهام', value: tasks.length, sub: `${tasks.filter(t => t.priority === 'عالية').length} عالية`, gradient: 'from-green-500 to-green-600', view: 'tasks' },{ label: 'المشاريع', value: projects.length, sub: `${projects.filter(p => p.status === 'جاري').length} جاري`, gradient: 'from-purple-500 to-purple-600', view: 'projects' },{ label: 'الحسابات', value: accounts.length, sub: 'حساب', gradient: 'from-orange-500 to-orange-600', view: 'accounts' }].map((k, i) => (
                  <button key={i} onClick={() => setCurrentView(k.view)} className={`bg-gradient-to-br ${k.gradient} p-4 rounded-xl text-white text-right hover:opacity-90 transition-all`}>
                    <p className="text-sm opacity-90">{k.label}</p><p className="text-3xl font-bold">{k.value}</p><p className="text-xs opacity-75">{k.sub}</p>
                  </button>
                ))}
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className={`${card} p-4 rounded-xl border`}>
                  <div className="flex justify-between mb-4"><h3 className={`font-bold ${txt}`}>المصروفات القادمة</h3><button onClick={() => setCurrentView('expenses')} className={accent.text} style={{ fontSize: `${uiFontSize}px` }}>الكل</button></div>
                  {expenses.filter(e => e.status !== 'مدفوع').length === 0 ? <p className={`text-center py-8 ${sub}`}>لا توجد مصروفات</p> : expenses.filter(e => e.status !== 'مدفوع').sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 3).map(e => { const d = calcDays(e.dueDate); return <div key={e.id} className={`p-3 rounded-lg mb-2 ${d < 0 ? 'bg-red-500' : d < 7 ? 'bg-orange-500' : 'bg-green-500'} text-white`}><div className="flex justify-between"><span>{e.name}</span><span className="font-bold">{e.amount} ر.س</span></div><div className="text-xs mt-1">{d < 0 ? `متأخر ${Math.abs(d)} يوم` : `${d} يوم`}</div></div>; })}
                </div>
                <div className={`${card} p-4 rounded-xl border`}>
                  <div className="flex justify-between mb-4"><h3 className={`font-bold ${txt}`}>المشاريع النشطة</h3><button onClick={() => setCurrentView('projects')} className={accent.text} style={{ fontSize: `${uiFontSize}px` }}>الكل</button></div>
                  {projects.filter(p => p.status === 'جاري').length === 0 ? <p className={`text-center py-8 ${sub}`}>لا توجد مشاريع</p> : projects.filter(p => p.status === 'جاري').slice(0, 3).map(p => (<div key={p.id} className={`p-3 rounded-lg mb-2 border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}><div className="flex justify-between"><span className={txt}>{p.name}</span><span className={`${accent.color} text-white text-xs px-2 py-0.5 rounded`}>{p.status}</span></div><p className={`text-xs ${sub}`}>{p.client || 'بدون عميل'}</p></div>))}
                </div>
              </div>
            </div>
          )}

          {currentView === 'expenses' && (
            <div>
              <div className="flex justify-between mb-6 flex-wrap gap-2">
                <h2 className={`text-2xl font-bold ${txt}`}>المصروفات</h2>
                {hasPermission('expenses', 'add') && <button onClick={() => { setModalType('addExp'); setShowModal(true); }} className={`flex items-center gap-2 bg-gradient-to-r ${accent.gradient} text-white px-4 py-2 rounded-xl`}><Plus className="w-5 h-5" />إضافة</button>}
              </div>
              {expenses.length === 0 ? <div className={`${card} p-12 rounded-xl border text-center`}><Calendar className={`w-16 h-16 mx-auto mb-4 ${sub}`} /><p className={sub}>لا توجد مصروفات</p></div> : (
                <div className="space-y-3">{expenses.map(e => { const d = calcDays(e.dueDate); return (
                  <div key={e.id} className={`${card} p-4 rounded-xl border`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1"><h3 className={`font-bold ${txt}`}>{e.name}</h3><span className={`text-xs px-2 py-0.5 rounded ${accent.color} text-white`}>{e.type}</span>{e.status === 'مدفوع' && <span className="text-xs px-2 py-0.5 rounded bg-green-500 text-white">مدفوع</span>}</div>
                        <p className={`text-2xl font-bold ${txt}`}>{e.amount} {e.currency}</p><p className={`text-sm ${sub}`}>{e.reason}</p>
                        <div className="flex gap-3 mt-2 flex-wrap">
                          <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} ${txt}`}>تاريخ الاستحقاق: {e.dueDate}</span>
                          <span className={`text-xs px-2 py-1 rounded ${d < 0 ? 'bg-red-500 text-white' : d < 7 ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'}`}>{d < 0 ? `متأخر ${Math.abs(d)} يوم` : `متبقي ${d} يوم`}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {e.status !== 'مدفوع' && hasPermission('expenses', 'edit') && <IconBtn onClick={() => markPaid(e.id)} icon={CheckSquare} color="bg-green-600" title="دفع" />}
                        {hasPermission('expenses', 'edit') && <IconBtn onClick={() => { setEditingItem({ ...e }); setModalType('editExp'); setShowModal(true); }} icon={Pencil} title="تعديل" />}
                        {hasPermission('expenses', 'delete') && <IconBtn onClick={() => { setSelectedItem(e); setModalType('delExp'); setShowModal(true); }} icon={Trash2} color="bg-red-600" title="حذف" />}
                      </div>
                    </div>
                  </div>
                ); })}</div>
              )}
            </div>
          )}

          {currentView === 'tasks' && (
            <div>
              <div className="flex justify-between mb-4 flex-wrap gap-2">
                <h2 className={`text-2xl font-bold ${txt}`}>المهام</h2>
                {hasPermission('tasks', 'add') && <button onClick={() => { setModalType('addTask'); setShowModal(true); }} className={`flex items-center gap-2 bg-gradient-to-r ${accent.gradient} text-white px-4 py-2 rounded-xl`}><Plus className="w-5 h-5" />إضافة مهمة</button>}
              </div>
              
              {projects.length > 0 && (
                <div className="flex gap-2 mb-4 flex-wrap">
                  <button onClick={() => setProjectFilter(null)} className={`px-3 py-2 rounded-lg text-sm transition-all ${!projectFilter ? `${accent.color} text-white` : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>الكل</button>
                  {projects.map(p => (
                    <button key={p.id} onClick={() => setProjectFilter(projectFilter === p.id ? null : p.id)} className={`px-3 py-2 rounded-lg text-sm transition-all ${projectFilter === p.id ? `${accent.color} text-white` : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>{p.name} ({tasks.filter(t => t.projectId === p.id).length})</button>
                  ))}
                </div>
              )}

              {filteredTasks.length === 0 ? <div className={`${card} p-12 rounded-xl border text-center`}><CheckSquare className={`w-16 h-16 mx-auto mb-4 ${sub}`} /><p className={sub}>لا توجد مهام</p></div> : (
                <div className="space-y-3">{filteredTasks.map(t => { const d = calcDays(t.dueDate); const project = projects.find(p => p.id === t.projectId); return (
                  <div key={t.id} className={`${card} p-4 rounded-xl border`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className={`font-bold ${txt}`}>{t.title}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded ${t.priority === 'عالية' ? 'bg-red-500' : t.priority === 'متوسطة' ? 'bg-yellow-500' : 'bg-green-500'} text-white`}>{t.priority}</span>
                          {project && <span className={`text-xs px-2 py-0.5 rounded ${accent.color} text-white`}>{project.name}</span>}
                        </div>
                        <p className={`text-sm ${sub}`}>{t.description}</p>
                        <div className="flex gap-3 mt-2 flex-wrap">
                          <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} ${txt}`}>المسؤول: {t.assignedTo || '-'}</span>
                          <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} ${txt}`}>تاريخ التسليم: {t.dueDate}</span>
                          <span className={`text-xs px-2 py-1 rounded ${d < 0 ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>{d < 0 ? `متأخر ${Math.abs(d)} يوم` : `${d} يوم`}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {hasPermission('tasks', 'edit') && <IconBtn onClick={() => { setEditingItem({ ...t }); setModalType('editTask'); setShowModal(true); }} icon={Pencil} title="تعديل" />}
                        {hasPermission('tasks', 'delete') && <IconBtn onClick={() => { setSelectedItem(t); setModalType('delTask'); setShowModal(true); }} icon={Trash2} color="bg-red-600" title="حذف" />}
                      </div>
                    </div>
                  </div>
                ); })}</div>
              )}
            </div>
          )}

          {currentView === 'projects' && !selectedProject && (
            <div>
              <div className="flex justify-between mb-6 flex-wrap gap-2">
                <h2 className={`text-2xl font-bold ${txt}`}>المشاريع</h2>
                {hasPermission('projects', 'add') && <button onClick={() => { setModalType('addProject'); setShowModal(true); }} className={`flex items-center gap-2 bg-gradient-to-r ${accent.gradient} text-white px-4 py-2 rounded-xl`}><Plus className="w-5 h-5" />إضافة مشروع</button>}
              </div>
              {projects.length === 0 ? <div className={`${card} p-12 rounded-xl border text-center`}><FolderOpen className={`w-16 h-16 mx-auto mb-4 ${sub}`} /><p className={sub}>لا توجد مشاريع</p></div> : (
                <div className="grid md:grid-cols-2 gap-4">{projects.map(p => { const projectTasks = tasks.filter(t => t.projectId === p.id); return (
                  <div key={p.id} className={`${card} p-4 rounded-xl border cursor-pointer hover:shadow-lg transition-all`} onClick={() => setSelectedProject(p)}>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className={`font-bold text-lg ${txt}`}>{p.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${p.status === 'جاري' ? accent.color : p.status === 'مكتمل' ? 'bg-green-500' : 'bg-gray-500'} text-white`}>{p.status}</span>
                    </div>
                    <p className={`text-sm ${sub} mb-3 line-clamp-2`}>{p.description || 'بدون وصف'}</p>
                    <div className={`grid grid-cols-2 gap-2 text-xs ${sub}`}>
                      {p.client && <div className="flex items-center gap-1"><User className="w-3 h-3" />{p.client}</div>}
                      {p.phone && <div className="flex items-center gap-1"><Phone className="w-3 h-3" />{p.phone}</div>}
                      {p.location && <div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{p.location}</div>}
                      {p.budget && <div className="flex items-center gap-1">💰 {p.budget} ر.س</div>}
                      <div className="flex items-center gap-1"><CheckSquare className="w-3 h-3" />{projectTasks.length} مهمة</div>
                      <div className="flex items-center gap-1"><FileText className="w-3 h-3" />{p.files?.length || 0} ملف</div>
                    </div>
                    <div className={`flex gap-2 mt-3 pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <span className={`text-xs ${sub}`}>من: {p.startDate || '-'}</span>
                      <span className={`text-xs ${sub}`}>إلى: {p.endDate || '-'}</span>
                    </div>
                  </div>
                ); })}</div>
              )}
            </div>
          )}

          {currentView === 'projects' && selectedProject && (
            <div>
              <button onClick={() => setSelectedProject(null)} className={`flex items-center gap-2 mb-4 ${accent.text}`}><ChevronLeft className="w-5 h-5" />العودة للمشاريع</button>
              <div className={`${card} p-6 rounded-xl border mb-6`}>
                <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
                  <div>
                    <h2 className={`text-2xl font-bold ${txt}`}>{selectedProject.name}</h2>
                    <span className={`text-xs px-2 py-1 rounded ${selectedProject.status === 'جاري' ? accent.color : selectedProject.status === 'مكتمل' ? 'bg-green-500' : 'bg-gray-500'} text-white`}>{selectedProject.status}</span>
                  </div>
                  <div className="flex gap-2">
                    {hasPermission('projects', 'edit') && <IconBtn onClick={() => { setEditingItem({ ...selectedProject }); setModalType('editProject'); setShowModal(true); }} icon={Pencil} title="تعديل" />}
                    {hasPermission('projects', 'delete') && <IconBtn onClick={() => { setSelectedItem(selectedProject); setModalType('delProject'); setShowModal(true); }} icon={Trash2} color="bg-red-600" title="حذف" />}
                  </div>
                </div>
                <p className={`${sub} mb-4`}>{selectedProject.description}</p>
                <div className={`grid md:grid-cols-3 gap-4 text-sm ${sub}`}>
                  {selectedProject.client && <div className="flex items-center gap-2"><User className="w-4 h-4" /><span>العميل: {selectedProject.client}</span></div>}
                  {selectedProject.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4" /><span>الهاتف: {selectedProject.phone}</span></div>}
                  {selectedProject.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /><span>الموقع: {selectedProject.location}</span></div>}
                  {selectedProject.budget && <div className="flex items-center gap-2">💰<span>الميزانية: {selectedProject.budget} ر.س</span></div>}
                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span>من: {selectedProject.startDate || '-'} إلى: {selectedProject.endDate || '-'}</span></div>
                </div>
                {selectedProject.mapUrl && (
                  <div className="mt-4">
                    <a href={selectedProject.mapUrl} target="_blank" rel="noreferrer" className={`flex items-center gap-2 ${accent.text}`}><MapPin className="w-4 h-4" />فتح في خرائط قوقل</a>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`font-bold ${txt}`}>مهام المشروع ({tasks.filter(t => t.projectId === selectedProject.id).length})</h3>
                  {hasPermission('tasks', 'add') && <button onClick={() => { setNewTask({ ...newTask, projectId: selectedProject.id }); setModalType('addTask'); setShowModal(true); }} className={`flex items-center gap-2 ${accent.text}`}><Plus className="w-4 h-4" />إضافة مهمة</button>}
                </div>
                {tasks.filter(t => t.projectId === selectedProject.id).length === 0 ? <p className={`${sub} text-center py-4`}>لا توجد مهام</p> : (
                  <div className="space-y-2">{tasks.filter(t => t.projectId === selectedProject.id).map(t => (
                    <div key={t.id} className={`${card} p-3 rounded-lg border flex justify-between items-center`}>
                      <div><span className={txt}>{t.title}</span><span className={`text-xs mr-2 px-2 py-0.5 rounded ${t.priority === 'عالية' ? 'bg-red-500' : 'bg-green-500'} text-white`}>{t.priority}</span></div>
                      <span className={`text-xs ${sub}`}>{t.dueDate}</span>
                    </div>
                  ))}</div>
                )}
              </div>
            </div>
          )}
