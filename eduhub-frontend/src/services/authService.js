const API_URL = 'http://localhost:8080/eduhub';

export const login = async (user, password) => {
  try {
    const response = await fetch(`${API_URL}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, password }),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error en la solicitud de login:', error);
    return null;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/api/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const text = await response.text();

    if (!response.ok) {
      return { status: response.status, message: text };
    }

    return { status: response.status, message: 'Usuario registrado con éxito' };
  } catch (error) {
    console.error('Error en el registro:', error);
    return { status: 500, message: 'Error interno del servidor' };
  }
};

export const checkEmail = async (email) => {
  const response = await fetch(`${API_URL}/auth/check-email?email=${encodeURIComponent(email)}`);
  return response.text();
};

export const verifyPassword = async (authLoginDto) => {
  const response = await fetch(`${API_URL}/auth/verify-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(authLoginDto),
  });
  return response;
};

export const requestPasswordReset = async (email) => {
  try {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const text = await response.text();
    return { message: text };
  } catch (error) {
    return { message: 'Error en la solicitud. Intenta de nuevo.' };
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    localStorage.clear();

    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return { message: await response.text() };
    }
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    return { message: 'Error al actualizar la contraseña. Intenta de nuevo.' };
  }
};
