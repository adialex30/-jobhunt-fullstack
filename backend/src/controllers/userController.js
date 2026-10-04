const UserModel = require('../models/userModel');
<<<<<<< HEAD
const { sendSuccess, sendError } = require('../utils/apiResponse');
=======
>>>>>>> feature/auth-system

const ALLOWED_USER_ROLES = ['job_seeker', 'recruiter'];

const UserController = {
  async getAllUsers(req, res) {
    try {
      const userList = await UserModel.findAll();
<<<<<<< HEAD
      return sendSuccess(res, {
        statusCode: 200,
        message: 'Daftar semua pengguna berhasil dimuat.',
        data: userList,
        meta: {
          total: userList.length
        }
      });
    } catch (error) {
      console.error('Error saat mengambil daftar user:', error);
      return sendError(res, {
        statusCode: 500,
=======
      return res.status(200).json({
        status: 'success',
        total: userList.length,
        data: userList
      });
    } catch (error) {
      console.error('Error saat mengambil daftar user:', error);
      return res.status(500).json({
        status: 'error',
>>>>>>> feature/auth-system
        message: 'Gagal mengambil data user.'
      });
    }
  },

  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const targetUser = await UserModel.findById(id);

      if (!targetUser) {
<<<<<<< HEAD
        return sendError(res, {
          statusCode: 404,
          message: 'Pengguna tidak ditemukan.'
        });
      }

      return sendSuccess(res, {
        statusCode: 200,
        message: 'Data pengguna berhasil dimuat.',
=======
        return res.status(404).json({
          status: 'error',
          message: 'User tidak ditemukan.'
        });
      }

      return res.status(200).json({
        status: 'success',
>>>>>>> feature/auth-system
        data: targetUser
      });
    } catch (error) {
      console.error('Error saat mengambil user by id:', error);
<<<<<<< HEAD
      return sendError(res, {
        statusCode: 500,
        message: 'Gagal mengambil data pengguna.'
=======
      return res.status(500).json({
        status: 'error',
        message: 'Gagal mengambil data user.'
>>>>>>> feature/auth-system
      });
    }
  },

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, role } = req.body;

      if (role && !ALLOWED_USER_ROLES.includes(role)) {
<<<<<<< HEAD
        return sendError(res, {
          statusCode: 400,
=======
        return res.status(400).json({
          status: 'error',
>>>>>>> feature/auth-system
          message: "Role harus berupa 'job_seeker' atau 'recruiter'!"
        });
      }

      const isUpdated = await UserModel.update(id, { name, role });
      if (!isUpdated) {
<<<<<<< HEAD
        return sendError(res, {
          statusCode: 404,
          message: 'Pengguna tidak ditemukan atau tidak ada perubahan data.'
        });
      }

      const updatedUser = await UserModel.findById(id);

      return sendSuccess(res, {
        statusCode: 200,
        message: 'Data pengguna berhasil diperbarui!',
        data: updatedUser
      });
    } catch (error) {
      console.error('Error saat update user:', error);
      return sendError(res, {
        statusCode: 500,
        message: 'Gagal memperbarui data pengguna.'
=======
        return res.status(404).json({
          status: 'error',
          message: 'User tidak ditemukan atau tidak ada perubahan data.'
        });
      }

      return res.status(200).json({
        status: 'success',
        message: 'User berhasil diperbarui!'
      });
    } catch (error) {
      console.error('Error saat update user:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Gagal memperbarui data user.'
>>>>>>> feature/auth-system
      });
    }
  },

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const isDeleted = await UserModel.delete(id);

      if (!isDeleted) {
<<<<<<< HEAD
        return sendError(res, {
          statusCode: 404,
          message: 'Pengguna tidak ditemukan.'
        });
      }

      return sendSuccess(res, {
        statusCode: 200,
        message: 'Pengguna berhasil dihapus dari sistem.'
      });
    } catch (error) {
      console.error('Error saat menghapus user:', error);
      return sendError(res, {
        statusCode: 500,
        message: 'Gagal menghapus data pengguna.'
=======
        return res.status(404).json({
          status: 'error',
          message: 'User tidak ditemukan.'
        });
      }

      return res.status(200).json({
        status: 'success',
        message: 'User berhasil dihapus!'
      });
    } catch (error) {
      console.error('Error saat menghapus user:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Gagal menghapus user.'
>>>>>>> feature/auth-system
      });
    }
  }
};

module.exports = UserController;
