import process from 'process';
import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

export const getAccessKey = async () => {
  const secret_name = 's3-user-secrets';
  const client = new SecretsManagerClient({
    region: 'ap-southeast-1',
  });

  try {
    // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: 'AWSCURRENT', // VersionStage defaults to AWSCURRENT if unspecified
      })
    );
    if (!response.SecretString) return undefined;
    return JSON.parse(response.SecretString)
  } catch (error) {
    console.error('Error retrieving secret:', error);
  }
  return undefined;
}
