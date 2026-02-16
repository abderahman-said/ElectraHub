import React, { useState, useEffect } from 'react';
import { Users, Key, Lock, History, Activity, Shield, LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { usersAPI, rolesAPI, permissionsAPI, sessionsAPI, auditLogsAPI } from '../services/api';

const PamDashboard = () => {
  const { user, logout, hasAccessLevel } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [data, setData] = useState({
    users: [],
    roles: [],
    permissions: [],
    sessions: [],
    auditLogs: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const promises = [];

      if (activeTab === 'users' || activeTab === 'overview') {
        promises.push(usersAPI.getUsers());
      }
      if (activeTab === 'roles' || activeTab === 'overview') {
        promises.push(rolesAPI.getRoles());
      }
      if (activeTab === 'permissions' || activeTab === 'overview') {
        promises.push(permissionsAPI.getPermissions());
      }
      if (activeTab === 'sessions' || activeTab === 'overview') {
        promises.push(sessionsAPI.getSessions());
      }
      if (activeTab === 'audit' || activeTab === 'overview') {
        promises.push(auditLogsAPI.getAuditLogs());
      }

      const results = await Promise.all(promises);
      
      const newData = { ...data };
      if (activeTab === 'users' || activeTab === 'overview') {
        newData.users = results[0]?.data || [];
      }
      if (activeTab === 'roles' || activeTab === 'overview') {
        const roleIndex = activeTab === 'overview' ? 
          (newData.users.length > 0 ? 1 : 0) : 0;
        newData.roles = results[roleIndex]?.data || [];
      }
      if (activeTab === 'permissions' || activeTab === 'overview') {
        const permIndex = activeTab === 'overview' ? 
          (newData.users.length > 0 ? (newData.roles.length > 0 ? 2 : 1) : 1) : 0;
        newData.permissions = results[permIndex]?.data || [];
      }
      if (activeTab === 'sessions' || activeTab === 'overview') {
        const sessIndex = activeTab === 'overview' ? 
          (newData.users.length > 0 ? (newData.roles.length > 0 ? (newData.permissions.length > 0 ? 3 : 2) : 1) : 1) : 0;
        newData.sessions = results[sessIndex]?.data || [];
      }
      if (activeTab === 'audit' || activeTab === 'overview') {
        const auditIndex = activeTab === 'overview' ? 
          (newData.users.length > 0 ? (newData.roles.length > 0 ? (newData.permissions.length > 0 ? (newData.sessions.length > 0 ? 4 : 3) : 2) : 1) : 1) : 0;
        newData.auditLogs = results[auditIndex]?.data || [];
      }

      setData(newData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccessLevelColor = (level) => {
    switch (level) {
      case 'super_admin': return 'bg-red-100 text-red-800';
      case 'admin': return 'bg-orange-100 text-orange-800';
      case 'advanced': return 'bg-blue-100 text-blue-800';
      case 'intermediate': return 'bg-purple-100 text-purple-800';
      case 'basic': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: Activity },
    { id: 'users', label: 'المستخدمون', icon: Users },
    { id: 'roles', label: 'الأدوار', icon: Key },
    { id: 'permissions', label: 'الصلاحيات', icon: Lock },
    { id: 'sessions', label: 'الجلسات', icon: Shield },
    { id: 'audit', label: 'سجل التدقيق', icon: History },
  ];

  const filteredTabs = tabs.filter(tab => {
    if (tab.id === 'overview') return true;
    return hasAccessLevel('admin');
  });

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Shield className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">نظام إدارة الصلاحيات</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="flex items-center space-x-2 space-x-reverse">
                <User className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{user?.full_name}</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAccessLevelColor(user?.access_level)}`}>
                  {user?.access_level}
                </span>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 space-x-reverse text-gray-500 hover:text-gray-700"
              >
                <LogOut className="w-5 h-5" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 space-x-reverse">
            {filteredTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 space-x-reverse py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div className="mr-4">
                      <p className="text-sm font-medium text-gray-600">إجمالي المستخدمين</p>
                      <p className="text-2xl font-bold text-gray-900">{data.users.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <Key className="h-8 w-8 text-green-600" />
                    <div className="mr-4">
                      <p className="text-sm font-medium text-gray-600">الأدوار</p>
                      <p className="text-2xl font-bold text-gray-900">{data.roles.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <Shield className="h-8 w-8 text-purple-600" />
                    <div className="mr-4">
                      <p className="text-sm font-medium text-gray-600">جلسات نشطة</p>
                      <p className="text-2xl font-bold text-gray-900">{data.sessions.filter(s => s.is_active).length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <History className="h-8 w-8 text-orange-600" />
                    <div className="mr-4">
                      <p className="text-sm font-medium text-gray-600">نشاط اليوم</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {data.auditLogs.filter(log => {
                          const today = new Date().toDateString();
                          return new Date(log.timestamp).toDateString() === today;
                        }).length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">المستخدمون</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اسم المستخدم</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">البريد الإلكتروني</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم الكامل</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">مستوى الوصول</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">آخر تسجيل دخول</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {data.users.map((user) => (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.full_name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getAccessLevelColor(user.access_level)}`}>
                                {user.access_level}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.last_login ? new Date(user.last_login).toLocaleString('ar-EG') : 'لم يسجل دخوله'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs content would go here */}
            {activeTab !== 'overview' && activeTab !== 'users' && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  {tabs.find(tab => tab.id === activeTab)?.label}
                </h3>
                <p className="text-gray-500">محتوى {tabs.find(tab => tab.id === activeTab)?.label} قيد التطوير...</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PamDashboard;
