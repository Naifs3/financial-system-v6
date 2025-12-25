// src/components/Login.jsx
import React, { useState } from 'react';
import { LogIn, Eye, EyeOff, Mail, Lock, UserPlus } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const Login = ({ onLogin, onShowSignup, darkMode = true, theme }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // استخدام ألوان القالب أو الافتراضية
  const c = {
    bg: theme?.bg?.primary || (darkMode ? '#0a0a0f' : '#f8fafc'),
    card: theme?.bg?.secondary || (darkMode ? '#101018' : '#ffffff'),
    cardAlt: theme?.bg?.tertiary || (darkMode ? '#1a1a28' : '#f1f5f9'),
    border: theme?.border?.primary || (darkMode ? '#252538' : '#e2e8f0'),
    text: theme?.text?.primary || (darkMode ? '#f0f0f8' : '#1e293b'),
    secondary: theme?.text?.secondary || (darkMode ? '#b0b0c0' : '#475569'),
    muted: theme?.text?.muted || (darkMode ? '#707088' : '#94a3b8'),
    accent: theme?.button?.primary || '#00d4ff',
    accentGradient: theme?.button?.gradient || 'linear-gradient(135deg, #0099bb, #00d4ff)',
    accentGlow: theme?.button?.glow || '0 0 20px #00d4ff40',
    danger: theme?.status?.danger?.text || '#f87171',
    dangerBg: theme?.status?.danger?.bg || '#f8717115',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      
      const userDoc = await getDoc(doc(db, 'users', uid));
      
      if (!userDoc.exists()) {
        setError('بيانات المستخدم غير موجودة');
        setLoading(false);
        return;
      }

      const userData = userDoc.data();

      if (!userData.approved) {
        setError('حسابك في انتظار موافقة المدير');
        setLoading(false);
        return;
      }

      if (!userData.active) {
        setError('هذا الحساب غير نشط');
        setLoading(false);
        return;
      }

      onLogin({
        id: uid,
        email: userCredential.user.email,
        username: userData.username,
        role: userData.role,
        active: userData.active,
        approved: userData.approved
      });

    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'auth/invalid-credential') {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      } else if (error.code === 'auth/user-not-found') {
        setError('المستخدم غير موجود');
      } else if (error.code === 'auth/wrong-password') {
        setError('كلمة المرور غير صحيحة');
      } else if (error.code === 'auth/too-many-requests') {
        setError('محاولات كثيرة. حاول مرة أخرى لاحقاً');
      } else {
        setError('حدث خطأ في تسجيل الدخول');
      }
      setLoading(false);
    }
  };

  // الأنماط المشتركة
  const inputStyle = {
    width: '100%',
    padding: '14px 44px 14px 44px',
    background: c.cardAlt,
    border: `1px solid ${c.border}`,
    borderRadius: 12,
    color: c.text,
    fontSize: 14,
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'all 0.2s',
  };

  const labelStyle = {
    display: 'block',
    fontSize: 13,
    fontWeight: 500,
    color: c.secondary,
    marginBottom: 8,
  };

  return (
    <div 
      dir="rtl" 
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${c.bg} 0%, ${c.card} 50%, ${c.bg} 100%)`,
        padding: 16,
        fontFamily: 'inherit',
      }}
    >
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>

      <div style={{ width: '100%', maxWidth: 420 }}>
        <div 
          style={{
            background: `${c.card}ee`,
            backdropFilter: 'blur(12px)',
            borderRadius: 24,
            padding: 32,
            border: `1px solid ${c.border}`,
            boxShadow: darkMode ? `0 25px 50px -12px rgba(0,0,0,0.5), 0 0 40px ${c.accent}10` : '0 25px 50px -12px rgba(0,0,0,0.1)',
          }}
        >
          {/* الشعار والعنوان */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                background: c.accentGradient,
                borderRadius: 20,
                marginBottom: 16,
                boxShadow: darkMode ? c.accentGlow : 'none',
              }}
            >
              <span style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: -1 }}>RKZ</span>
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: c.text, margin: '0 0 8px' }}>
              نظام الإدارة المالية
            </h1>
            <p style={{ fontSize: 14, color: c.muted, margin: 0 }}>
              ركائز الأولى للتعمير
            </p>
          </div>

          {/* رسالة الخطأ */}
          {error && (
            <div 
              style={{
                marginBottom: 24,
                padding: 16,
                background: c.dangerBg,
                border: `1px solid ${c.danger}30`,
                borderRadius: 12,
              }}
            >
              <p style={{ color: c.danger, fontSize: 14, textAlign: 'center', margin: 0 }}>
                {error}
              </p>
            </div>
          )}

          {/* النموذج */}
          <form onSubmit={handleSubmit}>
            {/* البريد الإلكتروني */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>البريد الإلكتروني</label>
              <div style={{ position: 'relative' }}>
                <div 
                  style={{
                    position: 'absolute',
                    right: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: c.muted,
                    display: 'flex',
                  }}
                >
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="أدخل البريد الإلكتروني"
                  style={{
                    ...inputStyle,
                    paddingLeft: 16,
                  }}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* كلمة المرور */}
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>كلمة المرور</label>
              <div style={{ position: 'relative' }}>
                <div 
                  style={{
                    position: 'absolute',
                    right: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: c.muted,
                    display: 'flex',
                  }}
                >
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  style={inputStyle}
                  required
                  disabled={loading}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  style={{
                    position: 'absolute',
                    left: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: c.muted,
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    transition: 'color 0.2s',
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* زر تسجيل الدخول */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: 16,
                background: c.accentGradient,
                border: 'none',
                borderRadius: 14,
                color: '#fff',
                fontSize: 16,
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                fontFamily: 'inherit',
                boxShadow: darkMode ? c.accentGlow : 'none',
                transition: 'all 0.2s',
              }}
            >
              {loading ? (
                <>
                  <div 
                    style={{
                      width: 20,
                      height: 20,
                      border: '2px solid #fff',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                    }}
                  />
                  جاري تسجيل الدخول...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  تسجيل الدخول
                </>
              )}
            </button>
          </form>

          {/* الفاصل */}
          <div 
            style={{
              marginTop: 24,
              paddingTop: 24,
              borderTop: `1px solid ${c.border}`,
            }}
          >
            <button
              onClick={onShowSignup}
              style={{
                width: '100%',
                padding: 14,
                background: c.cardAlt,
                border: `1px solid ${c.border}`,
                borderRadius: 14,
                color: c.text,
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                fontFamily: 'inherit',
                transition: 'all 0.2s',
              }}
            >
              <UserPlus size={20} />
              إنشاء حساب جديد
            </button>
          </div>

          {/* التذييل */}
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: c.muted, margin: '0 0 4px' }}>
              نظام الإدارة المالية v7.0
            </p>
            <p style={{ fontSize: 11, color: `${c.muted}80`, margin: 0 }}>
              جميع الحقوق محفوظة © 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
