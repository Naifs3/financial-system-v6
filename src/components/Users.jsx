🚀 Users.jsx - إدارة المستخدمين!

📝 الخطوة التالية:
Add file → Create new file
اكتب:
src/components/Users.jsx

📄 الصق هذا الكود:
javascript// src/components/Users.jsx
import React, { useState } from 'react';
import { Users as UsersIcon, Plus, Search, Edit, Trash2, Shield, CheckCircle, Clock, UserCheck } from 'lucide-react';
import { decrypt } from '../utils/helpers';

const Users = ({ users, currentUser, onAdd, onApprove, onToggleActive, onDelete, darkMode, txt, txtSm, card, accentGradient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // تصفية المستخدمين
  const filteredUsers = users.filter(user => {
    const username = decrypt(user.username);
    const matchSearch = username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole === 'all' || user.role === filterRole;
    const matchStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && user.active) ||
      (filterStatus === 'inactive' && !user.active) ||
      (filterStatus === 'pending' && !user.approved);
    return matchSearch && matchRole && matchStatus;
  });

  // حساب الإحصائيات
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.active).length;
  const pendingApprovals = users.filter(u => !u.approved).length;
  const ownerCount = users.filter(u => u.role === 'owner').length;
  const managerCount = users.filter(u => u.role === 'manager').length;

  // ألوان الأدوار
  const getRoleColor = (role) => {
    switch (role) {
      case 'owner': return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' };
      case 'manager': return { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' };
      case 'member': return { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30' };
      default: return { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30' };
    }
  };

  const getRoleName = (role) => {
    switch (role) {
      case 'owner': return 'مالك';
      case 'manager': return 'مدير';
      case 'member': return 'عضو';
      default: return role;
    }
  };

  // التحقق من الصلاحيات
  const canModifyUser = (user) => {
    // المالك يمكنه تعديل الكل
    if (currentUser.role === 'owner') return true;
    // المدير يمكنه تعديل الأعضاء فقط
    if (currentUser.role === 'manager' && user.role === 'member') return true;
    return false;
  };

  const canDeleteUser = (user) => {
    // لا يمكن حذف المالك أو نفسك
    if (user.role === 'owner' || user.id === currentUser.id) return false;
    // المالك يمكنه حذف الكل
    if (currentUser.role === 'owner') return true;
    // المدير يمكنه حذف الأعضاء فقط
    if (currentUser.role === 'manager' && user.role === 'member') return true;
    return false;
  };

  return (
    <div className="p-4 space-y-6 pb-20 md:pb-6">
      {/* العنوان */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${txt} flex items-center gap-2`}>
            <UsersIcon className="w-6 h-6" />
            المستخدمين
          </h2>
          <p className={`text-sm ${txtSm} mt-1`}>إدارة المستخدمين والصلاحيات</p>
        </div>
        {(currentUser.role === 'owner' || currentUser.role === 'manager') && (
          <button
            onClick={() => setShowAddModal(true)}
            className={`px-4 py-2 rounded-xl bg-gradient-to-r ${accentGradient} text-white transition-all hover:opacity-90 flex items-center gap-2`}
          >
            <Plus className="w-4 h-4" />
            إضافة مستخدم
          </button>
        )}
      </div>

      {/* الإحصائيات */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className={`${card} p-4 rounded-xl border ${darkMode ? 'border-blue-500/30' : 'border-blue-200'} bg-blue-500/10`}>
          <p className={`text-sm ${txtSm} mb-1`}>إجمالي</p>
          <p className="text-2xl font-bold text-blue-400">{totalUsers}</p>
        </div>
        <div className={`${card} p-4 rounded-xl border ${darkMode ? 'border-green-500/30' : 'border-green-200'} bg-green-500/10`}>
          <p className={`text-sm ${txtSm} mb-1`}>نشط</p>
          <p className="text-2xl font-bold text-green-400">{activeUsers}</p>
        </div>
        <div className={`${card} p-4 rounded-xl border ${darkMode ? 'border-orange-500/30' : 'border-orange-200'} bg-orange-500/10`}>
          <p className={`text-sm ${txtSm} mb-1`}>بانتظار الموافقة</p>
          <p className="text-2xl font-bold text-orange-400">{pendingApprovals}</p>
        </div>
        <div className={`${card} p-4 rounded-xl border ${darkMode ? 'border-red-500/30' : 'border-red-200'} bg-red-500/10`}>
          <p className={`text-sm ${txtSm} mb-1`}>مالك</p>
          <p className="text-2xl font-bold text-red-400">{ownerCount}</p>
        </div>
        <div className={`${card} p-4 rounded-xl border ${darkMode ? 'border-purple-500/30' : 'border-purple-200'} bg-purple-500/10`}>
          <p className={`text-sm ${txtSm} mb-1`}>مدير</p>
          <p className="text-2xl font-bold text-purple-400">{managerCount}</p>
        </div>
      </div>

      {/* التنبيهات */}
      {pendingApprovals > 0 && (
        <div className={`${card} p-4 rounded-xl border border-orange-500/30 bg-orange-500/10`}>
          <h3 className={`font-bold ${txt} mb-2 flex items-center gap-2`}>
            <Clock className="w-5 h-5 text-orange-400" />
            طلبات جديدة
          </h3>
          <p className={`text-sm text-orange-400`}>
            لديك {pendingApprovals} طلب{pendingApprovals > 1 ? 'ات' : ''} بانتظار الموافقة
          </p>
        </div>
      )}

      {/* البحث والتصفية */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 ${txtSm}`} />
          <input
            type="text"
            placeholder="بحث في المستخدمين..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pr-10 pl-4 py-2 rounded-xl border ${
              darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className={`px-4 py-2 rounded-xl border ${
            darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="all">كل الأدوار</option>
          <option value="owner">مالك</option>
          <option value="manager">مدير</option>
          <option value="member">عضو</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={`px-4 py-2 rounded-xl border ${
            darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="all">كل الحالات</option>
          <option value="active">نشط</option>
          <option value="inactive">غير نشط</option>
          <option value="pending">بانتظار الموافقة</option>
        </select>
      </div>

      {/* قائمة المستخدمين */}
      {filteredUsers.length === 0 ? (
        <div className={`${card} p-12 rounded-2xl text-center border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <UsersIcon className={`w-16 h-16 mx-auto mb-4 ${txtSm}`} />
          <p className={`${txt} font-bold mb-2`}>لا يوجد مستخدمين</p>
          <p className={`${txtSm} text-sm`}>ابدأ بإضافة أول مستخدم</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => {
            const roleColor = getRoleColor(user.role);
            const isCurrentUser = user.id === currentUser.id;
            const username = decrypt(user.username);
            
            return (
              <div
                key={user.id}
                className={`${card} p-5 rounded-2xl border ${
                  isCurrentUser 
                    ? 'border-blue-500/50 ring-2 ring-blue-500/30' 
                    : darkMode ? 'border-gray-700' : 'border-gray-200'
                } hover:shadow-lg transition-all`}
              >
                {/* رأس المستخدم */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${accentGradient} flex items-center justify-center text-white font-bold text-lg`}>
                      {username.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-bold ${txt} text-lg truncate`}>{username}</h3>
                      <div className="flex items-center gap-2 flex-wrap mt-1">
                        <span className={`text-xs px-2 py-1 rounded ${roleColor.bg} ${roleColor.text} flex items-center gap-1`}>
                          <Shield className="w-3 h-3" />
                          {getRoleName(user.role)}
                        </span>
                        {isCurrentUser && (
                          <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400">
                            أنت
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* الحالة */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${txtSm}`}>الحالة:</span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      user.active 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {user.active ? 'نشط' : 'غير نشط'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${txtSm}`}>الموافقة:</span>
                    {user.approved ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <Clock className="w-5 h-5 text-orange-400" />
                    )}
                  </div>
                  {user.createdAt && (
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${txtSm}`}>تاريخ الإنشاء:</span>
                      <span className={`text-sm ${txt}`}>
                        {new Date(user.createdAt).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                  )}
                  {user.createdBy && (
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${txtSm}`}>أنشئ بواسطة:</span>
                      <span className={`text-sm ${txt}`}>{user.createdBy}</span>
                    </div>
                  )}
                </div>

                {/* الأزرار */}
                <div className="flex gap-2 pt-4 border-t border-gray-700">
                  {/* الموافقة */}
                  {!user.approved && (currentUser.role === 'owner' || currentUser.role === 'manager') && (
                    <button
                      onClick={() => onApprove(user.id)}
                      className="flex-1 p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <UserCheck className="w-4 h-4" />
                      موافقة
                    </button>
                  )}
                  
                  {/* تفعيل/تعطيل */}
                  {canModifyUser(user) && user.role !== 'owner' && !isCurrentUser && (
                    <button
                      onClick={() => onToggleActive(user.id)}
                      className={`flex-1 p-2 rounded-lg ${
                        user.active 
                          ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30' 
                          : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                      } transition-colors text-sm`}
                    >
                      {user.active ? 'تعطيل' : 'تفعيل'}
                    </button>
                  )}
                  
                  {/* تعديل */}
                  {canModifyUser(user) && (
                    <button
                      onClick={() => onEdit(user)}
                      className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${txt} transition-colors`}
                      title="تعديل"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  
                  {/* حذف */}
                  {canDeleteUser(user) && (
                    <button
                      onClick={() => onDelete(user.id)}
                      className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Users;
```
