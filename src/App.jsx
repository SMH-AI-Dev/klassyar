import React, { useEffect, Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/shared/ErrorBoundary';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider, useToast } from './components/ui/toast';
import Layout from './components/layout/Layout';

const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const SavedActivities = lazy(() => import('./pages/SavedActivities'));
const Features = lazy(() => import('./pages/Features'));
const About = lazy(() => import('./pages/About'));
const MyClasses = lazy(() => import('./pages/MyClasses'));
const Login = lazy(() => import('./pages/Login'));
const TeacherReports = lazy(() => import('./pages/TeacherReports'));
const LanguageLearning = lazy(() => import('./pages/LanguageLearning'));
const GradeSelection = lazy(() => import('./pages/GradeSelection'));
const LearningOptions = lazy(() => import('./pages/LearningOptions'));
const LearningItems = lazy(() => import('./pages/LearningItems'));
const GameHub = lazy(() => import('./pages/GameHub'));
const EnglishGameHub = lazy(() => import('./pages/EnglishGameHub'));
const PlayGame = lazy(() => import('./pages/PlayGame'));
const PlayEnglish = lazy(() => import('./pages/PlayEnglish'));

const CreateFlashcard = lazy(() => import('./pages/CreateFlashcard'));
const CreateQuiz = lazy(() => import('./pages/CreateQuiz'));
const CreateMatching = lazy(() => import('./pages/CreateMatching'));
const CreateGroup_sort = lazy(() => import('./pages/CreateGroup_sort'));
const CreateMemory_game = lazy(() => import('./pages/CreateMemory_game'));
const CreateRandom_wheel = lazy(() => import('./pages/CreateRandom_wheel'));
const CreateTrue_false = lazy(() => import('./pages/CreateTrue_false'));
const CreateUnjumble = lazy(() => import('./pages/CreateUnjumble'));
const CreateWhack_a_mole = lazy(() => import('./pages/CreateWhack_a_mole'));
const CreateWordsearch = lazy(() => import('./pages/CreateWordsearch'));
const CreateFill_blank = lazy(() => import('./pages/CreateFill_blank'));
const CreateRanking = lazy(() => import('./pages/CreateRanking'));
const CreateCrossword = lazy(() => import('./pages/CreateCrossword'));
const CreateTimeline = lazy(() => import('./pages/CreateTimeline'));
const CreateSpinner = lazy(() => import('./pages/CreateSpinner'));
const CreateCard_flip = lazy(() => import('./pages/CreateCard_flip'));
const CreateHotspot = lazy(() => import('./pages/CreateHotspot'));
const CreateDrag_text = lazy(() => import('./pages/CreateDrag_text'));
const CreateBalloon_pop = lazy(() => import('./pages/CreateBalloon_pop'));
const CreateGameshow_quiz = lazy(() => import('./pages/CreateGameshow_quiz'));
const CreateMaze_chase = lazy(() => import('./pages/CreateMaze_chase'));
const CreateAirplane = lazy(() => import('./pages/CreateAirplane'));
const CreateOpen_the_box = lazy(() => import('./pages/CreateOpen_the_box'));
const CreateMissing_word = lazy(() => import('./pages/CreateMissing_word'));
const CreateAnagram = lazy(() => import('./pages/CreateAnagram'));
const CreateHangman = lazy(() => import('./pages/CreateHangman'));
const CreateFlip_tiles = lazy(() => import('./pages/CreateFlip_tiles'));
const CreateImage_quiz = lazy(() => import('./pages/CreateImage_quiz'));
const CreateLabelled_diagram = lazy(() => import('./pages/CreateLabelled_diagram'));
const CreateRandom_cards = lazy(() => import('./pages/CreateRandom_cards'));

const PlayQuiz = lazy(() => import('./pages/PlayQuiz'));
const PlayFlashcard = lazy(() => import('./pages/PlayFlashcard'));
const PlayRandom_wheel = lazy(() => import('./pages/PlayRandom_wheel'));
const PlayTrue_false = lazy(() => import('./pages/PlayTrue_false'));
const PlayUnjumble = lazy(() => import('./pages/PlayUnjumble'));
const PlayMatching = lazy(() => import('./pages/PlayMatching'));
const PlayMemory_game = lazy(() => import('./pages/PlayMemory_game'));
const PlayGroup_sort = lazy(() => import('./pages/PlayGroup_sort'));
const PlayWordsearch = lazy(() => import('./pages/PlayWordsearch'));
const PlayWhack_a_mole = lazy(() => import('./pages/PlayWhack_a_mole'));
const PlayFill_blank = lazy(() => import('./pages/PlayFill_blank'));
const PlayRanking = lazy(() => import('./pages/PlayRanking'));
const PlaySpinner = lazy(() => import('./pages/PlaySpinner'));
const PlayTimeline = lazy(() => import('./pages/PlayTimeline'));
const PlayCrossword = lazy(() => import('./pages/PlayCrossword'));
const PlayCard_flip = lazy(() => import('./pages/PlayCard_flip'));
const PlayDrag_text = lazy(() => import('./pages/PlayDrag_text'));
const PlayBalloon_pop = lazy(() => import('./pages/PlayBalloon_pop'));
const PlayMissing_word = lazy(() => import('./pages/PlayMissing_word'));
const PlayAnagram = lazy(() => import('./pages/PlayAnagram'));
const PlayRandom_cards = lazy(() => import('./pages/PlayRandom_cards'));
const PlayAirplane = lazy(() => import('./pages/PlayAirplane'));
const PlayGameshow_quiz = lazy(() => import('./pages/PlayGameshow_quiz'));
const PlayHangman = lazy(() => import('./pages/PlayHangman'));
const PlayHotspot = lazy(() => import('./pages/PlayHotspot'));
const PlayImage_quiz = lazy(() => import('./pages/PlayImage_quiz'));
const PlayLabelled_diagram = lazy(() => import('./pages/PlayLabelled_diagram'));
const PlayMaze_chase = lazy(() => import('./pages/PlayMaze_chase'));
const PlayOpen_the_box = lazy(() => import('./pages/PlayOpen_the_box'));
const PlayFlip_tiles = lazy(() => import('./pages/PlayFlip_tiles'));

const EditQuiz = lazy(() => import('./pages/EditQuiz'));
const EditFlashcard = lazy(() => import('./pages/EditFlashcard'));
const EditMatching = lazy(() => import('./pages/EditMatching'));
const EditMemory_game = lazy(() => import('./pages/EditMemory_game'));
const EditGroup_sort = lazy(() => import('./pages/EditGroup_sort'));
const EditWordsearch = lazy(() => import('./pages/EditWordsearch'));
const EditRandom_wheel = lazy(() => import('./pages/EditRandom_wheel'));
const EditUnjumble = lazy(() => import('./pages/EditUnjumble'));
const EditTrue_false = lazy(() => import('./pages/EditTrue_false'));
const EditWhack_a_mole = lazy(() => import('./pages/EditWhack_a_mole'));
const EditFill_blank = lazy(() => import('./pages/EditFill_blank'));
const EditRanking = lazy(() => import('./pages/EditRanking'));
const EditSpinner = lazy(() => import('./pages/EditSpinner'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-pink-900">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-purple-200 text-sm">کلاس یار...</p>
      </div>
    </div>
  );
}

function IndexRouter() {
  const { isLoggedIn, loading } = useAuth();
  if (loading) return <PageLoader />;
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
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/Login" element={<Login />} />
          
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
          
          <Route path="/Create" element={<CreateRouter />} />
          
          <Route path="/Play" element={<PlayRouter />} />
          <Route path="/Edit" element={<EditRouter />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
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
