import type { CredentialResolver, OrganizationConnectionInfo, N8nCredentialData } from './types';

export const slackResolver: CredentialResolver = {
  provider: 'slack',
  n8nTypes: ['slackApi', 'slackOAuth2Api'],

  matchesService(service: string): boolean {
    return service === 'slack';
  },

  buildCredentialData(connection: OrganizationConnectionInfo): N8nCredentialData {
    return {
      type: 'slackApi',
      name: `Slack - ${connection.organizationId}`,
      data: {
        accessToken: connection.accessToken,
      },
    };
  },
};
