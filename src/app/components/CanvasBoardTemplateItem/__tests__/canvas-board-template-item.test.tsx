import React from 'react';
import '@testing-library/jest-dom';
import { render, RenderResult, fireEvent } from '@testing-library/react';
import { CanvasBoardTemplateItem } from '..';
let documentBody: RenderResult;

describe('<CanvasBoardTemplateItem />', () => {
  beforeEach(() => {
    documentBody = render(
      <CanvasBoardTemplateItem
        board={{
          path: '',
          createdUserId: '',
          id: '',
          createdAt: '',
          categoryId: '',
          data: '',
          imageId: '',
          name: 'Canvas Item',
          orgId: '',
          users: [],
        }}
        loading={false}
        onSelect={jest.fn(id => id)}
      />,
    );
  });
  it('CanvasBoardTemplateItem Render Test', () => {
    expect(documentBody.getByText('Canvas Item')).toBeInTheDocument();
  });
  it(' Click Event', () => {
    const node = documentBody.getByText('Select');
    fireEvent.click(node);
  });
});
