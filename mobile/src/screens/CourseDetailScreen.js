import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { contentAPI, progressAPI } from '../services/api';
import { useAuth } from '../hooks/useAppStore';
import { Card, Button } from '../components/CommonComponents';

export const CourseDetailScreen = ({ route }) => {
  const { courseId } = route.params;
  const { token } = useAuth();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const response = await contentAPI.getCourse(courseId);
        setCourse(response.data.data);
        setLessons(response.data.data.lessons || []);

        if (token) {
          const progressResponse = await progressAPI.getCourseProgress(courseId);
          setProgress(progressResponse.data.data);
        }
      } catch (error) {
        console.error('Failed to load course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId, token]);

  const handleStartCourse = async () => {
    try {
      const response = await progressAPI.startCourse(courseId);
      setProgress(response.data.data);
    } catch (error) {
      console.error('Failed to start course:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading course...</Text>
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Course not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card>
        <Text style={styles.courseTitle}>{course.title}</Text>
        <Text style={styles.description}>{course.description}</Text>

        <View style={styles.meta}>
          <Text style={styles.metaLabel}>{course.category}</Text>
          <Text style={styles.metaLabel}>{course.level}</Text>
          <Text style={styles.metaLabel}>{course.duration_weeks} weeks</Text>
        </View>

        {!progress && token && (
          <Button variant="primary" onPress={handleStartCourse}>
            Start Course
          </Button>
        )}

        {progress && (
          <View style={styles.progressContainer}>
            <Text>Progress: {progress.lessons_completed} lessons</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(progress.lessons_completed / lessons.length) * 100}%` },
                ]}
              />
            </View>
          </View>
        )}
      </Card>

      {selectedLesson && (
        <Card style={styles.lessonContainer}>
          <Text style={styles.lessonTitle}>{selectedLesson.title}</Text>
          <Text style={styles.lessonContent}>{selectedLesson.content}</Text>
        </Card>
      )}

      <Text style={styles.lessonsTitle}>Lessons</Text>
      <FlatList
        data={lessons}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedLesson(item)}>
            <Card
              style={[
                styles.lessonCard,
                selectedLesson?.id === item.id && styles.selectedLessonCard,
              ]}
            >
              <Text>Lesson {item.lesson_order}: {item.title}</Text>
            </Card>
          </TouchableOpacity>
        )}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  meta: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  metaLabel: {
    backgroundColor: '#e3f2fd',
    color: '#2196F3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
  },
  progressContainer: {
    marginTop: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2196F3',
  },
  lessonContainer: {
    marginVertical: 12,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  lessonContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  lessonsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  lessonCard: {
    marginBottom: 8,
  },
  selectedLessonCard: {
    backgroundColor: '#e3f2fd',
  },
  errorText: {
    color: '#F44336',
    fontSize: 16,
  },
});
