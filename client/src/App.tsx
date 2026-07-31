import { useState, useEffect, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/website/Home";
import Team from "./pages/website/Team";
import Projects from "./pages/website/Projects";
import JoinHiveMind from "./pages/website/JoinHiveMind";
import Journey from "./pages/website/Journey";
import Events from "./pages/website/Events";
import NotFound from "./pages/website/NotFound";
import SplashScreen from "./compoenets/SplashScreen";
import PageTransition from "./compoenets/PageTransition";
import ScrollToTopButton from "./compoenets/ScrollToTopButton";
import Navbar from "./compoenets/Navbar";
import AdminLoader from "./compoenets/AdminLoader";
import CanonicalTag from "./compoenets/CanonicalTag";
import OrganizationSchema from "./compoenets/OrganizationSchema";
import WebSiteSchema from "./compoenets/WebSiteSchema";


import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TeamManagement from "./pages/admin/TeamManagement";
import ProjectsManagement from "./pages/admin/ProjectsManagement";
import ApplicationsManagement from "./pages/admin/ApplicationsManagement";
import CommunitySettingsManagement from "./pages/admin/CommunitySettingsManagement";
import MasterDataManagement from "./pages/admin/MasterDataManagement";

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTo(0, 0);
        document.body.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

export default function App() {
    const isAdminRoute = window.location.pathname.startsWith("/admin");
    const [showSplash, setShowSplash] = useState(!isAdminRoute);

    if (showSplash) {
        return <SplashScreen onComplete={() => setShowSplash(false)} />;
    }

    return (
        <Router>
            <CanonicalTag />
            <OrganizationSchema />
            <WebSiteSchema />
            <div className="w-full max-w-full overflow-x-hidden relative min-h-screen bg-[#050505] text-white">

                <ScrollToTop />
                <Navbar showSplash={false} />
                <ScrollToTopButton />
                <Suspense fallback={<AdminLoader />}>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <PageTransition>
                                    <Home showSplash={false} />
                                </PageTransition>
                            }
                        />
                        <Route
                            path="/projects"
                            element={
                                <PageTransition>
                                    <Projects />
                                </PageTransition>
                            }
                        />
                        <Route
                            path="/join"
                            element={
                                <PageTransition>
                                    <JoinHiveMind />
                                </PageTransition>
                            }
                        />
                        <Route
                            path="/team"
                            element={
                                <PageTransition>
                                    <Team />
                                </PageTransition>
                            }
                        />
                        <Route
                            path="/journey"
                            element={
                                <PageTransition>
                                    <Journey />
                                </PageTransition>
                            }
                        />
                        <Route
                            path="/events"
                            element={
                                <PageTransition>
                                    <Events />
                                </PageTransition>
                            }
                        />
                        <Route
                            path="/admin/login"
                            element={
                                <PageTransition>
                                    <AdminLogin />
                                </PageTransition>
                            }
                        />
                        <Route
                            path="/admin/dashboard"
                            element={
                                <PageTransition>
                                    <AdminDashboard />
                                </PageTransition>
                            }
                        />
                        <Route
                            path="/admin/team"
                            element={
                                <PageTransition>
                                    <TeamManagement />
                                </PageTransition>
                            }
                        />
                        <Route
                            path="/admin/projects"
                            element={
                                <PageTransition>
                                    <ProjectsManagement />
                                </PageTransition>
                            }
                        />
                        <Route
                            path="/admin/applications"
                            element={
                                <PageTransition>
                                    <ApplicationsManagement />
                                </PageTransition>
                            }
                        />
                        <Route
                            path="/admin/community-settings"
                            element={
                                <PageTransition>
                                    <CommunitySettingsManagement />
                                </PageTransition>
                            }
                        />
                        <Route
                            path="/admin/master-data"
                            element={
                                <PageTransition>
                                    <MasterDataManagement />
                                </PageTransition>
                            }
                        />
                        <Route
                            path="*"
                            element={
                                <PageTransition>
                                    <NotFound />
                                </PageTransition>
                            }
                        />
                    </Routes>
                </Suspense>
            </div>
        </Router>
    );
}
