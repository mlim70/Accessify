'use client';

import { useSession } from 'next-auth/react';
import { useState, FormEvent } from 'react';

export default function SavePreferences() {
  const { data: session } = useSession();
  const [preferences, setPreferences] = useState({
    colorBlindFilter: 'none',
    preferredFont: 'default',
    dyslexia: 'none',
    language: 'en',
    additionalInfo: '',
    fontChoice: 'Arial'
  });
  const [status, setStatus] = useState<string>('');

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!session?.user?.email) {
      console.error('User email not found in session.');
      setStatus('User not logged in.');
      return;
    }
    try {
      const response = await fetch('http://localhost:3001/api/input', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userEmail: session.user.email,
          preferences: preferences
        })
      });
      const data = await response.json();
      console.log('Preferences saved to backend:', data);
      setStatus('Preferences saved successfully!');
    } catch (error) {
      console.error('Error saving preferences to backend:', error);
      setStatus('Error saving preferences.');
    }
  };

  return (
    <div>
      <h2>Save Your Preferences</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="colorBlindFilter">Color Blind Filter:</label>
          <select
            id="colorBlindFilter"
            name="colorBlindFilter"
            value={preferences.colorBlindFilter}
            onChange={handleChange}
          >
            <option value="none">None</option>
            <option value="protanopia">Protanopia</option>
            <option value="deuteranopia">Deuteranopia</option>
            <option value="tritanopia">Tritanopia</option>
            <option value="complete">Complete</option>
          </select>
        </div>

        <div>
          <label htmlFor="preferredFont">Preferred Font:</label>
          <select
            id="preferredFont"
            name="preferredFont"
            value={preferences.preferredFont}
            onChange={handleChange}
          >
            <option value="default">Default</option>
            <option value="OpenDyslexic">OpenDyslexic</option>
            <option value="Dyslexie">Dyslexie</option>
            <option value="Lexend Deca">Lexend Deca</option>
          </select>
        </div>

        <div>
          <label htmlFor="dyslexia">Dyslexia Preference:</label>
          <select
            id="dyslexia"
            name="dyslexia"
            value={preferences.dyslexia}
            onChange={handleChange}
          >
            <option value="none">None</option>
            <option value="visual">Visual</option>
            <option value="surface">Surface</option>
            <option value="directional">Directional</option>
            <option value="attentional">Attentional</option>
          </select>
        </div>

        <div>
          <label htmlFor="language">Preferred Language:</label>
          <select
            id="language"
            name="language"
            value={preferences.language}
            onChange={handleChange}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
            <option value="pt">Portuguese</option>
            <option value="ru">Russian</option>
            <option value="zh">Chinese</option>
            <option value="ja">Japanese</option>
            <option value="ko">Korean</option>
          </select>
        </div>

        <div>
          <label htmlFor="fontChoice">Font Choice:</label>
          <select
            id="fontChoice"
            name="fontChoice"
            value={preferences.fontChoice}
            onChange={handleChange}
          >
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Verdana">Verdana</option>
            <option value="Georgia">Georgia</option>
            <option value="Courier New">Courier New</option>
            <option value="Tahoma">Tahoma</option>
            <option value="Trebuchet MS">Trebuchet MS</option>
            <option value="Impact">Impact</option>
            <option value="Comic Sans MS">Comic Sans MS</option>
          </select>
        </div>

        <div>
          <label htmlFor="additionalInfo">Additional Information:</label>
          <textarea
            id="additionalInfo"
            name="additionalInfo"
            value={preferences.additionalInfo}
            onChange={handleChange}
            placeholder="Enter any additional information about your accessibility needs..."
            rows={4}
          />
        </div>

        <button type="submit">Save Preferences</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
}
