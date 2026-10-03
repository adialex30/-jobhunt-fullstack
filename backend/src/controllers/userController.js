const UserModel = require('../models/userModel');

const ALLOWED_USER_ROLES = ['job_seeker', 'recruiter'];

const UserController = {
  async getAllUsers(req, res) {
    try {
      const userList = await UserModel.findAll();
      return res.status(200).json({
        status: 'success',
        total: userList.length,
        data: userList
      });
    } catch (error) {
      console.error('Error saat mengambil daftar user:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Gagal mengambil data user.'
      });
    }
  },

  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const targetUser = await UserModel.findById(id);

      if (!targetUser) {
        return res.status(404).json({
          status: 'error',
          message: 'User tidak ditemukan.'
        });
      }

      return res.status(200).json({
        status: 'success',
        data: targetUser
      });
    } catch (error) {
      console.error('Error saat mengambil user by id:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Gagal mengambil data user.'
      });
    }
  },

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, role } = req.body;

      if (role && !ALLOWED_USER_ROLES.includes(role)) {
        return res.status(400).json({
          status: 'error',
          message: "Role harus berupa 'job_seeker' atau 'recruiter'!"
        });
      }

      const isUpdated = await UserModel.update(id, { name, role });
      if (!isUpdated) {
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
      });
    }
  },

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const isDeleted = await UserModel.delete(id);

      if (!isDeleted) {
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
      });
    }
  }
};

module.exports = UserController;
