// src/components/Users.jsx
import React, { useState, useEffect } from 'react';
import { Users as UsersIcon, Plus, Search, Edit, Trash2, AlertTriangle, X, Shield, User, Eye, Crown } from 'lucide-react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { generateCode } from '../utils/helpers';

const Users = ({ currentUser, darkMode, theme }) => {
  const t = theme;
  const colorKeys = t.colorKeys || Object.keys(t.colors);
  
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const emptyForm = { username: '', email: '', role: 'user', status: 'نشط', code: '' };
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const roles = [
    { value: 'owner', label: 'المالك', icon: Crown, color: '#f59e0b' },
    { value: 'admin', label: 'مدير', icon: Shield, color: '#3b82f6' },
    { value: 'user', label: 'مستخدم', icon: User, color: '#10b981' },
    { value: 'viewer', label: 'مشاهد', icon: Eye, color: '#6b7280' },
  ];

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchSearch = user.username?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       user.code?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole === 'all' || user.role === filterRole;
    return matchSearch && matchRole;
  });

  const getRoleInfo = (role) => roles.find(r => r.value === role) || roles[2];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'اسم المستخدم مطلوب';
    if (!formData.email.trim()) newErrors.email = 'البريد الإلكتروني مطلوب';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openAddModal = () => { setFormData({ ...emptyForm, code: generateCode('users') }); setErrors({}); setShowAddModal(true); };
  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({ username: user.username || '', email: user.email || '', role: user.role || 'user', status: user.status || 'نشط', code: user.code || '' });
    setErrors({}); setShowEditModal(true);
  };
  const openDeleteModal = (user) => { setSelectedUser(user); setShowDeleteModal(true); };

  const handleAdd = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try { await addDoc(collection(db, 'users'), { ...formData, createdAt: new Date() }); setShowAddModal(false); setFormData(emptyForm); } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleEdit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try { await updateDoc(doc(db, 'users', selectedUser.id), formData); setShowEditModal(false); } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try { await deleteDoc(doc(db, 'users', selectedUser.id)); setShowDeleteModal(false); } catch (e) { console.error(e); }
    setLoading(false);
  };

  const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: t.radius.lg, border: `1px solid ${t.border.primary}`, background: t.bg.tertiary, color: t.text.primary, fontSize: 14, fontFamily: 'inherit' };
  const labelStyle = { display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: t.text.secondary };

  const Modal = ({ show, onClose, title, children, onSubmit, submitText, danger }) => {
    if (!show) return null;
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }} onClick={onClose}>
        <div style={{ background: t.bg.secondary, borderRadius: t.radius.xl, width: '100%', maxWidth: 500, border: `1px solid ${t.border.primary}`, maxHeight: '90vh', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
          <div style={{ padding: '20px 24px', borderBottom: `1px solid ${t.border.primary}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: t.text.primary, margin: 0 }}>{title}</h3>
            <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: t.radius.md, border: 'none', background: t.bg.tertiary, color: t.text.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20} /></button>
          </div>
          <div style={{ padding: 24, overflowY: 'auto', maxHeight: 'calc(90vh - 140px)' }}>{children}</div>
          <div style={{ padding: '16px 24px', borderTop: `1px solid ${t.border.primary}`, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: t.radius.lg, border: `1px solid ${t.border.primary}`, background: 'transparent', color: t.text.secondary, cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit' }}>إلغاء</button>
            <button onClick={onSubmit} disabled={loading} style={{ padding: '10px 24px', borderRadius: t.radius.lg, border: 'none', background: danger ? t.status.danger.text : t.button.gradient, color: '#fff', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', opacity: loading ? 0.7 : 1 }}>{loading ? 'جاري...' : submitText}</button>
          </div>
        </div>
      </div>
    );
  };

  const isOwner = currentUser?.role === 'owner';

  return (
    <div style={{ padding: '24px 0', paddingBottom: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: t.text.primary, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}><UsersIcon size={28} />المستخدمين</h2>
          <p style={{ fontSize: 14, color: t.text.muted, marginTop: 4 }}>إدارة المستخدمين والصلاحيات</p>
        </div>
        {isOwner && (
          <button onClick={openAddModal} style={{ padding: '12px 24px', borderRadius: t.radius.lg, border: 'none', background: t.button.gradient, color: '#fff', cursor: 'pointer', fontSize: 15, fontWeight: 600, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}><Plus size={20} />إضافة مستخدم</button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 24 }}>
        {roles.map((role, i) => {
          const count = users.filter(u => u.role === role.value).length;
          return (
            <div key={i} style={{ background: t.bg.secondary, borderRadius: t.radius.xl, padding: 16, border: `1px solid ${t.border.primary}`, textAlign: 'center' }}>
              <role.icon size={24} color={role.color} style={{ marginBottom: 8 }} />
              <p style={{ fontSize: 12, color: t.text.muted, margin: '0 0 4px 0' }}>{role.label}</p>
              <p style={{ fontSize: 24, fontWeight: 700, color: role.color, margin: 0 }}>{count}</p>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', background: t.bg.secondary, padding: 16, borderRadius: t.radius.xl, border: `1px solid ${t.border.primary}` }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: t.text.muted }} />
          <input type="text" placeholder="بحث بالاسم أو البريد أو الرمز..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ ...inputStyle, paddingRight: 40 }} />
        </div>
        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} style={{ ...inputStyle, width: 'auto', minWidth: 130, cursor: 'pointer' }}>
          <option value="all">كل الأدوار</option>
          {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
      </div>

      {filteredUsers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, background: t.bg.secondary, borderRadius: t.radius.xl, border: `1px solid ${t.border.primary}` }}>
          <UsersIcon size={48} style={{ color: t.text.muted, marginBottom: 16, opacity: 0.5 }} />
          <p style={{ color: t.text.muted, fontSize: 16 }}>لا يوجد مستخدمين</p>
          {isOwner && <button onClick={openAddModal} style={{ marginTop: 16, padding: '10px 24px', borderRadius: t.radius.lg, border: 'none', background: t.button.gradient, color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit' }}><Plus size={18} style={{ marginLeft: 8, verticalAlign: 'middle' }} />إضافة مستخدم جديد</button>}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filteredUsers.map((user, index) => {
            const roleInfo = getRoleInfo(user.role);
            const RoleIcon = roleInfo.icon;
            const color = t.colors[colorKeys[index % colorKeys.length]] || t.colors[colorKeys[0]];
            const isCurrentUser = currentUser?.email === user.email;

            return (
              <div key={user.id} style={{ background: t.bg.secondary, borderRadius: 16, border: `1px solid ${isCurrentUser ? color.main : t.border.primary}`, overflow: 'hidden' }}>
                {/* Header with Code */}
                <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${t.border.primary}`, background: `${color.main}08` }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: color.main, fontFamily: 'monospace', background: `${color.main}15`, padding: '2px 6px', borderRadius: 4 }}>{user.code || 'U-0000'}</span>
                  {isOwner && !isCurrentUser && (
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={() => openEditModal(user)} style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: t.bg.tertiary, color: t.text.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Edit size={14} /></button>
                      <button onClick={() => openDeleteModal(user)} style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: t.status.danger.bg, color: t.status.danger.text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={14} /></button>
                    </div>
                  )}
                  {isCurrentUser && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: t.status.success.bg, color: t.status.success.text }}>أنت</span>}
                </div>

                {/* Body */}
                <div style={{ padding: 20, textAlign: 'center' }}>
                  <div style={{ width: 56, height: 56, margin: '0 auto 16px', borderRadius: 14, background: color.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={28} color="#fff" />
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: t.text.primary, margin: '0 0 6px 0' }}>{user.username}</h3>
                  <p style={{ fontSize: 12, color: t.text.muted, margin: '0 0 12px 0' }}>{user.email}</p>
                  
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 11, padding: '5px 12px', borderRadius: 20, background: `${roleInfo.color}15`, color: roleInfo.color, display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                      <RoleIcon size={14} />{roleInfo.label}
                    </span>
                    <span style={{ fontSize: 11, padding: '5px 12px', borderRadius: 20, background: user.status === 'نشط' ? t.status.success.bg : t.status.danger.bg, color: user.status === 'نشط' ? t.status.success.text : t.status.danger.text }}>{user.status || 'نشط'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal show={showAddModal} onClose={() => setShowAddModal(false)} title="إضافة مستخدم جديد" onSubmit={handleAdd} submitText="إضافة">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: `${t.button.primary}15`, padding: 12, borderRadius: t.radius.lg, textAlign: 'center' }}>
            <span style={{ fontSize: 12, color: t.text.muted }}>رقم المستخدم</span>
            <p style={{ fontSize: 18, fontWeight: 700, color: t.button.primary, margin: '4px 0 0 0', fontFamily: 'monospace' }}>{formData.code}</p>
          </div>
          <div><label style={labelStyle}>اسم المستخدم *</label><input type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} style={{...inputStyle, borderColor: errors.username ? t.status.danger.text : t.border.primary}} placeholder="اسم المستخدم" />{errors.username && <span style={{ fontSize: 12, color: t.status.danger.text }}>{errors.username}</span>}</div>
          <div><label style={labelStyle}>البريد الإلكتروني *</label><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{...inputStyle, borderColor: errors.email ? t.status.danger.text : t.border.primary}} placeholder="example@email.com" />{errors.email && <span style={{ fontSize: 12, color: t.status.danger.text }}>{errors.email}</span>}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={labelStyle}>الدور</label><select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} style={inputStyle}>{roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}</select></div>
            <div><label style={labelStyle}>الحالة</label><select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} style={inputStyle}><option value="نشط">نشط</option><option value="معطل">معطل</option></select></div>
          </div>
        </div>
      </Modal>

      <Modal show={showEditModal} onClose={() => setShowEditModal(false)} title="تعديل المستخدم" onSubmit={handleEdit} submitText="حفظ التعديلات">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: `${t.button.primary}15`, padding: 12, borderRadius: t.radius.lg, textAlign: 'center' }}>
            <span style={{ fontSize: 12, color: t.text.muted }}>رقم المستخدم</span>
            <p style={{ fontSize: 18, fontWeight: 700, color: t.button.primary, margin: '4px 0 0 0', fontFamily: 'monospace' }}>{formData.code || 'U-0000'}</p>
          </div>
          <div><label style={labelStyle}>اسم المستخدم *</label><input type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} style={{...inputStyle, borderColor: errors.username ? t.status.danger.text : t.border.primary}} /></div>
          <div><label style={labelStyle}>البريد الإلكتروني *</label><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{...inputStyle, borderColor: errors.email ? t.status.danger.text : t.border.primary}} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={labelStyle}>الدور</label><select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} style={inputStyle}>{roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}</select></div>
            <div><label style={labelStyle}>الحالة</label><select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} style={inputStyle}><option value="نشط">نشط</option><option value="معطل">معطل</option></select></div>
          </div>
        </div>
      </Modal>

      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="حذف المستخدم" onSubmit={handleDelete} submitText="حذف" danger>
        <div style={{ textAlign: 'center', padding: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: t.status.danger.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><AlertTriangle size={32} color={t.status.danger.text} /></div>
          <p style={{ fontSize: 16, color: t.text.primary, marginBottom: 8 }}>هل أنت متأكد من حذف المستخدم؟</p>
          <p style={{ fontSize: 18, fontWeight: 700, color: t.status.danger.text }}>{selectedUser?.code} - {selectedUser?.username}</p>
          <p style={{ fontSize: 13, color: t.text.muted, marginTop: 8 }}>لا يمكن التراجع عن هذا الإجراء</p>
        </div>
      </Modal>
    </div>
  );
};

export default Users;
