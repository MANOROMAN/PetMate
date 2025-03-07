import { createSlice } from '@reduxjs/toolkit';

const petSlice = createSlice({
  name: 'pets',
  initialState: {
    userPets: [],
    recommendedPets: [],
    matchedPets: [],
    likedPets: [],
    loading: false,
    error: null
  },
  reducers: {
    setUserPets: (state, action) => {
      state.userPets = action.payload;
    },
    addUserPet: (state, action) => {
      state.userPets.push(action.payload);
    },
    updateUserPet: (state, action) => {
      const index = state.userPets.findIndex(pet => pet.id === action.payload.id);
      if (index !== -1) {
        state.userPets[index] = action.payload;
      }
    },
    deleteUserPet: (state, action) => {
      state.userPets = state.userPets.filter(pet => pet.id !== action.payload);
    },
    setRecommendedPets: (state, action) => {
      state.recommendedPets = action.payload;
    },
    setMatchedPets: (state, action) => {
      state.matchedPets = action.payload;
    },
    addMatchedPet: (state, action) => {
      state.matchedPets.push(action.payload);
    },
    addLikedPet: (state, action) => {
      state.likedPets.push(action.payload);
    },
    removeLikedPet: (state, action) => {
      state.likedPets = state.likedPets.filter(petId => petId !== action.payload);
    },
    setPetLoading: (state, action) => {
      state.loading = action.payload;
    },
    setPetError: (state, action) => {
      state.error = action.payload;
    },
    clearPetError: (state) => {
      state.error = null;
    }
  }
});

export const { 
  setUserPets,
  addUserPet,
  updateUserPet,
  deleteUserPet,
  setRecommendedPets,
  setMatchedPets,
  addMatchedPet,
  addLikedPet,
  removeLikedPet,
  setPetLoading,
  setPetError,
  clearPetError
} = petSlice.actions;

export default petSlice.reducer;