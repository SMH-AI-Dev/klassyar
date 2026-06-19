import React, { useEffect } from 'react';
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
import TeacherReports from './pages/TeacherReports';
import LanguageLearning from './pages/LanguageLearning';
import GradeSelection from './pages/GradeSelection';
import LearningOptions from './pages/LearningOptions';
import LearningItems from './pages/LearningItems';

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

function AppContent() {
  const { addToast } = useToast();
  
  useEffect(() => {
    window.toastAdd = addToast;
  }, [addToast]);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/SavedActivities" element={<SavedActivities />} />
          <Route path="/Features" element={<Features />} />
          <Route path="/About" element={<About />} />
          <Route path="/MyClasses" element={<MyClasses />} />
          <Route path="/TeacherReports" element={<TeacherReports />} />
          <Route path="/LanguageLearning" element={<LanguageLearning />} />
          <Route path="/LanguageLearning/grades" element={<GradeSelection />} />
          <Route path="/LanguageLearning/:gradeId" element={<LearningOptions />} />
          <Route path="/LanguageLearning/:gradeId/:optionId" element={<LearningItems />} />
          
          {/* Create Route */}
          <Route path="/Create" element={<CreateRouter />} />
          
          {/* Play & Edit Routes */}
          <Route path="/Play" element={<PlayRouter />} />
          <Route path="/Edit" element={<EditRouter />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
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
