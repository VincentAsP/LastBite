import { Routes, Route } from 'react-router-dom';
import Index from './Index';
import SignUp from './signup';
import Homepage from './homepage';
import MysteryBox from './mysterybox';
import FoodPage from './foodpage';
import ChartPage from './chart';
import CartPage from './cartpage';
import OrderSum from './ordersum';
import FinishOrder from './finishorder';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/home" element={<Homepage />} /> 
      <Route path="/mystery" element={<MysteryBox />} />
      <Route path="/food" element={<FoodPage />} />
      <Route path="/chart" element={<ChartPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/order" element={<OrderSum />} />
      <Route path="/finish" element={<FinishOrder />} />
    </Routes>
  );
}

export default App;