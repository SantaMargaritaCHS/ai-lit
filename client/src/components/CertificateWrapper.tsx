import React from 'react';
import { Certificate } from './Certificate';
import { useUser } from '../context/UserContext';

interface CertificateWrapperProps {
  courseName: string;
  completionDate?: string;
  score?: number;
  instructor?: string;
  moduleId?: string;
  onComplete?: () => void;
  onDownload?: () => void;
}

export const CertificateWrapper: React.FC<CertificateWrapperProps> = (props) => {
  const { userName } = useUser();
  
  return (
    <Certificate
      {...props}
      userName={userName || 'Student'}
      completionDate={props.completionDate || new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}
    />
  );
};