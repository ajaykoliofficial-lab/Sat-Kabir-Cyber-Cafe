export type ServiceCategory = 
  | 'all' 
  | 'csc' 
  | 'jobs' 
  | 'banking' 
  | 'certificates' 
  | 'typing' 
  | 'billing' 
  | 'community';

export interface CSCServiceItem {
  id: string;
  title: string;
  titleHi: string;
  category: 'csc' | 'banking' | 'certificates' | 'utility';
  description: string;
  descriptionHi: string;
  icon: string;
  processingTime: string;
  requiredDocs: string[];
  govtFeeApprox: string;
  badge?: string;
  popular?: boolean;
}

export interface SarkariJobItem {
  id: string;
  postName: string;
  department: string;
  type: 'job' | 'admit_card' | 'result' | 'admission';
  lastDateOrRelease: string;
  totalPosts?: number | string;
  qualification: string;
  applyUrl?: string;
  notificationUrl?: string;
  ageLimit?: string;
  applicationFee?: string;
  isNew?: boolean;
}

export interface TickerAlert {
  id: string;
  title: string;
  titleHi: string;
  category: 'job' | 'admit_card' | 'result' | 'csc_update';
  date: string;
  linkText: string;
  targetId?: string;
}

export interface InvoiceItem {
  id: string;
  serviceName: string;
  qty: number;
  rate: number;
}

export interface TypingResult {
  wpm: number;
  netWpm: number;
  accuracy: number;
  errors: number;
  totalWords: number;
  timeSpentSec: number;
  userName: string;
  language: 'en' | 'hi';
}
