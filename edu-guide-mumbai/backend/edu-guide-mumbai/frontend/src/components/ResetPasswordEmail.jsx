import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';

const PasswordResetEmail = (props) => {
  const { userFirstName = 'User', resetUrl = '#' } = props;

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Reset your password - Action required</Preview>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] shadow-sm max-w-[580px] mx-auto p-[40px]">
            {/* Header */}
            <Section className="text-center mb-[32px]">
              <Heading className="text-[24px] font-bold text-gray-900 m-0 mb-[8px]">
                Password Reset Request
              </Heading>
              <Text className="text-[16px] text-gray-600 m-0">
                We received a request to reset your password
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-[32px]">
              <Text className="text-[16px] text-gray-900 mb-[16px] leading-[24px]">
                Hello {userFirstName},
              </Text>
              
              <Text className="text-[16px] text-gray-700 mb-[24px] leading-[24px]">
                We received a request to reset the password for your account. If you made this request, 
                click the button below to reset your password. This link will expire in 24 hours for security reasons.
              </Text>

              {/* Reset Button */}
              <Section className="text-center mb-[32px]">
                <Button
                  href={resetUrl}
                  className="bg-blue-600 text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline box-border inline-block"
                >
                  Reset Password
                </Button>
              </Section>

              <Text className="text-[14px] text-gray-600 mb-[24px] leading-[20px]">
                If the button above doesn't work, you can copy and paste the following link into your browser:
              </Text>
              
              <Text className="text-[14px] text-blue-600 mb-[24px] break-all">
                <Link href={resetUrl} className="text-blue-600 underline">
                  {resetUrl}
                </Link>
              </Text>
            </Section>

            {/* Security Notice */}
            <Section className="bg-amber-50 border border-amber-200 rounded-[8px] p-[20px] mb-[32px]">
              <Heading className="text-[16px] font-semibold text-amber-800 m-0 mb-[8px]">
                Security Notice
              </Heading>
              <Text className="text-[14px] text-amber-700 m-0 leading-[20px]">
                If you didn't request this password reset, please ignore this email. 
                Your password will remain unchanged. For additional security, consider enabling 
                two-factor authentication on your account.
              </Text>
            </Section>

            {/* Support */}
            <Section className="mb-[32px]">
              <Text className="text-[14px] text-gray-600 leading-[20px]">
                Need help? Contact our support team at{' '}
                <Link href="mailto:support@company.com" className="text-blue-600 underline">
                  support@company.com
                </Link>
              </Text>
            </Section>

            {/* Footer */}
            <Section className="border-t border-gray-200 pt-[24px]">
              <Text className="text-[12px] text-gray-500 leading-[16px] m-0 mb-[8px]">
                This email was sent to hunnyfernandes27@gmail.com
              </Text>
              <Text className="text-[12px] text-gray-500 leading-[16px] m-0 mb-[8px]">
                Company Name, 123 Business Street, City, State 12345
              </Text>
              <Text className="text-[12px] text-gray-500 leading-[16px] m-0">
                © 2025 Company Name. All rights reserved. |{' '}
                <Link href="#" className="text-gray-500 underline">
                  Unsubscribe
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default PasswordResetEmail;