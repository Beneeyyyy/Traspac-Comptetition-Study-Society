import { createContext, useContext, useReducer } from 'react'

const CommunityContext = createContext()

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
  questions: [],
  studyGroups: initialStudyGroups,
  enrolledMaterials: {},
  isLoading: false,
  error: null
}

const communityReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    
    case 'SET_QUESTIONS':
      return { ...state, questions: action.payload }
    
    case 'ADD_QUESTION':
      return { 
        ...state, 
        questions: [action.payload, ...state.questions]
      }
    
    case 'ADD_ANSWER':
      return {
        ...state,
        questions: state.questions.map(question => 
          question.id === action.payload.questionId
            ? {
                ...question,
                answers: [...(question.answers || []), action.payload.answer]
              }
            : question
        )
      }

    case 'ADD_COMMENT': {
      return {
        ...state,
        questions: state.questions.map(question => {
          if (question.id === action.payload.questionId) {
            return {
              ...question,
              answers: question.answers.map(answer => {
                if (answer.id === action.payload.answerId) {
                  const newComment = action.payload.comment
                  
                  if (newComment.parentId) {
                    return {
                      ...answer,
                      comments: answer.comments.map(comment => {
                        if (comment.id === newComment.parentId) {
                          return {
                            ...comment,
                            replies: [...(comment.replies || []), newComment]
                          }
                        }
                        return comment
                      })
                    }
                  }
                  
                  return {
                    ...answer,
                    comments: [...(answer.comments || []), newComment]
                  }
                }
                return answer
              })
            }
          }
          return question
        })
      }
    }

    case 'UPDATE_VOTE':
      return {
        ...state,
        questions: state.questions.map(question => {
          if (action.payload.type === 'question' && question.id === action.payload.id) {
            return { ...question, votes: question.votes + action.payload.value }
          }
          if (action.payload.type === 'answer') {
            return {
              ...question,
              answers: question.answers.map(answer =>
                answer.id === action.payload.id
                  ? { ...answer, votes: answer.votes + action.payload.value }
                  : answer
              )
            }
          }
          return question
        })
      }

    case 'SET_STUDY_GROUPS':
      return { ...state, studyGroups: action.payload }
    
    case 'CREATE_STUDY_GROUP':
      return { 
        ...state, 
        studyGroups: [action.payload, ...state.studyGroups]
      }
    
    case 'JOIN_STUDY_GROUP':
      return {
        ...state,
        studyGroups: state.studyGroups.map(group =>
          group.id === action.payload.groupId
            ? { ...group, members: group.members + 1, isMember: true }
            : group
        )
      }

    case 'LEAVE_STUDY_GROUP':
      return {
        ...state,
        studyGroups: state.studyGroups.map(group =>
          group.id === action.payload.groupId
            ? { ...group, members: group.members - 1, isMember: false }
            : group
        )
      }

    case 'ENROLL_IN_MATERIAL':
      return {
        ...state,
        enrolledMaterials: {
          ...state.enrolledMaterials,
          [action.payload.groupId]: [
            ...(state.enrolledMaterials[action.payload.groupId] || []),
            action.payload.materialId
          ]
        }
      }

    case 'UNENROLL_FROM_MATERIAL':
      return {
        ...state,
        enrolledMaterials: {
          ...state.enrolledMaterials,
          [action.payload.groupId]: state.enrolledMaterials[action.payload.groupId]
            .filter(id => id !== action.payload.materialId)
        }
      }

    default:
      return state
  }
}

export const CommunityProvider = ({ children }) => {
  const [state, dispatch] = useReducer(communityReducer, initialState)

  const addQuestion = (question) => {
    dispatch({ type: 'ADD_QUESTION', payload: {
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
    }})
  }

  const addAnswer = (questionId, answer) => {
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
          timeAgo: 'Baru saja',
          comments: [],
          ...answer
        }
      }
    })
  }

  const addComment = (questionId, answerId, comment) => {
    dispatch({
      type: 'ADD_COMMENT',
      payload: {
        questionId,
        answerId,
        comment: {
          id: Date.now(),
          user: {
            name: 'You',
            avatar: '/avatars/default.png'
          },
          timeAgo: 'Baru saja',
          likes: 0,
          replies: [],
          ...comment
        }
      }
    })
  }

  const updateVote = (type, id, value) => {
    dispatch({
      type: 'UPDATE_VOTE',
      payload: { type, id, value }
    })
  }

  const createStudyGroup = (groupData) => {
    dispatch({
      type: 'CREATE_STUDY_GROUP',
      payload: {
        id: Date.now(),
        members: 1,
        activeMembers: 1,
        isMember: true,
        lastActive: 'Baru saja',
        recentDiscussions: [],
        ...groupData
      }
    })
  }

  const joinStudyGroup = (groupId) => {
    dispatch({
      type: 'JOIN_STUDY_GROUP',
      payload: { groupId }
    })
  }

  const leaveStudyGroup = (groupId) => {
    dispatch({
      type: 'LEAVE_STUDY_GROUP',
      payload: { groupId }
    })
  }

  const enrollInMaterial = (groupId, materialId) => {
    dispatch({
      type: 'ENROLL_IN_MATERIAL',
      payload: { groupId, materialId }
    })
  }

  const unenrollFromMaterial = (groupId, materialId) => {
    dispatch({
      type: 'UNENROLL_FROM_MATERIAL',
      payload: { groupId, materialId }
    })
  }

  const value = {
    ...state,
    dispatch,
    addQuestion,
    addAnswer,
    addComment,
    updateVote,
    createStudyGroup,
    joinStudyGroup,
    leaveStudyGroup,
    enrollInMaterial,
    unenrollFromMaterial
  }

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  )
}

export const useCommunity = () => {
  const context = useContext(CommunityContext)
  if (!context) {
    throw new Error('useCommunity must be used within a CommunityProvider')
  }
  return context
} 