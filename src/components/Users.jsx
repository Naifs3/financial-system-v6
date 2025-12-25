// src/components/Users.jsx
import React, { useState, useEffect } from 'react';
import { 
  Users as UsersIcon, 
  CheckCircle, 
  XCircle, 
  Shield, 
  User as UserIcon, 
  Clock,
  Mail,
  AlertTriangle,
  UserCheck,
  UserX
} from 'lucide-react';
import { collection, onSnapshot, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

const Users = ({ currentUser, darkMode, theme }) => {
  const t = theme;
  const colorKeys = t.colorKeys || Object.keys(t.colors);
  
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'users'), orderBy('createdAt', 'desc')),
      snapshot => {
        const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);
      },
      error => console.error('Users error:', error)
    );

    return () => unsubscribe();
  }, []);

  const handleApprove = async (userId) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        approved: true,
        active: true,
        approvedAt: new Date().toISOString(),
        approvedBy: currentUser.username
      });
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleReject = async (userId) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        approved: false,
        active: false
      });
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };

  const handleToggleActive = async (userId, currentStatus) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        active: !currentStatus
      });
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    if (filter === 'pending') return !user.approved;
    if (filter === 'approved') return user.approved && user.active;
    if (filter === 'inactive') return !user.active;
    return true;
  });

  const pendingCount = users.filter(u => !u.approved).length;
  const approvedCount = users.filter(u => u.approved && u.active).length;
  const inactiveCount = users.filter(u => !u.active).length;

  // الأزرار الفلترية
  const filterButtons = [
    { id: 'all', label: 'الكل', count: users.length },
    { id: 'pending', label: 'في الانتظار', count: pendingCount, alert: pendingCount > 0 },
    { id: 'approved', label: 'معتمد', count: approvedCount },
    { id: 'inactive', label: 'غير نشط', count: inactiveCount },
  ];

  // صفحة عدم الصلاحية
  if (currentUser.role !== 'owner') {
    return (
      <div style={{ padding: 24 }}>
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
            background: `${t.status.danger.text}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <Shield size={40} color={t.status.danger.text} />
          </div>
          <p style={{ fontSize: 18, fontWeight: 700, color: t.text.primary, marginBottom: 8 }}>
            ليس لديك صلاحية لعرض هذه الصفحة
          </p>
          <p style={{ fontSize: 14, color: t.text.muted }}>
            هذه الصفحة متاحة فقط لمالك النظام
          </p>
        </div>
      </div>
    );
  }

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
            background: t.colors[colorKeys[4]]?.gradient || t.button.gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: darkMode ? t.colors[colorKeys[4]]?.glow : 'none',
          }}>
            <UsersIcon size={22} color="#fff" />
          </div>
          إدارة المستخدمين
        </h2>
        <p style={{ fontSize: 14, color: t.text.muted, marginTop: 6, marginRight: 50 }}>
          الموافقة على الطلبات الجديدة وإدارة الحسابات
        </p>
      </div>

      {/* ═══════════════ أزرار الفلترة ═══════════════ */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 24,
      }}>
        {filterButtons.map((btn) => (
          <button
            key={btn.id}
            onClick={() => setFilter(btn.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: t.radius.lg,
              border: 'none',
              background: filter === btn.id ? t.button.gradient : t.bg.tertiary,
              color: filter === btn.id ? '#fff' : t.text.secondary,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              fontFamily: 'inherit',
              boxShadow: filter === btn.id ? t.button.glow : 'none',
              transition: 'all 0.2s',
              position: 'relative',
            }}
          >
            {btn.label} ({btn.count})
            {btn.alert && (
              <span style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: t.status.danger.text,
                animation: 'pulse 1.5s infinite',
              }} />
            )}
          </button>
        ))}
      </div>

      {/* ═══════════════ تنبيه الطلبات المعلقة ═══════════════ */}
      {pendingCount > 0 && filter !== 'pending' && (
        <div style={{
          background: t.status.warning.bg,
          border: `1px solid ${t.status.warning.border}`,
          borderRadius: t.radius.xl,
          padding: 16,
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
        }}>
          <AlertTriangle size={20} color={t.status.warning.text} />
          <p style={{ fontSize: 14, color: t.status.warning.text, margin: 0 }}>
            لديك <strong>{pendingCount}</strong> طلب جديد في انتظار الموافقة
          </p>
        </div>
      )}

      {/* ═══════════════ قائمة المستخدمين ═══════════════ */}
      {filteredUsers.length === 0 ? (
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
            <UsersIcon size={40} color={t.text.muted} />
          </div>
          <p style={{ fontSize: 18, fontWeight: 700, color: t.text.primary, marginBottom: 8 }}>
            لا يوجد مستخدمين
          </p>
          <p style={{ fontSize: 14, color: t.text.muted }}>
            لا توجد نتائج مطابقة للفلتر المحدد
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredUsers.map((user) => {
            const isOwner = user.role === 'owner';
            const isPending = !user.approved;
            const isActive = user.active;
            const isCurrentUser = user.id === currentUser.id;
            
            // تحديد لون الحدود
            let borderColor = t.border.primary;
            if (isPending) borderColor = t.status.warning.border;
            else if (isActive) borderColor = t.status.success.border;
            else borderColor = t.status.danger.border;
            
            return (
              <div
                key={user.id}
                style={{
                  background: t.bg.secondary,
                  borderRadius: t.radius.xl,
                  border: `1px solid ${borderColor}`,
                  padding: 20,
                  transition: 'all 0.3s ease',
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 16,
                }}>
                  {/* معلومات المستخدم */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    {/* أيقونة المستخدم */}
                    <div style={{
                      width: 52,
                      height: 52,
                      borderRadius: t.radius.lg,
                      background: isOwner 
                        ? t.colors[colorKeys[2]]?.gradient 
                        : t.colors[colorKeys[0]]?.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: darkMode 
                        ? (isOwner ? t.colors[colorKeys[2]]?.glow : t.colors[colorKeys[0]]?.glow)
                        : 'none',
                    }}>
                      {isOwner ? (
                        <Shield size={26} color="#fff" />
                      ) : (
                        <UserIcon size={26} color="#fff" />
                      )}
                    </div>
                    
                    {/* البيانات */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <p style={{ 
                          fontSize: 16, 
                          fontWeight: 700, 
                          color: t.text.primary,
                          margin: 0,
                        }}>
                          {user.username}
                        </p>
                        
                        {/* شارة الحالة */}
                        {isPending && (
                          <span style={{
                            fontSize: 11,
                            fontWeight: 600,
                            padding: '4px 10px',
                            borderRadius: t.radius.full,
                            background: t.status.warning.bg,
                            color: t.status.warning.text,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}>
                            <Clock size={12} />
                            في الانتظار
                          </span>
                        )}
                        {!isPending && isActive && (
                          <span style={{
                            fontSize: 11,
                            fontWeight: 600,
                            padding: '4px 10px',
                            borderRadius: t.radius.full,
                            background: t.status.success.bg,
                            color: t.status.success.text,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}>
                            <UserCheck size={12} />
                            معتمد
                          </span>
                        )}
                        {!isPending && !isActive && (
                          <span style={{
                            fontSize: 11,
                            fontWeight: 600,
                            padding: '4px 10px',
                            borderRadius: t.radius.full,
                            background: t.status.danger.bg,
                            color: t.status.danger.text,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}>
                            <UserX size={12} />
                            غير نشط
                          </span>
                        )}
                      </div>
                      
                      {/* البريد */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <Mail size={14} color={t.text.muted} />
                        <p style={{ fontSize: 13, color: t.text.muted, margin: 0 }}>
                          {user.email}
                        </p>
                      </div>
                      
                      {/* الدور */}
                      <p style={{ fontSize: 12, color: t.text.muted, margin: 0 }}>
                        {isOwner ? '👑 مالك النظام' : '👤 مستخدم'}
                      </p>
                    </div>
                  </div>

                  {/* أزرار التحكم */}
                  {!isCurrentUser && (
                    <div style={{ display: 'flex', gap: 8 }}>
                      {isPending && (
                        <>
                          <button
                            onClick={() => handleApprove(user.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              padding: '10px 18px',
                              borderRadius: t.radius.lg,
                              border: 'none',
                              background: 'linear-gradient(135deg, #059669, #10b981)',
                              color: '#fff',
                              cursor: 'pointer',
                              fontSize: 13,
                              fontWeight: 600,
                              fontFamily: 'inherit',
                              transition: 'all 0.2s',
                            }}
                          >
                            <CheckCircle size={16} />
                            موافقة
                          </button>
                          <button
                            onClick={() => handleReject(user.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              padding: '10px 18px',
                              borderRadius: t.radius.lg,
                              border: 'none',
                              background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                              color: '#fff',
                              cursor: 'pointer',
                              fontSize: 13,
                              fontWeight: 600,
                              fontFamily: 'inherit',
                              transition: 'all 0.2s',
                            }}
                          >
                            <XCircle size={16} />
                            رفض
                          </button>
                        </>
                      )}
                      {!isPending && (
                        <button
                          onClick={() => handleToggleActive(user.id, isActive)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '10px 18px',
                            borderRadius: t.radius.lg,
                            border: 'none',
                            background: isActive 
                              ? 'linear-gradient(135deg, #dc2626, #ef4444)'
                              : 'linear-gradient(135deg, #059669, #10b981)',
                            color: '#fff',
                            cursor: 'pointer',
                            fontSize: 13,
                            fontWeight: 600,
                            fontFamily: 'inherit',
                            transition: 'all 0.2s',
                          }}
                        >
                          {isActive ? (
                            <>
                              <UserX size={16} />
                              تعطيل
                            </>
                          ) : (
                            <>
                              <UserCheck size={16} />
                              تفعيل
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CSS للأنيميشن */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default Users;
