import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  activeTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline' | 'cards';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  activeTab: controlledActiveTab,
  onChange,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className,
  children
}) => {
  const [localActiveTab, setLocalActiveTab] = useState(
    defaultTab || tabs[0]?.id || ''
  );
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const activeTab = controlledActiveTab || localActiveTab;
  const isControlled = controlledActiveTab !== undefined;

  useEffect(() => {
    if (variant === 'underline' && tabRefs.current[activeTab]) {
      const activeTabElement = tabRefs.current[activeTab];
      if (activeTabElement) {
        setIndicatorStyle({
          left: activeTabElement.offsetLeft,
          width: activeTabElement.offsetWidth
        });
      }
    }
  }, [activeTab, variant]);

  const handleTabClick = (tabId: string) => {
    if (!isControlled) {
      setLocalActiveTab(tabId);
    }
    onChange?.(tabId);
  };

  const sizeClasses = {
    sm: {
      tab: 'px-3 py-1.5 text-sm',
      icon: 'w-4 h-4',
      badge: 'ml-1.5 px-1.5 py-0.5 text-xs'
    },
    md: {
      tab: 'px-4 py-2 text-base',
      icon: 'w-5 h-5',
      badge: 'ml-2 px-2 py-0.5 text-xs'
    },
    lg: {
      tab: 'px-6 py-3 text-lg',
      icon: 'w-6 h-6',
      badge: 'ml-2 px-2 py-1 text-sm'
    }
  };

  const variantClasses = {
    default: {
      container: 'border-b border-gray-200',
      tab: cn(
        'relative font-medium transition-colors',
        'hover:text-gray-700',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
      ),
      activeTab: 'text-primary-600 border-b-2 border-primary-600',
      inactiveTab: 'text-gray-500'
    },
    pills: {
      container: 'bg-gray-100 p-1 rounded-lg',
      tab: cn(
        'font-medium transition-all rounded-md',
        'hover:text-gray-700',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
      ),
      activeTab: 'bg-white text-primary-600 shadow-sm',
      inactiveTab: 'text-gray-500'
    },
    underline: {
      container: 'relative border-b border-gray-200',
      tab: cn(
        'relative font-medium transition-colors',
        'hover:text-gray-700',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
      ),
      activeTab: 'text-primary-600',
      inactiveTab: 'text-gray-500'
    },
    cards: {
      container: 'border-b border-gray-200 bg-gray-50 px-4',
      tab: cn(
        'relative font-medium transition-all rounded-t-lg border border-b-0',
        'hover:text-gray-700',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
      ),
      activeTab: 'bg-white text-primary-600 border-gray-200',
      inactiveTab: 'text-gray-500 border-transparent'
    }
  };

  const sizes = sizeClasses[size];
  const variants = variantClasses[variant];

  return (
    <div className={className}>
      {/* Tab list */}
      <div
        className={cn(
          'flex',
          variants.container,
          fullWidth ? 'w-full' : 'inline-flex',
          variant === 'pills' && 'gap-1'
        )}
        role="tablist"
        aria-label="Tabs"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              ref={(el) => (tabRefs.current[tab.id] = el)}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              disabled={tab.disabled}
              onClick={() => !tab.disabled && handleTabClick(tab.id)}
              className={cn(
                'flex items-center',
                sizes.tab,
                variants.tab,
                isActive ? variants.activeTab : variants.inactiveTab,
                tab.disabled && 'opacity-50 cursor-not-allowed',
                fullWidth && 'flex-1 justify-center'
              )}
            >
              {tab.icon && (
                <span className={cn('mr-2', sizes.icon)}>{tab.icon}</span>
              )}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    'rounded-full font-normal',
                    sizes.badge,
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-gray-100 text-gray-600'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Underline indicator */}
        {variant === 'underline' && (
          <div
            className="absolute bottom-0 h-0.5 bg-primary-600 transition-all duration-300"
            style={indicatorStyle}
          />
        )}
      </div>

      {/* Tab panels */}
      <div className="mt-4">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.props.tabId === activeTab) {
            return (
              <div
                role="tabpanel"
                id={`tabpanel-${activeTab}`}
                aria-labelledby={`tab-${activeTab}`}
              >
                {child}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

interface TabPanelProps {
  tabId: string;
  children: React.ReactNode;
  className?: string;
}

export const TabPanel: React.FC<TabPanelProps> = ({
  children,
  className
}) => {
  return <div className={className}>{children}</div>;
};

// Vertical tabs component
interface VerticalTabsProps extends Omit<TabsProps, 'variant' | 'fullWidth'> {
  tabWidth?: string;
}

export const VerticalTabs: React.FC<VerticalTabsProps> = ({
  tabs,
  defaultTab,
  activeTab: controlledActiveTab,
  onChange,
  size = 'md',
  tabWidth = '200px',
  className,
  children
}) => {
  const [localActiveTab, setLocalActiveTab] = useState(
    defaultTab || tabs[0]?.id || ''
  );

  const activeTab = controlledActiveTab || localActiveTab;
  const isControlled = controlledActiveTab !== undefined;

  const handleTabClick = (tabId: string) => {
    if (!isControlled) {
      setLocalActiveTab(tabId);
    }
    onChange?.(tabId);
  };

  const sizeClasses = {
    sm: {
      tab: 'px-3 py-2 text-sm',
      icon: 'w-4 h-4',
      badge: 'ml-auto px-1.5 py-0.5 text-xs'
    },
    md: {
      tab: 'px-4 py-3 text-base',
      icon: 'w-5 h-5',
      badge: 'ml-auto px-2 py-0.5 text-xs'
    },
    lg: {
      tab: 'px-6 py-4 text-lg',
      icon: 'w-6 h-6',
      badge: 'ml-auto px-2 py-1 text-sm'
    }
  };

  const sizes = sizeClasses[size];

  return (
    <div className={cn('flex', className)}>
      {/* Tab list */}
      <div
        className="flex flex-col border-r border-gray-200"
        style={{ width: tabWidth }}
        role="tablist"
        aria-label="Tabs"
        aria-orientation="vertical"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              disabled={tab.disabled}
              onClick={() => !tab.disabled && handleTabClick(tab.id)}
              className={cn(
                'flex items-center text-left transition-all',
                sizes.tab,
                isActive
                  ? 'bg-primary-50 text-primary-600 border-l-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-l-2 border-transparent',
                tab.disabled && 'opacity-50 cursor-not-allowed',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset'
              )}
            >
              {tab.icon && (
                <span className={cn('mr-3', sizes.icon)}>{tab.icon}</span>
              )}
              <span className="flex-1">{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    'rounded-full font-normal',
                    sizes.badge,
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-gray-100 text-gray-600'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab panels */}
      <div className="flex-1 pl-6">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.props.tabId === activeTab) {
            return (
              <div
                role="tabpanel"
                id={`tabpanel-${activeTab}`}
                aria-labelledby={`tab-${activeTab}`}
              >
                {child}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};