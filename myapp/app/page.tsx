"use client";


import { useState } from 'react';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');

  // Handle search input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Mock search submission
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Replace this with actual search logic
    console.log('Searching for:', searchTerm);
  };

  return (
    <div>
      <h1>Tekken Stats</h1>

      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search for a player..."
          style={{
            padding: '10px',
            fontSize: '16px',
            width: '300px',
          }}
        />
        <button type="submit" style={{
          padding: '10px',
          fontSize: '16px',
          marginLeft: '10px'
        }}>
          Search
        </button>
      </form>

      {/* Basic Stats Section */}
      <section style={{ marginTop: '20px' }}>
        <h2>Rank Distribution</h2>
        {/* Insert Rank Distribution Data Here */}
      </section>

      <section style={{ marginTop: '20px' }}>
        <h2>Total Players: 0</h2>
        <h2>Total Replays: 0</h2>
        {/* Replace 0 with actual data */}
      </section>
    </div>
  );
}
