import type { CollectionAfterLoginHook } from 'payload'

import { mergeHeaders, generateCookie, getCookieExpiration } from 'payload'

export const setCookieBasedOnDomain: CollectionAfterLoginHook = async ({ req, user }) => {
  // Try to get host from multiple headers for Vercel compatibility
  const host =
    req.headers.get('host') ||
    req.headers.get('x-forwarded-host') ||
    req.headers.get('x-vercel-deployment-url')

  // For debugging - log in development only
  if (process.env.NODE_ENV !== 'production') {
    console.log('setCookieBasedOnDomain - Host:', host)
    console.log('setCookieBasedOnDomain - All headers:', Object.fromEntries(req.headers.entries()))
  }

  if (!host) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('setCookieBasedOnDomain - No host found in headers')
    }
    return user
  }

  const relatedOrg = await req.payload.find({
    collection: 'tenants',
    depth: 0,
    limit: 1,
    where: {
      domain: {
        equals: host,
      },
    },
  })

  // If a matching tenant is found, set the 'payload-tenant' cookie
  if (relatedOrg && relatedOrg.docs.length > 0) {
    const isProduction =
      process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production'

    const tenantCookie = generateCookie({
      name: 'payload-tenant',
      expires: getCookieExpiration({ seconds: 7200 }),
      path: '/',
      returnCookieAsObject: false,
      value: String(relatedOrg.docs[0].id),
      secure: isProduction, // Secure cookies in production (HTTPS)
      sameSite: 'Lax', // Use 'Lax' for same-site cookies
      httpOnly: true, // HttpOnly for security
    })

    // Merge existing responseHeaders with the new Set-Cookie header
    const newHeaders = new Headers({
      'Set-Cookie': tenantCookie as string,
    })

    // Ensure you merge existing response headers if they already exist
    req.responseHeaders = req.responseHeaders
      ? mergeHeaders(req.responseHeaders, newHeaders)
      : newHeaders

    if (process.env.NODE_ENV !== 'production') {
      console.log('setCookieBasedOnDomain - Set cookie for tenant:', relatedOrg.docs[0].id)
    }
  } else {
    if (process.env.NODE_ENV !== 'production') {
      console.log('setCookieBasedOnDomain - No tenant found for host:', host)
      console.log('setCookieBasedOnDomain - Consider adding a tenant with domain:', host)
    }
  }

  return user
}
