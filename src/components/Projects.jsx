// src/components/Projects.jsx
import React, { useState, useRef } from 'react';
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Calendar,
  AlertTriangle,
  X,
  Save,
  FileText,
  FolderPlus,
  Upload,
  File,
  Image,
  FileSpreadsheet,
  Download,
  Eye,
  MoreVertical,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const Projects = ({ projects, onAdd, onEdit, onDelete, onAddFolder, onUploadFile, onDeleteFile, darkMode, theme }) => {
  const t = theme;
  const colorKeys = t.colorKeys || Object.keys(t.colors);
  const fileInputRef = useRef(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedProject, setExpandedProject] = useState(null);
  const [expandedFolder, setExpandedFolder] = useState(null);
  
  // ═══════════════ حالات المودالات ═══════════════
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // ═══════════════ نموذج المشروع ═══════════════
  const emptyForm = {
    name: '',
    description: '',
    status: 'نشط',
    client: '',
    budget: '',
    startDate: '',
    endDate: ''
  };
  const [formData, setFormData] = useState(emptyForm);
  const [folderName, setFolderName] = useState('');
  const [errors, setErrors] = useState({});

  const statuses = ['نشط', 'متوقف', 'مكتمل'];

  // ═══════════════ الفلترة ═══════════════
  const filteredProjects = projects.filter(project => {
    const matchSearch = project.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // ═══════════════ الإحصائيات ═══════════════
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'نشط').length;
  const completedProjects = projects.filter(p => p.status === 'مكتمل').length;

  // ═══════════════ دوال مساعدة ═══════════════
  const getStatusStyle = (status) => {
    if (status === 'مكتمل') return { color: t.status.success.text, bg: t.status.success.bg, border: t.status.success.border };
    if (status === 'متوقف') return { color: t.status.danger.text, bg: t.status.danger.bg, border: t.status.danger.border };
    return { color: t.status.info.text, bg: t.status.info.bg, border: t.status.info.border };
  };

  const getFileIcon = (type) => {
    if (type?.startsWith('image/')) return <Image size={16} />;
    if (type?.includes('spreadsheet') || type?.includes('excel')) return <FileSpreadsheet size={16} />;
    return <File size={16} />;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'اسم المشروع مطلوب';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('ar-SA').format(num || 0);
  };

  // ═══════════════ فتح المودالات ═══════════════
  const openAddModal = () => {
    setFormData(emptyForm);
    setErrors({});
    setShowAddModal(true);
  };

  const openEditModal = (project) => {
    setSelectedProject(project);
    setFormData({
      name: project.name || '',
      description: project.description || '',
      status: project.status || 'نشط',
      client: project.client || '',
      budget: project.budget || '',
      startDate: project.startDate || '',
      endDate: project.endDate || ''
    });
    setErrors({});
    setShowEditModal(true);
  };

  const openDeleteModal = (project) => {
    setSelectedProject(project);
    setShowDeleteModal(true);
  };

  const openFolderModal = (project) => {
    setSelectedProject(project);
    setFolderName('');
    setShowFolderModal(true);
  };

  // ═══════════════ إغلاق المودالات ═══════════════
  const closeAllModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setShowFolderModal(false);
    setSelectedProject(null);
    setSelectedFolder(null);
    setFormData(emptyForm);
    setFolderName('');
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
        budget: formData.budget ? parseFloat(formData.budget) : 0
      });
      closeAllModals();
    } catch (error) {
      console.error('Error adding project:', error);
    }
    setLoading(false);
  };

  const handleEdit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      await onEdit({
        ...selectedProject,
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : 0
      });
      closeAllModals();
    } catch (error) {
      console.error('Error editing project:', error);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(selectedProject.id);
      closeAllModals();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
    setLoading(false);
  };

  const handleAddFolder = async () => {
    if (!folderName.trim()) return;
    setLoading(true);
    try {
      await onAddFolder(selectedProject.id, folderName);
      closeAllModals();
    } catch (error) {
      console.error('Error adding folder:', error);
    }
    setLoading(false);
  };

  const handleFileUpload = async (projectId, folderId, event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      await onUploadFile(projectId, folderId, file);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
    event.target.value = '';
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
    { label: 'إجمالي المشاريع', value: totalProjects, colorKey: colorKeys[0] },
    { label: 'نشطة', value: activeProjects, colorKey: colorKeys[1] },
    { label: 'مكتملة', value: completedProjects, colorKey: colorKeys[2] },
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
              <FolderOpen size={22} color="#fff" />
            </div>
            المشاريع
          </h2>
          <p style={{ fontSize: 14, color: t.text.muted, marginTop: 6, marginRight: 50 }}>
            إدارة المشاريع والملفات
          </p>
        </div>
        
        <button onClick={openAddModal} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px',
          borderRadius: t.radius.lg, border: 'none', background: t.button.gradient,
          color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600,
          fontFamily: 'inherit', boxShadow: t.button.glow,
        }}>
          <Plus size={18} />
          إضافة مشروع
        </button>
      </div>

      {/* ═══════════════ البطاقات الإحصائية ═══════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
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
            placeholder="بحث في المشاريع..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ ...inputStyle, paddingRight: 40 }}
          />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ ...inputStyle, width: 'auto', minWidth: 130, cursor: 'pointer' }}>
          <option value="all">كل الحالات</option>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* ═══════════════ قائمة المشاريع ═══════════════ */}
      {filteredProjects.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: 60, background: t.bg.secondary,
          borderRadius: t.radius.xl, border: `1px solid ${t.border.primary}`,
        }}>
          <FolderOpen size={48} style={{ color: t.text.muted, marginBottom: 16, opacity: 0.5 }} />
          <p style={{ color: t.text.muted, fontSize: 16 }}>لا توجد مشاريع</p>
          <button onClick={openAddModal} style={{
            marginTop: 16, padding: '10px 24px', borderRadius: t.radius.lg,
            border: 'none', background: t.button.gradient, color: '#fff',
            cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
          }}>
            <Plus size={18} style={{ marginLeft: 8, verticalAlign: 'middle' }} />
            إضافة مشروع جديد
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filteredProjects.map(project => {
            const statusStyle = getStatusStyle(project.status);
            const isExpanded = expandedProject === project.id;
            const color = t.colors[colorKeys[projects.indexOf(project) % colorKeys.length]] || t.colors[colorKeys[0]];

            return (
              <div key={project.id} style={{
                background: t.bg.secondary, borderRadius: t.radius.xl,
                border: `1px solid ${t.border.primary}`, overflow: 'hidden',
              }}>
                {/* Header */}
                <div style={{
                  padding: '20px 24px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: `${color.main}08`,
                  cursor: 'pointer',
                }} onClick={() => setExpandedProject(isExpanded ? null : project.id)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: t.radius.lg,
                      background: color.gradient, display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <FolderOpen size={22} color="#fff" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 17, fontWeight: 600, color: t.text.primary, margin: 0 }}>
                        {project.name}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
                        <span style={{
                          fontSize: 11, padding: '3px 10px', borderRadius: 20,
                          background: statusStyle.bg, color: statusStyle.color,
                          border: `1px solid ${statusStyle.border}`,
                        }}>
                          {project.status}
                        </span>
                        {project.client && (
                          <span style={{ fontSize: 12, color: t.text.muted }}>
                            العميل: {project.client}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button onClick={(e) => { e.stopPropagation(); openEditModal(project); }} style={{
                      width: 36, height: 36, borderRadius: t.radius.md, border: 'none',
                      background: t.bg.tertiary, color: t.text.muted, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Edit size={16} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); openDeleteModal(project); }} style={{
                      width: 36, height: 36, borderRadius: t.radius.md, border: 'none',
                      background: t.status.danger.bg, color: t.status.danger.text, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Trash2 size={16} />
                    </button>
                    {isExpanded ? <ChevronUp size={20} color={t.text.muted} /> : <ChevronDown size={20} color={t.text.muted} />}
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div style={{ padding: 24, borderTop: `1px solid ${t.border.primary}` }}>
                    {/* معلومات المشروع */}
                    {project.description && (
                      <p style={{
                        fontSize: 13, color: t.text.muted, marginBottom: 20,
                        lineHeight: 1.6, padding: 16, background: t.bg.tertiary,
                        borderRadius: t.radius.lg,
                      }}>
                        {project.description}
                      </p>
                    )}

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
                      {project.budget > 0 && (
                        <div style={{
                          padding: '10px 16px', background: t.bg.tertiary,
                          borderRadius: t.radius.md, fontSize: 13,
                        }}>
                          <span style={{ color: t.text.muted }}>الميزانية: </span>
                          <span style={{ color: color.main, fontWeight: 700 }}>{formatNumber(project.budget)} ريال</span>
                        </div>
                      )}
                      {project.startDate && (
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          padding: '10px 16px', background: t.bg.tertiary,
                          borderRadius: t.radius.md, fontSize: 13, color: t.text.muted,
                        }}>
                          <Calendar size={14} />
                          البداية: {project.startDate}
                        </div>
                      )}
                      {project.endDate && (
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          padding: '10px 16px', background: t.bg.tertiary,
                          borderRadius: t.radius.md, fontSize: 13, color: t.text.muted,
                        }}>
                          <Calendar size={14} />
                          النهاية: {project.endDate}
                        </div>
                      )}
                    </div>

                    {/* المجلدات */}
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      marginBottom: 16,
                    }}>
                      <h4 style={{ fontSize: 15, fontWeight: 600, color: t.text.primary, margin: 0 }}>
                        📁 المجلدات ({project.folders?.length || 0})
                      </h4>
                      <button onClick={() => openFolderModal(project)} style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '8px 14px', borderRadius: t.radius.md,
                        border: `1px solid ${t.border.primary}`, background: 'transparent',
                        color: t.text.primary, cursor: 'pointer', fontSize: 12,
                        fontFamily: 'inherit',
                      }}>
                        <FolderPlus size={14} />
                        مجلد جديد
                      </button>
                    </div>

                    {(!project.folders || project.folders.length === 0) ? (
                      <p style={{
                        textAlign: 'center', padding: 30, color: t.text.muted,
                        background: t.bg.tertiary, borderRadius: t.radius.lg,
                        fontSize: 13,
                      }}>
                        لا توجد مجلدات
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {project.folders.map(folder => {
                          const isFolderExpanded = expandedFolder === folder.id;
                          return (
                            <div key={folder.id} style={{
                              background: t.bg.tertiary, borderRadius: t.radius.lg,
                              border: `1px solid ${t.border.primary}`, overflow: 'hidden',
                            }}>
                              <div style={{
                                padding: '12px 16px', display: 'flex',
                                alignItems: 'center', justifyContent: 'space-between',
                                cursor: 'pointer',
                              }} onClick={() => setExpandedFolder(isFolderExpanded ? null : folder.id)}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                  <FolderOpen size={18} color={color.main} />
                                  <span style={{ fontSize: 14, fontWeight: 500, color: t.text.primary }}>
                                    {folder.name}
                                  </span>
                                  <span style={{
                                    fontSize: 11, padding: '2px 8px', borderRadius: 10,
                                    background: t.bg.secondary, color: t.text.muted,
                                  }}>
                                    {folder.files?.length || 0} ملف
                                  </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  <label style={{
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    padding: '6px 12px', borderRadius: t.radius.md,
                                    background: color.main + '15', color: color.main,
                                    cursor: 'pointer', fontSize: 12,
                                  }}>
                                    <Upload size={14} />
                                    رفع ملف
                                    <input
                                      type="file"
                                      style={{ display: 'none' }}
                                      onChange={(e) => handleFileUpload(project.id, folder.id, e)}
                                    />
                                  </label>
                                  {isFolderExpanded ? <ChevronUp size={16} color={t.text.muted} /> : <ChevronDown size={16} color={t.text.muted} />}
                                </div>
                              </div>

                              {isFolderExpanded && folder.files && folder.files.length > 0 && (
                                <div style={{
                                  padding: '12px 16px', borderTop: `1px solid ${t.border.primary}`,
                                  display: 'flex', flexDirection: 'column', gap: 8,
                                }}>
                                  {folder.files.map(file => (
                                    <div key={file.id} style={{
                                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                      padding: '10px 14px', background: t.bg.secondary,
                                      borderRadius: t.radius.md,
                                    }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        {getFileIcon(file.type)}
                                        <span style={{ fontSize: 13, color: t.text.primary }}>{file.name}</span>
                                      </div>
                                      <div style={{ display: 'flex', gap: 6 }}>
                                        <a href={file.url} target="_blank" rel="noopener noreferrer" style={{
                                          width: 28, height: 28, borderRadius: t.radius.sm,
                                          background: t.status.info.bg, color: t.status.info.text,
                                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                                          textDecoration: 'none',
                                        }}>
                                          <Eye size={14} />
                                        </a>
                                        <button onClick={() => onDeleteFile(project.id, folder.id, file.id)} style={{
                                          width: 28, height: 28, borderRadius: t.radius.sm, border: 'none',
                                          background: t.status.danger.bg, color: t.status.danger.text,
                                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                          <Trash2 size={14} />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* ═══════════════ مودال إضافة مشروع ═══════════════ */}
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
                إضافة مشروع جديد
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
                <label style={labelStyle}>اسم المشروع *</label>
                <input type="text" placeholder="مثال: مشروع فيلا الرياض" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={errors.name ? inputErrorStyle : inputStyle} />
                {errors.name && <span style={errorTextStyle}>{errors.name}</span>}
              </div>

              <div>
                <label style={labelStyle}>الوصف</label>
                <textarea placeholder="وصف المشروع..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }} />
              </div>

              <div>
                <label style={labelStyle}>الحالة</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label style={labelStyle}>العميل</label>
                <input type="text" placeholder="اسم العميل" value={formData.client} onChange={(e) => setFormData({ ...formData, client: e.target.value })} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>الميزانية (ريال)</label>
                <input type="number" placeholder="0" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} style={inputStyle} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>تاريخ البداية</label>
                  <input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>تاريخ النهاية</label>
                  <input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} style={inputStyle} />
                </div>
              </div>
            </div>

            <div style={modalFooterStyle}>
              <button onClick={closeAllModals} style={btnSecondary} disabled={loading}>إلغاء</button>
              <button onClick={handleAdd} style={btnPrimary} disabled={loading}>
                {loading ? 'جاري الحفظ...' : (<><Save size={18} />حفظ المشروع</>)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ مودال تعديل مشروع ═══════════════ */}
      {showEditModal && selectedProject && (
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
                تعديل المشروع
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
                <label style={labelStyle}>اسم المشروع *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={errors.name ? inputErrorStyle : inputStyle} />
                {errors.name && <span style={errorTextStyle}>{errors.name}</span>}
              </div>
              <div>
                <label style={labelStyle}>الوصف</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }} />
              </div>
              <div>
                <label style={labelStyle}>الحالة</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>العميل</label>
                <input type="text" value={formData.client} onChange={(e) => setFormData({ ...formData, client: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>الميزانية (ريال)</label>
                <input type="number" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>تاريخ البداية</label>
                  <input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>تاريخ النهاية</label>
                  <input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} style={inputStyle} />
                </div>
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

      {/* ═══════════════ مودال إضافة مجلد ═══════════════ */}
      {showFolderModal && selectedProject && (
        <div style={modalOverlayStyle} onClick={closeAllModals}>
          <div style={{ ...modalStyle, maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: t.text.primary, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                <FolderPlus size={20} color={t.button.primary} />
                إضافة مجلد جديد
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
                <label style={labelStyle}>اسم المجلد</label>
                <input type="text" placeholder="مثال: المخططات" value={folderName} onChange={(e) => setFolderName(e.target.value)} style={inputStyle} />
              </div>
            </div>

            <div style={modalFooterStyle}>
              <button onClick={closeAllModals} style={btnSecondary} disabled={loading}>إلغاء</button>
              <button onClick={handleAddFolder} style={btnPrimary} disabled={loading || !folderName.trim()}>
                {loading ? 'جاري الإضافة...' : (<><FolderPlus size={18} />إضافة المجلد</>)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ مودال تأكيد الحذف ═══════════════ */}
      {showDeleteModal && selectedProject && (
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
                هل أنت متأكد من حذف هذا المشروع؟
              </p>
              <p style={{
                fontSize: 18, fontWeight: 700, color: t.text.primary,
                padding: '12px 20px', background: t.bg.tertiary,
                borderRadius: t.radius.lg, display: 'inline-block',
              }}>
                "{selectedProject.name}"
              </p>
              <p style={{ fontSize: 13, color: t.status.danger.text, marginTop: 16 }}>
                ⚠️ سيتم حذف جميع المجلدات والملفات
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

export default Projects;
