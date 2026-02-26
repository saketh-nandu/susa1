import React from 'react';
import { X, FileCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditorStore, Tab } from '@/store/editorStore';
import { cn } from '@/lib/utils';

export const TabBar: React.FC = () => {
  const { tabs, activeTabId, setActiveTab, closeTab } = useEditorStore();

  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center bg-panel-bg border-b border-panel-border overflow-x-auto">
      <AnimatePresence mode="popLayout">
        {tabs.map((tab) => (
          <TabItem
            key={tab.id}
            tab={tab}
            isActive={tab.id === activeTabId}
            onClick={() => setActiveTab(tab.id)}
            onClose={() => closeTab(tab.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface TabItemProps {
  tab: Tab;
  isActive: boolean;
  onClick: () => void;
  onClose: () => void;
}

const TabItem: React.FC<TabItemProps> = ({ tab, isActive, onClick, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.15 }}
      className={cn(
        'group flex items-center gap-2 px-3 py-2 min-w-[120px] max-w-[200px] cursor-pointer border-r border-panel-border transition-colors',
        isActive
          ? 'bg-tab-active text-foreground'
          : 'bg-tab-inactive text-muted-foreground hover:text-foreground hover:bg-secondary'
      )}
      onClick={onClick}
    >
      <FileCode className="w-4 h-4 shrink-0 text-primary" />
      <span className="truncate text-sm flex-1">{tab.name}</span>
      {tab.isDirty && (
        <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className={cn(
          'p-0.5 rounded transition-opacity',
          isActive
            ? 'opacity-60 hover:opacity-100 hover:bg-secondary'
            : 'opacity-0 group-hover:opacity-60 hover:opacity-100 hover:bg-secondary'
        )}
      >
        <X className="w-3.5 h-3.5" />
      </button>
      {isActive && (
        <motion.div
          layoutId="activeTabIndicator"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
        />
      )}
    </motion.div>
  );
};
