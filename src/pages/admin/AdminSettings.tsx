import React, { useState } from 'react';
import { Save, Mail, Bell, Shield, Database } from 'lucide-react';
import toast from 'react-hot-toast';

interface SettingsSection {
  id: string;
  title: string;
  icon: any;
  description: string;
}

const sections: SettingsSection[] = [
  {
    id: 'notifications',
    title: 'Notificaciones',
    icon: Bell,
    description: 'Configura las notificaciones del sistema y alertas automáticas.',
  },
  {
    id: 'email',
    title: 'Configuración de Correo',
    icon: Mail,
    description: 'Gestiona las plantillas de correo y configuración SMTP.',
  },
  {
    id: 'security',
    title: 'Seguridad',
    icon: Shield,
    description: 'Configura la autenticación y políticas de seguridad.',
  },
  {
    id: 'backup',
    title: 'Copias de Seguridad',
    icon: Database,
    description: 'Gestiona las copias de seguridad automáticas del sistema.',
  },
];

export const AdminSettings = () => {
  const [activeSection, setActiveSection] = useState('notifications');
  const [settings, setSettings] = useState({
    notifications: {
      orderUpdates: true,
      lowStock: true,
      newCustomers: false,
      marketingEmails: true,
    },
    email: {
      smtpServer: 'smtp.example.com',
      smtpPort: '587',
      smtpUser: 'user@example.com',
      emailFrom: 'noreply@modernshop.com',
    },
    security: {
      twoFactorAuth: false,
      passwordExpiration: '90',
      sessionTimeout: '30',
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'daily',
      retentionDays: '30',
    },
  });

  const handleSettingChange = (section: string, setting: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [setting]: value,
      },
    }));
  };

  const handleSave = () => {
    // Aquí iría la lógica para guardar la configuración
    toast.success('Configuración guardada correctamente');
  };

  const renderNotificationSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-900">Actualizaciones de Pedidos</h4>
          <p className="text-sm text-gray-500">Recibe notificaciones cuando el estado de un pedido cambie</p>
        </div>
        <input
          type="checkbox"
          checked={settings.notifications.orderUpdates}
          onChange={(e) => handleSettingChange('notifications', 'orderUpdates', e.target.checked)}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-900">Alertas de Stock Bajo</h4>
          <p className="text-sm text-gray-500">Notificaciones cuando el inventario esté bajo</p>
        </div>
        <input
          type="checkbox"
          checked={settings.notifications.lowStock}
          onChange={(e) => handleSettingChange('notifications', 'lowStock', e.target.checked)}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-4">
      <div>
        <label htmlFor="smtpServer" className="block text-sm font-medium text-gray-700">
          Servidor SMTP
        </label>
        <input
          type="text"
          id="smtpServer"
          value={settings.email.smtpServer}
          onChange={(e) => handleSettingChange('email', 'smtpServer', e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="smtpPort" className="block text-sm font-medium text-gray-700">
          Puerto SMTP
        </label>
        <input
          type="text"
          id="smtpPort"
          value={settings.email.smtpPort}
          onChange={(e) => handleSettingChange('email', 'smtpPort', e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-900">Autenticación de Dos Factores</h4>
          <p className="text-sm text-gray-500">Requiere verificación adicional al iniciar sesión</p>
        </div>
        <input
          type="checkbox"
          checked={settings.security.twoFactorAuth}
          onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
      </div>
      <div>
        <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700">
          Tiempo de Expiración de Sesión (minutos)
        </label>
        <input
          type="number"
          id="sessionTimeout"
          value={settings.security.sessionTimeout}
          onChange={(e) => handleSettingChange('security', 'sessionTimeout', e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-900">Copias de Seguridad Automáticas</h4>
          <p className="text-sm text-gray-500">Realizar copias de seguridad automáticamente</p>
        </div>
        <input
          type="checkbox"
          checked={settings.backup.autoBackup}
          onChange={(e) => handleSettingChange('backup', 'autoBackup', e.target.checked)}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
      </div>
      <div>
        <label htmlFor="backupFrequency" className="block text-sm font-medium text-gray-700">
          Frecuencia de Copias de Seguridad
        </label>
        <select
          id="backupFrequency"
          value={settings.backup.backupFrequency}
          onChange={(e) => handleSettingChange('backup', 'backupFrequency', e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="daily">Diaria</option>
          <option value="weekly">Semanal</option>
          <option value="monthly">Mensual</option>
        </select>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'notifications':
        return renderNotificationSettings();
      case 'email':
        return renderEmailSettings();
      case 'security':
        return renderSecuritySettings();
      case 'backup':
        return renderBackupSettings();
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Configuración</h2>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          <Save className="h-4 w-4" />
          Guardar Cambios
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-2 px-4 py-2 text-left rounded-md ${
                activeSection === section.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <section.icon className="h-5 w-5" />
              {section.title}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="space-y-6">{renderContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
