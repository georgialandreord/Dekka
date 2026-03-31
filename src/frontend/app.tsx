import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import Folders from "~/frontend/pages/folders";
import Folder from "./pages/folder/folder";
import StarredFolders from "./pages/starred/starred-folders";
import { ProtectedRoute } from "~/frontend/components/protected-route";
import { DashboardLayout } from "./layouts/dashboard-layout";
import { FolderLayout } from "./layouts/folder-layout";
import MarketPlace from "./pages/marketplace/market-place";
import ArtistDashboard from "./pages/artist/artist-dashboard";
import FolderEditor from "./pages/foldereditor/folder-editor";
import UserProfile from "./pages/user/user-profile";
import Stickers from "./pages/newstickers/stickers";
import Themes from "./pages/theme/theme";
import { ThemeProvider } from "~/contexts/ThemeContext";
import Sandbox from "./pages/sandbox/sandbox";
import Upload from "./pages/sandboxSticker/upload";
import BuyCredits from "./pages/purchase/buy-credits";
import { SuccessScreen } from "./pages/success/success-screen";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="folders" replace />} />
            <Route
              path="folders"
              element={
                <ProtectedRoute>
                  <FolderLayout />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={
                  <ProtectedRoute>
                    <Folders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="*"
                element={
                  <ProtectedRoute>
                    <Folder />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route
              path="marketplace"
              element={
                <ProtectedRoute>
                  <MarketPlace />
                </ProtectedRoute>
              }
            />
            <Route
              path="artist"
              element={
                <ProtectedRoute>
                  <ArtistDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="generate-sticker"
              element={
                <ProtectedRoute>
                  <Stickers />
                </ProtectedRoute>
              }
            />
            <Route
              path="starred"
              element={
                <ProtectedRoute>
                  <StarredFolders />
                </ProtectedRoute>
              }
            />
            <Route
              path="user-profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="theme"
              element={
                <ProtectedRoute>
                  <Themes />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route
            path="folder-editor"
            element={
              <ProtectedRoute>
                <FolderEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="sandbox"
            element={
              <ProtectedRoute>
                <Sandbox />
              </ProtectedRoute>
            }
          />
          <Route
            path="upload"
            element={
              <ProtectedRoute>
                <Upload />
              </ProtectedRoute>
            }
          />
          <Route
            path="buy-credits"
            element={
              <ProtectedRoute>
                <BuyCredits />
              </ProtectedRoute>
            }
          />

          <Route
            path="success"
            element={
              <ProtectedRoute>
                <SuccessScreen />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
