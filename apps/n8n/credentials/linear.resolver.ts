import type { CredentialResolver, OrganizationConnectionInfo, N8nCredentialData } from './types';

export const linearResolver: CredentialResolver = {
  provider: 'linear',
  n8nTypes: ['linearApi', 'linearOAuth2Api'],

  matchesService(service: string): boolean {
    return service === 'linear';
  },

  buildCredentialData(connection: OrganizationConnectionInfo): N8nCredentialData {
    return {
      type: 'linearApi',
      name: `Linear - ${connection.organizationId}`,
      data: {
        apiKey: connection.accessToken,
      },
    };
  },
};
