import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

/**
 * Skeletonコンポーネント
 * ローディング中のプレースホルダーとして使用
 */
export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200 dark:bg-gray-700',
        className
      )}
    />
  );
};

// 円形のスケルトン
export const SkeletonCircle: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-full bg-gray-200 dark:bg-gray-700',
        className
      )}
    />
  );
};

// テキスト用のスケルトン（複数行）
interface SkeletonTextProps extends SkeletonProps {
  lines?: number;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({ 
  className, 
  lines = 3 
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'animate-pulse h-4 bg-gray-200 dark:bg-gray-700 rounded',
            index === lines - 1 && 'w-4/5' // 最後の行は短くする
          )}
        />
      ))}
    </div>
  );
};

// カード用のスケルトン
export const SkeletonCard: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div className={cn('p-4 space-y-3', className)}>
      <Skeleton className="h-8 w-3/4" />
      <SkeletonText lines={2} />
      <div className="flex items-center space-x-4">
        <SkeletonCircle className="h-10 w-10" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
};

export default Skeleton;