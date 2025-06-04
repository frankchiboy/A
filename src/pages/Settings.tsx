import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Settings as SettingsIcon, Users, PaintBucket, Bell, Shield, Database, Globe, Moon, Sun, Monitor } from 'lucide-react';

export const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('appearance');
  
  const tabs = [
    { id: 'appearance', label: '外觀設定', icon: <PaintBucket size={18} /> },
    { id: 'notifications', label: '通知設定', icon: <Bell size={18} /> },
    { id: 'team', label: '團隊管理', icon: <Users size={18} /> },
    { id: 'security', label: '安全設定', icon: <Shield size={18} /> },
    { id: 'data', label: '資料管理', icon: <Database size={18} /> },
    { id: 'language', label: '語言設定', icon: <Globe size={18} /> }
  ];

  return (
    <div className="flex h-full">
      <div className="w-64 border-r border-slate-200 bg-white">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center">
            <SettingsIcon size={20} className="text-slate-700 mr-2" />
            <h2 className="text-lg font-semibold text-slate-800">設定</h2>
          </div>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-1">
            {tabs.map(tab => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center w-full px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'bg-purple-50 text-purple-700 font-medium'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <span className="mr-3">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      <div className="relative flex-1 overflow-auto bg-[url('https://images.pexels.com/photos/3182743/pexels-photo-3182743.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center">
        <div className="absolute inset-0 bg-white/90 backdrop-blur-[1px]"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto p-8">
          {activeTab === 'appearance' && (
            <div>
              <h2 className="text-xl font-semibold text-slate-800 mb-6">外觀設定</h2>
              
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
                <div className="p-6 border-b border-slate-200">
                  <h3 className="font-medium text-slate-800">主題設定</h3>
                  <p className="text-sm text-slate-500 mt-1">選擇您偏好的顯示主題</p>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div 
                      onClick={() => setTheme('light')}
                      className={`cursor-pointer rounded-lg border p-4 flex flex-col items-center transition-colors ${
                        theme === 'light'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-slate-200 hover:border-purple-300 bg-white'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-white border border-slate-300 shadow-sm flex items-center justify-center mb-3">
                        <Sun size={24} className="text-amber-500" />
                      </div>
                      <h4 className="font-medium text-slate-800">淺色模式</h4>
                      <p className="text-xs text-slate-500 mt-1">明亮的背景和對比色</p>
                    </div>
                    
                    <div 
                      onClick={() => setTheme('dark')}
                      className={`cursor-pointer rounded-lg border p-4 flex flex-col items-center transition-colors ${
                        theme === 'dark'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-slate-200 hover:border-purple-300 bg-white'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 shadow-sm flex items-center justify-center mb-3">
                        <Moon size={24} className="text-slate-300" />
                      </div>
                      <h4 className="font-medium text-slate-800">深色模式</h4>
                      <p className="text-xs text-slate-500 mt-1">深色背景降低眼睛疲勞</p>
                    </div>
                    
                    <div 
                      onClick={() => setTheme('system')}
                      className={`cursor-pointer rounded-lg border p-4 flex flex-col items-center transition-colors ${
                        theme === 'system'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-slate-200 hover:border-purple-300 bg-white'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white to-slate-800 border border-slate-300 shadow-sm flex items-center justify-center mb-3">
                        <Monitor size={24} className="text-purple-500" />
                      </div>
                      <h4 className="font-medium text-slate-800">系統設定</h4>
                      <p className="text-xs text-slate-500 mt-1">跟隨您的系統主題</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
                <div className="p-6 border-b border-slate-200">
                  <h3 className="font-medium text-slate-800">佈局選項</h3>
                  <p className="text-sm text-slate-500 mt-1">自定義界面佈局</p>
                </div>
                
                <div className="p-6">
                  <div className="mb-6 last:mb-0">
                    <h4 className="text-sm font-medium text-slate-800 mb-3">密度</h4>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="density"
                          className="form-radio h-4 w-4 text-purple-600 border-slate-300 focus:ring-purple-500"
                          defaultChecked
                        />
                        <span className="ml-2 text-sm text-slate-700">標準</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="density"
                          className="form-radio h-4 w-4 text-purple-600 border-slate-300 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm text-slate-700">緊湊</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="density"
                          className="form-radio h-4 w-4 text-purple-600 border-slate-300 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm text-slate-700">寬鬆</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                  <h3 className="font-medium text-slate-800">顏色配置</h3>
                  <p className="text-sm text-slate-500 mt-1">自定義界面顏色</p>
                </div>
                
                <div className="p-6">
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-slate-800 mb-3">強調色</h4>
                    <div className="flex gap-3">
                      <button className="w-8 h-8 rounded-full bg-purple-500 ring-2 ring-offset-2 ring-purple-500"></button>
                      <button className="w-8 h-8 rounded-full bg-indigo-500 hover:ring-2 hover:ring-offset-2 hover:ring-indigo-500 transition-all"></button>
                      <button className="w-8 h-8 rounded-full bg-violet-500 hover:ring-2 hover:ring-offset-2 hover:ring-violet-500 transition-all"></button>
                      <button className="w-8 h-8 rounded-full bg-emerald-500 hover:ring-2 hover:ring-offset-2 hover:ring-emerald-500 transition-all"></button>
                      <button className="w-8 h-8 rounded-full bg-amber-500 hover:ring-2 hover:ring-offset-2 hover:ring-amber-500 transition-all"></button>
                      <button className="w-8 h-8 rounded-full bg-rose-500 hover:ring-2 hover:ring-offset-2 hover:ring-rose-500 transition-all"></button>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-slate-800 mb-3">自定義</h4>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">選擇主色調</label>
                      <input 
                        type="color" 
                        className="w-full h-10 rounded-lg border border-slate-200"
                        defaultValue="#8b5cf6"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-sm shadow-sm hover:from-purple-700 hover:to-indigo-700 transition-colors">
                      儲存設定
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-xl font-semibold text-slate-800 mb-6">通知設定</h2>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                  <h3 className="font-medium text-slate-800">通知偏好設定</h3>
                  <p className="text-sm text-slate-500 mt-1">設定何時以及如何收到通知</p>
                </div>
                
                <div className="p-6 divide-y divide-slate-200">
                  <div className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <h4 className="font-medium text-slate-800">任務更新</h4>
                        <p className="text-sm text-slate-500">當您的任務有更新時收到通知</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="py-4">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <h4 className="font-medium text-slate-800">任務分配</h4>
                        <p className="text-sm text-slate-500">當您被分配到新任務時收到通知</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="py-4">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <h4 className="font-medium text-slate-800">截止日期提醒</h4>
                        <p className="text-sm text-slate-500">在任務截止日期前收到提醒</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                    
                    <div className="pl-8 mt-3">
                      <label className="text-sm text-slate-700 mb-1 block">提前多少天提醒</label>
                      <select className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-40 p-2">
                        <option>1 天前</option>
                        <option>2 天前</option>
                        <option selected>3 天前</option>
                        <option>5 天前</option>
                        <option>7 天前</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="py-4">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <h4 className="font-medium text-slate-800">評論與回覆</h4>
                        <p className="text-sm text-slate-500">當有人回覆您的評論時收到通知</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="py-4">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <h4 className="font-medium text-slate-800">專案更新</h4>
                        <p className="text-sm text-slate-500">當專案有重大更新時收到通知</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="py-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium text-slate-800">通知方式</h4>
                        <p className="text-sm text-slate-500">選擇您希望如何收到通知</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500"
                          defaultChecked
                        />
                        <span className="ml-2 text-sm text-slate-700">應用內通知</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500"
                          defaultChecked
                        />
                        <span className="ml-2 text-sm text-slate-700">電子郵件通知</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm text-slate-700">簡訊通知</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-slate-50 border-t border-slate-200">
                  <div className="flex justify-end">
                    <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-sm shadow-sm hover:from-purple-700 hover:to-indigo-700 transition-colors">
                      儲存設定
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab !== 'appearance' && activeTab !== 'notifications' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
              <h3 className="font-medium text-slate-800 mb-2">此功能尚未實現</h3>
              <p className="text-slate-500 mb-4">我們正在積極開發中，敬請期待！</p>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-sm shadow-sm hover:from-purple-700 hover:to-indigo-700 transition-colors">
                返回主頁
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};