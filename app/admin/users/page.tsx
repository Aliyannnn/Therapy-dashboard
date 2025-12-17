'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllUsers, reactivateUser, deactivateUser, createDashboardUser } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import toast, { Toaster } from 'react-hot-toast';
import {
  ArrowLeft,
  Search,
  UserPlus,
  Edit,
  Trash2,
  Copy,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { User, CreateUserRequest } from '@/lib/types';
import { formatDate, copyToClipboard } from '@/lib/utils';

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userTypeFilter, setUserTypeFilter] = useState<'all' | 'vr' | 'dashboard'>('all');
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [userTypeFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const filterType = userTypeFilter === 'all' ? undefined : userTypeFilter;
      const response = await getAllUsers(0, 100, filterType, false);
      
      const usersData = Array.isArray(response.data) ? response.data : [];
      setUsers(usersData);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/admin/dashboard')}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">User Management</h1>
              <p className="text-gray-400 mt-1">Create and manage user accounts</p>
            </div>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-white text-black hover:bg-gray-200"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Create User
          </Button>
        </div>
      </header>

      {/* Search Bar & Filters */}
      <div className="px-8 py-6 space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-900 border-gray-800 text-white"
          />
        </div>
        
        {/* User Type Filter */}
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-gray-400" />
          <div className="flex gap-2">
            <Button
              variant={userTypeFilter === 'all' ? 'default' : 'secondary'}
              onClick={() => setUserTypeFilter('all')}
              className={userTypeFilter === 'all' ? 'bg-white text-black' : ''}
            >
              All Users ({users.length})
            </Button>
            <Button
              variant={userTypeFilter === 'vr' ? 'default' : 'secondary'}
              onClick={() => setUserTypeFilter('vr')}
              className={userTypeFilter === 'vr' ? 'bg-purple-500 text-white' : ''}
            >
              VR Users
            </Button>
            <Button
              variant={userTypeFilter === 'dashboard' ? 'default' : 'secondary'}
              onClick={() => setUserTypeFilter('dashboard')}
              className={userTypeFilter === 'dashboard' ? 'bg-blue-500 text-white' : ''}
            >
              Dashboard Users
            </Button>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="px-8 pb-8">
        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <Card className="border-gray-800 bg-gray-900/50">
            <CardContent className="py-12 text-center">
              <p className="text-gray-400">
                {searchQuery ? 'No users found matching your search' : 'No users found'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredUsers.map((user) => (
              <UserCard 
                key={user.user_id} 
                user={user} 
                onUpdate={fetchUsers} 
                onEdit={() => setEditingUser(user)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchUsers();
          }}
        />
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSuccess={() => {
            setEditingUser(null);
            fetchUsers();
          }}
        />
      )}
    </div>
  );
}

function UserCard({ 
  user, 
  onUpdate, 
  onEdit 
}: { 
  user: User; 
  onUpdate: () => void; 
  onEdit: () => void;
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      await deactivateUser(user.user_id);
      toast.success(`${user.user_type === 'vr' ? 'VR' : 'Dashboard'} user deactivated successfully`);
      onUpdate();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to deactivate user');
    }
  };

  return (
    <Card className="border-gray-800 bg-gray-900/50 hover:bg-gray-800/50 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-lg font-bold">
              {user.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg text-white">{user.name}</h3>
                {user.user_type && (
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      user.user_type === 'vr'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}
                  >
                    {user.user_type.toUpperCase()}
                  </span>
                )}
              </div>
              {user.username && <p className="text-sm text-gray-400">@{user.username}</p>}
              {user.email && <p className="text-sm text-gray-500">{user.email}</p>}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onEdit}
                className="text-gray-400 hover:text-white"
                title="Edit user"
              >
                <Edit className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-400 hover:text-red-300"
                title="Delete user"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {user.last_login && (
          <p className="text-sm text-gray-500 mt-4">
            Last login: {formatDate(user.last_login)}
          </p>
        )}

        {showDeleteConfirm && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 mb-3">Are you sure you want to deactivate this user?</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleDelete}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                Confirm Delete
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CreateUserModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState<CreateUserRequest>({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [createdUser, setCreatedUser] = useState<any>(null);

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    setLoading(true);
    try {
      const response = await createDashboardUser(formData);
      setCreatedUser(response.data);
      toast.success('Dashboard user created successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const copyCredentials = () => {
    const text = `Username: ${createdUser.username}\nPassword: ${createdUser.password}`;
    copyToClipboard(text);
    toast.success('Credentials copied!');
  };

  if (createdUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <Card className="w-full max-w-md mx-4 border-gray-800 bg-black">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              User Created Successfully
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-yellow-500 text-sm">
                ⚠️ Share these credentials with the user. They cannot be recovered later!
              </p>
            </div>
            <div className="p-4 bg-gray-900 rounded-lg space-y-3">
              <div>
                <p className="text-sm text-gray-400">Name</p>
                <p className="text-white font-medium">{createdUser.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Username</p>
                <p className="text-white font-mono">{createdUser.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Password</p>
                <p className="text-white font-mono">{createdUser.password}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={copyCredentials}
                variant="outline"
                className="flex-1 border-gray-700 text-white hover:bg-gray-800"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button
                onClick={() => {
                  onSuccess();
                  onClose();
                }}
                className="flex-1 bg-white text-black hover:bg-gray-200"
              >
                Done
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 border-gray-800 bg-black">
        <CardHeader>
          <CardTitle className="text-white">Create New User</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Name *</label>
            <Input
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Email</label>
            <Input
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Phone</label>
            <Input
              type="tel"
              placeholder="+1234567890"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Notes</label>
            <textarea
              placeholder="Additional notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full h-20 px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder:text-gray-500 resize-none"
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-white text-black hover:bg-gray-200"
            >
              {loading ? 'Creating...' : 'Create User'}
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-700 text-white hover:bg-gray-800"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EditUserModal({ 
  user, 
  onClose, 
  onSuccess 
}: { 
  user: User; 
  onClose: () => void; 
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    notes: user.notes || '',
    is_active: user.is_active ?? true,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    setLoading(true);
    try {
      // Dynamic import to get updateUser function
      const { updateUser } = await import('@/lib/api');
      await updateUser(user.user_id, formData);
      toast.success('User updated successfully!');
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 border-gray-800 bg-black">
        <CardHeader>
          <CardTitle className="text-white">Edit User</CardTitle>
          <p className="text-sm text-gray-400 mt-1">
            {user.user_type === 'vr' ? 'VR User' : 'Dashboard User'}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Name *</label>
            <Input
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Email</label>
            <Input
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>
          {user.user_type === 'dashboard' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Phone</label>
              <Input
                type="tel"
                placeholder="+1234567890"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-gray-900 border-gray-700 text-white"
              />
            </div>
          )}
          {user.user_type === 'dashboard' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Notes</label>
              <textarea
                placeholder="Additional notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full h-20 px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder:text-gray-500 resize-none"
              />
            </div>
          )}
          <div className="flex items-center gap-2 p-3 bg-gray-900 rounded-lg">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 rounded border-gray-700 bg-gray-800 checked:bg-white"
            />
            <label htmlFor="is_active" className="text-sm text-gray-300 cursor-pointer">
              Active user
            </label>
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-white text-black hover:bg-gray-200"
            >
              {loading ? 'Updating...' : 'Update User'}
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-700 text-white hover:bg-gray-800"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}