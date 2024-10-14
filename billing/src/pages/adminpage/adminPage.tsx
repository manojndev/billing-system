// src/CustomPage.tsx
import React from 'react';

const adminPage: React.FC = () => {
  return (
    <div>
      <h1>Welcome to the Custom Page</h1>
      <p>This is some static HTML content displayed in the React TypeScript app.</p>
      <div>
        <h2>Section Title</h2>
        <p>This is a paragraph inside a section.</p>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
      </div>
    </div>
  );
};

export default adminPage;
