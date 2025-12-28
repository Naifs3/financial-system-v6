// src/components/DataImport.jsx
import React, { useState } from 'react';
import { 
  Upload, Download, FileSpreadsheet, Copy, Check, AlertTriangle, 
  X, Receipt, CheckSquare, FolderOpen, Wallet, Users, Package,
  Truck, FileText, Wrench, Boxes, ChevronDown, ChevronUp, Trash2,
  RefreshCw, Info, FileDown, ClipboardPaste, Eye, CheckCircle
} from 'lucide-react';
import { generateCode } from '../utils/helpers';

// ═══════════════ Modal Component ═══════════════
const Modal = ({ show, onClose, title, children, onSubmit, submitText, danger, loading, theme, wide }) => {
  const t = theme;
  if (!show) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }} onClick={onClose}>
      <div style={{ background: t.bg.secondary, borderRadius: 16, width: '100%', maxWidth: wide ? 900 : 500, border: `1px solid ${t.border.primary}`, maxHeight: '90vh', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${t.border.primary}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: t.bg.tertiary }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: t.text.primary, margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: t.bg.secondary, color: t.text.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
        </div>
        <div style={{ padding: 20, overflowY: 'auto', maxHeight: 'calc(90vh - 130px)' }}>{children}</div>
        {onSubmit && (
          <div style={{ padding: '14px 20px', borderTop: `1px solid ${t.border.primary}`, display: 'flex', gap: 10, justifyContent: 'flex-end', background: t.bg.tertiary }}>
            <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: 10, border: `1px solid ${t.border.primary}`, background: 'transparent', color: t.text.secondary, cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit' }}>إلغاء</button>
            <button onClick={onSubmit} disabled={loading} style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: danger ? t.status.danger.text : t.button.gradient, color: '#fff', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', opacity: loading ? 0.7 : 1 }}>{loading ? 'جاري...' : submitText}</button>
          </div>
        )}
      </div>
    </div>
  );
};

