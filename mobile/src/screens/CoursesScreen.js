import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { useAuth, useContent } from '../hooks/useAppStore';
import { contentAPI } from '../services/api';
import { fetchCoursesSuccess } from '../store/contentSlice';
import { Card } from '../components/CommonComponents';

export const CoursesScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { courses } = useContent();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await contentAPI.getAllCourses({});
        dispatch(fetchCoursesSuccess(response.data.data));
      } catch (error) {
        console.error('Failed to load courses:', error);
      }
    };

    fetchCourses();
  }, [dispatch]);

  const handleCoursePress = (courseId) => {
    navigation.navigate('CourseDetail', { courseId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Courses</Text>

      {courses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No courses available yet</Text>
        </View>
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleCoursePress(item.id)}>
              <Card>
                <Text style={styles.courseTitle}>{item.title}</Text>
                <Text style={styles.courseDesc}>{item.description}</Text>
                <View style={styles.courseFooter}>
                  <Text style={styles.category}>{item.category}</Text>
                  <Text style={styles.level}>{item.level}</Text>
                </View>
              </Card>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  courseDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  category: {
    color: '#2196F3',
    fontWeight: '500',
  },
  level: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
  },
});
