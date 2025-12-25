// src/components/Dashboard.jsx
import React from 'react';
import { 
  Receipt, 
  CheckSquare, 
  FolderKanban, 
  Shield, 
  TrendingUp, 
  AlertCircle,
  Calendar,
  Clock,
  Target,
  Zap
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = ({ expenses, tasks, projects, accounts, darkMode, theme }) => {
  const t = theme;
  const colorKeys = t.colorKeys || Object.keys(t.colors);
  
  // الإحصائيات
  const totalExpenses = expenses.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0);
  const completedTasks = tasks.filter(t => t.status === 'مكتمل').length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const totalAccounts = accounts.length;

  // بيانات الرسوم البيانية
  const expenseData = [
    { name: 'شهري', value: expenses.filter(e => e.type === 'monthly').length, color: t.colors[colorKeys[0]]?.main || '#3B82F6' },
    { name: 'سنوي', value: expenses.filter(e => e.type === 'yearly').length, color: t.colors[colorKeys[1]]?.main || '#10B981' }
  ];

  const projectData = [
    { name: 'نشط', value: projects.filter(p => p.status === 'active').length },
    { name: 'متوقف', value: projects.filter(p => p.status === 'paused').length },
    { name: 'مكتمل', value: projects.filter(p => p.status === 'completed').length }
  ];

  const unpaidExpenses = expenses.filter(e => e.status === 'غير مدفوع').length;
  const urgentTasks = tasks.filter(t => t.priority === 'urgent' && t.status !== 'مكتمل').length;

  // البطاقات الرئيسية
  const statCards = [
    { 
      id: 'expenses',
      icon: Receipt, 
      label: 'المصروفات', 
      value: expenses.length,
      subValue: `${totalExpenses.toLocaleString('ar-SA')} ريال`,
      colorKey: colorKeys[0] || 'blue'
    },
    { 
      id: 'tasks',
      icon: CheckSquare, 
      label: 'المهام', 
      value: `${completedTasks}/${tasks.length}`,
      subValue: `${tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}% مكتملة`,
      colorKey: colorKeys[1] || 'green'
    },
    { 
      id: 'projects',
      icon: FolderKanban, 
      label: 'المشاريع', 
      value: activeProjects,
      subValue: `${projects.length} إجمالي`,
      colorKey: colorKeys[2] || 'purple'
    },
    { 
      id: 'accounts',
      icon: Shield, 
      label: 'الحسابات', 
      value: totalAccounts,
      subValue: 'حساب مشفر',
      colorKey: colorKeys[3] || 'cyan'
    },
  ];

  // الإحصائيات السريعة
  const quickStats = [
    { label: 'مصروف شهري', value: expenses.filter(e => e.type === 'monthly').length, colorKey: colorKeys[0] },
    { label: 'مصروف سنوي', value: expenses.filter(e => e.type === 'yearly').length, colorKey: colorKeys[1] },
    { label: 'مهمة مستعجلة', value: tasks.filter(t => t.priority === 'urgent').length, colorKey: colorKeys[2] },
    { label: 'مشروع مكتمل', value: projects.filter(p => p.status === 'completed').length, colorKey: colorKeys[3] },
  ];

  return (
    <div style={{ padding: 16, paddingBottom: 80 }}>
      
      {/* ═══════════════ العنوان ═══════════════ */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ 
          fontSize: 24, 
          fontWeight: 700, 
          color: t.text.primary,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          margin: 0,
        }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: t.radius.lg,
            background: t.button.gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: t.button.glow,
          }}>
            <TrendingUp size={22} color="#fff" />
          </div>
          لوحة التحكم
        </h2>
        <p style={{ fontSize: 14, color: t.text.muted, marginTop: 6, marginRight: 50 }}>
          نظرة عامة على النظام
        </p>
      </div>

      {/* ═══════════════ البطاقات الإحصائية ═══════════════ */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 16,
        marginBottom: 24,
      }}>
        {statCards.map((card, index) => {
          const Icon = card.icon;
          const color = t.colors[card.colorKey] || t.colors[colorKeys[0]];
          
          return (
            <div
              key={card.id}
              style={{
                background: t.bg.secondary,
                borderRadius: t.radius.xl,
                border: `1px solid ${color.main}30`,
                padding: 24,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
              }}
            >
              {/* خلفية متدرجة */}
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 120,
                height: 120,
                background: `radial-gradient(circle, ${color.main}15 0%, transparent 70%)`,
                borderRadius: '50%',
                transform: 'translate(30%, -30%)',
              }} />
              
              {/* الهيدر */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: 16,
                position: 'relative',
              }}>
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: t.radius.lg,
                  background: color.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: darkMode ? color.glow : 'none',
                }}>
                  <Icon size={26} color="#fff" />
                </div>
                <span style={{ 
                  fontSize: 12, 
                  color: t.text.muted,
                  background: `${color.main}15`,
                  padding: '4px 10px',
                  borderRadius: t.radius.md,
                }}>
                  {card.label}
                </span>
              </div>
              
              {/* القيمة */}
              <p style={{ 
                fontSize: 36, 
                fontWeight: 700, 
                color: color.main,
                margin: '0 0 4px 0',
                textShadow: darkMode ? `0 0 20px ${color.main}50` : 'none',
              }}>
                {card.value}
              </p>
              
              {/* القيمة الفرعية */}
              <p style={{ 
                fontSize: 13, 
                color: t.text.muted,
                margin: 0,
              }}>
                {card.subValue}
              </p>
            </div>
          );
        })}
      </div>

      {/* ═══════════════ التنبيهات ═══════════════ */}
      {(unpaidExpenses > 0 || urgentTasks > 0) && (
        <div style={{
          background: `${t.status.warning.bg}`,
          borderRadius: t.radius.xl,
          border: `1px solid ${t.status.warning.border}`,
          padding: 20,
          marginBottom: 24,
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 10,
            marginBottom: 12,
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: t.radius.md,
              background: `${t.status.warning.text}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <AlertCircle size={22} color={t.status.warning.text} />
            </div>
            <h3 style={{ 
              fontWeight: 700, 
              color: t.text.primary,
              margin: 0,
              fontSize: 16,
            }}>
              تنبيهات مهمة
            </h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {unpaidExpenses > 0 && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8,
                padding: '8px 12px',
                background: t.bg.secondary,
                borderRadius: t.radius.md,
              }}>
                <Receipt size={16} color={t.status.warning.text} />
                <p style={{ fontSize: 14, color: t.text.secondary, margin: 0 }}>
                  لديك <strong style={{ color: t.status.warning.text }}>{unpaidExpenses}</strong> مصروف غير مدفوع
                </p>
              </div>
            )}
            {urgentTasks > 0 && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8,
                padding: '8px 12px',
                background: t.bg.secondary,
                borderRadius: t.radius.md,
              }}>
                <Zap size={16} color={t.status.danger.text} />
                <p style={{ fontSize: 14, color: t.text.secondary, margin: 0 }}>
                  لديك <strong style={{ color: t.status.danger.text }}>{urgentTasks}</strong> مهمة مستعجلة
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════ الرسوم البيانية ═══════════════ */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: 20,
        marginBottom: 24,
      }}>
        
        {/* رسم المصروفات */}
        <div style={{
          background: t.bg.secondary,
          borderRadius: t.radius.xl,
          border: `1px solid ${t.border.primary}`,
          padding: 24,
        }}>
          <h3 style={{ 
            fontWeight: 700, 
            color: t.text.primary,
            margin: '0 0 20px 0',
            fontSize: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <Calendar size={18} color={t.button.primary} />
            توزيع المصروفات
          </h3>
          
          {expenses.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: t.bg.secondary,
                      border: `1px solid ${t.border.primary}`,
                      borderRadius: t.radius.md,
                      fontFamily: 'inherit',
                    }}
                    labelStyle={{ color: t.text.primary }}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* المفتاح */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: 20,
                marginTop: 16,
              }}>
                {expenseData.map((item, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: 4,
                      backgroundColor: item.color,
                      boxShadow: darkMode ? `0 0 10px ${item.color}50` : 'none',
                    }} />
                    <span style={{ fontSize: 13, color: t.text.muted }}>
                      {item.name}: <strong style={{ color: t.text.primary }}>{item.value}</strong>
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ 
              height: 220, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
            }}>
              <p style={{ color: t.text.muted, fontSize: 14 }}>لا توجد بيانات</p>
            </div>
          )}
        </div>

        {/* رسم المشاريع */}
        <div style={{
          background: t.bg.secondary,
          borderRadius: t.radius.xl,
          border: `1px solid ${t.border.primary}`,
          padding: 24,
        }}>
          <h3 style={{ 
            fontWeight: 700, 
            color: t.text.primary,
            margin: '0 0 20px 0',
            fontSize: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <Target size={18} color={t.colors[colorKeys[2]]?.main || '#8b5cf6'} />
            حالة المشاريع
          </h3>
          
          {projects.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={projectData}>
                <XAxis 
                  dataKey="name" 
                  stroke={t.text.muted}
                  style={{ fontSize: '12px' }}
                  axisLine={{ stroke: t.border.primary }}
                  tickLine={false}
                />
                <YAxis 
                  stroke={t.text.muted}
                  style={{ fontSize: '12px' }}
                  axisLine={{ stroke: t.border.primary }}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: t.bg.secondary,
                    border: `1px solid ${t.border.primary}`,
                    borderRadius: t.radius.md,
                    fontFamily: 'inherit',
                  }}
                  labelStyle={{ color: t.text.primary }}
                  cursor={{ fill: `${t.button.primary}10` }}
                />
                <Bar 
                  dataKey="value" 
                  fill={t.colors[colorKeys[2]]?.main || '#8B5CF6'} 
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ 
              height: 250, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
            }}>
              <p style={{ color: t.text.muted, fontSize: 14 }}>لا توجد بيانات</p>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════ الإحصائيات السريعة ═══════════════ */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: 12,
      }}>
        {quickStats.map((stat, index) => {
          const color = t.colors[stat.colorKey] || t.colors[colorKeys[index % colorKeys.length]];
          
          return (
            <div
              key={index}
              style={{
                background: t.bg.secondary,
                borderRadius: t.radius.lg,
                border: `1px solid ${t.border.primary}`,
                padding: 16,
                textAlign: 'center',
                transition: 'all 0.3s ease',
              }}
            >
              <p style={{ 
                fontSize: 28, 
                fontWeight: 700, 
                color: color.main,
                margin: '0 0 4px 0',
                textShadow: darkMode ? `0 0 15px ${color.main}40` : 'none',
              }}>
                {stat.value}
              </p>
              <p style={{ 
                fontSize: 12, 
                color: t.text.muted,
                margin: 0,
              }}>
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
