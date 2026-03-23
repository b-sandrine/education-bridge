import { useSelector } from 'react-redux';

export const useAuth = () => {
  return useSelector((state) => state.auth);
};

export const useContent = () => {
  return useSelector((state) => state.content);
};

export const useProgress = () => {
  return useSelector((state) => state.progress);
};
