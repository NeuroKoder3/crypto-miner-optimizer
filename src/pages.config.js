import AIModel from './pages/AIModel';
import Automation from './pages/Automation';
import Benchmarks from './pages/Benchmarks';
import CoinSwitch from './pages/CoinSwitch';
import Dashboard from './pages/Dashboard';
import Profiles from './pages/Profiles';
import Guides from './pages/Guides';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AIModel": AIModel,
    "Automation": Automation,
    "Benchmarks": Benchmarks,
    "CoinSwitch": CoinSwitch,
    "Dashboard": Dashboard,
    "Profiles": Profiles,
    "Guides": Guides,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};