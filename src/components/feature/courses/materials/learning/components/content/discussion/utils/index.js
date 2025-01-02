export const formatDate = (date) => {
  return new Date(date).toLocaleString('id-ID');
};

export const getAvatarUrl = (name) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`;
};

export const isDiscussionCreator = (userId, discussion) => {
  return userId === discussion.userId;
};

export const canResolveDiscussion = (currentUser, discussion) => {
  return currentUser?.id === discussion.userId && !discussion.isResolved;
};

export const isResolvedReply = (reply, discussion) => {
  return discussion?.resolvedReplyId === reply.id;
}; 