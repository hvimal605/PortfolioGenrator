import React, { useState } from "react";

const Settings = () => {
  const [deleteConfirm, setDeleteConfirm] = useState("");

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-black via-gray-900 to-black text-gray-200 p-6">
      <div className="w-full max-w-5xl p-8 bg-gradient-to-br from-gray-800/60 via-gray-700/60 to-gray-900/60 backdrop-blur-lg rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-white/10">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 drop-shadow-lg">
          Account Settings
        </h2>
        <p className="mt-2 text-gray-400 text-center">
          Manage your account details and preferences.
        </p>

        <div className="mt-10 space-y-10">
          {/* Update Profile */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-white/10 shadow-inner">
            <h3 className="text-2xl font-bold text-white mb-4">Update Profile</h3>
            <div className="grid gap-5">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Full Name</label>
                <input type="text" placeholder="Your full name" className="w-full bg-gray-900 border border-gray-600 p-3 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Email Address</label>
                <input type="email" placeholder="you@example.com" className="w-full bg-gray-900 border border-gray-600 p-3 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">About</label>
                <textarea rows="3" placeholder="Tell something cool..." className="w-full bg-gray-900 border border-gray-600 p-3 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500" />
              </div>
            </div>
            <button className="mt-6 px-6 py-3 text-white bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg hover:shadow-[0_0_15px_#ec4899] transition duration-300">
              Save Profile
            </button>
          </div>

          {/* Change Password */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-white/10 shadow-inner">
            <h3 className="text-2xl font-bold text-white mb-4">Change Password</h3>
            <div className="grid gap-5">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Current Password</label>
                <input type="password" className="w-full bg-gray-900 border border-gray-600 p-3 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">New Password</label>
                <input type="password" className="w-full bg-gray-900 border border-gray-600 p-3 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500" />
              </div>
            </div>
            <button className="mt-6 px-6 py-3 text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:shadow-[0_0_15px_#a855f7] transition duration-300">
              Change Password
            </button>
          </div>

          {/* Notification Preferences */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-white/10 shadow-inner">
            <h3 className="text-2xl font-bold text-white mb-4">Notification Preferences</h3>
            <div className="space-y-3">
              {["Email", "SMS", "Push"].map((type) => (
                <label key={type} className="flex items-center space-x-2">
                  <input type="checkbox" className="form-checkbox text-pink-600 bg-gray-800 border-gray-600" />
                  <span>{type} Notifications</span>
                </label>
              ))}
            </div>
            <button className="mt-6 px-6 py-3 text-white bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg hover:shadow-[0_0_15px_#ec4899] transition duration-300">
              Save Preferences
            </button>
          </div>

          {/* Delete Account */}
          <div className="bg-gradient-to-br from-red-900 via-red-800 to-red-900 p-6 rounded-xl border-2 border-red-600 shadow-inner">
            <h3 className="text-2xl font-bold text-white mb-2">Delete Account</h3>
            <p className="text-red-200 mb-4">
              This action is irreversible. Please type <span className="font-bold">DELETE</span> to confirm.
            </p>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder='Type "DELETE"'
              className="w-full bg-red-950 border border-red-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <button
              disabled={deleteConfirm !== "DELETE"}
              className={`mt-4 px-6 py-3 w-full sm:w-auto text-white rounded-lg transition duration-300 ${
                deleteConfirm === "DELETE"
                  ? "bg-gradient-to-r from-red-600 to-red-800 hover:shadow-[0_0_12px_#ef4444]"
                  : "bg-red-700 cursor-not-allowed opacity-60"
              }`}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
