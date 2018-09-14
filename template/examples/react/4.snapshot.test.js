import React from 'react';
import Hello from './Hello';
import renderer from 'react-test-renderer';

test.only('Link changes the class when hovered', () => {
  const component = renderer.create(<Hello/>);
  let dom = component.toJSON();
  expect(dom).toMatchSnapshot();

  // re-rendering
  dom = component.toJSON();
  expect(dom).toMatchSnapshot();

  dom.props.onClick();
  dom = component.toJSON();
  expect(dom).toMatchSnapshot();
});
