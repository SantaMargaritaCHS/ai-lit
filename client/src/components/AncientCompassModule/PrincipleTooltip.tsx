import React, { useState } from 'react';
import { Heart, Users, Scale, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export type PrincipleType = 'human-dignity' | 'common-good' | 'solidarity';

interface PrincipleTooltipProps {
  principle: PrincipleType;
  children?: React.ReactNode;
  showIcon?: boolean;
}

const PRINCIPLE_DATA = {
  'human-dignity': {
    name: 'Human Dignity',
    icon: Heart,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    description: 'Every person has inherent worth and fundamental rights that must be respected. Technology should serve human flourishing, not reduce people to data points or efficiency metrics.'
  },
  'common-good': {
    name: 'Common Good',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    description: 'Technology should allow EVERYONE to thrive—not just the majority. AI systems should benefit all members of society, especially marginalized groups, and reduce rather than increase inequality.'
  },
  'solidarity': {
    name: 'Solidarity',
    icon: Scale,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    description: 'We\'re all connected and responsible for each other\'s wellbeing. When AI systems harm some people, it\'s everyone\'s problem to solve. We must work together to ensure technology benefits humanity as a whole.'
  }
};

export function PrincipleTooltip({ principle, children, showIcon = false }: PrincipleTooltipProps) {
  const data = PRINCIPLE_DATA[principle];
  const Icon = data.icon;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center gap-1 cursor-help underline decoration-dotted underline-offset-2">
            {showIcon && <Icon className={`w-4 h-4 ${data.color}`} />}
            {children || <span className={`font-semibold ${data.color}`}>{data.name}</span>}
            <Info className="w-3 h-3 text-gray-400" />
          </span>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className={`max-w-sm p-4 ${data.bgColor} ${data.borderColor} border-2`}
        >
          <div className="flex items-start gap-2">
            <Icon className={`w-5 h-5 ${data.color} flex-shrink-0 mt-0.5`} />
            <div>
              <p className="font-bold text-gray-900 mb-1">{data.name}</p>
              <p className="text-sm text-gray-800 leading-relaxed">{data.description}</p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Simplified inline version for use in regular text
export function PrincipleHighlight({ principle, children }: { principle: PrincipleType; children: React.ReactNode }) {
  const data = PRINCIPLE_DATA[principle];

  return (
    <PrincipleTooltip principle={principle}>
      <strong className={`${data.color} font-semibold`}>{children}</strong>
    </PrincipleTooltip>
  );
}
