import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, CheckSquare, Users, Moon, Sun, Eye, EyeOff, Plus, Archive, Clock, AlertCircle, Activity, RefreshCw, History } from 'lucide-react';

const AccountCard = ({ account, cardClass }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className={`${cardClass} p-6 rounded-lg border`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold mb-1">{account.name}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{account.description}</p>
        </div>
        <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{account.id}</span>
      </div>
      <div className="space-y-3">
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400">رابط الدخول:</label>
          <a href={account.loginUrl} target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:underline text-sm">{account.loginUrl}</a>
        </div>
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400">اسم المستخدم:</label>
          <p className="font-mono text-sm">{account.username}</p>
        </div>
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400">كلمة المرور:</label>
          <div className="flex items-center gap-2">
            <p className="font-mono flex-1 text-sm">{showPassword ? account.password : '••••••••••••'}</p>
            <button onClick={() => setShowPassword(!showPassword)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between text-sm">
            <span>تاريخ الاشتراك: {account.subscriptionDate}</span>
            <span className="font-bold text-green-600">{account.daysRemaining} يوم متبقي</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function FinancialManagementSystem() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [currentView, setCurrentView] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskHistory, setShowTaskHistory] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [users] = useState([
    { id: 1, username: 'نايف', password: '123456', role: 'owner' },
    { id: 2, username: 'منوّر', password: '123456', role: 'owner' }
  ]);
  
  const [expenses, setExpenses] = useState([
    { id: 'EXP001', name: 'استضافة الموقع', amount: 500, currency: 'ريال', dueDate: '2025-12-15', type: 'شهري', reason: 'استضافة موقع الشركة', status: 'قيد الانتظار' },
    { id: 'EXP002', name: 'اشتراك Adobe', amount: 200, currency: 'ريال', dueDate: '2025-12-20', type: 'شهري', reason: 'برامج التصميم', status: 'قيد الانتظار' }
  ]);
  
  const [tasks, setTasks] = useState([
    { id: 'TASK001', title: 'مراجعة التقارير', description: 'مراجعة جميع التقارير', type: 'شهري', dueDate: '2025-12-10', assignedTo: 'نايف', priority: 'عالية', status: 'قيد التنفيذ', updates: [] }
  ]);
  
  const [accounts, setAccounts] = useState([
    { id: 'ACC001', name: 'حساب AWS', description: 'استضافة السحابية', loginUrl: 'https://aws.amazon.com', username: 'admin@company.com', password: 'pass123', subscriptionDate: '2025-01-01', daysRemaining: 387 }
  ]);
  
  const [auditLog, setAuditLog] = useState([]);
  const [archivedExpenses, setArchivedExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ name: '', amount: '', currency: 'ريال', dueDate: '', type: 'شهري', reason: '', status: 'قيد الانتظار' });
  const [newTask, setNewTask] = useState({ title: '', description: '', type: 'شهري', dueDate: '', assignedTo: 'نايف', priority: 'متوسطة', status: 'قيد الانتظار' });
  const [newAccount, setNewAccount] = useState({ name: '', description: '', loginUrl: '', username: '', password: '', subscriptionDate: '', daysRemaining: 365 });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const addAuditLog = (action, description) => {
    setAuditLog(prev => [{ id: `LOG${Date.now()}`, user: currentUser?.username || 'نظام', action, description, timestamp: new Date().toISOString() }, ...prev]);
  };

  const calculateDaysRemaining = (dueDate) => {
    return Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
  };

  const getColorByDays = (days) => {
    if (days < 0) return 'bg-red-600 text-white';
    if (days < 7) return 'bg-red-500 text-white';
    if (days < 15) return 'bg-orange-500 text-white';
    return 'bg-green-500 text-white';
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const username = e.target.username.value.trim();
    const password = e.target.password.value.trim();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      addAuditLog('تسجيل دخول', `${username} قام بتسجيل الدخول`);
    } else {
      alert('خطأ في اسم المستخدم أو كلمة المرور');
    }
  };

  const archiveExpense = (expense) => {
    setExpenses(prev => prev.filter(e => e.id !== expense.id));
    setArchivedExpenses(prev => [...prev, { ...expense, archivedAt: new Date().toISOString(), archivedBy: currentUser.username }]);
    addAuditLog('أرشفة', `أرشفة: ${expense.name}`);
    setShowModal(false);
  };

  const markAsPaid = (id) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, status: 'مدفوع' } : e));
    addAuditLog('تحديث', `تم تعليم ${id} كمدفوع`);
  };

  const updateTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    const update = { timestamp: new Date().toISOString(), user: currentUser.username, note: 'تم التحديث' };
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, updates: [...t.updates, update] } : t));
    addAuditLog('تحديث مهمة', `تحديث: ${task.title}`);
  };

  const addExpense = () => {
    if (!newExpense.name || !newExpense.amount || !newExpense.dueDate) {
      alert('املأ الحقول المطلوبة');
      return;
    }
    const expense = { ...newExpense, id: `EXP${String(expenses.length + 1).padStart(3, '0')}`, amount: parseFloat(newExpense.amount) };
    setExpenses(prev => [...prev, expense]);
    addAuditLog('إضافة', `إضافة مصروف: ${expense.name}`);
    setNewExpense({ name: '', amount: '', currency: 'ريال', dueDate: '', type: 'شهري', reason: '', status: 'قيد الانتظار' });
    setShowModal(false);
  };

  const addTask = () => {
    if (!newTask.title || !newTask.dueDate) {
      alert('املأ الحقول المطلوبة');
      return;
    }
    const task = { ...newTask, id: `TASK${String(tasks.length + 1).padStart(3, '0')}`, updates: [] };
    setTasks(prev => [...prev, task]);
    addAuditLog('إضافة', `إضافة مهمة: ${task.title}`);
    setNewTask({ title: '', description: '', type: 'شهري', dueDate: '', assignedTo: 'نايف', priority: 'متوسطة', status: 'قيد الانتظار' });
    setShowModal(false);
  };

  const addAccount = () => {
    if (!newAccount.name || !newAccount.username) {
      alert('املأ الحقول المطلوبة');
      return;
    }
    const account = { ...newAccount, id: `ACC${String(accounts.length + 1).padStart(3, '0')}` };
    setAccounts(prev => [...prev, account]);
    addAuditLog('إضافة', `إضافة حساب: ${account.name}`);
    setNewAccount({ name: '', description: '', loginUrl: '', username: '', password: '', subscriptionDate: '', daysRemaining: 365 });
    setShowModal(false);
  };

  const kpis = {
    todayExpenses: expenses.filter(e => new Date(e.dueDate).toDateString() === new Date().toDateString()).reduce((sum, e) => sum + e.amount, 0),
    monthExpenses: expenses.filter(e => new Date(e.dueDate).getMonth() === new Date().getMonth()).reduce((sum, e) => sum + e.amount, 0),
    overdueTasks: tasks.filter(t => calculateDaysRemaining(t.dueDate) < 0).length
  };

  const fontSizes = { small: 'text-sm', medium: 'text-base', large: 'text-lg' };
  const bgClass = darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900';
  const cardClass = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const inputClass = darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300';

  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${bgClass}`} dir="rtl">
        <div className={`${cardClass} p-8 rounded-lg shadow-xl w-full max-w-md border`}>
          <div className="text-center mb-8">
            <DollarSign className="w-16 h-16 mx-auto mb-4 text-blue-500" />
            <h1 className="text-3xl font-bold">نظام الإدارة المالية</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">اسم المستخدم</label>
              <input type="text" name="username" className={`w-full p-3 border rounded-lg ${inputClass}`} required />
            </div>
            <div>
              <label className="block mb-2 font-medium">كلمة المرور</label>
              <input type="password" name="password" className={`w-full p-3 border rounded-lg ${inputClass}`} required />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700">دخول</button>
          </form>
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="font-bold mb-2 text-center text-sm">للتجربة:</p>
            <button onClick={() => { setCurrentUser(users[0]); setIsLoggedIn(true); }} className="w-full bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 mb-2 text-sm">دخول كـ نايف</button>
            <button onClick={() => { setCurrentUser(users[1]); setIsLoggedIn(true); }} className="w-full bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 text-sm">دخول كـ منوّر</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgClass} ${fontSizes[fontSize]}`} dir="rtl">
      <div className={`${cardClass} border-b px-6 py-4 flex flex-wrap items-center justify-between sticky top-0 z-50 gap-4`}>
        <div className="flex items-center gap-4">
          <DollarSign className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="text-xl md:text-2xl font-bold">نظام الإدارة المالية</h1>
            <p className="text-xs text-gray-500">{currentTime.toLocaleDateString('ar-SA')} - {currentTime.toLocaleTimeString('ar-SA')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{currentUser.username}</span>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <select value={fontSize} onChange={(e) => setFontSize(e.target.value)} className={`p-2 rounded-lg border ${inputClass} text-sm`}>
            <option value="small">صغير</option>
            <option value="medium">متوسط</option>
            <option value="large">كبير</option>
          </select>
          <button onClick={() => setIsLoggedIn(false)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">خروج</button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className={`w-full md:w-64 ${cardClass} border-b md:border-l p-4`}>
          <nav className="flex md:flex-col gap-2">
            {[
              { id: 'dashboard', icon: Activity, label: 'لوحة التحكم' },
              { id: 'expenses', icon: DollarSign, label: 'المصروفات' },
              { id: 'tasks', icon: CheckSquare, label: 'المهام' },
              { id: 'accounts', icon: Users, label: 'الحسابات' },
              { id: 'archive', icon: Archive, label: 'الأرشيف' },
              { id: 'audit', icon: Clock, label: 'السجل' }
            ].map(item => (
              <button key={item.id} onClick={() => setCurrentView(item.id)} className={`flex items-center gap-3 p-3 rounded-lg ${currentView === item.id ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                <item.icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 p-6">
          {currentView === 'dashboard' && (
            <div>
              <h2 className="text-3xl font-bold mb-6">لوحة التحكم</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className={`${cardClass} p-6 rounded-lg border`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 mb-2">مصروفات اليوم</p>
                      <p className="text-3xl font-bold">{kpis.todayExpenses} ريال</p>
                    </div>
                    <DollarSign className="w-12 h-12 text-blue-500" />
                  </div>
                </div>
                <div className={`${cardClass} p-6 rounded-lg border`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 mb-2">مصروفات الشهر</p>
                      <p className="text-3xl font-bold">{kpis.monthExpenses} ريال</p>
                    </div>
                    <Calendar className="w-12 h-12 text-green-500" />
                  </div>
                </div>
                <div className={`${cardClass} p-6 rounded-lg border`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 mb-2">مهام متأخرة</p>
                      <p className="text-3xl font-bold">{kpis.overdueTasks}</p>
                    </div>
                    <AlertCircle className="w-12 h-12 text-red-500" />
                  </div>
                </div>
              </div>

              <div className={`${cardClass} p-6 rounded-lg border`}>
                <h3 className="text-xl font-bold mb-4">المصروفات القادمة</h3>
                <div className="space-y-3">
                  {expenses.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 5).map(expense => {
                    const days = calculateDaysRemaining(expense.dueDate);
                    return (
                      <div key={expense.id} className={`p-4 rounded-lg ${getColorByDays(days)}`}>
                        <div className="flex justify-between">
                          <div>
                            <p className="font-bold">{expense.name}</p>
                            <p className="text-sm">{expense.amount} {expense.currency}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{days < 0 ? 'متجاوز!' : `${days} يوم`}</p>
                            <p className="text-sm">{expense.dueDate}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {currentView === 'expenses' && (
            <div>
              <div className="flex justify-between mb-6">
                <h2 className="text-3xl font-bold">المصروفات</h2>
                <button onClick={() => { setModalType('addExpense'); setShowModal(true); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  <Plus className="w-5 h-5" />
                  <span>إضافة</span>
                </button>
              </div>
              <div className="space-y-4">
                {expenses.map(expense => {
                  const days = calculateDaysRemaining(expense.dueDate);
                  return (
                    <div key={expense.id} className={`${cardClass} p-6 rounded-lg border`}>
                      <div className="flex justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{expense.id}</span>
                            <h3 className="text-xl font-bold">{expense.name}</h3>
                            <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">{expense.type}</span>
                          </div>
                          <p className="text-2xl font-bold text-blue-600 mb-2">{expense.amount} {expense.currency}</p>
                          <p className="text-sm text-gray-600 mb-2">{expense.reason}</p>
                          <div className="flex gap-4 text-sm">
                            <span>الاستحقاق: {expense.dueDate}</span>
                            <span className={`font-bold ${days < 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {days < 0 ? 'متجاوز!' : `${days} يوم`}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          {expense.status !== 'مدفوع' && (
                            <button onClick={() => markAsPaid(expense.id)} className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                              <CheckSquare className="w-5 h-5" />
                            </button>
                          )}
                          <button onClick={() => { setSelectedItem(expense); setModalType('deleteExpense'); setShowModal(true); }} className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                            <Archive className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {currentView === 'tasks' && (
            <div>
              <div className="flex justify-between mb-6">
                <h2 className="text-3xl font-bold">المهام</h2>
                <button onClick={() => { setModalType('addTask'); setShowModal(true); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  <Plus className="w-5 h-5" />
                  <span>إضافة</span>
                </button>
              </div>
              <div className="space-y-4">
                {tasks.map(task => {
                  const days = calculateDaysRemaining(task.dueDate);
                  return (
                    <div key={task.id} className={`${cardClass} p-6 rounded-lg border`}>
                      <div className="flex justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{task.id}</span>
                            <h3 className="text-xl font-bold">{task.title}</h3>
                            <span className={`text-xs px-2 py-1 rounded ${task.priority === 'عالية' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{task.priority}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <span>النوع: {task.type}</span>
                            <span>المسؤول: {task.assignedTo}</span>
                            <span>الاستحقاق: {task.dueDate}</span>
                            <span className={`font-bold ${days < 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {days < 0 ? `متأخر ${Math.abs(days)} يوم` : `${days} يوم`}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => updateTask(task.id)} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" title="تحديث">
                            <RefreshCw className="w-5 h-5" />
                          </button>
                          {task.updates.length > 0 && (
                            <button onClick={() => { setSelectedTask(task); setShowTaskHistory(true); }} className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700" title="السجل">
                              <History className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {currentView === 'accounts' && (
            <div>
              <div className="flex justify-between mb-6">
                <h2 className="text-3xl font-bold">الحسابات</h2>
                <button onClick={() => { setModalType('addAccount'); setShowModal(true); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  <Plus className="w-5 h-5" />
                  <span>إضافة</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {accounts.map(account => <AccountCard key={account.id} account={account} cardClass={cardClass} />)}
              </div>
            </div>
          )}

          {currentView === 'archive' && (
            <div>
              <h2 className="text-3xl font-bold mb-6">الأرشيف</h2>
              <div>
                <h3 className="text-xl font-bold mb-4">المصروفات المؤرشفة</h3>
                {archivedExpenses.length === 0 ? (
                  <p className="text-gray-500">لا توجد مصروفات مؤرشفة</p>
                ) : (
                  <div className="space-y-3">
                    {archivedExpenses.map(expense => (
                      <div key={expense.id} className={`${cardClass} p-4 rounded-lg border`}>
                        <h4 className="font-bold">{expense.name}</h4>
                        <p className="text-sm text-gray-600">أرشف بواسطة {expense.archivedBy}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {currentView === 'audit' && (
            <div>
              <h2 className="text-3xl font-bold mb-6">سجل الأنشطة</h2>
              <div className={`${cardClass} rounded-lg border overflow-hidden`}>
                <table className="w-full">
                  <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                      <th className="p-4 text-right">الوقت</th>
                      <th className="p-4 text-right">المستخدم</th>
                      <th className="p-4 text-right">الإجراء</th>
                      <th className="p-4 text-right">الوصف</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLog.map((log, idx) => (
                      <tr key={log.id} className={idx % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/50' : ''}>
                        <td className="p-4 text-sm">{new Date(log.timestamp).toLocaleString('ar-SA')}</td>
                        <td className="p-4">{log.user}</td>
                        <td className="p-4"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">{log.action}</span></td>
                        <td className="p-4 text-sm">{log.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${cardClass} p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
            {modalType === 'deleteExpense' && (
              <>
                <h3 className="text-xl font-bold mb-4">تأكيد الأرشفة</h3>
                <p className="mb-6">هل تريد أرشفة "{selectedItem?.name}"؟</p>
                <div className="flex gap-3 justify-end">
                  <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded-lg">إلغاء</button>
                  <button onClick={() => archiveExpense(selectedItem)} className="px-4 py-2 bg-red-600 text-white rounded-lg">أرشفة</button>
                </div>
              </>
            )}

            {modalType === 'addExpense' && (
              <>
                <h3 className="text-xl font-bold mb-4">إضافة مصروف</h3>
                <div className="space-y-4">
                  <input type="text" placeholder="اسم المصروف *" value={newExpense.name} onChange={(e) => setNewExpense({...newExpense, name: e.target.value})} className={`w-full p-3 border rounded-lg ${inputClass}`} />
                  <input type="number" placeholder="المبلغ *" value={newExpense.amount} onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})} className={`w-full p-3 border rounded-lg ${inputClass}`} />
                  <input type="date" value={newExpense.dueDate} onChange={(e) => setNewExpense({...newExpense, dueDate: e.target.value})} className={`w-full p-3 border rounded-lg ${inputClass}`} />
                  <select value={newExpense.type} onChange={(e) => setNewExpense({...newExpense, type: e.target.value})} className={`w-full p-3 border rounded-lg ${inputClass}`}>
                    <option value="شهري">شهري</option>
                    <option value="سنوي">سنوي</option>
                    <option value="مرة واحدة">مرة واحدة</option>
                  </select>
                  <textarea placeholder="السبب" value={newExpense.reason} onChange={(e) => setNewExpense({...newExpense, reason: e.target.value})} className={`w-full p-3 border rounded-lg ${inputClass}`} rows="3" />
                </div>
                <div className="flex gap-3 justify-end mt-6">
                  <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded-lg">إلغاء</button>
                  <button onClick={addExpense} className="px-4 py-2 bg-blue-600 text-white rounded-lg">إضافة</button>
                </div>
              </>
            )}

            {modalType === 'addTask' && (
              <>
                <h3 className="text-xl font-bold mb-4">إضافة مهمة</h3>
                <div className="space-y-4">
                  <input type="text" placeholder="عنوان المهمة *" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} className={`w-full p-3 border rounded-lg ${inputClass}`} />
                  <textarea placeholder="الوصف" value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})} className={`w-full p-3 border rounded-lg ${inputClass}`} rows="3" />
                  <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})} className={`w-full p-3 border rounded-lg ${inputClass}`} />
                  <select value={newTask.priority} onChange={(e) => setNewTask({...newTask, priority: e.target.value})} className={`w-full p-3 border rounded-lg ${inputClass}`}>
                    <option value="عالية">عالية</option>
                    <option value="متوسطة">متوسطة</option>
                    <option value="منخفضة">منخفضة</option>
                  </select>
                </div>
                <div className="flex gap-3 justify-end mt-6">
                  <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded-lg">إلغاء</button>
                  <button onClick={addTask} className="px-4 py-2 bg-blue-600 text-white rounded-lg">إضافة</button>
                </div>
              </>
            )}

            {modalType === 'addAccount' && (
              <>
                <h3 className="text-xl font-bold mb-4">إضافة حساب</h3>
                <div className="space-y-4">
                  <input type="text" placeholder="اسم الحساب *" value={newAccount.name} onChange={(e) => setNewAccount({...newAccount, name: e.target.value})} className={`w-full p-3 border rounded-lg ${inputClass}`} />
                  <input type="text" placeholder="الوصف" value={newAccount.description} onChange={(e) => setNewAccount({...newAccount, description: e.target.value})} className={`w-full p-3 border rounded-lg ${inputClass}`} />
                  <input type="url" placeholder="رابط الدخول" value={newAccount.loginUrl} onChange={(e) => setNewAccount({...newAccount, loginUrl: e.target.value})} className={`w-full p-3 border rounded-lg ${inputClass}`} />
                  <input type="text" placeholder="اسم المستخدم *" value={newAccount.username} onChange={(e) => setNewAccount({...newAccount, username: e.target.value})} className={`w-full p-3 border rounded-lg ${inputClass}`} />
                  <input type="password" placeholder="كلمة المرور" value={newAccount.password} onChange={(e) => setNewAccount({...newAccount, password: e.target.value})} className={`w-full p-3 border rounded-lg ${inputClass}`} />
                </div>
                <div className="flex gap-3 justify-end mt-6">
                  <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded-lg">إلغاء</button>
                  <button onClick={addAccount} className="px-4 py-2 bg-blue-600 text-white rounded-lg">إضافة</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {showTaskHistory && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${cardClass} p-6 rounded-lg max-w-2xl w-full`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">سجل التحديثات: {selectedTask.title}</h3>
              <button onClick={() => { setShowTaskHistory(false); setSelectedTask(null); }} className="text-2xl">×</button>
            </div>
            <div className="space-y-3">
              {selectedTask.updates.length === 0 ? (
                <p className="text-gray-500 text-center py-4">لا توجد تحديثات</p>
              ) : (
                selectedTask.updates.map((update, idx) => (
                  <div key={idx} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-blue-600 mt-1" />
                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <span className="font-bold">{update.user}</span>
                          <span className="text-sm text-gray-500">{new Date(update.timestamp).toLocaleString('ar-SA')}</span>
                        </div>
                        <p className="text-sm">{update.note}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={() => { setShowTaskHistory(false); setSelectedTask(null); }} className="px-4 py-2 bg-gray-300 rounded-lg">إغلاق</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
