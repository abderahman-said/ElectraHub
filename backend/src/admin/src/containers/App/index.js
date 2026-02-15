import React, { useState, useEffect } from 'react';
import { 
  Box, 
  HeaderLayout, 
  ContentLayout, 
  Button, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td,
  Typography,
  Tabs,
  Tab,
  TabPanel,
  TabPanels,
  TabList,
  Badge,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalLayout
} from '@strapi/design-system';
import { Plus, Lock, Users, Key, History } from '@strapi/icons';
import { request } from '@strapi/helper-plugin';

const App = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, rolesRes, permissionsRes, auditRes] = await Promise.all([
        request('/pam-users', { method: 'GET' }),
        request('/roles', { method: 'GET' }),
        request('/permissions', { method: 'GET' }),
        request('/audit-logs', { method: 'GET' })
      ]);

      setUsers(usersRes.data || []);
      setRoles(rolesRes.data || []);
      setPermissions(permissionsRes.data || []);
      setAuditLogs(auditRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'secondary';
      case 'suspended': return 'danger';
      case 'pending': return 'warning';
      default: return 'secondary';
    }
  };

  const getAccessLevelColor = (level) => {
    switch (level) {
      case 'super_admin': return 'danger';
      case 'admin': return 'warning';
      case 'advanced': return 'primary';
      case 'intermediate': return 'secondary';
      case 'basic': return 'neutral';
      default: return 'neutral';
    }
  };

  if (loading) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box background="neutral100">
      <HeaderLayout
        title="Privileged Access Management"
        subtitle="Manage users, roles, and permissions"
        primaryAction={
          <Button startIcon={<Plus />} onClick={() => setIsModalOpen(true)}>
            Add New User
          </Button>
        }
      />

      <ContentLayout>
        <Tabs variant="simple" initialSelectedTabIndex={0} onTabChange={index => setActiveTab(['users', 'roles', 'permissions', 'audit'][index])}>
          <TabList>
            <Tab startIcon={<Users />}>Users</Tab>
            <Tab startIcon={<Key />}>Roles</Tab>
            <Tab startIcon={<Lock />}>Permissions</Tab>
            <Tab startIcon={<History />}>Audit Logs</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Box padding={4}>
                <Table>
                  <Thead>
                    <Tr>
                      <Th>Username</Th>
                      <Th>Email</Th>
                      <Th>Full Name</Th>
                      <Th>Access Level</Th>
                      <Th>Status</Th>
                      <Th>Last Login</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {users.map(user => (
                      <Tr key={user.id}>
                        <Td>{user.username}</Td>
                        <Td>{user.email}</Td>
                        <Td>{user.fullName}</Td>
                        <Td>
                          <Badge backgroundColor={getAccessLevelColor(user.accessLevel)}>
                            {user.accessLevel}
                          </Badge>
                        </Td>
                        <Td>
                          <Badge backgroundColor={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </Td>
                        <Td>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</Td>
                        <Td>
                          <Button size="S" variant="tertiary">Edit</Button>
                          <Button size="S" variant="danger">Delete</Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </TabPanel>

            <TabPanel>
              <Box padding={4}>
                <Table>
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Description</Th>
                      <Th>Level</Th>
                      <Th>Users Count</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {roles.map(role => (
                      <Tr key={role.id}>
                        <Td>{role.name}</Td>
                        <Td>{role.description}</Td>
                        <Td>
                          <Badge backgroundColor={getAccessLevelColor(role.level)}>
                            {role.level}
                          </Badge>
                        </Td>
                        <Td>{role.users?.length || 0}</Td>
                        <Td>
                          <Button size="S" variant="tertiary">Edit</Button>
                          <Button size="S" variant="danger">Delete</Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </TabPanel>

            <TabPanel>
              <Box padding={4}>
                <Table>
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Resource</Th>
                      <Th>Action</Th>
                      <Th>Description</Th>
                      <Th>System</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {permissions.map(permission => (
                      <Tr key={permission.id}>
                        <Td>{permission.name}</Td>
                        <Td>{permission.resource}</Td>
                        <Td>
                          <Badge>{permission.action}</Badge>
                        </Td>
                        <Td>{permission.description}</Td>
                        <Td>
                          <Badge backgroundColor={permission.isSystem ? 'danger' : 'neutral'}>
                            {permission.isSystem ? 'Yes' : 'No'}
                          </Badge>
                        </Td>
                        <Td>
                          <Button size="S" variant="tertiary">Edit</Button>
                          <Button size="S" variant="danger">Delete</Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </TabPanel>

            <TabPanel>
              <Box padding={4}>
                <Table>
                  <Thead>
                    <Tr>
                      <Th>Timestamp</Th>
                      <Th>User</Th>
                      <Th>Action</Th>
                      <Th>Resource</Th>
                      <Th>Status</Th>
                      <Th>IP Address</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {auditLogs.slice(0, 100).map(log => (
                      <Tr key={log.id}>
                        <Td>{new Date(log.timestamp).toLocaleString()}</Td>
                        <Td>{log.user?.username || 'System'}</Td>
                        <Td>{log.action}</Td>
                        <Td>{log.resource}</Td>
                        <Td>
                          <Badge backgroundColor={log.status === 'success' ? 'success' : 'danger'}>
                            {log.status}
                          </Badge>
                        </Td>
                        <Td>{log.ipAddress}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </ContentLayout>

      <ModalLayout onClose={() => setIsModalOpen(false)} isOpen={isModalOpen}>
        <ModalHeader>Add New User</ModalHeader>
        <ModalBody>
          <Typography>User form will go here</Typography>
        </ModalBody>
        <ModalFooter>
          <Button variant="tertiary" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button>Add User</Button>
        </ModalFooter>
      </ModalLayout>
    </Box>
  );
};

export default App;
