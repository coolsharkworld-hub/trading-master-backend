'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
        comment: 'User email address'
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: 'Hashed password'
      },
      first_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: 'User first name'
      },
      last_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: 'User last name'
      },
      role: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'user',
        comment: 'User role (admin, user, trader, etc.)'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether the user account is active'
      },
      email_verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether the email has been verified'
      },
      last_login: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Last login timestamp'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    })

    // Create indexes
    await queryInterface.addIndex('users', ['email'], {
      name: 'idxUserEmail',
      unique: true
    })

    await queryInterface.addIndex('users', ['role'], {
      name: 'idxUserRole',
      unique: false
    })

    await queryInterface.addIndex('users', ['is_active'], {
      name: 'idxUserActive',
      unique: false
    })

    // Add table comment
    await queryInterface.sequelize.query("COMMENT ON TABLE users IS 'Store user account information'")
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users')
  }
}
