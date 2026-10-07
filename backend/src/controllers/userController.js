const UserModel = require('../models/userModel');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const ALLOWED_USER_ROLES = ['job_seeker', 'recruiter'];

const UserController = {
  async getAllUsers(req, res) {
    try {
      const { role } = req.query;
      const userList = await UserModel.findAll(role ? { role } : {});
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
        message: 'Gagal mengambil data user.'
      });
    }
  },

  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const targetUser = await UserModel.findById(id);

      if (!targetUser) {
        return sendError(res, {
          statusCode: 404,
          message: 'Pengguna tidak ditemukan.'
        });
      }

      return sendSuccess(res, {
        statusCode: 200,
        message: 'Data pengguna berhasil dimuat.',
        data: targetUser
      });
    } catch (error) {
      console.error('Error saat mengambil user by id:', error);
      return sendError(res, {
        statusCode: 500,
        message: 'Gagal mengambil data pengguna.'
      });
    }
  },

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, role } = req.body;

      if (role && !ALLOWED_USER_ROLES.includes(role)) {
        return sendError(res, {
          statusCode: 400,
          message: "Role harus berupa 'job_seeker' atau 'recruiter'!"
        });
      }

      const isUpdated = await UserModel.update(id, { name, role });
      if (!isUpdated) {
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
      });
    }
  },

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const isDeleted = await UserModel.delete(id);

      if (!isDeleted) {
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
      });
    }
  }
};

module.exports = UserController;
