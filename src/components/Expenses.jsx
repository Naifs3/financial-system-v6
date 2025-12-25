// src/components/Expenses.jsx
import React, { useState } from 'react';
import { 
  Receipt, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  CheckCircle, 
  RefreshCw,
  Calendar,
  CreditCard,
  AlertTriangle,
  X,
  Save,
  DollarSign,
  FileText,
  Clock
} from 'lucide-react';
import { calcDaysRemaining, formatNumber } from '../utils/helpers';

const Expenses = ({ expenses, accounts = [], onAdd, onEdit, onDelete, onMarkPaid, onRefresh, darkMode, theme }) => {
  const t = theme;
  const colorKeys = t.colorKeys || Object.keys(t.colors);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // ═══════════════ حالات المودالات ═══════════════
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // ═══════════════ نموذج المصروف ═══════════════
  const emptyForm = {
    name: '',
    amount: '',
    type: 'monthly',
    dueDate: '',
    status: 'غير مدفوع',
    accountId: '',
    notes: ''
  };
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // ═══════════════ الفلترة ═══════════════
  const filteredExpenses = expenses.filter(expense => {
    const matchSearch = expense.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'all' || expense.type === filterType;
    const matchStatus = filterStatus === 'all' || expense.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  // ═══════════════ الإحصائيات ═══════════════
  const monthlyTotal = expenses.filter(e => e.type === 'monthly').reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
  const yearlyTotal = expenses.filter(e => e.type === 'yearly').reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
  const unpaidCount = expenses.filter(e => e.status === 'غير مدفوع').length;

  // ═══════════════ دوال مساعدة ═══════════════
  const getStatusStyle = (days) => {
    if (days === null) return { bg: t.status.info.bg, text: t.status.info.text, border: t.status.info.border };
    if (days < 0) return { bg: t.status.danger.bg, text: t.status.danger.text, border: t.status.danger.border };
    if (days <= 7) return { bg: t.status.warning.bg, text: t.status.warning.text, border: t.status.warning.border };
    return { bg: t.status.success.bg, text: t.status.success.text, border: t.status.success.border };
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'اسم المصروف مطلوب';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'المبلغ مطلوب';
    if (!formData.dueDate) newErrors.dueDate = 'تاريخ الاستحقاق مطلوب';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ═══════════════ فتح المودالات ═══════════════
  const openAddModal = () => {
    setFormData(emptyForm);
    setErrors({});
    setShowAddModal(true);
  };

  const openEditModal = (expense) => {
    setSelectedExpense(expense);
    setFormData({
      name: expense.name || '',
      amount: expense.amount || '',
      type: expense.type || 'monthly',
      dueDate: expense.dueDate || '',
      status: expense.status || 'غير مدفوع',
      accountId: expense.accountId || '',
      notes: expense.notes || ''
    });
    setErrors({});
    setShowEditModal(true);
  };

  const openDeleteModal = (expense) => {
    setSelectedExpense(expense);
    setShowDeleteModal(true);
  };

  // ═══════════════ إغلاق المودالات ═══════════════
  const closeAllModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedExpense(null);
    setFormData(emptyForm);
    setErrors({});
    setLoading(false);
  };

  // ═══════════════ معالجة الحفظ ═══════════════
  const handleAdd = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      await onAdd({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      closeAllModals();
    } catch (error) {
      console.error('Error adding expense:', error);
    }
    setLoading(false);
  };

  const handleEdit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      await onEdit({
        ...selectedExpense,
        ...formData,
        amount: parseFloat(formData.amount)
      });
      closeAllModals();
    } catch (error) {
      console.error('Error editing expense:', error);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(selectedExpense.id);
      closeAllModals();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
    setLoading(false);
  };

  // ═══════════════ الأنماط ═══════════════
  const modalOverlayStyle = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.85)',
    backdropFilter: 'blur(4px)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  };

  const modalStyle = {
    background: t.bg.primary,
    borderRadius: t.radius.xl,
    border: `1px solid ${t.border.primary}`,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
  };

  const modalHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    borderBottom: `1px solid ${t.border.primary}`,
  };

  const modalBodyStyle = {
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  };

  const modalFooterStyle = {
    display: 'flex',
    gap: 12,
    padding: '16px 24px',
    borderTop: `1px solid ${t.border.primary}`,
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: t.radius.lg,
    border: `1px solid ${t.border.primary}`,
    background: t.bg.tertiary,
    color: t.text.primary,
    fontSize: 14,
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'all 0.2s',
  };

  const inputErrorStyle = {
    ...inputStyle,
    border: `1px solid ${t.status.danger.text}`,
  };

  const labelStyle = {
    fontSize: 13,
    fontWeight: 600,
    color: t.text.secondary,
    marginBottom: 8,
    display: 'block',
  };

  const errorTextStyle = {
    fontSize: 12,
    color: t.status.danger.text,
    marginTop: 4,
  };

  const btnPrimary = {
    flex: 1,
    padding: '12px 20px',
    borderRadius: t.radius.lg,
    border: 'none',
    background: t.button.gradient,
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transition: 'all 0.2s',
  };

  const btnSecondary = {
    flex: 1,
    padding: '12px 20px',
    borderRadius: t.radius.lg,
    border: `1px solid ${t.border.primary}`,
    background: 'transparent',
    color: t.text.primary,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
  };

  const btnDanger = {
    ...btnPrimary,
    background: `linear-gradient(135deg, ${t.status.danger.text}, #dc2626)`,
  };

  const statCards = [
    { label: 'المصروفات الشهرية', value: `${formatNumber(monthlyTotal)} ريال`, colorKey: colorKeys[0] },
    { label: 'المصروفات السنوية', value: `${formatNumber(yearlyTotal)} ريال`, colorKey: colorKeys[1] },
    { label: 'غير مدفوع', value: unpaidCount, colorKey: colorKeys[2] },
  ];

  return (
    <div style={{ padding: 16, paddingBottom: 80 }}>
      
      {/* ═══════════════ العنوان والأزرار ═══════════════ */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 24,
      }}>
        <div>
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
              background: t.colors[colorKeys[0]]?.gradient || t.button.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: darkMode ? t.colors[colorKeys[0]]?.glow : 'none',
            }}>
              <Receipt size={22} color="#fff" />
            </div>
            المصروفات
          </h2>
          <p style={{ fontSize: 14, color: t.text.muted, marginTop: 6, marginRight: 50 }}>
            إدارة المصروفات الشهرية والسنوية
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onRefresh} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px',
            borderRadius: t.radius.lg, border: `1px solid ${t.border.secondary}`,
            background: 'transparent', color: t.text.primary, cursor: 'pointer',
            fontSize: 14, fontWeight: 500, fontFamily: 'inherit',
          }}>
            <RefreshCw size={18} />
            تحديث
          </button>
          <button onClick={openAddModal} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px',
            borderRadius: t.radius.lg, border: 'none', background: t.button.gradient,
            color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600,
            fontFamily: 'inherit', boxShadow: t.button.glow,
          }}>
            <Plus size={18} />
            إضافة مصروف
          </button>
        </div>
      </div>

      {/* ═══════════════ البطاقات الإحصائية ═══════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        {statCards.map((card, index) => {
          const color = t.colors[card.colorKey] || t.colors[colorKeys[0]];
          return (
            <div key={index} style={{
              background: t.bg.secondary, borderRadius: t.radius.xl,
              border: `1px solid ${color.main}30`, padding: 20,
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: -20, left: -20, width: 80, height: 80,
                background: `radial-gradient(circle, ${color.main}15 0%, transparent 70%)`,
              }} />
              <p style={{ fontSize: 13, color: t.text.muted, marginBottom: 8 }}>{card.label}</p>
              <p style={{ fontSize: 24, fontWeight: 700, color: color.main, margin: 0 }}>{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* ═══════════════ البحث والفلاتر ═══════════════ */}
      <div style={{
        display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap',
        background: t.bg.secondary, padding: 16, borderRadius: t.radius.xl,
        border: `1px solid ${t.border.primary}`,
      }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: t.text.muted }} />
          <input
            type="text"
            placeholder="بحث في المصروفات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ ...inputStyle, paddingRight: 40 }}
          />
        </div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ ...inputStyle, width: 'auto', minWidth: 130, cursor: 'pointer' }}>
          <option value="all">كل الأنواع</option>
          <option value="monthly">شهري</option>
          <option value="yearly">سنوي</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ ...inputStyle, width: 'auto', minWidth: 130, cursor: 'pointer' }}>
          <option value="all">كل الحالات</option>
          <option value="مدفوع">مدفوع</option>
          <option value="غير مدفوع">غير مدفوع</option>
        </select>
      </div>

      {/* ═══════════════ قائمة المصروفات ═══════════════ */}
      {filteredExpenses.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: 60, background: t.bg.secondary,
          borderRadius: t.radius.xl, border: `1px solid ${t.border.primary}`,
        }}>
          <Receipt size={48} style={{ color: t.text.muted, marginBottom: 16, opacity: 0.5 }} />
          <p style={{ color: t.text.muted, fontSize: 16 }}>لا توجد مصروفات</p>
          <button onClick={openAddModal} style={{
            marginTop: 16, padding: '10px 24px', borderRadius: t.radius.lg,
            border: 'none', background: t.button.gradient, color: '#fff',
            cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
          }}>
            <Plus size={18} style={{ marginLeft: 8, verticalAlign: 'middle' }} />
            إضافة مصروف جديد
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {filteredExpenses.map(expense => {
            const days = calcDaysRemaining(expense.dueDate);
            const statusStyle = getStatusStyle(days);
            const isPaid = expense.status === 'مدفوع';
            const color = t.colors[colorKeys[expenses.indexOf(expense) % colorKeys.length]] || t.colors[colorKeys[0]];

            return (
              <div key={expense.id} style={{
                background: t.bg.secondary, borderRadius: t.radius.xl,
                border: `1px solid ${t.border.primary}`, overflow: 'hidden',
                transition: 'all 0.2s',
              }}>
                {/* Header */}
                <div style={{
                  padding: '16px 20px', borderBottom: `1px solid ${t.border.primary}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: `${color.main}08`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: t.radius.md,
                      background: color.gradient, display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Receipt size={18} color="#fff" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 15, fontWeight: 600, color: t.text.primary, margin: 0 }}>{expense.name}</h3>
                      <span style={{
                        fontSize: 11, padding: '2px 8px', borderRadius: 20,
                        background: expense.type === 'monthly' ? t.status.info.bg : t.status.warning.bg,
                        color: expense.type === 'monthly' ? t.status.info.text : t.status.warning.text,
                      }}>
                        {expense.type === 'monthly' ? 'شهري' : 'سنوي'}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => openEditModal(expense)} style={{
                      width: 32, height: 32, borderRadius: t.radius.md, border: 'none',
                      background: t.bg.tertiary, color: t.text.muted, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Edit size={14} />
                    </button>
                    <button onClick={() => openDeleteModal(expense)} style={{
                      width: 32, height: 32, borderRadius: t.radius.md, border: 'none',
                      background: t.status.danger.bg, color: t.status.danger.text, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: 20 }}>
                  {/* المبلغ */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: 16, padding: '12px 16px', background: t.bg.tertiary,
                    borderRadius: t.radius.lg,
                  }}>
                    <span style={{ fontSize: 13, color: t.text.muted }}>المبلغ</span>
                    <span style={{ fontSize: 20, fontWeight: 700, color: color.main }}>
                      {formatNumber(expense.amount)} <span style={{ fontSize: 12 }}>ريال</span>
                    </span>
                  </div>

                  {/* الحالة والتاريخ */}
                  <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                    <div style={{
                      flex: 1, padding: '10px 12px', borderRadius: t.radius.md,
                      background: isPaid ? t.status.success.bg : t.status.danger.bg,
                      border: `1px solid ${isPaid ? t.status.success.border : t.status.danger.border}`,
                      textAlign: 'center',
                    }}>
                      <span style={{ fontSize: 12, color: isPaid ? t.status.success.text : t.status.danger.text, fontWeight: 600 }}>
                        {expense.status}
                      </span>
                    </div>
                    <div style={{
                      flex: 1, padding: '10px 12px', borderRadius: t.radius.md,
                      background: t.bg.tertiary, textAlign: 'center',
                    }}>
                      <span style={{ fontSize: 12, color: t.text.muted }}>{expense.dueDate}</span>
                    </div>
                  </div>

                  {/* الأيام المتبقية */}
                  {!isPaid && days !== null && (
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 14px', background: statusStyle.bg,
                      borderRadius: t.radius.md, border: `1px solid ${statusStyle.border}`,
                      marginBottom: 16,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <AlertTriangle size={16} color={statusStyle.text} />
                        <span style={{ fontSize: 12, color: statusStyle.text }}>
                          {days < 0 ? 'متأخر' : 'الأيام المتبقية'}
                        </span>
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 700, color: statusStyle.text }}>
                        {Math.abs(days)} يوم
                      </span>
                    </div>
                  )}

                  {/* زر تحديد كمدفوع */}
                  {!isPaid && (
                    <button onClick={() => onMarkPaid(expense.id)} style={{
                      width: '100%', padding: '10px 16px', borderRadius: t.radius.md,
                      border: `1px solid ${t.status.success.border}`, background: t.status.success.bg,
                      color: t.status.success.text, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                      fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    }}>
                      <CheckCircle size={16} />
                      تحديد كمدفوع
                    </button>
                  )}

                  {/* الملاحظات */}
                  {expense.notes && (
                    <div style={{
                      marginTop: 12, fontSize: 12, color: t.text.muted, padding: 12,
                      background: t.bg.tertiary, borderRadius: t.radius.md, lineHeight: 1.6,
                    }}>
                      {expense.notes}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* ═══════════════ مودال إضافة مصروف ═══════════════ */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {showAddModal && (
        <div style={modalOverlayStyle} onClick={closeAllModals}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: t.text.primary, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: t.radius.md,
                  background: t.button.gradient, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Plus size={20} color="#fff" />
                </div>
                إضافة مصروف جديد
              </h3>
              <button onClick={closeAllModals} style={{
                width: 36, height: 36, borderRadius: t.radius.md, border: 'none',
                background: t.bg.tertiary, color: t.text.muted, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <X size={20} />
              </button>
            </div>

            <div style={modalBodyStyle}>
              {/* اسم المصروف */}
              <div>
                <label style={labelStyle}>
                  <FileText size={14} style={{ marginLeft: 6, verticalAlign: 'middle' }} />
                  اسم المصروف *
                </label>
                <input
                  type="text"
                  placeholder="مثال: إيجار المكتب"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={errors.name ? inputErrorStyle : inputStyle}
                />
                {errors.name && <span style={errorTextStyle}>{errors.name}</span>}
              </div>

              {/* المبلغ */}
              <div>
                <label style={labelStyle}>
                  <DollarSign size={14} style={{ marginLeft: 6, verticalAlign: 'middle' }} />
                  المبلغ (ريال) *
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  style={errors.amount ? inputErrorStyle : inputStyle}
                />
                {errors.amount && <span style={errorTextStyle}>{errors.amount}</span>}
              </div>

              {/* النوع */}
              <div>
                <label style={labelStyle}>
                  <Clock size={14} style={{ marginLeft: 6, verticalAlign: 'middle' }} />
                  نوع المصروف
                </label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'monthly' })}
                    style={{
                      flex: 1, padding: '12px 16px', borderRadius: t.radius.lg,
                      border: formData.type === 'monthly' ? `2px solid ${t.button.primary}` : `1px solid ${t.border.primary}`,
                      background: formData.type === 'monthly' ? `${t.button.primary}15` : t.bg.tertiary,
                      color: formData.type === 'monthly' ? t.button.primary : t.text.secondary,
                      cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600,
                    }}
                  >
                    شهري
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'yearly' })}
                    style={{
                      flex: 1, padding: '12px 16px', borderRadius: t.radius.lg,
                      border: formData.type === 'yearly' ? `2px solid ${t.button.primary}` : `1px solid ${t.border.primary}`,
                      background: formData.type === 'yearly' ? `${t.button.primary}15` : t.bg.tertiary,
                      color: formData.type === 'yearly' ? t.button.primary : t.text.secondary,
                      cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600,
                    }}
                  >
                    سنوي
                  </button>
                </div>
              </div>

              {/* تاريخ الاستحقاق */}
              <div>
                <label style={labelStyle}>
                  <Calendar size={14} style={{ marginLeft: 6, verticalAlign: 'middle' }} />
                  تاريخ الاستحقاق *
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  style={errors.dueDate ? inputErrorStyle : inputStyle}
                />
                {errors.dueDate && <span style={errorTextStyle}>{errors.dueDate}</span>}
              </div>

              {/* الحالة */}
              <div>
                <label style={labelStyle}>الحالة</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  <option value="غير مدفوع">غير مدفوع</option>
                  <option value="مدفوع">مدفوع</option>
                </select>
              </div>

              {/* الحساب */}
              {accounts.length > 0 && (
                <div>
                  <label style={labelStyle}>
                    <CreditCard size={14} style={{ marginLeft: 6, verticalAlign: 'middle' }} />
                    الحساب
                  </label>
                  <select
                    value={formData.accountId}
                    onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    <option value="">اختر الحساب</option>
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>{acc.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* الملاحظات */}
              <div>
                <label style={labelStyle}>ملاحظات</label>
                <textarea
                  placeholder="أي ملاحظات إضافية..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }}
                />
              </div>
            </div>

            <div style={modalFooterStyle}>
              <button onClick={closeAllModals} style={btnSecondary} disabled={loading}>
                إلغاء
              </button>
              <button onClick={handleAdd} style={btnPrimary} disabled={loading}>
                {loading ? (
                  <>
                    <div style={{
                      width: 18, height: 18, border: '2px solid #fff',
                      borderTopColor: 'transparent', borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                    }} />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    حفظ المصروف
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* ═══════════════ مودال تعديل مصروف ═══════════════ */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {showEditModal && selectedExpense && (
        <div style={modalOverlayStyle} onClick={closeAllModals}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: t.text.primary, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: t.radius.md,
                  background: t.status.warning.bg, border: `1px solid ${t.status.warning.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Edit size={18} color={t.status.warning.text} />
                </div>
                تعديل المصروف
              </h3>
              <button onClick={closeAllModals} style={{
                width: 36, height: 36, borderRadius: t.radius.md, border: 'none',
                background: t.bg.tertiary, color: t.text.muted, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <X size={20} />
              </button>
            </div>

            <div style={modalBodyStyle}>
              <div>
                <label style={labelStyle}>اسم المصروف *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={errors.name ? inputErrorStyle : inputStyle} />
                {errors.name && <span style={errorTextStyle}>{errors.name}</span>}
              </div>

              <div>
                <label style={labelStyle}>المبلغ (ريال) *</label>
                <input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} style={errors.amount ? inputErrorStyle : inputStyle} />
                {errors.amount && <span style={errorTextStyle}>{errors.amount}</span>}
              </div>

              <div>
                <label style={labelStyle}>نوع المصروف</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {['monthly', 'yearly'].map(type => (
                    <button key={type} type="button" onClick={() => setFormData({ ...formData, type })} style={{
                      flex: 1, padding: '12px 16px', borderRadius: t.radius.lg,
                      border: formData.type === type ? `2px solid ${t.button.primary}` : `1px solid ${t.border.primary}`,
                      background: formData.type === type ? `${t.button.primary}15` : t.bg.tertiary,
                      color: formData.type === type ? t.button.primary : t.text.secondary,
                      cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600,
                    }}>
                      {type === 'monthly' ? 'شهري' : 'سنوي'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={labelStyle}>تاريخ الاستحقاق *</label>
                <input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} style={errors.dueDate ? inputErrorStyle : inputStyle} />
                {errors.dueDate && <span style={errorTextStyle}>{errors.dueDate}</span>}
              </div>

              <div>
                <label style={labelStyle}>الحالة</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="غير مدفوع">غير مدفوع</option>
                  <option value="مدفوع">مدفوع</option>
                </select>
              </div>

              {accounts.length > 0 && (
                <div>
                  <label style={labelStyle}>الحساب</label>
                  <select value={formData.accountId} onChange={(e) => setFormData({ ...formData, accountId: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="">اختر الحساب</option>
                    {accounts.map(acc => (<option key={acc.id} value={acc.id}>{acc.name}</option>))}
                  </select>
                </div>
              )}

              <div>
                <label style={labelStyle}>ملاحظات</label>
                <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }} />
              </div>
            </div>

            <div style={modalFooterStyle}>
              <button onClick={closeAllModals} style={btnSecondary} disabled={loading}>إلغاء</button>
              <button onClick={handleEdit} style={btnPrimary} disabled={loading}>
                {loading ? 'جاري الحفظ...' : (<><Save size={18} />حفظ التعديلات</>)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* ═══════════════ مودال تأكيد الحذف ═══════════════ */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {showDeleteModal && selectedExpense && (
        <div style={modalOverlayStyle} onClick={closeAllModals}>
          <div style={{ ...modalStyle, maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: t.status.danger.text, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: t.radius.md,
                  background: t.status.danger.bg, border: `1px solid ${t.status.danger.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Trash2 size={18} color={t.status.danger.text} />
                </div>
                تأكيد الحذف
              </h3>
              <button onClick={closeAllModals} style={{
                width: 36, height: 36, borderRadius: t.radius.md, border: 'none',
                background: t.bg.tertiary, color: t.text.muted, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: 24, textAlign: 'center' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: t.status.danger.bg, border: `2px solid ${t.status.danger.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                <AlertTriangle size={32} color={t.status.danger.text} />
              </div>
              <p style={{ fontSize: 16, color: t.text.primary, marginBottom: 8 }}>
                هل أنت متأكد من حذف هذا المصروف؟
              </p>
              <p style={{
                fontSize: 18, fontWeight: 700, color: t.text.primary,
                padding: '12px 20px', background: t.bg.tertiary,
                borderRadius: t.radius.lg, display: 'inline-block',
              }}>
                "{selectedExpense.name}"
              </p>
              <p style={{ fontSize: 13, color: t.status.danger.text, marginTop: 16 }}>
                ⚠️ هذا الإجراء لا يمكن التراجع عنه
              </p>
            </div>

            <div style={modalFooterStyle}>
              <button onClick={closeAllModals} style={btnSecondary} disabled={loading}>إلغاء</button>
              <button onClick={handleDelete} style={btnDanger} disabled={loading}>
                {loading ? 'جاري الحذف...' : (<><Trash2 size={18} />نعم، احذف</>)}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Expenses;
