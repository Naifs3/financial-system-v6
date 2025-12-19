// src/components/Dashboard.jsx
import React from 'react';
import { Receipt, CheckSquare, FolderKanban, Shield, TrendingUp, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = ({ expenses, tasks, projects, accounts, darkMode, txt, txtSm, card }) => {
  const totalExpenses = expenses.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0);
  const completedTasks = tasks.filter(t => t.status === 'مكتمل').length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const totalAccounts = accounts.length;

  const expenseData = [
    { name: 'شهري', value: expenses.filter(e => e.type === 'monthly').length, color: '#3B82F6' },
    { name: 'سنوي', value: expenses.filter(e => e.type === 'yearly').length, color: '#10B981' }
  ];

  const projectData = [
    { name: 'نشط', value: projects.filter(p => p.status === 'active').length },
    { name: 'متوقف', value: projects.filter(p => p.status === 'paused').length },
    { name: 'مكتمل', value: projects.filter(p => p.status === 'completed').length }
  ];

  const unpaidExpenses = expenses.filter(e => e.status === 'غير مدفوع').length;
  const urgentTasks = tasks.filter(t => t.priority === 'urgent' && t.status !== 'مكتمل').length;

  return (
    <div className="p-4 space-y-6 pb-20 md:pb-6">
      <div>
        <h2 className={`text-2xl font-bold ${txt} flex items-center gap-2`}>
          <TrendingUp className="w-6 h-6" />
          لوحة التحكم
        </h2>
        <p className={`text-sm ${txtSm} mt-1`}>نظرة عامة على النظام</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`${card} p-6 rounded-2xl border ${darkMode ? 'border-blue-500/30' : 'border-blue-200'} bg-blue-500/10`}>
          <div className="flex items-center justify-between mb-4">
            <Receipt className="w-8 h-8 text-blue-400" />
            <span className={`text-xs ${txtSm}`}>المصروفات</span>
          </div>
          <p className="text-3xl font-bold text-blue-400 mb-1">
            {expenses.length}
          </p>
          <p className={`text-sm ${txtSm}`}>
            {totalExpenses.toLocaleString('ar-SA')} ريال
          </p>
        </div>

        <div className={`${card} p-6 rounded-2xl border ${darkMode ? 'border-green-500/30' : 'border-green-200'} bg-green-500/10`}>
          <div className="flex items-center justify-between mb-4">
            <CheckSquare className="w-8 h-8 text-green-400" />
            <span className={`text-xs ${txtSm}`}>المهام</span>
          </div>
          <p className="text-3xl font-bold text-green-400 mb-1">
            {completedTasks}/{tasks.length}
          </p>
          <p className={`text-sm ${txtSm}`}>
            {tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}% مكتملة
          </p>
        </div>

        <div className={`${card} p-6 rounded-2xl border ${darkMode ? 'border-purple-500/30' : 'border-purple-200'} bg-purple-500/10`}>
          <div className="flex items-center justify-between mb-4">
            <FolderKanban className="w-8 h-8 text-purple-400" />
            <span className={`text-xs ${txtSm}`}>المشاريع</span>
          </div>
          <p className="text-3xl font-bold text-purple-400 mb-1">
            {activeProjects}
          </p>
          <p className={`text-sm ${txtSm}`}>
            {projects.length} إجمالي
          </p>
        </div>

        <div className={`${card} p-6 rounded-2xl border ${darkMode ? 'border-cyan-500/30' : 'border-cyan-200'} bg-cyan-500/10`}>
          <div className="flex items-center justify-between mb-4">
            <Shield className="w-8 h-8 text-cyan-400" />
            <span className={`text-xs ${txtSm}`}>الحسابات</span>
          </div>
          <p className="text-3xl font-bold text-cyan-400 mb-1">
            {totalAccounts}
          </p>
          <p className={`text-sm ${txtSm}`}>حساب مشفر</p>
        </div>
      </div>

      {(unpaidExpenses > 0 || urgentTasks > 0) && (
        <div className={`${card} p-6 rounded-2xl border border-orange-500/30 bg-orange-500/10`}>
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-6 h-6 text-orange-400" />
            <h3 className={`font-bold ${txt}`}>تنبيهات مهمة</h3>
          </div>
          <div className="space-y-2">
            {unpaidExpenses > 0 && (
              <p className={`text-sm ${txtSm}`}>
                • لديك {unpaidExpenses} مصروف غير مدفوع
              </p>
            )}
            {urgentTasks > 0 && (
              <p className={`text-sm ${txtSm}`}>
                • لديك {urgentTasks} مهمة مستعجلة
              </p>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${card} p-6 rounded-2xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h3 className={`font-bold ${txt} mb-4`}>توزيع المصروفات</h3>
          {expenses.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: darkMode ? '#1F2937' : '#fff',
                    border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
                    borderRadius: '0.5rem'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center">
              <p className={txtSm}>لا توجد بيانات</p>
            </div>
          )}
          <div className="flex justify-center gap-4 mt-4">
            {expenseData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className={`text-sm ${txtSm}`}>{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`${card} p-6 rounded-2xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h3 className={`font-bold ${txt} mb-4`}>حالة المشاريع</h3>
          {projects.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={projectData}>
                <XAxis 
                  dataKey="name" 
                  stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: darkMode ? '#1F2937' : '#fff',
                    border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
                    borderRadius: '0.5rem'
                  }}
                />
                <Bar dataKey="value" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center">
              <p className={txtSm}>لا توجد بيانات</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className={`${card} p-4 rounded-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'} text-center`}>
          <p className="text-2xl font-bold text-blue-400">{expenses.filter(e => e.type === 'monthly').length}</p>
          <p className={`text-xs ${txtSm} mt-1`}>مصروف شهري</p>
        </div>
        
        <div className={`${card} p-4 rounded-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'} text-center`}>
          <p className="text-2xl font-bold text-green-400">{expenses.filter(e => e.type === 'yearly').length}</p>
          <p className={`text-xs ${txtSm} mt-1`}>مصروف سنوي</p>
        </div>
        
        <div className={`${card} p-4 rounded-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'} text-center`}>
          <p className="text-2xl font-bold text-orange-400">{tasks.filter(t => t.priority === 'urgent').length}</p>
          <p className={`text-xs ${txtSm} mt-1`}>مهمة مستعجلة</p>
        </div>
        
        <div className={`${card} p-4 rounded-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'} text-center`}>
          <p className="text-2xl font-bold text-purple-400">{projects.filter(p => p.status === 'completed').length}</p>
          <p className={`text-xs ${txtSm} mt-1`}>مشروع مكتمل</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
