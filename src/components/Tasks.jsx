// src/components/Tasks.jsx
import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Calendar,
  AlertTriangle,
  X,
  Save,
  FileText,
  Clock,
  Flag,
  User,
  FolderOpen,
  Check,
  Circle
} from 'lucide-react';

const Tasks = ({ tasks, projects = [], onAdd, onEdit, onDelete, onToggleStatus, darkMode, theme }) => {
  const t = theme;
  const colorKeys = t.colorKeys || Object.keys(t.colors);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  
  // ═══════════════ حالات المودالات ═══════════════
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // ═══════════════ نموذج المهمة ═══════════════
  const emptyForm = {
    title: '',
    description: '',
    priority: 'medium',
    status: 'قيد الانتظار',
    dueDate: '',
    projectId: '',
    assignedTo: ''
  };
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // ═══════════════ الأولويات ═══════════════
  const priorities = [
    { value: 'high', label: 'عالية', color: t.status.danger.text, bg: t.status.danger.bg },
    { value: 'medium', label: 'متوسطة', color: t.status.warning.text, bg: t.status.warning.bg },
    { value: 'low', label: 'منخفضة', color: t.status.success.text, bg: t.status.success.bg }
  ];

  const statuses = ['قيد الانتظار', 'قيد التنفيذ', 'مكتمل'];

  // ═══════════════ الفلترة ═══════════════
  const filteredTasks = tasks.filter(task => {
    const matchSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchPriority = filterPriority === 'all' || task.priority === filterPriority;
    return matchSearch && matchStatus && matchPriority;
  });

  // ═══════════════ الإحصائيات ═══════════════
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'مكتمل').length;
  const pendingTasks = tasks.filter(t => t.status === 'قيد الانتظار').length;
  const inProgressTasks = tasks.filter(t => t.status === 'قيد التنفيذ').length;

  // ═══════════════ دوال مساعدة ═══════════════
  const getPriorityStyle = (priority) => {
    const p = priorities.find(pr => pr.value === priority);
    return p || priorities[1];
  };

  const getStatusStyle = (status) => {
    if (status === 'مكتمل') return { color: t.status.success.text, bg: t.status.success.bg, border: t.status.success.border };
    if (status === 'قيد التنفيذ') return { color: t.status.warning.text, bg: t.status.warning.bg, border: t.status.warning.border };
    return { color: t.status.info.text, bg: t.status.info.bg, border: t.status.info.border };
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'عنوان المهمة مطلوب';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ═══════════════ فتح المودالات ═══════════════
  const openAddModal = () => {
    setFormData(emptyForm);
    setErrors({});
    setShowAddModal(true);
  };

  const openEditModal = (task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title || '',
      description: task.description || '',
      priority: task.priority || 'medium',
      status: task.status || 'قيد الانتظار',
      dueDate: task.dueDate || '',
      projectId: task.projectId || '',
      assignedTo: task.assignedTo || ''
    });
    setErrors({});
    setShowEditModal(true);
  };

  const openDeleteModal = (task) => {
    setSelectedTask(task);
    setShowDeleteModal(true);
  };

  // ═══════════════ إغلاق المودالات ═══════════════
  const closeAllModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedTask(null);
    setFormData(emptyForm);
    setErrors({});
    setLoading(false);
  };

  // ═══════════════ معالجة الحفظ ═══════════════
  const handleAdd = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      await onAdd(formData);
      closeAllModals();
    } catch (error) {
      console.error('Error adding task:', error);
    }
    setLoading(false);
  };

  const handleEdit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      await onEdit({ ...selectedTask, ...formData });
      closeAllModals();
    } catch (error) {
      console.error('Error editing task:', error);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(selectedTask.id);
      closeAllModals();
    } catch (error) {
      console.error('Error deleting task:', error);
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
  };

  const btnDanger = {
    ...btnPrimary,
    background: `linear-gradient(135deg, ${t.status.danger.text}, #dc2626)`,
  };

  const statCards = [
    { label: 'إجمالي المهام', value: totalTasks, colorKey: colorKeys[0] },
    { label: 'مكتملة', value: completedTasks, colorKey: colorKeys[1] },
    { label: 'قيد التنفيذ', value: inProgressTasks, colorKey: colorKeys[2] },
    { label: 'قيد الانتظار', value: pendingTasks, colorKey: colorKeys[3] || colorKeys[0] },
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
              <CheckSquare size={22} color="#fff" />
            </div>
            المهام
          </h2>
          <p style={{ fontSize: 14, color: t.text.muted, marginTop: 6, marginRight: 50 }}>
            إدارة ومتابعة المهام
          </p>
        </div>
        
        <button onClick={openAddModal} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px',
          borderRadius: t.radius.lg, border: 'none', background: t.button.gradient,
          color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600,
          fontFamily: 'inherit', boxShadow: t.button.glow,
        }}>
          <Plus size={18} />
          إضافة مهمة
        </button>
      </div>

      {/* ═══════════════ البطاقات الإحصائية ═══════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 24 }}>
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
              <p style={{ fontSize: 28, fontWeight: 700, color: color.main, margin: 0 }}>{card.value}</p>
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
            placeholder="بحث في المهام..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ ...inputStyle, paddingRight: 40 }}
          />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ ...inputStyle, width: 'auto', minWidth: 130, cursor: 'pointer' }}>
          <option value="all">كل الحالات</option>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} style={{ ...inputStyle, width: 'auto', minWidth: 130, cursor: 'pointer' }}>
          <option value="all">كل الأولويات</option>
          {priorities.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
      </div>

      {/* ═══════════════ قائمة المهام ═══════════════ */}
      {filteredTasks.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: 60, background: t.bg.secondary,
          borderRadius: t.radius.xl, border: `1px solid ${t.border.primary}`,
        }}>
          <CheckSquare size={48} style={{ color: t.text.muted, marginBottom: 16, opacity: 0.5 }} />
          <p style={{ color: t.text.muted, fontSize: 16 }}>لا توجد مهام</p>
          <button onClick={openAddModal} style={{
            marginTop: 16, padding: '10px 24px', borderRadius: t.radius.lg,
            border: 'none', background: t.button.gradient, color: '#fff',
            cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
          }}>
            <Plus size={18} style={{ marginLeft: 8, verticalAlign: 'middle' }} />
            إضافة مهمة جديدة
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {filteredTasks.map(task => {
            const priorityStyle = getPriorityStyle(task.priority);
            const statusStyle = getStatusStyle(task.status);
            const isCompleted = task.status === 'مكتمل';
            const color = t.colors[colorKeys[tasks.indexOf(task) % colorKeys.length]] || t.colors[colorKeys[0]];

            return (
              <div key={task.id} style={{
                background: t.bg.secondary, borderRadius: t.radius.xl,
                border: `1px solid ${t.border.primary}`, overflow: 'hidden',
                opacity: isCompleted ? 0.7 : 1,
              }}>
                {/* Header */}
                <div style={{
                  padding: '16px 20px', borderBottom: `1px solid ${t.border.primary}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: `${color.main}08`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button 
                      onClick={() => onToggleStatus(task.id)}
                      style={{
                        width: 32, height: 32, borderRadius: '50%',
                        border: `2px solid ${isCompleted ? t.status.success.text : t.border.primary}`,
                        background: isCompleted ? t.status.success.bg : 'transparent',
                        cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      {isCompleted && <Check size={16} color={t.status.success.text} />}
                    </button>
                    <div>
                      <h3 style={{ 
                        fontSize: 15, fontWeight: 600, color: t.text.primary, margin: 0,
                        textDecoration: isCompleted ? 'line-through' : 'none',
                      }}>
                        {task.title}
                      </h3>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => openEditModal(task)} style={{
                      width: 32, height: 32, borderRadius: t.radius.md, border: 'none',
                      background: t.bg.tertiary, color: t.text.muted, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Edit size={14} />
                    </button>
                    <button onClick={() => openDeleteModal(task)} style={{
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
                  {/* الوصف */}
                  {task.description && (
                    <p style={{
                      fontSize: 13, color: t.text.muted, marginBottom: 16,
                      lineHeight: 1.6, padding: 12, background: t.bg.tertiary,
                      borderRadius: t.radius.md,
                    }}>
                      {task.description}
                    </p>
                  )}

                  {/* الأولوية والحالة */}
                  <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                    <div style={{
                      flex: 1, padding: '10px 12px', borderRadius: t.radius.md,
                      background: priorityStyle.bg, textAlign: 'center',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}>
                      <Flag size={14} color={priorityStyle.color} />
                      <span style={{ fontSize: 12, color: priorityStyle.color, fontWeight: 600 }}>
                        {priorityStyle.label}
                      </span>
                    </div>
                    <div style={{
                      flex: 1, padding: '10px 12px', borderRadius: t.radius.md,
                      background: statusStyle.bg, border: `1px solid ${statusStyle.border}`,
                      textAlign: 'center',
                    }}>
                      <span style={{ fontSize: 12, color: statusStyle.color, fontWeight: 600 }}>
                        {task.status}
                      </span>
                    </div>
                  </div>

                  {/* التاريخ والمشروع */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {task.dueDate && (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '6px 12px', background: t.bg.tertiary,
                        borderRadius: t.radius.md, fontSize: 12, color: t.text.muted,
                      }}>
                        <Calendar size={14} />
                        {task.dueDate}
                      </div>
                    )}
                    {task.projectId && projects.find(p => p.id === task.projectId) && (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '6px 12px', background: t.bg.tertiary,
                        borderRadius: t.radius.md, fontSize: 12, color: t.text.muted,
                      }}>
                        <FolderOpen size={14} />
                        {projects.find(p => p.id === task.projectId)?.name}
                      </div>
                    )}
                    {task.assignedTo && (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '6px 12px', background: t.bg.tertiary,
                        borderRadius: t.radius.md, fontSize: 12, color: t.text.muted,
                      }}>
                        <User size={14} />
                        {task.assignedTo}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* ═══════════════ مودال إضافة مهمة ═══════════════ */}
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
                إضافة مهمة جديدة
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
              {/* عنوان المهمة */}
              <div>
                <label style={labelStyle}>
                  <FileText size={14} style={{ marginLeft: 6, verticalAlign: 'middle' }} />
                  عنوان المهمة *
                </label>
                <input
                  type="text"
                  placeholder="مثال: مراجعة التقرير الشهري"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={errors.title ? inputErrorStyle : inputStyle}
                />
                {errors.title && <span style={errorTextStyle}>{errors.title}</span>}
              </div>

              {/* الوصف */}
              <div>
                <label style={labelStyle}>الوصف</label>
                <textarea
                  placeholder="تفاصيل المهمة..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }}
                />
              </div>

              {/* الأولوية */}
              <div>
                <label style={labelStyle}>
                  <Flag size={14} style={{ marginLeft: 6, verticalAlign: 'middle' }} />
                  الأولوية
                </label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {priorities.map(p => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, priority: p.value })}
                      style={{
                        flex: 1, padding: '12px 16px', borderRadius: t.radius.lg,
                        border: formData.priority === p.value ? `2px solid ${p.color}` : `1px solid ${t.border.primary}`,
                        background: formData.priority === p.value ? p.bg : t.bg.tertiary,
                        color: formData.priority === p.value ? p.color : t.text.secondary,
                        cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600,
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* الحالة */}
              <div>
                <label style={labelStyle}>
                  <Clock size={14} style={{ marginLeft: 6, verticalAlign: 'middle' }} />
                  الحالة
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* تاريخ الاستحقاق */}
              <div>
                <label style={labelStyle}>
                  <Calendar size={14} style={{ marginLeft: 6, verticalAlign: 'middle' }} />
                  تاريخ الاستحقاق
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  style={inputStyle}
                />
              </div>

              {/* المشروع */}
              {projects.length > 0 && (
                <div>
                  <label style={labelStyle}>
                    <FolderOpen size={14} style={{ marginLeft: 6, verticalAlign: 'middle' }} />
                    المشروع
                  </label>
                  <select
                    value={formData.projectId}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    <option value="">اختر المشروع</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* المكلف */}
              <div>
                <label style={labelStyle}>
                  <User size={14} style={{ marginLeft: 6, verticalAlign: 'middle' }} />
                  المكلف بالتنفيذ
                </label>
                <input
                  type="text"
                  placeholder="اسم الشخص المكلف"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  style={inputStyle}
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
                    حفظ المهمة
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* ═══════════════ مودال تعديل مهمة ═══════════════ */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {showEditModal && selectedTask && (
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
                تعديل المهمة
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
                <label style={labelStyle}>عنوان المهمة *</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} style={errors.title ? inputErrorStyle : inputStyle} />
                {errors.title && <span style={errorTextStyle}>{errors.title}</span>}
              </div>

              <div>
                <label style={labelStyle}>الوصف</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }} />
              </div>

              <div>
                <label style={labelStyle}>الأولوية</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {priorities.map(p => (
                    <button key={p.value} type="button" onClick={() => setFormData({ ...formData, priority: p.value })} style={{
                      flex: 1, padding: '12px 16px', borderRadius: t.radius.lg,
                      border: formData.priority === p.value ? `2px solid ${p.color}` : `1px solid ${t.border.primary}`,
                      background: formData.priority === p.value ? p.bg : t.bg.tertiary,
                      color: formData.priority === p.value ? p.color : t.text.secondary,
                      cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600,
                    }}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={labelStyle}>الحالة</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label style={labelStyle}>تاريخ الاستحقاق</label>
                <input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} style={inputStyle} />
              </div>

              {projects.length > 0 && (
                <div>
                  <label style={labelStyle}>المشروع</label>
                  <select value={formData.projectId} onChange={(e) => setFormData({ ...formData, projectId: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="">اختر المشروع</option>
                    {projects.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
                  </select>
                </div>
              )}

              <div>
                <label style={labelStyle}>المكلف بالتنفيذ</label>
                <input type="text" value={formData.assignedTo} onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })} style={inputStyle} />
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
      {showDeleteModal && selectedTask && (
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
                هل أنت متأكد من حذف هذه المهمة؟
              </p>
              <p style={{
                fontSize: 18, fontWeight: 700, color: t.text.primary,
                padding: '12px 20px', background: t.bg.tertiary,
                borderRadius: t.radius.lg, display: 'inline-block',
              }}>
                "{selectedTask.title}"
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

export default Tasks;
