'use client';
import React, { useState } from 'react';
import PromptBar from './components/PromptBar';

interface Recommendation {
  id: string;
  albumArt: string;
  artist: string;
  album: string;
  year: string;
  genre: string;
}

const mockRecommendations = async (prompt: string, model: string): Promise<Recommendation[]> => {
  // Simulate API delay
  await new Promise((res) => setTimeout(res, 800));
  return [
    {
      id: '1',
      albumArt: 'https://via.placeholder.com/60',
      artist: 'Artist One',
      album: 'Album One',
      year: '2022',
      genre: 'Pop',
    },
    {
      id: '2',
      albumArt: 'https://via.placeholder.com/60',
      artist: 'Artist Two',
      album: 'Album Two',
      year: '2021',
      genre: 'Rock',
    },
    {
      id: '3',
      albumArt: 'https://via.placeholder.com/60',
      artist: 'Artist Three',
      album: 'Album Three',
      year: '2020',
      genre: 'Jazz',
    },
  ];
};

function RecommendationsScreen({ prompt, model, onBack }: { prompt: string; model: string; onBack: () => void }) {
  const [results, setResults] = React.useState<Recommendation[] | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    mockRecommendations(prompt, model).then((data) => {
      setResults(data);
      setLoading(false);
    });
  }, [prompt, model]);

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', background: 'rgba(255,255,255,0.8)', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
      <button onClick={onBack} style={{ marginBottom: 16, color: '#222', background: 'none', border: '1px solid #ccc', borderRadius: 8, padding: '4px 12px', cursor: 'pointer' }}>← Back</button>
      <h2 style={{ color: '#222', marginBottom: 16 }}>Recommendations</h2>
      {loading ? (
        <div>Loading recommendations…</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#222' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: 8, textAlign: 'left' }}>Album Art</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Artist</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Album</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Year</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Genre</th>
            </tr>
          </thead>
          <tbody>
            {results && results.map((rec) => (
              <tr key={rec.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: 8 }}><img src={rec.albumArt} alt={rec.album} width={60} height={60} style={{ borderRadius: 8 }} /></td>
                <td style={{ padding: 8 }}>{rec.artist}</td>
                <td style={{ padding: 8 }}>{rec.album}</td>
                <td style={{ padding: 8 }}>{rec.year}</td>
                <td style={{ padding: 8 }}>{rec.genre}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default function Page() {
  const [screen, setScreen] = useState<'prompt' | 'recommendations'>('prompt');
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('');

  const handlePromptSubmit = (promptValue: string, modelValue: string) => {
    setPrompt(promptValue);
    setModel(modelValue);
    setScreen('recommendations');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {screen === 'prompt' ? (
        <PromptBar onSubmit={handlePromptSubmit} />
      ) : (
        <RecommendationsScreen prompt={prompt} model={model} onBack={() => setScreen('prompt')} />
      )}
    </div>
  );
}
