export type LearningStage = 
  | 'intro'
  | 'stage1_story'
  | 'stage2_add'
  | 'stage3_remove'
  | 'stage4_concept'
  | 'stage5_operations'
  | 'stage6_numberline'
  | 'stage7_compare'
  | 'stage8_sandbox_quiz';

export interface StageInfo {
  id: LearningStage;
  number: number;
  title: string;
  shortDesc: string;
  badge: string;
}

export interface OperationQuestion {
  id: string;
  story: string;
  initialWater: number;
  action: 'add' | 'remove';
  bucketCount: number;
  expectedSign: '+' | '-';
  expectedResult: number;
  hint: string;
}

export interface ComparisonQuestion {
  id: string;
  label: string;
  valA: number;
  valB: number;
  category: 'pos_pos' | 'neg_neg' | 'neg_pos' | 'pos_neg' | 'equal';
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  scenario?: string;
  options: { label: string; value: string }[];
  correctAnswer: string;
  explanation: string;
  pondVisual?: {
    type: 'single' | 'compare';
    levelA: number;
    levelB?: number;
  };
}
