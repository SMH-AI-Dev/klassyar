import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/shared/ErrorBoundary';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider, useToast } from './components/ui/toast';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import SavedActivities from './pages/SavedActivities';
import Features from './pages/Features';
import About from './pages/About';
import MyClasses from './pages/MyClasses';
import Login from './pages/Login';
import TeacherReports from './pages/TeacherReports';
import LanguageLearning from './pages/LanguageLearning';
import GradeSelection from './pages/GradeSelection';
import LearningOptions from './pages/LearningOptions';
import LearningItems from './pages/LearningItems';
import GameHub from './pages/GameHub';
import EnglishGameHub from './pages/EnglishGameHub';
import PlayGame from './pages/PlayGame';
import PlayEnglish from './pages/PlayEnglish';

// Create Pages
import CreateFlashcard from './pages/CreateFlashcard';
import CreateQuiz from './pages/CreateQuiz';
import CreateMatching from './pages/CreateMatching';
import CreateGroup_sort from './pages/CreateGroup_sort';
import CreateMemory_game from './pages/CreateMemory_game';
import CreateRandom_wheel from './pages/CreateRandom_wheel';
import CreateTrue_false from './pages/CreateTrue_false';
import CreateUnjumble from './pages/CreateUnjumble';
import CreateWhack_a_mole from './pages/CreateWhack_a_mole';
import CreateWordsearch from './pages/CreateWordsearch';
import CreateFill_blank from './pages/CreateFill_blank';
import CreateRanking from './pages/CreateRanking';
import CreateCrossword from './pages/CreateCrossword';
import CreateTimeline from './pages/CreateTimeline';
import CreateSpinner from './pages/CreateSpinner';
import CreateCard_flip from './pages/CreateCard_flip';
import CreateHotspot from './pages/CreateHotspot';
import CreateDrag_text from './pages/CreateDrag_text';
import CreateBalloon_pop from './pages/CreateBalloon_pop';
import CreateGameshow_quiz from './pages/CreateGameshow_quiz';
import CreateMaze_chase from './pages/CreateMaze_chase';
import CreateAirplane from './pages/CreateAirplane';
import CreateOpen_the_box from './pages/CreateOpen_the_box';
import CreateMissing_word from './pages/CreateMissing_word';
import CreateAnagram from './pages/CreateAnagram';
import CreateHangman from './pages/CreateHangman';
import CreateFlip_tiles from './pages/CreateFlip_tiles';
import CreateImage_quiz from './pages/CreateImage_quiz';
import CreateLabelled_diagram from './pages/CreateLabelled_diagram';
import CreateRandom_cards from './pages/CreateRandom_cards';

// Play Pages
import PlayQuiz from './pages/PlayQuiz';
import PlayFlashcard from './pages/PlayFlashcard';
import PlayRandom_wheel from './pages/PlayRandom_wheel';
import PlayTrue_false from './pages/PlayTrue_false';
import PlayUnjumble from './pages/PlayUnjumble';
import PlayMatching from './pages/PlayMatching';
import PlayMemory_game from './pages/PlayMemory_game';
import PlayGroup_sort from './pages/PlayGroup_sort';
import PlayWordsearch from './pages/PlayWordsearch';
import PlayWhack_a_mole from './pages/PlayWhack_a_mole';
import PlayFill_blank from './pages/PlayFill_blank';
import PlayRanking from './pages/PlayRanking';
import PlaySpinner from './pages/PlaySpinner';
import PlayTimeline from './pages/PlayTimeline';
import PlayCrossword from './pages/PlayCrossword';
import PlayCard_flip from './pages/PlayCard_flip';
import PlayDrag_text from './pages/PlayDrag_text';
import PlayBalloon_pop from './pages/PlayBalloon_pop';
import PlayMissing_word from './pages/PlayMissing_word';
import PlayAnagram from './pages/PlayAnagram';
import PlayRandom_cards from './pages/PlayRandom_cards';
import PlayAirplane from './pages/PlayAirplane';
import PlayGameshow_quiz from './pages/PlayGameshow_quiz';
import PlayHangman from './pages/PlayHangman';
import PlayHotspot from './pages/PlayHotspot';
import PlayImage_quiz from './pages/PlayImage_quiz';
import PlayLabelled_diagram from './pages/PlayLabelled_diagram';
import PlayMaze_chase from './pages/PlayMaze_chase';
import PlayOpen_the_box from './pages/PlayOpen_the_box';
import PlayFlip_tiles from './pages/PlayFlip_tiles';

// Edit Pages
import EditQuiz from './pages/EditQuiz';
import EditFlashcard from './pages/EditFlashcard';
import EditMatching from './pages/EditMatching';
import EditMemory_game from './pages/EditMemory_game';
import EditGroup_sort from './pages/EditGroup_sort';
import EditWordsearch from './pages/EditWordsearch';
import EditRandom_wheel from './pages/EditRandom_wheel';
import EditUnjumble from './pages/EditUnjumble';
import EditTrue_false from './pages/EditTrue_false';
import EditWhack_a_mole from './pages/EditWhack_a_mole';
import EditFill_blank from './pages/EditFill_blank';
import EditRanking from './pages/EditRanking';
import EditSpinner from './pages/EditSpinner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function IndexRouter() {
  const { isLoggedIn, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-pink-900"><div className="w-10 h-10 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" /></div>;
  if (!isLoggedIn) return <Login />;
  return <Layout><Home /></Layout>;
}

