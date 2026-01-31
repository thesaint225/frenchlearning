import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Section,
  Text,
} from '@react-email/components';
import { PLATFORM_DISPLAY_NAME } from '@/lib/constants';

export interface AssignmentResultEmailProps {
  studentName: string;
  assignmentTitle: string;
  scoreText: string;
  feedback?: string;
  platformName?: string;
}

const fontFamily =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif';

const PRIMARY = '#58cc02';
const PRIMARY_DARK = '#4aad02';
const ACCENT = '#ff9600';
const BODY_BG = '#f7f7f5';

export function AssignmentResultEmail({
  studentName,
  assignmentTitle,
  scoreText,
  feedback = '',
  platformName = PLATFORM_DISPLAY_NAME,
}: AssignmentResultEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Body style={body}>
        <Container style={container}>
          <Section style={cardWrapper}>
            <Text style={watermark}>Learn French</Text>

            <Section style={headerSection}>
              <Heading style={headerHeading}>{platformName}</Heading>
              <Text style={headerSubtext}>Assignment Result Notification</Text>
            </Section>

            <Section style={contentSection}>
              <Text style={paragraph}>Hello,</Text>
              <Text style={paragraph}>
                This is a notification about <strong>{studentName}</strong>'s
                result for the assignment <strong>{assignmentTitle}</strong>.
              </Text>
              <Section style={scorePill}>
                <Text style={scorePillLabel}>Score</Text>
                <Text style={scorePillValue}>{scoreText}</Text>
              </Section>
              {feedback ? (
                <Text style={paragraph}>
                  <strong>Feedback:</strong> {feedback}
                </Text>
              ) : null}
            </Section>

            <Hr style={divider} />

            <Section style={footerSection}>
              <Text style={footerText}>— {platformName}</Text>
              <Text style={footerNote}>This is an automated message.</Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body: React.CSSProperties = {
  backgroundColor: BODY_BG,
  fontFamily,
  margin: 0,
  padding: 0,
};

const container: React.CSSProperties = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '560px',
  backgroundColor: '#ffffff',
  borderRadius: '4px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
  borderTop: `4px solid ${PRIMARY}`,
};

const cardWrapper: React.CSSProperties = {
  position: 'relative',
  minHeight: '320px',
  overflow: 'hidden',
};

const watermark: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  margin: 0,
  fontSize: '72px',
  fontWeight: 700,
  color: PRIMARY,
  opacity: 0.08,
  letterSpacing: '0.02em',
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
  zIndex: 0,
};

const headerSection: React.CSSProperties = {
  padding: '24px 20px',
  backgroundColor: PRIMARY,
  margin: '0 -20px',
  position: 'relative',
  zIndex: 1,
};

const headerHeading: React.CSSProperties = {
  margin: 0,
  fontSize: '20px',
  fontWeight: 600,
  color: '#ffffff',
  letterSpacing: '-0.02em',
};

const headerSubtext: React.CSSProperties = {
  margin: '4px 0 0',
  fontSize: '13px',
  color: 'rgba(255, 255, 255, 0.85)',
};

const contentSection: React.CSSProperties = {
  paddingTop: '24px',
  position: 'relative',
  zIndex: 1,
};

const paragraph: React.CSSProperties = {
  margin: '0 0 16px',
  fontSize: '16px',
  lineHeight: 1.6,
  color: '#374151',
};

const scorePill: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: PRIMARY,
  borderRadius: '8px',
  padding: '12px 20px',
  margin: '8px 0 16px',
};

const scorePillLabel: React.CSSProperties = {
  margin: 0,
  fontSize: '11px',
  fontWeight: 600,
  color: 'rgba(255, 255, 255, 0.9)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const scorePillValue: React.CSSProperties = {
  margin: '4px 0 0',
  fontSize: '18px',
  fontWeight: 600,
  color: '#ffffff',
};

const divider: React.CSSProperties = {
  borderColor: 'rgba(88, 204, 2, 0.25)',
  margin: '24px 0',
  position: 'relative' as const,
  zIndex: 1,
};

const footerSection: React.CSSProperties = {
  paddingTop: '8px',
  position: 'relative' as const,
  zIndex: 1,
};

const footerText: React.CSSProperties = {
  margin: 0,
  fontSize: '14px',
  color: '#6b7280',
};

const footerNote: React.CSSProperties = {
  margin: '8px 0 0',
  fontSize: '12px',
  color: '#9ca3af',
};
