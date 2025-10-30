/**
 * Script to create an admin user
 * Run with: ts-node -r tsconfig-paths/register src/scripts/create-admin.ts
 */

import * as readline from 'readline'
import { registerUser } from 'src/services/user'
import { initPostgreSQL } from 'src/system/postgres'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query: string): Promise<string> {
  return new Promise(resolve => {
    rl.question(query, resolve)
  })
}

async function createAdmin() {
  try {
    console.log('='.repeat(50))
    console.log('Create Admin User')
    console.log('='.repeat(50))
    console.log()

    // Initialize database
    console.log('Connecting to database...')
    await initPostgreSQL()
    console.log('✅ Database connected')
    console.log()

    // Get user input
    const email = await question('Enter admin email: ')
    const password = await question('Enter admin password (min 8 chars): ')
    const firstName = await question('Enter first name: ')
    const lastName = await question('Enter last name: ')

    console.log()
    console.log('Creating admin user...')

    // Create admin user
    const user = await registerUser({
      email: email.trim(),
      password: password.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      role: 'admin'
    })

    // Get plain object from Sequelize model
    const userData = user.get({ plain: true })

    console.log()
    console.log('✅ Admin user created successfully!')
    console.log()
    console.log('User Details:')
    console.log('-'.repeat(50))
    console.log(`ID:            ${userData.id}`)
    console.log(`Email:         ${userData.email}`)
    console.log(`Name:          ${userData.firstName} ${userData.lastName}`)
    console.log(`Role:          ${userData.role}`)
    console.log(`Active:        ${userData.isActive}`)
    console.log(`Email Verified: ${userData.emailVerified}`)
    console.log('-'.repeat(50))
    console.log()
    console.log('You can now login with these credentials.')

    rl.close()
    process.exit(0)
  } catch (error) {
    console.error()
    console.error('❌ Error creating admin user:')
    console.error((error as Error).message)
    console.error()
    rl.close()
    process.exit(1)
  }
}

// Run the script
createAdmin()
