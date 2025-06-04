import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle, ArrowRight, Anchor, DivideIcon as LucideIcon } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

interface WelcomeOverlayProps {
  onClose: () => void;
}

interface StepInfo {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText: string;
  bgImage: string;
}

const WelcomeOverlay: React.FC<WelcomeOverlayProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { currentProject } = useProject();
  
  const steps: StepInfo[] = [
    {
      title: "歡迎使用 ProjectCraft",
      description: "智能專案管理解決方案，賦能您的團隊，優化工作流程，釋放創造力。",
      icon: <Anchor size={32} />,
      buttonText: "開始使用",
      bgImage: "https://images.pexels.com/photos/4555325/pexels-photo-4555325.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      title: "打造卓越專案",
      description: "使用我們直觀的工具快速建立專案，定義里程碑，並規劃您的成功路徑。",
      icon: <CheckCircle size={32} />,
      buttonText: "下一步",
      bgImage: "https://images.pexels.com/photos/5989925/pexels-photo-5989925.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      title: "協作無界限",
      description: "邀請團隊成員，分配任務，實時溝通，讓專案無縫協作。",
      icon: <AlertCircle size={32} />,
      buttonText: "完成",
      bgImage: "https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    }
  ];
  
  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };
  
  const currentStepInfo = steps[currentStep];
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-auto">
      <div className="absolute inset-0 bg-navy-900/40 backdrop-blur-md"></div>
      
      <div className="relative max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-float">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 transition-colors z-20 text-slate-500 hover:text-slate-700"
        >
          <X size={20} />
        </button>
        
        <div className="md:w-1/2 relative">
          <div className={`h-40 md:h-full relative bg-[url('${currentStepInfo.bgImage}')] bg-cover bg-center`}>
            <div className="absolute inset-0 bg-gradient-to-r from-teal-900/60 to-navy-900/60 backdrop-blur-[1px]"></div>
            
            <div className="relative z-10 p-8 md:p-12 flex flex-col h-full">
              <div className="flex-1">
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-6">
                  <div className="text-white">
                    {currentStepInfo.icon}
                  </div>
                </div>
                <h2 className="text-3xl font-display font-bold text-white mb-3">{currentStepInfo.title}</h2>
                <p className="text-white/80 text-lg max-w-md">{currentStepInfo.description}</p>
              </div>
              
              <div className="mt-auto">
                <div className="flex space-x-2">
                  {steps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentStep(index)}
                      className={`h-1.5 rounded-full transition-all ${
                        currentStep === index 
                          ? 'bg-white w-8' 
                          : 'bg-white/30 w-2 hover:bg-white/50'
                      }`}
                    ></button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:w-1/2 p-8 md:p-12 overflow-auto">
          <h3 className="text-2xl font-display font-bold text-slate-800 mb-6">功能探索</h3>
          
          <div className="space-y-6 mb-8">
            <Feature 
              isActive={true}
              icon={<div className="p-2 bg-teal-50 rounded-lg text-teal-600"><LayoutDashboard size={18} /></div>}
              title="視覺化儀表板"
              description="一目了然掌握專案關鍵指標，包括進度、資源和即將到來的里程碑。"
            />
            <Feature 
              isActive={true}
              icon={<div className="p-2 bg-navy-50 rounded-lg text-navy-600"><GanttChart size={18} /></div>}
              title="互動式甘特圖"
              description="直觀地規劃和管理任務時間表，讓您的專案進度一覽無遺。"
            />
            <Feature 
              isActive={true}
              icon={<div className="p-2 bg-amber-50 rounded-lg text-amber-600"><Users size={18} /></div>}
              title="智能資源管理"
              description="追蹤團隊成員的工作負載、可用性和利用率，優化資源分配。"
            />
            <Feature 
              isActive={currentStep >= 1}
              icon={<div className="p-2 bg-slate-100 rounded-lg text-slate-500"><CheckSquare size={18} /></div>}
              title="進階任務管理"
              description="建立、分配和追蹤任務，設定優先級並監控進度。"
            />
            <Feature 
              isActive={currentStep >= 2}
              icon={<div className="p-2 bg-slate-100 rounded-lg text-slate-500"><BarChart4 size={18} /></div>}
              title="深入數據分析"
              description="生成詳細報告，分析專案表現，做出明智決策。"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <button 
              onClick={onClose}
              className="text-slate-500 hover:text-slate-700 text-sm"
            >
              稍後再說
            </button>
            
            <button 
              onClick={handleNextStep}
              className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-navy-500 hover:from-teal-600 hover:to-navy-600 text-white rounded-full text-sm flex items-center transition-colors shadow-soft"
            >
              {currentStepInfo.buttonText}
              <ArrowRight size={16} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface FeatureProps {
  isActive: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const LayoutDashboard = (props: any) => <LucideIcon {...props} />;
const GanttChart = (props: any) => <LucideIcon {...props} />;
const CheckSquare = (props: any) => <LucideIcon {...props} />;
const Users = (props: any) => <LucideIcon {...props} />;
const BarChart4 = (props: any) => <LucideIcon {...props} />;

const Feature: React.FC<FeatureProps> = ({ isActive, icon, title, description }) => (
  <div className={`flex items-start transition-all ${isActive ? 'opacity-100' : 'opacity-40'}`}>
    {icon}
    <div className="ml-3">
      <h4 className="font-medium text-slate-800">{title}</h4>
      <p className="text-sm text-slate-500 mt-0.5">{description}</p>
    </div>
  </div>
);

export default WelcomeOverlay;