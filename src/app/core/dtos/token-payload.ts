export interface TokenPayload {
  exp: number;
  iat: number;
  jti: string;
  iss: string;
  aud: string[];
  sub: string;
  typ: string;
  azp: string;
  session_state: string;
  acr: string;
  allowed_origins: string[];
  realm_access: any;
  resource_access: any;
  scope: string;
  email_verified: boolean;
  name: string;
  role_code: string;
  preferred_username: string;
  given_name: string;
  locale: string;
  family_name: string;
  email: string;
}
