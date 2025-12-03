/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import {
  BookOpen,
  GraduationCap,
  Flame,
  Zap,
  BrainCircuit,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  MessageCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ChevronRight,
  Menu,
  Key
} from 'lucide-react';

const defaultProps = {
  strokeWidth: 2,
};

export const BookIcon = (props: React.SVGProps<SVGSVGElement>) => <BookOpen {...defaultProps} {...props} />;
export const GradCapIcon = (props: React.SVGProps<SVGSVGElement>) => <GraduationCap {...defaultProps} {...props} />;
export const FlameIcon = (props: React.SVGProps<SVGSVGElement>) => <Flame {...defaultProps} {...props} />;
export const ZapIcon = (props: React.SVGProps<SVGSVGElement>) => <Zap {...defaultProps} {...props} />;
export const BrainIcon = (props: React.SVGProps<SVGSVGElement>) => <BrainCircuit {...defaultProps} {...props} />;
export const PlayIcon = (props: React.SVGProps<SVGSVGElement>) => <Play {...defaultProps} {...props} />;
export const PauseIcon = (props: React.SVGProps<SVGSVGElement>) => <Pause {...defaultProps} {...props} />;
export const ResetIcon = (props: React.SVGProps<SVGSVGElement>) => <RotateCcw {...defaultProps} {...props} />;
export const SparklesIcon = (props: React.SVGProps<SVGSVGElement>) => <Sparkles {...defaultProps} {...props} />;
export const ChatIcon = (props: React.SVGProps<SVGSVGElement>) => <MessageCircle {...defaultProps} {...props} />;
export const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => <CheckCircle2 {...defaultProps} {...props} />;
export const XIcon = (props: React.SVGProps<SVGSVGElement>) => <XCircle {...defaultProps} {...props} />;
export const ArrowRightIcon = (props: React.SVGProps<SVGSVGElement>) => <ArrowRight {...defaultProps} {...props} />;
export const ChevronRightIcon = (props: React.SVGProps<SVGSVGElement>) => <ChevronRight {...defaultProps} {...props} />;
export const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => <Menu {...defaultProps} {...props} />;
export const KeyIcon = (props: React.SVGProps<SVGSVGElement>) => <Key {...defaultProps} {...props} />;