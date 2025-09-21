'use client';
import React, { useState, useEffect } from 'react';

interface PromptBarProps {
  defaultModel?: string;
  onSubmit?: (prompt: string, model: string) => void;
}

const PromptBar: React.FC<PromptBarProps> = ({ defaultModel, onSubmit }) => {
  const [prompt, setPrompt] = useState('');
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [modelsLoading, setModelsLoading] = useState(true);
  const [modelsError, setModelsError] = useState<string | null>(null);

  useEffect(() => {
    setModelsLoading(true);
    setModelsError(null);
    fetch('/api/models')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch models');
        return res.json();
      })
      .then((data) => {
        setModels(data.models);
        setSelectedModel(defaultModel ?? data.models[0] ?? '');
        setModelsLoading(false);
      })
      .catch(() => {
        setModelsError('Could not load models');
        setModelsLoading(false);
      });
  }, [defaultModel]);

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => setPrompt(e.target.value);
  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedModel(e.target.value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !selectedModel) return;
    setIsLoading(true);
    onSubmit?.(prompt, selectedModel);
    setIsLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.5)',
        borderRadius: '999px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        border: '1px solid rgba(164, 164, 164, 0.2)',
        padding: '0.5rem',
        maxWidth: 600,
        margin: '2rem auto',
        width: '100%',
        gap: '0.5rem',
      }}
      aria-label="Music prompt form"
    >
      <label htmlFor="prompt" style={{ display: 'none' }}>Music prompt</label>
      <input
        id="prompt"
        type="text"
        value={prompt}
        onChange={handlePromptChange}
        placeholder="Describe the music you want to hear…"
        aria-label="Music prompt"
        disabled={modelsLoading || !!modelsError}
        style={{ flex: 1, minWidth: 0, color: '#222' }}
        autoComplete="off"
      />
      <label htmlFor="model-select" style={{ display: 'none' }}>Model</label>
      <select
        id="model-select"
        value={selectedModel}
        onChange={handleModelChange}
        disabled={modelsLoading || !!modelsError}
        aria-label="Select model"
        style={{ minWidth: 120, color: '#222' }}
      >
        {modelsLoading && <option>Loading…</option>}
        {modelsError && <option disabled>Error</option>}
        {!modelsLoading && !modelsError && models.map((model) => (
          <option key={model} value={model}>{model}</option>
        ))}
      </select>
      <button
        type="submit"
        disabled={!prompt.trim() || isLoading || modelsLoading || !!modelsError}
        aria-label="Submit prompt"
        style={{ minWidth: 44, minHeight: 44, color: '#222' }}
      >
        {isLoading ? '⏳' : '→'}
      </button>
    </form>
  );
};

export default PromptBar;
