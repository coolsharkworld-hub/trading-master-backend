import { DataTypes, Model, Optional, Sequelize } from 'sequelize'

// User attributes interface
export interface UserAttributes {
  id: number
  email: string
  password: string
  firstName: string
  lastName: string
  role: string
  isActive: boolean
  emailVerified: boolean
  lastLogin?: Date
  createdAt?: Date
  updatedAt?: Date
}

// Creation attributes (optional fields for creation)
export type UserCreationAttributes = Optional<
  UserAttributes,
  'id' | 'role' | 'isActive' | 'emailVerified' | 'createdAt' | 'updatedAt'
>

// User Model class
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number
  public email!: string
  public password!: string
  public firstName!: string
  public lastName!: string
  public role!: string
  public isActive!: boolean
  public emailVerified!: boolean
  public lastLogin?: Date

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

// Model definition function - will be called after sequelize is initialized
export const initUserModel = (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        },
        comment: 'User email address'
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Hashed password'
      },
      firstName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'User first name'
      },
      lastName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'User last name'
      },
      role: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'user',
        comment: 'User role (admin, user, trader, etc.)'
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether the user account is active'
      },
      emailVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether the email has been verified'
      },
      lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last login timestamp'
      }
    },
    {
      sequelize,
      tableName: 'users',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: 'idxUserEmail',
          fields: ['email'],
          unique: true
        },
        {
          name: 'idxUserRole',
          fields: ['role']
        },
        {
          name: 'idxUserActive',
          fields: ['isActive']
        }
      ]
    }
  )

  return User
}

export default User
