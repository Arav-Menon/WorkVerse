import type { CredentialResolver, OrganizationConnectionInfo, N8nCredentialData } from './types';

type GoogleService = 'gmail' | 'calendar' | 'drive';

const SERVICE_TO_N8N_TYPE: Record<GoogleService, string> = {
  gmail: 'gmailOAuth2',
  calendar: 'googleCalendarOAuth2Api',
  drive: 'googleDriveOAuth2Api',
};

const SERVICE_SCOPES: Record<GoogleService, string> = {
  gmail: 'https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.send',
  calendar: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
  drive: 'https://www.googleapis.com/auth/drive',
};

export const googleResolver: CredentialResolver = {
  provider: 'google',
  n8nTypes: ['gmailOAuth2', 'googleCalendarOAuth2Api', 'googleDriveOAuth2Api'],

  matchesService(service: string): boolean {
    return service === 'google' || service === 'gmail' || service === 'calendar' || service === 'drive';
  },

  buildCredentialData(connection: OrganizationConnectionInfo, service?: string): N8nCredentialData {
    const googleService: GoogleService = (service as GoogleService) || 'gmail';
    const n8nType = SERVICE_TO_N8N_TYPE[googleService];
    const scopes = SERVICE_SCOPES[googleService];

    const metadata = connection.metadata as Record<string, any> | null;
    const clientId = metadata?.clientId ?? process.env.GOOGLE_CLIENT_ID ?? '';
    const clientSecret = metadata?.clientSecret ?? process.env.GOOGLE_CLIENT_SECRET ?? '';

    return {
      type: n8nType,
      name: `Google ${googleService} - ${connection.organizationId}`,
      data: {
        clientId,
        clientSecret,
        scope: scopes,
        oauthTokenData: {
          access_token: connection.accessToken,
          refresh_token: connection.refreshToken ?? '',
          token_type: 'Bearer',
        },
      },
    };
  },
};
