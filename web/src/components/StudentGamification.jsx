import React, { useState, useEffect } from 'react';
import { Star, Trophy, Flame, Award, TrendingUp } from 'lucide-react';
import api from '../services/api';

const StudentGamification = ({ studentId, courseId }) => {
  const [achievements, setAchievements] = useState([]);
  const [streaks, setStreaks] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('achievements');

  const badgeIcons = {
    FirstSteps: '🚀',
    Consecutive7Days: '🔥',
    Quiz100: '⭐',
    TopPerformer: '🏆',
    SpeedDemon: '⚡',
    ConsistentLearner: '📚',
    MasteryUnlocked: '🎓',
    RisingStarWeek: '📈',
    ClassLeader: '👑',
    PerfectionWeek: '✨',
    HelpfulPeer: '🤝',
    StreakMaster: '🔝',
    AdaptiveGenius: '🧠',
    CompletionMaster: '✅',
    AssessmentChampion: '🥇',
  };

  useEffect(() => {
    fetchGamificationData();
  }, [studentId, courseId]);

  const fetchGamificationData = async () => {
    try {
      setLoading(true);
      const [achievementsRes, streaksRes, leaderboardRes] = await Promise.all([
        api.get(`/gamification/achievements?studentId=${studentId}`),
        api.get(`/gamification/streaks?studentId=${studentId}`),
        api.get(`/gamification/leaderboard/${courseId}`),
      ]);

      setAchievements(achievementsRes.data.data || []);
      setStreaks(streaksRes.data.data || {});
      setLeaderboard(leaderboardRes.data.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load gamification data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-24 bg-gray-200 rounded-lg"></div>
        <div className="h-32 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Streak & Points Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Streak */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Current Streak</p>
              <p className="text-4xl font-bold text-orange-600 mt-2">
                {streaks?.current_streak || 0}
              </p>
              <p className="text-xs text-gray-500 mt-2">days</p>
            </div>
            <Flame className="w-12 h-12 text-orange-500 opacity-30" />
          </div>
        </div>

        {/* Total Points */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Points</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">
                {streaks?.total_points || 0}
              </p>
              <p className="text-xs text-gray-500 mt-2">earned</p>
            </div>
            <Star className="w-12 h-12 text-blue-500 opacity-30" />
          </div>
        </div>

        {/* Achievements Unlocked */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Achievements</p>
              <p className="text-4xl font-bold text-purple-600 mt-2">
                {achievements.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">unlocked</p>
            </div>
            <Award className="w-12 h-12 text-purple-500 opacity-30" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8 px-4">
          <button
            onClick={() => setActiveTab('achievements')}
            className={`py-4 font-medium text-sm transition-colors ${
              activeTab === 'achievements'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Achievements ({achievements.length})
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`py-4 font-medium text-sm transition-colors ${
              activeTab === 'leaderboard'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Leaderboard
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'achievements' && (
        <div>
          {achievements.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No achievements yet. Start learning!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="bg-white border-2 border-gray-200 rounded-lg p-4 text-center hover:border-blue-400 transition-colors"
                >
                  <div className="text-4xl font-bold mb-2">
                    {badgeIcons[achievement.badge_type] || '🏅'}
                  </div>
                  <h3 className="font-semibold text-sm text-gray-900 mb-1">
                    {achievement.badge_type.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {new Date(achievement.earned_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div>
          {leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No leaderboard data available yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rank</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Student</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Points</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Badges</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {leaderboard.map((entry, index) => (
                    <tr
                      key={entry.id}
                      className={`hover:bg-gray-50 ${entry.rank === 1 ? 'bg-yellow-50' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          {index < 3 && (
                            <span className="text-lg mr-2">
                              {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                            </span>
                          )}
                          <span className="font-semibold text-gray-900">{index + 1}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{entry.full_name}</td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-blue-600">
                        {entry.total_points}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-600">
                        {entry.badge_count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default StudentGamification;
