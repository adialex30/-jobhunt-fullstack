const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const ALLOWED_ROLES = ['job_seeker', 'recruiter'];
const BCRYPT_SALT_ROUNDS = 10;
const DEFAULT_JWT_SECRET = 'your_super_secret_key_min_32_chars';
const DEFAULT_JWT_EXPIRES_IN = '7d';

const validateRegistrationInput = ({ name, email, password, role }) => {
  if (!name || !email || !password || !role) {
    return 'Semua field (name, email, password, role) wajib diisi!';
  }
  if (!ALLOWED_ROLES.includes(role)) {
    return "Role harus berupa 'job_seeker' atau 'recruiter'!";
  }
  if (password.length < 6) {
    return 'Password minimal harus 6 karakter!';
  }
  return null;
};

const validateLoginInput = ({ email, password }) => {
  if (!email || !password) {
    return 'Email dan password wajib diisi!';
  }
  return null;
};

const AuthController = {
  async register(req, res) {
    try {
      const { name, email, password, role } = req.body;

      const validationError = validateRegistrationInput({ name, email, password, role });
      if (validationError) {
        return sendError(res, {
          statusCode: 400,
          message: validationError
        });
      }

      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return sendError(res, {
          statusCode: 409,
          message: 'Email sudah terdaftar, silakan gunakan email lain!'
        });
      }

      const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

      const newUserId = await UserModel.create({
        name,
        email,
        password: hashedPassword,
        role
      });

      return sendSuccess(res, {
        statusCode: 201,
        message: 'Registrasi akun berhasil!',
        data: {
          user: {
            id: newUserId,
            name,
            email,
            role
          }
        }
      });
    } catch (error) {
      console.error('Error saat registrasi:', error);
      return sendError(res, {
        statusCode: 500,
        message: 'Terjadi kesalahan pada server saat proses registrasi.'
      });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const validationError = validateLoginInput({ email, password });
      if (validationError) {
        return sendError(res, {
          statusCode: 400,
          message: validationError
        });
      }

      const foundUser = await UserModel.findByEmail(email);
      if (!foundUser) {
        return sendError(res, {
          statusCode: 401,
          message: 'Email atau password yang Anda masukkan salah!'
        });
      }

      const isPasswordValid = await bcrypt.compare(password, foundUser.password);
      if (!isPasswordValid) {
        return sendError(res, {
          statusCode: 401,
          message: 'Email atau password yang Anda masukkan salah!'
        });
      }

      const jwtPayload = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role
      };

      const authenticationToken = jwt.sign(
        jwtPayload,
        process.env.JWT_SECRET || DEFAULT_JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || DEFAULT_JWT_EXPIRES_IN }
      );

      return sendSuccess(res, {
        statusCode: 200,
        message: 'Login berhasil! Selamat datang kembali.',
        data: {
          user: {
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
            role: foundUser.role,
            created_at: foundUser.created_at
          },
          token: authenticationToken
        }
      });
    } catch (error) {
      console.error('Error saat login:', error);
      return sendError(res, {
        statusCode: 500,
        message: 'Terjadi kesalahan pada server saat proses login.'
      });
    }
  },

  async getMe(req, res) {
    try {
      const authenticatedUser = await UserModel.findById(req.user.id);
      if (!authenticatedUser) {
        return sendError(res, {
          statusCode: 404,
          message: 'Data pengguna tidak ditemukan.'
        });
      }

      return sendSuccess(res, {
        statusCode: 200,
        message: 'Data profil berhasil dimuat.',
        data: {
          user: authenticatedUser
        }
      });
    } catch (error) {
      console.error('Error saat mengambil data profil:', error);
      return sendError(res, {
        statusCode: 500,
        message: 'Terjadi kesalahan server saat mengambil profil pengguna.'
      });
    }
  }
};

module.exports = AuthController;