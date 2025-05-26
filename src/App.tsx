// App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./Home";
import Collections from "./Collections";
import CollectionDetail from "./CollectionDetail";
import Cart from "./Cart";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import AddOutfit from "./addoutfit";
import MyProfile from "./Profile";
import OutfitDetail from "./OutfitDetail";
import UserPage from "./UserPage";
import ProfileSetup from "./ProfileSetup";
import ProfileSetupF from "./ProfileSetupF";
import Bookmark from "./Bookmark";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/collections" element={<Collections />} />
      <Route path="/collection/:id" element={<CollectionDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/add" element={<AddOutfit />} />
      
      <Route path="/outfit/:id" element={<OutfitDetail />} />
      <Route path="/user/:userId" element={<UserPage />} />
      <Route path="/profile-setup" element={<ProfileSetup />} />
      <Route path="/profile-setup-f" element={<ProfileSetupF />} />
      <Route path="/user/:userId/bookmark" element={<Bookmark />} />
    </Routes>
  );
};

export default App; // 👈 이 줄이 꼭 있어야 함!
