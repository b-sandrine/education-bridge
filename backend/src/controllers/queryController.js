import QueryService from '../services/QueryService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// Student endpoints
export const createQuery = asyncHandler(async (req, res) => {
  const query = await QueryService.createQuery(req.body, req.user.id);
  res.status(201).json({
    status: 'success',
    message: 'Query submitted successfully',
    data: query,
  });
});

export const getMyQueries = asyncHandler(async (req, res) => {
  const queries = await QueryService.getStudentQueries(req.user.id);
  res.status(200).json({
    status: 'success',
    data: queries,
  });
});

// Admin endpoints
export const getAdminQueries = asyncHandler(async (req, res) => {
  const filters = {
    status: req.query.status,
  };
  const queries = await QueryService.getAdminQueries(filters);
  res.status(200).json({
    status: 'success',
    data: queries,
  });
});

export const getQueryById = asyncHandler(async (req, res) => {
  const query = await QueryService.getQueryById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: query,
  });
});

export const respondToQuery = asyncHandler(async (req, res) => {
  const { response, status } = req.body;
  
  const updatedQuery = await QueryService.respondToQuery(
    req.params.id,
    req.user.id,
    response,
    status || 'resolved'
  );
  
  res.status(200).json({
    status: 'success',
    message: 'Query responded to successfully',
    data: updatedQuery,
  });
});

export const updateQueryStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  const updatedQuery = await QueryService.updateQueryStatus(req.params.id, status);
  
  res.status(200).json({
    status: 'success',
    message: 'Query status updated',
    data: updatedQuery,
  });
});

export const deleteQuery = asyncHandler(async (req, res) => {
  await QueryService.deleteQuery(req.params.id, req.user.id);
  res.status(200).json({
    status: 'success',
    message: 'Query deleted successfully',
  });
});
