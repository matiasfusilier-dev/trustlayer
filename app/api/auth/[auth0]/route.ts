import { initAuth0 } from '@auth0/nextjs-auth0';

const auth0 = initAuth0({
  secret: process.env.AUTH0_SECRET || 'c88d905229a9ef7f89404e6d1bce0457beb593c7090de3c1985ee50679c0bbcf',
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL || 'https://dev-usj0rrtsgjpijobs.us.auth0.com',
  baseURL: process.env.AUTH0_BASE_URL || 'http://localhost:3001',
  clientID: process.env.AUTH0_CLIENT_ID || 'h2pTjX74HOgSECwXnrtVZ1jkXveUiZh1',
  clientSecret: process.env.AUTH0_CLIENT_SECRET || 'Sd16zSQs5tLEeiYOtwfA9-gM_D1H0G-LZv_ryWQhcupK056UkLn4_InOdqqP5p5H',
});

export const GET = auth0.handleAuth();