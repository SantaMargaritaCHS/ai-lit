import { useState } from 'react';
import { CertificateGenerator } from '@/components/CertificateGenerator';
import { NameEntry } from '@/components/NameEntry';
import { ActivityWrapper } from '@/components/ActivityWrapper';
import { PrivacyDataRightsModule } from '@/components/modules/PrivacyDataRightsModuleWithSimulation';
import { useDeveloperMode } from '@/hooks/useDeveloperMode';
import { SecretKeyPrompt } from '@/components/SecretKeyPrompt';

export default function PrivacyDataRightsActivity() {
  const [nameEntered, setNameEntered] = useState(false);
  const [userName, setUserName] = useState('');
  const [completed, setCompleted] = useState(false);
  
  // Developer mode integration
  const { isDevMode, showDevPanel, showKeyPrompt, setShowKeyPrompt, handleSecretKeySubmit } = useDeveloperMode();

  if (!nameEntered) {
    return (
      <ActivityWrapper>
        <NameEntry
          activityTitle="Privacy and Data Rights"
          onNameSubmit={(name) => {
            setUserName(name);
            setNameEntered(true);
          }}
        />
      </ActivityWrapper>
    );
  }

  if (completed) {
    return (
      <ActivityWrapper>
        <CertificateGenerator
          userName={userName || "Demo User"}
          activityTitle="Privacy and Data Rights"
          onDownload={() => {
            setCompleted(false);
          }}
        />
      </ActivityWrapper>
    );
  }

  return (
    <ActivityWrapper>
      <PrivacyDataRightsModule 
        onComplete={() => setCompleted(true)} 
        isDevMode={isDevMode}
        showDevPanel={showDevPanel}
      />
      
      {/* Developer Mode Secret Key Prompt */}
      {showKeyPrompt && (
        <SecretKeyPrompt
          isOpen={showKeyPrompt}
          onSubmit={(key) => {
            handleSecretKeySubmit(key);
            setShowKeyPrompt(false);
          }}
          onCancel={() => setShowKeyPrompt(false)}
        />
      )}
    </ActivityWrapper>
  );
}