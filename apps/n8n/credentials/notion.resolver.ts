import type { CredentialResolver, OrganizationConnectionInfo, N8nCredentialData } from './types';

export const notionResolver: CredentialResolver = {
  provider: 'notion',
  n8nTypes: ['notionApi', 'notionOAuth2Api'],

  matchesService(service: string): boolean {
    return service === 'notion';
  },

  buildCredentialData(connection: OrganizationConnectionInfo): N8nCredentialData {
    return {
      type: 'notionApi',
      name: `Notion - ${connection.organizationId}`,
      data: {
        apiKey: connection.accessToken,
      },
    };
  },
};
