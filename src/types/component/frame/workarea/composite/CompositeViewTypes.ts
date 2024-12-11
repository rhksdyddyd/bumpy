import React from 'react';

export interface ICompositeViewProps {
  firstChild: React.ReactNode;
  secondChild: React.ReactNode;
  ratio: number; // 0 to 100
  flexDirection: 'row' | 'column';
}
