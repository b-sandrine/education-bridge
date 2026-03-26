import React, { useState } from 'react';
import { Button, Input, Card, Alert } from './CommonComponents';
import { useForm } from '../hooks/useForm';

export const LessonForm = ({ courseId, onSubmit, initialData = null, onCancel }) => {
  const [serverError, setServerError] = useState(null);

  const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm(
    initialData || {
      title: '',
      content: '',
      lessonOrder: 1,
      videoUrl: '',
    },
    async (formValues) => {
      setServerError(null);
      try {
        await onSubmit({
          ...formValues,
          courseId,
          video_url: formValues.videoUrl,
        });
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to save lesson. Please try again.';
        setServerError(message);
      }
    }
  );

  return (
    <Card className="w-full max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">
        {initialData ? 'Edit Lesson' : 'Add New Lesson'}
      </h2>

      {serverError && <Alert type="error" message={serverError} className="mb-4" />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Title</label>
          <Input
            type="text"
            name="title"
            placeholder="e.g., Introduction to Variables"
            value={values.title}
            onChange={handleChange}
            error={errors.title}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Order</label>
          <Input
            type="number"
            name="lessonOrder"
            placeholder="Position in this course"
            value={values.lessonOrder}
            onChange={handleChange}
            error={errors.lessonOrder}
            min="1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Content</label>
          <textarea
            name="content"
            placeholder="Detailed lesson content, explanations, and examples..."
            value={values.content}
            onChange={handleChange}
            rows="6"
            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Video URL (Optional)</label>
          <Input
            type="url"
            name="videoUrl"
            placeholder="https://example.com/video.mp4"
            value={values.videoUrl}
            onChange={handleChange}
            error={errors.videoUrl}
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            className="flex-1"
          >
            {initialData ? 'Update Lesson' : 'Create Lesson'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};
