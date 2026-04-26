import Header from './components/Header';
import FeatureCards from './components/FeatureCards';
import ControlCenter from './components/ControlCenter';
import DiseaseGuide from './components/DiseaseGuide';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="app">
      <Header />
      <FeatureCards />
      <ControlCenter />
      <DiseaseGuide />
      <Footer />
    </div>
  );
}
