import { singoutAction, useProfile } from '../../features/auth';

export const DashboardPage = () => {
  const { profile, isLoading, isError, error } = useProfile();

  const handleLogout = () => {
    singoutAction();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>

        {isLoading && (
          <div className="mb-6 text-center">
            <p className="text-gray-600">Loading profile data...</p>
          </div>
        )}

        {isError && error && (
          <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            <p>Error loading profile: {error.message}</p>
          </div>
        )}

        {profile && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Welcome, {profile.name}!</h2>
            <p className="text-gray-600">
              This is your protected dashboard. Only authenticated users can see this page.
            </p>
            
            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-md font-semibold mb-2">Your Profile</h3>
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <span className="font-medium">Email:</span> {profile.email}
                </div>
                <div>
                  <span className="font-medium">Member since:</span> {new Date(profile.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        )}

        {profile && (
          <div className="border-t pt-4">
            <h3 className="text-md font-semibold mb-2">Your Account Information</h3>
            <ul className="space-y-2">
              <li className="flex">
                <span className="font-medium w-24">Email:</span>
                <span className="text-gray-700">{profile.email}</span>
              </li>
              <li className="flex">
                <span className="font-medium w-24">User ID:</span>
                <span className="text-gray-700">{profile.id}</span>
              </li>
              <li className="flex">
                <span className="font-medium w-24">Joined:</span>
                <span className="text-gray-700">
                  {new Date(profile.createdAt).toLocaleDateString()}
                </span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
