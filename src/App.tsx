// App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./Home";
import CollectionDetail from "./CollectionDetail";
import Cart from "./Cart";
import MyPage from "./MyPage";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import AddOutfit from "./addoutfit";
import MyProfile from "./Profile";


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/collection" element={<CollectionDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/add" element={<AddOutfit />} />
      <Route path="/add" element={<MyProfile />} />
    </Routes>
  );
};

export default App; // 👈 이 줄이 꼭 있어야 함!
