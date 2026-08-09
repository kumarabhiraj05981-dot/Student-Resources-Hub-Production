import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Notes from "./pages/Notes";
import Pyq from "./pages/Pyq";
import Syllabus from "./pages/Syllabus";
import Ebooks from "./pages/Ebooks";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import AIQuestionPaper from "./pages/AIQuestionPaper";
import BranchResources from "./pages/BranchResources";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* EXISTING RESOURCE PAGES */}
        <Route
          path="/notes"
          element={<Notes />}
        />

        <Route
          path="/pyq"
          element={<Pyq />}
        />

        <Route
          path="/syllabus"
          element={<Syllabus />}
        />

        <Route
          path="/ebooks"
          element={<Ebooks />}
        />

        {/* BRANCH RESOURCES */}
        <Route
          path="/branch-resources"
          element={<BranchResources />}
        />

        {/* AUTH */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={<Admin />}
        />

        {/* AI QUESTION PAPER */}
        <Route
          path="/ai-question-paper"
          element={
            <AIQuestionPaper />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
