import type { CredentialResolver, OrganizationConnectionInfo, N8nCredentialData } from './types';

export const githubResolver: CredentialResolver = {
  provider: 'github',
  n8nTypes: ['githubApi', 'githubOAuth2Api'],

  matchesService(service: string): boolean {
    return service === 'github';
  },

  buildCredentialData(connection: OrganizationConnectionInfo): N8nCredentialData {
    return {
      type: 'githubApi',
      name: `GitHub - ${connection.organizationId}`,
      data: {
        server: 'https://api.github.com',
        accessToken: connection.accessToken,
      },
    };
  },
};
