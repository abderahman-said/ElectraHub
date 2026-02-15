# Bel-Gomla PAM System

Privileged Access Management system for the Bel-Gomla B2B platform built with Strapi.

## Features

- **User Management**: Create, update, and manage user accounts with different access levels
- **Role-Based Access Control (RBAC)**: Define roles and assign permissions
- **Session Management**: Track and manage user sessions
- **Audit Logging**: Comprehensive audit trail of all system activities
- **Security Features**: Password hashing, session management, login attempt tracking
- **Admin Panel**: Beautiful admin interface for managing the PAM system

## Access Levels

1. **Super Admin**: Full system access
2. **Admin**: Administrative access to most functions
3. **Advanced**: Manager level access
4. **Intermediate**: Basic operational access
5. **Basic**: Read-only access

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Run the database setup and seeding:
```bash
npm run develop
# In another terminal, run the seed script
node scripts/seed.js
```

4. Access the admin panel:
- URL: http://localhost:1337/admin
- Default credentials: admin / admin123

## API Endpoints

### Authentication
- `POST /api/pam-users/login` - User login
- `POST /api/pam-users/logout` - User logout

### Users
- `GET /api/pam-users` - List users (requires authentication)
- `GET /api/pam-users/:id` - Get user details
- `POST /api/pam-users` - Create user
- `PUT /api/pam-users/:id` - Update user
- `DELETE /api/pam-users/:id` - Delete user

### Roles
- `GET /api/roles` - List roles
- `POST /api/roles` - Create role
- `PUT /api/roles/:id` - Update role
- `DELETE /api/roles/:id` - Delete role

### Permissions
- `GET /api/permissions` - List permissions
- `POST /api/permissions` - Create permission
- `PUT /api/permissions/:id` - Update permission
- `DELETE /api/permissions/:id` - Delete permission

### Sessions
- `GET /api/sessions` - List active sessions
- `DELETE /api/sessions/:id` - Revoke session

### Audit Logs
- `GET /api/audit-logs` - List audit logs

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Session management with expiration
- Login attempt tracking
- IP address logging
- User agent tracking
- Comprehensive audit logging

## Development

```bash
# Start development server
npm run develop

# Build for production
npm run build

# Start production server
npm start
```

## Default Credentials

- **Username**: admin
- **Password**: admin123
- **Access Level**: Super Admin

⚠️ **Important**: Change the default password after first login!

## License

MIT
