// src/components/Projects.jsx
import React, { useState } from 'react';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  FolderPlus, 
  Upload, 
  FileText, 
  Image, 
  Video, 
  X,
  Play,
  Pause,
  CheckCircle,
  DollarSign,
  Calendar,
  Files
} from 'lucide-react';

const Projects = ({ projects, onAdd, onEdit, onDelete, onAddFolder, onUploadFile, onDeleteFile, darkMode, theme }) => {
  const t = theme;
  const colorKeys = t.colorKeys || Object.keys(t.colors);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredProjects = projects.filter(project => {
    const matchSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const activeCount = projects.filter(p => p.status === 'active').length;
  const pausedCount = projects.filter(p => p.status === 'paused').length;
  const completedCount = projects.filter(p => p.status === 'completed').length;
  const totalBudget = projects.reduce((sum, p) => sum + (parseFloat(p.budget) || 0), 0);

  // ألوان الحالة
  const getStatusStyle = (status) => {
    switch (status) {
      case 'active': 
        return { 
          bg: t.status.info.bg, 
          text: t.status.info.text, 
          border: t.status.info.border,
          name: 'نشط',
          icon: Play
        };
      case 'paused': 
        return { 
          bg: t.status.warning.bg, 
          text: t.status.warning.text, 
          border: t.status.warning.border,
          name: 'متوقف',
          icon: Pause
        };
      case 'completed': 
        return { 
          bg: t.status.success.bg, 
          text: t.status.success.text, 
          border: t.status.success.border,
          name: 'مكتمل',
          icon: CheckCircle
        };
      default: 
        return { 
          bg: `${t.text.muted}15`, 
          text: t.text.muted, 
          border: `${t.text.muted}30`,
          name: status,
          icon: FolderKanban
        };
    }
  };

  // البطاقات الإحصائية
  const statCards = [
    { label: 'نشط', value: activeCount, colorKey: colorKeys[0], icon: Play },
    { label: 'متوقف', value: pausedCount, colorKey: colorKeys[1], icon: Pause },
    { label: 'مكتمل', value: completedCount, colorKey: colorKeys[2], icon: CheckCircle },
    { label: 'الميزانية', value: totalBudget.toLocaleString('ar-SA'), colorKey: colorKeys[3], icon: DollarSign },
  ];

  const handleFileUpload = async (projectId, folderId, files) => {
    for (const file of files) {
      await onUploadFile(projectId, folderId, file);
    }
  };

  // أيقونة نوع الملف
  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return { icon: Image, color: t.colors[colorKeys[0]]?.main };
    if (type.startsWith('video/')) return { icon: Video, color: t.colors[colorKeys[2]]?.main };
    return { icon: FileText, color: t.text.muted };
  };

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
              background: t.colors[colorKeys[2]]?.gradient || t.button.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: darkMode ? t.colors[colorKeys[2]]?.glow : 'none',
            }}>
              <FolderKanban size={22} color="#fff" />
            </div>
            المشاريع
          </h2>
          <p style={{ fontSize: 14, color: t.text.muted, marginTop: 6, marginRight: 50 }}>
            إدارة المشاريع والملفات
          </p>
        </div>
        
        <button
          onClick={() => {}}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 20px',
            borderRadius: t.radius.lg,
            border: 'none',
            background: t.button.gradient,
            color: '#fff',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
            fontFamily: 'inherit',
            boxShadow: t.button.glow,
            transition: 'all 0.2s',
          }}
        >
          <Plus size={18} />
          إضافة مشروع
        </button>
      </div>

      {/* ═══════════════ البطاقات الإحصائية ═══════════════ */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: 12,
        marginBottom: 24,
      }}>
        {statCards.map((card, index) => {
          const color = t.colors[card.colorKey] || t.colors[colorKeys[0]];
          const Icon = card.icon;
          return (
            <div
              key={index}
              style={{
                background: t.bg.secondary,
                borderRadius: t.radius.xl,
                border: `1px solid ${color.main}30`,
                padding: 16,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute',
                top: -15,
                left: -15,
                width: 60,
                height: 60,
                background: `radial-gradient(circle, ${color.main}20 0%, transparent 70%)`,
                borderRadius: '50%',
              }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <p style={{ fontSize: 12, color: t.text.muted, margin: 0 }}>{card.label}</p>
                <Icon size={16} color={color.main} />
              </div>
              <p style={{ 
                fontSize: 22, 
                fontWeight: 700, 
                color: color.main,
                margin: 0,
                textShadow: darkMode ? `0 0 15px ${color.main}40` : 'none',
              }}>
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* ═══════════════ البحث والفلترة ═══════════════ */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
      }}>
        <div style={{ flex: '1 1 250px', position: 'relative' }}>
          <Search 
            size={18} 
            style={{ 
              position: 'absolute', 
              right: 14, 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: t.text.muted,
            }} 
          />
          <input
            type="text"
            placeholder="بحث في المشاريع..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 44px 12px 16px',
              borderRadius: t.radius.lg,
              border: `1px solid ${t.border.primary}`,
              background: t.bg.tertiary,
              color: t.text.primary,
              fontSize: 14,
              fontFamily: 'inherit',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: '12px 16px',
            borderRadius: t.radius.lg,
            border: `1px solid ${t.border.primary}`,
            background: t.bg.tertiary,
            color: t.text.primary,
            fontSize: 14,
            fontFamily: 'inherit',
            cursor: 'pointer',
            minWidth: 130,
          }}
        >
          <option value="all">كل الحالات</option>
          <option value="active">نشط</option>
          <option value="paused">متوقف</option>
          <option value="completed">مكتمل</option>
        </select>
      </div>

      {/* ═══════════════ قائمة المشاريع ═══════════════ */}
      {filteredProjects.length === 0 ? (
        <div style={{
          background: t.bg.secondary,
          borderRadius: t.radius['2xl'],
          border: `1px solid ${t.border.primary}`,
          padding: 60,
          textAlign: 'center',
        }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: t.radius.xl,
            background: `${t.button.primary}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <FolderKanban size={40} color={t.text.muted} />
          </div>
          <p style={{ fontSize: 18, fontWeight: 700, color: t.text.primary, marginBottom: 8 }}>
            لا توجد مشاريع
          </p>
          <p style={{ fontSize: 14, color: t.text.muted }}>
            ابدأ بإضافة أول مشروع
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filteredProjects.map((project) => {
            const statusStyle = getStatusStyle(project.status);
            const StatusIcon = statusStyle.icon;
            const filesCount = project.folders?.reduce((sum, f) => sum + (f.files?.length || 0), 0) || 0;
            
            return (
              <div
                key={project.id}
                style={{
                  background: t.bg.secondary,
                  borderRadius: t.radius.xl,
                  border: `1px solid ${t.border.primary}`,
                  padding: 24,
                  transition: 'all 0.3s ease',
                }}
              >
                {/* الهيدر */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  justifyContent: 'space-between',
                  marginBottom: 20,
                }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      fontSize: 20, 
                      fontWeight: 700, 
                      color: t.text.primary,
                      margin: '0 0 12px 0',
                    }}>
                      {project.name}
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                      {/* شارة الحالة */}
                      <span style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '5px 12px',
                        borderRadius: t.radius.md,
                        background: statusStyle.bg,
                        color: statusStyle.text,
                        border: `1px solid ${statusStyle.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}>
                        <StatusIcon size={12} />
                        {statusStyle.name}
                      </span>
                      {/* الرقم المرجعي */}
                      {project.refNumber && (
                        <span style={{ fontSize: 12, color: t.text.muted }}>
                          #{project.refNumber}
                        </span>
                      )}
                      {/* العميل */}
                      {project.client && (
                        <span style={{ fontSize: 12, color: t.text.muted }}>
                          العميل: {project.client}
                        </span>
                      )}
                    </div>
                    {project.description && (
                      <p style={{ fontSize: 13, color: t.text.muted, margin: 0, lineHeight: 1.6 }}>
                        {project.description}
                      </p>
                    )}
                  </div>
                  
                  {/* أزرار التحكم */}
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => {}}
                      title="إضافة مجلد"
                      style={{
                        padding: 8,
                        borderRadius: t.radius.md,
                        border: 'none',
                        background: t.status.info.bg,
                        color: t.status.info.text,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                      }}
                    >
                      <FolderPlus size={16} />
                    </button>
                    <button
                      onClick={() => onEdit(project)}
                      title="تعديل"
                      style={{
                        padding: 8,
                        borderRadius: t.radius.md,
                        border: 'none',
                        background: t.bg.tertiary,
                        color: t.text.primary,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                      }}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(project.id)}
                      title="حذف"
                      style={{
                        padding: 8,
                        borderRadius: t.radius.md,
                        border: 'none',
                        background: t.status.danger.bg,
                        color: t.status.danger.text,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* معلومات المشروع */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: 12,
                  marginBottom: 20,
                }}>
                  {project.budget && (
                    <div style={{
                      padding: 14,
                      background: t.bg.tertiary,
                      borderRadius: t.radius.lg,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                        <DollarSign size={14} color={t.text.muted} />
                        <span style={{ fontSize: 11, color: t.text.muted }}>الميزانية</span>
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: t.text.primary, margin: 0 }}>
                        {parseFloat(project.budget).toLocaleString('ar-SA')}
                      </p>
                    </div>
                  )}
                  {project.startDate && (
                    <div style={{
                      padding: 14,
                      background: t.bg.tertiary,
                      borderRadius: t.radius.lg,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                        <Calendar size={14} color={t.text.muted} />
                        <span style={{ fontSize: 11, color: t.text.muted }}>تاريخ البداية</span>
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: t.text.primary, margin: 0 }}>
                        {project.startDate}
                      </p>
                    </div>
                  )}
                  {project.endDate && (
                    <div style={{
                      padding: 14,
                      background: t.bg.tertiary,
                      borderRadius: t.radius.lg,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                        <Calendar size={14} color={t.text.muted} />
                        <span style={{ fontSize: 11, color: t.text.muted }}>تاريخ النهاية</span>
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: t.text.primary, margin: 0 }}>
                        {project.endDate}
                      </p>
                    </div>
                  )}
                  <div style={{
                    padding: 14,
                    background: t.bg.tertiary,
                    borderRadius: t.radius.lg,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <Files size={14} color={t.text.muted} />
                      <span style={{ fontSize: 11, color: t.text.muted }}>الملفات</span>
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: t.text.primary, margin: 0 }}>
                      {filesCount}
                    </p>
                  </div>
                </div>

                {/* المجلدات */}
                {project.folders && project.folders.length > 0 && (
                  <div>
                    <h4 style={{ 
                      fontSize: 14, 
                      fontWeight: 700, 
                      color: t.text.primary,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 12,
                    }}>
                      <FolderKanban size={16} color={t.button.primary} />
                      المجلدات ({project.folders.length})
                    </h4>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: 12,
                    }}>
                      {project.folders.map((folder) => (
                        <div
                          key={folder.id}
                          style={{
                            padding: 16,
                            background: t.bg.tertiary,
                            borderRadius: t.radius.lg,
                            border: `1px solid ${t.border.primary}`,
                          }}
                        >
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            marginBottom: 8,
                          }}>
                            <h5 style={{ 
                              fontSize: 14, 
                              fontWeight: 600, 
                              color: t.text.primary,
                              margin: 0,
                            }}>
                              {folder.name}
                            </h5>
                            <label style={{ cursor: 'pointer' }}>
                              <input
                                type="file"
                                multiple
                                style={{ display: 'none' }}
                                onChange={(e) => handleFileUpload(project.id, folder.id, Array.from(e.target.files))}
                              />
                              <div style={{
                                padding: 6,
                                borderRadius: t.radius.sm,
                                background: `${t.button.primary}15`,
                                color: t.button.primary,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                                <Upload size={14} />
                              </div>
                            </label>
                          </div>
                          <p style={{ fontSize: 12, color: t.text.muted, margin: '0 0 10px 0' }}>
                            {folder.files?.length || 0} ملف
                          </p>
                          
                          {/* قائمة الملفات */}
                          {folder.files && folder.files.length > 0 && (
                            <div style={{ 
                              display: 'flex', 
                              flexDirection: 'column', 
                              gap: 6,
                              maxHeight: 150,
                              overflowY: 'auto',
                            }}>
                              {folder.files.map((file) => {
                                const fileIcon = getFileIcon(file.type);
                                const FileIcon = fileIcon.icon;
                                return (
                                  <div
                                    key={file.id}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      padding: 8,
                                      background: t.bg.secondary,
                                      borderRadius: t.radius.sm,
                                    }}
                                  >
                                    <div style={{ 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      gap: 8,
                                      flex: 1,
                                      minWidth: 0,
                                    }}>
                                      <FileIcon size={14} color={fileIcon.color} style={{ flexShrink: 0 }} />
                                      <span style={{ 
                                        fontSize: 11, 
                                        color: t.text.primary,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                      }}>
                                        {file.name}
                                      </span>
                                    </div>
                                    <button
                                      onClick={() => onDeleteFile(project.id, folder.id, file.id)}
                                      style={{
                                        padding: 4,
                                        borderRadius: t.radius.sm,
                                        border: 'none',
                                        background: 'transparent',
                                        color: t.status.danger.text,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                      }}
                                    >
                                      <X size={12} />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Projects;
