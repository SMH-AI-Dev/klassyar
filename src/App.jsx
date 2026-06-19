import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
          
          {/* Create Routes */}
          <Route path="/CreateFlashcard" element={<CreateFlashcard />} />
          <Route path="/CreateQuiz" element={<CreateQuiz />} />
          <Route path="/CreateMatching" element={<CreateMatching />} />
          <Route path="/CreateGroup_sort" element={<CreateGroup_sort />} />
          <Route path="/CreateMemory_game" element={<CreateMemory_game />} />
          <Route path="/CreateRandom_wheel" element={<CreateRandom_wheel />} />
          <Route path="/CreateTrue_false" element={<CreateTrue_false />} />
          <Route path="/CreateUnjumble" element={<CreateUnjumble />} />
          <Route path="/CreateWhack_a_mole" element={<CreateWhack_a_mole />} />
          <Route path="/CreateWordsearch" element={<CreateWordsearch />} />
          
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
        <AppContent />
      </ToastProvider>
    </QueryClientProvider>
  );
}

// Router component to handle different play types based on activity type
function PlayRouter() {
  const urlParams = new URLSearchParams(window.location.search);
  const type = urlParams.get('type') || 'quiz';

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
  const urlParams = new URLSearchParams(window.location.search);
  const type = urlParams.get('type') || 'quiz';

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
