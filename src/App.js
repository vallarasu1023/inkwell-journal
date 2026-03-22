import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./styles/global.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { SignIn, SignUp } from "./pages/Auth";
import PostDetail from "./pages/PostDetail";
import Write from "./pages/Write";
import { ImageSearch, Profile, Bookmarks, Search, TagPage, Drafts } from "./pages/Pages";
import { Help, Status, About, Careers, Press, BlogPage, Privacy, Rules, Terms, TextToSpeech } from "./pages/staticpages";
import { ForgotPassword, ResetPassword } from "./pages/ForgotPassword";


function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/signin" replace />;
}

function AppRoutes() {
  const footerLinks = [
    { label: "Help", path: "/help" },
    { label: "Status", path: "/status" },
    { label: "About", path: "/about" },
    { label: "Careers", path: "/careers" },
    { label: "Press", path: "/press" },
    { label: "Blog", path: "/blog" },
    { label: "Privacy", path: "/privacy" },
    { label: "Rules", path: "/rules" },
    { label: "Terms", path: "/terms" },
    { label: "Text to speech", path: "/text-to-speech" },
  ];

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"               element={<Home />} />
        <Route path="/signin"         element={<SignIn />} />
        <Route path="/signup"         element={<SignUp />} />
        <Route path="/post/:id"       element={<PostDetail />} />
        <Route path="/images"         element={<ImageSearch />} />
        <Route path="/search"         element={<Search />} />
        <Route path="/tag/:tag"       element={<TagPage />} />
        <Route path="/profile/:id"    element={<Profile />} />
        <Route path="/write"          element={<PrivateRoute><Write /></PrivateRoute>} />
        <Route path="/write/draft/:draftId" element={<PrivateRoute><Write /></PrivateRoute>} />
        <Route path="/drafts"         element={<PrivateRoute><Drafts /></PrivateRoute>} />
        <Route path="/bookmarks"      element={<PrivateRoute><Bookmarks /></PrivateRoute>} />
        <Route path="/help"           element={<Help />} />
        <Route path="/status"         element={<Status />} />
        <Route path="/about"          element={<About />} />
        <Route path="/careers"        element={<Careers />} />
        <Route path="/press"          element={<Press />} />
        <Route path="/blog"           element={<BlogPage />} />
        <Route path="/privacy"        element={<Privacy />} />
        <Route path="/rules"          element={<Rules />} />
        <Route path="/terms"          element={<Terms />} />
        <Route path="/text-to-speech" element={<TextToSpeech />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="*"               element={
          <div style={{ textAlign: "center", padding: "120px 24px" }}>
            <h1 style={{ fontFamily: "Lora, serif", fontSize: 48, marginBottom: 16 }}>404</h1>
            <p style={{ color: "#6b6b6b", marginBottom: 24 }}>Page not found.</p>
            <Link to="/" style={{ color: "#1a8917", fontWeight: 600 }}>Go home</Link>
          </div>
        } />
      </Routes>
      <footer style={{ borderTop: "1px solid #e6e6e6", padding: "32px 24px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "8px 20px", marginBottom: 16 }}>
          {footerLinks.map(({ label, path }) => (
            <Link key={label} to={path} style={{ fontSize: 13, color: "#9b9b9b", textDecoration: "none" }}>{label}</Link>
          ))}
        </div>
        <p style={{ fontSize: 13, color: "#9b9b9b" }}>© 2025 Inkwell</p>
      </footer>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}