import React, { useState } from 'react';
import { Button, Input, Card, Alert } from './CommonComponents';
import { useForm } from '../hooks/useForm';

export const CourseForm = ({ onSubmit, loading = false, initialData = null, onCancel }) => {
  const [serverError, setServerError] = useState(null);

  const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm(
    initialData || {
      title: '',
      description: '',
      category: '',
      level: 'beginner',
      content: '',
      durationWeeks: 1,
    },
    async (formValues) => {
      setServerError(null);
      try {
        await onSubmit(formValues);
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to save course. Please try again.';
        setServerError(message);
      }
    }
  );

  return (
    <Card className="w-full max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">
        {initialData ? 'Edit Course' : 'Create New Course'}
      </h2>

      {serverError && <Alert type="error" message={serverError} className="mb-4" />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
          <Input
            type="text"
            name="title"
            placeholder="e.g., Introduction to Python"
            value={values.title}
            onChange={handleChange}
            error={errors.title}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            placeholder="Describe your course..."
            value={values.description}
            onChange={handleChange}
            rows="3"
            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <Input
              type="text"
              name="category"
              placeholder="e.g., Programming, Mathematics"
              value={values.category}
              onChange={handleChange}
              error={errors.category}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
            <select
              name="level"
              value={values.level}
              onChange={handleChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            {errors.level && <p className="text-red-500 text-sm mt-1">{errors.level}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course Content</label>
          <textarea
            name="content"
            placeholder="Detailed course content and learning outcomes..."
            value={values.content}
            onChange={handleChange}
            rows="4"
            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration (weeks)</label>
          <Input
            type="number"
            name="durationWeeks"
            placeholder="Number of weeks"
            value={values.durationWeeks}
            onChange={handleChange}
            error={errors.durationWeeks}
            min="1"
            required
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting || loading}
            className="flex-1"
          >
            {initialData ? 'Update Course' : 'Create Course'}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};
