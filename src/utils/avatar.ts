export const getRobotAvatar = (seed: string): string => {
  const clean = encodeURIComponent(seed?.trim() || 'robot-member');
  return `https://robohash.org/${clean}?set=set1&size=200x200`;
};
