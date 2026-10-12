import jwt from 'jsonwebtoken';

export function requireAuth(request) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return {
      error: 'Missing authorization header',
      status: 401
    };
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return {
      error: 'Invalid authorization format',
      status: 401
    };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return {
      success: true,
      user: decoded
    };
  } catch (error) {
    return {
      error: 'Invalid or expired token',
      status: 401
    };
  }
}
