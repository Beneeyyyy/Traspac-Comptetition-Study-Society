import React, { createContext, useContext, useReducer, useMemo } from 'react'

const CommunityContext = createContext()

export const useCommunity = () => {
  const context = useContext(CommunityContext)
  if (!context) {
    throw new Error('useCommunity must be used within a CommunityProvider')
  }
  return context
}

const initialStudyGroups = [
  {
    id: 1,
    name: "Kelompok Belajar Matematika",
    topic: "Matematika",
    description: "Grup diskusi untuk membahas soal-soal matematika dan persiapan ujian",
    members: 128,
    activeMembers: 45,
    lastActive: "Baru saja",
    topics: ["Aljabar", "Geometri", "Kalkulus"],
    schedule: "Setiap Senin & Rabu",
    nextMeeting: "Senin, 19:00 WIB",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
    recentDiscussions: [
      "Pembahasan soal UTBK 2023",
      "Tips mengerjakan soal cerita",
      "Latihan soal Integral"
    ],
    isMember: false
  },
  {
    id: 2,
    name: "Grup Bahasa Inggris",
    topic: "Bahasa",
    description: "Praktik speaking dan listening bersama native speaker",
    members: 95,
    activeMembers: 32,
    lastActive: "5 menit yang lalu",
    topics: ["Speaking", "TOEFL", "Grammar"],
    schedule: "Setiap Selasa & Jumat",
    nextMeeting: "Selasa, 20:00 WIB",
    image: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc",
    recentDiscussions: [
      "English Speaking Club",
      "IELTS Writing Tips",
      "Daily Conversation Practice"
    ],
    isMember: false
  },
  {
    id: 3,
    name: "Komunitas Fisika",
    topic: "Fisika",
    description: "Diskusi konsep fisika dan eksperimen virtual bersama",
    members: 76,
    activeMembers: 28,
    lastActive: "15 menit yang lalu",
    topics: ["Mekanika", "Listrik", "Termodinamika"],
    schedule: "Setiap Kamis",
    nextMeeting: "Kamis, 19:30 WIB",
    image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa",
    recentDiscussions: [
      "Pembahasan Soal Olimpiade",
      "Praktikum Virtual",
      "Q&A Konsep Dasar"
    ],
    isMember: false
  }
]

const initialState = {
  communities: initialStudyGroups,
  currentUser: {
    name: 'You',
    image: 'https://ui-avatars.com/api/?name=You&background=6366F1&color=fff',
    role: 'Member'
  }
}

const communityReducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_STUDY_GROUP':
      return {
        ...state,
        communities: [...state.communities, action.payload]
      }
    case 'JOIN_STUDY_GROUP':
      return {
        ...state,
        communities: state.communities.map(group =>
          group.id === action.payload.groupId
            ? { ...group, isMember: true, members: group.members + 1 }
            : group
        )
      }
    case 'LEAVE_STUDY_GROUP':
      return {
        ...state,
        communities: state.communities.map(group =>
          group.id === action.payload.groupId
            ? { ...group, isMember: false, members: Math.max(0, group.members - 1) }
            : group
        )
      }
    case 'ADD_QUESTION':
    case 'ADD_ANSWER':
    case 'ADD_COMMENT':
    case 'UPDATE_VOTE':
    case 'ENROLL_IN_MATERIAL':
    case 'UNENROLL_FROM_MATERIAL':
      return state
    default:
      return state
  }
}

export const CommunityProvider = ({ children }) => {
  const [state, dispatch] = useReducer(communityReducer, initialState)

  const value = useMemo(() => ({
    state,
    dispatch,
    addQuestion: (question) => {
      dispatch({ 
        type: 'ADD_QUESTION', 
        payload: {
          id: Date.now(),
          user: {
            name: 'You',
            avatar: '/avatars/default.png',
            badge: 'Member'
          },
          votes: 0,
          answers: [],
          views: 0,
          timeAgo: 'Baru saja',
          ...question
        }
      })
    },
    addAnswer: (questionId, answer) => {
      dispatch({
        type: 'ADD_ANSWER',
        payload: {
          questionId,
          answer: {
            id: Date.now(),
            user: {
              name: 'You',
              avatar: '/avatars/default.png',
              badge: 'Member'
            },
            votes: 0,
            comments: [],
            timeAgo: 'Baru saja',
            ...answer
          }
        }
      })
    },
    addComment: (questionId, answerId, comment, parentId = null) => {
      dispatch({
        type: 'ADD_COMMENT',
        payload: {
          questionId,
          answerId,
          comment: {
            id: Date.now(),
            user: {
              name: 'You',
              avatar: '/avatars/default.png',
              badge: 'Member'
            },
            parentId,
            timeAgo: 'Baru saja',
            ...comment
          }
        }
      })
    },
    updateVote: (type, id, value) => {
      dispatch({
        type: 'UPDATE_VOTE',
        payload: { type, id, value }
      })
    },
    createStudyGroup: (groupData) => {
      dispatch({
        type: 'CREATE_STUDY_GROUP',
        payload: {
          id: Date.now(),
          ...groupData
        }
      })
    },
    joinStudyGroup: (groupId) => {
      dispatch({
        type: 'JOIN_STUDY_GROUP',
        payload: { groupId }
      })
    },
    leaveStudyGroup: (groupId) => {
      dispatch({
        type: 'LEAVE_STUDY_GROUP',
        payload: { groupId }
      })
    },
    enrollInMaterial: (groupId, materialId) => {
      dispatch({
        type: 'ENROLL_IN_MATERIAL',
        payload: { groupId, materialId }
      })
    },
    unenrollFromMaterial: (groupId, materialId) => {
      dispatch({
        type: 'UNENROLL_FROM_MATERIAL',
        payload: { groupId, materialId }
      })
    }
  }), [state])

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  )
}

export default CommunityProvider 