const DataImport = ({ 
  onImportExpenses, 
  onImportTasks, 
  onImportProjects, 
  onImportAccounts,
  onImportClients, 
  onImportSuppliers, 
  onImportMaterials, 
  onImportEquipment,
  expenses = [], 
  tasks = [], 
  projects = [], 
  accounts = [],
  clients = [], 
  suppliers = [], 
  materials = [], 
  equipment = [],
  darkMode, 
  theme 
}) => {
  const t = theme;
  
  const [activeSection, setActiveSection] = useState(null);
  const [pasteData, setPasteData] = useState('');
  const [parsedData, setParsedData] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [importSuccess, setImportSuccess] = useState(null);
  const [copied, setCopied] = useState(null);
  const [importErrors, setImportErrors] = useState([]);

  const sections = [
    {
      id: 'expenses',
      name: 'المصروفات',
      icon: Receipt,
      color: '#ef4444',
      codePrefix: 'expenses',
      fields: [
        { key: 'name', label: 'اسم المصروف', required: true, example: 'إيجار المكتب' },
        { key: 'amount', label: 'المبلغ', required: true, example: '5000', type: 'number' },
        { key: 'type', label: 'النوع', required: false, example: 'monthly', default: 'monthly' },
        { key: 'dueDate', label: 'تاريخ الاستحقاق', required: true, example: '2024-01-15', type: 'date' },
        { key: 'status', label: 'الحالة', required: false, example: 'غير مدفوع', default: 'غير مدفوع' },
        { key: 'notes', label: 'ملاحظات', required: false, example: 'ملاحظة' },
      ],
      onImport: onImportExpenses,
      data: expenses,
    },
    {
      id: 'tasks',
      name: 'المهام',
      icon: CheckSquare,
      color: '#10b981',
      codePrefix: 'tasks',
      fields: [
        { key: 'title', label: 'عنوان المهمة', required: true, example: 'مراجعة العقود' },
        { key: 'description', label: 'الوصف', required: false, example: 'وصف تفصيلي' },
        { key: 'priority', label: 'الأولوية', required: false, example: 'عالي', default: 'متوسط' },
        { key: 'status', label: 'الحالة', required: false, example: 'قيد التنفيذ', default: 'قيد التنفيذ' },
        { key: 'dueDate', label: 'تاريخ الاستحقاق', required: false, example: '2024-01-20', type: 'date' },
      ],
      onImport: onImportTasks,
      data: tasks,
    },
    {
      id: 'projects',
      name: 'المشاريع',
      icon: FolderOpen,
      color: '#8b5cf6',
      codePrefix: 'projects',
      fields: [
        { key: 'name', label: 'اسم المشروع', required: true, example: 'فيلا الرياض' },
        { key: 'client', label: 'العميل', required: false, example: 'أحمد محمد' },
        { key: 'budget', label: 'الميزانية', required: false, example: '500000', type: 'number' },
        { key: 'status', label: 'الحالة', required: false, example: 'نشط', default: 'نشط' },
        { key: 'startDate', label: 'تاريخ البداية', required: false, example: '2024-01-01', type: 'date' },
        { key: 'endDate', label: 'تاريخ النهاية', required: false, example: '2024-06-01', type: 'date' },
        { key: 'description', label: 'الوصف', required: false, example: 'وصف المشروع' },
      ],
      onImport: onImportProjects,
      data: projects,
    },
    {
      id: 'accounts',
      name: 'الحسابات',
      icon: Wallet,
      color: '#f59e0b',
      codePrefix: 'accounts',
      fields: [
        { key: 'name', label: 'اسم الحساب', required: true, example: 'الحساب الرئيسي' },
        { key: 'type', label: 'النوع', required: false, example: 'bank', default: 'bank' },
        { key: 'bankName', label: 'اسم البنك', required: false, example: 'بنك الراجحي' },
        { key: 'accountNumber', label: 'رقم الحساب', required: false, example: 'SA0000000000000000' },
        { key: 'balance', label: 'الرصيد', required: false, example: '50000', type: 'number', default: 0 },
        { key: 'notes', label: 'ملاحظات', required: false, example: 'ملاحظة' },
      ],
      onImport: onImportAccounts,
      data: accounts,
    },
    {
      id: 'clients',
      name: 'العملاء',
      icon: Users,
      color: '#3b82f6',
      codePrefix: 'clients',
      fields: [
        { key: 'name', label: 'اسم العميل', required: true, example: 'شركة البناء المتطور' },
        { key: 'phone', label: 'رقم الجوال', required: false, example: '0501234567' },
        { key: 'email', label: 'البريد الإلكتروني', required: false, example: 'client@email.com' },
        { key: 'address', label: 'العنوان', required: false, example: 'الرياض - حي النخيل' },
        { key: 'type', label: 'النوع', required: false, example: 'شركة', default: 'فرد' },
        { key: 'notes', label: 'ملاحظات', required: false, example: 'عميل مميز' },
      ],
      onImport: onImportClients,
      data: clients,
    },
    {
      id: 'suppliers',
      name: 'الموردين',
      icon: Truck,
      color: '#06b6d4',
      codePrefix: 'suppliers',
      fields: [
        { key: 'name', label: 'اسم المورد', required: true, example: 'مصنع الحديد السعودي' },
        { key: 'phone', label: 'رقم الجوال', required: false, example: '0509876543' },
        { key: 'email', label: 'البريد الإلكتروني', required: false, example: 'supplier@email.com' },
        { key: 'address', label: 'العنوان', required: false, example: 'جدة - المنطقة الصناعية' },
        { key: 'category', label: 'التصنيف', required: false, example: 'مواد بناء', default: 'أخرى' },
        { key: 'notes', label: 'ملاحظات', required: false, example: 'مورد معتمد' },
      ],
      onImport: onImportSuppliers,
      data: suppliers,
    },
    {
      id: 'materials',
      name: 'المواد',
      icon: Boxes,
      color: '#ec4899',
      codePrefix: 'materials',
      fields: [
        { key: 'name', label: 'اسم المادة', required: true, example: 'حديد تسليح 16مم' },
        { key: 'unit', label: 'الوحدة', required: false, example: 'طن', default: 'قطعة' },
        { key: 'quantity', label: 'الكمية', required: false, example: '50', type: 'number', default: 0 },
        { key: 'price', label: 'السعر', required: false, example: '3500', type: 'number', default: 0 },
        { key: 'supplier', label: 'المورد', required: false, example: 'مصنع الحديد' },
        { key: 'notes', label: 'ملاحظات', required: false, example: 'جودة عالية' },
      ],
      onImport: onImportMaterials,
      data: materials,
    },
    {
      id: 'equipment',
      name: 'المعدات',
      icon: Wrench,
      color: '#6366f1',
      codePrefix: 'equipment',
      fields: [
        { key: 'name', label: 'اسم المعدة', required: true, example: 'حفار كاتربيلر 320' },
        { key: 'type', label: 'النوع', required: false, example: 'حفار', default: 'أخرى' },
        { key: 'status', label: 'الحالة', required: false, example: 'متاح', default: 'متاح' },
        { key: 'dailyRate', label: 'الإيجار اليومي', required: false, example: '1500', type: 'number', default: 0 },
        { key: 'location', label: 'الموقع', required: false, example: 'المستودع الرئيسي' },
        { key: 'notes', label: 'ملاحظات', required: false, example: 'بحالة ممتازة' },
      ],
      onImport: onImportEquipment,
      data: equipment,
    },
  ];

  const generateTemplate = (section) => {
    const headers = section.fields.map(f => f.label + (f.required ? ' *' : '')).join('\t');
    const examples = section.fields.map(f => f.example).join('\t');
    return `${headers}\n${examples}`;
  };

  const copyTemplate = (section) => {
    const template = generateTemplate(section);
    navigator.clipboard.writeText(template);
    setCopied(section.id);
    setTimeout(() => setCopied(null), 2000);
  };

  const parseData = (text, section) => {
    if (!text.trim()) return [];
    
    const lines = text.trim().split('\n');
    const headers = section.fields.map(f => f.label);
    
    const firstLineValues = lines[0].split('\t').map(v => v.replace(' *', '').trim());
    const isHeaderRow = headers.some(h => firstLineValues.includes(h));
    const dataLines = isHeaderRow ? lines.slice(1) : lines;
    
    const errors = [];
    const parsed = dataLines.map((line, index) => {
      const values = line.split('\t');
      const item = { _index: index + 1, _row: index + (isHeaderRow ? 2 : 1) };
      
      section.fields.forEach((field, i) => {
        let value = values[i]?.trim() || '';
        
        if (field.type === 'number' && value) {
          const num = parseFloat(value.replace(/,/g, ''));
          value = isNaN(num) ? (field.default || 0) : num;
        } else if (field.type === 'number' && !value) {
          value = field.default || 0;
        }
        
        if (!value && field.default !== undefined) {
          value = field.default;
        }
        
        if (field.required && !value) {
          errors.push(`صف ${item._row}: الحقل "${field.label}" مطلوب`);
        }
        
        item[field.key] = value;
      });
      
      item.code = generateCode(section.codePrefix);
      
      return item;
    }).filter(item => {
      const hasAnyValue = section.fields.some(f => {
        const val = item[f.key];
        return val !== '' && val !== 0 && val !== undefined;
      });
      return hasAnyValue;
    });
    
    setImportErrors(errors);
    return parsed;
  };

  const handlePreview = () => {
    if (!activeSection || !pasteData.trim()) return;
    const section = sections.find(s => s.id === activeSection);
    const parsed = parseData(pasteData, section);
    setParsedData(parsed);
    setShowPreview(true);
  };

  const handleImport = async () => {
    if (!parsedData.length) return;
    
    const section = sections.find(s => s.id === activeSection);
    if (!section.onImport) {
      alert('وظيفة الاستيراد غير متاحة لهذا القسم');
      return;
    }

    setLoading(true);
    let successCount = 0;
    const errors = [];
    
    try {
      for (const item of parsedData) {
        try {
          const { _index, _row, ...data } = item;
          await section.onImport(data);
          successCount++;
        } catch (error) {
          errors.push(`صف ${item._row}: ${error.message || 'خطأ في الحفظ'}`);
        }
      }
      
      if (successCount > 0) {
        setImportSuccess(successCount);
        setPasteData('');
        setParsedData([]);
        setShowPreview(false);
        setActiveSection(null);
        setTimeout(() => setImportSuccess(null), 5000);
      }
      
      if (errors.length > 0) {
        setImportErrors(errors);
      }
    } catch (error) {
      console.error('Error importing:', error);
      alert('حدث خطأ أثناء الاستيراد');
    }
    setLoading(false);
  };

  const exportData = (section) => {
    if (!section.data?.length) {
      alert('لا توجد بيانات للتصدير');
      return;
    }

    const headers = section.fields.map(f => f.label).join('\t');
    const rows = section.data.map(item => 
      section.fields.map(f => item[f.key] || '').join('\t')
    ).join('\n');
    
    const content = `${headers}\n${rows}`;
    
    navigator.clipboard.writeText(content);
    setCopied(`export-${section.id}`);
    setTimeout(() => setCopied(null), 2000);
  };

  const removeFromPreview = (index) => {
    setParsedData(prev => prev.filter((_, i) => i !== index));
  };

  const inputStyle = { 
    width: '100%', 
    padding: '10px 14px', 
    borderRadius: 10, 
    border: `1px solid ${t.border.primary}`, 
    background: t.bg.tertiary, 
    color: t.text.primary, 
    fontSize: 14, 
    fontFamily: 'inherit', 
    outline: 'none' 
  };

  return (
    <div style={{ padding: '24px 0', paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: t.text.primary, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <FileSpreadsheet size={28} />
            استيراد وتصدير البيانات
          </h2>
          <p style={{ fontSize: 14, color: t.text.muted, marginTop: 4 }}>رفع البيانات دفعة واحدة من Excel أو Google Sheets</p>
        </div>
      </div>

      {/* رسالة النجاح */}
      {importSuccess && (
        <div style={{ 
          background: t.status.success.bg, 
          border: `1px solid ${t.status.success.border}`,
          borderRadius: 12, 
          padding: 16, 
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
          <CheckCircle size={24} color={t.status.success.text} />
          <span style={{ color: t.status.success.text, fontWeight: 600, fontSize: 15 }}>
            ✅ تم استيراد {importSuccess} عنصر بنجاح!
          </span>
        </div>
      )}

      {/* التعليمات */}
      <div style={{ 
        background: t.bg.secondary, 
        borderRadius: 16, 
        padding: 24, 
        marginBottom: 24,
        border: `1px solid ${t.border.primary}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Info size={22} color={t.button.primary} />
          <h3 style={{ fontSize: 18, fontWeight: 700, color: t.text.primary, margin: 0 }}>📋 طريقة الاستخدام</h3>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {[
            { num: '1', text: 'اختر القسم المطلوب', icon: '📂' },
            { num: '2', text: 'انسخ القالب إلى Excel', icon: '📋' },
            { num: '3', text: 'املأ البيانات في الجدول', icon: '✏️' },
            { num: '4', text: 'حدد وانسخ البيانات', icon: '📑' },
            { num: '5', text: 'الصق في مربع البيانات', icon: '📥' },
            { num: '6', text: 'راجع واستورد', icon: '✅' },
          ].map((step, i) => (
            <div key={i} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 12,
              padding: 12,
              background: t.bg.tertiary,
              borderRadius: 10
            }}>
              <div style={{ 
                width: 32, 
                height: 32, 
                borderRadius: 8, 
                background: t.button.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700,
                fontSize: 14
              }}>
                {step.num}
              </div>
              <span style={{ fontSize: 13, color: t.text.secondary }}>{step.icon} {step.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', 
        gap: 12, 
        marginBottom: 24 
      }}>
        {sections.map((section) => {
          const Icon = section.icon;
          const count = section.data?.length || 0;
          return (
            <div 
              key={section.id}
              style={{ 
                background: t.bg.secondary, 
                borderRadius: 12, 
                padding: 16, 
                textAlign: 'center',
                border: `1px solid ${activeSection === section.id ? section.color : t.border.primary}`,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
            >
              <Icon size={24} color={section.color} style={{ marginBottom: 8 }} />
              <p style={{ fontSize: 20, fontWeight: 700, color: section.color, margin: 0 }}>{count}</p>
              <p style={{ fontSize: 11, color: t.text.muted, margin: '4px 0 0 0' }}>{section.name}</p>
            </div>
          );
        })}
      </div>

      {/* الأقسام */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          const dataCount = section.data?.length || 0;

          return (
            <div 
              key={section.id} 
              style={{ 
                background: t.bg.secondary, 
                borderRadius: 16, 
                border: `2px solid ${isActive ? section.color : t.border.primary}`,
                overflow: 'hidden',
                transition: 'all 0.2s'
              }}
            >
              {/* رأس القسم */}
              <div 
                onClick={() => {
                  setActiveSection(isActive ? null : section.id);
                  setPasteData('');
                  setImportErrors([]);
                }}
                style={{ 
                  padding: 16, 
                  cursor: 'pointer',
                  background: isActive ? `${section.color}10` : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: 12, 
                    background: `linear-gradient(135deg, ${section.color}, ${section.color}aa)`,
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <Icon size={24} color="#fff" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: t.text.primary, margin: 0 }}>{section.name}</h3>
                    <p style={{ fontSize: 12, color: t.text.muted, margin: '4px 0 0 0' }}>
                      {dataCount} عنصر موجود • {section.fields.filter(f => f.required).length} حقول مطلوبة
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ 
                    fontSize: 12, 
                    padding: '6px 12px', 
                    borderRadius: 20, 
                    background: `${section.color}15`, 
                    color: section.color,
                    fontWeight: 600
                  }}>
                    {section.fields.length} حقل
                  </span>
                  {isActive ? <ChevronUp size={20} color={t.text.muted} /> : <ChevronDown size={20} color={t.text.muted} />}
                </div>
              </div>

              {/* محتوى القسم */}
              {isActive && (
                <div style={{ padding: 20, borderTop: `1px solid ${t.border.primary}` }}>
                  {/* الحقول */}
                  <div style={{ marginBottom: 20 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: t.text.secondary, marginBottom: 10 }}>📝 الحقول المتاحة:</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {section.fields.map(field => (
                        <div 
                          key={field.key}
                          style={{ 
                            fontSize: 12, 
                            padding: '8px 14px', 
                            borderRadius: 8,
                            background: field.required ? `${section.color}15` : t.bg.tertiary,
                            color: field.required ? section.color : t.text.secondary,
                            border: `1px solid ${field.required ? section.color : t.border.primary}`,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2
                          }}
                        >
                          <span style={{ fontWeight: 600 }}>{field.label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}</span>
                          <span style={{ fontSize: 10, opacity: 0.7 }}>مثال: {field.example}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* أزرار الإجراءات */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10, marginBottom: 20 }}>
                    <button
                      onClick={() => copyTemplate(section)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: 10,
                        border: `2px solid ${section.color}`,
                        background: 'transparent',
                        color: section.color,
                        cursor: 'pointer',
                        fontSize: 13,
                        fontWeight: 600,
                        fontFamily: 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8
                      }}
                    >
                      {copied === section.id ? <Check size={18} /> : <Copy size={18} />}
                      {copied === section.id ? 'تم النسخ!' : 'نسخ القالب'}
                    </button>
                    <button
                      onClick={() => exportData(section)}
                      disabled={!dataCount}
                      style={{
                        padding: '12px 16px',
                        borderRadius: 10,
                        border: `1px solid ${t.border.primary}`,
                        background: t.bg.tertiary,
                        color: dataCount ? t.text.secondary : t.text.muted,
                        cursor: dataCount ? 'pointer' : 'not-allowed',
                        fontSize: 13,
                        fontWeight: 600,
                        fontFamily: 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        opacity: dataCount ? 1 : 0.5
                      }}
                    >
                      {copied === `export-${section.id}` ? <Check size={18} /> : <Download size={18} />}
                      {copied === `export-${section.id}` ? 'تم النسخ!' : `تصدير (${dataCount})`}
                    </button>
                  </div>

                  {/* مربع اللصق */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: t.text.secondary, marginBottom: 10 }}>
                      <ClipboardPaste size={18} />
                      الصق البيانات هنا:
                    </label>
                    <textarea
                      value={pasteData}
                      onChange={(e) => setPasteData(e.target.value)}
                      placeholder={`انسخ البيانات من Excel والصقها هنا...\n\n💡 القالب:\n${generateTemplate(section)}`}
                      style={{
                        ...inputStyle,
                        minHeight: 160,
                        resize: 'vertical',
                        fontFamily: 'monospace',
                        fontSize: 13,
                        direction: 'rtl',
                        textAlign: 'right',
                        lineHeight: 1.8
                      }}
                    />
                  </div>

                  {/* أخطاء التحقق */}
                  {importErrors.length > 0 && (
                    <div style={{ 
                      background: t.status.danger.bg, 
                      border: `1px solid ${t.status.danger.border}`,
                      borderRadius: 10, 
                      padding: 12, 
                      marginBottom: 16 
                    }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: t.status.danger.text, margin: '0 0 8px 0' }}>
                        ⚠️ أخطاء في البيانات:
                      </p>
                      {importErrors.slice(0, 5).map((error, i) => (
                        <p key={i} style={{ fontSize: 12, color: t.status.danger.text, margin: '4px 0' }}>• {error}</p>
                      ))}
                      {importErrors.length > 5 && (
                        <p style={{ fontSize: 12, color: t.status.danger.text }}>... و {importErrors.length - 5} أخطاء أخرى</p>
                      )}
                    </div>
                  )}

                  {/* زر المعاينة */}
                  <button
                    onClick={handlePreview}
                    disabled={!pasteData.trim()}
                    style={{
                      width: '100%',
                      padding: '14px 24px',
                      borderRadius: 12,
                      border: 'none',
                      background: pasteData.trim() ? `linear-gradient(135deg, ${section.color}, ${section.color}cc)` : t.bg.tertiary,
                      color: pasteData.trim() ? '#fff' : t.text.muted,
                      cursor: pasteData.trim() ? 'pointer' : 'not-allowed',
                      fontSize: 15,
                      fontWeight: 700,
                      fontFamily: 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 10
                    }}
                  >
                    <Eye size={20} />
                    معاينة البيانات قبل الاستيراد
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal المعاينة */}
      <Modal 
        show={showPreview} 
        onClose={() => {
          setShowPreview(false);
          setImportErrors([]);
        }} 
        title={`معاينة البيانات - ${parsedData.length} عنصر`}
        onSubmit={parsedData.length > 0 ? handleImport : null}
        submitText={`✅ استيراد ${parsedData.length} عنصر`}
        loading={loading}
        theme={t}
        wide
      >
        {parsedData.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <AlertTriangle size={56} color={t.status.warning.text} style={{ marginBottom: 16 }} />
            <p style={{ color: t.text.primary, fontSize: 16, fontWeight: 600, marginBottom: 8 }}>لم يتم العثور على بيانات صالحة</p>
            <p style={{ color: t.text.muted, fontSize: 13 }}>تأكد من ملء الحقول المطلوبة (*)</p>
          </div>
        ) : (
          <div>
            <div style={{ 
              background: t.status.success.bg, 
              borderRadius: 10, 
              padding: 12, 
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}>
              <CheckCircle size={20} color={t.status.success.text} />
              <span style={{ color: t.status.success.text, fontSize: 14 }}>
                تم التحقق من {parsedData.length} عنصر - جاهز للاستيراد
              </span>
            </div>

            <div style={{ overflowX: 'auto', borderRadius: 10, border: `1px solid ${t.border.primary}` }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: t.bg.tertiary }}>
                    <th style={{ padding: 12, textAlign: 'center', borderBottom: `2px solid ${t.border.primary}`, color: t.text.muted, width: 50 }}>#</th>
                    {activeSection && sections.find(s => s.id === activeSection)?.fields.map(field => (
                      <th key={field.key} style={{ 
                        padding: 12, 
                        textAlign: 'right', 
                        borderBottom: `2px solid ${t.border.primary}`, 
                        color: field.required ? sections.find(s => s.id === activeSection)?.color : t.text.secondary, 
                        whiteSpace: 'nowrap',
                        fontWeight: 600
                      }}>
                        {field.label}
                      </th>
                    ))}
                    <th style={{ padding: 12, textAlign: 'center', borderBottom: `2px solid ${t.border.primary}`, color: t.text.muted, width: 50 }}>حذف</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedData.map((item, index) => (
                    <tr key={index} style={{ background: index % 2 === 0 ? 'transparent' : t.bg.tertiary }}>
                      <td style={{ padding: 10, borderBottom: `1px solid ${t.border.primary}`, color: t.text.muted, textAlign: 'center' }}>{index + 1}</td>
                      {activeSection && sections.find(s => s.id === activeSection)?.fields.map(field => (
                        <td key={field.key} style={{ 
                          padding: 10, 
                          borderBottom: `1px solid ${t.border.primary}`, 
                          color: t.text.primary, 
                          maxWidth: 180, 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap' 
                        }}>
                          {item[field.key] || <span style={{ color: t.text.muted }}>-</span>}
                        </td>
                      ))}
                      <td style={{ padding: 10, borderBottom: `1px solid ${t.border.primary}`, textAlign: 'center' }}>
                        <button 
                          onClick={() => removeFromPreview(index)}
                          style={{ background: 'none', border: 'none', color: t.status.danger.text, cursor: 'pointer', padding: 4 }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DataImport;
