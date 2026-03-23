import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth, useProgress } from '../hooks/useAppStore';
import { progressAPI } from '../services/api';
import { Card, Button } from '../components/CommonComponents';

export const DashboardScreen = ({ navigation }) => {
  const { user, token } = useAuth();
  const { userProgress } = useProgress();
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
  });

  useEffect(() => {
    const completedCourses = userProgress.filter(p => p.status === 'completed').length;
    const inProgressCourses = userProgress.filter(p => p.status === 'in_progress').length;

    setStats({
      total: userProgress.length,
      inProgress: inProgressCourses,
      completed: completedCourses,
    });
  }, [userProgress]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.greeting}>Welcome, {user?.firstName}!</Text>
      </View>

      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total Courses</Text>
        </Card>

        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.inProgress}</Text>
          <Text style={styles.statLabel}>In Progress</Text>
        </Card>

        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </Card>
      </View>

      <Text style={styles.sectionTitle}>Your Courses</Text>

      {userProgress.length === 0 ? (
        <Card>
          <Text style={styles.noCoursesText}>No courses yet. Browse available courses to get started!</Text>
          <Button variant="primary" onPress={() => navigation.navigate('Courses')}>
            Explore Courses
          </Button>
        </Card>
      ) : (
        userProgress.map((progress) => (
          <TouchableOpacity key={progress.id} onPress={() => navigation.navigate('CourseDetail', { courseId: progress.course_id })}>
            <Card>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>Course Progress</Text>
                <Text
                  style={[
                    styles.progressStatus,
                    progress.status === 'completed'
                      ? styles.completedStatus
                      : styles.inProgressStatus,
                  ]}
                >
                  {progress.status}
                </Text>
              </View>
              <Text style={styles.progressText}>
                {progress.lessons_completed} lessons completed
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${(progress.lessons_completed / 10) * 100}%` },
                  ]}
                />
              </View>
            </Card>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  noCoursesText: {
    textAlign: 'center',
    color: '#999',
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressStatus: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  completedStatus: {
    backgroundColor: '#c8e6c9',
    color: '#2e7d32',
  },
  inProgressStatus: {
    backgroundColor: '#fff9c4',
    color: '#f57f17',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2196F3',
  },
});