function PublicRoute({ children }) {
  return <>{children}</>;
}

function AppContent() {
  const { addToast } = useToast();
  
  useEffect(() => {
    window.toastAdd = addToast;
  }, [addToast]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes (no Layout) */}
        <Route path="/Login" element={<Login />} />
        
        {/* App routes (with Layout) */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<IndexRouter />} />
        </Route>
        <Route path="/Home" element={<Layout><Home /></Layout>} />
        <Route path="/Dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/SavedActivities" element={<Layout><SavedActivities /></Layout>} />
        <Route path="/Features" element={<Layout><Features /></Layout>} />
        <Route path="/About" element={<Layout><About /></Layout>} />
        <Route path="/MyClasses" element={<Layout><MyClasses /></Layout>} />
        <Route path="/TeacherReports" element={<Layout><TeacherReports /></Layout>} />
        <Route path="/LanguageLearning" element={<Layout><LanguageLearning /></Layout>} />
        <Route path="/LanguageLearning/grades" element={<Layout><GradeSelection /></Layout>} />
        <Route path="/LanguageLearning/:gradeId" element={<Layout><LearningOptions /></Layout>} />
        <Route path="/LanguageLearning/:gradeId/:optionId" element={<Layout><LearningItems /></Layout>} />
        <Route path="/game-hub" element={<Layout><GameHub /></Layout>} />
        <Route path="/english-hub" element={<Layout><EnglishGameHub /></Layout>} />
        <Route path="/play-game/:gameId" element={<PlayGame />} />
        <Route path="/play-english/:gameId" element={<PlayEnglish />} />
        
        {/* Create Route */}
        <Route path="/Create" element={<CreateRouter />} />
        
        {/* Play & Edit Routes */}
        <Route path="/Play" element={<PlayRouter />} />
        <Route path="/Edit" element={<EditRouter />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}

// Router component to handle different create types based on activity type
function CreateRouter() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'quiz';

  const createComponents = {
    flashcard: CreateFlashcard,
    quiz: CreateQuiz,
    matching: CreateMatching,
    group_sort: CreateGroup_sort,
    memory_game: CreateMemory_game,
    random_wheel: CreateRandom_wheel,
    true_false: CreateTrue_false,
    unjumble: CreateUnjumble,
    whack_a_mole: CreateWhack_a_mole,
    wordsearch: CreateWordsearch,
    fill_blank: CreateFill_blank,
    ranking: CreateRanking,
    crossword: CreateCrossword,
    timeline: CreateTimeline,
    spinner: CreateSpinner,
    card_flip: CreateCard_flip,
    hotspot: CreateHotspot,
    drag_text: CreateDrag_text,
    balloon_pop: CreateBalloon_pop,
    gameshow_quiz: CreateGameshow_quiz,
    maze_chase: CreateMaze_chase,
    airplane: CreateAirplane,
    open_the_box: CreateOpen_the_box,
    missing_word: CreateMissing_word,
    anagram: CreateAnagram,
    hangman: CreateHangman,
    flip_tiles: CreateFlip_tiles,
    image_quiz: CreateImage_quiz,
    labelled_diagram: CreateLabelled_diagram,
    random_cards: CreateRandom_cards,
  };

  const Component = createComponents[type] || CreateQuiz;
  return <Component />;
}

// Router component to handle different activity types based on type param
function PlayRouter() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'quiz';

  const playComponents = {
    quiz: PlayQuiz,
    flashcard: PlayFlashcard,
    matching: PlayMatching,
    memory_game: PlayMemory_game,
    group_sort: PlayGroup_sort,
    wordsearch: PlayWordsearch,
    random_wheel: PlayRandom_wheel,
    true_false: PlayTrue_false,
    unjumble: PlayUnjumble,
    whack_a_mole: PlayWhack_a_mole,
    fill_blank: PlayFill_blank,
    ranking: PlayRanking,
    spinner: PlaySpinner,
    timeline: PlayTimeline,
    crossword: PlayCrossword,
    card_flip: PlayCard_flip,
    drag_text: PlayDrag_text,
    balloon_pop: PlayBalloon_pop,
    missing_word: PlayMissing_word,
    anagram: PlayAnagram,
    random_cards: PlayRandom_cards,
    airplane: PlayAirplane,
    gameshow_quiz: PlayGameshow_quiz,
    hangman: PlayHangman,
    hotspot: PlayHotspot,
    image_quiz: PlayImage_quiz,
    labelled_diagram: PlayLabelled_diagram,
    maze_chase: PlayMaze_chase,
    open_the_box: PlayOpen_the_box,
    flip_tiles: PlayFlip_tiles,
  };

  const Component = playComponents[type] || PlayQuiz;
  return <Component />;
}

// Router component to handle different edit types based on activity type
function EditRouter() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'quiz';

  const editComponents = {
    quiz: EditQuiz,
    flashcard: EditFlashcard,
    matching: EditMatching,
    memory_game: EditMemory_game,
    group_sort: EditGroup_sort,
    wordsearch: EditWordsearch,
    random_wheel: EditRandom_wheel,
    true_false: EditTrue_false,
    unjumble: EditUnjumble,
    whack_a_mole: EditWhack_a_mole,
    fill_blank: EditFill_blank,
    ranking: EditRanking,
    spinner: EditSpinner,
  };

  const Component = editComponents[type] || EditQuiz;
  return <Component />;
}

export default App;
